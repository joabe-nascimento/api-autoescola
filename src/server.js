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

// Middleware para verificar conexão com o banco
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: "Banco de dados não conectado" });
  }
  next();
});

// Rota para salvar depoimento
app.post("/api/depoimentos", async (req, res) => {
  const { nome, texto, status, badge } = req.body;

  // Validação dos dados
  if (!nome || !texto || !status || !badge) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const depoimento = { nome, texto, status, badge, createdAt: new Date() };
    const result = await db.collection("depoimentos").insertOne(depoimento);
    if (result.acknowledged) {
      res.status(201).json(depoimento); // Retorna o depoimento criado
    } else {
      throw new Error("Falha ao inserir depoimento");
    }
  } catch (err) {
    console.error("Erro ao salvar depoimento:", err);
    res.status(500).json({ error: "Erro interno ao salvar depoimento" });
  }
});

// Rota para buscar todos os depoimentos
app.get("/api/depoimentos", async (req, res) => {
  try {
    const depoimentos = await db.collection("depoimentos").find().toArray();
    res.status(200).json(depoimentos);
  } catch (err) {
    console.error("Erro ao buscar depoimentos:", err);
    res.status(500).json({ error: "Erro ao buscar depoimentos" });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
