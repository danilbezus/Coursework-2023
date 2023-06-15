# Coursework-2023

Проект є комбінацією двох окремих компонентів: бота і сервера, реалізованих за допомогою Node.js та фреймворку Nest.js. Бот виконує деякі команди, такі як "start", "newword" і "mywords", "getwordbyid", "getwordbyid", які взаємодіють з сервером для обробки запитів і збереження даних.

## Приклад бота
[EnglishCourse](https://t.me/englishCourseByBebot)

## Встанолення
Перед початком роботи необхідно встановити залежності для обох компонентів: бота і сервера. Для цього слід виконати наступні команди в відповідних папках:

#### У папці bot:


```bash
npm install
```
#### У папці server:

```bash
npm install
```

## Запуск бота
Для запуску бота виконайте наступні команди у папці **bot**:

```bash
tsc .\src\bot.ts
node .\src\bot.js
```

## Запуск сервера
Для запуску сервера виконайте наступну команду у папці **server**:

```bash
npm run start:dev
```

## Команди бота
#### Команда start
Команда start використовується для привітання з користувачем. Він може бути викликаний, наприклад, після запуску бота або при першій взаємодії користувача з ботом.

#### Команда newword
Команда newword використовується для додавання нового слова. Формат команди: /newword <слово>. При отриманні цієї команди, бот передає слово в сервіс парсингу, який повертає об'єкт з варіантами перекладу. Бот пропонує користувачеві вибрати один з варіантів перекладу, використовуючи кнопки в чаті. Коли користувач вибирає варіант, бот відправляє цей варіант в сервіс words, який зберігає слово з вибраним перекладом у таблицю слів. Бот також записує айді цього слова та айді користувача в таблицю userWords. Після успішного збереження, бот повідомляє користувача про айді слова у таблиці.

#### Команда mywords
Команда mywords використовується для отримання списку слів, доданих користувачем. При отриманні цієї команди, бот звертається до сервісу userWords, передаючи айді користувача. Сервіс userWords повертає масив елементів з айді користувача та айді його слів. Бот айді слів до сервісу words. Сервіс words повертає масив об'єктів із словами, їх айді, перекладом, визначенням, прикладом, промовою та частиною мови. Бот відправляє ці дані користувачу.

#### Команда getwordbyid
Команда getwordbyid використовується для отримання слова з бази даних по його айді. При отриманні цієї команди, бот звертається до сервісу words, передаючи айді слова. Сервіс words повертає об'єкт з описом слова. Бот відправляє ці дані користувачу.

#### Команда getwordbyid
Команда getword використовується для отримання слова з бази даних. При отриманні цієї команди, бот звертається до сервісу words. Сервіс words повертає масив знайдених об'єктів з описом слова. Бот відправляє ці дані користувачу.
