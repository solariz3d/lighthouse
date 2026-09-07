# PATCH FOR C — the capture watcher stops dying silently (L043, E)

*Pane E, 2026-09-07. **You hold `main.rs` this lap; I did not touch it.** This is a reviewed patch
to fold into your landing, plus the module it needs, which is mine and already on disk.*

    MINE, ALREADY WRITTEN   consonance/src-tauri/src/harvest_guard.rs   new, pure, 17/17, 4/4 mutants
    YOURS TO FOLD           consonance/src-tauri/src/main.rs            1 mod line, 1 reader line,
                                                                       2 new fns, 1 watcher body

**This is bigger than the alias patch (2 lines) and I am saying so up front.** The watcher body has
to be extracted into a function before it can sit inside a `catch_unwind`, so the diff looks larger
than the change is: **the extracted body is the existing body verbatim with each `continue` turned
into `return false`.** Nothing inside it is re-ordered or re-worded. Diff it against `:1079-1131`
and that is the whole claim.

---

## 1 · WHAT IS ACTUALLY WRONG — one mutex, two policies

```text
main.rs:1053   reader    if let Ok(mut e) = emu_r.lock() { … }     poisoned -> skip, keep reading
main.rs:1087   watcher   Err(_) => break                           poisoned -> the thread DIES
```

Bytes kept flowing into an 82 MB `.log` because the reader tolerates exactly what kills the
watcher, while the clean `.txt` sat frozen. **A dead watcher and a quiet pane have the same
footprint**, so nothing said so, and the panes' `PRIOR CONVERSATION` has been a 09-02 capture for
five days.

**The packet's item 1 says fix the watcher. Fixing only the watcher is not enough, and this is the
one thing in here I would ask you to read twice.** The reader's `if let Ok` means that after any
poisoning it silently stops feeding the emulator *for good*. A watcher that recovers would then
re-harvest a permanently frozen screen, dedup it to nothing, and report itself healthy — the same
outcome as today, now with a green light on it. **Both sides of the mutex have to recover, or
neither is fixed.** Hence `harvest_guard::recover`, called from both.

---

## 2 · THE MOD LINE

Beside the existing `mod` block (`main.rs:20-31`):

```rust
mod harvest_guard;  // the capture watcher's recovery + liveness policy; one mutex, one policy (E, L043)
```

## 3 · THE READER — one line (`main.rs:1053`)

```rust
    // BEFORE
                    if let Ok(mut e) = emu_r.lock() {
                        e.parser.process(&buf[..n]);
                        e.last_byte = Instant::now();
                    }

    // AFTER — ONE MUTEX, ONE POLICY. Declining to feed the emulator after a poisoning freezes
    // the screen permanently, which is indistinguishable from the watcher being dead.
                    {
                        let mut e = harvest_guard::recover(emu_r.lock());
                        e.parser.process(&buf[..n]);
                        e.last_byte = Instant::now();
                    }
```

## 4 · TWO NEW FREE FUNCTIONS

Put them next to `ready_dir`/`ready_path` (`main.rs:7292-7300`), which they deliberately mirror:

