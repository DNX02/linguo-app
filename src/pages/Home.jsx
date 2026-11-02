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
  'Каждый день — шаг к свободному владению! 🚀',
  'Ты на правильном пути! 💪',
  'Практика делает мастера! 🎯',
  'Учись сегодня — говори завтра! 🌟',
  'Языки открывают двери в мир! 🌍',
  'Не останавливайся на достигнутом! 🔥',
  'Маленькие шаги ведут к большим победам! 🏆',
  'Ты уже лучше, чем вчера! ✨',
  'Вперёд к новым знаниям! 📚',
  'Каждое слово — кирпичик в фундаменте! 🧱',
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
      }

      // Today's progress
      const progress = await getDailyProgress();
      if (progress && isMountedRef.current) {
        const total = (progress.correct || 0) + (progress.wrong || 0);
        setAccuracy(total > 0 ? Math.round((progress.correct / total) * 100) : 100);
        setGrammarDone(progress.grammarDone || 0);
        setTodayReviewed(progress.reviewed || 0);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Safety timeout: NEVER let the screen stay in infinite loading
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }, 1200);

    const init = async () => {
      setGreeting(getGreeting());
      setMotivation(
        MOTIVATIONAL_PHRASES[
          Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)
        ]
      );

      try {
        await seedDatabase();

        // Check user session safely (non-blocking)
        try {
          const currentUser = await api.getMe();
          if (currentUser && isMountedRef.current) setUser(currentUser);
        } catch (_) {}

        // Load settings
        const settings = await getSettings();
        if (isMountedRef.current) {
          if (settings.language) setLanguage(settings.language);
          if (settings.level) setLevel(settings.level);
          if (settings.dailyGoal) setDailyGoal(Number(settings.dailyGoal));
        }

        await refreshStats();

        // Streak check (last 7 days max for instant loading)
        let currentStreak = 0;
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const dayProgress = await getDailyProgress(dateStr);
          if (dayProgress && ((dayProgress.correct || 0) + (dayProgress.wrong || 0) + (dayProgress.reviewed || 0)) > 0) {
            currentStreak++;
          } else if (i > 0) {
            break;
          }
        }
        if (isMountedRef.current) {
          setStreak(Math.max(1, currentStreak));
        }
      } catch (err) {
        console.error('Home initialization caught error:', err);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          clearTimeout(timer);
        }
      }
    };

    init();

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
    };
  }, [seedDatabase, refreshStats]);

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    await saveSetting('language', lang);
  };

  const handleLevelChange = async (lvl) => {
    setLevel(lvl);
    await saveSetting('level', lvl);
  };

  const goalPercent = Math.min(100, Math.round((todayReviewed / dailyGoal) * 100));

  // Word of the Day calculation (deterministic per day)
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
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
      <header className="home-header">
        <div className="home-top-row">
          <div className="home-greeting">
            <h1>{greeting}! 👋</h1>
            <p className="home-motivation">{motivation}</p>
          </div>
          <button
            className={`home-user-badge ${user ? 'home-user-logged' : ''}`}
            onClick={() => setIsAuthOpen(true)}
            title={user ? `Профиль: ${user.name}` : 'Войти в аккаунт'}
          >
            {user ? `👤 ${user.name || user.username}` : '🔐 Войти'}
          </button>
        </div>

        <div className="home-status-strip">
          <span className="home-pwa-pill">🟢 Офлайн (PWA)</span>
          <button className="home-gem-pill" onClick={() => setIsShopOpen(true)} title="Магазин кристаллов">
            💎 {gamification.getGems()}
          </button>
          <button className="home-league-pill" onClick={() => setIsLeaderboardOpen(true)} title="Лига Лидеров">
            🏆 Золото
          </button>
          <button className="home-share-btn-pill" onClick={() => setIsShareOpen(true)}>
            📤 Поделиться
          </button>
        </div>
      </header>

      {/* Gamification Rank & XP Card */}
      <section className="home-rank-box" onClick={() => navigate('/progress')}>
        <div className="home-rank-top">
          <div className="home-rank-info">
            <span className="home-rank-title">{rank.title}</span>
            <span className="home-rank-level">Уровень {rank.level}</span>
          </div>
          <div className="home-rank-xp">
            <strong>{rank.currentXP}</strong> XP
          </div>
        </div>
        <div className="home-rank-progress-bg">
          <div
            className="home-rank-progress-fill"
            style={{ width: `${rank.progressInLevel}%` }}
          />
        </div>
        <div className="home-rank-sub">
          {rank.nextRankXP
            ? `До следующего ранга: ${rank.nextRankXP - rank.currentXP} XP`
            : 'Максимальный ранг достигнут! 👑'}
        </div>
      </section>

      {/* Streak and Daily Goal Bar */}
      <section className="home-goal-box">
        <div className="home-goal-top">
          <div className="home-streak-mini">
            <span className="home-streak-flame">🔥</span>
            <div>
              <span className="home-streak-num">{streak}</span>
              <span className="home-streak-txt">
                {streak === 1 ? 'день' : streak >= 2 && streak <= 4 ? 'дня' : 'дней'} ударно
              </span>
            </div>
          </div>
          <div className="home-goal-ratio">
            <span>Цель: {todayReviewed}/{dailyGoal} слов</span>
            <span className="home-goal-pct">{goalPercent}%</span>
          </div>
        </div>
        <div className="home-progress-bar-bg">
          <div
            className="home-progress-bar-fill"
            style={{ width: `${goalPercent}%` }}
          />
        </div>
        {goalPercent >= 100 && (
          <div className="home-goal-complete-msg">🎉 Дневная цель выполнена! Отличная работа!</div>
        )}
      </section>

      {/* Word of the Day (Слово дня) */}
      {wordOfTheDay && (
        <section className="home-wotd-card">
          <div className="home-wotd-top">
            <span className="home-wotd-tag">✨ Слово дня</span>
            <span className="home-wotd-badge">{wordOfTheDay.level || 'A1'} • {language === 'en' ? '🇬🇧' : '🇩🇪'}</span>
          </div>
          <div className="home-wotd-body">
            <div>
              <h2 className="home-wotd-word">{wordOfTheDay.word}</h2>
              {wordOfTheDay.transcription && (
                <div className="home-wotd-trans">[{wordOfTheDay.transcription}]</div>
              )}
              <div className="home-wotd-meaning">{wordOfTheDay.translation}</div>
            </div>
            <button
              className="home-wotd-audio-btn"
              title="Послушать произношение"
              onClick={() => {
                speakText(wordOfTheDay.word, wordOfTheDay.language);
                haptics.light();
              }}
            >
              🔊
            </button>
          </div>
        </section>
      )}

      {/* Primary Study Card */}
      <section className="home-review-card" onClick={() => navigate('/flashcards')}>
        <div className="home-review-left">
          <span className="home-review-icon">📇</span>
          <div>
            <h3>Умные карточки (SM-2)</h3>
            <p className="home-review-count">
              {reviewCount > 0
                ? `${reviewCount} ${reviewCount === 1 ? 'карточка' : reviewCount <= 4 ? 'карточки' : 'карточек'} ждут повторения`
                : 'Все карточки на сегодня повторены! 🎉'}
            </p>
          </div>
        </div>
        <button className="home-review-btn">
          {reviewCount > 0 ? 'Учить →' : 'Повторить →'}
        </button>
      </section>

      {/* Interactive Quest Map Adventure Banner */}
      <section className="home-quest-banner" onClick={() => setIsQuestMapOpen(true)}>
        <div className="home-quest-banner-left">
          <div className="home-quest-orb">🗺️</div>
          <div>
            <div className="home-quest-tag-row">
              <span className="home-quest-pill">ДОРОЖКА ПРИКЛЮЧЕНИЙ</span>
              <span className="home-quest-star-pill">⭐ 8 этапов</span>
            </div>
            <h3 className="home-quest-title">Интерактивная карта пути</h3>
            <p className="home-quest-desc">Уроки-островки, сундуки сокровищ и битва с боссом</p>
          </div>
        </div>
        <button className="home-quest-btn">В путь! ➔</button>
      </section>

      {/* Live AI Voice Tutor Banner (Google Gemini Live) */}
      <section className="home-tutor-banner" onClick={() => setIsTutorOpen(true)}>
        <div className="home-tutor-banner-left">
          <div className="home-tutor-orb-mini">🎙️</div>
          <div>
            <div className="home-tutor-tag-row">
              <span className="home-tutor-pill">LIVE AI</span>
              <span className="home-tutor-name-pill">Emma & Lukas</span>
            </div>
            <h3 className="home-tutor-title">Живой разговорный ИИ-репетитор</h3>
            <p className="home-tutor-desc">Свободный голосовой диалог в реальном времени</p>
          </div>
        </div>
        <button className="home-tutor-call-btn">Позвонить 📞</button>
      </section>

      {/* Quick Stats Grid */}
      <section className="home-stats-grid">
        <div className="home-stat-card" onClick={() => navigate('/progress')}>
          <span className="home-stat-emoji">📖</span>
          <span className="home-stat-value">{totalLearned}</span>
          <span className="home-stat-label">Слов изучено</span>
        </div>
        <div className="home-stat-card" onClick={() => navigate('/quiz')}>
          <span className="home-stat-emoji">🎯</span>
          <span className="home-stat-value">{accuracy}%</span>
          <span className="home-stat-label">Точность</span>
        </div>
        <div className="home-stat-card" onClick={() => navigate('/grammar')}>
          <span className="home-stat-emoji">📝</span>
          <span className="home-stat-value">{grammarDone}</span>
          <span className="home-stat-label">Грамматика</span>
        </div>
      </section>

      {/* Language & Level Selectors */}
      <section className="home-selectors">
        <div className="home-selector-group">
          <div className="home-group-header">
            <h3>🌐 Язык изучения</h3>
            <span className="home-badge-info">4 языка</span>
          </div>
          <div className="home-toggle-row">
            <button
              className={`home-toggle-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('en')}
            >
              🇬🇧 English
            </button>
            <button
              className={`home-toggle-btn ${language === 'de' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('de')}
            >
              🇩🇪 Deutsch
            </button>
            <button
              className={`home-toggle-btn ${language === 'fr' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('fr')}
            >
              🇫🇷 Français
            </button>
            <button
              className={`home-toggle-btn ${language === 'es' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('es')}
            >
              🇪🇸 Español
            </button>
          </div>
        </div>

        <div className="home-selector-group">
          <div className="home-group-header">
            <h3>📊 Текущий уровень</h3>
            <span className="home-badge-info">A1 — C2</span>
          </div>
          <div className="home-level-row">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                className={`home-level-btn ${level === lvl ? 'active' : ''}`}
                onClick={() => handleLevelChange(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Feature Actions */}
      <section className="home-quick-actions">
        <button className="home-action-card highlight" onClick={() => setIsQuestMapOpen(true)}>
          <span className="home-action-icon">🗺️</span>
          <div className="home-action-text">
            <strong>Карта квестов</strong>
            <small>Дорожка приключений</small>
          </div>
        </button>

        <button className="home-action-card" onClick={() => setIsLeaderboardOpen(true)}>
          <span className="home-action-icon">🏆</span>
          <div className="home-action-text">
            <strong>Лига лидеров</strong>
            <small>Рейтинг и кубки недели</small>
          </div>
        </button>

        <button className="home-action-card" onClick={() => setIsShopOpen(true)}>
          <span className="home-action-icon">💎</span>
          <div className="home-action-text">
            <strong>Магазин & Сундук</strong>
            <small>Кристаллы и бонусы</small>
          </div>
        </button>

        <button className="home-action-card highlight" onClick={() => setIsVoiceMessengerOpen(true)}>
          <span className="home-action-icon">💬</span>
          <div className="home-action-text">
            <strong>Аудио-чат (AI)</strong>
            <small>Голосовые с репетитором</small>
          </div>
        </button>

        <button className="home-action-card" onClick={() => setIsSmartReaderOpen(true)}>
          <span className="home-action-icon">📸</span>
          <div className="home-action-text">
            <strong>AI Сканер (Lens)</strong>
            <small>Умный ридер текстов</small>
          </div>
        </button>

        <button className="home-action-card highlight" onClick={() => setIsStoriesOpen(true)}>
          <span className="home-action-icon">📖</span>
          <div className="home-action-text">
            <strong>Истории (Stories)</strong>
            <small>Аудио-спектакли и диалоги</small>
          </div>
        </button>

        <button className="home-action-card speed-game" onClick={() => setIsBattleOpen(true)}>
          <span className="home-action-icon">⚔️</span>
          <div className="home-action-text">
            <strong>Спид-батл 1-на-1</strong>
            <small>Дуэль против Duo Bot</small>
          </div>
        </button>

        <button className="home-action-card" onClick={() => setIsHandsFreeOpen(true)}>
          <span className="home-action-icon">🚗</span>
          <div className="home-action-text">
            <strong>За рулём (Audio)</strong>
            <small>Hands-free аудиотренажёр</small>
          </div>
        </button>

        <button className="home-action-card highlight" onClick={() => setIsDialoguesOpen(true)}>
          <span className="home-action-icon">💬</span>
          <div className="home-action-text">
            <strong>Диалоги (AI)</strong>
            <small>Живая речь и роли</small>
          </div>
        </button>

        <button className="home-action-card" onClick={() => setIsIrregularOpen(true)}>
          <span className="home-action-icon">⚡</span>
          <div className="home-action-text">
            <strong>Глаголы</strong>
            <small>3 формы и тест</small>
          </div>
        </button>

        <button className="home-action-card" onClick={() => setIsSentenceOpen(true)}>
          <span className="home-action-icon">🧩</span>
          <div className="home-action-text">
            <strong>Собери фразу</strong>
            <small>Конструктор слов</small>
          </div>
        </button>

        <button className="home-action-card" onClick={() => setIsPronounceOpen(true)}>
          <span className="home-action-icon">🎙️</span>
          <div className="home-action-text">
            <strong>Произношение</strong>
            <small>Оценка с микрофоном</small>
          </div>
        </button>

        <button className="home-action-card highlight" onClick={() => setIsDictOpen(true)}>
          <span className="home-action-icon">📖</span>
          <div className="home-action-text">
            <strong>Словарь</strong>
            <small>Поиск, озвучка и ⭐</small>
          </div>
        </button>

        <button className="home-action-card speed-game" onClick={() => setIsMatchOpen(true)}>
          <span className="home-action-icon">⚡</span>
          <div className="home-action-text">
            <strong>Найди пары</strong>
            <small>Игра на скорость</small>
          </div>
        </button>

        <button className="home-action-card" onClick={() => navigate('/quiz')}>
          <span className="home-action-icon">🧠</span>
          <div className="home-action-text">
            <strong>Квиз и Аудио</strong>
            <small>Тесты и на слух</small>
          </div>
        </button>

        <button className="home-action-card" onClick={() => navigate('/grammar')}>
          <span className="home-action-icon">✏️</span>
          <div className="home-action-text">
            <strong>Грамматика</strong>
            <small>12 тем и правила</small>
          </div>
        </button>

        <button className="home-action-card" onClick={() => setIsWordManagerOpen(true)}>
          <span className="home-action-icon">➕</span>
          <div className="home-action-text">
            <strong>Свои слова</strong>
            <small>Добавить в колоду</small>
          </div>
        </button>

        {mistakesCount > 0 ? (
          <button className="home-action-card mistake-card" onClick={() => navigate('/quiz')}>
            <span className="home-action-icon">⚠️</span>
            <div className="home-action-text">
              <strong>Ошибки ({mistakesCount})</strong>
              <small>Повторить слабые слова</small>
            </div>
          </button>
        ) : (
          <button className="home-action-card" onClick={() => setIsShareOpen(true)}>
            <span className="home-action-icon">🏆</span>
            <div className="home-action-text">
              <strong>Успехи дня</strong>
              <small>Поделиться карточкой</small>
            </div>
          </button>
        )}
      </section>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />

      <WordManagerModal
        isOpen={isWordManagerOpen}
        onClose={() => setIsWordManagerOpen(false)}
        onWordAdded={async () => {
          await refreshStats();
        }}
      />

      <DictionaryModal
        isOpen={isDictOpen}
        onClose={() => setIsDictOpen(false)}
        defaultLanguage={language}
      />

      <MatchGameModal
        isOpen={isMatchOpen}
        onClose={() => {
          setIsMatchOpen(false);
          refreshStats();
        }}
        language={language}
      />

      <ShareAchievementModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        stats={{
          streak,
          todayReviewed,
          accuracy,
          rankTitle: rank.title,
          totalXP: rank.currentXP,
          language,
        }}
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
        onClose={() => setIsShopOpen(false)}
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
