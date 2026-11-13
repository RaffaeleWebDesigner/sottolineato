// Effetti visivi delle risposte: coriandoli se è giusta, scossone se è sbagliata. Niente librerie.
// Con prefers-reduced-motion non c'è movimento: restano la scritta, i colori e la vibrazione.
import { gioia, errore } from "./feedback.js";

export const movimentoRidotto = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const DURATA = 900; // ms, meno di un secondo
const COLORI = ["#ffce1a", "#2f9e66", "#4f7cff", "#ee6f96", "#f59f3a", "#7a6bd6"];

// Piccola esplosione di coriandoli che parte dal punto (x, y) della finestra.
function coriandoli(x, y) {
  const canvas = document.createElement("canvas");
  canvas.className = "coriandoli"; canvas.setAttribute("aria-hidden", "true");
  const dpr = window.devicePixelRatio || 1, W = innerWidth, H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  document.body.appendChild(canvas);
  const g = canvas.getContext("2d"); g.scale(dpr, dpr);
  const pezzi = Array.from({ length: 42 }, () => {
    const angolo = (-90 + (Math.random() - .5) * 110) * Math.PI / 180, velocita = 5 + Math.random() * 8;
    return {
      x, y, vx: Math.cos(angolo) * velocita, vy: Math.sin(angolo) * velocita,
      w: 5 + Math.random() * 6, h: 3 + Math.random() * 5, r: Math.random() * 6.28, vr: (Math.random() - .5) * .5,
      colore: COLORI[Math.floor(Math.random() * COLORI.length)],
    };
  });
  const inizio = performance.now();
  (function passo(ora) {
    const e = ora - inizio;
    g.clearRect(0, 0, W, H);
    if (e >= DURATA) { canvas.remove(); return; }
    g.globalAlpha = e > DURATA - 300 ? Math.max(0, (DURATA - e) / 300) : 1;
    for (const p of pezzi) {
      p.vy += .32; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.colore; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore();
    }
    requestAnimationFrame(passo);
  })(inizio);
}

// L'effetto di una risposta. bottone è quello premuto: i coriandoli partono da lì.
export function effettoRisposta(card, giusto, bottone) {
  giusto ? gioia() : errore();
  if (movimentoRidotto()) return;
  if (giusto) {
    const r = bottone.getBoundingClientRect();
    coriandoli(r.left + r.width / 2, r.top + r.height / 2);
  } else {
    card.classList.remove("scossa"); void card.offsetWidth; card.classList.add("scossa");
    setTimeout(() => card.classList.remove("scossa"), 420);
  }
}
