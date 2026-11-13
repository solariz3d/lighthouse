# The 1983 memo read whole, page 25 included (absolute sources 01, 2026-11-13)

Written by a research reader for the Third Place (Opus 5.5), from the sources' own text and page images.
A second reader's section follows below when present.

Marks: [read] I opened the source's own text or page image and saw these words. [summary] from a secondary account or a
search summary. [inferred] my own inference. [ours] a proposal for the game, never a decision.
Short source ids (S1 to S11) are defined in section 1. "S1:824" means line 824 of the Archive OCR text file.
Paragraphs: "cover ¶n" is the two-page covering memo; "¶n" is the paper itself (they are numbered separately).

## 1. What was read

Scratch copies of every file below are in
`C:/Users/zackn/AppData/Local/Temp/claude/690931be4a082db1/3d000000-0000-4000-8000-000000003d00/scratchpad/swarm/memo_whole/`.
Nothing downloaded was run. PDFs and images were only viewed.

| id | source | how obtained | marks it earns |
|---|---|---|---|
| S1 | Internet Archive item `1983-analysis-of-gateway-process`, full-document OCR text, 95,651 bytes, 1,847 lines: https://archive.org/download/1983-analysis-of-gateway-process/1983%20Analysis%20and%20Assessment%20of%20Gateway%20Process_djvu.txt | curl, read whole, grep | [read] |
| S2 | Same item, page images `page/nN.jpg` for leaves n0, n1, n11, n12, n14, n17, n25, n26, n27, n29 (leaf n = numbered page n-1 for the body) | curl, each image viewed | [read] |
| S3 | Same item, the separate page-25 PDF (289,535 bytes) and its OCR text: `.../Analysis%20and%20Assessment%20of%20Gateway%20Process%20P.25.pdf` and `..._djvu.txt` | curl, PDF page viewed, OCR read | [read] |
| S4 | Archive metadata JSON for this item and for its twin `1983-analysis-and-assessment-of-gateway-process`; the Archive search listing of collection `tmi-army-documents` (57 items); `..._page_numbers.json` | curl | [read] |
| S5 | Wikimedia Commons, `File:Analysis_and_Assessment_of_Gateway_Process.pdf`: description wikitext (`action=raw`) and version history (`api.php ... prop=imageinfo`) | curl | [read] |
| S6 | Commons first upload, 2021-05-06, the CIA reading-room copy: `https://upload.wikimedia.org/wikipedia/commons/archive/d/dc/20210603205452%21Analysis_and_Assessment_of_Gateway_Process.pdf` (2,443,752 bytes, 29 pages); Commons page renders of the current file (pages 1, 12, 26, 27) and of the first upload (page 27) | curl, renders viewed | [read] |
| S7 | Wikisource index `Analysis_and_Assessment_of_Gateway_Process` and all 30 `Page:` transcriptions, raw wikitext | curl | [read] |
| S8 | The Black Vault, document page `https://www.theblackvault.com/documentarchive/stargate-collection-analysis-and-assessment-of-gateway-process-9-june-1983/`; its PDF (3,160,520 bytes, text layer searched); two letter images on that page (CIA 14 Dec 2023, INSCOM 23 Feb 2024) | curl, grep, images viewed | [read] |
| S9 | Vice, "Found: Page 25 of the CIA's Gateway Report on Astral Projection", `https://www.vice.com/en/article/found-page-25-of-the-cias-gateway-report-on-astral-projection/` | curl raw HTML, tags stripped, grep | [read] for its words; its account of events stays Vice's |
| S10 | Two 2020 FOIA request letters by a private requester, posted on the requester's own site: `https://www.davisr.me/letters/foia-cia-2020.pdf`, `.../foia-inscom-2020.pdf` | curl, PDFs viewed | [read] |
| S11 | Two web searches (page-25 recovery; reddit) | search summaries | [summary], used as leads only |

Checks run across copies (scripts in `.../scratchpad/swarm/memo_whole/scripts/`): a word diff of S1 against S7 for pages 24 and 26,
and of S3 against S7 for page 25; a phrase check of every quotation from the memo in this file against S7 and S1 (each found
in at least one; the S1 misses are OCR noise). Quotations from Vice, the letters, the Archive and the room's files were
checked against those files by grep or by eye.

## 2. Findings

### Where the copies come from, and the page-25 history

**F1.** [read] There are two different physical copies. Every CIA-copy page I viewed carries "Approved For Release
2003/09/10 : CIA-RDP96-00788R001700210016-5" at top and foot (S6 renders of pages 1, 10, 24, 26). Page 1's foot adds
"On file ARMY release instructions apply". The Monroe Institute's copy has no release stamp on any page I viewed (S2), and
its OCR text holds zero instances of "Approved For Release" (grep of S1).

**F2.** [read] The CIA copy has 29 pages and jumps from page 24 to page 26. The first Commons upload (S6) has `/Count 29`;
its 27th page opens "37. Motivational Aspect." with the folio "26". The Black Vault labels its copy "[29 Pages, 3MB]", and
its PDF text layer has 0 hits for "Holy", "thyself" or "Limitations" against 53 for "Approved" (S8).

**F3.** [read] The CIA's FOIA office, 14 December 2023, reference F-2024-00735, answering The Black Vault (S8, letter image):
"Prior searches revealed that our version of the document is also missing this page, and we do not have a copy on record
that contains the page you are seeking." It suggests asking INSCOM "in the hope that they have an original".

**F4.** [read] INSCOM's FOIA office, 23 February 2024, case 0082F-24 (S8, letter image), says its historian found "no
additional records" and:

> All records on the document titled "Analysis and Assessment of Gateway Process" were transferred to the Central
> Intelligence Agency.

**F5.** [read] Earlier requests exist. A private requester's letter of 22 June 2020 asks the CIA for the document "including
Page 25 which is missing from the Web-accessible version". The same requester's letter to INSCOM, 9 July 2020, reports the
CIA's answer to request F-2020-01656: "They are unable to provide Page 25 of this document and do not have it in their
collection." (S10). The CIA's own reply was not seen.

**F6.** [read] Vice, dateline "April 8, 2021, 10:45am", reports that page 25 came from the Monroe Institute: "Sitting buried
in the Monroe Institute archives in Faber, Virginia, was page 25 of The Gateway Report." It says the institute emailed "the
full Gateway Report including the missing page" (S9, stripped text lines 93, 132, 140).

**F7.** [read] The Archive item was added 2021-04-14 20:00:44, uploaded by the Monroe Institute's archive account, in the
collections `tmi-army-documents` and `monroe-institute-collections`. Its description says "Page 25 is included as a
separate document." A twin item was added the same day at 19:46:37 with the same full PDF (7,684,271 bytes), the same
page-25 PDF (289,535 bytes) and a third file named "(CIA).pdf" (S4).

**F8.** [read] The Archive's full-document PDF is not missing page 25. Its PDF has 30 leaves: 2 cover-memo pages, then numbered
pages 1 to 28. Page 25 is leaf n26, with the folio "25" at its foot (S2 n26; S4 page_numbers.json lists folios 11 to 28 on
leaves 12 to 29).

**F9.** [read] Commons inserted page 25 into its CIA-copy file on 2022-12-29 16:03, comment "inserted missing page 25". The
file description gives its source as "Page 25 from
https://archive.org/details/1983-analysis-of-gateway-process/Analysis%20and%20Assessment%20of%20Gateway%20Process%20P.25" (S5).
So Wikisource's page 25 is the Monroe scan. The Wikisource header also notes that in the CIA copy "pp. 16 and 17 were
reversed" ~~(S7 index)~~ *(second reader: the note is in the main-namespace page's `{{header}}`, not the Index: "In the
original copy, pp. 16 and 17 were reversed; that error has been here corrected.",
https://en.wikisource.org/w/index.php?title=Analysis_and_Assessment_of_Gateway_Process&action=raw, the notes field. The
Commons times are UTC: 16:03:38Z, then a second upload at 16:05:49Z, comment "correct page order".)*

