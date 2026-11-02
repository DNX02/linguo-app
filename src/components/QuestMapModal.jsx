import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import './QuestMapModal.css';

const QUEST_NODES = [
  {
    id: 1,
    title: 'Основы: Приветствия',
    desc: 'Hello, How are you, Goodbye',
    icon: '🐣',
    level: 'A1',
    xp: 30,
    questions: [
      { q: 'Как переводится «Good morning»?', opts: ['Добрый вечер', 'Доброе утро', 'Спокойной ночи'], c: 1 },
      { q: 'Выберите верный перевод: «How are you?»', opts: ['Где ты?', 'Как твои дела?', 'Сколько это стоит?'], c: 1 },
      { q: 'Что ответить на «Nice to meet you»?', opts: ['Nice to meet you too!', 'Good night', 'I am at home'], c: 0 },
    ]
  },
  {
    id: 2,
    title: 'В кофейне и ресторанах',
    desc: 'Заказ кофе, счет и меню',
    icon: '☕',
    level: 'A1',
    xp: 35,
    questions: [
      { q: 'Как вежливо попросить кофе?', opts: ['Give me coffee now', 'Can I please have a coffee?', 'Coffee is bad'], c: 1 },
      { q: 'Что значит «Could I have the check, please?»', opts: ['Можно счёт, пожалуйста?', 'Где туалет?', 'Кофе невкусный'], c: 0 },
      { q: 'Как сказать «Я оплачу картой»?', opts: ['I pay by card', 'I have no money', 'Where is bank'], c: 0 },
    ]
  },
  {
    id: 3,
    title: 'Остров сокровищ',
    desc: 'Бонусный сундук с кристаллами',
    icon: '🎁',
    isChest: true,
    xp: 50,
  },
  {
    id: 4,
    title: 'Путешествия и Отель',
    desc: 'Регистрация, паспорт и багаж',
    icon: '✈️',
    level: 'A2',
    xp: 40,
    questions: [
      { q: 'Как спросить о времени завтрака?', opts: ['What time is breakfast?', 'Where is lunch?', 'I like food'], c: 0 },
      { q: 'Перевод «boarding pass»:', opts: ['Паспортный контроль', 'Посадочный талон', 'Билет на поезд'], c: 1 },
      { q: 'Что сказать при заселении в отель?', opts: ['I have a reservation under my name', 'I want to sleep outside', 'Goodbye!'], c: 0 },
    ]
  },
  {
    id: 5,
    title: 'Карьера и Собеседование',
    desc: 'Опыт работы, навыки и цели',
    icon: '💼',
    level: 'B1',
    xp: 45,
    questions: [
      { q: '«My biggest strength is...» переводится как:', opts: ['Моя главная слабость...', 'Моя сильная сторона...', 'Я устал...'], c: 1 },
      { q: 'Что означает «team player»?', opts: ['Одиночка', 'Умеющий работать в команде', 'Футболист'], c: 1 },
      { q: 'Как сказать «У меня 3 года опыта»?', opts: ['I have 3 years of experience', 'I worked 3 days', '3 years ago I left'], c: 0 },
    ]
  },
  {
    id: 6,
    title: 'Битва с боссом: Duo Bot',
    desc: 'Финальный рубеж главы',
    icon: '👑',
    level: 'B1-B2',
    xp: 60,
    questions: [
      { q: 'Выберите грамматически верное предложение:', opts: ['She don\'t likes apples', 'She doesn\'t like apples', 'She not like apples'], c: 1 },
      { q: 'Вставьте верный предлог: «I am interested ... languages»', opts: ['on', 'at', 'in'], c: 2 },
      { q: 'Значение идиомы «Piece of cake»:', opts: ['Кусок торта', 'Очень простое дело (пустяк)', 'Печь пирог'], c: 1 },
    ]
  }
];

