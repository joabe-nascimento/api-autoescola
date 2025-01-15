  require("dotenv").config();
  const express = require("express");
  const cors = require("cors");
  const connectDB = require("./config/database");
  const testimonialRoutes = require("./routes/testimonials");

  const app = express();
  const PORT = process.env.PORT || 3001;

  // Conecta ao banco de dados
  connectDB();

  // Configuração do middleware
  app.use(express.json());  
  app.use(cors());

  // Rotas
  app.use("/api/testimonials", testimonialRoutes);

  // Inicia o servidor
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
