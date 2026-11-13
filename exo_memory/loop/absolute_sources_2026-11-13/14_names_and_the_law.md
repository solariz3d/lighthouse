# Real names, the memo, and the law: a risk note (not legal advice) (absolute sources 14, 2026-11-13)

Written by a research reader for the Third Place (Opus 5.5), from sources opened and grepped on 2026-11-13.
A second reader's section follows below when present.

**This is research, not legal advice.** It gathers what statutes, opinions, registries and store rules say, so that a
lawyer (or the game's author) can decide faster. Nothing here says what is lawful for this game.

Marks: [read] I opened the source's own text and saw these words (raw text, a PDF, or a page fetched with curl and
grepped). [summary] from a search summary or another secondary account, named. [inferred] my inference. [ours] a
proposal for the game, not a decision. "OCR line N" means line N of the memo's OCR text (S6). "Slip op. N" means page N
of the Supreme Court's slip opinion PDF (S11). "ECF page N" means the court's own "Page N of 29" header (S12).

## 1. What was read

| key | source | how obtained | marks it earns |
|---|---|---|---|
| S1 | 17 U.S.C. 105 with House Report 94-1476 notes, https://www.law.cornell.edu/uscode/text/17/105 | raw HTML, curl, grep | [read] |
| S2 | 17 U.S.C. 101 (definition), https://www.law.cornell.edu/uscode/text/17/101 | raw HTML | [read] |
| S3 | US Copyright Office, Compendium (Third) ch. 300, 313.6(C)(1), PDF dated 01/28/2021, https://www.copyright.gov/comp3/chap300/ch300-copyrightable-authorship.pdf | PDF, pdftotext | [read] |
| S4 | USA.gov, "Learn about copyright and federal government materials", https://www.usa.gov/government-copyright | raw HTML | [read] |
| S5 | 18 U.S.C. 701 and 10 U.S.C. 2260, law.cornell.edu | raw HTML | [read] |
| S6 | The memo, "Analysis and Assessment of Gateway Process", 9 June 1983: the Internet Archive's mirror of the CIA reading-room file, https://archive.org/details/cia-readingroom-document-cia-rdp96-00788r001700210016-5 (OCR text, 29-page PDF, page images n0 and n9) | raw OCR text, PDF, two page images viewed | [read] |
| S7 | USPTO trademark search index, https://tmsearch.uspto.gov (its JSON endpoint), queries run 2026-11-13; each record carries its own load date, 2025-11-07 to 2026-09-03 | raw JSON, saved | [read] |
| S8 | USPTO TSDR status pages, https://tsdr.uspto.gov/statusview/sn76373462 and sn97979584 | raw HTML | [read] |
| S9 | US Copyright Office public records, https://api.publicrecords.copyright.gov, title query "gateway experience" | raw JSON | [read] |
| S10 | Rogers v. Grimaldi, 875 F.2d 994 (2d Cir. 1989), https://openjurist.org/875/f2d/994 | raw HTML | [read] |
| S11 | Jack Daniel's Properties v. VIP Products, 599 U.S. 140 (2023), https://www.supremecourt.gov/opinions/22pdf/22-148_3e04.pdf | PDF, pdftotext | [read] |
| S12 | AM General v. Activision Blizzard, 17 Civ. 8644 (S.D.N.Y. Mar. 31, 2020), ECF 218, copy at https://www.sdnyblog.com/files/2020/04/17-Civ.-08644-2020.03.31-Opinion-Dismissing-Claims-Against-Call-of-Duty.pdf | PDF with the court's ECF header, pdftotext | [read] |
| S13 | E.S.S. Entertainment 2000 v. Rock Star Videos, 547 F.3d 1095 (9th Cir. 2008), https://openjurist.org/547/f3d/1095 | raw HTML | [read] |
| S14 | New Kids on the Block v. News America Publishing, 971 F.2d 302 (9th Cir. 1992), https://openjurist.org/971/f2d/302 | raw HTML | [read] |
| S15 | Punchbowl v. AJ Press, No. 21-55881 (9th Cir. Jan. 12, 2024), https://cdn.ca9.uscourts.gov/datastore/opinions/2024/01/12/21-55881.pdf | PDF | [read] |
| S16 | 15 U.S.C. 1125 (Lanham Act 43), https://www.law.cornell.edu/uscode/text/15/1125 | raw HTML | [read] |
| S17 | Brown v. Entertainment Merchants Ass'n (2011), syllabus only, https://www.law.cornell.edu/supremecourt/text/08-1448 | raw HTML | [read] (syllabus) |
| S18 | Harvard Law Review note, 137 Harv. L. Rev. 440 (2023), https://harvardlawreview.org/wp-content/uploads/2023/11/137-Harv.-L.-Rev.-440.pdf | PDF | [read] (commentary) |
| S19 | Robins Kaplan, "Warzone clash", Daily Journal, 17 May 2024, https://robinskaplan.com/-/media/pdfs/publications/warzone-clash-when-does-a-video-game-title-cross-the-link-into-trademark-infringement | PDF | [read] of the article; its account of rulings is [summary] |
| S20 | Va. Code 8.01-40, https://law.lis.virginia.gov/vacode/title8.01/chapter3/section8.01-40/ | raw HTML | [read] |
| S21 | Va. Code 18.2-216.1, https://law.lis.virginia.gov/vacode/title18.2/chapter6/section18.2-216.1/ | raw HTML | [read] |
| S22 | Troutman Pepper Locke, "Litigating Virginia's right of publicity laws" (June 2026), https://www.troutman.com/insights/litigating-virginias-right-of-publicity-laws/ | raw HTML | [read] of the article; case holdings [summary] |
| S23 | Cal. Civ. Code 3344.1, FindLaw mirror marked "Current as of January 01, 2026", https://codes.findlaw.com/ca/civil-code/civ-sect-3344-1/ | raw HTML (official site gave 403) | [read] (mirror) |
| S24 | N.Y. Civ. Rights Law 50-f, FindLaw mirror, https://codes.findlaw.com/ny/civil-rights-law/cvr-sect-50-f/ | raw HTML (official site gave 403) | [read] (mirror) |
| S25 | Drake v. Park Newspapers, 683 P.2d 1347 (Okla. 1984), https://hallapproved.com/ok/cases/supreme/1984/1159773/ and Saari v. Gillett Communications, 195 Ga. App. 451 (1990), https://hallapproved.com/ga/cases/appeals/1990/5789716/ | raw HTML | [read] |
| S26 | EFF Internet Law Treatise, "Defamation: General" (page last modified 8 March 2012), https://ilt.eff.org/Defamation__General.html | raw HTML | [read] (commentary) |
| S27 | Steamworks, "Onboarding", section "Rules and Guidelines", https://partner.steamgames.com/doc/gettingstarted/onboarding | raw HTML | [read] |
| S28 | Apple App Review Guidelines, https://developer.apple.com/app-store/review/guidelines/ | raw HTML | [read] |
| S29 | Google Play policy pages "Intellectual Property" (answer 9888072) and "Misrepresentation" (answer 9888689), support.google.com | raw HTML | [read] |
| S30 | The Monroe Institute, terms of service, https://www.monroeinstitute.org/policies/terms-of-service; hemi-sync.com page footer | raw HTML | [read] |
| S31 | Wikipedia, "Robert Monroe", raw wikitext, https://en.wikipedia.org/w/index.php?title=Robert_Monroe&action=raw | raw text | [read] (secondary) |
| S32 | Web search summaries: Bindrim v. Mitchell (1979); Boston Nutrition Society v. Stare (1961); Virginia HB 581 / 2026 ch. 629; Steam rules coverage | search tool summaries | [summary] |

