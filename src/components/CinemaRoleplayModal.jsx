import React, { useState } from 'react';
import { gamification } from '../utils/gamification';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import './CinemaRoleplayModal.css';

const SIMULATIONS = [
  {
    id: 'starbucks',
    title: 'Starbucks в Нью-Йорке',
    sub: 'Заказ сложного напитка у нью-йоркского баристы',
    emoji: '☕',
    tag: 'Повседневная жизнь • A2-B1',
    bgTheme: 'coffee',
    npcName: 'Бариста Майк',
    npcRole: 'Starbucks Broadway NYC',
    npcAvatar: '👨‍🍳',
    steps: [
      {
        npcSaid: 'Hey there! Welcome to Starbucks. What can I get started for you today?',
        npcSaidRu: 'Привет! Добро пожаловать в Старбакс. Что для вас приготовить сегодня?',
        options: [
          { text: 'I want coffee with milk please.', correct: false, feedback: 'Слишком просто и неуверенно. В США принято заказывать конкретный напиток и размер.' },
          { text: 'Can I get a iced vanilla latte with oat milk, Grande size, please?', correct: true, feedback: 'Идеально! Натуральный американский заказ с указанием температуры, сиропа, молока и размера.' },
          { text: 'Give me one tea.', correct: false, feedback: 'Слишком резко, звучит грубо.' },
        ]
      },
      {
        npcSaid: 'You got it! Do you want regular espresso or blonde roast?',
        npcSaidRu: 'Принято! Вам обычный эспрессо или блонд-обжарку?',
        options: [
          { text: 'Blonde roast would be awesome, thanks!', correct: true, feedback: 'Отлично! Вежливое согласие в разговорном американском стиле.' },
          { text: 'I do not understand roast.', correct: false, feedback: 'Лучше переспросить: "What’s the difference?" или выбрать blonde.' },
          { text: 'Coffee is coffee.', correct: false, feedback: 'Звучит немного дерзко для кофейни.' },
        ]
      },
      {
        npcSaid: 'Perfect. And can I get a name for the cup?',
        npcSaidRu: 'Отлично. И как вас зовут (для стаканчика)?',
        options: [
          { text: 'Alex, with an A!', correct: true, feedback: 'Классический ответ в США, чтобы бариста не перепутал буквы.' },
          { text: 'Why do you need my name?', correct: false, feedback: 'В США имя всегда пишут на стаканчике для выдачи заказа.' },
          { text: 'No name.', correct: false, feedback: 'Слишком скрытно для Старбакса :)' },
        ]
      }
    ]
  },
  {
    id: 'jfk_customs',
    title: 'Паспортный контроль JFK',
    sub: 'Прохождение пограничного офицера США в Нью-Йорке',
    emoji: '✈️',
    tag: 'Путешествия • B1-B2',
    bgTheme: 'airport',
    npcName: 'Офицер Миллер',
    npcRole: 'US Customs & Border Protection',
    npcAvatar: '👮‍♂️',
    steps: [
      {
        npcSaid: 'Good afternoon. Passport and customs declaration, please. What is the primary purpose of your visit to the United States?',
        npcSaidRu: 'Добрый день. Паспорт и таможенную декларацию, пожалуйста. Какова основная цель вашего визита в США?',
        options: [
          { text: 'I am here for tourism and visiting friends in Brooklyn for two weeks.', correct: true, feedback: 'Идеально! Четкая цель, локация и точные сроки поездки.' },
          { text: 'I want to live here.', correct: false, feedback: 'Опасный ответ! Офицер заподозрит намерение нелегальной иммиграции.' },
          { text: 'Just walking around.', correct: false, feedback: 'Слишком расплывчато, вызовет дополнительные вопросы.' },
        ]
      },
      {
        npcSaid: 'Where will you be staying during your stay?',
        npcSaidRu: 'Где вы будете проживать во время поездки?',
        options: [
          { text: 'I have a hotel reservation at the Manhattan Grand Hotel. Here is the confirmation.', correct: true, feedback: 'Отлично! Наличие распечатки или брони снимает 100% подозрений.' },
          { text: 'I will find hotel later.', correct: false, feedback: 'Без адреса первого проживания офицер может отказать во въезде.' },
          { text: 'At street.', correct: false, feedback: 'Шутить на границе США категорически не рекомендуется.' },
        ]
      },
      {
        npcSaid: 'Are you bringing any fresh fruits, plants, or meats into the country?',
        npcSaidRu: 'Ввозите ли вы свежие фрукты, растения или мясо в страну?',
        options: [
          { text: 'No, officer. Nothing prohibited, just personal clothes and electronics.', correct: true, feedback: 'Отлично и убедительно! Вежливое обращение "officer".' },
          { text: 'Maybe a little sandwich from plane.', correct: false, feedback: 'Любые мясные бутерброды из самолета подлежат конфискации и штрафу.' },
          { text: 'I don’t know what is in bag.', correct: false, feedback: 'Вы всегда должны знать содержимое своего багажа.' },
        ]
      }
    ]
  },
  {
    id: 'google_interview',
    title: 'Собеседование в Google',
    sub: 'Техническое поведенческое интервью в Кремниевой Долине',
    emoji: '💼',
    tag: 'Карьера и IT • B2-C1',
    bgTheme: 'tech',
    npcName: 'Сара Чен',
    npcRole: 'Engineering Manager, Google Cloud',
    npcAvatar: '👩‍💻',
    steps: [
      {
        npcSaid: 'Hi! Great to meet you. Tell me about a time when a critical system went down and how you prioritized resolving it.',
        npcSaidRu: 'Привет! Рада знакомству. Расскажите о случае, когда критическая система упала, и как вы расставили приоритеты.',
        options: [
          { text: 'I panicked and restarted the server.', correct: false, feedback: 'Не демонстрирует аналитический подход и спокойствие.' },
          { text: 'First, I rolled back the bad deployment to mitigate customer impact, then analyzed the logs with the team to identify the root cause.', correct: true, feedback: 'Великолепно! Использована правильная методология: откат (rollback), митигация и поиск первопричины (root cause).' },
          { text: 'It was my colleague’s fault.', correct: false, feedback: 'Перекладывание вины — красный флаг на интервью.' },
        ]
      },
      {
        npcSaid: 'Impressive response. How do you handle disagreements on system architecture with senior engineers?',
        npcSaidRu: 'Впечатляет. Как вы справляетесь с разногласиями по архитектуре с более опытными инженерами?',
        options: [
          { text: 'I rely on data and benchmarks, write a quick RFC doc, and discuss trade-offs objectively.', correct: true, feedback: 'Золотой стандарт Кремниевой долины: опора на метрики (data-driven), RFC и оценка компромиссов (trade-offs).' },
          { text: 'I just do whatever they say.', correct: false, feedback: 'Пассивность не ценится на уровнях Mid/Senior.' },
          { text: 'I argue until they agree.', correct: false, feedback: 'Конфликтность разрушает командную работу.' },
        ]
      }
    ]
  },
  {
    id: 'nyc_cab',
    title: 'Жёлтое такси на Манхэттене',
    sub: 'Поездка в час пик по оживлённым улицам Нью-Йорка',
    emoji: '🚕',
    tag: 'Городская жизнь • A2-B1',
    bgTheme: 'taxi',
    npcName: 'Сэл',
    npcRole: 'NYC Yellow Taxi Driver',
    npcAvatar: '🧢',
    steps: [
      {
        npcSaid: 'Hop in! Where to, buddy?',
        npcSaidRu: 'Запрыгивай! Куда едем, друг?',
        options: [
          { text: 'Take me to 5th Avenue and 42nd Street, near the Public Library, please.', correct: true, feedback: 'Идеально! В Нью-Йорке всегда называют перекресток (cross streets).' },
          { text: 'Drive around New York.', correct: false, feedback: 'Водитель включит счетчик и будет катать кругами.' },
          { text: 'To my hotel.', correct: false, feedback: 'Водитель не знает, какой именно у вас отель.' },
        ]
      },
      {
        npcSaid: 'Broadway is completely jammed right now. Mind if we take the FDR Drive instead?',
        npcSaidRu: 'Бродвей сейчас наглухо стоит в пробке. Не против, если поедем по скоростной FDR Drive?',
        options: [
          { text: 'Sure thing, whatever gets us there faster!', correct: true, feedback: 'Натуральная американская фраза "Sure thing" (Конечно, без проблем).' },
          { text: 'No, I want stay in jam.', correct: false, feedback: 'Нелогичный ответ.' },
          { text: 'FDR is who?', correct: false, feedback: 'FDR Drive — это известная восточная набережная Манхэттена.' },
        ]
      }
    ]
  }
];

