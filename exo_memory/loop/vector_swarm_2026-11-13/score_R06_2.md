# Score R06, scorer 2: carried copy trusted in place of the original

Scorer 2 (Sonnet research agent), 2026-11-13. Root R06 read from 00_roots.md:79-85 only [read]. Ledger read from
00_ledger.md rows L0001..L1123 (corrected forms), one by one [read]. I read each row's event and cost fields whole; I did
not open the rows' primaries, so every verdict rests on the ledger wording [inferred]. Seven rows marked REMOVE were skipped.

Rule I held: YES only when I can say in one line what reopening the original (or not trusting the copy) would have
removed for that row. Rows about a hand-made number with no instrument run (R01), a missing carry (nothing to reopen),
a stamp or status line (derived, not a carried copy), pane skill or design errors, and queue or lock stalls are NO.
Rows where the carried copy is a stand-in but the loss would only be smaller or caught sooner are PARTLY.

## Totals

- YES: 30
- PARTLY: 47
- NO: 1039
- Skipped (REMOVE): 7
- Rows scored: 1116 (ledger rows 1123 minus 7 REMOVE = 1116)  [read: script count over the ids]

## Cost covered (YES rows only)

- Minutes stated in the YES rows: 60 (L0290, "a live seat sat invisible about an hour") [read].
- Tokens stated in the YES rows: none [read].
- YES rows with no minutes or tokens recorded: 29 of 30. Two more carry a duration that is not a work cost (L0734, a carrier
  that stood 15 weeks; L1005, a stale shelf of 58 s and a 2.1 MB fetch) and are not added.
- For comparison only: PARTLY rows with a stated minute figure: L0288 8 min, L0585 43 min, L0587 3 min (54 min in all) [read].
- [inferred] The covered cost is small because most R06 rows are wrong rulings or wrong claims whose cost was a turn or a
  rework that nobody timed. The big recorded costs (L0076 85 h, L0143 8h57m, L0241 4h24m, L0010 and L0257 token writes,
  L0469 context burn) are queue, delivery, keep-warm and cache faults, which R06 does not touch.

## Where R06 lands (notes)

- The YES rows cluster in three kinds: relays and hand-offs restated and not reopened (L0059, L0066, L0109, L0197, L0699, L0778,
  L0795), stale carriers kept alive past a correction (L0268, L0734, L0703, L0958, L0565, L0392), and wakes from a copy
  (L0031, L0396, L0449, L0629, L1005, L1006).
- Rows I held out as NO although the plan names them as stand-in cases: DELIVERED stamp (L0418, L0538, a stamp is not a
  carried copy), the 98 of 98 mutants guard (L1015, L1064, a test that could not fail, R01 or a gate fault), hand-grep counts
  (L0084 and similar, a hand-made figure with no instrument run).
- Untracked or dropped hand-backs and handoffs (L0487, L0705, L0708, L0787) are loss at the carry step, not trust of a
  copy; a fix of R06 does not bring the original to the machine that lacks it. Marked NO.
- [inferred] Where I wavered: L0301 and L0734/L0733 (attribution by shape), L0285-type "digest" rows (L0288, L0971, L1079);
  I gave the digest rows PARTLY because opening the pane or roster would have caught them, but the digest is a derived view.

## Table (every ledger id; mechanism for YES and PARTLY only)