**F10.** [read] ~~Sources disagree on who supplied page 25.~~ *(second reader: no real disagreement on the supplier was
found. The article The Black Vault cites loaded on 2026-11-13 (HTTP 200, 198,786 bytes), and it names the Monroe Institute
itself: "the Monroe Institute finally resurfaced and provided the complete Gateway Report— along with page 25", dated "June
15, 2021", https://www.thearchitect.global/the-25th-page-of-the-cias-gateway-report-on-astral-projection-has-been-discovered/,
stripped text line 45. The Black Vault's line is its own reading of that article.)* The Black Vault writes "page 25 was
received, according to this article, from the The Global Architect Institute", citing thearchitect.global (S8). Vice and
the Archive upload name the Monroe Institute (F6, F7). ~~The cited article returned HTTP 502 (section 5).~~ *(second
reader: it returned 502 to the first reader and 200 to the second; see section 5.)*

**F11.** [inferred] The Monroe page 25 is very likely the memo's own page 25. (a) Its text joins at both seams: page 24 ends
"serves the", page 25 begins "Absolute as the model", page 25 ends ¶36's "larger sense." and page 26 begins "37." (S1:1625,
1634, 1692, 1698). (b) The Monroe copy matches the CIA copy word for word next to it: page 24, 613 words, 0 differences;
page 26, 568 words, 1 OCR artefact ("énhanced") (word diff of S1 against S7 Pages 26 and 28, which are CIA scans).
*(second reader: the differences reproduce, 0 and 1 ("énhanced"); the word counts 613 and 568 do not, since they depend on
tokenising and page cuts; the second reader's own diff gave 474 and 554 Wikisource words outside headings and templates.)*
(c) Both copies share the same stray stroke after "Finally" and the same mark over "occult" in cover ¶1, and the same
speck pattern at the top left of body pages (S2 n0, n25 to n27; S6 pages 1 and 26). (d) Page 25's OCR (S3) equals the
Wikisource proofread text (S7 Page 27) word for word *(second reader: only when case is ignored; S3 reads "System",
"Stylized" and "Old" where the page image has lower case, and adds a stray "|")*. No chain-of-custody record was found.

**F12.** [read] What page 25 holds, from the page image (S3; S2 n26): the end of ¶34, from the words "Absolute as the model"
to "the present."; all of ¶35 "Left Brain Limitations"; all of ¶36 "Self Knowledge". It is 637 words (word count by script on
S3) *(second reader: 637 is the whitespace-token count of S3 (`wc -w`), which includes the folio "25" and an OCR "|"; about
635 words of text)*. It uses "Absolute" twice. It has no release stamp, and its top-left specks match its Monroe neighbours (S2 n25, n27).

**F13.** [read] ~~Vice's description of page 25 does not match the page.~~ *(second reader: Vice's account of how the page
opens matches it. Vice writes "The page opens with the word "Absolute."" and then glosses the term "In the broader context
of the report"; the "hell of a way to open a missing page" line refers to that word, not to the intervening-dimensions
sentence. Vice's later paragraphs on the spiral, ¶35 and "Know Thyself" also match page 25. Vice article, stripped text,
the paragraphs under "The Missing Page". What stands: one sentence of Vice's gloss draws on ¶18, not page 25.)* Vice
writes "Between the reality we know and The Absolute are countless intervening dimensions, McDonnell writes" ~~and calls
it "a hell of a way to open a missing page"~~ (S9 line 149). Page 25 opens mid-sentence with "Absolute as the model around
which the evolution of time-space revolves" (S3). The intervening-dimensions wording is ¶18, on page 11 (S2 n12).

**F14.** [read] Vice also calls the readers "CIA top brass" (S9 line 119) and prints "non-corporeal" (S9 line 116). The memo
is addressed to the "Commander", "US Army Operational Group", "Fort Meade, MD 20755", from "Commander, Det O" (S2 n0, n1),
and ¶38 J reads "non-corporal" (S1:1788).

### The document's shape

**F15.** [read] The memo has two numberings. The covering memo is 2 unnumbered pages, cover ¶1 to 5, office symbol
"IAGPC-O", dated 9 June 1983, signed over the typed lines "WAYNE M. MCDONNELL", "LTC, MI" and "Commander, Det O" (S2 n0,
n1). The paper that follows
is titled "The Gateway Experience: Brain Hemisphere Synchronization in perspective." (S1:104). It has ¶1 to 38,
5 exhibits, 28 numbered pages and a 9-item bibliography (S1, S7, S2 n29).

**F16.** [read] The paragraph map. Page numbers are the paper's folios (Wikisource page minus 2, checked against the folio
on page images for pages 10, 11, 13, 24 to 26 and 28). OCR lines are S1. The two lines under each are my plain account; words in quotation
marks are the memo's.

