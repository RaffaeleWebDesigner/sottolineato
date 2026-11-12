# Schema delle schede

Ogni scheda è divisa in due parti:

- **dati comuni**, che non dipendono dalla lingua: `data/schede/<tipo>.json`
- **testi**, uno per lingua: `data/testi/<lingua>/<tipo>.json`

L'`id` lega le due parti. Una scheda senza testo in una lingua non viene mostrata in quella lingua. Lo stesso `id` può avere testi diversi in lingue diverse: le schede legate all'italiano (per esempio Parole o Italia) andranno adattate, non tradotte alla lettera.

I temi sono in `data/temi.json`.

Per controllare tutto: `node scripts/controlla.mjs` (deve finire senza errori prima di ogni commit).

## File

```
data/
  temi.json
  schede/
    frase.json  idea.json  parola.json  sapevi.json
    storica.json  mondo.json  mito.json  brillante.json
  testi/
    it/
      frase.json  idea.json  …  (stessi nomi di data/schede)
    en/          (non ancora presente)
```

- `data/schede/<tipo>.json` è una **lista** di oggetti, una scheda per riga.
- `data/testi/<lingua>/<tipo>.json` è un **oggetto indicizzato per id**, una scheda per riga.
- Ogni scheda sta nel file del suo tipo, sia per i dati comuni sia per i testi.

## Tipi

| `tipo` | Nome nell'app | Campi specifici |
|---|---|---|
| `frase` | Frase | citazione alla lettera, solo da opere di pubblico dominio; `trad: true` se la traduzione è nostra |
| `idea` | L'idea | l'idea di un libro raccontata con parole nostre |
| `parola` | Parola | `def` nei testi |
| `sapevi` | Dietro il libro | — |
| `storica` | Citazione storica | `verdetto` |
| `mondo` | Vero o falso | `vero` |
| `mito` | Mito o realtà? | `vero` (`true` = confermato, `false` = mito sfatato) |
| `brillante` | Da dire agli amici | `def` e `spunto` nei testi |

## Dati comuni (`data/schede/<tipo>.json`)

| Campo | Tipo | Obbligatorio | Note |
|---|---|---|---|
| `id` | stringa | sempre | Unico in tutto il progetto e **immutabile**: i salvataggi degli utenti dipendono dall'id. Minuscole, cifre e trattini. |
| `tipo` | stringa | sempre | Uno dei tipi sopra, uguale al nome del file. |
| `temi` | lista di stringhe | sempre, almeno 1 | Id dei temi di `data/temi.json`. Il primo è il tema principale (colore e etichetta della scheda). |
| `vero` | booleano | `mondo`, `mito` | Ammesso solo per questi due tipi. |
| `verdetto` | `vera` \| `attribuita` \| `mai` | `storica` | Ammesso solo per `storica`. |
| `autore` | stringa | `frase`, `idea`, `parola`, `sapevi`, `storica` | Facoltativo per `brillante`; assente per `mondo` e `mito`. |
| `anno` | stringa | no | Anche descrittivo: «I secolo a.C.», «1600 circa». |
| `rif` | stringa | no | Riferimento nell'opera: «capitolo XXV», «Inferno, canto III, v. 9». |
| `trad` | booleano | no | Solo `frase`: `true` se la traduzione è nostra. |
| `stato` | `bozza` \| `da_verificare` \| `verificata` | sempre | `bozza` non viene mostrata. `da_verificare` è mostrata ma non ancora controllata. |
| `verificata_il` | data `AAAA-MM-GG` | se `stato` è `verificata` | Vietata negli altri stati. |
| `fonte` | stringa | `mondo`, `mito`, `storica` aggiunte dopo il 2026-11-12 | Link o riferimento bibliografico che conferma il fatto. Facoltativa per le schede precedenti. |
| `aggiunta` | data `AAAA-MM-GG` | sempre | Data di inserimento. |
| `immagine` | stringa | no | Previsto per il futuro, per ora sempre assente. |

