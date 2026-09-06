// pages/api/certificates/verify.js
// PUBLIC API - No authentication required
// Allows anyone to verify a certificate by its ID

import { createClient } from '@supabase/supabase-js';
import { ADVANCED_COURSES } from '../../lib/allyCourseData';

export default async function handler(req, res) {
  const { certificateId } = req.query;

  if (!certificateId) {
    return res.status(400).json({ error: 'Certificate ID is required' });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Query the certificates table
    const { data: cert, error } = await supabase
      .from('certificates')
      .select('id, user_id, course_id, certificate_id, final_score, issued_at')
      .eq('certificate_id', certificateId)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!cert) {
      return res.status(404).json({ 
        error: 'Certificate not found',
        valid: false
      });
    }

    // Get course title
    const course = ADVANCED_COURSES.find(c => c.id === cert.course_id);
    if (!course) {
      return res.status(404).json({ 
        error: 'Course not found',
        valid: false
      });
    }

    // Get learner name (without exposing email)
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(
      cert.user_id
    );

    let learnerName = 'SafeHaven Learner';
    if (!userError && user?.user_metadata?.full_name) {
      learnerName = user.user_metadata.full_name;
    }

    // Format issued date
    const issuedDate = new Date(cert.issued_at).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return res.status(200).json({
      valid: true,
      certificate: {
        certificateId: cert.certificate_id,
        learnerName,
        courseTitle: course.title,
        courseSubtitle: course.subtitle,
        score: cert.final_score,
        issuedDate,
      }
    });

  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ error: 'Server error during verification' });
  }
}
