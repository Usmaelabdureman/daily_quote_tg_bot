import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';
import dotenv from 'dotenv';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN is required in .env file');
  process.exit(1);
}

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

// Store subscribed channels/groups
let subscribers = new Set();

// Load quotes
async function loadQuotes() {
  try {
    const data = await fs.readFile(new URL('./quotes.json', import.meta.url), 'utf8');
    return JSON.parse(data).quotes;
  } catch (error) {
    console.error('Error loading quotes:', error);
    return [];
  }
}

// Get random quote
function getRandomQuote(quotes) {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Format quote message
function formatQuote(quote) {
  return `💭 *Quote of the Day*\n\n"${quote.text}"\n\n— _${quote.author}_`;
}

// Schedule daily quotes (every minute for testing)
const quotes = await loadQuotes();
new CronJob('0 9,21 * * *', async () => {
  const quote = getRandomQuote(quotes);
  for (const chatId of subscribers) {
    try {
      await bot.sendMessage(chatId, formatQuote(quote), { parse_mode: 'Markdown' });
    } catch (error) {
      console.error(`Error sending quote to ${chatId}:`, error);
      subscribers.delete(chatId); // Remove invalid chat IDs
    }
  }
}, null, true);

// Command handlers
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const chatName = msg.chat.title || msg.chat.username || "there";
  const keyboard = {
    inline_keyboard: [
      [{ text: '📝 Subscribe to Daily Quotes', callback_data: 'subscribe' }],
      [{ text: '🎲 Get Random Quote', callback_data: 'random' }],
      [{ text: '❌ Unsubscribe', callback_data: 'unsubscribe' }]
    ]
  };

  await bot.sendMessage(
    chatId,
    `Hi ${chatName} 👋 Welcome to the Daily Motivational Quote Bot!\n\nI can help your team stay motivated with daily inspirational quotes.`,
    { reply_markup: keyboard }
  );
});

// Handle button clicks
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;

  switch (query.data) {
    case 'subscribe':
      subscribers.add(chatId);
      await bot.answerCallbackQuery(query.id, { text: '✅ Subscribed to daily quotes!' });
      await bot.sendMessage(chatId, 'You will receive a motivational quote every minute (for testing).');
      break;

    case 'unsubscribe':
      subscribers.delete(chatId);
      await bot.answerCallbackQuery(query.id, { text: '❌ Unsubscribed from daily quotes.' });
      await bot.sendMessage(chatId, 'You have been unsubscribed from daily quotes.');
      break;

    case 'random':
      const quote = getRandomQuote(quotes);
      await bot.answerCallbackQuery(query.id);
      await bot.sendMessage(chatId, formatQuote(quote), { parse_mode: 'Markdown' });
      break;
  }
});

// Help command
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  const helpText = `\n*Available Commands:*\n/start - Start the bot and show main menu\n/help - Show this help message\n/quote - Get a random quote\n\nYou can also use the buttons in the main menu to:\n• Subscribe to daily quotes\n• Get a random quote\n• Unsubscribe from daily quotes\n\nDaily quotes are sent automatically every minute (for testing).`;
  await bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

// Random quote command
bot.onText(/\/quote/, async (msg) => {
  const chatId = msg.chat.id;
  const quote = getRandomQuote(quotes);
  await bot.sendMessage(chatId, formatQuote(quote), { parse_mode: 'Markdown' });
});

console.log('Bot is running...');
