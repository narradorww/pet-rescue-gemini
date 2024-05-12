const dotenv = require("dotenv");
const fs = require("fs");
const sharp = require("sharp");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const venom = require("venom-bot");

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const WHATSAPP_ID = process.env.WHATSAPP_ID;
const genAI = new GoogleGenerativeAI(API_KEY);
const imagesTextModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
});

const promptImage =
  "eu vou te apresentar fotos de  um animal.eu posso adicionar diferentes caracteristicas desse animal como nome, especie, sinais de nascença. guarde essas caracteristicas. se eu apresentar uma segunda foto voce deverá me dizer se é o mesmo indiciduo ou não . me diga se podemos começar Ao receber fotos de um animal específico, analise cuidadosamente os seguintes detalhes visuais para identificar com precisão o animal: padrões de pelagem, marcas distintivas como sinais e cicatrizes, proporção e distância entre membros e cabeça, além de características específicas da cabeça como tamanho, forma, orelhas, olhos, nariz, boca, dentes. Examine também as patas e a cauda. Forneça um descritivo detalhado baseado nessas observações.";

async function fileToGenerativePart(buffer, mimeType) {
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

async function promptAI(prompt, images) {
  try {
    let result;
    if (images.length === 0) {
      console.error("No images provided to an image model");
      throw new Error("Image required for the chosen model");
    } else {
      result = await imagesTextModel.generateContent([prompt, ...images]);
    }
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Error in promptAI:", err);
    throw new Error("Could Not Prompt AI");
  }
}

async function promptAItext(prompt) {
  try {
    const result = await imagesTextModel.generateContent(prompt);

    const response = await result.response;

    const text = response.text();
    return text;
  } catch (err) {
    console.log(err);
    throw "Could Not Prompt AI";
  }
}

venom
  .create({
    session: "whats",
    multidevice: true,
  })
  .then((client) => {
    client.onMessage(async (message) => {
      if (message.isGroupMsg) return;
      if (message.sender.id !== `${WHATSAPP_ID}@c.us`) return;
      console.log("Received message:", message);

      try {
        if (message.body.startsWith("/9j/")) {
          const buffer = await client.decryptFile(message);
          const mimeType = message.mimetype;
          const formattedFile = await fileToGenerativePart(buffer, mimeType);
          const responseText = await promptAI(promptImage, [formattedFile]);
          client.sendText(message.from, responseText);
        } else {
          const responseText = await promptAItext(message.body);
          client.sendText(message.from, responseText);
        }
      } catch (error) {
        console.error("Failed to process image message:", error);
        client.sendText(message.from, "Failed to process your image.");
      }
    });
  })
  .catch((error) => console.error("Error creating WhatsApp session:", error));
