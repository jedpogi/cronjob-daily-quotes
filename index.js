require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const cron = require('node-cron');

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const quotesEndpoint = 'https://type.fit/api/quotes';

const sendTelegramBot = async () => {
    try {
        const fetchQuotes = await fetch(quotesEndpoint);
        const jsonQuotes = await fetchQuotes.json();

        cron.schedule('* * * * *', async function () {
            const randomNumber = Math.floor(Math.random() * jsonQuotes.length);
            const pickedQuote = jsonQuotes[randomNumber];
            const textToBeSent = `${pickedQuote.text} - ${
                pickedQuote.author || 'Random dude'
            }`;

            const bot = new TelegramBot(token);

            await bot.sendMessage(chatId, textToBeSent);
            console.log('Telegram Message Sent!');
        });

    } catch (e) {
        console.log(e);
    }
};

sendTelegramBot();