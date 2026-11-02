import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { addCard, getAllCards } from '../db';
import { speakText } from '../utils/speech';
import './WordManagerModal.css';

export default function WordManagerModal({ isOpen, onClose, onWordAdded }) {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [language, setLanguage] = useState('en');
  const [level, setLevel] = useState('A1');
  const [category, setCategory] = useState('');
  const [example, setExample] = useState('');
  const [exampleTranslation, setExampleTranslation] = useState('');
  const [customWords, setCustomWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCustomWords();
    }
  }, [isOpen]);

  const loadCustomWords = async () => {
    try {
      const words = await api.getCustomWords();
      setCustomWords(words);
    } catch (e) {
      console.warn(e);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) {
      setError('Заполните слово и перевод');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Try to save to server if online
      let savedWord = null;
      try {
        savedWord = await api.addCustomWord({
          word,
          translation,
          language,
          level,
          category: category.trim() || 'Мой словарь',
          example,
          exampleTranslation,
        });
      } catch (err) {
        // If not logged in or offline, create local ID
        savedWord = {
          id: 'local_' + Date.now(),
          word: word.trim(),
          translation: translation.trim(),
          language,
          level,
          category: category.trim() || 'Мой словарь',
          example: example.trim(),
          exampleTranslation: exampleTranslation.trim(),
        };
      }

      // 2. Add to IndexedDB so it's instantly available in flashcards & quiz
      await addCard({
        ...savedWord,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: new Date().toISOString(),
        learned: false,
      });

      setSuccess('Слово успешно добавлено!');
      setWord('');
      setTranslation('');
      setExample('');
      setExampleTranslation('');
      loadCustomWords();
      if (onWordAdded) onWordAdded();
    } catch (err) {
      setError(err.message || 'Ошибка добавления слова');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteCustomWord(id);
      setCustomWords(customWords.filter((w) => w.id !== id));
      if (onWordAdded) onWordAdded();
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="wm-overlay" onClick={onClose}>
      <div className="wm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="wm-close" onClick={onClose}>✕</button>

        <div className="wm-header">
          <span className="wm-icon">📖</span>
          <h2>Свой словарь</h2>
          <p className="wm-sub">Добавляйте собственные слова для изучения</p>
        </div>

        {error && <div className="wm-alert wm-alert-error">{error}</div>}
        {success && <div className="wm-alert wm-alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="wm-form">
          <div className="wm-row">
            <div className="wm-field wm-flex-1">
              <label>Язык</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">🇺🇸 English (US) — Американский</option>
                <option value="de">🇩🇪 Немецкий</option>
              </select>
            </div>
            <div className="wm-field wm-flex-1">
              <label>Уровень</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="wm-field">
            <label>Слово / фраза</label>
            <div className="wm-input-with-audio">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Например: serendipity или Gemütlichkeit"
                required
              />
              {word && (
                <button
                  type="button"
                  className="wm-speak-btn"
                  onClick={() => speakText(word, language)}
                  title="Прослушать"
                >
                  🔊
                </button>
              )}
            </div>
          </div>

          <div className="wm-field">
            <label>Перевод на русский</label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Например: приятная неожиданность"
              required
            />
          </div>

          <div className="wm-field">
            <label>Пример предложения (необязательно)</label>
            <input
              type="text"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="It was pure serendipity."
            />
          </div>

          <button type="submit" className="wm-submit-btn" disabled={loading}>
            {loading ? 'Сохранение...' : '+ Добавить в карточки'}
          </button>
        </form>

        {customWords.length > 0 && (
          <div className="wm-list-section">
            <h3>Добавленные слова ({customWords.length})</h3>
            <div className="wm-list">
              {customWords.map((w) => (
                <div key={w.id} className="wm-list-item">
                  <div className="wm-item-info">
                    <span className="wm-item-word">
                      {w.word}
                      <button
                        type="button"
                        className="wm-mini-speak"
                        onClick={() => speakText(w.word, w.language)}
                      >
                        🔊
                      </button>
                    </span>
                    <span className="wm-item-trans">{w.translation}</span>
                  </div>
                  <button
                    className="wm-del-btn"
                    onClick={() => handleDelete(w.id)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
