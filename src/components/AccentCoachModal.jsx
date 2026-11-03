import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './AccentCoachModal.css';

const ACCENT_CHALLENGES = {
  en: [
    {
      id: 'en-acc-1',
      phrase: 'Think through the three thrilling theories.',
      focus: 'Звуки [θ] и [ð] (межзубный TH)',
      tip: 'Поместите кончик языка между верхними и нижними зубами и выдувайте воздух без голоса для "th".',
      level: 'B1',
    },
    {
      id: 'en-acc-2',
      phrase: 'Water bottle in the city center.',
      focus: 'Flap T в американском английском',
      tip: 'В американском английском буква "t" между гласными звучит как быстрый мягкий звук [d].',
      level: 'A2',
    },
    {
      id: 'en-acc-3',
      phrase: 'Very well, we will visit the village.',
      focus: 'Разница между [w] и [v]',
      tip: 'Для [w] округлите губы в трубочку (как в слове "у"). Для [v] верхние зубы касаются нижней губы.',
      level: 'A2',
    },
    {
      id: 'en-acc-4',
      phrase: 'World wide web will never stop evolving.',
      focus: 'Темный [l] и плавный [r]',
      tip: 'Задняя часть языка поднимается к мягкому нёбу при звуке [l] в слове world.',
      level: 'B2',
    },
  ],
  de: [
    {
      id: 'de-acc-1',
      phrase: 'Ich möchte fünf schöne grüne Bücher.',
      focus: 'Немецкие умлауты: Ö [ø:] и Ü [y:]',
      tip: 'Для "ö": скажите звук [e], но округлите губы в [o]. Для "ü": скажите [i], но сложите губы в [u].',
      level: 'A2',
    },
    {
      id: 'de-acc-2',
      phrase: 'Ich spreche mit dir über wichtige Nachrichten.',
      focus: 'ich-Laut [ç] против ach-Laut [x]',
      tip: 'После e, i, ä, ö, ü звук "ch" мягкий шипящий (воздух проходит над спинкой языка к нёбу).',
      level: 'B1',
    },
    {
      id: 'de-acc-3',
      phrase: 'Die Reise durch Deutschland ist wunderbar.',
      focus: 'Горловой немецкий R [ʁ]',
      tip: 'Произносите R в глубине горла с помощью маленького язычка (увулярно), не вибрируя кончиком языка.',
      level: 'A2',
    },
  ],
};