Campi vuoti (`""`) non si scrivono: si omette il campo.

> `autore`, `anno` e `rif` oggi sono scritti in italiano e in qualche caso sono descrittivi («Una madre spartana», «Psicologia della memoria»). Quando arriverà l'inglese andrà deciso se spostare questi casi nei testi.

## Testi (`data/testi/<lingua>/<tipo>.json`)

| Campo | Obbligatorio | Note |
|---|---|---|
| `testo` | sempre | Massimo 220 caratteri. Per `parola` è la parola stessa, per `brillante` il nome dell'effetto. |
| `hl` | sempre | La parte da evidenziare: deve comparire **identica** dentro `testo`. |
| `nota` | sempre | La spiegazione. Per `vero` e `verdetto` dice perché. |
| `opera` | `frase`, `idea`, `parola`, `sapevi` | Titolo dell'opera. Per `storica` è il contesto («Telegramma al generale La Marmora»). |
| `def` | `parola`, `brillante` | Definizione in una riga. |
| `spunto` | `brillante` | La frase pronta da dire agli amici. |

## Temi (`data/temi.json`)

```json
[
  { "id": "storia", "nome": { "it": "Storia", "en": "Storia" }, "premium": false }
]
```

- `id` stabile, minuscole senza accenti: è anche il nome del colore CSS (`--t-<id>` in `index.html`).
- `nome` per lingua. Per ora `en` è uguale a `it`, verrà tradotto.
- `premium`: una scheda è riservata a chi paga solo se **tutti** i suoi temi sono premium. Per ora tutti `false`.

Ci sono 24 temi: mente, scienza, storia, italia, musica, cinema, geografia, sport, tecnologia, spazio, natura, corpo, cibo, parole, arte, economia, vita, amore, tempo, coraggio, lavoro, societa, potere, fantasia.

## Esempi, uno per tipo

Ogni esempio mostra la riga del file comune e la voce del file dei testi italiani.

### `frase`

`data/schede/frase.json`
```json
{"id":"seneca-tempo","tipo":"frase","temi":["tempo"],"autore":"Seneca","anno":"I secolo","rif":"capitolo 1","trad":true,"stato":"da_verificare","aggiunta":"2026-11-11"}
```
`data/testi/it/frase.json`
```json
"seneca-tempo": {"testo":"Non è che abbiamo poco tempo: è che ne perdiamo molto.","hl":"ne perdiamo molto","nota":"Per Seneca la vita è lunga abbastanza, se la si usa bene. Il problema è come la sprechiamo.","opera":"La brevità della vita"}
```

### `idea`

`data/schede/idea.json`
```json
{"id":"calvino-leggerezza","tipo":"idea","temi":["mente"],"autore":"Italo Calvino","anno":"1988","stato":"da_verificare","aggiunta":"2026-11-11"}
```
`data/testi/it/idea.json`
```json
"calvino-leggerezza": {"testo":"Leggerezza non vuol dire superficialità: vuol dire togliere peso.","hl":"togliere peso","nota":"Calvino apre le sue lezioni con la leggerezza e usa il mito di Perseo, che sconfigge Medusa guardandola riflessa nello scudo: a volte bisogna cambiare punto di vista.","opera":"Lezioni americane"}
```

### `parola`

`data/schede/parola.json`
```json
{"id":"galeotto","tipo":"parola","temi":["amore"],"autore":"Dante Alighieri","anno":"1304-1321","stato":"da_verificare","aggiunta":"2026-11-11"}
```
`data/testi/it/parola.json`
```json
"galeotto": {"testo":"Galeotto","hl":"Galeotto","nota":"Francesca dice che «galeotto fu il libro»: leggendo insieme la storia di Lancillotto, lei e Paolo si baciarono. Galeotto era il messaggero tra Lancillotto e Ginevra.","def":"Ciò che fa nascere un amore, facendo da intermediario.","opera":"Divina Commedia"}
```

### `sapevi`

