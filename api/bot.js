import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

app.post("/", async (req, res) => {
  console.log("Telegram update received:", JSON.stringify(req.body, null, 2));

  try {
    const { message } = req.body;
    
    if (!message || !message.text) {
      console.log("No message or text found");
      return res.sendStatus(200);
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

    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing update:", error.message);
    if (error.response) {
      console.error("Telegram API error:", error.response.data);
    }
    res.sendStatus(500);
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Bot webhook is running",
    timestamp: new Date().toISOString()
  });
});

export default app;