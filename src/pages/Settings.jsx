import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, saveSetting, getAllCards } from '../db';
import { api } from '../utils/api';
import AuthModal from '../components/AuthModal';
import './Settings.css';

const DAILY_GOALS = [10, 20, 30, 50];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [defaultLang, setDefaultLang] = useState('both');
  const [currentLevel, setCurrentLevel] = useState('A1');
  const [notifications, setNotifications] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      if (settings.dailyGoal) setDailyGoal(settings.dailyGoal);
      if (settings.defaultLang) setDefaultLang(settings.defaultLang);
      if (settings.level) setCurrentLevel(settings.level);
      if (settings.notifications !== undefined) setNotifications(settings.notifications);
      if (settings.darkTheme !== undefined) setDarkTheme(settings.darkTheme);
      try {
        const u = await api.getMe();
        setUser(u);
      } catch (e) {}
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleDailyGoal = async (goal) => {
    setDailyGoal(goal);
    await saveSetting('dailyGoal', goal);
  };

  const handleLang = async (lang) => {
    setDefaultLang(lang);
    await saveSetting('defaultLang', lang);
  };

  const handleLevel = async (lvl) => {
    setCurrentLevel(lvl);
    await saveSetting('level', lvl);
  };

  const handleNotifications = async () => {
    const newVal = !notifications;
    setNotifications(newVal);
    await saveSetting('notifications', newVal);
  };

  const handleTheme = async () => {
    const newVal = !darkTheme;
    setDarkTheme(newVal);
    await saveSetting('darkTheme', newVal);
  };

  const handleSync = async () => {
    setSyncStatus('Синхронизация...');
    try {
      const cards = await getAllCards();
      const cardMap = {};
      cards.forEach(c => {
        if (c.repetitions > 0) {
          cardMap[c.id] = { interval: c.interval, repetitions: c.repetitions, easeFactor: c.easeFactor, nextReview: c.nextReview };
        }
      });
      await api.syncProgress({ cards: cardMap });
      setSyncStatus('Синхронизировано ✅');
      setTimeout(() => setSyncStatus(''), 3000);
    } catch (e) {
      setSyncStatus('Ошибка синхронизации ❌');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
  };

  const handleResetProgress = async () => {
    // Clear IndexedDB data
    try {
      const db = await import('../db');
      const allCards = await db.getAllCards();
      for (const card of allCards) {
        await db.updateCard({
          ...card,
          interval: 0,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date().toISOString(),
          learned: false,
        });
      }
      localStorage.removeItem('linguo-grammar-progress');
      setShowResetConfirm(false);
      window.location.reload();
    } catch (e) {
      console.error('Reset failed:', e);
    }
  };

  const handleExport = async () => {
    try {
      const allCards = await getAllCards();
      const settings = await getSettings();
      const grammarProgress = localStorage.getItem('linguo-grammar-progress');

      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        cards: allCards,
        settings,
        grammarProgress: grammarProgress ? JSON.parse(grammarProgress) : {},
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linguo-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.cards && Array.isArray(data.cards)) {
        const db = await import('../db');
        for (const card of data.cards) {
          try {
            await db.updateCard(card);
          } catch {
            await db.addCard(card);
          }
        }
      }

      if (data.settings) {
        for (const [key, value] of Object.entries(data.settings)) {
          await saveSetting(key, value);
        }
      }

      if (data.grammarProgress) {
        localStorage.setItem(
          'linguo-grammar-progress',
          JSON.stringify(data.grammarProgress)
        );
      }

      setShowImportSuccess(true);
      setTimeout(() => {
        setShowImportSuccess(false);
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Import failed:', err);
      alert('Ошибка импорта. Проверьте формат файла.');
    }

    // Reset file input
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="settings-loading-spinner" />
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button className="settings-back" onClick={() => navigate('/')}>
          ← Назад
        </button>
        <h2>⚙️ Настройки</h2>
      </header>

      {/* Cloud Account Section */}
      <section className="settings-section settings-account-section">
        <h3>☁️ Облачный аккаунт</h3>
        {user ? (
          <div className="settings-account-card">
            <div className="settings-account-info">
              <span className="settings-account-avatar">👤</span>
              <div>
                <strong>{user.name || user.username}</strong>
                <p>Логин: {user.username}</p>
              </div>
            </div>
            <div className="settings-account-actions">
              <button className="settings-sync-btn" onClick={handleSync}>
                {syncStatus || '🔄 Синхронизировать'}
              </button>
              <button className="settings-logout-btn" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </div>
        ) : (
          <div className="settings-account-promo">
            <p>Войдите или зарегистрируйтесь, чтобы сохранять прогресс и слова на сервере.</p>
            <button className="settings-login-btn" onClick={() => setIsAuthOpen(true)}>
              🔐 Войти / Зарегистрироваться
            </button>
          </div>
        )}
      </section>

      {/* Daily goal */}
      <section className="settings-section">
        <h3>🎯 Дневная цель</h3>
        <p className="settings-desc">Сколько карточек повторять в день</p>
        <div className="settings-goals">
          {DAILY_GOALS.map((goal) => (
            <button
              key={goal}
              className={`settings-goal-btn ${dailyGoal === goal ? 'active' : ''}`}
              onClick={() => handleDailyGoal(goal)}
            >
              {goal}
            </button>
          ))}
        </div>
      </section>

      {/* Default language */}
      <section className="settings-section">
        <h3>🌐 Язык по умолчанию</h3>
        <div className="settings-lang-options">
          <button
            className={`settings-lang-btn ${defaultLang === 'en' ? 'active' : ''}`}
            onClick={() => handleLang('en')}
          >
            🇬🇧 English
          </button>
          <button
            className={`settings-lang-btn ${defaultLang === 'de' ? 'active' : ''}`}
            onClick={() => handleLang('de')}
          >
            🇩🇪 Deutsch
          </button>
          <button
            className={`settings-lang-btn ${defaultLang === 'both' ? 'active' : ''}`}
            onClick={() => handleLang('both')}
          >
            🌍 Оба
          </button>
        </div>
      </section>

      {/* Level */}
      <section className="settings-section">
        <h3>📊 Текущий уровень</h3>
        <div className="settings-levels">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              className={`settings-level-btn ${currentLevel === lvl ? 'active' : ''}`}
              onClick={() => handleLevel(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>
      </section>

      {/* Toggles */}
      <section className="settings-section">
        <div className="settings-toggle-row" onClick={handleNotifications}>
          <div>
            <h3>🔔 Напоминания</h3>
            <p className="settings-desc">Ежедневные напоминания о практике</p>
          </div>
          <div className={`settings-switch ${notifications ? 'active' : ''}`}>
            <div className="settings-switch-thumb" />
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-toggle-row" onClick={handleTheme}>
          <div>
            <h3>{darkTheme ? '🌙' : '☀️'} Тема</h3>
            <p className="settings-desc">
              {darkTheme ? 'Тёмная тема' : 'Светлая тема'}
            </p>
          </div>
          <div className={`settings-switch ${darkTheme ? 'active' : ''}`}>
            <div className="settings-switch-thumb" />
          </div>
        </div>
      </section>

      {/* Data management */}
      <section className="settings-section">
        <h3>💾 Данные</h3>
        <div className="settings-data-buttons">
          <button className="settings-data-btn settings-export-btn" onClick={handleExport}>
            📤 Экспорт данных
          </button>
          <button className="settings-data-btn settings-import-btn" onClick={handleImport}>
            📥 Импорт данных
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>
        {showExportSuccess && (
          <div className="settings-toast settings-toast-success">
            ✅ Данные экспортированы!
          </div>
        )}
        {showImportSuccess && (
          <div className="settings-toast settings-toast-success">
            ✅ Данные импортированы!
          </div>
        )}
      </section>

      {/* Reset */}
      <section className="settings-section">
        <h3>⚠️ Сброс прогресса</h3>
        <p className="settings-desc">Это действие нельзя отменить</p>
        {!showResetConfirm ? (
          <button
            className="settings-reset-btn"
            onClick={() => setShowResetConfirm(true)}
          >
            Сбросить весь прогресс
          </button>
        ) : (
          <div className="settings-reset-confirm">
            <p>Вы уверены? Весь прогресс будет удалён.</p>
            <div className="settings-reset-actions">
              <button className="settings-confirm-yes" onClick={handleResetProgress}>
                Да, сбросить
              </button>
              <button
                className="settings-confirm-no"
                onClick={() => setShowResetConfirm(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </section>

      {/* About */}
      <section className="settings-section settings-about">
        <h3>ℹ️ О приложении</h3>
        <div className="settings-about-content">
          <p className="settings-app-name">Linguo</p>
          <p className="settings-app-version">Версия 1.0.0</p>
          <p className="settings-app-desc">
            Изучайте английский и немецкий с умным повторением
          </p>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />
    </div>
  );
}
