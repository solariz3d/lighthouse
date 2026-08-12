# The pane permission gap, found by using the room rather than auditing it

*2026-08-12. Two findings about Consonance that came out of a long external build (the Valheim
agent), where the committee was doing real work for hours rather than measuring itself. Written down
because they existed only in a conversation.*

---

## 1. The fresh-pane allowlist solves the wrong half

`b7141b0` gave fresh panes a read-only allowlist — `Read, Glob, Grep, WebSearch, WebFetch,
TodoWrite` — so a research fan-out stops costing the chair a click per tool call. That was the right
fix for the observed problem ("like playing a whack a mole mini game") and it is the wrong fix for
what fresh panes turned out to be good at.

**The best-sourced document of the first Valheim round came from a fresh pane that wrote its own
ECMA-335 metadata reader**, because no public decompile of the game newer than 2021 exists. A second
one carved a 5.5 MB localisation TextAsset out of `resources.assets` by hand. A third found
Mono.Cecil already on the machine inside an unrelated application and used it without installing
anything.

Every one of those is Bash. The allowlist deliberately excludes Bash, and correctly — there is no
safe Bash subset, since `node -e '...'` is arbitrary execution and a scoped `Bash(node *)` rule is a
containment that is not one.

So the allowlist made fresh panes good at reading the web and left them unable to do the thing they
are best at, and the keeper answered the prompts by hand for twenty minutes rather than drop the
guard.

## 2. There is no way to elevate a pane FROM THE CHAIR

The only remedy is `shift+tab` inside the pane. That is a keystroke, so it cannot be done by the
chair, cannot be audited, cannot be bounded, and cannot be undone from outside.

Consonance already has the right shape for this and uses it elsewhere: the gate's **open channel** is
a pre-authorised auto-approve window bounded by an envelope of exchanges and a deadline, snapping
back to ask-each when spent. The same idea applied to a pane's own permissions would close this:

    chair_elevate <pane> [--for N minutes]

- token-gated like every other chair verb
- audited to the board on grant AND on expiry
- bounded by construction, so the elevated state cannot outlive the task
- refused for room panes, whose scoped permissions ARE their safety design

**What it is not:** a way to make fresh panes elevated by default. The whole value of a fresh pane is
that it is a genuinely vanilla instance. This is a way for the chair to lend it a bounded hand for a
task that needs one, in the open, rather than the keeper reaching across and flipping a switch that
nothing records.

---

*Neither of these was found by auditing the room. They were found by the committee doing eight hours
of external work and the friction showing up where it actually lives — which is the argument the
2026-08-09 board table was making when it counted 18 multi-pane laps in the board's entire life.*
