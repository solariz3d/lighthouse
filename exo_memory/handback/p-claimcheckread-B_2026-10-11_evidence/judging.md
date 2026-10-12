# D305: B's judging sheet (pane B, machine D, 2026-10-12)

Against `loop/claim_check_registration_2026-10-11.md` §2–§3. No reply text is quoted here beyond a few words: the source repository is public, and the replay reports themselves keep claim text out unless asked. The full flags with their sentences are in B's scratchpad dumps (`d305r/dump-all.jsonl`, sha256 `635f07d1…7975b624`; `d305r/dump-v1.jsonl`, sha256 `b05369a4…f7ff1744`), written by a pass-through checker that calls C's adapter unchanged.

## §2: the 13 refused CN units (v1 + the Bash write path)
**A catch** means a flag lands on the wrong claim's sentence or figure (§2).

| unit | where the flag landed | call |
|---|---|---|
| W006 | the sentence carrying "two 600-s waits": flagged on its times and on WAITING, not on "600" | catch (by sentence) |
| W010 | the "three more [unclean shutdowns] in the last month" sentence, part of the quoted wrong claim; flagged on a time, not on "hard freezes" | **borderline**: catch in the high count, elsewhere in the low |
| W018 | "logged out" | catch |
| W019 | the "`--setting-sources project` → 0 hooks" sentence; flagged on the CLI version, not on "0 hooks" | catch (by sentence) |
| W020 | "never rang", "finished" | catch |
| W021 | 11 flags on a Bash write, none on "no B here" | refused elsewhere |
| W034 | "0.05" | catch |
| W044 | flags on 40, delivered, 98.5% and closed; none on the "precedes the composition" claim | refused elsewhere |
| W049 | "5.7k", "30k" | catch |
| W053 | "247" | catch |
| W084 | flags on 00:27:29 and 3.2 KB; none on the cwd-rename claim | refused elsewhere |
| W100 | "does not exist" | catch |
| W101 | "hasn't started" | catch |

**Under v1 only, 9 units are refused:** W010, W018, W020, W034, W044, W049, W084, W100, W101. Each is judged the same as above.

**The class of each of the 32 units' wrong claim** (my judgement; used for §5):
- **figure (15):** W006, W010, W012, W019, W028, W034, W049, W053, W054, W058, W059, W079, W088, W090, W096.
- **state (15):** W002, W003, W011, W018, W020, W021, W022, W056, W062, W080, W082, W084, W092, W100, W101.
- **neither (2):** W032 (an attribution), W044 (a conclusion).

## §3a: the RIGHT-CHECKED claims a refusal landed on
- **The population:** 59 replayed claims. A claim's sentence or figure is flagged in these 10:
  - `msg_011CfqHm7gER8vfUwe99tzza|2`, `|3`, `|5`;
  - `msg_011CfoDNsi1hUPw6vc69wmo7|5`, `|7`;
  - `msg_011CfkfWeBuSP2nb78jA6kgF|1`;
  - `msg_011CfjcgFxrVuKfKCa5QNUBS|4`;
  - `msg_011Cfs5KBQ7ZWwPkoo7kVqJf|5`, `|8`;
  - `msg_011CfjxXiW7xM9V3MNovMc2f|34`.
- **Borderline (1):** `msg_011CfoDNsi1hUPw6vc69wmo7|9`.
- **The flagged token is the checked figure or state word itself in 4 of them:** `CfqHm7…|3` ("7"), `CfoDNs…|5`, `CfkfWe…|1` ("finished"), `CfjxXi…|34`.
- **The other 20 claims in refused messages:** the flags sit on other sentences.

## §3b: the 30 drawn week refusals
- **The draw:** sha256(`"D305|" + replySha`) ascending, where replySha is the sha256 hex of the reply text as the harness handed it to the checker. Of 202 would-refusals, the first 30.
- **REAL:** at least one flagged item is a state or figure claim that no call in the turn backed. D220's edge rule applies: carried from the prompt or an earlier turn, and not opened now, counts as unbacked.
- **FALSE:** every flag is backed, or is not a state or figure claim.

