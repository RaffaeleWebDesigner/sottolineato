# Sottolineato

Un feed verticale in italiano per imparare qualcosa di interessante, una scheda alla volta: libri, citazioni storiche, vero o falso, miti e idee da tirare fuori con gli amici.

## Tipi di scheda

| Tipo | Cosa contiene | Regola sui diritti |
|---|---|---|
| Frase (`frase`) | Una citazione alla lettera | Solo opere di pubblico dominio. Le opere straniere sono tradotte da noi (`trad: true`). |
| L'idea (`idea`) | L'idea chiave di un libro, raccontata con parole nostre | Adatta ai libri moderni: niente frasi copiate. |
| Parola (`parola`) | Una parola o espressione nata da un libro | Definizione e origine scritte da noi. |
| Dietro il libro (`sapevi`) | Una curiosità sul libro o sull'autore | Solo fatti verificabili. |
| Citazione storica (`storica`) | Una frase famosa, con il verdetto: detta davvero, attribuita o mai detta così | Campo `verdetto`: `vera`, `attribuita`, `mai`. Il quiz chiede se è autentica. |
| Vero o falso (`mondo`) | Curiosità sul mondo e falsi miti | Campo `vero`: `true` o `false`. Il quiz chiede di indovinare. |
| Mito o realtà? (`mito`) | Una credenza diffusa, confermata o sfatata | Campo `vero`: `true` = confermato, `false` = mito sfatato. |
| Da dire agli amici (`brillante`) | Paradossi, effetti, leggi | Campi `def` (cos'è in una riga) e `spunto` (la frase pronta da dire). |

## File

- `index.html`: struttura e stile.
- `app.js`: carica i dati, poi feed, filtri, quiz e salvataggi (nel `localStorage` del browser). Crea le schede a gruppi di 25 mentre si scorre.
- `data/temi.json`: i 24 temi.
- `data/schede/<tipo>.json`: i dati comuni a tutte le lingue (id, temi, risposta, autore, stato, date…).
- `data/testi/it/<tipo>.json`: i testi italiani, indicizzati per id.
- `data/SCHEMA.md`: lo schema completo della scheda, con un esempio per ogni tipo.
- `scripts/controlla.mjs`: il controllo dei contenuti.

## Avvio in locale

Il sito carica i dati con `fetch`, quindi **non funziona aprendo `index.html` direttamente dal computer**: serve un piccolo server locale. Dalla cartella del progetto:

```bash
python3 -m http.server 8000
```

poi apri `http://localhost:8000` nel browser.

Schede salvate e imparate restano solo nel browser di chi le usa.

## Aggiungere una scheda

1. Scegli il tipo e un `id` nuovo, unico e definitivo (gli id non si cambiano mai: i salvataggi degli utenti dipendono da loro).
2. In `data/schede/<tipo>.json` aggiungi una riga con i dati comuni: `id`, `tipo`, `temi` (id di `data/temi.json`, il primo è il principale), `stato` (`da_verificare` o `verificata` con `verificata_il`), `aggiunta` (la data di oggi) e i campi del tipo (`vero`, `verdetto`, `autore`…).
3. Per `mondo`, `mito` e `storica` aggiungi sempre una `fonte`: link o riferimento che conferma il fatto.
4. In `data/testi/it/<tipo>.json` aggiungi la voce con lo stesso `id`: `testo` (massimo 220 caratteri), `hl` (identico a un pezzo di `testo`), `nota` e, dove serve, `opera`, `def`, `spunto`.
5. Lancia il controllo e correggi finché non passa:

```bash
node scripts/controlla.mjs
```

Per lavorare su una scheda senza mostrarla, usa `"stato": "bozza"`.

Tutti i campi e gli esempi sono in `data/SCHEMA.md`.

## Pubblicazione

È un sito statico: non serve nessuna compilazione. GitHub Pages pubblica il branch `main`, cartella `/ (root)`, all'indirizzo `https://raffaelewebdesigner.github.io/sottolineato/`. Ogni commit su `main` va online in circa un minuto: prima di unire un branch, controlla il sito in locale e lancia `node scripts/controlla.mjs`.

Se il sito finisce a un indirizzo diverso, aggiorna `og:url`, `og:image` e `canonical` in `index.html`.
