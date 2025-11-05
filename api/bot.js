import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

app.post("/api/bot", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.text) {
      return res.sendStatus(200);
    }

    const chatId = message.chat.id;
    const text = message.text;

    if (text === "/start") {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: "👋 Welcome to Neighbourly! Tap below to open the Mini App:",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Open Neighbourly 🏡",
                web_app: { url: "https://neighbourly.vercel.app" } // your app URL
              }
            ]
          ]
        }
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error handling Telegram update:", error.message);
    res.sendStatus(500);
  }
});

export default app;
