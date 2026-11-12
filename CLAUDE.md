# Sottolineato

Feed verticale di schede brevi per persone curiose: "TikTok per persone intelligenti". Una scheda alla volta, ognuna con un'idea da ricordare e la parte chiave evidenziata.

Oggi è un sito statico su GitHub Pages. L'obiettivo è trasformarlo in un'app per Android e iOS, in italiano e inglese, e pubblicarla solo quando è tutto pronto.

## Decisioni prese

- **Identità**: persone intelligenti e curiose. Il feed mescola tutti i tipi di scheda (libri, citazioni, vero o falso, miti, "da dire agli amici"). Non è un'app di sola crescita personale.
- **Lingue**: prima l'italiano, perfetto. Poi l'inglese. Ogni scelta tecnica deve già prevedere più lingue.
- **Nome**: "Sottolineato" è provvisorio. Non legare al nome percorsi, chiavi di storage o identificativi.
- **Guadagno (bozza)**: 10 schede gratis al giorno; ogni pubblicità con premio sblocca 5 schede, massimo 3 al giorno. Piani mensili: 2,99 € con 50 schede al giorno, 4,99 € con 140. I pagamenti arrivano solo alla fine: per ora il codice deve solo poter distinguere schede e funzioni gratis da quelle a pagamento.

## Com'è fatto oggi

- `index.html`: struttura e stile. Carica ogni file di contenuti con un `<script>`, poi `app.js`.
- `app.js`: feed, filtri, quiz, salvataggi (localStorage). Crea le schede a gruppi di 25 mentre si scorre.
- `contenuti.js`: definisce `window.TEMI` (24 temi) e `window.CONTENUTI`.
- Gli altri `.js` aggiungono schede con `window.CONTENUTI.push(...)`. I file `blocco-*.js`, `citazioni-6.js`, `miti-3.js` e `da-dire-4.js` usano un formato compatto con funzioni locali (`V`, `M`, `S`, `B`, `P`) che aggiungono un prefisso all'id.
- Circa 2.000 schede. Tipi e campi sono descritti nel README.

Nessuna compilazione: si apre `index.html` nel browser.

## Regole sui contenuti

Valgono per ogni scheda nuova o modificata.

- `id` unico e stabile. Non rinominare un id esistente: i salvataggi degli utenti dipendono dall'id.
- `tema` deve essere uno di `TEMI`.
- `hl` deve comparire identico dentro `testo`.
- `testo` breve: massimo circa 220 caratteri. La spiegazione va in `nota`.
- Diritti: citazioni alla lettera (`frase`) solo da opere di pubblico dominio; le traduzioni sono nostre (`trad: true`). Per i libri moderni si racconta l'idea con parole nostre. Niente testi di canzoni, niente battute di film.
- Solo fatti verificabili. Nel dubbio la scheda non entra. Per `vero`/`verdetto` la nota spiega perché.
- Tono: chiaro, curioso, mai saccente. Frasi brevi, italiano corretto.
- Ogni nuovo file di contenuti va aggiunto in `index.html` prima di `app.js`.

## Regole di lavoro

- Il sito pubblicato deve funzionare dopo ogni commit su `main`: GitHub Pages lo pubblica subito.
- Dopo ogni modifica ai contenuti, verificare: id unici, `hl` contenuto in `testo`, temi validi, nessun file `.js` non caricato.
- Commit in italiano, descrittivi.
- Non introdurre strumenti di build o dipendenze senza averlo deciso prima.
- Testi dell'interfaccia sempre in italiano, per ora scritti nel codice: verranno spostati in file di traduzione nella fase 1.

## Roadmap

1. **Fondamenta tecniche**: schema della scheda, contenuti in JSON per lingua, testi dell'interfaccia in file di traduzione, script di controllo, app.js in moduli, migrazione dei salvataggi.
2. **Contenuti**: guida di stile, verifica dei fatti, riequilibrio dei temi più deboli.
3. **Esperienza**: feed a schermo intero, onboarding, contatore giornaliero, scheda del giorno, condivisione come immagine.
4. **App web installabile**: manifest, offline.
5. **Inglese**.
6. **App nativa** con Capacitor.
7. **Monetizzazione**: pubblicità con premio e abbonamenti.
8. **Pre-lancio**, poi **pubblicazione**.

Fase attuale: 1, a partire dallo schema della scheda.
