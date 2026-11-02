import React, { useState, useEffect } from 'react';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import { gamification } from '../utils/gamification';
import './StoriesModal.css';

const STORIES = [
  {
    id: 'suitcase',
    title: 'Чужой чемодан',
    titleEn: 'The Lost Suitcase',
    icon: '🧳',
    level: 'A1-A2',
    xp: 40,
    characters: {
      anna: { name: 'Анна', emoji: '👩', lang: 'en' },
      agent: { name: 'Служащий аэропорта', emoji: '👮‍♂️', lang: 'en' }
    },
    lines: [
      { speaker: 'anna', text: 'Excuse me, sir! I think there is a big mistake with my luggage.', ru: 'Простите, сэр! Кажется, произошла большая ошибка с моим багажом.' },
      { speaker: 'agent', text: 'Hello ma\'am. What happened to your suitcase?', ru: 'Здравствуйте, мэм. Что случилось с вашим чемоданом?' },
      { speaker: 'anna', text: 'I opened it in the taxi and found five pairs of men\'s hiking boots and a fishing rod!', ru: 'Я открыла его в такси и нашла пять пар мужских походных ботинок и удочку!' },
      {
        type: 'checkpoint',
        question: 'Что Анна нашла внутри чемодана?',
        options: [
          'Свои любимые платья и книги',
          'Мужские походные ботинки и удочку',
          'Много денег и документов'
        ],
        correctIndex: 1
      },
      { speaker: 'agent', text: 'Oh! That certainly does not sound like your luggage. What color is your bag?', ru: 'Оу! Это точно не ваш багаж. Какого цвета была ваша сумка?' },
      { speaker: 'anna', text: 'Mine is bright pink with a yellow butterfly sticker on top!', ru: 'Мой — ярко-розовый с жёлтой наклейкой-бабочкой сверху!' },
      { speaker: 'agent', text: 'Wait a moment... Yes! A gentleman just brought in a bright pink bag two minutes ago!', ru: 'Минутку... Да! Какой-то джентльмен только что принёс ярко-розовую сумку две минуты назад!' },
      { speaker: 'anna', text: 'Thank goodness! That is my suitcase! You saved my vacation!', ru: 'Слава богу! Это мой чемодан! Вы спасли мой отпуск!' }
    ]
  },
  {
    id: 'cafe',
    title: 'Не тот кофе',
    titleEn: 'The Wrong Order',
    icon: '☕',
    level: 'A1-A2',
    xp: 35,
    characters: {
      mark: { name: 'Марк', emoji: '🧑', lang: 'en' },
      barista: { name: 'Бариста', emoji: '☕', lang: 'en' }
    },
    lines: [
      { speaker: 'barista', text: 'Large caramel iced latte with extra whipped cream for Mark!', ru: 'Большой карамельный айс-латте со взбитыми сливками для Марка!' },
      { speaker: 'mark', text: 'Wait, I ordered a small black Americano with no sugar.', ru: 'Подождите, я заказывал маленький чёрный американо без сахара.' },
      { speaker: 'barista', text: 'Oh, are you Mark from accounting or Mark from design?', ru: 'О, вы Марк из бухгалтерии или Марк из отдела дизайна?' },
      {
        type: 'checkpoint',
        question: 'Какой кофе на самом деле заказывал Марк?',
        options: [
          'Сладкий карамельный латте со сливками',
          'Маленький чёрный американо без сахара',
          'Зелёный чай с лимоном'
        ],
        correctIndex: 1
      },
      { speaker: 'mark', text: 'I don\'t work here at all! I\'m just a tourist from Germany.', ru: 'Я здесь вообще не работаю! Я просто турист из Германии.' },
      { speaker: 'barista', text: 'Haha, my apologies! Let me brew you a fresh Americano right away on the house.', ru: 'Ха-ха, прошу прощения! Сейчас же сварю вам свежий американо за счёт заведения.' },
      { speaker: 'mark', text: 'That is very generous of you. Thank you!', ru: 'Это очень щедро с вашей стороны. Спасибо!' }
    ]
  },
  {
    id: 'keys',
    title: 'Забытые ключи',
    titleEn: 'Locked Out',
    icon: '🔑',
    level: 'A2-B1',
    xp: 45,
    characters: {
      lisa: { name: 'Лиза', emoji: '👩', lang: 'en' },
      tom: { name: 'Том', emoji: '👨', lang: 'en' }
    },
    lines: [
      { speaker: 'lisa', text: 'Tom, please tell me you didn\'t leave the apartment keys on the kitchen table.', ru: 'Том, пожалуйста, скажи мне, что ты не оставил ключи от квартиры на кухонном столе.' },
      { speaker: 'tom', text: 'I thought you put them in your backpack before we left for the cinema!', ru: 'Я думал, ты положила их в свой рюкзак перед выходом в кино!' },
      { speaker: 'lisa', text: 'It\'s raining outside and our phone batteries are down to five percent.', ru: 'На улице дождь, а наши телефоны разряжены до пяти процентов.' },
      {
        type: 'checkpoint',
        question: 'В какой ситуации оказались Лиза и Том?',
        options: [
          'Они потерялись в кинотеатре',
          'Они заперты снаружи под дождем без ключей',
          'У них угнали автомобиль'
        ],
        correctIndex: 1
      },
      { speaker: 'tom', text: 'Wait! Do you remember Mrs. Gable, our neighbor on the second floor?', ru: 'Подожди! Ты помнишь миссис Гейбл, нашу соседку со второго этажа?' },
      { speaker: 'lisa', text: 'Yes, we gave her a spare key last summer for watering our plants!', ru: 'Да, прошлым летом мы дали ей запасной ключ, чтобы она поливала наши цветы!' },
      { speaker: 'tom', text: 'Her light is still on. We are saved!', ru: 'У неё всё ещё горит свет. Мы спасены!' }
    ]
  }
];

