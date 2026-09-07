// pages/api/change-password.js
// Handle password changes for authenticated users

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { newPassword, token } = req.body;

  if (!newPassword || !token) {
    return res.status(400).json({ error: 'Missing password or token' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Create admin client with service role key to get user ID from token
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get user from token
    const userSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: userError } = await userSupabase.auth.getUser();
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Use admin API to update password
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(user.id, {
      password: newPassword
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(400).json({ error: updateError.message || 'Failed to update password' });
    }

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
