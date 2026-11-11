(() => {
  const TUTTI = window.CONTENUTI;
  const TEMI = window.TEMI;
  const TIPI = { frase: "Frase", idea: "L'idea", parola: "Parola", sapevi: "Lo sapevi?" };
  const FILTRI_TIPO = [["tutto", "Tutto"], ["frase", "Frasi"], ["idea", "Idee"], ["parola", "Parole"], ["sapevi", "Curiosità"], ["salvate", "Salvate"]];

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  let salvate = new Set(store.get("sott-salvate", []));
  let imparate = new Set(store.get("sott-imparate", []));
  let filtroTipo = store.get("sott-tipo", "tutto");
  let filtroTema = store.get("sott-tema", null);
  let seme = daySeed();

  const feed = document.getElementById("feed");
  const chipsTipo = document.getElementById("chips-tipo");
  const chipsTema = document.getElementById("chips-tema");
  const stats = document.getElementById("stats");
  const mix = document.getElementById("mix");

  const ICONS = {
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  };

  function daySeed() { const d = new Date(); return d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate(); }
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
  function shuffle(a, r = Math.random) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
  // Mescola evitando due schede dello stesso tipo di fila, quando possibile.
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
    const cls = { frase: "q", idea: "q idea", parola: "q parola", sapevi: "q sapevi" }[f.tipo];
    const q = el(f.tipo === "frase" ? "blockquote" : "p", cls);
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

  function renderStats() { stats.textContent = `${imparate.size} imparate · ${salvate.size} salvate`; }

  function chip(label, pressed, onClick, id) {
    const b = el("button", "chip", label); b.type = "button"; b.id = id;
    b.setAttribute("aria-pressed", String(pressed)); b.addEventListener("click", onClick); return b;
  }
  function renderChips() {
    chipsTipo.replaceChildren(...FILTRI_TIPO.map(([k, label]) =>
      chip(label, filtroTipo === k, () => { filtroTipo = k; store.set("sott-tipo", k); renderChips(); renderFeed(); }, "tipo-" + k)));
    chipsTema.replaceChildren(...TEMI.map(t =>
      chip(t, filtroTema === t, () => { filtroTema = filtroTema === t ? null : t; store.set("sott-tema", filtroTema); renderChips(); renderFeed(); }, "tema-" + t.toLowerCase())));
  }

  function card(f, idx, tot) {
    const slide = el("section", "slide");
    const c = el("article", "card tipo-" + f.tipo);
    c.style.setProperty("--tint", `var(--t-${f.tema.toLowerCase()})`);
    const head = el("div", "card-head");
    const label = el("span", "label");
    label.append(el("span", "kind", TIPI[f.tipo]), document.createTextNode(" · " + f.tema));
    head.append(label, el("span", "count", `${idx + 1} / ${tot}`));

    const body = el("div", "body");
    body.appendChild(mainNode(f));
    if (f.tipo === "parola") body.appendChild(el("p", "def", f.def));
    const src = el("p", "src reveal");
    src.append(el("b", null, f.autore), document.createTextNode(" · "), el("i", null, f.opera));
    const meta = [f.rif, f.anno].filter(Boolean).join(" · ");
    const extra = f.tipo === "frase" ? (f.trad ? " · traduzione nostra" : "") : f.tipo === "idea" ? " · raccontata con parole nostre" : "";
    src.append(el("small", null, meta + extra));
    body.append(src, el("p", "note reveal", f.nota));

    const quiz = el("div", "quiz"); quiz.hidden = true;
    const opts = el("div", "opts");
    const verdict = el("div", "verdict"); verdict.setAttribute("aria-live", "polite");
    quiz.append(el("p", null, f.tipo === "parola" ? "Da quale opera viene?" : "Da quale libro?"), opts, verdict);
    body.appendChild(quiz);

    const actions = el("div", "actions");
    const bSave = el("button", "act"); bSave.type = "button"; bSave.innerHTML = ICONS.save + "<span>Salva</span>";
    const syncSave = () => { const on = salvate.has(f.id); bSave.setAttribute("aria-pressed", String(on)); bSave.lastChild.textContent = on ? "Salvata" : "Salva"; };
    syncSave();
    bSave.addEventListener("click", () => { salvate.has(f.id) ? salvate.delete(f.id) : salvate.add(f.id); store.set("sott-salvate", [...salvate]); syncSave(); renderStats(); });
    actions.appendChild(bSave);

    if (f.tipo !== "sapevi") {
      const bQuiz = el("button", "act"); bQuiz.type = "button"; bQuiz.innerHTML = ICONS.quiz + "<span>Mettimi alla prova</span>";
      bQuiz.addEventListener("click", () => {
        const altre = [...new Set(TUTTI.map(x => x.opera))].filter(o => o !== f.opera);
        const scelte = shuffle([f.opera, ...shuffle(altre).slice(0, 2)]);
        opts.replaceChildren(); verdict.textContent = "";
        scelte.forEach(o => {
          const b = el("button", "opt", o); b.type = "button";
          b.addEventListener("click", () => {
            opts.querySelectorAll(".opt").forEach(x => { x.disabled = true; if (x.textContent === f.opera) x.classList.add("right"); });
            if (o === f.opera) { verdict.textContent = "Esatto. Imparata."; imparate.add(f.id); store.set("sott-imparate", [...imparate]); renderStats(); }
            else { b.classList.add("wrong"); verdict.textContent = `Era «${f.opera}». Ci riprovi la prossima volta.`; }
            c.classList.remove("quizzing");
          });
          opts.appendChild(b);
        });
        c.classList.add("quizzing"); quiz.hidden = false;
        opts.firstChild.focus({ preventScroll: true });
      });
      actions.appendChild(bQuiz);
    }

    const bCopy = el("button", "act"); bCopy.type = "button"; bCopy.innerHTML = ICONS.copy + "<span>Copia</span>";
    bCopy.addEventListener("click", async () => {
      const head = f.tipo === "frase" ? `«${f.testo.replace(/\n/g, " ")}»` : f.tipo === "parola" ? `${f.testo}: ${f.def}` : f.testo;
      const txt = `${head} — ${f.autore}, ${f.opera}`;
      try { await navigator.clipboard.writeText(txt); bCopy.lastChild.textContent = "Copiata"; }
      catch { const r = document.createRange(); r.selectNodeContents(body.querySelector(".q")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); bCopy.lastChild.textContent = "Testo selezionato"; }
      setTimeout(() => { bCopy.lastChild.textContent = "Copia"; }, 1800);
    });
    actions.appendChild(bCopy);

    c.append(head, body, actions);
    slide.appendChild(c);
    return slide;
  }

  let observer;
  function renderFeed() {
    let lista = TUTTI;
    if (filtroTipo === "salvate") lista = lista.filter(f => salvate.has(f.id));
    else if (filtroTipo !== "tutto") lista = lista.filter(f => f.tipo === filtroTipo);
    if (filtroTema) lista = lista.filter(f => f.tema === filtroTema);
    lista = mixVario(lista, seme);

    feed.replaceChildren(); feed.scrollTop = 0;
    if (!lista.length) {
      const s = el("section", "slide"); const e = el("div", "card empty");
      const salv = filtroTipo === "salvate";
      e.append(el("strong", null, salv ? "Nessuna scheda salvata" : "Nessuna scheda qui"),
        el("span", null, salv ? "Tocca Salva su una scheda per ritrovarla qui." : "Prova un altro tema o torna a Tutto."));
      s.appendChild(e); feed.appendChild(s); return;
    }
    lista.forEach((f, i) => feed.appendChild(card(f, i, lista.length)));
    observer?.disconnect();
    observer = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.querySelector(".card").classList.add("seen"); }), { root: feed, threshold: .6 });
    feed.querySelectorAll(".slide").forEach(s => observer.observe(s));
    requestAnimationFrame(() => feed.querySelector(".card")?.classList.add("seen"));
  }

  mix.addEventListener("click", () => { seme = Math.floor(Math.random() * 1e9); renderFeed(); });
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); feed.scrollBy({ top: feed.clientHeight, behavior: "smooth" }); }
    if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); feed.scrollBy({ top: -feed.clientHeight, behavior: "smooth" }); }
  });

  document.getElementById("totale").textContent = `${TUTTI.length} schede da ${new Set(TUTTI.map(x => x.opera)).size} opere`;
  renderChips(); renderFeed(); renderStats();
})();
