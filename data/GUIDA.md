# Guida di stile delle schede

Vale per ogni scheda nuova e per ogni correzione. Lo schema dei campi è in `data/SCHEMA.md`, le regole generali in `CLAUDE.md`.

## Per chi scriviamo

Persone curiose e intelligenti, che vogliono capire qualcosa in più del mondo in pochi secondi. Non sono studenti da interrogare né follower da intrattenere.

- Tono chiaro, curioso, mai saccente. Raccontiamo come a un amico sveglio, non come un professore.
- Niente punti esclamativi, salvo dentro una citazione originale («Carneade! Chi era costui?»).
- Niente enfasi: «incredibile», «pazzesco», «straordinario», «tantissimi». Il fatto deve stupire da solo.
- Niente «si dice», «pare che», «secondo alcuni» senza dire chi. Se non sappiamo chi lo dice, la scheda non è pronta.

## Cosa rende buona una scheda

1. **Un fatto o un'idea sola.** La `nota` spiega quel fatto, non ne aggiunge un secondo.
2. **Sorprende o cambia il modo di vedere qualcosa.** Dopo averla letta, si guarda una cosa nota in modo diverso.
3. **Si può raccontare a un amico** in una frase, senza il telefono in mano.
4. **È vera e verificabile.** Ogni numero, data e nome della scheda, `nota` compresa, è confermato dalla `fonte`.

## Struttura per tipo

Lunghezze in caratteri, spazi compresi. Il controllo blocca un `testo` oltre 220 caratteri. Le altre misure sono indicazioni, ma la `nota` oltre 230 caratteri va accorciata.

