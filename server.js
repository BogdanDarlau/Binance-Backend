const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3001; // Scegli una porta per il tuo server

// Configura middleware per il parsing del corpo delle richieste
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // o specifica il dominio del tuo frontend
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/get-gist-data", async (req, res) => {
  try {
    const gistUrl =
      "https://gist.github.com/BogdanDarlau/fa20eee5fd7085085611bacf285126b3";
    const response = await axios.get(gistUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei dati dal Gist" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
