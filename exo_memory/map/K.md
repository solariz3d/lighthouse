# K's map — one writer, appended by K alone

Findings with evidence pointers, per ../map/README.md. Nothing here is transcribed from another
document; a pane is respawned from its capture tail plus this file, so a finding that reaches only a
hand-back never reaches the next waking of me. That is the whole reason this file exists, and on
2026-09-02 zero of five hand-backs wrote a line in one.

## 2026-09-03 — P-BATON-WAKE (lap D005)

### Handing off a baton destroys your standing to announce it — the gate makes the hand-off self-silencing

`consonance/src-tauri/src/mcp.rs:397` (`required_station`) gates each speaking verb on the CURRENT
holder: `chair_inject` needs holder `chair`, `call_chair` needs `librarian`, `call_librarian` needs
`panes`. Each seat has exactly one verb and **its required holder is that seat itself**. So writing
`lap-row.js --stage <id> --holder <other>` sets the holder to someone else and, in the same act,
makes your only verb REFUSED OUT OF TURN. The machinery does not merely fail to wake the holder — it
forbids the wake at the exact moment one is owed.

The repair is therefore an ORDER, not a channel: **ring first, write the row second.** The librarian
had already found this by being refused (`lap.jsonl` D005 10:06:59 / 10:07:35 / 10:07:55 — it
re-took the baton for 30 s to ring before handing off), and nothing taught it.

**Confirmed independently the same hour, by a seat that was not looking for it:** at 10:27:18 pane B
hit `call_librarian REFUSED OUT OF TURN — mount B tried to speak while lap D005 is held by chair`
and correctly did not retry (board.jsonl). Uncurated — nobody arranged that.

### The wake channel already exists and runs unattended; only the trigger is missing

`call_chair` at 01:06:45 woke the chair with no keeper typing into it, and the chair produced work
at 01:07:21 — **36 seconds, ring to work, at 1 a.m.** (board.jsonl). So "nothing wakes a holder" is
false of the channel and true only of `lap-row.js`, which has zero notification code
(`grep -c 'post_board\|inject\|notify' consonance/tools/lap-row.js` -> 0). **Do not build a channel
for a reaching problem** — that was the D003 map's named pattern and ask.js was already its second
instance.

### D005's nine hours were the relay sleeping, not a holder ignoring a baton

board.jsonl is *silent* 01:07:51 -> 10:04:08 — zero rows, not sparse. The librarian went idle at
01:07:06; the chair wrote `holder librarian` at 01:07:30 and said "my step is done" **into its own
pane**; the keeper then slept. A hand-off is announced only to whoever happens to be watching. This
is why the fix had to reach the SEAT rather than the transcript, and why the hook blocks.

### An instrument that fires on correct behaviour argues against the discipline it teaches

My first draft counted a ring only if it landed AFTER the hand-off row, which made it fire on the
one hand-off in the record that was done RIGHT (ring 10:07:43, row 10:07:55 — twelve seconds).
**No test would have caught it**: every test I had written encoded the same misreading. It was found
by retrodicting against BOTH hand-offs instead of only the one that stalled. The rule is now the
TURN, not the row. **When a detector exists to teach an order, retrodict the compliant case too —
the false positive on correct behaviour is the expensive one.**

### Three of my own tests passed for the wrong reason, and only mutation found them

`dev/mutation/mutate-baton-wake.js`, plus an ad-hoc run against the hook. (i) The
once-per-hand-off guard was untested — the turn boundary was silencing the second call, not the
guard. (ii) The `fired` marker was never asserted as *written*, so the guard could have shipped
permanently unarmed — an absent guard reading as a passing one, inside a tool built on that finding.
(iii) `since` was not asserted per-pane, and with 5+ panes sharing one ledger any other seat's Stop
would have swallowed the block: **the busier the room, the more reliably the instrument goes quiet.**
That is the third time a mutant has caught a test of mine passing for the wrong reason.

### A guard whose removal no test can detect is a comment, not a guard

I wrote `if (reserved.length > 1) return 'unknown'` and mutation showed deleting it changed nothing —
an ambiguous prefix already fell through to `unknown`. Removed rather than kept for looks.

### Hand-back

`exo_memory/handback/p-baton-wake_2026-09-03.md` — the reader, the Stop hook, 37 + 14 tests, 16/16
mutants, the retrodiction on both hand-offs, five registered falsifiers, and the install line I did
NOT apply (a blocking Stop hook changes every seat on this machine; not a pane's call).

### An instrument's universe is what git can see, so "green before the commit" measures nothing

`portable-paths.js` was green on the full js-suite run I did before committing, and red on 8 sites —
all mine, all test fixtures — the moment `ed3e94b` landed, with nothing changed in the files. It
scans TRACKED files. This is documented verbatim in `chain-status.js`'s NO FATAL DEFAULT comment,
which I had read and whose code I had copied. **Reading a warning is not having run under it.** Fixed
in `de2c73c` by removing the drive letters rather than by taking the `--update` baseline the tool
offers for BENIGN-TEST sites: `stationOfCwd()` reads only the basename, so they were removable, and
a baseline entry preserves an argument that then has to be re-read forever.

**Run the instruments again after the commit, not only before it.**

**Confirmed by a second seat within the hour, independently.** After my sites were fixed,
portable-paths went red again on 2 sites in `consonance/tools/gen-consumer.fixture-scope.test.js` —
P-GEN-RED-FIRST's file, red the moment `0d2a2d9` tracked it, by the same mechanism. Two seats, one
instrument, one trap, one hour, neither looking for it. Uncurated — nobody arranged it — which makes
it better evidence that the trap is structural than my own case was alone. Left for that seat and
posted to the board rather than touched: their packet, and the judgement differs, because their
literals sit inside regexes that are *about* drive-prefixed paths, so `--update` may be right there
where removing the literal was right for my fixtures.

### The route back is gated too, and it cost three seats one morning

`call_librarian` from this seat was REFUSED OUT OF TURN (holder `chair`, verb needs `panes`) —
predicted before attempting, not retried, pointer posted to the board instead. Same gate as the
hand-off finding, one hop further down: the librarian at 10:24, B at 10:27, me deliberately after.
A finished hand-back waits on the chair's turn rather than reaching the librarian when it was ready.
