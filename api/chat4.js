require("dotenv").config();
const { create } = require("venom-bot");
const {
  imagesTextModel,
  textOnlyModel,
  configure,
} = require("@google/generative-ai");
const fs = require("fs");

// Configuração da API do Gemini
configure({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Função para codificar a imagem em base64
async function encodeImageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString("base64");
}

// Função para salvar a imagem temporariamente
function saveImageTemporarily(media) {
  const imagePath = "./temp/uploaded_image.jpg";
  fs.writeFileSync(imagePath, Buffer.from(media.data, "base64"));
  return imagePath;
}

// Função para analisar a imagem usando a API do Gemini
async function analyzeImage(base64Image) {
  const prompt = "Analyze this image and describe the animal.";

  try {
    const result = await imagesTextModel.generateContent({
      prompt: prompt,
      images: [base64Image],
    });

    const response = await result.response;
    return response.text;
  } catch (err) {
    console.error(err);
    throw "Could Not Analyze Image";
  }
}

// Função para interagir com o Gemini usando texto
async function chatWithAI(prompt) {
  try {
    const result = await textOnlyModel.generateContent(prompt);
    const response = await result.response;
    return response.text;
  } catch (err) {
    console.error(err);
    throw "Could Not Chat With AI";
  }
}

// Inicialização do Venom-Bot
create({
  session: "whatsapp-session",
})
  .then((client) => start(client))
  .catch((err) => {
    console.error("Error initializing Venom-Bot:", err);
  });

function start(client) {
  client.onMessage(async (message) => {
    console.log("Handling chat interaction. Message:", message);

    try {
      let response;
      if (message.isMedia || message.isMMS) {
        const mediaData = await client.downloadMedia(message);
        const imagePath = saveImageTemporarily(mediaData);
        const base64Image = await encodeImageToBase64(imagePath);
        response = await analyzeImage(base64Image);
      } else {
        response = await chatWithAI(message.body);
      }

      await client.sendText(message.from, response);
    } catch (err) {
      console.error("Error in handleChatInteraction:", err);
      await client.sendText(
        message.from,
        "Sorry, there was an error processing your request."
      );
    }
  });
}
