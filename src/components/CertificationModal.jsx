import React, { useState, useEffect } from 'react';
import { gamification } from '../utils/gamification';
import { speakText } from '../utils/speech';
import { sounds } from '../utils/sounds';
import { haptics } from '../utils/haptics';
import './CertificationModal.css';

const EXAM_QUESTIONS = [
  {
    id: 1,
    domain: 'Лексика',
    icon: '🔤',
    level: 'A2',
    question: 'Choose the natural collocation: "We need to ... a decision before 5 PM."',
    options: ['do', 'make', 'create', 'build'],
    correct: 1,
    hint: 'In English, we always "make a decision", never "do a decision".'
  },
  {
    id: 2,
    domain: 'Аудирование',
    icon: '🎧',
    level: 'B1',
    hasAudio: true,
    audioText: 'Could you please let me know if the flight is on schedule?',
    question: 'Прослушайте аудио и выберите, что именно спросил говорящий:',
    options: [
      'Будет ли завтрак на борту самолёта',
      'Летит ли рейс по расписанию без задержек',
      'Сколько стоит билет на самолёт',
      'Где находится зона посадки'
    ],
    correct: 1,
    hint: '"On schedule" означает "по расписанию".'
  },
  {
    id: 3,
    domain: 'Грамматика',
    icon: '📐',
    level: 'B1',
    question: 'Вставьте верную форму: "If I ... more free time, I would travel around California."',
    options: ['have', 'had', 'would have', 'will have'],
    correct: 1,
    hint: 'Second Conditional для воображаемой ситуации: If + Past Simple, would + V1.'
  },
  {
    id: 4,
    domain: 'Американский сленг',
    icon: '🗽',
    level: 'B2',
    question: 'Что имеет в виду коллега из США: "Let’s touch base tomorrow morning"?',
    options: [
      'Сыграть в бейсбол',
      'Кратко созвониться / связаться для сверки планов',
      'Поехать на военную базу',
      'Починить компьютер'
    ],
    correct: 1,
    hint: '"Touch base" — популярнейший корпоративный и разговорный идиом в США.'
  },
  {
    id: 5,
    domain: 'Аудирование',
    icon: '🎧',
    level: 'B2',
    hasAudio: true,
    audioText: 'I am totally swamped with work right now, can we raincheck?',
    question: 'Что просит собеседник?',
    options: [
      'Посмотреть прогноз погоды',
      'Перенести встречу на другой раз из-за завала на работе',
      'Поделиться зонтиком',
      'Помочь убрать офис'
    ],
    correct: 1,
    hint: '"Take a raincheck" — вежливо отложить/перенести договоренность.'
  },
  {
    id: 6,
    domain: 'Грамматика',
    icon: '📐',
    level: 'B2',
    question: 'Выберите грамматически безупречный вариант:',
    options: [
      'She has been living in Chicago since three years.',
      'She has been living in Chicago for three years.',
      'She lives in Chicago since three years ago.',
      'She is living in Chicago for three years.'
    ],
    correct: 1,
    hint: 'Для указания периода времени используется предлог "for" (for 3 years), а не "since".'
  },
  {
    id: 7,
    domain: 'Лексика C1',
    icon: '💎',
    level: 'C1',
    question: 'The word "ubiquitous" most closely means:',
    options: ['Harmful', 'Found everywhere', 'Ancient', 'Extremely rare'],
    correct: 1,
    hint: 'Ubiquitous = вездесущий, повсеместный (например: Smartphones are ubiquitous).'
  },
  {
    id: 8,
    domain: 'Деловое общение',
    icon: '💼',
    level: 'C1',
    question: 'Which phrase is the most polished executive way to disagree politely in a meeting?',
    options: [
      'You are completely wrong about this.',
      'I see your point, however, looking at the data, I’d suggest a different approach.',
      'I don’t like your opinion at all.',
      'Whatever you say, but no.'
    ],
    correct: 1,
    hint: 'Дипломатичный деловой английский строится через валидацию и мягкое противопоставление.'
  }
];