```rust
fn harvest_dir() -> PathBuf {
    let p = data_dir().join("harvest");
    let _ = fs::create_dir_all(&p);
    p
}

/// The watcher's liveness stamp. SEPARATE from `data/ready/` on purpose — see the patch note §7.
/// One writer (the pane's own watcher thread), whole-file write, no merge, so there is no
/// two-writers window here.
fn write_harvest_stamp(pane: &str, hg: &harvest_guard::HarvestGuard) {
    let _ = fs::write(harvest_dir().join(format!("{pane}.json")), hg.stamp_json(pane));
}

/// One harvest pass. Returns whether a turn was appended or stitched.
///
/// This is `main.rs:1081-1131` verbatim, with each `continue` become `return false`, lifted out so
/// the whole pass fits inside one `catch_unwind`. A panic anywhere in here used to cost the pane.
fn harvest_once(
    emu: &Arc<Mutex<EmuState>>,
    text_path: &Path,
    last: &mut Option<(String, String)>,
) -> bool {
    let (lines, wrapped): (Vec<String>, Vec<bool>) = {
        // ONE MUTEX, ONE POLICY: the reader tolerates a poisoned lock, so the watcher does too.
        let e = harvest_guard::recover(emu.lock());
        if e.last_byte.elapsed() < Duration::from_millis(500) {
            return false; // still streaming — wait for the turn to settle
        }
        let screen = e.parser.screen();
        let rows: Vec<String> = screen.rows(0, EMU_COLS).collect();
        let flags: Vec<bool> =
            (0..rows.len() as u16).map(|i| screen.row_wrapped(i)).collect();
        (rows, flags)
    };
    if !capture::screen_ready(&lines) {
        return false;
    }
    let lines: Vec<String> = lines.iter().map(|l| capture::strip_overlay(l)).collect();
    let prompt = capture::latest_prompt(&lines, &wrapped);
    if prompt.is_empty() {
        return false; // no visible user prompt — skip noise
    }
    let resp = capture::latest_turn(&lines, &wrapped);
    if resp.trim().is_empty() {
        return false;
    }
    if let Some((lp, lr)) = last.clone() {
        if lp == prompt {
            if lr == resp {
                return false; // same settled turn still on screen — already recorded
            }
            // same turn, different window: grow the record where it sits
            let merged = capture::stitch(&lr, &resp);
            if merged != lr {
                rewrite_last_record(text_path, &prompt, &lr, &merged);
                *last = Some((prompt, merged));
                return true;
            }
            return false;
        }
    }
    if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(text_path) {
        let _ = write!(f, "❯ {prompt}\n\n{resp}\n\n");
    }
    *last = Some((prompt, resp));
    true
}
```

**One behaviour to preserve deliberately, because it looks like a bug and is not yours to fix
here:** if the append `open` fails, the original still updates `last` and moves on. I kept that
exactly. Changing it is a separate call with its own reasoning.

## 5 · THE WATCHER BODY (`main.rs:1075-1132`)

```rust
    let text_path = capture_text_path(&pane_id);
    let emu_w = emu.clone();
    let alive_w = alive.clone();
    let pane_w = pane_id.clone();                     // <- new: the stamp needs the pane id
    std::thread::spawn(move || {
        let mut last: Option<(String, String)> = read_last_record(&text_path);
        let mut hg = harvest_guard::HarvestGuard::new();
        while alive_w.load(Ordering::Relaxed) {
            std::thread::sleep(Duration::from_millis(250));
            let now = harvest_guard::now_ms();

            // ATTEMPT, before the work and regardless of its outcome. A stamp that advanced only
            // on a successful write could not tell a dead thread from a quiet pane — which is the
            // bug this stamp exists to detect, rebuilt inside the detector.
            if hg.attempt(now) {
                write_harvest_stamp(&pane_w, &hg);
            }

            match harvest_guard::guarded(|| harvest_once(&emu_w, &text_path, &mut last)) {
                Ok(recorded) => {
                    hg.note_ok();
                    if recorded {
                        hg.note_record(now);
                    }
                }
                Err(msg) => {
                    // A panic costs ONE TURN, not the pane. The message is kept because the app's
                    // stderr goes to no file, and on 09-02 that is exactly what was missing.
                    if hg.note_panic(msg) == harvest_guard::Recovery::Reinitialise {
                        {
                            let mut e = harvest_guard::recover(emu_w.lock());
                            e.parser = vt100::Parser::new(EMU_ROWS, EMU_COLS, 0);
                        }
                        hg.note_reinitialised();
                    }
                    write_harvest_stamp(&pane_w, &hg);   // a panic is worth a stamp immediately
                }
            }
        }
        // The reader ended, which is the ordinary reason to stop. Say so: a killed thread cannot.
        hg.note_exit();
        write_harvest_stamp(&pane_w, &hg);
    });
```

---

## 6 · THE FAILURE THE THREE ITEMS COMPOSE INTO, which is why `Reinitialise` exists

Items 1 and 2 together create something neither has alone. **If the panic is DETERMINISTIC** — a
screen state that panics `rows()` every time — then catching it and continuing is a permanent panic
loop at the 250 ms poll: a burned core, forever, writing to a stderr that goes nowhere. Recovering
harder makes it worse, not better.

So recovery is **bounded**: three consecutive panics is not transient, and the parser is rebuilt
once. One success in between clears the count, so a scatter of unrelated panics never accumulates
into a reset. **A single reset costs one screen. A loop costs a core.**

