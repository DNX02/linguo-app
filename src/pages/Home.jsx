import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllCards,
  getCardsForReview,
  addCard,
  getDailyProgress,
  getSettings,
  saveSetting,
} from '../db';
import wordsData from '../data/words';
import { api } from '../utils/api';
import { gamification } from '../utils/gamification';
import AuthModal from '../components/AuthModal';
import WordManagerModal from '../components/WordManagerModal';
import DictionaryModal from '../components/DictionaryModal';
import MatchGameModal from '../components/MatchGameModal';
import ShareAchievementModal from '../components/ShareAchievementModal';
import DialoguesModal from '../components/DialoguesModal';
import IrregularVerbsModal from '../components/IrregularVerbsModal';
import SentenceBuilderModal from '../components/SentenceBuilderModal';
import PronunciationModal from '../components/PronunciationModal';
import VoiceTutorModal from '../components/VoiceTutorModal';
import StoriesModal from '../components/StoriesModal';
import WordBattleModal from '../components/WordBattleModal';
import HandsFreeModal from '../components/HandsFreeModal';
import QuestMapModal from '../components/QuestMapModal';
import LeaderboardModal from '../components/LeaderboardModal';
import ShopModal from '../components/ShopModal';
import VoiceMessengerModal from '../components/VoiceMessengerModal';
import SmartReaderModal from '../components/SmartReaderModal';
import CertificationModal from '../components/CertificationModal';
import CinemaRoleplayModal from '../components/CinemaRoleplayModal';
import MascotWardrobeModal from '../components/MascotWardrobeModal';
import SlangVaultModal from '../components/SlangVaultModal';
import { MASCOT_SKINS } from '../utils/gamification';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import './Home.css';

