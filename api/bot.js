import axios from "axios";

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export default async function handler(req, res) {
  // Handle GET requests (for testing in browser)
  if (req.method === "GET") {
    return res.status(200).json({ 
      status: "ok", 
      message: "Bot webhook is running",
      timestamp: new Date().toISOString()
    });
  }

  // Handle POST requests (from Telegram)
  if (req.method === "POST") {
    console.log("Telegram update received:", JSON.stringify(req.body, null, 2));

    try {
      const { message } = req.body;
      
      if (!message || !message.text) {
        console.log("No message or text found");
        return res.status(200).send("OK");
      }

      const chatId = message.chat.id;
      const text = message.text;

      console.log(`Processing message: ${text} from chat: ${chatId}`);

      if (text === "/start") {
        const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatId,
          text: "👋 Welcome to Neighbourly! Tap below to open the Mini App:",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Open Neighbourly 🏡",
                  web_app: { url: "https://neighbourly-three.vercel.app" }
                }
              ]
            ]
          }
        });
        console.log("Message sent successfully:", response.data);
      }

      return res.status(200).send("OK");
    } catch (error) {
      console.error("Error processing update:", error.message);
      if (error.response) {
        console.error("Telegram API error:", error.response.data);
      }
      return res.status(500).send("Error");
    }
  }

  // Handle other methods
  return res.status(405).json({ error: "Method not allowed" });
}