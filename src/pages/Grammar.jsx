import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import grammarData from '../data/grammar';
import { getDailyProgress, saveDailyProgress } from '../db';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './Grammar.css';

export default function Grammar() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedLang, setSelectedLang] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  // Exercise mode
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
          <span className="grammar-counter">
            {currentEx + 1} / {activeTopic.exercises.length}
          </span>
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

  // Topic list
  return (
    <div className="grammar-page">
      <header className="grammar-header">
        <button className="grammar-back" onClick={() => navigate('/')}>
          ← Назад
        </button>
        <h2>Правила & Практика</h2>
      </header>

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
            placeholder="🔍 Поиск правила..."
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

      <div className="grammar-topics">
        {filteredTopics.map((topic) => {
          const completed = topicProgress[topic.id] || 0;
          const total = topic.exercises ? topic.exercises.length : 0;
          const isCompleted = total > 0 && completed >= total;

          return (
            <div
              key={topic.id}
              className={`grammar-topic-card ${isCompleted ? 'grammar-topic-done' : ''}`}
              onClick={() => total > 0 && startTopic(topic)}
            >
              <div className="grammar-topic-info">
                <div className="grammar-topic-top">
                  <span className="grammar-topic-level">{topic.level}</span>
                  <span className="grammar-topic-lang">
                    {topic.language === 'en' ? '🇺🇸 US' : '🇩🇪 DE'}
                  </span>
                  {isCompleted && <span className="grammar-topic-check">✅ Пройдено</span>}
                </div>
                <h3 className="grammar-topic-name">{topic.title}</h3>
                {topic.description && (
                  <p className="grammar-topic-desc">{topic.description}</p>
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
                      {completed}/{total}
                    </span>
                  </div>
                )}
              </div>
              <span className="grammar-topic-arrow">→</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
