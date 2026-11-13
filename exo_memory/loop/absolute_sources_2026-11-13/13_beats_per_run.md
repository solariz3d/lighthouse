# How run-based games ration story (absolute sources 13, 2026-11-13)

Written by a research reader for the Third Place (Opus 5.5), one of a swarm; read-only except this file and its scratch folder.
A second reader's section follows below when present.

Marks: [read] I downloaded the source's own text (curl, then grep) and saw these words; the place is given as the source's
section plus the line in my scratch copy (`<scratch>` = `C:/Users/zackn/AppData/Local/Temp/claude/690931be4a082db1/
3d000000-0000-4000-8000-000000003d00/scratchpad/swarm/beats_per_run/`). [summary] secondary or summarising account.
[inferred] my own reasoning. [ours] a proposal for the game. Translations from Japanese are mine and are never put in
quotation marks. Steam figures were fetched 2026-11-13 about 12:29 UTC and move over time.

## 1. What was read

| # | source | how obtained | marks earned |
|---|---|---|---|
| S1 | Game Developer, "How Supergiant weaves narrative rewards into Hades' cycle of perpetual death", 2020 (reports an RPS interview) | raw HTML, `gd_hades_narrative.txt` | [read] for GD's words; Kasavin's words second-hand |
| S2 | Game Developer, GDC Podcast ep. 16 write-up, Kasavin, 2021-01-28 | raw HTML, `gd_kasavin_podcast.txt` | [read] |
| S3 | GeekDad, "Narrative and Early Access: Supergiant's Greg Kasavin Discusses Hades", 2019-10-31 | raw HTML, `hades_geekdad.txt` | [read] |
| S4 | VICE, "How Hades made a genre known for being impossibly hard accessible" | raw HTML, `hades_vice.txt` | [read] |
| S5 | Famitsu report of the GDC 2021 talk "Breathing Life into Greek Myth: The Dialogue of Hades" (Japanese) | raw HTML, `famitsu_hades_gdc.txt` | [read], translation mine |
| S6 | GDC Vault abstract of the same talk (play/1026975) | raw HTML, `gdcvault_hades.txt` | [read] (abstract only) |
| S7 | Hades fan wiki (hades.fandom.com): God Mode, Achievements, Epilogue Guide | MediaWiki API wikitext, `hadeswiki_*.txt` | [read], fan-edited |
| S8 | HowLongToBeat pages for Hades (62941) and Inscryption (91622) | raw HTML, embedded JSON, `hltb_*.html` | [read] |
| S9 | Steam global achievement percentages, 8 apps | Steam Web API JSON + community page names, `steam_join_*.tsv` | [read] |
| S10 | GamingTrend interview with Gregory Louden (Returnal) | raw HTML, `returnal_gamingtrend.txt` | [read] |
| S11 | Housemarque.com, "Interview with Eevi Korhonen", 2021-10-12 | raw HTML, `returnal_hm_korhonen.txt` | [read] |
| S12 | VGC, "Housemarque writer says creating Returnal's mystery was a 'tightrope walk'" | raw HTML, `returnal_vgc_tightrope.txt` | [read] |
| S13 | Push Square, "Not Everyone Had the Fortitude to Finish Returnal on PS5", Dec 2021 | raw HTML, `returnal_pushsquare.txt` | [read] (trophy data second-hand) |
| S14 | Game Developer, "How a game jam on 'sacrifices' became Inscryption", 2022-03-14 | raw HTML, `inscr_gd_jam.txt` | [read] |
| S15 | GDC Vault abstract, "Sacrifices Were Made: The Inscryption Post-Mortem" (play/1027609) | raw HTML, `inscr_gdcvault.txt` | [read] (abstract only) |
| S16 | Famitsu report of the same GDC 2022 post-mortem plus a short interview (Japanese) | raw HTML, `inscr_famitsu.txt` | [read], translation mine |
| S17 | Game Developer, "Live, die, repeat: How Outer Wilds piques curiosity…", 2019 | raw HTML, `ow_gd_livedie.txt` | [read] |
| S18 | Game Developer, "Explaining the value of show-don't-tell storytelling in Outer Wilds" (K. Beachum, GDC 2021) | raw HTML, `ow_gd_showdonttell.txt` | read; no finding kept |
| S19 | MCV/DEVELOP, "We didn't think it would have tremendously broad appeal" (Mobius, Outer Wilds) | raw HTML, `ow_mcv.txt` | [read] |
| S20 | GamesRadar, "The making of Outer Wilds" | raw HTML, `ow_gamesradar.txt` | read; no finding kept |
| S21 | PC Gamer, "Darkest Dungeon's new 'Radiant' mode promises shorter, more accessible campaigns", Dec 2016 | raw HTML, `dd_pcg_radiant.txt` | [read]; Red Hook blog quoted second-hand |
| S22 | Game Developer, "Darkest Dungeon: designing for despair…", 2015-02-24 (Bourassa, Sigman) | raw HTML, `dd_gd_despair.txt` | [read] |
| S23 | Darkest Dungeon wiki (darkestdungeon.wiki.gg): Game Modes, Ancestor's Journal, Ancestor's Memoirs | MediaWiki API wikitext, `ddwiki_*.txt` | [read], fan-edited |
| S24 | PC Gamer, "What will Slay the Spire 2's final ending be like?" (Casey Yano) | raw HTML, `sts_pcg_ending.txt` | [read] |
| S25 | Rogue Legacy 2 fan wiki (rogue-legacy-2.fandom.com): Journal Entry, Achievements | MediaWiki API wikitext, `rl2wiki_*.txt` | [read], fan-edited |
| S26 | Shacknews, Teddy Lee on Rogue Legacy 2, 2020 | raw HTML, `rl2_shack.txt` | read; no finding kept |
| S27 | GamesRadar, two Luca Galante interviews ("30 hours of story mode…"; "3,000 hours…") | raw HTML, `vs_gr_tutorial.txt`, `vs_gr_3000h.txt` | [read] |
| S28 | Vampire Survivors wiki (vampire.survivors.wiki): The Reaper | MediaWiki API wikitext, `vswiki_reaper.txt` | [read], fan-edited |
| S29 | Emily Short, "Storylets: You Want Them" (2019) and "Beyond Branching…" (2016) | raw HTML, `es_storylets.txt`, `es_beyond_branching.txt` | [read] |
| S30 | Room files: `briefs/dreamzone2_the_game.md` (item 183), `briefs/dreamzone3_design.md`, `handback/p-d667-story-E_2026-11-11.md`, `loop/buildpath_story_lore_2026-11-13.md`, `loop/buildpath_stress_2026-11-13.md`, `loop/buildpath_meta_loop_2026-11-13.md`, `loop/buildpath_waking_room_2026-11-13.md` | opened locally | cited as path:line |
| S31 | Web search result summaries (several) | summarising search tool | used only to find URLs; no finding rests on them |

