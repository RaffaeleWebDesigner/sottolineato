# Registro della verifica (fase 2)

Chi riprende il lavoro parte da qui: legge il riepilogo e continua dal primo passo o blocco non completato.

## Riepilogo

*Aggiornato il 12 novembre 2026.*

- **Passo 1, guida di stile**: fatto (`data/GUIDA.md`).
- **Passo 2, macro-categorie**: proposta scritta qui sotto. **In attesa di approvazione**: nessun dato modificato.
- **Passo 3, applicare le categorie**: da fare, dopo l'approvazione.
- **Passo 4, verifica dei fatti**: blocchi completati 0 su 22. Prossimo blocco: 01 (MONDO 1).
- **Passo 5, temi deboli**: da fare.

| Verificate | Corrette | In bozza | Da verificare | Totale |
|---|---|---|---|---|
| 0 | 0 | 0 | 2001 | 2001 |

*Corrette* sono le schede verificate dopo una correzione: sono contate anche tra le verificate.

**Ultimo merge su main**: nessuno. Il merge si fa ogni 300 schede verificate.

**Duplicati segnalati**: nessuno finora.

## Come si lavora

Il metodo completo è nella richiesta della fase 2, riassunta qui.

1. Si verifica una scheda alla volta, nell'ordine dei blocchi qui sotto. Dentro un tipo l'ordine è per id, nell'ordinamento di JavaScript.
2. **Confermata**: `stato: "verificata"`, `verificata_il` con la data, `fonte` con le pagine aperte davvero. Più fonti si separano con ` | `.
3. **Corretta**: si corregge con certezza, poi si segna come verificata. Qui si scrivono prima e dopo.
4. **Non confermabile o controversa**: `stato: "bozza"`. Qui si scrivono id e motivo. La scheda non si cancella.
5. Fine blocco:
   - `node scripts/controlla.mjs` senza errori;
   - `VERSIONE_DATI` in `js/dati.js` aumentata di 1;
   - registro aggiornato;
   - un commit.
6. Ogni 300 schede verificate, merge su main, dopo aver provato il sito.

## Blocchi del passo 4

| N. | Blocco | Schede | Primo id | Ultimo id | Stato |
|---|---|---|---|---|---|
| 01 | MONDO 1 | 100 | `bf-althing` | `bm-mario-idraulico` | da fare |
| 02 | MONDO 2 | 100 | `bm-mozart-cane` | `bn-naso-ricordi` | da fare |
| 03 | MONDO 3 | 100 | `bn-neuroni-velocita` | `bq-kiwi` | da fare |
| 04 | MONDO 4 | 100 | `bq-lampadina-secolo` | `bs-geo-hawaii` | da fare |
| 05 | MONDO 5 | 100 | `bs-geo-islanda` | `bu-neapolis` | da fare |
| 06 | MONDO 6 | 100 | `bu-orvieto-pozzo` | `it-federico` | da fare |
| 07 | MONDO 7 | 100 | `it-ferrovia` | `v3-koala-sonno` | da fare |
| 08 | MONDO 8 | 100 | `v3-lacrime` | `vf-zucchero` | da fare |
| 09 | MONDO 9 | 100 | `vf2-alfredo` | `w-gatti-dolce` | da fare |
| 10 | MONDO 10 | 24 | `w-ghigliottina-star-wars` | `w-zolletta` | da fare |
| 11 | MITO 1 | 100 | `bf-animali-terremoti` | `bs-cristoforo-uovo` | da fare |
| 12 | MITO 2 | 100 | `bs-einstein-scuola` | `m2-washington` | da fare |
| 13 | MITO 3 | 100 | `m2-web-internet` | `mi-cellulare-aereo` | da fare |
| 14 | MITO 4 | 75 | `mi-cervello-destro` | `mi-vomitorium` | da fare |
| 15 | STORICA 1 | 100 | `bf-ali-grande` | `c4-lincoln` | da fare |
| 16 | STORICA 2 | 100 | `c4-olsen` | `c6-pietra` | da fare |
| 17 | STORICA 3 | 84 | `c6-piramidi` | `st-waterloo-eton` | da fare |
| 18 | ALTRI 1 | 100 | `abbondio` | `pavese` | da fare |
| 19 | ALTRI 2 | 100 | `pennac` | `gattopardo-rifiuti` | da fare |
| 20 | ALTRI 3 | 100 | `grande-fratello` | `d3-status-quo` | da fare |
| 21 | ALTRI 4 | 100 | `d3-tetris` | `dd2-nocebo` | da fare |
| 22 | ALTRI 5 | 18 | `dd2-occam-hitchens` | `mu-reminiscenza` | da fare |

