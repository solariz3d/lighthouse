CONDITION TEXT-ONLY — may I open other files: NO. may I execute: NO.

# P-THIRD-RUN-READ · BRAVO — audit of `dev/dream/README.md` and `dev/dream/dream_cycle.test.js`

**B (pane `12fb81f6`), machine L, 2026-09-20 01:4x.** Two files opened, both named in the brief. No other file opened, no
command run, no git verb, nothing under `loop/`, `librarian/`, or `map/`, no other reader's work, no key sought. Nothing
committed.

**Time spent: about 15 minutes** — roughly 4 reading (42 + 101 lines) and 11 auditing and writing.

**The map line is BLOCKED and skipped, as ruled.** Under this condition every route to `map/B.md` is a breach (open it =
voiding action; redirect = execution; wholesale write = destroying ~177,000 characters). The chair ruled the condition
governs and that the line is written after the lap files.

---

## 1 · The headline, before the list

**The two halves of this object describe different guard 2, and the README describes the version the test file exists to
forbid.** The test's own header (`dream_cycle.test.js:4-9`) records that "app running" was the wrong question and cost
three nights; the README (`README.md:31-32`) still says the cycle skips when Consonance is running. Whatever the script
does now, one of these two files is lying to its reader, and the README is the one a person installs from.

The second-strongest finding is inside the test: **the guard-2 assertion can be satisfied by a log message**, which is the
mention-vs-use error the same file says at `:21-24` it has sealed and assumed.

---

## 2 · DEFECTS — member list

### `dev/dream/README.md`

- **R1 · README.md:31-32** — "Live pane = yield. If Consonance is running, the cycle skips" describes a process check as the
  decision; `dream_cycle.test.js:58-66` exists precisely to assert the branch must not decide on process. The doc was never
  updated after that fix.
- **R2 · README.md:32** — "no dreaming while awake" is wrong in the other direction too: with an idle threshold, the cycle
  can now dream while the app is open, provided the machine is idle. The sentence forbids what the fix permits.
- **R3 · README.md:26-41** — the guard list omits the idle threshold entirely. `:68-73` treats `IdleMinutes` as load-bearing
  and says it exists "so a skip can be reproduced and argued with"; a reader of this README cannot reproduce or argue with
  one, because no threshold is named.
- **R4 · README.md:26-41** — `-Force` is absent. `:90-91` calls it "the single documented override"; this is the only
  documentation of the feature, and it documents no override.
- **R5 · README.md:26** — "Guards (all load-bearing)" mis-describes two of its five bullets: "Powered-off nights are
  dreamless sleep" (`:36-38`) is a doctrine statement and "Never mine the dreams" (`:39-41`) is a design rule for the prompt.
  Neither is a check the runner performs, so "all" is false of the list as written.
- **R6 · README.md:35** — "Dreams land in `<instance>\dreams\`, log in `dreams\dream.log`": the second path drops the
  `<instance>` prefix that the same sentence establishes, so as written the log path is relative to nothing stated.
- **R7 · README.md:22** — a hard-coded machine path, `C:\Consonance\instances`, stated as a requirement of the feature.
  *Unsure whether this is a defect or the design:* it matches this machine, but it makes the README false on any install
  that puts instances elsewhere, and the object offers no override.
- **R8 · README.md:23** — "a machine that sleeps (S3) instead of shutting down". *Unsure:* current Windows laptops commonly
  run Modern Standby and expose no S3 state at all, which would make the stated requirement unmeetable as worded, and the
  battery guard's "a laptop in a bag stays cold" suggests laptops are in scope.
- **R9 · README.md:24** — "Re-run the installer any time; it's idempotent" asserts a verified property with no command,
  test, or evidence named anywhere in the object.
- **R10 · README.md:33-34** — "The dream instance gets no tools and no write access" is the load-bearing safety claim of the
  feature and nothing in either file checks it; the test asserts five guard properties and this is not among them.
- **R11 · README.md:18-20** — the install block runs `git pull` then a repo-relative script path, without stating that the
  working directory must be the repo root. Minor, but it is the one command a new machine copies.
