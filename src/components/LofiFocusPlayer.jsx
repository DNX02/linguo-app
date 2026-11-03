import React, { useState, useEffect, useRef } from 'react';
import './LofiFocusPlayer.css';

const SOUNDSCAPES = [
  { id: 'lofi', name: 'Chill Lofi Beats', icon: '🎧', desc: 'Мягкий бит для фокуса' },
  { id: 'rain', name: 'Уютный дождь', icon: '🌧️', desc: 'Успокаивающий шум ливня' },
  { id: 'fire', name: 'Тёплый камин', icon: '🔥', desc: 'Потрескивание дров' },
  { id: 'cafe', name: 'Ночное кафе', icon: '☕', desc: 'Атмосфера кофейни' },
];

export default function LofiFocusPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState(SOUNDSCAPES[0]);
  const [volume, setVolume] = useState(0.5);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const timerLoopRef = useRef(null);

  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, []);

  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      const gain = audioCtxRef.current.createGain();
      gain.gain.value = volume;
      gain.connect(audioCtxRef.current.destination);
      gainNodeRef.current = gain;
    }
  };

  const playAmbient = (soundId) => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    stopAmbient();
    setIsPlaying(true);

    if (soundId === 'rain') {
      // Procedural Rain Noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02; // Pink-ish filter
        lastOut = data[i];
        data[i] *= 3.5;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;

      noise.connect(filter);
      filter.connect(gainNodeRef.current);
      noise.start(0);
      timerLoopRef.current = noise;
    } else if (soundId === 'fire') {
      // Procedural Campfire
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.98 ? 1.5 : 0.05);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;

      noise.connect(filter);
      filter.connect(gainNodeRef.current);
      noise.start(0);
      timerLoopRef.current = noise;
    } else {
      // Lofi Chords Arpeggio
      const notes = [261.63, 329.63, 392.00, 523.25]; // C major 7
      let step = 0;
      const interval = setInterval(() => {
        if (!audioCtxRef.current) return;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = notes[step % notes.length];
        step++;

        noteGain.gain.setValueAtTime(0.08, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.connect(noteGain);
        noteGain.connect(gainNodeRef.current);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }, 700);

      timerLoopRef.current = { stop: () => clearInterval(interval) };
    }
  };

  const stopAmbient = () => {
    if (timerLoopRef.current) {
      if (typeof timerLoopRef.current.stop === 'function') {
        try { timerLoopRef.current.stop(); } catch (_) {}
      }
      timerLoopRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleSound = (sound) => {
    setActiveSound(sound);
    playAmbient(sound.id);
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = val;
    }
  };

  return (
    <>
      {/* Floating mini pill button */}
      <button
        className={`lofi-float-pill ${isPlaying ? 'playing' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Фоновая музыка для учёбы"
      >
        <span className="lofi-icon">{activeSound.icon}</span>
        {isPlaying && (
          <span className="lofi-mini-bars">
            <span className="mini-bar"></span>
            <span className="mini-bar"></span>
            <span className="mini-bar"></span>
          </span>
        )}
        <span className="lofi-label">{isPlaying ? 'Фокус вкл' : 'Lofi'}</span>
      </button>

      {/* Expanded Modal / Drawer */}
      {isOpen && (
        <div className="lofi-backdrop" onClick={() => setIsOpen(false)}>
          <div className="lofi-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lofi-header">
              <div className="lofi-title-wrap">
                <span className="lofi-head-icon">🎧</span>
                <div>
                  <h4>Фокус-Звуки для учёбы</h4>
                  <p>Lofi & эмбиент для глубокой концентрации</p>
                </div>
              </div>
              <button className="lofi-close" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            {/* Soundscape presets */}
            <div className="lofi-grid">
              {SOUNDSCAPES.map((s) => {
                const isActive = activeSound.id === s.id && isPlaying;
                return (
                  <div
                    key={s.id}
                    className={`lofi-card ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (isActive) {
                        stopAmbient();
                      } else {
                        toggleSound(s);
                      }
                    }}
                  >
                    <span className="lofi-card-icon">{s.icon}</span>
                    <div className="lofi-card-meta">
                      <strong>{s.name}</strong>
                      <small>{s.desc}</small>
                    </div>
                    <span className="lofi-card-status">
                      {isActive ? '⏸️' : '▶️'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Volume control */}
            <div className="lofi-volume-row">
              <span>🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolume}
                className="lofi-slider"
              />
              <span>🔊</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
