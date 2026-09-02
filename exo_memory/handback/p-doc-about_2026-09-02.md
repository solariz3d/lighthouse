# Hand-back — P-DOC-ABOUT (L032, ALPHA), 2026-09-02 ~05:50

**Packets:** `loop/packet_doc_about_2026-09-02.md` (`a8d11c8`) as re-pointed by
`loop/packet_doc_repoint_2026-09-02.md` (`6c208f4`). Where they disagreed I followed the re-pointing:
**`index.html` inserted directly, no draft file.**
**Paths written:** `consonance/ui/index.html`, `exo_memory/map/A.md`, and this file.
**Nothing committed. Nothing pushed. No file outside those three touched.**
**Non-author read: B.** (Bar: `B → C, C → A, A → B`.)

---

## 1 · WHAT LANDED

**Two edits to `consonance/ui/index.html`, and nothing else in it.** `diff` against a pre-edit copy
reports changes at exactly two regions — `:131` (the Librarian mainhead) and `:250-387` (the About
body). Nothing between them moved.

**Edit 1 — CHARLIE's §6 paragraph at the Librarian mainhead**, at the insertion point C specified:
inside the existing span, after *"Saying nothing is a valid turn."* and before *"Fixed-session,
persistent across restarts"*. 428 characters, **quoted, not rewritten.**

**Edit 2 — the About tab, short form.** Nine copied README sections and a 40-term glossary replaced
by six short ones: *What this is · The seats · The loop · The stance: with you, not above you ·
Honest status · Where to read more.* File 440 → 372 lines; the About body 158 → 90.

## 2 · THE QUOTING IS VERIFIABLE, NOT PROMISED

