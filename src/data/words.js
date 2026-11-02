/**
 * Vocabulary dataset for Linguo.
 * Each word has: id, word, translation (Russian), language, level, category, example, exampleTranslation (Russian).
 */

export const words = [
  // ==================== ENGLISH WORDS ====================

  // --- A1 ---
  { id: 'en-a1-001', word: 'apple', translation: 'яблоко', language: 'en', level: 'A1', category: 'food', example: 'I eat an apple every day.', exampleTranslation: 'Я ем яблоко каждый день.' },
  { id: 'en-a1-002', word: 'cat', translation: 'кот / кошка', language: 'en', level: 'A1', category: 'animals', example: 'The cat is sleeping on the sofa.', exampleTranslation: 'Кот спит на диване.' },
  { id: 'en-a1-003', word: 'house', translation: 'дом', language: 'en', level: 'A1', category: 'home', example: 'We live in a big house.', exampleTranslation: 'Мы живём в большом доме.' },
  { id: 'en-a1-004', word: 'water', translation: 'вода', language: 'en', level: 'A1', category: 'food', example: 'Can I have some water, please?', exampleTranslation: 'Можно мне воды, пожалуйста?' },
  { id: 'en-a1-005', word: 'dog', translation: 'собака', language: 'en', level: 'A1', category: 'animals', example: 'My dog likes to play in the park.', exampleTranslation: 'Моя собака любит играть в парке.' },
  { id: 'en-a1-006', word: 'hand', translation: 'рука (кисть)', language: 'en', level: 'A1', category: 'body', example: 'Wash your hands before eating.', exampleTranslation: 'Мой руки перед едой.' },
  { id: 'en-a1-007', word: 'morning', translation: 'утро', language: 'en', level: 'A1', category: 'time', example: 'Good morning! How are you?', exampleTranslation: 'Доброе утро! Как дела?' },

  // --- A2 ---
  { id: 'en-a2-001', word: 'ticket', translation: 'билет', language: 'en', level: 'A2', category: 'travel', example: 'I need to buy a train ticket.', exampleTranslation: 'Мне нужно купить билет на поезд.' },
  { id: 'en-a2-002', word: 'weather', translation: 'погода', language: 'en', level: 'A2', category: 'nature', example: 'The weather is beautiful today.', exampleTranslation: 'Сегодня прекрасная погода.' },
  { id: 'en-a2-003', word: 'breakfast', translation: 'завтрак', language: 'en', level: 'A2', category: 'food', example: 'I usually have breakfast at 8 o\'clock.', exampleTranslation: 'Обычно я завтракаю в 8 часов.' },
  { id: 'en-a2-004', word: 'kitchen', translation: 'кухня', language: 'en', level: 'A2', category: 'home', example: 'She is cooking in the kitchen.', exampleTranslation: 'Она готовит на кухне.' },
  { id: 'en-a2-005', word: 'happy', translation: 'счастливый', language: 'en', level: 'A2', category: 'emotions', example: 'I am so happy to see you!', exampleTranslation: 'Я так рад тебя видеть!' },
  { id: 'en-a2-006', word: 'computer', translation: 'компьютер', language: 'en', level: 'A2', category: 'technology', example: 'He works on a computer all day.', exampleTranslation: 'Он работает за компьютером весь день.' },
  { id: 'en-a2-007', word: 'office', translation: 'офис', language: 'en', level: 'A2', category: 'work', example: 'I go to the office by bus.', exampleTranslation: 'Я езжу в офис на автобусе.' },

  // --- B1 ---
  { id: 'en-b1-001', word: 'experience', translation: 'опыт', language: 'en', level: 'B1', category: 'work', example: 'She has five years of experience in marketing.', exampleTranslation: 'У неё пять лет опыта в маркетинге.' },
  { id: 'en-b1-002', word: 'environment', translation: 'окружающая среда', language: 'en', level: 'B1', category: 'nature', example: 'We must protect the environment.', exampleTranslation: 'Мы должны защищать окружающую среду.' },
  { id: 'en-b1-003', word: 'shoulder', translation: 'плечо', language: 'en', level: 'B1', category: 'body', example: 'He put his hand on my shoulder.', exampleTranslation: 'Он положил руку мне на плечо.' },
  { id: 'en-b1-004', word: 'anxiety', translation: 'тревога', language: 'en', level: 'B1', category: 'emotions', example: 'She felt anxiety before the exam.', exampleTranslation: 'Она чувствовала тревогу перед экзаменом.' },
  { id: 'en-b1-005', word: 'departure', translation: 'отправление', language: 'en', level: 'B1', category: 'travel', example: 'The departure time is 10:30 AM.', exampleTranslation: 'Время отправления — 10:30.' },
  { id: 'en-b1-006', word: 'software', translation: 'программное обеспечение', language: 'en', level: 'B1', category: 'technology', example: 'We need to update the software.', exampleTranslation: 'Нам нужно обновить программное обеспечение.' },
  { id: 'en-b1-007', word: 'midnight', translation: 'полночь', language: 'en', level: 'B1', category: 'time', example: 'The movie ends at midnight.', exampleTranslation: 'Фильм заканчивается в полночь.' },

  // --- B2 ---
  { id: 'en-b2-001', word: 'revenue', translation: 'доход / выручка', language: 'en', level: 'B2', category: 'work', example: 'The company\'s revenue grew by 20%.', exampleTranslation: 'Выручка компании выросла на 20%.' },
  { id: 'en-b2-002', word: 'sustainability', translation: 'устойчивое развитие', language: 'en', level: 'B2', category: 'nature', example: 'Sustainability is a key goal for modern businesses.', exampleTranslation: 'Устойчивое развитие — ключевая цель современного бизнеса.' },
  { id: 'en-b2-003', word: 'frustration', translation: 'разочарование / фрустрация', language: 'en', level: 'B2', category: 'emotions', example: 'He expressed his frustration with the project.', exampleTranslation: 'Он выразил своё разочарование проектом.' },
  { id: 'en-b2-004', word: 'ingredient', translation: 'ингредиент', language: 'en', level: 'B2', category: 'food', example: 'The main ingredient in this dish is rice.', exampleTranslation: 'Основной ингредиент этого блюда — рис.' },
  { id: 'en-b2-005', word: 'artificial intelligence', translation: 'искусственный интеллект', language: 'en', level: 'B2', category: 'technology', example: 'Artificial intelligence is changing the world.', exampleTranslation: 'Искусственный интеллект меняет мир.' },
  { id: 'en-b2-006', word: 'itinerary', translation: 'маршрут / план поездки', language: 'en', level: 'B2', category: 'travel', example: 'Let me check the itinerary for our trip.', exampleTranslation: 'Дай мне проверить маршрут нашей поездки.' },

  // --- C1 ---
  { id: 'en-c1-001', word: 'ubiquitous', translation: 'вездесущий / повсеместный', language: 'en', level: 'C1', category: 'technology', example: 'Smartphones have become ubiquitous in modern life.', exampleTranslation: 'Смартфоны стали повсеместными в современной жизни.' },
  { id: 'en-c1-002', word: 'resilience', translation: 'стойкость / устойчивость', language: 'en', level: 'C1', category: 'emotions', example: 'Her resilience helped her overcome many challenges.', exampleTranslation: 'Её стойкость помогла ей преодолеть многие трудности.' },
  { id: 'en-c1-003', word: 'procurement', translation: 'закупка / снабжение', language: 'en', level: 'C1', category: 'work', example: 'The procurement department handles all purchases.', exampleTranslation: 'Отдел закупок занимается всеми покупками.' },
  { id: 'en-c1-004', word: 'biodiversity', translation: 'биоразнообразие', language: 'en', level: 'C1', category: 'nature', example: 'The rainforest is home to incredible biodiversity.', exampleTranslation: 'Тропический лес — место невероятного биоразнообразия.' },
  { id: 'en-c1-005', word: 'elbow', translation: 'локоть', language: 'en', level: 'C1', category: 'body', example: 'She bumped her elbow on the table.', exampleTranslation: 'Она ударила локоть о стол.' },

  // --- C2 ---
  { id: 'en-c2-001', word: 'ephemeral', translation: 'эфемерный / мимолётный', language: 'en', level: 'C2', category: 'time', example: 'Fame can be ephemeral, disappearing as quickly as it comes.', exampleTranslation: 'Слава может быть мимолётной, исчезая так же быстро, как и появляется.' },
  { id: 'en-c2-002', word: 'serendipity', translation: 'счастливая случайность', language: 'en', level: 'C2', category: 'emotions', example: 'Meeting her was pure serendipity.', exampleTranslation: 'Встреча с ней была чистой счастливой случайностью.' },
  { id: 'en-c2-003', word: 'quintessential', translation: 'типичнейший / образцовый', language: 'en', level: 'C2', category: 'work', example: 'He is the quintessential professional.', exampleTranslation: 'Он — образцовый профессионал.' },
  { id: 'en-c2-004', word: 'gastronomic', translation: 'гастрономический', language: 'en', level: 'C2', category: 'food', example: 'Paris offers a gastronomic experience like no other.', exampleTranslation: 'Париж предлагает гастрономический опыт, не имеющий равных.' },
  { id: 'en-c2-005', word: 'wanderlust', translation: 'страсть к путешествиям', language: 'en', level: 'C2', category: 'travel', example: 'His wanderlust took him to every continent.', exampleTranslation: 'Его страсть к путешествиям привела его на каждый континент.' },

  // ==================== GERMAN WORDS ====================

  // --- A1 ---
  { id: 'de-a1-001', word: 'der Apfel', translation: 'яблоко', language: 'de', level: 'A1', category: 'food', example: 'Der Apfel ist rot und süß.', exampleTranslation: 'Яблоко красное и сладкое.' },
  { id: 'de-a1-002', word: 'die Katze', translation: 'кот / кошка', language: 'de', level: 'A1', category: 'animals', example: 'Die Katze schläft auf dem Sofa.', exampleTranslation: 'Кошка спит на диване.' },
  { id: 'de-a1-003', word: 'das Haus', translation: 'дом', language: 'de', level: 'A1', category: 'home', example: 'Das Haus ist sehr groß.', exampleTranslation: 'Дом очень большой.' },
  { id: 'de-a1-004', word: 'das Wasser', translation: 'вода', language: 'de', level: 'A1', category: 'food', example: 'Ich trinke gern Wasser.', exampleTranslation: 'Я люблю пить воду.' },
  { id: 'de-a1-005', word: 'der Hund', translation: 'собака', language: 'de', level: 'A1', category: 'animals', example: 'Der Hund spielt im Garten.', exampleTranslation: 'Собака играет в саду.' },
  { id: 'de-a1-006', word: 'die Hand', translation: 'рука (кисть)', language: 'de', level: 'A1', category: 'body', example: 'Wasch dir die Hände vor dem Essen.', exampleTranslation: 'Вымой руки перед едой.' },
  { id: 'de-a1-007', word: 'der Morgen', translation: 'утро', language: 'de', level: 'A1', category: 'time', example: 'Guten Morgen! Wie geht es dir?', exampleTranslation: 'Доброе утро! Как у тебя дела?' },

  // --- A2 ---
  { id: 'de-a2-001', word: 'die Fahrkarte', translation: 'билет (проездной)', language: 'de', level: 'A2', category: 'travel', example: 'Ich muss eine Fahrkarte kaufen.', exampleTranslation: 'Мне нужно купить билет.' },
  { id: 'de-a2-002', word: 'das Wetter', translation: 'погода', language: 'de', level: 'A2', category: 'nature', example: 'Das Wetter ist heute sehr schön.', exampleTranslation: 'Погода сегодня очень хорошая.' },
  { id: 'de-a2-003', word: 'das Frühstück', translation: 'завтрак', language: 'de', level: 'A2', category: 'food', example: 'Zum Frühstück esse ich Brot mit Käse.', exampleTranslation: 'На завтрак я ем хлеб с сыром.' },
  { id: 'de-a2-004', word: 'die Küche', translation: 'кухня', language: 'de', level: 'A2', category: 'home', example: 'Sie kocht in der Küche.', exampleTranslation: 'Она готовит на кухне.' },
  { id: 'de-a2-005', word: 'glücklich', translation: 'счастливый', language: 'de', level: 'A2', category: 'emotions', example: 'Ich bin so glücklich, dich zu sehen!', exampleTranslation: 'Я так рад тебя видеть!' },
  { id: 'de-a2-006', word: 'der Computer', translation: 'компьютер', language: 'de', level: 'A2', category: 'technology', example: 'Er arbeitet den ganzen Tag am Computer.', exampleTranslation: 'Он работает за компьютером весь день.' },
  { id: 'de-a2-007', word: 'das Büro', translation: 'офис', language: 'de', level: 'A2', category: 'work', example: 'Ich fahre mit dem Bus ins Büro.', exampleTranslation: 'Я езжу в офис на автобусе.' },

  // --- B1 ---
  { id: 'de-b1-001', word: 'die Erfahrung', translation: 'опыт', language: 'de', level: 'B1', category: 'work', example: 'Sie hat viel Erfahrung im Bereich Marketing.', exampleTranslation: 'У неё большой опыт в области маркетинга.' },
  { id: 'de-b1-002', word: 'die Umwelt', translation: 'окружающая среда', language: 'de', level: 'B1', category: 'nature', example: 'Wir müssen die Umwelt schützen.', exampleTranslation: 'Мы должны защищать окружающую среду.' },
  { id: 'de-b1-003', word: 'die Schulter', translation: 'плечо', language: 'de', level: 'B1', category: 'body', example: 'Er legte seine Hand auf meine Schulter.', exampleTranslation: 'Он положил руку мне на плечо.' },
  { id: 'de-b1-004', word: 'die Angst', translation: 'страх / тревога', language: 'de', level: 'B1', category: 'emotions', example: 'Sie hatte Angst vor der Prüfung.', exampleTranslation: 'Она боялась экзамена.' },
  { id: 'de-b1-005', word: 'die Abfahrt', translation: 'отправление', language: 'de', level: 'B1', category: 'travel', example: 'Die Abfahrt des Zuges ist um 10:30 Uhr.', exampleTranslation: 'Отправление поезда в 10:30.' },
  { id: 'de-b1-006', word: 'die Software', translation: 'программное обеспечение', language: 'de', level: 'B1', category: 'technology', example: 'Wir müssen die Software aktualisieren.', exampleTranslation: 'Нам нужно обновить программное обеспечение.' },
  { id: 'de-b1-007', word: 'die Mitternacht', translation: 'полночь', language: 'de', level: 'B1', category: 'time', example: 'Der Film endet um Mitternacht.', exampleTranslation: 'Фильм заканчивается в полночь.' },

  // --- B2 ---
  { id: 'de-b2-001', word: 'der Umsatz', translation: 'оборот / выручка', language: 'de', level: 'B2', category: 'work', example: 'Der Umsatz des Unternehmens ist um 20% gestiegen.', exampleTranslation: 'Оборот компании вырос на 20%.' },
  { id: 'de-b2-002', word: 'die Nachhaltigkeit', translation: 'устойчивое развитие', language: 'de', level: 'B2', category: 'nature', example: 'Nachhaltigkeit ist ein wichtiges Thema.', exampleTranslation: 'Устойчивое развитие — важная тема.' },
  { id: 'de-b2-003', word: 'die Enttäuschung', translation: 'разочарование', language: 'de', level: 'B2', category: 'emotions', example: 'Die Enttäuschung war groß.', exampleTranslation: 'Разочарование было велико.' },
  { id: 'de-b2-004', word: 'die Zutat', translation: 'ингредиент', language: 'de', level: 'B2', category: 'food', example: 'Die wichtigste Zutat in diesem Gericht ist Reis.', exampleTranslation: 'Самый важный ингредиент в этом блюде — рис.' },
  { id: 'de-b2-005', word: 'die Künstliche Intelligenz', translation: 'искусственный интеллект', language: 'de', level: 'B2', category: 'technology', example: 'Künstliche Intelligenz verändert die Welt.', exampleTranslation: 'Искусственный интеллект меняет мир.' },
  { id: 'de-b2-006', word: 'die Reiseroute', translation: 'маршрут поездки', language: 'de', level: 'B2', category: 'travel', example: 'Lass mich die Reiseroute überprüfen.', exampleTranslation: 'Дай мне проверить маршрут поездки.' },

  // --- C1 ---
  { id: 'de-c1-001', word: 'allgegenwärtig', translation: 'вездесущий / повсеместный', language: 'de', level: 'C1', category: 'technology', example: 'Smartphones sind allgegenwärtig geworden.', exampleTranslation: 'Смартфоны стали повсеместными.' },
  { id: 'de-c1-002', word: 'die Widerstandsfähigkeit', translation: 'стойкость / устойчивость', language: 'de', level: 'C1', category: 'emotions', example: 'Ihre Widerstandsfähigkeit half ihr, viele Herausforderungen zu meistern.', exampleTranslation: 'Её стойкость помогла ей справиться со многими трудностями.' },
  { id: 'de-c1-003', word: 'die Beschaffung', translation: 'закупка / снабжение', language: 'de', level: 'C1', category: 'work', example: 'Die Beschaffungsabteilung kümmert sich um alle Einkäufe.', exampleTranslation: 'Отдел закупок занимается всеми покупками.' },
  { id: 'de-c1-004', word: 'die Artenvielfalt', translation: 'биоразнообразие', language: 'de', level: 'C1', category: 'nature', example: 'Der Regenwald beherbergt eine unglaubliche Artenvielfalt.', exampleTranslation: 'Тропический лес является местом невероятного биоразнообразия.' },
  { id: 'de-c1-005', word: 'der Ellbogen', translation: 'локоть', language: 'de', level: 'C1', category: 'body', example: 'Sie hat sich den Ellbogen am Tisch gestoßen.', exampleTranslation: 'Она ударила локоть о стол.' },

  // --- C2 ---
  { id: 'de-c2-001', word: 'vergänglich', translation: 'мимолётный / бренный', language: 'de', level: 'C2', category: 'time', example: 'Ruhm ist oft vergänglich.', exampleTranslation: 'Слава часто мимолётна.' },
  { id: 'de-c2-002', word: 'der glückliche Zufall', translation: 'счастливая случайность', language: 'de', level: 'C2', category: 'emotions', example: 'Unsere Begegnung war ein glücklicher Zufall.', exampleTranslation: 'Наша встреча была счастливой случайностью.' },
  { id: 'de-c2-003', word: 'mustergültig', translation: 'образцовый / примерный', language: 'de', level: 'C2', category: 'work', example: 'Er ist ein mustergültiger Fachmann.', exampleTranslation: 'Он образцовый специалист.' },
  { id: 'de-c2-004', word: 'kulinarisch', translation: 'кулинарный / гастрономический', language: 'de', level: 'C2', category: 'food', example: 'Wien bietet ein kulinarisches Erlebnis erster Klasse.', exampleTranslation: 'Вена предлагает кулинарный опыт первого класса.' },
  { id: 'de-c2-005', word: 'das Fernweh', translation: 'тоска по дальним странам', language: 'de', level: 'C2', category: 'travel', example: 'Sein Fernweh trieb ihn um die ganze Welt.', exampleTranslation: 'Его тоска по дальним странам привела его по всему миру.' },
];

export default words;
