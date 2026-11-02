import React, { useState, useEffect } from 'react';
import { getAllCards } from '../db';
import { speakText } from '../utils/speech';
import { gamification } from '../utils/gamification';
import './DictionaryModal.css';

export default function DictionaryModal({ isOpen, onClose, defaultLanguage = 'en' }) {
  const [words, setWords] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState(defaultLanguage);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [slowAudio, setSlowAudio] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [starredList, setStarredList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadWords();
      setSelectedLang(defaultLanguage);
      setStarredList(gamification.getStarred());
    }
  }, [isOpen, defaultLanguage]);

  const loadWords = async () => {
    try {
      const cards = await getAllCards();
      setWords(cards);
    } catch (e) {
      console.error('Failed to load dictionary words', e);
    }
  };

  if (!isOpen) return null;

  const categories = ['ALL', ...new Set(words.map((w) => w.category).filter(Boolean))];
  const levels = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const toggleStar = (wordId, e) => {
    e.stopPropagation();
    gamification.toggleStarred(wordId);
    setStarredList([...gamification.getStarred()]);
  };

  const filteredWords = words.filter((w) => {
    if (onlyStarred && !starredList.includes(w.id)) return false;
    if (selectedLang !== 'all' && w.language !== selectedLang) return false;
    if (selectedLevel !== 'ALL' && w.level !== selectedLevel) return false;
    if (activeCategory !== 'ALL' && w.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchWord = (w.word || '').toLowerCase().includes(q);
      const matchTrans = (w.translation || '').toLowerCase().includes(q);
      const matchEx = (w.example || '').toLowerCase().includes(q);
      if (!matchWord && !matchTrans && !matchEx) return false;
    }
    return true;
  });

  const handleSpeak = (word, e, forceSlow = false) => {
    e.stopPropagation();
    setPlayingId(word.id);
    speakText(word.word, word.language, { slow: forceSlow || slowAudio });
    setTimeout(() => setPlayingId(null), 1200);
  };

  return (
    <div className="dict-overlay" onClick={onClose}>
      <div className="dict-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dict-header">
          <div className="dict-title-box">
            <h2>📖 Словарь ({filteredWords.length})</h2>
            <p className="dict-subtitle">Все слова с озвучкой, примерами и избранным</p>
          </div>
          <button className="dict-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="dict-controls">
          <div className="dict-search-box">
            <span className="dict-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Поиск по слову, переводу или примеру..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dict-search-input"
            />
            {search && (
              <button className="dict-clear-btn" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="dict-filter-row">
            <div className="dict-lang-toggles">
              <button
                className={`dict-toggle ${selectedLang === 'en' ? 'active' : ''}`}
                onClick={() => setSelectedLang('en')}
              >
                🇺🇸 English (US)
              </button>
              <button
                className={`dict-toggle ${selectedLang === 'de' ? 'active' : ''}`}
                onClick={() => setSelectedLang('de')}
              >
                🇩🇪 Deutsch
              </button>
              <button
                className={`dict-toggle ${selectedLang === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedLang('all')}
              >
                Все
              </button>
            </div>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="dict-level-select"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl === 'ALL' ? 'Все уровни' : `Уровень ${lvl}`}
                </option>
              ))}
            </select>

            <button
              className={`dict-star-filter-btn ${onlyStarred ? 'active' : ''}`}
              onClick={() => setOnlyStarred(!onlyStarred)}
              title="Показать только избранные слова"
            >
              ⭐
            </button>

            <button
              className={`dict-slow-btn ${slowAudio ? 'active' : ''}`}
              onClick={() => setSlowAudio(!slowAudio)}
              title="Замедленная речь (0.65x)"
            >
              🐢
            </button>
          </div>

          {categories.length > 2 && (
            <div className="dict-categories-scroll">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`dict-cat-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'ALL' ? 'Все темы' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="dict-list">
          {filteredWords.length === 0 ? (
            <div className="dict-empty">
              <span>🔍</span>
              <p>Ничего не найдено</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedLevel('ALL');
                  setActiveCategory('ALL');
                  setOnlyStarred(false);
                }}
                className="dict-reset-btn"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            filteredWords.map((item) => {
              const isFav = starredList.includes(item.id);
              return (
                <div key={item.id} className="dict-card">
                  <div className="dict-card-main">
                    <div className="dict-card-top">
                      <span className="dict-card-word">{item.word}</span>
                      <button
                        className={`dict-audio-btn ${playingId === item.id ? 'playing' : ''}`}
                        onClick={(e) => handleSpeak(item, e)}
                        title="Прослушать произношение"
                      >
                        🔊
                      </button>
                      <button
                        className="dict-audio-slow-btn"
                        onClick={(e) => handleSpeak(item, e, true)}
                        title="Прослушать медленно"
                      >
                        🐢
                      </button>
                      <button
                        className={`dict-card-star-btn ${isFav ? 'starred' : ''}`}
                        onClick={(e) => toggleStar(item.id, e)}
                        title={isFav ? 'Удалить из избранного' : 'Добавить в избранное'}
                      >
                        {isFav ? '⭐' : '☆'}
                      </button>
                      <span className="dict-card-badge">{item.level}</span>
                      {item.language === 'en' ? (
                        <span className="dict-lang-flag">🇺🇸</span>
                      ) : (
                        <span className="dict-lang-flag">🇩🇪</span>
                      )}
                    </div>
                    <div className="dict-card-translation">{item.translation}</div>
                    {item.example && (
                      <div className="dict-card-example">
                        <em>«{item.example}»</em>
                        {item.exampleTranslation && (
                          <span className="dict-example-tr">{item.exampleTranslation}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="dict-card-footer">
                    <span className="dict-cat-label">📁 {item.category || 'Общее'}</span>
                    <span className="dict-status-pill">
                      {item.repetitions > 0 ? `✓ Повторено ${item.repetitions} раз` : '⚪ Новое'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