`data/schede/sapevi.json`
```json
{"id":"commedia-divina","tipo":"sapevi","temi":["fantasia"],"autore":"Dante Alighieri","anno":"1304-1321","stato":"da_verificare","aggiunta":"2026-11-11"}
```
`data/testi/it/sapevi.json`
```json
"commedia-divina": {"testo":"Dante la chiamò solo «Commedia». «Divina» l'aggiunse Boccaccio.","hl":"l'aggiunse Boccaccio","nota":"Boccaccio, grande ammiratore di Dante, la definì divina. Il titolo completo comparve in un'edizione stampata a Venezia nel 1555.","opera":"Divina Commedia"}
```

### `storica`

`data/schede/storica.json`
```json
{"id":"st-eppur","tipo":"storica","temi":["scienza"],"verdetto":"mai","autore":"Galileo Galilei","anno":"1633","stato":"da_verificare","aggiunta":"2026-11-11"}
```
`data/testi/it/storica.json`
```json
"st-eppur": {"testo":"Eppur si muove.","hl":"Eppur si muove.","nota":"Nessun documento del processo la riporta. Compare per la prima volta in un libro di Giuseppe Baretti del 1757, più di un secolo dopo.","opera":"Dopo l'abiura davanti all'Inquisizione"}
```

### `mondo`

`data/schede/mondo.json`
```json
{"id":"vf-polpo","tipo":"mondo","temi":["natura"],"vero":true,"stato":"da_verificare","aggiunta":"2026-11-11"}
```
`data/testi/it/mondo.json`
```json
"vf-polpo": {"testo":"Il polpo ha tre cuori e il sangue blu.","hl":"tre cuori","nota":"Due cuori pompano il sangue nelle branchie, uno nel resto del corpo. Il sangue è blu perché trasporta l'ossigeno con il rame invece che con il ferro."}
```

### `mito`

`data/schede/mito.json`
```json
{"id":"m3-vaccini-autismo","tipo":"mito","temi":["corpo"],"vero":false,"stato":"da_verificare","aggiunta":"2026-11-12"}
```
`data/testi/it/mito.json`
```json
"m3-vaccini-autismo": {"testo":"I vaccini possono causare l'autismo.","hl":"causare l'autismo","nota":"Lo studio del 1998 che lo sosteneva era falsificato: è stato ritirato e il suo autore radiato dall'albo dei medici. Studi su milioni di bambini non hanno trovato alcun legame."}
```

### `brillante`

`data/schede/brillante.json`
```json
{"id":"dd-pareto","tipo":"brillante","temi":["lavoro"],"autore":"Vilfredo Pareto","anno":"1896","stato":"da_verificare","aggiunta":"2026-11-11"}
```
`data/testi/it/brillante.json`
```json
"dd-pareto": {"testo":"Il principio di Pareto","hl":"di Pareto","nota":"L'economista notò che in Italia circa l'80% delle terre era di circa il 20% delle persone. Le proporzioni cambiano, ma lo squilibrio si ritrova ovunque.","def":"Spesso l'80% dei risultati viene dal 20% delle cause.","spunto":"Il 20% dei clienti fa l'80% del fatturato: concentriamoci su quelli. È l'80/20 di Pareto, un italiano."}
```

### Una scheda nuova, verificata e con più temi

Così apparirà una scheda aggiunta dopo la conversione. Il valore di `fonte` qui è solo un segnaposto: va sostituito con il link o il riferimento reale.

```json
{"id":"esempio-nuova","tipo":"mondo","temi":["natura","scienza"],"vero":true,"stato":"verificata","verificata_il":"2026-12-01","fonte":"https://… (pagina che conferma il fatto)","aggiunta":"2026-12-01"}
```

## Prefissi degli id

Gli id esistenti non vanno mai cambiati. Per le schede nuove conviene un prefisso per blocco di lavoro, per non scontrarsi con id già usati: per esempio `mi-`, `st-`, `vf-`, `dd-`, `bm-`, `bf-`. Il controllo segnala comunque gli id duplicati.