This is the packet's own *"the answer may be recover but re-initialise"* — arrived at from the
failure mode rather than taken from the hint, and it lands as a bound on recovery rather than as a
replacement for it.

---

## 7 · WHY THE STAMP IS SEPARATE FROM `data/ready/`, and it is not a preference

The packet asked whether the harvest stamp joins your ready surface. **It must not share the file,
and the reason is the packet's own warning applied to placement.**

`data/ready/<session>.json` is written by the **hooks, inside the pane's claude process**, and
answers *"is the pane's harness idle?"*. The harvest stamp is written by the **app's watcher
thread** and answers *"is the thing that records this pane still alive?"*. Different subject,
different writer, different failure.

1. **Sharing the path means two unsynchronised writers** — a node hook and a Rust thread — on a
   file with no lock. That is the two-writers window you are already holding this lap; there is no
   reason to open a second one.
2. **Decisive: a shared file's freshness would be maintained by whichever writer survived.** A dead
   watcher plus live hooks produces a stamp that looks perfectly healthy. **That is the 09-02 bug
   rebuilt inside the instrument meant to detect it** — the same mistake as stamping on write
   instead of on attempt, one level up.

**Join them at the READER, not at the file.** The delivery row already prints ready state; it can
print harvest state beside it from `data/harvest/<pane>.json`. Two files, one surface. The fields
are deliberately separate so no reader can use "when did this last produce output" as "is this
alive": `at_ms` is the attempt clock, `last_record_ms` is the record clock, and `exited` marks a
clean stop that a killed thread cannot write.

---

## 8 · WHAT I RAN, AND WHAT I COULD NOT

```text
consonance/src-tauri/src/harvest_guard.rs      17 tests, 17 pass
  rustc --test --edition 2021 harvest_guard.rs

MUTANTS, applied to a COPY in scratch — the real file was never mutated:
  1  restore Err(_) => break     (recover panics on poison)      RED  2 tests
  2  drop catch_unwind           (guarded calls f directly)      RED  3 tests
  3  stamp only on write         (attempt stops advancing)       RED  4 tests
  4  never reinitialise          (Recovery::Continue always)     RED  1 test
  4 applied / 4 caught / 0 survivors
```

**The patch's SHAPE compiles**: the reader block, `harvest_once`, and the watcher loop above were
compiled verbatim against stub types mirroring `vt100`, `capture`, `EmuState` and the record
helpers. That proves the borrow, lifetime and unwind structure — in particular that
`AssertUnwindSafe` accepts the `&mut last` borrow across the closure, which is the only part of
this that could have needed gymnastics. It does not prove the patch compiles inside the crate.

**NOT APPLIED, and named rather than counted as caught:**

- **The patch has not been compiled against `main.rs`.** Doing that needs either editing your file
  or a full Tauri dependency build; the first is forbidden this lap and the second did not fit in
  it. **Please `cargo check` before you fold, and tell me if the free functions need a lifetime I
  did not write.**
- **Mutants 1 and 2 were applied to the POLICY, not to the watcher.** They prove
  `harvest_guard` behaves; they do not prove `main.rs` calls it. Only the fold does that.
- **The watcher thread has never been exercised.** No pane was harvested with this code.

---

## 9 · WHAT WOULD SHOW IT WORKED — not a claim that it did

**The stall is not fixed until a relaunch says so, and that is the keeper's hand, not mine.** What
I changed is above; here is what would show it:

1. **All four `.txt` mtimes advance within one settled turn.** The packet's falsifier. Needs a
   rebuild and a relaunch.
2. **`data/harvest/<pane>.json` exists for every live pane and its `at_ms` advances while the pane
   is idle.** This is the new one and it is checkable in seconds without any pane doing work — if
   `at_ms` is frozen while the app is up, the watcher is dead and now says so.
3. **If it dies again, `last_panic` and `panics` are populated.** That is the observation that
   expired on 09-02 — *poisoned mutex, or panic in the body?* — and I could not recover it. **I am
   not claiming to know which it was.** Item 1 covers (a) and item 2 covers (b), and the stamp is
   built so the next occurrence answers the question instead of leaving it to a resize test nobody
   takes in time.
