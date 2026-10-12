import express, { Request, Response } from "express";
import apiKomponentit from "./routes/apiKomponentit.ts";

const app = express();
const PORT = 3102;

// Mahdollistaa JSON-muotoisten pyyntöjen käsittelyn
app.use(express.json());
app.use("/api/komponentit", apiKomponentit);

// Testireitti palvelimen toiminnan tarkistamiseen
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    viesti: "Komponenttivaraston REST API toimii!"
  });
});

// Käynnistetään palvelin
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});