export default function QuestMapModal({ isOpen, onClose }) {
  const [completedNodeIds, setCompletedNodeIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('linguo_quest_progress') || '[1]');
    } catch (_) {
      return [1];
    }
  });

  const [activeQuizNode, setActiveQuizNode] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);

  useEffect(() => {
    localStorage.setItem('linguo_quest_progress', JSON.stringify(completedNodeIds));
  }, [completedNodeIds]);

  if (!isOpen) return null;

  const handleNodeClick = (node) => {
    sounds.playTap?.();
    haptics.light();

    // Check if node is unlocked
    const maxUnlocked = Math.max(...completedNodeIds, 1);
    if (node.id > maxUnlocked && !completedNodeIds.includes(node.id)) {
      sounds.playWrong?.();
      haptics.error();
      return;
    }

    if (node.isChest) {
      // Bonus chest
      if (!chestOpened) {
        setChestOpened(true);
        gamification.addGems(35);
        gamification.addXP(node.xp);
        sounds.playComplete?.();
        haptics.celebrate();
        if (!completedNodeIds.includes(node.id)) {
          setCompletedNodeIds((prev) => [...prev, node.id, node.id + 1]);
        }
      }
      return;
    }

    // Launch Quiz for node
    setActiveQuizNode(node);
    setQIndex(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  const handleOptionSelect = (optIndex, correctIndex) => {
    if (isAnswered) return;
    setSelectedOpt(optIndex);
    setIsAnswered(true);

    if (optIndex === correctIndex) {
      sounds.playCorrect?.();
      haptics.celebrate();
    } else {
      sounds.playWrong?.();
      haptics.error();
    }
  };

  const handleNextQuestion = () => {
    sounds.playTap?.();
    haptics.light();
    if (qIndex + 1 >= activeQuizNode.questions.length) {
      // Finished node
      setQuizFinished(true);
      gamification.addXP(activeQuizNode.xp);
      gamification.addGems(15);
      sounds.playComplete?.();
      haptics.celebrate();

      if (!completedNodeIds.includes(activeQuizNode.id)) {
        setCompletedNodeIds((prev) => [...prev, activeQuizNode.id, activeQuizNode.id + 1]);
      }
    } else {
      setQIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    }
  };

  const currentQ = activeQuizNode?.questions ? activeQuizNode.questions[qIndex] : null;
  const maxUnlocked = Math.max(...completedNodeIds, 1);

  return (
    <div className="quest-overlay" onClick={onClose}>
      <div className="quest-modal animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="quest-header">
          <div>
            <h3>🗺️ Карта приключений Linguo</h3>
            <p className="quest-sub">Проходи уровни, открывай сундуки и сокрушай боссов</p>
          </div>
          <button className="quest-close-btn" onClick={onClose}>✕</button>
        </div>

        {activeQuizNode ? (
          /* Active Node Quiz Walkthrough */
          <div className="quest-quiz-container">
            {quizFinished ? (
              <div className="quest-finish-screen animate-pop">
                <span className="qf-crown">⭐</span>
                <h3>Уровень пройден!</h3>
                <p>Вы успешно завершили этап «{activeQuizNode.title}»</p>
                <div className="qf-reward">
                  <span>⚡ +{activeQuizNode.xp} XP</span>
                  <span>💎 +15 Кристаллов</span>
                </div>
                <button
                  className="quest-continue-btn"
                  onClick={() => setActiveQuizNode(null)}
                >
                  Вернуться на карту
                </button>
              </div>
            ) : (
              <div className="quest-quiz-body animate-in">
                <div className="quest-quiz-meta">
                  <span className="qq-badge">{activeQuizNode.title}</span>
                  <span className="qq-counter">
                    Вопрос {qIndex + 1} из {activeQuizNode.questions.length}
                  </span>
                </div>

                <h3 className="qq-question">{currentQ.q}</h3>

                <div className="qq-options-grid">
                  {currentQ.opts.map((opt, idx) => {
                    let optClass = '';
                    if (isAnswered) {
                      if (idx === currentQ.c) optClass = 'correct';
                      else if (idx === selectedOpt) optClass = 'wrong';
                    }
                    return (
                      <button
                        key={idx}
                        className={`qq-opt-btn ${optClass}`}
                        onClick={() => handleOptionSelect(idx, currentQ.c)}
                        disabled={isAnswered}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="qq-footer">
                  <button
                    className="quest-next-btn"
                    onClick={handleNextQuestion}
                    disabled={!isAnswered}
                  >
                    {qIndex + 1 >= activeQuizNode.questions.length ? 'Завершить 🏆' : 'Далее →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Winding Quest Adventure Map */
          <div className="quest-map-stage">
            <div className="quest-path-line" />

            <div className="quest-nodes-list">
              {QUEST_NODES.map((node, i) => {
                const isCompleted = completedNodeIds.includes(node.id);
                const isCurrent = node.id === maxUnlocked && !isCompleted;
                const isLocked = node.id > maxUnlocked && !isCompleted;

                // Alternate horizontal offset for winding snake trail
                const offsets = [0, 50, -45, 40, -40, 0];
                const xOffset = offsets[i % offsets.length] || 0;

                return (
                  <div
                    key={node.id}
                    className={`quest-node-wrapper ${isCurrent ? 'current' : ''}`}
                    style={{ transform: `translateX(${xOffset}px)` }}
                    onClick={() => handleNodeClick(node)}
                  >
                    <div
                      className={`quest-node-orb ${
                        isCompleted ? 'completed' : isCurrent ? 'active' : 'locked'
                      }`}
                    >
                      <span className="orb-icon">{isLocked ? '🔒' : node.icon}</span>
                      {isCompleted && <span className="orb-star">⭐</span>}
                    </div>

                    <div className="quest-node-info">
                      <strong className="node-title">{node.title}</strong>
                      <span className="node-desc">{node.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