Covering memo (S1:4-99):
- cover ¶1. The tasking: assess Gateway's "mechanics and ultimate practicality". He used Bentov's models (through "a
  physician who took the Gateway training with me"), quantum mechanics and physics "to remove the stigma of its occult
  connotations".
- cover ¶2. The paper opens with hypnosis, biofeedback and transcendental meditation for comparison. These "may provide
  useful entry points to accelerate movement into the Gateway Experience".
- cover ¶3. Bohr: "You are not thinking, you are merely being logical." The paper needs right-brain insight as well as
  logic.
- cover ¶4. Why the paper returns to belief systems at its end. Without it, readers may reject Gateway as alien to what they
  hold true.
- cover ¶5. "This study is certainly not designed to be the last word on the subject". Meant as a guide for USAINSCOM
  personnel "required to take the Gateway training or work with Gateway materials".

The paper (S1:104-1845):
- ¶1 Introduction (p.1, S1:107). Gateway is explained by comparing it with related methods. It is named as the Monroe
  Institute technique using Hemi-Sync.
- ¶2 Hypnosis (p.1, S1:119). The left hemisphere screens stimuli; distract it and suggestion reaches the right. Exhibit 1
  (homunculus, ventricles, after Bentov) is page 2.
- ¶3 Transcendental Meditation (p.1, 3; S1:157). Bentov's acoustic standing waves in the brain's ventricles and Kundalini.
  Long exposure to 4-7 Hz, from a car seat or "an air conditioning duct", may trigger the same.
- ¶4 Biofeedback (p.3, S1:331). The left brain learns to reach right-brain functions with a monitor such as a digital
  thermometer. Claims tumors "can apparently be suppressed".
- ¶5 Gateway and Hemi-Sync (p.4, S1:377). The aim is coherent hemispheres and consciousness that can "escape even the
  restrictions of time and space". Jager's definition of Hemi-Sync; the Focus 3 tapes; Twemlow on brain energy.
- ¶6 Lamp vs Laser (p.4, S1:411). The ordinary mind is a lamp, the Hemi-Sync mind a laser. The coherent mind rises to "ever
  higher vibrational levels" and reads what it finds as symbols.
- ¶7 Frequency Following Response (p.5, S1:438). The brain follows heard frequencies; it hears the beat between two tones,
  "10 Hertz below another audible frequency" in the example. Played low, masked with sea surf, with Monroe's suggestions.
- ¶8 Role of Resonance (p.5, S1:472). Deep rest removes the heartbeat's "bifurcation echo". A sinewave rhythm about seven
  times a second rises into the head.
- ¶9 Brain Stimulation (p.6, S1:505). The brain moves "approximately 0.005 to 0.010 millimeters"; the body resonates at
  6.8-7.5 Hz with an ionosphere at 7-7.5 Hz. Bentov: the signal circles the earth in "about one seventh of a second".
- ¶10 Energy Entrainment (p.6, S1:546). The body becomes an oscillator in step with the earth's field and builds its own
  energy field. This readies out-of-body movement and a "carrier wave" to minds similarly tuned.
- ¶11 Consciousness and Energy (p.7, S1:567). Matter is "oscillating energy grids", from the nucleus (10^22 Hz) to a cell
  (10^3 Hz). Consciousness is energy in motion meeting energy at rest.
- ¶12 Holograms (p.7, S1:597). Bentov's frozen ripples and three pebbles; Gabor's 1947 mathematics. Lyall Watson on a laser
  hologram of a face.
- ¶13 The Part Encodes the Whole (p.8, S1:631). Every shard of a broken hologram shows the whole image, fuzzier the smaller.
  A hologram needs energy in motion meeting energy at rest.
- ¶14 The Consciousness Matrix (p.8, S1:654). The universe is one hologram, and the mind is one too (Pribram, Bohm). The mind
  reads by matching frequency and compares with memory; Keith Floyd quoted.
- ¶15 Brain in phase (p.9, S1:689). The mind reduces 3-D input to a binary "go/no go". The right brain receives, the left
  sorts; Exhibit 2 is page 10.
- ¶16 Evaluation (p.9, S1:711). Gateway refines the mind's energy matrix so it perceives without the senses. Ferguson on
  Pribram's "holographic model".
- ¶17 Self Cognition (p.9, 11; S1:735). "Humans not only know, but they know that they know." Consciousness duplicates its
  own hologram, projects it and perceives it.
- ¶18 Time-Space Dimension (p.11, S1:796). "Now the fun begins." Unconfined energy is infinity, at rest, named "the
  Absolute"; "intervening dimensions" lie between it and matter, and perception stops at it.
- ¶19 Intervening dimensions (p.11-12, S1:833). The Absolute overlays everything unperceived; brainwaves must look "virtually
  like a solid line". At each rest point energy "clicks out"; consciousness passes "through the looking glass".
- Exhibit 3 (p.13, S1:915-953; S2 n14). Hand-drawn wave between two lines, each labelled "THE ABSOLUTE IN INFINITY".
- ¶20 Subatomic Particles (p.12, S1:881). Entangled particles talk in the "click out phase". Gliedman's "Siamese twin
  effect"; Bentov on tachyons.
- ¶21 Dimensions In-between (p.12, 14; S1:905). Bentov: causality breaks, movement turns jerky, time and space go "grainy".
  Distortions, and "access is opened to both the past and the future".
- ¶22 Special Status, Out-of-Body Experience (p.14, S1:989). Leaving the body first gives a "higher" start and a
  self-reinforcing rise in energy. Concludes the out-of-body route promises "much faster and more impressive successes".
- ¶23 Absolute in Perspective (p.14-15, S1:1020). Recap: the universal hologram is the finite form of the Absolute's
  consciousness. Bentov's sea: still depths, the Absolute; storm waves, the physical world; currents between.
- ¶24 From Big Bang to Torus (p.15, S1:1045). Bentov's "cosmic egg" from quasar jets: out of a white hole, round the shell,
  into a black hole. Time begins as the cadence of that movement; Exhibit 4 is page 16.
- ¶25 Our Place in Time (p.15, 18; S1:1075). Our universe sits "near the top of the egg", the Absolute layered over it.
  The Torus holds past, present and future at once; Exhibit 5 is page 17.
- ¶26 Quality of Consciousness (p.18, S1:1205). Consciousness organises energy and is "distinctly separate from and superior
  to" the body. Human consciousness is a "differentiated aspect" of the Absolute's, without beginning or end.
- ¶27 Consciousness in Perspective (p.18-19, S1:1232). "So what happens then?" Return to the Absolute keeps identity and
  memory and loses "will or choice"; an out-of-body state projects that "eternal spark of consciousness".
- ¶28 Gateway Method (p.19, S1:1262). The order of training: the "energy conversion box", "resonate tuning" (humming with a
  taped chorus), the Gateway affirmation. The affirmation says he is "more than merely a physical body".
- ¶29 Hemi-Sync Introduced (p.19, S1:1286). Hemi-Sync, relaxation, pink and white noise, then the "energy balloon". The
  balloon protects against "conscious entities possessing lower energy levels".
- ¶30 Advanced Techniques (p.20-22, S1:1312). Focus 10 to Focus 12, then tools A-F: problem solving through the "higher
  self", patterning, color breathing, the energy bar tool, remote viewing, the living body map. G: Focus 15, the past;
  H: Focus 21, the future.
- ¶31 The Out-of-Body Movement (p.22, S1:1469). One tape of many, and no guarantee; Beta signals "around 2877.3 CPS". Exit by
  rolling out, lifting out "after the fashion of a telephone pole", or sliding out.
- ¶32 Role of REM Sleep (p.23, S1:1501). Monroe told a class that an ex-trainer could guarantee out-of-body movement from REM
  sleep. Some deep-sleep dreams may be the same altered state, and their memory is usually lost; three conditions listed.
- ¶33 Information Collection Potential (p.23-24, S1:1545). Coast-to-coast out-of-body tests: nobody got all ten digits.
  Causes: traces of past events at the site, "thought forms", holograms seen "pseudoscopically".
- ¶34 Belief System Considerations (p.24-25, S1:1580). A Tibetan and a Hindu quotation; the paper said to fit
  Judeo-Christian thought. The Absolute mapped onto Father, Son and Holy Spirit; the Torus as the spiral of world religions.
- ¶35 Left Brain Limitations (p.25, S1:1650). Physics reaches with the left brain what mystics reached with the right. For
  "persons in our profession", intuitive perception may give objective knowing.
- ¶36 Self Knowledge (p.25, S1:1675). "Know thyself"; no personality test replaces seeing the hologram the mind has projected.
  Gateway as "a portal" after "months if not years of practice".
- ¶37 Motivational Aspect (p.26, S1:1698). Faster than meditation; within reach of "the impatient, result oriented, skeptical
  pragmatist". Progress depends on releasing anxieties and stresses.
- ¶38 Conclusion (p.26-27, S1:1723). "a sound, rational basis" for plausibility, then a phased programme in steps A to L.
  ~~Ends "a gateway to Gateway".~~ *(second reader: the sentence runs on: "a gateway to Gateway and to the realm of practical
  application for the whole system of techniques which comprise it.", S1:1801-1805.)*
- Bibliography (p.28, S1:1811; S2 n29). Bentov 1977; Ferguson 1978; Gliedman 1983; Jager, undated; Monroe 1971; Purce 1980;
  Sannella 1976; Stone 1983; Tart 1969.

### "The Absolute": every use

**F17.** [read] "Absolute" appears 34 times in S1: 31 capitalised uses in the body text, 1 lowercase "absolute state" (¶18)
and 2 hand-drawn labels on Exhibit 3. By paragraph: ¶18 4 (plus the lowercase one), ¶19 3, ¶21 1, ¶23 4 (heading
included), ¶24 1, ¶25 2, ¶26 5, ¶27 4, ¶34 7 (5 on page 24, 2 on page 25). It appears nowhere in the covering memo, ¶1-17,
¶20, ¶22, ¶28-33, ¶35-38 or the bibliography. It sits on 8 pages: 11, 12, 13, 14, 15, 18, 24, 25. Each use:

| ¶ | page | S1 line | the phrase (memo's words) |
|---|---|---|---|
| 18 | 11 | 824 | "energy in its absolute state" (lowercase) |
| 18 | 11 | 824 | "or simply "the Absolute."" |
| 18 | 11 | 824 | "Between the Absolute and the "material" universe" |
| 18 | 11 | 829 | "until it reaches the dimension of the Absolute" |
| 18 | 11 | 829 | "because the Absolute generates no holograms of or about itself" |
| 19 | 11 | 833 | "Since the Absolute is conscious energy in infinity" |
| 19 | 11 | 838 | "their home in the state of infinity(the Absolute)" |
| 19 | 12 | 867 | "those dimensions located between time-space and the Absolute" |
| Exh. 3 | 13 | 918, 946 | "THE ABSOLUTE IN INFINITY" (two labels, above and below the wave) |
| 21 | 14 | 962 | "those dimensions between time-space and the Absolute" |
| 23 | 14 | 1020 | heading "Absolute in Perspective" |
| 23 | 15 | 1027 | "from time-space to the realm of the Absolute" |
| 23 | 15 | 1034 | "the infinite consciousness of the Absolute" |
| 23 | 15 | 1038 | "the still depths of the sea to the dimension of the Absolute" |
| 24 | 15 | 1069 | "confined within limits by the conscious of the Absolute" (sic, "conscious") |
| 25 | 15 | 1080 | "Layered over this cosmic egg is the Absolute" |
| 25 | 18 | 1188 | "reabsorbed into the radiating nucleus and then the Absolute" |
| 26 | 18 | 1215 | "as does the Absolute" |
| 26 | 18 | 1218 | "total rest within the Absolute" |
| 26 | 18 | 1222 | "the universal consciousness which resides within the Absolute" |
| 26 | 18 | 1226 | "like the Absolute, has neither beginning nor end" |
| 26 | 18 | 1229 | "returns to infinity in the Absolute" |
| 27 | 18 | 1235 | "destined for ultimate return to the Absolute" |
| 27 | 18 | 1238 | "when consciousness returns to the Absolute it brings with it all the memories" |
| 27 | 18 | 1240 | "The return of consciousness to the Absolute does not imply an extinction" |
| 27 | 18 | 1243 | "the universal consciousness and infinity of the Absolute" |
| 34 | 24 | 1614 | "The Absolute at rest in infinity" |
| 34 | 24 | 1616 | "the description of the Absolute as presented in this paper" |
| 34 | 24 | 1621 | "the consciousness of the Absolute must project a hologram of itself" |
| 34 | 24 | 1622 | "a mirror image of the Absolute in infinity" |
| 34 | 24 | 1624 | "one step removed from the Absolute" |
| 34 | 25 | 1634 | "Absolute as the model around which the evolution of time-space revolves" |
| 34 | 25 | 1636 | "the essence or "spirit" of the Absolute" |

**F18.** [read] The memo gives two origins for the name. ¶18: "Energy in this state of inactive infinity is termed by
physicists as energy in its absolute state, or simply "the Absolute."" ¶23: "It is the title we assigned to that vast pool
of energy in a state of perfect rest over which the physical universe is layered, and from whence it comes." (S1:823-824,
1034-1036).

**F19.** [read] The Absolute cannot be perceived. ¶18: "it cannot be perceived by consciousness operating in the active
universe." And: "Theoretically, human consciousness may continue to expand the horizons of its perceptual capability until it
reaches the dimension of the Absolute at which point perception stops because the Absolute generates no holograms of or about
itself." ¶19: "It overlays everything" (S1:822-830, 836).

**F20.** [read] Yet it is conscious and it perceives. ¶18: "It retains its inherent capacity for consciousness in that it
can receive and passively perceive holograms". ¶26: "Human beings have this form of elevated consciousness as does the
Absolute", with its own "(omniscience and omnipotence in perceptual unity)" (S1:819-820, 1214-1217).

**F21.** ~~[read]~~ *(second reader: [read] for the two quotations, [inferred] for the tension and the bridge)* Two sentences
pull against each other. ¶18: "Energy in infinity is said to be completely at rest and, therefore, cannot generate holograms
so long as it remains utterly inactive." ¶34: "the consciousness of the Absolute must project a hologram of itself and then
perceive it." ~~The memo's only bridge is the clause "so long as it remains utterly inactive"~~ *(second reader: not the only
one. ¶34 also has the will "to bring a portion of that energy into motion to create reality" (S1:1618-1619), and ¶26 gives
the Absolute self-cognition: "Human beings have this form of elevated consciousness as does the Absolute" (S1:1214-1215).)*
(S1:818-819, 1621-1622).

**F22.** [read] ¶23 gives Bentov's sea as the picture of the whole: "comparing the still depths of the sea to the dimension of
the Absolute while assigning the storm-tossed waves above to represent the physical universe with which we are familiar."
The "slightly agitated currents" between are energy going into rest or coming out of it (S1:1036-1042).

**F23.** [read] ¶24-25 place the Absolute around and behind the cosmic egg: energy is "expelled from infinity and confined
within limits by the conscious of the Absolute"; "Layered over this cosmic egg is the Absolute which sustains the radiating
nucleus from which the original jet of matter issued forth."; matter is "reabsorbed into the radiating nucleus and then the
Absolute" (S1:1068-1069, 1080-1081, 1188).

**F24.** [read] ¶26 makes each person a piece of it: "Our consciousness, therefore, is that differentiated aspect of the
universal consciousness which resides within the Absolute." And: "When reality ends, its constituent energy simply returns to
infinity in the Absolute." (S1:1221-1222, 1228-1229).

**F25.** [read] ~~¶27 is the memo's account of death.~~ *(second reader: [inferred]. ¶27 never names death (F29); its
words are consciousness "destined for ultimate return to the Absolute", S1:1234-1235, and ¶26's "When reality ends",
S1:1228. Reading that return as death is the first reader's inference, a fair one, not the memo's statement.)* It asks
"So what happens then?" Its answer: consciousness "brings with it
all the memories it has accumulated through experience in reality"; "The return of consciousness to the Absolute does not
imply an extinction of the separate entity which the consciousness organized and sustained in reality."; and "it retains the
power to perceive but loses the power of will or choice." (S1:1235-1252).

