(async () => {
  // Lingua dell'interfaccia e dei contenuti: unico punto in cui si decide.
  const LINGUA = "it";
  const TIPI_DATI = ["frase", "idea", "parola", "sapevi", "storica", "mondo", "mito", "brillante"];
  const feed = document.getElementById("feed");
  document.documentElement.lang = LINGUA;

  // ——— Traduzioni dell'interfaccia ———
  const SVILUPPO = ["localhost", "127.0.0.1", ""].includes(location.hostname);
  let traduzioni = {};
  const mancanti = new Set();
  // t(chiave, valori): testo tradotto della chiave (es. gruppo.chiave), con i segnaposto {nome} sostituiti.
  // Se la chiave manca mostra la chiave stessa e, in sviluppo, avvisa in console.
  function t(chiave, valori = {}) {
    const testo = chiave.split(".").reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), traduzioni);
    if (typeof testo !== "string") {
      if (SVILUPPO && !mancanti.has(chiave)) { mancanti.add(chiave); console.warn(`Traduzione mancante: ${chiave}`); }
      return chiave;
    }
    return testo.replace(/\{(\w+)\}/g, (m, k) => (k in valori ? String(valori[k]) : m));
  }
  // Riempie gli elementi statici di index.html: data-i18n per il testo, data-i18n-<attributo> per gli attributi.
  function traduciPagina() {
    for (const n of document.querySelectorAll("[data-i18n]")) n.textContent = t(n.dataset.i18n);
    for (const attr of ["aria-label", "title"]) {
      for (const n of document.querySelectorAll(`[data-i18n-${attr}]`)) n.setAttribute(attr, t(n.getAttribute(`data-i18n-${attr}`)));
    }
  }

  // ——— Dati ———
  const json = p => fetch(p).then(r => { if (!r.ok) throw new Error(`${p}: ${r.status}`); return r.json(); });
  // Carica temi, schede (dati comuni) e testi nella lingua scelta, e ricompone ogni scheda:
  // tema è il nome del tema principale, temi resta la lista completa di id.
  async function caricaDati(lingua) {
    const [temi, ...parti] = await Promise.all([
      json("data/temi.json"),
      ...TIPI_DATI.map(tipo => Promise.all([json(`data/schede/${tipo}.json`), json(`data/testi/${lingua}/${tipo}.json`)])),
    ]);
    const nomeTema = new Map(temi.map(x => [x.id, x.nome[lingua] || x.nome.it]));
    const schede = [];
    for (const [base, testi] of parti) {
      for (const b of base) {
        if (b.stato === "bozza" || !testi[b.id]) continue; // bozze e schede senza testo in questa lingua non si mostrano
        schede.push({ ...b, ...testi[b.id], tema: nomeTema.get(b.temi[0]), temaId: b.temi[0] });
      }
    }
    return { schede, temi: temi.map(x => ({ id: x.id, nome: nomeTema.get(x.id), nomi: x.nome })) };
  }

  let dati;
  try {
    traduzioni = await json(`i18n/${LINGUA}.json`);
    traduciPagina();
    dati = await caricaDati(LINGUA);
  } catch (err) {
    console.error(err);
    document.getElementById("stato-caricamento").hidden = true;
    document.getElementById("stato-errore").hidden = false;
    return;
  }
  const TUTTI = dati.schede;
  const TEMI = dati.temi; // [{ id, nome, nomi }]
  const LIBRI = new Set(["frase", "idea", "parola", "sapevi"]);
  const NOMI_TIPI = {
    frase: t("tipi.frase"), idea: t("tipi.idea"), parola: t("tipi.parola"), sapevi: t("tipi.sapevi"),
    storica: t("tipi.storica"), mondo: t("tipi.mondo"), mito: t("tipi.mito"), brillante: t("tipi.brillante"),
  };
  const FILTRI_TIPO = [
    ["tutto", t("filtri.tutto")], ["libri", t("filtri.libri")], ["storica", t("filtri.storica")],
    ["mondo", t("filtri.mondo")], ["mito", t("filtri.mito")], ["brillante", t("filtri.brillante")], ["salvate", t("filtri.salvate")],
  ];
  const VERDETTI = {
    vera: [t("verdetti.vera"), "good", t("verdetti_frase.vera")],
    attribuita: [t("verdetti.attribuita"), "mid", t("verdetti_frase.attribuita")],
    mai: [t("verdetti.mai"), "bad", t("verdetti_frase.mai")],
  };
  const OPERE_LIBRI = [...new Set(TUTTI.filter(x => LIBRI.has(x.tipo)).map(x => x.opera))];

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    remove(k) { try { localStorage.removeItem(k); } catch {} },
  };

  // Migrazioni dei dati salvati nel browser, in ordine di versione.
  // sott-versione ricorda l'ultima eseguita. Le migrazioni future si aggiungono qui, con versione crescente.
  const MIGRAZIONI = [
    {
      versione: 1,
      // sott-tema: dal nome del tema («Storia») al suo id («storia»). Valori sconosciuti vengono rimossi.
      esegui() {
        const v = store.get("sott-tema", null);
        if (v === null) return;
        const tema = TEMI.find(x => x.id === v) || TEMI.find(x => Object.values(x.nomi).includes(v));
        if (tema) store.set("sott-tema", tema.id); else store.remove("sott-tema");
      },
    },
  ];
  function migra() {
    let versione = Number(store.get("sott-versione", 0)) || 0;
    for (const m of MIGRAZIONI) {
      if (m.versione <= versione) continue;
      m.esegui(); versione = m.versione; store.set("sott-versione", versione);
    }
  }
  migra();

  let salvate = new Set(store.get("sott-salvate", []));
  let imparate = new Set(store.get("sott-imparate", []));
  let filtroTipo = store.get("sott-tipo", "tutto");
  if (!FILTRI_TIPO.some(([k]) => k === filtroTipo)) filtroTipo = "tutto";
  let filtroTema = store.get("sott-tema", null); // id del tema
  if (filtroTema && !TEMI.some(x => x.id === filtroTema)) filtroTema = null;
  let seme = daySeed();

  const chipsTipo = document.getElementById("chips-tipo");
  const chipsTema = document.getElementById("chips-tema");
  const stats = document.getElementById("stats");

  const ICONS = {
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  };

  function daySeed() { const d = new Date(); return d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate(); }
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
  function shuffle(a, r = Math.random) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
  // Mescola evitando due schede dello stesso tipo (o tema) di fila, quando possibile.
  function mixVario(lista, seed) {
    const r = rng(seed); const pool = shuffle(lista, r); const out = [];
    while (pool.length) {
      const last = out[out.length - 1];
      let i = pool.findIndex(x => !last || (x.tipo !== last.tipo && x.tema !== last.tema));
      if (i < 0) i = pool.findIndex(x => !last || x.tipo !== last.tipo);
      if (i < 0) i = 0;
      out.push(pool.splice(i, 1)[0]);
    }
    return out;
  }
  function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  // Bottone con icona e testo; il testo sta in uno <span> da poter cambiare dopo.
  function bottoneAzione(icona, testo) {
    const b = el("button", "act"); b.type = "button"; b.innerHTML = icona; b.appendChild(el("span", null, testo)); return b;
  }

  function mainNode(f) {
    const cls = {
      frase: "q", storica: "q", idea: "q idea", brillante: "q idea", parola: "q parola", sapevi: "q sapevi", mondo: "q sapevi", mito: "q sapevi",
    }[f.tipo];
    const q = el(f.tipo === "frase" || f.tipo === "storica" ? "blockquote" : "p", cls);
    if (f.tipo !== "parola" && f.testo.length > 110) q.classList.add("long");
    const i = f.testo.indexOf(f.hl);
    const parts = i < 0 ? [[f.testo, false]] : [[f.testo.slice(0, i), false], [f.hl, true], [f.testo.slice(i + f.hl.length), false]];
    for (const [txt, hl] of parts) {
      const host = hl ? el("mark") : document.createDocumentFragment();
      txt.split("\n").forEach((line, k) => { if (k) host.appendChild(document.createElement("br")); host.appendChild(document.createTextNode(line)); });
      q.appendChild(host);
    }
    return q;
  }

  function sourceNode(f, extra) {
    const sep = t("scheda.separatore");
    const src = el("p", "src");
    src.append(el("b", null, f.autore));
    if (f.opera) src.append(document.createTextNode(sep), el(LIBRI.has(f.tipo) ? "i" : "span", null, f.opera));
    const meta = [f.rif, f.anno, extra].filter(Boolean).join(sep);
    if (meta) src.append(el("small", null, meta));
    return src;
  }

  function renderStats() { stats.textContent = t("intestazione.contatori", { imparate: imparate.size, salvate: salvate.size }); }
  function impara(id) { imparate.add(id); store.set("sott-imparate", [...imparate]); renderStats(); }

  function chip(label, pressed, onClick, id) {
    const b = el("button", "chip", label); b.type = "button"; b.id = id;
    b.setAttribute("aria-pressed", String(pressed)); b.addEventListener("click", onClick); return b;
  }
  function renderChips() {
    chipsTipo.replaceChildren(...FILTRI_TIPO.map(([k, label]) =>
      chip(label, filtroTipo === k, () => { filtroTipo = k; store.set("sott-tipo", k); renderChips(); renderFeed(); }, "tipo-" + k)));
    chipsTema.replaceChildren(...TEMI.map(x =>
      chip(x.nome, filtroTema === x.id, () => { filtroTema = filtroTema === x.id ? null : x.id; store.set("sott-tema", filtroTema); renderChips(); renderFeed(); }, "tema-" + x.id)));
  }

  // Domanda a scelta multipla dentro la scheda. Mentre è aperta, gli elementi .reveal restano sfocati.
  function makeQuiz(card, domanda, opzioni, giusta, { onRight, rightText, wrongText }) {
    const quiz = el("div", "quiz");
    const opts = el("div", "opts");
    const verdict = el("div", "verdict"); verdict.setAttribute("aria-live", "polite");
    quiz.append(el("p", null, domanda), opts, verdict);
    opzioni.forEach(o => {
      const b = el("button", "opt", o); b.type = "button";
      b.addEventListener("click", () => {
        opts.querySelectorAll(".opt").forEach(x => { x.disabled = true; if (x.textContent === giusta) x.classList.add("right"); });
        if (o === giusta) { verdict.textContent = rightText; onRight(); }
        else { b.classList.add("wrong"); verdict.textContent = wrongText; }
        card.classList.remove("quizzing");
      });
      opts.appendChild(b);
    });
    return quiz;
  }

  function badge(text, kind) { const b = el("span", "badge " + kind, text); return b; }

  function card(f, idx, tot) {
    const slide = el("section", "slide");
    const c = el("article", "card tipo-" + f.tipo);
    c.style.setProperty("--tint", `var(--t-${f.temaId})`);
    const head = el("div", "card-head");
    const label = el("span", "label");
    label.append(el("span", "kind", NOMI_TIPI[f.tipo]), document.createTextNode(t("scheda.separatore") + f.tema));
    head.append(label, el("span", "count", t("scheda.contatore", { n: idx + 1, tot })));

    const body = el("div", "body");
    body.appendChild(mainNode(f));
    let copyText;

    if (LIBRI.has(f.tipo)) {
      if (f.tipo === "parola") body.appendChild(el("p", "def", f.def));
      const extra = f.tipo === "frase" ? (f.trad ? t("scheda.traduzione_nostra") : "") : f.tipo === "idea" ? t("scheda.parole_nostre") : "";
      const src = sourceNode(f, extra); src.classList.add("reveal");
      body.append(src, el("p", "note reveal", f.nota));
      const valori = { testo: f.testo.replace(/\n/g, " "), def: f.def, autore: f.autore, opera: f.opera };
      copyText = f.tipo === "frase" ? t("copia.frase", valori) : f.tipo === "parola" ? t("copia.parola", valori) : t("copia.libro", { ...valori, testo: f.testo });
    } else if (f.tipo === "storica") {
      body.appendChild(sourceNode(f));
      const [vt, vk, vFrase] = VERDETTI[f.verdetto];
      const res = el("div", "reveal"); res.append(badge(vt, vk), el("p", "note", f.nota));
      body.appendChild(res);
      const scelte = [VERDETTI.vera[0], VERDETTI.attribuita[0], VERDETTI.mai[0]];
      body.appendChild(makeQuiz(c, t("quiz.domanda_storica"), scelte, vt, {
        onRight: () => impara(f.id), rightText: t("quiz.esatto"), wrongText: t("quiz.sbagliato_storica", { verdetto: vFrase }),
      }));
      c.classList.add("quizzing");
      copyText = t("copia.storica", { testo: f.testo, autore: f.autore, verdetto: vFrase, nota: f.nota });
    } else if (f.tipo === "mondo" || f.tipo === "mito") {
      const mito = f.tipo === "mito";
      const opzioni = mito ? [t("quiz.e_vero"), t("quiz.e_un_mito")] : [t("quiz.vero"), t("quiz.falso")];
      const giusta = f.vero ? opzioni[0] : opzioni[1];
      const etichetta = mito ? (f.vero ? t("quiz.confermato") : t("quiz.mito_sfatato")) : giusta;
      const sbagliato = mito ? (f.vero ? t("quiz.sbagliato_mito_vero") : t("quiz.sbagliato_mito_falso")) : (f.vero ? t("quiz.sbagliato_vero") : t("quiz.sbagliato_falso"));
      const res = el("div", "reveal"); res.append(badge(etichetta, f.vero ? "good" : "bad"), el("p", "note", f.nota));
      body.appendChild(res);
      body.appendChild(makeQuiz(c, mito ? t("quiz.domanda_mito") : t("quiz.domanda_mondo"), opzioni, giusta, {
        onRight: () => impara(f.id), rightText: t("quiz.esatto"), wrongText: sbagliato,
      }));
      c.classList.add("quizzing");
      copyText = t("copia.mondo", { testo: f.testo, risposta: etichetta, nota: f.nota });
    } else if (f.tipo === "brillante") {
      body.appendChild(el("p", "def", f.def));
      const sp = el("div", "spunto");
      sp.append(el("span", "spunto-label", t("scheda.come_tirarlo_fuori")), el("p", null, t("scheda.spunto", { spunto: f.spunto })));
      body.append(sp, el("p", "note", f.nota));
      if (f.autore) body.appendChild(sourceNode(f));
      copyText = f.spunto;
    }

    const actions = el("div", "actions");
    const bSave = bottoneAzione(ICONS.save, t("azioni.salva"));
    const syncSave = () => { const on = salvate.has(f.id); bSave.setAttribute("aria-pressed", String(on)); bSave.lastChild.textContent = on ? t("azioni.salvata") : t("azioni.salva"); };
    syncSave();
    bSave.addEventListener("click", () => { salvate.has(f.id) ? salvate.delete(f.id) : salvate.add(f.id); store.set("sott-salvate", [...salvate]); syncSave(); renderStats(); });
    actions.appendChild(bSave);

    if (LIBRI.has(f.tipo) && f.tipo !== "sapevi") {
      const bQuiz = bottoneAzione(ICONS.quiz, t("azioni.mettimi_alla_prova"));
      bQuiz.addEventListener("click", () => {
        body.querySelector(".quiz")?.remove();
        const scelte = shuffle([f.opera, ...shuffle(OPERE_LIBRI.filter(o => o !== f.opera)).slice(0, 2)]);
        const quiz = makeQuiz(c, f.tipo === "parola" ? t("quiz.domanda_parola") : t("quiz.domanda_libro"), scelte, f.opera, {
          onRight: () => impara(f.id), rightText: t("quiz.esatto_imparata"), wrongText: t("quiz.sbagliato_libro", { opera: f.opera }),
        });
        body.appendChild(quiz); c.classList.add("quizzing");
        quiz.querySelector(".opt").focus({ preventScroll: true });
      });
      actions.appendChild(bQuiz);
    }

    const copyLabel = f.tipo === "brillante" ? t("azioni.copia_frase") : t("azioni.copia");
    const bCopy = bottoneAzione(ICONS.copy, copyLabel);
    bCopy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(copyText); bCopy.lastChild.textContent = t("azioni.copiata"); }
      catch { const r = document.createRange(); r.selectNodeContents(body.querySelector(".q")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); bCopy.lastChild.textContent = t("azioni.testo_selezionato"); }
      setTimeout(() => { bCopy.lastChild.textContent = copyLabel; }, 1800);
    });
    actions.appendChild(bCopy);

    c.append(head, body, actions);
    slide.appendChild(c);
    return slide;
  }

  let observer, loader;
  const BLOCCO = 25;
  function renderFeed() {
    let lista = TUTTI;
    if (filtroTipo === "salvate") lista = lista.filter(f => salvate.has(f.id));
    else if (filtroTipo === "libri") lista = lista.filter(f => LIBRI.has(f.tipo));
    else if (filtroTipo !== "tutto") lista = lista.filter(f => f.tipo === filtroTipo);
    if (filtroTema) lista = lista.filter(f => f.temi.includes(filtroTema)); // qualsiasi posizione in temi
    lista = mixVario(lista, seme);

    feed.replaceChildren(); feed.scrollTop = 0;
    if (!lista.length) {
      const s = el("section", "slide"); const e = el("div", "card empty");
      const salv = filtroTipo === "salvate";
      e.append(el("strong", null, salv ? t("vuoto.salvate_titolo") : t("vuoto.titolo")),
        el("span", null, salv ? t("vuoto.salvate_testo") : t("vuoto.testo")));
      s.appendChild(e); feed.appendChild(s); return;
    }
    // Le schede si creano a blocchi mentre si scorre, così la pagina resta leggera anche con migliaia di schede.
    observer?.disconnect(); loader?.disconnect();
    observer = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.querySelector(".card").classList.add("seen"); }), { root: feed, threshold: .6 });
    let fatte = 0;
    const sentinella = el("div", "sentinella");
    const prossimoBlocco = () => {
      const fine = Math.min(fatte + BLOCCO, lista.length);
      for (; fatte < fine; fatte++) { const s = card(lista[fatte], fatte, lista.length); feed.insertBefore(s, sentinella); observer.observe(s); }
      if (fatte >= lista.length) { loader.disconnect(); sentinella.remove(); }
    };
    feed.appendChild(sentinella);
    loader = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) prossimoBlocco(); }, { root: feed, rootMargin: "300% 0px" });
    prossimoBlocco();
    if (fatte < lista.length) loader.observe(sentinella);
    requestAnimationFrame(() => feed.querySelector(".card")?.classList.add("seen"));
  }

  document.getElementById("mix").addEventListener("click", () => { seme = Math.floor(Math.random() * 1e9); renderFeed(); });
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); feed.scrollBy({ top: feed.clientHeight, behavior: "smooth" }); }
    if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); feed.scrollBy({ top: -feed.clientHeight, behavior: "smooth" }); }
  });

  document.getElementById("totale").textContent = t("app.totale", { n: TUTTI.length });
  renderChips(); renderFeed(); renderStats();
})();
