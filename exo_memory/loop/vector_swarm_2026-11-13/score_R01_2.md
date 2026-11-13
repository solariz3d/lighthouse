# Score R01, scorer 2: "A claim of fact is typed from memory, not copied from an instrument run"

Scorer 2 for root R01. I did not propose it. Method: read the R01 entry in 00_roots.md only, then went through every
row of 00_ledger.md (1,123 ids; 7 marked REMOVE by the second reader were skipped: L0029 L0162 L0255 L0299 L0300 L0390
L0409; 1,116 scored). For each row I asked: would a real fix of THIS root have prevented the incident? YES needs a
one-line mechanism for that row; if the root had to be stretched, the row is NO. I read the ledger row text in whole
lines [read: sed over 00_ledger.md]. I did not open the primaries behind the rows (see the last section).

The test used for YES: a figure, time, sha, count, line citation, "no X exists" or state claim that was typed from
memory, a summary or a cut read, where one command in the same call would have printed the true value, and the wrong
claim is the incident itself. PARTLY: the typed claim is one part of the incident, or the fix would have made it
smaller or caught it sooner. NO: the fault is a bad design, a stalled delivery, an installed copy older than the repo,
an instrument that ran but was wrong, a keeper catch about tone or taste, a test or build failure, or a resource limit.
Rows where an instrument ran and printed the wrong value (a flawed grep, a misread run) are NO: the root says no
command ran.

## Totals

- YES: 155
- PARTLY: 88
- NO: 873
- Scored: 1,116 (1,123 minus 7 REMOVE rows) [read: counted by script over this table]

Share: YES 13.9%, YES plus PARTLY 21.8% of scored rows [inferred from the counts above].

## Cost covered (YES rows only)

- Minutes: 46, from two rows. L0585 states "caught 43 min later" and L0587 states "fixed 3 min later". Both are
  detection delays, not total cost, and the ledger gives no wider figure for either.
- Tokens: 0 stated on any YES row.
- YES rows with no minutes or tokens recorded: 153 of 155 (every YES row except L0585 and L0587). Several carry a
  non-numeric cost (a wrong ruling, a keeper told to wait, a plan ranked on the wrong figure, one re-run) and are
  marked in the table.
- The large costs in the ledger (L0010 42.1 M tokens, L0241 4 h 24 m, L0257 826 k tokens, L0371 18.1 M tokens,
  L0469 about 7.5 G cache reads) sit on rows I scored NO. Their causes (idle compaction, a switch of model, a queue
  hold) are not typed claims. [inferred] So this root covers many incidents and little of the recorded cost.

## Table (every ledger id; mechanism for YES and PARTLY)