export default function CinemaRoleplayModal({ isOpen, onClose }) {
  const [activeSim, setActiveSim] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [simCompleted, setSimCompleted] = useState(false);
  const [score, setScore] = useState(0);

  if (!isOpen) return null;

  const startSimulation = (sim) => {
    setActiveSim(sim);
    setStepIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setSimCompleted(false);
    setScore(0);
    sounds.playTap?.();
    haptics.medium();

    // Voice NPC Greeting
    if (sim.steps[0]) {
      setTimeout(() => {
        speakText(sim.steps[0].npcSaid, 'en-US');
      }, 350);
    }
  };

  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    setSelectedOpt(opt);
    setIsAnswered(true);

    if (opt.correct) {
      sounds.playCorrect?.();
      haptics.celebrate();
      setScore((s) => s + 1);
    } else {
      sounds.playWrong?.();
      haptics.error();
    }
  };

  const handleNextStep = () => {
    if (stepIdx + 1 < activeSim.steps.length) {
      const nextStep = stepIdx + 1;
      setStepIdx(nextStep);
      setSelectedOpt(null);
      setIsAnswered(false);
      sounds.playTap?.();
      haptics.light();

      setTimeout(() => {
        speakText(activeSim.steps[nextStep].npcSaid, 'en-US');
      }, 250);
    } else {
      setSimCompleted(true);
      gamification.addXP(45);
      gamification.addGems(20);
      sounds.playComplete?.();
      haptics.celebrate();
    }
  };

  const currentStepData = activeSim?.steps[stepIdx];

  return (
    <div className="cinema-modal-overlay" onClick={onClose}>
      <div className="cinema-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cinema-modal-header">
          <div className="cinema-header-title">
            <span className="cinema-sparkle">🎬</span>
            <div>
              <h3>Linguo Real-Life 3D Simulations</h3>
              <p>Интерактивные сцены из жизни в США</p>
            </div>
          </div>
          <button className="cinema-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="cinema-modal-body">
          {!activeSim ? (
            /* Scenarios Grid Catalog */
            <div className="cinema-catalog-view animate-pop">
              <div className="catalog-hero-box">
                <span className="hero-emoji">🗽</span>
                <h2>Погрузитесь в настоящую Америку</h2>
                <p>
                  Тренируйте разговорные навыки в реальных жизненных ситуациях с носителями языка,
                  американским акцентом и культурными особенностями.
                </p>
              </div>

              <div className="simulations-grid">
                {SIMULATIONS.map((sim) => (
                  <div
                    key={sim.id}
                    className={`sim-card theme-${sim.bgTheme}`}
                    onClick={() => startSimulation(sim)}
                  >
                    <div className="sim-top-row">
                      <span className="sim-emoji">{sim.emoji}</span>
                      <span className="sim-tag">{sim.tag}</span>
                    </div>
                    <h4>{sim.title}</h4>
                    <p>{sim.sub}</p>
                    <div className="sim-footer">
                      <span className="sim-npc-meta">{sim.npcAvatar} {sim.npcRole}</span>
                      <button className="sim-play-pill">Старт ➔</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : simCompleted ? (
            /* Simulation Complete Screen */
            <div className="cinema-finish-card animate-pop">
              <span className="finish-trophy">🏆</span>
              <h2>Сцена успешно пройдена!</h2>
              <p>
                Вы отлично справились с ситуацией <strong>«{activeSim.title}»</strong> и проявили себя как уверенный спикер.
              </p>
              <div className="finish-rewards-box">
                <span>⚡ +45 XP</span>
                <span>💎 +20 Кристаллов</span>
                <span>⭐ Точность: {Math.round((score / activeSim.steps.length) * 100)}%</span>
              </div>
              <button
                className="finish-back-btn"
                onClick={() => setActiveSim(null)}
              >
                Вернуться к выбору ситуаций
              </button>
            </div>
          ) : (
            /* Active Simulation Scene */
            <div className={`cinema-scene-stage animate-in theme-${activeSim.bgTheme}`}>
              {/* Scene Progress */}
              <div className="scene-top-hud">
                <button className="scene-back-link" onClick={() => setActiveSim(null)}>
                  ← Выход
                </button>
                <div className="scene-step-pill">
                  Шаг {stepIdx + 1} из {activeSim.steps.length}
                </div>
              </div>

              {/* NPC Speech Card */}
              <div className="npc-speech-bubble animate-pop">
                <div className="npc-speaker-header">
                  <span className="npc-avatar-badge">{activeSim.npcAvatar}</span>
                  <div>
                    <strong>{activeSim.npcName}</strong>
                    <small>{activeSim.npcRole}</small>
                  </div>
                  <button
                    className="npc-replay-audio"
                    onClick={() => speakText(currentStepData.npcSaid, 'en-US')}
                    title="Повторить озвучку"
                  >
                    🔊
                  </button>
                </div>
                <p className="npc-line-en">"{currentStepData.npcSaid}"</p>
                <p className="npc-line-ru">{currentStepData.npcSaidRu}</p>
              </div>

              {/* User Dialogue Choices */}
              <div className="user-choices-box">
                <span className="choices-label">Ваш ответ баристе/офицеру:</span>
                <div className="choices-stack">
                  {currentStepData.options.map((opt, oIdx) => {
                    let optClass = '';
                    if (isAnswered) {
                      if (opt.correct) optClass = 'correct';
                      else if (selectedOpt === opt) optClass = 'wrong';
                    }
                    return (
                      <button
                        key={oIdx}
                        className={`dialogue-opt-btn ${optClass}`}
                        onClick={() => handleSelectOption(opt)}
                        disabled={isAnswered}
                      >
                        <span className="opt-indicator">{isAnswered ? (opt.correct ? '✓' : '✕') : '💬'}</span>
                        <span className="opt-text">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Drawer */}
              {isAnswered && (
                <div className={`scene-feedback-card animate-pop ${selectedOpt?.correct ? 'success' : 'warning'}`}>
                  <div className="sfc-title">
                    {selectedOpt?.correct ? '🎉 Отличный выбор!' : '💡 Совет носителя языка:'}
                  </div>
                  <p className="sfc-desc">{selectedOpt?.feedback}</p>
                  <button className="sfc-next-btn" onClick={handleNextStep}>
                    {stepIdx + 1 >= activeSim.steps.length ? 'Завершить сцену 🏆' : 'Продолжить ➔'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
