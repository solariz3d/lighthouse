# Score R01, scorer 1: claim of fact typed from memory, not copied from an instrument run

Scorer 1 (Sonnet research agent), 2026-11-13. I did not propose R01. Read-only except this file.

Root as scored [read: 00_roots.md:9-14]: a figure, clock time, sha, count, line citation or "no X exists" enters a
ring, hand-back or note from the writer's head, a summary or a cut read, with no command in the same call that
printed it, and later seats treat it as measured.

## How I scored

- [read] Rows scored: 1116 of 1,123 in 00_ledger.md. Skipped as REMOVE: L0029 L0162 L0255 L0299 L0300 L0390 L0409.
- YES: the row is a typed, guessed, hand-counted, relayed or cut-read statement of fact that one instrument run in the
  same call (a count, a clock read, a cat-file, a grep, opening the file) would have shown wrong or caught at once.
- PARTLY: the typed claim is one part of the row, or the instrument was run but narrow or misread, so a fix helps but
  does not end the incident. Also PARTLY for rows that are the room measuring the root itself (L0017, L0386, L1123).
- NO: no typed claim sits at the centre. Delivery and queue faults, installed-copy drift, weak tests, timing flakes,
  build errors, design errors, keeper design asks, and seat conduct (hedging, caution, scope) are NO.
- Same-event twins (L0199 and L0209; L0775 and L0779; L0200 and L0208; L0990, L1106, L1107) are scored in each row.
- [inferred] Every verdict rests on the ledger row's wording. I opened no primary (see the last section).
- Verdicts are on events, not on any seat.

## Totals

- YES: 154
- PARTLY: 131
- NO: 831
- Rows scored: 1116 [read: counted by node over my table]

## Cost covered (YES rows only)

Stated minutes and tokens in the cost field of YES rows [read: 00_ledger.md, cost field of each YES row, node listing]:

| row | stated cost | minutes |
|---|---|---|
| L0295 | second reader: "a live seat that was never dispatched sat invisible on L for an hour" | 60 |
| L0585 | one encode redone; caught 43 min later | 43 |
| L0587 | plan part built on a false premise; fixed 3 min later | 3 |
| L1036 | P voids and re-runs what ran 18:09:02Z to 18:09:31Z (29 s) | 0.5 |

- Minutes covered: about 106.5 (60 + 43 + 3 + 0.5). Tokens covered: 0 stated.
- YES rows with no minutes or tokens recorded: 150 of 154.
- Not counted, and why: L0049 (a 642k vs 521k token figure is the size of the wrong claim, not a cost); L1075 (four
  minutes is the time to supply prior art, not a loss); L0719 and L0728 ("minutes", "minutes not recorded", no number).
- [inferred] The covered cost is small because the typed-claim faults are cheap each; most recorded minutes and all
  recorded tokens in the ledger sit in rows this root does not touch (stalls, cold wakes, idle compactions, locks).

## Table