## 2. Findings

### Hades (Supergiant, 2020)

- **F1** [read] Kasavin, via Game Developer's report of an RPS interview: "It was an explicit goal of our early development, to
  take the pain out of dying and having to restart." S1, body paragraph 3 (`gd_hades_narrative.txt:106`).
- **F2** [read] Game Developer's own paraphrase (not Kasavin's words): the game checks mid-run situations, such as meeting a
  character while Zagreus' health is below a threshold, and serves one of several pre-written events. S1 (`:108`).
- **F3** [read] Same paraphrase: "the development team can weight certain events in a way that gives them more of a chance
  to pop up". ~~This is the only priority or weighting statement I could open;~~ *(second reader: not the only one; this
  file's own F18, Famitsu's "ストーリー・イベントを優先したシステム", is a second.)* The RPS original was not reachable. S1 (`:109`).
- **F4** [read] Kasavin, Oct 2019 (early access): the content is a mix of "these bigger story moments that never repeat, and
  a lot of content that is designed to be repeatable". S3, answer on early-access endings (`hades_geekdad.txt:139`).
- **F5** [read] Same answer, the one stated repetition number: "you would have to have looped through the game like 20 or 30
  times, so hours and hours of play before a small line will repeat". Unit: runs. S3 (`:139`).
- **F6** [read] Kasavin, same interview: after narrative closure the game keeps going, and "if you’re super skilled and stuff
  like that, there’s going to be plenty more stuff that you could see." S3 (`:135`).
- **F7** [read] Kasavin to VICE: "We wondered, could we make the moment of death something players almost look forward to,
  rather than dread?" S4 (`hades_vice.txt:105`).
- **F8** [read] Kasavin to VICE on God Mode: it "preserved the idea that dying is a central part of the game and story."
  S4 (`:113`).
- **F9** [read] Kasavin, GDC Podcast: "There's nothing more frustrating in games where you're really engaged with the story,
  but then you just hit a difficulty wall". He says Supergiant builds systems to mitigate it. S2 (`gd_kasavin_podcast.txt:104`).
- **F10** [read] God Mode starts at 20% damage resistance, adds 2% "each time a run ends in death", capped at 80%. Fan wiki;
  it cites a Supergiant tweet I did not open. S7, God Mode (`hadeswiki_godmode.txt:4`).
- **F11** [read] The credits need ten successful escapes: "Clear 10 runs total to complete the story and see the credits."
  Fan wiki. S7, Achievements, "The Family Secret" (`hadeswiki_ach.txt:94`).
- **F12** [read] The epilogue comes after the credits and is gated by dialogue and affinity requirements (talking to Hades,
  Persephone, Zeus and Demeter; raising Olympian affinity)~~, not by more clears~~. Fan wiki. S7, Epilogue Guide (`:18-36`).
  *(second reader: the guide never mentions clears either way, so "not by more clears" is unsupported. It also names a
  Part II: "The next step entails speaking to each Olympian god to deliver an invitation to the gathering, followed by
  speaking to Persephone", and an affinity bar, "Six of the following are required", most at 7 hearts; Epilogue_Guide
  wikitext via https://hades.fandom.com/api.php?action=parse&page=Epilogue_Guide&prop=wikitext, Part II and Affinity
  Requirements.)*
- **F13** [read] After the epilogue "minor events continue to occur for a period of time afterwards". S7, Epilogue Guide (`:16`).
- **F14** [read] Meeting requirements makes a line eligible, not due: "you may experience delays in receiving a specific
  piece of dialogue even if you have met the requirements." Fan wiki. S7, Epilogue Guide (`:48`).
- **F15** [read] Famitsu's report of the GDC 2021 talk gives 30 characters, a total of 21,000 lines and 305,433 words
  (translation mine). S5 (`famitsu_hades_gdc.txt:105`).
- **F16** [read] The GDC Vault abstract of the same talk says "more than 22,000 lines of dialogue". S6 (`gdcvault_hades.txt:32`).
  F15 and F16 disagree (21,000 against more than 22,000); I could not open the talk to settle it.
- **F17** [read] Famitsu reports that Zagreus' short quips play at random until every one has been said, so that the same
  line does not come twice in a row (translation mine). S5 (`:171`).
- **F18** [read] Under "to improve", Famitsu lists file organisation and improving the system that prioritises story events
  (translation mine). S5 (`:210`).
- **F19** [read] HowLongToBeat, Hades: main story 84,888 s (23.6 h) from 2,829 submissions; main plus extras 175,350 s
  (48.7 h); completionist 343,086 s (95.3 h). S8 (`hltb_62941.html`, fields `comp_main`, `comp_plus`, `comp_100`).
- **F20** [read] Steam, Hades: Escaped Tartarus 81.8%; first full clear 46.7%; credits ("The Family Secret") 23.3%; any bond
  forged 26.2%; epilogue ("One for the Ages") 8.4%. S9 (`steam_join_1145360.tsv`).

### Returnal (Housemarque, 2021)

- **F21** [read] Korhonen on "evolving storytelling": "the Databank entries would uncover more information the more times you
  killed an enemy or picked up an item." S11 (`returnal_hm_korhonen.txt:53`).
- **F22** [read] Korhonen: pacing could not be judged until it was in the game, so "up until the last moment, we’re still
  cutting, we’re still editing, and then tweaking the wording and making things a bit clearer". S12 (`:31`).
