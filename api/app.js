const express = require("express");
const venom = require("venom-bot");
const axios = require("axios");
require("dotenv").config();


const app = express();
app.use(express.json());
const port = 3000;

async function initializeWhatsApp() {
  try {
    const client = await venom.create({
      session: "whats",
    });
    setupEndpoints(client);
  } catch (error) {
    console.error("Erro ao criar a sessão do WhatsApp:", error);
  }
}

function setupEndpoints(client) {
  app.post("/send-message", async (req, res) => {
    try {
      const { to, message } = req.body;
      if (!to || !message) {
        return res
          .status(400)
          .json({ error: "Parâmetros 'to' e 'message' são obrigatórios" });
      }

      await client.sendText(`${to}@c.us`, message);
      res.json({ message: "Mensagem enviada com sucesso" });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      res.status(500).json({ error: "Erro ao enviar mensagem" });
    }
  });

  app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
  });
}

function listenToMessages(client) {
  client.onMessage(async (message) => {
    if (message.isMedia === true || message.isMMS === true) {
      const buffer = await client.decryptFile(message);

      const mimeType = message.mimetype;

      await sendToApi({ type: "media", data: buffer, mimeType });
    } else {
      await sendToApi({ type: "text", data: message.body });
    }
  });
}

async function sendToApi(data) {
  try {
    let requestData = {
      contents: [],
    };

    if (data.type === "text") {
      requestData.contents.push({
        parts: [{ text: data.data }],
      });
    } else if (data.type === "media") {
      const mediaBase64 = Buffer.from(data.data).toString("base64");
      requestData.contents.push({
        parts: [
          { text: "What is this picture?" },
          {
            inline_data: {
              mime_type: data.mimeType,
              data: mediaBase64,
            },
          },
        ],
      });
    }

    const API_URL = `${process.env.API_URL}?key=${process.env.GOOGLE_API_KEY}`;

    const response = await axios.post(API_URL, requestData, {
      headers: {
        "Content-Type": "application.json",
      },
    });

    console.log("Resposta da API:", response.data);
  } catch (error) {
    console.error("Erro ao enviar dados para a API:", error);
  }
}

initializeWhatsApp();