export default function StoriesModal({ isOpen, onClose }) {
  const [activeStory, setActiveStory] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setActiveStory(null);
      setStepIndex(0);
      setIsFinished(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectStory = (story) => {
    sounds.playTap?.();
    haptics.light();
    setActiveStory(story);
    setStepIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  const handleNextLine = () => {
    if (!activeStory) return;
    sounds.playTap?.();
    haptics.light();

    if (stepIndex + 1 >= activeStory.lines.length) {
      setIsFinished(true);
      gamification.addXP(activeStory.xp);
      sounds.playComplete?.();
      haptics.celebrate();
    } else {
      setStepIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleOptionClick = (optIdx, correctIdx) => {
    if (isAnswered) return;
    setSelectedOption(optIdx);
    setIsAnswered(true);

    if (optIdx === correctIdx) {
      sounds.playCorrect?.();
      haptics.celebrate();
      gamification.addXP(10);
    } else {
      sounds.playWrong?.();
      haptics.error();
    }
  };

  const currentItem = activeStory ? activeStory.lines[stepIndex] : null;

  return (
    <div className="stories-overlay" onClick={onClose}>
      <div className="stories-modal animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="stories-header">
          <div>
            <h3>📖 Linguo Stories</h3>
            <p className="stories-sub">Интерактивные аудио-истории и диалоги</p>
          </div>
          <button className="stories-close-btn" onClick={onClose}>✕</button>
        </div>

        {!activeStory ? (
          /* Story Catalog Selection */
          <div className="stories-catalog">
            <div className="catalog-banner">
              <span className="banner-icon">🎧</span>
              <div>
                <strong>Слушай живую речь персонажей</strong>
                <p>Отвечай на вопросы по ходу сюжета и зарабатывай +XP!</p>
              </div>
            </div>

            <div className="stories-grid">
              {STORIES.map((story) => (
                <div
                  key={story.id}
                  className="story-catalog-card"
                  onClick={() => handleSelectStory(story)}
                >
                  <div className="story-card-top">
                    <span className="story-icon">{story.icon}</span>
                    <span className="story-level-badge">{story.level}</span>
                  </div>
                  <h4 className="story-card-title">{story.title}</h4>
                  <div className="story-card-en">{story.titleEn}</div>
                  <div className="story-card-xp">⚡ +{story.xp} XP</div>
                </div>
              ))}
            </div>
          </div>
        ) : isFinished ? (
          /* Finished Story Celebration */
          <div className="story-finish-card animate-pop">
            <span className="finish-emoji">🎉</span>
            <h3>История пройдена!</h3>
            <p>Вы отлично справились с пониманием речи на слух.</p>
            <div className="finish-xp-pill">+{activeStory.xp} XP начислено</div>
            <button
              className="story-continue-btn"
              onClick={() => setActiveStory(null)}
            >
              Выбрать другую историю
            </button>
          </div>
        ) : (
          /* Interactive Story Walkthrough */
          <div className="story-player">
            {/* Top Progress bar */}
            <div className="story-progress-bar">
              <div
                className="story-progress-fill"
                style={{
                  width: `${((stepIndex + 1) / activeStory.lines.length) * 100}%`,
                }}
              />
            </div>

            <div className="story-lines-container">
              {/* Render lines up to current */}
              {activeStory.lines.slice(0, stepIndex + 1).map((line, idx) => {
                if (line.type === 'checkpoint') {
                  const isCurrentCheckpoint = idx === stepIndex;
                  return (
                    <div key={idx} className="story-checkpoint-box animate-pop">
                      <div className="checkpoint-badge">❓ Вопрос на понимание:</div>
                      <h4 className="checkpoint-q">{line.question}</h4>
                      <div className="checkpoint-options">
                        {line.options.map((opt, oIdx) => {
                          let optClass = '';
                          if (isAnswered && isCurrentCheckpoint) {
                            if (oIdx === line.correctIndex) optClass = 'correct';
                            else if (oIdx === selectedOption) optClass = 'wrong';
                          }
                          return (
                            <button
                              key={oIdx}
                              className={`checkpoint-opt-btn ${optClass}`}
                              onClick={() => handleOptionClick(oIdx, line.correctIndex)}
                              disabled={isAnswered || !isCurrentCheckpoint}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                const char = activeStory.characters[line.speaker] || {
                  name: 'Персонаж',
                  emoji: '🗣️',
                };
                return (
                  <div key={idx} className="story-bubble-row animate-in">
                    <span className="story-char-avatar">{char.emoji}</span>
                    <div className="story-bubble">
                      <div className="story-bubble-header">
                        <strong>{char.name}</strong>
                        <button
                          className="story-audio-btn"
                          onClick={() => {
                            speakText(line.text, char.lang || 'en');
                            haptics.light();
                          }}
                        >
                          🔊
                        </button>
                      </div>
                      <div className="story-bubble-text">{line.text}</div>
                      <div className="story-bubble-ru">{line.ru}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom action button */}
            <div className="story-player-footer">
              <button
                className="story-back-btn"
                onClick={() => setActiveStory(null)}
              >
                ✕ Выход
              </button>
              {currentItem?.type === 'checkpoint' ? (
                <button
                  className="story-next-btn"
                  onClick={handleNextLine}
                  disabled={!isAnswered}
                >
                  Далее →
                </button>
              ) : (
                <button className="story-next-btn" onClick={handleNextLine}>
                  {stepIndex + 1 >= activeStory.lines.length ? 'Завершить 🏆' : 'Продолжить →'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
