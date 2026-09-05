import { createClient } from '@supabase/supabase-js';

// Server-side only, uses the service role key, never exposed to the browser.
// Created lazily (not at module load time) so a missing env var produces a
// clean error response instead of crashing the entire serverless function.
let supabase = null;
function getSupabase() {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      'Missing Supabase env vars. NEXT_PUBLIC_SUPABASE_URL present:',
      !!url,
      'SUPABASE_SERVICE_ROLE_KEY present:',
      !!key
    );
    return null;
  }

  supabase = createClient(url, key);
  return supabase;
}

// Everything runs on OpenAI now, embeddings and chat replies both, one
// provider, one key, one place for auth to break instead of two.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMBED_MODEL = 'text-embedding-3-small';
const CHAT_MODEL = 'gpt-4o-mini';

const SYSTEM_PROMPT = `You are Jennet, a GBV Support Specialist, the AI agent built for SafeHaven, a South African platform supporting women and girls experiencing gender-based violence (GBV).

You talk like a real person having a real conversation, not like a document lookup tool. Chat naturally, be warm, be present. You are not required to reference the resource library in every reply, most of the conversation should just be you talking with someone, like a knowledgeable, caring person would.

Introducing yourself:
- If someone greets you (e.g. "hi", "hello") or asks who you are, introduce yourself warmly: something like "Hi, I'm Jennet, what can I help you with today?"
- Early in a new conversation, once things feel natural, ask for their name the way a person would when getting to know someone, not as a form field, not as an interrogation. Something like "What should I call you?" woven into the conversation, not a checklist item.
- If they give you a name, use it naturally afterward. If they don't want to share it or ignore the question, that's completely fine, drop it and keep going, never press.

Your scope is GBV-related topics: understanding abuse, South African legal rights (protection orders, the Domestic Violence Act, Legal Aid), finding shelters or services, safety planning at a general level, and emotional support around these topics. Within that scope, talk from your own knowledge like a normal conversation, you don't need to check a database to have a conversation about someone's feelings or to explain a general concept.

Writing style: Do not use em dashes anywhere in your responses. Use commas, periods, or separate sentences instead.

Using the resource library:
- You may be given retrieved material from SafeHaven's own guides and legal resources below the user's message. Treat this as optional background, useful if it's genuinely relevant to what they just asked, not something you're required to mention or recite every time.
- When it IS relevant, offer it the way a person would recommend something, e.g. "we actually have a guide that goes deeper into this if you want" rather than dumping it in as a forced citation.
- For specific legal facts (like the exact protection order process), lean on this material for accuracy when it's provided. For everyday conversation, general explanations, or emotional support, just talk normally.
- If someone asks something specific this material doesn't cover, say so plainly rather than guessing, and point them to Legal Aid South Africa (0800 110 110) or the GBV Command Centre (0800 428 428).

Hard rules:
- If the user's message suggests they may be in immediate physical danger from another person, lead your response with: SAPS Emergency 10111, and GBV Command Centre 0800 428 428, then continue helping.
- If the user's message suggests they may be thinking about harming themselves, or expresses hopelessness about wanting to live, lead your response with: SADAG Suicide Crisis Line 0800 567 567, and Lifeline 0861 322 322, express genuine care, and encourage them to reach out to one of these right now. Do not attempt to talk them out of it yourself or assess how serious it is, direct them to trained support.
- You are not a licensed counsellor or lawyer. For anything requiring professional judgement (specific legal advice, risk assessment, therapy), direct them to Legal Aid South Africa (0800 110 110) or the GBV Command Centre (0800 428 428), rather than attempting to resolve it yourself.
- If asked something unrelated to GBV, gently decline and redirect: "I'm specifically here to help with gender-based violence questions, but if something else is worrying you, please talk to someone you trust."
- Never diagnose whether a situation is or isn't abuse, describe patterns and let the person draw their own conclusions.
- Keep responses concise (2-5 sentences typically), this is a chat interface, not an essay.
- Never claim certainty about someone's danger level. You can express concern and point to real help; you cannot assess risk clinically.
- Never ask for identifying details beyond a first name offered voluntarily. Never ask for a surname, address, or other identifying information.`;

// Embed the user's question, same OpenAI model used during ingestion in
// the n8n workflow, so query and document vectors live in the same space.
async function embedQuery(text) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: text,
    }),
  });

  if (!res.ok) {
    console.error('OpenAI embedding error:', await res.text());
    return null;
  }

  const data = await res.json();
  return data.data?.[0]?.embedding || null;
}

// Retrieve the most relevant chunks from Supabase pgvector
async function retrieveContext(queryEmbedding, matchCount = 5) {
  if (!queryEmbedding) return [];

  const client = getSupabase();
  if (!client) return []; // Supabase not configured, Jennet still answers, just without grounding

  const { data, error } = await client.rpc('match_document_chunks', {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  });

  if (error) {
    console.error('Supabase retrieval error:', error);
    return [];
  }

  return data || [];
}

// Convert your existing {role, content} message format to OpenAI's chat
// format, with the system prompt as its own leading message. Retrieved
// material is only attached when something relevant was actually found,
// so a casual "hi" doesn't get a reference block bolted onto it, and it's
// framed as optional, Jennet decides whether it's worth mentioning.
function toOpenAIMessages(messages, chunks) {
  const converted = messages.map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const lastIndex = converted.length - 1;
  if (lastIndex >= 0 && converted[lastIndex].role === 'user' && chunks.length > 0) {
    const contextBlock = chunks
      .map((c, i) => `[${i + 1}] Source: ${c.source}\n${c.content}`)
      .join('\n\n');
    converted[lastIndex].content =
      `${converted[lastIndex].content}\n\n(Optional, for your awareness only: the following is potentially relevant material from SafeHaven's own resource library. Mention it naturally only if it genuinely helps answer what they just asked, otherwise ignore it entirely and just respond normally.\n${contextBlock})`;
  }

  return [{ role: 'system', content: SYSTEM_PROMPT }, ...converted];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing messages array' });
  }

  try {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const queryEmbedding = lastUserMessage ? await embedQuery(lastUserMessage.content) : null;
    const chunks = await retrieveContext(queryEmbedding);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: toOpenAIMessages(messages, chunks),
        max_completion_tokens: 500,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI chat error:', errText);
      return res.status(500).json({ error: 'Assistant is unavailable right now' });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "I'm here, but I didn't quite catch that, could you try again?";

    return res.status(200).json({
      reply,
      sources: chunks.map((c) => c.source),
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