- **F23** [read] Louden: after release Housemarque added "Suspend Cycle" (save mid-run) in Returnal 2.0, from player feedback.
  S10 (`returnal_gamingtrend.txt:157-158`).
- **F24** [read] Push Square, PS5 trophy data (Dec 2021): "only 58 per cent of players saw off the first boss" and "just 10 per
  cent of players managed to see off Act 3". S13 (`returnal_pushsquare.txt:33`, `:35`).
- **F25** [read] Steam (PC), Returnal: first death 93.6%; 10 Scout Logs 65.5%; first House sequence 68.4%; first boss 61.6%;
  Act 1 37.3%; Act 2 24.5%; all House sequences 7.0%; Act 3 6.4%; secret ending 2.4%. S9 (`steam_join_1649240.tsv`).

### Inscryption (Daniel Mullins, 2021)

- **F26** [read] Mullins: "there is an overarching system that makes each run feel like another step toward a larger goal";
  the cabin puzzles were how Inscryption did that. S14 (`inscr_gd_jam.txt:114`).
- **F27** [read] GDC Vault abstract: "a 10 minute game jam entry grew, after several twists and turns, into a sprawling 14 hour
  experience". S15 (`inscr_gdcvault.txt:32`).
- **F28** [read] Famitsu's report of the post-mortem: when a cabin puzzle was too hard, players went back to the main
  roguelike loop and repeated it until bored; the puzzles were made easier, then some were solved at once without the
  insight Mullins wanted (translation mine). S16 (`inscr_famitsu.txt:124`).
- **F29** [read] Mullins: during development he did not think of Inscryption as something replayed many times; with an
  ending, players may never play again, and Kaycee's Mod's endless climb contradicts that and may have partly undercut it
  (translation mine). S16 (`:160`).
- **F30** [read] HowLongToBeat, Inscryption: main 46,183 s (12.8 h) from 1,266 submissions; main plus extras 15.7 h;
  completionist 31.9 h. S8 (`hltb_91622.html`).
- **F31** [read] Steam, Inscryption: first Deathcard 93.4%; defeat Leshy (end of the roguelike act, PART1) 70.0%; the four
  temples (PART2) 51.8% to 55.0%; finale 40.9%. S9 (`steam_join_1092790.tsv`).

### Outer Wilds (Mobius Digital, 2019)

- **F32** [read] The loop: "after 22 minutes a supernova destroys your solar system". Unit: minutes.
  S17 (`ow_gd_livedie.txt:104`).
- **F33** [read] Alex Beachum: the loop "really focuses on knowledge being the only real thing of value in this world".
  S17 (`:107`).
- **F34** [read] Beachum: an early hook (an object crashing into the village) "super didn't work" because players were not yet
  familiar with the village, ~~so nothing in it was new to them~~ *(second reader: the source says the opposite: "That
  [object from space] is not new to them to them [when] everything is new". Everything was new, so the arrival did not
  stand out. GD "Live, die, repeat", Beachum's second quoted paragraph.)*. S17 (`:115`).
- **F35** [read] Beachum: the lighthouse signals were cut "because players thought there was a puzzle there when there
  wasn’t". S19 (`ow_mcv.txt:55`).
- **F36** [read] Beachum: "we needed to cut things that weren’t directly related to information players should care about".
  S19 (`:56`).
- **F37** [read] Beachum: on the one mystery players stuck on (the Ash Twin project), "All we could do is try to improve the
  clues for it". S19 (`:57-60`).
- **F38** [read] Steam, Outer Wilds: complete the ship log 3.8%; reach the Eye in one loop 2.8%. None of the 31 achievements
  names the ending, so Steam gives no ending rate. S9 (`steam_join_753640.tsv`).

### Darkest Dungeon (Red Hook, 2016)

- **F39** [read] PC Gamer: "Normal campaigns can run 80 hours or more". S21 (`dd_pcg_radiant.txt:474`).
- **F40** [read] Red Hook's blog, as PC Gamer quotes it: Radiant mode "will have balance changes and rule tweaks aimed at
  bringing the completion time down to approximately 40 hours". S21 (`:493`).
- **F41** [read] Radiant's changes include "Town Events trigger more frequently to compensate for shorter playtime". Fan wiki.
  S23, Game Modes (`ddwiki_gamemodes.txt:23`).
- **F42** [read] Bourassa: the narrator "sardonically comments on your success and knowingly nods when you fail"~~, and "That’s
  part of the story of the game"~~. S22 (`dd_gd_despair.txt:139`). *(second reader: the cut quotation changes the sense.
  The full sentence is "That’s part of the story of the game that we’re going to expose when we launch." It was said in
  Feb 2015, during early access, and most likely means the narrator himself is a story still to be revealed [inferred].
  It does not say the nod at failure counts as story.)*
- **F43** [read] Bourassa: "He chimes in randomly most of the time"; the loudest lines were held back for big moments. S22
  (`:142-143`).
- **F44** [read] Journal pages (lore found in dungeons) drop at a base probability of 1/2000 per chance, and "you never get
  duplicates of any one page". Fan wiki. S23, Ancestor's Journal (`:11`, `:15`).
- **F45** [read] Boss-expedition cutscenes become replayable in the Memoirs only once that boss is defeated. Fan wiki.
  S23, Ancestor's Memoirs, "The Ancestor's Path" (`:12-14`).
