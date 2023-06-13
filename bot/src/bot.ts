import * as TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";

dotenv.config();

//token
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("BOT_TOKEN not found in environment variables");
  process.exit(1);
}

//bot instance
const bot = new TelegramBot(token, { polling: true });

//message processing
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Привіт, вітаю вас!");
});

bot.onText(/\/parse (.+)/, async (msg, match) => {
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

      if (Object.keys(result).length === 0) {
        throw new Error('Об\'єкт порожній');
      }

      await bot.sendMessage(chatId, 'Виберіть один з варіантів:');

      for (const key of Object.keys(result)) {
        const wordOption = result[key];
        const message = formatMessage(wordOption);
        await bot.sendMessage(chatId, message);
      }
    } catch (error) {
      console.error(error);
      await bot.sendMessage(chatId, 'Помилка при обробці запиту або слово не існує.');
    }
  } else {
    bot.sendMessage(chatId, 'Некоректний формат команди. Введіть команду у форматі /parse <слово>.');
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
console.log("The bot is running!");
