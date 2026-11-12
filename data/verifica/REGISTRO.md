# Registro della verifica (fase 2)

Chi riprende il lavoro parte da qui: legge il riepilogo e continua dal primo passo o blocco non completato.

## Riepilogo

*Aggiornato il 12 novembre 2026.*

- **Passo 1, guida di stile**: fatto (`data/GUIDA.md`).
- **Passo 2, macro-categorie**: approvato il 12 novembre 2026: 6 categorie, premium Mente e vita.
- **Passo 3, applicare le categorie**: fatto. `data/temi.json` ha `categorie` e un campo `categoria` per ogni tema; `mente-vita` ha `premium: true`, i temi restano `false`.
- **Passo 4, verifica dei fatti**: blocchi completati 3 su 22. Prossimo blocco: **04 (MONDO 4)**, da `bq-lampadina-secolo`.
- **Passo 5, temi deboli**: da fare.

| Verificate | Corrette | In bozza | Da verificare | Totale |
|---|---|---|---|---|
| 278 | 138 | 22 | 1701 | 2001 |

*Corrette* sono le schede verificate dopo una correzione: sono contate anche tra le verificate.

**Ultimo merge su main**: nessuno. Il merge si fa ogni 300 schede verificate: il prossimo dopo il blocco 04 (oggi 278 verificate).

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

**Strumenti e limiti** (scoperti nel blocco 01):
- **Ricerca e apertura delle pagine.** La ricerca web trova le pagine. Per aprirle, WebFetch non raggiunge i siti da questa sessione: si aprono con `curl` (user-agent standard, nessun aggiramento dei controlli anti-bot) e se ne legge il testo.
- **Siti bloccati.** Molti siti con controllo anti-bot non si aprono: Britannica, UNESCO, Smithsonian, Royal Collection, MoMA, olympics.com, sito dell'Accademia degli Oscar, New Scientist. Si usano altre fonti accettate.
- **Siti che funzionano.** Treccani, NASA, ESA, NOAA, NSIDC, ISTAT, ISPRA, INGV, OMS, PubMed/PMC, Nature, National Geographic, Scientific American, Il Post, ANSA, Il Sole 24 Ore, Guinness, Billboard, NPR, BFI, AFI, FIFA (inside.fifa.com), Quote Investigator, Wikisource, Gutenberg.
- **Cosa si corregge.** Quando la nota contiene un dettaglio che nessuna pagina aperta conferma, il dettaglio si toglie o si sostituisce con un fatto confermato: la scheda risulta «corretta». Se è il fatto principale a non essere confermabile, la scheda va in bozza.

## Blocchi del passo 4

| N. | Blocco | Schede | Primo id | Ultimo id | Stato |
|---|---|---|---|---|---|
| 01 | MONDO 1 | 100 | `bf-althing` | `bm-mario-idraulico` | **fatto** (12/11/2026) |
| 02 | MONDO 2 | 100 | `bm-mozart-cane` | `bn-naso-ricordi` | **fatto** (12/11/2026) |
| 03 | MONDO 3 | 100 | `bn-neuroni-velocita` | `bq-kiwi` | **fatto** (12/11/2026) |
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

## Passo 2: macro-categorie (approvate)

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

### Blocco 01: MONDO 1 (bf-althing → bm-mario-idraulico) — completato il 2026-11-12

100 schede: 53 confermate, 45 corrette (e poi verificate), 2 in bozza.

**In bozza**

- `bm-chitarra-elettrica`: Non confermata: le fonti sul motivo (Smithsonian, NPR) erano irraggiungibili durante la verifica. Da riverificare: il fatto è probabilmente vero.
- `bm-eco-coca-mondo`: Non confermabile oggi: le fonti trovate (NPR 2013, Il Post 2016) sono vecchie e nessuna fonte aggiornata elenca i paesi dove la Coca-Cola non si vende.

**Corrette** (prima → dopo)

- `bm-apollo-telefono`: Il confronto «milioni di volte più potente» non è confermato da nessuna fonte aperta: la scheda ora riporta il dato verificato sulla memoria.
  - testo: «Uno smartphone di oggi ha una potenza di calcolo milioni di volte superiore al computer dell'Apollo 11.» → «Il computer che portò l'Apollo 11 sulla Luna aveva circa 4 kilobyte di memoria di lavoro.»
  - hl: «milioni di volte superiore» → «circa 4 kilobyte»
  - nota: «Il computer di guida dell'Apollo aveva circa 4 kilobyte di memoria di lavoro. Eppure portò l'uomo sulla Luna.» → «Erano 2.048 parole di memoria «cancellabile», l'equivalente della RAM. Erano così poche che lo stesso indirizzo veniva usato per scopi diversi in momenti diversi.»
- `bm-eniac`: IEEE dà 30 tonnellate (le «30 tons» americane sono circa 27 tonnellate metriche: da controllare). La leggenda delle luci di Filadelfia non ha fonte ed è stata tolta.
  - testo: «Uno dei primi computer elettronici pesava circa 27 tonnellate.» → «Uno dei primi computer elettronici pesava circa 30 tonnellate.»
  - hl: «circa 27 tonnellate» → «circa 30 tonnellate»
  - nota: «L'ENIAC, del 1945, occupava una stanza intera e usava circa 18.000 valvole. Si diceva che quando lo accendevano le luci di Filadelfia si abbassassero, ma è probabilmente una leggenda.» → «L'ENIAC, completato nel 1945, riempiva una stanza di circa 9 metri per 15 e usava circa 18.000 valvole. Consumava elettricità quanto una piccola città.»
- `bm-internet-peso`: «Azienda del Massachusetts» e «il dominio esiste ancora» non sono confermati dalla fonte aperta (ICANN).
  - nota: «Era symbolics.com, di un'azienda di computer del Massachusetts. Il dominio esiste ancora.» → «Era symbolics.com, messo in rete il 15 marzo 1985. All'epoca il Macintosh era in commercio da appena un anno.»
- `bm-mario-idraulico`: Il nome «Jumpman» e l'anno non sono confermati dalle pagine aperte; il resto sì (Miyamoto a NPR).
  - nota: «Nel primo «Donkey Kong», del 1981, si chiamava Jumpman. Diventò idraulico qualche anno dopo, e il nome Mario sarebbe un omaggio al padrone di casa di un magazzino Nintendo americano.» → «In «Donkey Kong» lavorava in un cantiere. Diventò idraulico nel gioco successivo, «Mario Bros.», ambientato tra i tubi delle fogne. Il nome viene da Mario Segale, padrone di casa di Nintendo negli Stati Uniti.»
- `bm-ascensore`: «Senza il freno non avremmo i grattacieli» è un giudizio non confermato dalle fonti: la scheda ora racconta il fatto documentato.
  - testo: «Senza il freno di sicurezza degli ascensori non avremmo i grattacieli.» → «Nel 1854 l'inventore del freno di sicurezza per ascensori lo presentò facendo tagliare la fune su cui stava.»
  - hl: «il freno di sicurezza» → «facendo tagliare la fune»
  - nota: «Nel 1854 Elisha Otis lo dimostrò facendo tagliare la fune dell'ascensore su cui si trovava: la cabina si fermò. Da allora gli edifici poterono crescere.» → «Elisha Otis era su una piattaforma sospesa, al Crystal Palace di New York. La fune fu tagliata con un'ascia e il freno fermò la caduta. Più tardi la sua azienda installò ascensori nella Torre Eiffel.»
- `bm-calcio-pallone`: «Forme irregolari e rimbalzi imprevedibili» non è confermato; ora la scheda racconta il pallone più antico, documentato.
  - testo: «I primi palloni da calcio erano vesciche di maiale.» → «Il pallone da calcio più antico che si conosca è una vescica di maiale rivestita di cuoio.»
  - hl: «vesciche di maiale» → «vescica di maiale»
  - nota: «Venivano gonfiate e rivestite di cuoio. Per questo i palloni avevano forme irregolari e rimbalzi imprevedibili.» → «Fu trovato dietro un pannello del castello di Stirling, in Scozia, in una stanza che forse era la camera di Maria Stuarda. È datato agli anni Quaranta del Cinquecento.»
- `bm-calcio-coppa-rubata`: Il padrone, David Corbett, racconta che il pacco era accanto alla ruota di un'auto, non sotto una siepe (FIFA).
  - nota: «Nel 1966 fu rubata a Londra, poco prima dei Mondiali. La trovò un cane di nome Pickles, avvolta in un giornale sotto una siepe.» → «Il 20 marzo 1966 fu rubata a Londra, poco prima dei Mondiali. La trovò un cane di nome Pickles: era avvolta in carta di giornale, accanto alla ruota di un'auto.»
- `bm-maratona-dorando`: Il CONI parla di «coppa d'oro», non d'argento (altre fonti: argento dorato); scritto «dorata».
  - nota: «Crollò più volte negli ultimi metri e i giudici lo aiutarono a rialzarsi. La regina Alessandra gli regalò una coppa d'argento per il coraggio.» → «Crollò più volte negli ultimi metri e i giudici lo aiutarono a rialzarsi: fu squalificato per «aiuti non regolamentari». Il giorno dopo la regina Alessandra gli consegnò una coppa dorata.»
- `bm-basket-palla`: La fonte (Springfield College, dove nacque il basket) parla di un uomo per parte sulla balconata, non di una scala.
  - testo: «Nelle prime partite di basket bisognava recuperare il pallone dal cesto con una scala.» → «Nelle prime partite di basket, dopo ogni canestro qualcuno doveva togliere la palla dal cesto.»
  - hl: «con una scala» → «togliere la palla dal cesto»
  - nota: «I cesti per le pesche avevano il fondo. Solo dopo alcuni anni lo tagliarono.» → «I canestri erano cesti per le pesche appesi alla balconata della palestra: un uomo per parte recuperava il pallone. Solo qualche anno dopo il fondo fu tagliato.»