| id | verdict | mechanism (one line) |
|----|---------|----------------------|
| L0001 | NO | |
| L0002 | NO | |
| L0003 | NO | |
| L0004 | NO | |
| L0005 | NO | |
| L0006 | NO | |
| L0007 | NO | |
| L0008 | NO | |
| L0009 | NO | |
| L0010 | NO | |
| L0011 | NO | |
| L0012 | NO | |
| L0013 | NO | |
| L0014 | YES | chair worked from its own context summary and did not reopen the original before agreeing |
| L0015 | NO | |
| L0016 | NO | |
| L0017 | NO | |
| L0018 | NO | |
| L0019 | NO | |
| L0020 | NO | |
| L0021 | NO | |
| L0022 | NO | |
| L0023 | NO | |
| L0024 | PARTLY | the lossy summary is the loss this root names; reopening originals bounds the damage, not the loss itself |
| L0025 | NO | |
| L0026 | NO | |
| L0027 | NO | |
| L0028 | NO | |
| L0029 | REMOVE | skipped (marked REMOVE in the ledger) |
| L0030 | NO | |
| L0031 | YES | seat judged "at home" from the carried shelf and did not open the files; opening originals first would show the gap |
| L0032 | NO | |
| L0033 | PARTLY | wrong direction of a reply's figure was copied into a note; reopening the chair's figure corrects it |
| L0034 | NO | |
| L0035 | NO | |
| L0036 | NO | |
| L0037 | NO | |
| L0038 | NO | |
| L0039 | NO | |
| L0040 | NO | |
| L0041 | PARTLY | laptop hook output read as a system fact; opening the desktop record would have shown the dream cycle lives there |
| L0042 | NO | |
| L0043 | PARTLY | chair cited the pre-correction carrier; reopening the master would have shown the correction |
| L0044 | NO | |
| L0045 | NO | |
| L0046 | NO | |
| L0047 | PARTLY | chair's unverified claim relayed as the brief; opening the original would have caught the wrong brief |
| L0048 | NO | |
| L0049 | NO | |
| L0050 | NO | |
| L0051 | NO | |
| L0052 | NO | |
| L0053 | NO | |
| L0054 | NO | |
| L0055 | YES | ledger row "never journaled" was stale at birth and trusted; the commit on disk contradicted it |
| L0056 | PARTLY | plan trusted a note ("both pulses exist") instead of opening install.ps1:633 |
| L0057 | NO | |
| L0058 | NO | |
| L0059 | YES | relayed hash taken as a commit sha without reopening the object (cat-file) |
| L0060 | NO | |
| L0061 | NO | |
| L0062 | NO | |
| L0063 | NO | |
| L0064 | NO | |
| L0065 | NO | |
| L0066 | YES | relayed hash taken as a commit sha without reopening the object (cat-file) |
| L0067 | NO | |
| L0068 | NO | |
| L0069 | NO | |
| L0070 | NO | |
| L0071 | NO | |
| L0072 | NO | |
| L0073 | PARTLY | summary of a score and of a cold read stated as found; reopening the source would have corrected it |
| L0074 | NO | |
| L0075 | NO | |
| L0076 | NO | |
| L0077 | NO | |
| L0078 | NO | |
| L0079 | NO | |
| L0080 | NO | |
| L0081 | NO | |
| L0082 | NO | |
| L0083 | NO | |
| L0084 | NO | |
| L0085 | NO | |
| L0086 | NO | |
| L0087 | NO | |
| L0088 | NO | |
| L0089 | NO | |
| L0090 | NO | |
| L0091 | NO | |
| L0092 | NO | |
| L0093 | NO | |
| L0094 | NO | |
| L0095 | NO | |
| L0096 | NO | |
| L0097 | PARTLY | a figure from another date carried and quoted as the shelf figure; one reopen of the instrument would fix |
| L0098 | PARTLY | keeper's wish filed into a list then the plan used the list; reopening his words would show the omission |
| L0099 | NO | |
| L0100 | NO | |
| L0101 | NO | |
| L0102 | NO | |
| L0103 | NO | |
| L0104 | NO | |
| L0105 | NO | |
| L0106 | PARTLY | keeper's request carried into a note but not onto the rebuild path; reopening his words would catch it |
| L0107 | NO | |
| L0108 | NO | |
| L0109 | YES | chair's relay "VOID n=39" taken as primary; opening the ledger gave NOT-RUN n=40 |
| L0110 | YES | "verbatim" quote taken from a copy not the source; reopening the source shows the elision |
| L0111 | NO | |
| L0112 | NO | |
| L0113 | NO | |
| L0114 | NO | |
| L0115 | NO | |
| L0116 | NO | |
| L0117 | NO | |
| L0118 | NO | |
| L0119 | NO | |
| L0120 | NO | |
| L0121 | NO | |
| L0122 | NO | |
| L0123 | NO | |
| L0124 | NO | |
| L0125 | YES | handoff section 9 instruction was a stale copy of state; reopening the tree before obeying removes the near-miss |
| L0126 | NO | |
| L0127 | NO | |
| L0128 | NO | |
| L0129 | NO | |
| L0130 | NO | |
| L0131 | NO | |
| L0132 | NO | |
| L0133 | NO | |
| L0134 | NO | |
| L0135 | NO | |
| L0136 | NO | |
| L0137 | NO | |
| L0138 | NO | |
| L0139 | NO | |
| L0140 | NO | |
| L0141 | NO | |
| L0142 | NO | |
| L0143 | NO | |
| L0144 | NO | |
| L0145 | NO | |
| L0146 | NO | |
| L0147 | PARTLY | map carried a stale "pending" state twelve days; reopening the code/commit shows it done |
| L0148 | NO | |
| L0149 | NO | |
| L0150 | NO | |
| L0151 | NO | |
| L0152 | NO | |
| L0153 | NO | |
| L0154 | NO | |
| L0155 | NO | |
| L0156 | NO | |
| L0157 | NO | |
| L0158 | NO | |
| L0159 | PARTLY | packet treated a generated copy as the source; opening the generator shows the real source |
| L0160 | NO | |
| L0161 | NO | |
| L0162 | REMOVE | skipped (marked REMOVE in the ledger) |
| L0163 | NO | |
| L0164 | NO | |
| L0165 | NO | |
| L0166 | NO | |
| L0167 | NO | |
| L0168 | NO | |
| L0169 | NO | |
| L0170 | NO | |
| L0171 | NO | |
| L0172 | NO | |
| L0173 | NO | |
| L0174 | NO | |
| L0175 | NO | |
| L0176 | NO | |
| L0177 | NO | |
| L0178 | NO | |
| L0179 | NO | |
| L0180 | NO | |
| L0181 | PARTLY | a relayed number was stale four minutes after relay; reopening the instrument gives the current figure |
| L0182 | NO | |
| L0183 | NO | |
| L0184 | NO | |
| L0185 | NO | |
| L0186 | NO | |
| L0187 | NO | |
| L0188 | NO | |
| L0189 | NO | |
| L0190 | NO | |
| L0191 | PARTLY | a concatenated copy of the master became a carrier within an hour; the root's fix discourages making it |
| L0192 | NO | |
| L0193 | NO | |
| L0194 | NO | |
| L0195 | NO | |
| L0196 | NO | |
| L0197 | YES | output cut at head -30 read as the whole, then relayed as a premise; reopening whole output corrects it |
| L0198 | NO | |
| L0199 | NO | |
| L0200 | NO | |
| L0201 | NO | |
| L0202 | NO | |
| L0203 | NO | |
| L0204 | NO | |
| L0205 | NO | |
| L0206 | NO | |
| L0207 | NO | |
| L0208 | NO | |
| L0209 | NO | |
| L0210 | NO | |
| L0211 | PARTLY | panes.json carried across machines and trusted; reopening real cwds on D would show 0 of 4 exist |
| L0212 | NO | |
| L0213 | NO | |
| L0214 | NO | |
| L0215 | NO | |
| L0216 | NO | |
| L0217 | NO | |
| L0218 | NO | |
| L0219 | NO | |
| L0220 | NO | |
| L0221 | NO | |
| L0222 | NO | |
| L0223 | NO | |
| L0224 | NO | |
| L0225 | NO | |
| L0226 | NO | |
| L0227 | NO | |
| L0228 | NO | |
| L0229 | PARTLY | chair copied a relayed size figure into the packet; reopening the file gives the real size |
| L0230 | NO | |
| L0231 | NO | |
| L0232 | NO | |
| L0233 | NO | |
| L0234 | NO | |
| L0235 | NO | |
| L0236 | NO | |
| L0237 | NO | |
| L0238 | NO | |
| L0239 | NO | |
| L0240 | NO | |
| L0241 | NO | |
| L0242 | NO | |
| L0243 | NO | |
| L0244 | NO | |
| L0245 | NO | |
| L0246 | NO | |
| L0247 | NO | |
| L0248 | NO | |
| L0249 | NO | |
| L0250 | NO | |
| L0251 | NO | |
| L0252 | NO | |
| L0253 | NO | |
| L0254 | NO | |
| L0255 | REMOVE | skipped (marked REMOVE in the ledger) |
| L0256 | NO | |
| L0257 | NO | |
| L0258 | NO | |
| L0259 | NO | |
| L0260 | PARTLY | SPINE kept saying "BUILT, running" after the ruling; reopening the ruling would catch the stale carrier |
| L0261 | NO | |
| L0262 | NO | |
| L0263 | NO | |
| L0264 | PARTLY | collated A's bars as verified from the hand-back; running or reopening the bars plain caught it |
| L0265 | NO | |
| L0266 | NO | |
| L0267 | NO | |
| L0268 | YES | stale SPINE status table (retriever "unbuilt") cited as primary; the closing commit on disk contradicted it |
| L0269 | NO | |
| L0270 | NO | |
| L0271 | NO | |
| L0272 | NO | |
| L0273 | NO | |
| L0274 | NO | |
| L0275 | NO | |
| L0276 | NO | |
| L0277 | NO | |
| L0278 | NO | |
| L0279 | NO | |
| L0280 | NO | |
| L0281 | NO | |
| L0282 | NO | |
| L0283 | NO | |
| L0284 | NO | |
| L0285 | NO | |
| L0286 | NO | |
| L0287 | NO | |
| L0288 | PARTLY | librarian read A as idle from the digest; opening A's pane/ledger shows stamp=working |
| L0289 | NO | |
| L0290 | YES | librarian took the [panes] digest (a copy) for the roster; opening the roster shows B alive |
| L0291 | NO | |
| L0292 | NO | |
| L0293 | NO | |
| L0294 | NO | |
| L0295 | NO | |
| L0296 | NO | |
| L0297 | NO | |
| L0298 | NO | |
| L0299 | REMOVE | skipped (marked REMOVE in the ledger) |
| L0300 | REMOVE | skipped (marked REMOVE in the ledger) |
| L0301 | PARTLY | reconstructed delivery time taken for the record; reopening the board row gives the real stamps |
| L0302 | NO | |
| L0303 | NO | |
| L0304 | NO | |
| L0305 | NO | |
| L0306 | NO | |
| L0307 | NO | |
| L0308 | NO | |
| L0309 | NO | |
| L0310 | NO | |
| L0311 | NO | |
| L0312 | NO | |
| L0313 | NO | |
| L0314 | NO | |
| L0315 | NO | |
| L0316 | NO | |
| L0317 | NO | |
| L0318 | PARTLY | CHANGELOG claim that E's diff landed trusted; opening the tree shows it never landed |
| L0319 | NO | |
| L0320 | NO | |
| L0321 | NO | |
| L0322 | NO | |
| L0323 | NO | |
| L0324 | NO | |
| L0325 | NO | |
| L0326 | NO | |
| L0327 | NO | |
| L0328 | NO | |
| L0329 | NO | |
| L0330 | NO | |
| L0331 | NO | |
| L0332 | NO | |
| L0333 | NO | |
| L0334 | NO | |
| L0335 | NO | |
| L0336 | NO | |
| L0337 | NO | |
| L0338 | NO | |
| L0339 | NO | |
| L0340 | NO | |
| L0341 | NO | |
| L0342 | NO | |
| L0343 | NO | |
| L0344 | NO | |
| L0345 | NO | |
| L0346 | PARTLY | compaction summaries drop 99.7% of corrections; the loss is the copy's, reopening originals bounds the damage |
| L0347 | NO | |
| L0348 | NO | |
| L0349 | NO | |
| L0350 | NO | |
| L0351 | NO | |
| L0352 | NO | |
| L0353 | NO | |
| L0354 | NO | |
| L0355 | NO | |
| L0356 | NO | |
| L0357 | NO | |
| L0358 | NO | |
| L0359 | NO | |
| L0360 | NO | |
| L0361 | NO | |
| L0362 | NO | |
| L0363 | NO | |
| L0364 | NO | |
| L0365 | NO | |
| L0366 | NO | |
| L0367 | NO | |
| L0368 | NO | |
| L0369 | NO | |
| L0370 | NO | |
| L0371 | NO | |
| L0372 | NO | |
| L0373 | NO | |
| L0374 | NO | |
| L0375 | NO | |
| L0376 | NO | |
| L0377 | NO | |
| L0378 | NO | |
| L0379 | NO | |
| L0380 | NO | |
| L0381 | NO | |
| L0382 | NO | |
| L0383 | NO | |
| L0384 | NO | |
| L0385 | PARTLY | carried beliefs with no as-of date trusted; reopening the original shows its age |
| L0386 | NO | |
| L0387 | NO | |
| L0388 | NO | |
| L0389 | NO | |
| L0390 | REMOVE | skipped (marked REMOVE in the ledger) |
| L0391 | NO | |
| L0392 | YES | state block carried figures with no as-of time and readers trusted them (HEADs 61 to 171 behind); reopening git gives the truth |
| L0393 | NO | |
| L0394 | NO | |
| L0395 | NO | |
| L0396 | YES | seat asked as if new about what its own 10-10 entry held; opening the shelf's own entry removes it |
| L0397 | NO | |
| L0398 | NO | |
| L0399 | NO | |
| L0400 | NO | |
| L0401 | NO | |
| L0402 | NO | |
| L0403 | NO | |
| L0404 | NO | |
| L0405 | NO | |
| L0406 | NO | |
| L0407 | NO | |
| L0408 | NO | |
| L0409 | REMOVE | skipped (marked REMOVE in the ledger) |
| L0410 | PARTLY | seat recalled the handles story from memory until it read its own 10-14 entry |
| L0411 | NO | |
| L0412 | NO | |
| L0413 | NO | |
| L0414 | NO | |
| L0415 | NO | |
| L0416 | NO | |
| L0417 | NO | |
| L0418 | NO | |
| L0419 | NO | |
| L0420 | NO | |
| L0421 | NO | |
| L0422 | NO | |
| L0423 | NO | |
| L0424 | NO | |
| L0425 | NO | |
| L0426 | NO | |
| L0427 | NO | |
| L0428 | NO | |
| L0429 | NO | |
| L0430 | NO | |
| L0431 | NO | |
| L0432 | NO | |
| L0433 | NO | |
| L0434 | NO | |
| L0435 | NO | |
| L0436 | NO | |
| L0437 | NO | |
| L0438 | NO | |
| L0439 | NO | |
| L0440 | NO | |
| L0441 | NO | |
| L0442 | NO | |
| L0443 | NO | |
| L0444 | NO | |
| L0445 | NO | |
| L0446 | NO | |
| L0447 | NO | |
| L0448 | NO | |
| L0449 | YES | seat took the compressed 09-07 note for the full account; opening the original entry gives the account |
| L0450 | NO | |
| L0451 | NO | |
| L0452 | NO | |
| L0453 | NO | |
| L0454 | NO | |
| L0455 | NO | |
| L0456 | NO | |
| L0457 | NO | |
| L0458 | NO | |
| L0459 | NO | |
| L0460 | NO | |
| L0461 | NO | |
| L0462 | NO | |
| L0463 | NO | |
| L0464 | NO | |
| L0465 | PARTLY | librarian said the stick "holds today's state" without opening the readback; opening it shows 9 of 9 tails mismatch |
| L0466 | NO | |
| L0467 | PARTLY | prior art read from a stale checkout at 0.4.9; reopening the current origin gives the real config |
| L0468 | NO | |
| L0469 | NO | |
| L0470 | NO | |
| L0471 | NO | |
| L0472 | PARTLY | seats read briefs from the running build's bundled copies; the disk original is not what they read |
| L0473 | NO | |
| L0474 | NO | |
| L0475 | NO | |
| L0476 | NO | |
| L0477 | NO | |
| L0478 | NO | |
| L0479 | NO | |
| L0480 | NO | |
| L0481 | NO | |
| L0482 | NO | |
| L0483 | NO | |
| L0484 | NO | |
| L0485 | NO | |
| L0486 | NO | |
| L0487 | NO | |
| L0488 | NO | |
| L0489 | NO | |
| L0490 | NO | |
| L0491 | NO | |
| L0492 | NO | |
| L0493 | NO | |
| L0494 | NO | |
| L0495 | NO | |
| L0496 | NO | |
| L0497 | NO | |
| L0498 | NO | |
| L0499 | NO | |
| L0500 | NO | |
| L0501 | NO | |
| L0502 | NO | |
| L0503 | NO | |
| L0504 | NO | |
| L0505 | NO | |
| L0506 | NO | |
| L0507 | NO | |
| L0508 | NO | |
| L0509 | NO | |
| L0510 | NO | |
| L0511 | NO | |
| L0512 | NO | |
| L0513 | NO | |
| L0514 | NO | |
| L0515 | NO | |
| L0516 | NO | |
| L0517 | NO | |
| L0518 | NO | |
| L0519 | NO | |
| L0520 | NO | |
| L0521 | NO | |
| L0522 | NO | |
| L0523 | NO | |
| L0524 | NO | |
| L0525 | NO | |
| L0526 | NO | |
| L0527 | NO | |
| L0528 | NO | |
| L0529 | NO | |
| L0530 | NO | |
| L0531 | NO | |
| L0532 | NO | |
| L0533 | NO | |
| L0534 | NO | |
| L0535 | NO | |
| L0536 | NO | |
| L0537 | NO | |
| L0538 | NO | |
| L0539 | NO | |
| L0540 | NO | |
| L0541 | NO | |
| L0542 | NO | |
| L0543 | NO | |
| L0544 | NO | |
| L0545 | NO | |
| L0546 | NO | |
| L0547 | NO | |
| L0548 | NO | |
| L0549 | NO | |
| L0550 | NO | |
| L0551 | PARTLY | the compaction summary lost 15 of 37 items and the push was ordered on it; reopening the pre-compaction record shows what was lost |
| L0552 | NO | |
| L0553 | NO | |
| L0554 | NO | |
| L0555 | NO | |
| L0556 | NO | |
| L0557 | NO | |
| L0558 | NO | |
| L0559 | NO | |
| L0560 | NO | |
| L0561 | NO | |
| L0562 | NO | |
| L0563 | NO | |
| L0564 | NO | |
| L0565 | YES | the briefs a fresh pane reads (build copies) were older than the repo originals; reading the repo originals removes the drift |
| L0566 | NO | |
| L0567 | NO | |
| L0568 | NO | |
| L0569 | NO | |
| L0570 | NO | |
| L0571 | NO | |
| L0572 | NO | |
| L0573 | NO | |
| L0574 | NO | |
| L0575 | NO | |
| L0576 | NO | |
| L0577 | NO | |
| L0578 | NO | |
| L0579 | NO | |
| L0580 | NO | |
| L0581 | NO | |
| L0582 | NO | |
| L0583 | NO | |
| L0584 | NO | |
| L0585 | PARTLY | relayed LUFS figure trusted; opening the delivered mix shows -11.1 |
| L0586 | NO | |
| L0587 | PARTLY | a stale ring (O had withdrawn the bug 12 s earlier) went into a plan; opening O's state shows no bug |
| L0588 | NO | |
| L0589 | NO | |
| L0590 | NO | |
| L0591 | NO | |
| L0592 | NO | |
| L0593 | NO | |
| L0594 | NO | |
| L0595 | NO | |
| L0596 | NO | |
| L0597 | NO | |
| L0598 | NO | |
| L0599 | NO | |
| L0600 | NO | |
| L0601 | NO | |
| L0602 | NO | |
| L0603 | NO | |
| L0604 | NO | |
| L0605 | NO | |
| L0606 | NO | |
| L0607 | NO | |
| L0608 | NO | |
| L0609 | NO | |
| L0610 | PARTLY | his words survive one compaction not two, and the push was ordered on a summary; reopening the original words shows the gap |
| L0611 | NO | |
| L0612 | NO | |
| L0613 | NO | |
| L0614 | NO | |
| L0615 | NO | |
| L0616 | NO | |
| L0617 | NO | |
| L0618 | NO | |
| L0619 | NO | |
| L0620 | NO | |
| L0621 | NO | |
| L0622 | NO | |
| L0623 | NO | |
| L0624 | NO | |
| L0625 | NO | |
| L0626 | NO | |
| L0627 | NO | |
| L0628 | NO | |
| L0629 | YES | seat asked questions his 11-03 message, held in D's transcript tail, had answered; opening the tail first removes the question |
| L0630 | NO | |
| L0631 | NO | |
| L0632 | NO | |
| L0633 | NO | |
| L0634 | YES | summary of his second-bank sketch dropped the problem while the originals sat whole; opening the originals restores it |
| L0635 | NO | |
| L0636 | PARTLY | About block was a stale copy of the README; opening the README shows the difference |
| L0637 | NO | |
| L0638 | NO | |
| L0639 | NO | |
| L0640 | NO | |
| L0641 | NO | |
| L0642 | NO | |
| L0643 | NO | |
| L0644 | NO | |
| L0645 | PARTLY | correction sealed in July not followed; opening the sealed card at the point of use would show it |
| L0646 | NO | |
| L0647 | NO | |
| L0648 | NO | |
| L0649 | NO | |
| L0650 | NO | |
| L0651 | NO | |
| L0652 | NO | |
| L0653 | NO | |
| L0654 | NO | |
| L0655 | NO | |
| L0656 | NO | |
| L0657 | NO | |
| L0658 | NO | |
| L0659 | NO | |
| L0660 | NO | |
| L0661 | NO | |
| L0662 | NO | |
| L0663 | NO | |
| L0664 | NO | |
| L0665 | NO | |
| L0666 | NO | |
| L0667 | NO | |
| L0668 | NO | |
| L0669 | NO | |
| L0670 | NO | |
| L0671 | NO | |
| L0672 | NO | |
| L0673 | NO | |
| L0674 | NO | |
| L0675 | NO | |
| L0676 | NO | |
| L0677 | NO | |
| L0678 | NO | |
| L0679 | NO | |
| L0680 | NO | |
| L0681 | NO | |
| L0682 | NO | |
| L0683 | NO | |
| L0684 | NO | |
| L0685 | NO | |
| L0686 | NO | |
| L0687 | NO | |
| L0688 | NO | |
| L0689 | NO | |
| L0690 | NO | |
| L0691 | NO | |
| L0692 | NO | |
| L0693 | NO | |
| L0694 | NO | |
| L0695 | NO | |
| L0696 | NO | |
| L0697 | NO | |
| L0698 | NO | |
| L0699 | YES | librarian trusted D's handoff ("two fixes on D only") over the remote, which D had pushed after the handoff; asking origin removes the error |
| L0700 | NO | |
| L0701 | NO | |
| L0702 | NO | |
| L0703 | YES | stale carriers (brief "open", handoff "test never ran") trusted over the ledger that filed it; each reader opens the primary instead |
| L0704 | NO | |
| L0705 | NO | |
| L0706 | NO | |
| L0707 | NO | |
| L0708 | NO | |
| L0709 | NO | |
| L0710 | NO | |
| L0711 | NO | |
| L0712 | NO | |
| L0713 | NO | |
| L0714 | NO | |
| L0715 | NO | |
| L0716 | NO | |
| L0717 | NO | |
| L0718 | NO | |
| L0719 | NO | |
| L0720 | NO | |
| L0721 | NO | |
| L0722 | NO | |
| L0723 | NO | |
| L0724 | NO | |
| L0725 | NO | |
| L0726 | NO | |
| L0727 | NO | |
| L0728 | NO | |
| L0729 | NO | |
| L0730 | NO | |
| L0731 | NO | |
| L0732 | NO | |
| L0733 | PARTLY | seat took "are u sure" for the desktop seat's insight by shape; the source line was on disk, opening it would attribute it |
| L0734 | YES | BOOT :62 carrier kept teaching "mirror = failure" for 15 weeks after the 08-23 correction; every reader trusted the carrier, not the correction |
| L0735 | NO | |
| L0736 | NO | |
| L0737 | PARTLY | instructions still carry the isolation wording after the definition changed; a stale carrier trusted |
| L0738 | NO | |
| L0739 | NO | |
| L0740 | NO | |
| L0741 | NO | |
| L0742 | NO | |
| L0743 | NO | |
| L0744 | NO | |
| L0745 | NO | |
| L0746 | NO | |
| L0747 | NO | |
| L0748 | NO | |
| L0749 | NO | |
| L0750 | NO | |
| L0751 | NO | |
| L0752 | NO | |
| L0753 | NO | |
| L0754 | NO | |
| L0755 | NO | |
| L0756 | NO | |
| L0757 | NO | |
| L0758 | NO | |
| L0759 | NO | |
| L0760 | NO | |
| L0761 | NO | |
| L0762 | NO | |
| L0763 | NO | |
| L0764 | NO | |
| L0765 | NO | |
| L0766 | NO | |
| L0767 | NO | |
| L0768 | NO | |
| L0769 | NO | |
| L0770 | NO | |
| L0771 | NO | |
| L0772 | NO | |
| L0773 | NO | |
| L0774 | NO | |
| L0775 | NO | |
| L0776 | NO | |
| L0777 | NO | |
| L0778 | YES | handoff stated "not pushed, his call" without reopening the remote; the Third Place's handoff showed it pushed |
| L0779 | NO | |
| L0780 | NO | |
| L0781 | NO | |
| L0782 | NO | |
| L0783 | NO | |
| L0784 | NO | |
| L0785 | NO | |
| L0786 | NO | |
| L0787 | NO | |
| L0788 | PARTLY | D's handoff dropped L's open list; reopening L's original list on arrival would have caught the drop |
| L0789 | NO | |
| L0790 | NO | |
| L0791 | NO | |
| L0792 | NO | |
| L0793 | NO | |
| L0794 | PARTLY | L's handoff step 1 did not apply on D (no rebuilder, wrong path); reopening D's state before acting shows it |
| L0795 | YES | handoff's contradiction labels given to the keeper without opening briefs/dreamzone3_design.md, which held more |
| L0796 | NO | |
| L0797 | YES | D652 plan did not carry his item 23 or E's L161 look study, both on disk; reopening the originals puts them in the plan |
| L0798 | NO | |
| L0799 | NO | |
| L0800 | NO | |
| L0801 | PARTLY | librarian's reading of a reviewer's description carried into E's sheets as a rule; his word was the opposite |
| L0802 | NO | |
| L0803 | NO | |
| L0804 | NO | |
| L0805 | NO | |
| L0806 | PARTLY | sheets, bible and legends carried "no buffs" after his items 51-52 said otherwise; stale carriers |
| L0807 | NO | |
| L0808 | NO | |
| L0809 | NO | |
| L0810 | NO | |
| L0811 | NO | |
| L0812 | NO | |
| L0813 | NO | |
| L0814 | NO | |
| L0815 | NO | |
| L0816 | NO | |
| L0817 | NO | |
| L0818 | NO | |
| L0819 | NO | |
| L0820 | NO | |
| L0821 | NO | |
| L0822 | NO | |
| L0823 | NO | |
| L0824 | NO | |
| L0825 | NO | |
| L0826 | NO | |
| L0827 | NO | |
| L0828 | NO | |
| L0829 | NO | |
| L0830 | NO | |
| L0831 | NO | |
| L0832 | NO | |
| L0833 | NO | |
| L0834 | NO | |
| L0835 | NO | |
| L0836 | NO | |
| L0837 | NO | |
| L0838 | NO | |
| L0839 | NO | |
| L0840 | NO | |
| L0841 | NO | |
| L0842 | NO | |
| L0843 | NO | |
| L0844 | NO | |
| L0845 | NO | |
| L0846 | NO | |
| L0847 | NO | |
| L0848 | NO | |
| L0849 | NO | |
| L0850 | NO | |
| L0851 | NO | |
| L0852 | NO | |
| L0853 | NO | |
| L0854 | NO | |
| L0855 | NO | |
| L0856 | NO | |
| L0857 | NO | |
| L0858 | NO | |
| L0859 | NO | |
| L0860 | NO | |
| L0861 | NO | |
| L0862 | NO | |
| L0863 | NO | |
| L0864 | NO | |
| L0865 | NO | |
| L0866 | NO | |
| L0867 | NO | |
| L0868 | NO | |
| L0869 | NO | |
| L0870 | NO | |
| L0871 | NO | |
| L0872 | NO | |
| L0873 | NO | |
| L0874 | NO | |
| L0875 | NO | |
| L0876 | NO | |
| L0877 | NO | |
| L0878 | NO | |
| L0879 | NO | |
| L0880 | NO | |
| L0881 | NO | |
| L0882 | NO | |
| L0883 | NO | |
| L0884 | NO | |
| L0885 | NO | |
| L0886 | NO | |
| L0887 | NO | |
| L0888 | NO | |
| L0889 | NO | |
| L0890 | NO | |
| L0891 | NO | |
| L0892 | NO | |
| L0893 | NO | |
| L0894 | NO | |
| L0895 | NO | |
| L0896 | NO | |
| L0897 | NO | |
| L0898 | NO | |
| L0899 | NO | |
| L0900 | NO | |
| L0901 | NO | |
| L0902 | NO | |
| L0903 | NO | |
| L0904 | NO | |
| L0905 | NO | |
| L0906 | NO | |
| L0907 | NO | |
| L0908 | NO | |
| L0909 | NO | |
| L0910 | NO | |
| L0911 | NO | |
| L0912 | NO | |
| L0913 | NO | |
| L0914 | NO | |
| L0915 | PARTLY | after a compaction only the handoff rose; opening the record would restore the rest of the room |
| L0916 | NO | |
| L0917 | NO | |
| L0918 | NO | |
| L0919 | NO | |
| L0920 | NO | |
| L0921 | NO | |
| L0922 | NO | |
| L0923 | NO | |
| L0924 | NO | |
| L0925 | NO | |
| L0926 | NO | |
| L0927 | NO | |
| L0928 | NO | |
| L0929 | NO | |
| L0930 | NO | |
| L0931 | NO | |
| L0932 | NO | |
| L0933 | NO | |
| L0934 | NO | |
| L0935 | NO | |
| L0936 | NO | |
| L0937 | NO | |
| L0938 | NO | |
| L0939 | NO | |
| L0940 | NO | |
| L0941 | NO | |
| L0942 | NO | |
| L0943 | NO | |
| L0944 | NO | |
| L0945 | NO | |
| L0946 | NO | |
| L0947 | NO | |
| L0948 | NO | |
| L0949 | NO | |
| L0950 | NO | |
| L0951 | NO | |
| L0952 | NO | |
| L0953 | NO | |
| L0954 | NO | |
| L0955 | NO | |
| L0956 | NO | |
| L0957 | NO | |
| L0958 | YES | wake plan carried the retriever as "registered, unbuilt" while the research file says CLOSED 2026-08-31; opening the file shows it |
| L0959 | NO | |
| L0960 | NO | |
| L0961 | NO | |
| L0962 | NO | |
| L0963 | NO | |
| L0964 | NO | |
| L0965 | NO | |
| L0966 | NO | |
| L0967 | NO | |
| L0968 | NO | |
| L0969 | NO | |
| L0970 | NO | |
| L0971 | PARTLY | digest row line preferred an earlier long report over the short API error, hiding the dead pane; opening the pane would show it |
| L0972 | NO | |
| L0973 | NO | |
| L0974 | NO | |
| L0975 | NO | |
| L0976 | NO | |
| L0977 | NO | |
| L0978 | NO | |
| L0979 | NO | |
| L0980 | NO | |
| L0981 | NO | |
| L0982 | NO | |
| L0983 | NO | |
| L0984 | NO | |
| L0985 | NO | |
| L0986 | NO | |
| L0987 | NO | |
| L0988 | NO | |
| L0989 | NO | |
| L0990 | NO | |
| L0991 | NO | |
| L0992 | NO | |
| L0993 | NO | |
| L0994 | NO | |
| L0995 | NO | |
| L0996 | NO | |
| L0997 | NO | |
| L0998 | NO | |
| L0999 | NO | |
| L1000 | NO | |
| L1001 | NO | |
| L1002 | NO | |
| L1003 | NO | |
| L1004 | NO | |
| L1005 | YES | shelf (a copy) was built from the old tree after the fetch was cut; reading origin or the pull result before trusting the shelf catches it |
| L1006 | YES | two handoffs read through a 260-character cut and dispatched from; opening them whole and the night's notes removes it |
| L1007 | NO | |
| L1008 | NO | |
| L1009 | NO | |
| L1010 | NO | |
| L1011 | YES | level-one ranked from swarm summaries (6 to 6 WRONG per file); reading the primaries would have caught the wrong headline |
| L1012 | NO | |
| L1013 | NO | |
| L1014 | NO | |
| L1015 | NO | |
| L1016 | NO | |
| L1017 | NO | |
| L1018 | NO | |
| L1019 | NO | |
| L1020 | NO | |
| L1021 | NO | |
| L1022 | NO | |
| L1023 | NO | |
| L1024 | NO | |
| L1025 | NO | |
| L1026 | NO | |
| L1027 | NO | |
| L1028 | NO | |
| L1029 | NO | |
| L1030 | NO | |
| L1031 | NO | |
| L1032 | NO | |
| L1033 | NO | |
| L1034 | NO | |
| L1035 | NO | |
| L1036 | PARTLY | an all-clear relayed as true for 50 seconds; asking the Third Place's process list before relaying would show the overlap |
| L1037 | NO | |
| L1038 | NO | |
| L1039 | NO | |
| L1040 | NO | |
| L1041 | NO | |
| L1042 | NO | |
| L1043 | NO | |
| L1044 | NO | |
| L1045 | NO | |
| L1046 | NO | |
| L1047 | NO | |
| L1048 | NO | |
| L1049 | NO | |
| L1050 | NO | |
| L1051 | NO | |
| L1052 | NO | |
| L1053 | NO | |
| L1054 | NO | |
| L1055 | NO | |
| L1056 | NO | |
| L1057 | NO | |
| L1058 | NO | |
| L1059 | NO | |
| L1060 | NO | |
| L1061 | NO | |
| L1062 | NO | |
| L1063 | NO | |
| L1064 | NO | |
| L1065 | NO | |
| L1066 | YES | "I checked the report itself" when a small model's quote was read; opening the report is the fix |
| L1067 | NO | |
| L1068 | NO | |
| L1069 | NO | |
| L1070 | NO | |
| L1071 | YES | critic found 13 offers resting on summary or memory and 14 sources never opened; opening the sources removes it |
| L1072 | NO | |
| L1073 | NO | |
| L1074 | NO | |
| L1075 | NO | |
| L1076 | NO | |
| L1077 | YES | keeper caught the librarian answering from its own last output instead of the source; opening the source removes it |
| L1078 | NO | |
| L1079 | PARTLY | the [panes] digest hid a failing pane; opening the pane would show the error |
| L1080 | NO | |
| L1081 | NO | |
| L1082 | NO | |
| L1083 | PARTLY | letter says its filename is in front of the seat at any budget; the light shelf does not carry it, a carrier trusted |
| L1084 | PARTLY | brief says call_chair refuses a ring with no trailer; D runs light so 1,018 were delivered; stale carrier trusted |
| L1085 | NO | |
| L1086 | NO | |
| L1087 | NO | |
| L1088 | PARTLY | installed hooks (copies) are older than the repo source; measurements run on copies not originals |
| L1089 | NO | |
| L1090 | NO | |
| L1091 | NO | |
| L1092 | NO | |
| L1093 | NO | |
| L1094 | NO | |
| L1095 | NO | |
| L1096 | PARTLY | seat-substrates note (a copy) said restart changes model; the run's real state differs |
| L1097 | NO | |
| L1098 | NO | |
| L1099 | NO | |
| L1100 | NO | |
| L1101 | NO | |
| L1102 | NO | |
| L1103 | NO | |
| L1104 | NO | |
| L1105 | NO | |
| L1106 | NO | |
| L1107 | NO | |
| L1108 | NO | |
| L1109 | NO | |
| L1110 | NO | |
| L1111 | NO | |
| L1112 | NO | |
| L1113 | NO | |
| L1114 | NO | |
| L1115 | NO | |
| L1116 | NO | |
| L1117 | NO | |
| L1118 | NO | |
| L1119 | NO | |
| L1120 | NO | |
| L1121 | NO | |
| L1122 | NO | |
| L1123 | NO | |

## What I did not open

The primaries of every row (I scored from the ledger text). The groups' files and other scorers' files (barred by the task). The
roots other than R06. The transcripts and C:/Consonance/data. Whether the 10% of ledger rows the second reader called
unreliable change any verdict here; rows marked as commit-subject rows were scored on their wording only.