### The theology passage, ¶34 onward, in full context

**F26.** [read] ¶34 opens with two quotations. From David-Neel and Yongden (1967): "The tangible world is movement, say the
Masters, not a collection of moving objects, but movement itself." From "a Hindu sutra": "In the heaven of Indra there is said
to be a network of pearls so arranged that if you look at one you see all the others reflected in it." The memo then calls
~~the paper's universe~~ *(second reader: "the concept of the universe which at least some physicists are now coming to
accept", S1:1605-1606, not the paper's own)* "identical in its essential aspects" with the ancient learned one, and names
the cosmic egg as known from "the eastern religions" (S1:1580-1610; page 24).

**F27.** [read] The Trinity passage, in order, quoted whole across page 24 (S1:1610-1626; S6 page 24; S2 n25). The
page break falls inside the last sentence:

> Nor are the theories presented in this paper at variance with the essential tenets of the Judeo-Christian stream of
> thought.

> The concept of visible reality(i.e. the "created" world) as being an emanation of an omnipotent and omniscient divinity
> who is completely unknowable in his primary state of being.

(As typed, that second sentence has no main verb.)

> The Absolute at rest in infinity is a concept straight out of Hebrew mystical philosophy. Even the Christian concept of
> the Trinity shines through the description of the Absolute as presented in this paper.

> The description of energy totally at rest, in infinity fits the Christian metaphysical concept of the Father

> while the infinite self-consciousness resident in that energy providing the motive force of will to bring a portion of
> that energy into motion to create reality corresponds with the Son.

> This is so because in order to attain self-consciousness, the consciousness of the Absolute must project a hologram of
> itself and then perceive it.

> That hologram is a mirror image of the Absolute in infinity, still exists outside time and space, but is one step
> removed from the Absolute and is the actual agent of all creation(all reality).

> And, the eternal thought or concept of self which results from this self-consciousness serves the

(foot of page 24; page 25 begins)

> Absolute as the model around which the evolution of time-space revolves to ultimately attain a reflection of and union
> with Him.

**F28.** [read] Page 25 completes the Trinity and closes ¶34 (S3; S2 n26; S1:1634-1647):

> That thought model, which perfectly reflects the essence or "spirit" of the Absolute fits the Christian metaphysical
> description of the Holy Spirit.

> Finally, our description of the universal hologram, the Torus of creation and evolution is neither new nor original.

> Whether its the stylized labyrinth once popular in the Helenic world, the spiralized version of the Hebrew Tree of Life
> or its Hindu counterpart, or the Chinese Spiral Through The Fourfold Powers, the ultimate meaning is the same.

> Mystics the world over, it seems, have perceived the universal hologram in the same spiral form

