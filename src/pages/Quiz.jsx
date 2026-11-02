import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCards, getDailyProgress, saveDailyProgress } from '../db';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './Quiz.css';

const QUESTIONS_PER_ROUND = 10;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateQuestions(cards, mode) {
  if (cards.length < 4) return [];
  const shuffled = shuffle(cards);
  const questions = [];

  for (let i = 0; i < Math.min(QUESTIONS_PER_ROUND, shuffled.length); i++) {
    const correctCard = shuffled[i];
    const wrongCards = shuffle(cards.filter((c) => c.id !== correctCard.id)).slice(0, 3);

    let prompt = correctCard.word;
    let correctAnswer = correctCard.translation;

    if (mode === 'translation-to-word') {
      prompt = correctCard.translation;
      correctAnswer = correctCard.word;
    } else if (mode === 'listening') {
      prompt = '🎧 Нажмите для повтора';
      correctAnswer = correctCard.translation;
    }

    const options = shuffle([
      correctAnswer,
      ...wrongCards.map((c) =>
        mode === 'translation-to-word' ? c.word : c.translation
      ),
    ]);

    questions.push({
      prompt,
      correctAnswer,
      options,
      card: correctCard,
    });
  }

  return questions;
}

const RESULT_EMOJI = [
  { min: 90, emoji: '🏆', text: 'Превосходно!' },
  { min: 70, emoji: '🌟', text: 'Отлично!' },
  { min: 50, emoji: '👍', text: 'Хорошо!' },
  { min: 30, emoji: '💪', text: 'Неплохо, продолжай!' },
  { min: 0, emoji: '📚', text: 'Нужно больше практики!' },
];

