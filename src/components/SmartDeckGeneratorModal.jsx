import React, { useState } from 'react';
import { addCard } from '../db';
import { speakText } from '../utils/speech';
import gamification from '../utils/gamification';
import { playSound } from '../utils/soundEffects';
import './SmartDeckGeneratorModal.css';

const THEME_DECKS = {
  it_startup: {
    title: 'IT & Стартап Собеседование',
    icon: '💼',
    en: [
      { word: 'Scalability', translation: 'Масштабируемость', example: 'Our cloud architecture ensures high scalability.' },
      { word: 'Bottleneck', translation: 'Узкое место / затор', example: 'The database query was the primary bottleneck.' },
      { word: 'Deployment', translation: 'Развертывание / деплой', example: 'Continuous deployment runs after every pull request.' },
      { word: 'Trade-off', translation: 'Компромисс / баланс', example: 'We made a trade-off between speed and memory efficiency.' },
      { word: 'Refactoring', translation: 'Рефакторинг кода', example: 'We dedicated Friday to refactoring legacy modules.' },
      { word: 'Stakeholder', translation: 'Заинтересованная сторона', example: 'We presented the MVP to project stakeholders.' }
    ],
    de: [
      { word: 'die Skalierbarkeit', translation: 'Масштабируемость', example: 'Die Skalierbarkeit unserer Software ist sehr wichtig.' },
      { word: 'der Engpass', translation: 'Узкое место (ботлнек)', example: 'Wir müssen diesen Engpass in der Datenbank beheben.' },
      { word: 'die Bereitstellung', translation: 'Развертывание (деплой)', example: 'Die Bereitstellung des neuen Releases ist morgen.' },
      { word: 'der Kompromiss', translation: 'Компромисс', example: 'Wir haben einen guten Kompromiss gefunden.' },
      { word: 'die Fehlerbehebung', translation: 'Исправление ошибок (багфикс)', example: 'Die Fehlerbehebung hat oberste Priorität.' },
      { word: 'der Ansprechpartner', translation: 'Контактное лицо / стейкхолдер', example: 'Er ist unser Ansprechpartner für das Projekt.' }
    ]
  },
  bar_berlin: {
    title: 'Бар, Крафт & Вечеринки',
    icon: '🍻',
    en: [
      { word: 'On tap', translation: 'На разлив / из крана', example: 'What craft IPAs do you have on tap tonight?' },
      { word: 'Round of drinks', translation: 'Круг выпивки на всех', example: 'Next round of beers is on me, guys!' },
      { word: 'Hangover', translation: 'Похмелье', example: 'A strong coffee is my remedy for a hangover.' },
      { word: 'Cheers', translation: 'Будем здоровы! / Ваше здоровье!', example: 'Cheers to our upcoming road trip!' },
      { word: 'Nightcap', translation: 'Бокал на сон грядущий', example: 'Let us have one quick nightcap before leaving.' }
    ],
    de: [
      { word: 'das Bier vom Fass', translation: 'Пиво на разлив', example: 'Zwei Pils vom Fass, bitte!' },
      { word: 'anstoßen', translation: 'Чокаться бокалами', example: 'Lasst uns auf den Erfolg anstoßen!' },
      { word: 'der Kater', translation: 'Похмелье', example: 'Ich habe heute einen heftigen Kater.' },
      { word: 'die Runde', translation: 'Круг выпивки на всех', example: 'Die nächste Runde geht auf mich!' },
      { word: 'der Stammgast', translation: 'Постоянный гость бара', example: 'Er ist seit fünf Jahren Stammgast in dieser Kneipe.' }
    ]
  },
  travel_airport: {
    title: 'Аэропорт, Таможня & Багаж',
    icon: '✈️',
    en: [
      { word: 'Boarding pass', translation: 'Посадочный талон', example: 'Have your boarding pass and passport ready.' },
      { word: 'Baggage claim', translation: 'Выдача багажа', example: 'Follow the green signs to baggage claim carousel 4.' },
      { word: 'Flight delay', translation: 'Задержка рейса', example: 'Our connecting flight suffered a two-hour delay.' },
      { word: 'Customs declaration', translation: 'Таможенная декларация', example: 'Fill in the customs declaration before exit.' },
      { word: 'Overhead compartment', translation: 'Багажная полка над сиденьем', example: 'Place your backpack in the overhead compartment.' }
    ],
    de: [
      { word: 'die Bordkarte', translation: 'Посадочный талон', example: 'Bitte zeigen Sie Ihre Bordkarte vor dem Einsteigen.' },
      { word: 'die Gepäckausgabe', translation: 'Выдача багажа', example: 'Wir treffen uns an der Gepäckausgabe.' },
      { word: 'die Flugverspätung', translation: 'Задержка рейса', example: 'Wegen des Sturms gibt es eine Flugverspätung.' },
      { word: 'der Zoll', translation: 'Таможня', example: 'Müssen wir beim Zoll etwas anmelden?' },
      { word: 'das Handgepäck', translation: 'Ручная кладь', example: 'Das Handgepäck darf höchstens acht Kilo wiegen.' }
    ]
  },
  romance_dating: {
    title: 'Свидания, Вайб & Отношения',
    icon: '☕',
    en: [
      { word: 'Dealbreaker', translation: 'Категорический стоп-фактор', example: 'Bad manners on a first date are a dealbreaker.' },
      { word: 'Red flag', translation: 'Тревожный звоночек', example: 'Talking only about oneself is a major red flag.' },
      { word: 'Chemistry', translation: 'Взаимная искра / химия', example: 'We instantly felt a great mutual chemistry.' },
      { word: 'Small talk', translation: 'Непринужденный разговор ни о чем', example: 'I prefer deep talks rather than awkward small talk.' },
      { word: 'Vibe check', translation: 'Проверка настроя / вайба', example: 'She passed the vibe check within five minutes.' }
    ],
    de: [
      { word: 'die Ausstrahlung', translation: 'Харизма / аура / обаяние', example: 'Sie hat eine bezaubernde Ausstrahlung.' },
      { word: 'die Chemie stimmt', translation: 'Между нами есть химия', example: 'Bei unserem ersten Treffen hat die Chemie sofort gestimmt.' },
      { word: 'das Warnsignal', translation: 'Тревожный звоночек (red flag)', example: 'Unpünktlichkeit war für mich ein erstes Warnsignal.' },
      { word: 'Schmetterlinge im Bauch', translation: 'Бабочки в животе', example: 'Ich habe Schmetterlinge im Bauch, wenn ich an ihn denke.' },
      { word: 'sich verabreden', translation: 'Договориться о свидании', example: 'Wollen wir uns morgen auf einen Kaffee verabreden?' }
    ]
  },
  gym_fitness: {
    title: 'Фитнес, Зал & ЗОЖ',
    icon: '🏋️',
    en: [
      { word: 'Repetition (Rep)', translation: 'Повторение в упражнении', example: 'Do three sets of twelve reps with controlled tempo.' },
      { word: 'Muscle soreness', translation: 'Крепатура / боль в мышцах', example: 'I have severe muscle soreness after leg day.' },
      { word: 'Warm-up', translation: 'Разминка', example: 'Never skip your warm-up before heavy lifting.' },
      { word: 'Spotter', translation: 'Страхующий напарник в зале', example: 'Can you spot me on my last bench press set?' },
      { word: 'Nutritional balance', translation: 'Баланс питательных веществ', example: 'Track your protein intake for recovery.' }
    ],
    de: [
      { word: 'der Muskelkater', translation: 'Крепатура', example: 'Nach dem Training habe ich schlimmen Muskelkater.' },
      { word: 'das Aufwärmen', translation: 'Разминка', example: 'Ein gutes Aufwärmen beugt Verletzungen vor.' },
      { word: 'der Trainingssatz', translation: 'Подход (сет)', example: 'Ich mache noch einen Trainingssatz Kniebeugen.' },
      { word: 'die Wiederholung', translation: 'Повторение', example: 'Schaffst du noch zwei Wiederholungen?' },
      { word: 'die Ausdauer', translation: 'Выносливость', example: 'Laufen verbessert die Ausdauer und das Herz-Kreislauf-System.' }
    ]
  }
};

