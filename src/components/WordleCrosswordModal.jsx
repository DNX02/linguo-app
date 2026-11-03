import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './WordleCrosswordModal.css';

const WORDLE_TARGETS = [
  { word: 'SMART', hint: 'Умный, сообразительный, элегантный' },
  { word: 'BRAIN', hint: 'Мозг, интеллект' },
  { word: 'DREAM', hint: 'Мечта или сновидение' },
  { word: 'LEARN', hint: 'Учиться, узнавать новое' },
];

const MINI_CROSSWORD = {
  grid: [
    ['C', 'A', 'T', '', 'D'],
    ['O', '', 'E', '', 'O'],
    ['P', 'E', 'A', 'C', 'E'],
    ['Y', '', 'M', '', 'P'],
    ['', '', '', '', ''],
  ],
  across: [
    { num: 1, clue: 'Кошка (3 буквы)', word: 'CAT' },
    { num: 3, clue: 'Мир, спокойствие (5 букв)', word: 'PEACE' },
  ],
  down: [
    { num: 1, clue: 'Копировать (4 буквы)', word: 'COPY' },
    { num: 2, clue: 'Команда (4 буквы)', word: 'TEAM' },
  ],
};

export default function WordleCrosswordModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('wordle'); // 'wordle' | 'crossword'

  // Wordle State
  const [targetObj, setTargetObj] = useState(WORDLE_TARGETS[0]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [showHint, setShowHint] = useState(false);

  // Crossword State
  const [crossInput, setCrossInput] = useState({});
  const [crossSolved, setCrossSolved] = useState(false);

  if (!isOpen) return null;

  const targetWord = targetObj.word;

  const handleKeyPress = (letter) => {
    if (gameStatus !== 'playing') return;
    if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + letter);
    }
  };

  const handleDelete = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleEnter = () => {
    if (currentGuess.length !== 5 || gameStatus !== 'playing') return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    if (currentGuess === targetWord) {
      setGameStatus('won');
      sounds.playComplete();
      gamification.addXP(40);
      gamification.addGems(10);
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      sounds.playWrong();
    } else {
      sounds.playCorrect();
    }

    setCurrentGuess('');
  };

  const getTileStatus = (guess, letterIdx) => {
    const letter = guess[letterIdx];
    if (targetWord[letterIdx] === letter) return 'correct';
    if (targetWord.includes(letter)) return 'present';
    return 'absent';
  };

  const handleCrosswordChange = (r, c, val) => {
    const char = val.toUpperCase().slice(-1);
    const key = `${r}-${c}`;
    const updated = { ...crossInput, [key]: char };
    setCrossInput(updated);

    // Check solution for CAT (0,0..0,2) and COPY (0,0..3,0)
    if (
      updated['0-0'] === 'C' &&
      updated['0-1'] === 'A' &&
      updated['0-2'] === 'T' &&
      updated['1-0'] === 'O' &&
      updated['2-0'] === 'P' &&
      updated['3-0'] === 'Y'
    ) {
      if (!crossSolved) {
        setCrossSolved(true);
        sounds.playComplete();
        gamification.addXP(35);
      }
    }
  };

  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL'],
  ];

  return (
    <div className="puzzle-modal-backdrop" onClick={onClose}>
      <div className="puzzle-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="puzzle-modal-header">
          <div className="puzzle-title-box">
            <span className="puzzle-badge-icon">🧩</span>
            <div>
              <h3>Linguo Wordle & Кроссворд</h3>
              <p>Ежедневная интеллектуальная разминка для ума</p>
            </div>
          </div>
          <button className="puzzle-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Tab switcher */}
        <div className="puzzle-mode-tabs">
          <button
            className={`puzzle-mode-tab ${activeTab === 'wordle' ? 'active' : ''}`}
            onClick={() => setActiveTab('wordle')}
          >
            🟩 Linguo Wordle
          </button>
          <button
            className={`puzzle-mode-tab ${activeTab === 'crossword' ? 'active' : ''}`}
            onClick={() => setActiveTab('crossword')}
          >
            📝 Мини-Кроссворд
          </button>
        </div>

        {/* TAB 1: WORDLE */}
        {activeTab === 'wordle' && (
          <div className="wordle-stage">
            <div className="wordle-hint-bar">
              <button
                className="wordle-hint-btn"
                onClick={() => setShowHint(!showHint)}
              >
                💡 {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
              </button>
              {showHint && <span className="wordle-hint-text">{targetObj.hint}</span>}
            </div>

            {/* 6x5 Grid */}
            <div className="wordle-grid">
              {Array.from({ length: 6 }).map((_, rowIdx) => {
                const guess = guesses[rowIdx] || (rowIdx === guesses.length ? currentGuess : '');
                return (
                  <div key={rowIdx} className="wordle-row">
                    {Array.from({ length: 5 }).map((_, colIdx) => {
                      const letter = guess[colIdx] || '';
                      let status = '';
                      if (rowIdx < guesses.length) {
                        status = getTileStatus(guesses[rowIdx], colIdx);
                      }
                      return (
                        <div key={colIdx} className={`wordle-tile ${status} ${letter ? 'filled' : ''}`}>
                          {letter}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Result message */}
            {gameStatus !== 'playing' && (
              <div className={`wordle-result-banner ${gameStatus}`}>
                {gameStatus === 'won'
                  ? '🎉 ПОБЕДА! Вы разгадали слово (+40 XP & +10 💎)!'
                  : `❌ Загаданное слово было: ${targetWord}`}
              </div>
            )}

            {/* On-screen Keyboard */}
            <div className="wordle-keyboard">
              {KEYBOARD_ROWS.map((row, rIdx) => (
                <div key={rIdx} className="keyboard-row">
                  {row.map((key) => {
                    if (key === 'ENTER') {
                      return (
                        <button
                          key={key}
                          className="key-btn key-wide"
                          onClick={handleEnter}
                        >
                          ВВОД
                        </button>
                      );
                    }
                    if (key === 'DEL') {
                      return (
                        <button
                          key={key}
                          className="key-btn key-wide"
                          onClick={handleDelete}
                        >
                          ⌫
                        </button>
                      );
                    }
                    return (
                      <button
                        key={key}
                        className="key-btn"
                        onClick={() => handleKeyPress(key)}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MINI CROSSWORD */}
        {activeTab === 'crossword' && (
          <div className="crossword-stage">
            <div className="crossword-grid-wrap">
              <div className="crossword-grid-board">
                {/* Row 0: CAT */}
                <div className="cross-row">
                  <input
                    className="cross-cell"
                    maxLength={1}
                    value={crossInput['0-0'] || ''}
                    onChange={(e) => handleCrosswordChange(0, 0, e.target.value)}
                  />
                  <input
                    className="cross-cell"
                    maxLength={1}
                    value={crossInput['0-1'] || ''}
                    onChange={(e) => handleCrosswordChange(0, 1, e.target.value)}
                  />
                  <input
                    className="cross-cell"
                    maxLength={1}
                    value={crossInput['0-2'] || ''}
                    onChange={(e) => handleCrosswordChange(0, 2, e.target.value)}
                  />
                </div>
                {/* Row 1: O */}
                <div className="cross-row">
                  <input
                    className="cross-cell"
                    maxLength={1}
                    value={crossInput['1-0'] || ''}
                    onChange={(e) => handleCrosswordChange(1, 0, e.target.value)}
                  />
                  <div className="cross-cell black"></div>
                  <div className="cross-cell black"></div>
                </div>
                {/* Row 2: P */}
                <div className="cross-row">
                  <input
                    className="cross-cell"
                    maxLength={1}
                    value={crossInput['2-0'] || ''}
                    onChange={(e) => handleCrosswordChange(2, 0, e.target.value)}
                  />
                  <div className="cross-cell black"></div>
                  <div className="cross-cell black"></div>
                </div>
                {/* Row 3: Y */}
                <div className="cross-row">
                  <input
                    className="cross-cell"
                    maxLength={1}
                    value={crossInput['3-0'] || ''}
                    onChange={(e) => handleCrosswordChange(3, 0, e.target.value)}
                  />
                  <div className="cross-cell black"></div>
                  <div className="cross-cell black"></div>
                </div>
              </div>
            </div>

            {/* Clues */}
            <div className="crossword-clues-box">
              <h4>По горизонтали:</h4>
              <p>1. Домашний пушистый питомец (3 буквы) — C _ _</p>
              <h4>По вертикали:</h4>
              <p>1. Сделать копию документа (4 буквы) — C _ _ _</p>
            </div>

            {crossSolved && (
              <div className="crossword-success-banner">
                🏆 Кроссворд успешно решен (+35 XP)!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
