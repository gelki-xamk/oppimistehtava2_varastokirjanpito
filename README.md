# Oppimistehtävä 2 – Verkkokaupan varastokirjanpito

## Sovelluksen kuvaus

Tässä oppimistehtävässä toteutin REST API -palvelinsovelluksen kuvitteellisen tietokonekomponentteja myyvän yrityksen varastokirjanpitoon. Sovelluksella voidaan lisätä uusia komponentteja, tarkastella varaston sisältöä, päivittää komponenttien varastomääriä sekä poistaa komponentteja.

Komponenttien tiedot tallennetaan SQLite-tietokantaan Prisma ORM:n avulla.

## Käytetyt teknologiat

- Node.js
- TypeScript
- Express
- Prisma ORM 7
- SQLite
- Postman (API:n testaus)

## Asennus ja käynnistäminen

Sovelluksen käyttö edellyttää Node.js:n asentamista.

1. Avaa projektikansio terminaalissa.
2. Asenna riippuvuudet komennolla `npm install`.
3. Luo projektin juureen `.env`-tiedosto ja lisää siihen:

   `DATABASE_URL="file:./dev.db"`

4. Luo tietokannan rakenne komennolla:

   `npx prisma migrate deploy --config prisma7.config.ts`

5. Generoi Prisma Client komennolla:

   `npx prisma generate --config prisma7.config.ts`

6. Käynnistä sovellus komennolla:

   `npm run dev`

Palvelin käynnistyy porttiin **3102**.

Testiosoite: `http://localhost:3102/`

API:n osoite: `http://localhost:3102/api/komponentit`

## Tietomalli

Jokaisella varastossa olevalla komponentilla on seuraavat tiedot:

| Kenttä | Kuvaus |
|---|---|
| id | Automaattisesti muodostuva yksilöllinen tunnus |
| kategoria | Komponentin tyyppi, esimerkiksi CPU tai GPU |
| merkki | Komponentin valmistaja |
| malli | Komponentin malli |
| hinta | Komponentin myyntihinta |
| maara | Varastossa oleva kappalemäärä |
| paivitetty | Viimeisin päivityspäivämäärä muodossa pp.kk.vvvv |

## REST API -reitit

| Metodi | Reitti | Toiminto |
|---|---|---|
| GET | /api/komponentit | Hakee kaikki komponentit |
| POST | /api/komponentit | Lisää uuden komponentin |
| PUT | /api/komponentit/:id | Päivittää komponentin varastomäärän |
| DELETE | /api/komponentit/:id | Poistaa komponentin |

### POST – uuden komponentin lisääminen

Esimerkki pyynnön JSON-sisällöstä:

```json
{
  "kategoria": "GPU",
  "merkki": "Gigabyte",
  "malli": "GeForce RTX 5070",
  "hinta": 649.90,
  "maara": 8
}
```

Komponentin ID ja päivityspäivämäärä muodostetaan automaattisesti.

Onnistunut lisäys palauttaa HTTP-statuksen 201. Virheellinen pyyntö palauttaa statuksen 400.

### PUT – varastomäärän päivittäminen

Esimerkki osoitteesta:

`PUT /api/komponentit/1`

Pyynnön JSON-sisältö:

```json
{
  "maara": 15
}
```

Sovellus päivittää vain komponentin varastomäärän ja päivityspäivämäärän.

Onnistunut päivitys palauttaa HTTP-statuksen 200. Virheellinen pyyntö palauttaa statuksen 400 ja puuttuva komponentti statuksen 404.

### DELETE – komponentin poistaminen

Esimerkki:

`DELETE /api/komponentit/1`

Onnistunut poisto palauttaa HTTP-statuksen 200 sekä jäljelle jääneiden komponenttien taulukon. Jos komponenttia ei löydy, palautetaan 404.

## Komponenttien hakeminen

GET-reitti tukee myös hakua query string -parametreilla.

Hakuehtoina voidaan käyttää komponentin kategoriaa, merkkiä ja mallia.

Esimerkkejä:

- `/api/komponentit?kategoria=GPU`
- `/api/komponentit?merkki=AMD`
- `/api/komponentit?malli=GeForce%20RTX%205070`
- `/api/komponentit?kategoria=GPU&merkki=Gigabyte`

Hakuehtoja voidaan yhdistää vapaasti. Ilman hakuehtoja palautetaan kaikki komponentit.

## Testaus

Sovelluksen toimintaa testattiin Postman-sovelluksella.

Testauksessa tarkistettiin GET-, POST-, PUT- ja DELETE-pyyntöjen onnistuneet vastaukset sekä tehtävänannossa määritellyt virhetilanteet.

Lisäksi testattiin hakutoimintoa yksittäisillä ja yhdistetyillä hakuehdoilla.

Testauksen tulokset ja kuvakaappaukset dokumentoidaan erilliseen tehtäväraporttiin.