| id | verdict | mechanism for YES or PARTLY |
|---|---|---|
| L0001 | NO | |
| L0002 | NO | |
| L0003 | NO | |
| L0004 | NO | |
| L0005 | NO | |
| L0006 | NO | |
| L0007 | YES | model id read from a log or command, not certified from the inside |
| L0008 | NO | |
| L0009 | NO | |
| L0010 | NO | |
| L0011 | NO | |
| L0012 | NO | |
| L0013 | NO | |
| L0014 | YES | self-attribution taken from own summary line; checking the source would refuse it |
| L0015 | PARTLY | clock time typed (7:58) when the pulse printed 07:56:42; the scorer fault is not covered |
| L0016 | NO | |
| L0017 | PARTLY | the instrument counts exactly the turns carrying values with no matching tool call |
| L0018 | NO | |
| L0019 | NO | |
| L0020 | NO | |
| L0021 | NO | |
| L0022 | NO | |
| L0023 | NO | |
| L0024 | NO | |
| L0025 | NO | |
| L0026 | NO | |
| L0027 | NO | |
| L0028 | NO | |
| L0030 | NO | |
| L0031 | NO | |
| L0032 | NO | |
| L0033 | YES | percentage direction computed by command (37.2% above, not 37% low) |
| L0034 | NO | |
| L0035 | YES | harness capability read from the tool list, not asserted |
| L0036 | YES | "written to the notes" checked against the file's last append |
| L0037 | NO | |
| L0038 | NO | |
| L0039 | NO | |
| L0040 | YES | shelf state read from the SessionStart header, not framed from memory |
| L0041 | NO | |
| L0042 | NO | |
| L0043 | YES | running find() and reading the carrier shows the anchor; ruling no longer typed from memory |
| L0044 | YES | reading the sweep code shows a one-shot migration, not "half-built" |
| L0045 | PARTLY | re-reading the header before the deadline claim |
| L0046 | NO | |
| L0047 | YES | claim checked before dispatch; the wrong ruling followed only from the unverified brief [cost: one wrong ruling] |
| L0048 | NO | |
| L0049 | YES | saving figure re-derived by command (521k, not 642k) |
| L0050 | NO | |
| L0051 | NO | |
| L0052 | NO | |
| L0053 | YES | citation opened before being cited |
| L0054 | YES | citation opened and commit author read before attributing |
| L0055 | YES | "never journaled" re-derived by git log when written |
| L0056 | YES | grep for the stage name and open install.ps1:633 before citing |
| L0057 | PARTLY | loud-vs-silent conflict claim checked against the actual merge |
| L0058 | NO | |
| L0059 | YES | git cat-file on the sha before relaying it |
| L0060 | NO | |
| L0061 | PARTLY | pattern extraction instead of a hand list of files |
| L0062 | PARTLY | glob instead of hand list; the false-green instruments are not covered |
| L0063 | YES | path asserted from memory; a command shows the redirected Desktop |
| L0064 | PARTLY | "5 claims" and the misread case checked before publishing |
| L0065 | NO | |
| L0066 | YES | git cat-file on the sha before citing it |
| L0067 | NO | |
| L0068 | NO | |
| L0069 | NO | |
| L0070 | NO | |
| L0071 | YES | operational state read from the board (0 rows) not inferred from timestamps |
| L0072 | YES | criteria scored by reading, not typed as "progressive" |
| L0073 | YES | score and document count read from the files |
| L0074 | NO | |
| L0075 | NO | |
| L0076 | NO | |
| L0077 | NO | |
| L0078 | NO | |
| L0079 | NO | |
| L0080 | NO | |
| L0081 | YES | date arithmetic by command (10 weeks, not 14 months) |
| L0082 | PARTLY | ledger row provenance counted before using the rate |
| L0083 | YES | grep count of tracked files (61, not 2) |
| L0084 | PARTLY | full-universe grep instead of one phrasing |
| L0085 | NO | |
| L0086 | YES | running the scanner on the handle shows it partly visible |
| L0087 | YES | baseline derived by command, no hand figure under a falsifier |
| L0088 | YES | running the check before saying one line turns it green |
| L0089 | NO | |
| L0090 | NO | |
| L0091 | PARTLY | overlap count taken from the tool (4), not hand-counted (5) |
| L0092 | NO | |
| L0093 | NO | |
| L0094 | NO | |
| L0095 | NO | |
| L0096 | YES | absence claim checked by a search of the transcripts before the headline |
| L0097 | YES | token/byte figure re-derived for the named object and date |
| L0098 | NO | |
| L0099 | PARTLY | behaviour of the route tested, not inferred from the MCP text |
| L0100 | PARTLY | cap arithmetic and files needing rebuild run by command before the ruling |
| L0101 | NO | |
| L0102 | NO | |
| L0103 | PARTLY | own record opened before endorsing a cause |
| L0104 | NO | |
| L0105 | PARTLY | estimate computed over the shelf, not the whole wake context |
| L0106 | NO | |
| L0107 | YES | grep across tiers before "never existed"; check output shown in the same call |
| L0108 | NO | |
| L0109 | YES | n and status copied from the ledger, not the relay |
| L0110 | YES | quote copied from its source by command, not typed "verbatim" |
| L0111 | NO | |
| L0112 | NO | |
| L0113 | NO | |
| L0114 | NO | |
| L0115 | NO | |
| L0116 | YES | count by wc (6, not 7) |
| L0117 | YES | state names read from the code, not from a two-word grep |
| L0118 | YES | tier sums and card count by command (8 of 12) |
| L0119 | PARTLY | rows read before a claim from a grep count |
| L0120 | PARTLY | regex output read before stamping CONFIRMED |
| L0121 | PARTLY | union computed by command (373), not a sum |
| L0122 | NO | |
| L0123 | NO | |
| L0124 | NO | |
| L0125 | NO | |
| L0126 | PARTLY | hand count replaced by wc |
| L0127 | NO | |
| L0128 | PARTLY | printed pattern is the one that ran; union not sum |
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
| L0144 | PARTLY | two claims (12 pronoun hits, SEED fallback) re-counted before the ring |
| L0145 | NO | |
| L0146 | NO | |
| L0147 | PARTLY | map state checked against the repo before listing a flip as pending |
| L0148 | NO | |
| L0149 | NO | |
| L0150 | NO | |
| L0151 | NO | |
| L0152 | NO | |
| L0153 | YES | counts taken at one commit by command; no "undercount" asserted from two figures |
| L0154 | NO | |
| L0155 | NO | |
| L0156 | NO | |
| L0157 | YES | UI line written from the code (Greenwich), not from memory of it |
| L0158 | NO | |
| L0159 | PARTLY | packet path checked for generated-file status |
| L0160 | YES | de-gender count taken from the artifact (18/5), not the map |
| L0161 | NO | |
| L0163 | NO | |
| L0164 | NO | |
| L0165 | NO | |
| L0166 | YES | refusal count re-derived by command (2 of 9, not 7) |
| L0167 | NO | |
| L0168 | PARTLY | run over a red suite checked before the figure was quoted |
| L0169 | YES | "K mid-edit" read from the worktree, not assumed |
| L0170 | YES | manifest read before saying what it ships |
| L0171 | YES | file opened before citing :133 (it is :146) |
| L0172 | YES | git status/ls-files before saying CLEAN.md is untracked |
| L0173 | PARTLY | LIB test run before writing "red-first on LIB" |
| L0174 | YES | proof run output copied; it failed |
| L0175 | NO | |
| L0176 | NO | |
| L0177 | NO | |
| L0178 | NO | |
| L0179 | NO | |
| L0180 | NO | |
| L0181 | NO | |
| L0182 | PARTLY | packet and headline numbers re-derived; gate existence grepped before sending E |
| L0183 | NO | |
| L0184 | NO | |
| L0185 | NO | |
| L0186 | PARTLY | detector's stated limit read before listing it as a reach |
| L0187 | NO | |
| L0188 | NO | |
| L0189 | NO | |
| L0190 | YES | overlap, ratio and percentage computed by command |
| L0191 | NO | |
| L0192 | YES | cited files opened before the plan named them |
| L0193 | NO | |
| L0194 | PARTLY | screen row count by command; line opened after a grep counted it |
| L0195 | NO | |
| L0196 | NO | |
| L0197 | YES | full output read, not head -30, before "do not yet appear as rows" |
| L0198 | PARTLY | chair status read before "you are idle" |
| L0199 | PARTLY | each digest written with its function name |
| L0200 | YES | file count by command (50 files), not typed 46 of 47 |
| L0201 | NO | |
| L0202 | NO | |
| L0203 | YES | "no rows" and "6 of 6" read from the printed run (9) |
| L0204 | PARTLY | row counts checked before naming the audit tell as the compaction rule |
| L0205 | NO | |
| L0206 | YES | each of the three claims checked by command |
| L0207 | NO | |
| L0208 | YES | figures copied from the run; causal clause checked (one skipped as identical) |
| L0209 | PARTLY | each digest carries sha256 or git-blob label |
| L0210 | NO | |
| L0211 | NO | |
| L0212 | YES | universal negative grepped beyond Rust, tauri commands included |
| L0213 | NO | |
| L0214 | YES | time read from the clock, not typed (stamp.js) |
| L0215 | NO | |
| L0216 | NO | |
| L0217 | NO | |
| L0218 | NO | |
| L0219 | PARTLY | claims about existence, transport and resume checked before the plan |
| L0220 | NO | |
| L0221 | NO | |
| L0222 | NO | |
| L0223 | PARTLY | address read from disk, source searched, prediction run |
| L0224 | NO | |
| L0225 | YES | process list read before telling the keeper whose run it was [cost: keeper told to wait for nothing] |
| L0226 | YES | token figure by command for the right seat (357,388 not 428,177) |
| L0227 | NO | |
| L0228 | NO | |
| L0229 | PARTLY | size figure copied from the file listing |
| L0230 | NO | |
| L0231 | NO | |
| L0232 | NO | |
| L0233 | PARTLY | git stash/branch list read before calling it a discard |
| L0234 | NO | |
| L0235 | NO | |
| L0236 | NO | |
| L0237 | NO | |
| L0238 | PARTLY | claim about why no record exists checked against code |
| L0239 | NO | |
| L0240 | NO | |
| L0241 | NO | |
| L0242 | NO | |
| L0243 | NO | |
| L0244 | NO | |
| L0245 | NO | |
| L0246 | NO | |
| L0247 | YES | lap id read from the ledger, not derived from the report tail |
| L0248 | NO | |
| L0249 | NO | |
| L0250 | YES | shell size measured (about 4%) before the claim |
| L0251 | PARTLY | intake byte count measured before the ruling was repeated |
| L0252 | NO | |
| L0253 | NO | |
| L0254 | NO | |
| L0256 | NO | |
| L0257 | NO | |
| L0258 | NO | |
| L0259 | NO | |
| L0260 | NO | |
| L0261 | NO | |
| L0262 | YES | hand-back file opened (all 40 lines) before collating or ringing |
| L0263 | NO | |
| L0264 | NO | |
| L0265 | NO | |
| L0266 | YES | brief opened before a line was registered on its wording |
| L0267 | NO | |
| L0268 | NO | |
| L0269 | NO | |
| L0270 | NO | |
| L0271 | NO | |
| L0272 | NO | |
| L0273 | YES | Leave's code read before telling the keeper what it touches |
| L0274 | PARTLY | pipe-read and intake-cap guesses measured, not typed |
| L0275 | NO | |
| L0276 | NO | |
| L0277 | NO | |
| L0278 | NO | |
| L0279 | NO | |
| L0280 | NO | |
| L0281 | NO | |
| L0282 | PARTLY | helper's transcript read before "likely finished" |
| L0283 | NO | |
| L0284 | NO | |
| L0285 | NO | |
| L0286 | NO | |
| L0287 | NO | |
| L0288 | NO | |
| L0289 | NO | |
| L0290 | NO | |
| L0291 | NO | |
| L0292 | NO | |
| L0293 | NO | |
| L0294 | NO | |
| L0295 | YES | "already written" checked by grep of the memory tier |
| L0296 | NO | |
| L0297 | NO | |
| L0298 | NO | |
| L0301 | YES | delivery time read from the board row, not reconstructed [cost: A and C dispatched on a wrong premise] |
| L0302 | NO | |
| L0303 | NO | |
| L0304 | NO | |
| L0305 | NO | |
| L0306 | NO | |
| L0307 | YES | "20:1x" read from the stamp instead of hand-made |
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
| L0318 | PARTLY | CHANGELOG claim checked against the diff |
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
| L0344 | PARTLY | worker state read before the "warm worker" claim |
| L0345 | NO | |
| L0346 | NO | |
| L0347 | NO | |
| L0348 | NO | |
| L0349 | NO | |
| L0350 | PARTLY | track identity checked against its source before it went in the brief [cost: a lap's work discarded] |
| L0351 | YES | p-value comparison written from the table, not typed ahead of it |
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
| L0376 | PARTLY | the census counts the share of claim errors where the check at hand was not run |
| L0377 | NO | |
| L0378 | NO | |
| L0379 | NO | |
| L0380 | NO | |
| L0381 | NO | |
| L0382 | NO | |
| L0383 | NO | |
| L0384 | NO | |
| L0385 | NO | |
| L0386 | PARTLY | each would-block row is a reply naming paths, shas or counts with no verified Sources line |
| L0387 | NO | |
| L0388 | NO | |
| L0389 | NO | |
| L0391 | NO | |
| L0392 | PARTLY | figures with as-of time; unpushed count read at write time |
| L0393 | NO | |
| L0394 | NO | |
| L0395 | NO | |
| L0396 | NO | |
| L0397 | YES | "does not exist" from one empty search; a second search finds the page |
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
| L0410 | YES | attribution read from the seat's own entry, not recalled |
| L0411 | NO | |
| L0412 | NO | |
| L0413 | PARTLY | count over the right file set by command (51, not 69) |
| L0414 | NO | |
| L0415 | NO | |
| L0416 | NO | |
| L0417 | NO | |
| L0418 | NO | |
| L0419 | YES | prism.js header read before attributing the blur to banding |
| L0420 | NO | |
| L0421 | PARTLY | cargo run at the pushed commit, not an earlier one |
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
| L0442 | PARTLY | keeper's yes re-read before saying the zips stay |
| L0443 | NO | |
| L0444 | NO | |
| L0445 | NO | |
| L0446 | NO | |
| L0447 | NO | |
| L0448 | NO | |
| L0449 | NO | |
| L0450 | NO | |
| L0451 | NO | |
| L0452 | NO | |
| L0453 | PARTLY | git ls-files/history checked before saying the note would be private |
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
| L0465 | PARTLY | readback command run before "holds today's state" |
| L0466 | NO | |
| L0467 | YES | config field grepped in the live checkout, not a stale 0.4.9 copy |
| L0468 | NO | |
| L0469 | NO | |
| L0470 | NO | |
| L0471 | NO | |
| L0472 | NO | |
| L0473 | NO | |
| L0474 | NO | |
| L0475 | PARTLY | eleven wrong librarian claims, mostly figures or existence claims typed |
| L0476 | PARTLY | README camber line copied from the code |
| L0477 | NO | |
| L0478 | NO | |
| L0479 | NO | |
| L0480 | NO | |
| L0481 | NO | |
| L0482 | NO | |
| L0483 | NO | |
| L0484 | NO | |
| L0485 | PARTLY | process list matched on the real image name before "not running" |
| L0486 | NO | |
| L0487 | NO | |
| L0488 | NO | |
| L0489 | YES | ls -la output read before saying the file was missing |
| L0490 | NO | |
| L0491 | NO | |
| L0492 | NO | |
| L0493 | NO | |
| L0494 | NO | |
| L0495 | YES | installed file hash printed by command, not typed |
| L0496 | NO | |
| L0497 | NO | |
| L0498 | NO | |
| L0499 | NO | |
| L0500 | NO | |
| L0501 | PARTLY | crossing read from the geometry, not chunk names |
| L0502 | NO | |
| L0503 | NO | |
| L0504 | NO | |
| L0505 | NO | |
| L0506 | NO | |
| L0507 | YES | lean measured by command (9.4-10.6 deg), not drafted as 18 |
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
| L0528 | YES | "dead code" verdict checked by running the test |
| L0529 | NO | |
| L0530 | NO | |
| L0531 | YES | the 39 tools actually run before "never seen catching" |
| L0532 | PARTLY | newest-mention dates and denial counts read from sources |
| L0533 | NO | |
| L0534 | NO | |
| L0535 | NO | |
| L0536 | NO | |
| L0537 | NO | |
| L0538 | NO | |
| L0539 | NO | |
| L0540 | NO | |
| L0541 | NO | |
| L0542 | YES | letters.json signer read before crediting M's letters |
| L0543 | NO | |
| L0544 | NO | |
| L0545 | NO | |
| L0546 | PARTLY | total size by command |
| L0547 | NO | |
| L0548 | NO | |
| L0549 | NO | |
| L0550 | NO | |
| L0551 | NO | |
| L0552 | NO | |
| L0553 | NO | |
| L0554 | NO | |
| L0555 | NO | |
| L0556 | NO | |
| L0557 | YES | whole setup window read before saying INTERRUPTED rows are not offered |
| L0558 | NO | |
| L0559 | NO | |
| L0560 | NO | |
| L0561 | NO | |
| L0562 | NO | |
| L0563 | NO | |
| L0564 | NO | |
| L0565 | NO | |
| L0566 | YES | git grep run on B.md; build time converted by command |
| L0567 | NO | |
| L0568 | PARTLY | "49 hooks" counted (24); rate checked by reading the cases |
| L0569 | NO | |
| L0570 | NO | |
| L0571 | NO | |
| L0572 | PARTLY | figure taken from the shipped writer, not a private regenerate |
| L0573 | YES | file-in-run claim grepped from the run logs |
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
| L0584 | YES | "never adjudicated" checked against B's 10-03 scoring |
| L0585 | YES | LUFS read from the meter output (-11.1) before relay [cost: 43 min] |
| L0586 | YES | line count by wc (13,933), not 13,085 |
| L0587 | YES | ring's claim reproduced before it went into a plan [cost: 3 min] |
| L0588 | YES | non-author look read from the commit record before "every part green" |
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
| L0610 | PARTLY | window count and all-clear checked against the items before the push order [cost: a push the chair had to hold] |
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
| L0625 | YES | ramp ratio to BANK_BAR computed (2.1x), not stated from the plan |
| L0626 | NO | |
| L0627 | NO | |
| L0628 | NO | |
| L0629 | NO | |
| L0630 | NO | |
| L0631 | NO | |
| L0632 | NO | |
| L0633 | NO | |
| L0634 | NO | |
| L0635 | NO | |
| L0636 | NO | |
| L0637 | NO | |
| L0638 | NO | |
| L0639 | YES | origin's heavy-run.js read before saying it handles a reused pid |
| L0640 | NO | |
| L0641 | NO | |
| L0642 | NO | |
| L0643 | YES | mutant total read from the run (120), not the count so far |
| L0644 | NO | |
| L0645 | NO | |
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
| L0657 | YES | git branch of the hold read before telling him it was held |
| L0658 | NO | |
| L0659 | NO | |
| L0660 | NO | |
| L0661 | NO | |
| L0662 | NO | |
| L0663 | YES | mutant count by wc (65) |
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
| L0691 | YES | test file name copied from the run, not typed |
| L0692 | NO | |
| L0693 | NO | |
| L0694 | NO | |
| L0695 | NO | |
| L0696 | NO | |
| L0697 | NO | |
| L0698 | NO | |
| L0699 | YES | git log on origin read before saying the fixes were on D only |
| L0700 | NO | |
| L0701 | NO | |
| L0702 | NO | |
| L0703 | NO | |
| L0704 | NO | |
| L0705 | NO | |
| L0706 | NO | |
| L0707 | NO | |
| L0708 | NO | |
| L0709 | YES | unit stated from the command (matches, files), not "lines" |
| L0710 | NO | |
| L0711 | NO | |
| L0712 | NO | |
| L0713 | NO | |
| L0714 | NO | |
| L0715 | NO | |
| L0716 | NO | |
| L0717 | NO | |
| L0718 | NO | |
| L0719 | YES | process list read before calling 108 W "idle" |
| L0720 | NO | |
| L0721 | NO | |
| L0722 | NO | |
| L0723 | NO | |
| L0724 | NO | |
| L0725 | NO | |
| L0726 | NO | |
| L0727 | NO | |
| L0728 | YES | board read before saying A had not started |
| L0729 | PARTLY | pointers checked against the lap ledger before naming them |
| L0730 | NO | |
| L0731 | NO | |
| L0732 | NO | |
| L0733 | YES | source of the line read (who wrote it) before attributing it |
| L0734 | PARTLY | attribution of the line read before use as evidence |
| L0735 | YES | claim about the vendor's feature looked up before leaning against his word |
| L0736 | NO | |
| L0737 | NO | |
| L0738 | NO | |
| L0739 | NO | |
| L0740 | NO | |
| L0741 | NO | |
| L0742 | NO | |
| L0743 | NO | |
| L0744 | NO | |
| L0745 | PARTLY | process list and clock read before the kill claim and 40-minute reading [cost: about 40 min] |
| L0746 | NO | |
| L0747 | NO | |
| L0748 | NO | |
| L0749 | NO | |
| L0750 | NO | |
| L0751 | NO | |
| L0752 | NO | |
| L0753 | NO | |
| L0754 | YES | git rev-parse printed, not read off one output line |
| L0755 | NO | |
| L0756 | NO | |
| L0757 | NO | |
| L0758 | NO | |
| L0759 | YES | vendor docs read before "no review step" |
| L0760 | NO | |
| L0761 | NO | |
| L0762 | NO | |
| L0763 | NO | |
| L0764 | NO | |
| L0765 | NO | |
| L0766 | YES | grep of the three commit messages before "only hits" |
| L0767 | NO | |
| L0768 | NO | |
| L0769 | NO | |
| L0770 | NO | |
| L0771 | NO | |
| L0772 | NO | |
| L0773 | NO | |
| L0774 | NO | |
| L0775 | YES | "no read exists" backed by a find over the whole disk |
| L0776 | NO | |
| L0777 | NO | |
| L0778 | YES | handoff pushed-state read from git before it was written |
| L0779 | YES | search all of D's disk before "no read exists" |
| L0780 | NO | |
| L0781 | NO | |
| L0782 | NO | |
| L0783 | NO | |
| L0784 | NO | |
| L0785 | NO | |
| L0786 | NO | |
| L0787 | NO | |
| L0788 | NO | |
| L0789 | NO | |
| L0790 | NO | |
| L0791 | NO | |
| L0792 | NO | |
| L0793 | NO | |
| L0794 | NO | |
| L0795 | YES | design brief opened before reciting its contradictions |
| L0796 | NO | |
| L0797 | NO | |
| L0798 | NO | |
| L0799 | NO | |
| L0800 | YES | URL copied from the publish result, not typed as a placeholder |
| L0801 | NO | |
| L0802 | NO | |
| L0803 | NO | |
| L0804 | NO | |
| L0805 | NO | |
| L0806 | NO | |
| L0807 | NO | |
| L0808 | NO | |
| L0809 | NO | |
| L0810 | NO | |
| L0811 | NO | |
| L0812 | NO | |
| L0813 | PARTLY | date read from the clock, not taken from a UTC file name |
| L0814 | YES | digests printed by sha256sum, not typed |
| L0815 | NO | |
| L0816 | NO | |
| L0817 | NO | |
| L0818 | NO | |
| L0819 | NO | |
| L0820 | PARTLY | table built from the source rather than recalled |
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
| L0833 | PARTLY | stage 8 read before prediction 3 was written |
| L0834 | NO | |
| L0835 | NO | |
| L0836 | NO | |
| L0837 | NO | |
| L0838 | NO | |
| L0839 | NO | |
| L0840 | YES | rate computed from the modulus (1 in 41), not typed "1 in 400" |
| L0841 | NO | |
| L0842 | NO | |
| L0843 | NO | |
| L0844 | NO | |
| L0845 | NO | |
| L0846 | YES | sha read, lock slots listed and failing number read before they were stated |
| L0847 | PARTLY | triangle count by command |
| L0848 | NO | |
| L0849 | NO | |
| L0850 | PARTLY | times and ranges taken from the run, not guessed |
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
| L0861 | YES | credit line copied from the asset page, not written from memory |
| L0862 | NO | |
| L0863 | NO | |
| L0864 | NO | |
| L0865 | NO | |
| L0866 | NO | |
| L0867 | YES | time read from the clock, not "~03:xx" |
| L0868 | YES | time read from the clock (04:57), not a guessed "05:0x" |
| L0869 | YES | speed table cells computed by script, not by hand |
| L0870 | NO | |
| L0871 | NO | |
| L0872 | NO | |
| L0873 | NO | |
| L0874 | YES | grep -n before citing test lines |
| L0875 | NO | |
| L0876 | PARTLY | branch resolved with git before merge |
| L0877 | NO | |
| L0878 | NO | |
| L0879 | NO | |
| L0880 | NO | |
| L0881 | NO | |
| L0882 | YES | test read before "determinism break" told to the keeper |
| L0883 | YES | clock read in the same call as every stamp (stamp.js) [cost: one correction round] |
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
| L0897 | YES | file count by command (34), not typed 36 three times |
| L0898 | NO | |
| L0899 | NO | |
| L0900 | NO | |
| L0901 | NO | |
| L0902 | NO | |
| L0903 | YES | ranges copied from the log, not hand-written |
| L0904 | YES | figure for 966eedf read, section-6 claim checked |
| L0905 | YES | times read from the clock, not guessed |
| L0906 | NO | |
| L0907 | NO | |
| L0908 | YES | grep for a stamina system before designing on one |
| L0909 | NO | |
| L0910 | NO | |
| L0911 | YES | sha copied from command output |
| L0912 | NO | |
| L0913 | NO | |
| L0914 | NO | |
| L0915 | NO | |
| L0916 | NO | |
| L0917 | NO | |
| L0918 | NO | |
| L0919 | NO | |
| L0920 | NO | |
| L0921 | NO | |
| L0922 | NO | |
| L0923 | NO | |
| L0924 | PARTLY | HEAD read by git, inference marked as inference |
| L0925 | NO | |
| L0926 | NO | |
| L0927 | YES | each study opened before being named |
| L0928 | NO | |
| L0929 | NO | |
| L0930 | YES | build files grepped before saying DetourCrowd is available |
| L0931 | NO | |
| L0932 | NO | |
| L0933 | NO | |
| L0934 | NO | |
| L0935 | NO | |
| L0936 | NO | |
| L0937 | NO | |
| L0938 | NO | |
| L0939 | YES | lesser_max and find_site read from code before the section was written |
| L0940 | NO | |
| L0941 | NO | |
| L0942 | NO | |
| L0943 | NO | |
| L0944 | NO | |
| L0945 | YES | commit sha and line numbers read from the file at that commit |
| L0946 | NO | |
| L0947 | YES | journal name copied from the paper record |
| L0948 | NO | |
| L0949 | NO | |
| L0950 | NO | |
| L0951 | NO | |
| L0952 | NO | |
| L0953 | NO | |
| L0954 | YES | track list read from the source, not from memory |
| L0955 | NO | |
| L0956 | NO | |
| L0957 | NO | |
| L0958 | PARTLY | research file read before the wake plan's status word |
| L0959 | NO | |
| L0960 | NO | |
| L0961 | NO | |
| L0962 | NO | |
| L0963 | YES | line number and commit sha read by command after L162 landed |
| L0964 | YES | citation opened before use |
| L0965 | PARTLY | computed budget in place of the stated premise |
| L0966 | NO | |
| L0967 | NO | |
| L0968 | NO | |
| L0969 | NO | |
| L0970 | NO | |
| L0971 | NO | |
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
| L0984 | PARTLY | train-run times read from one source |
| L0985 | YES | counts by command (86, not 75); dates and line citations read from the files [cost: seven strikes] |
| L0986 | YES | minutes and cites read from the files; his words quoted verbatim [cost: five strikes plus two off-by-one cites] |
| L0987 | NO | |
| L0988 | NO | |
| L0989 | NO | |
| L0990 | YES | quotes and line numbers copied from the files by script [cost: 82 wrong lines] |
| L0991 | NO | |
| L0992 | YES | Valve flag read in the source before "is used" |
| L0993 | NO | |
| L0994 | NO | |
| L0995 | YES | require line of the repo copy read against installed blind.js before "safe" |
| L0996 | NO | |
| L0997 | YES | hand height measured, not read off the sheet |
| L0998 | NO | |
| L0999 | NO | |
| L1000 | NO | |
| L1001 | NO | |
| L1002 | YES | run files read before ruling which run held the shuttle |
| L1003 | NO | |
| L1004 | NO | |
| L1005 | NO | |
| L1006 | YES | each handoff read in whole lines; the night's notes opened before dispatch |
| L1007 | NO | |
| L1008 | NO | |
| L1009 | YES | his ruling read before saying stop.js is against it |
| L1010 | YES | Third Place's D section read before "critic hasn't run" |
| L1011 | YES | headline figures in swarm summaries re-derived from primaries [cost: level two needed] |
| L1012 | NO | |
| L1013 | NO | |
| L1014 | NO | |
| L1015 | NO | |
| L1016 | NO | |
| L1017 | PARTLY | the pair opened before inferring straightening |
| L1018 | NO | |
| L1019 | NO | |
| L1020 | NO | |
| L1021 | NO | |
| L1022 | NO | |
| L1023 | NO | |
| L1024 | PARTLY | agent model read from transcripts before expecting Opus |
| L1025 | NO | |
| L1026 | NO | |
| L1027 | NO | |
| L1028 | NO | |
| L1029 | NO | |
| L1030 | YES | each pose number traced to a source or marked as ours |
| L1031 | NO | |
| L1032 | NO | |
| L1033 | NO | |
| L1034 | NO | |
| L1035 | NO | |
| L1036 | NO | |
| L1037 | NO | |
| L1038 | NO | |
| L1039 | NO | |
| L1040 | NO | |
| L1041 | NO | |
| L1042 | NO | |
| L1043 | YES | installer's -Only option read before claiming what installing syncs |
| L1044 | NO | |
| L1045 | NO | |
| L1046 | NO | |
| L1047 | NO | |
| L1048 | NO | |
| L1049 | YES | cites taken by grep -n, not typed |
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
| L1060 | PARTLY | draft figures copied from the run |
| L1061 | NO | |
| L1062 | YES | stop-note time read from the clock; hand calculation replaced by a script |
| L1063 | NO | |
| L1064 | NO | |
| L1065 | NO | |
| L1066 | YES | no claim of "checked the report itself" without opening it |
| L1067 | NO | |
| L1068 | NO | |
| L1069 | NO | |
| L1070 | PARTLY | 1,004 first-reader claims, 155 wrong or weak, each typed from a summary or cut read |
| L1071 | PARTLY | 13 offers resting on summary or memory; 14 sources never opened |
| L1072 | NO | |
| L1073 | NO | |
| L1074 | NO | |
| L1075 | YES | handbacks searched before telling him the grain fix was the missing piece |
| L1076 | YES | ms costs and the stairwell delta measured before the claim |
| L1077 | YES | source opened instead of answering from the last output |
| L1078 | NO | |
| L1079 | NO | |
| L1080 | NO | |
| L1081 | NO | |
| L1082 | PARTLY | cited line numbers read by grep |
| L1083 | PARTLY | letter's claim checked against the light shelf |
| L1084 | PARTLY | brief's refusal claim checked against gates_mode |
| L1085 | NO | |
| L1086 | NO | |
| L1087 | NO | |
| L1088 | NO | |
| L1089 | YES | file and registration counts by command (36, 24) |
| L1090 | YES | full output read in whole lines, not cut [cost: one re-run into a file] |
| L1091 | YES | header percentages re-derived by the instrument |
| L1092 | NO | |
| L1093 | NO | |
| L1094 | NO | |
| L1095 | NO | |
| L1096 | YES | resume-keeps-model fact read from transcripts before the memory note |
| L1097 | YES | restart cost checked against warm resumes before the spec [cost: the spec was built on it twice] |
| L1098 | YES | rate arithmetic (113.7 KB/s x 120 s) before calling F1b the fix |
| L1099 | PARTLY | inheritance of the launch id checked by run |
| L1100 | PARTLY | tmp_pack presence checked before the check was written |
| L1101 | YES | registered falsifier text and W-step cases copied from the registration |
| L1102 | PARTLY | build output read (cargo check has no exe) before naming a failed release |
| L1103 | YES | figure matched to its fault (door delivery, not drain to Main) |
| L1104 | NO | |
| L1105 | YES | [read] marks only on figures read; sibling-file rule read |
| L1106 | PARTLY | 76 and 82 struck spans are first-pass claims not copied from the files |
| L1107 | PARTLY | first-reader claims struck or downgraded (31 WRONG of 238) |
| L1108 | NO | |
| L1109 | NO | |
| L1110 | PARTLY | two lines checked before the ring |
| L1111 | YES | row value read (-11), not remembered |
| L1112 | NO | |
| L1113 | NO | |
| L1114 | NO | |
| L1115 | NO | |
| L1116 | NO | |
| L1117 | PARTLY | survivor and time read from the files |
| L1118 | YES | close time read from the clock |
| L1119 | YES | run file read before saying the record held a wall-to-wall run |
| L1120 | NO | |
| L1121 | NO | |
| L1122 | NO | |
| L1123 | PARTLY | 110 of 137 value-turns unsourced; the instrument counts the root's cases |
REMOVE rows skipped (second reader marked them in 00_ledger.md): L0029 L0162 L0255 L0299 L0300 L0390 L0409.

## Notes on the hard calls

- A written-but-wrong count from a command that ran (L0034 grep missed two filename patterns; L0084 one grep of one
  phrasing; L0742 a NUL made grep binary and every pattern counted 0) is NO or PARTLY. The root says no command ran.
  A fix that only demands "copy from an instrument" would not catch these. Those rows point to a different root: an
  instrument is trusted without a positive control. [inferred]
- Stamps and times typed from feel (L0867, L0868, L0883, L0905, L1062, L1118, L0214) are YES: the clock is one
  command away and stamp.js already refuses a typed time. They show the root exists in a form that has one tool for
  one writer, as the root entry says.
- Rows about done-state taken off the sender's side (DELIVERED, installed, landed, held) are NO here, because the fault
  is a missing read-back of the target, not a typed figure. I scored them NO even where the wrong sentence was a typed
  claim (for example L0418, L0448, L1036).
- Aggregate (AGG) rows were mostly NO. I gave PARTLY to L0017, L0376, L0386, L1070, L1071, L1106, L1107 and L1123,
  which count cases of the root itself (unsourced turns, would-block rows, struck spans) but are not single incidents.
- Prevalence evidence for the root is on the ledger: L0376 (check at hand not run in 61-73% of claim errors) and
  L0310 (12 of 12 wrong path claims had the source path already in the transcript, but 18 of 23 wrong claims named
  nothing a check could touch, so the check-precedes-claim instrument was ruled DEGENERATE). L0310 is scored NO: it
  limits how far this root's fix can reach, which I record here rather than score. [inferred]

## What I did not open

- I opened no primary behind any ledger row (no journal, hand-back, map file, transcript, board or jsonl). Every
  verdict rests on the ledger's own wording of the row, in whole lines. Where a row was thin, I scored the narrower
  verdict (NO or PARTLY).
- I did not open the roots groups' files, the other scorers' files, or any adversary file, as instructed. The
  ledger file also held rows marked by the second reader; I took those marks as given.
- I did not re-derive any count in the ledger. The totals above are counts of my own verdicts, derived by script.
- Some rows on the ledger show other scorers' scratch lines in a shared scratch directory; I discarded that file and
  rebuilt my verdicts in a separate file, so no other scorer's verdict is mixed into this table.
