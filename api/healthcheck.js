export default function handler(req, res) {
    if (req.method === 'GET') {
      // Check if bot is running, or any other necessary checks
      res.status(200).json({ status: 'ok', message: 'Bot is running!' });
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  }
  