export default function SmartDeckGeneratorModal({ isOpen, onClose, onCardsAdded }) {
  const [selectedThemeKey, setSelectedThemeKey] = useState('it_startup');
  const [selectedLang, setSelectedLang] = useState('en');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedCards, setGeneratedCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [addedIds, setAddedIds] = useState(new Set());
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const activeTheme = THEME_DECKS[selectedThemeKey];
  const currentCards = generatedCards.length > 0 ? generatedCards : (activeTheme ? activeTheme[selectedLang] : []);

  const handleGenerateCustom = () => {
    if (!customPrompt.trim()) return;
    setIsGenerating(true);
    setStatusMsg('');

    setTimeout(() => {
      // Smart local keyword generator for topics
      const promptLower = customPrompt.toLowerCase();
      let newWords = [];
      if (promptLower.includes('кино') || promptLower.includes('movie') || promptLower.includes('film')) {
        newWords = selectedLang === 'en' ? [
          { word: 'Plot twist', translation: 'Неожиданный поворот сюжета', example: 'The thriller had a mind-blowing plot twist.' },
          { word: 'Blockbuster', translation: 'Кассовый суперхит', example: 'The sci-fi epic became the highest-grossing blockbuster.' },
          { word: 'Soundtrack', translation: 'Саундтрек к фильму', example: 'Hans Zimmer composed the atmospheric soundtrack.' },
          { word: 'Cliffhanger', translation: 'Интригующий открытый финал', example: 'The season finale ended on an intense cliffhanger.' }
        ] : [
          { word: 'die Handlung', translation: 'Сюжет фильма', example: 'Die Handlung des Thrillers war extrem spannend.' },
          { word: 'die Filmmusik', translation: 'Саундтрек', example: 'Die Filmmusik erzeugte pure Gänsehaut.' },
          { word: 'die Besetzung', translation: 'Актёрский состав', example: 'Eine Star-Besetzung mit großartigen Schauspielern.' },
          { word: 'die Fortsetzung', translation: 'Сиквел / продолжение', example: 'Die Fortsetzung kommt nächsten Sommer ins Kino.' }
        ];
      } else if (promptLower.includes('еда') || promptLower.includes('food') || promptLower.includes('кухн')) {
        newWords = selectedLang === 'en' ? [
          { word: 'Savory', translation: 'Пряный / пикантный', example: 'A rich and savory mushroom risotto.' },
          { word: 'Appetizer', translation: 'Закуска перед главным блюдом', example: 'We ordered crispy garlic bruschetta as an appetizer.' },
          { word: 'Rare / Medium', translation: 'Степень прожарки стейка', example: 'I prefer my ribeye steak cooked medium rare.' },
          { word: 'Culinary masterpiece', translation: 'Кулинарный шедевр', example: 'The chef created a truly memorable dinner.' }
        ] : [
          { word: 'der Geschmack', translation: 'Вкус блюда', example: 'Der Geschmack von frischen Kräutern ist unvergleichlich.' },
          { word: 'die Vorspeise', translation: 'Закуска / апетайзер', example: 'Als Vorspeise nehmen wir eine Tomatensuppe.' },
          { word: 'köstlich', translation: 'Изумительно вкусно', example: 'Dieses Gericht schmeckt absolut köstlich!' },
          { word: 'die Beilage', translation: 'Гарнир', example: 'Möchten Sie Pommes oder Salat als Beilage?' }
        ];
      } else {
        // General smart academic/smart deck
        newWords = selectedLang === 'en' ? [
          { word: `${customPrompt} overview`, translation: `Обзор темы: ${customPrompt}`, example: `A detailed study into the fundamentals of ${customPrompt}.` },
          { word: 'Crucial element', translation: 'Ключевой фактор / элемент', example: 'Understanding the fundamentals is a crucial element.' },
          { word: 'Implementation', translation: 'Внедрение и реализация', example: 'The implementation phase took three weeks.' },
          { word: 'Insight', translation: 'Глубокое понимание / инсайт', example: 'The research provided valuable practical insights.' }
        ] : [
          { word: `die Einführung in ${customPrompt}`, translation: `Введение в: ${customPrompt}`, example: `Eine Einführung in das Thema ${customPrompt}.` },
          { word: 'der Kernpunkt', translation: 'Суть / ключевой пункт', example: 'Das ist der wichtigste Kernpunkt dieser Analyse.' },
          { word: 'die Umsetzung', translation: 'Реализация на практике', example: 'Die praktische Umsetzung verlief reibungslos.' },
          { word: 'die Erkenntnis', translation: 'Вывод / открытие', example: 'Diese Erkenntnis half uns bei der Entscheidung.' }
        ];
      }

      setGeneratedCards(newWords);
      setIsGenerating(false);
      setStatusMsg(`Сгенерировано ${newWords.length} карточек по теме "${customPrompt}"!`);
      try { playSound('streak'); } catch (_) {}
    }, 600);
  };

  const handleAddSingleCard = async (item, idx) => {
    try {
      const cardId = `smart_${Date.now()}_${idx}`;
      await addCard({
        id: cardId,
        word: item.word,
        translation: item.translation,
        language: selectedLang,
        level: 'B1',
        category: activeTheme?.title || customPrompt || 'Smart Deck',
        example: item.example,
        exampleTranslation: ''
      });
      setAddedIds(prev => new Set(prev).add(item.word));
      try {
        gamification.addXP(10);
        playSound('correct');
      } catch (_) {}
      if (onCardsAdded) onCardsAdded();
    } catch (e) {
      console.warn('Error adding card', e);
    }
  };

  const handleAddAllCards = async () => {
    try {
      let count = 0;
      for (let i = 0; i < currentCards.length; i++) {
        const item = currentCards[i];
        if (!addedIds.has(item.word)) {
          await addCard({
            id: `smart_${Date.now()}_${i}`,
            word: item.word,
            translation: item.translation,
            language: selectedLang,
            level: 'B1',
            category: activeTheme?.title || customPrompt || 'Smart Deck',
            example: item.example,
            exampleTranslation: ''
          });
          count++;
        }
      }
      setAddedIds(new Set(currentCards.map(c => c.word)));
      try {
        gamification.addXP(count * 10 + 20);
        playSound('celebration');
      } catch (_) {}
      setStatusMsg(`🎉 Все ${count} карточек добавлены в твою колоду! (+${count * 10 + 20} XP)`);
      if (onCardsAdded) onCardsAdded();
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="smart-deck-overlay" onClick={onClose}>
      <div className="smart-deck-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="smart-deck-header">
          <div className="smart-deck-title">
            <span className="smart-deck-badge">✨ AI Генератор</span>
            <h3>Умные колоды слов</h3>
            <p>Готовые тематические наборы и мгновенная генерация карточек</p>
          </div>
          <button className="smart-deck-close" onClick={onClose}>✕</button>
        </div>

        {/* Language selector */}
        <div className="smart-deck-lang-bar">
          <button
            className={`lang-pill ${selectedLang === 'en' ? 'active' : ''}`}
            onClick={() => { setSelectedLang('en'); setGeneratedCards([]); }}
          >
            🇬🇧 English
          </button>
          <button
            className={`lang-pill ${selectedLang === 'de' ? 'active' : ''}`}
            onClick={() => { setSelectedLang('de'); setGeneratedCards([]); }}
          >
            🇩🇪 Deutsch
          </button>
        </div>

        {/* Theme presets carousel */}
        <div className="smart-deck-themes">
          {Object.entries(THEME_DECKS).map(([key, data]) => (
            <button
              key={key}
              className={`theme-chip ${selectedThemeKey === key && generatedCards.length === 0 ? 'active' : ''}`}
              onClick={() => {
                setSelectedThemeKey(key);
                setGeneratedCards([]);
                setStatusMsg('');
              }}
            >
              <span>{data.icon}</span>
              <span>{data.title}</span>
            </button>
          ))}
        </div>

        {/* Custom topic input */}
        <div className="smart-deck-custom-box">
          <input
            type="text"
            placeholder="Или введите свою тему (напр. Кино, Космос, Еда)..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustom()}
          />
          <button
            className="smart-deck-gen-btn"
            onClick={handleGenerateCustom}
            disabled={isGenerating || !customPrompt.trim()}
          >
            {isGenerating ? 'Создаём...' : '⚡ Создать'}
          </button>
        </div>

        {statusMsg && <div className="smart-deck-alert">{statusMsg}</div>}

        {/* Cards preview list */}
        <div className="smart-deck-cards-list">
          {currentCards.map((c, idx) => {
            const isAdded = addedIds.has(c.word);
            return (
              <div key={idx} className="smart-deck-card-item">
                <div className="smart-deck-card-info">
                  <div className="smart-deck-word-row">
                    <strong>{c.word}</strong>
                    <button
                      className="smart-deck-audio-btn"
                      onClick={() => speakText(c.word, selectedLang)}
                      title="Озвучить"
                    >
                      🔊
                    </button>
                  </div>
                  <div className="smart-deck-translation">{c.translation}</div>
                  {c.example && <div className="smart-deck-example">«{c.example}»</div>}
                </div>

                <button
                  className={`smart-deck-add-btn ${isAdded ? 'added' : ''}`}
                  onClick={() => !isAdded && handleAddSingleCard(c, idx)}
                  disabled={isAdded}
                >
                  {isAdded ? '✓ В колоде' : '+ Добавить'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="smart-deck-footer">
          <button className="smart-deck-add-all-btn" onClick={handleAddAllCards}>
            📥 Добавить всю колоду (+XP)
          </button>
        </div>
      </div>
    </div>
  );
}