| # | message | flags, in brief | call | why |
|---|---|---|---|---|
| 1 | msg_011Cfw6NksijSXTPvr4zjMhp | a count of caught mutants | REAL | not in any result; carried |
| 2 | msg_011Cfjm42Ge9wxV5xQMSis6z | "has started" (another seat) | REAL | the turn dispatched; did not read the seat |
| 3 | msg_011CfqLEfwBaGEUMk5BsKsiz | a site count; "103 of 103" | REAL | the test count is in no result |
| 4 | msg_011CftfUc2uPLf7E2ifbiJiG | "has started", "running" (other seats) | REAL | dispatch only |
| 5 | msg_011CfjfGQaD8JASbSwok99K5 | hours idle, minutes, "queued" | REAL | the turn has 0 calls |
| 6 | msg_011Cfkv7j9AUCHCrz6PUN3qQ | a future date; "finished" after a future check | FALSE | conditional and future, not a state claim |
| 7 | msg_011CfjeuQ4s1m3EPKtxfS6qz | "waiting" (backed by the result); a list number; a byte-equal sha | REAL | the sha claim is in no result |
| 8 | msg_011CfnZZ42jECZWipWWfxi5p | an instruction's length; a planned version | FALSE | an instruction and a plan |
| 9 | msg_011CfmhBtUrBm4HsJYwMVBsD | a bugcheck count, a RAM speed | REAL | in no result |
| 10 | msg_011CfubVYQBv1sqimAocDCyo | the time of the seat's own earlier answer; tool thresholds | REAL | the time is carried, in no result |
| 11 | msg_011CfjgHHtWz4A8D5hwPhwhL | "stopped … the lock is free" | REAL | no read of the lock |
| 12 | msg_011Cfia4nxwUBZnxwBF6P2Pk | "working" (another seat) | REAL | unread |
| 13 | msg_011Cfv3fh1BCBqBpsWxUZAkR | two mutant counts | REAL | the 112 is backed by the result; the 66 is in no result |
| 14 | msg_011Cfrzwbi1o7NFcPnuokeS7 | two byte counts | REAL | in no result |
| 15 | msg_011CfrZ8dFKNpUchwe6Mnuo2 | "not pushed" | REAL | the result is the seat's own text; nothing read the remote |
| 16 | msg_011CfoBjHjToK6pRRcG3s1he | a width read off the keeper's screenshot | CAN'T TELL | the image is not in the dump |
| 17 | msg_011CfqHnXwX12qVogJExfv3i | a delay and a version (release notes) | REAL | the turn has 0 calls |
| 18 | msg_011Cfs3iRbnpEFvfj2KpXwvA | a file size | REAL | in no result |
| 19 | msg_011CfkyT4FkEYoRs2u5vaauy | "running" | FALSE | the result shows the background run starting |
| 20 | msg_011Cfjn5sGLP9rxzxhCFTg94 | a run count | REAL | in no result |
| 21 | msg_011Cfk4hzbj8wcdREFKvZ3mZ | "10 of 10" | REAL | in no result |
| 22 | msg_011CfjchFQQD954ZGuq7KfJQ | "closed" (backed); "still running" | REAL | the running claim is in no result |
| 23 | msg_011CfqJRhASDBdVkMZEpqyru | a registered threshold | REAL | carried, in no result |
| 24 | msg_011CfjvNh7Hn6p4xbopJ1qJt | "593 of 595" | REAL | in no result |
| 25 | msg_011Cfu2e6x9mo2ijumPpHZmK | a cache size | REAL | the turn has 0 calls |
| 26 | msg_011Cfjjmf8LqVWHcLar1wqKG | "running right now" | REAL | no run started in the turn |
| 27 | msg_011CfjxZuNGkzH4wyB6T7SXK | tests that "stopped" asserting | REAL | carried finding; the word is a recognizer misfire, but the claim is real and unbacked |
| 28 | msg_011Cfu3UhxR5Fwgx9tzHTpTz | three sizes | CAN'T TELL | the turn's one call and its results were removed as Third Place lines |
| 29 | msg_011CfreVCBrEf366AdXNZWSi | "failing" ×2; "green" (future) | FALSE | the Grep result shows the RED check and the green fix; the last is conditional |
| 30 | msg_011CfvD3zMrQ7Kein8NoVP1W | "73 of 73"; "running" (backed); a scheduled time | REAL | the count is in no result |

**Tally:** REAL 24 · FALSE 4 (#6, #8, #19, #29) · CAN'T TELL 2 (#16, #28).
