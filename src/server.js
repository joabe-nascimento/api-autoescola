const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());



const url = "joabe:SIuyVB2BOrP58s9A@autoescola.t6tu2.mongodb.net/?retryWrites=true&w=majority&appName=autoescola"; // URL do MongoDB
const dbName = "autoescola"; //
let db;

// Conectando ao banco de dados MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log("Conectado ao MongoDB");
  })
  .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

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
