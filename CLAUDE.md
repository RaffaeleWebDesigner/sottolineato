# Sottolineato

Feed verticale di schede brevi per persone curiose: "TikTok per persone intelligenti". Una scheda alla volta, ognuna con un'idea da ricordare e la parte chiave evidenziata.

Oggi è un sito statico su GitHub Pages. L'obiettivo è trasformarlo in un'app per Android e iOS, in italiano e inglese, e pubblicarla solo quando è tutto pronto.

## Decisioni prese

- **Identità**: persone intelligenti e curiose. Il feed mescola tutti i tipi di scheda (libri, citazioni, vero o falso, miti, "da dire agli amici"). Non è un'app di sola crescita personale.
- **Lingue**: prima l'italiano, perfetto. Poi l'inglese. Ogni scelta tecnica deve già prevedere più lingue.
- **Nome**: "Sottolineato" è provvisorio. Non legare al nome percorsi, chiavi di storage o identificativi.
- **Guadagno (bozza)**: 10 schede gratis al giorno; ogni pubblicità con premio sblocca 5 schede, massimo 3 al giorno. Piani mensili: 2,99 € con 50 schede al giorno, 4,99 € con 140. I pagamenti arrivano solo alla fine: per ora il codice deve solo poter distinguere schede e funzioni gratis da quelle a pagamento.

## Com'è fatto oggi

