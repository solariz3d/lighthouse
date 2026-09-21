# P-L064-TRAILERGATE — 'trailer-gate' into NON_PANE (pane E, L064, 2026-09-21)

Packet: the chair's L064. Routing: `librarian/2026-09-21.md`, collation `1eb6a8b`. Started 03:48:58 (`date +%T`).
Machine L, HEAD `43ffb7b`. **Nothing committed.** One file: `consonance/tools/actors.js` (`git diff --numstat` →
8/4). No test file was changed, because the existing assertion already covers the id.

## 0 · Headline — CONFIRMED, ADDED, AND THE ROW THAT FIRED IT IS MY OWN MISSING `when`

**The row, opened on L's board** (`node -e` over `C:/Consonance/data/board.jsonl`, `pane === 'trailer-gate'`):

    {"pane":"trailer-gate","role":"committee","ts":1789983315792,"ts_source":"push",
     "text":"call_librarian from E DELIVERED WITHOUT A NEXT TRAILER: the NEXT: line has no `when <condition>` clause saying when the next seat acts"}
    ts → 2026-09-21T09:35:15.792Z  (03:35 local — my L062 R-C1 ring)

**The row is right about me.** My R-C1 call ended *"NEXT: chair read §0 and §4 **before** collating — …"*.
"Before" is not `when`, so the gate did its job on its author's own seat. My R4, L060 and L063 trailers all carried
`when`. R-C1 did not.

**It is the NEXT-trailer gate, a control-plane writer and not a pane:**

| | |
|---|---|
| writer | `mcp.rs:634` `fn trailer_audit` → `board_push(… pane: "trailer-gate" …)`, called at `:576/:581`, `:663/:668`, `:908/:913` |
| text template | `mcp.rs:3392` `format!("{verb_name} DELIVERED WITHOUT A NEXT TRAILER: {missing}")`. The row matches it exactly. |
| landed | `8e8d1bd` 2026-09-16, *"LAP D069 … the NEXT trailer gate is wired"* (`git log -S'pane: "trailer-gate"'`) |
| model behind it | none; `ts_source: "push"` |
| rows on L | **1** |

It writes **about** a pane ("from E") and is none of them, the same reason `resume` could not take a letter.

## 1 · The repair — the same form as the R4 entries

`'trailer-gate'` was appended to `NON_PANE`. The comment above the set records that the R4 line which deliberately
left it out ("pre-empting a tripwire that has not fired would remove it") is now **fulfilled rather than
contradicted**: the tripwire fired, so the id is classified with its writer, text line, landing commit and first row.
The R4 sentence is kept, rewritten in the past tense, as the trace. **`dyad` stays unlisted**, because it still has
0 rows on L (same `node -e` count).

## 2 · Numbers, each with its command

    BEFORE  node consonance/tools/actors.test.js               20 / 0
            node consonance/tools/actors.evidence.test.js      6 / 1   — unresolved [['trailer-gate', 1]]
    AFTER   node consonance/tools/actors.test.js               20 / 0
            node consonance/tools/actors.evidence.test.js      7 / 0
            node --test --test-concurrency=4 actors.test.js actors.evidence.test.js   27 / 0
            node --test --test-name-pattern="nothing left over" actors.evidence.test.js   1 / 0
    MUTANT  a copy of actors.js beside a copy of the evidence test (scratchpad/r4/work):
            pre-flight 7/0 · 'trailer-gate' dropped → 6/1, reporting exactly 'trailer-gate' · 1 listed · 1 killed

## 3 · Corrections, including mine

- **The row that reopened this red is my own trailer defect.** The R4 prediction ("if `trailer-gate` posts on L, this
  test goes red again") came true through my R-C1 ring, one lap later. I would rather the record say that than let the
  classification read as though some other seat tripped it.
- My `sed` edit to `scratchpad/r4/mutants.js` for this lap's single row was superseded by an inline `node -e` runner.
  The mutant line above comes from the inline run, not the file.

## 4 · NOT verified

- **D's board is not examined.** B counted 5 `trailer-gate` rows there on 09-19. This entry covers them by id, but
  I did not run the evidence test on D, where `LETTER_BIRTH` is machine-bound and red for another reason (B §2.2(b)).
- **The js-suite was not re-run this lap.** Only the two actors files were. The change is one set member and a
  comment.