Downloads are in the scratch folder `C:/Users/zackn/AppData/Local/Temp/claude/690931be4a082db1/3d000000-0000-4000-8000-000000003d00/scratchpad/swarm/names_and_the_law/dl/`
(e.g. `memo_djvu.txt`, `jd.txt`, `amg.txt`, `tm_results.txt`, `cr_monroe.txt`). They are scratch and may be cleared.

## 2. Findings

### The memo and copyright

- **F1** [read] 17 U.S.C. 101 defines the term: "a work prepared by an officer or employee of the United States
  Government as part of that person's official duties." (S2, the definition of "work of the United States Government".)
- **F2** [read] 17 U.S.C. 105(a): "Copyright protection under this title is not available for any work of the United
  States Government". (S1, subsection (a).)
- **F3** [read] The memo opens: "You tasked me to provide an assessment of the Gateway Experience in terms of its
  mechanics and ultimate practicality." (S6, para. 1, ~~OCR lines 22-23~~ *(second reader: OCR lines 24-25 of
  `cia-rdp96-00788r001700210016-5_djvu.txt` on archive.org; lines 19-21 are the "TO: Commander" block)*.) It is on
  "DEPARTMENT OF THE ARMY ... US ARMY
  INTELLIGENCE AND SECURITY COMMAND" letterhead (S6, page image n0) and is signed as "Commander, Det O" (OCR line 102).
  It says it may be "a useful guide for other USAINSCOM personnel who are required to take the Gateway training or work
  with Gateway materials" (OCR lines 92-94).
- **F4** [inferred] F3 describes an officer's work done on a commander's tasking, for the command's use. That is
  what F1 describes. No court or office has ruled on this memo that I found; "official duties" is the fact that decides it.
- **F5** [read] The Compendium says the bar applies "without regard for the nature of their position or scope of their
  authority" (quoting Georgia v. Public.Resource.Org, 140 S. Ct. 1498, 1509-10 (2020)), and that an employee's work may
  be registered ~~only if~~ *(second reader: the Compendium says "may be registered if", listed as an exception; "only"
  is not in the text)* "prepared at that person's own volition and outside his or her official duties". (S3,
  313.6(C)(1), ~~p. 36~~ *(second reader: the first quote is on p. 36; the "own volition" bullet is on p. 37, after the
  "Chapter 300 : 36" footer)*.)
- **F6** [read] Every page of the scan carries "Approved For Release 2003/09/10 : CIA-RDP96-00788R001700210016-5"
  (S6, OCR line 1 and repeated per page). The Archive item's metadata gives date 1983-06-09 and collections
  "ciareadingroom" and "usgovernmentmirrors" (S6, item metadata).
- **F7** [read] The memo reproduces figures from published books. OCR line 949 reads "EXHIBIT 3 From Bentoy, Stalking
  the Wild Pendulum." (the OCR misreads "Bentov"); Exhibits 1 and 5 carry the same attribution (OCR lines 262, 1192);
  Exhibit 4 cites "Fig. C, Purce, the Mystic Spira[l]" (OCR lines 1112-1113, OCR-damaged). (S6.)
- **F8** [read] Its bibliography lists Bentov, *Stalking the Wild Pendulum* (E. P. Dutton, 1977) and Purce, *The Mystic
  Spiral* (Thames and Hudson, 1980), with seven other published sources. (S6, OCR lines ~~1717-1740~~ *(second reader:
  1717-1745; nine numbered entries, the ninth, Tart, at line 1745; entry 4 is an "undated" Monroe Institute monograph)*.)
