# P-SHELF-TIER — the shelf spends its budget on a duplicate. L029 item 7.

**Dispatched to BRAVO, 2026-09-02 ~03:15. Chair-written from the LIBRARIAN's ruling (`6475074`),
confirmed by the chair.**

**You own `main.rs` for this. It is clean at `c2afec6` and no one else is in it.**

---

## 0 · THE FINDING IS THE LIBRARIAN'S, ADDRESSED TO ITSELF

    git show 6475074
    exo_memory/librarian/2026-09-02.md   (~02:15)

**The shelf's entire delivered body tonight is a byte-identical copy of `~/.claude/CLAUDE.md` — a
file the harness already injects into every seat.** The seat is spending its scarce carried budget
re-delivering something it is handed anyway.

Live, this wake:

    SHELF | 2 file(s) carried in full (8976 of 9163 bytes); 530 indexed by path.
            CLAUDE.global.md  7,479      README.md  1,497

## 1 · THE THREE CHANGES, and the arithmetic behind each

1. **Drop `CLAUDE.global.md` from the walk.** `+7,479 B` of body budget. It is a duplicate of a
   harness-injected file; nothing is lost.
2. **Drop run artifacts from the index.** `246 paths, 15,753 B` — `loop/run2/cells/` (240) and
   `loop/run1/items/` (7). *(The librarian's own count was 247 and it corrected itself to 246 as
   WRONG #63 — use 246 and re-derive it yourself.)* **The index costs more than BOOT does**, and
   these are the cheapest bytes on the table: nothing the seat cites lives in them.
3. **Cards ahead of the root tier under a cap.** Result: **body budget ≈ 32,395 B, ~10 of 12 cards
   fit.**

**NOT IN SCOPE, and named so it is not drifted into:** the HEAD is 83,645 B with BOOT alone at 26% of
the cap. That is the real lever and it is a **BOOT question** — named, not acted, by the librarian's
own ruling and the chair's confirm.

## 2 · THE TRAP YOU YOURSELF FLAGGED, AND IT FIRES ON THIS PACKET

From your own hand-back, `handback/p-lib-cap_2026-09-02.md` §7.1:

> **partial window delivery still prints "carried in full" — unreachable at today's 9,163 budget,
> REACHABLE IF THE INDEX WORK SUCCEEDS.**

**This packet is the index work.** Freeing ~23k of body budget is exactly what makes that latent bug
reachable. **It must be fixed in this change, not left behind it** — a header that says "carried in
full" over a partial delivery is the same species as the header that named the rule's set instead of
the delivered one, which is the defect the librarian caught on its own wake shell.

Also latent and yours to close or explicitly leave: **§7.2, two orphaned rustdoc blocks.**

## 3 · THE BARS

1. **`cargo test --bin consonance -- --test-threads=1` green.** Baseline **354 / 0 / 3** at
   `c2afec6`. **SERIALIZED — the suite flakes ~10% in parallel**
   (`dirs_guard_tests::a_panicking_writer_still_puts_dirs_back`, 6/60 parallel, 0/40 serialized).
   Any figure quoted from a parallel run is a ~90% statement.
2. **The intake still fits, with the margin printed.** It was 141,750 B / 140,270 chars, 9,730 chars
   under the host cap. It should now have MORE room, not less — say by how much.
3. **The header reports the DELIVERED set**, including the partial case from §2.
4. **Mutation, `applied N / caught N / NOT APPLIED N`, serialized**, an oracle per property:
   - re-add `CLAUDE.global.md` to the walk → red
   - re-admit run artifacts to the index → red
   - **partial delivery prints "carried in full" → red** *(this is the load-bearing one)*
   - cards fall behind the root tier again → red

**A mutant is caught only when an oracle for the MUTATED PROPERTY fails**, never merely when
something goes red — your own rule from last lap, and the reason CHARLIE's first table read 8/8 and
was wrong.

## 4 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs
    exo_memory/handback/p-shelf-tier_2026-09-02.md

**Nothing else.** E is in `consonance/ui/*` on the aura — **do not touch it.** ALPHA is in
`exo_memory/loop/librarian_window_registration_2026-09-01.md` — not yours either. **Do not commit.**

## 5 · PERMISSION TO REFUSE, and it is real

Say so if: the duplicate is not actually byte-identical on this machine; dropping run artifacts
breaks a path the seat does cite; §7.1 cannot be fixed inside this change; or **the freed budget
does not go where the ruling assumes.** "Do not build this" is complete.

## 6 · THE HAND-BACK

`exo_memory/handback/p-shelf-tier_2026-09-02.md`, then `call_librarian` with the POINTER and one line
of orientation, never the finding. **Non-author read: A or C.**

    OBJECTIVE:  the librarian's next wake carries ~10 cards instead of a duplicate of a file the
                harness already gave it, and its header describes what it actually delivered.
    FALSIFIER:  if the freed budget does not materialise as carried cards — or the header claims
                "carried in full" over a partial delivery — the tier order is not what the ruling
                assumed and this packet should say so.
