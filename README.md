# Sottolineato

Un feed verticale in italiano per imparare qualcosa dai libri, una scheda alla volta.

## Tipi di scheda

| Tipo | Cosa contiene | Regola sui diritti |
|---|---|---|
| Frase (`frase`) | Una citazione alla lettera | Solo opere di pubblico dominio. Le opere straniere sono tradotte da noi (`trad: true`). |
| L'idea (`idea`) | L'idea chiave di un libro, raccontata con parole nostre | Adatta ai libri moderni: niente frasi copiate. |
| Parola (`parola`) | Una parola o espressione nata da un libro | Definizione e origine scritte da noi. |
| Lo sapevi? (`sapevi`) | Una curiosità sul libro o sull'autore | Solo fatti verificabili. |

## File

- `index.html`: struttura e stile
- `app.js`: feed, filtri, quiz, salvataggi
- `contenuti.js`: tutte le schede

## Aggiungere una scheda

Aggiungi un oggetto in `contenuti.js` con `id` unico, `tipo`, `tema` (uno di `TEMI`), `autore`, `opera`, `anno`, `testo`, `hl` (la parte da evidenziare, identica a un pezzo di `testo`) e `nota`. Le parole hanno anche `def`; le frasi possono avere `rif` e `trad`.

## Avvio in locale

Basta aprire `index.html` nel browser. Frasi salvate e frasi imparate restano solo in quel browser.
