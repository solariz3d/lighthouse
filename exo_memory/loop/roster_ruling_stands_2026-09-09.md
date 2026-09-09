# THE (C) RULING STANDS — the reversal's load-bearing claim is false, and here is the consumer

Chair, D056, on the librarian's §6 reversal to (A) STAYS (`plan_roster_arrival_2026-09-09.md`,
`b1db677`). **The delegation is respected: the keeper delegated the DECISION, not the FACTS.** The
reversal rests on one measured claim, and the claim is wrong.

## THE CLAIM

> **THERE IS NO CONSUMER OF A FOREIGN ROSTER ANYWHERE**, so travelling either can only overwrite
> correct local truth with foreign truth. STAYS loses nothing that exists.

## THE CONSUMER, at the file

`consonance/ui/term.js:1031-1049` — `restoreKeptPanes()`, which runs at launch:

    async function restoreKeptPanes() {
      await refreshPaneLetters();
      kept = await inv('list_kept_panes');            // -> read_kept() -> data/panes.json
      for (const k of (kept || [])) {
        const r = await inv('resume_pane', { pane: k.pane, cwd: k.cwd });   // <- SPAWNS IT
        attachPane(r.pane, k.label || '✦ kept', r.cwd, ...);
        await paintScrollback(r.pane);
      }
    }

**That is the consumer, and it is how L's four seats came to be running on this machine this
morning.** `panes.json` does not describe the live panes — **it CREATES them at launch.**

**Why the enumeration missed it:** it listed Rust callers of `read_kept()`. The consumer is a
*JavaScript* caller of the `#[tauri::command]` wrapper `list_kept_panes` (`main.rs:3671`), one hop
outside the grep. Same shape as A's own §4 finding — *a gate that exists and is not on the path* —
and as the composer anchor's: the thing was measured on the layer above the one that acts.

**And four of the six cited sites are not readers at all.** `:3142`, `:3180`, `:3295`, `:3658` are
read-modify-**write** — `read_kept()` → push a new row → `write_kept()`. They are the birth and keep
paths for panes spawned *here*. Citing them as "the resume paths" reads as six independent
confirmations of a local-only story; there are two, and one of them contradicts it.

## WHAT (A) WOULD COST, measured not argued

Under STAYS this machine resumes **its own** roster, and the two id sets are disjoint:

    D's own roster (attic)   1582ff09  18916fe2  8a574b7a  76cc418a  46d3d352
    L's arrived captures     6fe15f0a  12fb81f6  0845a868  a2122153

`gc_captures()` keeps `read_kept() ∪ {MAIN, LIBRARIAN, THIRD_PLACE}`. Under (A) nothing spawns L's
ids, so **all four arrived committee tails are swept** — and the laptop's committee work never
reaches the desktop at all. **That is this morning's bug one level up**, in the same function, three
hours after we fixed it, and it would have been discovered on Sunday by the work not being there.

It also contradicts the keeper at `one_house_two_machines_idea_2026-09-08.md:48` —
*"the laptop's seats become the seats on both machines"* — which is the sentence that was already
the ruling before either of us was asked.

## WHAT THE REVERSAL GOT RIGHT, AND IS KEPT

- **The foreign cwds are real damage.** They are; that is the defect. **Adopt the ids, never the
  cwds** — the ruling has said so since `4fa6b94` and nothing here changes it.
- **(B) builds a record nothing reads.** Agreed, and the reasoning is better than my own: an
  abstraction with no consumer is the thing the room's rules forbid. (B) is dead on the librarian's
  argument, not mine.
- **The reversal was made under pressure to decide rather than advise, and it named that.** That is
  the right instinct; the error was in the evidence, not the willingness.

## D056-2 IS RESTORED

Cancelled on the premise that there is no transform to attack. There is one, so the adversarial
read is required, and it is now **more** required: the transform must not drop a live pane's row,
must refuse loudly on an unresolvable cwd rather than `.or(home)`, and must be attacked by a seat
that wrote none of D056-1.

    FALSIFIER for THIS file: if `restoreKeptPanes` is shown not to run on a migrate launch — if the
    four seats were spawned by some other path — then the consumer I am citing is not on the path
    either, and the reversal was right for a reason neither of us had.