export default function Quiz() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // null = mode selection
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const mistakes = gamification.getMistakes();
    setMistakesCount(mistakes.length);
    return () => {
      isMounted.current = false;
    };
  }, []);

  const startQuiz = useCallback(async (selectedMode) => {
    setLoading(true);
    setMode(selectedMode);

    try {
      let cards = await getAllCards();
      if (selectedMode === 'mistakes') {
        const mistakeIds = gamification.getMistakes();
        const mistakeCards = cards.filter((c) => mistakeIds.includes(c.id));
        cards = mistakeCards.length >= 4 ? mistakeCards : cards;
      }

      const generated = generateQuestions(cards, selectedMode);
      setQuestions(generated);
      setCurrentQ(0);
      setCorrect(0);
      setWrong(0);
      setSelected(null);
      setShowResult(false);
      setFinished(false);
      setEarnedXP(0);

      // Auto-pronounce for listening mode on start
      if (selectedMode === 'listening' && generated[0]) {
        setTimeout(() => {
          speakText(generated[0].card.word, generated[0].card.language);
        }, 300);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnswer = useCallback(
    async (answer) => {
      if (selected !== null || !questions[currentQ]) return;
      setSelected(answer);
      const question = questions[currentQ];
      const isCorrect = answer === question.correctAnswer;

      if (isCorrect) {
        sounds.playCorrect();
        setCorrect((c) => c + 1);
        gamification.addXP(10);
        gamification.removeMistake(question.card.id);
      } else {
        sounds.playWrong();
        setWrong((w) => w + 1);
        gamification.addMistake(question.card.id);
      }

      setShowResult(true);

      setTimeout(async () => {
        setTransitioning(true);

        try {
          const progress = (await getDailyProgress()) || {
            date: new Date().toISOString().split('T')[0],
            correct: 0,
            wrong: 0,
            reviewed: 0,
          };
          if (isCorrect) {
            progress.correct = (progress.correct || 0) + 1;
          } else {
            progress.wrong = (progress.wrong || 0) + 1;
          }
          await saveDailyProgress(progress);
        } catch (_) {}

        setTimeout(() => {
          if (currentQ + 1 >= questions.length) {
            sounds.playComplete();
            const bonusXP = 25 + Math.round((correct / questions.length) * 25);
            setEarnedXP(bonusXP);
            gamification.addXP(bonusXP);
            setFinished(true);
          } else {
            const nextQ = currentQ + 1;
            setCurrentQ(nextQ);
            setSelected(null);
            setShowResult(false);

            if (mode === 'listening' && questions[nextQ]) {
              setTimeout(() => {
                speakText(questions[nextQ].card.word, questions[nextQ].card.language);
              }, 200);
            }
          }
          setTransitioning(false);
        }, 300);
      }, 1100);
    },
    [selected, questions, currentQ, correct, mode]
  );

  const getResultFeedback = () => {
    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    return RESULT_EMOJI.find((r) => pct >= r.min);
  };

  // Mode selection screen
  if (mode === null) {
    return (
      <div className="quiz-page">
        <header className="quiz-header">
          <button className="quiz-back" onClick={() => navigate('/')}>
            ← Назад
          </button>
          <h2>Квиз</h2>
        </header>
        <div className="quiz-mode-select">
          <h3>Выберите режим тренировки</h3>
          
          <button
            className="quiz-mode-btn"
            onClick={() => startQuiz('word-to-translation')}
          >
            <span className="quiz-mode-icon">🔤</span>
            <div>
              <strong>Слово → Перевод</strong>
              <p>Угадайте русский перевод иностранного слова</p>
            </div>
          </button>

          <button
            className="quiz-mode-btn"
            onClick={() => startQuiz('translation-to-word')}
          >
            <span className="quiz-mode-icon">🔁</span>
            <div>
              <strong>Перевод → Слово</strong>
              <p>Угадайте правильное иностранное слово</p>
            </div>
          </button>

          <button
            className="quiz-mode-btn highlight"
            onClick={() => startQuiz('listening')}
          >
            <span className="quiz-mode-icon">🎧</span>
            <div>
              <strong>Аудирование (На слух)</strong>
              <p>Слушайте произношение и выбирайте значение</p>
            </div>
          </button>

          <button
            className="quiz-mode-btn warning"
            onClick={() => startQuiz('mistakes')}
          >
            <span className="quiz-mode-icon">⚠️</span>
            <div>
              <strong>Работа над ошибками ({mistakesCount})</strong>
              <p>Закрепите слова, в которых ранее ошибались</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="quiz-loading-spinner" />
        <p>Подготовка вопросов...</p>
      </div>
    );
  }

  // Finished screen
  if (finished) {
    const feedback = getResultFeedback();
    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    return (
      <div className="quiz-finished">
        <div className="quiz-finished-emoji">{feedback?.emoji || '📚'}</div>
        <h2>{feedback?.text || 'Тест завершён!'}</h2>
        <div className="quiz-finished-score">
          <div className="quiz-score-circle">
            <span className="quiz-score-pct">{pct}%</span>
          </div>
        </div>
        <p className="quiz-score-text">
          Правильно: <strong>{correct}</strong> из {questions.length}
        </p>
        <div className="quiz-xp-gain">+{earnedXP + correct * 10} XP заработано! ⚡</div>
        <div className="quiz-finished-actions">
          <button
            className="quiz-restart-btn"
            onClick={() => {
              setMode(null);
              setFinished(false);
            }}
          >
            Выбрать другой режим
          </button>
          <button className="quiz-home-btn" onClick={() => navigate('/')}>
            На главную
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];
  if (!question) return null;

  const progressPct = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <button className="quiz-back" onClick={() => setMode(null)}>
          ✕ Выход
        </button>
        <div className="quiz-score-display">
          <span className="quiz-correct-count">✅ {correct}</span>
          <span className="quiz-wrong-count">❌ {wrong}</span>
        </div>
      </header>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="quiz-question-counter">
        Вопрос {currentQ + 1} из {questions.length}
      </div>

      <div className={`quiz-question-area ${transitioning ? 'quiz-slide-out' : 'quiz-slide-in'}`}>
        <div className="quiz-prompt-card">
          <span className="quiz-prompt-lang">
            {question.card.language === 'en' ? '🇺🇸' : '🇩🇪'}
          </span>
          <span className="quiz-prompt-text">
            {mode === 'listening' ? '🎧 Слушайте слово' : question.prompt}
          </span>
          <button
            type="button"
            className="quiz-speak-btn"
            title="Озвучить"
            onClick={(e) => {
              e.stopPropagation();
              speakText(question.card.word, question.card.language);
            }}
          >
            🔊
          </button>
        </div>

        <p className="quiz-instruction">
          {mode === 'word-to-translation' || mode === 'listening' || mode === 'mistakes'
            ? 'Выберите правильный перевод:'
            : 'Выберите правильное слово:'}
        </p>

        <div className="quiz-options">
          {question.options.map((option, idx) => {
            let optionClass = 'quiz-option';
            if (showResult) {
              if (option === question.correctAnswer) {
                optionClass += ' quiz-option-correct';
              } else if (option === selected && option !== question.correctAnswer) {
                optionClass += ' quiz-option-wrong';
              } else {
                optionClass += ' quiz-option-dim';
              }
            } else if (selected === option) {
              optionClass += ' quiz-option-selected';
            }

            return (
              <button
                key={idx}
                className={optionClass}
                onClick={() => handleAnswer(option)}
                disabled={selected !== null}
              >
                <span className="quiz-option-letter">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="quiz-option-text">{option}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
