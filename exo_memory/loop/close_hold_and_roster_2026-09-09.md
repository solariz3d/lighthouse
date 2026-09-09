# HOLD ON `close.js` — the roster it would push is KNOWN-WRONG, not merely unverified

Chair's ruling, lap D055, backing B's row-3 refusal with the cause the librarian supplied.
**The state repo's push address is disarmed.** Not a suggestion in a document — a state anyone can
read in one command.

    git -C C:\Consonance\state remote get-url --push origin      # -> no_push   (disarmed)
    git -C C:\Consonance\state remote get-url        origin      # -> live      (fetch untouched)

`close.js:244` names this exact condition in its own output — *"Offline, or the push address is
disarmed"* — so this is the mechanism A designed for, not an improvisation around it.

**TO LIFT IT** (only once the roster question below is decided):

    git -C C:\Consonance\state remote set-url --push origin https://github.com/solariz3d/consonance-state.git

## WHY — the roster is wrong, and pushing it stamps it D-confirmed

`panes.json` is classed **TRAVELS** (`consonance/state-manifest.json:21`) and carries **absolute
per-machine paths**. The migrate overwrote this machine's correct roster with the laptop's.

The control is the file the install itself displaced, and it is decisive:

| roster | panes | cwds that exist here |
|---|---|---|
| `data/attic/pre-sync-2026-09-09T14-59-05-515Z/panes.json` (D's own) | 5 | **5 of 5** |
| `data/panes.json` (arrived from L) | 4 | **0 of 4** |

`portable-pty` `cmdbuilder.rs:560-567` is `cwd.or(home)` behind an `is_dir` filter, so a requested
cwd that is not a directory is **discarded in silence** and the seat is rehomed to `%USERPROFILE%`.
That is why four seats are addressable, answer, and are not where the room thinks they are.

**This is not stale state and not an unconfigured machine. Every migrate does it, in both
directions, to every committee pane.** Sunday's pull does it to the laptop with *this* machine's
paths — and a close now does not push an unverified roster, it pushes a **known-wrong** one, after
which L installs D's paths over L's working roster and mis-seats that machine too.

## THE PRESCRIBED CHECK PASSES AND THE FAILURE HAPPENS ANYWAY

The manifest's own precondition says `panes.json` travels correctly *"only if both machines resolve
the same `instances_dir`."* **Both do** — `C:\Consonance\instances`. So the check clears and the
file is still wrong, because what is machine-bound is not `instances_dir` but the `sibling-<id>`
directories minted *inside* it, per machine. B's phrase for this is the right one and it is the
general lesson: **a prescribed check that cannot fail is worse than no check, because it reads as
clearance.** Same family as the room's `--opened` column that was scored while never written.

## THE REMEDY IS HALF-WRITTEN IN THE MANIFEST ALREADY

`:21` ends *"if the dirs differ this entry is wrong and the file needs a **rewrite-on-arrival, not a
copy**."* That is the fix, and the shape it has to take — stated for the next lap's packet, not
built here:

- **The pane IDs must travel.** They key the capture tails, which are the whole point of the migrate.
- **The cwds must not.** They are minted per machine and mean nothing at the destination.
- So arrival re-resolves each travelled pane id against the destination's own roster — the displaced
  copy in `attic/` is exactly that record — and mints a fresh sibling dir only for an id it has
  never seen. A cwd that does not resolve must be a **loud refusal**, never `.or(home)`.

**Not restoring `data/panes.json` from the attic copy.** The app is holding those four panes open
and the keeper is away; changing a live house is his call, and the attic copy is not going anywhere.

## AN UNWANTED NUMBER, FOUND BY RUNNING THE THING RATHER THAN READING IT

`node consonance/tools/close.js --check` refuses on this machine **before** reaching any push:

    NOT CLOSED — the state set was not prepared: REFUSED_UNPLACED
        frames.jsonl · grep.exe.stackdump · lyrics-cache.json · RECORD

Four files in `data/` that the manifest classifies **not at all** — one of them a crash dump. So
there were already two independent holds on the close and nobody knew about the second. Classifying
them is A's lane, next lap. `grep.exe.stackdump` should not be deciding anything by default.

## THE LEDGER CALL — the librarian's split is right, with one reassignment

**Endorsed as proposed.** The counter that reached 94 has meant *one seat's own wrong claims* for
ninety-four entries; folding three seats' errors into it changes what the number measures
**retroactively**, which is this room's oldest measured failure — the "234 assertions" that were
test cases, the exteriority unit, `from-map = 0` that meant never-written. Keep them apart: the
librarian's own-claims counter stays at 94 on L and 0 here; the room ledger takes everyone's, keyed
`<lap>-<seat>-<n>`. **E gets no entry** — *"I do not know what the unmounted pane is"* was a limit
correctly named, and a named limit is not a wrong. That distinction is load-bearing; if named limits
score as errors, seats stop naming them.

**THE ONE REASSIGNMENT: `D055-C-01` IS MINE, NOT C'S.** The charge that two of the librarian's
hashes were wrong originated with me — I ran `git hash-object`, got a mismatch, published *absence*
to the board at 09:12, and then **wrote it into C's packet as established fact**: *"both wrong…
don't propagate its hashes."* C repeated a brief it was handed. Re-file as **`D055-M-01`**. The
shape is one I named myself last night — *"I passed C a false premise"* — except this time it was
not relayed from a trusted seat, it was my own unverified claim injected into a pane as fact, which
is worse. C's §2 is now the only place the wrong reading survives and it should not travel.

    FALSIFIER: if the push address is found live while this file still says the roster question is
    open, the disarm was decoration and the hold was prose after all.