ALTRI comprende `frase`, `idea`, `parola`, `sapevi` e `brillante`, in quest'ordine, ognuno ordinato per id.

## Passo 2: proposta di macro-categorie

I 24 temi si raggruppano in 6 categorie. Ogni tema sta in una sola categoria.

Il conteggio considera il tema principale. Oggi nessuna scheda ha più di un tema, quindi ogni scheda cade in una sola categoria.

| Categoria | Temi | Schede | Quota |
|---|---|---|---|
| **Scienza e natura** | Scienza (101), Natura (224), Spazio (77), Corpo (115) | 517 | 26% |
| **Storia e società** | Storia (177), Società (106), Potere (52), Economia (52) | 387 | 19% |
| **Mondo di ogni giorno** | Geografia (74), Cibo (115), Tecnologia (100), Sport (58) | 347 | 17% |
| **Mente e vita** | Mente (122), Vita (32), Amore (27), Tempo (23), Coraggio (51), Lavoro (39) | 294 | 15% |
| **Italia e parole** | Italia (168), Parole (72) | 240 | 12% |
| **Arte e spettacolo** | Arte (53), Musica (56), Cinema (49), Fantasia (58) | 216 | 11% |
| | | **2001** | |

Tipi di scheda dentro ogni categoria («libri» comprende frase, idea, parola e sapevi):

| Categoria | Libri | Storica | Mondo | Mito | Brillante |
|---|---|---|---|---|---|
| Scienza e natura | 5 | 26 | 280 | 183 | 23 |
| Storia e società | 61 | 100 | 123 | 64 | 39 |
| Mondo di ogni giorno | 1 | 25 | 246 | 68 | 7 |
| Mente e vita | 136 | 77 | 3 | 15 | 63 |
| Italia e parole | 15 | 34 | 162 | 27 | 2 |
| Arte e spettacolo | 58 | 22 | 110 | 18 | 8 |

**Perché questi raggruppamenti.**

- *Mondo di ogni giorno* raccoglie le curiosità sulle cose che ci circondano: cosa mangiamo, gli oggetti, i luoghi, lo sport.
- *Italia e parole* tiene insieme due temi molto italiani. Saranno anche i più difficili da portare in inglese, così si potranno trattare a parte.
- *Mente e vita* raccoglie le idee dei libri e le schede su come si vive.

**Quale categoria come premium: Mente e vita.**

- È quella con più schede dai libri (136 su 294) e più «brillanti» (63). Sono i contenuti che più danno l'idea di imparare qualcosa di utile, quindi quelli per cui si paga più volentieri.
- Il feed gratuito resta fedele all'identità dell'app: curiosità, scienza, storia, miti. Non diventa un'app di crescita personale a pagamento.
- È il 15% delle schede: abbastanza da valere un abbonamento, non tanto da svuotare il feed gratuito.
- Cresce con il passo 5: quattro dei cinque temi deboli (Vita, Amore, Tempo, Lavoro) sono suoi. Le schede nuove arricchirebbero proprio la parte a pagamento.

*Alternativa:* **Arte e spettacolo** (11%). È più di nicchia e pesa meno sul feed gratuito, ma è meno chiaro perché qualcuno dovrebbe pagare per quella.

**Effetto sui conteggi.** Con la regola attuale una scheda è riservata solo se tutti i suoi temi sono premium. Quindi, finché le schede hanno un solo tema, scegliere Mente e vita riserva 294 schede. Tutti i `premium` restano `false` finché non decidi tu.

**Nota per il passo 5.** Sotto le 50 schede, contando solo il tema principale, ci sono Tempo (23), Amore (27), Vita (32), Lavoro (39) e anche **Cinema (49)**. Per portarli tutti a 50 servono almeno 80 schede nuove: 27 per Tempo, 23 per Amore, 18 per Vita, 11 per Lavoro e 1 per Cinema.

## Blocchi completati

Nessuno finora.
