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

//bot start
console.log('The bot is running!');
