const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Shimmer reads as warm and calm, a reasonable fit for a support
// assistant, not upbeat or robotic-sounding. Other options if you want
// to try a different feel: 'nova' (friendly), 'sage' (measured/gentle),
// 'coral' (soft). Swap the string below to change it, no other code
// needs to change.
const VOICE = 'shimmer';

// Same lightweight per-IP limiter pattern as /api/chat, separate counter
// since this is a different endpoint with its own real per-use cost
// (unlike chat, which has a generous free tier, TTS is paid from the
// first character).
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return entry.count <= RATE_LIMIT_MAX;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests, please wait a few minutes.' });
  }

  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing text' });
  }

  // OpenAI's TTS endpoint caps input length; Jennet's replies are capped
  // well under this already (max_completion_tokens: 500 in chat.js), but
  // trim defensively in case something unusually long slips through.
  const trimmedText = text.slice(0, 4000);

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: VOICE,
        input: trimmedText,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI TTS error:', errText);
      return res.status(500).json({ error: 'Could not generate speech' });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(audioBuffer);
  } catch (err) {
    console.error('Speak API error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
