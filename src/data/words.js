/**
 * Comprehensive vocabulary dataset for Linguo.
 * English & German across levels A1–C1 with Russian translations,
 * categories, transcriptions, and contextual examples.
 */

export const words = [
  // ========================================================
  // ==================== ENGLISH (EN) ======================
  // ========================================================

  // --- EN A1 ---
  { id: 'en-a1-001', word: 'apple', translation: 'яблоко', language: 'en', level: 'A1', category: 'food', example: 'I eat an apple every day.', exampleTranslation: 'Я ем яблоко каждый день.' },
  { id: 'en-a1-002', word: 'cat', translation: 'кот / кошка', language: 'en', level: 'A1', category: 'animals', example: 'The cat is sleeping on the sofa.', exampleTranslation: 'Кот спит на диване.' },
  { id: 'en-a1-003', word: 'house', translation: 'дом', language: 'en', level: 'A1', category: 'home', example: 'We live in a big house.', exampleTranslation: 'Мы живём в большом доме.' },
  { id: 'en-a1-004', word: 'water', translation: 'вода', language: 'en', level: 'A1', category: 'food', example: 'Can I have some water, please?', exampleTranslation: 'Можно мне воды, пожалуйста?' },
  { id: 'en-a1-005', word: 'dog', translation: 'собака', language: 'en', level: 'A1', category: 'animals', example: 'My dog likes to play in the park.', exampleTranslation: 'Моя собака любит играть в парке.' },
  { id: 'en-a1-006', word: 'hand', translation: 'рука (кисть)', language: 'en', level: 'A1', category: 'body', example: 'Wash your hands before eating.', exampleTranslation: 'Мой руки перед едой.' },
  { id: 'en-a1-007', word: 'morning', translation: 'утро', language: 'en', level: 'A1', category: 'time', example: 'Good morning! How are you?', exampleTranslation: 'Доброе утро! Как дела?' },
  { id: 'en-a1-008', word: 'coffee', translation: 'кофе', language: 'en', level: 'A1', category: 'food', example: 'I drink black coffee in the morning.', exampleTranslation: 'Я пью чёрный кофе по утрам.' },
  { id: 'en-a1-009', word: 'book', translation: 'книга', language: 'en', level: 'A1', category: 'education', example: 'This is an interesting book.', exampleTranslation: 'Это интересная книга.' },
  { id: 'en-a1-010', word: 'friend', translation: 'друг / подруга', language: 'en', level: 'A1', category: 'people', example: 'He is my best friend.', exampleTranslation: 'Он мой лучший друг.' },
  { id: 'en-a1-011', word: 'family', translation: 'семья', language: 'en', level: 'A1', category: 'people', example: 'I love my family.', exampleTranslation: 'Я люблю свою семью.' },
  { id: 'en-a1-012', word: 'city', translation: 'город', language: 'en', level: 'A1', category: 'places', example: 'London is a very beautiful city.', exampleTranslation: 'Лондон — очень красивый город.' },
  { id: 'en-a1-013', word: 'street', translation: 'улица', language: 'en', level: 'A1', category: 'places', example: 'Where is Baker Street?', exampleTranslation: 'Где находится Бейкер-стрит?' },
  { id: 'en-a1-014', word: 'money', translation: 'деньги', language: 'en', level: 'A1', category: 'basics', example: 'How much money do you need?', exampleTranslation: 'Сколько денег тебе нужно?' },
  { id: 'en-a1-015', word: 'time', translation: 'время', language: 'en', level: 'A1', category: 'time', example: 'What time is it right now?', exampleTranslation: 'Который сейчас час?' },

  // --- EN A2 ---
  { id: 'en-a2-001', word: 'ticket', translation: 'билет', language: 'en', level: 'A2', category: 'travel', example: 'I need to buy a train ticket.', exampleTranslation: 'Мне нужно купить билет на поезд.' },
  { id: 'en-a2-002', word: 'weather', translation: 'погода', language: 'en', level: 'A2', category: 'nature', example: 'The weather is beautiful today.', exampleTranslation: 'Сегодня прекрасная погода.' },
  { id: 'en-a2-003', word: 'breakfast', translation: 'завтрак', language: 'en', level: 'A2', category: 'food', example: 'I usually have breakfast at 8 o\'clock.', exampleTranslation: 'Обычно я завтракаю в 8 часов.' },
  { id: 'en-a2-004', word: 'kitchen', translation: 'кухня', language: 'en', level: 'A2', category: 'home', example: 'She is cooking in the kitchen.', exampleTranslation: 'Она готовит на кухне.' },
  { id: 'en-a2-005', word: 'happy', translation: 'счастливый', language: 'en', level: 'A2', category: 'emotions', example: 'I am so happy to see you!', exampleTranslation: 'Я так рад тебя видеть!' },
  { id: 'en-a2-006', word: 'computer', translation: 'компьютер', language: 'en', level: 'A2', category: 'technology', example: 'He works on a computer all day.', exampleTranslation: 'Он работает за компьютером весь день.' },
  { id: 'en-a2-007', word: 'office', translation: 'офис', language: 'en', level: 'A2', category: 'work', example: 'I go to the office by bus.', exampleTranslation: 'Я езжу в офис на автобусе.' },
  { id: 'en-a2-008', word: 'airport', translation: 'аэропорт', language: 'en', level: 'A2', category: 'travel', example: 'We arrived at the airport two hours early.', exampleTranslation: 'Мы приехали в аэропорт на два часа раньше.' },
  { id: 'en-a2-009', word: 'hotel', translation: 'отель / гостиница', language: 'en', level: 'A2', category: 'travel', example: 'We booked a cozy hotel by the sea.', exampleTranslation: 'Мы забронировали уютный отель у моря.' },
  { id: 'en-a2-010', word: 'delicious', translation: 'вкусный', language: 'en', level: 'A2', category: 'food', example: 'This pasta is really delicious.', exampleTranslation: 'Эта паста действительно вкусная.' },
  { id: 'en-a2-011', word: 'tired', translation: 'уставший', language: 'en', level: 'A2', category: 'emotions', example: 'I worked hard and feel tired.', exampleTranslation: 'Я усердно работал и чувствую себя уставшим.' },
  { id: 'en-a2-012', word: 'schedule', translation: 'расписание', language: 'en', level: 'A2', category: 'work', example: 'Let me check my schedule for tomorrow.', exampleTranslation: 'Позволь мне проверить моё расписание на завтра.' },

  // --- EN B1 ---
  { id: 'en-b1-001', word: 'experience', translation: 'опыт', language: 'en', level: 'B1', category: 'work', example: 'She has five years of experience in marketing.', exampleTranslation: 'У неё пять лет опыта в маркетинге.' },
  { id: 'en-b1-002', word: 'environment', translation: 'окружающая среда', language: 'en', level: 'B1', category: 'nature', example: 'We must protect the environment.', exampleTranslation: 'Мы должны защищать окружающую среду.' },
  { id: 'en-b1-003', word: 'shoulder', translation: 'плечо', language: 'en', level: 'B1', category: 'body', example: 'He put his hand on my shoulder.', exampleTranslation: 'Он положил руку мне на плечо.' },
  { id: 'en-b1-004', word: 'anxiety', translation: 'тревога / беспокойство', language: 'en', level: 'B1', category: 'emotions', example: 'She felt anxiety before the exam.', exampleTranslation: 'Она чувствовала тревогу перед экзаменом.' },
  { id: 'en-b1-005', word: 'departure', translation: 'отправление', language: 'en', level: 'B1', category: 'travel', example: 'The departure time is 10:30 AM.', exampleTranslation: 'Время отправления — 10:30.' },
  { id: 'en-b1-006', word: 'software', translation: 'программное обеспечение', language: 'en', level: 'B1', category: 'technology', example: 'We need to update the software.', exampleTranslation: 'Нам нужно обновить программное обеспечение.' },
  { id: 'en-b1-007', word: 'midnight', translation: 'полночь', language: 'en', level: 'B1', category: 'time', example: 'The movie ends at midnight.', exampleTranslation: 'Фильм заканчивается в полночь.' },
  { id: 'en-b1-008', word: 'confident', translation: 'уверенный в себе', language: 'en', level: 'B1', category: 'emotions', example: 'She is confident in her speaking skills.', exampleTranslation: 'Она уверена в своих разговорных навыках.' },
  { id: 'en-b1-009', word: 'decision', translation: 'решение', language: 'en', level: 'B1', category: 'basics', example: 'It was a difficult decision to make.', exampleTranslation: 'Это было трудное решение.' },
  { id: 'en-b1-010', word: 'opportunity', translation: 'возможность', language: 'en', level: 'B1', category: 'work', example: 'This job is a great opportunity for me.', exampleTranslation: 'Эта работа — отличная возможность для меня.' },

  // --- EN B2 ---
  { id: 'en-b2-001', word: 'revenue', translation: 'доход / выручка', language: 'en', level: 'B2', category: 'work', example: 'The company\'s revenue grew by 20%.', exampleTranslation: 'Выручка компании выросла на 20%.' },
  { id: 'en-b2-002', word: 'sustainability', translation: 'устойчивое развитие', language: 'en', level: 'B2', category: 'nature', example: 'Sustainability is a key goal for modern businesses.', exampleTranslation: 'Устойчивое развитие — ключевая цель современного бизнеса.' },
  { id: 'en-b2-003', word: 'frustration', translation: 'разочарование / досада', language: 'en', level: 'B2', category: 'emotions', example: 'He expressed his frustration with the project.', exampleTranslation: 'Он выразил своё разочарование проектом.' },
  { id: 'en-b2-004', word: 'ingredient', translation: 'ингредиент', language: 'en', level: 'B2', category: 'food', example: 'The main ingredient in this dish is rice.', exampleTranslation: 'Основной ингредиент этого блюда — рис.' },
  { id: 'en-b2-005', word: 'artificial intelligence', translation: 'искусственный интеллект', language: 'en', level: 'B2', category: 'technology', example: 'Artificial intelligence is changing the world.', exampleTranslation: 'Искусственный интеллект меняет мир.' },
  { id: 'en-b2-006', word: 'itinerary', translation: 'маршрут поездки', language: 'en', level: 'B2', category: 'travel', example: 'Let me check the itinerary for our trip.', exampleTranslation: 'Дай мне проверить маршрут нашей поездки.' },
  { id: 'en-b2-007', word: 'negotiate', translation: 'вести переговоры', language: 'en', level: 'B2', category: 'work', example: 'We need to negotiate the contract terms.', exampleTranslation: 'Нам нужно обсудить условия договора.' },
  { id: 'en-b2-008', word: 'versatile', translation: 'универсальный / разносторонний', language: 'en', level: 'B2', category: 'basics', example: 'Python is a very versatile programming language.', exampleTranslation: 'Python — очень универсальный язык программирования.' },

  // --- EN C1 ---
  { id: 'en-c1-001', word: 'ubiquitous', translation: 'вездесущий / повсеместный', language: 'en', level: 'C1', category: 'technology', example: 'Smartphones have become ubiquitous in modern life.', exampleTranslation: 'Смартфоны стали повсеместными в современной жизни.' },
  { id: 'en-c1-002', word: 'resilience', translation: 'стойкость / жизнестойкость', language: 'en', level: 'C1', category: 'emotions', example: 'Her resilience helped her overcome many challenges.', exampleTranslation: 'Её стойкость помогла ей преодолеть многие трудности.' },
  { id: 'en-c1-003', word: 'procurement', translation: 'закупка / снабжение', language: 'en', level: 'C1', category: 'work', example: 'The procurement department handles all purchases.', exampleTranslation: 'Отдел закупок занимается всеми покупками.' },
  { id: 'en-c1-004', word: 'biodiversity', translation: 'биоразнообразие', language: 'en', level: 'C1', category: 'nature', example: 'The rainforest is home to incredible biodiversity.', exampleTranslation: 'Тропический лес — место невероятного биоразнообразия.' },
  { id: 'en-c1-005', word: 'meticulous', translation: 'дотошный / тщательный', language: 'en', level: 'C1', category: 'work', example: 'He did a meticulous analysis of the code.', exampleTranslation: 'Он провёл тщательный анализ кода.' },
  { id: 'en-c1-006', word: 'ambiguous', translation: 'двусмысленный / неясный', language: 'en', level: 'C1', category: 'basics', example: 'The instructions were rather ambiguous.', exampleTranslation: 'Инструкции были довольно двусмысленными.' },

  // ========================================================
  // ==================== GERMAN (DE) =======================
  // ========================================================

  // --- DE A1 ---
  { id: 'de-a1-001', word: 'der Apfel', translation: 'яблоко', language: 'de', level: 'A1', category: 'food', example: 'Ich esse jeden Tag einen Apfel.', exampleTranslation: 'Я ем яблоко каждый день.' },
  { id: 'de-a1-002', word: 'die Katze', translation: 'кошка', language: 'de', level: 'A1', category: 'animals', example: 'Die Katze schläft auf dem Sofa.', exampleTranslation: 'Кошка спит на диване.' },
  { id: 'de-a1-003', word: 'das Haus', translation: 'дом', language: 'de', level: 'A1', category: 'home', example: 'Wir wohnen in einem großen Haus.', exampleTranslation: 'Мы живём в большом доме.' },
  { id: 'de-a1-004', word: 'das Wasser', translation: 'вода', language: 'de', level: 'A1', category: 'food', example: 'Kann ich bitte etwas Wasser haben?', exampleTranslation: 'Можно мне воды, пожалуйста?' },
  { id: 'de-a1-005', word: 'der Hund', translation: 'собака', language: 'de', level: 'A1', category: 'animals', example: 'Mein Hund spielt gern im Park.', exampleTranslation: 'Моя собака любит играть в парке.' },
  { id: 'de-a1-006', word: 'die Hand', translation: 'рука (кисть)', language: 'de', level: 'A1', category: 'body', example: 'Wasch deine Hände vor dem Essen.', exampleTranslation: 'Мой руки перед едой.' },
  { id: 'de-a1-007', word: 'der Morgen', translation: 'утро', language: 'de', level: 'A1', category: 'time', example: 'Guten Morgen! Wie geht es dir?', exampleTranslation: 'Доброе утро! Как дела?' },
  { id: 'de-a1-008', word: 'der Kaffee', translation: 'кофе', language: 'de', level: 'A1', category: 'food', example: 'Ich trinke morgens gerne Kaffee.', exampleTranslation: 'Утром я с удовольствием пью кофе.' },
  { id: 'de-a1-009', word: 'das Buch', translation: 'книга', language: 'de', level: 'A1', category: 'education', example: 'Das ist ein sehr spannendes Buch.', exampleTranslation: 'Это очень увлекательная книга.' },
  { id: 'de-a1-010', word: 'der Freund', translation: 'друг', language: 'de', level: 'A1', category: 'people', example: 'Er ist mein bester Freund.', exampleTranslation: 'Он мой лучший друг.' },
  { id: 'de-a1-011', word: 'die Familie', translation: 'семья', language: 'de', level: 'A1', category: 'people', example: 'Meine Familie wohnt in Berlin.', exampleTranslation: 'Моя семья живёт в Берлине.' },
  { id: 'de-a1-012', word: 'die Stadt', translation: 'город', language: 'de', level: 'A1', category: 'places', example: 'München ist eine schöne Stadt.', exampleTranslation: 'Мюнхен — красивый город.' },
  { id: 'de-a1-013', word: 'die Straße', translation: 'улица', language: 'de', level: 'A1', category: 'places', example: 'Wo ist die Goethe-Straße?', exampleTranslation: 'Где находится улица Гёте?' },
  { id: 'de-a1-014', word: 'das Geld', translation: 'деньги', language: 'de', level: 'A1', category: 'basics', example: 'Wie viel Geld kostet das?', exampleTranslation: 'Сколько денег это стоит?' },
  { id: 'de-a1-015', word: 'die Zeit', translation: 'время', language: 'de', level: 'A1', category: 'time', example: 'Ich habe heute leider keine Zeit.', exampleTranslation: 'К сожалению, у меня сегодня нет времени.' },

  // --- DE A2 ---
  { id: 'de-a2-001', word: 'die Fahrkarte', translation: 'проездной билет', language: 'de', level: 'A2', category: 'travel', example: 'Ich muss eine Fahrkarte kaufen.', exampleTranslation: 'Мне нужно купить билет.' },
  { id: 'de-a2-002', word: 'das Wetter', translation: 'погода', language: 'de', level: 'A2', category: 'nature', example: 'Das Wetter ist heute herrlich.', exampleTranslation: 'Погода сегодня великолепная.' },
  { id: 'de-a2-003', word: 'das Frühstück', translation: 'завтрак', language: 'de', level: 'A2', category: 'food', example: 'Zum Frühstück esse ich Müsli.', exampleTranslation: 'На завтрак я ем мюсли.' },
  { id: 'de-a2-004', word: 'die Küche', translation: 'кухня', language: 'de', level: 'A2', category: 'home', example: 'Sie kocht in der Küche.', exampleTranslation: 'Она готовит на кухне.' },
  { id: 'de-a2-005', word: 'glücklich', translation: 'счастливый', language: 'de', level: 'A2', category: 'emotions', example: 'Ich bin so glücklich, hier zu sein.', exampleTranslation: 'Я так счастлив быть здесь.' },
  { id: 'de-a2-006', word: 'der Rechner', translation: 'компьютер / калькулятор', language: 'de', level: 'A2', category: 'technology', example: 'Mein Rechner fährt nicht hoch.', exampleTranslation: 'Мой компьютер не запускается.' },
  { id: 'de-a2-007', word: 'das Büro', translation: 'офис / кабинет', language: 'de', level: 'A2', category: 'work', example: 'Unser Büro liegt im Stadtzentrum.', exampleTranslation: 'Наш офис находится в центре города.' },
  { id: 'de-a2-008', word: 'der Flughafen', translation: 'аэропорт', language: 'de', level: 'A2', category: 'travel', example: 'Wir fahren mit der S-Bahn zum Flughafen.', exampleTranslation: 'Мы едем в аэропорт на электричке.' },
  { id: 'de-a2-009', word: 'der Bahnhof', translation: 'вокзал', language: 'de', level: 'A2', category: 'travel', example: 'Der Zug kommt am Hauptbahnhof an.', exampleTranslation: 'Поезд прибывает на главный вокзал.' },
  { id: 'de-a2-010', word: 'lecker', translation: 'вкусный', language: 'de', level: 'A2', category: 'food', example: 'Das deutsche Brot ist sehr lecker.', exampleTranslation: 'Немецкий хлеб очень вкусный.' },
  { id: 'de-a2-011', word: 'müde', translation: 'уставший', language: 'de', level: 'A2', category: 'emotions', example: 'Nach der Reise war ich total müde.', exampleTranslation: 'После поездки я был совершенно уставшим.' },
  { id: 'de-a2-012', word: 'der Termin', translation: 'встреча / запись к врачу', language: 'de', level: 'A2', category: 'work', example: 'Ich habe morgen einen Termin beim Arzt.', exampleTranslation: 'Завтра у меня запись к врачу.' },

  // --- DE B1 ---
  { id: 'de-b1-001', word: 'die Erfahrung', translation: 'опыт', language: 'de', level: 'B1', category: 'work', example: 'Sie hat viel Erfahrung in diesem Beruf.', exampleTranslation: 'У неё большой опыт в этой профессии.' },
  { id: 'de-b1-002', word: 'die Umwelt', translation: 'окружающая среда', language: 'de', level: 'B1', category: 'nature', example: 'Wir müssen die Umwelt schützen.', exampleTranslation: 'Мы должны беречь окружающую среду.' },
  { id: 'de-b1-003', word: 'die Schulter', translation: 'плечо', language: 'de', level: 'B1', category: 'body', example: 'Er hat Schmerzen in der Schulter.', exampleTranslation: 'У него боли в плече.' },
  { id: 'de-b1-004', word: 'die Sorge', translation: 'беспокойство / забота', language: 'de', level: 'B1', category: 'emotions', example: 'Mach dir keine Sorgen!', exampleTranslation: 'Не беспокойся!' },
  { id: 'de-b1-005', word: 'die Abfahrt', translation: 'отправление', language: 'de', level: 'B1', category: 'travel', example: 'Die Abfahrt ist für 9 Uhr geplant.', exampleTranslation: 'Отправление запланировано на 9 часов.' },
  { id: 'de-b1-006', word: 'die Software', translation: 'программное обеспечение', language: 'de', level: 'B1', category: 'technology', example: 'Die Software wurde erfolgreich installiert.', exampleTranslation: 'Программа была успешно установлена.' },
  { id: 'de-b1-007', word: 'die Mitternacht', translation: 'полночь', language: 'de', level: 'B1', category: 'time', example: 'Kurz vor Mitternacht ging er schlafen.', exampleTranslation: 'Незадолго до полуночи он пошёл спать.' },
  { id: 'de-b1-008', word: 'die Entscheidung', translation: 'решение', language: 'de', level: 'B1', category: 'basics', example: 'Das war eine kluge Entscheidung.', exampleTranslation: 'Это было мудрое решение.' },
  { id: 'de-b1-009', word: 'die Gelegenheit', translation: 'удобный случай / возможность', language: 'de', level: 'B1', category: 'work', example: 'Das ist eine einmalige Gelegenheit.', exampleTranslation: 'Это уникальная возможность.' },

  // --- DE B2 ---
  { id: 'de-b2-001', word: 'der Umsatz', translation: 'товарооборот / выручка', language: 'de', level: 'B2', category: 'work', example: 'Der Umsatz des Unternehmens ist gestiegen.', exampleTranslation: 'Выручка предприятия выросла.' },
  { id: 'de-b2-002', word: 'die Nachhaltigkeit', translation: 'экологичность / устойчивость', language: 'de', level: 'B2', category: 'nature', example: 'Nachhaltigkeit gewinnt an Bedeutung.', exampleTranslation: 'Устойчивое развитие набирает значение.' },
  { id: 'de-b2-003', word: 'die Enttäuschung', translation: 'разочарование', language: 'de', level: 'B2', category: 'emotions', example: 'Das Ergebnis war eine große Enttäuschung.', exampleTranslation: 'Результат стал большим разочарованием.' },
  { id: 'de-b2-004', word: 'die Zutat', translation: 'ингредиент', language: 'de', level: 'B2', category: 'food', example: 'Frische Zutaten sind das Wichtigste.', exampleTranslation: 'Свежие ингредиенты — самое главное.' },
  { id: 'de-b2-005', word: 'die künstliche Intelligenz', translation: 'искусственный интеллект', language: 'de', level: 'B2', category: 'technology', example: 'Künstliche Intelligenz revolutioniert den Markt.', exampleTranslation: 'Искусственный интеллект революционизирует рынок.' },
  { id: 'de-b2-006', word: 'der Reiseplan', translation: 'план поездки / маршрут', language: 'de', level: 'B2', category: 'travel', example: 'Unser Reiseplan steht bereits fest.', exampleTranslation: 'Наш план поездки уже утверждён.' },
  { id: 'de-b2-007', word: 'verhandeln', translation: 'вести переговоры / договариваться', language: 'de', level: 'B2', category: 'work', example: 'Wir müssen über den Preis verhandeln.', exampleTranslation: 'Мы должны договориться о цене.' },

  // --- DE C1 ---
  { id: 'de-c1-001', word: 'allgegenwärtig', translation: 'вездесущий / повсеместный', language: 'de', level: 'C1', category: 'technology', example: 'Digitale Medien sind heute allgegenwärtig.', exampleTranslation: 'Цифровые медиа сегодня вездесущи.' },
  { id: 'de-c1-002', word: 'die Widerstandskraft', translation: 'стойкость / сопротивляемость', language: 'de', level: 'C1', category: 'emotions', example: 'Seine mentale Widerstandskraft ist bemerkenswert.', exampleTranslation: 'Его душевная стойкость примечательна.' },
  { id: 'de-c1-003', word: 'die Beschaffung', translation: 'закупка / снабжение', language: 'de', level: 'C1', category: 'work', example: 'Die Beschaffung von Rohstoffen gestaltet sich schwierig.', exampleTranslation: 'Закупка сырья оказывается сложной.' },
  { id: 'de-c1-004', word: 'die Artenvielfalt', translation: 'видовое разнообразие', language: 'de', level: 'C1', category: 'nature', example: 'Der Schutz der Artenvielfalt ist essenziell.', exampleTranslation: 'Защита биологического разнообразия имеет ключевое значение.' },
  { id: 'de-c1-005', word: 'sorgfältig', translation: 'тщательный / аккуратный', language: 'de', level: 'C1', category: 'work', example: 'Sie arbeitet stets äußerst sorgfältig.', exampleTranslation: 'Она всегда работает исключительно тщательно.' },

  // ========================================================
  // ==================== FRENCH (FR) =======================
  // ========================================================
  { id: 'fr-a1-001', word: 'bonjour', translation: 'здравствуйте / добрый день', language: 'fr', level: 'A1', category: 'basics', example: 'Bonjour! Comment allez-vous?', exampleTranslation: 'Здравствуйте! Как ваши дела?' },
  { id: 'fr-a1-002', word: 'merci', translation: 'спасибо', language: 'fr', level: 'A1', category: 'basics', example: 'Merci beaucoup pour votre aide.', exampleTranslation: 'Большое спасибо за вашу помощь.' },
  { id: 'fr-a1-003', word: 'le café', translation: 'кофе / кафе', language: 'fr', level: 'A1', category: 'food', example: 'Un café noir s\'il vous plaît.', exampleTranslation: 'Один чёрный кофе, пожалуйста.' },
  { id: 'fr-a1-004', word: 'la maison', translation: 'дом', language: 'fr', level: 'A1', category: 'home', example: 'Bienvenue dans ma maison!', exampleTranslation: 'Добро пожаловать в мой дом!' },
  { id: 'fr-a1-005', word: 'l\'ami', translation: 'друг', language: 'fr', level: 'A1', category: 'people', example: 'C\'est mon meilleur ami.', exampleTranslation: 'Это мой лучший друг.' },
  { id: 'fr-a1-006', word: 'la ville', translation: 'город', language: 'fr', level: 'A1', category: 'places', example: 'Paris est une belle ville.', exampleTranslation: 'Париж — красивый город.' },
  { id: 'fr-a2-001', word: 'le voyage', translation: 'путешествие', language: 'fr', level: 'A2', category: 'travel', example: 'Bon voyage en France!', exampleTranslation: 'Счастливого путешествия во Францию!' },
  { id: 'fr-a2-002', word: 'délicieux', translation: 'вкусный / восхитительный', language: 'fr', level: 'A2', category: 'food', example: 'Ce croissant est absolument délicieux.', exampleTranslation: 'Этот круассан невероятно вкусный.' },
  { id: 'fr-b1-001', word: 'l\'opportunité', translation: 'возможность', language: 'fr', level: 'B1', category: 'work', example: 'C\'est une opportunité magnifique.', exampleTranslation: 'Это великолепная возможность.' },

  // ========================================================
  // ==================== SPANISH (ES) ======================
  // ========================================================
  { id: 'es-a1-001', word: 'hola', translation: 'привет / здравствуйте', language: 'es', level: 'A1', category: 'basics', example: '¡Hola! ¿Cómo estás hoy?', exampleTranslation: 'Привет! Как ты сегодня?' },
  { id: 'es-a1-002', word: 'gracias', translation: 'спасибо', language: 'es', level: 'A1', category: 'basics', example: 'Muchas gracias por todo.', exampleTranslation: 'Большое спасибо за всё.' },
  { id: 'es-a1-003', word: 'el café', translation: 'кофе', language: 'es', level: 'A1', category: 'food', example: 'Un café con leche, por favor.', exampleTranslation: 'Один кофе с молоком, пожалуйста.' },
  { id: 'es-a1-004', word: 'la casa', translation: 'дом', language: 'es', level: 'A1', category: 'home', example: 'Mi casa es tu casa.', exampleTranslation: 'Мой дом — твой дом.' },
  { id: 'es-a1-005', word: 'el amigo', translation: 'друг', language: 'es', level: 'A1', category: 'people', example: 'Carlos es mi mejor amigo.', exampleTranslation: 'Карлос — мой лучший друг.' },
  { id: 'es-a1-006', word: 'la ciudad', translation: 'город', language: 'es', level: 'A1', category: 'places', example: 'Madrid es una ciudad hermosa.', exampleTranslation: 'Мадрид — прекрасный город.' },
  { id: 'es-a2-001', word: 'el viaje', translation: 'путешествие', language: 'es', level: 'A2', category: 'travel', example: '¡Buen viaje a España!', exampleTranslation: 'Счастливого путешествия в Испанию!' },
  { id: 'es-a2-002', word: 'delicioso', translation: 'вкусный', language: 'es', level: 'A2', category: 'food', example: 'La paella estuvo deliciosa.', exampleTranslation: 'Паэлья была вкусной.' },
  { id: 'es-b1-001', word: 'la oportunidad', translation: 'возможность / шанс', language: 'es', level: 'B1', category: 'work', example: 'Aprovecha esta gran oportunidad.', exampleTranslation: 'Воспользуйся этой отличной возможностью.' }
];

export default words;
