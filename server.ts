import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint first
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        console.error("Gemini API key is not configured in environment variables.");
        return res.status(500).json({ 
          error: "API key is missing on the server. Please verify it in Settings > Secrets." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: "Du bist der Assistent von 'LayerForm' (Bargteheide). Deine Aufgabe: Berate Kunden zu INDIVIDUELLEN FERTIGUNGEN. Unser Motto: 'Alles ist möglich'. Wir fertigen Einzelstücke und Kleinserien für Privatpersonen und Unternehmen (B2B). Wir drucken Logos, Prototypen, Ersatzteile, Event-Deko und vieles mehr auf Bambu Lab Systemen. Sei lösungsorientiert: Wenn ein Kunde fragt, ob wir X drucken können, antworte positiv und lade ihn ein, uns Details via WhatsApp oder E-Mail zu schicken. Stil: Edel, Apple-Style, minimalistisch, professionell.",
        }
      });

      res.json({ text: response.text || "Entschuldigung, ich konnte darauf keine Antwort generieren." });
    } catch (err: any) {
      console.error("Error calling Gemini API:", err);
      res.status(500).json({ error: "Fehler beim Aufruf der KI-Schnittstelle.", details: err.message });
    }
  });

  // Vite middleware for development or serving index.html for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
