import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './AudioStoriesModal.css';

const STORIES = [
  {
    id: 'story-en-1',
    lang: 'en',
    title: 'The Mystery Coffee in Brooklyn',
    subtitle: 'Кофейная тайна в Бруклине',
    level: 'A2-B1',
    avatar: '☕',
    duration: '1:10 мин',
    sentences: [
      { text: 'It was a cold and foggy Tuesday morning in Brooklyn.', ru: 'Это было холодное и туманное утро вторника в Бруклине.' },
      { text: 'David entered his favorite small coffee shop on 5th Avenue.', ru: 'Дэвид зашёл в свою любимую маленькую кофейню на 5-й авеню.' },
      { text: 'The barista handed him a cup with a secret note attached.', ru: 'Бариста протянул ему чашку с прикрепленной тайной запиской.' },
      { text: 'The note read: "Your future begins with the next door you open."', ru: 'Записка гласила: «Твоё будущее начнётся со следующей открытой двери».' },
      { text: 'David smiled, took a sip of hot caramel latte, and made a decision.', ru: 'Дэвид улыбнулся, сделал глоток горячего карамельного латте и принял решение.' },
    ],
    quiz: {
      question: 'Where did the event take place?',
      options: ['In a library in London', 'In a coffee shop in Brooklyn', 'At an airport terminal', 'In a subway train'],
      correct: 1,
    },
  },
  {
    id: 'story-de-1',
    lang: 'de',
    title: 'Das Geheimnis der alten Bibliothek',
    subtitle: 'Тайна старинной библиотеки в Вене',
    level: 'B1',
    avatar: '📚',
    duration: '1:20 мин',
    sentences: [
      { text: 'In einer engen Gasse von Wien stand eine alte Bibliothek.', ru: 'В узком переулке Вены стояла старинная библиотека.' },
      { text: 'Sophie suchte nach einem seltenen historischen Buch über Astronomie.', ru: 'Софи искала редкую историческую книгу по астрономии.' },
      { text: 'Plötzlich fiel ein goldener Schlüssel aus einem alten Lexikon.', ru: 'Внезапно из старинного словаря выпал золотой ключик.' },
      { text: 'Der Schlüssel passte genau zu einer kleinen Tür unter der Treppe.', ru: 'Ключ точно подошел к маленькой двери под лестницей.' },
      { text: 'Dahinter verbarg sich ein geheimer Raum voller alter Karten.', ru: 'За ней скрывалась тайная комната, полная старинных карт.' },
    ],
    quiz: {
      question: 'Was fiel aus dem alten Buch heraus?',
      options: ['Ein Brief', 'Ein goldener Schlüssel', 'Ein altes Foto', 'Etwas Geld'],
      correct: 1,
    },
  },
  {
    id: 'story-en-2',
    lang: 'en',
    title: 'The AI Elevator in Silicon Valley',
    subtitle: 'ИИ-лифт в Кремниевой Долине',
    level: 'B2',
    avatar: '🤖',
    duration: '1:05 мин',
    sentences: [
      { text: 'Alex stepped into the futuristic elevator at the tech headquarters.', ru: 'Алекс вошел в футуристический лифт в технологической штаб-квартире.' },
      { text: 'A friendly synthetic voice said: "Good morning, Alex. Floor 42?"', ru: 'Дружелюбный синтетический голос произнес: «Доброе утро, Алекс. 42-й этаж?»' },
      { text: 'The elevator knew his schedule before he even glanced at his watch.', ru: 'Лифт знал его расписание ещё до того, как он взглянул на часы.' },
      { text: 'Technology is no longer just a tool; it is a thoughtful companion.', ru: 'Технологии больше не просто инструмент; это внимательный спутник.' },
    ],
    quiz: {
      question: 'What did the smart elevator predict?',
      options: ['The weather', 'His destination floor', 'His coffee order', 'His flight time'],
      correct: 1,
    },
  },
];

