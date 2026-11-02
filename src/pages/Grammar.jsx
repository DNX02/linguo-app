import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import grammarData from '../data/grammar';
import { getDailyProgress, saveDailyProgress } from '../db';
import './Grammar.css';

export default function Grammar() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentEx, setCurrentEx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [topicProgress, setTopicProgress] = useState({});
  const [exerciseMode, setExerciseMode] = useState(false);

  useEffect(() => {
    setTopics(grammarData || []);
    // Load saved topic progress from localStorage
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

    // Update grammar progress in daily
    if (isCorrect) {
      const progress = (await getDailyProgress()) || {
        date: new Date().toISOString().split('T')[0],
        correct: 0,
        wrong: 0,
        reviewed: 0,
        grammarDone: 0,
      };
      progress.grammarDone = (progress.grammarDone || 0) + 1;
      await saveDailyProgress(progress);
    }
  };

  const nextExercise = () => {
    const nextIdx = currentEx + 1;
    if (nextIdx >= activeTopic.exercises.length) {
      // Topic complete
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

  // Exercise mode
  if (exerciseMode && activeTopic) {
    const exercise = activeTopic.exercises[currentEx];
    const isCorrect = selected === exercise.correct;
    const progressPct =
      ((currentEx + 1) / activeTopic.exercises.length) * 100;

    return (
      <div className="grammar-page">
        <header className="grammar-header">
          <button className="grammar-back" onClick={goBack}>
            ← Назад
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

        <div className="grammar-topic-title">
          <span className="grammar-topic-level-badge">{activeTopic.level}</span>
          <h3>{activeTopic.title}</h3>
        </div>

        <div className="grammar-exercise-card">
          <p className="grammar-sentence">
            {exercise.sentence.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="grammar-gap">
                    {selected === exercise.correct
                      ? exercise.correct
                      : '______'}
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
              if (option === exercise.correct) {
                cls += ' grammar-option-correct';
              } else if (option === selected && !isCorrect) {
                cls += ' grammar-option-wrong';
              } else {
                cls += ' grammar-option-dim';
              }
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(option)}
                disabled={selected !== null}
              >
                {option}
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
              {isCorrect ? '✅ Правильно!' : '❌ Неправильно'}
            </div>
            {exercise.explanation && (
              <p className="grammar-explanation">{exercise.explanation}</p>
            )}
            <button className="grammar-next-btn" onClick={nextExercise}>
              {currentEx + 1 >= activeTopic.exercises.length
                ? 'Завершить тему'
                : 'Далее →'}
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
        <h2>Грамматика</h2>
      </header>

      <div className="grammar-topics">
        {topics.length === 0 && (
          <div className="grammar-empty">
            <p>📝 Темы по грамматике скоро появятся!</p>
          </div>
        )}
        {topics.map((topic) => {
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
                  {topic.language && (
                    <span className="grammar-topic-lang">
                      {topic.language === 'en' ? '🇬🇧' : '🇩🇪'}
                    </span>
                  )}
                  {isCompleted && <span className="grammar-topic-check">✅</span>}
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
