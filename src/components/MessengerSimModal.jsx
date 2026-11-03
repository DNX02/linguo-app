import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { gamification } from '../utils/gamification';
import './MessengerSimModal.css';

const CHATS = [
  {
    id: 'john-nyc',
    name: 'John from Brooklyn',
    avatar: '🧢',
    online: 'Online',
    lang: 'en',
    topic: '🎉 Тусовка на крыше в Вильямсбурге',
    steps: [
      {
        bot: 'Yo! What are you up to tonight? A few friends are pulling up to a rooftop in Brooklyn.',
        ru: 'Йо! Чем занят сегодня вечером? Пара друзей подтягиваются на крышу в Бруклине.',
        options: [
          { text: 'I am totally down! What time should I pull up?', correct: true, reply: 'Bet! Around 9 PM. Bring some good vibes!' },
          { text: 'I am sleeping yesterday on the floor.', correct: false, reply: 'Haha wait, what do you mean? You okay?' },
        ],
      },
      {
        bot: 'Bet! Around 9 PM. Bring some good vibes! It\'s gonna be lit.',
        ru: 'Договорились! Около 9 вечера. Захвати хорошее настроение! Будет огненно.',
        options: [
          { text: 'Sounds awesome, see you there!', correct: true, reply: 'Catch you later bro!' },
          { text: 'I want to eat a pencil.', correct: false, reply: 'Bro you trippin haha.' },
        ],
      },
    ],
  },
  {
    id: 'claudia-berlin',
    name: 'Claudia (Berlin WG)',
    avatar: '👩',
    online: 'Online',
    lang: 'de',
    topic: '🏠 Аренда комнаты в Берлине (WG-Zimmer)',
    steps: [
      {
        bot: 'Hallo! Wir haben deine Nachricht für das Zimmer in Kreuzberg bekommen. Suchst du noch?',
        ru: 'Привет! Мы получили твоё сообщение насчет комнаты в Кройцберге. Ты еще ищешь?',
        options: [
          { text: 'Ja, auf jeden Fall! Wann kann ich zur Besichtigung vorbeikommen?', correct: true, reply: 'Super! Passt es dir morgen um 18 Uhr?' },
          { text: 'Ich bin ein Auto und fahre schnell.', correct: false, reply: 'Äh, wie bitte? Wir suchen einen Mitbewohner...' },
        ],
      },
      {
        bot: 'Super! Passt es dir morgen um 18 Uhr? Die Warmmiete beträgt 450 Euro.',
        ru: 'Супер! Удобно ли завтра в 18:00? Аренда с отоплением составляет 450 евро.',
        options: [
          { text: 'Perfekt, 18 Uhr passt mir ausgezeichnet. Bis morgen!', correct: true, reply: 'Alles klar, wir freuen uns auf dich!' },
          { text: 'Ich habe kein Geld und will schlafen.', correct: false, reply: 'Das wird dann leider schwierig...' },
        ],
      },
    ],
  },
];

export default function MessengerSimModal({ isOpen, onClose }) {
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [finished, setFinished] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize first message
      setCurrentStep(0);
      setFinished(false);
      setMessages([
        { sender: 'bot', text: activeChat.steps[0].bot, ru: activeChat.steps[0].ru, time: '21:04' },
      ]);
    }
  }, [isOpen, activeChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleChooseOption = (opt) => {
    // Add user message
    const now = '21:05';
    const userMsg = { sender: 'user', text: opt.text, time: now };
    setMessages((prev) => [...prev, userMsg]);
    sounds.playCorrect();

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg = { sender: 'bot', text: opt.reply, time: '21:05' };
      setMessages((prev) => [...prev, botMsg]);

      if (opt.correct) {
        if (currentStep + 1 < activeChat.steps.length) {
          setCurrentStep((s) => s + 1);
        } else {
          setFinished(true);
          sounds.playComplete();
          gamification.addXP(35);
        }
      }
    }, 1200);
  };

  const stepData = activeChat.steps[currentStep];

  return (
    <div className="messenger-modal-backdrop" onClick={onClose}>
      <div className="messenger-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Chat Header */}
        <header className="messenger-modal-header">
          <div className="chat-person-col">
            <span className="chat-avatar">{activeChat.avatar}</span>
            <div>
              <h3>{activeChat.name}</h3>
              <span className="chat-status">{activeChat.online} • {activeChat.topic}</span>
            </div>
          </div>
          <button className="messenger-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        {/* Story tabs */}
        <div className="chat-tabs-row">
          {CHATS.map((c) => (
            <button
              key={c.id}
              className={`chat-tab-btn ${activeChat.id === c.id ? 'active' : ''}`}
              onClick={() => setActiveChat(c)}
            >
              {c.avatar} {c.name}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="chat-stream-box" ref={scrollRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble-wrap ${m.sender}`}>
              <div className="chat-bubble">
                <p className="bubble-text">{m.text}</p>
                {m.ru && <span className="bubble-trans">{m.ru}</span>}
                <span className="bubble-time">{m.time} ✓✓</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-typing-indicator">
              <span>{activeChat.name} печатает...</span>
            </div>
          )}
        </div>

        {/* User Interactive Reply Options */}
        <div className="chat-reply-controls">
          {finished ? (
            <div className="chat-finished-banner">
              🎉 Диалог успешно завершён! Вы общались как настоящий нейтив (+35 XP)!
            </div>
          ) : (
            <div className="chat-options-stack">
              <span className="reply-prompt">Ваш ответ в диалоге:</span>
              {stepData?.options.map((opt, i) => (
                <button
                  key={i}
                  className="chat-reply-choice-btn"
                  onClick={() => handleChooseOption(opt)}
                  disabled={isTyping}
                >
                  💬 {opt.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
