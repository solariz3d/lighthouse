# Root 1 — the 10 items

Built by pane B per `root1_preregistration.md` (commit `c59a562`). **Claims only.** Ground truth,
the file:line that settles each one, and the file hashes taken at build time are held outside this
repo; the path is on the board and in B's report to the chair. This file is safe for the chair to
read and is the file each claim is pasted from, verbatim.

All paths are relative to the repo root (`C:/Users/nname/Desktop/lighthouse`). Each claim names the
file it concerns, so the object is one `Read` away in every condition.

**Not part of any claim, for the courier:** claims are about the working tree as it stood at commit
`c59a562`. The files used are all cold — none has been touched in the last day of commits — but B
recorded a hash of each at build time and will verify it at scoring. If a file moved under the run
and the movement changes a claim's truth value, that item is void and is reported as void rather
than scored.

---

**1.** In `consonance/tools/corrections-gate.js`, a commit that adds a STRUCK or SUPERSEDED marker
passes the gate even though its diff deletes no lines.

**2.** In `consonance/src-tauri/src/gate.rs`, the pull threshold a `GateInner` starts with by
default is `0.5`.

**3.** In `consonance/tools/tell-index.js`, a protective disclaimer is counted whenever it occurs in
a turn, regardless of how far into the turn it appears.

**4.** In `consonance/src-tauri/src/tether.rs`, `novelty()` returns `1.0` when there is no prior
text to compare the turn against.

**5.** In `consonance/src-tauri/src/capture.rs`, a line consisting of the `❯` marker followed only
by whitespace is treated as the start of a user prompt.

**6.** In `consonance/src-tauri/src/mcp.rs`, the first refused attempt at a given verb always posts
to the board; only repeats inside the throttle window are absorbed silently.

**7.** In `consonance/tools/sourced.js`, value-claims are graded by risk and only the ones above the
risk bar are flagged.

**8.** In `consonance/tools/catch-ledger.js`, fenced code blocks are replaced by spaces of equal
length rather than removed, so that the line numbers the tool reports stay correct.

**9.** In `consonance/tools/residue.js`, the regular expression that decides whether a commit
subject declares a correction does not include the word `fix`.

**10.** In `consonance/tools/whats-live.js`, the running binary is reported stale when the newest
source commit's timestamp is equal to the binary's build timestamp.