| id | verdict | mechanism (YES and PARTLY) |
|---|---|---|
| L0001 | NO |  |
| L0002 | NO |  |
| L0003 | NO |  |
| L0004 | NO |  |
| L0005 | NO |  |
| L0006 | NO |  |
| L0007 | YES | model identity certified from the inside; reading the log would have shown it |
| L0008 | NO |  |
| L0009 | NO |  |
| L0010 | NO |  |
| L0011 | NO |  |
| L0012 | NO |  |
| L0013 | PARTLY | zero-statements claim from a hand brace-counter and a row count, not the file |
| L0014 | YES | self-attribution taken from a context-summary line, nothing opened |
| L0015 | PARTLY | clock time typed 7:58 against pulse 07:56:42 (scorer fault is separate) |
| L0016 | NO |  |
| L0017 | PARTLY | the instrument counts exactly turns with values and no tool call; a fix lowers the count |
| L0018 | NO |  |
| L0019 | NO |  |
| L0020 | NO |  |
| L0021 | NO |  |
| L0022 | PARTLY | plan named an API hook from memory of its powers; a run showed it cannot inject |
| L0023 | NO |  |
| L0024 | NO |  |
| L0025 | NO |  |
| L0026 | NO |  |
| L0027 | NO |  |
| L0028 | NO |  |
| L0030 | NO |  |
| L0031 | NO |  |
| L0032 | NO |  |
| L0033 | YES | figure direction typed (37% low vs 37.2% above); one calc prints it |
| L0034 | PARTLY | prereg count from a grep missing two filename patterns |
| L0035 | YES | harness fact stated, own tools list would have shown ScheduleWakeup |
| L0036 | YES | "Written to the notes" typed with no check of the last append |
| L0037 | NO |  |
| L0038 | NO |  |
| L0039 | PARTLY | "stated from one stretch" claim; other parts of row are not R01 |
| L0040 | YES | shelf state claimed from memory; a SessionStart log line would show 02:24 |
| L0041 | PARTLY | hook output on laptop read as a system fact for the desktop |
| L0042 | NO |  |
| L0043 | PARTLY | diagnosed off an anchor without looking at what find() matched |
| L0044 | YES | "half-built" typed without opening the sweep |
| L0045 | YES | swap-at-compaction typed; the header shows restart |
| L0046 | NO |  |
| L0047 | YES | unverified claim dispatched by the chair, one wrong ruling downstream |
| L0048 | NO |  |
| L0049 | YES | saving typed as ~642k; re-derivation gave 521k |
| L0050 | NO |  |
| L0051 | NO |  |
| L0052 | NO |  |
| L0053 | YES | journal line cited that does not contain the thing |
| L0054 | YES | ":47" citation mis-attributed |
| L0055 | YES | "never journaled" asserted stale; one grep of commits shows it |
| L0056 | YES | stage and install.ps1:633 cited from memory, both wrong |
| L0057 | PARTLY | map imported a failure from memory for a different one |
| L0058 | NO |  |
| L0059 | YES | a content hash relayed as a commit sha, no cat-file |
| L0060 | PARTLY | a listing read as the instrument produced a false no-change |
| L0061 | PARTLY | hand-read BOOT for "all files" rather than extracting by pattern |
| L0062 | NO |  |
| L0063 | PARTLY | path assumption (OneDrive Desktop) typed unchecked |
| L0064 | PARTLY | five claims published before the run that would test them |
| L0065 | NO |  |
| L0066 | YES | same db8e119 sha-for-hash mislabel, no cat-file |
| L0067 | NO |  |
| L0068 | NO |  |
| L0069 | NO |  |
| L0070 | NO |  |
| L0071 | YES | gate said open twice from timestamps; board count was 0 |
| L0072 | PARTLY | "progressive" stated from memory of the scores |
| L0073 | YES | score summarised that was never given; 3 vs 4 documents |
| L0074 | NO |  |
| L0075 | NO |  |
| L0076 | NO |  |
| L0077 | NO |  |
| L0078 | NO |  |
| L0079 | NO |  |
| L0080 | NO |  |
| L0081 | YES | 14 months typed; BOOT's age is a git-log away |
| L0082 | PARTLY | evidence rate cited without checking who wrote the ledger rows |
| L0083 | YES | "two pushed files" typed; grep gives 61 files |
| L0084 | PARTLY | one grep of one phrasing taken as the universe |
| L0085 | NO |  |
| L0086 | YES | "invisible to scanner" typed without running the scanner |
| L0087 | YES | hand baseline 12 of 19 with no derivation |
| L0088 | YES | "one line turns it green" typed without the run |
| L0089 | NO |  |
| L0090 | NO |  |
| L0091 | PARTLY | "5 of 5 overlap" hand-counted; tool said 4 |
| L0092 | NO |  |
| L0093 | NO |  |
| L0094 | NO |  |
| L0095 | NO |  |
| L0096 | PARTLY | headline wider than the transcripts license |
| L0097 | YES | 0.34 tokens/byte figure from another date typed as the shelf's |
| L0098 | NO |  |
| L0099 | PARTLY | existence of a mechanism reported as the room's behaviour |
| L0100 | PARTLY | spec arithmetic typed (150k cap) and "only main.rs" claim |
| L0101 | NO |  |
| L0102 | NO |  |
| L0103 | PARTLY | keeper's cause endorsed; own record not opened |
| L0104 | NO |  |
| L0105 | PARTLY | estimate of shelf growth counted the wrong set |
| L0106 | NO |  |
| L0107 | YES | "never existed" and "verified here" typed in the same command that ran the check |
| L0108 | NO |  |
| L0109 | YES | relay "VOID n=39" for NOT-RUN n=40 |
| L0110 | YES | "verbatim" quote from the wrong source |
| L0111 | NO |  |
| L0112 | NO |  |
| L0113 | NO |  |
| L0114 | NO |  |
| L0115 | NO |  |
| L0116 | YES | hand count 7 vs 6, 247 vs 246 |
| L0117 | YES | state name listed from a two-word grep |
| L0118 | YES | double-counted figure, "10 of 12" was 8 |
| L0119 | YES | claim from a grep count before reading rows |
| L0120 | PARTLY | DEFECT CONFIRMED stamped on a line that showed the repaired form |
| L0121 | PARTLY | summed three counts where the union was the unit |
| L0122 | NO |  |
| L0123 | NO |  |
| L0124 | NO |  |
| L0125 | NO |  |
| L0126 | YES | hand count 247 vs 246 |
| L0127 | NO |  |
| L0128 | PARTLY | printed pattern was not the command it ran; sum for union |
| L0129 | NO |  |
| L0130 | NO |  |
| L0131 | NO |  |
| L0132 | NO |  |
| L0133 | NO |  |
| L0134 | NO |  |
| L0135 | NO |  |
| L0136 | NO |  |
| L0137 | NO |  |
| L0138 | NO |  |
| L0139 | NO |  |
| L0140 | NO |  |
| L0141 | PARTLY | mechanism typed from tier arithmetic, conclusion right |
| L0142 | NO |  |
| L0143 | NO |  |
| L0144 | PARTLY | two 00:55 claims struck by instrument (12 hits not 5) |
| L0145 | NO |  |
| L0146 | NO |  |
| L0147 | NO |  |
| L0148 | NO |  |
| L0149 | NO |  |
| L0150 | NO |  |
| L0151 | NO |  |
| L0152 | NO |  |
| L0153 | YES | chair called counts an undercount; 72 and 73 were one tree ten minutes apart, no one derived at one commit |
| L0154 | PARTLY | shipped brief and Settings note asserted facts nobody checked against code |
| L0155 | NO |  |
| L0156 | NO |  |
| L0157 | YES | UI line claimed a fallback city the code had not had for 11 days |
| L0158 | NO |  |
| L0159 | PARTLY | packet called a generated artifact a source without checking its header |
| L0160 | YES | map's de-gender count 12/4 vs artifact 18/5 |
| L0161 | NO |  |
| L0163 | NO |  |
| L0164 | NO |  |
| L0165 | NO |  |
| L0166 | PARTLY | proposed gate said it addressed 7 of 9 refusals; re-count gave 2 of 9 |
| L0167 | NO |  |
| L0168 | PARTLY | "closes all four gaps" typed; it closed three; mutation figure quoted over a red suite |
| L0169 | YES | board claim "K mid-edit" typed from inference |
| L0170 | YES | manifest contents typed (two files vs two files and four dirs) |
| L0171 | YES | COMMITTEE.md:133 cited from sealed text without opening |
| L0172 | YES | CLEAN.md status typed, it is a runtime fixture |
| L0173 | YES | packet said red-first on LIB; LIB never failed, a run would show |
| L0174 | YES | "proof 1 passed" typed; it failed; budget 3,100 vs 3,061 |
| L0175 | NO |  |
| L0176 | NO |  |
| L0177 | NO |  |
| L0178 | NO |  |
| L0179 | NO |  |
| L0180 | NO |  |
| L0181 | PARTLY | relayed number stale four minutes after relay |
| L0182 | PARTLY | packet and headline number wrong about which gate and how many |
| L0183 | NO |  |
| L0184 | NO |  |
| L0185 | NO |  |
| L0186 | PARTLY | handoff listed a stated limit as a reach |
| L0187 | NO |  |
| L0188 | NO |  |
| L0189 | NO |  |
| L0190 | YES | score figures typed that do not re-derive (26 not 27, 20% not 25%) |
| L0191 | NO |  |
| L0192 | YES | loop file and lap ids cited by position |
| L0193 | NO |  |
| L0194 | YES | 34-row window read of a 43-row screen; a grep counted, line never opened |
| L0195 | NO |  |
| L0196 | NO |  |
| L0197 | YES | "bare drafts do not yet appear" from output cut at head -30 |
| L0198 | PARTLY | told chair "you are idle" while it was mid-turn |
| L0199 | YES | bare digests asserted as nonexistent without trying the other function |
| L0200 | YES | "46 of 47" typed; tree holds 50 |
| L0201 | NO |  |
| L0202 | NO |  |
| L0203 | PARTLY | "no rows" over output that printed them; "6 of 6" was 9 |
| L0204 | PARTLY | plan named an audit tell as the compaction rule; 2,753 rows would have gone |
| L0205 | NO |  |
| L0206 | YES | "300 MB not refused", "one hash not two", frame "on disk" all typed unchecked |
| L0207 | NO |  |
| L0208 | YES | same 46-of-47 headline joined two facts by an unchecked cause |
| L0209 | YES | same bare-digest case as L0199, a seat's turn each |
| L0210 | NO |  |
| L0211 | NO |  |
| L0212 | YES | universal negative "no consumer anywhere" grepped over Rust only |
| L0213 | NO |  |
| L0214 | YES | heading time typed 30 min ahead of the clock |
| L0215 | NO |  |
| L0216 | NO |  |
| L0217 | NO |  |
| L0218 | NO |  |
| L0219 | PARTLY | laptop plan stated "USB not git", "loopback not LAN" unchecked |
| L0220 | NO |  |
| L0221 | NO |  |
| L0222 | NO |  |
| L0223 | PARTLY | attic address copied from a listing; "source not found by reading" |
| L0224 | NO |  |
| L0225 | YES | told keeper twice a running harness was A's pass; it was the chair's |
| L0226 | PARTLY | 428,177 figure was the seat's own first turns, not the shelf |
| L0227 | NO |  |
| L0228 | NO |  |
| L0229 | PARTLY | first-carry size copied into a packet, 18 KB off |
| L0230 | NO |  |
| L0231 | NO |  |
| L0232 | NO |  |
| L0233 | NO |  |
| L0234 | NO |  |
| L0235 | NO |  |
| L0236 | NO |  |
| L0237 | NO |  |
| L0238 | NO |  |
| L0239 | NO |  |
| L0240 | NO |  |
| L0241 | NO |  |
| L0242 | NO |  |
| L0243 | NO |  |
| L0244 | NO |  |
| L0245 | NO |  |
| L0246 | NO |  |
| L0247 | PARTLY | lap id derived from a report tail and stamped on filed laps |
| L0248 | NO |  |
| L0249 | NO |  |
| L0250 | YES | "shell fills the window" typed; the shell is about 4%, a byte count shows it |
| L0251 | PARTLY | R-2 sentence repeated a ruling that was wrong |
| L0252 | NO |  |
| L0253 | NO |  |
| L0254 | NO |  |
| L0256 | NO |  |
| L0257 | NO |  |
| L0258 | NO |  |
| L0259 | NO |  |
| L0260 | PARTLY | SPINE says "BUILT, running" for a thing later ruled decorative |
| L0261 | NO |  |
| L0262 | YES | collated a hand-back C had not handed back; 40 lines unread |
| L0263 | NO |  |
| L0264 | PARTLY | bars called verified, run under a flag that hides the race |
| L0265 | NO |  |
| L0266 | YES | line registered on the word "bait" without opening the brief |
| L0267 | NO |  |
| L0268 | PARTLY | status table "unbuilt" cited after closure 08-31 |
| L0269 | NO |  |
| L0270 | NO |  |
| L0271 | NO |  |
| L0272 | NO |  |
| L0273 | YES | told keeper Leave touches the state repo; it never does, one read of code shows |
| L0274 | PARTLY | "pipe-read defect" and intake-cap guesses contradicted by panes |
| L0275 | NO |  |
| L0276 | NO |  |
| L0277 | NO |  |
| L0278 | NO |  |
| L0279 | NO |  |
| L0280 | NO |  |
| L0281 | NO |  |
| L0282 | PARTLY | told the keeper a helper had likely finished; it had run a second pass |
| L0283 | NO |  |
| L0284 | NO |  |
| L0285 | NO |  |
| L0286 | NO |  |
| L0287 | NO |  |
| L0288 | NO |  |
| L0289 | NO |  |
| L0290 | NO |  |
| L0291 | NO |  |
| L0292 | NO |  |
| L0293 | NO |  |
| L0294 | NO |  |
| L0295 | YES | trace says a rule was "already written"; neither briefs nor memory hold it |
| L0296 | NO |  |
| L0297 | NO |  |
| L0298 | NO |  |
| L0301 | YES | "delivered ~20:15, received 3h17m later" from an unchecked reconstruction; A and C dispatched |
| L0302 | NO |  |
| L0303 | NO |  |
| L0304 | NO |  |
| L0305 | NO |  |
| L0306 | NO |  |
| L0307 | YES | "3 h delivery stall" blamed on the door path with a hand-made "20:1x" time; the call timestamps show 0.22 s |
| L0308 | NO |  |
| L0309 | NO |  |
| L0310 | NO |  |
| L0311 | NO |  |
| L0312 | PARTLY | librarian claims "one-pane dispatch" and "named" typed in a plan |
| L0313 | NO |  |
| L0314 | NO |  |
| L0315 | NO |  |
| L0316 | NO |  |
| L0317 | NO |  |
| L0318 | PARTLY | CHANGELOG claimed a diff landed that never did |
| L0319 | NO |  |
| L0320 | NO |  |
| L0321 | NO |  |
| L0322 | NO |  |
| L0323 | NO |  |
| L0324 | NO |  |
| L0325 | NO |  |
| L0326 | NO |  |
| L0327 | NO |  |
| L0328 | NO |  |
| L0329 | NO |  |
| L0330 | NO |  |
| L0331 | NO |  |
| L0332 | NO |  |
| L0333 | NO |  |
| L0334 | NO |  |
| L0335 | NO |  |
| L0336 | NO |  |
| L0337 | NO |  |
| L0338 | NO |  |
| L0339 | NO |  |
| L0340 | NO |  |
| L0341 | NO |  |
| L0342 | NO |  |
| L0343 | NO |  |
| L0344 | PARTLY | "warm worker" claim about the other worker unchecked |
| L0345 | NO |  |
| L0346 | NO |  |
| L0347 | NO |  |
| L0348 | PARTLY | "one-off flake" typed; the crash code shows a native fault |
| L0349 | NO |  |
| L0350 | PARTLY | brief called a public track a friend's private project, unchecked |
| L0351 | YES | "p >= 0.20 on all four" written one line above p = 0.195 |
| L0352 | NO |  |
| L0353 | NO |  |
| L0354 | NO |  |
| L0355 | NO |  |
| L0356 | NO |  |
| L0357 | NO |  |
| L0358 | NO |  |
| L0359 | NO |  |
| L0360 | NO |  |
| L0361 | NO |  |
| L0362 | NO |  |
| L0363 | NO |  |
| L0364 | NO |  |
| L0365 | NO |  |
| L0366 | NO |  |
| L0367 | NO |  |
| L0368 | NO |  |
| L0369 | NO |  |
| L0370 | NO |  |
| L0371 | NO |  |
| L0372 | NO |  |
| L0373 | NO |  |
| L0374 | NO |  |
| L0375 | NO |  |
| L0376 | PARTLY | census measures claim errors where the check at hand was not run in 61-73% |
| L0377 | NO |  |
| L0378 | NO |  |
| L0379 | NO |  |
| L0380 | NO |  |
| L0381 | NO |  |
| L0382 | NO |  |
| L0383 | NO |  |
| L0384 | NO |  |
| L0385 | NO |  |
| L0386 | PARTLY | replies naming paths, shas, counts went out with no Sources line (1,077 would-block) |
| L0387 | NO |  |
| L0388 | NO |  |
| L0389 | NO |  |
| L0391 | NO |  |
| L0392 | PARTLY | state block carried 33 of 37 figures with no as-of time; "0 unpushed" false hours later |
| L0393 | NO |  |
| L0394 | NO |  |
| L0395 | NO |  |
| L0396 | NO |  |
| L0397 | YES | told Gemini a page "did not exist" after one empty search; one more search finds it |
| L0398 | NO |  |
| L0399 | NO |  |
| L0400 | NO |  |
| L0401 | NO |  |
| L0402 | NO |  |
| L0403 | NO |  |
| L0404 | NO |  |
| L0405 | NO |  |
| L0406 | NO |  |
| L0407 | NO |  |
| L0408 | NO |  |
| L0410 | YES | cited the wrong person from memory; own 10-14 entry shows it |
| L0411 | NO |  |
| L0412 | NO |  |
| L0413 | YES | "69 hexes in 14 files" typed; the 14 files hold 51 |
| L0414 | NO |  |
| L0415 | NO |  |
| L0416 | NO |  |
| L0417 | NO |  |
| L0418 | PARTLY | "delivered" reported for text sitting in the composer, unchecked |
| L0419 | YES | cause "banding" typed without reading prism.js's header |
| L0420 | NO |  |
| L0421 | PARTLY | pushed with cargo green at an earlier commit |
| L0422 | NO |  |
| L0423 | NO |  |
| L0424 | NO |  |
| L0425 | NO |  |
| L0426 | NO |  |
| L0427 | NO |  |
| L0428 | NO |  |
| L0429 | NO |  |
| L0430 | NO |  |
| L0431 | NO |  |
| L0432 | NO |  |
| L0433 | NO |  |
| L0434 | NO |  |
| L0435 | NO |  |
| L0436 | NO |  |
| L0437 | NO |  |
| L0438 | NO |  |
| L0439 | NO |  |
| L0440 | NO |  |
| L0441 | NO |  |
| L0442 | YES | said two zips stay although the keeper's yes covered them |
| L0443 | NO |  |
| L0444 | NO |  |
| L0445 | NO |  |
| L0446 | NO |  |
| L0447 | PARTLY | two librarian claims corrected; cold read found six wrong |
| L0448 | PARTLY | "install 0.4.21" reported without checking the installed exe date |
| L0449 | NO |  |
| L0450 | NO |  |
| L0451 | NO |  |
| L0452 | NO |  |
| L0453 | PARTLY | seat about to write "private" of a folder public since 09-14 (caught) |
| L0454 | NO |  |
| L0455 | NO |  |
| L0456 | NO |  |
| L0457 | NO |  |
| L0458 | NO |  |
| L0459 | NO |  |
| L0460 | NO |  |
| L0461 | NO |  |
| L0462 | NO |  |
| L0463 | NO |  |
| L0464 | NO |  |
| L0465 | PARTLY | "holds today's state" typed of a stick that failed readback |
| L0466 | NO |  |
| L0467 | PARTLY | prior art said the config had no field, read from a stale checkout |
| L0468 | NO |  |
| L0469 | NO |  |
| L0470 | NO |  |
| L0471 | NO |  |
| L0472 | NO |  |
| L0473 | NO |  |
| L0474 | NO |  |
| L0475 | PARTLY | eleven librarian claims marked "WRONG +1 mine" across laps |
| L0476 | PARTLY | README camber line typed wrong |
| L0477 | NO |  |
| L0478 | PARTLY | row said "off" for a car that went through |
| L0479 | NO |  |
| L0480 | NO |  |
| L0481 | NO |  |
| L0482 | PARTLY | plan passed from close views without the whole-lane view |
| L0483 | NO |  |
| L0484 | NO |  |
| L0485 | PARTLY | "builder not running" typed from a process filter that missed the name |
| L0486 | NO |  |
| L0487 | NO |  |
| L0488 | NO |  |
| L0489 | PARTLY | told the chair a file was missing from an ls misread |
| L0490 | NO |  |
| L0491 | NO |  |
| L0492 | NO |  |
| L0493 | NO |  |
| L0494 | NO |  |
| L0495 | YES | wrong installed-file hash typed in a hold section (4a7f195b vs 8d2ab66b) |
| L0496 | NO |  |
| L0497 | NO |  |
| L0498 | NO |  |
| L0499 | NO |  |
| L0500 | NO |  |
| L0501 | YES | crossing read as a tight-turn fold from chunk names, not from the geometry |
| L0502 | NO |  |
| L0503 | NO |  |
| L0504 | NO |  |
| L0505 | NO |  |
| L0506 | NO |  |
| L0507 | YES | "about 18 deg lean" typed; measured 9.4 to 10.6 |
| L0508 | NO |  |
| L0509 | NO |  |
| L0510 | NO |  |
| L0511 | NO |  |
| L0512 | NO |  |
| L0513 | NO |  |
| L0514 | NO |  |
| L0515 | NO |  |
| L0516 | NO |  |
| L0517 | NO |  |
| L0518 | NO |  |
| L0519 | NO |  |
| L0520 | NO |  |
| L0521 | NO |  |
| L0522 | NO |  |
| L0523 | NO |  |
| L0524 | NO |  |
| L0525 | PARTLY | keep-warm visits answered "unchecked" for about 8 h while a watcher waited on a log that never came |
| L0526 | NO |  |
| L0527 | PARTLY | "touched set 1,029/1,029 green" called from a narrower run |
| L0528 | YES | "dead code" verdict on P19 typed; the runner did not run the test |
| L0529 | NO |  |
| L0530 | NO |  |
| L0531 | YES | 39 tools "never seen catching" typed without running one |
| L0532 | PARTLY | per-tool dates and denies counted as catches without opening them |
| L0533 | NO |  |
| L0534 | NO |  |
| L0535 | NO |  |
| L0536 | NO |  |
| L0537 | NO |  |
| L0538 | NO |  |
| L0539 | NO |  |
| L0540 | NO |  |
| L0541 | NO |  |
| L0542 | PARTLY | letters credited to the wrong seat from letters.json, not checked against signatures |
| L0543 | NO |  |
| L0544 | NO |  |
| L0545 | NO |  |
| L0546 | PARTLY | D618 total size typed wrong |
| L0547 | NO |  |
| L0548 | NO |  |
| L0549 | NO |  |
| L0550 | NO |  |
| L0551 | PARTLY | push ordered on an all-clear before the keeper tried the changes |
| L0552 | NO |  |
| L0553 | NO |  |
| L0554 | NO |  |
| L0555 | NO |  |
| L0556 | NO |  |
| L0557 | YES | "not offered in the setup window" claimed after reading one function; stick.js:109 draws it |
| L0558 | NO |  |
| L0559 | NO |  |
| L0560 | NO |  |
| L0561 | NO |  |
| L0562 | NO |  |
| L0563 | NO |  |
| L0564 | NO |  |
| L0565 | NO |  |
| L0566 | YES | "git grep blind to B.md" typed (it was not) and a UTC time given as local |
| L0567 | NO |  |
| L0568 | YES | "49 hooks" typed in a case; count is 24; rate did not survive reading |
| L0569 | NO |  |
| L0570 | NO |  |
| L0571 | NO |  |
| L0572 | PARTLY | "6.84x the bar" taken from own regenerate; shipped writer reads 3.18x |
| L0573 | YES | ring said markers_sectors in neither run; the file was in both |
| L0574 | NO |  |
| L0575 | NO |  |
| L0576 | NO |  |
| L0577 | NO |  |
| L0578 | NO |  |
| L0579 | NO |  |
| L0580 | NO |  |
| L0581 | NO |  |
| L0582 | NO |  |
| L0583 | NO |  |
| L0584 | YES | audit said flags "never adjudicated"; B scored 30 on 10-03 |
| L0585 | YES | relayed LUFS -14.12; delivered mix -11.1 |
| L0586 | YES | "main.rs 13,085 lines" typed; the file has 13,933 |
| L0587 | YES | ring "core refuses the Oct-22 document" dispatched as a bug; it did not exist |
| L0588 | YES | "every part non-author green" typed with E's fixes unlooked |
| L0589 | NO |  |
| L0590 | NO |  |
| L0591 | NO |  |
| L0592 | PARTLY | pulse line said "Sent 20:51", a UTC time read as local; a hand-back thought lost 15 h |
| L0593 | NO |  |
| L0594 | NO |  |
| L0595 | NO |  |
| L0596 | NO |  |
| L0597 | NO |  |
| L0598 | NO |  |
| L0599 | NO |  |
| L0600 | NO |  |
| L0601 | NO |  |
| L0602 | NO |  |
| L0603 | NO |  |
| L0604 | NO |  |
| L0605 | NO |  |
| L0606 | NO |  |
| L0607 | NO |  |
| L0608 | NO |  |
| L0609 | NO |  |
| L0610 | PARTLY | push ordered on the seat's own all-clear before the keeper tried the changes |
| L0611 | NO |  |
| L0612 | NO |  |
| L0613 | NO |  |
| L0614 | NO |  |
| L0615 | NO |  |
| L0616 | PARTLY | retire list called blind.js tools superseded though board-digest.js requires it |
| L0617 | NO |  |
| L0618 | NO |  |
| L0619 | NO |  |
| L0620 | NO |  |
| L0621 | NO |  |
| L0622 | NO |  |
| L0623 | NO |  |
| L0624 | NO |  |
| L0625 | YES | plan said his 80 m ramp was under the bar; it is 2.1 times BANK_BAR |
| L0626 | NO |  |
| L0627 | NO |  |
| L0628 | NO |  |
| L0629 | NO |  |
| L0630 | NO |  |
| L0631 | NO |  |
| L0632 | NO |  |
| L0633 | NO |  |
| L0634 | PARTLY | a summary of his sketch dropped the problem; originals sat whole |
| L0635 | NO |  |
| L0636 | NO |  |
| L0637 | NO |  |
| L0638 | NO |  |
| L0639 | YES | plan said origin's heavy-run.js handles a reused pid; its own comment says it does not |
| L0640 | NO |  |
| L0641 | NO |  |
| L0642 | NO |  |
| L0643 | YES | "113 mutants" status; total was 120 |
| L0644 | NO |  |
| L0645 | NO |  |
| L0646 | NO |  |
| L0647 | NO |  |
| L0648 | NO |  |
| L0649 | NO |  |
| L0650 | NO |  |
| L0651 | NO |  |
| L0652 | NO |  |
| L0653 | NO |  |
| L0654 | NO |  |
| L0655 | NO |  |
| L0656 | NO |  |
| L0657 | YES | told him the hold was held for his word; it was on the branch |
| L0658 | NO |  |
| L0659 | NO |  |
| L0660 | NO |  |
| L0661 | NO |  |
| L0662 | NO |  |
| L0663 | YES | "66 mutants"; file holds 65 |
| L0664 | NO |  |
| L0665 | NO |  |
| L0666 | NO |  |
| L0667 | NO |  |
| L0668 | NO |  |
| L0669 | NO |  |
| L0670 | NO |  |
| L0671 | NO |  |
| L0672 | NO |  |
| L0673 | PARTLY | quoted 2.06x bar from a bench pairing cold with warm |
| L0674 | NO |  |
| L0675 | PARTLY | mutant count 66 vs 65 repeated (rest of row is not R01) |
| L0676 | NO |  |
| L0677 | PARTLY | "the axis rolls" reading typed; it was the 720 wrap |
| L0678 | NO |  |
| L0679 | NO |  |
| L0680 | NO |  |
| L0681 | NO |  |
| L0682 | NO |  |
| L0683 | NO |  |
| L0684 | NO |  |
| L0685 | NO |  |
| L0686 | NO |  |
| L0687 | NO |  |
| L0688 | NO |  |
| L0689 | NO |  |
| L0690 | NO |  |
| L0691 | YES | interim named the wrong R2 test file, typed rather than listed |
| L0692 | NO |  |
| L0693 | NO |  |
| L0694 | NO |  |
| L0695 | NO |  |
| L0696 | NO |  |
| L0697 | NO |  |
| L0698 | NO |  |
| L0699 | YES | wrote D's two fixes were on D only; D had pushed (fb5b91c); keeper told D failed to push |
| L0700 | NO |  |
| L0701 | NO |  |
| L0702 | NO |  |
| L0703 | PARTLY | stale carriers say open or "never ran" for things already filed or run |
| L0704 | NO |  |
| L0705 | NO |  |
| L0706 | NO |  |
| L0707 | NO |  |
| L0708 | NO |  |
| L0709 | YES | "119 lines" was 119 matches across 38 files |
| L0710 | NO |  |
| L0711 | NO |  |
| L0712 | NO |  |
| L0713 | PARTLY | CHANGELOG described a wrong interface and stayed [Unreleased] |
| L0714 | NO |  |
| L0715 | NO |  |
| L0716 | NO |  |
| L0717 | NO |  |
| L0718 | NO |  |
| L0719 | YES | called the GPU's 108 W "idle" before checking the process list |
| L0720 | NO |  |
| L0721 | NO |  |
| L0722 | NO |  |
| L0723 | NO |  |
| L0724 | NO |  |
| L0725 | NO |  |
| L0726 | NO |  |
| L0727 | NO |  |
| L0728 | YES | read A as not started from a worktree's last commit; board never looked |
| L0729 | PARTLY | work turn named pointers that belong to later laps |
| L0730 | NO |  |
| L0731 | NO |  |
| L0732 | NO |  |
| L0733 | PARTLY | "are u sure" attributed to the wrong seat by shape; disk had the source |
| L0734 | PARTLY | same attribution by shape; carrier part is not R01 |
| L0735 | YES | leaned against his claim about Anthropic's dreaming without a check |
| L0736 | NO |  |
| L0737 | PARTLY | "nothing comes back" written against the Third Place's own definition |
| L0738 | NO |  |
| L0739 | NO |  |
| L0740 | NO |  |
| L0741 | NO |  |
| L0742 | PARTLY | privacy grep with a NUL counted 0 on every pattern; three hand-backs said clean |
| L0743 | NO |  |
| L0744 | NO |  |
| L0745 | PARTLY | 40-minute cap and pid 8876 read off without opening the run log |
| L0746 | NO |  |
| L0747 | NO |  |
| L0748 | NO |  |
| L0749 | NO |  |
| L0750 | PARTLY | baseline "from" typed as 500 (was 770.6); truth check read messages cut at 220 characters |
| L0751 | NO |  |
| L0752 | NO |  |
| L0753 | NO |  |
| L0754 | PARTLY | P misread one output line: local main given as f2884fa, it was 60c7688 |
| L0755 | NO |  |
| L0756 | NO |  |
| L0757 | NO |  |
| L0758 | NO |  |
| L0759 | YES | said Anthropic's dream "writes directly, no review step" from a blog; docs show otherwise |
| L0760 | NO |  |
| L0761 | NO |  |
| L0762 | NO |  |
| L0763 | NO |  |
| L0764 | NO |  |
| L0765 | NO |  |
| L0766 | PARTLY | "only hits are the flippedLap helper" from a grep that did not cover commit messages |
| L0767 | NO |  |
| L0768 | NO |  |
| L0769 | NO |  |
| L0770 | NO |  |
| L0771 | NO |  |
| L0772 | NO |  |
| L0773 | NO |  |
| L0774 | NO |  |
| L0775 | YES | "no read of the second track exists" after looking only under Downloads |
| L0776 | PARTLY | collation ran one test file and was taken as the touched set |
| L0777 | NO |  |
| L0778 | YES | handoff listed Dreamzone 2 "not pushed"; the Third Place handoff showed it pushed |
| L0779 | YES | same event as L0775: no read existed, one was on D's Desktop |
| L0780 | NO |  |
| L0781 | NO |  |
| L0782 | PARTLY | a Git Bash grep count wrongly said working copies were CRLF |
| L0783 | NO |  |
| L0784 | NO |  |
| L0785 | NO |  |
| L0786 | NO |  |
| L0787 | NO |  |
| L0788 | NO |  |
| L0789 | NO |  |
| L0790 | NO |  |
| L0791 | NO |  |
| L0792 | NO |  |
| L0793 | NO |  |
| L0794 | PARTLY | handoff step typed from L's folder; does not apply on D |
| L0795 | YES | gave the handoff's three contradiction labels without opening the brief |
| L0796 | NO |  |
| L0797 | NO |  |
| L0798 | NO |  |
| L0799 | NO |  |
| L0800 | YES | URL typed before publishing was a placeholder |
| L0801 | NO |  |
| L0802 | NO |  |
| L0803 | NO |  |
| L0804 | NO |  |
| L0805 | NO |  |
| L0806 | NO |  |
| L0807 | PARTLY | hoodie read as the base outfit from memory of a line, not opened |
| L0808 | NO |  |
| L0809 | NO |  |
| L0810 | NO |  |
| L0811 | NO |  |
| L0812 | NO |  |
| L0813 | PARTLY | note dated from the file name's UTC date, not the clock |
| L0814 | YES | nine sha256 prefixes committed that were not copied from any command |
| L0815 | NO |  |
| L0816 | NO |  |
| L0817 | NO |  |
| L0818 | NO |  |
| L0819 | NO |  |
| L0820 | PARTLY | item-33 table typed without the slot limits |
| L0821 | NO |  |
| L0822 | NO |  |
| L0823 | NO |  |
| L0824 | NO |  |
| L0825 | NO |  |
| L0826 | NO |  |
| L0827 | NO |  |
| L0828 | NO |  |
| L0829 | NO |  |
| L0830 | NO |  |
| L0831 | NO |  |
| L0832 | NO |  |
| L0833 | PARTLY | prediction 3 written from the chair's wording without looking at stage 8 |
| L0834 | NO |  |
| L0835 | NO |  |
| L0836 | NO |  |
| L0837 | NO |  |
| L0838 | NO |  |
| L0839 | NO |  |
| L0840 | YES | rule "% 37" written as "one in 400"; it is about one in 41; arithmetic by a command shows it |
| L0841 | NO |  |
| L0842 | NO |  |
| L0843 | NO |  |
| L0844 | NO |  |
| L0845 | NO |  |
| L0846 | YES | sha written for a commit before reading it; "both slots empty" typed; failing number misread |
| L0847 | PARTLY | first triangle count and vertex figures typed before counting |
| L0848 | NO |  |
| L0849 | NO |  |
| L0850 | YES | guessed times and hand-written ranges in the hand-back, corrected on collation |
| L0851 | PARTLY | V-measure read -1 as a lead; stated -3.70 s, true +5.7 s |
| L0852 | NO |  |
| L0853 | NO |  |
| L0854 | NO |  |
| L0855 | NO |  |
| L0856 | NO |  |
| L0857 | NO |  |
| L0858 | NO |  |
| L0859 | NO |  |
| L0860 | NO |  |
| L0861 | YES | ambientCG author's name written into CREDITS from memory |
| L0862 | NO |  |
| L0863 | NO |  |
| L0864 | NO |  |
| L0865 | NO |  |
| L0866 | NO |  |
| L0867 | YES | times "~03:xx", "~04:xx" typed, not read from a clock |
| L0868 | YES | heading "05:0x" was a guess; clock read 04:57 |
| L0869 | YES | four hand-computed table cells wrong |
| L0870 | NO |  |
| L0871 | NO |  |
| L0872 | NO |  |
| L0873 | NO |  |
| L0874 | YES | line numbers cited :271 and :279-284; they are :273 and :282 |
| L0875 | NO |  |
| L0876 | PARTLY | branch d652-c taken for a D652 branch by its name |
| L0877 | NO |  |
| L0878 | NO |  |
| L0879 | NO |  |
| L0880 | PARTLY | a background run said "completed"; ctest was not on the path |
| L0881 | NO |  |
| L0882 | YES | told the keeper "determinism break" before reading the test |
| L0883 | YES | times typed from feel five times instead of read from the clock |
| L0884 | NO |  |
| L0885 | NO |  |
| L0886 | NO |  |
| L0887 | NO |  |
| L0888 | NO |  |
| L0889 | NO |  |
| L0890 | NO |  |
| L0891 | NO |  |
| L0892 | NO |  |
| L0893 | NO |  |
| L0894 | NO |  |
| L0895 | NO |  |
| L0896 | NO |  |
| L0897 | YES | "36 files" typed in three places; the suite has 34 |
| L0898 | NO |  |
| L0899 | NO |  |
| L0900 | NO |  |
| L0901 | NO |  |
| L0902 | NO |  |
| L0903 | YES | hand-written grid of total-time ranges did not match the log |
| L0904 | YES | evidence section cited an unread figure for 966eedf and a wrong claim |
| L0905 | YES | guessed times in A's and E's hand-backs, five correction commits |
| L0906 | NO |  |
| L0907 | NO |  |
| L0908 | PARTLY | designs assumed a stamina system the game does not have |
| L0909 | NO |  |
| L0910 | NO |  |
| L0911 | YES | a copied sha wrong in a note |
| L0912 | NO |  |
| L0913 | NO |  |
| L0914 | NO |  |
| L0915 | NO |  |
| L0916 | NO |  |
| L0917 | NO |  |
| L0918 | NO |  |
| L0919 | NO |  |
| L0920 | PARTLY | risk of paid random items on Roblox overstated, no source |
| L0921 | NO |  |
| L0922 | NO |  |
| L0923 | PARTLY | "120 degree/s cap" had no source; bars from the librarian failed its own L173 |
| L0924 | PARTLY | rule built on E's inference; line cites named the wrong HEAD |
| L0925 | NO |  |
| L0926 | NO |  |
| L0927 | YES | amendments named studies from memory, unread; one journal wrong |
| L0928 | NO |  |
| L0929 | NO |  |
| L0930 | YES | packet said DetourCrowd was available; recast.cmake shows it is not compiled |
| L0931 | NO |  |
| L0932 | NO |  |
| L0933 | NO |  |
| L0934 | NO |  |
| L0935 | NO |  |
| L0936 | NO |  |
| L0937 | NO |  |
| L0938 | NO |  |
| L0939 | YES | lesser_max given as 1 and "no preference" typed; code rises from 1 and prefers by role |
| L0940 | NO |  |
| L0941 | NO |  |
| L0942 | NO |  |
| L0943 | NO |  |
| L0944 | NO |  |
| L0945 | YES | plan cited 2e04aa5 with 9d98b64's line numbers; sed lines off by 2 to 5 |
| L0946 | NO |  |
| L0947 | YES | citation typed as J Exp Biol 115; it is J Zool 201:135-152 |
| L0948 | NO |  |
| L0949 | NO |  |
| L0950 | NO |  |
| L0951 | NO |  |
| L0952 | NO |  |
| L0953 | PARTLY | added a claim about the game's story as fact without a source |
| L0954 | YES | listed other songs on the soundtrack from memory, never checked |
| L0955 | NO |  |
| L0956 | NO |  |
| L0957 | NO |  |
| L0958 | PARTLY | wake plan says retriever "registered, unbuilt"; research file says closed 08-31 |
| L0959 | NO |  |
| L0960 | NO |  |
| L0961 | NO |  |
| L0962 | NO |  |
| L0963 | PARTLY | note cited the wrong commit |
| L0964 | YES | librarian's L187 citation wrong |
| L0965 | PARTLY | premise "base player slower than the hunter" typed; the budget computed otherwise |
| L0966 | NO |  |
| L0967 | NO |  |
| L0968 | NO |  |
| L0969 | NO |  |
| L0970 | NO |  |
| L0971 | NO |  |
| L0972 | NO |  |
| L0973 | NO |  |
| L0974 | NO |  |
| L0975 | NO |  |
| L0976 | NO |  |
| L0977 | NO |  |
| L0978 | NO |  |
| L0979 | NO |  |
| L0980 | NO |  |
| L0981 | NO |  |
| L0982 | NO |  |
| L0983 | NO |  |
| L0984 | PARTLY | record holds conflicting hand-typed times for one train run |
| L0985 | YES | first reader typed a wrong count (75 vs 86), a wrong date, "no tracked code", 97 min as 50 |
| L0986 | YES | first reader credited 41 min to ordering, counted 30 min twice, mis-cited lines |
| L0987 | NO |  |
| L0988 | NO |  |
| L0989 | NO |  |
| L0990 | YES | 82 WRONG lines (line numbers, misattributed quotes) in 29 first-pass files |
| L0991 | PARTLY | plan misapplied Weyand from a reading |
| L0992 | YES | plan claimed Valve's playback-rate flag is used; source shows it never is |
| L0993 | NO |  |
| L0994 | NO |  |
| L0995 | YES | install advice "board-digest.js alone is safe" typed; repo copy requires sealedGate the installed file lacks |
| L0996 | NO |  |
| L0997 | YES | hand "rises above the head at 10 m/s" typed from a reading of the sheet; E measured 0.02 m below the eye |
| L0998 | NO |  |
| L0999 | NO |  |
| L1000 | NO |  |
| L1001 | NO |  |
| L1002 | YES | ruled the wall-to-wall was in run 082347 from item timing; the replay shows no shuttle |
| L1003 | NO |  |
| L1004 | NO |  |
| L1005 | NO |  |
| L1006 | YES | two handoffs read through a 260-character cut and dispatched from; notes and letter unopened |
| L1007 | NO |  |
| L1008 | NO |  |
| L1009 | YES | told him twice stop.js was "live against your ruling"; the ruling delegated it |
| L1010 | YES | wrote "the critic hasn't been run"; it had since 09:02 |
| L1011 | YES | swarm summaries wrong: 6 of 61, 3 of 21, 6 of 119; mis-ranked headline |
| L1012 | NO |  |
| L1013 | NO |  |
| L1014 | NO |  |
| L1015 | NO |  |
| L1016 | NO |  |
| L1017 | PARTLY | inference "worst pair was straightening" refuted by the pair |
| L1018 | NO |  |
| L1019 | NO |  |
| L1020 | NO |  |
| L1021 | NO |  |
| L1022 | NO |  |
| L1023 | PARTLY | wrote the three seats' job is holding the room; it is the librarian's |
| L1024 | NO |  |
| L1025 | NO |  |
| L1026 | NO |  |
| L1027 | NO |  |
| L1028 | NO |  |
| L1029 | NO |  |
| L1030 | NO |  |
| L1031 | NO |  |
| L1032 | NO |  |
| L1033 | NO |  |
| L1034 | NO |  |
| L1035 | NO |  |
| L1036 | YES | told him and the chair "P's arms all stood" with no check; P voids a 29 s window |
| L1037 | NO |  |
| L1038 | NO |  |
| L1039 | NO |  |
| L1040 | NO |  |
| L1041 | NO |  |
| L1042 | NO |  |
| L1043 | YES | hand-back said installing 2c syncs 14+9 hooks; the installer takes -Only |
| L1044 | NO |  |
| L1045 | NO |  |
| L1046 | NO |  |
| L1047 | NO |  |
| L1048 | NO |  |
| L1049 | YES | cites of A's hand-backs wrong (:47 is a heading; file has 54 lines) |
| L1050 | NO |  |
| L1051 | NO |  |
| L1052 | NO |  |
| L1053 | NO |  |
| L1054 | NO |  |
| L1055 | NO |  |
| L1056 | NO |  |
| L1057 | NO |  |
| L1058 | NO |  |
| L1059 | PARTLY | assumption his kit would meet row 1 unchanged; 13 of 13 red |
| L1060 | PARTLY | two figures in a draft wrong |
| L1061 | NO |  |
| L1062 | YES | heading 15:3xZ typed; written about 15:00Z; kHipPeakFast 0.80 from hand calc |
| L1063 | NO |  |
| L1064 | NO |  |
| L1065 | NO |  |
| L1066 | YES | said "I checked the Gateway report itself" when a small model had read it |
| L1067 | NO |  |
| L1068 | NO |  |
| L1069 | NO |  |
| L1070 | YES | swarm first readers: 155 of 1,004 claims wrong or weak, found by second readers |
| L1071 | YES | critic found 14 sources never opened, 13 offers resting on summary or memory |
| L1072 | NO |  |
| L1073 | NO |  |
| L1074 | NO |  |
| L1075 | YES | told the keeper "the biggest missing piece" without searching the handbacks; C had diagnosed it two days before |
| L1076 | YES | filter cost typed 0.43 ms, "almost the same" by eye; measured +0.20 ms and +5% |
| L1077 | YES | two nights of answering from the seat's own last output instead of the source |
| L1078 | NO |  |
| L1079 | NO |  |
| L1080 | NO |  |
| L1081 | NO |  |
| L1082 | NO |  |
| L1083 | PARTLY | letter says its filename is in front of the seat at any budget; the light shelf does not carry undated files |
| L1084 | PARTLY | brief says call_chair refuses a ring with no trailer; D runs light |
| L1085 | NO |  |
| L1086 | NO |  |
| L1087 | NO |  |
| L1088 | NO |  |
| L1089 | PARTLY | hooks README says 35 files and 23 registrations; -Check says 36 and 24 |
| L1090 | YES | first reader's tool output cut before the verdicts of a 5,031-line print |
| L1091 | PARTLY | ferry-watch header says 3 of 109 ferried; dispatch-gate says 84 of 109 never |
| L1092 | NO |  |
| L1093 | NO |  |
| L1094 | NO |  |
| L1095 | PARTLY | grep returned 3 of 7 compaction lines where node returned 7 (caught) |
| L1096 | YES | memory note said a restart changes a seat's model; for a resumed seat it does not |
| L1097 | YES | swarm said a mid-day restart rewrites every seat whole; four warm resumes show 37-39k |
| L1098 | YES | F1b called "the fix for the recorded case"; 113.7 KB/s over 120 s carries 13.6 of 90.5 MB |
| L1099 | PARTLY | launch-id variable inheritance claimed without a run |
| L1100 | PARTLY | W5 check says no tmp_pack_* remains; tmp_pack_Hl1ze7 stays until gc |
| L1101 | YES | stretch plan quoted the falsifier as "wakes"; W4, W1, W5 each wrong as written |
| L1102 | YES | first swarm read a cargo check as a failed release build; "why it stopped is not on disk" |
| L1103 | PARTLY | plan ranked on 4 h 24 m, a figure from a different fault |
| L1104 | PARTLY | stretched a T-180 rule to a restart; rested on an L-dated line |
| L1105 | YES | sibling-file figures marked [read] that were not read by that file |
| L1106 | YES | second readers struck 76 spans in twelve files; 82 lines in the first swarm |
| L1107 | YES | level two second readers: 27 WRONG and 21 DOWNGRADED over 238 claims in four files |
| L1108 | NO |  |
| L1109 | NO |  |
| L1110 | YES | two more wrong librarian lines, on the rebuild and on the critic file's state |
| L1111 | YES | E's hip extension figure typed -17 to -23; the row reads -11 |
| L1112 | PARTLY | foot test written against a source it did not match |
| L1113 | NO |  |
| L1114 | NO |  |
| L1115 | NO |  |
| L1116 | NO |  |
| L1117 | PARTLY | two details wrong (L192's survivor, time of the finger answer) |
| L1118 | YES | close time written, not read from the clock; corrected to 13:41Z |
| L1119 | YES | claim the record held a wall-to-wall run was wrong; A's replay found none |
| L1120 | NO |  |
| L1121 | NO |  |
| L1122 | NO |  |
| L1123 | PARTLY | 110 of 137 value-turns unsourced, the measurement of the root itself |

## What I did not open

- No primary behind any ledger row: no journal, hand-back, map, board, jsonl or git history. Every verdict is from the
  row text in 00_ledger.md (read in whole lines, lines 1-1231).
- The group files and other scorers' files (not allowed). I read only the R01 entry in 00_roots.md (lines 9-20 of the
  file, which also printed the claimed-id lists; I did not use those lists to score).
- Rows marked UNSUPPORTED or WRONG by the ledger's second reader were taken as corrected in place.
- [inferred] A row whose text is thin (commit-subject rows) may hide a typed claim I scored NO, or the reverse.
  The second reader put about 10% of the ledger as unreliable as written; I did not adjust for it.
