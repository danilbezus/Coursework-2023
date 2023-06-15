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

bot.onText(/\/newword (.+)/, async (msg, match) => {
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

      const selectedWord = {};
      if (Object.keys(wordOptions).length > 1) {
        await handleKeySelection(
          wordOptions,
          'translation',
          selectedWord,
          chatId,
        );
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

      const userWordsResponse = await fetch(
        'http://localhost:3000/user-words',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: chatId,
            wordId: Number(Object.values(wordId)),
          }),
        },
      );

      const userWordsId = await userWordsResponse.json();

      await bot.sendMessage(
        chatId,
        `Айді цього слова у базі данних слів юзерів: ${Object.values(
          userWordsId,
        )}`,
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
      'Некоректний формат команди. Введіть команду у форматі /newWord <word>.',
    );
  }
});

bot.onText(/\/mywords/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const userWordsResponse = await fetch(
      `http://localhost:3000/user-words/?userId=${chatId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const userWords = await userWordsResponse.json();
    const wordIds = userWords.map(
      (userWord: { wordId: number }) => userWord.wordId,
    );

    const words = [];
    for (const id of wordIds) {
      const word = await fetch(`http://localhost:3000/words/?id=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      words.push(await word.json());
    }
    await bot.sendMessage(chatId, 'Ваші слова:');
    for (const word of words) {
      const message = formatMessage(word);
      await bot.sendMessage(chatId, message);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(
      chatId,
      'Помилка при обробці запиту або у вас ще немає слів.',
    );
  }
});

