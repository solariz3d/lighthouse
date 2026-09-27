# The trailer fix — DRAFT (L124, pane C, on L, 2026-09-27)

**A draft only. Nothing is edited.** HEAD `7fa3c3f`.

**E's census (`loop/trailer_gate_census_2026-09-27.md`) had not landed when this was written.** The counts below are
mine, from my own two scripts. §4 says what in E's census would change the recommendation.

## 0 · THE ANSWER FIRST — I refuse both (a) and (b) as fixes for the cause, and draft a third

- **The cause is not the form.** Every pane is taught the right form at least three ways (§1).
- **The cause is that the pane never learns its line failed.** A warned `call_librarian` ring:
  - delivers the gate's note to the **librarian**, appended to the message;
  - posts it to the **board**, a place panes do not read in-turn;
  - returns to the **pane** only `delivered to the librarian …` (`consonance/src-tauri/src/mcp.rs:905-923`).
- **I was one of the panes.** My own L118, L119 and L120 rings today were warned, and I learned it tonight from the
  board, not from the gate.
- **The draft is (c): tell the sender.** (a) would move 14 of 50 warned lines, those using `before` or `after`, and
  leave the other 36 untouched. (b) would add a fourth copy of a line panes already have.

## 1 · WHERE A PANE MEETS THE TRAILER'S FORM, cited

| where | path:line | the form it teaches |
|---|---|---|
| the pane's own brief | `consonance/src-tauri/brief/COMMITTEE.md:226-237` | `NEXT: <station> <command> when <condition>` at `:230`, with an example at `:232` |
| the dispatch master | `consonance/src-tauri/brief/BUILDING.md:212-218` (WHAT A DISPATCH OWES item 6) | the same shape at `:216`, with an example at `:218` |
| the hand-back master | `consonance/src-tauri/brief/BUILDING.md:440-446` (WHAT A HAND-BACK OWES item 6) | the same shape at `:444` (BUILDING.md reaches the chair only, `main.rs:6759`) |
| the librarian's brief | `consonance/src-tauri/brief/LIBRARIAN.md:283-290` | the same shape at `:287` |
| **every chair dispatch** | the board, rows carrying `[chair:MAIN]` | a ready-made line, e.g. `NEXT: librarian call_librarian with the pointer when the draft is written — plan default after it: …` |
| the gate's refusal (chair_inject, call_chair only) | `consonance/src-tauri/src/trailer.rs:249-260` | names what is missing, prints the shape and an example, and returns the message whole |
| the gate's warning (call_librarian) | `trailer.rs:263-273`, `delivered_with_warning` | the same content, **addressed to the receiver**, per its own comment at `:263-264` ("The note is not addressed to the sender") |

**The chair's trailers teach the right form, measured:**
- **Command:** `node <scratchpad>/l124/chairnext.js 2026-09-16T00:00:00Z`.
- **Since 09-16:** 394 rows carry `[chair:MAIN]`. **384 end with a NEXT line containing `when`**, 142 of them with the
  `— plan default after it:` tail. The other 10 are compaction continuations, not dispatches.
- **Today:** 37 of 38 are `when` plus the tail; the other 1 is a compaction continuation.
- **So this is not a finding about the chair.**
- **One pattern is worth naming.** Panes that write their own line copy the chair's **tail** and drop its **`when`**:
  - e.g. `NEXT: librarian collate the read and rule on the item-2 tension in its §3 — plan default after it: A re-scans 443ae45..HEAD, …` (board, 2026-09-27 10:40Z);
  - the `after` in "plan default after it" is the only condition-like word in such a line.

**What the gate's messages tell a seat.**
- **The refusal** (chair and librarian) is good. It names the missing part (`trailer.rs:221-223`), shows the shape and an
  example, and returns the message whole.
- **The warning never reaches the seat that could act on it.**

## 2 · WHAT THE WARNED LINES ACTUALLY WERE

- **Command:** `node <scratchpad>/l124/gate.js 2026-09-16T00:00:00Z`. It reads the board through `chain-status.js`'s own
  parser, deduped on (pane, text).
- **Data:** the 50 delivered messages that carry the gate's note, classified by their last NEXT line.

| the NEXT line | n | would (a) accept it? | would (b) help? |
|---|---|---|---|
| no NEXT line at all | 20 | no | only if the pane re-reads its brief |
| a NEXT line with no condition word (`… and rule whether …`, `… then …`) | 13 | no | same |
| a condition, but with `before` | 9 | **yes** | same |
| a condition, but with `after` | 5 | **yes** | same |
| has `when`, another defect (not last, quoted) | 3 | no | no |

