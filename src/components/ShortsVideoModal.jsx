import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './ShortsVideoModal.css';

const MOVIE_CLIPS = [
  {
    id: 'friends-1',
    show: '🎬 Друзья (Friends)',
    character: 'Joey Tribbiani',
    avatar: '🍕',
    lang: 'en',
    quote: '"Joey doesn\'t share food!"',
    ru: '«Джоуи не делится едой!»',
    context: 'Легендарная сцена на свидании, когда девушка попыталась взять картошку фри с тарелки Джоуи.',
    idiom: 'Share food — делиться едой. В США культура границ личного пространства распространяется даже на тарелку!',
    quiz: {
      question: 'Why did Joey get upset on his date?',
      options: ['She was late', 'She took food from his plate', 'She forgot her wallet'],
      correct: 1,
    },
  },
  {
    id: 'office-1',
    show: '💼 Офис (The Office)',
    character: 'Michael Scott',
    avatar: '☕',
    lang: 'en',
    quote: '"I am not superstitious, but I am a little stitious."',
    ru: '«Я не то чтобы суеверный, но слегка вероверный.»',
    context: 'Майкл Скотт играет со словом superstitious (суеверный), придумывая несуществующее слово "stitious".',
    idiom: 'Superstitious — суеверный. Префикс super- Майкл ошибочно посчитал степенью превосходства.',
    quiz: {
      question: 'What joke is Michael Scott making?',
      options: ['He loves ghost stories', 'A pun on the word superstitious', 'He hates holidays'],
      correct: 1,
    },
  },
  {
    id: 'dark-1',
    show: '⏳ Тьма (Dark)',
    character: 'Jonas Kahnwald',
    avatar: '🌧️',
    lang: 'de',
    quote: '"Was wir wissen, ist ein Tropfen. Was wir nicht wissen, ein Ozean."',
    ru: '«То, что мы знаем — это капля. То, чего мы не знаем — океан.»',
    context: 'Философская цитата о природе времени и тайнах города Винден.',
    idiom: 'Der Tropfen — капля, Der Ozean — океан. Классическая немецкая метафора познания.',
    quiz: {
      question: 'Was ist das Wissen laut dem Zitat?',
      options: ['Ein Fluss', 'Ein Tropfen', 'Ein Sturm'],
      correct: 1,
    },
  },
  {
    id: 'potter-1',
    show: '🧙‍♂️ Гарри Поттер (Harry Potter)',
    character: 'Hermione Granger',
    avatar: '✨',
    lang: 'en',
    quote: '"It\'s Leviosa, not Leviosaaaa!"',
    ru: '«Это Левио́са, а не Левиосаа́!»',
    context: 'Гермиона поправляет Рона на уроке заклинаний профессора Флитвика.',
    idiom: 'Emphasis on syllables — ударение в британском английском часто кардинально меняет смысл и звучание.',
    quiz: {
      question: 'What is Hermione teaching Ron?',
      options: ['How to fly on a broom', 'Proper pronunciation of a spell', 'Potion brewing'],
      correct: 1,
    },
  },
];

export default function ShortsVideoModal({ isOpen, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(null);
  const [quizSuccess, setQuizSuccess] = useState(false);

  if (!isOpen) return null;

  const clip = MOVIE_CLIPS[currentIdx];

  const playQuoteAudio = (text, lang) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  const handleQuiz = (idx) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(idx);
    const correct = idx === clip.quiz.correct;
    setQuizSuccess(correct);

    if (correct) {
      sounds.playCorrect();
      gamification.addXP(25);
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    setQuizAnswered(null);
    setQuizSuccess(false);
    setCurrentIdx((i) => (i + 1) % MOVIE_CLIPS.length);
  };

  const handlePrev = () => {
    setQuizAnswered(null);
    setQuizSuccess(false);
    setCurrentIdx((i) => (i - 1 + MOVIE_CLIPS.length) % MOVIE_CLIPS.length);
  };

  return (
    <div className="shorts-modal-backdrop" onClick={onClose}>
      <div className="shorts-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="shorts-modal-header">
          <div className="shorts-title-box">
            <span className="shorts-badge-icon">🎬</span>
            <div>
              <h3>Linguo Shorts: Кино & Сериалы</h3>
              <p>Живая разговорная речь и культовые киноцитаты</p>
            </div>
          </div>
          <button className="shorts-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Video Card Container */}
        <div className="shorts-video-stage">
          <div className="shorts-movie-header">
            <span className="shorts-movie-tag">{clip.show}</span>
            <span className="shorts-char-pill">{clip.avatar} {clip.character}</span>
          </div>

          {/* Big Quote Box */}
          <div className="shorts-quote-card">
            <div className="shorts-quote-row">
              <h2 className="shorts-quote-en">{clip.quote}</h2>
              <button
                className="shorts-audio-btn"
                onClick={() => playQuoteAudio(clip.quote, clip.lang)}
                title="Слушать произношение"
              >
                🔊
              </button>
            </div>
            <p className="shorts-quote-ru">{clip.ru}</p>
          </div>

          {/* Context & Idiom Insight */}
          <div className="shorts-context-box">
            <div className="context-item">
              <span className="context-icon">💡</span>
              <p>{clip.context}</p>
            </div>
            <div className="context-item highlight">
              <span className="context-icon">⚡</span>
              <p><strong>Фишка языка:</strong> {clip.idiom}</p>
            </div>
          </div>

          {/* Mini Quiz */}
          <div className="shorts-quiz-box">
            <span className="quiz-q-title">🎯 Вопрос по смыслу сцены:</span>
            <p className="quiz-q-text">{clip.quiz.question}</p>
            <div className="quiz-options-col">
              {clip.quiz.options.map((opt, idx) => {
                let cls = 'shorts-opt-btn';
                if (quizAnswered !== null) {
                  if (idx === clip.quiz.correct) cls += ' correct';
                  else if (idx === quizAnswered) cls += ' wrong';
                  else cls += ' dim';
                }
                return (
                  <button
                    key={idx}
                    className={cls}
                    onClick={() => handleQuiz(idx)}
                    disabled={quizAnswered !== null}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizAnswered !== null && (
              <div className={`quiz-feedback-banner ${quizSuccess ? 'success' : 'fail'}`}>
                {quizSuccess ? '🎉 Верно! Отличное понимание контекста (+25 XP)!' : '❌ Не совсем так, прочитайте контекст выше.'}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="shorts-footer-nav">
          <button className="shorts-nav-btn" onClick={handlePrev}>
            ← Предыдущий клип
          </button>
          <span className="shorts-counter">
            {currentIdx + 1} / {MOVIE_CLIPS.length}
          </span>
          <button className="shorts-nav-btn primary" onClick={handleNext}>
            Следующий клип →
          </button>
        </div>
      </div>
    </div>
  );
}
