# Sottolineato

Feed verticale di schede brevi per persone curiose: "TikTok per persone intelligenti". Una scheda alla volta, ognuna con un'idea da ricordare e la parte chiave evidenziata.

Oggi è un sito statico su GitHub Pages. L'obiettivo è trasformarlo in un'app per Android e iOS, in italiano e inglese, e pubblicarla solo quando è tutto pronto.

## Decisioni prese

- **Identità**: persone intelligenti e curiose. Il feed mescola tutti i tipi di scheda (libri, citazioni, vero o falso, miti, "da dire agli amici"). Non è un'app di sola crescita personale.
- **Lingue**: prima l'italiano, perfetto. Poi l'inglese. Ogni scelta tecnica deve già prevedere più lingue.
- **Nome**: "Sottolineato" è provvisorio. Non legare al nome percorsi, chiavi di storage o identificativi.
- **Guadagno (bozza)**: 10 schede gratis al giorno; ogni pubblicità con premio sblocca 5 schede, massimo 3 al giorno. Piani mensili: 2,99 € con 50 schede al giorno, 4,99 € con 140. I pagamenti arrivano solo alla fine: per ora il codice deve solo poter distinguere schede e funzioni gratis da quelle a pagamento.

## Com'è fatto oggi

- `index.html`: struttura e stile. Carica solo `js/main.js` come modulo ES (`<script type="module">`). Elenca tutti i moduli di `js/` con `<link rel="modulepreload">`: un modulo nuovo va aggiunto lì, altrimenti funziona lo stesso ma si scarica più tardi.
- `js/`: moduli ES nativi, senza variabili globali su `window`.
  - `main.js`: avvio, nell'ordine: traduzioni e indice delle schede, migrazioni, salvataggi, filtri, feed; poi i testi delle schede.
  - `i18n.js`: `LINGUA` (unico punto in cui si sceglie la lingua), `t(chiave, valori)`, testi statici con `data-i18n`.
  - `dati.js`: carica i JSON con `fetch` e ricompone le schede. Contiene `VERSIONE_DATI`. Mostra solo le schede con `stato` diverso da `bozza` e con testo nella lingua corrente. Contiene `accessibile(scheda, piano)` (oggi sempre `true`, non ancora usata) e `riservata(scheda)`: una scheda è a pagamento solo se tutti i suoi temi sono `premium`.
  - `store.js`: lettura e scrittura del localStorage, lista `MIGRAZIONI`.
  - `salvataggi.js`: schede salvate e imparate, contatore.
  - `filtri.js`: filtri per tipo e tema.
  - `quiz.js`: domande a scelta multipla.
  - `feed.js`: costruzione delle schede, a gruppi di 25 mentre si scorre; Rimescola e tastiera.
  - `dom.js`: piccoli aiuti per creare elementi.
- `i18n/it.json`: tutti i testi dell'interfaccia, raggruppati per area, con segnaposto `{n}`.
- `data/temi.json`: le 6 macro-categorie (`categorie`) e i 24 temi (`temi`), con `id` stabile, `nome` per lingua e `premium`. Ogni tema ha una `categoria`. Premium deciso: Mente e vita (solo sulla categoria; i temi restano `false` fino alla fase 7).
- `data/schede/<tipo>.json`: dati comuni a tutte le lingue. `data/testi/<lingua>/<tipo>.json`: testi, indicizzati per `id`. Oggi c'è solo `it`.
- `data/SCHEMA.md`: lo schema completo, con un esempio per tipo. È il riferimento per ogni scheda.
- `data/GUIDA.md`: la guida di stile e le fonti accettate.
- `data/verifica/REGISTRO.md`: il registro della verifica dei fatti (fase 2). Da lì riparte chi continua il lavoro.
- `scripts/controlla.mjs`: controllo dei contenuti e delle chiavi di traduzione, nessuna dipendenza.
- 2.001 schede. Stato della verifica (verificate, in bozza, da verificare): vedi `data/verifica/REGISTRO.md`.

**`VERSIONE_DATI`** (in `js/dati.js`) va aumentata di 1 a ogni modifica di `data/` o `i18n/`. Si aggiunge come `?v=` a ogni richiesta JSON, così il browser non usa copie vecchie.

Caricamento, in due passi:
1. Traduzioni, `data/temi.json` e tutti i `data/schede/<tipo>.json`: bastano per conteggi, filtri e ordine del feed.
2. I testi `data/testi/<lingua>/<tipo>.json`: prima quello del tipo della prima scheda in vista, da solo, poi tutti gli altri insieme.

Il feed crea le schede in ordine e si ferma alla prima il cui testo non è ancora arrivato. Se a una scheda manca il testo nella lingua corrente, viene tolta, e conteggi e feed si ricalcolano. In italiano non succede: `controlla.mjs` lo considera un errore.

Misure del 12 novembre 2026:
- Peso dei JSON: 828 KB, 231 KB con gzip. Di questi, `schede/` e temi sono 28 KB in gzip, i testi italiani 201 KB.
- Tempo alla prima scheda visibile: server locale HTTP/2 con gzip, come GitHub Pages; Chrome con i preset di rete di DevTools; cache vuota; mediana di 5 prove.

