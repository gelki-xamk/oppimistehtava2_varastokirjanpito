import { Router } from "express";
import { prisma } from "../lib/prisma.ts";

const router = Router();

// GET - Haetaan komponentit mahdollisilla hakuehdoilla
router.get("/", async (req, res) => {
  try {
    const { kategoria, merkki, malli } = req.query;

    // Rakennetaan hakuehdot vain annetuista parametreista
    const where = {
      ...(typeof kategoria === "string" && { kategoria }),
      ...(typeof merkki === "string" && { merkki }),
      ...(typeof malli === "string" && { malli })
    };

    const komponentit = await prisma.komponentti.findMany({
      where
    });

    return res.status(200).json(komponentit);

  } catch (error) {
    return res.status(500).json({
      virhe: "Palvelimella tapahtui odottamaton virhe"
    });
  }
});

// POST - Lisätään uusi komponentti varastoon
router.post("/", async (req, res) => {

  const { kategoria, merkki, malli, hinta, maara } = req.body ?? {};

  // Tarkistetaan pyynnön tietojen oikeellisuus
  if (
    typeof kategoria !== "string" || !kategoria.trim() ||
    typeof merkki !== "string" || !merkki.trim() ||
    typeof malli !== "string" || !malli.trim() ||
    typeof hinta !== "number" || !Number.isFinite(hinta) || hinta < 0 ||
    typeof maara !== "number" || !Number.isInteger(maara) || maara < 0
  ) {
    return res.status(400).json({
      virhe: "Virheellinen pyyntö"
    });
  }

  // Muodostetaan päivämäärä automaattisesti
  const paivitetty = new Date().toLocaleDateString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Helsinki"
  });

  try {
    const uusiKomponentti = await prisma.komponentti.create({
      data: {
        kategoria: kategoria.trim(),
        merkki: merkki.trim(),
        malli: malli.trim(),
        hinta,
        maara,
        paivitetty
      }
    });

    return res.status(201).json(uusiKomponentti);

  } catch (error) {
    return res.status(500).json({
      virhe: "Palvelimella tapahtui odottamaton virhe"
    });
  }
});

// PUT - Päivitetään komponentin varastomäärä
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { maara } = req.body ?? {};

  // Tarkistetaan pyynnön tiedot
  if (
    !Number.isSafeInteger(id) || id <= 0 ||
    typeof maara !== "number" ||
    !Number.isSafeInteger(maara) ||
    maara < 0
  ) {
    return res.status(400).json({
      virhe: "Virheellinen pyynnön body"
    });
  }

  try {
    // Tarkistetaan, löytyykö komponentti
    const komponentti = await prisma.komponentti.findUnique({
      where: { id }
    });

    if (!komponentti) {
      return res.status(404).json({
        virhe: "Komponenttia ei löytynyt annetulla id:llä"
      });
    }

    // Muodostetaan uusi päivityspäivämäärä
    const paivitetty = new Date().toLocaleDateString("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Europe/Helsinki"
    });

    // Päivitetään vain määrä ja päivämäärä
    const paivitettyKomponentti = await prisma.komponentti.update({
      where: { id },
      data: {
        maara,
        paivitetty
      }
    });

    return res.status(200).json(paivitettyKomponentti);

  } catch (error) {
    return res.status(500).json({
      virhe: "Palvelimella tapahtui odottamaton virhe"
    });
  }
});

// DELETE - Poistetaan komponentti varastosta
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Tarkistetaan ID:n kelvollisuus
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(404).json({
      virhe: "Komponenttia ei löytynyt annetulla id:llä"
    });
  }

  try {
    // Tarkistetaan, löytyykö komponentti
    const komponentti = await prisma.komponentti.findUnique({
      where: { id }
    });

    if (!komponentti) {
      return res.status(404).json({
        virhe: "Komponenttia ei löytynyt annetulla id:llä"
      });
    }

    // Poistetaan komponentti tietokannasta
    await prisma.komponentti.delete({
      where: { id }
    });

    // Haetaan kaikki jäljelle jääneet komponentit
    const komponentit = await prisma.komponentti.findMany();

    return res.status(200).json(komponentit);

  } catch (error) {
    return res.status(500).json({
      virhe: "Palvelimella tapahtui odottamaton virhe"
    });
  }
});

export default router;