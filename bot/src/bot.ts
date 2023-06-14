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
      const response = await fetch('http://localhost:3000/parsing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      });

      const result = await response.json();

      const options = {
        reply_markup: {
          keyboard: [],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      };

      if (Object.keys(result).length > 1) {
        const arrMessage = [];
        const arrTranslation = [];
        for (const key of Object.keys(result)) {
          const wordOption = result[key];
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

        bot.onText(new RegExp(arrTranslation.join('|')), async (msg, match) => {
          const selectedTranslation = match[0]; //get the text of the pressed button
          const selectedIndex = arrTranslation.indexOf(selectedTranslation); //get the index of the selected button

          if (selectedIndex !== -1) {
            const selectedOption = result[Object.keys(result)[selectedIndex]];
            bot.sendMessage(
              chatId,
              `Ви вибрали переклад: ${match[0]}`,
              { reply_markup: { remove_keyboard: true } }, //close keyboard
            );
            console.log(selectedOption);
          }
        });
      } else if (Object.keys(result).length === 1) {
        const wordOption = result[Object.keys(result)[0]];

        const message = formatMessage(wordOption);
        await bot.sendMessage(chatId, message);
      } else {
        throw new Error();
      }
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