Both quoted blocks are **extracted from their masters at run time by the edit script**, never
retyped. If either master had changed shape the script would have exited rather than inserted a
stale copy:

    THE LOOP drawing   <- consonance/src-tauri/brief/BUILDING.md, § THE LOOP, first fence
                          (21 lines, matched by /^## THE LOOP\s*\n+```\n([\s\S]*?)\n```/m)
    two-doors para     <- exo_memory/handback/p-two-doors_2026-09-02.md, § 6, ```html fence

The script also refuses to run if the drawing contains `<`, `>` or `&` (it does not), and asserts the
mainhead anchor occurs **exactly once** before touching it. This is the §5 move from
`p-window-inert` applied to a text edit: **make the claim checkable by construction rather than
asserting it in the hand-back.**

## 3 · BARS

| bar | result |
|---|---|
| every factual claim carries a path or a runnable command | met — every claim on the page names a file, and the two testable ones name commands (`cargo test --test arch_test`, the README § pointer) |
| ZERO retired vocabulary | **GREEN**, see §4 |
| carrier-drift GREEN over the three surfaces | **GREEN** — `node consonance/tools/carrier-drift.js` → `DESCRIPTION SURFACES ... 0 finding(s), 0 of them red` |
| nothing edited-not-shipped described as shipped | met, see §5 |
| mutant: reintroduce `lifeguard` → red | **caught**, see §6 |
| mutant: delete the two-doors paragraph → red | **caught**, see §6 |
| do not commit; name your paths | met — `git status` shows the three files modified/untracked, no commit |
| js suite | **745 tests, 740 pass, 5 fail — all five in the three known-red files**, zero new reds |

The suite:

    node --test consonance/tools/*.test.js
    # ℹ tests 745 · pass 740 · fail 5
    # failing files: actors.evidence.test.js · carrier-drift.test.js · corpus-age.test.js

Those three are the reds the re-pointing named as not mine. **No test went red that was green
before my edits.**

## 4 · THE VOCABULARY BAR IS RED AS WRITTEN, AND THE BAR IS WRONG — this is for B's oracle

The bar says: *grep your own output for* `diver|lifeguard|dock|shore`. Run literally, **it is RED on
my page and on the pre-existing tree, and both hits are false positives:**

    grep -nEi "diver|lifeguard|dock|shore" consonance/ui/index.html
    :109  "...rates one voice split six ways as more DIVERSE than six instances"   (pre-existing, E's)
    :306  "...more DIVERSE than six real panes"                                     (mine, Honest status)

`diver` matches `diverse` / `diversity` / `diverge` — **the project's own core vocabulary, which will
never leave the page**, since diversity collapse is the problem this app was built around. Whole
tree: 2 hits in `index.html`, 5 in `term.js`, all of that class.

**Word-boundary form is GREEN:**

    grep -nEi "\b(divers?|diving|lifeguard|dock|shore)\b" consonance/ui/index.html
    # no output — zero retired-vocabulary hits

**For B:** your `carrier-drift.js` is already immune — it matches registered wordings against a
hand-maintained registry rather than substrings, and it returns **0 findings on all three description
surfaces**. The defect is in the *packet's* grep, not your tool. But the packet's grep is what three
panes were told to self-check with tonight, and it cannot go green on this repo. Worth one line in
the bar wording before it is issued again.

## 5 · WHAT I DID NOT CLAIM AS SHIPPED

- **The aura.** The page says *"The tab bar shows which seat holds the loop and where it goes next"*
  and stops there. It ships with this build (`690df7c`, `6fdf2cc`), so the sentence is sayable; it is
  **not** described as verified, seen, or confirmed by anyone, because nobody has looked at it yet.
  The glance after this rebuild is its first verification, and I wrote nothing that would be falsified
  by it looking wrong.
- **The orchestrator's write-back** is described exactly as the old page had it — designed-for,
  partly shipped — not as complete.
- **B's rewritten `consonance/README.md`.** My page points at it by filename and by section name
  (`§ What the gauges do and don't do`, `§ Glossary`), **never by line number**, so B's rewrite cannot
  break my pointers. Both sections exist in the file today (`:74`, `:228`).

## 6 · THE TWO MUTANTS

**Mutant 1 — reintroduce the retired stance heading** (`with you, not above you` → `light, not
lifeguard`), applied to a copy:

    word-boundary grep   RED   (hit: lifeguard)
    B's carrier-drift.js DETECTED — DESCRIPTION SURFACES went 0 findings -> 1 finding,
                                    "PENDING UNACCOUNTED consonance/ui/index.html:299"

Run against the live tree with an md5-verified restore (`586c2640a881dfa6279ef4555a17bc6e` before and
after — **identical**, confirmed, per the *"a named landmine does not generalise; a backup does"*
line B added tonight).

**One observation for B, reported as measured and not as a verdict:** the oracle *sees* the mutant but
files it **`PENDING UNACCOUNTED`, `0 of them red`** — so the description-surfaces block does not go
red on it. If PENDING is meant to be a red for a description surface, that is a gap; if it is a
deliberate two-stage state, this is just a note. **I do not know which and did not guess.**

**Mutant 2 — delete C's two-doors paragraph** from the mainhead, applied to a copy: the presence check
goes RED (`<b>Two doors.</b>` absent). Live file: **PRESENT.**

## 7 · WHAT THIS DOES NOT ESTABLISH

- **That the page renders correctly.** It is structurally sound — tag counts balance (`section 13/13,
  div 52/52, p 11/11, ul 2/2, pre 1/1`) and the diff is confined to two regions — but **nothing has
  rendered it in WebView2.** The `<pre>` carries an inline style because `app.css` is E's and I did
  not touch it; the ASCII drawing is 21 lines wide and I have not seen it wrap. **First render is the
  keeper's glance after the rebuild, same as the aura.**
- **That deleting the glossary was free.** 40 terms left the app and now live only in
  `consonance/README.md § Glossary`, which is **outside the exe** — a reader in the app can no longer
  look up "Delta" or "envelope" without leaving it. That is the direct cost of the keeper's SHORT +
  pointer decision and it is the honest price, not a defect. If it bites, the fix is a glossary tab
  fed from the README, not a copy pasted back into `index.html`.
- **That the short form is complete.** I dropped *Why it exists* (5 items), *How it works* (7 items),
  *The memory architecture* and *Continuity across the gap* wholesale. Every one is in
  `consonance/README.md`. If the keeper wants one of them on the page, it is a paragraph, not a
  section.
- **Anything about the other two surfaces.** B has `consonance/README.md`, C has the root `README.md`.
  I read neither and my page's pointers assume only that the two section names survive.

## 8 · RE-DERIVE

    # the two mutants and the vocabulary bar
    grep -nEi "\b(divers?|diving|lifeguard|dock|shore)\b" consonance/ui/index.html   # expect: no output
    grep -c "<b>Two doors\.</b>" consonance/ui/index.html                            # expect: 1

    # the oracle, three surfaces
    node consonance/tools/carrier-drift.js | grep -A2 "DESCRIPTION SURFACES"

    # the suite
    node --test consonance/tools/*.test.js        # 745 / 740 pass / 5 fail, all three known-red files

    # the quoting is extraction, not retyping — the script is in the scratchpad and its two
    # regexes are printed in §2; both fail loudly rather than inserting a stale copy.
