import React, { useState, useEffect, useRef } from 'react';
import { GeminiLiveClient } from '../utils/geminiLiveClient';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import './VoiceTutorModal.css';

const TUTORS = {
  en: {
    id: 'emma',
    name: 'Emma',
    country: '🇺🇸',
    flag: '🇺🇸',
    lang: 'English',
    voice: 'Kore',
    model: 'models/gemini-3.8-live',
    description: 'Дружелюбный репетитор английского из Калифорнии',
    systemInstruction: `You are Emma, an enthusiastic, patient, and warm American English tutor speaking with a Russian native student.
Your goal is to have a natural spoken conversation.
Rules:
1. Speak clearly, concisely, and enthusiastically. Keep turns short (1-2 sentences) so the student has space to speak.
2. Adapt to A1-A2 vocabulary unless the student demonstrates advanced fluency.
3. If the student makes a grammatical or vocabulary error, gently mention the correct phrasing and encourage them to try again.
4. You can explain difficult grammar tips or translations briefly in Russian if needed, but speak mostly English.
5. Ask fun questions about their day, hobbies, travel, or food to keep the conversation flowing.`,
  },
  de: {
    id: 'lukas',
    name: 'Lukas',
    country: '🇩🇪',
    flag: '🇩🇪',
    lang: 'Deutsch',
    voice: 'Puck',
    model: 'models/gemini-3.8-live',
    description: 'Носитель немецкого языка из Берлина',
    systemInstruction: `Du bist Lukas, ein freundlicher und geduldiger Deutschlehrer für russischsprachige Schüler.
Dein Ziel ist ein natürliches Gespräch.
Regeln:
1. Sprich klar, verständlich und halte deine Antworten kurz (1-2 Sätze), damit der Schüler sprechen kann.
2. Verwende einfaches A1-A2 Vokabular.
3. Wenn der Schüler einen Fehler macht (z.B. falscher Artikel der/die/das), korrigiere ihn freundlich und lass ihn den Satz wiederholen.
4. Du kannst schwierige Regeln oder Wörter kurz auf Russisch erklären, sprich aber hauptsächlich Deutsch.
5. Frage nach dem Alltag, Hobbys, Essen oder Reisen.`,
  },
};