| Tipo | `testo` | `nota` | Altro |
|---|---|---|---|
| `mondo` | Un'affermazione da giudicare vera o falsa, 40-120 caratteri. Scritta in modo che il lettore possa davvero esitare. | 80-200: perché è vera o falsa. Se è falsa, dice com'è davvero. | `vero` |
| `mito` | La credenza come la dice la gente, 30-100. | 80-200: da dove viene la credenza e cosa dicono i fatti. | `vero`: `true` confermato, `false` sfatato |
| `storica` | La citazione nella forma in cui gira, ≤130. | 80-200: chi l'ha detta o scritta davvero, dove e quando; per `attribuita` e `mai`, da dove nasce l'attribuzione. | `verdetto`, `opera` = il contesto |
| `frase` | La citazione alla lettera, ≤160. Solo pubblico dominio. | 80-180: cosa vuol dire, perché conta. | `opera`, `rif`, `trad: true` se tradotta da noi |
| `idea` | L'idea del libro con parole nostre, ≤90. | 100-200: come il libro arriva a quell'idea. | `opera` |
| `parola` | La parola o l'espressione, ≤25. | 80-180: l'origine nel libro. | `def`: il significato di oggi, una riga |
| `sapevi` | La curiosità sul libro o sull'autore, ≤100. | 80-180: il contesto. | `opera` |
| `brillante` | Il nome dell'effetto, della legge o del paradosso, ≤40. | 100-200: chi l'ha descritto e come. | `def` (cos'è, una riga) e `spunto` |

### Come scegliere `hl`

`hl` è la parte che resta in mente: deve comparire identica dentro `testo`.

- È il cuore della sorpresa, di solito 2-5 parole: «tre cuori», «l'aggiunse Boccaccio».
- Non è tutto il testo, salvo che il testo sia già brevissimo (una parola, un nome, una citazione di poche parole).
- Non sono parole vuote come «in realtà» o «molto».
- Nei `mondo` falsi evidenzia l'affermazione da mettere in dubbio, non una parola neutra.

### `def` e `spunto`

- `def` è una riga sola che si capisce da sola, senza la `nota`.
- `spunto` (solo `brillante`) è la frase pronta da dire a cena: concreta, in prima persona o in una situazione reale, non una definizione ripetuta. Al massimo 160 caratteri.

## Italiano

- Frasi brevi: una informazione per frase. Meglio due frasi corte che una con tre incisi.
- Numeri: in cifre da 11 in su («27 ossa», «1757»). In lettere i numeri piccoli e quelli tondi in una frase discorsiva («tre cuori», «circa due metri»). Le migliaia col punto («3.000»), i decimali con la virgola («1,5»). Per numeri molto grandi: «tre miliardi», non «3.000.000.000».
- Date: «12 aprile 1961». Secoli in lettere («nel Cinquecento», «I secolo a.C.»).
- Virgolette basse «» per citazioni e titoli dentro il testo. Dentro una citazione si usano “ ”. Mai le virgolette dritte ".
- Niente anglicismi evitabili: «riunione», non «meeting»; «squadra», non «team». Sono ammessi i nomi propri e i termini entrati nell'uso senza alternativa italiana («social», «OK» come parola di cui si parla).
- Unità di misura del sistema internazionale, con lo spazio: «5 km», «37 °C».
- Nessuna emoji.

## Fonti

Ogni scheda `verificata` ha una `fonte`. Va scritta solo una pagina aperta davvero e che conferma il fatto. Mai un link ricostruito a memoria.

**Fonti accettate, in ordine di preferenza:**

1. Pubblicazioni scientifiche: riviste con revisione, PubMed, siti degli editori.
2. Enciclopedie: Treccani, Britannica.
3. Istituzioni ufficiali: enti pubblici, musei, università, agenzie spaziali (NASA, ESA, ASI), istituti di statistica (ISTAT), organismi internazionali (OMS, ONU).
4. Testate giornalistiche serie, con articoli firmati e fonti citate.

**Per le citazioni** (`storica`): Quote Investigator e Wikiquote, ma solo quando riportano la fonte originale (libro, lettera, verbale). In quel caso si cita anche la fonte originale.

**Per i testi di pubblico dominio** (`frase`): Wikisource, Liber Liber, Project Gutenberg, per confrontare il testo con l'originale.

**Fonti non accettate:**

- blog anonimi;
- siti di curiosità e liste («10 cose che non sai…»);
- contenuti generati da IA;
- social network;
- Wikipedia da sola. Serve per trovare la fonte, non come fonte.

**Formato di `fonte`:** un URL completo (`https://…`) oppure un riferimento bibliografico (autore, titolo, editore o rivista, anno). Più fonti si separano con ` | `.

Una fonte sola basta per un fatto noto. Ne servono due quando il fatto è sorprendente o contraddice ciò che si crede di solito.

## Diritti

Valgono le regole di `CLAUDE.md`:

- citazioni alla lettera (`frase`) solo da opere di pubblico dominio, cioè con autore morto da più di 70 anni; le traduzioni sono nostre (`trad: true`);
- per i libri moderni si racconta l'idea con parole nostre, senza frasi copiate;
- niente testi di canzoni, niente battute di film.

## Esempi dal repository

I tre esempi buoni sono scelti per lo stile. Le loro fonti si aggiungono durante la verifica.

### Buone

**`vf-polpo`** (`mondo`)
> Il polpo ha **tre cuori** e il sangue blu.
> *Nota:* Due cuori pompano il sangue nelle branchie, uno nel resto del corpo. Il sangue è blu perché trasporta l'ossigeno con il rame invece che con il ferro.

Un'affermazione che sembra inventata, poi una nota che spiega entrambe le stranezze in due frasi semplici. Si racconta a chiunque.

**`st-eppur`** (`storica`, verdetto `mai`)
> **Eppur si muove.**
> *Nota:* Nessun documento del processo la riporta. Compare per la prima volta in un libro di Giuseppe Baretti del 1757, più di un secolo dopo.

Smentisce una frase che tutti conoscono, e dice esattamente da dove nasce: autore, anno, distanza nel tempo. Nessun giudizio, solo fatti.

**`dd-pareto`** (`brillante`)
> Il principio **di Pareto**
> *Def:* Spesso l'80% dei risultati viene dal 20% delle cause.
> *Spunto:* Il 20% dei clienti fa l'80% del fatturato: concentriamoci su quelli. È l'80/20 di Pareto, un italiano.

La `def` si capisce da sola. Lo `spunto` è una frase che si può dire davvero in una riunione, con un dettaglio in più (Pareto era italiano) che la rende memorabile.

### Da migliorare

**`bm-beatles-numero-uno`** (`mondo`)
> Nell'aprile 1964 i Beatles occupavano i primi cinque posti della classifica americana.
> *Nota:* Un record rimasto imbattuto per decenni.

La nota non spiega nulla, e «per decenni» è vago e da verificare. Meglio dire quali erano le cinque canzoni o perché era successo (l'arrivo dei Beatles negli Stati Uniti a febbraio 1964), con una fonte.

**`bn-canguro-indietro`** (`mondo`)
> I canguri non riescono a camminare all'indietro.
> *Nota:* La coda grossa e le zampe posteriori fatte per saltare glielo impediscono. Si dice, ma è una leggenda, che per questo siano sullo stemma australiano.

Due fatti in una scheda, e il secondo è un «si dice» smentito nella stessa frase: confonde. La nota deve fermarsi alla spiegazione del primo fatto.

**`w-dna-lunghezza`** (`mondo`)
> Il DNA di una sola cellula, srotolato, è lungo circa due metri.
> *Nota:* Sta in un nucleo largo pochi millesimi di millimetro grazie a un avvolgimento incredibilmente ordinato. Unendo quello di tutte le cellule si andrebbe e tornerebbe dal Sole più di cento volte.

«Incredibilmente» è enfasi che non serve: il confronto tra due metri e pochi millesimi di millimetro basta. La seconda frase aggiunge un altro numero, che va verificato a sua volta. Se la fonte non lo conferma, si toglie.
