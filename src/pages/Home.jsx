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
import { speakText } from '../utils/speech';
import { haptics } from '../utils/haptics';
import './Home.css';

const MOTIVATIONAL_PHRASES = [
  'Каждый день — шаг к свободному владению языком.',
  'Постоянство и регулярность дают максимальный результат.',
  'Маленькие шаги ведут к большим победам.',
  'Вы уверенно двигаетесь к свободному общению.',
  'Языковая практика сегодня — лёгкость завтра.',
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function Home() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [motivation, setMotivation] = useState('');
  const [reviewCount, setReviewCount] = useState(0);
  const [totalLearned, setTotalLearned] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [grammarDone, setGrammarDone] = useState(0);
  const [streak, setStreak] = useState(1);
  const [language, setLanguage] = useState('en');
  const [level, setLevel] = useState('A1');
  const [dailyGoal, setDailyGoal] = useState(15);
  const [todayReviewed, setTodayReviewed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [rank, setRank] = useState(gamification.getRank());
  const [mistakesCount, setMistakesCount] = useState(0);
  const [gems, setGems] = useState(() => gamification.getGems());

  // Category Tab Filter for clean, uncluttered browsing
  const [activeCategoryTab, setActiveCategoryTab] = useState('voice'); // 'voice' | 'games' | 'library'

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

  const isMountedRef = useRef(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const seedDatabase = useCallback(async () => {
    try {
      const existing = await getAllCards();
      const existingIds = new Set((existing || []).map((c) => c.id));
      for (const word of wordsData) {
        if (!existingIds.has(word.id)) {
          await addCard({
            ...word,
            interval: 0,
            repetitions: 0,
            easeFactor: 2.5,
            nextReview: new Date().toISOString(),
            learned: false,
          });
        }
      }
    } catch (err) {
      console.warn('Seed database warning:', err);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const allCards = await getAllCards();
      const reviewCards = await getCardsForReview();

      if (isMountedRef.current) {
        setReviewCount(reviewCards.length);
        const learned = allCards.filter(
          (c) => c.repetitions && c.repetitions >= 1
        );
        setTotalLearned(learned.length);
        setRank(gamification.getRank());
        setMistakesCount(gamification.getMistakes().length);
        setGems(gamification.getGems());
      }

      // Today's progress
      const progress = await getDailyProgress();
      if (isMountedRef.current) {
        setTodayReviewed(progress.cardsReviewed || 0);
        if (progress.cardsReviewed > 0) {
          const acc = Math.round(
            ((progress.cardsReviewed - (progress.mistakes || 0)) /
              progress.cardsReviewed) *
              100
          );
          setAccuracy(Math.max(0, acc));
        } else {
          setAccuracy(100);
        }
      }

      // Settings
      const savedLang = await getSettings('language');
      const savedLevel = await getSettings('level');
      const savedGoal = await getSettings('dailyGoal');
      const savedStreak = await getSettings('streak');

      if (isMountedRef.current) {
        if (savedLang) setLanguage(savedLang);
        if (savedLevel) setLevel(savedLevel);
        if (savedGoal) setDailyGoal(Number(savedGoal));
        if (savedStreak) setStreak(Number(savedStreak));
      }

      // Auth user
      const currentUser = api.getCurrentUser();
      if (isMountedRef.current) {
        setUser(currentUser);
      }
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    setGreeting(getGreeting());
    const randomPhrase =
      MOTIVATIONAL_PHRASES[
        Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)
      ];
    setMotivation(randomPhrase);

    const init = async () => {
      setLoading(true);
      await seedDatabase();
      await refreshStats();
      if (isMountedRef.current) {
        setLoading(false);
      }
    };
    init();

    return () => {
      isMountedRef.current = false;
    };
  }, [seedDatabase, refreshStats]);

  const handleLanguageChange = async (newLang) => {
    haptics.light();
    setLanguage(newLang);
    await saveSetting('language', newLang);
  };

  const handleLevelChange = async (newLevel) => {
    haptics.light();
    setLevel(newLevel);
    await saveSetting('level', newLevel);
  };

  const goalPercent = Math.min(
    100,
    Math.round((todayReviewed / dailyGoal) * 100)
  );

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const langWords = wordsData.filter((w) => w.language === language);
  const wordOfTheDay =
    langWords.length > 0 ? langWords[dayOfYear % langWords.length] : wordsData[0];

  if (loading) {
    return (
      <div className="home-loading">
        <div className="home-loading-spinner" />
        <p>Загрузка Linguo...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* ===== EXECUTIVE GLASS HEADER ===== */}
      <header className="exec-header">
        <div className="exec-top">
          <div className="exec-user-profile">
            <div className="exec-avatar-ring" onClick={() => setIsAuthOpen(true)}>
              <span>{user ? '👤' : '🦉'}</span>
            </div>
            <div className="exec-user-text">
              <h2 className="exec-user-name">
                {user ? user.name || user.username : 'Гость'}
              </h2>
              <span className="exec-level-tag">
                {language.toUpperCase()} • {level}
              </span>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="exec-hud">
            <button
              className="exec-hud-item streak"
              onClick={() => setIsShareOpen(true)}
              title="Ударный режим"
            >
              <span className="hud-icon">🔥</span>
              <strong>{streak}</strong>
            </button>

            <button
              className="exec-hud-item gems"
              onClick={() => setIsShopOpen(true)}
              title="Кристаллы"
            >
              <span className="hud-icon">💎</span>
              <strong>{gems}</strong>
            </button>

            <button
              className="exec-hud-item league"
              onClick={() => setIsLeaderboardOpen(true)}
              title="Лига лидеров"
            >
              <span className="hud-icon">🏆</span>
              <strong>Топ</strong>
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO SHOWCASE (Bento Style) ===== */}
      <section className="home-bento-hero">
        {/* Card 1: Gemini 3.8 Live Voice Tutor */}
        <div className="bento-card tutor-card" onClick={() => setIsTutorOpen(true)}>
          <div className="bento-card-bg-glow" />
          <div className="bento-top-row">
            <span className="bento-live-badge">
              <span className="live-dot-pulse" /> LIVE AI
            </span>
            <span className="bento-tutor-names">Emma • Lukas • Amélie • Carlos</span>
          </div>

          <div className="bento-body">
            <h3>Живой голосовой ИИ</h3>
            <p>Практикуйте реальную беглую речь в естественном диалоге</p>
          </div>

          <div className="bento-footer">
            <span className="bento-action-pill">
              Начать разговор <span>📞</span>
            </span>
          </div>
        </div>

        {/* Card 2: Interactive Quest Map */}
        <div className="bento-card quest-card" onClick={() => setIsQuestMapOpen(true)}>
          <div className="bento-card-bg-glow quest-glow" />
          <div className="bento-top-row">
            <span className="bento-quest-badge">ДОРОЖКА ПУТИ</span>
            <span className="bento-quest-stat">⭐ 8 этапов</span>
          </div>

          <div className="bento-body">
            <h3>Карта приключений</h3>
            <p>Уроки-островки, сундуки сокровищ и битва с боссом</p>
          </div>

          <div className="bento-footer">
            <span className="bento-action-pill green">
              В путь <span>➔</span>
            </span>
          </div>
        </div>
      </section>

      {/* ===== MISSION & PROGRESS CARD ===== */}
      <section className="mission-card">
        <div className="mission-header">
          <div className="mission-rank-meta">
            <span className="rank-shield">{rank.title}</span>
            <span className="rank-xp-info">
              {rank.currentXP} XP {rank.nextRankXP ? `• До ранга: ${rank.nextRankXP - rank.currentXP} XP` : ''}
            </span>
          </div>
          <div className="mission-goal-count">
            Сегодня: <strong>{todayReviewed}/{dailyGoal} слов</strong>
          </div>
        </div>

        <div className="mission-progress-track">
          <div
            className="mission-progress-bar"
            style={{ width: `${goalPercent}%` }}
          />
        </div>
      </section>

      {/* ===== PRIMARY STUDY CARD (Smart Cards SM-2) ===== */}
      <section className="primary-study-card" onClick={() => navigate('/flashcards')}>
        <div className="study-card-left">
          <div className="study-card-icon-box">📇</div>
          <div>
            <h3>Умные карточки (SM-2)</h3>
            <p className="study-card-sub">
              {reviewCount > 0
                ? `${reviewCount} ${reviewCount === 1 ? 'карточка готова' : 'карточек готовы'} к интервальному повторению`
                : 'Все карточки на сегодня успешно повторены!'}
            </p>
          </div>
        </div>
        <button className="study-card-cta">
          {reviewCount > 0 ? 'Учить' : 'Повторить'} ➔
        </button>
      </section>

      {/* ===== LANGUAGE & LEVEL CONTROL STRIP ===== */}
      <section className="control-strip">
        {/* Language Segmented Bar */}
        <div className="segmented-control">
          {[
            { id: 'en', flag: '🇬🇧', label: 'English' },
            { id: 'de', flag: '🇩🇪', label: 'Deutsch' },
            { id: 'fr', flag: '🇫🇷', label: 'Français' },
            { id: 'es', flag: '🇪🇸', label: 'Español' },
          ].map((l) => (
            <button
              key={l.id}
              className={`segmented-btn ${language === l.id ? 'active' : ''}`}
              onClick={() => handleLanguageChange(l.id)}
            >
              <span>{l.flag}</span>
              <span className="seg-label">{l.label}</span>
            </button>
          ))}
        </div>

        {/* Level Pills */}
        <div className="levels-strip">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              className={`level-chip ${level === lvl ? 'active' : ''}`}
              onClick={() => handleLevelChange(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIZED FEATURE STUDIO ===== */}
      <section className="studio-section">
        {/* Segmented Category Filter */}
        <div className="studio-tabs">
          <button
            className={`studio-tab-btn ${activeCategoryTab === 'voice' ? 'active' : ''}`}
            onClick={() => {
              setActiveCategoryTab('voice');
              haptics.light();
            }}
          >
            <span>🎙️</span> Голос и Речь
          </button>
          <button
            className={`studio-tab-btn ${activeCategoryTab === 'games' ? 'active' : ''}`}
            onClick={() => {
              setActiveCategoryTab('games');
              haptics.light();
            }}
          >
            <span>⚔️</span> Тренажёры
          </button>
          <button
            className={`studio-tab-btn ${activeCategoryTab === 'library' ? 'active' : ''}`}
            onClick={() => {
              setActiveCategoryTab('library');
              haptics.light();
            }}
          >
            <span>📚</span> Инструменты
          </button>
        </div>

        {/* Feature Grid */}
        <div className="studio-grid animate-fade">
          {activeCategoryTab === 'voice' && (
            <>
              <div className="feature-tile" onClick={() => setIsTutorOpen(true)}>
                <div className="tile-icon-wrap indigo">🎙️</div>
                <div className="tile-content">
                  <h4>Voice Tutor Live</h4>
                  <p>Разговорный диалог с Gemini 3.8 в реальном времени</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsVoiceMessengerOpen(true)}>
                <div className="tile-icon-wrap violet">💬</div>
                <div className="tile-content">
                  <h4>Аудио-чат Telegram</h4>
                  <p>Голосовые сообщения и заметки с репетитором</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsPronounceOpen(true)}>
                <div className="tile-icon-wrap emerald">🎯</div>
                <div className="tile-content">
                  <h4>Тренер произношения</h4>
                  <p>Оценка акцента и тепловая карта слогов (Heatmap)</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsStoriesOpen(true)}>
                <div className="tile-icon-wrap amber">📖</div>
                <div className="tile-content">
                  <h4>Linguo Stories</h4>
                  <p>Интерактивные сюжетные аудио-спектакли</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsDialoguesOpen(true)}>
                <div className="tile-icon-wrap sky">🗣️</div>
                <div className="tile-content">
                  <h4>Диалоги по ролям</h4>
                  <p>Кафе, отель, вокзал и знакомства</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsHandsFreeOpen(true)}>
                <div className="tile-icon-wrap rose">🚗</div>
                <div className="tile-content">
                  <h4>Режим «За рулём»</h4>
                  <p>Hands-free фоновый плеер слов для наушников</p>
                </div>
              </div>
            </>
          )}

          {activeCategoryTab === 'games' && (
            <>
              <div className="feature-tile highlight-battle" onClick={() => setIsBattleOpen(true)}>
                <div className="tile-icon-wrap rose">⚔️</div>
                <div className="tile-content">
                  <h4>Спид-батл 1-на-1</h4>
                  <p>Динамичный 45-секундный поединок против Duo Bot</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsMatchOpen(true)}>
                <div className="tile-icon-wrap amber">⚡</div>
                <div className="tile-content">
                  <h4>Найди пары</h4>
                  <p>Скоростная игра на совпадение слов и переводов</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsSentenceOpen(true)}>
                <div className="tile-icon-wrap sky">🧩</div>
                <div className="tile-content">
                  <h4>Собери фразу</h4>
                  <p>Конструктор правильного порядка слов</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsIrregularOpen(true)}>
                <div className="tile-icon-wrap violet">⚡</div>
                <div className="tile-content">
                  <h4>Неправильные глаголы</h4>
                  <p>Таблица трёх форм и экспресс-тест</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => navigate('/quiz')}>
                <div className="tile-icon-wrap indigo">🧠</div>
                <div className="tile-content">
                  <h4>Квиз и Аудирование</h4>
                  <p>Тестирование знаний и распознавание на слух</p>
                </div>
              </div>
            </>
          )}

          {activeCategoryTab === 'library' && (
            <>
              <div className="feature-tile" onClick={() => setIsSmartReaderOpen(true)}>
                <div className="tile-icon-wrap emerald">📸</div>
                <div className="tile-content">
                  <h4>AI Smart Reader & Lens</h4>
                  <p>Разбор текстов, перевод по тапу и добавление в колоду</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsDictOpen(true)}>
                <div className="tile-icon-wrap indigo">📚</div>
                <div className="tile-content">
                  <h4>Словарь</h4>
                  <p>Поиск слов, озвучка и избранные закладки ⭐</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => navigate('/grammar')}>
                <div className="tile-icon-wrap amber">✏️</div>
                <div className="tile-content">
                  <h4>Справочник грамматики</h4>
                  <p>12 тем с наглядными правилами и примерами</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsWordManagerOpen(true)}>
                <div className="tile-icon-wrap sky">➕</div>
                <div className="tile-content">
                  <h4>Свои слова</h4>
                  <p>Добавление персональных карточек в колоду</p>
                </div>
              </div>

              <div className="feature-tile" onClick={() => setIsShopOpen(true)}>
                <div className="tile-icon-wrap rose">💎</div>
                <div className="tile-content">
                  <h4>Магазин бонусов</h4>
                  <p>Заморозка стрика, бустеры 2x XP и сундук</p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== MODAL WINDOWS ===== */}
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
        stats={{ streak, totalLearned, rank, accuracy }}
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
    </div>
  );
}