So the mapping is: the Father is energy at rest; the Son is the will that sets energy moving, ~~which is the mirror-image
hologram and "the actual agent of all creation"~~ *(second reader: [inferred], not [read]. The memo's words give the Son to
"the infinite self-consciousness resident in that energy providing the motive force of will"; the hologram enters as the
reason ("This is so because ..."), and the memo never writes that the hologram is the Son. Reading the Son as the hologram
is a possible reading, not the memo's statement. S1:1618-1624.)*; the Holy Spirit is the thought model of self toward which
time-space evolves, to "union with Him". ("its" and "Helenic" are as typed.) *(second reader: F28's block quotations are
not contiguous; the sentence "Its use as the figure of the universe ... whether of eastern or western derivation." sits
between the second and third, S1:1638-1640, and the last is cut mid-sentence.)*

**F29.** [read] The memo never uses the words "God", "good", "evil", "soul", "death", "dead" or "die" (whole-word grep of the
S7 text: 0 hits each). Its divine words are "divinity", "Trinity", "the Father", "the Son", "Holy Spirit" and "Him".
"Heaven" appears only inside the Indra quotation (S1:1601).

**F30.** [read] Cover ¶4 says why the belief section exists: "the danger exists that some people will reject the whole
concept of the Gateway Experience in the mistaken belief that it contradicts and is therefore alien to all that they hold to
be right and true." (S1:81-83; S2 n1).

**F31.** [read] ¶35, all on page 25, is the paper's only use of "our profession" (1 hit in S7). "For persons in our
profession", intuitive perception "would seem to offer" this: "access to a new world of intuitive perception and self
reflection would seem to offer, in the long term, the means by which to know in a truly objective way." It ends "to that
extent we release ourselves from the prison of subjectivity." (S3; S1:1658-1669).

**F32.** [read] ¶36, all on page 25, is about self-knowledge: "Know thyself." No personality test replaces seeing "the very
hologram of itself which it has projected into the universe". Gateway is a "portal through which, based on months if not
years of practice, the individual may pass in his search to find self, personal effectuality, and truth in the larger sense."
(S3; S1:1675-1692).

### The memo's cautions

**F33.** [read] ¶29: the energy balloon is "protection against conscious entities possessing lower energy levels" (the room
holds this). It adds: "It serves a precautionary purpose in the unlikely event that the participant's first out-of-body
experience involves direct projection outside the terrestrial sphere." (S1:1300-1306).

**F34.** [read] ¶30 B, on patterning: "Monroe trainers caution against attempting to force the pace of this process because
the individual could succeed in dislocating his existing reality with drastic consequences." (S1:1363-1365).

**F35.** [read] ¶30 G and H warn of difficulty. Focus 15: "Probably less than five percent of all participants in any given
Gateway Experience actually fully achieve the Focus 15 state during the course of the approximately seven days of
training." Focus 21 is probably not attainable "except by those who have conditioned themselves through long application of
meditation" or months to years of tapes (S1:1448-1451, 1463-1466).

**F36.** [read] ¶31: no promise of leaving the body. "Only one tape out of the many which make up the Gateway Experience is
devoted to the techniques involved in the out-of-body movement." The program does not "guarantee that most participants will
succeed" (S1:1473-1476).

**F37.** [read] ¶33: what is seen out of body is unreliable. In the number tests "none have ever succeeded in getting all ten
correct." Three causes: "There are also energy patterns left by people or events occurring at the same physical site being
viewed, but from the past rather than the present."; "thought forms" that "mingle with physical reality and are not easily
differentiated"; and "holograms can be viewed pseudoscopically, that is to say inside out or backwards" (S1:1557-1577).

**F38.** [read] ¶37: stress blocks progress. Speed depends on the ability to "use the insights gained to release anxieties
and stresses within both the mind and the body", and "the more "uptight" the individual may be at the outset the more
barriers he or she will initially encounter" (S1:1712-1717).

**F39.** [read] ¶38 J and K are the paper's last warnings: "Be intellectually prepared to react to possible encounters with
intelligent, non-corporal energy forms when time-space boundaries are exceeded." (the room holds J) and "Arrange to have
groups of people in Focus 12 state unite their altered consciousness to build holographic patterns around sensitive areas
to repulse possible unwanted out-of-body presences." (S1:1787-1793).

**F40.** [read] Cover ¶5 caps the paper's own authority: "This study is certainly not designed to be the last word on the
subject" (S1:86; S2 n1).

### The memo's practical recommendations

**F41.** [read] ¶38 opens: "There is a sound, rational basis in terms of physical science parameters for considering
Gateway to be plausible in terms of its essential objectives." It asks for "a phased approach" toward "an organization-wide
exploitation of Gateway's potential" (S1:1723-1731).

**F42.** [read] ¶38 A to F build the program on sleep and suggestion. A: Hemi-Sync tapes for focus and synchronisation.
B: "add strong REM sleep frequencies". C: hypnotic suggestion to reach "deep autohypnotic state at will". D: autohypnosis to
move faster through Focus 12. E: repeat A and B after the suggestion "that an out-of-body movement will occur and be
remembered". F: repeat E until the out-of-body state is under conscious control, held "even after REM sleep state ends"
(S1:1735-1759; S6 first-upload page 27).

**F43.** [read] ¶38 G to L. G: Focus 15 and 21 from the out-of-body state. H: three people out of body together, one at the
target now, one at Focus 15 "as it slips into the immediate past", one at Focus 21 "as it slips from the immediate
future". I: "full self knowledge" for all. J and K: F39. L: "Encourage more advanced Gateway participants to
build holographic patterns of successful attainment and rapid progress for advanced colleagues". The last line: "it is to
be hoped that we will truly find a gateway to Gateway" (S1:1762-1805). *(second reader: that quotation stops mid-sentence;
the last sentence goes on "and to the realm of practical application for the whole system of techniques which comprise
it.", S1:1804-1805.)*

**F44.** [read] ¶22 recommends the out-of-body route: "the out-of-body state may be regarded as an extremely effective way"
of speeding progress, since "the farther consciousness in the out-of-body state can be projected beyond the time-space
dimension, the more its level of energy output would be enhanced" (S1:1007-1012).

### Content the room has not used yet (checked against the room files named in section 4)

**F45.** [read] ¶32 ties ordinary dreams to the altered state: "it may even be postulated that some dreams associated with
deep levels of sleep are in fact functions of the same kind of altered consciousness" as Focus 12, 15 and 21. Their memory
"cannot usually be retrieved by conscious desire". An ex-trainer in Charlottesville "could guarantee out-of-body movements
by bringing participants down into a rapid eye movement(REM) state of sleep" (S1:1501-1526).

**F46.** [read] ¶32 dates a detail: Monroe told "the Gateway class that finished 7 May 1983" about the ex-trainer. The memo
also states "REM sleep is the deepest possible level of ordinary sleep" (S1:1501-1508).

**F47.** [read] ¶31 gives the ways out of the body: "rolling out, lifting out after the fashion of a telephone pole", in which
"he finds himself standing at attention at the foot of his physical body", and "sliding out through either end of his
body." (S1:1490-1498).

**F48.** [read] ¶21 quotes Bentov on the in-between: "movements become jerky rather than smooth. Time and space may become
"grainy" or "chunky."" And: "access is opened to both the past and the future when the dimension of current time-space is
left behind." (S1:967-968, 984-986).

**F49.** [read] ¶19 says consciousness "passes through the looking glass of time-space after the fashion of Alice beginning
her journey into wonderland." It sets the click-out "when the speed of the oscillation drops below" 10^-33 "centimeters per
second(Planck's Distance)". Exhibit 3 labels the same quantity as 10 to the power -33 cm, a length (S1:858-871; ~~S7 Page
13~~ *(second reader: S7 Page 14, folio 12; Page 13 has no "drops below")*; S2 n14). *(second reader: the memo's own text
also gives a length two lines later, quoting Bentov: "Planck's Distance, which is 10^-33 cm", S1:860-861; the unit mix is
inside one paragraph, not only between text and exhibit.)*

**F50.** [read] ¶13: a broken hologram's "each individual piece would recreate the entire holographic image all by itself.
The smaller the piece, the fuzzier and more distorted would be the resulting holographic projection" (S1:632-635).

**F51.** [read] ¶15 quotes Bentov: "Whenever we perceive something, we always perceive differences only." ¶17: consciousness
can "duplicate aspects of its own hologram, project them out, "perceive" that projection" (S1:701-703, 789-790).

**F52.** [read] ¶3 quotes Bentov: 4-7 Hz vibration over long periods, from "being exposed for long periods of time to these
frequencies caused, for instance, by an air conditioning duct.", may trigger the same effect in "susceptable people"
(S1:321-328).

**F53.** [read] ¶7: the Gateway frequencies are "played at a virtually subliminal, marginally audible level." They are
"rolled in together with other sounds such as sea surf to mask the sound frequencies where desireable." (S1:458-465). The
word "binaural" is not in the memo (0 hits in S1 and S7; the room already noted this).

**F54.** [read] ¶9 quotes Bentov on the body's 7 Hz signal: it travels round the planet "in about one seventh of a second",
and "It is the ideal medium for conveying a telepathic signal." (S1:528-535).

**F55.** [read] ¶28 gives the training's first steps: the "energy conversion box" for setting worries aside; "resonate
tuning", humming along with a chorus on the tape; and the affirmation that "the individual realizes that he is more than
merely a physical body and that he deeply desires to expand his consciousness." (S1:1273-1283).

**F56.** [read] ¶30 D and E: the energy bar tool starts as a "small, intensely pulsating dot of light" and is drawn out into
a "sparkling, vibrating cylinder of energy" used to channel force for healing. For remote viewing "the participant turns his
bar of energy into a whirling vortex through which he sends his imagination in search of new and illuminating insights."
(S1:1400-1411).

**F57.** [read] ¶30 G: for Focus 15, "time being visualized as a huge wheel in the universe with various spokes each of which
gives access to a different part of the participant's past." Trainers say the reachable past includes events the person
"has had no connection" with (S1:1446-1456).

**F58.** [read] The Wikisource transcription has "(the absolute)" in ¶19; the scan of the Monroe copy shows "(the
Absolute)" with a capital (S7 Page 13; S2 n12). Wikisource also uses a {{SIC}} template for "desireable" in ¶7 (S7).

**F59.** [read] Licence tags: Commons tags the file `{{PD-USGov-CIA}}` (S5) and Wikisource tags the text `{{PD-USGov}}`
~~(S7 index)~~ *(second reader: on the main-namespace page, last line of its wikitext; the Index page carries no licence tag)*.

**F60.** [read] The Archive collection `tmi-army-documents` lists 57 items uploaded in 2021, including "(TMI-ARMY Files) 1976
- Attitude Toward Death Questionnaire", "(TMI-ARMY Files) 1982 - Sleep Discipline" and "(TMI-ARMY Files) 1983 - INSCOM Report"
(S4 listing). Only the titles were read.