- `bm-caruso-disco`: Guinness data la registrazione da un milione di copie al 1902, non al 1907; tolta la frase sul disco come fenomeno di massa, non confermata.
  - nota: «Con «Vesti la giubba» dai Pagliacci, registrata nel 1907. Le sue incisioni contribuirono a far diventare il disco un fenomeno di massa.» → «Con «Vesti la giubba», dai Pagliacci, registrata nel novembre 1902: per il Guinness dei primati è il primo disco ad aver venduto un milione di copie.»
- `bm-beatles-numero-uno`: La nota («record imbattuto per decenni») non spiegava nulla ed era vaga: ora elenca le cinque canzoni (Billboard).
  - nota: «Un record rimasto imbattuto per decenni.» → «Erano «Can't Buy Me Love», «Twist and Shout», «She Loves You», «I Want to Hold Your Hand» e «Please Please Me». Nessuno ci era mai riuscito prima.»
- `bm-cinema-primo-film`: La durata «meno di un minuto» non è confermata dalla fonte aperta; aggiunta la prima proiezione, documentata dall'Institut Lumière.
  - nota: «È «L'uscita dalle officine Lumière», girato nel 1895 davanti alla loro fabbrica di Lione. Dura meno di un minuto.» → «È «L'uscita dalle officine Lumière», girato a Lione dai fratelli Lumière il 19 marzo 1895. Fu proiettato per la prima volta tre giorni dopo, a Parigi.»
