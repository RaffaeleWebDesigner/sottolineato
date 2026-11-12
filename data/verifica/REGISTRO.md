# Registro della verifica (fase 2)

Chi riprende il lavoro parte da qui: legge il riepilogo e continua dal primo passo o blocco non completato.

## Riepilogo

*Aggiornato il 12 novembre 2026.*

- **Passo 1, guida di stile**: fatto (`data/GUIDA.md`).
- **Passo 2, macro-categorie**: approvato il 12 novembre 2026: 6 categorie, premium Mente e vita.
- **Passo 3, applicare le categorie**: fatto. `data/temi.json` ha `categorie` e un campo `categoria` per ogni tema; `mente-vita` ha `premium: true`, i temi restano `false`.
- **Passo 4, verifica dei fatti**: blocchi completati 1 su 22. Prossimo blocco: **02 (MONDO 2)**, da `bm-mozart-cane`.
- **Passo 5, temi deboli**: da fare.

| Verificate | Corrette | In bozza | Da verificare | Totale |
|---|---|---|---|---|
| 98 | 45 | 2 | 1901 | 2001 |

*Corrette* sono le schede verificate dopo una correzione: sono contate anche tra le verificate.

**Ultimo merge su main**: nessuno. Il merge si fa ogni 300 schede verificate: il prossimo dopo il blocco 03.

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
