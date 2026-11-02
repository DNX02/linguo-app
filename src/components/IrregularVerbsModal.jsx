import React, { useState } from 'react';
import { irregularVerbs } from '../data/irregularVerbs';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import './IrregularVerbsModal.css';

export default function IrregularVerbsModal({ isOpen, onClose, defaultLang = 'en' }) {
  const [lang, setLang] = useState(defaultLang);
  const [mode, setMode] = useState('table'); // 'table' or 'quiz'
  const [search, setSearch] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  if (!isOpen) return null;

  const verbList = irregularVerbs[lang] || irregularVerbs.en;

  const filtered = verbList.filter((v) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      v.v1.toLowerCase().includes(q) ||
      v.v2.toLowerCase().includes(q) ||
      v.v3.toLowerCase().includes(q) ||
      v.translation.toLowerCase().includes(q)
    );
  });

  const handleSpeakAll = (v) => {
    haptics.light();
    speakText(`${v.v1}. ${v.v2}. ${v.v3}`, lang);
  };

  // Generate quiz questions for irregular verbs
  const currentVerb = verbList[quizIndex % verbList.length];
  const missingForm = quizIndex % 2 === 0 ? 'v2' : 'v3'; // test v2 or v3
  const correctAnswer = currentVerb[missingForm];

  // Distractors
  const otherVerbs = verbList.filter((v) => v[missingForm] !== correctAnswer);
  const options = [
    correctAnswer,
    otherVerbs[0]?.[missingForm] || 'went',
    otherVerbs[1]?.[missingForm] || 'gone',
  ].sort(() => Math.random() - 0.5);

  const handleQuizAnswer = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt === correctAnswer) {
      sounds.playCorrect();
      haptics.success();
      setQuizScore((s) => s + 1);
      gamification.addXP(10);
    } else {
      sounds.playWrong();
      haptics.error();
    }
  };

  const handleNextQuiz = () => {
    haptics.light();
    setQuizIndex((i) => i + 1);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="iv-overlay" onClick={onClose}>
      <div className="iv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="iv-header">
          <div className="iv-title-box">
            <h2>⚡ Неправильные глаголы</h2>
            <p>Таблица 3 форм и тренажёр</p>
          </div>
          <button className="iv-close" onClick={onClose}>✕</button>
        </div>

        {/* Controls */}
        <div className="iv-controls">
          <div className="iv-tab-row">
            <button
              className={`iv-tab-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => { setLang('en'); setQuizIndex(0); setIsAnswered(false); }}
            >
              🇺🇸 English (US) (V1 - V2 - V3)
            </button>
            <button
              className={`iv-tab-btn ${lang === 'de' ? 'active' : ''}`}
              onClick={() => { setLang('de'); setQuizIndex(0); setIsAnswered(false); }}
            >
              🇩🇪 Deutsch (3 Formen)
            </button>
          </div>

          <div className="iv-mode-row">
            <button
              className={`iv-mode-btn ${mode === 'table' ? 'active' : ''}`}
              onClick={() => setMode('table')}
            >
              📋 Таблица ({filtered.length})
            </button>
            <button
              className={`iv-mode-btn ${mode === 'quiz' ? 'active' : ''}`}
              onClick={() => setMode('quiz')}
            >
              🎯 Тренажёр форм
            </button>
          </div>

          {mode === 'table' && (
            <input
              type="text"
              placeholder="Поиск по любой форме или переводу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="iv-search-input"
            />
          )}
        </div>

        {/* Content */}
        {mode === 'table' ? (
          <div className="iv-table-container">
            {filtered.map((item, idx) => (
              <div key={idx} className="iv-row-card">
                <div className="iv-row-main">
                  <div className="iv-forms">
                    <span className="iv-v1">{item.v1}</span>
                    <span className="iv-arrow">→</span>
                    <span className="iv-v2">{item.v2}</span>
                    <span className="iv-arrow">→</span>
                    <span className="iv-v3">{item.v3}</span>
                  </div>
                  <div className="iv-trans">{item.translation}</div>
                </div>
                <button
                  className="iv-speak-btn"
                  onClick={() => handleSpeakAll(item)}
                  title="Озвучить 3 формы"
                >
                  🔊
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="iv-quiz-container">
            <div className="iv-quiz-card">
              <span className="iv-quiz-badge">Вопрос #{quizIndex + 1}</span>
              <div className="iv-quiz-trans">{currentVerb.translation}</div>

              <div className="iv-quiz-prompt">
                <span>{missingForm === 'v1' ? '___' : currentVerb.v1}</span>
                <span className="iv-arrow">→</span>
                <span>{missingForm === 'v2' ? '❓' : currentVerb.v2}</span>
                <span className="iv-arrow">→</span>
                <span>{missingForm === 'v3' ? '❓' : currentVerb.v3}</span>
              </div>

              <p className="iv-quiz-hint">
                Выберите правильную форму для пропуска:
              </p>

              <div className="iv-quiz-options">
                {options.map((opt, idx) => {
                  let cls = 'iv-opt-btn';
                  if (isAnswered) {
                    if (opt === correctAnswer) cls += ' correct';
                    else if (opt === selectedOption) cls += ' wrong';
                    else cls += ' dim';
                  }
                  return (
                    <button
                      key={idx}
                      className={cls}
                      onClick={() => handleQuizAnswer(opt)}
                      disabled={isAnswered}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="iv-quiz-footer">
                  <button className="iv-next-btn" onClick={handleNextQuiz}>
                    Следующий глагол →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