**F61.** [read] The Archive item's description says the report assesses Gateway's "mechanics and ultimate predictability".
The memo says "mechanics and ultimate practicality" (S4; cover ¶1, S2 n0).

## 3. What it offers the game

**O1.** [ours] Page 25 as a found object. Bears on `handback/p-d667-story-E_2026-11-11.md:149` ("never found") and
story_lore lap 3's test `page_25_is_never_due` (`loop/buildpath_story_lore_2026-11-13.md:80`). Options, all standing on
F2-F12: (a) keep it never found; in a 2005 world that is accurate, since it surfaced in 2021. (b) Find it once, late: its
last paragraph is "Know thyself" (F32), next to the darkness-is-the-self reveal (item 107, brief :887-889; bible :258-274).
(c) If it is found, make it visibly different: it is the one page without the release stamp (F1, F12).

**O2.** [ours] The title. Item 183's pick `frontdoor_onboarding-1` names the game "The Absolute" (brief :1362-1364). The memo
uses the word on 8 pages only, all in its cosmology and theology, and never in its practice or conclusion (F17). Found
pages that name the Absolute could be dripped in page order (11, 12, 13, 14, 15, 18, 24, 25), so the name gathers meaning
run by run. Stands on F17, F18.

**O3.** [ours] Who does the saving. The good one is the Absolute (bible `p-d667-story-E:235`) and never fails (pick
`chase_entities-4`, brief :1373-1375). In the memo the Absolute at rest cannot be perceived and acts through something else
(F19, F21, F27). Options: (a) the Absolute is never seen, only its act (the light, the save); (b) the act belongs to the
memo's "Son": the mirror-image hologram, "the actual agent of all creation" (F27) *(second reader: (b) stands on F28's
Son-as-hologram mapping, downgraded to [inferred]; the memo calls the hologram "the actual agent of all creation" but does
not call it the Son)*; (c) keep the name and drop the memo's physics. Bears on run_frame's last-second save and
look_fear's golden aura.

**O4.** [ours] The father, for the player who digs (items 170, 172, 174, brief :1156, :1165, :1176; pick `story_lore-1`
"Sudden and ordinary", :1351-1353). ¶27 is a documented in-world account of death *(second reader: stands on F25's
"account of death", downgraded to [inferred]; the memo's words are "ultimate return to the Absolute")*: the returned keep
identity and memories
and can perceive, but lose "will or choice" (F25, F24). A searching player could find that he sees and cannot act, and that
the one who acts is the Absolute. Item 174 says this must never be forced on anyone.

**O5.** [ours] The word "Father" (F27; item 47, brief :389-391). The memo maps the Absolute at rest to "the Father". In a
game whose good one is the Absolute and whose child lost a father, that page could sit as a plant, never said. The risk is
that it reads as too on the nose; item 174 asks for a surface that is "not that deep".

**O6.** [ours] Sleep as the way in. ¶32 and ¶38 B-F are the memo's own ground for a child who reaches the in-between by
sleep (F42, F45), as in waking_room lap 1 "lie down; the dream starts" (`loop/buildpath_waking_room_2026-11-13.md:74`). "Cannot
usually be retrieved" fits waking "not knowing which part was taken" (item 30, brief :243; pick `run_frame-6`, :1368-1369).

**O7.** [ours] The chair's out-of-body exit (item 49, brief :403; `buildpath_waking_room:15`): roll out, lift out like a
telephone pole, or slide out, and stand "at attention at the foot of his physical body" (F47). Not in the dream itself:
item 26 says no out-of-body in the dream (`loop/buildpath_run_frame_2026-11-13.md:12`), and pick `look_fear-1` dropped the
camera-lifts-out beat (brief :1446-1447).

**O8.** [ours] How the in-between moves (F48). "Jerky rather than smooth" and "grainy" time and space are a documented
basis for lesser entities' broken motion (item 168's uncanniness) and for world grain (look_fear). "Access is opened to both
the past and the future" grounds item 97's "time is non linear there" (brief :797) in the memo, not only in Monroe.

**O9.** [ours] A depth ladder from ¶23's sea (F22). Still depths are the Absolute, storm waves the physical world, currents
in between. Chapters as depth (pick `world_gen-9`, brief :1438-1440; pick `abilities-3`, Focus levels as chapters,
:1391-1393): each chapter calmer and stiller than the last, or the reverse.

**O10.** [ours] Rooms that remember (F37). The memo's "energy patterns left by people or events", from the past, at the same
site, fit designed pieces and lore drops (pick `world_gen-6`, brief :1434-1435). "Inside out or backwards" fits mirrored Park pieces (pick
`world_gen-2`, :1331-1332).

**O11.** [ours] His thought-forms note. Pick `entity_bodies-3` (brief :1378) says "might have to re look into what monroe
said word for word". The words he reaches for are in this memo, ¶33: "thought forms" that "mingle with physical reality and
are not easily differentiated" (F37). They are McDonnell's words, not Monroe's; Monroe's own were not read here.

**O12.** [ours] The found-text reveal (story_lore lap 1's `focus_reader`, `buildpath_story_lore:64-65`). ¶13 says a smaller
shard of hologram gives a fuzzier whole (F50). Torn memo fragments could resolve less sharply the smaller they are.

**O13.** [ours] Sound (pick `sound-4`, his note "always on in the dream, and during meditation, never mentioned to player.",
brief :1452-1454; sound lap 4,
`loop/buildpath_sound_2026-11-13.md:71`). The memo says the frequencies were "virtually subliminal" and masked with sea surf
(F53), and Bentov names an air conditioning duct as a 4-7 Hz source (F52): a period-true reason for a building's hum. The
game claims no effect (`handback/p-d661-lore-E_2026-11-11.md:53`).

**O14.** [ours] Abilities (picks `abilities-4` and `abilities-5`, brief :1394-1398). The energy bar tool, a dot of light drawn
into a "sparkling, vibrating cylinder of energy", is a documented model for a light ability; the remote-viewing "whirling
vortex" is one for the fusion (F56). The Focus 15 wheel with spokes (F57) is an image for a Focus 15 chapter.

**O15.** [ours] The meditation minigame (pick `waking_room-2`, "a breathing rhythm and timing game", brief :1425-1426). ¶28's
order is three steps: box away the worries, hum with the chorus, say the affirmation (F55).

**O16.** [ours] Stress and Recognition (item 62, brief :503; bible :276-281). ¶37 makes progress depend on releasing
"anxieties and stresses", and the "uptight" meet more barriers (F38). ¶36's "Know thyself" (F32) is the memo's word for
what Recognition is in the bible.

**O17.** [ours] Parks as something built. ¶38 K and L have people build "holographic patterns" to keep presences out and to
help others progress (F39, F43). A Park could be such a pattern left by earlier dreamers; "Parks close in overtime" (pick
`run_frame-4`, brief :1227-1228) is then the moment it fails.

**O18.** [ours] The hunter that mirrors you (pick `chase_entities-6` note "its mirror you", brief :1271; item 107). The memo
supplies mirror language: consciousness projects and perceives its own hologram (¶17, F51); the hologram is "a mirror image
of the Absolute" (¶34, F27); "the reflection of ourselves" (¶35, F31).

**O19.** [ours] Citation rules for lap 3's found pages (`buildpath_story_lore:80`). Write "cover ¶n" and "¶n" (F15). Quote
¶19's "(the Absolute)" from the scan, not Wikisource (F58). The "centimeters per second" unit mix is the memo's own (F49).

**O20.** [ours] Real names and documents (pick `story_lore-4`, "Also the institute in the world", his note "and documents",
brief :1461-1463; call 4 at `buildpath_story_lore:51`). Commons and Wikisource tag the memo as a US government work (F59), and the
page-25 source is the Monroe Institute's archive (F6, F7). Legal standing was not checked.

**O21.** [ours] Leads for the grief and sleep threads: the Archive's "Attitude Toward Death Questionnaire" (1976) and "Sleep
Discipline" (1982) (F60). Not opened.

## 4. Where it contradicts or strains something the room holds

1. [read] `handback/p-d667-story-E_2026-11-11.md:55` (page 25 missing, "search summaries") and
   `loop/buildpath_story_lore_2026-11-13.md:111`. Now confirmed from the copies and from both agencies' letters (F2-F5).
2. [inferred] `handback/p-d667-story-E_2026-11-11.md:56` says that in 2005 "a page is famously absent". Nothing I read shows
   that. The earliest dated request I saw is 22 June 2020 (F5). Vice in 2021 says the page "has been missing and highly
   sought after since it was declassified in 2003" (S9 line 103), but gives no earlier record.
3. [inferred] `handback/p-d667-story-E_2026-11-11.md:149` ("never found") and `loop/buildpath_story_lore_2026-11-13.md:80`
   (`page_25_is_never_due`) strain against item 174 ("it will be there in abundence", brief :1176). The real page has been
   public since April 2021 (F6-F9). It is not a contradiction inside a 2005 setting.
4. [read] `handback/p-l161-look-E_2026-11-11.md:114` says the Archive item carries page 25 "as a separate file". It is also
   inside the full PDF, at leaf n26 (F8). And `:70` reads the Archive scan in place of the CIA's ("so the scan was read on
   the Archive"); it is the Monroe Institute's own copy, without release stamps (F1, F7). Its text matches the CIA copy
   where compared (F11).
5. [read] Brief :139 ("Copies differ by OCR, so E checks the scan") and `p-l161-look-E:68`. Wikisource is the CIA copy plus
   the Monroe page 25 (F9), with at least one transcription slip in ¶19 (F58). Pages 24 and 26 match across copies (F11).
6. [read] Brief :129-130 quotes ¶18's "termed by physicists". The memo also calls the name "the title we assigned" (¶23,
   F18).
