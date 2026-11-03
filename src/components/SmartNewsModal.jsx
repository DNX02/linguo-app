import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './SmartNewsModal.css';

const NEWS_ARTICLES = [
  {
    id: 'news-1',
    lang: 'en',
    category: '🚀 Space & Tech',
    title: 'NASA Discovers Ancient Riverbed on Mars',
    date: 'Сегодня, 08:30',
    level: 'B1',
    readTime: '2 мин',
    summary: 'Новейший марсоход Perseverance обнаружил следы древнего русла реки в кратере Езеро.',
    body: [
      { en: 'NASA\'s Perseverance rover has uncovered exciting geological evidence of an ancient rushing river on the surface of Mars.', ru: 'Марсоход NASA Perseverance обнаружил захватывающие геологические свидетельства древней бурной реки на поверхности Марса.' },
      { en: 'The high-resolution cameras revealed layered rock formations shaped by powerful water currents billions of years ago.', ru: 'Камеры высокого разрешения зафиксировали слоистые скальные образования, сформированные мощными водными потоками миллиарды лет назад.' },
      { en: 'Scientists believe this river was significantly deeper and faster than any waterways previously identified on the Red Planet.', ru: 'Ученые полагают, что эта река была значительно глубже и быстрее любых водоемов, ранее обнаруженных на Красной планете.' },
      { en: 'This landmark discovery brings humanity one step closer to understanding whether microbial life once existed beyond Earth.', ru: 'Это эпохальное открытие приближает человечество ещё на один шаг к пониманию того, существовала ли когда-то микробная жизнь за пределами Земли.' },
    ],
    vocab: [
      { word: 'evidence', trans: 'доказательства, свидетельства' },
      { word: 'rushing', trans: 'стремительный, бурный' },
      { word: 'waterways', trans: 'водные пути, каналы' },
      { word: 'landmark discovery', trans: 'знаковое эпохальное открытие' },
    ],
  },
  {
    id: 'news-2',
    lang: 'de',
    category: '🌱 Zukunft & Umwelt',
    title: 'Grüne Energie: Deutschland erzielt neuen Solarrekord',
    date: 'Вчера, 16:45',
    level: 'B1',
    readTime: '2 мин',
    summary: 'Благодаря солнечной погоде и новым технологиям возобновляемая энергия побила исторический рекорд.',
    body: [
      { en: 'In den letzten Wochen erzeugten Solaranlagen in ganz Deutschland mehr sauberen Strom als jemals zuvor.', ru: 'В последние недели солнечные электростанции по всей Германии произвели больше чистой электроэнергии, чем когда-либо прежде.' },
      { en: 'Moderne Solarmodule auf privaten Hausdächern spielen dabei eine immer wichtigere Rolle für die Energiewende.', ru: 'Современные солнечные модули на крышах частных домов играют все более важную роль в энергетическом переходе.' },
      { en: 'Experten loben die technologische Innovation und den raschen Ausbau von intelligenten Stromnetzen.', ru: 'Эксперты высоко оценивают технологические инновации и быстрое расширение интеллектуальных энергосетей.' },
      { en: 'Deutschland setzt damit ein klares Signal für nachhaltige und umweltfreundliche Zukunftstechnologien.', ru: 'Германия подает тем самым четкий сигнал в пользу устойчивых и экологически чистых технологий будущего.' },
    ],
    vocab: [
      { word: 'erzeugen', trans: 'производить, вырабатывать' },
      { word: 'die Energiewende', trans: 'энергетический переход' },
      { word: 'nachhaltig', trans: 'устойчивый, экологичный' },
      { word: 'der Ausbau', trans: 'расширение, развитие' },
    ],
  },
  {
    id: 'news-3',
    lang: 'en',
    category: '💡 AI & Innovations',
    title: 'How Generative AI is Changing Everyday Education',
    date: '2 дня назад',
    level: 'A2-B1',
    readTime: '1.5 мин',
    summary: 'Персонализированное обучение с искусственным интеллектом становится доступным каждому студенту в мире.',
    body: [
      { en: 'Artificial intelligence is fundamentally reshaping how people learn foreign languages and science around the globe.', ru: 'Искусственный интеллект кардинально меняет то, как люди изучают иностранные языки и науку по всему миру.' },
      { en: 'Instead of static textbooks, modern students interact with responsive, patient AI tutors capable of answering every question instantly.', ru: 'Вместо статичных учебников современные студенты взаимодействуют с чуткими и терпеливыми ИИ-наставниками, способными отвечать на любые вопросы мгновенно.' },
      { en: 'Language learning has become dynamic, conversational, and tailored to individual interests and learning speeds.', ru: 'Изучение языков стало динамичным, разговорным и адаптированным под индивидуальные интересы и скорость каждого.' },
    ],
    vocab: [
      { word: 'reshaping', trans: 'переосмысливает, меняет форму' },
      { word: 'responsive', trans: 'отзывчивый, чуткий' },
      { word: 'tailored', trans: 'индивидуально настроенный' },
    ],
  },
];

