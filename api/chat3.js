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

let chatHistory = [];

async function processImage(buffer, mimeType) {
  try {
    const enhancedBuffer = await sharp(buffer)
      .resize(1024, null, {
        fit: "inside",
      })
      .toBuffer();

    return {
      inlineData: {
        data: enhancedBuffer.toString("base64"),
        mimeType,
      },
    };
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
    chatHistory.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const chat = chatModel.startChat({ history: chatHistory });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;

    // Update the history with the model's response
    chatHistory.push({
      role: "model",
      parts: [{ text: response.text() }],
    });

    return response.text();
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
          const base64Image = await processImage(buffer, message.mimetype);
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