const DUO_NODES = [
  {
    id: 1,
    title: 'Знакомство',
    sub: 'Hello, Name, Nice to meet you',
    icon: '⭐',
    type: 'quiz',
    level: 'A1',
    xp: 20,
    xOffset: 0,
    questions: [
      { q: 'Как переводится «Good morning»?', opts: ['Добрый вечер', 'Доброе утро', 'Спокойной ночи'], c: 1 },
      { q: 'Выберите верный перевод: «How are you?»', opts: ['Где ты?', 'Как твои дела?', 'Сколько это стоит?'], c: 1 },
      { q: 'Что ответить на «Nice to meet you»?', opts: ['Nice to meet you too!', 'Good night', 'I am at home'], c: 0 },
    ]
  },
  {
    id: 2,
    title: 'В кофейне',
    sub: 'Coffee, Please, Card payment',
    icon: '☕',
    type: 'quiz',
    level: 'A1',
    xp: 25,
    xOffset: 55,
    questions: [
      { q: 'Как вежливо попросить кофе?', opts: ['Give me coffee now', 'Can I please have a coffee?', 'Coffee is bad'], c: 1 },
      { q: 'Что значит «Could I have the check, please?»', opts: ['Можно счёт, пожалуйста?', 'Где туалет?', 'Кофе невкусный'], c: 0 },
      { q: 'Как сказать «Я оплачу картой»?', opts: ['I pay by card', 'I have no money', 'Where is bank'], c: 0 },
    ]
  },
  {
    id: 3,
    title: 'Звонок Emma (ИИ)',
    sub: 'Живой голосовой диалог в реальном времени',
    icon: '🎙️',
    type: 'voice_call',
    level: 'A1-A2',
    xp: 40,
    isSpecial: true,
    xOffset: -45,
  },
  {
    id: 4,
    title: 'Сундук сокровищ',
    sub: 'Бонусные кристаллы и опыт',
    icon: '🎁',
    type: 'chest',
    xp: 50,
    xOffset: 45,
  },
  {
    id: 5,
    title: 'В аэропорту',
    sub: 'Passport, Flight, Hotel',
    icon: '✈️',
    type: 'quiz',
    level: 'A2',
    xp: 30,
    xOffset: -40,
    questions: [
      { q: 'Как спросить о времени завтрака?', opts: ['What time is breakfast?', 'Where is lunch?', 'I like food'], c: 0 },
      { q: 'Перевод «boarding pass»:', opts: ['Паспортный контроль', 'Посадочный талон', 'Билет на поезд'], c: 1 },
      { q: 'Что сказать при заселении в отель?', opts: ['I have a reservation under my name', 'I want to sleep outside', 'Goodbye!'], c: 0 },
    ]
  },
  {
    id: 6,
    title: 'Экзамен Главы 1',
    sub: 'Финальная битва за золотую корону',
    icon: '👑',
    type: 'boss',
    level: 'A2',
    xp: 60,
    xOffset: 0,
    questions: [
      { q: 'Выберите грамматически верное предложение:', opts: ['She don\'t likes apples', 'She doesn\'t like apples', 'She not like apples'], c: 1 },
      { q: 'Вставьте верный предлог: «I am interested ... languages»', opts: ['on', 'at', 'in'], c: 2 },
      { q: 'Значение идиомы «Piece of cake»:', opts: ['Кусок торта', 'Очень простое дело (пустяк)', 'Печь пирог'], c: 1 },
    ]
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [reviewCount, setReviewCount] = useState(0);
  const [streak, setStreak] = useState(() => gamification.getStreak());
  const [gems, setGems] = useState(() => gamification.getGems());
  const [hearts, setHearts] = useState(5);
  const [language, setLanguage] = useState('en');
  const [level, setLevel] = useState('A1');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Path progression state
  const [completedNodes, setCompletedNodes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('linguo_duo_path') || '[1]');
    } catch (_) {
      return [1];
    }
  });

  const [activeNodeBalloon, setActiveNodeBalloon] = useState(null);

  // Lesson quiz in-page overlay
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWordManagerOpen, setIsWordManagerOpen] = useState(false);
  const [isDictOpen, setIsDictOpen] = useState(false);
  const [isMatchOpen, setIsMatchOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDialoguesOpen, setIsDialoguesOpen] = useState(false);
  const [isIrregularOpen, setIsIrregularOpen] = useState(false);
  const [isSentenceOpen, setIsSentenceOpen] = useState(false);
  const [isPronounceOpen, setIsPronounceOpen] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [isBattleOpen, setIsBattleOpen] = useState(false);
  const [isHandsFreeOpen, setIsHandsFreeOpen] = useState(false);
  const [isQuestMapOpen, setIsQuestMapOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isVoiceMessengerOpen, setIsVoiceMessengerOpen] = useState(false);
  const [isSmartReaderOpen, setIsSmartReaderOpen] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isSlangOpen, setIsSlangOpen] = useState(false);
  const [mascotSkin, setMascotSkin] = useState(() => gamification.getMascotSkin());

  const isMountedRef = useRef(true);

  useEffect(() => {
    localStorage.setItem('linguo_duo_path', JSON.stringify(completedNodes));
  }, [completedNodes]);

  const refreshStats = useCallback(async () => {
    try {
      const reviewCards = await getCardsForReview();
      if (isMountedRef.current) {
        setReviewCount(reviewCards.length);
        setStreak(gamification.getStreak());
        setGems(gamification.getGems());
        setUser(api.getCurrentUser());
      }
      const savedLang = await getSettings('language');
      const savedLevel = await getSettings('level');
      if (isMountedRef.current) {
        if (savedLang) setLanguage(savedLang);
        if (savedLevel) setLevel(savedLevel);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const init = async () => {
      setLoading(false);
      refreshStats();
    };
    init();
    return () => {
      isMountedRef.current = false;
    };
  }, [refreshStats]);

  const handleLanguageChange = async (newLang) => {
    sounds.playTap?.();
    haptics.light();
    setLanguage(newLang);
    await saveSetting('language', newLang);
  };

  const handleNodeClick = (node) => {
    sounds.playTap?.();
    haptics.light();

    const maxUnlocked = Math.max(...completedNodes, 1);
    if (node.id > maxUnlocked && !completedNodes.includes(node.id)) {
      sounds.playWrong?.();
      haptics.error();
      return;
    }

    if (node.type === 'chest') {
      if (!completedNodes.includes(node.id)) {
        gamification.addGems(40);
        gamification.addXP(node.xp);
        setGems(gamification.getGems());
        sounds.playComplete?.();
        haptics.celebrate();
        setCompletedNodes((prev) => [...prev, node.id, node.id + 1]);
        alert('🎉 Вы открыли сундук! Получено: +40 💎 и +50 XP!');
      } else {
        alert('Сундук уже открыт!');
      }
      return;
    }

    if (activeNodeBalloon?.id === node.id) {
      setActiveNodeBalloon(null);
    } else {
      setActiveNodeBalloon(node);
    }
  };

  const startLessonFromBalloon = (node) => {
    setActiveNodeBalloon(null);

    if (node.type === 'voice_call') {
      setIsTutorOpen(true);
      return;
    }

    setActiveQuiz(node);
    setQIndex(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setQuizFinished(false);
    sounds.playTap?.();
    haptics.medium();
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
      setHearts((h) => Math.max(0, h - 1));
    }
  };

  const handleNextQuestion = () => {
    sounds.playTap?.();
    haptics.light();
    if (qIndex + 1 >= activeQuiz.questions.length) {
      setQuizFinished(true);
      gamification.addXP(activeQuiz.xp);
      gamification.addGems(15);
      setGems(gamification.getGems());
      sounds.playComplete?.();
      haptics.celebrate();

      if (!completedNodes.includes(activeQuiz.id)) {
        setCompletedNodes((prev) => [...prev, activeQuiz.id, activeQuiz.id + 1]);
      }
    } else {
      setQIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    }
  };

  const maxUnlocked = Math.max(...completedNodes, 1);
  const activeSkinEmoji = MASCOT_SKINS.find((s) => s.id === mascotSkin)?.emoji || '🦉';
  const currentQ = activeQuiz?.questions ? activeQuiz.questions[qIndex] : null;

  return (
    <div className="duo-home-container">
      {/* ===== DUOLINGO TOP STATS HUD ===== */}
      <header className="duo-top-hud">
        {/* Language Flag Switcher */}
        <div className="duo-flag-pill">
          {['en', 'de', 'fr', 'es'].map((code) => {
            const flag = code === 'en' ? '🇺🇸' : code === 'de' ? '🇩🇪' : code === 'fr' ? '🇫🇷' : '🇪🇸';
            return (
              <button
                key={code}
                className={`duo-flag-btn ${language === code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(code)}
              >
                {flag}
              </button>
            );
          })}
        </div>

        {/* Status Badges: Streak, Gems, Hearts */}
        <div className="duo-hud-metrics">
          <button
            className="duo-hud-chip streak"
            onClick={() => setIsShareOpen(true)}
            title="Ударный режим"
          >
            <span className="chip-emoji">🔥</span>
            <strong>{streak}</strong>
          </button>

          <button
            className="duo-hud-chip gems"
            onClick={() => setIsShopOpen(true)}
            title="Кристаллы"
          >
            <span className="chip-emoji">💎</span>
            <strong>{gems}</strong>
          </button>

          <button
            className="duo-hud-chip hearts"
            onClick={() => alert(`Жизни: ${hearts}/5. Полный запас сил для уроков!`)}
            title="Жизни"
          >
            <span className="chip-emoji">❤️</span>
            <strong>{hearts}</strong>
          </button>
        </div>
      </header>

      {/* ===== DUOLINGO 3D SECTION BANNER ===== */}
      <section className="duo-section-banner">
        <div className="section-banner-content">
          <span className="section-step-label">РАЗДЕЛ 1 • ОСНОВЫ ОБЩЕНИЯ</span>
          <h2 className="section-title">Первые шаги в языке</h2>
          <p className="section-desc">Знакомство, простые диалоги и разговор с ИИ</p>
        </div>
        <button
          className="section-guide-btn"
          onClick={() => navigate('/grammar')}
          title="Справочник правил"
        >
          📖 Справочник
        </button>
      </section>

      {/* ===== QUICK ACCESS 3D SHORTCUTS BAR ===== */}
      <section className="duo-shortcuts-strip">
        <button
          className="duo-shortcut-card tutor"
          onClick={() => setIsTutorOpen(true)}
        >
          <span className="shortcut-icon">🎙️</span>
          <div className="shortcut-meta">
            <strong>Звонок ИИ</strong>
            <small>Gemini 3.8 Live</small>
          </div>
        </button>

        <button
          className="duo-shortcut-card cards"
          onClick={() => navigate('/flashcards')}
        >
          <span className="shortcut-icon">📇</span>
          <div className="shortcut-meta">
            <strong>Карточки</strong>
            <small>{reviewCount > 0 ? `${reviewCount} на повтор` : 'Пройдено'}</small>
          </div>
        </button>

        <button
          className="duo-shortcut-card battle"
          onClick={() => setIsBattleOpen(true)}
        >
          <span className="shortcut-icon">⚔️</span>
          <div className="shortcut-meta">
            <strong>Спид-батл</strong>
            <small>Дуэль 1-на-1</small>
          </div>
        </button>

        <button
          className="duo-shortcut-card stories"
          onClick={() => setIsStoriesOpen(true)}
        >
          <span className="shortcut-icon">📖</span>
          <div className="shortcut-meta">
            <strong>Истории</strong>
            <small>Аудио-сценки</small>
          </div>
        </button>
      </section>

      {/* ===== GLOBAL EXPANSION 2.0 BENTO SUITE ===== */}
      <section className="duo-expansion-bento">
        <button
          className="bento-tile cert"
          onClick={() => setIsCertOpen(true)}
        >
          <div className="bento-glow cert-glow" />
          <div className="bento-icon-col">
            <span className="bento-big-icon">🏛️</span>
            <span className="bento-badge gold">CEFR EXAM</span>
          </div>
          <div className="bento-text-col">
            <strong>Сертификат CEFR</strong>
            <small>Экзамен A1-C2 и диплом США</small>
          </div>
        </button>

        <button
          className="bento-tile cinema"
          onClick={() => setIsCinemaOpen(true)}
        >
          <div className="bento-glow cinema-glow" />
          <div className="bento-icon-col">
            <span className="bento-big-icon">🎬</span>
            <span className="bento-badge purple">3D ROLEPLAY</span>
          </div>
          <div className="bento-text-col">
            <strong>Симуляции США</strong>
            <small>Starbucks, Погранконтроль, Google</small>
          </div>
        </button>

        <button
          className="bento-tile slang"
          onClick={() => setIsSlangOpen(true)}
        >
          <div className="bento-glow slang-glow" />
          <div className="bento-icon-col">
            <span className="bento-big-icon">🗽</span>
            <span className="bento-badge amber">SLANG 2026</span>
          </div>
          <div className="bento-text-col">
            <strong>Секретный сленг</strong>
            <small>Живые идиомы Америки без цензуры</small>
          </div>
        </button>

        <button
          className="bento-tile wardrobe"
          onClick={() => setIsWardrobeOpen(true)}
        >
          <div className="bento-glow wardrobe-glow" />
          <div className="bento-icon-col">
            <span className="bento-big-icon">{activeSkinEmoji}</span>
            <span className="bento-badge green">WARDROBE</span>
          </div>
          <div className="bento-text-col">
            <strong>Гардероб совы</strong>
            <small>6 скинов Linguo и квесты дня</small>
          </div>
        </button>
      </section>

      {/* ===== THE WINDING DUOLINGO PATH (ДОРОЖКА УРОВНЕЙ) ===== */}
      <main className="duo-path-stage">
        <div className="duo-nodes-track">
          {DUO_NODES.map((node) => {
            const isCompleted = completedNodes.includes(node.id);
            const isCurrent = node.id === maxUnlocked && !isCompleted;
            const isLocked = node.id > maxUnlocked && !isCompleted;

            return (
              <div
                key={node.id}
                className="duo-node-anchor"
                style={{ transform: `translateX(${node.xOffset}px)` }}
              >
                {/* Node Stepping Stone Button */}
                <button
                  className={`duo-stone-btn ${
                    isCompleted ? 'completed' : isCurrent ? 'active' : 'locked'
                  } ${node.isSpecial ? 'special-voice' : ''}`}
                  onClick={() => handleNodeClick(node)}
                >
                  <span className="stone-inner-shadow" />
                  <span className="stone-icon">{isLocked ? '🔒' : node.icon}</span>
                  {isCompleted && <span className="stone-crown">👑</span>}
                  {isCurrent && <span className="stone-pulse-ring" />}
                </button>

                {/* Duo Mascot Sitting Next to Active Node */}
                {isCurrent && (
                  <div
                    className="duo-mascot-spotlight animate-bounce"
                    onClick={() => setIsWardrobeOpen(true)}
                    style={{ cursor: 'pointer' }}
                    title="Нажмите, чтобы открыть гардероб Linguo"
                  >
                    <span className="duo-owl-char">{activeSkinEmoji}</span>
                    <div className="duo-owl-speech">
                      Вперёд к знаниям!
                    </div>
                  </div>
                )}

                {/* Duolingo-style Popover Balloon when tapped */}
                {activeNodeBalloon?.id === node.id && (
                  <div className="duo-balloon-card animate-pop">
                    <div className="balloon-arrow" />
                    <h4>{node.title}</h4>
                    <p>{node.sub}</p>
                    <div className="balloon-xp">⚡ +{node.xp} XP</div>
                    <button
                      className="balloon-start-btn"
                      onClick={() => startLessonFromBalloon(node)}
                    >
                      {isCompleted ? 'ПОВТОРИТЬ' : 'НАЧАТЬ УРОК'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* ===== IN-PAGE LESSON QUIZ MODAL ===== */}
      {activeQuiz && (
        <div className="duo-lesson-overlay">
          <div className="duo-lesson-container animate-pop">
            <div className="lesson-top-bar">
              <button
                className="lesson-close-btn"
                onClick={() => setActiveQuiz(null)}
              >
                ✕
              </button>
              <div className="lesson-progress-bar">
                <div
                  className="lesson-progress-fill"
                  style={{
                    width: `${((qIndex + 1) / activeQuiz.questions.length) * 100}%`,
                  }}
                />
              </div>
              <div className="lesson-hearts">❤️ {hearts}</div>
            </div>

            {quizFinished ? (
              <div className="lesson-finish-card animate-pop">
                <span className="finish-star-big">🏆</span>
                <h2>Урок завершён!</h2>
                <p>Вы отлично справились с заданием и закрепили материал.</p>
                <div className="finish-rewards-row">
                  <span>⚡ +{activeQuiz.xp} XP</span>
                  <span>💎 +15 Кристаллов</span>
                </div>
                <button
                  className="lesson-continue-btn"
                  onClick={() => setActiveQuiz(null)}
                >
                  ПРОДОЛЖИТЬ
                </button>
              </div>
            ) : (
              <div className="lesson-question-body animate-in">
                <span className="lesson-tag">{activeQuiz.title}</span>
                <h2 className="lesson-q-text">{currentQ?.q}</h2>

                <div className="lesson-opts-stack">
                  {currentQ?.opts.map((opt, oIdx) => {
                    let optState = '';
                    if (isAnswered) {
                      if (oIdx === currentQ.c) optState = 'correct';
                      else if (oIdx === selectedOpt) optState = 'wrong';
                    }
                    return (
                      <button
                        key={oIdx}
                        className={`lesson-opt-3d-btn ${optState}`}
                        onClick={() => handleOptionSelect(oIdx, currentQ.c)}
                        disabled={isAnswered}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="lesson-footer">
                  <button
                    className="lesson-next-3d-btn"
                    onClick={handleNextQuestion}
                    disabled={!isAnswered}
                  >
                    {qIndex + 1 >= activeQuiz.questions.length ? 'ЗАВЕРШИТЬ 🏆' : 'ДАЛЕЕ'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== GLOBAL MODAL WINDOWS ===== */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          refreshStats();
        }}
      />

      <WordManagerModal
        isOpen={isWordManagerOpen}
        onClose={() => {
          setIsWordManagerOpen(false);
          refreshStats();
        }}
        currentLanguage={language}
      />

      <DictionaryModal
        isOpen={isDictOpen}
        onClose={() => {
          setIsDictOpen(false);
          refreshStats();
        }}
        currentLanguage={language}
      />

      <MatchGameModal
        isOpen={isMatchOpen}
        onClose={() => {
          setIsMatchOpen(false);
          refreshStats();
        }}
        currentLanguage={language}
      />

      <ShareAchievementModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        stats={{ streak, totalLearned: 5, rank: gamification.getRank(), accuracy: 100 }}
      />

      <DialoguesModal
        isOpen={isDialoguesOpen}
        onClose={() => setIsDialoguesOpen(false)}
        currentLanguage={language}
      />

      <IrregularVerbsModal
        isOpen={isIrregularOpen}
        onClose={() => setIsIrregularOpen(false)}
        language={language}
      />

      <SentenceBuilderModal
        isOpen={isSentenceOpen}
        onClose={() => setIsSentenceOpen(false)}
        currentLanguage={language}
      />

      <PronunciationModal
        isOpen={isPronounceOpen}
        onClose={() => setIsPronounceOpen(false)}
        currentLanguage={language}
      />

      <VoiceTutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        currentLanguage={language}
      />

      <StoriesModal
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
      />

      <WordBattleModal
        isOpen={isBattleOpen}
        onClose={() => setIsBattleOpen(false)}
        currentLanguage={language}
      />

      <HandsFreeModal
        isOpen={isHandsFreeOpen}
        onClose={() => setIsHandsFreeOpen(false)}
        currentLanguage={language}
      />

      <QuestMapModal
        isOpen={isQuestMapOpen}
        onClose={() => setIsQuestMapOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <ShopModal
        isOpen={isShopOpen}
        onClose={() => {
          setIsShopOpen(false);
          setGems(gamification.getGems());
        }}
      />

      <VoiceMessengerModal
        isOpen={isVoiceMessengerOpen}
        onClose={() => setIsVoiceMessengerOpen(false)}
        currentLanguage={language}
      />

      <SmartReaderModal
        isOpen={isSmartReaderOpen}
        onClose={() => setIsSmartReaderOpen(false)}
      />

      <CertificationModal
        isOpen={isCertOpen}
        onClose={() => {
          setIsCertOpen(false);
          refreshStats();
        }}
      />

      <CinemaRoleplayModal
        isOpen={isCinemaOpen}
        onClose={() => {
          setIsCinemaOpen(false);
          refreshStats();
        }}
      />

      <MascotWardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => {
          setIsWardrobeOpen(false);
          refreshStats();
        }}
        onSkinChange={(newSkin) => setMascotSkin(newSkin)}
      />

      <SlangVaultModal
        isOpen={isSlangOpen}
        onClose={() => {
          setIsSlangOpen(false);
          refreshStats();
        }}
      />
    </div>
  );
}
