import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './PhotoScannerModal.css';

const SCENES = [
  {
    id: 'cafe',
    title: 'Кофейня в Бруклине ☕',
    lang: 'en',
    imageEmoji: '🏪',
    bgGradient: 'linear-gradient(135deg, #2b1810, #140b07)',
    objects: [
      { id: 'o1', name: 'Coffee Cup', trans: 'чашка кофе', phon: '[ˈkɔː.fi kʌp]', x: 30, y: 40 },
      { id: 'o2', name: 'Croissant', trans: 'круассан', phon: '[krwɑːˈsɑ̃ː]', x: 65, y: 48 },
      { id: 'o3', name: 'Cash Register', trans: 'кассовый аппарат', phon: '[kæʃ ˈredʒ.ɪ.stɚ]', x: 50, y: 22 },
      { id: 'o4', name: 'Barista', trans: 'бариста', phon: '[bəˈriː.stə]', x: 80, y: 28 },
    ],
  },
  {
    id: 'office',
    title: 'IT-Офис в Берлине 💻',
    lang: 'de',
    imageEmoji: '🏢',
    bgGradient: 'linear-gradient(135deg, #0f172a, #020617)',
    objects: [
      { id: 'o5', name: 'Der Laptop', trans: 'ноутбук', phon: '[ˈlɛptɔp]', x: 42, y: 45 },
      { id: 'o6', name: 'Die Tastatur', trans: 'клавиатура', phon: '[tastaˈtuːɐ̯]', x: 42, y: 68 },
      { id: 'o7', name: 'Der Bürostuhl', trans: 'офисный стул', phon: '[ˈbyːʁoːˌʃtuːl]', x: 75, y: 55 },
      { id: 'o8', name: 'Das Whiteboard', trans: 'маркерная доска', phon: '[ˈwaɪtˌbɔːd]', x: 20, y: 25 },
    ],
  },
  {
    id: 'airport',
    title: 'Аэропорт JFK Нью-Йорк ✈️',
    lang: 'en',
    imageEmoji: '🛫',
    bgGradient: 'linear-gradient(135deg, #0c2340, #040d1a)',
    objects: [
      { id: 'o9', name: 'Suitcase', trans: 'чемодан', phon: '[ˈsuːt.keɪs]', x: 28, y: 60 },
      { id: 'o10', name: 'Boarding Gate', trans: 'выход на посадку', phon: '[ˈbɔːr.dɪŋ ɡeɪt]', x: 68, y: 32 },
      { id: 'o11', name: 'Departure Board', trans: 'табло вылетов', phon: '[dɪˈpɑːr.tʃɚ bɔːrd]', x: 45, y: 18 },
      { id: 'o12', name: 'Passport', trans: 'паспорт', phon: '[ˈpæs.pɔːrt]', x: 82, y: 65 },
    ],
  },
];

export default function PhotoScannerModal({ isOpen, onClose }) {
  const [selectedScene, setSelectedScene] = useState(SCENES[0]);
  const [activeObject, setActiveObject] = useState(null);
  const [savedWords, setSavedWords] = useState({});

  if (!isOpen) return null;

  const playAudio = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedScene.lang === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectObject = (obj) => {
    setActiveObject(obj);
    playAudio(obj.name);
  };

  const handleSaveWord = (obj) => {
    setSavedWords((prev) => ({ ...prev, [obj.id]: true }));
    sounds.playCorrect();
    gamification.addXP(10);
  };

  return (
    <div className="scanner-modal-backdrop" onClick={onClose}>
      <div className="scanner-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="scanner-modal-header">
          <div className="scanner-title-box">
            <span className="scanner-badge-icon">📷</span>
            <div>
              <h3>AI Сканер предметов</h3>
              <p>Учите язык по визуальным объектам вокруг вас</p>
            </div>
          </div>
          <button className="scanner-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Scene Tabs */}
        <div className="scanner-scene-tabs">
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              className={`scanner-scene-tab ${selectedScene.id === scene.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedScene(scene);
                setActiveObject(null);
              }}
            >
              <span>{scene.title}</span>
            </button>
          ))}
        </div>

        {/* Visual Scene Stage */}
        <div
          className="scanner-stage-container"
          style={{ background: selectedScene.bgGradient }}
        >
          <div className="scanner-scene-bg-emoji">{selectedScene.imageEmoji}</div>

          {/* Interactive Object Pins */}
          {selectedScene.objects.map((obj) => (
            <div
              key={obj.id}
              className={`scanner-object-pin ${activeObject?.id === obj.id ? 'active-pin' : ''}`}
              style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
              onClick={() => handleSelectObject(obj)}
            >
              <span className="pin-pulse"></span>
              <span className="pin-dot">📍</span>
              <span className="pin-label">{obj.name}</span>
            </div>
          ))}
        </div>

        {/* Active Object Detail Card */}
        {activeObject ? (
          <div className="scanner-detail-card">
            <div className="scanner-detail-header">
              <div className="scanner-detail-title-group">
                <h3>{activeObject.name}</h3>
                <span className="scanner-phonetic">{activeObject.phon}</span>
              </div>
              <button
                className="scanner-audio-btn"
                onClick={() => playAudio(activeObject.name)}
                title="Слушать произношение"
              >
                🔊
              </button>
            </div>

            <p className="scanner-trans">Перевод: <strong>{activeObject.trans}</strong></p>

            <button
              className={`scanner-save-vocab-btn ${savedWords[activeObject.id] ? 'saved' : ''}`}
              onClick={() => handleSaveWord(activeObject)}
            >
              {savedWords[activeObject.id] ? '✓ Сохранено в ваш словарь' : '+ Добавить в мой словарь (+10 XP)'}
            </button>
          </div>
        ) : (
          <div className="scanner-placeholder-tip">
            👉 <em>Нажмите на любую светящуюся метку на сцене, чтобы услышать и разобрать слово!</em>
          </div>
        )}
      </div>
    </div>
  );
}