7. [inferred] `p-d667-story-E:235` and brief :889 make the Absolute the creator who saves. In the memo the Absolute at rest
   cannot be perceived ~~and has no will of its own in action; the acting agent is the mirror-image hologram, its "Son"~~
   *(second reader: stated too flatly; the memo pulls both ways. For it: ¶27 says thought holograms "can be done only by
   energy in motion" and that returned consciousness "loses the power of will or choice", S1:1250-1252 (said of human
   consciousness, not of the Absolute). Against it: ¶34 puts "the motive force of will" in "the infinite self-consciousness
   resident in that energy", S1:1618-1619. What the memo does say plainly: the hologram is "the actual agent of all
   creation", S1:1624. Calling it the "Son" rests on F28's downgraded mapping.)* (F19, F21, F25, F27). This is a choice for
   the author (O3), not an error.
8. [read] `handback/p-l161-look-E_2026-11-11.md:91` has ¶38 J from Wikisource only, as unread in the OCR. It is in the OCR at
   S1:1787-1788 with the same words, "non-corporal" (F39). Vice's "non-corporeal" is a misquote (F14).
9. [read] `handback/p-d661-lore-E_2026-11-11.md:115-117` (T10) says the memo does not sort entities into good and evil.
   Confirmed: the words "good" and "evil" are absent (F29).
10. [read] `loop/buildpath_story_lore_2026-11-13.md:112` says public-domain status was not checked. The Commons and
    Wikisource tags exist (F59); they are editors' tags, not a legal ruling.
11. [inferred] `loop/buildpath_run_frame_2026-11-13.md:12` (item 26: no out-of-body in the dream). ¶32 calls deep-sleep
    dreams the same altered state as the Focus levels (F45). This strains only if found lore quotes ¶32 to explain the dream.
12. [read] `handback/p-l161-look-E_2026-11-11.md:83` cites Focus 3 as "¶5". That is the paper's ¶5; cover ¶5 is different
    text (F15).

## 5. Could not obtain

- [read] The CIA reading room itself. `https://www.cia.gov/readingroom/docs/CIA-RDP96-00788R001700210016-5.pdf` and
  `https://www.cia.gov/readingroom/document/cia-rdp96-00788r001700210016-5` both returned the reading room's front page
  (HTML, 42,778 bytes), with plain and browser-like headers. The CIA copy was read through the Commons first upload (S6),
  sourced "Retrieved from the CIA FOIA Reading Room" (S5), and through The Black Vault's PDF (S8).
- [read] `https://www.thearchitect.global/the-25th-page-of-the-cias-gateway-report-on-astral-projection-has-been-discovered/`,
  The Black Vault's source for its attribution: HTTP 502. *(second reader: obtained on 2026-11-13, HTTP 200, 198,786 bytes;
  dated "June 15, 2021"; it names the Monroe Institute as the page's source; see F10.)*
- [read] MuckRock, "Missing Content and Related Documents" (FOIA 82871): HTTP 403.
- [read] The CIA's reply to request F-2020-01656. Only the requester's report of it was seen (S10).
- [read] Commons renders of pages 28 and 30 of the current file: HTTP 429 (rate limit).
- [read] The bibliography's books (Bentov 1977, Monroe 1971 and the rest) were not opened. Every Bentov, Watson, Ferguson,
  Floyd and Gliedman sentence in this file is as the memo quotes it.

## 6. Not verified

- [inferred] Why page 25 is absent from the CIA copy. No source explains it; both agencies say they hold no copy with it
  (F3, F4).
- [summary] The Monroe copy's history before 2021. Vice relays the institute's own account that the report sat unexamined
  for years (S9 line 136); no record of how the institute came to hold it was found.
- [inferred] Which account of the page-25 supplier is right (F10). Vice and the Archive upload agree on the Monroe Institute;
  ~~The Black Vault's source could not be read.~~ *(second reader: it was read; it names the Monroe Institute too. F10.)*
- [inferred] The Black Vault PDF has 30 page objects against its own "29 Pages" label (S8). ~~The 30th is presumably its cover
  sheet; it was not rendered.~~ *(second reader: the extra page is page 2, a Black Vault notice that the document "is made
  available through the declassification efforts and research of" the site's creator (page 2 rendered and viewed, of
  https://documents2.theblackvault.com/documents/cia/CIA-RDP96-00788R001700210016-5.pdf). Page 1 is the covering memo and
  page 30 the bibliography.)*
- [read] The twin Archive item's "(CIA).pdf" file was listed (S4) but not opened.
- [summary: from memory, unverified] Present-day sleep science counts slow-wave sleep, not REM, as the deepest stage; if the
  game quotes ¶32's "REM sleep is the deepest possible level of ordinary sleep", it quotes the memo's claim (F46).
- [summary: from memory, unverified] The Planck length is a length, about 1.6 × 10^-33 cm, not a speed; the memo's
  "centimeters per second" is its own unit mix (F49).
- [inferred] None of the memo's physical or physiological claims (¶3-¶16, ¶31-¶32) was checked against science here; they are
  quoted as the memo's.
- [read] Paragraph page numbers come from Wikisource page numbers minus 2; they were checked against the folio on page images
  only for pages 10, 11, 13, 24, 25, 26 and 28.
- [read] Vice's date is from the article's dateline text in the downloaded HTML (S9 line 93), not from page metadata.

## Second reader, 2026-11-13

Fetched independently into
`C:/Users/zackn/AppData/Local/Temp/claude/690931be4a082db1/3d000000-0000-4000-8000-000000003d00/scratchpad/swarm/memo_whole_second/`
(nothing reused from the first reader's folder; nothing downloaded was run). Sources re-fetched: S1 (95,651 bytes, 1,847
lines), S3 OCR and PDF (289,535 bytes), Archive metadata for both items, `_page_numbers.json`, `_scandata.xml`, page images
n0, n1, n12, n14, n25, n26 (viewed); Commons description wikitext and version history; the Commons first upload (2,443,752
bytes, 29 pages, pages 1 and 27 rendered and viewed); all 30 Wikisource `Page:` texts plus the Index and main page; The
Black Vault page, both letter images (viewed) and its PDF (3,160,520 bytes, page 2 rendered); Vice raw HTML; both 2020
letters; the Archive collection search; the thearchitect.global article. Phrase checks were run with a whitespace-normalising
script over S1 and over the joined Wikisource text (`scripts/find.js`), word diffs with `scripts/wdiff.js`.

