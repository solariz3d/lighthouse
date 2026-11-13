# Monroe's three books: what is in which, and when (absolute sources 02, 2026-11-13)
Written by a research reader for the Third Place (Opus 5.5), from the books' own scanned text where it could be reached.
A second reader's section follows below when present.

## 1. What was read

**How the books were read.** The three books are in copyright and their full text is lending-restricted. Each is a
library scan on the Internet Archive. I queried the Archive's full-text index item by item. Each query returns at most 5
raw OCR fragments of about 100 characters from that book. Every [read] on a book below is one of those fragments,
downloaded raw and read; the quoted words are the book's own words as OCR'd. A page number is given only where the
book's running head ("REVERSE IMAGE 87", "248 Ultimate Journey") falls inside the fragment.
- Query URL form (one line, split here):
  `https://archive.org/services/search/beta/page_production/?user_query=<Q>&service_backend=fts`
  `&hits_per_page=5&filter_map={"identifier":{"<ITEM>":"inc"}}`
- Every raw response is saved, one JSON per query (422 files), in
  `C:/Users/zackn/AppData/Local/Temp/claude/690931be4a082db1/3d000000-0000-4000-8000-000000003d00/scratchpad/`
  `swarm/monroe_books/fts/`
- Shorthand used below: **JOOTB** = item `journeysoutofbod00monr` (Doubleday 1971); **FJ** = item `farjourneys0000monr`
  (Doubleday 1985); **UJ** = item `ultimatejourney0000monr` (Doubleday 1994). "FTS:FJ q=..." means that item and query.