export default function SmartNewsModal({ isOpen, onClose }) {
  const [selectedArticle, setSelectedArticle] = useState(NEWS_ARTICLES[0]);
  const [isReadingArticle, setIsReadingArticle] = useState(false);
  const [savedVocab, setSavedVocab] = useState({});

  if (!isOpen) return null;

  const playSentenceAudio = (text, lang) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveWord = (vocabItem) => {
    setSavedVocab((prev) => ({ ...prev, [vocabItem.word]: true }));
    sounds.playCorrect();
    gamification.addXP(10);
  };

  return (
    <div className="news-modal-backdrop" onClick={onClose}>
      <div className="news-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="news-modal-header">
          <div className="news-title-box">
            <span className="news-badge-icon">📰</span>
            <div>
              <h3>Умная лента новостей</h3>
              <p>Адаптированные статьи с переводом и озвучкой в один клик</p>
            </div>
          </div>
          <button className="news-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Article list or Reading view */}
        {!isReadingArticle ? (
          <div className="news-feed-list">
            {NEWS_ARTICLES.map((article) => (
              <div
                key={article.id}
                className="news-card-item"
                onClick={() => {
                  setSelectedArticle(article);
                  setIsReadingArticle(true);
                }}
              >
                <div className="news-meta-row">
                  <span className="news-category-pill">{article.category}</span>
                  <span className="news-lang-pill">
                    {article.lang === 'en' ? '🇺🇸 US' : '🇩🇪 DE'} • {article.level}
                  </span>
                </div>
                <h3 className="news-card-title">{article.title}</h3>
                <p className="news-card-summary">{article.summary}</p>
                <div className="news-card-footer">
                  <span>⏱️ {article.readTime}</span>
                  <span className="news-read-btn">Читать статью →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="news-reader-view">
            <button
              className="news-back-to-list-btn"
              onClick={() => setIsReadingArticle(false)}
            >
              ← К списку новостей
            </button>

            <div className="article-header-meta">
              <span className="news-category-pill">{selectedArticle.category}</span>
              <span className="news-level-badge">{selectedArticle.level}</span>
              <span className="news-date">{selectedArticle.date}</span>
            </div>

            <h1 className="article-full-title">{selectedArticle.title}</h1>

            {/* Sentences with parallel Russian translation & audio button */}
            <div className="article-paragraphs-wrap">
              {selectedArticle.body.map((para, i) => (
                <div key={i} className="article-para-box">
                  <div className="para-orig-row">
                    <p className="para-orig-text">{para.en}</p>
                    <button
                      className="para-listen-btn"
                      onClick={() => playSentenceAudio(para.en, selectedArticle.lang)}
                      title="Слушать аудио"
                    >
                      🔊
                    </button>
                  </div>
                  <p className="para-ru-text">{para.ru}</p>
                </div>
              ))}
            </div>

            {/* Smart Vocab list */}
            {selectedArticle.vocab && (
              <div className="article-vocab-box">
                <h4>📚 Ключевые слова из статьи:</h4>
                <div className="vocab-chips-grid">
                  {selectedArticle.vocab.map((v, i) => (
                    <div key={i} className="vocab-chip">
                      <div className="vocab-chip-text">
                        <strong>{v.word}</strong>
                        <span>— {v.trans}</span>
                      </div>
                      <button
                        className={`vocab-save-btn ${savedVocab[v.word] ? 'saved' : ''}`}
                        onClick={() => handleSaveWord(v)}
                        title="Добавить в словарь"
                      >
                        {savedVocab[v.word] ? '✓ Сохранено' : '+ В словарь'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