- **The 20 missing lines** cluster on 09-22 and 09-23.
- **Today's 11 warned lines** (10:16–11:24Z, A and B) are all `before`, `after` or no word.
- **The three mine in the list** (L118–L120) are no-word lines with the NEXT line mid-message.
- **The trailer-gate board rows are fewer (6 since 09-16).** Not every warning is posted under the `trailer-gate` pane.
  E's census is the one to reconcile that.

## 3 · THE DRAFT — (c) the warning goes to the sender as well

**Where:** `consonance/src-tauri/src/mcp.rs`, `call_librarian`, the trailer-gate match at `:905-916` and the return at
`:919-923`.

**The change:** keep the audit line, and append it to what the PANE is told. The pointer is still delivered first and
unchanged, so nothing about the no-refusal guarantee moves.

```diff
-        let text = match trailer_gate(crate::trailer::Verb::CallLibrarian, &format!("call_librarian from {who}"), &text) {
+        let mut told = None;
+        let text = match trailer_gate(crate::trailer::Verb::CallLibrarian, &format!("call_librarian from {who}"), &text) {
             TrailerDecision::Deliver { text, audit } => {
                 if let Some(line) = audit {
+                    told = Some(line.clone());
                     self.trailer_audit(line);
                 }
                 text
             }
@@
         let out = self
             .send_chair(ChairCmd::CallLibrarian { from: self.identity.clone(), text, reply: tx }, rx)
             .await;
+        // D069 warned the RECEIVER and the board; the sender, the one seat that can fix its next line, was told
+        // nothing (L124). Tell it here, after the delivery result, so a warning can never read as a refusal.
+        let out = match told {
+            Some(w) => format!("{out}\n\n[NEXT-trailer gate — your hand-back WAS delivered, but: {w}. \
+                End your next ring with `NEXT: <station> <command> when <condition>`, \
+                e.g. `NEXT: librarian collate the chunk when all four hand-backs are in`.]"),
+            None => out,
+        };
         Ok(CallToolResult::success(vec![Content::text(out)]))
```

**Its test, red first** (in `mcp.rs`'s `trailer_gate_tests`, the module that already pins the call_librarian arm by
source segment at `:3747`/`:3760`):
- **Pin:** the `call_librarian` segment contains `told = Some(` and appends `told` to `out` after `send_chair`.
- **Behaviour, if a stubbed send is available:** a ring with a `before`-only trailer returns a reply containing
  `WAS delivered`.
- **A mutant** that drops the `format!` arm must go red.

**What (c) costs:**
- about ten lines in one verb and one test;
- a Rust rebuild before it is live;
- **it loosens nothing** (the gate's grammar is unchanged), and **adds nothing to any brief**.
- **Its one risk:** a pane may read the note as a refusal and re-send. The wording says `WAS delivered` first for that
  reason.

## 4 · IF THE LIBRARIAN WANTS (a) OR (b) ANYWAY — the lesser of the two, and what E's census could change

**(a) is the lesser.** It is one change in `trailer.rs` `find_when` (`:82`): also accept the whole words `once`,
`after`, `before` and `until` as the separator, and name the matched word in `Trailer`.
- **It would have accepted 14 of the 50** (§2).
- **It loosens a gate that deliberately does not judge meaning** (`:100-102`). Accepting `before X` as a condition lets
  "do Y before the push" pass, which says what must precede, not when the next seat acts.
- **It needs its tests amended.** `a_station_with_no_when_clause_is_refused` (`:337`) and `when_inside_a_longer_word_is_not_the_clause` (`:371`) would change, and the refusal text at
  `:223` names `when`.

**(b) I would not do.** The line exists at `COMMITTEE.md:230`, and the chair prints a correct one in every dispatch
(§1). A fifth copy teaches nothing the four do not, and adds a carrier to keep in sync.

**Dependence on E's census:**
- **The recommendation changes only if E finds most warnings or refusals are on the `chair_inject` or `call_chair`
  edges.** The sender already sees those refusals, so (c) would not reach them.
- **My data says the warn edge dominates:** 50 warned messages against 2 refusal rows since 09-16.
- **If E counts differently, the librarian should weigh E's classification over my §2**, which is one scripted pass
  without a second reader.

## NOT VERIFIED

- **The diff is not compiled or tested.** It is a draft against `mcp.rs` at `7fa3c3f`, and the variable names may need
  adjusting.
- **§2's classification is a regex over the last NEXT line** (`gate.js`). A line with `when` inside a quoted example is
  counted as `has when`.
- **Why only 6 `trailer-gate` rows sit beside 50 warned messages** was not traced.
- **Whether panes would act on a sender-side note is untested.** E's watch-style count after it lands is the test:
  warned rings per pane per lap should fall.
