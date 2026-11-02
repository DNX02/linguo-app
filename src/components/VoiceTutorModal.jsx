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
    { en: "I'm having a great day, thanks! How about you?", de: "Mir geht es super, danke! Und dir?", fr: "Je passe une excellente journée, et vous?", es: "¡Estoy teniendo un gran día! ¿Y tú?", ru: "У меня отличный день, спасибо! А как у тебя?" },
    { en: "Could you tell me a little about your favorite hobbies?", de: "Was sind deine Lieblingshobbys?", fr: "Quels sont vos passe-temps favoris?", es: "¿Cuáles son tus pasatiempos favoritos?", ru: "Расскажи немного о своих любимых хобби?" },
    { en: "I'm learning this language to travel and communicate freely.", de: "Ich lerne Deutsch, um zu reisen und mich frei zu unterhalten.", fr: "J'apprends cette langue pour voyager librement.", es: "Estoy aprendiendo este idioma para viajar libremente.", ru: "Я учу язык для путешествий и свободного общения." }
  ],
  cafe: [
    { en: "Hi! Can I please get an iced latte with oat milk?", de: "Hallo! Einen Eiskaffee mit Hafermilch, bitte.", fr: "Bonjour! Un café au lait s'il vous plaît.", es: "¡Hola! Un café con leche de avena, por favor.", ru: "Привет! Можно мне айс-латте с овсяным молоком?" },
    { en: "Is there anything you recommend for dessert today?", de: "Was kannst du heute als Nachtisch empfehlen?", fr: "Que me recommandez-vous comme dessert?", es: "¿Qué me recomiendas de postre hoy?", ru: "Что ты порекомендуешь на десерт сегодня?" },
    { en: "I will pay by card. Can I have the receipt, please?", de: "Ich zahle mit Karte. Kann ich den Beleg haben?", fr: "Je vais payer par carte. Le reçu, s'il vous plaît.", es: "Pagaré con tarjeta. ¿Me da el recibo?", ru: "Я оплачу картой. Можно чек, пожалуйста?" }
  ],
  airport: [
    { en: "I am traveling for vacation and staying for two weeks.", de: "Ich reise für den Urlaub und bleibe zwei Wochen.", fr: "Je voyage pour les vacances et je reste deux semaines.", es: "Viajo por vacaciones y me quedo dos semanas.", ru: "Я приехал в отпуск на две недели." },
    { en: "Here is my passport and hotel reservation confirmation.", de: "Hier sind mein Reisepass und die Hotelreservierung.", fr: "Voici mon passeport et ma réservation d'hôtel.", es: "Aquí tiene mi pasaporte y la reserva de hotel.", ru: "Вот мой паспорт и подтверждение брони отеля." },
    { en: "I do not have anything to declare.", de: "Ich habe nichts zu verzollen.", fr: "Je n'ai rien à déclarer.", es: "No tengo nada que declarar.", ru: "Мне нечего декларировать." }
  ],
  interview: [
    { en: "I have over three years of experience in project management.", de: "Ich habe über drei Jahre Erfahrung im Projektmanagement.", fr: "J'ai plus de trois ans d'expérience en gestion.", es: "Tengo más de tres años de experiencia en gestión.", ru: "У меня более трёх лет опыта в управлении проектами." },
    { en: "My biggest strength is quick problem solving under pressure.", de: "Meine größte Stärke ist schnelles Problemlösen.", fr: "Mon point fort est la résolution rapide de problèmes.", es: "Mi mayor fortaleza es resolver problemas bajo presión.", ru: "Моя главная сила — быстрое решение задач под давлением." },
    { en: "What are the next steps in your hiring process?", de: "Was sind die nächsten Schritte im Bewerbungsprozess?", fr: "Quelles sont les prochaines étapes du recrutement?", es: "¿Cuáles son los siguientes pasos del proceso?", ru: "Каковы следующие этапы найма?" }
  ],
  hotel: [
    { en: "Good evening, I have a reservation under my name.", de: "Guten Abend, ich habe eine Reservierung auf meinen Namen.", fr: "Bonsoir, j'ai une réservation à mon nom.", es: "Buenas noches, tengo una reserva a mi nombre.", ru: "Добрый вечер, у меня бронь на моё имя." },
    { en: "Could you tell me what time breakfast is served tomorrow?", de: "Um wie viel Uhr gibt es morgen Frühstück?", fr: "À quelle heure le petit-déjeuner est-il servi?", es: "¿A qué hora se sirve el desayuno mañana?", ru: "Подскажите, во сколько завтра подают завтрак?" },
    { en: "Could I please get an extra keycard and Wi-Fi password?", de: "Kann ich bitte eine zweite Schlüsselkarte und das WLAN-Passwort haben?", fr: "Puis-je avoir une carte supplémentaire et le mot de passe Wi-Fi?", es: "¿Me da una tarjeta extra y la clave del Wi-Fi?", ru: "Можно мне дополнительную ключ-карту и пароль от Wi-Fi?" }
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
  fr: {
    id: 'amelie',
    name: 'Amélie',
    flag: '🇫🇷',
    voice: 'Aoede',
    avatarEmoji: '👩‍🎨',
    accent: 'Французский (Париж)',
  },
  es: {
    id: 'carlos',
    name: 'Carlos',
    flag: '🇪🇸',
    voice: 'Fenrir',
    avatarEmoji: '👨‍🎨',
    accent: 'Испанский (Мадрид)',
  },
};

