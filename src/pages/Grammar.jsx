import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import grammarData from '../data/grammar';
import grammarTheory from '../data/grammarTheory';
import { getDailyProgress, saveDailyProgress } from '../db';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './Grammar.css';

export default function Grammar() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [mainTab, setMainTab] = useState('theory'); // 'theory' | 'practice'
  const [selectedLang, setSelectedLang] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rule handbook viewing state
  const [viewingRule, setViewingRule] = useState(null);

  // Exercise testing state
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentEx, setCurrentEx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [topicProgress, setTopicProgress] = useState({});
  const [exerciseMode, setExerciseMode] = useState(false);

  useEffect(() => {
    setTopics(grammarData || []);
    try {
      const saved = localStorage.getItem('linguo-grammar-progress');
      if (saved) setTopicProgress(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveTopicProgress = (prog) => {
    setTopicProgress(prog);
    localStorage.setItem('linguo-grammar-progress', JSON.stringify(prog));
  };

  const startTopic = (topic) => {
    setActiveTopic(topic);
    setCurrentEx(0);
    setSelected(null);
    setShowFeedback(false);
    setExerciseMode(true);
    setViewingRule(null);
  };

  const openRuleHandbook = (topic) => {
    setViewingRule(topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const speakSentence = (text, lang) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const handleSelect = async (option) => {
    if (selected !== null) return;
    setSelected(option);
    setShowFeedback(true);

    const exercise = activeTopic.exercises[currentEx];
    const isCorrect = option === exercise.correct;

    if (isCorrect) {
      sounds.playCorrect();
      gamification.addXP(15);
    } else {
      sounds.playWrong();
    }

    if (isCorrect) {
      try {
        const progress = (await getDailyProgress()) || {
          date: new Date().toISOString().split('T')[0],
          correct: 0,
          wrong: 0,
          reviewed: 0,
          grammarDone: 0,
        };
        progress.grammarDone = (progress.grammarDone || 0) + 1;
        await saveDailyProgress(progress);
      } catch (_) {}
    }
  };

  const nextExercise = () => {
    const nextIdx = currentEx + 1;
    if (nextIdx >= activeTopic.exercises.length) {
      sounds.playComplete();
      gamification.addXP(30);
      const newProg = {
        ...topicProgress,
        [activeTopic.id]: activeTopic.exercises.length,
      };
      saveTopicProgress(newProg);
      setExerciseMode(false);
      setActiveTopic(null);
    } else {
      setCurrentEx(nextIdx);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  const goBack = () => {
    if (exerciseMode) {
      setExerciseMode(false);
      setActiveTopic(null);
    } else if (viewingRule) {
      setViewingRule(null);
    } else {
      navigate('/');
    }
  };

  const filteredTopics = topics.filter((t) => {
    if (selectedLang !== 'all' && t.language !== selectedLang) return false;
    if (selectedLevel !== 'all' && t.level !== selectedLevel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (t.title || '').toLowerCase().includes(q);
      const matchDesc = (t.description || '').toLowerCase().includes(q);
      const theory = grammarTheory[t.id];
      const matchTheory = theory && (
        (theory.subtitle || '').toLowerCase().includes(q) ||
        (theory.overview || '').toLowerCase().includes(q)
      );
      if (!matchTitle && !matchDesc && !matchTheory) return false;
    }
    return true;
  });

  // ==========================================
  // VIEW 1: DETAILED RULE HANDBOOK VIEW
  // ==========================================
  if (viewingRule) {
    const theory = grammarTheory[viewingRule.id] || {
      title: viewingRule.title,
      subtitle: viewingRule.description,
      overview: viewingRule.description,
      formulas: [],
      rules: [],
      markers: [],
      examples: [],
      mistakes: [],
      proTip: 'Учите правила в контексте живых диалогов!',
    };

    const hasExercises = viewingRule.exercises && viewingRule.exercises.length > 0;

    return (
      <div className="grammar-page grammar-theory-view">
        <header className="grammar-header">
          <button className="grammar-back" onClick={() => setViewingRule(null)}>
            ← Все правила
          </button>
          <div className="grammar-header-badges">
            <span className="grammar-topic-level-badge">{viewingRule.level}</span>
            <span className="grammar-topic-lang-badge">
              {viewingRule.language === 'en' ? '🇺🇸 English (US)' : '🇩🇪 Deutsch'}
            </span>
          </div>
        </header>

        {/* Hero section */}
        <div className="rule-hero-card">
          <div className="rule-hero-flag">{viewingRule.language === 'en' ? '🇺🇸' : '🇩🇪'}</div>
          <h1 className="rule-hero-title">{theory.title || viewingRule.title}</h1>
          <p className="rule-hero-subtitle">{theory.subtitle || viewingRule.description}</p>
          <div className="rule-hero-overview">
            <p>{theory.overview}</p>
          </div>
        </div>

        {/* Formulas section */}
        {theory.formulas && theory.formulas.length > 0 && (
          <section className="rule-section">
            <h2 className="rule-section-title">
              <span className="rule-section-icon">📐</span> Формулы и схемы образования
            </h2>
            <div className="rule-formulas-grid">
              {theory.formulas.map((f, i) => (
                <div key={i} className="rule-formula-card">
                  <div className="rule-formula-badge">{f.label}</div>
                  <pre className="rule-formula-text">{f.formula}</pre>
                  {f.example && (
                    <div className="rule-formula-example">
                      <span className="example-tag">Пример:</span>
                      <code>{f.example}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key rules section */}
        {theory.rules && theory.rules.length > 0 && (
          <section className="rule-section">
            <h2 className="rule-section-title">
              <span className="rule-section-icon">📌</span> Ключевые правила и нюансы
            </h2>
            <div className="rule-items-list">
              {theory.rules.map((r, i) => (
                <div key={i} className="rule-item-box">
                  <div className="rule-item-number">{i + 1}</div>
                  <div className="rule-item-content">
                    <h3 className="rule-item-title">{r.title}</h3>
                    <p className="rule-item-text">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Signal words / Markers */}
        {theory.markers && theory.markers.length > 0 && (
          <section className="rule-section">
            <h2 className="rule-section-title">
              <span className="rule-section-icon">🏷️</span> Слова-маркеры (Сигнальные слова)
            </h2>
            <div className="rule-markers-wrap">
              {theory.markers.map((m, i) => (
                <span key={i} className="rule-marker-chip">
                  {m}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Live Examples with audio */}
        {theory.examples && theory.examples.length > 0 && (
          <section className="rule-section">
            <h2 className="rule-section-title">
              <span className="rule-section-icon">💬</span> Живые примеры с озвучкой
            </h2>
            <div className="rule-examples-list">
              {theory.examples.map((ex, i) => (
                <div key={i} className="rule-example-card">
                  <div className="rule-example-top">
                    <span className="rule-example-orig">{ex.original}</span>
                    <button
                      className="rule-audio-btn"
                      title="Слушать произношение"
                      onClick={() => speakSentence(ex.original, viewingRule.language)}
                    >
                      🔊
                    </button>
                  </div>
                  <div className="rule-example-trans">{ex.translation}</div>
                  {ex.note && <div className="rule-example-note">💡 {ex.note}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Common Mistakes */}
        {theory.mistakes && theory.mistakes.length > 0 && (
          <section className="rule-section">
            <h2 className="rule-section-title">
              <span className="rule-section-icon">⚠️</span> Типичные ошибки (Как НЕ надо)
            </h2>
            <div className="rule-mistakes-list">
              {theory.mistakes.map((m, i) => (
                <div key={i} className="rule-mistake-card">
                  <div className="rule-mistake-row wrong">
                    <span className="mistake-icon">❌</span>
                    <span className="mistake-text">{m.wrong}</span>
                  </div>
                  <div className="rule-mistake-row correct">
                    <span className="mistake-icon">✅</span>
                    <span className="mistake-text">{m.correct}</span>
                  </div>
                  {m.explanation && (
                    <div className="rule-mistake-why">{m.explanation}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pro tip */}
        {theory.proTip && (
          <div className="rule-protip-box">
            <div className="rule-protip-header">
              <span className="rule-protip-icon">💎</span> Лайфхак от лингвиста
            </div>
            <p className="rule-protip-text">{theory.proTip}</p>
          </div>
        )}

        {/* Bottom CTA to start practice */}
        {hasExercises && (
          <div className="rule-bottom-cta">
            <button
              className="rule-start-practice-btn"
              onClick={() => startTopic(viewingRule)}
            >
              <span>🎯 Закрепить на практике ({viewingRule.exercises.length} заданий)</span>
              <span className="rule-cta-xp">+15 XP</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: EXERCISE / QUIZ TESTING MODE
  // ==========================================
  if (exerciseMode && activeTopic) {
    const exercise = activeTopic.exercises[currentEx];
    const isCorrect = selected === exercise.correct;
    const progressPct = ((currentEx + 1) / activeTopic.exercises.length) * 100;

    return (
      <div className="grammar-page">
        <header className="grammar-header">
          <button className="grammar-back" onClick={goBack}>
            ← К темам
          </button>
          <div className="grammar-header-badges">
            <button
              className="grammar-theory-quick-btn"
              onClick={() => setViewingRule(activeTopic)}
              title="Открыть правило"
            >
              📖 Правило
            </button>
            <span className="grammar-counter">
              {currentEx + 1} / {activeTopic.exercises.length}
            </span>
          </div>
        </header>

        <div className="grammar-progress-bar">
          <div
            className="grammar-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="grammar-topic-title-bar">
          <span className="grammar-topic-level-badge">{activeTopic.level}</span>
          <h3>{activeTopic.title}</h3>
        </div>

        <div className="grammar-exercise-card">
          <p className="grammar-sentence">
            {exercise.sentence.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`grammar-gap ${selected !== null ? (isCorrect ? 'correct' : 'wrong') : ''}`}>
                    {selected !== null ? exercise.options[selected] || '____' : '_____'}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>

        <div className="grammar-options">
          {exercise.options.map((option, idx) => {
            let cls = 'grammar-option';
            if (showFeedback) {
              if (idx === exercise.correct) {
                cls += ' grammar-option-correct';
              } else if (idx === selected && !isCorrect) {
                cls += ' grammar-option-wrong';
              } else {
                cls += ' grammar-option-dim';
              }
            } else if (idx === selected) {
              cls += ' grammar-option-selected';
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
              >
                <span className="grammar-option-letter">{String.fromCharCode(65 + idx)}</span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div
            className={`grammar-feedback ${
              isCorrect ? 'grammar-feedback-correct' : 'grammar-feedback-wrong'
            }`}
          >
            <div className="grammar-feedback-header">
              {isCorrect ? '✅ Отлично! Ответ верный' : '❌ Не совсем верно'}
            </div>
            {exercise.explanation && (
              <p className="grammar-explanation">{exercise.explanation}</p>
            )}
            <button className="grammar-next-btn" onClick={nextExercise}>
              {currentEx + 1 >= activeTopic.exercises.length
                ? 'Завершить тему (+30 XP) 🏆'
                : 'Следующее задание →'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 3: MAIN LIST (THEORY HANDBOOK & PRACTICE)
  // ==========================================
  return (
    <div className="grammar-page">
      <header className="grammar-header">
        <button className="grammar-back" onClick={() => navigate('/')}>
          ← Назад
        </button>
        <h2>Грамматический справочник</h2>
      </header>

      {/* Main Switcher: Справочник правил vs Тренажёр */}
      <div className="grammar-mode-switcher">
        <button
          className={`grammar-mode-btn ${mainTab === 'theory' ? 'active' : ''}`}
          onClick={() => setMainTab('theory')}
        >
          <span className="mode-btn-icon">📖</span>
          <span className="mode-btn-label">Справочник правил</span>
          <span className="mode-btn-badge">{topics.length} тем</span>
        </button>
        <button
          className={`grammar-mode-btn ${mainTab === 'practice' ? 'active' : ''}`}
          onClick={() => setMainTab('practice')}
        >
          <span className="mode-btn-icon">🎯</span>
          <span className="mode-btn-label">Тренажёр тестов</span>
          <span className="mode-btn-badge">112 задач</span>
        </button>
      </div>

      {/* Language filter pills */}
      <div className="grammar-lang-tabs">
        <button
          className={`grammar-lang-tab ${selectedLang === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedLang('all')}
        >
          Все ({topics.length})
        </button>
        <button
          className={`grammar-lang-tab ${selectedLang === 'en' ? 'active' : ''}`}
          onClick={() => setSelectedLang('en')}
        >
          🇺🇸 English ({topics.filter((t) => t.language === 'en').length})
        </button>
        <button
          className={`grammar-lang-tab ${selectedLang === 'de' ? 'active' : ''}`}
          onClick={() => setSelectedLang('de')}
        >
          🇩🇪 Deutsch ({topics.filter((t) => t.language === 'de').length})
        </button>
      </div>

      {/* Level filter & search bar */}
      <div className="grammar-filter-bar">
        <div className="grammar-level-pills">
          {['all', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
            <button
              key={lvl}
              className={`grammar-level-pill ${selectedLevel === lvl ? 'active' : ''}`}
              onClick={() => setSelectedLevel(lvl)}
            >
              {lvl === 'all' ? 'Все уровни' : lvl}
            </button>
          ))}
        </div>
        <div className="grammar-search-wrap">
          <input
            type="text"
            className="grammar-search-input"
            placeholder="🔍 Поиск правила, формулы, темы..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="grammar-search-clear" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Topics list */}
      <div className="grammar-topics">
        {filteredTopics.length === 0 ? (
          <div className="grammar-empty-state">
            <div className="empty-icon">🔎</div>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить поисковый запрос или выбрать другой уровень</p>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const completed = topicProgress[topic.id] || 0;
            const total = topic.exercises ? topic.exercises.length : 0;
            const isCompleted = total > 0 && completed >= total;
            const theory = grammarTheory[topic.id];

            return (
              <div
                key={topic.id}
                className={`grammar-topic-card ${isCompleted ? 'grammar-topic-done' : ''}`}
              >
                <div className="grammar-topic-info" onClick={() => openRuleHandbook(topic)}>
                  <div className="grammar-topic-top">
                    <span className="grammar-topic-level">{topic.level}</span>
                    <span className="grammar-topic-lang">
                      {topic.language === 'en' ? '🇺🇸 US' : '🇩🇪 DE'}
                    </span>
                    {isCompleted && <span className="grammar-topic-check">✅ Пройдено</span>}
                    {theory && theory.formulas && (
                      <span className="grammar-theory-tag">Формулы + Разбор</span>
                    )}
                  </div>
                  
                  <h3 className="grammar-topic-name">{topic.title}</h3>
                  <p className="grammar-topic-desc">
                    {theory?.subtitle || topic.description}
                  </p>

                  {/* Highlights preview */}
                  {theory?.markers && (
                    <div className="grammar-card-markers">
                      {theory.markers.slice(0, 3).map((m, idx) => (
                        <span key={idx} className="grammar-card-marker-pill">
                          {m.split('(')[0].trim()}
                        </span>
                      ))}
                      {theory.markers.length > 3 && (
                        <span className="grammar-card-marker-more">+{theory.markers.length - 3}</span>
                      )}
                    </div>
                  )}

                  {total > 0 && (
                    <div className="grammar-topic-progress">
                      <div className="grammar-topic-progress-bar">
                        <div
                          className="grammar-topic-progress-fill"
                          style={{ width: `${(completed / total) * 100}%` }}
                        />
                      </div>
                      <span className="grammar-topic-progress-text">
                        Пройдено тестов: {completed}/{total}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dual actions: Read Theory or Start Practice */}
                <div className="grammar-card-actions">
                  <button
                    className="grammar-card-btn theory-btn"
                    onClick={() => openRuleHandbook(topic)}
                    title="Читать подробное правило"
                  >
                    📖 Читать правило
                  </button>
                  {total > 0 && (
                    <button
                      className="grammar-card-btn practice-btn"
                      onClick={() => startTopic(topic)}
                      title="Начать упражнения"
                    >
                      🎯 Практика
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