| | Fast 4G | Slow 4G |
|---|---|---|
| Prima (tutti i JSON in parallelo, dopo le traduzioni) | 1,34 s | 4,89 s |
| Con `modulepreload` e traduzioni in parallelo ai dati | 0,98 s | 3,88 s |
| Con il caricamento in due passi (oggi) | 0,91 s | 3,45 s |

Su Slow 4G (562 ms di latenza) restano tre attese in fila, ognuna di almeno una latenza: HTML (0,6 s), moduli e indice (fino a 2,2 s), testo della prima scheda (fino a 3,6 s, con `mondo` da 81 KB). Per scendere sotto 2 s servirebbe dividere i file di testi in pezzi più piccoli: è un cambio di formato dei dati, da decidere.

Nessuna compilazione, ma serve un server locale (`python3 -m http.server 8000`, poi `http://localhost:8000`): aprendo `index.html` da file i dati non si caricano.

Chiavi di localStorage (non cambiarle né cambiarne il formato senza una migrazione):

- `sott-salvate`, `sott-imparate`: liste di id di schede.
- `sott-tipo`: filtro per tipo (`tutto`, `libri`, `storica`, `mondo`, `mito`, `brillante`, `salvate`). Valori interni, non dipendono dalla lingua.
- `sott-tema`: id del tema selezionato (es. `storia`) o `null`. Fino alla versione 0 conteneva il nome italiano («Storia»).
- `sott-versione`: numero dell'ultima migrazione eseguita. Oggi `1`.

Migrazioni: si aggiungono in un unico punto, la lista `MIGRAZIONI`, con versione crescente. All'avvio si eseguono solo quelle con versione maggiore di `sott-versione`. Versione 1: `sott-tema` passa dal nome del tema al suo id; un valore sconosciuto viene rimosso.

Il filtro per tema trova una scheda se il tema è in qualsiasi posizione del suo array `temi`.

## Regole sui contenuti

Valgono per ogni scheda nuova o modificata.

- Ogni scheda nuova segue `data/GUIDA.md`: tono, struttura per tipo, italiano, fonti accettate.
- Formato: dati comuni in `data/schede/<tipo>.json`, testi in `data/testi/it/<tipo>.json`, come descritto in `data/SCHEMA.md`.
- `id` unico e stabile. Non rinominare un id esistente: i salvataggi degli utenti dipendono dall'id.
- `temi`: almeno uno, tutti presenti in `data/temi.json`; il primo è il tema principale. Non aggiungere temi alle schede in automatico.
- Le schede nuove di tipo `mondo`, `mito` e `storica` hanno sempre una `fonte`. Le schede nuove nascono `da_verificare` o `bozza`; `verificata` solo dopo un controllo, con `verificata_il`.
- `hl` deve comparire identico dentro `testo`.
- `testo` breve: massimo circa 220 caratteri. La spiegazione va in `nota`.
- Diritti: citazioni alla lettera (`frase`) solo da opere di pubblico dominio; le traduzioni sono nostre (`trad: true`). Per i libri moderni si racconta l'idea con parole nostre. Niente testi di canzoni, niente battute di film.
- Solo fatti verificabili. Nel dubbio la scheda non entra. Per `vero`/`verdetto` la nota spiega perché.
- Tono: chiaro, curioso, mai saccente. Frasi brevi, italiano corretto.

## Regole di lavoro

- Il sito pubblicato deve funzionare dopo ogni commit su `main`: GitHub Pages lo pubblica subito.
- Dopo ogni modifica ai contenuti, `node scripts/controlla.mjs` deve finire senza errori (controlla id, testi, temi, campi obbligatori, stato, fonte, lunghezza).
- Prima di unire un branch su `main`, provare il sito da server locale: feed, filtri per tipo e tema, quiz, salvate.
- Commit in italiano, descrittivi.
- Non introdurre strumenti di build o dipendenze senza averlo deciso prima.
- Testi dell'interfaccia: mai scritti nel codice. Vanno in `i18n/<lingua>.json` e si leggono con `t(chiave, valori)` o, in `index.html`, con `data-i18n`.

## Roadmap

1. **Fondamenta tecniche**: schema della scheda, contenuti in JSON per lingua, testi dell'interfaccia in file di traduzione, script di controllo, codice in moduli, migrazione dei salvataggi.
2. **Contenuti**: guida di stile, verifica dei fatti, riequilibrio dei temi più deboli.
3. **Esperienza**: feed a schermo intero, onboarding, contatore giornaliero, scheda del giorno, condivisione come immagine.
4. **App web installabile**: manifest, offline.
5. **Inglese**.
6. **App nativa** con Capacitor.
7. **Monetizzazione**: pubblicità con premio e abbonamenti.
8. **Pre-lancio**, poi **pubblicazione**.

Fase attuale: 2, in corso sul branch `fase-2-contenuti`. Lo stato aggiornato è in `data/verifica/REGISTRO.md`.