export default function AudioStoriesModal({ isOpen, onClose }) {
  const [selectedStory, setSelectedStory] = useState(STORIES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(null);
  const [quizSuccess, setQuizSuccess] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveSentenceIdx(0);
    setQuizAnswered(null);
    setQuizSuccess(false);
  }, [selectedStory]);

  if (!isOpen) return null;

  const playSentence = (idx) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (idx >= selectedStory.sentences.length) {
      setIsPlaying(false);
      setActiveSentenceIdx(selectedStory.sentences.length);
      return;
    }

    setActiveSentenceIdx(idx);
    const sentence = selectedStory.sentences[idx];
    const utterance = new SpeechSynthesisUtterance(sentence.text);
    utterance.lang = selectedStory.lang === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 0.88;

    utterance.onend = () => {
      if (idx + 1 < selectedStory.sentences.length) {
        setTimeout(() => playSentence(idx + 1), 500);
      } else {
        setIsPlaying(false);
        sounds.playComplete();
      }
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playSentence(activeSentenceIdx >= selectedStory.sentences.length ? 0 : activeSentenceIdx);
    }
  };

  const handleQuizAnswer = (idx) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(idx);
    const isCorrect = idx === selectedStory.quiz.correct;
    setQuizSuccess(isCorrect);
    if (isCorrect) {
      sounds.playCorrect();
      gamification.addXP(30);
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="stories-modal-backdrop" onClick={onClose}>
      <div className="stories-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="stories-modal-header">
          <div className="stories-title-box">
            <span className="stories-badge-icon">📻</span>
            <div>
              <h3>Аудио-истории & Подкасты</h3>
              <p>Развитие восприятия речи на слух с караоке-субтитрами</p>
            </div>
          </div>
          <button className="stories-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Story Selector carousel */}
        <div className="stories-carousel-row">
          {STORIES.map((st) => (
            <div
              key={st.id}
              className={`story-tab-card ${selectedStory.id === st.id ? 'active' : ''}`}
              onClick={() => setSelectedStory(st)}
            >
              <span className="story-tab-avatar">{st.avatar}</span>
              <div className="story-tab-info">
                <h4>{st.title}</h4>
                <span>{st.level} • {st.duration}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Player card */}
        <div className="story-player-card">
          <div className="story-player-top">
            <div className="story-player-heading">
              <span className="story-player-lang">
                {selectedStory.lang === 'en' ? '🇺🇸 English' : '🇩🇪 Deutsch'}
              </span>
              <h2>{selectedStory.title}</h2>
              <p>{selectedStory.subtitle}</p>
            </div>
            <button
              className={`story-play-btn ${isPlaying ? 'playing' : ''}`}
              onClick={togglePlay}
            >
              {isPlaying ? '⏸️ Пауза' : '▶️ Слушать историю'}
            </button>
          </div>

          {/* Karaoke Subtitles */}
          <div className="story-karaoke-stream">
            {selectedStory.sentences.map((sent, i) => (
              <div
                key={i}
                className={`karaoke-sentence-block ${activeSentenceIdx === i ? 'current-active' : ''}`}
                onClick={() => {
                  setIsPlaying(true);
                  playSentence(i);
                }}
              >
                <div className="karaoke-text-orig">
                  <span className="karaoke-audio-indicator">🔊</span>
                  <span>{sent.text}</span>
                </div>
                <div className="karaoke-text-ru">{sent.ru}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Comprehension Quiz */}
        <div className="story-quiz-section">
          <div className="story-quiz-header">
            <span>🎯 Проверка понимания услышанного (+30 XP)</span>
          </div>
          <p className="story-quiz-q">{selectedStory.quiz.question}</p>
          <div className="story-quiz-options">
            {selectedStory.quiz.options.map((opt, idx) => {
              let cls = 'story-quiz-opt';
              if (quizAnswered !== null) {
                if (idx === selectedStory.quiz.correct) cls += ' opt-correct';
                else if (idx === quizAnswered) cls += ' opt-wrong';
                else cls += ' opt-dim';
              }
              return (
                <button
                  key={idx}
                  className={cls}
                  onClick={() => handleQuizAnswer(idx)}
                  disabled={quizAnswered !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {quizAnswered !== null && (
            <div className={`story-quiz-feedback ${quizSuccess ? 'success' : 'fail'}`}>
              {quizSuccess
                ? '🎉 Отлично! Вы точно поняли сюжет истории (+30 XP)!'
                : '❌ Не совсем так. Прослушайте историю ещё раз.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
