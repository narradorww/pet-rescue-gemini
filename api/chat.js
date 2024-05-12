require("dotenv").config();
const venom = require("venom-bot");
const axios = require("axios");

const apiClient = axios.create({
  baseURL: "https://generativelanguage.googleapis.com",
});

const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
];

venom
  .create({
    session: "whats",
    multidevice: true,
  })
  .then((client) => {
    start(client);
  })
  .catch((error) => {
    console.error("Erro ao criar a sessão do WhatsApp:", error);
  });

const start = (client) => {
  client.onMessage((message) => {
    if (message.sender.id === "5511988875183@c.us") console.log(message);
    try {
      const response = apiClient.post(
        `/v1beta/models/gemini-1.5-pro-latest:generateText${process.env.GOOGLE_API_KEY}`,
        {
          prompt: {
            text: message.body,
          },
          safetySettings,
        }
      );

      // Extrai a resposta do texto gerado
      const generatedText = response.data.candidates[0].text;

      // Envia a resposta gerada de volta ao usuário
      client.sendText(message.from, generatedText);
    } catch (err) {
      console.error("Erro ao chamar a API Gemini:", err);
      client.sendText(
        message.from,
        "Desculpe, ocorreu um erro ao processar sua solicitação."
      );
    }
  });
};