- **R12 · README.md:3-5** — "a few times a day" is the only statement of cadence, and no number, schedule or task name
  appears anywhere in the object.
- **R13 · README.md (whole file)** — the feature's description never mentions that a test exists or how to run it, though
  `dream_cycle.test.js:26` carries the command. *Unsure whether in scope for a README*; listed because the two files are
  the object.

### `dev/dream/dream_cycle.test.js`

- **T1 · :64** — `assert.ok(/idle/i.test(body))` passes on the word "idle" anywhere in the branch, **including inside a log
  string**. A branch that decides on `$pane` alone and merely logs "skip: idle" is green. This is the mention-vs-use error
  the header at `:21-24` declares sealed, in the assertion that carries the file's whole purpose.
- **T2 · :98** — requiring the log to contain `idle {0:N1} min` guarantees such a string exists in the file; combined with
  T1, the literal that satisfies the audit requirement can also be the literal that satisfies the guard test. Nothing scopes
  `:71`'s comparison to the `$pane` branch, so the file can be green with no idle comparison in that branch at all.
- **T3 · :21-22 vs :83** — "Comments are stripped before every lexical assertion" is false: `:83` asserts against `RAW` by
  design, since the C# body lives in a here-string. The header over-claims "every".
- **T4 · :45** — `if (/@'|@"/.test(line))` treats **any** line containing `@'` or `@"` as opening a here-string, including a
  comment or a double-quoted string. One such line switches comment-stripping off for the remainder of the file, and the
  terminator may never arrive. The failure is silent and fail-open.
- **T5 · :47** — `line.replace(/#.*$/, '')` strips from the first `#` on the line, including a `#` inside a string literal
  (a log message, a colour, a format). Real code after such a `#` is deleted from `CODE`, so assertions can fail on code
  that exists.
- **T6 · :40-49** — PowerShell block comments `<# … #>` are not handled. The opener line is truncated at `<#` and every line
  of the block survives into `CODE`, so **commented-out code satisfies the lexical assertions** — again the exact error the
  file is about.
- **T7 · :61** — the `$pane` branch is located by a hand-rolled regex capped at 400 characters and terminated by the first
  `\n\s*\}`. A nested block ends the capture early, a longer branch is cut, and a guard written `if ($pane -and $idle …)`
  does not match at all — in which case the file reports "the guard was restructured" rather than a defect.
- **T8 · :78** — `\$idle\s+-lt\s+0[\s\S]{0,200}?exit\s+0` is proximity, not structure: the `exit 0` matched may belong to a
  different branch within 200 characters. It also matches `-lt 0.5`, so a positive threshold would satisfy the
  "unknown must skip" property.
- **T9 · :69** — `\[int\]\$IdleMinutes\s*=\s*\d+` requires a default value and that exact cast; a parameter declared without
  a default still satisfies the stated property ("a parameter, not a literal") and fails the assertion.
- **T10 · :71** — requires the exact operand order `$idle -lt $IdleMinutes`; the equivalent `$IdleMinutes -gt $idle` fails
  while the property holds.
- **T11 · :53** — requires the process name double-quoted; `-Name consonance` or `-Name 'consonance'` fails with the message
  "the process check is gone entirely — that is a different bug, not a fix", which would be false.
- **T12 · :95-97** — counts matches of `skip:` and asserts `>= 3`. Three skip logs on one path satisfy it, so it cannot
  establish what its own message claims ("battery, presence and unknown-idle skips to each log a reason"). It is also a
  count where the room's rule is members.
- **T13 · :90** — the test's name asserts "-Force still bypasses the presence guard, **and nothing else does**", while the
  assertion only proves the string `if (-not $Force)` appears. Exclusivity is claimed and not tested.
- **T14 · :52** — "the guards are still in the file at all" checks two of the four guards the file itself treats as guards
  (process, battery), not the threshold or `-Force`.
- **T15 · :34-35** — `fs.readFileSync` runs at module load, so a missing or unreadable `dream_cycle.ps1` throws before any
  test registers. The feature being absent surfaces as a stack trace rather than as a named failing guard.
