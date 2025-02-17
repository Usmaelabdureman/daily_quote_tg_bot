# My Team Energy Booster Bot

My Team Energy Booster Bot is a Telegram bot that sends daily motivational quotes to subscribed users. The bot can also provide random quotes on demand.

## Features

- Send daily motivational quotes at 9:00 AM and 9:00 PM.
- Subscribe to daily quotes.
- Unsubscribe from daily quotes.
- Get a random quote on demand.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/my-team-energy-booster-bot.git
    cd my-team-energy-booster-bot
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/0) file in the root directory and add your Telegram bot token:
    ```env
    BOT_TOKEN=your-telegram-bot-token
    ```

4. Create a [quotes.json](http://_vscodecontentref_/1) file in the [src](http://_vscodecontentref_/2) directory with the following structure:
    ```json
    {
      "quotes": [
        { "text": "Your quote here", "author": "Author name" },
        { "text": "Another quote", "author": "Another author" }
      ]
    }
    ```

## Usage

1. Start the bot:
    ```sh
    npm start
    ```

2. Interact with the bot on Telegram:
    - `/start` - Start the bot and show the main menu.
    - `/help` - Show help message.
    - `/quote` - Get a random quote.

## Development

To run the bot with automatic restarts on file changes, use `nodemon`:
```sh
npx nodemon src/bot.js