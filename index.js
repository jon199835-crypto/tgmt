import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// === CONFIG ===
const GAS_URL = "https://script.google.com/macros/s/AKfycbwqFthX0Trs6AdOOJJ-7n3QG8qu04XFXOYaxJ4pR6QtbeQIPnPe-O69LLlaBxTR1vmY5A/exec";

// === ПРОКСИ ДЛЯ TELEGRAM ===
app.post("/", (req, res) => {
  console.log("📩 Incoming update from Telegram:", JSON.stringify(req.body));

  // ✅ 1. Немедленно подтверждаем Telegram, чтобы избежать таймаута
  res.status(200).send("ok");

  // ⚙️ 2. Асинхронно пересылаем данные в Google Apps Script
  (async () => {
    try {
      const resp = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      const text = await resp.text();
      console.log("✅ GAS responded:", text.slice(0, 200));
    } catch (err) {
      console.error("❌ Proxy error:", err.message);
    }
  })();
});

// === ТЕСТОВЫЙ ЭНДПОИНТ ===
app.get("/", (req, res) => res.send("✅ Proxy alive (Render v2)"));

// === СТАРТ СЕРВЕРА ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Proxy running on port ${PORT}`));
