require("dotenv").config(); // Carregar variáveis de ambiente
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 3001; // Porta do servidor
const mongoUri = process.env.MONGO_URI; // URL do MongoDB
const dbName = process.env.DB_NAME; // Nome do banco de dados

let db;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectando ao banco de dados MongoDB
MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log(`Conectado ao MongoDB: ${dbName}`);
  })
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Rota para salvar depoimento
app.post("/api/depoimentos", async (req, res) => {
  const { nome, texto, status, badge } = req.body;

  try {
    const depoimento = { nome, texto, status, badge, createdAt: new Date() };
    const result = await db.collection("depoimentos").insertOne(depoimento);
    res.status(200).json(result.ops[0]); // Retorna o depoimento inserido
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar depoimento" });
  }
});

// Rota para buscar todos os depoimentos
app.get("/api/depoimentos", async (req, res) => {
  try {
    const depoimentos = await db.collection("depoimentos").find().toArray();
    res.status(200).json(depoimentos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar depoimentos" });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
