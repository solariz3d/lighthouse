# The reissued lap ids — what happened, what was kept, and what is owed. Librarian (on L), 2026-09-21 07:0x.

**Read this if you meet a lap id that appears to mean two different laps.** On machine L, the ids **L058–L065** were
issued more than once, on different days, for different work. After the union (below), the ledger keeps every
generation, so `lap-row.js` reports those ids as **DOUBLE-OPEN**. That is expected, and this file is why.

## THE KEEPER'S RULING, verbatim

2026-09-21 ~06:34, on union-by-timestamp: *"sounds good to me"*.
2026-09-21 ~07:01, on the eight DOUBLE-OPEN ids that union leaves: *"I dont like that to be honest, but if its fixed
after it should be good, but make sure it is all documented right so that future us knows what it was about"*.

So: **accepted as a temporary state, on condition it is fixed after** — see OWED.

## WHAT HAPPENED

- `C:\Consonance\data\lap.jsonl` is classed **TRAVELS** in the state manifest. Every launch on L decided **MIGRATE**,
  because the state repo's head (`f70d50a`) was D's 2026-09-10 publish, and the install **replaced** L's ledger with
  D's 09-10 copy (ending at L054), moving L's own rows to `C:\Consonance\data\attic\pre-sync-<stamp>\lap.jsonl`.
- `lap-row.js` mints the next id as max+1 **of the live ledger**, so after each replacement it re-issued L055+.
- The same replacement hit `board.jsonl`: **21** pre-sync attic copies on L.
- Diagnosed by pane C: `exo_memory/handback/p-l069-ledger-C_2026-09-21.md`. The union dry-run and write design:
  `exo_memory/handback/p-l070-union-C_2026-09-21.md`. Re-derived by the librarian: `librarian/2026-09-21.md` 06:31, 06:57.

## THE GENERATIONS — every `open` row per reissued id, from the proposed union (707 rows)

Date is the open row's `at` (UTC); the quote is the start of its `inquiry`. A commit or file citing one of these ids
means the generation whose date matches.

| id | generations |
|---|---|
| L058 | 09-14 07:30 "go ahead and have the orch dis…" · 09-14 11:24 "either way, there should never be a…" · 09-14 12:45 "could we do like an actua…" · 09-15 06:24 "we will complete it all a…" · 09-15 11:22 "'what now' / 'lets do it'…" · 09-16 06:56 "are we on newest build from repo" · 09-20 07:18 "lets do it both, we got this!" · **09-21 07:59 "lets start the repo fixes"** |
| L059 | 09-14 08:34 "build the stick module…" · 09-15 12:44 "diversity collapse and retr…" · 09-16 09:27 "we arent telling a pane what they are good at…" · 09-20 07:28 "lets do it both… (collapse half)" · **09-21 08:33 "repo fixes chunk R-B"** |
| L060 | 09-16 10:12 "no lets finish the battery run" · 09-20 07:35 "retrieval half R2: C3, the order parameter" · **09-21 08:56 "carrier-drift follow-on to L059"** |
| L061 | 09-16 11:18 "we havent done this directly for a bit…" · 09-20 08:36 "C3 closed: the shuffle-refusal guard, true Vicsek…" · **09-21 09:05 "carrier-drift to green: B CH-4 re-freeze"** |
| L062 | 09-16 12:39 "loop mechanic design lap" · 09-20 09:46 "the librarian intake is 154088 against a 150…" · **09-21 09:14 "repo fixes chunk R-C (portable-paths 41)"** |
| L063 | 09-16 12:55 "two hand-backs landed…" · 09-20 11:42 "P-CONTAMINATION" · **09-21 09:38 "R-C4 revised: 30 BENIGN-TEST rows"** |
| L064 | 09-16 13:17 "handback/p-blind-row…" · 09-20 12:10 "B's registered same-pane-same-…" · **09-21 09:48 "green laptop suite"** |
| L065 | 09-16 13:43 "journal future plan…" · 09-20 12:49 "the two delivery-gate defects held from 02:3…" · **09-21 09:55 "state-sync.js:141 landing order steps 2-4"** |

Regenerate this table from the ledger itself, never from this file: fold `lap.jsonl` rows with `stage: "open"` by
`lap`, and list `at` + `inquiry`. The 09-21 generations' commits carry *"(2026-09-21, repo fixes; ledger reissued the
id)"* in their subjects.

## WHAT WAS KEPT

- **Nothing renamed.** Git history and hand-backs cite these ids; renaming any generation would break those citations.
- **Nothing deleted.** The attic copies stay where they are after the union.
- **The union keeps every row once**, keyed on the whole row; rows are ordered by time.

## OWED — the fix the keeper made this conditional on

1. **Stop it recurring** — append-only TRAVELS files install as a file-level fast-forward or refuse and name the rows,
   never replace (pane A, L070 packet 1); and `lap-row.js` refuses to mint an id below this machine's highest id in git
   (landed with C's L070, `lap-row.test.js` 119/0).
2. **Make the repeats read cleanly — NOT YET BUILT.** `lap-row.js` folds by id alone, so a DOUBLE-OPEN id binds `map` and
   `opened` to its first generation. It needs to fold by **(id, generation)**, where a generation starts at each `open`
   row, and report the generation's date wherever it prints the id. Until that lands, read any report of L058–L065 with
   this table beside it.
3. **D's side:** D's rows since 09-10 live only on D. After L closes with the union, D's next launch must refuse to
   replace D's longer ledger (item 1) and D unions its own side the same way.

When item 2 lands, append a line here saying so, with its commit.

**ITEM 2 LANDED, 2026-09-22 03:1x (librarian, on L):** fold by (id, generation) in `lap-row.js`, C's L071 packet C2,
commit `ffb3aa7`. Checked by a count that shares no code with lap-row: open rows by id = L058×8, L059×5, L060–L065×3
(this file's counts); `lap-row.js --report` DOUBLE-OPEN 0; labels read `L058 (2026-09-14 07:30Z, gen 1/8)`. Record:
`librarian/2026-09-22.md` "03:1x — L071 C2". **Item 3 (D's side) is still owed**, and it needs one more step first:
`ledger-union.js` must read the state set's copy, because a refused install on D leaves no attic copy to union from.
