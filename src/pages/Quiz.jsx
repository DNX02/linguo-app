import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCards, getDailyProgress, saveDailyProgress } from '../db';
import { speakText } from '../utils/speech';
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

    const prompt = mode === 'word-to-translation' ? correctCard.word : correctCard.translation;
    const correctAnswer = mode === 'word-to-translation' ? correctCard.translation : correctCard.word;

    const options = shuffle([
      correctAnswer,
      ...wrongCards.map((c) =>
        mode === 'word-to-translation' ? c.translation : c.word
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
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const startQuiz = useCallback(async (selectedMode) => {
    setLoading(true);
    setMode(selectedMode);
    const cards = await getAllCards();
    const qs = generateQuestions(cards, selectedMode);
    if (qs.length === 0) {
      setFinished(true);
    }
    setQuestions(qs);
    setCurrentQ(0);
    setCorrect(0);
    setWrong(0);
    setSelected(null);
    setShowResult(false);
    setLoading(false);
  }, []);

  const handleAnswer = useCallback(
    async (answer) => {
      if (selected !== null) return;
      setSelected(answer);
      const isCorrect = answer === questions[currentQ].correctAnswer;

      if (isCorrect) {
        setCorrect((c) => c + 1);
      } else {
        setWrong((w) => w + 1);
      }

      setShowResult(true);

      setTimeout(async () => {
        setTransitioning(true);

        // Update daily progress
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

        setTimeout(() => {
          if (currentQ + 1 >= questions.length) {
            setFinished(true);
          } else {
            setCurrentQ((q) => q + 1);
            setSelected(null);
            setShowResult(false);
          }
          setTransitioning(false);
        }, 300);
      }, 1200);
    },
    [selected, questions, currentQ]
  );

  const getResultFeedback = () => {
    const pct = Math.round((correct / questions.length) * 100);
    return RESULT_EMOJI.find((r) => pct >= r.min);
  };

  // Mode selection
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
          <h3>Выберите режим</h3>
          <button
            className="quiz-mode-btn"
            onClick={() => startQuiz('word-to-translation')}
          >
            <span className="quiz-mode-icon">🔤</span>
            <div>
              <strong>Слово → Перевод</strong>
              <p>Угадайте перевод иностранного слова</p>
            </div>
          </button>
          <button
            className="quiz-mode-btn"
            onClick={() => startQuiz('translation-to-word')}
          >
            <span className="quiz-mode-icon">🔁</span>
            <div>
              <strong>Перевод → Слово</strong>
              <p>Угадайте иностранное слово по переводу</p>
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

  // Finished
  if (finished) {
    const feedback = getResultFeedback();
    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    return (
      <div className="quiz-finished">
        <div className="quiz-finished-emoji">{feedback?.emoji || '📚'}</div>
        <h2>{feedback?.text || 'Конец!'}</h2>
        <div className="quiz-finished-score">
          <div className="quiz-score-circle">
            <span className="quiz-score-pct">{pct}%</span>
          </div>
        </div>
        <div className="quiz-finished-stats">
          <div className="quiz-fstat">
            <span className="quiz-fstat-val quiz-fstat-correct">{correct}</span>
            <span className="quiz-fstat-label">Верно ✅</span>
          </div>
          <div className="quiz-fstat">
            <span className="quiz-fstat-val quiz-fstat-wrong">{wrong}</span>
            <span className="quiz-fstat-label">Ошибки ❌</span>
          </div>
        </div>
        <div className="quiz-finished-actions">
          <button className="quiz-restart-btn" onClick={() => { setMode(null); setFinished(false); }}>
            Ещё раз
          </button>
          <button className="quiz-home-btn" onClick={() => navigate('/')}>
            На главную
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];
  const progressPct = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <button className="quiz-back" onClick={() => navigate('/')}>
          ← Назад
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
            {question.card.language === 'en' ? '🇬🇧' : '🇩🇪'}
          </span>
          <span className="quiz-prompt-text">{question.prompt}</span>
          <button
            type="button"
            className="quiz-speak-btn"
            title="Озвучить"
            onClick={(e) => {
              e.stopPropagation();
              const textToSpeak = mode === 'word-to-translation' ? question.prompt : question.correctAnswer;
              speakText(textToSpeak, question.card.language);
            }}
          >
            🔊
          </button>
        </div>

        <p className="quiz-instruction">
          {mode === 'word-to-translation'
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
