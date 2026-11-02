import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, saveSetting, getAllCards } from '../db';
import { api } from '../utils/api';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import { speakText } from '../utils/speech';
import AuthModal from '../components/AuthModal';
import './Settings.css';

const DAILY_GOALS = [5, 10, 15, 20, 30];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const THEMES = [
  { id: 'navy', label: '🌙 Тёмная (Navy)' },
  { id: 'oled', label: '⬛ OLED (Чёрная)' },
  { id: 'light', label: '☀️ Светлая' },
];

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dailyGoal, setDailyGoal] = useState(15);
  const [defaultLang, setDefaultLang] = useState('both');
  const [currentLevel, setCurrentLevel] = useState('A1');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState('0.9');
  const [voiceEngine, setVoiceEngine] = useState('studio');
  const [activeTheme, setActiveTheme] = useState('navy');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [mistakesCount, setMistakesCount] = useState(0);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings.dailyGoal) setDailyGoal(Number(settings.dailyGoal));
        if (settings.defaultLang) setDefaultLang(settings.defaultLang);
        if (settings.level) setCurrentLevel(settings.level);
        if (settings.soundEnabled !== undefined) {
          setSoundEnabled(settings.soundEnabled);
          sounds.enabled = settings.soundEnabled;
        }
        if (settings.speechSpeed) setSpeechSpeed(settings.speechSpeed);
        
        const savedEngine = localStorage.getItem('linguo_voice_engine') || settings.voiceEngine || 'studio';
        setVoiceEngine(savedEngine);

        if (settings.theme) {
          setActiveTheme(settings.theme);
          applyTheme(settings.theme);
        }
        setMistakesCount(gamification.getMistakes().length);
        try {
          const u = await api.getMe();
          setUser(u);
        } catch (e) {}
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const applyTheme = (themeId) => {
    if (typeof document !== 'undefined') {
      if (themeId === 'oled') {
        document.body.setAttribute('data-theme', 'oled');
      } else if (themeId === 'light') {
        document.body.setAttribute('data-theme', 'light');
      } else {
        document.body.removeAttribute('data-theme');
      }
    }
  };

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

  const handleSoundToggle = async () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    sounds.enabled = newVal;
    if (newVal) sounds.playCorrect();
    await saveSetting('soundEnabled', newVal);
  };

  const handleSpeechSpeed = async (speed) => {
    setSpeechSpeed(speed);
    await saveSetting('speechSpeed', speed);
  };

  const handleVoiceEngine = async (engine) => {
    setVoiceEngine(engine);
    localStorage.setItem('linguo_voice_engine', engine);
    await saveSetting('voiceEngine', engine);
    // Preview the selected engine
    speakText('Hello, this is human-like voice', 'en');
  };

  const handleTestVoice = (lang) => {
    if (lang === 'en') {
      speakText('Hello! Practice makes perfect.', 'en');
    } else {
      speakText('Guten Tag! Übung macht den Meister.', 'de');
    }
  };

  const handleThemeChange = async (themeId) => {
    setActiveTheme(themeId);
    applyTheme(themeId);
    await saveSetting('theme', themeId);
  };

  const handleClearMistakes = () => {
    localStorage.removeItem('linguo_mistakes');
    setMistakesCount(0);
    sounds.playCorrect();
  };

  const handleSync = async () => {
    setSyncStatus('Синхронизация...');
    try {
      const cards = await getAllCards();
      const cardMap = {};
      cards.forEach((c) => {
        if (c.repetitions > 0) {
          cardMap[c.id] = {
            interval: c.interval,
            repetitions: c.repetitions,
            easeFactor: c.easeFactor,
            nextReview: c.nextReview,
          };
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
      localStorage.removeItem('linguo_mistakes');
      localStorage.removeItem('linguo_user_xp');
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
        version: '1.2.0',
        exportDate: new Date().toISOString(),
        cards: allCards,
        settings,
        grammarProgress: grammarProgress ? JSON.parse(grammarProgress) : {},
        xp: gamification.getXP(),
        mistakes: gamification.getMistakes(),
        starred: gamification.getStarred(),
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

      if (data.xp) {
        localStorage.setItem('linguo_user_xp', data.xp.toString());
      }

      setShowImportSuccess(true);
      setTimeout(() => {
        setShowImportSuccess(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Import failed:', err);
      alert('Ошибка импорта. Проверьте формат файла.');
    }

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

      {/* Voice & Pronunciation Section */}
      <section className="settings-section">
        <h3>🗣️ Озвучка и голос (Human Voice)</h3>
        <p className="settings-desc">Выберите движок произношения слов:</p>

        <div className="settings-voice-options">
          <button
            className={`settings-voice-btn ${voiceEngine === 'studio' ? 'active' : ''}`}
            onClick={() => handleVoiceEngine('studio')}
          >
            <span className="settings-voice-icon">🌟</span>
            <div>
              <strong>Студийный живой голос (Рекомендуется)</strong>
              <small>Нейросеть с естественной интонацией человека</small>
            </div>
          </button>

          <button
            className={`settings-voice-btn ${voiceEngine === 'system' ? 'active' : ''}`}
            onClick={() => handleVoiceEngine('system')}
          >
            <span className="settings-voice-icon">📱</span>
            <div>
              <strong>Системный голос iOS Siri / Google</strong>
              <small>Встроенный диктор вашего устройства (работает офлайн)</small>
            </div>
          </button>
        </div>

        {/* Test voice buttons */}
        <div className="settings-voice-test-row">
          <button className="settings-test-btn" onClick={() => handleTestVoice('en')}>
            🔊 Тест: English (US) 🇺🇸
          </button>
          <button className="settings-test-btn" onClick={() => handleTestVoice('de')}>
            🔊 Тест: Deutsch 🇩🇪
          </button>
        </div>

        {/* Speed adjustment */}
        <div className="settings-speed-box">
          <label className="settings-desc">Скорость речи:</label>
          <div className="settings-speed-row">
            <button
              className={`settings-speed-btn ${speechSpeed === '0.7' ? 'active' : ''}`}
              onClick={() => handleSpeechSpeed('0.7')}
            >
              🐢 0.7x
            </button>
            <button
              className={`settings-speed-btn ${speechSpeed === '0.9' ? 'active' : ''}`}
              onClick={() => handleSpeechSpeed('0.9')}
            >
              Стандарт 0.9x
            </button>
            <button
              className={`settings-speed-btn ${speechSpeed === '1.0' ? 'active' : ''}`}
              onClick={() => handleSpeechSpeed('1.0')}
            >
              🐰 1.0x
            </button>
          </div>
        </div>

        <div className="settings-tip-box">
          <span className="settings-tip-icon">💡</span>
          <p>
            <strong>Совет для iPhone:</strong> Чтобы системный голос звучал максимально естественно, откройте{' '}
            <em>Настройки iPhone → Универсальный доступ → Устный контент → Голоса</em> и выберите улучшенный голос <strong>Siri</strong>.
          </p>
        </div>
      </section>

      {/* Theme Selection */}
      <section className="settings-section">
        <h3>🎨 Тема оформления</h3>
        <div className="settings-theme-row">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`settings-theme-btn ${activeTheme === t.id ? 'active' : ''}`}
              onClick={() => handleThemeChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Audio & Sound Effects */}
      <section className="settings-section">
        <div className="settings-toggle-row" onClick={handleSoundToggle}>
          <div>
            <h3>🎵 Звуковые эффекты</h3>
            <p className="settings-desc">Звук при правильных и неправильных ответах</p>
          </div>
          <div className={`settings-switch ${soundEnabled ? 'active' : ''}`}>
            <div className="settings-switch-thumb" />
          </div>
        </div>
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
            🇺🇸 English (US)
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

      {/* Mistakes Management */}
      {mistakesCount > 0 && (
        <section className="settings-section">
          <h3>⚠️ Список ошибок</h3>
          <p className="settings-desc">Сейчас сохранено {mistakesCount} слов на отработку.</p>
          <button className="settings-clear-mistakes-btn" onClick={handleClearMistakes}>
            🧹 Очистить список ошибок
          </button>
        </section>
      )}

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
            <p>Вы уверены? Весь прогресс, очки XP и статистика будут удалены.</p>
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
          <p className="settings-app-name">Linguo Super 2.0</p>
          <p className="settings-app-version">Версия 2.1.0 (Studio Neural Audio)</p>
          <p className="settings-app-desc">
            Изучайте английский и немецкий с умным повторением, играми и естественной человеческой речью
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
