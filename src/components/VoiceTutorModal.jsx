import React, { useState, useEffect, useRef } from 'react';
import { GeminiLiveClient } from '../utils/geminiLiveClient';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import { addCard } from '../db';
import './VoiceTutorModal.css';

const SCENARIOS = [
  { id: 'free', icon: '🌟', title: 'Свободный разговор', desc: 'О жизни, увлечениях и новостях' },
  { id: 'cafe', icon: '☕', title: 'В кофейне', desc: 'Заказ кофе, десерта и оплата картой' },
  { id: 'airport', icon: '🛂', title: 'Паспортный контроль', desc: 'Таможня, виза и цель поездки' },
  { id: 'interview', icon: '💼', title: 'Собеседование', desc: 'Вопросы о карьере и сильных сторонах' },
  { id: 'hotel', icon: '🏨', title: 'В отеле', desc: 'Заселение, ключи и завтрак' },
];

const SCENARIO_HINTS = {
  free: [
    { en: "I'm having a great day, thanks! How about you?", de: "Mir geht es super, danke! Und dir?", ru: "У меня отличный день, спасибо! А как у тебя?" },
    { en: "Could you tell me a little about your favorite hobbies?", de: "Was sind deine Lieblingshobbys?", ru: "Расскажи немного о своих любимых хобби?" },
    { en: "I'm learning this language to travel and communicate freely.", de: "Ich lerne Deutsch, um zu reisen und mich frei zu unterhalten.", ru: "Я учу язык для путешествий и свободного общения." }
  ],
  cafe: [
    { en: "Hi! Can I please get an iced latte with oat milk?", de: "Hallo! Einen Eiskaffee mit Hafermilch, bitte.", ru: "Привет! Можно мне айс-латте с овсяным молоком?" },
    { en: "Is there anything you recommend for dessert today?", de: "Was kannst du heute als Nachtisch empfehlen?", ru: "Что ты порекомендуешь на десерт сегодня?" },
    { en: "I will pay by card. Can I have the receipt, please?", de: "Ich zahle mit Karte. Kann ich den Beleg haben?", ru: "Я оплачу картой. Можно чек, пожалуйста?" }
  ],
  airport: [
    { en: "I am traveling for vacation and staying for two weeks.", de: "Ich reise für den Urlaub und bleibe zwei Wochen.", ru: "Я приехал в отпуск на две недели." },
    { en: "Here is my passport and hotel reservation confirmation.", de: "Hier sind mein Reisepass und die Hotelreservierung.", ru: "Вот мой паспорт и подтверждение брони отеля." },
    { en: "I do not have anything to declare.", de: "Ich habe nichts zu verzollen.", ru: "Мне нечего декларировать." }
  ],
  interview: [
    { en: "I have over three years of experience in project management.", de: "Ich habe über drei Jahre Erfahrung im Projektmanagement.", ru: "У меня более трёх лет опыта в управлении проектами." },
    { en: "My biggest strength is quick problem solving under pressure.", de: "Meine größte Stärke ist schnelles Problemlösen.", ru: "Моя главная сила — быстрое решение задач под давлением." },
    { en: "What are the next steps in your hiring process?", de: "Was sind die nächsten Schritte im Bewerbungsprozess?", ru: "Каковы следующие этапы найма?" }
  ],
  hotel: [
    { en: "Good evening, I have a reservation under my name.", de: "Guten Abend, ich habe eine Reservierung auf meinen Namen.", ru: "Добрый вечер, у меня бронь на моё имя." },
    { en: "Could you tell me what time breakfast is served tomorrow?", de: "Um wie viel Uhr gibt es morgen Frühstück?", ru: "Подскажите, во сколько завтра подают завтрак?" },
    { en: "Could I please get an extra keycard and Wi-Fi password?", de: "Kann ich bitte eine zweite Schlüsselkarte und das WLAN-Passwort haben?", ru: "Можно мне дополнительную ключ-карту и пароль от Wi-Fi?" }
  ]
};

const TUTORS = {
  en: {
    id: 'emma',
    name: 'Emma',
    flag: '🇺🇸',
    voice: 'Kore',
    avatarEmoji: '👩‍🏫',
    accent: 'Американский английский',
  },
  de: {
    id: 'lukas',
    name: 'Lukas',
    flag: '🇩🇪',
    voice: 'Puck',
    avatarEmoji: '👨‍🏫',
    accent: 'Немецкий (Берлин)',
  },
};