- **F46** [read] Steam, Darkest Dungeon: first boss 53.4%; 10 quests 50.4%; week 52 20.8%; "Complete the game" 4.6%.
  S9 (`steam_join_262060.tsv`). *(second reader: the same Steam list has "Entry Level", "Complete the game on Radiant",
  at 6.8% (`game_complete_radiant`), plus "Strict Mode", "Complete the game with default difficulty options", at 4.4%.
  Radiant completions are higher than plain "Complete the game", so 4.6% cannot be the share who finished in any mode.
  That share is at least 6.8%. Steam API GetGlobalAchievementPercentagesForApp gameid=262060, names from
  https://steamcommunity.com/stats/262060/achievements/?l=english embedded JSON.)*

### Slay the Spire (Mega Crit, 2019)

- **F47** [read] PC Gamer: Act 4 unlocked after finishing Act 3 with all three characters; "Players then had to collect three
  keys as they progressed on new runs". S24 (`sts_pcg_ending.txt:505`).
- **F48** [read] Steam, Slay the Spire: ~~first boss (Guardian) 84.9%~~ *(second reader: "Defeated the Guardian" 84.9% is one
  of three boss achievements at that tier, beside "Defeated Hexaghost" 81.5% and "Defeated the Slime Boss" 78.1%; it is
  not the share who beat a first boss. Steam gameid=646570, API names GUARDIAN, GHOST_GUARDIAN, SLIME_BOSS. That these
  three are the Act 1 bosses is [summary: from memory, unverified].)*; beat Act 3 with the Ironclad 56.0%; the Ending (Act 4)
  with the Ironclad 17.2%; the Ending with all three 13.1%. S9 (`steam_join_646570.tsv`).

### Rogue Legacy 2 (Cellar Door, 2022)

- **F49** [read] The true ending "occurs after beating the game with every Prime Boss burden enabled in the same thread
  (requires NG+7)". Fan wiki. S25, Achievements (`rl2wiki_Achievements.txt:244`). *(second reader: the same wiki's New Game
  Plus page qualifies it: all Prime Boss Burdens on a Thread "that is at least NG+3. However, the final Prime Boss Burden
  unlocks at NG+7 under normal conditions, e.g. not using the House Rules skip function." House Rules can also cut the
  burden requirement "by 50%". NG+7 is the default, not a fixed gate.
  https://rogue-legacy-2.fandom.com/api.php?action=parse&page=New_Game_Plus&prop=wikitext, opening list and General Info.)*
- **F50** [read] Steam, Rogue Legacy 2: first boss 56.6%; final boss 20.3%; enter Topside 20.3%; true-ending title drop 1.6%.
  S9 (`steam_join_1253920.tsv`).

### Vampire Survivors (poncle, 2022)

- **F51** [read] The Reaper "spawns once every minute after the time limit of a [[stage]] has been reached" and deals 65,535
  damage, ending the run. Fan wiki. S28 (`vswiki_reaper.txt:16`, `:19`).

### The mechanism under the priority system

- **F52** [read] Emily Short's storylet: a piece of content, "prerequisites that determine when the content can play", and
  effects on world state after it plays. S29, "Storylets: You Want Them" (`es_storylets.txt:17-20`).
- **F53** [read] Short's "salience-based" structure picks "a bit of content out of a large pool depending on which content
  element is judged to be most applicable at the moment"; her example is Elan Ruskin's Left 4 Dead dialogue system.
  S29, "Beyond Branching" (`es_beyond_branching.txt:53`, `:60`).

### What fails

- **F54** [inferred] Starved by a stuck clue rather than by losing: Outer Wilds' Ash Twin mystery (F37), and Inscryption's
  too-hard puzzles that sent players back to grind the loop (F28).
- **F55** [inferred] Starved by losing, named by a maker: Kasavin's "difficulty wall" (F9). Supergiant's answers were story
  that moves on death (F7, F8) and God Mode (F10).
- **F56** [read] Short notes storylets unlocked "by repetitive grinds where they have to be played over and over again until
  the player gains enough skill to pass", common in early Fallen London, which "has largely moved on from that". S29 (`:37`).
- **F57** [read] Exhausted before skill arrives, named by a maker: Galante, "I felt like playing 30 hours of story mode was
  actually the tutorial for the game"; the game ended just as he began enjoying its skills. S27 (`vs_gr_tutorial.txt:390-393`).
- **F58** [inferred] From F20, F25, F31, F46, F48 and F50, the share of Steam players reaching the late story gate divided by
  the share reaching the first major gate: Hades credits/first clear 23.3/46.7 = 0.50; Inscryption finale/Leshy
  40.9/70.0 = 0.58; Slay the Spire Ironclad Ending/Ironclad Act 3 17.2/56.0 = 0.31; Returnal Act 3/Act 1 6.4/37.3 = 0.17;
  ~~Darkest Dungeon complete/first boss 4.6/53.4 = 0.09~~ *(second reader: Radiant completion alone is 6.8%, F46 note, so
  the Darkest Dungeon ratio is at least 6.8/53.4 = 0.13; the any-mode share is not in Steam's data)*; Rogue Legacy 2 true
  ending/final boss 1.6/20.3 = 0.08.
- **F59** [inferred] In F58, the two games whose late story keeps moving on loss or on non-skill actions keep the most players:
  Hades (dialogue every run, an epilogue gated by affinity, F12) and Inscryption (the roguelike part ends after one act,
  F31). The games whose late story waits behind added skill or long grinds keep the fewest: NG+7 (F49), an 80-hour
  campaign (F39), Returnal's Act 3. Confounds are large: genre, length, audience and how each studio placed achievements.
  Treat it as a pattern to test, not a law. *(second reader: two of the three "fewest" cases had a softer route the
  pattern leaves out. Rogue Legacy 2's House Rules can skip the NG+7 default (F49 note). Darkest Dungeon's Radiant mode
  has more Steam completions, 6.8%, than its plain "Complete the game", 4.6% (F46 note). The ordering in F58 still
  roughly holds, 0.13 against Returnal's 0.17.)*
- **F60** [inferred] Makers who saw starvation added a softer path rather than cutting story: Radiant (F40) and Suspend Cycle
  (F23) after launch, and God Mode (F10; when it was added I did not verify). *(second reader: add Rogue Legacy 2's House
  Rules, "Introduced: House Rules" in early-access version 0.6, released 2021-09-28, before the 1.0 launch of
  2022-04-28. Source: https://rogue-legacy-2.fandom.com/api.php?action=parse&page=Update_History&prop=wikitext, sections
  "0.6 - Dragon's Vow" and "1.0.0 - Official Launch". Fan wiki. Steam lists "No Harm in Looking", "Enable House Rules
  once", at 22.3%; gameid=1253920.)*

## 3. What it offers the game

All [ours]. Options with evidence, not decisions. The pacing arithmetic in O4 uses assumptions that are named.

- **O1** [ours] (F1, F7, F9, F55) **A beat after every run, won or lost.** In Hades the story moves on death. The game could
  guarantee one new waking-room line after any run (the mother's note, the photo, the PC), with the cheque only after a
  win (`meta_loop-6`, brief `:1323`). Bears on `meta_loop-3` "Lose all but crumbs" (brief `:1242`) and `story_lore-6`
  "Wins plus story beats seen" (brief `:1464`): a loss would still add to beats seen.
- **O2** [ours] (F4, F5, F17, F52, F53) **Two pools in the lap 1 beats table** (`buildpath_story_lore:64-66`): one-off beats
  with a `priority` that never repeat, and repeatable barks shuffled without repeat until the pool is spent (Hades' quip
  rule, F17). A test could assert that no bark repeats before its pool is exhausted. Kasavin's 20 to 30 runs before a
  repeat (F5) is one target to register in advance.
- **O3** [ours] (F14, F18) **Eligible is not due.** Hades left some beats waiting on random selection (F14), and listed the
  system that prioritises story events as a thing to improve (F18). The lap 1 rule "the next run shows the next beat"
  (`buildpath_story_lore:64`) already avoids that; keeping it a pure function of (seed, profile) keeps it testable.
- **O4** [ours] (F11, F19, F27, F30, F32, F39, F40) **A pacing budget per hour.** Inputs: runs of up to 10 min (`run_frame-2`,
  brief `:1365`, with brutal the only difficulty, `frontdoor_onboarding-2`, `:1469`); D667's chapter gate of N wins
  (`p-d667:70`); five chapters (`p-d667:74-80`). The win rate w is unknown until he plays. Upper bounds, if every run
  lasts 10 min:

  | N wins per chapter | w | runs per chapter | hours per chapter | five chapters |
  |---|---|---|---|---|
  | 3 | 0.5 | 6 | ≤ 1.0 | ≤ 5 h |
  | 5 | 0.2 | 25 | ≤ 4.2 | ≤ 21 h |
  | 5 | 0.1 | 50 | ≤ 8.3 | ≤ 42 h |
  | 10 | 0.1 | 100 | ≤ 16.7 | ≤ 83 h |

  Reference points: Inscryption 12.8 h to 14 h (F27, F30); Hades 23.6 h and 10 clears to the credits (F11, F19); Darkest
  Dungeon 80 h, cut to 40 h (F39, F40); Outer Wilds' loop is 22 min (F32). At one guaranteed beat per run (O1), ~~beats
  per hour is at most 6~~ *(second reader [inferred]: the bound runs the other way. Runs last up to 10 min, so an hour of
  run time holds at least 6 runs, more when losses end runs early, so at least 6 beats. Time in the waking room between
  runs lowers that per hour of wall-clock play. Also, N/w is the expected run count; a given player can need more runs,
  so the "≤" bounds hold for the average player only.)*.
- **O5** [ours] (F21, F33, F38) **Ways to measure "understanding"** (`story_lore-6`; call 6 at `buildpath_story_lore:53`):
  (a) the count of one-off beats seen (Hades-like); (b) a ledger whose entries deepen with each encounter of a kind
  (Returnal's Databank, F21), which fits his note on `story_lore-7` that the kid names the entities "after a certain
  chapter" (brief `:1466-1468`); (c) a log of what the kid knows, shown to the player (Outer Wilds' ship log, F33), with
  the risk that few finish it (3.8%, F38).
- **O6** [ours] (F7, F42, F43) **The catch as a beat.** Darkest Dungeon's narrator "knowingly nods" at failure~~, and Red Hook
  counts that as story (F42)~~ *(second reader: stands on struck F42; the source does not say Red Hook counts the nod as
  story. The rest of O6 stands on F7 and F43.)*. His catch cinematic after every loss (`run_frame-6`, brief `:1368`) and the separate reveal
  (`run_frame-7`, `:1370`) could draw small variations from the beats-seen count, so a loss also moves the "It" thread
  (`story_lore-5`). The loudest variant could be held back, as Red Hook did (F43).
- **O7** [ours] (F44, F45, F49, F50) **Rare drops for optional lore only.** Darkest Dungeon's 1/2000 journal pages carry side
  lore; its boss cutscenes carry the spine (F44, F45). The rare encounters of item 26 and the deep lore of item 174 could
  follow the same split: rare finds deepen, and the spine never waits on a rare roll.
- **O8** [ours] (F34, F35, F36) **Lore that looks like a puzzle.** Outer Wilds cut working lighthouses because players thought
  they were puzzles. Designed pieces in seeds (item 26) could be checked in play: does a player try to solve it? If yes,
  either it does something or it changes. Hooks placed before the player knows the place fail (F34).
- **O9** [ours] (F6, F13, F29, F57) **After the ending.** Endless mode opens after any ending (`p-d667:174`; item 28). Options:
  (a) reserve a share of deep-lore beats for endless and post-ending runs (Hades kept minor events after the epilogue,
  F13, and promised more to skilled players, F6); (b) accept a story-free endless, as Vampire Survivors does, and say so;
  (c) weigh ~~Mullins' warning (F29) that endless can undercut an ending's finality~~ *(second reader: a reading, not a
  warning. In Famitsu's Japanese the clause "ある意味それは部分的に損なうことになったかもしれない" has no stated object, so what
  undercut what is unclear; one [inferred] reading is that the endless mode sits against an ending-shaped game.
  https://www.famitsu.com/news/202204/05256459.html, the answer to the Kaycee's Mod question.)*.
- **O10** [ours] (F20, F22, F24, F25, F58) **Measure reach, not only content.** Register before playtests what share of beats
  a player should have seen after 1, 3 and 10 hours, and the run count at each chapter gate. Korhonen could only judge
  pacing once it was in the game (F22). The Steam funnels in F58 are the outside numbers to compare against.

## 4. Where it contradicts or strains something the room holds

*(second reader: the five bullets below carried no mark; each is the first reader's reading of room files against the
findings, so each now carries [inferred].)*

- [inferred] **Chapters gate on wins only.** `handback/p-d667-story-E_2026-11-11.md:70` opens each chapter's folder "after N successful
  runs" and a room event. With `meta_loop-3` "Lose all but crumbs" (brief `:1242`) and one brutal difficulty (`:1469`),
  a player who loses most runs gets no chapter progress. That is the wall Kasavin named (F9, F55). His pick
  `story_lore-6` counts beats seen too (`:1464`), which softens it only if beats arrive on losses (O1).
- [inferred] **The ending waits on a rare state.** `p-d667:299-300` picks the ending by "how often he reached Recognition";
  `loop/buildpath_stress_2026-11-13.md:45` puts Recognition at 0.25% to 0.5% per full-stress event *(second reader: that
  file marks the figure "[inferred] from 60"; it is not the author's number)*, about 200 to 400
  events on average, against a story gate of 3. His `stress-4` pick raises the odds "but not by a lot" (brief `:1405`;
  the note is at `:1407`).
  The closest outside cases are Rogue Legacy 2's NG+7 true ending, reached by 1.6% of Steam players (F49, F50)
  *(second reader: NG+7 is the default; House Rules can skip it, F49 note)*, and
  ~~Darkest Dungeon's completion, 4.6% (F46)~~ *(second reader: Darkest Dungeon's completion is at least 6.8%, the Radiant
  completion figure; plain "Complete the game" is 4.6%, F46 note)*.
- [inferred] **No softer path.** `frontdoor_onboarding-2` makes brutal the only difficulty (brief `:1469`; his note is at
  `:1470`). ~~Three of the eight studios gave players a softer route to the story (F10, F23, F40), two of them after
  launch.~~ *(second reader: four of the eight. Add Rogue Legacy 2's House Rules, introduced in early access before 1.0
  and able to skip the true ending's NG+7 default (F49 and F60 notes). Two of the four came after launch: Radiant and
  Suspend Cycle. On Steam, more Darkest Dungeon players completed Radiant, 6.8%, than earned plain "Complete the game",
  4.6% (F46 note).)* The call is his; the evidence is that makers moved.
- [inferred] **Rare encounters against a beat per run.** `p-d667:88` says lore drops come from rare encounters; the lap 1
  path says "the next run shows the next beat" (`loop/buildpath_story_lore_2026-11-13.md:64`). Both can stand if rare finds carry side
  lore and the spine comes every run (O7); as written they describe different pacing.
- [inferred] **Section 3's gap is partly filled.** `buildpath_story_lore:42` lists "beat pacing per hour of play" as
  unresearched. This file gives makers' numbers (F5, F11, F19, F27, F32, F39, F40) and a budget form (O4), but no shipped game I read states
  beats per hour as such.

## 5. Could not obtain

- The Rock Paper Shotgun interview with Kasavin (2020) that S1 reports; the search tool refused the domain. F2 and F3 rest on
  Game Developer's paraphrase only.
- GameSpot's "Hades writer explains script philosophy" and "Hades changes what it means to be a roguelike": Cloudflare
  challenge, then 403.
- Kasavin's X post linking the People Make Games video on Hades' conversation system, and the video itself; no transcript.
- The GDC 2021 Hades talk and the GDC 2022 Inscryption talk recordings; only abstracts and Famitsu's reports were read.
- Kelsey Beachum's GDC 2021 talk recording; only S18's write-up.
- The Unreal Engine developer interview on Returnal (403), and VGC's full Korhonen interview (only its news excerpt, S12).
- Hades and Darkest Dungeon fandom HTML pages (Cloudflare); the MediaWiki API was used instead.
- HowLongToBeat figures for Returnal, Outer Wilds, Darkest Dungeon, Slay the Spire, Rogue Legacy 2 and Vampire Survivors
  (page IDs not found).
- Any maker's statement of beats or lines per run for any of the eight games. None was found.

## 6. Not verified

- Steam's API does not state its denominator (all owners, or players who launched the game). The percentages in F20, F25,
  F31, F38, F46, F48 and F50 compare well within a game and only roughly across games.
- HowLongToBeat's "main story" is what submitters call the main story; for Hades it may mean the first clear or the credits.
- The 21,000 and 22,000-plus line counts (F15, F16) were not reconciled. A search summary attributes 21,020 lines and
  305,433 words to a Supergiant infographic; I did not open it.
- Famitsu's reports (F15, F17, F18, F28, F29) are a journalist's Japanese rendering of English talks, translated back by me.
- Fan wikis (S7, S23, S25, S28) were not checked against the games' files.
- Push Square's trophy figures (F24) are second-hand; the trophy site was not opened.
- F54, F55, F58, F59 and F60 are my arithmetic and reading; no source makes those comparisons.
- Nothing built or run; no game file was read.

## Second reader, 2026-11-13

Second reader (Opus 5.5), same swarm. Every source below was fetched again into my own scratch folder
(`C:/Users/zackn/AppData/Local/Temp/claude/690931be4a082db1/3d000000-0000-4000-8000-000000003d00/scratchpad/swarm/
beats_per_run_second/`), converted to text and searched; the first reader's downloads were used only to recover URLs.
Steam percentages were re-fetched 2026-11-13 and matched the first reader's for every figure cited.

**URLs the first reader's [read] marks rest on** (section 1 gave scratch file names, not URLs; rule 3 slip, fixed here):

- S1 https://www.gamedeveloper.com/design/how-supergiant-weaves-narrative-rewards-into-i-hades-i-cycle-of-perpetual-death
  (dated February 13, 2020)
- S2 https://www.gamedeveloper.com/design/roguelikes-and-narrative-design-with-i-hades-i-creative-director-greg-kasavin
  (dated January 28, 2021)
- S3 https://geekdad.com/2019/10/narrative-and-early-access-supergiants-greg-kasavin-discusses-hades-development/
- S4 https://www.vice.com/en/article/how-hades-made-a-genre-known-for-being-impossibly-hard-accessible/ (October 5, 2020)
- S5 https://www.famitsu.com/news/202107/25228163.html · S6 https://www.gdcvault.com/play/1026975/Breathing-Life-into-Greek-Myth
- S7 https://hades.fandom.com/api.php?action=parse&prop=wikitext&format=json&page= God_Mode, Achievements, Epilogue_Guide
- S8 https://howlongtobeat.com/game/62941 and /game/91622 (embedded JSON fields comp_main, comp_plus, comp_100)
- S9 https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=APPID&format=json,
  names from https://steamcommunity.com/stats/APPID/achievements/?l=english (embedded JSON: api_name, name, description);
  APPIDs 1145360 Hades, 1649240 Returnal, 1092790 Inscryption, 753640 Outer Wilds, 262060 Darkest Dungeon,
  646570 Slay the Spire, 1253920 Rogue Legacy 2
- S10 https://gamingtrend.com/interviews/back-to-atropos-an-interview-with-returnal-narrative-director-gregory-louden-of-housemarque/
- S11 https://housemarque.com/news/2021/10/12/interview-with-eevi-korhonen
- S12 https://www.videogameschronicle.com/news/housemarque-says-creating-returnals-mystery-was-a-tightrope-walk/
- S13 https://www.pushsquare.com/news/2021/12/not-everyone-had-the-fortitude-to-finish-returnal-on-ps5
- S14 https://www.gamedeveloper.com/design/how-game-jam-sacrifices-became-inscryption (March 14, 2022)
- S15 https://gdcvault.com/play/1027609/Independent-Games-Summit-Sacrifices-Were · S16 https://www.famitsu.com/news/202204/05256459.html
- S17 https://www.gamedeveloper.com/design/live-die-repeat-how-i-outer-wilds-i-piques-curiosity-in-an-ambivalent-solar-system
- S19 https://mcvuk.com/business-news/we-didnt-think-it-would-have-tremendously-broad-appeal-mobius-digital-on-the-multi-bafta-award-winning-outer-wilds/
- S21 https://www.pcgamer.com/darkest-dungeons-new-radiant-mode-promises-shorter-more-accessible-campaigns/ (20 December 2016)
- S22 https://www.gamedeveloper.com/business/-i-darkest-dungeon-i-designing-for-despair-and-kicking-you-when-you-re-down
- S23 https://darkestdungeon.wiki.gg/api.php?action=parse&prop=wikitext&format=json&page= Game_Modes, Ancestor's_Journal,
  Ancestor's_Memoirs
- S24 https://www.pcgamer.com/games/card-games/slay-the-spire-2-ending/ (2 April 2026)
- S25 https://rogue-legacy-2.fandom.com/api.php?action=parse&prop=wikitext&format=json&page=Achievements
- S27 https://www.gamesradar.com/games/roguelike/i-felt-like-playing-30-hours-of-story-mode-was-actually-the-tutorial-too-many-rpgs-and-jrpgs-end-after-their-combat-really-gets-good-vampire-survivors-creator-says-which-is-where-the-roguelike-formula-is-so-great/
- S28 https://vampire.survivors.wiki/api.php?action=parse&prop=wikitext&format=json&page=The_Reaper
- S29 https://emshort.blog/2019/11/29/storylets-you-want-them/ and
  https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/
- New, second reader: https://rogue-legacy-2.fandom.com/api.php?action=parse&prop=wikitext&format=json&page= New_Game_Plus,
  Update_History (fan wiki)

**Verdicts** (OK = the words or number found; WRONG = the source says otherwise; UNSUPPORTED = the source does not say it;
DOWNGRADE = mark too strong):

| claim | verdict | evidence |
|---|---|---|
| F1 | OK | S1: "It was an explicit goal of our early development, to take the pain out of dying and having to restart" |
| F2 | OK | S1: "feeds one of several possible pre-written events to players based on that situation" |
| F3 | WRONG (aside) | quote found in S1; but "the only priority or weighting statement" is contradicted by this file's F18 |
| F4 | OK | S3: "these bigger story moments that never repeat, and a lot of content that is designed to be repeatable" |
| F5 | OK | S3: "looped through the game like 20 or 30 times, so hours and hours of play before a small line will repeat" |
| F6 | OK | S3: "if you’re super skilled and stuff like that, there’s going to be plenty more stuff that you could see" |
| F7 | OK | S4: "could we make the moment of death something players almost look forward to, rather than dread?" |
| F8 | OK | S4, after the god mode paragraph: "preserved the idea that dying is a central part of the game and story" |
| F9 | OK | S2: "you just hit a difficulty wall"; "we try to build systems into our games that mitigate those kinds of moments" |
| F10 | OK | S7 God Mode: "'''20%''' damage resistance, increasing by '''2%''' each time a run ends in death"; "caps at '''80%'''" |
| F11 | OK | S7 Achievements: "Clear 10 runs total to complete the story and see the credits." |
| F12 | UNSUPPORTED (part) | S7 Epilogue Guide never mentions clears; it adds Part II (invite each Olympian) and "Six of the following are required" |
| F13 | OK | S7: "minor events continue to occur for a period of time afterwards" |
| F14 | OK | S7: "you may experience delays in receiving a specific piece of dialogue even if you have met the requirements" |
| F15 | OK | S5: "30人のキャラクターの文章は合計して21000、単語に換算すると30万5433ワード" |
| F16 | OK | S6: "more than 22,000 lines of dialogue" |
| F17 | OK | S5: "すべての台詞を言い尽くすまでランダムに再生され、同じ台詞が続かず" |
| F18 | OK | S5, under "改善すべき点": "ファイル編成、ストーリー・イベントを優先したシステムの改善"; the list sits in the voice-recording part |
| F19 | OK | S8 Hades: comp_main 84888, comp_main_count 2829, comp_plus 175350, comp_100 343086 (seconds) |
| F20 | OK | S9: AchClearTartarus 81.8, AchClearAnyRun 46.7, AchReachedEnding 23.3, AchForgedBond 26.2, AchReachedEpilogue 8.4 |
| F21 | OK | S11: "the Databank entries would uncover more information the more times you killed an enemy or picked up an item" |
| F22 | OK | S12, Korhonen: "up until the last moment, we’re still cutting, we’re still editing" |
| F23 | OK | S10, Louden: "we wanted to deliver them with Returnal 2.0, “Photo Mode” and “Suspend Cycle”" |
| F24 | OK | S13: "only 58 per cent of players saw off the first boss"; "just 10 per cent of players managed to see off Act 3" |
| F25 | OK | S9: FirstDeath 93.6, FindLogs 65.5, FinishHouse 68.4, FirstBoss 61.6, Act1/2/3 37.3/24.5/6.4, SecretEnding 2.4 |
| F26 | OK | S14: "there is an overarching system that makes each run feel like another step toward a larger goal" |
| F27 | OK | S15: "a 10 minute game jam entry grew, after several twists and turns, into a sprawling 14 hour experience" |
| F28 | OK | S16: "パズルが何らかの理由で難しすぎると、プレイヤーはメインのローグライクループに入って飽きるまでくり返します" |
| F29 | OK (words) | S16 answer found; its last clause has no stated object, see O9 |
| F30 | OK | S8 Inscryption: comp_main 46183, count 1266, comp_plus 56402, comp_100 114976 (seconds) |
| F31 | OK | S9: STORY_PROGRESS_1 "Complete your first Deathcard." 93.4; PART1_LESHY 70.0; PART2 51.8 to 55.0; STORY_PROGRESS_9 40.9 |
| F32 | OK | S17: "after 22 minutes a supernova destroys your solar system" |
| F33 | OK | S17: "really focuses on knowledge being the only real thing of value in this world" |
| F34 | WRONG | S17: "That [object from space] is not new to them to them [when] everything is new"; the file had it inverted |
| F35 to F37 | OK | S19: "players thought there was a puzzle there when there wasn’t"; "All we could do is try to improve the clues" |
| F38 | OK | S9: STUDIOUS "Complete the ship log." 3.8; BEGINNERS_LUCK 2.8; of the 31, 14 belong to the Echoes of the Eye DLC |
| F39, F40 | OK | S21: "Normal campaigns can run 80 hours or more"; "bringing the completion time down to approximately 40 hours" |
| F41 | OK | S23 Game Modes: "Town Events trigger more frequently to compensate for shorter playtime." |
| F42 | WRONG | S22: the sentence ends "that we’re going to expose when we launch"; cut short it read as "the nod is story" |
| F43 | OK | S22, Bourassa: "He chimes in randomly most of the time"; "We wanted to hold that back" |
| F44, F45 | OK | S23: "base probability of finding one is is 1/2000"; "you never get duplicates"; Memoirs replay after the boss falls |
| F46 | OK (numbers) | S9: first_boss 53.4, ten_victories 50.4, week_52 20.8, game_complete 4.6; but game_complete_radiant is 6.8 |
| F47 | OK | S24: "Players then had to collect three keys as they progressed on new runs" |
| F48 | WRONG (label) | S9: GUARDIAN "Defeated the Guardian." 84.9 is one boss of three (GHOST_GUARDIAN 81.5, SLIME_BOSS 78.1) |
| F49 | OK, qualified | S25 line found; New_Game_Plus page: NG+7 "under normal conditions, e.g. not using the House Rules skip function" |
| F50 | OK | S9: BossCastleDefeated 56.6, BossFinalDefeated 20.3, PrequelReveal 20.3, TitleDrop "See the title drop." 1.6 |
| F51 | OK | S28: "spawns once every minute after the time limit"; "deal 65,535 damage to them, ending the run" |
| F52, F53, F56 | OK | S29: "there are prerequisites that determine when the content can play"; "most applicable at the moment"; "Elan Ruskin’s dialogue system for Left4Dead"; "has largely moved on from that" |
| F57 | OK | S27: "I felt like playing 30 hours of story mode was actually the tutorial for the game." |
| F58, Darkest Dungeon row | WRONG | 4.6% excludes Radiant completions (6.8%); the ratio is at least 0.13. The other five ratios recompute correctly |
| O4, "at most 6" beats per hour | WRONG | [inferred]: runs of up to 10 min give at least 6 runs per hour of run time |
| O6 | follows F42 | marked as standing on struck F42 |
| O9 (c) | DOWNGRADE | "Mullins' warning" is one reading of an ambiguous Japanese clause; now marked [inferred] |
| §4, "Three of the eight studios" | WRONG | four: Rogue Legacy 2 House Rules, "Introduced: House Rules" in v0.6 (2021-09-28), 1.0 on 2022-04-28 |
| §4, "Darkest Dungeon's completion, 4.6%" | WRONG | at least 6.8%, see F46 |
| §4, Recognition 0.25% to 0.5% | DOWNGRADE | `buildpath_stress_2026-11-13.md:45` says "His odds are 0.25 to 0.5% per full-stress event ([inferred] from 60)" |
| room-file citations | OK | brief `:1242`, `:1323`, `:1365` (note `:1367`: "10 mins for brutal"), `:1368`, `:1370`, `:1405` (note `:1407`), `:1464`, `:1466-1468`, `:1469` (note `:1470`: "only one difficulty, changed my mind, and its brutal"); items 26, 28 ("it can unlock endless mode"), 174; `p-d667:70`, `:74-80`, `:88`, `:174`, `:299-300`; `buildpath_story_lore:42`, `:53`, `:64` ("The next run shows the next beat") |

**Rule slips fixed:** the five section 4 bullets carried no mark (now [inferred]); no URLs were given for any [read]
claim (listed above). F42's cut quotation is counted above as WRONG, not as a slip. No quotation over 40 words was found.
No allegation about a real person or organisation was found. No inference about the author's life was found. No
decision was made for the author.

**Not re-checked:** F23's GamingTrend date; S18, S20 and S26 (no finding kept); F59's genre confounds; when God Mode was
added (its wiki citation is a tweet whose ID decodes to 2020-09-25 UTC, which only dates the tweet).

**Trust:** the quoted words and the Steam and HowLongToBeat numbers hold up almost without exception. Treat the
cross-game reading (F58, F59, §4's "no softer path" and "rare state") with care: it missed Rogue Legacy 2's House Rules
and used a Darkest Dungeon completion figure lower than the Radiant one. F34 and F42 had their sources' sense bent.
