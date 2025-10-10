import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// === CONFIG ===
const GAS_URL = "https://script.google.com/macros/s/AKfycbxxbuR3q41j4unweqH87ZS9ea3NCt1XLlbu09-cXtcpPUaeQvUDuGadza0u7gmN6Znk/exec";

// === ПРОКСИ ДЛЯ TELEGRAM ===
app.post("/", async (req, res) => {
  console.log("📩 Incoming update from Telegram:", JSON.stringify(req.body));

  try {
    const resp = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await resp.text();
    console.log("✅ GAS responded:", text.slice(0, 200));

    // Отправляем обратно тот же HTTP код, что вернул GAS
    res.status(resp.status || 200).send(text || "ok");
  } catch (err) {
    console.error("❌ Proxy error:", err.message);
    res.status(502).send("Proxy error: " + err.message);
  }
});

// === ТЕСТОВЫЙ ЭНДПОИНТ ===
app.get("/", (req, res) => res.send("✅ Proxy alive (Render v2)"));

// === СТАРТ СЕРВЕРА ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Proxy running on port ${PORT}`));
