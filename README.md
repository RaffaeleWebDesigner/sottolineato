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

- `index.html`: struttura e stile. Carica `js/main.js` come modulo ES.
- `js/`: il codice, in moduli ES nativi (nessuna compilazione). `main.js` e `app.js` avviano tutto; ogni vista ha il suo modulo (`feed.js`, `esplora.js`, `salvate.js`, `profilo.js`, `onboarding.js`…); `ordine.js` e `ricerca.js` contengono le regole pure (ordine del feed, scheda del giorno, ripasso, ricerca); `cronologia.js`, `salvataggi.js`, `ripasso.js` e `preferenze.js` tengono i dati dell'utente nel `localStorage`; `scheda.js`, `quiz.js`, `effetti.js` e `condividi.js` costruiscono la scheda. L'elenco completo è in `CLAUDE.md`.
- `i18n/it.json`: i testi dell'interfaccia (bottoni, filtri, messaggi). Nel codice si usano con `t("gruppo.chiave")`, in `index.html` con `data-i18n`.
- `data/temi.json`: le 6 macro-categorie e i 24 temi, ognuno in una categoria.
- `data/schede/<tipo>.json`: i dati comuni a tutte le lingue (id, temi, risposta, autore, stato, date…).
- `data/testi/it/<tipo>.json`: i testi italiani, indicizzati per id.
- `data/SCHEMA.md`: lo schema completo della scheda, con un esempio per ogni tipo.
- `sw.js`, `manifest.webmanifest`, `fonts/`, `icone/`: il sito installabile e offline (vedi «Sito installato e offline»). `scripts/icone.mjs` rigenera le icone PNG (richiede Playwright, non fa parte del sito).
- `scripts/controlla.mjs`: il controllo dei contenuti, delle chiavi di traduzione e dei moduli precaricati.
- `scripts/prova-ordine.mjs`: prova senza browser dell'ordine del feed, della scheda del giorno, del ripasso e della ricerca. `scripts/contrasto.mjs`: contrasto dei colori nei due temi.

## Avvio in locale

Il sito carica i dati con `fetch`, quindi **non funziona aprendo `index.html` direttamente dal computer**: serve un piccolo server locale. Dalla cartella del progetto:

```bash
python3 -m http.server 8000
```

poi apri `http://localhost:8000` nel browser.

Schede salvate e imparate restano solo nel browser di chi le usa.

Il sito carica prima i dati comuni delle schede (bastano per contare, filtrare e ordinare il feed), poi i testi, a partire da quelli della prima scheda in vista.

## Aggiungere una scheda

1. Scegli il tipo e un `id` nuovo, unico e definitivo (gli id non si cambiano mai: i salvataggi degli utenti dipendono da loro).
2. In `data/schede/<tipo>.json` aggiungi una riga con i dati comuni: `id`, `tipo`, `temi` (id di `data/temi.json`, il primo è il principale), `stato` (`da_verificare` o `verificata` con `verificata_il`), `aggiunta` (la data di oggi) e i campi del tipo (`vero`, `verdetto`, `autore`…).
3. Per `mondo`, `mito` e `storica` aggiungi sempre una `fonte`: link o riferimento che conferma il fatto.
4. In `data/testi/it/<tipo>.json` aggiungi la voce con lo stesso `id`: `testo` (massimo 220 caratteri), `hl` (identico a un pezzo di `testo`), `nota` e, dove serve, `opera`, `def`, `spunto`.
5. Aumenta di 1 `VERSIONE_DATI` in `js/dati.js` (vale per ogni modifica a `data/` o `i18n/`) **e** `VERSIONE_APP` in `sw.js` (la riga di `VERSIONE_DATI` sta in `js/dati.js`, che è un file dell'app: senza il secondo aumento chi ha installato il sito non vede i dati nuovi).
6. Lancia il controllo e correggi finché non passa:

```bash
node scripts/controlla.mjs
```

Per lavorare su una scheda senza mostrarla, usa `"stato": "bozza"`.

Per provare il limite giornaliero (spento sul sito) apri `http://localhost:8000/?limite=1`.

Tutti i campi e gli esempi sono in `data/SCHEMA.md`.

## Pubblicazione

È un sito statico: non serve nessuna compilazione. GitHub Pages pubblica il branch `main`, cartella `/ (root)`, all'indirizzo `https://raffaelewebdesigner.github.io/sottolineato/`. Ogni commit su `main` va online in circa un minuto: prima di unire un branch, controlla il sito in locale e lancia `node scripts/controlla.mjs`.

## Sito installato e offline

Il sito si installa sul telefono (Android: Chrome; iPhone: Safari, Condividi, Aggiungi alla schermata Home) e funziona senza rete grazie a `sw.js`, un service worker che tiene in cache i file dell'app e i dati.

**Quando pubblichi una versione nuova**, due numeri da aumentare di 1:

| Cosa hai cambiato | Cosa aumentare |
|---|---|
| `index.html`, `js/`, `fonts/`, `icone/`, `manifest.webmanifest` | `VERSIONE_APP` in `sw.js` |
| `data/` o `i18n/` | `VERSIONE_DATI` in `js/dati.js` **e** `VERSIONE_APP` in `sw.js` |

Chi ha già il sito vede «Nuova versione disponibile · Aggiorna»: toccando si ricarica con la versione nuova; altrimenti parte alla riapertura successiva. Un file nuovo in `js/` o `fonts/` (woff2) va aggiunto anche all'elenco `FILE_APP` di `sw.js`: `node scripts/controlla.mjs` lo verifica.

**Provare l'app installata**: serve un server locale (`python3 -m http.server 8000`) aperto con Chrome su `http://localhost:8000`. In DevTools, scheda Application: *Manifest* (installabilità), *Service workers* (stato, «Offline»), *Cache storage* (`sott-app-N` e `sott-dati`). Per provare l'aggiornamento: aumenta `VERSIONE_APP`, ricarica, compare l'avviso. Per provare la versione offline: Network, «Offline», ricarica. Per vedere l'invito a installare nel feed serve il terzo giorno d'uso: in console `localStorage.setItem("sott-giorni","[1,2,3]")` e ricarica. Su iPhone e Android reali il sito va aperto da un indirizzo HTTPS (GitHub Pages).

Se il sito finisce a un indirizzo diverso, aggiorna `og:url`, `og:image` e `canonical` in `index.html`.
