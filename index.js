import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// форвард POST в Google Apps Script
app.post("/", async (req, res) => {
  try {
    const resp = await fetch("https://script.google.com/macros/s/AKfycbx3vOqf1GVMBHsZNMPN1W7-AXD6AAJnDx2mLst9T4M_qWu9IF_xac_cqiHf74tyklu1/exec", {
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
