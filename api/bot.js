import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

app.post("/", async (req, res) => {
  console.log("Telegram update received:", req.body);

  const { message } = req.body;
  if (!message || !message.text) return res.sendStatus(200);

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
              web_app: { url: "https://neighbourly-three.vercel.app" }
            }
          ]
        ]
      }
    });
  }

  res.sendStatus(200);
});
console.log("Telegram update received:", req.body);
export default app;