- A multi-word query without quotes behaves like a phrase. So "no hits" is meaningful only for a single word or exact
  phrase, and even then OCR errors can hide a word. Absence claims say so.
  *(second reader: a query that mixes a quoted phrase with a bare word, such as q="RESCUE MISSION" help, returns fragments
  that hold only the bare word. Re-run on 2026-11-13, its five hits highlight "help" alone and none carries the
  RESCUE MISSION head. Such a query does not show that the two occur together, and F35 was placed by one. [read], the
  second reader's own FTS:FJ responses.)*

| # | source | how obtained | marks it earns |
|---|---|---|---|
| S1 | JOOTB, FJ, UJ: Internet Archive full-text index (OCR of library scans) | raw OCR fragments by API | [read] |
| S2 | Library of Congress MARC records 72157612, 85001633, 93032139 | raw XML | [read] |
| S3 | Open Library editions of works OL3843339W, OL3843337W, OL3843338W | raw JSON | [read] |
| S4 | Internet Archive item metadata for FJ | raw JSON; unused | [read] |
| S5 | The 1983 memo, OCR of the CIA reading-room scan on the Archive (public domain) | raw text, grep | [read] |
| S6 | SPR Psi Encyclopedia, "Robert Monroe" | raw HTML, grep | [read] for what the page says |
| S7 | Wikipedia, "Robert Monroe" | raw wikitext | [read] for what the page says |
| S8 | The Monroe Institute, "The History of Sound at the Monroe Institute" | raw HTML, grep | [read] |
| S9 | The Monroe Institute, "In Memoriam: The Legacy of Robert A. Monroe" (2016 PDF) | PDF to text; unused | [read] |
| S10 | Web search summaries (1994 TMI newsletter, 1994 radio, Lifeline pages) | summary only | [summary] |

URLs: S2 `https://lccn.loc.gov/<n>/marcxml`. S3 `https://openlibrary.org/works/<id>/editions.json`.
S4 `https://archive.org/metadata/farjourneys0000monr`. S5 `https://archive.org/download/`
`cia-readingroom-document-cia-rdp96-00788r001700210016-5/cia-rdp96-00788r001700210016-5_djvu.txt`.
S6 `https://psi-encyclopedia.spr.ac.uk/articles/robert-monroe/`.
S7 `https://en.wikipedia.org/w/index.php?title=Robert_Monroe&action=raw`.
S8 `https://www.monroeinstitute.org/pages/the-history-of-sound-at-the-monroe-institute`.
S9 `https://cdn.shopify.com/s/files/1/0263/5926/7437/files/Bob_s_Legacy_-_PDF_2020.pdf`.

## 2. Findings

### A. Editions and dates

- **F1** [read] *Journeys Out of the Body*: Garden City, N.Y., Doubleday, 1971, 279 p., "Bibliography: p. [278]-279."
  LoC MARC 72157612, fields 260 and 300.
- **F2** [read] *Far Journeys*: "1st ed.", Garden City, N.Y.: Doubleday, 1985, "xiii, 290 p.", "A Dolphin book.",
  ISBN 0385231814. LoC MARC 85001633.
- **F3** [read] *Ultimate Journey*: "1st ed.", New York: Doubleday, 1994, "xi, 303 p.", ISBN 0385472072, references
  p. 287-299. LoC MARC 93032139.
- **F4** [read] UJ's copyright page: "Copyright © 1994 by Robert A. Monroe All Rights Reserved". FTS:UJ
  q="Focus 27" "Robert A. Monroe" (front-matter fragment).
- **F5** [read] The 1983 memo's bibliography item 5 is "Monroe, Robert A. Journeys Out of the Body. New York, Doubleday
  and Company, 1971." It is the only Monroe book it cites, and the only one that existed in 1983. Memo OCR, BIBLIOGRAPHY,
  near the end of the file.
- **F6** [read] A grep of the memo's OCR finds no "Locale", "Journeys" outside the bibliography, "loosh", "Park",
  "Territories", "rings", "no time", "mind awake" or "Focus 22-27". Its "Belief System Considerations" (¶34) opens on a
  Tibetan Buddhist book, not on Monroe's later Territories. Memo OCR, ¶34 heading.

### B. *Journeys Out of the Body* (1971)

- **F7** [read] Contents, from the OCR'd contents page: 1 Not with a Wand, nor Lightly (19); 2 Search and Research (32);
  3 On the Evidence (45); 4 The Here-Now (60); 5 Infinity, Eternity (73); 6 Reverse Image (86); 7 Post Mortem (101);
  8 "'Cause the Bible Tells Me So" (116); 9 Angels and Archetypes (127); 10 Intelligent Animals (136); 11 Gift or
  Burden? (145); 12 Round Holes and Square Pegs (155); 13 The Second Body (166); 14 Mind and Supermind (179);
  15 Sexuality in the Second State (190); 16 Preliminary Exercises; 18 Analysis of Events (228); 19 Statistical
  Classification (241); 20 Inconclusive (253); 21 Premises. FTS:JOOTB q="Here-Now", q=Reverse, q="Gift or Burden",
  q="Statistical Classification", q="Second State" 16. (Chapter 17's title was not seen.)
  *(second reader: the same contents page has it: "16. Preliminary Exercises 203^ • 17. The Separation Process 216 — 18.
  Analysis of Events 228", and the list ends "21. Premises: A Rationale? 263 Glossary 275 Bibliography". [read],
  FTS:JOOTB q="Separation Process", q=Premises.)*
- **F8** [read] Locale I: "The first of these was identified as Locale I, for lack of a better nomenclature. More
  appropriately, it could be called the 'Here-Now.'" FTS:JOOTB q="Locale I". Chapter 4 carries that title.
- **F9** [read] Locale II opens chapter 5: "The best introduction to Locale II is to suggest a room with a sign over the
  door saying, 'Please Check All Physical Concepts Here.'" (OCR hyphen "Con- cepts" joined). Then: "Postulate: Locale II
  is a non-material environment with laws of motion and matter only remotely related to the physical world."
  FTS:JOOTB q="Locale II is", q="Please Check", q="only remotely related".
- **F10** [read] "In this vastness lie all of the aspects we attribute to heaven and hell". The fragment carries the
  running head "74 JOURNEYS OUT OF THE BODY", so pp. 73-74, chapter 5. "Unknown bounds" has no hit in the book.
  FTS:JOOTB q="aspects we attribute", q="unknown bounds".
- **F11** [read] Locale II's law: "Like attracts Like." Running head "INFINITY, ETERNITY 75", so p. 75.
  FTS:JOOTB q="Like attracts like".
- **F12** [read] A park-like place in Locale II, unnamed: "On one visit, I ended up in a parklike surrounding", with
  benches, "many had a dazed or shocked look of disorientation", and "this was a meeting place, where newly arrived
  waited for friends or relatives." He calls it a "Place of Meeting". Running head "INFINITY, ETERNITY 81", so pp. 80-81.
  FTS:JOOTB q=parklike, q="dazed or shocked", q="newly arrived waited for friends", q="From this Place".
- **F13** [read] Locale III: "a physical-matter world almost identical to our own." "The scientific development is
  inconsistent. There are no electrical devices whatsoever." FTS:JOOTB q="almost identical to our own", q=electricity.
- **F14** [read] Chapter 6, "Reverse Image", p. 87: "a hole in a wall which was about two feet thick and stretched
  endlessly in all directions". Running head "REVERSE IMAGE 87". FTS:JOOTB q="hole in a wall", q="two feet thick".
- **F15** [read] "'I' There" in this book is not the later I-There. It names a man whose life he entered, in what he
  calls "intrusions": "'I' There— at the first intrusion, was a rather lonely man." A fragment on the same name carries
  the running head "REVERSE IMAGE 99", so chapter 6. FTS:JOOTB q="I-There", q="I There" "REVERSE IMAGE", q=intrusion.
  *(second reader: chapter 6 confirmed by a different fragment, which holds the name and a head: '"I" REVERSE IMAGE 97
  There met her quite accidentally'. The "REVERSE IMAGE 99" fragment I found ("tell her that I was not who she REVERSE
  IMAGE 99 thought") does not contain the name. [read], FTS:JOOTB q="REVERSE IMAGE 97", q="REVERSE IMAGE 99".)*
- **F16** [read] His own count of where successful experiments went, Locale I, II, III: "Distribution in Successful
  Experiments 31.6 59-5 8.9" (OCR "59-5" for 59.5). Per cent, his figures. FTS:JOOTB q="59.5",
  q="Distribution in Successful Experiments".
- **F17** [read] Chapter 7, "Post Mortem", p. 113: "In 1964 my father died at the age of eighty-two." Later on that
  thread: "I could try to visit my father". FTS:JOOTB q="my father", q="eighty-two", q="visit my father".
- **F18** [read] Single-word or exact-phrase searches of JOOTB return no hits for: loosh, "M Band", Park, Territories,
  Reception (as a place; only "reception" of signals), retrieval, Lifeline, Hemi-Sync, binaural, rings. "Focus" occurs
  only in its ordinary sense. FTS:JOOTB, one query each.

### C. *Far Journeys* (1985)

- **F19** [read] Contents, from the OCR'd contents page and chapter heads: Prologue; Part I Near Reaches: Old Local
  Traffic; Hemi-Sync et al.; The Gateway Program; Explorer Team; New Associations; Segue. Part II Far Reaches: Surveys
  and Schematics; Contact Point; Rainbow Route; Newfound Friend; Rescue Mission; Hearsay Evidence; Shock Treatment; One
  Easy Lesson; Promised Plan; The Gathering. Epilogue: End Game; Appendices. Chapter numbers seen in heads: 2, 8 to 16.
  FTS:FJ q="Hemi-Sync et al", q="Contact Point", q="Shock Treatment", q="End Game", q=Prologue.
- **F20** [read] The interstate parable, in FJ: "Suppose you met someone who had never driven on an interstate. All his
  life, he has driven only in local traffic." FTS:FJ q="never driven on an interstate", q="local traffic".
- **F21** [read] Focus 10 in the 1985 book: "Easily defined, Focus 10 is a state where the mind is awake and the body
  asleep." And: "There was no particular significance to the number 10, and I am not sure where it originated."
  FTS:FJ q="mind is awake", q="no particular significance".
- **F22** [read] The ladder as a forest, pp. 29-30 (running head "30 FAR JOURNEYS"): ordinary waking is a "clearing in a
  dark forest—we call it C-1 consciousness". Focus 10 is a "guidepost" you can always get back to the clearing from;
  Focus 12 lies deeper in, "probably 'out of sight' of the clearing." FTS:FJ q="C-1", q=guidepost, q="the clearing".
- **F23** [read] FJ names Focus 10, 12 and 15 (a participant: "I visualized the Focus 15* blue 'door.'"). Exact-phrase
  searches for "Focus 21", "Focus 22", "Focus 23" and "Focus 27" return no hits in FJ. FTS:FJ, one query each.
- **F24** [read] Gateway tools in print in 1985: the affirmation, "I am more than my physical body. Because I am more
  than physical matter"; "'Reball,' short for resonant energy balloon"; an "'energy conversion box' (a place to leave
  problems behind)"; and "'binaural beats'". FTS:FJ q="more than my physical body", q=Balloon,
  q="Energy Conversion Box", q=binaural.
- **F25** [read] Loosh begins on p. 162 (head "162 FAR JOURNEYS"), in chapter 12 "Hearsay Evidence": "Someone,
  Somewhere (or both, in millions, or uncountable) requires, likes, needs, values, collects, drinks, eats, or uses as a
  drug (sic) a substance ident Loosh." FTS:FJ q="Someone, Somewhere", q="uses as a drug".
- **F26** [read] The Garden story, pp. 162-169 (heads "HEARSAY EVIDENCE 163/165/167/169"): "He decided to build a
  Garden and grow Loosh". Four Crops follow in turn, the third being the "Mobiles"; the purest, "distilled" loosh comes
  from the Fourth; and "the Collectors periodically harvested segments of the Fourth Crop". Loosh is a "residue" of
  actions in the carbon-oxygen cycle. The thread runs on into chapter 13 (head "SHOCK TREATMENT 177", "no loosh
  production"). FTS:FJ q="First Crop", q="Fourth Crop", q="Collectors", q="distilled Loosh", q="residue",
  q="no loosh production".
- **F27** [read] Later in the same book loosh is joined to love: "the rays of pure energy you have called loosh/love";
  ~~Earth is "A carefully designed school of compressed learning" whose aim is "To learn to be high-quality loosh/love
  producers."~~ *(second reader: the words are there, but the fragment does not name Earth. It reads "waveform labeled
  love. Yet we don't really know what it is and, with my suspicion growing, how to really use it. (A carefully designed
  school of compressed learning.) To learn to be high-quality loosh/love producers." A separate list fragment has "Human
  sojourn only. First Entry Status (FES). - Organized as a school for compressed learning." That the school is Earth is
  [inferred]. FTS:FJ q="what it is and", q="Entry Status".)* Chapter not established. FTS:FJ q=Loosh love,
  q="high-quality", q="Compressed Learning".
- **F28** [read] FJ names "Super Love (SL)": "SL is indestructible"; "SL has no object, animate or inanimate"; "SL is a
  continuous radiation, totally nondependent upon like reception or any other form of return whatsoever." Chapter not
  established. FTS:FJ q=SL, q="SL is", q="has no object".
- **F29** [read] The M Band: in the "QUICK CUES" glossary that opens chapter 10, "M-Band: Thought spectrum"
  and "M-Band noise: Uncontrolled" (OCR mixes two columns). Elsewhere: "M Band: Part of energy spectrum commonly used for
  thought, not electromagnetic", and "If there was no M Band, no life." FTS:FJ q="M Band", q="QUICK CUES",
  q="Part of energy spectrum".
- **F30** [read] Rings round the Earth: "Around the planet were rings of haze, gigantic thick rings, of indeterminate
  number." Chapter not established. FTS:FJ q=rings.
- **F31** [read] One ring holds those who "permanently exited their current physical body—dead physically but don't
  know it. Consequently, they are trying constantly to continue a physical existence". FTS:FJ q="permanently exited",
  q="dead physically", q="Consequently, they are trying".
- **F32** [read] The next ring out is the largest, with "an apparently limitless number of sub-rings", and there "all
  residents here know they have passed through physical death". The outermost ring holds the "Last-Timers", those about
  to make their last physical life. FTS:FJ q="apparently limitless", q="strong general category",
  q="single outermost ring", q="Last Timers".
- **F33** [read] Helpers come in from outside: "those from the outer rings coming in, trying to help or meeting loved
  ones at their physical death." FTS:FJ q="meeting loved ones", q="outer rings".
- **F34** [read] FJ remaps his 1971 Locale II onto the rings: "into the center major ring, used to call it Locale
  II... what an understatement, misnomer". FTS:FJ q="center major ring".
- **F35** [read] Chapter 11, "Rescue Mission", pp. 148-149: "rows of churches, it went [RESCUE MISSION 149] on endlessly.
  Humanoid forms were busily occupying themselves". ~~The chapter has a lost one pleading: "trapped . . . please, please,
  some- body help me, get me out".~~ *(second reader: the plea is not shown to be in this chapter, and it is not a lost
  one's. The full fragment runs "get me out of this thing . . . this is the last of AA, scream- ing, screaming .. . A new
  baby cried lustily in the bedroom of a New York tenement". It is AA, a character in FJ's AA and BB story, being born
  into a new life. Its chapter is not established; BB's story carries the head "HEARSAY EVIDENCE 161", so chapter 12 is
  [inferred]. The query q="RESCUE MISSION" help matches "help" alone (section 1 note). [read], FTS:FJ q="get me out",
  q="last of AA", q="new baby cried", q="Hearsay Evidence".)* FTS:FJ q=churches, q=Humanoid forms,
  q="RESCUE MISSION" help.
- **F36** [read] FJ's word for the larger self is "total self (soul?)". FTS:FJ q="total self".
- **F37** [read] FJ returns no hits for: "I-There", "Belief System Territories", Territories, "Reception Center",
  Lifeline, retrieval, "H Band", "H-Band", "M Field". FTS:FJ, one query each.
- **F38** [read] FJ names a place "the Intermediate Area", capitalised: "AA entered the Intermediate Area"; "This
  Intermediate Area was deceptive, AA decided. Has a tendency to distort." UJ has "the lighter grays of the intermediate
  rings". "Intermediary" has no hit in any of the three. FTS:FJ q="Intermediate Area", q="Has a tendency";
  FTS:UJ q="intermediate rings"; q=intermediary on all three.

### D. *Ultimate Journey* (1994)

- **F39** [read] Contents: Foreword; 1 The Variable; 2 The Long, Long Trail (from p. 15); 3 Along the Interstate;
  4 Hail and Farewell (from p. 47); 5 Recoup and Regroup (59); 6 Inside and Outside; 7 Tour Guide; 8 Recall and Review
  (97); 9 The Hard Way (105); 10 Detached Retinue (125); 11 Turning Inward (141); 12 Inside the Inside; 13 Fine Tuning;
  14 The Sum and the Parts (191); 15 Long Trail A-Winding; 16 The Roadside View; 17 More Work in Progress (231); 18 The
  New Direction (245); 19 Taking Timeout (265); Glossary; The Monroe Institute. Start pages come from heads such as
  "124 10 Detached Retinue" and the contents line "231 245 265". FTS:UJ q="The Variable", q="Hail and Farewell",
  q="The Hard Way", q="More Work in Progress", q="Taking Timeout".
- **F40** [read] The book is "Dedicated to Nancy Penn Monroe", co-founder of the Institute. Its foreword says the work
  changed course when his wife Nancy was diagnosed with cancer, and chapter 19 opens on "my wife Nancy's illness".
  FTS:UJ q=Nancy, q="Taking Timeout".
- **F41** [read] Chapter 3 "Along the Interstate": "taking the Interstate—a major highway into the Unknown."
  FTS:UJ q="Interstate".
- **F42** [read] The H Band Noise, ~~pp. 16-17 (head "17 Robert A. Monroe", chapter 2)~~ *(second reader: the head "17
  Robert A. Monroe" sits in a different H Band fragment, "moved to a point just beyond the H Band. 17 Robert A. Monroe I
  wonder if this being understands". The fragment with the definition carries no head, so its page and chapter are not
  established. The words below are all found. FTS:UJ q="H Band", q="uncontrolled thought".)*: "The H Band Noise is the peak of
  uncontrolled thought that emanates from all living forms on Earth". His "usual meeting place was just past the H Band
  Noise." In a dialogue, someone says to him: "You call it the H Band Noise. That can smother you if you let it."
  FTS:UJ q="H Band", q="uncontrolled thought".
- **F43** [read] The "(M) Field": "All living organisms use (M) to communicate." The Glossary, p. 273: "Last Timer ring
  Located in the outermost area of human influence in the (M) Field". UJ returns no hit for "M Band". FTS:UJ
  q="M Field", q="Last Timer", q="M Band".
- **F44** [read] UJ's ladder: "Focus 3 (mind-brain synchrony), Focus 10 (mind awake and alert, body asleep), Focus 12
  (state of expanded awareness), Focus 15 (state of no time), to Focus 21 (the edge of time-space". Also "thus Focus 15
  may be identified as a state of 'no time.'" FTS:UJ q="state of no time", q="mind awake".
- **F45** [read] "Focus 22. Where humans still in physical existence have only partial consciousness." It includes
  "those suffering from delirium, from chemical dependency or alcoholism, or from dementia". FTS:UJ
  q="still in physical existence", q=dementia.
- **F46** [read] p. 248 (head "248 Ultimate Journey"): "Focus 23. A level inhabited by those who have recently left
  physical existence but who either have not been able to recog-" [nize]. And: "It includes those from all periods of
  time." p. 248 lies in chapter 18 (245-264, per F39). FTS:UJ q="Focus 23. A level", q="all periods of time".
- **F47** [read] "Focus 24-26. This covers the Belief System Territories". Elsewhere he places them in the (M) Field
  next to the "Earth Life System", where many minds stay after a life. The Glossary, p. 271: "Belief system A belief
  that is prevalent in more than one human." A visit into the Territories sits on pp. 129-130, chapter 10. FTS:UJ
  q="covers the Belief System Territories", q="Belief System Territories", q="A belief that is prevalent".
- **F48** [read] Focus 27: "Here is the site of what we may call the Reception Center or the Park, which is the hub of
  it." It is "an artificial synthesis created by human minds, a way station designed to ease the trauma and shock of the
  transition out of physical reality". FTS:UJ q="hub of it", q="artificial synthesis", q="trauma and shock".
- **F49** [read] In Focus 27 one may "create his own personal and special place within Focus 27, a place to which he
  may return at will." FTS:UJ q="Focus 27".
- **F50** [read] His Park visit: "Years ago, I had arrived at the Park." It was unchanged, "with winding walks,
  benches, flowers and shrubbery". Page and chapter not established. FTS:UJ q="the Park", q="winding walks".
- **F51** [read] Lifeline: "The first Lifeline program took place at the Institute during the week beginning June 22,
  1991." Then "some two hundred people participated in the six-day intensive" over "the following four- teen months".
  FTS:UJ q="1991", q="some two hundred".
- **F52** [read] The word "retrieval" is in UJ ("The retrieval of those who had just died"). One retrieval, pp.
  112-113 (head "113 Robert A. Monroe", chapter 9): a youngster, "no more than eighteen", lying in a road where "A battle
  was going on", asks "Can I go with you?". Elsewhere, possibly the same scene: "I felt the
  youngster's hand in mine. The question was, where do I drop him off?" FTS:UJ q=retrieval, q=youngster,
  q="where do I drop".
- **F53** [read] The I-There: "I was I-There, I-There was I."; "this knowledge of the existence of my I-There—and of the
  I-There of every physical human mind- consciousness"; and an "I-There cluster" (pp. 225-226). FTS:UJ q="I-There",
  q="I-There cluster".
- **F54** [read] "The Signal" as a proper noun: "'The Signal will guide us.' 'What is this Signal?'" Elsewhere: "the
  emotion . . . that is the signal. If the proper signal is given, we are able to help." On pp. 92-93 (chapter 7) he
  searches for "just one signal, to assuage the loneliness". FTS:UJ q="Signal will guide us", q="that is the signal",
  q="to assuage the loneliness".
- **F55** [read] UJ returns no hits for "loosh" or "Locale". FTS:UJ, one query each.

### E. Later accounts, and what they say

- **F56** [read] The SPR Psi Encyclopedia gives the Locales in its own words, with no quotation marks: Locale I "(31%)",
  Locale II "(59.5%): a non-material environment with unknown bounds, which contains all aspects of what are known as
  heaven and hell", Locale III "(8.9%): an apparently parallel material world, different from ours in technology and
  social customs". It names no book for "local traffic" and "interstate". It sources most of its entry to Russell (2007).
  SPR page, section on the locales.
- **F57** [read] SPR, citing Russell (2007) p. 312: Monroe's cosmology "includes heaven or hell only as part of what he
  called 'the belief system territories'". SPR also says Nancy Monroe died in 1992 and that he "described having twice
  to visit her in the afterlife". SPR page, the biography and the paragraph after the locales.
- **F58** [read] Wikipedia: "In Monroe's first and last books, he writes about visiting the Park, the hub of what he
  called the Reception Center". Section "The Park". Wikipedia, raw wikitext.
- **F59** [read] Wikipedia says loosh is energy "created by humans (and other living beings) experiencing intense fear,
  grief, or despair", and cites "Far Journeys p. 183" for the "Someone, Somewhere" passage. Section "'Loosh' and other
  neologisms". Wikipedia, raw wikitext.
- **F60** [read] The Monroe Institute: "Bob named them 'focus levels,' for example Focus 15, a state of awareness where
  linear time is no longer experienced", and since then the Institute has been "mapping over a dozen additional Focus
  levels". TMI, "The History of Sound at the Monroe Institute".

## 3. What it offers the game

- **O1** [ours] A dating rule for every lore item, from F1-F6 and F18/F23/F37/F55. In 2005 a forum could hold all three
  books, so found lore may draw on any of them (item 174; `p-d667:78`, "a 1985 page"). A document dated 1983 or earlier
  can know only the 1971 book, and the memo cites exactly that one (F5). Locales, the Place of Meeting and "Like attracts
  Like" are 1971; rings, loosh, Super Love, the M Band and "mind awake, body asleep" are 1985; Focus 22-27, the
  Territories, the Park by name, Lifeline, retrievals, the I-There, the H Band Noise and "no time" are 1994.
  *(second reader: these dates are first appearance in the three books, not first existence. By UJ's own account
  Lifeline ran from June 1991 (F51), so a document from 1991-1994 could know it from the Institute. The 1983 memo already
  names Focus 10, 12, 15 and 21 and the Gateway tools (memo OCR ¶30, "G. Focus 15", "H. Focus 21"). [inferred])*
- **O2** [ours] The Park has two layers, from F12 and F48-F50. The place is 1971 (a "Place of Meeting", benches, the
  ~~newly dead~~ "dazed or shocked"); the name is 1994. *(second reader: the 1971 words are "newly arrived", and that they
  are the dead is [inferred]. UJ links the two layers itself: "The Park! Years ago, I had arrived at the Park" and "It was
  the same as when I had visited many years ago, with winding walks, benches". [read], FTS:UJ q="the Park",
  q="winding walks".)* For item 95 and the story lap 1 placeholder ("Don't stay in the Park
  past ten"): the Park as "an artificial synthesis created by human minds" gives a reason it can erode. Something held
  up by minds can fail. It fits his pick run_frame-4 "Parks close in overtime" and look_fear lap 4 (the erosion look).
- **O3** [ours] Loosh cuts both ways in one book, from F25-F28. Chapter 12 is a harvest: a Garden, Crops, Collectors.
  Later the same book turns it to "loosh/love" and a "Super Love" that needs no "return whatsoever". That pairs with
  item 30 (the hunter "playing with its food") for the dark one and with item 172 (love shining through the horror) for
  the good one. The good one's save could be shown as love that asks nothing back. Either face can be a find on its own,
  rare and unexplained (item 26).
- **O4** [ours] The forest ladder, from F21-F22. "A clearing in a dark forest", guideposts you can always get back from,
  and Focus 12 "out of sight" of the clearing. That is a picture of run depth or of the chapters-as-Focus plan
  (`p-d667:67-80`). "No particular significance to the number 10" lets the numbers stay unexplained, which suits item 25
  (~~"ambiguous at first"~~ *(second reader: the item's own words are "ambigious at first", `dreamzone2_the_game.md:140-141`;
  quotations stay verbatim)*).
- **O5** [ours] Endless buildings for the stuck dead, from F31, F45, F46 and F35. "Dead physically but don't know it",
  "trying constantly to continue a physical existence", and Focus 23 holding "those from all periods of time". This
  grounds item 97 ("time is non linear there") in the books, and any biome where figures repeat daily routines. "Rows of
  churches, it went on endlessly" is a ready biome image. *(second reader: this uses only the unstruck part of F35, the
  churches, which stands.)*
- **O6** [ours] Biomes as beliefs, from F11, F47 and F57. "Like attracts Like" (1971) is the rule the 1994 Territories
  rest on. That supports lore tie T2 (`p-d661:65-66`, each biome a Belief System Territory) and the world_gen district
  profiles (pick world_gen-0): a district is the shape of one shared belief.
- **O7** [ours] The wall and the near-copy world, from F13-F14. "A hole in a wall which was about two feet thick and
  stretched endlessly in all directions" is a liminal entrance in a 1971 book. Locale III, a world "almost identical to
  our own" with "no electrical devices whatsoever", is a candidate for item 26's ~~"rare outside"~~ *(second reader:
  item 26's words are "an exceedingly rare biome that is some how "outside"", `dreamzone2_the_game.md:168-169`)* or for
  a dark house.
- **O8** [ours] Two meanings of "I There", from F15 and F53. In 1971 it names a lonely man whose life he entered,
  in chapter 6. In 1994 it is the whole self. Item 107 says the darkness might "always" have been the player's self; a
  found note could use the term without resolving which meaning it means.
- **O9** [ours] A sound layer, from F29 and F42. "The H Band Noise is the peak of uncontrolled thought" that "can smother
  you" is a name and a rule for the "field" sound (sound buildpath lap 3, `buildpath_sound_2026-11-13.md:67`): it rises
  with the hunter, and the good one lifts you "just past" it. His pick sound-1 keeps the hunter's footsteps audible
  under the duck, so the noise is what thins, not the threat.
- **O10** [ours] The save as a retrieval, from F33, F51 and F52. The youngster asks "Can I go with you?" and the helper
  asks "where do I drop him off?". That fits run_frame-3 ("It saves you") and the end-of-run save: the good one takes the
  child's hand and drops him home. Lifeline began in June 1991, so a 2005 forum could know it.
- **O11** [ours] The title and the Signal, from F54 and the inference in section 6. "The Absolute" is the memo's word
  (¶18), not a Monroe name. "The Signal", the bible's pair A (`p-d667:39`), is a proper noun in the 1994 book. Either
  name now has a documented source, and they come from different documents.
- **O12** [ours] Found-text styles for item 100 (text that turns legible on focus), from F29. FJ's "QUICK CUES" are a
  glossary of terse cue words ("Blank: Don't understand"). The program's readme in the waking room (`p-d667:99`) could be
  written in that clipped style, our own words.
- **O13** [ours] Attribution and wording, from F4, F9-F10 and F56. The books are "All Rights Reserved". In-game text
  could paraphrase in our own words rather than quote. Where a line is said to be Monroe's, take it from his words (F9),
  not from the SPR's summary (F56).
- **O14** [ours] Grief, documented and kept at a distance, from F17, F40 and F57. Monroe wrote of his own father's death
  (1971) and his wife's illness shaped the 1994 book. That is a real-world parallel for the lore's "continuing bonds"
  thread (items 170-172). It describes his books only, says nothing of the game's child, and needs no diagnosis of
  anyone.

## 4. Where it contradicts or strains something the room holds

What each room file says is [read] at the file and line given. What the books say carries the mark of the finding named.

- **`handback/p-l161-look-E_2026-11-11.md:98-101`** presents the Locale definitions as "quoted by the SPR". The SPR
  text has no quotation marks; those words are its own summary (F56). Monroe's words differ: Locale II is "a
  non-material environment with laws of motion and matter only remotely related to the physical world" (F9), "unknown
  bounds" is not in the book (F10), and Locale III is "almost identical to our own" (F13). SPR also rounds Locale I to
  31% where the book says 31.6 (F16).
- **`p-l161:102`** says "local traffic" and "interstate" were a later simplification with no book named. The parable is
  in *Far Journeys* (1985; F20), probably its Prologue (section 6), and FJ's first chapter is "Old Local Traffic" (F19).
  *Ultimate Journey* chapter 3 is "Along the Interstate" (F41).
- **`p-l161:108`** and **`p-d661:50-51`** credit Focus 22-27 to *Far Journeys* (1985) and *Ultimate Journey* (1994).
  FJ has no hits for "Focus 21", "22", "23" or "27", nor for the Territories or the Reception Center (F23, F37). FJ has
  rings (F30-F32). The numbered levels 22-27 are in UJ (F44-F48).
- **`p-l161:118`**: "There is no single coined term 'intermediary zones'... and I found none in Monroe either." The
  word "intermediary" is indeed absent, but FJ (1985) has a named place, "the Intermediate Area", and UJ has
  "intermediate rings" (F38). Both postdate the memo, whose own words are "intervening" and "intermediate dimensions".
- **`loop/buildpath_story_lore_2026-11-13.md:36`** and **`p-d661:72`** call the Park later Monroe usage. That holds for
  the name (UJ 1994, F48-F50). The place itself, a meeting place of the ~~newly dead~~ *(second reader: the book says
  "newly arrived"; that they are the dead is [inferred])* with benches, is in the 1971 book (F12), which the 1983 memo
  cites (F5).
- **`handback/p-d667-story-E_2026-11-11.md:57-58`** puts Focus 15 "no time" under [DOC] next to "the memo ¶30". The
  phrase is documented, but in *Ultimate Journey* (1994, F44) and on the Institute's own page (F60), not in the memo
  (F6). **`briefs/dreamzone2_the_game.md:801-802`** (item 97's note) has the same compression. The room's later notes
  already say so (`buildpath_story_lore:56`, `p-l161:88`); this gives the date.
- **`p-l161:88`, `:113`** and **`p-d667:76`** date "mind awake, body asleep" as Monroe Institute usage, later than the
  memo. Consistent: its earliest form in the three books is FJ 1985 (F21), and UJ 1994 has "mind awake and alert, body
  asleep" (F44).
- **Wikipedia, which the room cites as L4,** strains in two places. Its "first and last books" Park claim (F58) holds
  for the place but not the name: JOOTB never uses "Park" (F18) and says "parklike" (F12). *(second reader: UJ itself
  joins the two, "Years ago, I had arrived at the Park", F50; so Wikipedia's reading has Monroe's 1994 words behind it.)*
  Its loosh ref gives "Far Journeys p. 183"; ~~the scan of the same 1985 edition~~ *(second reader: the ref names no
  edition. Wikipedia's bibliography lists the 1985 1st ed. with ISBN 978-0385231824; Open Library lists 0385231822 as a
  1987 Doubleday printing, 290 p.; the scanned item's metadata lists both 0385231814 and 0385231822. Same pagination is
  likely but [inferred]. Sources: Wikipedia raw wikitext, "==Bibliography=="; `openlibrary.org/works/OL3843337W/
  editions.json`; `archive.org/metadata/farjourneys0000monr/metadata`.)* the 1985 scan shows the passage on p. 162 (F25). Its "fear, grief, or despair"
  is not the book's wording: "grief" has no hit in FJ, and FJ also ties loosh to love (F27-F28).
- **`p-d661:25-26`** says the institute was named The Monroe Institute in 1977 (from SPR). The Institute's own site
  header says "Exploring Consciousness Since 1973" [read, TMI page header]. Wikipedia says the research arm became an
  independent non-profit in 1985 [read, Wikipedia raw]. All three can be true of different events; the room should not
  pick one without a source that names the event.

## 5. Could not obtain

- The books' full text. All three scans are lending-restricted. The Archive's per-book "search inside" endpoint
  (`/fulltext/inside.php`) returned "Item not available", so page numbers exist only where a running head fell inside a
  fragment.
- Several placements: the chapters of the loosh/love and Super Love passages (F27-F28), the rings (F30-F32), the Park
  visit (F50), the Lifeline account (F51) and FJ's Focus 10 definition (F21).
- Ronald Russell, *The Journey of Robert Monroe* (2007), which SPR and Wikipedia lean on. Not opened.
- The Monroe Institute's Lifeline page (`/pages/lifeline`: HTTP 404) and three TMI blog pages (HTTP 429).
- Bayard Stockton's 1989 biography (cited by SPR). Not opened.
- Full copies of the books uploaded by Archive users (for example `far-journeys-robert-a.-monroe`) were not opened.
  They look like unlicensed copies, not lawful excerpts.

## 6. Not verified

- [summary] A 1994 Monroe article in the Institute's newsletter, seen only through a search summary: by September 1993
  "over eighteen" Lifeline programs with 270 participants, and Focus 27 as "our label for The Park". The year
  of the first program is not stated in that summary; UJ gives June 22, 1991 (F51).
- [summary] A 1994 radio interview, seen only through a search summary: over 2,000 retrieval runs by 400 participants.
- [summary] Search summaries call Focus 23 "New Goners" and Focus 21 "The Bridge" in Institute materials, and mention a
  Focus 18. None of these labels was seen in the three books' fragments.
- [inferred] That "the Absolute" is never a proper name in the three books. JOOTB and UJ fragments show only the
  adjective; FJ returned 5 fragments, the maximum, so more uses could exist unseen.
- [inferred] FJ chapter numbers 1 and 3 to 7, and UJ chapters 1, 5, 15 and 18, come from contents order. Their numbers
  were not seen in a head.
- [inferred] The interstate parable (F20) sits in FJ's Prologue, about p. xi. Its last fragment ends "What do you do?
  What" and a fragment headed "XI PROLOGUE" begins "do? What would you do? Nothing? Suppose the recalcitrant is an old
  and dear ... friend". The overlap suggests one passage; it does not prove it.
- [summary: from memory, unverified] That chapter 6 of JOOTB is its Locale III chapter, so the hole in the wall (F14)
  and "'I' There" (F15) belong to Locale III. The Locale III fragments (F13) carry no running head.
  *(second reader: now partly supported. A chapter 6 fragment describes steam power, "coal was used as a thermal source
  to REVERSE IMAGE 95 produce steam", which fits Locale III's "no electrical devices whatsoever". Still [inferred], not
  proven. [read] for the fragment, FTS:JOOTB q="REVERSE IMAGE 95".)*
- [inferred] Absence claims (F18, F23, F37, F55) rest on single-word or exact-phrase searches of OCR. A misread word or a
  line-break hyphen can hide a real occurrence.
- [inferred] Page numbers are for the scanned printings (JOOTB 1971 Doubleday; FJ 1985 Doubleday "Dolphin"; UJ 1994
  Doubleday). Later printings, such as the 2000 Broadway Books UJ (ISBN 0385472080, Open Library), may paginate
  differently.
- [summary] SPR's claim, from Russell's biography, that Monroe twice visited his late wife "in the afterlife" and then
  stopped (F57). Not checked against the biography or found in UJ's fragments.

## Second reader, 2026-11-13

Method. The second reader fetched every check below again rather than using the first reader's downloads. Book text came
from the Archive full-text API, with the same URL form as section 1 and one query per check. The raw JSON is saved in
`C:/Users/zackn/AppData/Local/Temp/claude/690931be4a082db1/3d000000-0000-4000-8000-000000003d00/scratchpad/swarm/`
`monroe_books_second/fts/`. Other sources were fetched by curl into `.../monroe_books_second/{loc,ol,memo,web}/` and
searched with grep. "FTS:X q=" names the query. Words in quotes below are the raw fragment's words as OCR'd.

| claim | verdict | evidence found |
|---|---|---|
| F1 JOOTB edition | OK | LoC 72157612 marcxml: 260 "Garden City, N.Y., Doubleday, 1971."; 300 "279 p."; 504 "Bibliography: p. [278]-279." |
| F2 FJ edition | OK | LoC 85001633: 250 "1st ed."; 300 "xiii, 290 p."; 500 "A Dolphin book."; 020 "0385231814". Book's CIP: "ISBN 0-385-23181-4" (FTS:FJ q=ISBN) |
| F3 UJ edition | OK | LoC 93032139: 250 "1st ed."; 260 "New York : Doubleday, 1994."; 300 "xi, 303 p."; 504 "(p. 287-299)" |
| F4 UJ copyright | OK | "Copyright © 1994 by Robert A. Monroe All Rights Reserved" (FTS:UJ q="All Rights Reserved"). JOOTB and FJ carry the same line, so O13 holds for all three |
| F5 memo bibliography | OK | memo OCR line 1730: "5. Monroe, Robert A. Journeys Out of the Body. New York, Doubleday and Company," / "1971." |
| F6 memo absences, ¶34 | OK | grep finds no Locale, loosh, Territories, "no time", "mind awake" or Focus 22-27. "Journeys" occurs only at line 1730, and "park" and "rings" only inside spark/brings. Line 1541: "34, Belief System Considerations. In 1967, Alexandra David-Neel" |
| F7 JOOTB contents | OK, completed | every listed title and page found. Added in place: ch. 16 at 203, ch. 17 "The Separation Process 216", ch. 21 "Premises: A Rationale? 263" |
| F8 Locale I | OK | "The first of these was identified as Locale I, for lack of a better nomenclature. More" (FTS:JOOTB q="Locale I") |
| F9 Locale II | OK | "INFINITY, ETERNITY The best introduction to Locale II is to suggest a room"; "Please Check All Physical Con- cepts Here."; "only remotely related to the physi- cal world" |
| F10 heaven and hell, p. 74 | OK | "aspects we attribute to heaven and hell (See Chapter \ 74 JOURNEYS OUT OF"; "unknown bounds": 0 hits |
| F11 Like attracts Like, p. 75 | OK | "75 of thought explains much. It is: Like attracts Like." |
| F12 parklike place, pp. 80-81 | OK | "parklike surrounding"; "benches along the paths"; "dazed or shocked INFINITY, ETERNITY 8l look of disorientation"; "From this Place of Meeting". "Newly dead" in O2 and section 4 is the reader's gloss on "newly arrived" and is downgraded there |
| F13 Locale III | OK | "world almost identical to our own"; "The scientific development is inconsistent. There are no electrical" |
| F14 hole in the wall, p. 87 | OK | "REVERSE IMAGE 87 it seemed to be a hole in a wall which was about two feet thick" |
| F15 "I" There, ch. 6 | OK | "'I' There— at the first intrusion, was a rather lonely man"; head '"I" REVERSE IMAGE 97 There met her' |
| F16 distribution | OK | "Locale I Locale 11 Locale HI Distribution in Successful Experiments 31.6 59-5 8.9" |
| F17 father, p. 113 | OK | "POST MORTEM II3 Til ere is one more. In 1964 my father died at the age of eighty-two." |
| F20 interstate parable | OK | "Suppose you met someone who had never driven on an interstate. All his life, he has driven only in local traffic" |
| F21 Focus 10 in FJ | OK | "Focus 10 is a state -where the mind is awake and the body asleep"; "There was no particular significance to the number 10" |
| F22 forest ladder, p. 30 | OK | "clearing in a dark 30 FAR JOURNEYS forest—we call it C-1 consciousness"; "probably "out of sight" of the clearing. This we call Focus 12" |
| F23 FJ Focus absences | OK | "Focus 21", "22", "23", "27": 0 hits each; "Focus 15* blue 'door.'" found |
| F24 Gateway tools | OK | "I am more than my physical body. Because I am more than physical matter"; "short for resonant energy balloon"; "energy conversion box"; "binaural beats" |
| F25 loosh, p. 162 | OK | "162 FAR JOURNEYS CLICK! Someone, Somewhere (or both, in millions, or uncountable) requires"; "uses as a drug (sic) a substance ident Loosh" |
| F26 Garden and Crops | OK | "build a Garden and grow Loosh"; "the first of the Mobiles, the Third Crop"; "Collectors periodically harvested segments of the Fourth Crop"; "carbon-oxygen cycle and the residue was Loosh"; "SHOCK TREATMENT 177 ... no loosh production" |
| F27 loosh/love | DOWNGRADE (part) | the words are found, but no fragment says the "school" is Earth. "Earth is" is now [inferred] |
| F28 Super Love | OK | "call it Super Love (SL)"; "SL is indestructible"; "SL has no object, animate or inanimate"; "or any other form of return whatsoever" |
| F29 M Band | OK | "10. Newfound Friend QUICK CUES Blank: Don't understand"; "M-Band: Thought spectrum"; "M Band: Part of energy spectrum commonly used for thought, not electromagnetic"; "If there was no M Band, no life" |
| F30-F32 rings | OK | "rings of haze, gigantic thick rings, of indeterminate number"; "dead physically but don't know it"; "Moving outward, the next ring is the largest of all"; "all residents here know they have passed through physical death"; "The single outermost ring is composed solely of those who are preparing for their final" |
| F33-F34 | OK | "outer rings coming in, trying to help or meeting loved ones at their physical death"; "into the center major ring, used to call it Locale II... what an understatement" |
| F35 churches, p. 149 | OK | "rows of churches, it went RESCUE MISSION 149 on endlessly. Humanoid forms" |
| F35 the plea | WRONG | "trapped . . . please, please, some- body help me, get me out of this thing . . . this is the last of AA, scream- ing, screaming .. . A new baby cried lustily". This is AA being born, and its chapter is not established. Struck in place |
| F37 FJ absences | OK | 0 hits each for "I-There", Territories, "Reception Center", Lifeline, retrieval, "H Band", "M Field" |
| F38 Intermediate Area | OK | "AA entered the Intermediate Area"; "Has a tendency to distort"; UJ "lighter grays of the intermediate rings"; "intermediary" 0 hits in all three |
| F39 UJ contents and pages | OK | heads "14 2 The Long, Long Trail", "46 4 Hail and Farewell", "58 » Recoup and Regroup", "96 8 Recall and Review", "104 9 The Hard Way", "124 10 Detached Retinue", "140 ll Turning Inward", "190 14 The Sum and the Parts", "230 17 More Work in Progress", "264 19 Taking Timeout" |
| F40 Nancy | OK | "Dedicated to Nancy Penn Monroe Co-Founder, The Monroe Institute"; "took a sad and unforeseen turn when his wife Nancy was diagnosed with Foreword cancer"; "19 Taking Timeout * The Variable, my wife Nancy's illness" |
| F41 Interstate | OK | "taking the Interstate—a major highway into the Unknown" |
| F42 H Band Noise words | OK | "Our usual meeting place was just past the H Band Noise. The H Band Noise is the peak of uncontrolled thought"; "You call it the H Band Noise. That can smother you if you let it." |
| F42 page 16-17 | UNSUPPORTED | the head "17 Robert A. Monroe" is in another fragment ("just beyond the H Band. 17 Robert A. Monroe"). Struck in place |
| F43 (M) Field | OK | "All living organisms use (M) to communicate"; "273 Glossary Last Timer ring Located in the outermost area of human influence in the (M) Field"; "M Band" 0 hits in UJ |
| F44 UJ ladder | OK | "Focus 3 (mind-brain synchrony), Focus 10 (mind awake and alert, body asleep)"; "Focus 15 (state of no time), to Focus 21 (the edge of time-space" |
| F45 Focus 22 | OK | "Focus 22. Where humans still in physical existence have only partial consciousness"; "those suffering from delirium, from chemical dependency or alcoholism, or from dementia" |
| F46 Focus 23, p. 248 | OK | "248 Ultimate Journey Focus 23. A level inhabited by those who have recently left physical existence but who either have not been able to recog- nize"; "It includes those from all periods of time. Focus 24-26." That line closes Focus 23, so O5 holds |
| F47 Territories | OK | "Focus 24-26. This covers the Belief System Territories"; "parts of the (M) Field spectrum adjacent to the Earth Life System where many Human Minds reside"; "271 Glossary Belief system A belief that is prevalent in more than one human"; head "130 Ultimate Journey" |
| F48-F49 Focus 27 | OK | "Focus 27. Here is the site of what we may call the Reception Center or the Park, which is the hub of it. This is an artificial synthesis"; "ease the trauma and shock"; "a place to which he may return at will" |
| F50 Park visit | OK | "Years ago, I had arrived at the Park"; "the same as when I had visited many years ago, with winding walks, benches, flowers and shrubbery" |
| F51 Lifeline | OK | "The first Lifeline program took place at the Institute dur- ing the week beginning June 22, 1991. In the following four- teen months, some two hundred people participated in the six-day intensive" |
| F52 retrieval, p. 113 | OK | "a man lying facedown in the middle of a dusty road. He was a youngster, no more than eighteen. A battle was going on"; "Can I go with you?" 113 Robert A. Monroe"; "where do I drop him off?" |
| F53 I-There | OK | "I was I-There, I-There was I."; "I-There of every physical human mind- consciousness"; "I-There cluster to which I 226 Ultimate Journey" |
| F54 the Signal, p. 93 | OK | "The Signal will guide us." "What is this Signal?"; "the emotion . . . that is the signal. If the proper signal is given, we are able"; "93 Robert A. Monroe universe for a signal, just one signal, to assuage the loneliness" |
| F55 UJ absences | OK | "loosh" 0 hits; "Locale" 0 hits; "absolute" only as an adjective in the 2 hits returned |
| F56 SPR locales | OK | spr.ac.uk raw HTML: "Locale I (31%)", "Locale II (59.5%): a non-material environment with unknown bounds, which contains all aspects of what are known as heaven and hell", "Locale III (8.9%): an apparently parallel material world". No quotation marks. "Monroe later simplified this schema", with no book named. Endnote 1: "Russell (2007), from which all details in this entry are drawn except where otherwise noted" |
| F57 SPR Russell p. 312, 1992 | OK | "His cosmology includes heaven or hell only as part of what he called 'the belief system territories',7Russell (2007), 312."; "Monroe's wife Nancy died in 1992. He described having twice to visit her in the afterlife" |
| F58 Wikipedia Park | OK | raw wikitext "==The Park==": "In Monroe's first and last books, he writes about visiting the Park, the hub of what he called the Reception Center" |
| F59 Wikipedia loosh | OK | "experiencing intense fear, grief, or despair"; "<ref>Far Journeys p. 183:"; "grief" 0 hits in FJ |
| F60 TMI | OK | monroeinstitute.org page: "Bob named them "focus levels," for example Focus 15, a state of awareness where linear time is no longer experienced"; "mapping over a dozen additional Focus levels"; header "Exploring Consciousness Since 1973" |
| Sec. 4, Wikipedia "same 1985 edition" | DOWNGRADE | the ref names no edition. Corrected in place |
| Sec. 4, TMI and Wikipedia dates | OK | Wikipedia raw: "established as an independent non-profit organization, The Monroe Institute, later in 1985"; SPR: "in 1977 he renamed his organization The Monroe Institute" |
| Sec. 4, room-file line numbers | OK | `p-l161:88,98-102,108,113,118`, `p-d661:25-26,50-51,72`, `p-d667:57-58,76,78`, `buildpath_story_lore:36,56` and `dreamzone2_the_game.md:801-802` each hold what section 4 says they hold |
| O2, sec. 4 "newly dead" | DOWNGRADE | JOOTB says "newly arrived waited for friends or relatives". Now [inferred] |
| O4 item 25 quotation | rule slip, fixed | source: "ambigious at" / "first" (`dreamzone2_the_game.md:140-141`) |
| O7 item 26 quotation | rule slip, fixed | source: "an exceedingly rare biome that is" / "some how "outside"" (`dreamzone2_the_game.md:168-169`) |
| O1 dating rule | note added | the dates are first appearance in the books, not first existence. Lifeline ran from 1991 (F51), and memo ¶30 already has Focus 10-21 |
| O11 "the Absolute" ¶18 | OK | memo OCR line 789 "18. Time-Space Dimension"; line 817 "or simply "the Absolute.""; ¶19 starts at line 826 |
| Sec. 1 query method | note added | q="RESCUE MISSION" help returned 5 fragments, each highlighting "help" only |
| Sec. 6 ch. 6 = Locale III | partly supported | "coal was used as a thermal source to REVERSE IMAGE 95 produce steam". Still [inferred] |

Not re-checked: F18, F19 and F36 beyond the queries above; the S9 PDF; the section 6 [summary] items (newsletter, radio,
Institute labels). Rules: no quotation over 40 words found and no allegation about a real person found. F57 and O14 keep
to what SPR and UJ's foreword state.

Trust: the book quotations and page heads hold up. Of the 60 claims in the table above (rule slips and notes not
counted), 55 are OK, 1 is wrong, 1 page is unsupported and 3 are downgraded. Treat as unproven any chapter placement without a head and any finding placed by a mixed query.
