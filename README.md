# Sottolineato

Un feed verticale in italiano per imparare qualcosa dai libri, una scheda alla volta.

## Tipi di scheda

| Tipo | Cosa contiene | Regola sui diritti |
|---|---|---|
| Frase (`frase`) | Una citazione alla lettera | Solo opere di pubblico dominio. Le opere straniere sono tradotte da noi (`trad: true`). |
| L'idea (`idea`) | L'idea chiave di un libro, raccontata con parole nostre | Adatta ai libri moderni: niente frasi copiate. |
| Parola (`parola`) | Una parola o espressione nata da un libro | Definizione e origine scritte da noi. |
| Dietro il libro (`sapevi`) | Una curiosità sul libro o sull'autore | Solo fatti verificabili. |
| Citazione storica (`storica`) | Una frase famosa, con il verdetto: detta davvero, attribuita o mai detta così | Campo `verdetto`: `vera`, `attribuita`, `mai`. Il quiz chiede se è autentica. |
| Vero o falso (`mondo`) | Curiosità sul mondo e falsi miti | Campo `vero`: `true` o `false`. Il quiz chiede di indovinare. |
| Da dire agli amici (`brillante`) | Paradossi, effetti, leggi | Campi `def` (cos'è in una riga) e `spunto` (la frase pronta da dire). |

## File

- `index.html`: struttura e stile
- `app.js`: feed, filtri, quiz, salvataggi
- `contenuti.js`: temi e schede sui libri
- `citazioni-storiche.js`, `vero-o-falso.js`, `da-dire.js`: le altre sezioni
- `libri-2.js`, `storia-2.js`, `vero-o-falso-2.js`, `da-dire-2.js`: il secondo blocco di schede
- `musica.js`, `cinema.js`, `geografia.js`, `italia.js`: i temi Musica, Cinema, Geografia e Storia d'Italia (solo fatti: niente testi di canzoni né battute dei film)

Ogni nuovo file di contenuti va aggiunto con un `<script>` in `index.html`, prima di `app.js`.

## Aggiungere una scheda

Aggiungi un oggetto in `contenuti.js` con `id` unico, `tipo`, `tema` (uno di `TEMI`), `autore`, `opera`, `anno`, `testo`, `hl` (la parte da evidenziare, identica a un pezzo di `testo`) e `nota`. Le parole hanno anche `def`; le frasi possono avere `rif` e `trad`.

## Avvio in locale

Basta aprire `index.html` nel browser. Frasi salvate e frasi imparate restano solo in quel browser.
