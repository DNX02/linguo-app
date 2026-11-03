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
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c0/3f/36/c03f367a-b66b-fd0a-a54c-30f8250c4410/mzaf_12768434238801682952.plus.aac.p.m4a',
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
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/30/8e/a3308eed-d8b7-e0b3-f09d-5e1b0f4d660a/mzaf_8517946447501075134.plus.aac.p.m4a',
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
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/58/89/be/5889beee-3248-8e1f-bb77-98fb0dd7998b/mzaf_18321568262675482928.plus.aac.p.m4a',
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
  {
    id: 'song-4',
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    lang: 'en',
    genre: '💖 Synth-Pop',
    coverEmoji: '🌸',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/af/81/44af8168-9609-1b85-5048-ada08dceacf3/mzaf_1341699644335558812.plus.aac.p.m4a',
    lines: [
      { text: 'Fever dream high in the quiet of the night, you know that I caught it.', ru: 'Лихорадочный сон посреди ночной тишины, ты знаешь, меня накрыло.' },
      { text: 'Bad, bad boy, shiny toy with a price, you know that I bought it.', ru: 'Плохой парень, блестящая игрушка с ценой, ты знаешь, я купилась.' },
      { text: 'It\'s new, the shape of your body, it\'s blue, the feeling I\'ve ___!', ru: 'Это ново — очертания твоего тела; это грусть — чувство, которое у меня появилось!' },
    ],
    challenge: {
      missingWord: 'got',
      options: ['lost', 'got', 'seen'],
      correct: 1,
      idiom: 'Feeling blue — идиома, означающая грустить, испытывать печаль.',
    },
  },
];

export default function MusicLyricsModal({ isOpen, onClose }) {
  const [selectedSong, setSelectedSong] = useState(SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answeredIdx, setAnsweredIdx] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const audioRef = useRef(null);

  useEffect(() => {
    // Setup real audio player
    const audio = new Audio();
    audioRef.current = audio;

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.onerror = () => {
      setIsPlaying(false);
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = selectedSong.audioUrl;
      audioRef.current.load();
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setAnsweredIdx(null);
    setIsAnswerCorrect(false);
  }, [selectedSong]);

  if (!isOpen) {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
    return null;
  }

  const togglePlayAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play error:', err);
        setIsPlaying(false);
      });
    }
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

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="music-modal-backdrop" onClick={onClose}>
      <div className="music-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="music-modal-header">
          <div className="music-title-box">
            <span className="music-badge-icon">🎵</span>
            <div>
              <h3>Lyrical: Английский по песням</h3>
              <p>Оригинальные студийные треки с караоке & разбором сленга</p>
            </div>
          </div>
          <button className="music-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Song Carousel with Guaranteed Non-Clipping Height */}
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

        {/* Player Panel with Real Original Audio Master */}
        <div className="music-player-panel">
          <div className="music-track-meta">
            <div className="music-badge-row">
              <span className="music-genre-badge">{selectedSong.genre}</span>
              <span className="music-original-badge">🎙️ Студийный оригинал</span>
            </div>
            <h2>{selectedSong.title}</h2>
            <p className="music-artist-name">{selectedSong.artist}</p>
          </div>

          <button
            className={`music-play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlayAudio}
          >
            {isPlaying ? '⏸️ Пауза' : '▶️ Слушать трек'}
          </button>
        </div>

        {/* Real Audio Progress Bar */}
        <div className="music-progress-wrap">
          <div className="music-progress-bar">
            <div
              className="music-progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="music-time-meta">
            <span>0:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
            <span>0:{Math.floor(duration).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Equalizer Wave when playing */}
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
            <span>🎯 Вставьте недостающее слово из песни:</span>
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