bot.onText(/\/getwordbyid (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (match && match[1]) {
    const id = match[1];

    try {
      const word = await fetch(`http://localhost:3000/words/?id=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const message = formatMessage(await word.json());
      await bot.sendMessage(chatId, 'Обране слово:');
      await bot.sendMessage(chatId, message);
    } catch (error) {
      console.error(error);
      await bot.sendMessage(
        chatId,
        'Помилка при обробці запиту або слово не знайдено.',
      );
    }
  } else {
    bot.sendMessage(
      chatId,
      'Некоректний формат команди. Введіть команду у форматі /getword <id>.',
    );
  }
});

bot.onText(/\/getword (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (match && match[1]) {
    const name = match[1];

    try {
      const wordResponse = await fetch(
        `http://localhost:3000/words/?word=${name}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const arrWords = await wordResponse.json();
      if (arrWords.length > 1) {
        await bot.sendMessage(
          chatId,
          'Обране слово має декілька перекладів в базі даних:',
        );
        for (const word of arrWords) {
          const message = formatMessage(word);
          await bot.sendMessage(chatId, message);
        }
      } else if (arrWords.length == 1) {
        await bot.sendMessage(chatId, 'Обране слово:');
        const message = formatMessage(arrWords[0]);
        await bot.sendMessage(chatId, message);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      await bot.sendMessage(
        chatId,
        'Помилка при обробці запиту або слово не знайдене.',
      );
    }
  } else {
    bot.sendMessage(
      chatId,
      'Некоректний формат команди. Введіть команду у форматі /getword <word>.',
    );
  }
});

bot.onText(/\/deleteword (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (match && match[1]) {
    const key = match[1];

    try {
      let keyType = '';
      if (!isNaN(Number(key))) {
        keyType = `id`;
      } else {
        keyType = `word`;
      }
      const wordResponse = await fetch(
        `http://localhost:3000/words/?${keyType}=${key}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const result = await wordResponse.json();
      if (result) await bot.sendMessage(chatId, 'Слово видалено');
      else await bot.sendMessage(chatId, 'Слово не знайдено');
    } catch (error) {
      console.error(error);
      await bot.sendMessage(chatId, 'Помилка при обробці запиту.');
    }
  } else {
    bot.sendMessage(
      chatId,
      'Некоректний формат команди. Введіть команду у форматі /deleteword <id або word>.',
    );
  }
});

bot.onText(/\/deletemywordbyid (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (match && match[1]) {
    const wordId = match[1];

    try {
      const wordResponse = await fetch(
        `http://localhost:3000/user-words/?userId=${chatId}&wordId=${wordId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const result = await wordResponse.json();
      if (result) await bot.sendMessage(chatId, 'Слово видалено');
      else await bot.sendMessage(chatId, 'Слово не знайдено');
    } catch (error) {
      console.error(error);
      await bot.sendMessage(chatId, 'Помилка при обробці запиту.');
    }
  } else {
    bot.sendMessage(
      chatId,
      'Некоректний формат команди. Введіть команду у форматі /deleteword <id або word>.',
    );
  }
});

function formatMessage(word: any): string {
  let message = '';
  if (word.hasOwnProperty('word')) {
    message += `
Id: ${word.id}
Word: ${word.word}`;
  }
  message += `
Translation: ${word.translation}
Definition: ${word.definition}
Example: ${word.example}
Pronunciation: ${word.pronunciation}
Parts of Speech: ${word.partsOfSpeech}`;
  return message.trim();
}

async function handleKeySelection(
  wordOptions: { string: string },
  selectedKey: string,
  selectedWord: {},
  chatId: TelegramBot.ChatId,
  duplicate?: string,
) {
  const options = {
    reply_markup: {
      keyboard: [],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  const arrMessage = [];
  const arrKey = [];
  for (const key of Object.keys(wordOptions)) {
    const wordOption = wordOptions[key];
    if (selectedKey === 'definition') {
      if (duplicate !== wordOption.translation) continue;
    }
    const buttonText = wordOption[selectedKey]; //button name

    options.reply_markup.keyboard.push([{ text: buttonText }]);

    const message = formatMessage(wordOption);
    arrMessage.push(message);
    arrKey.push(wordOption[selectedKey]);
  }

  if (selectedKey === 'definition') {
    await bot.sendMessage(
      chatId,
      'Схоже, що слово має декілька однакових перекладів з різними визначеннями',
    );
  }
  await bot.sendMessage(chatId, 'Виберіть один з варіантів:', options);
  for (const message of arrMessage) {
    await bot.sendMessage(chatId, message);
  }

  let isTranslationSelected = false;
  const selectedTranslationPromise = new Promise((resolve) => {
    bot.onText(new RegExp(arrKey.join('|')), async (msg, match) => {
      if (!isTranslationSelected) {
        //flag check
        const selectedKeyValue = match[0]; //get the text of the pressed button
        const selectedIndex = arrKey.indexOf(selectedKeyValue); //get the index of the selected button

        if (selectedIndex !== -1) {
          const selectedOption = Object.values(wordOptions)[selectedIndex];

          if (selectedKey === 'translation') {
            const duplicateTranslations = arrKey.filter(
              (translation) => translation === selectedKeyValue,
            );

            if (duplicateTranslations.length > 1) {
              isTranslationSelected = true; //prevent the handler function from being called again
              const result = await handleKeySelection(
                wordOptions,
                'definition',
                selectedWord,
                chatId,
                selectedKeyValue,
              );
              resolve(result);
              return;
            }
            bot.sendMessage(
              msg.chat.id,
              `Ви вибрали переклад: ${selectedKeyValue}`,
              { reply_markup: { remove_keyboard: true } }, //close keyboard
            );
          } else {
            bot.sendMessage(
              msg.chat.id,
              `Ви вибрали визначення: ${selectedKeyValue}`,
              { reply_markup: { remove_keyboard: true } }, //close keyboard
            );
          }
          isTranslationSelected = true;
          resolve(selectedOption); //resolve the promise with the selected option
        }
      }
    });
  });
  const selectedOption = await selectedTranslationPromise; //wait for the promise to be resolved
  Object.assign(selectedWord, selectedOption);
}

//bot start
console.log('The bot is running!');