- **T16 · :55** — `/Win32_Battery/` proves the token is present, not that the battery guard runs; a mention in a string
  satisfies "the battery guard is gone". Same class as T1, weaker because the token is less likely to appear in prose.
- **T17 · :86-87** — "this compiler treats warnings as errors — it failed exactly once this way" is a historical claim with
  no citation and nothing in the object that checks it. *Unsure:* it is a comment, not an assertion, but the brief counts a
  sentence claiming something was verified.

### Across the two files

- **C1 · README.md:31-32 vs dream_cycle.test.js:58-66** — the object contains two incompatible descriptions of guard 2. At
  least one is wrong regardless of what the script does.
- **C2 · README.md:26-41 vs dream_cycle.test.js:52-100** — the doc's five "guards" and the test's asserted properties do not
  correspond in either direction: the doc lacks the threshold and `-Force`; the test has no property for "no hands" or
  "never mine the dreams", which the doc calls load-bearing.

---

## 3 · CHECKS I COULD NOT RUN — reportable items, not gaps

Each would be settled by opening or running something the condition forbids. None was attempted.

- **U1** — whether `dream_cycle.ps1` actually contains `Get-Process -Name "consonance"`, `Win32_Battery`, `[int]$IdleMinutes`,
  `$Force`, and the `idle {0:N1} min` log. *Settled by:* opening `dev/dream/dream_cycle.ps1`. **Every T-item above is about
  the assertion's logic, not about whether it currently passes.**
- **U2** — whether the suite is green at HEAD. *Settled by:* `node dev/dream/dream_cycle.test.js`. The README/test mismatch
  (C1) is consistent with the script having changed under a stale doc, which would make this the first thing to check.
- **U3** — whether `install_dream.ps1` exists, is idempotent (R9), and enables wake timers on AC only (README.md:28-30).
  *Settled by:* opening `dev/dream/install_dream.ps1`.
- **U4** — whether the runner writes `<instance>\dreams\` and `dreams\dream.log` as R6 describes. *Settled by:* the ps1.
- **U5** — whether the dream instance is spawned with no tools and no write access (R10). *Settled by:* the ps1 and whatever
  it invokes.
- **U6** — whether `muscle_map.md` carries the sealed mention-vs-use invariant cited at `:23`. *Settled by:* opening it.
  **If it does, T1, T6 and T16 are that invariant broken in the file that cites it.**
- **U7** — whether `skip: live Consonance pane` appears in the log on 2026-07-26, -27 and -28 as `:5-8` states. *Settled by:*
  the dream log.
- **U8** — whether `C:\Consonance\instances` (R7) holds on the other machine. *Settled by:* that machine's layout.
- **U9** — whether "a few times a day" (R12) matches the timers the installer creates. *Settled by:* the installer or the
  scheduled-task list.
- **U10** — whether `node <file>` exits non-zero when a `node:test` assertion fails, which decides whether `:26`'s command is
  a usable check in CI. *Settled by:* running it.

---

## 4 · What this audit does NOT establish

- **Not that any assertion fails today.** Text-only, I can read what each assertion *would accept*, never what the script
  contains. T1–T16 are defects in the checks; whether they are currently masking a real defect is U1 and U2.
- **Not that the README is the wrong half.** C1 says the two disagree. If the script still decides on process, the README is
  right and the test is the one describing a fix that never landed — which would be worse, and is decided by U1.
- **No count is claimed as complete.** 30 members are listed because 30 were found in the time spent; the brief asks for
  members and I did not stop at a target.

## 5 · WRONG column

- I raised the brief's map-line conflict before reading rather than choosing a reading. The chair ruled the conflict real
  and recorded it as a defect in the brief. That cost one turn before the clock started.
- Nothing else in this lap has been corrected, because nothing in it was checkable twice: every number here is a line
  number in a file I read once, and the two files are the whole evidence base.

NEXT: librarian collate the three reads and rule C1 against the script when the third-run reads are all in