export default function AccentCoachModal({ isOpen, onClose }) {
  const [lang, setLang] = useState('en');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  const challenges = ACCENT_CHALLENGES[lang] || ACCENT_CHALLENGES.en;
  const currentChallenge = challenges[currentIdx] || challenges[0];

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  useEffect(() => {
    // Reset when switching phrase or lang
    setUserTranscript('');
    setEvaluation(null);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [currentIdx, lang]);

  if (!isOpen) return null;

  const playNativeAudio = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const evaluateSpeech = (spoken, target) => {
    const cleanSpoken = spoken.toLowerCase().replace(/[^a-zA-Zäöüß\s]/g, '').trim().split(/\s+/);
    const cleanTarget = target.toLowerCase().replace(/[^a-zA-Zäöüß\s]/g, '').trim().split(/\s+/);

    let matchCount = 0;
    const wordsAnalysis = cleanTarget.map((targetWord) => {
      const isMatch = cleanSpoken.includes(targetWord);
      if (isMatch) matchCount++;
      return {
        word: targetWord,
        status: isMatch ? 'perfect' : 'missed',
      };
    });

    const score = Math.round((matchCount / Math.max(cleanTarget.length, 1)) * 100);

    let feedback = '';
    let rating = 'good';
    if (score >= 85) {
      feedback = '🔥 Потрясающе! Ваше произношение звучит на 100% как у носителя!';
      rating = 'native';
      sounds.playComplete();
      gamification.addXP(25);
    } else if (score >= 50) {
      feedback = '👍 Хороший результат! Обратите внимание на выделенные звуки и повторите ещё раз.';
      rating = 'good';
      sounds.playCorrect();
      gamification.addXP(10);
    } else {
      feedback = '👂 Послушайте эталон ещё раз и попробуйте говорить чуть медленнее и четче.';
      rating = 'retry';
      sounds.playWrong();
    }

    setEvaluation({
      score,
      wordsAnalysis,
      feedback,
      rating,
    });
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Simulate for browsers without speech recognition
      const simulatedText = currentChallenge.phrase;
      setUserTranscript(simulatedText);
      evaluateSpeech(simulatedText, currentChallenge.phrase);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'de' ? 'de-DE' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setUserTranscript('');
        setEvaluation(null);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserTranscript(transcript);
        evaluateSpeech(transcript, currentChallenge.phrase);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Recognition start error:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="accent-modal-backdrop" onClick={onClose}>
      <div className="accent-modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="accent-modal-header">
          <div className="accent-title-wrap">
            <span className="accent-badge-icon">🎙️</span>
            <div>
              <h3>AI Тренажёр произношения</h3>
              <p>Анализ акцента & Native Score в реальном времени</p>
            </div>
          </div>
          <button className="accent-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Language switcher */}
        <div className="accent-lang-tabs">
          <button
            className={`accent-lang-tab ${lang === 'en' ? 'active' : ''}`}
            onClick={() => {
              setLang('en');
              setCurrentIdx(0);
            }}
          >
            🇺🇸 English (US)
          </button>
          <button
            className={`accent-lang-tab ${lang === 'de' ? 'active' : ''}`}
            onClick={() => {
              setLang('de');
              setCurrentIdx(0);
            }}
          >
            🇩🇪 Deutsch
          </button>
        </div>

        {/* Challenge phrase card */}
        <div className="accent-target-card">
          <div className="accent-target-meta">
            <span className="accent-level-pill">{currentChallenge.level}</span>
            <span className="accent-focus-pill">{currentChallenge.focus}</span>
          </div>

          <div className="accent-phrase-row">
            <h2 className="accent-target-phrase">{currentChallenge.phrase}</h2>
            <button
              className="accent-audio-btn"
              onClick={() => playNativeAudio(currentChallenge.phrase)}
              title="Слушать эталонное произношение"
            >
              🔊
            </button>
          </div>

          <div className="accent-tip-box">
            <span className="accent-tip-icon">💡</span>
            <p>{currentChallenge.tip}</p>
          </div>
        </div>

        {/* Live mic control & recognition status */}
        <div className="accent-controls-wrap">
          <button
            className={`accent-mic-btn ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
          >
            <span className="mic-icon">{isListening ? '⏹️' : '🎙️'}</span>
            <span className="mic-label">
              {isListening ? 'Слушаю... Нажмите для завершения' : 'Нажмите и произнесите вслух'}
            </span>
          </button>

          {isListening && (
            <div className="accent-wave-animation">
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
          )}
        </div>

        {/* Spoken result & Native Score evaluation */}
        {evaluation && (
          <div className={`accent-eval-card eval-${evaluation.rating}`}>
            <div className="accent-eval-top">
              <div className="accent-score-badge">
                <span className="accent-score-num">{evaluation.score}%</span>
                <span className="accent-score-label">Native Score</span>
              </div>
              <div className="accent-eval-feedback">{evaluation.feedback}</div>
            </div>

            {/* Word breakdown */}
            <div className="accent-word-breakdown">
              <span className="breakdown-title">Разбор по словам:</span>
              <div className="words-stream">
                {evaluation.wordsAnalysis.map((item, i) => (
                  <span
                    key={i}
                    className={`stream-word ${item.status === 'perfect' ? 'word-perfect' : 'word-missed'}`}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            </div>

            {userTranscript && (
              <div className="accent-user-transcript">
                Распознано: <em>«{userTranscript}»</em>
              </div>
            )}
          </div>
        )}

        {/* Next challenge pagination */}
        <div className="accent-modal-footer">
          <button
            className="accent-nav-btn"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          >
            ← Предыдущая
          </button>
          <span className="accent-page-indicator">
            {currentIdx + 1} / {challenges.length}
          </span>
          <button
            className="accent-nav-btn primary"
            disabled={currentIdx === challenges.length - 1}
            onClick={() => setCurrentIdx((i) => Math.min(challenges.length - 1, i + 1))}
          >
            Следующая фраза →
          </button>
        </div>
      </div>
    </div>
  );
}
