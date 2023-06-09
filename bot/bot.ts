import * as TelegramBot from 'node-telegram-bot-api';

//token
const token = 'Token';

//bot instance
const bot = new TelegramBot(token, { polling: true });

//message processing
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привіт, вітаю вас!');
});

bot.onText(/привіт/i, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привіт, я простий бот Telegram!');
});

//bot start
console.log('The bot is running!');