export default function CertificationModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro' | 'exam' | 'result'
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [certificate, setCertificate] = useState(() => gamification.getCertificate());
  const [recipientName, setRecipientName] = useState(() => localStorage.getItem('linguo_user_name') || 'Александр Полиглот');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    if (certificate && !certificate.name) {
      setCertificate((prev) => ({ ...prev, name: recipientName }));
    }
  }, [certificate, recipientName]);

  if (!isOpen) return null;

  const startExam = () => {
    setCurrentStep('exam');
    setQIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    sounds.playTap?.();
    haptics.medium();
  };

  const handlePlayAudio = (text) => {
    sounds.playTap?.();
    speakText(text, 'en-US');
  };

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    sounds.playTap?.();
    haptics.light();
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedOption === EXAM_QUESTIONS[qIndex].correct;
    const newAnswers = [...answers, { qId: EXAM_QUESTIONS[qIndex].id, isCorrect, domain: EXAM_QUESTIONS[qIndex].domain }];
    setAnswers(newAnswers);

    if (qIndex + 1 < EXAM_QUESTIONS.length) {
      setQIndex(qIndex + 1);
      setSelectedOption(null);
      sounds.playTap?.();
      haptics.light();
    } else {
      // Calculate Final CEFR Score
      finishExam(newAnswers);
    }
  };

  const finishExam = (finalAnswers) => {
    const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correctCount / EXAM_QUESTIONS.length) * 100);

    let level = 'A1';
    let levelTitle = 'Начальный уровень (A1)';
    if (percentage >= 85) {
      level = 'C1';
      levelTitle = 'Продвинутый свободный (C1 Advanced)';
    } else if (percentage >= 70) {
      level = 'B2';
      levelTitle = 'Уверенный рабочий (B2 Upper-Intermediate)';
    } else if (percentage >= 50) {
      level = 'B1';
      levelTitle = 'Самостоятельное владение (B1 Intermediate)';
    } else if (percentage >= 30) {
      level = 'A2';
      levelTitle = 'Базовый разговорный (A2 Elementary)';
    }

    const certData = {
      id: `LINGUO-${new Date().getFullYear()}-US-${Math.floor(1000 + Math.random() * 9000)}`,
      name: recipientName,
      level,
      levelTitle,
      score: percentage,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      skills: {
        vocabulary: Math.min(100, percentage + Math.floor(Math.random() * 8) - 4),
        listening: Math.min(100, percentage + Math.floor(Math.random() * 10) - 3),
        grammar: Math.min(100, percentage + Math.floor(Math.random() * 6) - 2),
        speaking: Math.min(100, percentage + Math.floor(Math.random() * 8) - 2),
      }
    };

    gamification.saveCertificate(certData);
    gamification.addXP(100);
    gamification.addGems(50);
    setCertificate(certData);
    setCurrentStep('result');
    sounds.playComplete?.();
    haptics.celebrate();
  };

  const handleSaveName = (newName) => {
    const clean = newName.trim() || 'Полиглот';
    setRecipientName(clean);
    localStorage.setItem('linguo_user_name', clean);
    if (certificate) {
      const updated = { ...certificate, name: clean };
      setCertificate(updated);
      gamification.saveCertificate(updated);
    }
    setIsEditingName(false);
  };

  const handleShareCert = () => {
    sounds.playTap?.();
    haptics.success();
    const text = `🎓 Мой официальный уровень американского английского: ${certificate?.level} (${certificate?.levelTitle}) в Linguo! Номер сертификата: ${certificate?.id}`;
    if (navigator.share) {
      navigator.share({ title: 'Сертификат Linguo CEFR', text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      alert('Текст сертификата и ссылка скопированы в буфер обмена!');
    }
  };

  const currentQ = EXAM_QUESTIONS[qIndex];

  return (
    <div className="cert-modal-overlay" onClick={onClose}>
      <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cert-modal-header">
          <div className="cert-header-title">
            <span className="cert-header-icon">🏛️</span>
            <div>
              <h3>Linguo Fluency Lab & CEFR</h3>
              <p>Официальное тестирование и сертификат США</p>
            </div>
          </div>
          <button className="cert-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Content Body */}
        <div className="cert-modal-body">
          {currentStep === 'intro' && (
            <div className="cert-intro-view animate-pop">
              <div className="cert-emblem-badge">
                <span className="cert-big-medal">🏅</span>
                <span className="cert-us-seal">🇺🇸 CEFR Certified</span>
              </div>
              <h2>Экзамен по стандартам CEFR</h2>
              <p className="cert-intro-p">
                Пройдите всестороннее тестирование навыков американского английского: лексика, аудирование, грамматика и идиомы. 
                По итогам экзамена вы получите <strong>именной золотой сертификат с уникальным ID</strong>.
              </p>

              {certificate && (
                <div className="cert-existing-card">
                  <div className="cec-header">
                    <span>Ваш текущий сертификат:</span>
                    <strong className="cec-level">{certificate.level}</strong>
                  </div>
                  <div className="cec-details">
                    <span>{certificate.levelTitle}</span>
                    <small>Выдан: {certificate.date}</small>
                  </div>
                  <button className="cec-view-btn" onClick={() => setCurrentStep('result')}>
                    Посмотреть сертификат ➔
                  </button>
                </div>
              )}

              <div className="cert-features-grid">
                <div className="cf-item">
                  <span className="cf-icon">⏱️</span>
                  <div>
                    <strong>8 адаптивных вопросов</strong>
                    <small>Займёт около 3 минут</small>
                  </div>
                </div>
                <div className="cf-item">
                  <span className="cf-icon">🎧</span>
                  <div>
                    <strong>Живое аудирование</strong>
                    <small>Американское произношение</small>
                  </div>
                </div>
                <div className="cf-item">
                  <span className="cf-icon">⚡</span>
                  <div>
                    <strong>+100 XP и +50 💎</strong>
                    <small>Награда за прохождение</small>
                  </div>
                </div>
              </div>

              <button className="cert-start-btn" onClick={startExam}>
                {certificate ? 'Сдать повторно для повышения уровня' : 'Начать экзамен CEFR ➔'}
              </button>
            </div>
          )}

          {currentStep === 'exam' && currentQ && (
            <div className="cert-exam-view animate-in">
              <div className="cert-exam-progress-bar">
                <div
                  className="cert-exam-progress-fill"
                  style={{ width: `${((qIndex + 1) / EXAM_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="cert-exam-meta-row">
                <span className="cert-domain-chip">
                  {currentQ.icon} {currentQ.domain}
                </span>
                <span className="cert-step-counter">
                  Вопрос {qIndex + 1} из {EXAM_QUESTIONS.length}
                </span>
              </div>

              <h3 className="cert-question-text">{currentQ.question}</h3>

              {currentQ.hasAudio && (
                <button
                  className="cert-listen-btn animate-pop"
                  onClick={() => handlePlayAudio(currentQ.audioText)}
                >
                  <span className="clb-icon">🔊</span>
                  <span>Нажмите, чтобы прослушать аудио (en-US)</span>
                </button>
              )}

              <div className="cert-options-stack">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  return (
                    <button
                      key={oIdx}
                      className={`cert-option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(oIdx)}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + oIdx)}</span>
                      <span className="opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <button
                className="cert-submit-answer-btn"
                disabled={selectedOption === null}
                onClick={handleNextQuestion}
              >
                {qIndex + 1 >= EXAM_QUESTIONS.length ? 'Завершить экзамен 🏆' : 'Ответить и далее ➔'}
              </button>
            </div>
          )}

          {currentStep === 'result' && certificate && (
            <div className="cert-result-view animate-pop">
              {/* THE LUXURY GOLD CERTIFICATE */}
              <div className="luxury-cert-frame">
                <div className="cert-inner-border">
                  <div className="cert-top-branding">
                    <span className="cert-brand-logo">🦉 Linguo Fluency Lab</span>
                    <span className="cert-official-seal">OFFICIAL CEFR ACCREDITED</span>
                  </div>

                  <h1 className="cert-main-title">CERTIFICATE OF PROFICIENCY</h1>
                  <p className="cert-presented-to">This certifies that</p>

                  {isEditingName ? (
                    <div className="cert-name-edit-box">
                      <input
                        type="text"
                        defaultValue={recipientName}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName(e.target.value)}
                        onBlur={(e) => handleSaveName(e.target.value)}
                        className="cert-name-input"
                      />
                    </div>
                  ) : (
                    <h2 className="cert-recipient-name" onClick={() => setIsEditingName(true)} title="Нажмите, чтобы изменить имя">
                      {certificate.name || recipientName} ✎
                    </h2>
                  )}

                  <p className="cert-desc-text">
                    has successfully demonstrated verified proficiency in American English at the level of
                  </p>

                  <div className="cert-level-display">
                    <span className="cert-grade-big">{certificate.level}</span>
                    <span className="cert-level-name">{certificate.levelTitle}</span>
                  </div>

                  {/* Radar Skills Bar */}
                  <div className="cert-skills-matrix">
                    <div className="skill-metric">
                      <span>Лексика:</span>
                      <strong>{certificate.skills?.vocabulary || certificate.score}%</strong>
                    </div>
                    <div className="skill-metric">
                      <span>Аудирование:</span>
                      <strong>{certificate.skills?.listening || certificate.score}%</strong>
                    </div>
                    <div className="skill-metric">
                      <span>Грамматика:</span>
                      <strong>{certificate.skills?.grammar || certificate.score}%</strong>
                    </div>
                    <div className="skill-metric">
                      <span>Говорение:</span>
                      <strong>{certificate.skills?.speaking || certificate.score}%</strong>
                    </div>
                  </div>

                  <div className="cert-footer-row">
                    <div className="cert-footer-col">
                      <span className="cf-label">Verification ID:</span>
                      <strong className="cf-val">{certificate.id}</strong>
                    </div>
                    <div className="cert-hologram-seal">
                      <div className="hologram-shine">🎖️</div>
                      <span>AUTHENTIC</span>
                    </div>
                    <div className="cert-footer-col right">
                      <span className="cf-label">Date of Issue:</span>
                      <strong className="cf-val">{certificate.date}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="cert-actions-row">
                <button className="cert-share-btn" onClick={handleShareCert}>
                  📲 Поделиться сертификатом
                </button>
                <button className="cert-retake-btn" onClick={startExam}>
                  🔄 Пересдать экзамен
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
