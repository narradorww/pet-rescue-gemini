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

let ongoingChat;

async function startChatSession() {
  ongoingChat = await chatModel.startChat({ history: [] });
}

async function processImage(buffer, mimeType) {
  try {
    const enhancedBuffer = await sharp(buffer)
      .resize(1024, { fit: "inside" })
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
    const sendMessageRequest = {
      parts: [
        {
          text: prompt,
        },
      ],
    };

    const result = await ongoingChat.sendMessage(sendMessageRequest);
    const response = await result.response;

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
          const mimeType = message.mimetype;
          const formattedFile = await processImage(buffer, mimeType);
          const responseText = await handleChatInteraction(
            { body: formattedFile },
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

startChatSession(); // Start the chat session when the bot starts
