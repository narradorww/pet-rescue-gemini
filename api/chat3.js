const dotenv = require("dotenv");
const fs = require("fs");
const sharp = require("sharp");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const venom = require("venom-bot");

dotenv.config();
const API_KEY = process.env.GOOGLE_API_KEY;
const WHATSAPP_ID = process.env.WHATSAPP_ID;

const genAI = new GoogleGenerativeAI(API_KEY);
const chatModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  generationConfig: {
    maxOutputTokens: 1024,
  },
});

let chatHistory = [
  {
    role: "user",
    parts: [
      {
        text: "eu vou te apresentar fotos de  um animal.  eu posso adicionar diferentes caracteristicas desse animal como nome, especie, sinais de nascença. guarde essas caracteristicas. \nse eu apresentar uma segunda foto voce deverá me dizer se é o mesmo indiciduo ou não . me diga se podemos começar",
      },
    ],
  },
];

async function processImage(buffer, mimeType) {
  try {
    const enhancedBuffer = await sharp(buffer)
      .resize(1024, null, { fit: "inside" })
      .toBuffer();
    return enhancedBuffer.toString("base64");
  } catch (error) {
    console.error("Error processing image with sharp:", error);
    throw error;
  }
}

async function handleChatInteraction(message, isImage = false) {
  try {
    const prompt = isImage
      ? "Analyze this image and describe the animal."
      : message.body;

    const chat = await chatModel.startChat({ history: chatHistory });
    const result = await chat.sendMessage({ parts: [{ text: prompt }] });
    const response = await result.response;

    // Adiciona a resposta do modelo ao histórico PRIMEIRO
    chatHistory.push({ role: "model", parts: [{ text: response.text }] });

    // Adiciona a mensagem do usuário ao histórico DEPOIS
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    return response.text;
  } catch (error) {
    console.error("Error in handleChatInteraction:", error);
    throw new Error("Could not interact with AI");
  }
}

venom
  .create({
    session: "whats",
    multidevice: true,
  })
  .then((client) => {
    client.onMessage(async (message) => {
      if (message.isGroupMsg || message.sender.id !== `${WHATSAPP_ID}@c.us`)
        return;
      try {
        if (message.isMedia || message.body.startsWith("/9j/")) {
          const buffer = await client.decryptFile(message);
          const base64Image = processImage(buffer, message.mimetype);
          const responseText = await handleChatInteraction(
            { body: base64Image },
            true
          );
          client.sendText(message.from, responseText);
        } else {
          const responseText = await handleChatInteraction(message);
          client.sendText(message.from, responseText);
        }
      } catch (error) {
        console.error("Failed to process message:", error);
        client.sendText(message.from, "Failed to process your message.");
      }
    });
  })
  .catch((error) => console.error("Error creating WhatsApp session:", error));
