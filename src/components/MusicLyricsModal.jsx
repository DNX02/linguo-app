import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './MusicLyricsModal.css';

const SONGS = [
  {
    id: 'song-1',
    title: 'Believer',
    artist: 'Imagine Dragons',
    lang: 'en',
    genre: '🔥 Alt Rock',
    coverEmoji: '⚡',
    lines: [
      { text: 'First things first, I\'ma say all the words inside my head.', ru: 'Прежде всего, я скажу все слова, что крутятся в голове.' },
      { text: 'I\'m fired up and tired of the way that things have been.', ru: 'Я на взводе и устал от того, как всё шло.' },
      { text: 'Pain! You made me a, you made me a ___!', ru: 'Боль! Ты сделала меня, ты сделала меня верующим!' },
    ],
    challenge: {
      missingWord: 'believer',
      options: ['believer', 'dreamer', 'fighter'],
      correct: 0,
      idiom: 'Fired up — быть крайне воодушевленным, готовым к действию или разгневанным.',
    },
  },
  {
    id: 'song-2',
    title: 'Viva La Vida',
    artist: 'Coldplay',
    lang: 'en',
    genre: '🎻 Baroque Pop',
    coverEmoji: '👑',
    lines: [
      { text: 'I used to rule the world, seas would rise when I gave the word.', ru: 'Когда-то я правил миром, моря вздымались по моему слову.' },
      { text: 'Now in the morning I sleep alone, sweep the streets I used to own.', ru: 'Теперь по утрам я просыпаюсь один, подметаю улицы, которыми владел.' },
      { text: 'I hear Jerusalem bells are ringing, Roman cavalry choirs are ___!', ru: 'Я слышу, как звонят иерусалимские колокола и поют римские всадники!' },
    ],
    challenge: {
      missingWord: 'singing',
      options: ['crying', 'singing', 'shouting'],
      correct: 1,
      idiom: 'I used to rule — конструкция "used to" выражает регулярное действие в прошлом, которого больше нет.',
    },
  },
  {
    id: 'song-3',
    title: 'Sonne',
    artist: 'Rammstein',
    lang: 'de',
    genre: '🤘 Neue Deutsche Härte',
    coverEmoji: '☀️',
    lines: [
      { text: 'Eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, aus!', ru: 'Один, два, три, четыре, пять, шесть, семь, восемь, девять, конец!' },
      { text: 'Alle warten auf das Licht, fürchtet euch, fürchtet euch nicht.', ru: 'Все ждут света, бойтесь, не бойтесь.' },
      { text: 'Die Sonne scheint mir aus den ___!', ru: 'Солнце светит из моих рук!' },
    ],
    challenge: {
      missingWord: 'Händen',
      options: ['Augen', 'Händen', 'Sternen'],
      correct: 1,
      idiom: 'Warten auf (+ Akkusativ) — глагол "warten" в немецком требует предлога "auf" (ждать чего-то).',
    },
  },
];

export default function MusicLyricsModal({ isOpen, onClose }) {
  const [selectedSong, setSelectedSong] = useState(SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answeredIdx, setAnsweredIdx] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlaying(false);
    setAnsweredIdx(null);
    setIsAnswerCorrect(false);
  }, [selectedSong]);

  if (!isOpen) return null;

  const playSongAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const fullLyrics = selectedSong.lines.map((l) => l.text.replace('___', selectedSong.challenge.missingWord)).join('. ');
    const utterance = new SpeechSynthesisUtterance(fullLyrics);
    utterance.lang = selectedSong.lang === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectWord = (idx) => {
    if (answeredIdx !== null) return;
    setAnsweredIdx(idx);
    const correct = idx === selectedSong.challenge.correct;
    setIsAnswerCorrect(correct);

    if (correct) {
      sounds.playCorrect();
      gamification.addXP(25);
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="music-modal-backdrop" onClick={onClose}>
      <div className="music-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="music-modal-header">
          <div className="music-title-box">
            <span className="music-badge-icon">🎵</span>
            <div>
              <h3>Lyrical: Английский по песням</h3>
              <p>Учите язык через ритм, текст и живые метафоры</p>
            </div>
          </div>
          <button className="music-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Song Carousel */}
        <div className="music-songs-carousel">
          {SONGS.map((song) => (
            <div
              key={song.id}
              className={`music-song-pill ${selectedSong.id === song.id ? 'active' : ''}`}
              onClick={() => setSelectedSong(song)}
            >
              <span className="song-emoji">{song.coverEmoji}</span>
              <div className="song-pill-info">
                <strong>{song.title}</strong>
                <span>{song.artist}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Player Header */}
        <div className="music-player-panel">
          <div className="music-track-meta">
            <span className="music-genre-badge">{selectedSong.genre}</span>
            <h2>{selectedSong.title}</h2>
            <p className="music-artist-name">{selectedSong.artist}</p>
          </div>

          <button
            className={`music-play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={playSongAudio}
          >
            {isPlaying ? '⏸️ Остановить' : '▶️ Слушать трек'}
          </button>
        </div>

        {/* Equalizer Wave */}
        {isPlaying && (
          <div className="music-eq-wave">
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
          </div>
        )}

        {/* Interactive Lyrics Block */}
        <div className="music-lyrics-container">
          {selectedSong.lines.map((line, i) => (
            <div key={i} className="music-lyric-row">
              <p className="lyric-orig">{line.text}</p>
              <p className="lyric-trans">{line.ru}</p>
            </div>
          ))}
        </div>

        {/* Missing Word Interactive Challenge */}
        <div className="music-challenge-card">
          <div className="challenge-head">
            <span>🎯 Вставьте недостающее слово из трека:</span>
          </div>

          <div className="challenge-options-grid">
            {selectedSong.challenge.options.map((opt, idx) => {
              let cls = 'challenge-opt-btn';
              if (answeredIdx !== null) {
                if (idx === selectedSong.challenge.correct) cls += ' opt-correct';
                else if (idx === answeredIdx) cls += ' opt-wrong';
                else cls += ' opt-dim';
              }
              return (
                <button
                  key={idx}
                  className={cls}
                  onClick={() => handleSelectWord(idx)}
                  disabled={answeredIdx !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {answeredIdx !== null && (
            <div className={`challenge-feedback ${isAnswerCorrect ? 'success' : 'fail'}`}>
              {isAnswerCorrect
                ? '🔥 Блестяще! Вы услышали точное слово (+25 XP)!'
                : '❌ Почти! Попробуйте переслушать куплет ещё раз.'}
            </div>
          )}

          {/* Idiom insight */}
          <div className="music-idiom-box">
            <span className="idiom-icon">💡</span>
            <p>{selectedSong.challenge.idiom}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
