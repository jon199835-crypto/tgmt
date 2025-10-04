import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// форвард POST в Google Apps Script
app.post("/", async (req, res) => {
  try {
    const resp = await fetch("https://script.google.com/macros/s/AKfycbzo0QbCwXME1XXYgZoyGSxzCUc5M_BX9dKoHC2SFk_IJoT5zqrrpmSzj5jTCYzHy2-_/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const text = await resp.text();
    res.send("FORWARDED: " + text);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

// проверка доступности
app.get("/", (req, res) => res.send("✅ Proxy alive (Render)"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
