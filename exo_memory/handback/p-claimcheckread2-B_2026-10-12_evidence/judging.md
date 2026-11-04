# D305 item 8: B's judging sheet for C's revision (pane B, machine D, 2026-10-12)

Against `loop/claim_check_registration_2026-10-11.md` §2–§3, the same bar as the first read. As before, no reply text is quoted beyond a few words; the source repository is public.

**The full flags are in B's scratchpad** (pass-through checker over C's adapter, unchanged):
- `d305s/dump-orig-all.jsonl`, `dump-orig-v1.jsonl`;
- `dump-ho-all.jsonl`, `dump-ho-v1.jsonl`.

## §2 held-out: E's 15 CN units (all replayable) and 1 CU (unlocated)
**The wrong claim** is read from each unit's correction in A's pool (`p-wcensus-A_2026-10-11_evidence/out/topup/`). **The class** is my judgement, used for §5.

| unit | class | refused (all / v1) | where the flag landed | call |
|---|---|---|---|---|
| H0182 | figure | yes / yes | the "re-derived from B's own numbers … about 6,170 tokens per call" sentence, on 6,170, 75,565 and 9.1k | **catch** |
| H0546 | neither (a frame's rule-status) | no / no | — | missed |
| H0802 | figure (`:27`) | yes / yes | one flag, on "147 MB"; the line number is not flagged | elsewhere |
| H0102 | state ("passes alone, red in the suite") | yes / no | numbers in a Bash write; the sentence is not flagged | elsewhere |
| H0162 | figure ("exactly 20 positives") | yes / yes | other figures in the file; the 20-positives claim is not flagged | elsewhere |
| H0351 | figure (the kn5 sizes) | yes / yes | the "tube oval w 40 … kn5 goes from … to …" sentence, on "40" and the DDS size, not on the kn5 sizes | **catch** (by sentence) |
| H0159 | figure ("47 of 74") | yes / yes | "47 of 74" | **catch** |
| H0403 | figure ("some 27 test files") | no / no | — | missed |
| H0557 | state ("the installer now manages them") | yes / yes | that sentence, on its sha | **catch** (by sentence) |
| H0232 | state ("edited by D175") | yes / yes | one flag, on another number; that sentence is not flagged | elsewhere |
| H0192 | figure (a rate: "missed more often than found") | yes / yes | the sentence before it (the N = 8 figures, which are right); the wrong sentence is not flagged | elsewhere |
| H0717 | state ("no pit lane") | no / no | — | missed |
| H0911 | figure ("59 tests, 59 pass") | yes / yes | "59 of 59" | **catch** |
| H0682 | state (a NUL in a file) | no / no | — | missed |
| H0562 | figure (a sha) | no / no | — | missed |
| H0595 (CU) | figure | unlocated | — | unreplayable |

**Totals:**
- **All paths:** 5 catches (H0182, H0159, H0911 on the figure itself; H0351 and H0557 by sentence), 5 refused elsewhere, 5 missed, 1 unreplayable.
- **v1 only:** the same 5 catches. H0102, a refusal elsewhere, drops to allowed.

## §2 in-sample: the original 32
**The same 13 units are refused, with the same calls as the first read:**
- 9 catches: W006, W018, W019, W020, W034, W049, W053, W100, W101;
- W010 borderline;
- refused elsewhere: W021, W044, W084.

W020 and W101 lost one flag each but keep the flag on the wrong claim. checked: `cn.js` over `dump-orig-all.jsonl` and `dump-orig-v1.jsonl`.

## §3a: RIGHT-CHECKED claims a refusal lands on (59 replayed)
- **Revision:** 5 landings:
  - `msg_011CfqHm7gER8vfUwe99tzza|2` ("0.3.2" in the hash sentence);
  - `msg_011CfoDNsi1hUPw6vc69wmo7|5`, `|7`;
  - `msg_011CfjcgFxrVuKfKCa5QNUBS|4`;
  - `msg_011CfjxXiW7xM9V3MNovMc2f|34`.
- **Gone since the first build:** `CfqHm7…|3` and `|5` (the bare "7" is no longer a figure), `CfkfWe…|1` (the seat's "finished"), `Cfs5KB…|5` and `|8` (the bare "2").
- **The first read's one borderline, `CfoDNs…|9`, is resolved here as not landed, for both builds.**
  - Its claim, in both verifiers' files, is the total ("eight tracks were tested").
  - The flagged sentence is the three tube tracks' R values, which is claim `|7`'s sentence.
  - So the first build is 10 of 59 (16.9%), not 10–11.

## §3b: the redraw over the revision's 173 week refusals
- **The draw:** sha256(`"D305|" + replySha`) ascending, first 30, with replySha as in the first read.
- **Overlap:** 25 of the 30 are messages from the first draw (#1–#25 below; the first draw's number in brackets). C read the first sheet's §3b. 5 are new (#26–#30).
- **Rules:** as in the first read, including D220's edge rule.

| # | message (first draw #) | call | why |
|---|---|---|---|
| 1 | msg_011Cfw6NksijSXTPvr4zjMhp (1) | REAL | a count in no result |
| 2 | msg_011CfqLEfwBaGEUMk5BsKsiz (3) | REAL | "103 of 103" in no result |
| 3 | msg_011CfjfGQaD8JASbSwok99K5 (5) | REAL | 0 calls |
| 4 | msg_011Cfkv7j9AUCHCrz6PUN3qQ (6) | FALSE | only a future date is left; "finished" is now skipped as conditional |
| 5 | msg_011CfjeuQ4s1m3EPKtxfS6qz (7) | REAL | the byte-equal sha is in no result |
| 6 | msg_011CfnZZ42jECZWipWWfxi5p (8) | FALSE | an instruction and a planned version |
| 7 | msg_011CfmhBtUrBm4HsJYwMVBsD (9) | REAL | a RAM speed and bugchecks in no result |
| 8 | msg_011CfubVYQBv1sqimAocDCyo (10) | REAL | the time of an earlier answer, carried |
| 9 | msg_011CfjgHHtWz4A8D5hwPhwhL (11) | REAL | the lock is never read |
| 10 | msg_011Cfv3fh1BCBqBpsWxUZAkR (13) | REAL | the 66 is in no result (the 112 is backed) |
| 11 | msg_011Cfrzwbi1o7NFcPnuokeS7 (14) | REAL | byte counts in no result |
| 12 | msg_011CfrZ8dFKNpUchwe6Mnuo2 (15) | REAL | "not pushed": nothing read the remote |
| 13 | msg_011CfoBjHjToK6pRRcG3s1he (16) | CAN'T TELL | the screenshot is not in the dump |
| 14 | msg_011CfqHnXwX12qVogJExfv3i (17) | REAL | 0 calls |
| 15 | msg_011Cfs3iRbnpEFvfj2KpXwvA (18) | REAL | a size in no result |
| 16 | msg_011Cfjn5sGLP9rxzxhCFTg94 (20) | REAL | a run count in no result |
| 17 | msg_011Cfk4hzbj8wcdREFKvZ3mZ (21) | REAL | "10 of 10" in no result |
| 18 | msg_011CfjchFQQD954ZGuq7KfJQ (22) | REAL | "still running" in no result |
| 19 | msg_011CfqJRhASDBdVkMZEpqyru (23) | REAL | a registered threshold, carried |
| 20 | msg_011CfjvNh7Hn6p4xbopJ1qJt (24) | REAL | "593 of 595" in no result |
| 21 | msg_011Cfu2e6x9mo2ijumPpHZmK (25) | REAL | 0 calls |
| 22 | msg_011CfjxZuNGkzH4wyB6T7SXK (27) | REAL | a carried finding, unbacked |
| 23 | msg_011Cfu3UhxR5Fwgx9tzHTpTz (28) | CAN'T TELL | the only call and its results were removed as Third Place lines |
| 24 | msg_011CfreVCBrEf366AdXNZWSi (29) | FALSE | the Grep result shows the RED check and the fix |
| 25 | msg_011CfvD3zMrQ7Kein8NoVP1W (30) | REAL | "73 of 73" in no result |
| 26 | msg_011CfrX2wgvhWou7eN2JcBPw (new) | REAL | "35 of 35" in no result (checked: `g.js` with `\b35\b` → no hit) |
| 27 | msg_011CfjyLd6yfPG6E64k4L6Ga (new) | REAL | "the librarian is now … running the Close/Undo test set": another seat's status, not read; by D220's rule a status carried from the prompt is unbacked |
| 28 | msg_011CfnBkVBJvj4GEJQd3KZ4G (new) | FALSE | a future plan naming a sha |
| 29 | msg_011CfsyDeHFgQKD1wJ7qQ9hw (new) | REAL | "pushed" is backed (`28b89a92..8fa65769 main -> main`), but "35 of 37" is in no result |
| 30 | msg_011CfnWBHwg4ipoWRgeynX2n (new) | REAL | "111 of 111" in no result |

**Tally:** REAL 24 · FALSE 4 (#4, #6, #24, #28) · CAN'T TELL 2 (#13, #23).
- On the 5 new draws: REAL 4, FALSE 1.
- **Five refusals from the first draw now pass:** first-draw #2, #4, #12, #19 and #26. Of those, the first read had called #19 FALSE and the other four REAL.