- `bm-cinema-oscar-materiale`: L'offerta all'Accademia per un dollaro non è confermata da una pagina aperta (il regolamento sul sito dell'Accademia è bloccato).
  - nota: «Dal 1950 i vincitori devono offrirlo prima all'Accademia per un dollaro. Le statuette precedenti invece sono state vendute all'asta.» → «Dal 1950 i vincitori firmano un accordo che vieta di venderlo. Solo le statuette precedenti possono finire all'asta, come quella di Orson Welles.»
- `bm-cinema-psycho`: La scena dura 45 secondi, non «pochi minuti»; tolta la motivazione sul cioccolato «che rendeva meglio», non confermata (BFI).
  - nota: «Il film era in bianco e nero, e il cioccolato rendeva meglio in pellicola. La scena di pochi minuti richiese una settimana di riprese.» → «Era sciroppo Hershey's diluito, e il film era in bianco e nero. La scena dura 45 secondi, ma richiese una settimana di riprese.»
- `bm-cinema-star-wars-wookie`: La fonte cita orsi, tassi e trichechi; leoni e cani non sono confermati.
  - nota: «Il tecnico del suono Ben Burtt combinò orsi, trichechi, leoni e cani.» → «Il tecnico del suono Ben Burtt registrò orsi, tassi e trichechi, poi divise i suoni per emozione e li montò insieme per far «parlare» Chewbacca.»
- `bm-cinema-et`: «Anziana», «animali» e «russare» non sono confermati dalle fonti AFI: la scheda ora riporta i dettagli documentati.
  - testo: «Per la voce di E.T. fu usata anche quella di una signora anziana che fumava molto.» → «La voce di E.T. è soprattutto quella di una signora con la voce roca da fumatrice.»
  - hl: «una signora anziana» → «voce roca da fumatrice»
  - nota: «Pat Welsh diede la voce principale, mescolata con altri suoni, tra cui quelli di animali e del russare.» → «Il tecnico del suono Ben Burtt sentì Pat Welsh parlare in un negozio e le chiese un provino. Anche l'attrice Debra Winger prestò a E.T. due parole e un po' di respiro affannoso.»
- `bm-cinema-leone-mgm`: «Almeno sette» e gli incidenti di Jackie non sono confermati da fonti aperte accettate (Smithsonian bloccato).
  - nota: «Dal 1916 se ne sono succeduti almeno sette. Uno, Jackie, sopravvisse a due incidenti aerei e a un terremoto.» → «Il primo fu Slats, nel 1916, scelto per la Goldwyn Pictures. Il più longevo è Leo, che compare nei film della MGM dal 1957.»
- `bm-cinema-fellini-otto`: Treccani conta sei film interi e tre «mezzi»; la scheda diceva «sei film e mezzo da solo, più due episodi».
  - nota: «Aveva diretto sei film e mezzo da solo, più due episodi in film collettivi. Questo era l'ottavo e mezzo.» → «Fino ad allora Fellini aveva girato sei film «interi» e tre «mezzi» film: in tutto sette e mezzo. Questo era l'ottavo e mezzo.»
- `bm-cinema-lascia-raddoppia`: «Il giovedì sera» e «i cinema restavano vuoti» non sono confermati dalle fonti aperte; l'interruzione dei film sì (Treccani).
  - testo: «Negli anni Cinquanta il giovedì sera i cinema interrompevano il film per trasmettere un quiz.» → «Negli anni Cinquanta i cinema interrompevano il film per trasmettere un quiz.»
  - nota: «Era «Lascia o raddoppia?» di Mike Bongiorno: senza quel televisore in sala, i cinema restavano vuoti.» → «Era «Lascia o raddoppia?» di Mike Bongiorno, dal 1955. Pochi avevano il televisore in casa: il quiz si guardava insieme nei bar e nei cinema.»
- `bm-cinema-toy-story`: Le ore di calcolo per fotogramma non sono confermate da una pagina aperta (Guinness non mostra il testo).
  - nota: «La Pixar impiegò quattro anni. Alcuni fotogrammi richiedevano ore di calcolo l'uno.» → «Pixar ci lavorò dall'accordo con Disney, tra il 1990 e il 1991, fino all'uscita del 22 novembre 1995.»
- `bm-eco-euro-banconote`: «Per non favorire nessun paese» non è nelle pagine aperte; la nota ora dice ciò che confermano BCE e Il Post.
  - nota: «Per non favorire nessun paese, rappresentano stili architettonici europei senza edifici reali. Una città olandese poi costruì davvero i ponti delle banconote.» → «Rappresentano gli stili architettonici di sette epoche europee, senza edifici reali. Un designer olandese, Robin Stam, ha poi costruito davvero i ponti delle banconote a Spijkenisse.»
- `bm-eco-assegno`: Treccani: l'assegno nacque nei banchi del Mezzogiorno d'Italia e si sviluppò in Inghilterra; «i primi assegni nel Medioevo» non è confermato, le lettere di cambio sì (Banca d'Italia).
  - testo: «I primi assegni bancari si usavano già nel Medioevo in Italia.» → «L'assegno bancario nacque nelle banche italiane, prima di diffondersi in Inghilterra.»
  - hl: «nel Medioevo in Italia» → «nelle banche italiane»
  - nota: «I mercanti fiorentini e genovesi usavano lettere di cambio e ordini di pagamento per non viaggiare con l'oro.» → «Già dal Medioevo i banchieri fiorentini diffusero le lettere di cambio: si poteva spostare denaro tra città lontane senza viaggiare con oro e argento.»
- `bm-eco-carta-credito`: «La storia è un po' romanzata» non è confermato da una fonte aperta: la nota ora attribuisce l'aneddoto all'azienda.
  - nota: «Secondo la storia ufficiale, Frank McNamara dimenticò il portafoglio al ristorante nel 1949 e inventò la carta Diners Club. La storia è un po' romanzata.» → «Secondo la storia raccontata dall'azienda, nel 1949 Frank McNamara dimenticò il portafoglio al ristorante. Nel 1950 lanciò la carta Diners Club, la prima valida in più locali.»
- `bm-eco-bancomat`: Barclays racconta l'aneddoto ma lo stesso archivio Barclays segnala dubbi sul numero di cifre iniziale: nota resa fedele alla fonte («pensava a sei cifre»).
  - nota: «Funzionava con assegni speciali leggermente radioattivi. Il codice PIN a sei cifre fu ridotto a quattro perché la moglie dell'inventore ricordava solo quattro numeri.» → «Funzionava con assegni che contenevano carbonio 14, leggermente radioattivo. L'inventore pensava a un codice di sei cifre, ma la moglie disse che ne ricordava solo quattro.»
- `bm-eco-ikea-polpette`: «I ristoranti furono pensati per far restare i clienti più a lungo» non è confermato dalla fonte IKEA.
  - nota: «I ristoranti dei negozi furono pensati per far restare i clienti più a lungo.» → «Le serve dal 1985 nei ristoranti dei suoi negozi e le vende anche nei reparti alimentari.»
- `bm-eco-nutella-mondo`: «Un quarto delle nocciole del mondo» non è scritto nella fonte aperta, che dà un terzo della produzione turca e il 70% mondiale della Turchia (Internazionale, 2019).
  - testo: «La Ferrero usa circa un quarto delle nocciole prodotte nel mondo.» → «La Ferrero compra circa un terzo delle nocciole prodotte in Turchia.»
  - hl: «un quarto delle nocciole» → «circa un terzo»
  - nota: «La maggior parte delle nocciole del mondo viene dalla Turchia.» → «E la Turchia produce circa il 70 per cento delle nocciole del mondo, soprattutto lungo le coste del mar Nero.»
- `bm-eco-lamborghini-trattori`: Treccani presenta il litigio come tradizione, e non parla di frizione; «i trattori esistono ancora» non verificato.
  - nota: «Ferruccio Lamborghini, insoddisfatto della frizione della sua Ferrari, decise di costruire auto sue. I trattori Lamborghini esistono ancora.» → «Secondo la tradizione fu un litigio con Enzo Ferrari a spingere Ferruccio Lamborghini a costruire auto gran turismo. Il suo dodici cilindri superava quello Ferrari per cilindrata e potenza.»
- `bm-eco-vespa-film`: Nessuna fonte misura un aumento delle vendite dovuto al film; il Museo Piaggio conferma il ruolo del film nella fama della Vespa.
  - testo: «Le vendite della Vespa aumentarono dopo il film «Vacanze romane».» → ««Vacanze romane» aiutò a rendere la Vespa famosa nel mondo.»
  - hl: ««Vacanze romane»» → «famosa nel mondo»
  - nota: «Nel 1953 Audrey Hepburn e Gregory Peck girano Roma in Vespa. Il film fece conoscere lo scooter in tutto il mondo.» → «Nel film del 1953 Audrey Hepburn e Gregory Peck girano Roma su una Vespa del 1951. Negli Stati Uniti lo scooter diventò il simbolo del made in Italy.»
- `bf-cullinan`: L'aneddoto della spedizione per posta non è confermato da una pagina aperta (le fonti Royal Collection e HRP sono bloccate): sostituito con un fatto confermato dal GIA.
  - nota: «Il Cullinan, trovato in Sudafrica nel 1905, era di 3.106 carati. Fu spedito in Inghilterra per posta normale, mentre un falso viaggiava sotto scorta.» → «Il Cullinan, trovato in Sudafrica nel 1905, era di 3.106 carati. Da lui furono tagliati i due diamanti più grandi dei gioielli della Corona britannica.»
- `bf-mawsynram`: Gli ombrelli da schiena e il dato di Cherrapunji non sono confermati dalle fonti aperte: nota riscritta con i dati di NASA e OMM.
  - nota: «Mawsynram e la vicina Cherrapunji ricevono oltre 11 metri di pioggia all'anno. Gli abitanti usano ombrelli che si indossano sulla schiena.» → «Mawsynram, nello stato del Meghalaya, riceve in media quasi 12 metri di pioggia all'anno, portati dal monsone. Meghalaya vuol dire «dimora delle nuvole».»
- `bf-salto-angel`: Guinness: Jimmie Angel la sorvolò nel 1933; l'atterraggio del 1937 «sopra» la cascata non è confermato.
  - nota: «Il Salto Angel, in Venezuela, è alto 979 metri. Prende il nome dal pilota americano Jimmie Angel, che ci atterrò sopra nel 1937.» → «Il Salto Angel, in Venezuela, ha un salto totale di 979 metri. Prende il nome dal pilota americano Jimmie Angel, che la sorvolò e la annotò nel suo diario di volo nel 1933.»
- `bf-bandiere-rosso`: La causa della rarità del viola (colorante costoso) non era confermata da una fonte aperta: sostituita con il dato dello studio.
  - nota: «Compare in circa tre bandiere su quattro. Il viola invece è rarissimo: per secoli è stato un colorante costosissimo.» → «Nel 1999 compariva in circa tre bandiere su quattro, secondo uno studio presentato al Congresso internazionale di vessillologia. Il viola invece era quasi assente: solo nel pappagallo della bandiera di Dominica.»
- `bf-inno-spagna`: «Uno dei pochissimi al mondo» e i tentativi falliti di scrivere un testo non sono confermati dalla fonte ufficiale.
  - nota: «È uno dei pochissimi al mondo. Ci sono stati diversi tentativi di scrivere un testo, ma nessuno ha messo tutti d'accordo.» → «È conosciuto come «Marcha Granadera» o «Marcha Real» ed esiste in due versioni, completa e breve. Nessun testo è mai diventato ufficiale.»
- `bf-inno-grecia`: Le 158 strofe sono del poema, non dell'inno ufficiale; «il più lungo del mondo» non confermato.
  - testo: «L'inno nazionale greco ha 158 strofe.» → «Il poema da cui nasce l'inno nazionale greco ha 158 strofe.»
  - hl: «158 strofe» → «158 strofe»
  - nota: «È il più lungo del mondo. Per fortuna nelle cerimonie se ne cantano solo le prime due.» → «È l'«Inno alla libertà» di Dionysios Solomos, del 1823. Come inno nazionale se ne cantano solo le prime due.»
- `bf-althing`: La nota non diceva dell'interruzione 1800-1845, che rende discutibile «ancora attivi».
  - nota: «L'Althing fu fondato nel 930 in una pianura all'aperto, dove i capi si riunivano ogni estate.» → «L'Althing fu fondato nel 930 in una pianura all'aperto, dove i rappresentanti di tutta l'isola si riunivano ogni estate. Fu sciolto nel 1800 e ricostituito nel 1845 a Reykjavík.»
- `bf-lupi-italia`: «Il ritorno dei boschi» come causa non è confermato dalle fonti.
  - nota: «Erano quasi estinti. La protezione legale e il ritorno dei boschi hanno permesso al lupo di ricolonizzare gli Appennini e le Alpi.» → «Erano quasi estinti: ne restavano circa cento tra Abruzzo e Calabria. Grazie alla protezione della specie sono tornati in quasi tutta l'Italia peninsulare e sulle Alpi.»
- `bf-orso-marsicano`: La stima ISPRA 2025 è di 81 orsi, non circa sessanta.
  - nota: «L'orso bruno marsicano vive tra Abruzzo, Lazio e Molise. Ne restano circa sessanta esemplari.» → «L'orso bruno marsicano vive nell'Appennino centrale, tra Abruzzo, Lazio e Molise. Secondo la stima ISPRA del 2025 ne restano circa ottanta.»
- `bf-stambecco`: «Poche decine all'inizio dell'Ottocento» non è confermato dalla fonte ufficiale del parco.
  - nota: «All'inizio dell'Ottocento ne restavano poche decine sul Gran Paradiso. Vittorio Emanuele II ne fece una riserva, poi diventata il primo parco nazionale italiano.» → «Nel 1856, quando era ridotto a livelli allarmanti, Vittorio Emanuele II fece del Gran Paradiso una riserva reale di caccia. Nel 1922 la riserva diventò il primo parco nazionale italiano.»
- `bf-marsili`: INGV: circa 2.700 metri di altezza dal fondale, non più di tremila.
  - nota: «È il Marsili, lungo circa 70 chilometri e alto più di tremila metri, ma la cima resta centinaia di metri sotto la superficie.» → «È il Marsili: lungo circa 70 chilometri, si alza di circa 2.700 metri dal fondale, ma la cima resta circa 450 metri sotto la superficie.»
- `bf-cavalli-vomito`: «I problemi digestivi possono essere gravissimi» non confermato dalle fonti aperte: tolto.
  - nota: «Un muscolo all'ingresso dello stomaco è così forte da impedirlo. Per questo per loro i problemi digestivi possono essere gravissimi. Anche i ratti non vomitano.» → «I muscoli all'ingresso dello stomaco si chiudono così forte da impedire al cibo di tornare indietro. Nemmeno i roditori, ratti compresi, riescono a vomitare.»
- `bf-lucciole`: «Trasforma in luce quasi tutta l'energia» non è confermato dalla fonte aperta, e la ricerca mostra studi che ridimensionano l'efficienza: resta la luce fredda, confermata.
  - nota: «È una reazione chimica che trasforma in luce quasi tutta l'energia. Una lampadina a incandescenza ne sprecava la maggior parte in calore.» → «È una reazione chimica che produce «luce fredda»: pochissima energia si disperde in calore. Una lampadina a incandescenza, invece, scalda molto più di quanto illumina.»
- `bf-pinguini-sasso`: Il «regalo» del sasso alla compagna non è confermato dalle fonti: lo sono il nido di sassi preparato dal maschio e i furti tra vicini.
  - testo: «Alcuni pinguini corteggiano la compagna regalandole un sasso.» → «I pinguini di Adelia preparano il nido di sassi prima che arrivi la compagna.»
  - hl: «regalandole un sasso» → «il nido di sassi»
  - nota: «I pinguini di Adelia usano i sassi per costruire il nido, e il maschio cerca il più bello. A volte li rubano ai vicini.» → «I maschi tornano al vecchio nido e lo sistemano con sassi e altri oggetti prima del ritorno delle femmine. Spesso i sassi li rubano ai vicini.»
- `bf-delfini-sonno-2`: La fonte parla del cordone ombelicale, non del sacco amniotico.
  - nota: «La madre partorisce in piedi. La caduta rompe il sacco amniotico e stimola il piccolo a respirare. Dopo meno di un'ora sta già in piedi.» → «La madre partorisce in piedi. La caduta aiuta a rompere il cordone ombelicale e spinge il piccolo a respirare. Entro un'ora sta già in piedi.»
- `bf-ape-velocita`: Caltech: circa 230 battiti al secondo; «circa 200» era impreciso.
  - testo: «Le api battono le ali circa 200 volte al secondo.» → «Le api battono le ali più di 200 volte al secondo.»
  - hl: «circa 200 volte al secondo» → «più di 200 volte al secondo»
- `bf-pesci-sonno`: «Senza chiudere gli occhi» non vale per tutti: alcuni squali chiudono gli occhi (National Geographic).
  - testo: «Anche i pesci dormono, pur senza chiudere gli occhi.» → «Anche i pesci dormono, anche se non come noi.»
  - hl: «senza chiudere gli occhi» → «Anche i pesci dormono»
  - nota: «Non hanno palpebre, ma rallentano, restano fermi e reagiscono meno agli stimoli. Alcuni si nascondono tra le rocce o si avvolgono in una bolla di muco.» → «Rallentano attività e metabolismo restando attenti ai pericoli: alcuni restano sospesi, altri si infilano nel fango o tra i coralli. Alcuni pesci pappagallo si avvolgono in una bolla di muco.»

**Duplicati segnalati**

- nessuno

### Blocco 02: MONDO 2 (bm-mozart-cane → bn-naso-ricordi) — completato il 2026-11-12

100 schede: 45 confermate, 49 corrette (e poi verificate), 6 in bozza.

**In bozza**

- `bn-cuore-giraffa`: Controversa: la Giraffe Conservation Foundation dice 11 kg, ma la ricerca trova uno studio del Journal of Experimental Biology con circa 2,7 kg (pagina bloccata, non aperta). Da decidere con fonti scientifiche aperte.
- `bn-lombrichi-cuori`: Le uniche pagine trovate sulle cinque coppie di archi aortici sono siti di curiosità o di ripetizioni scolastiche; le pagine universitarie e di musei trovate erano irraggiungibili (403) o senza testo leggibile. Il fatto è noto: da verificare su una fonte accettata.
- `bn-mucche-amiche`: La fonte primaria (tesi di dottorato di K. McLennan, University of Northampton, 2013, su core.ac.uk) è bloccata da un controllo anti-bot; trovati solo il titolo di un seminario a Cambridge e articoli di siti divulgativi (VegNews e simili). Da verificare sulla tesi.
- `bn-impronte-dna`: Le fonti trovate sono studi su campioni piccoli (34-250 persone) che propongono la lingua come identificatore biometrico; nessuna dimostra che l'impronta della lingua sia unica per ogni persona come quella digitale. Da riformulare («la lingua si studia come identificatore biometrico») o lasciare fuori.
- `bn-arcobaleno`: Non confermata da una pagina aperta: le fonti meteorologiche spiegano la geometria (42° dal punto opposto al Sole) ma non dicono esplicitamente che ognuno vede un arcobaleno diverso; la pagina APOD della NASA non si leggeva. Da riverificare.
- `bm-musica-piante`: Controversa: la ricerca segnala studi recenti (non aperti: PubMed bloccava le richieste) che riportano effetti del suono sulla crescita delle piante. Il «falso» della scheda non è dimostrato: da riverificare.

**Corrette** (prima → dopo)

- `bn-lingua-giraffa`: 
  - nota: «La usa per strappare le foglie tra le spine delle acacie. È scura, forse per proteggersi dalle scottature.» → «La usa come una mano per staccare le foglie tra le spine degli alberi. È blu scuro, forse per proteggersi dalle scottature: è l'ipotesi più seguita, ma non è certa.»
- `bn-balene-canto`: «Si sente a centinaia di chilometri» non è confermato dalle fonti aperte; la seconda parte della nota, confermata, è diventata la scheda.
  - testo: «Il canto delle megattere può essere sentito a centinaia di chilometri.» → «I maschi di megattera di una stessa popolazione cantano tutti la stessa canzone.»
  - hl: «a centinaia di chilometri» → «la stessa canzone»
  - nota: «Sott'acqua il suono viaggia lontanissimo. I maschi di una stessa zona cantano la stessa canzone, che cambia lentamente ogni anno.» → «La canzone cambia col tempo e tutti la aggiornano. Popolazioni dello stesso oceano cantano canzoni simili, quelle di oceani diversi canzoni diverse.»
- `bn-balena-pesce`: Allattamento e sangue caldo non sono nelle pagine aperte (Smithsonian bloccato); la nota ora usa fatti confermati da National Geographic.
  - nota: «È un mammifero: respira aria con i polmoni, allatta i piccoli e ha il sangue caldo. I suoi antenati camminavano sulla terraferma.» → «È un mammifero marino: non può respirare sott'acqua e deve tornare in superficie. I suoi antenati avevano le zampe: il Basilosaurus aveva ancora due piccole zampe posteriori.»
- `bn-elefante-proboscide`: L'assenza di ossa e la nocciolina non sono nella pagina aperta (Smithsonian bloccato); la nota usa i dati di Scientific American.
  - nota: «Non ha ossa. Con lei l'elefante solleva tronchi, ma riesce anche a raccogliere una nocciolina.» → «Contiene circa 40.000 muscoli e pesa circa 140 chili. Quando serve, è anche un'arma potente.»
- `bn-koala-impronte-2`: 
  - nota: «Il loro intestino è lunghissimo e pieno di batteri che neutralizzano le sostanze tossiche.» → «Il loro apparato digerente è adattato a neutralizzare le sostanze velenose delle foglie. Il cieco, un tratto dell'intestino, è lungo circa due metri e pieno di batteri.»
- `bn-canguro-indietro`: Gli esperti dicono che i canguri faticano ma possono indietreggiare; e la scelta per lo stemma non è una leggenda, la dichiara il governo australiano (ABC).
  - testo: «I canguri non riescono a camminare all'indietro.» → «I canguri fanno molta fatica a camminare all'indietro.»
  - hl: «all'indietro» → «all'indietro»
  - nota: «La coda grossa e le zampe posteriori fatte per saltare glielo impediscono. Si dice, ma è una leggenda, che per questo siano sullo stemma australiano.» → «Per il governo australiano è anche per questo che sono sullo stemma con l'emù: simboleggiano un paese che va avanti. L'emù però all'indietro cammina senza problemi.»
- `bn-corvi-volti-2`: Il risultato del 2008 è stato messo in dubbio da una replica pubblicata nel 2023 (PLOS One): la scheda lo presentava come certo.
  - testo: «Le gazze si riconoscono allo specchio.» → «In un esperimento del 2008 alcune gazze sembrarono riconoscersi allo specchio.»
  - hl: «si riconoscono allo specchio» → «riconoscersi allo specchio»
  - nota: «È una capacità rara: ce l'hanno le grandi scimmie, i delfini, gli elefanti e pochissimi uccelli.» → «Cercavano di togliersi una macchia che potevano vedere solo riflessa. Ma un tentativo di ripetere l'esperimento, nel 2023, non ha confermato il risultato.»
- `bn-api-miele`: «Un dodicesimo di cucchiaino per ape» non è confermato da una pagina aperta (fonti dell'industria del miele bloccate); aggiunta la stima riportata da National Geographic.
  - nota: «Un'ape in tutta la vita produce circa un dodicesimo di cucchiaino di miele. Il lavoro è di tutto l'alveare.» → «Secondo una stima dell'ecologo Bernd Heinrich, mezzo chilo di miele di trifoglio corrisponde al nettare di circa 8,7 milioni di fiori. È il lavoro di tutto l'alveare.»
- `bn-lumache-denti`: 
  - nota: «Sono minuscoli e disposti su una specie di lingua ruvida, la radula, con cui grattano le foglie.» → «Sono minuscoli e stanno su una specie di nastro flessibile, la radula, con cui la lumaca gratta il cibo contro la mascella.»
- `bn-medusa-cervello`: 
  - nota: «Sono fatte per più del 95% d'acqua. Esistono da più di 500 milioni di anni.» → «Al posto del cervello hanno una semplice rete di nervi. Sono fatte per circa il 95% d'acqua ed esistono da più di 500 milioni di anni.»
- `bn-corallo-animale`: La fonte NOAA li paragona agli anemoni di mare; la parentela con le meduse non è nella pagina aperta.
  - nota: «Sono colonie di minuscoli polipi parenti delle meduse. Il colore viene da alghe che vivono dentro di loro.» → «Sono colonie di minuscoli polipi trasparenti, simili a piccoli anemoni di mare. Il colore viene dalle alghe che vivono nei loro tessuti.»
- `bn-cani-naso`: «In alcuni paesi si usano per identificarli» non è confermato da una pagina aperta.
  - nota: «Le pieghe del tartufo sono diverse da cane a cane. In alcuni paesi si usano per identificarli.» → «Le pieghe del tartufo cambiano da cane a cane, come le impronte delle dita nelle persone. Lo ricorda l'American Kennel Club.»
- `bn-cani-tempo`: Horowitz stessa dice che è un'ipotesi mai testata scientificamente (NPR): il testo lo presentava come un fatto.
  - testo: «I cani riescono a «sentire» il passare del tempo con l'olfatto.» → «Secondo una ricercatrice, i cani potrebbero «sentire» il passare del tempo con l'olfatto.»
  - hl: «con l'olfatto» → «il passare del tempo»
  - nota: «Durante il giorno l'odore di una persona in casa si affievolisce. Alcuni ricercatori pensano che sia così che capiscono quando stai per tornare.» → «Durante il giorno l'odore di chi è uscito di casa si affievolisce: la psicologa Alexandra Horowitz pensa che i cani usino questo segnale. È un'ipotesi non ancora verificata.»
- `bn-camaleonte-lingua`: La fonte (Brown University) dà 2,5 volte la lunghezza del corpo, non «quasi il doppio».
  - nota: «Nei camaleonti più piccoli supera le 250 volte l'accelerazione di gravità. Può essere lunga quasi il doppio del corpo.» → «In un camaleonte piccolissimo, il Rhampholeon spinosus, è arrivata a 264 volte l'accelerazione di gravità. Ed è uscita fino a 2,5 volte la lunghezza del suo corpo.»
- `bn-erba-tagliata`: La funzione di «riparare i tessuti» non è confermata dalla fonte aperta.
  - nota: «Sono sostanze rilasciate dalle ferite, che servono a riparare i tessuti e ad attirare predatori degli insetti.» → «Sono sostanze che la pianta rilascia quando viene ferita. Le libera anche quando un bruco la mangia, e altri insetti accorrono a predare il bruco.»
- `bn-mandorle-noci`: 
  - nota: «Sono i semi di un frutto simile alla pesca: il mandorlo è parente stretto di pesco e ciliegio.» → «Per i botanici il frutto del mandorlo è una drupa, come la pesca: la mandorla è il seme dentro il nocciolo. Mandorlo e pesco appartengono allo stesso genere, Prunus.»
- `bn-baobab`: National Geographic dice 100.000 litri, non «oltre»; l'età di mille anni non è confermata da una pagina aperta (Kew bloccato).
  - testo: «Il tronco di un baobab può contenere oltre centomila litri d'acqua.» → «Il tronco di un baobab può contenere fino a centomila litri d'acqua.»
  - hl: «centomila litri» → «fino a centomila litri»
  - nota: «Lo usa come riserva durante la stagione secca. Alcuni baobab hanno più di mille anni.» → «Lo usa come riserva anche nelle siccità più dure. L'acqua si concentra nel centro spugnoso del tronco, che gli elefanti assetati a volte rosicchiano.»
- `bn-intestino-lunghezza`: 
  - testo: «L'intestino umano è lungo circa sette metri.» → «Il tubo digerente di un adulto, dalla bocca all'ultimo tratto dell'intestino, è lungo circa cinque metri.»
  - hl: «circa sette metri» → «circa cinque metri»
  - nota: «Ripiegato nella pancia. La sua superficie interna, piena di piccole pieghe, è grande più o meno come metà campo da badminton.» → «La sua superficie interna, piena di pieghe, misura 30-40 metri quadrati: metà campo da badminton. Prima si credeva fosse grande come un campo da tennis.»
- `bn-cervello-acqua`: PubMed bloccava le richieste: riprovare a fine blocco.
  - testo: «Il cervello è fatto per circa tre quarti di acqua.» → «Il cervello è fatto per circa l'80% di acqua.»
  - hl: «tre quarti di acqua» → «circa l'80% di acqua»
  - nota: «Anche una disidratazione leggera può peggiorare attenzione e memoria.» → «La materia grigia ne contiene di più, circa l'84%, quella bianca circa il 69%. Anche una disidratazione leggera può peggiorare concentrazione e memoria a breve termine.»
- `bn-cornea`: Il testo «unica parte del corpo senza vasi» sembra sbagliato (anche il cristallino è senza vasi), ma le fonti PubMed erano bloccate: riprovare a fine blocco.
  - testo: «La cornea è l'unica parte del corpo senza vasi sanguigni.» → «La cornea non ha vasi sanguigni: l'ossigeno lo prende dall'aria.»
  - hl: «senza vasi sanguigni» → «lo prende dall'aria»
  - nota: «Prende l'ossigeno direttamente dall'aria. Deve essere trasparente, e i vasi la renderebbero opaca.» → «Con gli occhi chiusi ne riceve circa un terzo. Per questo le lenti a contatto devono lasciarlo passare: senza ossigeno la cornea si gonfia e si appanna.»
- `bn-battiti-vita`: I «settemila litri al giorno» non sono nelle pagine aperte; aggiunte le stime di American Heart Association e Royal Papworth Hospital.
  - nota: «Ogni giorno pompa circa settemila litri di sangue.» → «Batte circa 100.000 volte al giorno. Le stime sulla vita intera vanno da 2,5 a 3 miliardi di battiti.»
- `bn-naso-ricordi`: 
  - testo: «Gli odori risvegliano ricordi più vividi degli altri sensi.» → «I ricordi risvegliati da un odore sono più carichi di emozione di quelli evocati dagli altri sensi.»
  - hl: «ricordi più vividi» → «più carichi di emozione»
  - nota: «Il centro dell'olfatto è collegato direttamente alle aree della memoria e delle emozioni, senza passare dagli altri filtri.» → «L'olfatto è l'unico senso che arriva all'ippocampo e all'amigdala, le aree della memoria e delle emozioni, senza passare dal talamo, lo smistamento degli altri sensi.»
- `bn-mancini-percentuale`: 
  - nota: «La percentuale è simile da migliaia di anni: lo mostrano anche gli strumenti preistorici.» → «La stima migliore, da studi su oltre due milioni di persone, è il 10,6%. Dove si scoraggia l'uso della mano sinistra, i mancini dichiarati sono un po' meno.»
- `bn-altezza-media`: Lo studio (eLife 2016) riguarda gli uomini; le donne più alte sono le lettoni. «Due secoli fa erano tra i più bassi d'Europa» non è confermato.
  - testo: «Gli olandesi sono il popolo più alto del mondo.» → «Gli uomini olandesi sono i più alti del mondo.»
  - hl: «il popolo più alto» → «i più alti del mondo»
  - nota: «In media gli uomini superano gli 1,80 m. Due secoli fa erano tra i più bassi d'Europa: alimentazione e benessere hanno cambiato tutto.» → «In media misurano 182,5 cm, secondo il più grande studio sull'altezza mai fatto. Le donne più alte sono invece le lettoni.»
- `bn-luna-tutti`: 
  - testo: «Tra la Terra e la Luna entrano tutti gli altri pianeti del sistema solare, uno accanto all'altro.» → «Tra la Terra e la Luna ci stanno tutti gli altri pianeti del sistema solare, in fila: ma solo da polo a polo.»
  - hl: «tutti gli altri pianeti» → «solo da polo a polo»
  - nota: «La distanza media è di circa 384.000 km, e i diametri sommati dei pianeti ci stanno, anche se di poco.» → «Alla distanza media, tra le superfici di Terra e Luna ci sono circa 376.000 km. I sette pianeti misurati da polo a polo fanno circa 365.000 km. Misurati all'equatore, più largo, non ci starebbero.»
- `bn-giove-protettore`: 
  - testo: «Giove ha più di novanta lune.» → «Giove ha più di cento lune.»
  - hl: «più di novanta lune» → «più di cento lune»
  - nota: «Il numero cresce di continuo con le nuove scoperte. Ganimede, la più grande, è più grande del pianeta Mercurio.» → «La NASA ne conta 115 riconosciute ufficialmente, e il numero cresce con le nuove scoperte. Ganimede, la più grande, è più grande del pianeta Mercurio.»
- `bn-acqua-espande`: Le bottiglie che scoppiano e i laghi che gelerebbero dal fondo non sono nelle pagine aperte; la nota ora dice ciò che conferma Treccani.
  - nota: «Per questo il ghiaccio galleggia e le bottiglie in freezer scoppiano. Se il ghiaccio affondasse, laghi e mari gelerebbero dal fondo.» → «Per questo il ghiaccio galleggia, mentre di solito il solido è più denso del liquido. Lo strato di ghiaccio sulla superficie di laghi e mari protegge la vita che sta sotto.»
- `bn-fulmini-vulcani`: Il ruolo del ghiaccio non è nella pagina aperta; la nota ora dice solo ciò che conferma National Geographic.
  - nota: «Le particelle di cenere e ghiaccio si urtano e si caricano di elettricità, come in un temporale.» → «Nella nube le particelle di cenere si urtano e si caricano di elettricità: si crea uno squilibrio di cariche, come in un temporale.»
- `bn-dinamite-nobel`: Il legame tra l'episodio e i premi è un'ipotesi (National Geographic: «it has been suggested»), mentre il testo lo dava per certo.
  - testo: «Alfred Nobel creò i premi anche dopo aver letto per errore il proprio necrologio.» → «Nel 1888 un giornale pubblicò per errore la notizia della morte di Alfred Nobel.»
  - hl: «il proprio necrologio» → «per errore»
  - nota: «Nel 1888 un giornale, confondendolo con il fratello morto, lo definì «il mercante di morte». Si dice che volesse cambiare il modo in cui sarebbe stato ricordato.» → «Era morto il fratello Ludvig, e il giornalista titolò: «Il mercante di morte è morto». Si è ipotizzato che l'episodio abbia spinto Nobel a pensare alla sua eredità, e quindi ai premi.»
- `bn-dolcificante`: «Diversi dolcificanti» non è confermato: per il ciclamato si racconta di una sigaretta, non delle mani; la scheda ora parla solo della saccarina.
  - testo: «Diversi dolcificanti sono stati scoperti da chimici che non si erano lavati le mani.» → «La saccarina fu scoperta da un chimico che non si era lavato le mani.»
  - hl: «non si erano lavati le mani» → «non si era lavato le mani»
  - nota: «La saccarina nel 1879, e altri dopo: i ricercatori sentirono un sapore dolce sulle dita a cena.» → «Una sera del 1879 Constantin Fahlberg addentò un panino e lo trovò dolcissimo: aveva le mani sporche di un composto del laboratorio. Tornò di corsa ad assaggiare tutto quello che aveva sul bancone.»
- `bm-telefono-peso`: Pesava 785-794 grammi, non «quasi un chilo»; prezzo e durata della batteria non confermati da pagine aperte (Smithsonian bloccato).
  - testo: «Il primo cellulare in vendita pesava quasi un chilo.» → «Il primo cellulare in vendita pesava quasi 800 grammi.»
  - hl: «quasi un chilo» → «quasi 800 grammi»
  - nota: «Il Motorola DynaTAC, del 1983, costava quasi 4.000 dollari. La batteria durava circa mezz'ora di conversazione.» → «Era il Motorola DynaTAC 8000X, del 1983. Per la forma lo chiamavano «il mattone».»
- `bm-password-123456`: «Ogni anno in cima» e «si indovina in meno di un secondo» non sono confermati da una pagina aperta (NordPass bloccato).
  - nota: «Ogni anno compare in cima alle classifiche delle password trovate nei furti di dati. Si indovina in meno di un secondo.» → «Un'analisi del 2019 del Centro nazionale britannico per la sicurezza informatica l'ha trovata in 23,2 milioni di account violati in tutto il mondo.»
- `bm-spam-quantita`: «I filtri ne bloccano quasi tutti» non è confermato; aggiunto il dato Kaspersky 2024.
  - nota: «Le stime variano negli anni, ma la quota di messaggi indesiderati resta enorme. I filtri ne bloccano quasi tutti prima che li vediamo.» → «Secondo Kaspersky, nel 2024 lo spam era il 47% del traffico email mondiale. Le stime variano di anno in anno di qualche punto.»
- `bm-videogiochi-ospedale`: «Fece più file di qualsiasi altra attrazione» non è confermato; la fonte dice che centinaia di persone fecero la fila.
  - nota: «Nel 1958 il fisico William Higinbotham creò «Tennis for Two» su un oscilloscopio, per l'open day del suo laboratorio. Fece più file di qualsiasi altra attrazione.» → «Nel 1958 il fisico William Higinbotham creò «Tennis for Two», su un computer analogico, per l'open day del laboratorio di Brookhaven. Centinaia di persone fecero la fila per giocarci.»
- `bm-pacman`: I comportamenti diversi dei fantasmi non sono confermati dalle pagine aperte; aggiunto un fatto confermato (The Strong).
  - nota: «Lo racconta il suo creatore, Toru Iwatani. Nel gioco, i fantasmi hanno ognuno un comportamento diverso.» → «Toru Iwatani lo creò per Namco nel 1980. È diventato il videogioco da sala più venduto di sempre.»
- `bm-tetris-urss`: «Non guadagnò nulla, diritti dello Stato» non è nelle pagine aperte; Guinness dice che ricevette pochi diritti fino al 1996.
  - nota: «Lo creò Aleksej Pažitnov nel 1984, in un centro di ricerca di Mosca. Per anni non guadagnò nulla dai diritti, che appartenevano allo Stato.» → «Lo creò Aleksej Pažitnov nel 1984, al centro di calcolo dell'Accademia delle scienze di Mosca. Per anni ne ricavò pochissimo: cominciò a ricevere diritti solo nel 1996.»
- `bm-qr-code`: L'ispirazione dal gioco del go non è confermata; la fonte Denso Wave parla di industria automobilistica, elettrica ed elettronica.
  - testo: «Il codice QR è stato inventato per l'industria delle auto.» → «Il codice QR è nato per gestire i componenti nelle fabbriche.»
  - hl: «per l'industria delle auto» → «nelle fabbriche»
  - nota: «Nel 1994 un'azienda del gruppo Toyota lo creò per tracciare i componenti in fabbrica. Il disegno fu ispirato dal gioco del go.» → «Lo creò nel 1994 la giapponese Denso Wave: i codici a barre usati nell'industria dell'auto contenevano solo una ventina di caratteri.»
- `bm-olimpiadi-tiro-piccione`: «Centinaia di uccelli uccisi» non è confermato; Guinness dà i numeri dei primi classificati.
  - nota: «A Parigi furono uccisi centinaia di uccelli. Fu la prima e unica volta.» → «Accadde a Parigi: il vincitore, il belga Léon de Lunden, ne abbatté 21. Fu la prima e unica volta.»
- `bm-olimpiadi-tiro-fune`: «La Gran Bretagna vinse più medaglie di tutti» non è confermato dalla fonte aperta.
  - nota: «Dal 1900 al 1920. La Gran Bretagna vinse più medaglie di tutti, spesso con squadre di poliziotti.» → «Fu nel programma dal 1900 al 1920. Nel 1908 vinse una squadra della polizia della City di Londra.»
- `bm-tennis-punteggio`: Il passaggio da 45 a 40 «per comodità» non è confermato dalla fonte aperta (olympics.com irraggiungibile).
  - nota: «Una delle ipotesi è che si usasse un quadrante, spostando la lancetta di un quarto a ogni punto. Il 45 sarebbe diventato 40 per comodità. L'origine vera è incerta.» → «È solo una delle ipotesi: i punti sarebbero i minuti di un'ora divisa in quarti. L'origine vera è incerta.»
- `bm-wimbledon-fragole`: Aggiunti i dati del Post (35 tonnellate, dal 1877); «quasi completamente di bianco» reso con il fatto confermato.
  - nota: «È il cibo simbolo del torneo dall'Ottocento. I giocatori devono vestire quasi completamente di bianco.» → «In media se ne mangiano quasi 35 tonnellate in due settimane: sono il dolce del torneo dalla prima edizione, nel 1877. E dagli anni Ottanta dell'Ottocento i giocatori vestono di bianco.»
- `bm-phelps-calorie`: «Mai stati nel programma dei Giochi» non è confermato dalla fonte aperta.
  - nota: «Il CIO riconosce la Federazione internazionale degli scacchi, anche se gli scacchi non sono mai stati nel programma dei Giochi.» → «Il CIO ha riconosciuto la Federazione internazionale degli scacchi nel 1999: per il movimento olimpico gli scacchi sono uno sport.»
- `bm-scacchi-mosse`: Il numero di atomi (10 alla 80) non è nelle fonti aperte; ora la nota cita Shannon, fonte della stima.
  - nota: «Le stime parlano di circa 10 elevato alla 120 partite possibili, contro circa 10 alla 80 atomi.» → «Nel 1950 il matematico Claude Shannon stimò circa 10 elevato alla 120 partite possibili: molte più degli atomi dell'universo.»
- `bm-sci-italia`: L'interruzione del Festival di Sanremo non è confermata dalle pagine aperte (olympics.com irraggiungibile).
  - nota: «A Calgary nel 1988 (slalom e gigante) e ad Albertville nel 1992 (gigante). Quando gareggiava, il Festival di Sanremo fu interrotto per trasmettere la sua gara.» → «A Calgary nel 1988 vinse slalom gigante e speciale, ad Albertville nel 1992 di nuovo il gigante. Ha vinto anche due argenti olimpici.»
- `bm-musica-brividi`: «Circa metà delle persone» non è confermato: gli studi danno quote molto diverse (dal 10 al 66%).
  - testo: «Circa metà delle persone prova i brividi ascoltando certi brani.» → «Molte persone provano i brividi ascoltando certi brani.»
  - hl: «i brividi» → «i brividi»
  - nota: «Si chiamano «frisson». Il cervello rilascia dopamina, la stessa sostanza legata al cibo e ad altri piaceri.» → «Si chiamano «frisson». Uno studio del 2011 ha mostrato che nei momenti di massimo piacere musicale il cervello rilascia dopamina, la sostanza legata ad altri piaceri come il cibo.»
- `bm-musica-mucche`: Aggiunto che lo studio non è mai stato replicato (NPR): il fatto è meno solido di come appariva.
  - nota: «Uno studio inglese del 2001 trovò un aumento di circa il 3% con musica calma, rispetto a quella veloce.» → «Uno studio dell'Università di Leicester del 2001 trovò un aumento fino al 3% con musica lenta, rispetto a quella veloce. Nessuno però lo ha mai replicato.»
- `bm-pavarotti`: La fonte non dice dove insegnò; tolto «a Modena».
  - nota: «Insegnò per un paio d'anni a Modena prima di dedicarsi al canto. Il padre era fornaio e tenore dilettante.» → «Lavorò come maestro elementare per due anni scolastici, mentre studiava canto. Il padre era fornaio e tenore dilettante.»
- `bm-violino-stradivari-prezzo`: La raccolta fondi per il Giappone non è confermata da una pagina aperta (Tarisio bloccato); aggiunto il record, confermato da NPR nel 2025.
  - nota: «Il «Lady Blunt» fu venduto all'asta nel 2011 per raccogliere fondi per il Giappone dopo lo tsunami.» → «Il «Lady Blunt», costruito nel 1721, fu venduto all'asta nel 2011 per 15,9 milioni di dollari. È ancora il record per uno strumento musicale.»
- `bm-musica-coro-alpini`: Il testo diceva che la canzone era diventata famosa nel mondo grazie alla serie; Il Post precisa che era già diffusa in quasi tutte le lingue.
  - testo: ««Bella ciao» è diventata famosa nel mondo grazie a una serie TV.» → «Una serie TV ha fatto conoscere «Bella ciao» a una nuova generazione in tutto il mondo.»
  - hl: «grazie a una serie TV» → «Una serie TV»
  - nota: «Era già un canto popolare noto, ma la serie spagnola «La casa di carta» l'ha fatta conoscere a una nuova generazione in tutto il mondo.» → «È la spagnola «La casa di carta», del 2017: il protagonista la usa come richiamo alla rivolta. La canzone esisteva già in versioni in quasi tutte le lingue.»

**Duplicati segnalati**

- nessuno

### Blocco 03: MONDO 3 (bn-neuroni-velocita → bq-kiwi) — completato il 2026-11-12

100 schede: 42 confermate, 44 corrette (e poi verificate), 14 in bozza.

**In bozza**

- `bn-pinguini-ginocchia`: Trovati solo siti di domande e risposte o di curiosità; nessun museo o università. Il fatto è noto: da verificare su una fonte accettata.
- `bn-polli-dinosauri`: Il numero di polli (circa 26-28 miliardi, dati FAO) è riportato solo da siti secondari; FAOSTAT e Our World in Data non si sono aperti. Da verificare su FAOSTAT.
- `bn-ossa-bambino`: Il confronto con il cemento non è in nessuna pagina aperta; l'unica fonte aperta sul femore (LibreTexts) riprende da Wikipedia che regge «fino a 30 volte il peso di un adulto». Da verificare su una fonte di biomeccanica.
- `bn-stomaco-acido`: Trovati solo siti divulgativi; la nota parla di acido «molto concentrato», ma il pH dello stomaco è circa 1,5-3,5. Da riscrivere con una fonte medica.
- `bn-sangue-vasi`: Controversa: i 100.000 km circolano da decenni senza una fonte primaria; secondo le ricerche segnalate (non aperte), uno studio del 2021 stima i capillari in 9.000-19.000 km, meno di mezzo giro della Terra. Probabilmente falsa: da riscrivere come «falso» con la fonte dello studio.
- `bn-pelle-organo`: Peso della pelle e cellule perse al minuto si trovano solo su siti commerciali o di curiosità; un dermatologo (pagina bloccata) contesta che sia l'organo più grande. Da verificare.
- `bn-vetro-sabbia`: Le fonti sul vetro (ACS, Corning Museum, Britannica) erano bloccate; Treccani non conferma temperature né folgoriti. Da verificare.
- `bn-oro-commestibile`: Il parere EFSA del 2016 su E 175 (oro) è su un sito con controllo anti-bot e non si è potuto aprire. Secondo la ricerca, l'EFSA giudica improbabile l'assorbimento ma con dati limitati: da verificare sul parere.
- `bq-icona-salva`: Affermazione generica: trovati solo blog (Hanselman) e un sondaggio citato da un altro blog in cui il 91% degli studenti riconosceva il floppy. Nessuna fonte accettata: da riscrivere o lasciare fuori.
- `bq-decaffeinato`: L'episodio dell'acqua di mare compare solo su siti di cucina e come aneddoto («so the story goes»); date discordanti (1903, 1905, 1906). Da verificare.
- `bq-australia-canguri`: La pagina e il PDF del governo australiano (DCCEEW) non si aprono; la ricerca riporta circa 35 milioni di canguri nel 2023 nelle sole aree di caccia. Da verificare sul documento DCCEEW.
- `bq-italiano-parole-mondo`: Le indagini trovate misurano cose diverse (sondaggio UE con pizza all'\''8%, conteggio nei dizionari della Crusca con spaghetti primo) e sono citate solo da siti secondari. Da riscrivere con una fonte precisa.
- `bq-caffe-filtro-finlandia`: I 12 kg a testa dell'ICO sono citati solo da siti secondari; Statista riporta 8,9 kg di caffè tostato (2022). Da verificare sui dati ICO.
- `bq-formaggio-francia`: Dati discordanti: WorldAtlas (senza anno) dà 27,2 kg per la Francia, siti secondari con dati OCSE 2022 danno circa 22-24 kg. Da verificare sul dato OCSE.

**Corrette** (prima → dopo)

- `bn-polpo-sangue-blu`: 
  - testo: «Il polpo può cambiare colore in meno di un secondo.» → «Il polpo può cambiare colore in pochi istanti.»
  - hl: «in meno di un secondo» → «in pochi istanti»
  - nota: «Sotto la pelle ha migliaia di cellule colorate controllate dai nervi. Le usa per mimetizzarsi e per comunicare.» → «La sua pelle è piena di cromatofori: sacchetti di pigmento circondati da muscoli comandati dai nervi. Li usa per mimetizzarsi e per comunicare.»
- `bn-seppia-daltonica`: 
  - nota: «Hanno un solo tipo di cellula per la luce. Come facciano a copiare i colori dello sfondo è ancora un mistero.» → «Hanno un solo tipo di cellula per la luce. Come copino i colori dello sfondo non è chiaro: un'ipotesi è che la forma strana della pupilla li aiuti a distinguerli.»
- `bn-pesce-palla`: 
  - nota: «In Giappone il fugu lo preparano solo cuochi con una licenza speciale, che sanno togliere le parti velenose.» → «La tetrodotossina è oltre mille volte più tossica del cianuro, secondo alcuni studi. Si concentra in ovaie, fegato, intestino e pelle, resiste alla cottura e non ha antidoto.»
- `bn-pesce-pagliaccio`: 
  - nota: «In ogni gruppo il più grande diventa femmina. Se muore, il maschio dominante cambia sesso e prende il suo posto.» → «Nascono maschi e possono diventare femmine. In ogni gruppo comanda una femmina: se muore, il maschio dominante cambia sesso e prende il suo posto.»
- `bn-salmoni`: 
  - nota: «Dopo anni in mare risalgono anche per centinaia di chilometri, riconoscendo l'odore dell'acqua della loro infanzia.» → «Da giovani, prima di andare in mare, memorizzano gli odori del fiume natale. Da adulti seguono quel ricordo per tornarci a deporre le uova.»
- `bn-zebre-strisce`: 
  - nota: «Gli esperimenti mostrano che le mosche faticano ad atterrare su superfici a strisce. Forse servono anche a regolare la temperatura.» → «Negli esperimenti di Tim Caro e Martin How le mosche si avvicinavano a zebre e cavalli allo stesso modo, ma sulle strisce non riuscivano ad atterrare bene.»
- `bn-ornitorinco`: 
  - nota: «Ha il becco d'anatra, allatta i piccoli e i maschi hanno uno sperone velenoso. I primi scienziati europei pensarono che fosse un falso.» → «Ha il becco d'anatra, allatta i piccoli e i maschi hanno uno sperone velenoso sulle zampe posteriori. I primi naturalisti europei pensarono che fosse un falso.»
- `bn-pappagalli-nomi`: 
  - testo: «Alcuni pappagalli imparano centinaia di parole.» → «Il pappagallo cenerino Alex sapeva nominare colori, forme e quantità.»
  - hl: «centinaia di parole» → «colori, forme e quantità»
  - nota: «Il pappagallo cenerino Alex, studiato per trent'anni, sapeva riconoscere colori, forme e quantità, e chiedeva cose usando le parole.» → «Irene Pepperberg lo studiò per trent'anni. Conosceva i nomi di circa 50 oggetti, sette colori e cinque forme, e contava fino a otto. Combinandoli, identificava più di 100 cose.»
- `bn-scarafaggi`: 
  - testo: «Uno scarafaggio può vivere giorni senza testa.» → «Uno scarafaggio può vivere settimane senza testa.»
  - hl: «senza testa» → «settimane senza testa»
  - nota: «Respira da piccoli fori sul corpo e non perde molto sangue. Muore dopo un po' perché non può bere.» → «Respira da piccoli fori sul corpo, senza bisogno del cervello, e il collo si chiude da solo coagulando. Gli basta poco cibo per molto tempo.»
- `bn-ossigeno-oceani`: 
  - testo: «Gran parte dell'ossigeno che respiriamo viene dagli oceani.» → «Circa metà dell'ossigeno prodotto sulla Terra viene dagli oceani.»
  - hl: «dagli oceani» → «metà dell'ossigeno»
  - nota: «Lo producono alghe e plancton microscopici. Le foreste sono importanti, ma contribuiscono meno di quanto si pensi.» → «Lo produce soprattutto il plancton: alghe e batteri microscopici. Un solo batterio, Prochlorococcus, ne produce fino al 20%. Ma la vita marina ne consuma più o meno altrettanto.»
- `bn-neuroni-velocita`: 
  - nota: «Nelle fibre nervose più veloci, rivestite di mielina. Per questo ritiriamo la mano dal fuoco prima ancora di pensarci.» → «Succede nelle fibre nervose rivestite di mielina, che fa da isolante: lì il segnale arriva a 120 metri al secondo, circa 430 km/h. Nelle fibre senza mielina è molto più lento.»
- `bn-occhi-crescita`: 
  - nota: «Crescono, ma poco: per questo i neonati sembrano avere occhi enormi rispetto al viso.» → «Crescono soprattutto nei primi anni. Alla nascita l'occhio è lungo in media 16,8 mm, a tre anni 21,8 mm, a quindici anni circa 23,4 mm.»
- `bn-sangue-freddo`: 
  - nota: «Circa due milioni e mezzo al secondo, nel midollo osseo. Ognuno vive circa quattro mesi.» → «Circa due milioni al secondo, nel midollo delle ossa grandi. Ognuno vive circa 120 giorni, poi viene eliminato da milza, fegato e midollo.»
- `bn-sogni-ricordo`: 
  - nota: «Durante il sonno la memoria che fissa i ricordi lavora poco. Annotarli appena svegli aiuta a ricordarne di più.» → «Al risveglio il cervello impiega circa due minuti a tornare a fissare i ricordi. Nel sonno calano anche acetilcolina e noradrenalina, due sostanze importanti per la memoria.»
- `bn-ridere`: 
  - nota: «Secondo alcuni studi fino a trenta volte di più. La risata serve soprattutto a creare legami, più che a reagire alle battute.» → «Lo psicologo Robert Provine ha osservato che in compagnia si ride 30 volte di più. Per lui la risata è soprattutto un segnale sociale, più che una reazione alle battute.»
- `bn-starnuto-velocita`: 
  - nota: «Gli studi con telecamere ad alta velocità mostrano una nuvola che viaggia ben oltre il metro che si credeva.» → «Le ricerche di Lydia Bourouiba, al MIT, mostrano che lo starnuto emette una nuvola di gas che trascina le goccioline: arrivano fino a circa 8 metri.»
- `bn-sole-terra`: 
  - nota: «Eppure è una stella di media grandezza. Ce ne sono di centinaia di volte più grandi.» → «Secondo i dati della NASA ce ne starebbero circa 1,3 milioni. Eppure, tra le stelle, il Sole è di media grandezza.»
- `bn-saturno-anelli`: 
  - testo: «Gli anelli di Saturno sono larghi centinaia di migliaia di km ma spessi spesso meno di un chilometro.» → «Gli anelli di Saturno arrivano a 282.000 km dal pianeta, ma di solito sono spessi una decina di metri.»
  - hl: «meno di un chilometro» → «una decina di metri»
  - nota: «Sono fatti di pezzi di ghiaccio e roccia. In proporzione sono più sottili di un foglio di carta.» → «Sono fatti di miliardi di pezzi di ghiaccio e roccia. In proporzione sono molto più sottili di un foglio di carta.»
- `bn-via-lattea-collisione`: 
  - testo: «La nostra galassia si scontrerà con Andromeda.» → «Lo scontro tra la nostra galassia e Andromeda, che si dava per certo, potrebbe non avvenire.»
  - hl: «si scontrerà con Andromeda» → «potrebbe non avvenire»
  - nota: «Succederà tra circa quattro o cinque miliardi di anni. Le stelle sono così lontane tra loro che quasi nessuna si urterà.» → «Uno studio del 2025 con i dati di Hubble e Gaia dà solo il 2% di probabilità che avvenga entro cinque miliardi di anni. In circa metà delle simulazioni le due galassie si fondono, ma più tardi.»
- `bn-orme-luna-2`: 
  - nota: «Tutte americane, tra il 1969 e il 1972. Da allora nessuno ci è più tornato.» → «Tutti uomini e tutti americani, in sei missioni Apollo tra il 1969 e il 1972. Da allora nessuno ci ha più camminato.»
- `bn-oro-tutto`: 
  - testo: «Tutto l'oro estratto nella storia starebbe in un cubo di circa 22 metri di lato.» → «Tutto l'oro estratto nella storia starebbe in un cubo di circa 23 metri di lato.»
  - hl: «circa 22 metri di lato» → «circa 23 metri di lato»
  - nota: «Sono oltre 200.000 tonnellate. L'oro è così denso che occupa pochissimo spazio.» → «Secondo il World Gold Council sono circa 222.600 tonnellate, due terzi estratte dopo il 1950. Quasi tutto esiste ancora: l'oro non si consuma.»
- `bn-oro-stelle`: 
  - nota: «Gli elementi più pesanti del ferro nascono in eventi violentissimi, come la fusione di due stelle di neutroni. L'anello che porti è polvere di stelle.» → «Nel 2017 i telescopi hanno osservato la fusione di due stelle di neutroni: ne uscì oro pari a circa 200 volte la massa della Terra. Fusioni come questa possono spiegare tutto l'oro dell'universo.»
- `bn-plastica-1907`: 
  - nota: «Era la bachelite, usata per telefoni, radio e interruttori. Prima esistevano materiali plastici di origine naturale.» → «Era la bachelite, inventata dal chimico belga Leo Baekeland. Per decenni se ne fecero telefoni, radio, gioielli e palle da biliardo.»
- `bn-suono-acqua`: 
  - nota: «Per questo le balene comunicano a enormi distanze, e sott'acqua è difficile capire da dove arriva un rumore.» → «In acqua va a circa 1.500 metri al secondo, in aria a circa 340. Nell'oceano la velocità cambia con temperatura e pressione, e questo decide quanto lontano arriva il suono.»
- `bn-radiografia`: 
  - nota: «Nel 1895 Wilhelm Röntgen notò che uno schermo si illuminava anche se il suo tubo era coperto. La prima radiografia fu la mano della moglie, con l'anello.» → «Nel 1895 Wilhelm Röntgen aveva coperto il tubo con del cartone, eppure uno schermo lì vicino si illuminava. Una delle prime radiografie fu la mano della moglie, con l'anello.»
- `bn-teflon`: 
  - nota: «Nel 1938 un chimico della DuPont trovò una sostanza bianca e scivolosa in una bombola che doveva contenere un gas per frigoriferi.» → «Nel 1938 Roy Plunkett, della DuPont, aprì una bombola che doveva contenere un gas per produrre refrigeranti. Dentro trovò una polvere bianca, scivolosa e resistente al calore.»
- `bq-hashtag`: 
  - nota: «Lo propose Chris Messina per raggruppare i messaggi per argomento. All'inizio i fondatori pensavano che fosse troppo da informatici.» → «Lo propose Chris Messina il 23 agosto 2007, per raggruppare i messaggi per argomento. All'inizio Twitter non era convinto che servisse.»
- `bq-bandiera-rossa`: 
  - nota: «Lo imponeva una legge del 1865 per i veicoli a motore. Il limite in città era di circa 3 km/h. Fu abolita nel 1896.» → «Lo imponeva una legge del 1865, che fissava il limite in città a due miglia orarie, circa 3 km/h. Nel 1896 una nuova legge esentò le auto leggere e alzò il limite a 14 miglia orarie.»
- `bq-cintura-volvo`: 
  - nota: «L'ingegnere Nils Bohlin la inventò nel 1959. Volvo lasciò il brevetto libero perché tutte le case potessero usarla. Ha salvato milioni di vite.» → «L'ingegnere Nils Bohlin la portò sulle Volvo nel 1959. Volvo scelse di non far valere il brevetto, così tutti potevano usarla. Secondo Volvo ha salvato circa un milione di vite.»
- `bq-carta-igienica-roma`: 
  - testo: «Gli antichi Romani usavano una spugna su un bastone al posto della carta igienica.» → «Nelle latrine degli antichi Romani c'era una spugna su un bastone, il tersorium.»
  - hl: «una spugna su un bastone» → «una spugna su un bastone»
  - nota: «Si chiamava «tersorium» e si sciacquava in acqua e aceto. Spesso era in comune nelle latrine pubbliche.» → «Secondo le fonti antiche la spugna si bagnava in aceto o acqua salata. Gli archeologi però discutono ancora se servisse a pulirsi o a pulire la latrina.»
- `bq-ghiaccio-india`: 
  - nota: «Frederic Tudor, il «re del ghiaccio», lo tagliava in blocchi e lo isolava con segatura. Arrivava a destinazione dopo mesi di viaggio.» → «Nel 1833 l'imprenditore di Boston Frederic Tudor spedì 180 tonnellate di ghiaccio fino a Calcutta, un viaggio di 16.000 miglia. Lo isolava con segatura e paglia.»
- `bq-frisbee`: 
  - testo: «Il frisbee nasce dalle teglie di una pasticceria.» → «Il nome «frisbee» viene dalle teglie di una pasticceria.»
  - nota: «Gli studenti di Yale si lanciavano i vassoi vuoti della Frisbie Pie Company. L'azienda di giocattoli ne prese il nome.» → «Gli studenti di Yale si lanciavano le teglie vuote della Frisbie Pie Company. La Wham-O, che vendeva il disco di plastica inventato da Fred Morrison, ne prese il nome.»
- `bq-acqua-colonia`: 
  - nota: «Giovanni Maria Farina, emigrato in Germania dalla Valle Vigezzo, la creò a Colonia nel 1709 e la chiamò così in onore della città.» → «La formula fu di Giovanni Paolo Feminis, emigrato in Germania dalla Valle Vigezzo. Un suo lontano parente, Giovanni Maria Farina, la produsse a Colonia dal 1709 e la rese famosa.»
- `bq-gomma-pane`: 
  - nota: «Nel 1770 l'inglese Edward Nairne, secondo la storia, prese per sbaglio un pezzo di caucciù invece del pane e scoprì che cancellava meglio.» → «Verso il 1766, racconta la storia, il chimico inglese Joseph Priestley prese per sbaglio un pezzo di caucciù invece del pane e vide che cancellava meglio. Edward Nairne cominciò a venderlo.»
- `bq-hello`: 
  - nota: «Prevalse «hello», proposto da Edison. In Italia si dice «pronto», cioè «sono pronto ad ascoltare».» → «Prevalse «hello», proposto dal suo rivale Thomas Edison. In Italia invece si risponde «pronto».»
- `bq-aspirapolvere`: 
  - testo: «Il primo aspirapolvere girava per le strade su un carro tirato da cavalli.» → «Uno dei primi aspirapolvere girava per le strade su un carro tirato da cavalli.»
  - nota: «Il «Puffing Billy» di Hubert Booth, del 1901, era enorme: restava fuori e i tubi entravano dalle finestre.» → «Il «Puffing Billy» di Hubert Booth, del 1901, era così grande che andava portato di casa in casa. Era anche rumoroso: i vicini protestavano e i cavalli si spaventavano.»
- `bq-caesar-salad`: 
  - nota: «Cesare Cardini, emigrato dal lago Maggiore, la creò nel suo ristorante di Tijuana negli anni Venti. Non c'entra Giulio Cesare.» → «Secondo il racconto più diffuso, il piemontese Cesare Cardini la improvvisò il 4 luglio 1924 nel suo ristorante di Tijuana, pieno di americani in fuga dal proibizionismo. Non c'entra Giulio Cesare.»
- `bq-cioccolato-latte`: 
  - nota: «Daniel Peter ci riuscì usando il latte in polvere del vicino di casa, Henri Nestlé.» → «Daniel Peter, a Vevey, provò prima con il latte in polvere del vicino di casa, Henri Nestlé, ma non funzionò. Ci riuscì con il latte condensato.»
- `bq-cioccolato-bevanda`: 
  - testo: «Per secoli il cioccolato si è soltanto bevuto.» → «Per secoli il cioccolato si è soprattutto bevuto.»
  - hl: «soltanto bevuto» → «soprattutto bevuto»
  - nota: «Aztechi ed europei lo consumavano come bevanda. La prima tavoletta da mangiare è inglese, del 1847.» → «Aztechi ed europei lo consumavano come bevanda. Nel 1847 l'azienda inglese Fry aggiunse burro di cacao e ottenne le prime tavolette prodotte in serie.»
- `bq-kiwi`: 
  - nota: «Viene dalla Cina. I coltivatori neozelandesi lo ribattezzarono negli anni Cinquanta per venderlo meglio all'estero, con il nome del loro uccello simbolo.» → «I primi semi arrivarono in Nuova Zelanda dalla Cina nel 1904. Il 15 giugno 1959 l'azienda Turners and Growers cominciò a chiamarlo kiwifruit, per venderlo meglio negli Stati Uniti.»
- `bq-finlandia-saune`: 
  - testo: «In Finlandia ci sono milioni di saune, quasi una ogni due abitanti.» → «In Finlandia ci sono più di tre milioni di saune.»
  - hl: «milioni di saune» → «più di tre milioni di saune»
  - nota: «Sono nelle case, negli uffici, perfino nel Parlamento. La sauna finlandese è patrimonio UNESCO.» → «Secondo l'Agenzia finlandese per il patrimonio sono 3,2 milioni, e quasi il 90% dei finlandesi fa la sauna ogni settimana. Dal 2020 è patrimonio immateriale UNESCO.»
- `bq-islanda-app`: 
  - nota: «Con circa 380.000 abitanti, quasi tutti discendenti da poche famiglie, il rischio non è teorico. L'app usa un archivio genealogico nazionale.» → «Usa l'archivio Íslendingabók, una specie di albero genealogico di tutto il paese. Avvicinando i telefoni si scopre quanto si è parenti. Lo slogan: «urta l'app prima di urtarvi a letto».»
- `bq-giappone-treni`: 
  - nota: «Nel 2017, sulla linea tra Tokyo e Tsukuba. Per i ritardi le compagnie rilasciano certificati da mostrare al lavoro.» → «Il 14 novembre 2017 un treno della Tsukuba Express lasciò la stazione di Minami Nagareyama circa 20 secondi prima dell'orario. La compagnia pubblicò le scuse sul suo sito.»
- `bq-alaska`: 
  - nota: «Era il 1867: circa due centesimi per acro. In America molti la chiamarono «la follia di Seward», dal ministro che la volle. Poi ci trovarono l'oro e il petrolio.» → «Era il 1867: circa due centesimi per acro. I critici la chiamarono «la follia di Seward», dal segretario di Stato che trattò l'acquisto.»

**Duplicati segnalati**

- nessuno
