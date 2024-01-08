const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3300;
const bodyParser = require("body-parser");
const pgp = require("pg-promise");

app.use(bodyParser.json());

// Abilita tutte le richieste CORS
app.use(cors());

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbDatabase = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const initOptions = {}; // Opzioni di inizializzazione di pg-promise, se necessario
const cn = {
  host: dbHost,
  port: dbPort,
  database: dbDatabase,
  user: dbUser,
  password: dbPassword,
};

const db = pgp()(cn); // Connessione effettiva al database

// Verifica se la connessione al database è stata stabilita correttamente
db.connect()
  .then((obj) => {
    obj.done(); // Rilascia la connessione
    console.log("Connessione al database stabilita correttamente");
  })
  .catch((error) => {
    console.log("Errore nella connessione al database:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// OTTENIMENTO DATI CRYPTO
app.get("/crypto", async (req, res) => {
  try {
    const cryptoData = await db.any("SELECT * FROM crypto");
    // console.log(cryptoData);
    res.json(cryptoData);
  } catch (error) {
    console.error("Errore nel recupero dei dati delle crypto:", error);
    res.status(500).json({ error: "Si è verificato un errore." });
  }
});

// OTTENIMENTO DATI USDT BALANCE
app.get("/usdt_balance", async (req, res) => {
  try {
    const balanceData = await db.any("SELECT balance FROM usdt_balance");
    // console.log(balanceData);
    res.json(balanceData);
  } catch (error) {
    console.error("Errore nel recupero del bilancio USDT:", error);
    res.status(500).json({ error: "Si è verificato un errore." });
  }
});

// OTTENIMENTO DATI USDT INCOME
app.get("/usdt_data", async (req, res) => {
  try {
    const incomeData = await db.any("SELECT * FROM usdt_data");
    // console.log(balanceData);
    res.json(incomeData);
  } catch (error) {
    console.error("Errore nel recupero dei dati di usdt_data:", error);
    res.status(500).json({ error: "Si è verificato un errore." });
  }
});

// OTTENIMENTO DATI USDT OUTGOING
app.get("/usdt_data_outgoing", async (req, res) => {
  try {
    const outgoingData = await db.any("SELECT outgoing FROM usdt_data");
    // console.log(balanceData);
    res.json(outgoingData);
  } catch (error) {
    console.error("Errore nel recupero dei dati di usdt_data:", error);
    res.status(500).json({ error: "Si è verificato un errore." });
  }
});

// Route per cancellare tutti i dati dalla tabella usdt_data
app.delete("/delete-usdt-data", async (req, res) => {
  try {
    const query = "DELETE FROM usdt_data";

    console.log("Query SQL:", query); // Verifica la query SQL prima di eseguirla

    // Esegui la query di aggiornamento dei dati nel database
    await db.none(query);

    res.status(200).json({
      message: "Dati eliminati correttamente dalla tabella usdt_data",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AGGIORNAMENTO DATI
app.put("/update-table", async (req, res) => {
  try {
    const { tableName, fieldName, newValue, symbolName } = req.body;

    console.log("Dati ricevuti dal frontend:", req.body); // Verifica i dati ricevuti dal frontend

    if (!tableName || !newValue) {
      console.log("Parametri mancanti:", { tableName, newValue }); // Verifica se ci sono parametri mancanti
      return res
        .status(400)
        .json({ error: "Nome tabella o nuovo valore mancante" });
    }

    console.log("Parametri ricevuti:", { tableName, newValue }); // Verifica i parametri ricevuti prima di eseguire la query

    // Esegui l'aggiornamento del campo "lastorder" per la terza riga (id 3) nella tabella specificata
    const query = `
      UPDATE ${tableName}
      SET ${fieldName} = $1
      WHERE symbol = $2
    `;

    console.log("Query SQL:", query); // Verifica la query SQL prima di eseguirla

    // Esegui la query di aggiornamento dei dati nel database
    await db.none(query, [newValue, symbolName]);

    console.log("Aggiornamento completato con successo"); // Verifica se l'aggiornamento è stato completato

    res.json({
      message: `Valore aggiornato con successo per la terza riga nella tabella '${tableName}'`,
    });
  } catch (error) {
    console.error("Errore durante l'aggiornamento:", error);
    res.status(500).json({
      error:
        "Si è verificato un errore durante l'aggiornamento Dettagli: " +
        error.message,
    });
  }
});

// UPDATE USDT BALANCE
app.put("/update-usdt_balance", async (req, res) => {
  try {
    const { tableName, fieldName, newValue } = req.body;

    console.log("Dati ricevuti dal frontend:", req.body); // Verifica i dati ricevuti dal frontend

    if (!tableName || !newValue) {
      console.log("Parametri mancanti:", { tableName, newValue }); // Verifica se ci sono parametri mancanti
      return res
        .status(400)
        .json({ error: "Nome tabella o nuovo valore mancante" });
    }

    console.log("Parametri ricevuti:", { tableName, newValue }); // Verifica i parametri ricevuti prima di eseguire la query

    // Esegui l'aggiornamento del campo "lastorder" per la terza riga (id 3) nella tabella specificata
    const query = `
      UPDATE ${tableName}
      SET ${fieldName} = $1
    `;

    console.log("Query SQL:", query); // Verifica la query SQL prima di eseguirla

    // Esegui la query di aggiornamento dei dati nel database
    await db.none(query, [newValue]);

    console.log("Aggiornamento completato con successo"); // Verifica se l'aggiornamento è stato completato

    res.json({
      message: `Valore aggiornato con successo per la terza riga nella tabella '${tableName}'`,
    });
  } catch (error) {
    console.error("Errore durante l'aggiornamento:", error);
    res.status(500).json({
      error:
        "Si è verificato un errore durante l'aggiornamento. Dettagli: " +
        error.message,
    });
  }
});

app.post("/insert-income", async (req, res) => {
  try {
    const { column, incomeValue, outgoingValues } = req.body;

    console.log("Dati ricevuti dal frontend:", req.body); // Verifica i dati ricevuti dal frontend

    console.log("Parametri ricevuti:", { column, incomeValue, outgoingValues }); // Verifica i parametri ricevuti prima di eseguire la query

    // Esegui l'aggiornamento del campo "lastorder" per la terza riga (id 3) nella tabella specificata
    const query = `INSERT INTO usdt_data (${column}) VALUES (${incomeValue}, ${outgoingValues}) `;
    console.log("Query SQL:", query); // Verifica la query SQL prima di eseguirla

    // Esegui la query di aggiornamento dei dati nel database
    await db.query(query);

    console.log("Valore aggiunto con successo"); // Verifica se l'aggiornamento è stato completato

    res.json({
      message: `Valore aggiunto con successo nella colonna  '${column}'`,
    });
  } catch (error) {
    console.error("Errore durante l'aggiornamento:", error);
    res.status(500).json({
      error:
        "Si è verificato un errore durante l'aggiornamento Dettagli: " +
        error.message,
    });
  }
});

// const cryptoArray = ["BTCUSDT", "ETHUSDT"];

// async function inserisciCriptovaluteInDatabase(cryptoArray) {
//   try {
//     await db.none("BEGIN"); // Inizia una transazione

//     for (const crypto of cryptoArray) {
//       const symbol = crypto; // Destructuring degli attributi
//       await db.none(
//         "INSERT INTO crypto (symbol, date, lastorder, totcoin, reference, stoploss, takeprofit, start, firstpurchase, purchase, sellminus, buyplus, sale, salewon, salelost, lastoperation ) VALUES ($1, 0, 0, 0, 0, 0, 0, true, false, false, false, false, false, false, false, 0)",
//         [symbol]
//       );
//     }

//     await db.none("COMMIT"); // Conferma la transazione
//     console.log("Criptovalute inserite con successo nel database.");
//   } catch (error) {
//     await db.none("ROLLBACK"); // Annulla la transazione in caso di errore
//     console.error("Errore durante l'inserimento delle criptovalute:", error);
//   } finally {
//     // Chiudi la connessione al database o rilascia eventuali risorse
//     db.$pool.end();
//   }
// }

// inserisciCriptovaluteInDatabase(cryptoArray);

// AVVIO SERVER
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
