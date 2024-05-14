const dotenv = require("dotenv");
const fs = require("fs");
const sharp = require("sharp");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const venom = require("venom-bot");
const path = require("path");

dotenv.config();
const API_KEY = process.env.GOOGLE_API_KEY;
const WHATSAPP_ID = process.env.WHATSAPP_ID;
const LOCK_FILE = path.join(__dirname, "tokens", "whats", "SingletonLock");

const genAI = new GoogleGenerativeAI(API_KEY);
const chatHistory = [
  {
    role: "user",
    parts: [
      {
        text: "Eu vou te apresentar fotos de um animal. Eu posso adicionar diferentes características desse animal como nome, espécie, sinais de nascença. Guarde essas características. Se eu apresentar uma segunda foto, você deverá me dizer se é o mesmo indivíduo ou não. Me diga se podemos começar.",
      },
    ],
  },
  {
    role: "model",
    parts: [{ text: "Claro, podemos começar." }],
  },
];

const textOnlyModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  generationConfig: {
    maxOutputTokens: 1024,
  },
});

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
    console.log(
      "Handling chat interaction. Message:",
      message,
      "Is image:",
      isImage
    );

    const prompt = isImage
      ? "Analyze this image and describe the animal."
      : message.body;

    console.log("Prompt:", prompt);

    const chat = textOnlyModel.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1024,
      },
    });

    console.log("Chat session created with history:", chatHistory);

    const result = await chat.sendMessage({ parts: [{ text: prompt }] });
    const response = await result.response;

    console.log("Received response:", response.text);

    chatHistory.push({ role: "model", parts: [{ text: response.text }] });
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    console.log("Updated chat history:", chatHistory);

    return response.text;
  } catch (error) {
    console.error("Error in handleChatInteraction:", error);
    throw new Error("Could not interact with AI");
  }
}

async function startWhatsAppSession() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE);
    }

    const client = await venom.create({
      session: "whats",
      multidevice: true,
      headless: "new",
      browserArgs: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
      executablePath: "/usr/bin/google-chrome-stable",
    });

    client.onStateChange((state) => {
      console.log("State changed:", state);
      if (
        state === "CONFLICT" ||
        state === "UNPAIRED" ||
        state === "UNPAIRED_IDLE" ||
        state === "DISCONNECTED"
      ) {
        console.log("Client disconnected. Reconnecting...");
        reconnectWhatsAppSession();
      }
    });

    client.onMessage(async (message) => {
      if (message.isGroupMsg || message.sender.id !== `${WHATSAPP_ID}@c.us`)
        return;
      try {
        if (
          message.isMedia ||
          (message.body && message.body.startsWith("/9j/"))
        ) {
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

    return client;
  } catch (error) {
    console.error("Error creating WhatsApp session:", error);
    return null;
  }
}

async function reconnectWhatsAppSession() {
  console.log("Reconnecting WhatsApp session...");
  let client = await startWhatsAppSession();
  while (!client) {
    console.log("Failed to create session. Retrying in 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    client = await startWhatsAppSession();
  }
}

async function main() {
  await reconnectWhatsAppSession();
}

main();
