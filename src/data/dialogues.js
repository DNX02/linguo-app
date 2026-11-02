// Interactive conversation dialogue trees for English and German

export const dialogues = [
  {
    id: 'cafe-en',
    title: '☕ В кофейне (At a Coffee Shop)',
    lang: 'en',
    level: 'A1-A2',
    steps: [
      {
        partner: 'Good morning! Welcome to Central Café. What can I get started for you today?',
        partnerTr: 'Доброе утро! Добро пожаловать в Central Café. Что я могу вам предложить сегодня?',
        options: [
          { text: 'Hi! Can I please have a cappuccino and a croissant?', textTr: 'Привет! Можно мне, пожалуйста, капучино и круассан?', next: 1 },
          { text: 'Good morning. Just a black coffee to go, please.', textTr: 'Доброе утро. Только чёрный кофе с собой, пожалуйста.', next: 1 },
        ],
      },
      {
        partner: 'Sure thing! What size would you like for your coffee? Small, medium, or large?',
        partnerTr: 'Конечно! Какой размер кофе вы бы хотели? Маленький, средний или большой?',
        options: [
          { text: 'A medium, please. With oat milk if you have it.', textTr: 'Средний, пожалуйста. С овсяным молоком, если есть.', next: 2 },
          { text: 'Large, please. I really need to wake up today!', textTr: 'Большой, пожалуйста. Мне очень нужно проснуться сегодня!', next: 2 },
        ],
      },
      {
        partner: 'Awesome! That will be $5.50. Will you be paying with cash or card?',
        partnerTr: 'Отлично! С вас 5 долларов 50 центов. Будете платить наличными или картой?',
        options: [
          { text: 'I will pay by card, please. Here is my phone.', textTr: 'Я оплачу картой, пожалуйста. Вот мой телефон.', next: 'end' },
          { text: 'Here is cash, keep the change!', textTr: 'Вот наличные, сдачи не надо!', next: 'end' },
        ],
      },
    ],
  },
  {
    id: 'cafe-de',
    title: '☕ Im Café (В кофейне)',
    lang: 'de',
    level: 'A1-A2',
    steps: [
      {
        partner: 'Guten Tag! Was darf es für Sie sein?',
        partnerTr: 'Добрый день! Что для вас?',
        options: [
          { text: 'Guten Tag! Ich hätte gerne einen Cappuccino.', textTr: 'Добрый день! Я бы хотел капучино.', next: 1 },
          { text: 'Hallo! Einen großen Kaffee mit Milch, bitte.', textTr: 'Здравствуйте! Большой кофе с молоком, пожалуйста.', next: 1 },
        ],
      },
      {
        partner: 'Sehr gerne. Möchten Sie auch ein Stück Kuchen dazu?',
        partnerTr: 'С удовольствием. Желаете также кусочек пирога к нему?',
        options: [
          { text: 'Ja gern, der Apfelkuchen sieht sehr lecker aus.', textTr: 'Да, с удовольствием, яблочный пирог выглядит очень вкусно.', next: 2 },
          { text: 'Nein danke, nur der Kaffee reicht mir.', textTr: 'Нет, спасибо, только кофе мне достаточно.', next: 2 },
        ],
      },
      {
        partner: 'Alles klar. Das macht dann zusammen 4 Euro 80.',
        partnerTr: 'Всё понятно. С вас вместе 4 евро 80 центов.',
        options: [
          { text: 'Kann ich mit Karte bezahlen?', textTr: 'Могу я оплатить картой?', next: 'end' },
          { text: 'Hier sind fünf Euro. Stimmt so!', textTr: 'Вот пять евро. Сдачи не надо!', next: 'end' },
        ],
      },
    ],
  },
  {
    id: 'airport-en',
    title: '✈️ В аэропорту (At the Airport)',
    lang: 'en',
    level: 'A2-B1',
    steps: [
      {
        partner: 'Hello, passport and ticket, please. Where are you flying today?',
        partnerTr: 'Здравствуйте, паспорт и билет, пожалуйста. Куда вы сегодня летите?',
        options: [
          { text: 'Hello! Here you go. I am flying to Berlin.', textTr: 'Здравствуйте! Вот, пожалуйста. Я лечу в Берлин.', next: 1 },
          { text: 'Hi! Here is my passport. I have a connecting flight via London.', textTr: 'Привет! Вот мой паспорт. У меня пересадка через Лондон.', next: 1 },
        ],
      },
      {
        partner: 'Great. Do you have any check-in luggage, or just hand baggage?',
        partnerTr: 'Отлично. У вас есть регистрируемый багаж или только ручная кладь?',
        options: [
          { text: 'Just one suitcase to check in, and this backpack.', textTr: 'Только один чемодан сдать и этот рюкзак.', next: 2 },
          { text: 'Only hand luggage today.', textTr: 'Сегодня только ручная кладь.', next: 2 },
        ],
      },
      {
        partner: 'Perfect. Your flight departs from Gate B12 at 14:30. Have a nice flight!',
        partnerTr: 'Прекрасно. Ваш рейс вылетает от выхода B12 в 14:30. Приятного полёта!',
        options: [
          { text: 'Thank you very much! Have a great day!', textTr: 'Большое спасибо! Хорошего дня!', next: 'end' },
        ],
      },
    ],
  },
  {
    id: 'hotel-de',
    title: '🏨 Im Hotel (В отеле)',
    lang: 'de',
    level: 'A2-B1',
    steps: [
      {
        partner: 'Guten Abend! Herzlich willkommen im Hotel Stadtmitte. Haben Sie eine Reservierung?',
        partnerTr: 'Добрый вечер! Добро пожаловать в отель Stadtmitte. У вас есть бронирование?',
        options: [
          { text: 'Guten Abend! Ja, auf den Namen Schmidt.', textTr: 'Добрый вечер! Да, на фамилию Шмидт.', next: 1 },
          { text: 'Hallo! Ja, ich habe ein Doppelzimmer für drei Nächte gebucht.', textTr: 'Здравствуйте! Да, я забронировал двухместный номер на три ночи.', next: 1 },
        ],
      },
      {
        partner: 'Ja, genau. Hier ist Ihre Zimmerkarte für Zimmer 304 im dritten Stock.',
        partnerTr: 'Да, точно. Вот ваша карточка от номера 304 на третьем этаже.',
        options: [
          { text: 'Vielen Dank! Um wie viel Uhr gibt es Frühstück?', textTr: 'Большое спасибо! В котором часу завтрак?', next: 2 },
          { text: 'Danke! Gibt es hier kostenloses WLAN?', textTr: 'Спасибо! Здесь есть бесплатный Wi-Fi?', next: 2 },
        ],
      },
      {
        partner: 'Das Frühstück ist ab 7 Uhr morgens und das WLAN-Passwort steht auf der Karte. Schönen Aufenthalt!',
        partnerTr: 'Завтрак с 7 часов утра, а пароль от Wi-Fi указан на карточке. Приятного пребывания!',
        options: [
          { text: 'Wunderbar, vielen herzlichen Dank!', textTr: 'Замечательно, сердечное спасибо!', next: 'end' },
        ],
      },
    ],
  },
];