- `index.html`: struttura e stile (inline, per non aggiungere richieste). Carica solo `js/main.js` come modulo ES (`<script type="module">`). Elenca tutti i moduli di `js/` con `<link rel="modulepreload">` (`scripts/controlla.mjs` dà errore se ne manca uno: un modulo mancante allunga l'avvio di un giro di rete). Quattro viste (feed, esplora, salvate, profilo) più `#pro`, e la barra in basso.
- `js/`: moduli ES nativi, senza variabili globali su `window`.
  - Avvio: `main.js` fa partire subito il caricamento dei dati e importa `app.js`; `app.js` inizializza tutto, nell'ordine: migrazioni, salvataggi, cronologia, filtri, viste, feed; poi i testi delle schede.
  - Base: `i18n.js` (`LINGUA` e `LINGUE`, `t(chiave, valori)`, testi statici con `data-i18n`), `dati.js` (carica i JSON, `catalogo`, `VERSIONE_DATI`, `accessibile`, `riservata`), `store.js` (localStorage, `MIGRAZIONI`), `tempo.js` (giorni e date), `dom.js`.
  - Regole pure, senza browser: `ordine.js` (ordine del feed, scheda del giorno, ripasso) e `ricerca.js`.
  - Dati dell'utente: `salvataggi.js`, `cronologia.js` (viste, giorni, contatori, esiti dei quiz), `ripasso.js`, `preferenze.js` (categorie, tema, dimensione del testo), `giorno.js` (scheda del giorno e archivio), `limiti.js` (limite giornaliero, piani, `MOSTRA_PREMIUM`).
  - Viste: `nav.js` (hash), `feed.js`, `esplora.js`, `salvate.js`, `profilo.js`, `pro.js`, `onboarding.js`, `aperta.js` (scheda aperta a tutto schermo), `limiteui.js` (schermata del limite e pubblicità di prova).
  - Scheda: `scheda.js` (costruzione), `quiz.js`, `effetti.js` (coriandoli, scossone), `feedback.js` (vibrazione: `gioia()` ed `errore()`), `condividi.js` (immagine da condividere), `filtri.js`.
  - Installazione: `installa.js` (invito del browser su Android, istruzioni su iPhone, invito nel feed dal 3° giorno d'uso), `trasferimento.js` (esporta e importa i dati come codice o file).
  - Installazione e offline: `installazione.js` (registra `sw.js` a feed già in vista, avviso «Nuova versione disponibile», indicatore «Offline»).
- `i18n/it.json`: tutti i testi dell'interfaccia, raggruppati per area, con segnaposto `{n}`.
- `data/temi.json`: le 6 macro-categorie (`categorie`) e i 24 temi (`temi`), con `id` stabile, `nome` per lingua e `premium`. Ogni tema ha una `categoria`. Premium deciso: Mente e vita (solo sulla categoria; i temi restano `false` fino alla fase 7).
- `data/schede/<tipo>.json`: dati comuni a tutte le lingue. `data/testi/<lingua>/<tipo>.json`: testi, indicizzati per `id`. Oggi c'è solo `it`.
- `data/SCHEMA.md`: lo schema completo, con un esempio per tipo. È il riferimento per ogni scheda.
- `data/GUIDA.md`: la guida di stile e le fonti accettate.
- `data/verifica/REGISTRO.md`: il registro della verifica dei fatti (fase 2). Da lì riparte chi continua il lavoro.
- `sw.js` (radice): service worker; `manifest.webmanifest`; `fonts/` (woff2 e licenze OFL); `icone/` (PNG generate da `scripts/icone.mjs`). Vedi la sezione «Fase 4».
- `scripts/controlla.mjs`: controllo dei contenuti, delle chiavi di traduzione e dei `modulepreload`, nessuna dipendenza. `scripts/prova-ordine.mjs`: prova di `ordine.js` e `ricerca.js` senza browser. `scripts/contrasto.mjs`: contrasto dei colori (WCAG AA) nei due temi.
- 2.001 schede. Stato della verifica (verificate, in bozza, da verificare): vedi `data/verifica/REGISTRO.md`.

**`VERSIONE_DATI`** (in `js/dati.js`) va aumentata di 1 a ogni modifica di `data/` o `i18n/`. Si aggiunge come `?v=` a ogni richiesta JSON, così il browser non usa copie vecchie.

**`VERSIONE_APP`** (in `sw.js`) va aumentata di 1 a ogni modifica di `index.html`, `js/`, `fonts/`, `icone/` o `manifest.webmanifest`. Quindi **anche quando si aumenta `VERSIONE_DATI`** (sta in `js/dati.js`): le due righe vanno sempre insieme. Senza questo, chi ha già il sito installato continua a vedere i file vecchi.

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
- `sott-categoria`: id della categoria usata come filtro del feed, o `null`.
- `sott-vista`: `{ id: giorno }`, l'ultimo giorno in cui la scheda è stata vista (a schermo almeno 1,5 s). Solo id e numeri, sotto i 100 KB. Il «giorno» è un intero: i giorni dal 1970 secondo il calendario locale.
- `sott-giorni`: lista dei giorni con almeno una scheda vista (per i giorni consecutivi).
- `sott-oggi`: `{ g, nuove, extra, video, giornoVisto }`, i contatori del giorno corrente; si azzerano al cambio di giorno.
- `sott-quiz`: `{ id: 1 | 0 }`, ultimo esito del quiz di ogni scheda.
- `sott-ripasso`: `{ id: [passi, ultimoGiorno] }`, il ripasso delle salvate.
- `sott-del-giorno`: `{ giorno: id }`, le schede del giorno già mostrate (così l'archivio non cambia).
- `sott-installata`: il giorno del primo avvio con la fase 3 (inizio dell'archivio).
- `sott-invito-installa`: `true` quando l'invito a installare nel feed è stato chiuso o usato (non si ripropone). Legato al dispositivo: l'esportazione dei dati non lo include.
- `sott-onboarding`: `true` dopo l'onboarding (o per chi era già utente). `sott-interessi`: lista di id di categorie scelte.
- `sott-aspetto`: `sistema`, `chiaro` o `scuro`. `sott-testo`: dimensione del testo, 1, 2 o 3. `sott-lingua`: lingua scelta (solo se `LINGUE` ne avrà più di una).

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

## Fase 3: l'esperienza da app

Branch `fase-3-esperienza`. Niente pagamenti, pubblicità vere o notifiche: si preparano solo l'interfaccia e la logica.

- **Struttura**: barra in basso con Feed, Esplora, Salvate, Profilo; navigazione con l'hash (`#feed`, `#esplora`, `#salvate`, `#profilo`, più `#ripasso` e `#pro`). All'apertura si va sempre al feed. Il feed usa `100dvh`. Il filtro (tipo, tema, categoria) si sceglie in Esplora e nel feed resta una pillola che lo toglie.
- **Ordine del feed** (`ordine.js`, funzione pura): prima le mai viste, poi le viste da più tempo; mai più di 2 dello stesso tipo né 3 dello stesso tema di fila, se possibile; circa il 30% fuori dalle categorie preferite; a parità di condizioni prima le `verificata`. Provato da `scripts/prova-ordine.mjs`: va rilanciato dopo ogni modifica a `ordine.js` o `ricerca.js`.
- **Quiz** (Vero o falso, Miti, Citazioni storiche, «Mettimi alla prova»): prima della risposta il DOM della scheda non contiene nota, bollino né fonte, nemmeno nascosti; si creano dopo la risposta. Nelle citazioni storiche l'autore sta dentro la domanda. «Copia» e «Condividi» prima della risposta non la includono. Con `prefers-reduced-motion` niente coriandoli né scossone. La vibrazione sta solo in `feedback.js` (la fase 6 la collegherà a Capacitor).
- **Limite giornaliero** (`limiti.js`): `LIMITE_ATTIVO = false`; si accende solo con `?limite=1`. Conta le schede nuove viste nel giorno locale; non contano ripasso, salvate e scheda del giorno. La pubblicità è finta. `piano` è sempre `gratis`: la fase 7 lo collegherà agli acquisti. `MOSTRA_PREMIUM = false`.
- **Scheda del giorno**: scelta tra le `verificata` dalla data (`schedaDelGiorno` in `ordine.js`), uguale per tutti con lo stesso elenco; se l'elenco cambia, i giorni già mostrati restano quelli ricordati in `sott-del-giorno`.
- **Avvio veloce**: `main.js` avvia i dati senza aspettare gli altri moduli; solo `main`, `i18n`, `dati` e `store` hanno priorità alta nei `modulepreload`, gli altri `fetchpriority="low"`; i caratteri di Google Fonts non bloccano l'avvio (`media="print"` con `onload`). Un modulo nuovo va aggiunto ai `modulepreload` (con `fetchpriority="low"`, salvo che serva a far partire i dati). La prima scheda visibile deve restare entro +0,3 s rispetto alla misura di fine fase 1.
- **Accessibilità**: colori controllati con `scripts/contrasto.mjs` (4,5:1 in tutte le coppie, in entrambi i temi); se si cambia un colore in `index.html` va rilanciato. Tema chiaro/scuro/di sistema e testo su tre livelli si applicano da uno script in `<head>` per evitare il lampo del tema sbagliato.
- **Lingue**: se `LINGUE` in `i18n.js` avrà più di una lingua, l'onboarding mostra da solo la scelta della lingua.

## Fase 4 — sito installabile e offline (in corso, branch `fase-4-installabile`)

- **Caratteri**: in `fonts/` (woff2 + licenza OFL accanto), con `@font-face` in `index.html`. Nessuna richiesta a Google. Si precarica solo Instrument Sans.
- **Manifest e icone**: `manifest.webmanifest`, icone PNG in `icone/` (generate da `scripts/icone.mjs`, che usa Playwright e non fa parte del sito). **Nome provvisorio**: quando ci sarà il nome definitivo va cambiato in `manifest.webmanifest` (`name`, `short_name`, `shortcuts`) e in `index.html` (`apple-mobile-web-app-title`).
- Le scorciatoie del manifest aprono `./?apri=feed` (la scheda del giorno è la prima del feed) e `./?apri=salvate`; `nav.js` legge `?apri=` all'avvio e ripulisce l'indirizzo.
