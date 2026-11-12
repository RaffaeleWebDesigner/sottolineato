(async () => {
  const LINGUA = "it";
  const TIPI_DATI = ["frase", "idea", "parola", "sapevi", "storica", "mondo", "mito", "brillante"];
  const feed = document.getElementById("feed");

  // Carica temi, schede (dati comuni) e testi nella lingua scelta, e ricompone ogni scheda
  // con gli stessi campi usati dal resto del codice: tema è il nome del tema principale.
  async function caricaDati(lingua) {
    const json = p => fetch(p).then(r => { if (!r.ok) throw new Error(`${p}: ${r.status}`); return r.json(); });
    const [temi, ...parti] = await Promise.all([
      json("data/temi.json"),
      ...TIPI_DATI.map(t => Promise.all([json(`data/schede/${t}.json`), json(`data/testi/${lingua}/${t}.json`)])),
    ]);
    const nomeTema = new Map(temi.map(t => [t.id, t.nome[lingua] || t.nome.it]));
    const schede = [];
    for (const [base, testi] of parti) {
      for (const b of base) {
        if (b.stato === "bozza" || !testi[b.id]) continue; // bozze e schede senza testo in questa lingua non si mostrano
        schede.push({ ...b, ...testi[b.id], tema: nomeTema.get(b.temi[0]), temaId: b.temi[0] });
      }
    }
    return { schede, temi: temi.map(t => ({ id: t.id, nome: nomeTema.get(t.id), nomi: t.nome })) };
  }

  function messaggio(titolo, testo) {
    const s = document.createElement("section"); s.className = "slide";
    const e = document.createElement("div"); e.className = "card empty";
    const st = document.createElement("strong"); st.textContent = titolo;
    const sp = document.createElement("span"); sp.textContent = testo;
    e.append(st, sp); s.appendChild(e); feed.replaceChildren(s);
  }

  messaggio("Caricamento…", "Sto preparando le schede.");
  let dati;
  try { dati = await caricaDati(LINGUA); }
  catch (err) {
    console.error(err);
    messaggio("Non riesco a caricare le schede", "Se hai aperto il file direttamente dal computer, avvia un server locale: le istruzioni sono nel README.");
    return;
  }
  const TUTTI = dati.schede;
  const TEMI = dati.temi; // [{ id, nome, nomi }]
  const LIBRI = new Set(["frase", "idea", "parola", "sapevi"]);
  const TIPI = {
    frase: "Frase", idea: "L'idea", parola: "Parola", sapevi: "Dietro il libro",
    storica: "Citazione storica", mondo: "Vero o falso?", mito: "Mito o realtà?", brillante: "Da dire agli amici",
  };
  const FILTRI_TIPO = [
    ["tutto", "Tutto"], ["libri", "Libri e opere"], ["storica", "Citazioni storiche"],
    ["mondo", "Vero o falso"], ["mito", "Miti"], ["brillante", "Da dire agli amici"], ["salvate", "Salvate"],
  ];
  const VERDETTI = { vera: ["Detta davvero", "good"], attribuita: ["Attribuita", "mid"], mai: ["Mai detta così", "bad"] };
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
        const tema = TEMI.find(t => t.id === v) || TEMI.find(t => Object.values(t.nomi).includes(v));
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
  if (filtroTema && !TEMI.some(t => t.id === filtroTema)) filtroTema = null;
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
    const src = el("p", "src");
    src.append(el("b", null, f.autore));
    if (f.opera) src.append(document.createTextNode(" · "), el(LIBRI.has(f.tipo) ? "i" : "span", null, f.opera));
    const meta = [f.rif, f.anno].filter(Boolean).join(" · ") + (extra || "");
    if (meta) src.append(el("small", null, meta));
    return src;
  }

  function renderStats() { stats.textContent = `${imparate.size} imparate · ${salvate.size} salvate`; }
  function impara(id) { imparate.add(id); store.set("sott-imparate", [...imparate]); renderStats(); }

  function chip(label, pressed, onClick, id) {
    const b = el("button", "chip", label); b.type = "button"; b.id = id;
    b.setAttribute("aria-pressed", String(pressed)); b.addEventListener("click", onClick); return b;
  }
  function renderChips() {
    chipsTipo.replaceChildren(...FILTRI_TIPO.map(([k, label]) =>
      chip(label, filtroTipo === k, () => { filtroTipo = k; store.set("sott-tipo", k); renderChips(); renderFeed(); }, "tipo-" + k)));
    chipsTema.replaceChildren(...TEMI.map(t =>
      chip(t.nome, filtroTema === t.id, () => { filtroTema = filtroTema === t.id ? null : t.id; store.set("sott-tema", filtroTema); renderChips(); renderFeed(); }, "tema-" + t.id)));
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
    label.append(el("span", "kind", TIPI[f.tipo]), document.createTextNode(" · " + f.tema));
    head.append(label, el("span", "count", `${idx + 1} / ${tot}`));

    const body = el("div", "body");
    body.appendChild(mainNode(f));
    let copyText;

    if (LIBRI.has(f.tipo)) {
      if (f.tipo === "parola") body.appendChild(el("p", "def", f.def));
      const extra = f.tipo === "frase" ? (f.trad ? " · traduzione nostra" : "") : f.tipo === "idea" ? " · raccontata con parole nostre" : "";
      const src = sourceNode(f, extra); src.classList.add("reveal");
      body.append(src, el("p", "note reveal", f.nota));
      const head = f.tipo === "frase" ? `«${f.testo.replace(/\n/g, " ")}»` : f.tipo === "parola" ? `${f.testo}: ${f.def}` : f.testo;
      copyText = `${head} — ${f.autore}, ${f.opera}`;
    } else if (f.tipo === "storica") {
      body.appendChild(sourceNode(f));
      const [vt, vk] = VERDETTI[f.verdetto];
      const res = el("div", "reveal"); res.append(badge(vt, vk), el("p", "note", f.nota));
      body.appendChild(res);
      const scelte = ["Detta davvero", "Attribuita", "Mai detta così"];
      body.appendChild(makeQuiz(c, "L'ha detta davvero?", scelte, vt, {
        onRight: () => impara(f.id), rightText: "Esatto.", wrongText: `No: ${vt.toLowerCase()}.`,
      }));
      c.classList.add("quizzing");
      copyText = `«${f.testo}» — ${f.autore}. Verdetto: ${vt.toLowerCase()}. ${f.nota}`;
    } else if (f.tipo === "mondo" || f.tipo === "mito") {
      const mito = f.tipo === "mito";
      const giusta = mito ? (f.vero ? "È vero" : "È un mito") : (f.vero ? "Vero" : "Falso");
      const etichetta = mito ? (f.vero ? "Confermato" : "Mito sfatato") : giusta;
      const res = el("div", "reveal"); res.append(badge(etichetta, f.vero ? "good" : "bad"), el("p", "note", f.nota));
      body.appendChild(res);
      body.appendChild(makeQuiz(c, mito ? "Mito o realtà?" : "Che ne dici?", mito ? ["È vero", "È un mito"] : ["Vero", "Falso"], giusta, {
        onRight: () => impara(f.id), rightText: "Esatto.", wrongText: mito ? (f.vero ? "No, è vero." : "No, è un mito.") : `No, è ${giusta.toLowerCase()}.`,
      }));
      c.classList.add("quizzing");
      copyText = `${f.testo} ${etichetta}. ${f.nota}`;
    } else if (f.tipo === "brillante") {
      body.appendChild(el("p", "def", f.def));
      const sp = el("div", "spunto");
      sp.append(el("span", "spunto-label", "Come tirarlo fuori"), el("p", null, `«${f.spunto}»`));
      body.append(sp, el("p", "note", f.nota));
      if (f.autore) body.appendChild(sourceNode(f));
      copyText = f.spunto;
    }

    const actions = el("div", "actions");
    const bSave = el("button", "act"); bSave.type = "button"; bSave.innerHTML = ICONS.save + "<span>Salva</span>";
    const syncSave = () => { const on = salvate.has(f.id); bSave.setAttribute("aria-pressed", String(on)); bSave.lastChild.textContent = on ? "Salvata" : "Salva"; };
    syncSave();
    bSave.addEventListener("click", () => { salvate.has(f.id) ? salvate.delete(f.id) : salvate.add(f.id); store.set("sott-salvate", [...salvate]); syncSave(); renderStats(); });
    actions.appendChild(bSave);

    if (LIBRI.has(f.tipo) && f.tipo !== "sapevi") {
      const bQuiz = el("button", "act"); bQuiz.type = "button"; bQuiz.innerHTML = ICONS.quiz + "<span>Mettimi alla prova</span>";
      bQuiz.addEventListener("click", () => {
        body.querySelector(".quiz")?.remove();
        const scelte = shuffle([f.opera, ...shuffle(OPERE_LIBRI.filter(o => o !== f.opera)).slice(0, 2)]);
        const quiz = makeQuiz(c, f.tipo === "parola" ? "Da quale opera viene?" : "Da quale libro?", scelte, f.opera, {
          onRight: () => impara(f.id), rightText: "Esatto. Imparata.", wrongText: `Era «${f.opera}». Ci riprovi la prossima volta.`,
        });
        body.appendChild(quiz); c.classList.add("quizzing");
        quiz.querySelector(".opt").focus({ preventScroll: true });
      });
      actions.appendChild(bQuiz);
    }

    const bCopy = el("button", "act"); bCopy.type = "button";
    bCopy.innerHTML = ICONS.copy + `<span>${f.tipo === "brillante" ? "Copia la frase" : "Copia"}</span>`;
    const copyLabel = bCopy.lastChild.textContent;
    bCopy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(copyText); bCopy.lastChild.textContent = "Copiata"; }
      catch { const r = document.createRange(); r.selectNodeContents(body.querySelector(".q")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); bCopy.lastChild.textContent = "Testo selezionato"; }
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
      e.append(el("strong", null, salv ? "Nessuna scheda salvata" : "Nessuna scheda qui"),
        el("span", null, salv ? "Tocca Salva su una scheda per ritrovarla qui." : "Prova un altro tema o torna a Tutto."));
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

  document.getElementById("totale").textContent = `${TUTTI.length} schede: libri, storia, scienza, musica, cinema e curiosità`;
  renderChips(); renderFeed(); renderStats();
})();