export default function VoiceTutorModal({ isOpen, onClose, currentLanguage = 'en' }) {
  const [selectedLang, setSelectedLang] = useState(currentLanguage === 'de' ? 'de' : 'en');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('linguo_gemini_key') || '');
  const [inputKey, setInputKey] = useState('');
  const [status, setStatus] = useState('disconnected'); // 'connecting' | 'connected' | 'disconnected'
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcripts, setTranscripts] = useState([]);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const liveClientRef = useRef(null);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  const tutor = TUTORS[selectedLang] || TUTORS.en;

  useEffect(() => {
    setSelectedLang(currentLanguage === 'de' ? 'de' : 'en');
  }, [currentLanguage]);

  // Session duration timer
  useEffect(() => {
    if (status === 'connected') {
      timerRef.current = setInterval(() => {
        setSessionSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Auto-scroll transcripts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Cleanup on modal close
  useEffect(() => {
    if (!isOpen && liveClientRef.current) {
      handleEndCall();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = (e) => {
    e.preventDefault();
    const trimmed = inputKey.trim();
    if (!trimmed) return;
    localStorage.setItem('linguo_gemini_key', trimmed);
    setApiKey(trimmed);
    haptics.success();
  };

  const handleStartCall = async () => {
    setErrorMsg('');
    haptics.medium();

    try {
      const client = new GeminiLiveClient({
        apiKey,
        model: tutor.model,
        voiceName: tutor.voice,
        systemInstruction: tutor.systemInstruction,
        onStatusChange: (s) => setStatus(s),
        onTranscript: (t) => {
          setTranscripts((prev) => [...prev, t]);
        },
        onAudioLevel: (lvl) => setAudioLevel(lvl),
        onError: (err) => {
          setErrorMsg(err);
          haptics.error();
        },
      });

      liveClientRef.current = client;
      await client.connect();
      try {
        sounds.playTap?.();
      } catch (_) {}
    } catch (err) {
      setErrorMsg(err.message || 'Ошибка запуска сессии');
      haptics.error();
    }
  };

  const handleEndCall = () => {
    if (liveClientRef.current) {
      liveClientRef.current.disconnect();
      liveClientRef.current = null;
    }
    setStatus('disconnected');
    setAudioLevel(0);
    haptics.light();

    if (sessionSeconds > 10) {
      const earnedXP = Math.min(100, Math.round(sessionSeconds / 2));
      gamification.addXP(earnedXP);
      sounds.playComplete();
      haptics.celebrate();
    }
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="tutor-overlay" onClick={onClose}>
      <div className="tutor-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="tutor-header">
          <div className="tutor-brand">
            <span className="tutor-sparkle">✨</span>
            <div>
              <h3>Linguo Live Tutor</h3>
              <p className="tutor-sub">Живой разговорный ИИ на Google Gemini 2.0</p>
            </div>
          </div>
          <button className="tutor-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* API Key Onboarding if missing */}
        {!apiKey ? (
          <div className="tutor-key-onboarding">
            <div className="tutor-key-icon">🔑</div>
            <h4>Подключение Google Gemini Live</h4>
            <p className="tutor-key-desc">
              Для живого разговора с ИИ в реальном времени требуется бесплатный ключ Gemini API.
            </p>

            <div className="tutor-key-steps">
              <div className="step-row">
                <span className="step-num">1</span>
                <span>Откройте <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio (бесплатно)</a></span>
              </div>
              <div className="step-row">
                <span className="step-num">2</span>
                <span>Нажмите кнопку «Create API Key» и скопируйте его</span>
              </div>
              <div className="step-row">
                <span className="step-num">3</span>
                <span>Вставьте ключ в поле ниже — он сохранится в вашем браузере</span>
              </div>
            </div>

            <form onSubmit={handleSaveKey} className="tutor-key-form">
              <input
                type="password"
                placeholder="Вставьте AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                required
              />
              <button type="submit" className="tutor-key-btn">Сохранить и начать</button>
            </form>
          </div>
        ) : (
          <div className="tutor-call-container">
            {/* Tutor Selector (When not active) */}
            {status === 'disconnected' && (
              <div className="tutor-picker-bar">
                <button
                  className={`tutor-tab-btn ${selectedLang === 'en' ? 'active' : ''}`}
                  onClick={() => setSelectedLang('en')}
                >
                  🇺🇸 Emma (English)
                </button>
                <button
                  className={`tutor-tab-btn ${selectedLang === 'de' ? 'active' : ''}`}
                  onClick={() => setSelectedLang('de')}
                >
                  🇩🇪 Lukas (Deutsch)
                </button>
              </div>
            )}

            {/* Visualizer & Avatar Area */}
            <div className="tutor-avatar-stage">
              <div className={`tutor-orb ${status === 'connected' ? 'active' : ''}`} style={{ transform: `scale(${1 + (audioLevel / 100) * 0.4})` }}>
                <span className="tutor-avatar-flag">{tutor.flag}</span>
              </div>

              <h2 className="tutor-name">{tutor.name}</h2>
              <p className="tutor-role">{tutor.description}</p>

              {status === 'connected' ? (
                <div className="tutor-status-badge live">
                  <span className="live-dot" /> В эфире • {formatTime(sessionSeconds)}
                </div>
              ) : status === 'connecting' ? (
                <div className="tutor-status-badge connecting">Подключение к Gemini Live...</div>
              ) : (
                <div className="tutor-status-badge ready">Готов к разговору</div>
              )}
            </div>

            {errorMsg && (
              <div className="tutor-error-banner">
                <p>{errorMsg}</p>
                <button
                  className="tutor-error-reset-btn"
                  onClick={() => {
                    localStorage.removeItem('linguo_gemini_key');
                    setApiKey('');
                    setErrorMsg('');
                  }}
                >
                  🔑 Вставить новый ключ API
                </button>
              </div>
            )}

            {/* Live Subtitles & Transcripts */}
            <div className="tutor-transcript-box" ref={scrollRef}>
              {transcripts.length === 0 ? (
                <div className="transcript-placeholder">
                  {status === 'connected'
                    ? 'Скажите что-нибудь в микрофон, например «Hello Emma!»...'
                    : 'Нажмите «Начать разговор», чтобы поговорить с преподавателем'}
                </div>
              ) : (
                transcripts.map((msg, i) => (
                  <div key={i} className={`transcript-bubble ${msg.role}`}>
                    <span className="bubble-author">{msg.role === 'user' ? 'Вы' : tutor.name}:</span>
                    <span className="bubble-content">{msg.text}</span>
                  </div>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div className="tutor-call-controls">
              {status === 'disconnected' ? (
                <button className="tutor-start-call-btn" onClick={handleStartCall}>
                  <span className="call-icon">📞</span> Начать разговор с {tutor.name}
                </button>
              ) : (
                <div className="tutor-active-controls">
                  <button
                    className={`tutor-mute-btn ${isMuted ? 'muted' : ''}`}
                    onClick={() => setIsMuted(!isMuted)}
                    title="Микрофон"
                  >
                    {isMuted ? '🔇' : '🎙️'}
                  </button>
                  <button className="tutor-hangup-btn" onClick={handleEndCall}>
                    ✕ Завершить звонок
                  </button>
                </div>
              )}

              <button
                className="tutor-reset-key-link"
                onClick={() => {
                  localStorage.removeItem('linguo_gemini_key');
                  setApiKey('');
                }}
              >
                Изменить API-ключ Gemini
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
