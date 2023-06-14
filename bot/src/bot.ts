import * as TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

dotenv.config();

//token
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('BOT_TOKEN not found in environment variables');
  process.exit(1);
}

//bot instance
const bot = new TelegramBot(token, { polling: true });

//message processing
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привіт, вітаю вас!');
});

bot.onText(/\/newWord (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (match && match[1]) {
    const word = match[1];

    try {
      const parsingResponse = await fetch('http://localhost:3000/parsing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      });

      const wordOptions = await parsingResponse.json();

      const options = {
        reply_markup: {
          keyboard: [],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      };

      const selectedWord = {};
      if (Object.keys(wordOptions).length > 1) {
        const arrMessage = [];
        const arrTranslation = [];
        for (const key of Object.keys(wordOptions)) {
          const wordOption = wordOptions[key];
          const buttonText = wordOption.translation; //button name

          options.reply_markup.keyboard.push([{ text: buttonText }]);

          const message = formatMessage(wordOption);
          arrMessage.push(message);
          arrTranslation.push(wordOption.translation);
        }

        await bot.sendMessage(chatId, 'Виберіть один з варіантів:', options);
        for (const message of arrMessage) {
          await bot.sendMessage(chatId, message);
        }

        let isTranslationSelected = false;

        const selectedTranslationPromise = new Promise((resolve) => {
          bot.onText(
            new RegExp(arrTranslation.join('|')),
            async (msg, match) => {
              if (!isTranslationSelected) {
                //flag check
                const selectedTranslation = match[0]; //get the text of the pressed button
                const selectedIndex =
                  arrTranslation.indexOf(selectedTranslation); //get the index of the selected button

                if (selectedIndex !== -1) {
                  const selectedOption =
                    wordOptions[Object.keys(wordOptions)[selectedIndex]];

                  bot.sendMessage(
                    chatId,
                    `Ви вибрали переклад: ${match[0]}`,
                    { reply_markup: { remove_keyboard: true } }, //close keyboard
                  );

                  isTranslationSelected = true;
                  resolve(selectedOption); //resolve the promise with the selected option
                }
              }
            },
          );
        });

        const selectedOption = await selectedTranslationPromise; //wait for the promise to be resolved
        Object.assign(selectedWord, selectedOption);
      } else if (Object.keys(wordOptions).length === 1) {
        const wordOption = wordOptions[Object.keys(wordOptions)[0]];
        Object.assign(selectedWord, wordOption);

        const message = formatMessage(wordOption);
        await bot.sendMessage(chatId, message);
      } else {
        throw new Error();
      }

      const wordResponse = await fetch('http://localhost:3000/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, wordOption: selectedWord }),
      });

      const wordId = await wordResponse.json();

      await bot.sendMessage(
        chatId,
        `Айді цього слова у базі данних слів: ${Object.values(wordId)}`,
      );

      const userWordsResponse = await fetch('http://localhost:3000/user-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: chatId, wordId: Number(Object.values(wordId)) }),
      });

      const userWordId = await userWordsResponse.json();

      await bot.sendMessage(
        chatId,
        `Айді цього слова у базі данних слів юзерів: ${Object.values(userWordId)}`,
      );
      
    } catch (error) {
      console.error(error);
      await bot.sendMessage(
        chatId,
        'Помилка при обробці запиту або слово не існує.',
      );
    }
  } else {
    bot.sendMessage(
      chatId,
      'Некоректний формат команди. Введіть команду у форматі /newWord <слово>.',
    );
  }
});

function formatMessage(wordOption: any): string {
  return `
Translation: ${wordOption.translation}
Definition: ${wordOption.definition}
Example: ${wordOption.example}
Pronunciation: ${wordOption.pronunciation}
Parts of Speech: ${wordOption.partsOfSpeech}`.trim();
}

//bot start
console.log('The bot is running!');
