import React, { useState } from 'react';
import { dialogues } from '../data/dialogues';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import './DialoguesModal.css';

export default function DialoguesModal({ isOpen, onClose, currentLanguage = 'en' }) {
  const [activeDialogue, setActiveDialogue] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [history, setHistory] = useState([]);

  if (!isOpen) return null;

  const filteredDialogues = dialogues.filter(
    (d) => d.lang === currentLanguage || currentLanguage === 'both'
  );

  const startDialogue = (dialogue) => {
    setActiveDialogue(dialogue);
    setStepIndex(0);
    setShowTranslation(false);
    setIsCompleted(false);
    setHistory([]);
    haptics.light();

    // Auto-speak opening line
    setTimeout(() => {
      speakText(dialogue.steps[0].partner, dialogue.lang);
    }, 300);
  };

  const handleSelectOption = (option) => {
    sounds.playTap();
    haptics.medium();

    const currentStep = activeDialogue.steps[stepIndex];
    const newHistory = [
      ...history,
      { speaker: 'partner', text: currentStep.partner, translation: currentStep.partnerTr },
      { speaker: 'user', text: option.text, translation: option.textTr },
    ];
    setHistory(newHistory);

    if (option.next === 'end' || stepIndex + 1 >= activeDialogue.steps.length) {
      setIsCompleted(true);
      sounds.playComplete();
      haptics.celebrate();
      gamification.addXP(50);
    } else {
      const nextIndex = typeof option.next === 'number' ? option.next : stepIndex + 1;
      setStepIndex(nextIndex);
      const nextStep = activeDialogue.steps[nextIndex];
      if (nextStep) {
        setTimeout(() => {
          speakText(nextStep.partner, activeDialogue.lang);
        }, 400);
      }
    }
  };

  const currentStep = activeDialogue && !isCompleted ? activeDialogue.steps[stepIndex] : null;

  return (
    <div className="dialogue-overlay" onClick={onClose}>
      <div className="dialogue-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dialogue-header">
          <div>
            <h3>💬 Интерактивные диалоги</h3>
            <p className="dialogue-sub">Живая разговорная практика с озвучкой</p>
          </div>
          <button className="dialogue-close-btn" onClick={onClose}>✕</button>
        </div>

        {!activeDialogue ? (
          <div className="dialogue-picker">
            <p className="dialogue-picker-tip">Выберите сценарий общения для практики:</p>
            <div className="dialogue-list">
              {filteredDialogues.map((d) => (
                <button
                  key={d.id}
                  className="dialogue-card-btn"
                  onClick={() => startDialogue(d)}
                >
                  <div className="dialogue-card-info">
                    <span className="dialogue-card-title">{d.title}</span>
                    <span className="dialogue-card-level">{d.level}</span>
                  </div>
                  <span className="dialogue-card-arrow">Начать →</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="dialogue-chat-view">
            <div className="dialogue-chat-top">
              <button
                className="dialogue-back-btn"
                onClick={() => {
                  setActiveDialogue(null);
                  haptics.light();
                }}
              >
                ← Все темы
              </button>
              <div className="dialogue-active-title">{activeDialogue.title}</div>
              <button
                className={`dialogue-trans-btn ${showTranslation ? 'active' : ''}`}
                onClick={() => setShowTranslation(!showTranslation)}
                title="Показать / скрыть перевод"
              >
                {showTranslation ? '👁️ Скрыть перевод' : '👁️ Перевод'}
              </button>
            </div>

            <div className="dialogue-messages-scroll">
              {history.map((msg, i) => (
                <div key={i} className={`dialogue-bubble-row ${msg.speaker}`}>
                  <div className={`dialogue-bubble ${msg.speaker}`}>
                    <div className="bubble-text">{msg.text}</div>
                    {showTranslation && <div className="bubble-tr">{msg.translation}</div>}
                    {msg.speaker === 'partner' && (
                      <button
                        className="bubble-audio-btn"
                        onClick={() => speakText(msg.text, activeDialogue.lang)}
                      >
                        🔊
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {!isCompleted && currentStep && (
                <div className="dialogue-bubble-row partner animate-in">
                  <div className="dialogue-bubble partner">
                    <div className="bubble-text">{currentStep.partner}</div>
                    {showTranslation && (
                      <div className="bubble-tr">{currentStep.partnerTr}</div>
                    )}
                    <button
                      className="bubble-audio-btn"
                      onClick={() => speakText(currentStep.partner, activeDialogue.lang)}
                    >
                      🔊
                    </button>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="dialogue-complete-card">
                  <div className="complete-emoji">🎉</div>
                  <h4>Диалог успешно завершён!</h4>
                  <p>Отличная работа! Вы провели полный диалог без ошибок.</p>
                  <div className="dialogue-reward">+50 XP получено!</div>
                  <button
                    className="dialogue-restart-btn"
                    onClick={() => startDialogue(activeDialogue)}
                  >
                    🔄 Пройти ещё раз
                  </button>
                </div>
              )}
            </div>

            {!isCompleted && currentStep && (
              <div className="dialogue-options-drawer">
                <span className="options-title">Выберите ваш ответ:</span>
                <div className="dialogue-options-list">
                  {currentStep.options.map((opt, i) => (
                    <button
                      key={i}
                      className="dialogue-option-btn"
                      onClick={() => handleSelectOption(opt)}
                    >
                      <div className="opt-foreign">{opt.text}</div>
                      {showTranslation && <div className="opt-ru">{opt.textTr}</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