export default function VoiceTutorModal({ isOpen, onClose, currentLanguage = 'en' }) {
  const [selectedLang, setSelectedLang] = useState(
    ['en', 'de', 'fr', 'es'].includes(currentLanguage) ? currentLanguage : 'en'
  );
  const [activeScenario, setActiveScenario] = useState('free');
  const [speechPace, setSpeechPace] = useState('normal'); // 'slow' | 'normal'
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('linguo_gemini_key') || '');
  const [inputKey, setInputKey] = useState('');
  const [status, setStatus] = useState('disconnected'); // 'connecting' | 'connected' | 'disconnected'
  const [audioLevel, setAudioLevel] = useState(0); // Tutor voice audio level
  const [userMicLevel, setUserMicLevel] = useState(0); // User microphone level
  const [textInput, setTextInput] = useState('');
  const [transcripts, setTranscripts] = useState([]);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [lastSessionData, setLastSessionData] = useState(null);
  const [addedWords, setAddedWords] = useState([]);
  const [activeCorrection, setActiveCorrection] = useState(null);

  // Lip-sync & avatar state
  const [isBlinking, setIsBlinking] = useState(false);

  const liveClientRef = useRef(null);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  const tutor = TUTORS[selectedLang] || TUTORS.en;

  useEffect(() => {
    if (['en', 'de', 'fr', 'es'].includes(currentLanguage)) {
      setSelectedLang(currentLanguage);
    }
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
  }, [transcripts, activeCorrection]);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      if (liveClientRef.current) {
        liveClientRef.current.disconnect();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    const trimmed = inputKey.trim();
    if (!trimmed) return;
    localStorage.setItem('linguo_gemini_key', trimmed);
    setApiKey(trimmed);
    setInputKey('');
    setErrorMsg('');
    sounds.playTap?.();
    haptics.success();
  };

  const handleResetKey = () => {
    localStorage.removeItem('linguo_gemini_key');
    setApiKey('');
    setInputKey('');
    setErrorMsg('');
    if (liveClientRef.current) {
      liveClientRef.current.disconnect();
      liveClientRef.current = null;
    }
    setStatus('disconnected');
    sounds.playTap?.();
    haptics.medium();
  };

  // Build Context-Aware System Instruction
  const buildSystemInstructions = () => {
    const userRank = gamification.getRank();
    const streak = gamification.getStreak();
    const mistakes = gamification.getMistakes().slice(0, 5);

    let memorySnippet = `User learning profile: Rank: ${userRank.name}, Daily streak: ${streak} days. `;
    if (mistakes.length > 0) {
      const mistakeList = mistakes.map((m) => m.word).join(', ');
      memorySnippet += `Words user recently struggled with: [${mistakeList}]. Try to naturally integrate these words into the conversation to help the user practice them. `;
    }

    const paceDirective = speechPace === 'slow'
      ? 'Speak slowly, clearly, enunciate each syllable, and use simple A1-A2 vocabulary sentences.'
      : 'Speak with natural native cadence and casual conversational phrasing.';

    let scenarioDirective = '';
    if (activeScenario === 'cafe') {
      scenarioDirective = 'ROLEPLAY: You are a friendly cafe barista. Greet the customer, take their order (drink, size, milk, pastry), ask for their name for the cup, and handle payment.';
    } else if (activeScenario === 'airport') {
      scenarioDirective = 'ROLEPLAY: You are a professional border passport control officer at the airport. Ask about trip purpose, stay duration, accommodation, and declarations.';
    } else if (activeScenario === 'interview') {
      scenarioDirective = 'ROLEPLAY: You are a supportive HR manager conducting a job interview. Ask about their work experience, greatest strength, and why they want this role.';
    } else if (activeScenario === 'hotel') {
      scenarioDirective = 'ROLEPLAY: You are a hotel receptionist. Welcome the guest, ask for reservation details, provide keycards, breakfast hours, and Wi-Fi password.';
    } else {
      scenarioDirective = 'ROLEPLAY: You are a warm personal tutor having a casual friendly chat about daily life, hobbies, favorite travel destinations, and languages.';
    }

    const correctionRule = `
CRITICAL CORRECTION RULE:
If the student makes any clear grammar or phrasing mistake, you MUST append a small tag at the very start or end of your text transcript in this exact bracketed format:
[FIX: "student mistake" -> "correct phrasing" | brief explanation in Russian]
Example: [FIX: "I goed" -> "I went" | Past Simple для глагола go]
Always speak your regular response naturally!`;

    if (selectedLang === 'de') {
      return `Du bist Lukas, ein professioneller, sympathischer Deutsch-Tutor für russischsprachige Schüler.
${scenarioDirective}
${paceDirective}
${memorySnippet}
${correctionRule}
Regeln:
1. Halte deine Antworten kurz und prägnant (1 bis 2 Sätze), damit der Schüler sprechen kann.
2. Wenn der Schüler einen Fehler macht, korrigiere ihn freundlich.
3. Du kannst grammatikalische Erklärungen kurz auf Russisch geben, sprich aber hauptsächlich Deutsch.
4. Sei motivierend und freundlich.`;
    }

    if (selectedLang === 'fr') {
      return `Tu es Amélie, une tutrice de français chaleureuse, élégante et patiente pour des élèves russophones.
${scenarioDirective}
${paceDirective}
${memorySnippet}
${correctionRule}
Règles:
1. Garde tes réponses courtes (1 à 2 phrases) pour laisser l'élève parler.
2. Si l'élève fait une faute, utilise le tag [FIX: ...] pour la corriger gentiment.
3. Tu peux donner de brèves explications en russe si nécessaire, mais parle principalement français.
4. Sois encourageante et dynamique.`;
    }

    if (selectedLang === 'es') {
      return `Eres Carlos, un tutor de español entusiasta, amable y paciente de Madrid para estudiantes rusoparlantes.
${scenarioDirective}
${paceDirective}
${memorySnippet}
${correctionRule}
Reglas:
1. Mantén tus respuestas breves (1-2 oraciones) para que el estudiante hable.
2. Si el estudiante comete un error, incluye la etiqueta [FIX: ...] para corregirlo amablemente.
3. Puedes explicar en ruso brevemente si hace falta, pero habla principalmente español.
4. Sé muy motivador y alegre.`;
    }

    return `You are Emma, an enthusiastic, patient, and warm American English tutor speaking with a Russian native student.
${scenarioDirective}
${paceDirective}
${memorySnippet}
${correctionRule}
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
    setActiveCorrection(null);
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
          let cleanText = t.text;
          // Parse live mistake badge: [FIX: "..." -> "..." | ...]
          const fixMatch = cleanText.match(/\[FIX:\s*"(.*?)"\s*->\s*"(.*?)"\s*\|\s*(.*?)\]/i);
          if (fixMatch) {
            const original = fixMatch[1].trim();
            const corrected = fixMatch[2].trim();
            const reason = fixMatch[3].trim();
            setActiveCorrection({ original, corrected, reason });
            gamification.addMistake?.({ word: original, correct: corrected, context: reason });
            cleanText = cleanText.replace(/\[FIX:\s*".*?"\s*->\s*".*?"\s*\|\s*.*?\]/gi, '').trim();
          }

          if (cleanText) {
            setTranscripts((prev) => [...prev, { ...t, text: cleanText }]);
          }
        },
        onAudioLevel: (lvl) => setAudioLevel(lvl),
        onUserAudioLevel: (lvl) => setUserMicLevel(lvl),
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

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    liveClientRef.current?.setMuted(next);
    sounds.playTap?.();
    haptics.light();
  };

  const handleSendTextMessage = (e) => {
    e?.preventDefault();
    const trimmed = textInput.trim();
    if (!trimmed || !liveClientRef.current) return;
    liveClientRef.current.sendTextMessage(trimmed);
    setTextInput('');
    sounds.playTap?.();
    haptics.light();
  };

  const handleNudgeTurn = () => {
    if (!liveClientRef.current) return;
    liveClientRef.current.sendAudioStreamEnd();
    sounds.playTap?.();
    haptics.medium();
  };

  const handleSelectHint = (phrase) => {
    if (!liveClientRef.current) return;
    liveClientRef.current.sendTextMessage(phrase);
    sounds.playTap?.();
    haptics.light();
  };

  const handleEndCall = () => {
    if (liveClientRef.current) {
      liveClientRef.current.disconnect();
      liveClientRef.current = null;
    }
    setStatus('disconnected');
    setAudioLevel(0);
    setUserMicLevel(0);
    haptics.light();

    const duration = sessionSeconds;
    const earnedXP = Math.max(15, Math.min(100, Math.round(duration * 0.8)));
    gamification.addXP(earnedXP);

    // Prepare Lesson Report
    const userUtterances = transcripts.filter((t) => t.role === 'user');
    const fluencyScore = Math.min(98, Math.max(75, 80 + Math.round(userUtterances.length * 2.5)));

    let extractedWords = [];
    if (selectedLang === 'de') {
      extractedWords = [
        { word: 'die Gemütlichkeit', translation: 'уют, душевная атмосфера', level: 'A2' },
        { word: 'die Sehenswürdigkeit', translation: 'достопримечательность', level: 'A2' },
        { word: 'bestellen', translation: 'заказывать', level: 'A1' }
      ];
    } else if (selectedLang === 'fr') {
      extractedWords = [
        { word: 'le croissant', translation: 'круассан', level: 'A1' },
        { word: 'délicieux', translation: 'восхитительный / вкусный', level: 'A2' },
        { word: 'l\'opportunité', translation: 'возможность / шанс', level: 'B1' }
      ];
    } else if (selectedLang === 'es') {
      extractedWords = [
        { word: 'delicioso', translation: 'очень вкусный', level: 'A2' },
        { word: 'el viaje', translation: 'путешествие / поездка', level: 'A2' },
        { word: 'la oportunidad', translation: 'возможность / шанс', level: 'B1' }
      ];
    } else {
      extractedWords = [
        { word: 'Opportunity', translation: 'возможность / шанс', level: 'A2' },
        { word: 'Recommendation', translation: 'рекомендация / совет', level: 'A2' },
        { word: 'To accomplish', translation: 'достигать / выполнять', level: 'B1' }
      ];
    }

    setLastSessionData({
      duration,
      earnedXP,
      fluencyScore,
      words: extractedWords,
      scenario: SCENARIOS.find((s) => s.id === activeScenario)?.title || 'Разговор',
      tutorName: tutor.name,
      flag: tutor.flag,
    });
    setShowReport(true);
    sounds.playComplete?.();
  };

  const handleAddWordToDeck = async (w) => {
    try {
      await addCard({
        word: w.word,
        translation: w.translation,
        language: selectedLang,
        level: w.level || 'A2',
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: new Date().toISOString(),
        learned: false,
      });
      setAddedWords((prev) => [...prev, w.word]);
      sounds.playCorrect?.();
      haptics.celebrate();
    } catch (_) {}
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Avatar mouth height derived dynamically from Web Audio loudness (0 to 100)
  const mouthScale = Math.min(26, Math.max(4, Math.round((audioLevel / 100) * 26)));

  const activeHints = SCENARIO_HINTS[activeScenario] || SCENARIO_HINTS.free;

  return (
    <div className="tutor-modal-overlay" onClick={onClose}>
      <div className="tutor-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tutor-modal-header">
          <div className="tutor-header-title">
            <span className="tutor-logo-sparkle">✨</span>
            <div>
              <h3>Linguo Live Tutor</h3>
              <p className="tutor-engine-sub">Google Gemini 3.8 Live • Аудио 24 кГц</p>
            </div>
          </div>
          <button className="tutor-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* API Key Banner Prompt if missing */}
        {!apiKey ? (
          <div className="tutor-key-card animate-pop">
            <div className="tutor-key-badge">🔑 Требуется API-ключ Gemini Live</div>
            <p className="tutor-key-desc">
              Для живого диалога с репетитором укажите ваш личный бесплатный ключ Google AI Studio. Он безопасно сохраняется только в браузере.
            </p>
            <div className="tutor-key-input-row">
              <input
                type="password"
                placeholder="Вставьте ключ (начинается с AQ... или AIza...)"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="tutor-key-field"
              />
              <button className="tutor-key-submit-btn" onClick={handleSaveKey}>
                Сохранить
              </button>
            </div>
            <div className="tutor-key-hint">
              Получить бесплатный ключ можно за 1 минуту в{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio ↗
              </a>
            </div>
          </div>
        ) : showReport && lastSessionData ? (
          /* Post-Call Analytics & Lesson Report */
          <div className="tutor-report-card animate-pop">
            <div className="report-header">
              <span className="report-emoji">🎓</span>
              <h3>Отчёт по уроку</h3>
              <p className="report-subtitle">
                {lastSessionData.flag} Разговор с {lastSessionData.tutorName} • {lastSessionData.scenario}
              </p>
            </div>

            <div className="report-stats-grid">
              <div className="report-stat-card">
                <span className="stat-icon">⏱</span>
                <span className="stat-val">{formatTime(lastSessionData.duration)}</span>
                <span className="stat-lbl">Длительность</span>
              </div>
              <div className="report-stat-card">
                <span className="stat-icon">📈</span>
                <span className="stat-val">{lastSessionData.fluencyScore}%</span>
                <span className="stat-lbl">Беглость речи</span>
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
            {/* Top Config: 4 Tutors + Pace Picker */}
            {status === 'disconnected' && (
              <div className="tutor-config-bar">
                <div className="tutor-tab-row scrollable-tabs">
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
                  <button
                    className={`tutor-tab-btn ${selectedLang === 'fr' ? 'active' : ''}`}
                    onClick={() => setSelectedLang('fr')}
                  >
                    🇫🇷 Amélie
                  </button>
                  <button
                    className={`tutor-tab-btn ${selectedLang === 'es' ? 'active' : ''}`}
                    onClick={() => setSelectedLang('es')}
                  >
                    🇪🇸 Carlos
                  </button>
                </div>

                {/* Pace Switcher */}
                <div className="tutor-pace-selector">
                  <button
                    className={`pace-btn ${speechPace === 'slow' ? 'active' : ''}`}
                    onClick={() => setSpeechPace('slow')}
                    title="Медленный чёткий темп для начинающих"
                  >
                    🐢 Медленно (A1)
                  </button>
                  <button
                    className={`pace-btn ${speechPace === 'normal' ? 'active' : ''}`}
                    onClick={() => setSpeechPace('normal')}
                    title="Естественный беглый разговор"
                  >
                    🚀 Обычный (B2)
                  </button>
                </div>
              </div>
            )}

            {/* Scenarios Horizontal Strip */}
            {status === 'disconnected' && (
              <div className="tutor-scenario-strip">
                <span className="scenario-label">Сценарий:</span>
                <div className="scenario-list">
                  {SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      className={`scenario-chip ${activeScenario === sc.id ? 'active' : ''}`}
                      onClick={() => setActiveScenario(sc.id)}
                    >
                      <span>{sc.icon}</span> {sc.title}
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

            {/* Error banner with reset key */}
            {errorMsg && (
              <div className="tutor-error-banner animate-shake">
                <div className="error-text-content">
                  <span>⚠️ {errorMsg}</span>
                </div>
                <button className="error-reset-key-btn" onClick={handleResetKey}>
                  Сменить ключ
                </button>
              </div>
            )}

            {/* Live Mistake Badge (Мгновенная коррекция на лету) */}
            {activeCorrection && (
              <div className="live-mistake-badge animate-pop">
                <div className="lmb-header">
                  <span className="lmb-icon">⚡</span>
                  <span className="lmb-title">Разбор ошибки в реальном времени</span>
                  <button className="lmb-close" onClick={() => setActiveCorrection(null)}>✕</button>
                </div>
                <div className="lmb-body">
                  <div className="lmb-comparison">
                    <span className="lmb-wrong"><s>{activeCorrection.original}</s></span>
                    <span className="lmb-arrow">➔</span>
                    <span className="lmb-correct">{activeCorrection.corrected}</span>
                  </div>
                  <div className="lmb-reason">💡 {activeCorrection.reason}</div>
                </div>
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

            {/* Live Mic Activity & Instant Reply Trigger */}
            {status === 'connected' && (
              <div className="tutor-mic-live-bar animate-in">
                <div className={`mic-live-indicator ${userMicLevel > 8 ? 'speaking' : ''}`}>
                  <span
                    className="mic-wave-pulse"
                    style={{ transform: `scale(${1 + (userMicLevel / 100) * 0.9})` }}
                  />
                  <span className="mic-icon-live">
                    {isMuted ? '🔇 Микрофон выключен' : userMicLevel > 8 ? '🎙️ Слышу вас...' : '🎤 Говорите в микрофон'}
                  </span>
                </div>
                <button
                  type="button"
                  className="tutor-instant-reply-btn"
                  onClick={handleNudgeTurn}
                  title="Нажмите, если закончили говорить, чтобы репетитор ответил сразу"
                >
                  ⚡ Ответить сейчас ➔
                </button>
              </div>
            )}

            {/* Companion Text Input Bar (Можно говорить голосом или писать текстом) */}
            {status === 'connected' && (
              <form className="tutor-quick-input-form animate-in" onSubmit={handleSendTextMessage}>
                <input
                  type="text"
                  placeholder="Или напишите репетитору здесь..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="tutor-quick-input-field"
                />
                <button
                  type="submit"
                  className="tutor-quick-send-btn"
                  disabled={!textInput.trim()}
                  title="Отправить"
                >
                  ➤
                </button>
              </form>
            )}

            {/* Live Hint Drawer (💡 Что сказать) */}
            {status === 'connected' && showHints && (
              <div className="tutor-hints-drawer animate-pop">
                <div className="hints-header">
                  <span>💡 Что можно сказать (нажмите для отправки):</span>
                  <button className="hints-close" onClick={() => setShowHints(false)}>✕</button>
                </div>
                <div className="hints-list">
                  {activeHints.map((h, i) => {
                    const foreignPhrase = h[selectedLang] || h.en;
                    return (
                      <div
                        key={i}
                        className="hint-card interactive"
                        onClick={() => handleSelectHint(foreignPhrase)}
                        title="Нажмите, чтобы сказать репетитору"
                      >
                        <div className="hint-card-text">
                          <div className="hint-foreign">{foreignPhrase}</div>
                          <div className="hint-ru">{h.ru}</div>
                        </div>
                        <span className="hint-send-badge">💬 Сказать</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Call Controls */}
            <div className="tutor-call-controls">
              {status === 'disconnected' ? (
                <button className="tutor-start-call-btn" onClick={handleStartCall}>
                  📞 Начать разговор с {tutor.name}
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
                    onClick={toggleMute}
                  >
                    {isMuted ? '🔇 Вкл. микрофон' : '🎤 Микрофон'}
                  </button>
                  <button className="tutor-end-call-btn" onClick={handleEndCall}>
                    Завершить ✕
                  </button>
                </div>
              )}
            </div>

            {/* Footer action to reset key */}
            {status === 'disconnected' && (
              <button className="tutor-change-key-btn" onClick={handleResetKey}>
                Изменить API-ключ Gemini
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
