// Piccoli aiuti per creare elementi.
export function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

// Bottone con icona e testo; il testo sta in uno <span> da poter cambiare dopo.
export function bottoneAzione(icona, testo) {
  const b = el("button", "act"); b.type = "button"; b.innerHTML = icona; b.appendChild(el("span", null, testo)); return b;
}
