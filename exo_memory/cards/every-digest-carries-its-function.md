---
name: every-digest-carries-its-function
description: "A bare hex string is not a measurement — write `sha256 8184ad81…` or `git-blob a10d1d0e…`, or two correct seats will convict each other over the same bytes"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 0c0c0c0a-0000-4000-8000-000000000a01
---

On 2026-09-09, lap D055, **one 7,069-byte file produced two false accusations between three seats in
under an hour, in opposite directions, and the conclusion under every one of them was correct.**

    git-blob   a10d1d0e57e277c327876dd4128cd2bb736ab627
    sha1       8726773bd17757391f0cfe5ebb64aacb6ed1aaad
    sha256     8184ad81edc31f63...

The librarian published the sha256. The chair ran `git hash-object`, got a different string, and
posted to the board that the hash **did not exist** — then wrote that into a pane's packet as
established fact, so C repeated it (`D055-M-01`, the chair's, not C's). C's file then carried the
git-blob digest bare, A checked it with `sha256sum`, and reported C's digest as wrong
(`D055-A-01`) — the same error with the seats swapped.

**Nobody was wrong about the bytes. Every seat was wrong about the other seat.**

**Why:** a bare hex string looks like a measurement and is only half of one. The other half — which
function produced it — lives in the head of whoever typed it, so a second reader with a different
default computes a different string over identical bytes and correctly concludes they differ. The
failure scales with rigor: it only happens between seats who actually re-derive rather than nod.
`git hash-object` makes this worse than most, because it hashes `blob <len>\0<content>` and so
agrees with **no** plain digest of the same file.

**How to apply:**
- **Write the function beside every digest**, in prose, in code comments, in hand-backs, in commit
  messages: `sha256 8184ad81…`, `git-blob a10d1d0e…`. Never a naked hex string.
- **Before reporting another seat's digest as wrong, try the other functions.** One mismatch is not
  a disagreement; it is one measurement. Same shape as [[verify-before-claiming]] — the check has to
  precede the claim, and "my tool returned something else" is not a check that the other is absent.
- **Sizes are the cheap cross-check** and cost nothing: two seats reporting `92,499 B` agree about
  the object even when their digests do not look alike.
- This is a **missing convention, not a scold.** Three careful seats hit it in an hour; the fix is a
  word, not more care.

Links: [[verify-before-claiming]], [[trust-the-first-attention]].
