# Desktop observations — 2026-08-25, written from the desktop against `683d468`

**What this is:** what a second machine sees when it pulls the night's work. **Observations only.** No
fixes proposed and no causes inferred beyond what a command printed. Every claim below has the
command that produces it; re-derive rather than trust this file.

**What this is not:** a review of the work. I have not read most of the 102 commits. This is the
output of running the gates on a machine that is not the one they were written on.

**The tree is untouched.** Nothing here was edited, staged, or fixed. This file is the only addition.

---

## 0. What "here" means

```
repo            C:\Users\nname\Desktop\lighthouse
hostname        DESKTOP-EEGVFMT
room_path       C:\Users\nname\Desktop\lighthouse\exo_memory\BOOT.md   (~/.consonance.json)
machine_tag     ABSENT from ~/.consonance.json
release exe     target/release/consonance.exe, built 2026-08-22 23:33
```

`C:\Consonance\` exists and contains `backups`, `data`, `instances`. **`C:\Consonance\lighthouse`
does not exist.**

*Note for whoever runs this next:* `cargo` is not on the Git-Bash PATH here. `cargo test` returns
**127 = command not found**, which is not a test failure. Use
`export PATH="$HOME/.cargo/bin:$PATH"` first. I nearly reported the 127 as a red suite.

---

## 1. Both gates are red

```
node consonance/tools/js-suite.js          EXIT 1
  59 green · 2 failed · 0 crashed · 0 silent · 0 canary  (of 61)
  FAILED: consonance\tools\actors.test.js
  FAILED: consonance\tools\lap-row.test.js

cargo test --quiet                          EXIT 101
  test result: ok. 22 passed; 0 failed
  test result: ok. 77 passed; 0 failed; 3 ignored
  test result: ok. 77 passed; 0 failed; 3 ignored
  ...then 9 FAILED
```

Exit codes captured into a variable immediately, not through a pipe — per the trap in
`handoff_2026-08-22.md` §5.

---

## 2. The nine Rust failures are all one message

```
committee_brief_tests::the_committee_brief_resolves
committee_brief_tests::the_brief_does_not_duplicate_the_verb_list
committee_brief_tests::committee_practice_reaches_the_intake
librarian_tests::the_intake_carries_the_citation_rule
librarian_tests::the_intake_states_what_the_seat_must_not_do
librarian_tests::the_brief_precedes_the_room
shelf_tests::the_shelf_carries_the_forward_pointed_layer
shelf_tests::the_shelf_reaches_the_intake
shelf_tests::the_split_between_carried_and_indexed_is_always_reported
```

The panic text:

```
brief COMMITTEE.md not found: The system cannot find the path specified. (os error 3)
LIBRARIAN.md must resolve or the seat must refuse to wake
intake must resolve
the committee practice never reached the pane intake
```

**The brief files are present and tracked here.** `git ls-files consonance/src-tauri/brief/` returns
all ten, including `COMMITTEE.md` and `LIBRARIAN.md`. So this is resolution, not absence.

`room_brief()` at `src/main.rs:2595` tries four tiers. Tiers 3 and 4, verbatim:

```rust
"{}\\Consonance\\lighthouse\\consonance\\src-tauri\\brief\\{}", sysdrive(), name
"{}\\OneDrive\\Desktop\\projects\\lighthouse\\consonance\\src-tauri\\brief\\{}", home(), name
```

Neither directory exists on this machine.

---

## 3. A CORRECTION I OWE YOU, before anyone fixes at the wrong urgency

I first told the keeper *"the app can't find its own briefs on this machine."* **That was wider than
what I checked, and I am withdrawing it.**

What I verified is that **nine tests fail**. `target/release/` contains `COMMITTEE.md` and
`LIBRARIAN.md` as bundled resources, so tiers 1–2 have something to resolve against at runtime.

```
ls target/release/COMMITTEE.md target/release/LIBRARIAN.md    # both present
```

**I did not launch the app and did not confirm production behaviour either way.** The failure I can
demonstrate is in the `cargo test` path, which has no Tauri resource root and falls through to the
two machine-specific tiers.

---

## 4. `lap-row.test.js` passes only where `machine_tag` is `L`

```
node -e "console.log(require('./consonance/tools/lap-row.js').mintId([]))"
  -> D001
```

`lap-row.test.js` hardcodes `L001` / `L004` / `L009` at roughly fifteen sites
(75, 76, 83, 84, 93, 107, 118, 129, 150, 152, 165, 166, 199, 206, 207).

Observed failures:

```
must not re-mint the deleted L002    actual 'D004'   expected 'L004'
                                     actual 'OK'     expected 'DOUBLE-OPEN'
regex /has no map yet/ vs input      'Error: no such lap: L001'
Error: no such lap: L001             (x many)
```

`dcb0d9b`'s own message records: *"this machine: machine_tag `L` written to ~/.consonance.json"*.
This machine has no such field, so the tag derives from the hostname per the design — `D`.

**Stated plainly and without judgement:** the mint behaves exactly as `dcb0d9b` specifies. The test
is the part that assumes a literal.

---

## 5. `portable-paths` is green through all of the above

```
node consonance/tools/portable-paths.js     EXIT 0
  portable-paths: green — 183 files in scope, 165 known sites, 0 new
  34 baselined site(s) carry a FATAL verdict — exempted, NOT fixed. Run --fatal to see them.
```

`--fatal` lists this exact pattern at four other sites in the same file:

```
DISGUISED  main.rs:343  ex(format!("{}\\Consonance\\lighthouse\\exo_memory\\BOOT.md", sysdrive()))
DISGUISED  main.rs:344  .or_else(|| ex(format!("{}\\OneDrive\\Desktop\\projects\\lighthouse\\...
DISGUISED  main.rs:419  let disk = PathBuf::from(format!("{}\\Consonance\\lighthouse\\exo_memory\\cards"
DISGUISED  main.rs:423  PathBuf::from(format!("{}\\OneDrive\\Desktop\\projects\\lighthouse\\...
```

The baseline holds **165 sites, 28 of them in `main.rs`, 4 of those `DISGUISED`.**

---

## 6. What I could NOT determine from here

Listed because absence of a finding is not a finding.

1. **Whether `room_brief`'s tiers are baselined-and-exempted or invisible to the scanner.** The
   baseline keys on `{file, detector, verdict, text}` and its line field reads `0000`, so I could
   not match a specific line. Both readings end at the same observed outcome — green tool, red
   tests — but they are different defects and I did not separate them.
2. **Whether `lap-row.test.js` was red when it was committed, or only red here.** I cannot run the
   laptop's config.
3. **Whether the shipped app resolves briefs correctly at runtime.** See §3. I inferred from the
   presence of resource files and did not verify.
4. **Anything about the other ~100 commits.** I ran gates. I did not review the work.

---

## 7. Also observed, not investigated

```
node consonance/tools/open-items.js         4 of 5 still open
```

`actors.test.js` now counts as a **hard failure rather than a canary** — the suite line reads
`0 canary (of 61)` and exits 1, where `handoff_2026-08-22.md` §4 recorded it as `1 canary` with the
runner exiting 0. I did not trace what changed.

---

**Written by the desktop instance. Nothing above is a proposed fix, and the fixes are not mine to
choose — the seat that wrote this work knows why it is shaped the way it is.**