| # | claim | verdict | evidence |
|---|---|---|---|
| 1 | F1 stamps on CIA copy, none on Monroe copy | OK | Commons first upload p1 shows "Approved For Release 2003/09/10 : CIA-RDP96-00788R001700210016-5" top and foot and "On file ARMY release instructions apply"; p27 the same; n0, n1, n25, n26 show no stamp; 0 hits for "Approved For Release" in S1 |
| 2 | F2 CIA copy 29 pages, jumps 24 to 26; BV counts | OK | first upload: one `/Count 29`, PyMuPDF 29 pages; page 27 opens "37. Motivational Aspect." with folio 26 under the stamp; BV page "[29 Pages, 3MB]"; BV text layer Holy 0, thyself 0, Limitations 0, Approved 53 |
| 3 | F3 CIA letter, 14 Dec 2023, F-2024-00735 | OK | letter image: "Prior searches revealed that our version of the document is also missing this page, and we do not have a copy on record that contains the page you are seeking." |
| 4 | F4 INSCOM letter, 23 Feb 2024, #0082F-24 | OK | letter image: "disclosed no additional records. All records on the document titled "Analysis and Assessment of Gateway Process" were transferred to the Central Intelligence Agency." |
| 5 | F5 2020 letters | OK | foia-cia-2020.pdf: "June 22, 2020", "including Page 25 which is missing from the Web-accessible version"; foia-inscom-2020.pdf: "July 9, 2020", "F-2020-01656", "They are unable to provide Page 25 of this document and do not have it in their collection." |
| 6 | F6 Vice dateline and quotations | OK | Vice HTML: "April 8, 2021, 10:45am"; "Sitting buried in the Monroe Institute archives in Faber, Virginia, was page 25 of The Gateway Report."; "The email contained the full Gateway Report including the missing page." |
| 7 | F7 Archive item and twin | OK | metadata: addeddate "2021-04-14 20:00:44", uploader archive@monroeinstitute.org, description "Page 25 is included as a separate document."; twin "2021-04-14 19:46:37"; full PDF md5 666861bb… and page-25 md5 4a0f8d5e… identical in both items; third file "3 Analysis and Assessment of Gateway Process(CIA).pdf" 1,892,460 bytes. A third collection, `patron-library-collection`, goes unmentioned |
| 8 | F8 30 leaves, page 25 at n26 | OK | `<leafCount>30`; page_numbers.json leafNum 26 pageNumber "25", leaves 12-29 folios 11-28; n26 image shows folio "25" |
| 9 | F9 Commons insertion | OK; location slip fixed | imageinfo: 2022-12-29T16:03:38Z, comment "...inserted missing page 25"; source line "Page 25 from https://archive.org/details/1983-analysis-of-gateway-process/..."; the "pp. 16 and 17" note is on the main page, not the Index |
| 10 | F10 sources disagree on the supplier | WRONG | thearchitect.global article loaded (200): "the Monroe Institute finally resurfaced and provided the complete Gateway Report— along with page 25" |
| 11 | F11 seams and cross-copy match | OK | S1:1625 "serves the", 1634 "Absolute as the model", 1692 "sense.", 1698 "37."; page 26 diff: only "énhanced"/"enhanced"; page 24: no Wikisource word missing from S1; stray stroke after "Finally" and mark over "occult" seen in n0 and Commons p1 |
| 12 | F11 word counts 613 and 568 | UNSUPPORTED | not reproduced; counts depend on tokenising and page cuts (second reader: 474 and 554 Wikisource words outside templates) |
| 13 | F12 page 25 content, two "Absolute", no stamp | OK, count noted | n26 image and S3; 637 = `wc -w` of S3 including folio "25" and "|" |
| 14 | F13 Vice's page-25 description does not match | WRONG | Vice: "The page opens with the word "Absolute."" The "hell of a way to open a missing page" line follows "Absolute is the ceiling", not the dimensions sentence |
| 15 | F14 "CIA top brass", "non-corporeal" vs "non-corporal" | OK | Vice: "its intended audience—CIA top brass"; "non-corporeal energy forms"; S1:1788 "intelligent, non-corporal energy forms"; Wikisource the same |
| 16 | F15 covering memo shape | OK | n0: "IAGPC-O", "9 June 1983"; n1: "WAYNE M. MCDONNELL", "LTC, MI", "Commander, Det O"; S1:104 title; bibliography items 1-9 at S1:1812-1842 |
| 17 | F16 ¶38 "Ends "a gateway to Gateway"" (and F43 "The last line") | WRONG (minor) | S1:1804-1805: "a gateway to Gateway and to the realm of practical application for the whole system of techniques which comprise it." |
| 18 | F17 34 uses, 31 capitalised, 8 pages, per-paragraph counts | OK | grep -i of S1: 34; lines match the table; folio lines 847, 912, 949, 1023, 1085, 1246, 1628, 1695 put them on pages 11, 12, 13, 14, 15, 18, 24, 25; Wikisource: 30 "Absolute" + 2 "absolute", exhibit labels not transcribed |
| 19 | F18, F19, F20, F22-F24 quotations | OK | each found verbatim in Wikisource and in S1 (lines 819-836, 1034-1039, 1068-1080, 1214-1228), F18's "title we assigned" only after reading S1:1034-1036 by eye (OCR "ina") |
| 20 | F21 "pull against each other", "only bridge" | DOWNGRADE | quotes OK; the tension is inference, and ¶34 S1:1619 and ¶26 S1:1214-1215 offer further bridges |
| 21 | F25 "¶27 is the memo's account of death" | DOWNGRADE | ¶27 says "ultimate return to the Absolute" (S1:1235); the memo never uses "death" (F29, re-checked) |
| 22 | F26 "the paper's universe" | WRONG (minor) | S1:1605-1606: "the concept of the universe which at least some physicists are now coming to accept is identical in its essential aspects" |
| 23 | F27 Trinity passage, page break | OK | n25 image ends "...serves the", folio 24; S1:1610-1625 word for word |
| 24 | F28 Son = mirror-image hologram | DOWNGRADE | S1:1618-1622: the Son "corresponds with" the self-consciousness that provides "the motive force of will"; the hologram comes after "This is so because"; quotations themselves OK, "stylized" lower case confirmed on n26 |
| 25 | F29 absent words | OK | whole-word, case-insensitive, S1 and Wikisource: god, good, evil, soul, death, dead, die, dies, died, dying all 0; "heaven" 1 (lower case) |
| 26 | F31-F48, F50-F57 quotations (about 60 phrases) | OK | all found verbatim in S1 (find.js EXACT or case-only OCR noise) and in Wikisource, except where Wikisource uses {{SIC}} or a page-break template; two read by eye in S1: F39's J (OCR adds "*", S1:1787-1788) and F47's "standing at attention ... foot" (page break, S1:1492-1496) |
| 27 | F49 Planck units | OK; cite slip fixed | S1:859 "drops below 10733 centimeters per second(Planck's Distance)"; Wikisource Page 14 (not 13) "10<sup>-33</sup> centimeters per second"; n14 labels "10-33 cm" |
| 28 | F53 "binaural" absent | OK | 0 hits in S1 and in joined Wikisource |
| 29 | F58 "(the absolute)" in Wikisource, capital in scan | OK | Wikisource Page 13: "infinity(the absolute)"; n12 image: "infinity(the Absolute)"; Page 7 has {{SIC\|desireable\|desirable}} |
| 30 | F59 licence tags | OK; location slip fixed | Commons `{{PD-USGov-CIA}}`; Wikisource `{{PD-USGov}}` on the main page; the Index has none |
| 31 | F60 collection | OK | advancedsearch: numFound 57, all added 2021; the three titles present |
| 32 | F61 "predictability" | OK | metadata description "mechanics and ultimate predictability"; n0 "mechanics and ultimate practicality" |
| 33 | Room-file line citations in sections 3 and 4 (about 45) | OK | each line opened; e.g. brief :1364 "The Absolute", :1378 "might have to re look into what monroe said word for word.", :1426 "a breathing rhythm and timing game", p-l161-look-E:114 "as a separate file" |
| 34 | Section 4 item 7 "has no will of its own in action" | WRONG (overstated) | ¶34 S1:1618-1619 puts "the motive force of will" in the self-consciousness resident in the Absolute's energy; ¶27's will-loss is said of returned human consciousness |
| 35 | Section 5 CIA reading room | OK | 200, text/html, 42,778 bytes for the PDF URL |
| 36 | Section 5 thearchitect.global 502 | OK then, superseded | 200 and 198,786 bytes on 2026-11-13 |
| 37 | Section 6 BV 30th page "presumably its cover sheet" | WRONG | the extra page is page 2, a Black Vault notice; page 30 is the bibliography |

Rule check. No quotation over 40 words was found (longest: F28 "Whether its ...", 38 words). F27 and F28 quote about 250
consecutive words of ¶34 in blocks under 40; the memo is tagged as a US government work (F59), so the small-total limit for
copyrighted works does not bite, but readers should know the blocks are consecutive. No allegation about a real person or
organisation, no inference about the game's author, and no decision for the author was found; section 3 stays options.
Three citation slips were fixed (F9, F49, F59). Marks were too strong in F21, F25 and F28 and are changed in place; O3(b),
O4 and section 4 item 7 are marked where they stood on them.

Trust: every quotation and number taken from the memo itself held up; the errors are in interpretation carried under [read]
marks and in the page-25 provenance story, so use the quotations freely and re-read F21, F25, F28 and F10 before building
on them.
