import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export const JENNET_NAME = 'Jennet';
export const JENNET_TITLE = 'GBV Support Specialist';

const GREETING =
  "Hello 🌸 I'm Jennet, your GBV Support Specialist. I'm here to help with any questions about gender-based violence, whether that's understanding your rights, finding help near you, or just talking through what you're experiencing. You're safe here. What can I help you with?";

const SUGGESTIONS = [
  'What is a protection order?',
  'Is emotional abuse illegal?',
  'I need a shelter tonight',
  'What are my rights after assault?',
];

export default function JennetChat({ compact = false }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [recording, setRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ageGroup, setAgeGroup] = useState(null);
  const [speakOn, setSpeakOn] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const windowRef = useRef(null);
  const recognitionRef = useRef(null);

  // Same age_group field used across the rest of the site (homepage,
  // rights page), so Jennet's tone matches whatever the person already
  // sees everywhere else, rather than being the one inconsistent part.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAgeGroup(data.user?.user_metadata?.age_group ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAgeGroup(session?.user?.user_metadata?.age_group ?? null);
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    setTtsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    // Fills the text box as you speak rather than sending automatically,
    // so you can still see and edit what it heard before anything sends,
    // same as if you'd typed it yourself.
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setRecording(true);
    } catch {
      setRecording(false);
    }
  };

  const speak = (text) => {
    if (!ttsSupported || !speakOn) return;
    window.speechSynthesis.cancel(); // don't stack replies if one's already talking
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeak = () => {
    if (speakOn) window.speechSynthesis.cancel();
    setSpeakOn((v) => !v);
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location is not available on this device.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '📍 Got it, I can see your location now, ask me about shelters or facilities near you whenever you like.' },
        ]);
      },
      () => {
        setLocationError('Could not get your location. You can still ask, just without distances.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    const el = windowRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setShowSuggestions(false);

    const userMessage = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          location: location || undefined,
          ageGroup: ageGroup || undefined,
        }),
      });

      if (res.status === 429) {
        setMessages([
          ...nextMessages,
          {
            role: 'assistant',
            content: "I'm getting a lot of messages right now, please wait a few minutes before sending another.",
          },
        ]);
        return;
      }

      const data = await res.json();

      if (data.reply) {
        setMessages([
          ...nextMessages,
          { role: 'assistant', content: data.reply, actions: data.actions || [] },
        ]);
        speak(data.reply);
      } else {
        setMessages([
          ...nextMessages,
          {
            role: 'assistant',
            content:
              "I'm having trouble responding right now. If this is urgent, please call the GBV Command Centre on 0800 428 428.",
          },
        ]);
      }
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting right now. If this is urgent, please call the GBV Command Centre on 0800 428 428.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => send(input);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`jennet-chat ${compact ? 'compact' : ''}`}>
      <div className="chat-header">
        <div className="chat-avatar">🌸</div>
        <div className="chat-header-info">
          <p className="chat-name">{JENNET_NAME}</p>
          <p className="chat-status">Online · {JENNET_TITLE}</p>
        </div>
        {ttsSupported && (
          <button
            type="button"
            className={`chat-tts-toggle ${speakOn ? 'on' : ''}`}
            onClick={toggleSpeak}
            aria-label={speakOn ? 'Turn off spoken replies' : 'Turn on spoken replies'}
            title={speakOn ? 'Replies are read aloud, tap to turn off' : 'Tap to have replies read aloud'}
          >
            {speakOn ? '🔊' : '🔇'}
          </button>
        )}
      </div>

      <div className="chat-window" ref={windowRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-bot'}`}>
            <div className="msg-bubble">{m.content}</div>
            {m.actions?.length > 0 && (
              <div className="msg-actions">
                {m.actions.map((a, j) =>
                  a.type === 'tel' ? (
                    <a key={j} href={`tel:${a.value}`} className="msg-action-chip">
                      📞 {a.label}
                    </a>
                  ) : (
                    <Link key={j} href={a.value} className="msg-action-chip">
                      🗺️ {a.label}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="msg msg-bot">
            <div className="msg-bubble typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      {showSuggestions && (
        <div className="chat-suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="suggestion-chip" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {!location && (
        <div className="location-row">
          <button className="location-btn" onClick={shareLocation} disabled={locating}>
            {locating ? 'Locating…' : '📍 Share my location for nearby shelters'}
          </button>
          {locationError && <p className="location-error">{locationError}</p>}
        </div>
      )}

      <div className="chat-input-row">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Jennet anything about GBV…"
        />
        {speechSupported && (
          <button
            type="button"
            className={`chat-mic ${recording ? 'recording' : ''}`}
            onClick={toggleRecording}
            aria-label={recording ? 'Stop recording' : 'Speak your message'}
          >
            {recording ? '⏹' : '🎤'}
          </button>
        )}
        <button
          className="chat-send"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          ↑
        </button>
      </div>

      <style jsx>{`
        .jennet-chat {
          background: white;
          border-radius: 20px;
          border: 1px solid var(--sand);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(13, 10, 11, 0.08);
          display: flex;
          flex-direction: column;
          height: 600px;
          width: 100%;
        }
        .compact {
          height: 460px;
        }

        .chat-header {
          background: var(--ink);
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .chat-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--rose) 0%, var(--rose-deep) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .chat-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: white;
        }
        .chat-status {
          font-size: 0.72rem;
          color: var(--teal-light);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .chat-status::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--teal-light);
        }
        .chat-tts-toggle {
          margin-left: auto;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 0.95rem;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-tts-toggle.on {
          background: var(--rose);
          border-color: var(--rose);
        }

        .msg-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }
        .msg-action-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 20px;
          background: white;
          border: 1px solid var(--rose);
          color: var(--rose-deep);
          font-size: 0.76rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
        }
        .msg-action-chip:hover {
          background: var(--rose);
          color: white;
        }

        .chat-window {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .msg {
          max-width: 85%;
        }
        .msg-bot {
          align-self: flex-start;
        }
        .msg-user {
          align-self: flex-end;
        }
        .msg-bubble {
          padding: 12px 18px;
          border-radius: 16px;
          font-size: 0.88rem;
          line-height: 1.6;
        }
        .msg-bot .msg-bubble {
          background: var(--warm);
          color: var(--ink);
          border-bottom-left-radius: 4px;
          border: 1px solid var(--sand);
        }
        .msg-user .msg-bubble {
          background: var(--rose);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .typing-indicator {
          display: flex;
          gap: 5px;
          align-items: center;
          padding: 14px 18px;
        }
        .typing-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--muted);
          animation: typingBounce 1.2s infinite;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typingBounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }

        .chat-suggestions {
          padding: 12px 24px;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          border-top: 1px solid var(--sand);
          background: var(--cream, #faf6f4);
          flex-shrink: 0;
        }
        .chat-suggestions::-webkit-scrollbar {
          display: none;
        }
        .suggestion-chip {
          white-space: nowrap;
          padding: 8px 16px;
          border-radius: 20px;
          background: white;
          border: 1px solid var(--sand);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--ink);
          cursor: pointer;
          flex-shrink: 0;
        }
        .suggestion-chip:hover {
          border-color: var(--rose);
          color: var(--rose);
        }

        .location-row {
          padding: 0 24px 12px;
          flex-shrink: 0;
        }
        .location-btn {
          width: 100%;
          padding: 9px 14px;
          border-radius: 10px;
          background: var(--warm);
          border: 1px dashed var(--sand);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--rose-deep);
          cursor: pointer;
        }
        .location-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .location-error {
          font-size: 0.72rem;
          color: var(--muted);
          margin-top: 6px;
        }

        .chat-input-row {
          padding: 16px 20px;
          border-top: 1px solid var(--sand);
          display: flex;
          gap: 10px;
          align-items: center;
          flex-shrink: 0;
        }
        .chat-input {
          flex: 1;
          border: 1.5px solid var(--sand);
          border-radius: 10px;
          padding: 11px 16px;
          font-family: inherit;
          font-size: 0.88rem;
        }
        .chat-send {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--rose);
          color: white;
          border: none;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .chat-mic {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          color: var(--rose-deep);
          border: 1.5px solid var(--sand);
          font-size: 1rem;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-mic.recording {
          background: var(--rose);
          color: white;
          border-color: var(--rose);
          animation: micPulse 1.4s infinite;
        }
        @keyframes micPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(214, 51, 108, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(214, 51, 108, 0);
          }
        }
      `}</style>
    </div>
  );
}
