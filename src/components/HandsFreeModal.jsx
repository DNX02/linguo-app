import React, { useState, useEffect, useRef } from 'react';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import wordsData from '../data/words';
import './HandsFreeModal.css';

export default function HandsFreeModal({ isOpen, onClose, currentLanguage = 'en' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repeatOne, setRepeatOne] = useState(false);
  const [pauseDuration, setPauseDuration] = useState(2500); // 2.5s pause
  const [speed, setSpeed] = useState(1.0);
  const [activePhase, setActivePhase] = useState('idle'); // 'word' | 'pause' | 'translation' | 'example'

  const timeoutRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Words for the current language
  const playlist = wordsData.filter((w) => w.language === currentLanguage || w.language === 'en');
  const currentCard = playlist[currentIndex] || playlist[0];

  useEffect(() => {
    if (!isOpen) {
      stopPlayback();
    }
  }, [isOpen]);

  // Setup MediaSession for lock screen & Bluetooth headphones
  useEffect(() => {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator && currentCard) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${currentCard.word} — ${currentCard.translation}`,
        artist: 'Linguo Audio Car Player',
        album: `Изучение языка (${currentLanguage.toUpperCase()})`,
      });

      navigator.mediaSession.setActionHandler('play', () => startPlayback());
      navigator.mediaSession.setActionHandler('pause', () => stopPlayback());
      navigator.mediaSession.setActionHandler('nexttrack', () => handleNext());
      navigator.mediaSession.setActionHandler('previoustrack', () => handlePrev());
    }
  }, [currentCard, currentLanguage]);

  const stopPlayback = () => {
    setIsPlaying(false);
    setActivePhase('idle');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const startPlayback = () => {
    setIsPlaying(true);
    runWordCycle(currentIndex);
  };

  const togglePlay = () => {
    sounds.playTap?.();
    haptics.medium();
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const handleNext = () => {
    sounds.playTap?.();
    haptics.light();
    stopPlayback();
    const nextIdx = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIdx);
    setTimeout(() => {
      setIsPlaying(true);
      runWordCycle(nextIdx);
    }, 150);
  };

  const handlePrev = () => {
    sounds.playTap?.();
    haptics.light();
    stopPlayback();
    const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIdx);
    setTimeout(() => {
      setIsPlaying(true);
      runWordCycle(prevIdx);
    }, 150);
  };

  const runWordCycle = async (idx) => {
    if (!isPlayingRef.current) return;
    const card = playlist[idx] || playlist[0];
    if (!card) return;

    try {
      // 1. Speak Word in Target Lang
      setActivePhase('word');
      await speakText(card.word, currentLanguage);
      if (!isPlayingRef.current) return;

      // 2. Pause for recall
      setActivePhase('pause');
      await new Promise((r) => {
        timeoutRef.current = setTimeout(r, pauseDuration);
      });
      if (!isPlayingRef.current) return;

      // 3. Speak Translation in Russian
      setActivePhase('translation');
      await speakText(card.translation, 'ru');
      if (!isPlayingRef.current) return;

      // 4. Speak Example Sentence in Target Lang
      if (card.example) {
        setActivePhase('example');
        await new Promise((r) => {
          timeoutRef.current = setTimeout(r, 600);
        });
        if (!isPlayingRef.current) return;
        await speakText(card.example, currentLanguage);
      }
      if (!isPlayingRef.current) return;

      // 5. Inter-word pause, then move forward
      setActivePhase('pause');
      await new Promise((r) => {
        timeoutRef.current = setTimeout(r, pauseDuration * 0.7);
      });
      if (!isPlayingRef.current) return;

      if (repeatOne) {
        runWordCycle(idx);
      } else {
        const nextIdx = (idx + 1) % playlist.length;
        setCurrentIndex(nextIdx);
        runWordCycle(nextIdx);
      }
    } catch (_) {
      stopPlayback();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="handsfree-overlay" onClick={onClose}>
      <div className="handsfree-modal animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="handsfree-header">
          <div className="header-car-tag">
            <span>🚗</span>
            <div>
              <h3>Режим «За рулём»</h3>
              <p>Hands-free аудиотренажёр слов и примеров</p>
            </div>
          </div>
          <button className="handsfree-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Big Audio Stage */}
        <div className="handsfree-stage">
          <div className={`audio-pulse-ring ${isPlaying ? 'pulsing' : ''}`}>
            <span className="car-emoji-center">
              {activePhase === 'word' ? '🗣️' : activePhase === 'translation' ? '🇷🇺' : activePhase === 'example' ? '📖' : '🎧'}
            </span>
          </div>

          <div className="handsfree-word-box">
            <span className="hf-index">
              Слово {currentIndex + 1} из {playlist.length}
            </span>
            <h1 className="hf-word">{currentCard?.word}</h1>
            <h2 className="hf-translation">{currentCard?.translation}</h2>
            {currentCard?.example && (
              <p className="hf-example">«{currentCard.example}»</p>
            )}
          </div>

          <div className="hf-phase-pill">
            {activePhase === 'word' && '🔊 Произношение...'}
            {activePhase === 'pause' && '⏳ Пауза: вспомните перевод!'}
            {activePhase === 'translation' && '🇷🇺 Перевод...'}
            {activePhase === 'example' && '📖 Пример предложения...'}
            {activePhase === 'idle' && 'Нажмите Play для старта'}
          </div>
        </div>

        {/* Large Transport Controls for In-Car Use */}
        <div className="handsfree-controls">
          <button
            className={`hf-btn sub ${repeatOne ? 'active' : ''}`}
            onClick={() => setRepeatOne(!repeatOne)}
            title="Зациклить текущее слово"
          >
            🔂
          </button>

          <button className="hf-btn nav" onClick={handlePrev} title="Предыдущее слово">
            ⏮
          </button>

          <button
            className={`hf-btn play-main ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button className="hf-btn nav" onClick={handleNext} title="Следующее слово">
            ⏭
          </button>

          <button
            className="hf-btn sub"
            onClick={() => {
              const speeds = [0.8, 1.0, 1.2];
              const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
              setSpeed(next);
            }}
            title="Скорость речи"
          >
            {speed}x
          </button>
        </div>

        {/* Pause setting slider */}
        <div className="handsfree-footer-settings">
          <span>Пауза на размышление: {pauseDuration / 1000} сек</span>
          <input
            type="range"
            min="1500"
            max="4500"
            step="500"
            value={pauseDuration}
            onChange={(e) => setPauseDuration(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
