const express = require("express");
const venom = require("venom-bot");

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

initializeWhatsApp();