- **F9** [read] The memo also quotes other authors at length: a Monroe Institute trainer's monograph (OCR lines 353-357,
  1532), and indented block quotes from Lyall Watson and from ~~Marilyn Ferguson's *Brain/Mind Bulletin*~~ *(second
  reader: Marilyn Ferguson, whom the memo introduces as "editor of the Brain/Mind Bulletin" (OCR lines 631-632); the memo
  does not say the quote comes from the Bulletin, and its bibliography lists Ferguson's "Karl Pribram's Changing Reality",
  Human Behavior, May 1978 (OCR line 1719). The Ferguson block quote is three lines; the Watson one is about 90 words)*
  (S6, page image n9, the memo's page 8; OCR lines 604, 631).
- **F10** [read] The House Report on 105 says "publication or other use by the Government of a private work would not
  affect its copyright protection in any way". (S1, Historical and Revision Notes, "Proposed Saving Clause".) USA.gov
  says the same from the user's side: "Not everything that appears on a federal government website is a government
  work." (S4.)
- **F11** [inferred] From F7 to F10: the memo's own prose is the part 105 reaches. The Bentov and Purce figures and the
  long quoted passages are other people's work set inside it, and their status turns on their own copyright, which was
  not checked (section 5).
- **F12** [read] Copyright abroad is a separate question. The House Report: "The prohibition on copyright protection for
  United States Government works is not intended to have any effect on protection of these works abroad." USA.gov:
  "U.S. copyright laws may not protect U.S. government works outside the country." (S1, notes; S4.)
- **F13** [read] Page 1 of the scan shows ~~the Department of the Army seal~~ *(second reader: the Department of Defense
  seal. Its ring reads "DEPARTMENT OF DEFENSE" over "UNITED STATES OF AMERICA", an eagle with a shield, office symbol
  "IAGPC-O" printed beneath it; page image n0, https://archive.org/download/cia-readingroom-document-cia-rdp96-00788r001700210016-5/page/n0_w800.jpg,
  cropped and enlarged. The words DEPARTMENT OF THE ARMY are the typed letterhead, not the seal)* at top left (S6, page
  image n0). USA.gov: "You
  also cannot use federal government trademarks or federal government agency logos without permission." It also says:
  "You cannot use government materials in a way that implies endorsement by a government agency, official, or
  employee." (S4.)
- **F14** [read] 18 U.S.C. 701 punishes whoever "photographs, prints, or in any other manner makes or executes any
  engraving, photograph, print, or impression in the likeness of any such badge, identification card, or other insignia"
  except as authorised by regulation. (S5.) Whether a seal on a reproduced historic memo is "insignia" under 701 was not
  determined. 10 U.S.C. 2260 lets the military departments license their marks (S5, 2260(a)). *(second reader: 2260(a)
  lets "the Secretary concerned" license marks "owned or controlled by the Secretary concerned"; 2260(f)(2)(A) adds the
  Secretary of Defense "with respect to matters concerning the Defense Agencies and Department of Defense Field
  Activities". Since the seal is the DoD's (F13 corrected), the statute that names agency seals directly, 18 U.S.C. 506,
  and DoD's own rules on its seal were not read by either reader [inferred: worth adding to the clearance sheet, O15].)*

### Marks on the federal register (S7 unless noted; status as of each record's load date)

- **F15** [read] HEMI-SYNC, owner Interstate Industries, Inc. (a Virginia corporation, Lovingston, Virginia), live
  registrations: 3015866 (classes 9 and 41; renewed; TSDR status date Feb. 03, 2026, S8), 2752799 (class 42), 4016155
  (class 9), 5486495 (class 16), and 5632385, "HEMI SYNC" with a design (class 9). Class 41 of 3015866 covers
  "EDUCATIONAL SERVICES, NAMELY, CONDUCTING CLASSES, WORKSHOPS, AND RETREATS" in fields that include meditation.
- **F16** [read] The first HEMI-SYNC application, serial 73421462, was filed 1983-04-13 and registered 1984-05-08
  (1276849), now "CANCELLED - SECTION 8". A new HEMI-SYNC application, serial 50083892, was filed 2026-09-01 in class 41
  for "non-downloadable audio files featuring music and content for mental conditioning and relaxation techniques",
  status "NEW APPLICATION - RECORD INITIALIZED NOT ASSIGNED TO EXAMINER".
- **F17** [read] GATEWAY EXPERIENCE, owner Interstate Industries: registration 2790948 (class 9, prerecorded compact discs;
  the words "AUDIO CASSETTE TAPES AND" appear in square brackets in the record) and 4019643 (class 9, downloadable audio
  files), both "REGISTERED AND RENEWED". THE GATEWAY EXPERIENCE, registration 8118451, registered 2026-01-27, class 41
  (classes and workshops).
- **F18** [read] MONROE INSTITUTE, owner The Monroe Institute (a charitable non-profit corporation, Faber, Virginia):
  registration 7757439 (2025-04-15; classes 16, 41, 42; Principal Register; disclaimer "INSTITUTE"; first use given as
  Jul. 15, 1981, S8) and 7708522 (2025-02-25; class 9, including "Downloadable computer application software for mobile
  phones" for meditation and relaxation recordings). *(second reader [read]: TSDR for 7708522,
  https://tsdr.uspto.gov/statusview/rn7708522, gives "Register: Supplemental", amended to that register Nov. 22, 2024;
  7757439 is on the Principal Register with an acquired-distinctiveness claim "In whole". The class 9 mark is therefore
  a Supplemental Register registration; what that changes was not checked.)*
- **F19** [read] THE MONROE INSTITUTE registrations 2808238 (owner Interstate Industries, 2004) and 4784243 (owner The
  Monroe Institute, 2015) are both "CANCELLED - SECTION 8". Other live marks of the institute: two design marks
  (6898147, classes 25 and 41; 7126014, class 42) and MONROE SOUND SCIENCE (7706752, 8145637). Other live marks of
  Interstate Industries (Virginia) include METAMUSIC, HUMAN PLUS, H-PLUS, MIND FOOD, GOING HOME, HEART-SYNC, EXPLORERS
  WANTED, BE THE HERO OF YOUR OWN JOURNEY, HEMI-SYNC.COM (class 44) and two design-only marks (7041274, 7041278).
- **F20** [read] In the owner queries (75 records for "Interstate Industries", 8 for "Monroe Institute"), no record names
  game software or video games in its goods. The only "game" hits were two cancelled marks (TIGER, TIGER THINK TANK) of a
  different company of the same name incorporated in Illinois.
- **F21** [read] No word-mark record exists for "GATEWAY PROCESS" or "ROBERT MONROE". FOCUS 10, FOCUS 12 and FOCUS 21 marks
  exist only for unrelated goods by unrelated owners (insurance, supplements, hair care, and one music application by an
  individual); FOCUS 15 returned none. *(second reader: reproduced; the hits also include clothing (FOCUS21, class 25)
  and an energy drink label with "FOCUS 12 FL. OZ."; most of these records are dead, and the live ones are FOCUS 10 LIFE
  (insurance), two FOCUS 21 hair-care records, and the FOCUS 21 music application, status "PUBLISHED FOR OPPOSITION".)*
- **F22** [read] JD notes that registration is not what creates rights: "Registration of marks, you'll recall, is
  optional." (S11, slip op. 17.) 15 U.S.C. 1125(a)(1) reaches anyone who "uses in commerce any word, term, name, symbol,
  or device" in a confusing way, with no registration condition in its words (S16).

### Copyright in the institute's recordings and texts

- **F23** [read] The Copyright Office records Gateway Experience sound recordings claimed by Interstate Industries, e.g.
  SR0000799736 "The Gateway Experience: Wave I - Discovery." (registered 2014-10-23) and SR0000957609 "Wave VIII - Union."
  (2023-02-06), and texts claimed by the Monroe Institute, e.g. TX0002611276 "The Gateway experience guidance manual."
  (1989-07-05). (S9, 24 of the 44 hits name one of the two claimants.)
- **F24** [read] The institute's site terms: "You are prohibited from using any of the marks or logos appearing throughout
  the website without our express written permission." (S30, "Trademarks".) The hemi-sync.com footer reads "Copyright ©
  2026 by Interstate Industries, Inc. d/b/a Hemi-Sync®" (S30).

### Real names and marks inside an expressive work

- **F25** [read] Rogers: the Lanham Act should not apply to a title using a celebrity's name "unless the title has no
  artistic relevance to the underlying work whatsoever, or, if it has some artistic relevance, unless the title explicitly
  misleads as to the source or the content of the work". (S10, 875 F.2d at 999 as JD and S12 cite it.)
- **F26** [read] Rogers on implied endorsement: "the slight risk that such use of a celebrity's name might implicitly
  suggest endorsement or sponsorship to some people is outweighed by the danger of restricting artistic expression".
  (S10, Discussion part I, the "Bette Davis Eyes" passage.)
- **F27** [read] Video games are covered: "Video games qualify for First Amendment protection." (S17, syllabus (a).) AM
  General relies on the opinion, 564 U.S. at 790 (S12, ECF page 20).
- **F28** [read] ESS applied Rogers to a game's depiction of a real Los Angeles strip club: "the level of relevance merely
  must be above zero" and "Nothing indicates that the buying public would reasonably have believed that ESS produced the
  video game". (S13, 547 F.3d at 1100.)
- **F29** [read] ESS on nominative use: "Since Rockstar did not use the trademarked logo to describe ESS's strip club,
  the district court correctly held that the nominative fair use defense does not apply in this case." (S13, at 1099.)
- **F30** [read] AM General: "Featuring actual vehicles used by military operations around the world in video games about
  simulated modern warfare surely evokes a sense of realism and lifelikeness". (S12, ECF page 11.) Summary judgment went
  to Activision on the trademark infringement claims (ECF page 21).
- **F31** [read] AM General on motive: "an artist can sell her art without the First Amendment abandoning her." (S12, ECF
  page 21.) On a fine-print notice in the manuals: "back-end boilerplate provides no basis for 'confusion between the two
  companies' products.'" (ECF page 18.)
- **F32** [read] AM General dismissed the trade dress claims given "the improbability of confusion between a vehicle and
  a video game", including the licensed construction-set toys (S12, ECF pages 4 and 22).
- **F33** [read] JD, the holding: "On infringement, we hold only that Rogers does not apply when the challenged use of a
  mark is as a mark." (S11, part IV.) Courts had "confined it to similar cases, in which a trademark is used not to
  designate a work's source, but solely to perform some other expressive function" (slip op. 11).
- **F34** [read] JD's own example of a protected use: in the Hangover Part II case, "All parties agreed that the film was
  not using the Louis Vuitton mark as its 'own identifying trademark.'" (S11, slip op. 12.)
- **F35** [read] JD leaves Rogers open: "Today's opinion is narrow. We do not decide whether the Rogers test is ever
  appropriate". The Gorsuch concurrence (three Justices): "lower courts should handle Rogers v. Grimaldi ... with care",
  and "it is not obvious that Rogers is correct in all its particulars". (S11, part IV; Gorsuch, J., p. 1.)
- **F36** [read] After JD, the Ninth Circuit: "preexisting Ninth Circuit precedent adopting and applying Rogers otherwise
  remains intact and binding on three-judge panels." (S15, slip p. 17.)
- **F37** [summary] On remand in Activision v. Warzone.com, the district court "found that the Rogers test was not the
  appropriate framework" because Activision used "Warzone" "as a source identifier for its game". (S19, a law firm's
  account; the ruling itself was not opened.)
- **F38** [read] JD on dilution: "the noncommercial exclusion does not shield parody or other commentary when its use of
  a mark is similarly source-identifying." (S11, part IV.) Dilution needs a famous mark, one "widely recognized by the
  general consuming public of the United States" (S16, 1125(c)(2)(A)).
- **F39** [read] Sources disagree on JD. The Harvard Law Review note says the Court added to a trend "by misconstruing the
  proper scope of the statutory exclusion from dilution liability for noncommercial uses of a mark". (S18, p. 440.)
- **F40** [read] JD on parody inside the confusion test: once a parody creates contrasts, "a parody is not often likely to
  create confusion." (S11, slip op. 18.) JD cites the "Timmy Holedigger" pet perfume, a Tommy Hilfiger parody, as a case
  where Rogers was refused because the parody named the defendant's own goods (slip op. 13-14).
- **F41** [read] Nominative fair use, third prong: "the user must do nothing that would, in conjunction with the mark,
  suggest sponsorship or endorsement by the trademark holder." ~~The newspapers' use was fair "because it does not imply
  sponsorship or endorsement".~~ *(second reader: those words are the court's general statement of nominative use, "such
  use is fair because it does not imply sponsorship or endorsement by the trademark holder", not a finding about the
  newspapers. The application to them reads "Where, as here, the use does not imply sponsorship or endorsement".
  https://openjurist.org/971/f2d/302, the nominative fair use discussion.)* (S14, the nominative fair use discussion.) The dilution statute likewise excludes "Any
  fair use, including a nominative or descriptive fair use ... of a famous mark by another person other than as a
  designation of source for the person's own goods or services". (S16, 1125(c)(3)(A).)
- **F42** [read] False endorsement: 1125(a)(1)(A) covers a use likely to deceive "as to the affiliation, connection, or
  association of such person with another person, or as to the origin, sponsorship, or approval" of goods. (S16.)

### Real people, living and dead

- **F43** [read] Drake quotes Restatement (Second) of Torts 560: "One who publishes defamatory matter concerning a deceased
  person is not liable either to the estate of the person or to his decendants or relatives." Saari: "There is no common
  law right of action for defamation of a deceased person." (S25.)
- **F44** [read] EFF's treatise: "Truth is an absolute defense to a defamation claim." Its first element: "a false and
  defamatory statement concerning another". (S26.)
- **F45** ~~[summary]~~ *(second reader: [read], opinion text at https://static.case.law/mass/342/cases/0439-01.json)*
  A charitable corporation can sue for libel that prejudices it in public estimation (Boston Nutrition
  Society v. Stare, Mass. 1961, ~~applying Restatement (Second) 561(2)~~ *(second reader: the opinion cites "Restatement:
  Torts, § 561 (2)", the first Restatement; the Second was not yet published in 1961. Its quote of that section: "matter
  which tends to prejudice it in public estimation and thereby to interfere with the conduct of its activities is liable
  to the corporation". The holding was that the demurrer "should not have been sustained", 342 Mass. 439, i.e. the claim
  could go forward, not that the society won)*). ~~(S32, search summary; the opinion gave 403.)~~
- **F46** ~~[summary]~~ *(second reader: [read], 92 Cal. App. 3d 61, https://static.case.law/cal-app-3d/92/cases/0061-01.json)*
  Bindrim v. Mitchell (Cal. Ct. App. 1979): a novelist gave a real therapist's counterpart a different
  name and look, several witnesses still identified him, and he sued for libel. ~~(S32, search summary only.)~~ *(second
  reader: the opinion: "the only differences between plaintiff and the Herford character in 'Touching' were physical
  appearance and that Herford was a psychiatrist rather than psychologist", and "plaintiff was identified by certain
  colleagues as the character". He won: the jury's libel verdict was affirmed as modified ("Otherwise the judgment is
  affirmed"), over a dissent by Files, P. J.)*
- **F47** [read] Virginia's civil statute needs written consent "of such person, or if dead, of the surviving consort and
  if none, of the next of kin" for use "for advertising purposes or for the purposes of trade", and "No action shall be
  commenced under this section more than 20 years after the death of such person." (S20, 8.01-40(A), (B).) Its history
  line ends "2026, cc. 629, 630".
- **F48** [summary] Bill trackers say 2026 chapters 629 and 630 (HB 581, SB 753) added voice and likeness, effective
  1 July 2026. (S32.) The current text read in S20 does list "name, portrait, picture, voice, or likeness".
- **F49** [read] Virginia's criminal statute (a misdemeanor, fine $50 to $1,000) covers "any person resident in the
  Commonwealth", with consent "if dead, of his surviving consort, or if none, his next of kin"; no time limit appears in
  its text. (S21, 18.2-216.1.)
- **F50** [read] Wikipedia gives Robert Monroe's dates as October 30, 1915 to March 17, 1995. (S31, infobox and lead.)
- **F51** [inferred] If Virginia law governs (Rogers: publicity claims follow "the substantive law of the plaintiff's
  domicile", S10 part II.A), the 20-year bar of F47 ran in 2015 on F50's date. F49 has no such bar in its words, and
  how it treats a dead person is not clear from the text. *(second reader: in Rogers that sentence reports New York's
  choice-of-law rule ("The New York Court of Appeals has clearly stated that..."), not a general rule; another forum may
  choose differently, and California's statute keys on acts "occurring directly in this state" (F53). S31's infobox
  leaves death_place blank, so the domicile at death is not established by either reader.)*
- **F52** [read] A Virginia commentary: "an incidental use exception that is recognized under Virginia law excludes from
  liability the use of a plaintiff's name when the name is not the 'primary subject' of the work". It also describes a
  newsworthiness exception. (S22; the cases behind it were not opened.)
- **F53** [read] California's post-mortem statute says an "audiovisual work" and other listed works "shall not be
  considered a product, article of merchandise, good, or service if it is fictional or nonfictional entertainment"; the
  right ends 70 years after death; and it applies to acts "occurring directly in this state". (S23, 3344.1(a)(1)(B)(i),
  (g), (o).)
- **F54** [read] California separately makes liable "a person who produces, distributes, or makes available the digital
  replica of a deceased personality's voice or likeness in an expressive audiovisual work or sound recording without prior
  consent", with a floor of $10,000 and exceptions such as parody and "fleeting or incidental" use. (S23, 3344.1(a)(2).)
- **F55** [read] New York's statute covers only a person "domiciled in this state at the time of death", runs forty years,
  and exempts "audio or audiovisual work, radio or television program, if it is fictional or nonfictional entertainment".
  (S24, 50-f(1)(b), (2)(d)(i), (8).) *(second reader: words found. The (2)(d)(i) exemption is stated for "paragraph a"
  (names and likenesses on goods or in advertising). Paragraph b, a "deceased performer's digital replica in an
  audiovisual work", has its own narrower list in (2)(d)(ii); "deceased performer" means one regularly engaged in
  "acting, singing, dancing, or playing a musical instrument" (1)(a).)*
- **F56** [read] Rogers on publicity in a title: Oregon law, as New York would read it, "would not bar the use of a
  celebrity's name in a movie title unless the title was 'wholly unrelated' to the movie or was 'simply a disguised
  commercial advertisement for the sale of goods or services.'" (S10, ~~part II.A~~ *(second reader: the closing "In
  sum" paragraph, ¶43 on openjurist)*.)

### Store rules

- **F57** [read] Steam, "What you shouldn't publish on Steam", includes "Libelous or defamatory statements", "Content you
  don't own or have adequate rights to", and "Content that violates the laws of any jurisdiction in which it will be
  available". (S27, "Rules and Guidelines".)
- **F58** [read] Apple 5.2.1: "Don't use protected third-party material such as trademarks, copyrighted works, or
  patented ideas in your app without permission". Apple 1.1.2: "'Enemies' within the context of a game cannot solely
  target a specific race, culture, real government, corporation, or any other real entity." (S28.)
- **F59** [read] Google Play: "If your app uses another party's trademarks in a way that is likely to cause confusion,
  your app may be suspended." Its misrepresentation policy bars apps that "impersonate any person or organization".
  (S29.)
- **F60** [inferred] Steam and Google tie their rule to rights and confusion, as the cases do. Apple's 5.2.1 says "without
  permission" with no carve-out for referential use on its face, so it reads stricter than F25 to F41.

## 3. What it offers the game

- **O1** [ours] (F1-F11; pick `story_lore-4` "and documents"; story_lore lap 3, found pages.) Reproduce the memo's own
  prose freely enough, and treat the exhibits and quoted passages as a separate layer: (a) leave Exhibits 1, 3, 4 and 5
  out or replace them with drawn-new diagrams; (b) trim the long Watson, Ferguson and trainer quotes; (c) keep them and
  clear them. Lap 3's pages are a table already, so a `third_party` flag per page is cheap.
- **O2** [ours] (F13, F14; lap 3.) *(second reader: stands on struck F13 in part: the seal is the Department of
  Defense seal, not the Army's; the option itself is unchanged.)* Blur, crop or redraw the ~~Army~~ *(DoD)* seal on
  page 1. The stamp line, letterhead text and signature block carry the document's look without the seal.
- **O3** [ours] (F6, F44; `handback/p-l161-backrooms-E_2026-11-11.md:61-88`, "an official account the player can doubt".)
  A source line in the credits or the in-game file's properties: "US Army memo, 9 June 1983, ~~released~~ *(second
  reader: the stamp reads "Approved For Release", so "approved for release" is the wording the page supports)*
  2003-09-10, CIA-RDP96-00788R001700210016-5". It also gives the searching player a real thread to pull (item 174's abundance).
- **O4** [ours] (F12, F57.) For a worldwide Steam release, two options: (a) rely on the US status and accept the abroad
  question; (b) have one or two main markets checked. Steam's "laws of any jurisdiction" line makes this a store question
  too.
- **O5** [ours] (F15-F19, F33-F37; design `briefs/dreamzone3_design.md:174`, item 48.) The "Monroe Institute" trinket
  collection uses a registered mark as the name of a set of the game's own goods sold on the illicit site. That is the use
  closest to JD's "as a mark" line (F33) and furthest from the Louis Vuitton example (F34). Options: (a) keep the name;
  (b) give the set an in-world label and let the institute appear only in item text ("catalogued at Faber, 1983");
  (c) a fictional institute name for the set. (b) keeps item 48's meaning with the least exposure on the sources read.
- **O6** [ours] (F15, F33, F37; design `:102`, items 48-49; `loop/buildpath_abilities_2026-11-13.md:18`.) The chair
  "meditate with Hemi-Sync": the mark as the name of a mechanic. Options: (a) call it what it is, binaural audio or
  "the tapes", and let documents name Hemi-Sync; (b) keep "Hemi-Sync" on the menu. The chair's Focus levels are not marks
  in the relevant classes (F21).
- **O7** [ours] (F25, F30, F33, F37, F42, F57-F59; `loop/buildpath_frontdoor_onboarding_2026-11-13.md:39-43`, call 1.)
  *(second reader, rule 8: recast as an option, not a decision: (a) keep the three names off these surfaces; (b) allow
  them and have them cleared.)* Keep HEMI-SYNC, GATEWAY EXPERIENCE and MONROE INSTITUTE out of the title, capsule art,
  store text, trailer captions and achievements. Those are the places a name works as a selling point, and the Warzone remand (F37) treated a title as a
  source use. The room's line `:43` already leans this way.
- **O8** [ours] (F31, F41, F42.) A plain non-affiliation line in credits ("not affiliated with or endorsed by ...").
  AM General gave fine print little weight either way (F31), so it is cheap and not a shield; the New Kids prong it
  serves is "do nothing that would ... suggest sponsorship". *(second reader: AM General weighed the user-guide
  boilerplate only as evidence of bad faith offered by the plaintiff (sixth Polaroid factor, ECF page 18); it did not
  weigh a non-affiliation notice as a defence. "Either way" is [inferred], not in the opinion.)*
- **O9** [ours] (F23, F24; item 103, `briefs/dreamzone2_the_game.md:860`; sound build path.) The "Gateway tape rips" on
  the PC can be file names and a player app, but the audio they play should be the game's own tones. *(second reader,
  rule 8: an option, not a decision: (a) the game's own tones; (b) licensed audio.)* The recordings are
  registered sound recordings (F23). This also fits the room's rule that the game claims no effect (frontdoor `:34`).
- **O10** [ours] (F43-F46; item 105, `briefs/dreamzone2_the_game.md:872-876`; `handback/p-d661-lore-E_2026-11-11.md:13-16`,
  `:53`, `:93-101`.) With the institute named in the world (his pick), the risky sentences are invented acts: a previous
  owner "connected to the Monroe Institute" whose PC reaches a child, and a payer narrowed to "two or three candidates".
  Options: (a) the connection is only a fictional person's own claim, never confirmed; (b) the candidates never include
  the real institute; (c) a fictional body stands where the institute would act. F45 suggests an organisation, unlike a
  dead person (F43), can sue over false facts.
- **O11** [ours] (F47-F56.) Robert Monroe: for his name in documents and found text, the statutes read exempt fictional
  entertainment (F53, F55), and Virginia commentary describes an incidental-use exception (F52). A photo, a likeness on a
  model, or a synthesised voice is a different case: California's digital-replica rule (F54) and Virginia's 2026 voice
  wording (F48) name exactly those. If the tapes need a voice, an invented narrator avoids the question.
- **O12** [ours] (F3, F44, F46; `handback/p-d661-lore-E_2026-11-11.md:186-199`, C4 the analyst.) The memo's author took the
  training with a physician ~~in 1983~~ (S6, OCR line 30). *(second reader: "in 1983" is not in OCR line 30, which
  reads "a physician who took the Gateway training with me"; the memo is dated 9 June 1983 and does not date the
  training. D661 dates Army attendance to 1983 on its own [DOC] line, `handback/p-d661-lore-E_2026-11-11.md:190`.
  Rule 8: the "change era, branch or role" and "reproduce them accurately" sentences below are options for the author.)* A fictional "retired Army intelligence analyst" who attended in
  1983 is close enough to be read as him (F46's pattern). If C4 returns from the set-aside cast, change era, branch or
  role so no real attendee fits. For people named in the documents: reproduce them accurately and add no invented act.
- **O13** [ours] (F40; items 115, 120, `briefs/dreamzone2_the_game.md:944-982`; `loop/buildpath_meta_loop_2026-11-13.md:113`,
  "after a legal review".) For that legal review: JD cites a Tommy Hilfiger parody brand case directly (F40), and its
  parody reasoning rests on contrast. Item 120's "serious, not just comedic" names reduce contrast. That trade-off is
  worth putting in front of the reviewer.
- **O14** [ours] (F57-F60.) Store order: Steam's rule follows rights; Apple's reads stricter (F60), and its 1.1.2 means the
  dark one and the chasers should never be the institute or the Army. If a mobile port comes later, check names then.
  *(second reader, rule 8: 1.1.2's words are "cannot solely target"; whether the enemies may be tied to a real body is
  the author's call, and this reads it as a store risk, not a rule for the design.)*
- **O15** [ours] (all.) A one-page clearance sheet for a lawyer before release: every real name, mark, document and image,
  where it appears (document, world, menu, store), and the finding numbers here. It turns this note into a short review.
- **O16** [ours] Call 4, the three options, as the sources bear on them (`loop/buildpath_story_lore_2026-11-13.md:51`;
  his pick in item 183 is (b) plus documents). Directions are [inferred] from the findings named; none is a ruling.

| factor | (a) real names only in found documents | (b) institute also in the world, plus documents (his pick) | (c) invented names throughout |
|---|---|---|---|
| memo prose copyright (F1-F5) | US: 105 reaches it on F4's reading; abroad open (F12) | same as (a) | none if the memo is paraphrased |
| exhibits, quotes, seal (F7-F11, F13, F14) | present if pages are reproduced whole | same as (a) | none |
| marks: confusion, endorsement (F25-F42) | low: documents refer, as in Rogers and ESS | rises with how the names are used: as labels for in-game goods or a mechanic (O5, O6) is nearer JD than a place named in passing | none from these owners |
| marks on store page or title (F37, F57-F59) | avoidable | avoidable, but the pull to use them grows | none |
| publicity, Robert Monroe (F47-F56) | low: name in a historic document | low for the name; higher for likeness or voice (F54) | none |
| defamation by invented act (F43-F46) | low: accurate copies (F44) | the main new exposure: invented acts near the real institute (O10) and look-alike characters (O12) | low, unless an invented body is a thin disguise of a real one (F46) |
| store review (F57-F60) | Steam: rights-based; Apple stricter | same, more names to justify | lowest |
| what the story keeps | real documents, the late reveal (item 26) | the most direct link (~~his "More direct"~~ *second reader: "More direct" is the option's cost line as he read it, item 183 at `briefs/dreamzone2_the_game.md:1462`; his own words there are "and documents"*) | loses the real-research thread item 174 promises |

## 4. Where it contradicts or strains something the room holds

*(second reader, rule 3: the bullets below carry no marks. Read each as [inferred] from the findings it names; the room
file line numbers and quotes were checked and found at the lines given, except `:53`, whose quoted words sit on line 54.)*

- `loop/buildpath_story_lore_2026-11-13.md:51` ("Legal risk not assessed") and `:112` ("public-domain status ... not
  checked"): this file supplies sources for both. It is still not a legal opinion.
- `briefs/dreamzone2_the_game.md:698-699`, item 84, his words: "its not illegal to reference real thngs in a game". The
  cases read support referential use inside an expressive work (F25-F32, F41). They also mark limits: use as a mark
  (F33, F37), invented false facts about a living person or an organisation (F44-F46), voice and likeness (F48, F54), and
  store rules stricter than the law (F58). A qualification, not a contradiction.
- `briefs/dreamzone3_design.md:174` (the "Monroe Institute" collection) and `:102` (the chair "with Hemi-Sync"): both use
  live registered marks as names of the game's own goods or mechanics (F15, F18). See O5 and O6.
- `briefs/dreamzone2_the_game.md:860`, item 103, "old Gateway tape rips": the recordings are registered (F23). The fiction
  can hold rips; ~~the build must not ship the audio~~ *(second reader, rule 8: whether the build ships the audio is
  the author's call; the finding is only that the recordings are registered, F23)*.
- `briefs/dreamzone2_the_game.md:872-876`, item 105, the previous owner: "prob someone connected to the monroe institute
  or cia". And `handback/p-d661-lore-E_2026-11-11.md:99-100`, the payer narrowed to "two or three candidates". With pick
  (b), these strain D661's own rule at `:53` that the game must not claim "that the institute pays anyone" (F45, O10).
- `handback/p-d661-lore-E_2026-11-11.md:190-191` (C4 "one of the fictional attendees" of 1983 Army Gateway training): the
  memo itself records its author attending with a physician (S6, OCR line 30). Identifiability is the strain (F46, O12).
- `handback/p-l161-look-E_2026-11-11.md:70` says the CIA reading-room link returned only the front page; it did again
  today. The Archive keeps a mirror of the reading-room file itself in its "ciareadingroom" collection, with the release
  stamp on every page (F6). The librarian's "approved for release 2003/09/10" (`briefs/dreamzone2_the_game.md:868-869`)
  matches that stamp.
- `loop/buildpath_frontdoor_onboarding_2026-11-13.md:43` ("Avoid the real marks his lore cites (Gateway, Monroe)" in the
  title): F37 supports it; GATEWAY EXPERIENCE and THE GATEWAY EXPERIENCE are live marks (F17). "Gateway" alone was not
  searched.

## 5. Could not obtain

- The CIA reading-room PDF from cia.gov (it served the reading room's front page). Used the Internet Archive mirror.
- CourtListener pages (an anti-bot challenge). AM General was read from the court-filed PDF hosted by a law blog.
- The official California and New York statute pages (403). Read the FindLaw mirrors instead.
- Steam's own "content rules" page (`/doc/gettingstarted/contentrules` now redirects to the docs home). Read the same list
  on the onboarding page.
- ~~Full text of Bindrim v. Mitchell and Boston Nutrition Society v. Stare (Justia 403);~~ *(second reader: both are on
  the Caselaw Access Project's static site, read for F45 and F46: https://static.case.law/mass/342/cases/0439-01.json and
  https://static.case.law/cal-app-3d/92/cases/0061-01.json)* the Restatement (Second) sections
  560, 561 and 652E themselves (only as quoted in opinions); the Restatement (Third) of Defamation and Privacy.
- The Activision v. Warzone.com remand ruling itself; the enrolled text of Virginia's 2026 chapters 629 and 630.
- The rights status of the Bentov (1977) and Purce (1980) figures and of the quoted Watson, Ferguson and trainer passages.
- TSDR for GATEWAY EXPERIENCE (serial 76697559): rate-limited (403). Its status here is from the search index (S7).
- Brown v. EMA's full opinion (the supremecourt.gov URL gave 404); only the LII syllabus was read.

## 6. Not verified

- Not legal advice. Nothing here was reviewed by a lawyer.
- The trademark checks are not a clearance search: exact names only, US federal register only, no similar marks, no
  state or common-law marks, no foreign registers. Status can change after each record's load date.
- Whether the memo was within its author's "official duties" (F4) is inferred from its text.
- Whether any person named in the memo is living was not checked and is not inferred.
- Whether a video game is an "audiovisual work" under the California and New York statutes was not checked in case law.
- AM General and ESS predate JD. How the Second Circuit applies Rogers after JD was not checked (F36 is the Ninth).
- Foreign law (EU, UK, Canada, others) on government works, personality rights and defamation was not checked.
- Whether 18 U.S.C. 701 reaches a seal on a reproduced historic document (F14).
- The Hemi-Sync patents' terms and the game's own title as a mark were not searched.
- Bill-tracker accounts of Virginia's 2026 amendment (F48) were not checked against the enrolled acts.

## Second reader, 2026-11-13

A second reader (Opus 5.5) fetched every source below independently on 2026-11-13 with curl, into
`C:/Users/zackn/AppData/Local/Temp/claude/690931be4a082db1/3d000000-0000-4000-8000-000000003d00/scratchpad/swarm/names_and_the_law_second/dl/`,
and grepped the raw text. PDFs went through pdftotext; two memo page images were viewed, one cropped and enlarged.
The first reader's downloads were not used as proof. Trademark records were re-queried live (tmsearch JSON endpoint,
`prod-stage-v1-0-0/tmsearch`, and 16 TSDR status pages); the Copyright Office API was re-queried live.

Verdicts: OK = the words or number were found. WRONG = the source says otherwise. UNSUPPORTED = the source does not say
it. No [read] claim turned out to rest on a summary, so there are no DOWNGRADEs; F45 and F46 were upgraded to [read].

| claim | verdict | evidence |
|---|---|---|
| F1 | OK | law.cornell.edu 17/101: "a work prepared by an officer or employee of the United States Government as part of that person's official duties" |
| F2 | OK | 17/105(a): "Copyright protection under this title is not available for any work of the United States Government" |
| F3 quotes | OK | archive.org `_djvu.txt` lines 5-7 letterhead incl. "US ARMY INTELLIGENCE AND SECURITY COMMAND"; line 102 "Commander, Det O"; lines 93-94 "useful guide for other USAINSCOM personnel" |
| F3 line cite | WRONG (minor) | the opening sentence is on OCR lines 24-25, not 22-23 |
| F4 | not re-derived | [inferred]; its premise F3 holds; the memo is addressed "TO: Commander, US Army Operational Group" (OCR 19-21) |
| F5 | WRONG (minor) | copyright.gov ch300 PDF: first quote on p. 36 (OK); "own volition" bullet on p. 37, and it says "may be registered if", not "only if" |
| F6 | OK | release stamp at OCR line 1 and 52 times in 1,750 lines; archive metadata `"date":"1983-06-09"`, collections "ciareadingroom","usgovernmentmirrors","government-documents" |
| F7 | OK | OCR 262 "EXHIBIT 1 prom Bentoy", 949 "EXHIBIT 3 From Bentoy, Stalking the Wild Pendulum.", 1112-1113 "Fig. C, Purce, the / Mystic Spira", 1192 "EXHIBIT 5 rom Bentoy" |
| F8 | OK (range minor) | bibliography OCR 1717-1745, nine entries; 1718 "E. P. Dutton, 1977"; 1734 "Thames and Hudson Inc., 1980" |
| F9 | WRONG (part) | Watson block quote OCR 604-614 (OK); Jager monograph OCR 353-357 (OK); the Ferguson quote is not attributed to the Brain/Mind Bulletin; she is introduced as its "editor" (631-632), and the bibliography lists Human Behavior, May 1978 (1719) |
| F10 | OK | 17/105 notes: "publication or other use by the Government of a private work would not affect its copyright protection in any way."; usa.gov: "Not everything that appears on a federal government website is a government work." |
| F12 | OK | 17/105 notes: "...is not intended to have any effect on protection of these works abroad."; usa.gov: "U.S. copyright laws may not protect U.S. government works outside the country." |
| F13 seal | WRONG | page image n0, cropped: ring text "DEPARTMENT OF DEFENSE" / "UNITED STATES OF AMERICA"; it is the DoD seal, not the Army's |
| F13 quotes | OK | usa.gov: both sentences found verbatim |
| F14 | OK | 18/701 text found verbatim; 10/2260(a) "the Secretary concerned may license trademarks..." |
| F15 | OK | TSDR rn3015866: HEMI-SYNC, classes 009 and 041, "renewed", Status Date Feb. 03, 2026, owner Interstate Industries, organized VIRGINIA, P.O. Box 505 Lovingston; class 41 "EDUCATIONAL SERVICES, NAMELY, CONDUCTING CLASSES, WORKSHOPS, AND RETREATS IN THE FIELD OF ... MEDITATION"; 2752799 cl. 042, 4016155 cl. 009, 5486495 cl. 016, 5632385 "HEMI SYNC" design cl. 009, all live |
| F16 | OK | TSDR sn73421462: filed Apr. 13, 1983, reg. 1276849 May 08, 1984, "SECTION 8 - CANCELLED"; sn50083892: filed Sep. 01, 2026, class 041, "non-downloadable audio files featuring music and content for mental conditioning and relaxation techniques" |
| F17 | OK | TSDR rn2790948 "PRERECORDED [ AUDIO CASSETTE TAPES AND ] COMPACT DISCS", renewed; 4019643 cl. 009 renewed; rn8118451 reg. Jan. 27, 2026, cl. 041 "conducting classes and workshops" |
| F18 | OK, with an omission | TSDR rn7757439: reg. Apr. 15, 2025, classes 016/041/042, Principal, disclaimer "INSTITUTE", first use Jul. 15, 1981, owner charitable non-profit corp., Faber, Virginia; rn7708522 reg. Feb. 25, 2025, cl. 009, is on the Supplemental Register |
| F19 | OK | tmsearch: 2808238 (Interstate) and 4784243 (Monroe Institute) "CANCELLED - SECTION 8"; 6898147 (IC 025, 041), 7126014 (IC 042), 7706752, 8145637 live; Interstate live marks as listed, HEMI-SYNC.COM 3801471 IC 044 |
| F20 | OK | ownerName "interstate industries": 75 records; "monroe institute": 8; the only "game" goods are TIGER and TIGER THINK TANK, Interstate Industries (ILLINOIS), cancelled |
| F21 | OK | "gateway process" 0, "robert monroe" 0, "focus 15" 0; FOCUS 10, 12, 21 hits all other owners and goods (clothing and an energy drink also appear) |
| F22 | OK | JD PDF p. 21 = slip op. 17: "marks, you'll recall, is optional"; 15/1125: "uses in commerce any word, term, name, symbol, or device" |
| F23 | OK | api.publicrecords.copyright.gov, title "gateway experience": 44 hits, 24 with either claimant; SR0000799736 2014-10-23, SR0000957609 2023-02-06, TX0002611276 1989-07-05 |
| F24 | OK | monroeinstitute.org ToS sentence found verbatim; hemi-sync.com: "Copyright © 2026 by Interstate Industries, Inc. d/b/a Hemi-Sync®" |
| F25, F26 | OK | openjurist 875/f2d/994: both quotes found verbatim; "Bette Davis Eyes" is in the passage before F26's quote |
| F27 | OK | LII syllabus: "(a) Video games qualify for First Amendment protection."; AM General ECF page 20 cites 564 U.S. 786, 790 |
| F28, F29 | OK | openjurist 547/f3d/1095: all three quotes found, between the *1099/*1100 and *1100/*1101 markers as cited |
| F30, F31, F32 | OK | AM General ECF pp. 11 ("surely evokes"), 21 ("an artist can sell her art"; "summary judgment is granted dismissing trademark infringement claims"), 18 ("back-end boilerplate"), 4 (licensed construction sets), 22 ("improbability of confusion") |
| F33, F35, F38 | OK | JD part IV (PDF p. 24): "Today's opinion is narrow...", "we hold only that Rogers does not apply when the challenged use of a mark is as a mark", "the noncommercial exclusion does not shield parody..."; slip op. 11 "confined it to similar cases"; Gorsuch (with Thomas and Barrett) p. 1 "with care", "not obvious that Rogers is correct in all its particulars" |
| F34 | OK | JD slip op. 12: "All parties agreed that the film was not using the Louis Vuitton mark as its 'own identifying trademark.'" |
| F36 | OK | ca9 21-55881 slip p. 17: "remains intact and binding on three-judge panels" |
| F37 | OK as [summary] | Robins Kaplan PDF, Daily Journal, Friday May 17, 2024: "found that the Rogers test was not the appropriate framework"; "as a source identifier for its game" |
| F39 | OK | HLR 137:440: "by misconstruing the proper scope of the statutory exclusion from dilution liability for noncommercial uses of a mark" |
| F40 | OK | JD slip op. 18: "a parody is not often likely to create confusion"; slip op. 13-14: Timmy Holedigger, Rogers declined where use was "at least in part" for "source identification" |
| F41 | WRONG (minor) | New Kids: the "because it does not imply sponsorship or endorsement" sentence is the general statement, not a finding on the newspapers; 1125(c)(3)(A) quote OK |
| F42 | OK | 1125(a)(1)(A) words found |
| F43 | OK | Drake: Restatement (Second) of Torts (1974) § 560 quote incl. "decendants"; Saari: "There is no common law right of action for defamation of a deceased person." |
| F44 | OK | ilt.eff.org: both phrases found; "last modified on 8 March 2012" |
| F45 | WRONG (Restatement) | 342 Mass. 439 (CAP): cites "Restatement: Torts, § 561 (2)", the first Restatement; claim otherwise holds |
| F46 | OK, upgraded | 92 Cal. App. 3d 61 (CAP): differences only "physical appearance" and psychiatrist v. psychologist; "identified by certain colleagues"; judgment affirmed as modified |
| F47 | OK | law.lis.virginia.gov 8.01-40: (A) consent wording and "for advertising purposes or for the purposes of trade"; (B) "more than 20 years after the death"; history "2026, cc. 629, 630" |
| F49 | OK | 18.2-216.1: "any person resident in the Commonwealth", "misdemeanor", "not less than $50 nor more than $1,000" |
| F50 | OK | Wikipedia raw wikitext: birth 1915-10-30, death 1995-03-17; death_place blank |
| F51 | OK as [inferred], qualified | Rogers states the domicile rule as New York's choice-of-law rule; 1995 + 20 years = 2015 |
| F52 | OK | troutman.com (datePublished 2026-06-01): "An incidental use exception that is recognized under Virginia law..." |
| F53, F54 | OK | FindLaw 3344.1 "Current as of January 01, 2026": (a)(1)(B)(i), (g) 70 years, (o) "acts occurring directly in this state"; (a)(2)(A)(i) digital replica, "$10,000", (ii)(II) parody, (IV) "fleeting or incidental" |
| F55 | OK, incomplete | FindLaw 50-f: (1)(b) domicile, (8) "forty years", (2)(d)(i) exemption; that exemption is stated for paragraph a only |
| F56 | OK words, WRONG place (minor) | the quote is in Rogers ¶43, "In sum", not part II.A |
| F57 | OK | partner.steamgames.com onboarding: under "What you shouldn't publish on Steam:" all three items found |
| F58 | OK | developer.apple.com: 5.2.1 and 1.1.2 sentences found verbatim |
| F59 | OK | support.google.com 9888072: "If your app uses another party's trademarks in a way that is likely to cause confusion, your app may be suspended."; 9888689: "impersonate any person or organization" |
| O12 "in 1983" | UNSUPPORTED | OCR line 30 gives no year for the training |
| §4 CIA link | OK | https://www.cia.gov/readingroom/docs/CIA-RDP96-00788R001700210016-5.pdf redirected to the reading room front page today |
| §4 room lines | OK | design `:102`, `:174`; dreamzone2 `:698`, `:860`, `:868-869`, `:872-876`; D661 `:99`, `:190-191`; story_lore `:51`, `:112`; meta_loop `:113`; L161 look `:70`; frontdoor `:34`, `:43`: all found as quoted (D661's quoted words are on `:54`) |

Rule slips fixed: O7, O9, O14, the §4 "must not ship" line and the O12 instructions recast as options (rule 8); §4
given a mark note (rule 3); O16's "his 'More direct'" re-attributed to the option text he read (attribution). No
quotation over 40 words was found, and no allegation about a real person or organisation.

Not re-checked: F11, F60 and O16's directions (inferences); S7's load-date range; F48 (still [summary]).

How far to trust it: the sources are real and the quoted words are almost all exact; the errors are in
identification (the seal), attribution (Ferguson, New Kids, Restatement edition) and page or line pointers, so use the
findings as corrected here and still put every one in front of a lawyer before release.