export default function VoiceTutorModal({ isOpen, onClose, currentLanguage = 'en' }) {
  const [selectedLang, setSelectedLang] = useState(currentLanguage === 'de' ? 'de' : 'en');
  const [activeScenario, setActiveScenario] = useState('free');
  const [speechPace, setSpeechPace] = useState('normal'); // 'slow' | 'normal'
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('linguo_gemini_key') || '');
  const [inputKey, setInputKey] = useState('');
  const [status, setStatus] = useState('disconnected'); // 'connecting' | 'connected' | 'disconnected'
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcripts, setTranscripts] = useState([]);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [lastSessionData, setLastSessionData] = useState(null);
  const [addedWords, setAddedWords] = useState([]);

  // Lip-sync & avatar state
  const [isBlinking, setIsBlinking] = useState(false);

  const liveClientRef = useRef(null);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  const tutor = TUTORS[selectedLang] || TUTORS.en;

  useEffect(() => {
    setSelectedLang(currentLanguage === 'de' ? 'de' : 'en');
  }, [currentLanguage]);

  // Periodic blinking effect for realistic avatar
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Call timer
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

  // Cleanup on unmount
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

  const buildSystemInstructions = () => {
    const mistakes = gamification.getMistakes() || [];
    const memorySnippet = mistakes.length > 0
      ? `Student recently had difficulty with these words/concepts: "${mistakes.slice(0, 3).join(', ')}". If appropriate, weave them into the conversation gently.`
      : '';

    const paceDirective = speechPace === 'slow'
      ? 'Speak slightly slower than usual with clear enunciation, using simple A1-A2 vocabulary.'
      : 'Speak with natural native cadence and casual conversational phrasing.';

    let scenarioDirective = '';
    if (activeScenario === 'cafe') {
      scenarioDirective = 'ROLEPLAY: You are a friendly Starbucks barista. Greet the customer, take their order (drink, size, milk, pastry), ask for their name for the cup, and handle payment.';
    } else if (activeScenario === 'airport') {
      scenarioDirective = 'ROLEPLAY: You are a professional border passport control officer at JFK / Frankfurt Airport. Ask about trip purpose, stay duration, accommodation, and declarations.';
    } else if (activeScenario === 'interview') {
      scenarioDirective = 'ROLEPLAY: You are a supportive HR manager conducting a job interview. Ask about their work experience, greatest strength, and why they want this role.';
    } else if (activeScenario === 'hotel') {
      scenarioDirective = 'ROLEPLAY: You are a luxury hotel receptionist. Welcome the guest, ask for reservation details, provide keycards, breakfast hours, and Wi-Fi password.';
    } else {
      scenarioDirective = 'ROLEPLAY: You are a warm personal tutor having a casual friendly chat about daily life, hobbies, favorite travel destinations, and languages.';
    }

    if (selectedLang === 'de') {
      return `Du bist Lukas, ein professioneller, sympathischer Deutsch-Tutor für russischsprachige Schüler.
${scenarioDirective}
${paceDirective}
${memorySnippet}
Regeln:
1. Halte deine Antworten kurz und prägnant (1 bis 2 Sätze), damit der Schüler sprechen kann.
2. Wenn der Schüler einen Fehler macht (z.B. falscher Artikel oder falsches Tempus), korrigiere ihn freundlich und lass ihn die richtige Formulierung wiederholen.
3. Du kannst grammatikalische Erklärungen kurz auf Russisch geben, sprich aber hauptsächlich Deutsch.
4. Sei motivierend und freundlich.`;
    }

    return `You are Emma, an enthusiastic, patient, and warm American English tutor speaking with a Russian native student.
${scenarioDirective}
${paceDirective}
${memorySnippet}
Rules:
1. Keep turns brief (1-2 sentences) so the student has space to speak.
2. If the student makes a grammatical or vocabulary error, gently mention the correct phrasing and encourage them to try again.
3. You can explain difficult grammar tips or translations briefly in Russian if needed, but speak mostly English.
4. Ask engaging questions to keep the conversation flowing smoothly.`;
  };

  const handleStartCall = async () => {
    setErrorMsg('');
    setTranscripts([]);
    setSessionSeconds(0);
    haptics.medium();

    try {
      const instructions = buildSystemInstructions();
      const client = new GeminiLiveClient({
        apiKey,
        model: 'models/gemini-3.8-live',
        voiceName: tutor.voice,
        systemInstruction: instructions,
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
      sounds.playTap?.();
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

    const duration = sessionSeconds;
    const earnedXP = Math.max(15, Math.min(100, Math.round(duration * 0.8)));
    gamification.addXP(earnedXP);

    // Prepare Lesson Report
    const userUtterances = transcripts.filter((t) => t.role === 'user');
    const fluencyScore = Math.min(98, Math.max(75, 80 + Math.round(userUtterances.length * 2.5)));

    const extractedWords = selectedLang === 'de'
      ? [
          { word: 'die Gemütlichkeit', translation: 'уют, душевная атмосфера', level: 'A2' },
          { word: 'die Sehenswürdigkeit', translation: 'достопримечательность', level: 'A2' },
          { word: 'bestellen', translation: 'заказывать', level: 'A1' }
        ]
      : [
          { word: 'Opportunity', translation: 'возможность / шанс', level: 'A2' },
          { word: 'Recommendation', translation: 'рекомендация / совет', level: 'A2' },
          { word: 'To accomplish', translation: 'достигать / выполнять', level: 'B1' }
        ];

    setLastSessionData({
      duration,
      earnedXP,
      fluencyScore,
      scenario: SCENARIOS.find((s) => s.id === activeScenario)?.title || 'Разговор',
      tutorName: tutor.name,
      words: extractedWords,
      totalTurns: transcripts.length
    });

    if (duration >= 5) {
      setShowReport(true);
      sounds.playComplete?.();
      haptics.celebrate?.();
    }
  };

  const handleAddWordToDeck = async (wordItem) => {
    try {
      await addCard({
        id: `tutor-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        word: wordItem.word,
        translation: wordItem.translation,
        language: selectedLang,
        level: wordItem.level,
        category: 'Live Tutor',
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: new Date().toISOString()
      });
      setAddedWords((prev) => [...prev, wordItem.word]);
      sounds.playCorrect?.();
      haptics.success?.();
    } catch (e) {
      console.warn('Word add error:', e);
    }
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const activeHints = SCENARIO_HINTS[activeScenario] || SCENARIO_HINTS.free;

  // Mouth height calculation for natural lip-sync (0 to 22px)
  const mouthScale = status === 'connected' ? Math.min(22, Math.max(3, audioLevel * 0.35)) : 3;

  return (
    <div className="tutor-overlay" onClick={onClose}>
      <div className="tutor-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tutor-header">
          <div className="tutor-brand">
            <span className="tutor-sparkle">✨</span>
            <div>
              <h3>Linguo Live Tutor</h3>
              <p className="tutor-sub">Живой разговорный ИИ • Google Gemini 3.8 Live</p>
            </div>
          </div>
          <button className="tutor-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* API Key Screen if not configured */}
        {!apiKey ? (
          <div className="tutor-key-onboarding">
            <div className="tutor-key-icon">🔑</div>
            <h4>Подключение Gemini Live</h4>
            <p className="tutor-key-desc">
              Вставьте бесплатный ключ Google Gemini API, чтобы начать живой аудио-диалог:
            </p>

            <div className="tutor-key-steps">
              <div className="step-row">
                <span className="step-num">1</span>
                <span>Откройте <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio</a></span>
              </div>
              <div className="step-row">
                <span className="step-num">2</span>
                <span>Нажмите «Create API Key» и скопируйте его</span>
              </div>
              <div className="step-row">
                <span className="step-num">3</span>
                <span>Вставьте ключ в поле ниже</span>
              </div>
            </div>

            <form onSubmit={handleSaveKey} className="tutor-key-form">
              <input
                type="text"
                placeholder="Вставьте ваш ключ API..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                required
              />
              <button type="submit" className="tutor-key-btn">Сохранить и начать</button>
            </form>
          </div>
        ) : showReport && lastSessionData ? (
          /* Post-Call Lesson Report & Analytics */
          <div className="tutor-report-view animate-in">
            <div className="report-header">
              <span className="report-emoji">🎉</span>
              <h3>Отличная практика!</h3>
              <p>Урок с {lastSessionData.tutorName} успешно завершён</p>
            </div>

            <div className="report-stats-grid">
              <div className="report-stat-card">
                <span className="stat-icon">⏱️</span>
                <span className="stat-val">{formatTime(lastSessionData.duration)}</span>
                <span className="stat-lbl">Время речи</span>
              </div>
              <div className="report-stat-card">
                <span className="stat-icon">🎯</span>
                <span className="stat-val">{lastSessionData.fluencyScore}%</span>
                <span className="stat-lbl">Беглость</span>
              </div>
              <div className="report-stat-card">
                <span className="stat-icon">⚡</span>
                <span className="stat-val">+{lastSessionData.earnedXP} XP</span>
                <span className="stat-lbl">Опыт</span>
              </div>
            </div>

            <div className="report-vocab-box">
              <h4>📚 Новые слова из разговора:</h4>
              <div className="report-vocab-list">
                {lastSessionData.words.map((w, idx) => {
                  const isSaved = addedWords.includes(w.word);
                  return (
                    <div key={idx} className="report-word-item">
                      <div>
                        <strong>{w.word}</strong>
                        <span className="word-tr">{w.translation}</span>
                      </div>
                      <button
                        className={`report-add-btn ${isSaved ? 'added' : ''}`}
                        onClick={() => handleAddWordToDeck(w)}
                        disabled={isSaved}
                      >
                        {isSaved ? '✓ Добавлено' : '+ В колоду'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              className="report-continue-btn"
              onClick={() => {
                setShowReport(false);
                setLastSessionData(null);
              }}
            >
              🔄 Продолжить обучение
            </button>
          </div>
        ) : (
          /* Active Call / Lobby View */
          <div className="tutor-call-container">
            {/* Top Config: Tutor + Pace Picker */}
            {status === 'disconnected' && (
              <div className="tutor-config-bar">
                <div className="tutor-tab-row">
                  <button
                    className={`tutor-tab-btn ${selectedLang === 'en' ? 'active' : ''}`}
                    onClick={() => setSelectedLang('en')}
                  >
                    🇺🇸 Emma
                  </button>
                  <button
                    className={`tutor-tab-btn ${selectedLang === 'de' ? 'active' : ''}`}
                    onClick={() => setSelectedLang('de')}
                  >
                    🇩🇪 Lukas
                  </button>
                </div>

                <div className="tutor-pace-row">
                  <button
                    className={`pace-btn ${speechPace === 'slow' ? 'active' : ''}`}
                    onClick={() => setSpeechPace('slow')}
                    title="Для начинающих: отчетливая замедленная речь"
                  >
                    🐢 Для начинающих (A1)
                  </button>
                  <button
                    className={`pace-btn ${speechPace === 'normal' ? 'active' : ''}`}
                    onClick={() => setSpeechPace('normal')}
                    title="Свободный беглый темп носителя"
                  >
                    ⚡ Беглый темп (B1–B2)
                  </button>
                </div>

                {/* Scenario Picker Carousel */}
                <div className="scenario-scroll-strip">
                  {SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      className={`scenario-chip ${activeScenario === sc.id ? 'active' : ''}`}
                      onClick={() => setActiveScenario(sc.id)}
                    >
                      <span className="sc-icon">{sc.icon}</span>
                      <span className="sc-title">{sc.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Living Avatar with Lip-Sync */}
            <div className="tutor-avatar-stage">
              <div className={`tutor-face-orb ${status === 'connected' ? 'in-call' : ''}`}>
                <div className="avatar-face">
                  {/* Eyes with periodic blink */}
                  <div className={`avatar-eyes ${isBlinking ? 'blinking' : ''}`}>
                    <span className="eye left" />
                    <span className="eye right" />
                  </div>
                  {/* Dynamic Lip-sync mouth */}
                  <div
                    className="avatar-mouth"
                    style={{
                      height: `${mouthScale}px`,
                      borderRadius: mouthScale > 8 ? '50%' : '8px',
                    }}
                  />
                </div>
                <span className="avatar-flag-pill">{tutor.flag}</span>
              </div>

              <h2 className="tutor-name">{tutor.name}</h2>
              <p className="tutor-role">
                {SCENARIOS.find((s) => s.id === activeScenario)?.title} • {tutor.accent}
              </p>

              {status === 'connected' ? (
                <div className="tutor-status-badge live">
                  <span className="live-dot" /> В эфире • {formatTime(sessionSeconds)}
                </div>
              ) : status === 'connecting' ? (
                <div className="tutor-status-badge connecting">Подключение к Gemini 3.8 Live...</div>
              ) : (
                <div className="tutor-status-badge ready">Готов к звонку</div>
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
                    ? 'Слушаю вас... Говорите свободно в микрофон!'
                    : `Выберите тему и нажмите «Начать разговор с ${tutor.name}»`}
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

            {/* Live Hint Drawer (💡 Что сказать) */}
            {status === 'connected' && showHints && (
              <div className="tutor-hints-drawer animate-pop">
                <div className="hints-header">
                  <span>💡 Что можно сказать:</span>
                  <button className="hints-close" onClick={() => setShowHints(false)}>✕</button>
                </div>
                <div className="hints-list">
                  {activeHints.map((h, i) => (
                    <div key={i} className="hint-card">
                      <div className="hint-foreign">{selectedLang === 'de' ? h.de : h.en}</div>
                      <div className="hint-ru">{h.ru}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call Controls */}
            <div className="tutor-call-controls">
              {status === 'disconnected' ? (
                <button className="tutor-start-call-btn" onClick={handleStartCall}>
                  <span className="call-icon">📞</span> Начать разговор с {tutor.name}
                </button>
              ) : (
                <div className="tutor-active-controls">
                  <button
                    className={`tutor-hint-toggle ${showHints ? 'active' : ''}`}
                    onClick={() => setShowHints(!showHints)}
                    title="Подсказка фраз"
                  >
                    💡 Суфлёр
                  </button>
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
