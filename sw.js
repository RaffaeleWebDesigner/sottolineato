// Service worker: fa funzionare il sito senza rete e lo rende quasi immediato dalla seconda apertura.
// Un file classico (non un modulo) nella radice del sito, così il suo scope copre tutto.
//
// VERSIONE_APP: va aumentata di 1 a ogni modifica di index.html, js/, fonts/, icone/ o manifest.webmanifest
// (quindi anche quando si aumenta VERSIONE_DATI, che sta in js/dati.js). Dà il nome alla cache dell'app:
// con un numero nuovo il browser vede un sw.js diverso, scarica i file nuovi e li tiene in attesa
// finché l'utente tocca «Aggiorna» o riapre il sito.
const VERSIONE_APP = 1;

const CACHE_APP = `sott-app-${VERSIONE_APP}`;
const CACHE_DATI = "sott-dati"; // JSON dei contenuti e delle traduzioni, per indirizzo esatto (con ?v=VERSIONE_DATI)

// File dell'app, relativi alla cartella di sw.js. Ogni file di js/ e di fonts/ (woff2) deve stare qui:
// lo verifica scripts/controlla.mjs.
const FILE_APP = [
  "index.html",
  "manifest.webmanifest",
  "favicon.svg",
  "icone/icon-192.png",
  "icone/icon-512.png",
  "icone/icon-maskable-512.png",
  "icone/apple-touch-icon.png",
  "fonts/InstrumentSans-normal-latin.woff2",
  "fonts/InstrumentSans-normal-latin-ext.woff2",
  "fonts/Newsreader-normal-latin.woff2",
  "fonts/Newsreader-normal-latin-ext.woff2",
  "fonts/Newsreader-italic-latin.woff2",
  "fonts/Newsreader-italic-latin-ext.woff2",
  "js/aperta.js",
  "js/app.js",
  "js/condividi.js",
  "js/cronologia.js",
  "js/dati.js",
  "js/dom.js",
  "js/effetti.js",
  "js/esplora.js",
  "js/feed.js",
  "js/feedback.js",
  "js/filtri.js",
  "js/giorno.js",
  "js/i18n.js",
  "js/installa.js",
  "js/installazione.js",
  "js/limiteui.js",
  "js/limiti.js",
  "js/main.js",
  "js/nav.js",
  "js/onboarding.js",
  "js/ordine.js",
  "js/preferenze.js",
  "js/pro.js",
  "js/profilo.js",
  "js/quiz.js",
  "js/ricerca.js",
  "js/ripasso.js",
  "js/salvataggi.js",
  "js/salvate.js",
  "js/scheda.js",
  "js/store.js",
  "js/tempo.js",
  "js/trasferimento.js",
];

const BASE = new URL("./", self.location).pathname; // es. /sottolineato/ oppure /
const FILE_APP_PERCORSI = new Set(FILE_APP.map(f => BASE + f));

// ——— Installazione: scarica i file dell'app nella cache di questa versione. ———
// cache: "reload" salta la cache HTTP del browser (GitHub Pages ne imposta una di 10 minuti): così una versione
// nuova non si ritrova file vecchi mescolati ai nuovi.
// Niente skipWaiting: la versione nuova aspetta che l'utente la accetti o riapra il sito.
self.addEventListener("install", evento => {
  evento.waitUntil((async () => {
    const cache = await caches.open(CACHE_APP);
    await Promise.all(FILE_APP.map(async f => {
      const risposta = await fetch(new Request(f, { cache: "reload" }));
      if (!risposta.ok) throw new Error(`${f}: ${risposta.status}`);
      await cache.put(f, risposta);
    }));
  })());
});

// ——— Attivazione: toglie le cache delle versioni precedenti dell'app. ———
self.addEventListener("activate", evento => {
  evento.waitUntil((async () => {
    for (const nome of await caches.keys()) {
      if (nome.startsWith("sott-app-") && nome !== CACHE_APP) await caches.delete(nome);
    }
    await self.clients.claim();
  })());
});

// ——— Messaggi dalla pagina (js/installazione.js). ———
self.addEventListener("message", evento => {
  const m = evento.data || {};
  // «Aggiorna»: la versione in attesa diventa attiva.
  if (m.tipo === "attiva") self.skipWaiting();
  // Dati: la pagina manda gli indirizzi esatti (con ?v=VERSIONE_DATI). Si scaricano quelli che mancano e si
  // eliminano le copie delle versioni precedenti. I testi (pesanti) si scaricano in sottofondo e solo se la pagina lo permette
  // (scaricaTesti è false con il risparmio dati); quelli già in cache restano comunque.
  if (m.tipo === "dati") evento.waitUntil(scaricaDati(m.essenziali || [], m.testi || [], m.scaricaTesti === true));
});

async function scaricaDati(essenziali, testi, scaricaTesti) {
  const cache = await caches.open(CACHE_DATI);
  const scarica = async indirizzo => {
    if (await cache.match(indirizzo)) return;
    try {
      const risposta = await fetch(indirizzo);
      if (risposta.ok) await cache.put(indirizzo, risposta);
    } catch { /* senza rete si riprova alla prossima apertura */ }
  };
  await Promise.all(essenziali.map(scarica));
  if (scaricaTesti) for (const indirizzo of testi) await scarica(indirizzo); // uno alla volta, in sottofondo
  // Pulizia: via ogni copia che non è tra gli indirizzi correnti.
  const buoni = new Set([...essenziali, ...testi].map(i => new URL(i, self.location).href));
  for (const richiesta of await cache.keys()) {
    if (!buoni.has(richiesta.url)) await cache.delete(richiesta);
  }
}

// ——— Richieste. Solo GET dello stesso sito: il resto passa dalla rete, senza cache. ———
self.addEventListener("fetch", evento => {
  const richiesta = evento.request;
  if (richiesta.method !== "GET") return;
  const url = new URL(richiesta.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(BASE)) return;

  // Navigazione: sempre index.html dalla cache, anche senza rete. Gli indirizzi come ?apri=salvate funzionano uguale.
  if (richiesta.mode === "navigate") {
    evento.respondWith(daCacheApp("index.html", richiesta));
    return;
  }
  // File dell'app: dalla cache, prima di tutto.
  if (FILE_APP_PERCORSI.has(url.pathname)) {
    evento.respondWith(daCacheApp(url.pathname.slice(BASE.length), richiesta));
    return;
  }
  // Dati e traduzioni: dalla cache per indirizzo esatto; se mancano, dalla rete e poi si salvano.
  if (url.pathname.startsWith(BASE + "data/") || url.pathname.startsWith(BASE + "i18n/")) {
    evento.respondWith(daCacheDati(richiesta));
    return;
  }
  // Tutto il resto (og.png, sw.js...): rete, senza cache.
});

async function daCacheApp(file, richiesta) {
  const cache = await caches.open(CACHE_APP);
  const trovato = await cache.match(file);
  if (trovato) return trovato;
  return fetch(richiesta);
}

async function daCacheDati(richiesta) {
  const cache = await caches.open(CACHE_DATI);
  const trovato = await cache.match(richiesta);
  if (trovato) return trovato;
  try {
    const risposta = await fetch(richiesta);
    if (risposta.ok) await cache.put(richiesta, risposta.clone());
    return risposta;
  } catch (errore) {
    // Un file di testi che non è in cache e non si può scaricare: risposta vuota (non salvata). Per la pagina è come
    // «nessuna scheda di questo tipo ha testo»: le toglie dal feed, senza errori in console.
    if (new URL(richiesta.url).pathname.includes("/data/testi/")) {
      return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
    }
    throw errore;
  }
}
