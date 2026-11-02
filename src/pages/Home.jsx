import { useState, useEffect, useCallback } from 'react';
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
import AuthModal from '../components/AuthModal';
import WordManagerModal from '../components/WordManagerModal';
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
  const [streak, setStreak] = useState(0);
  const [language, setLanguage] = useState('en');
  const [level, setLevel] = useState('A1');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWordManagerOpen, setIsWordManagerOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const seedDatabase = useCallback(async () => {
    const existing = await getAllCards();
    if (existing.length === 0) {
      for (const word of wordsData) {
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
  }, []);

  useEffect(() => {
    const init = async () => {
      setGreeting(getGreeting());
      setMotivation(
        MOTIVATIONAL_PHRASES[
          Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)
        ]
      );

      await seedDatabase();

      try {
        const currentUser = await api.getMe();
        setUser(currentUser);
        // Also fetch any custom words from server and add to local DB
        const serverCustomWords = await api.getCustomWords();
        const localCards = await getAllCards();
        for (const cw of serverCustomWords) {
          if (!localCards.some(c => c.id === cw.id || (c.word === cw.word && c.language === cw.language))) {
            await addCard({
              ...cw,
              interval: 0,
              repetitions: 0,
              easeFactor: 2.5,
              nextReview: new Date().toISOString(),
              learned: false,
            });
          }
        }
      } catch (e) {}

      const settings = await getSettings();
      if (settings.language) setLanguage(settings.language);
      if (settings.level) setLevel(settings.level);

      const allCards = await getAllCards();
      const reviewCards = await getCardsForReview();
      setReviewCount(reviewCards.length);

      const learned = allCards.filter(
        (c) => c.repetitions && c.repetitions >= 1
      );
      setTotalLearned(learned.length);

      const progress = await getDailyProgress();
      if (progress) {
        const total = (progress.correct || 0) + (progress.wrong || 0);
        setAccuracy(total > 0 ? Math.round((progress.correct / total) * 100) : 0);
        setGrammarDone(progress.grammarDone || 0);
      }

      // Calculate streak
      let currentStreak = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayProgress = await getDailyProgress(date.toISOString().split('T')[0]);
        if (dayProgress && ((dayProgress.correct || 0) + (dayProgress.wrong || 0)) > 0) {
          currentStreak++;
        } else if (i > 0) {
          break;
        }
      }
      setStreak(currentStreak);

      setLoading(false);
    };

    init();
  }, [seedDatabase]);

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    await saveSetting('language', lang);
  };

  const handleLevelChange = async (lvl) => {
    setLevel(lvl);
    await saveSetting('level', lvl);
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="home-loading-spinner" />
        <p>Загрузка...</p>
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
      </header>

      <section className="home-streak-bar">
        <div className="home-streak-flame">🔥</div>
        <div className="home-streak-info">
          <span className="home-streak-count">{streak}</span>
          <span className="home-streak-label">
            {streak === 1 ? 'день' : streak >= 2 && streak <= 4 ? 'дня' : 'дней'} подряд
          </span>
        </div>
      </section>

      <section className="home-review-card" onClick={() => navigate('/flashcards')}>
        <div className="home-review-left">
          <span className="home-review-icon">📇</span>
          <div>
            <h3>Карточки на сегодня</h3>
            <p className="home-review-count">
              {reviewCount > 0
                ? `${reviewCount} ${reviewCount === 1 ? 'карточка' : reviewCount <= 4 ? 'карточки' : 'карточек'} ждут повторения`
                : 'Всё повторено! 🎉'}
            </p>
          </div>
        </div>
        {reviewCount > 0 && (
          <button className="home-review-btn">Начать →</button>
        )}
      </section>

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

      <section className="home-selectors">
        <div className="home-selector-group">
          <h3>🌐 Язык изучения</h3>
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
          </div>
        </div>

        <div className="home-selector-group">
          <h3>📊 Уровень</h3>
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

      <section className="home-quick-actions">
        <button className="home-action-card" onClick={() => setIsWordManagerOpen(true)}>
          <span className="home-action-icon">📖</span>
          <span>+ Свои слова</span>
        </button>
        <button className="home-action-card" onClick={() => navigate('/quiz')}>
          <span className="home-action-icon">🧠</span>
          <span>Квиз</span>
        </button>
        <button className="home-action-card" onClick={() => navigate('/grammar')}>
          <span className="home-action-icon">✏️</span>
          <span>Грамматика</span>
        </button>
        <button className="home-action-card" onClick={() => navigate('/progress')}>
          <span className="home-action-icon">📈</span>
          <span>Прогресс</span>
        </button>
      </section>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />

      <WordManagerModal
        isOpen={isWordManagerOpen}
        onClose={() => setIsWordManagerOpen(false)}
        onWordAdded={async () => {
          const allCards = await getAllCards();
          const reviewCards = await getCardsForReview();
          setReviewCount(reviewCards.length);
          const learned = allCards.filter(c => c.repetitions && c.repetitions >= 1);
          setTotalLearned(learned.length);
        }}
      />
    </div>
  );
}
