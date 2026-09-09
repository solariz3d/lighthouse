//! harvest_guard — the capture watcher's recovery and liveness policy, kept out of the watcher.
//!
//! ## The receipt
//!
//! `main.rs` holds one `Mutex<EmuState>` and reads it from two threads under **two different
//! policies**:
//!
//! ```text
//! :1053  reader   if let Ok(mut e) = emu_r.lock() { ... }      poisoned -> skip, keep reading
//! :1087  watcher  Err(_) => break                              poisoned -> the thread DIES
//! ```
//!
//! On 2026-09-02 the watcher stopped. Bytes kept flowing into an 82 MB `.log` because the reader
//! tolerates what kills the watcher, while the clean `.txt` sat frozen. **A dead watcher and a
//! quiet pane have the same footprint**, so nothing anywhere said so, and the panes' last words
//! have been a 09-02 capture for five days.
//!
//! ## Why RECOVER rather than re-initialise, and where re-initialise is still right
//!
//! What the mutex guards is a `vt100::Parser` and an `Instant`. A panic while holding it leaves
//! the parser mid-escape-sequence at worst — a VT parser resyncs on the next well-formed
//! sequence, and the raw `.log` is the fidelity backstop either way. **Set that against the
//! alternative, which is permanent silent loss of every pane's last words.** Recover.
//!
//! **But recovery plus `catch_unwind` composes into a new failure the three-item packet did not
//! have:** if the panic is DETERMINISTIC, catching it and continuing produces a permanent panic
//! loop at the poll interval, burning a core and writing to a stderr that goes to no file. So
//! recovery is bounded — after [`RESET_AFTER`] consecutive panics the caller is told to rebuild
//! the parser, which is the "recover but re-initialise" answer arriving from the failure mode
//! rather than from the hint. A single reset costs one screen; a loop costs a core forever.
//!
//! ## Why the stamp counts ATTEMPTS
//!
//! A stamp that advances only on a successful write cannot tell a dead thread from a quiet pane —
//! **that is the bug this instrument exists to detect, rebuilt inside the instrument.** So
//! [`HarvestGuard::attempt`] is called before any work and regardless of outcome, and the written
//! stamp carries the attempt clock, the record clock and the panic count as separate fields. A
//! reader that wants "is it working" and a reader that wants "is it alive" are asking different
//! questions and the stamp answers both without conflating them.

use std::sync::{MutexGuard, PoisonError};
use std::time::{SystemTime, UNIX_EPOCH};

/// Consecutive caught panics before the caller is told to rebuild the emulator.
pub const RESET_AFTER: u32 = 3;

/// How often the stamp is written to disk. The watcher polls at 250 ms; writing every poll would
/// be four disk writes per second per pane to record "still nothing". The ATTEMPT CLOCK inside
/// the stamp advances every poll regardless — only the write is throttled.
pub const STAMP_EVERY_MS: u64 = 5_000;

/// What the caller should do after a caught panic.
#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Recovery {
    /// Keep going; the next pass may well succeed.
    Continue,
    /// Too many in a row to be transient — rebuild the parser before the next pass.
    Reinitialise,
}

/// Take a lock whether or not it is poisoned.
///
/// **One mutex, one policy.** Both the reader and the watcher must call this: recovering in the
/// watcher alone leaves the reader's `if let Ok` silently declining to feed the emulator, so the
/// watcher would faithfully re-harvest a permanently frozen screen, dedup it to nothing, and look
/// exactly as broken as before while reporting itself healthy.
pub fn recover<'a, T>(r: Result<MutexGuard<'a, T>, PoisonError<MutexGuard<'a, T>>>) -> MutexGuard<'a, T> {
    match r {
        Ok(g) => g,
        Err(poisoned) => poisoned.into_inner(),
    }
}

/// Run one harvest pass so a panic costs one turn instead of the pane.
///
/// `AssertUnwindSafe` is one wrapper, not a gymnastic: the closure borrows the caller's `last`
/// record and its path, and a panic mid-pass leaves `last` merely STALE — the next pass re-reads
/// the screen and the existing stitch/dedup path absorbs it. There is no invariant here that a
/// half-finished pass can break, which is exactly the condition `AssertUnwindSafe` asserts.
///
/// **The panic message is returned rather than dropped**, because the app's stderr goes to no
/// file. On 2026-09-02 the separating observation — poisoned mutex, or panic in the body? — was
/// never taken and is now gone. This cannot recover that answer, but it makes the next occurrence
/// carry its own.
pub fn guarded<F, R>(f: F) -> Result<R, String>
where
    F: FnOnce() -> R,
{
    std::panic::catch_unwind(std::panic::AssertUnwindSafe(f)).map_err(|e| {
        if let Some(s) = e.downcast_ref::<&str>() {
            (*s).to_string()
        } else if let Some(s) = e.downcast_ref::<String>() {
            s.clone()
        } else {
            "panic with a non-string payload".to_string()
        }
    })
}

/// Milliseconds since the epoch. Separated so every policy method can be driven deterministically
/// from a test rather than from the clock.
pub fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

/// The watcher's own account of itself.
#[derive(Debug, Clone)]
pub struct HarvestGuard {
    attempts: u64,
    records: u64,
    panics: u64,
    consecutive_panics: u32,
    reinitialisations: u64,
    last_attempt_ms: u64,
    last_record_ms: u64,
    last_stamp_ms: Option<u64>,
    last_panic: Option<String>,
    exited: bool,
    reset_after: u32,
    stamp_every_ms: u64,
}

impl Default for HarvestGuard {
    fn default() -> Self {
        Self::with_policy(RESET_AFTER, STAMP_EVERY_MS)
    }
}

impl HarvestGuard {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_policy(reset_after: u32, stamp_every_ms: u64) -> Self {
        Self {
            attempts: 0,
            records: 0,
            panics: 0,
            consecutive_panics: 0,
            reinitialisations: 0,
            last_attempt_ms: 0,
            last_record_ms: 0,
            last_stamp_ms: None,
            last_panic: None,
            exited: false,
            reset_after,
            stamp_every_ms,
        }
    }

    /// Record that a pass is being ATTEMPTED. Call before the work and regardless of what the
    /// work returns. Returns whether the stamp is due to be written to disk now.
    pub fn attempt(&mut self, now_ms: u64) -> bool {
        self.attempts += 1;
        self.last_attempt_ms = now_ms;
        let due = match self.last_stamp_ms {
            None => true,
            Some(prev) => now_ms.saturating_sub(prev) >= self.stamp_every_ms,
        };
        if due {
            self.last_stamp_ms = Some(now_ms);
        }
        due
    }

    /// A pass completed without panicking. Clears the consecutive count — a reset is for a
    /// deterministic panic, and one success in between proves it was not one.
    pub fn note_ok(&mut self) {
        self.consecutive_panics = 0;
    }

    /// A pass actually appended or stitched a turn.
    pub fn note_record(&mut self, now_ms: u64) {
        self.records += 1;
        self.last_record_ms = now_ms;
    }

    /// A pass panicked and was caught.
    pub fn note_panic(&mut self, message: String) -> Recovery {
        self.panics += 1;
        self.consecutive_panics += 1;
        self.last_panic = Some(message);
        if self.consecutive_panics >= self.reset_after {
            Recovery::Reinitialise
        } else {
            Recovery::Continue
        }
    }

    /// The caller rebuilt the parser after [`Recovery::Reinitialise`].
    pub fn note_reinitialised(&mut self) {
        self.reinitialisations += 1;
        self.consecutive_panics = 0;
    }

    /// The watcher is leaving its loop for the ordinary reason: the pane's reader ended.
    /// A stamp written after this is a CLEAN exit, which a dead thread cannot produce.
    pub fn note_exit(&mut self) {
        self.exited = true;
    }

    pub fn attempts(&self) -> u64 {
        self.attempts
    }
    pub fn records(&self) -> u64 {
        self.records
    }
    pub fn consecutive_panics(&self) -> u32 {
        self.consecutive_panics
    }
    pub fn last_attempt_ms(&self) -> u64 {
        self.last_attempt_ms
    }

    /// The stamp, as one line of JSON.
    ///
    /// `at_ms` is the ATTEMPT clock, never the record clock — they are separate fields precisely
    /// so no reader can accidentally use "when did this last produce output" as "is this alive".
    pub fn stamp_json(&self, pane: &str) -> String {
        format!(
            "{{\"pane\":{},\"at_ms\":{},\"attempts\":{},\"records\":{},\"last_record_ms\":{},\
             \"panics\":{},\"consecutive_panics\":{},\"reinitialisations\":{},\"exited\":{},\
             \"last_panic\":{}}}",
            json_str(pane),
            self.last_attempt_ms,
            self.attempts,
            self.records,
            self.last_record_ms,
            self.panics,
            self.consecutive_panics,
            self.reinitialisations,
            self.exited,
            match &self.last_panic {
                Some(m) => json_str(m),
                None => "null".to_string(),
            },
        )
    }
}

/// Minimal JSON string escaping — the stamp carries a pane id and a panic message, and a panic
/// message is arbitrary text that will contain quotes.
fn json_str(s: &str) -> String {
    let mut out = String::with_capacity(s.len() + 2);
    out.push('"');
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            c if (c as u32) < 0x20 => out.push_str(&format!("\\u{:04x}", c as u32)),
            c => out.push(c),
        }
    }
    out.push('"');
    out
}

/// Poison a mutex on purpose, for the recovery tests. Kept here rather than in the test module so
/// the doc above and the thing it describes cannot drift apart.
#[cfg(test)]
fn poison<T: Send + 'static>(m: &std::sync::Mutex<T>) {
    let _ = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        let _g = m.lock().unwrap();
        panic!("poisoning on purpose");
    }));
}

#[cfg(test)]
mod tests {
    use super::*;

    // ── item 1: recover, do not break ────────────────────────────────────────────────────────

    #[test]
    fn a_poisoned_lock_still_yields_its_data_instead_of_ending_the_thread() {
        let m = std::sync::Mutex::new(vec![1u8, 2, 3]);
        poison(&m);
        assert!(m.lock().is_err(), "precondition: the mutex must actually be poisoned");

        let g = recover(m.lock());
        assert_eq!(&*g, &vec![1u8, 2, 3], "the guarded state survives the poisoning intact");
    }

    #[test]
    fn recovery_is_repeatable_so_a_poisoned_lock_does_not_cost_the_second_pass_either() {
        let m = std::sync::Mutex::new(0u32);
        poison(&m);
        for expected in 1..=5u32 {
            let mut g = recover(m.lock());
            *g += 1;
            assert_eq!(*g, expected, "pass {expected} still reaches the state");
        }
    }

    #[test]
    fn recovery_leaves_a_healthy_lock_untouched() {
        let m = std::sync::Mutex::new(7u32);
        let g = recover(m.lock());
        assert_eq!(*g, 7, "the un-poisoned path is the ordinary lock and nothing else");
    }

    // ── item 2: a panic costs one turn, not the pane ─────────────────────────────────────────

    #[test]
    fn a_panicking_pass_returns_an_error_instead_of_unwinding_the_caller() {
        let r: Result<u32, String> = guarded(|| panic!("extraction blew up"));
        assert!(r.is_err(), "the panic must be caught, not propagated");
        assert!(
            r.unwrap_err().contains("extraction blew up"),
            "the message is carried out, because the app's stderr goes to no file",
        );
    }

    #[test]
    fn the_caller_keeps_running_and_its_borrowed_state_survives_a_panicking_pass() {
        let mut last: Option<String> = Some("kept".into());
        let _ = guarded(|| {
            let _borrowed = &mut last;
            panic!("mid-pass");
        });
        // The pass is abandoned; `last` is merely stale, which the next pass absorbs.
        assert_eq!(last, Some("kept".into()));

        let ok: Result<u32, String> = guarded(|| 42);
        assert_eq!(ok, Ok(42), "the very next pass runs normally");
    }

    #[test]
    fn a_non_string_panic_payload_still_produces_a_message() {
        let r: Result<(), String> = guarded(|| std::panic::panic_any(7u8));
        assert_eq!(r.unwrap_err(), "panic with a non-string payload");
    }

    // ── the composed failure: recovery + catch_unwind must not become a panic loop ────────────

    #[test]
    fn a_deterministic_panic_is_bounded_by_a_reinitialise_instead_of_looping_forever() {
        let mut g = HarvestGuard::new();
        assert_eq!(g.note_panic("boom".into()), Recovery::Continue);
        assert_eq!(g.note_panic("boom".into()), Recovery::Continue);
        assert_eq!(
            g.note_panic("boom".into()),
            Recovery::Reinitialise,
            "three in a row is not transient — rebuild rather than spin at the poll interval",
        );
    }

    #[test]
    fn one_success_in_between_proves_the_panic_was_transient_and_forgives_the_count() {
        let mut g = HarvestGuard::new();
        g.note_panic("a".into());
        g.note_panic("b".into());
        g.note_ok();
        assert_eq!(
            g.note_panic("c".into()),
            Recovery::Continue,
            "a scatter of unrelated panics must not accumulate into a reset",
        );
    }

    #[test]
    fn reinitialising_clears_the_count_so_the_next_reset_needs_a_fresh_run_of_failures() {
        let mut g = HarvestGuard::new();
        for _ in 0..RESET_AFTER {
            g.note_panic("x".into());
        }
        g.note_reinitialised();
        assert_eq!(g.consecutive_panics(), 0);
        assert_eq!(g.note_panic("y".into()), Recovery::Continue);
    }

    // ── item 3: ATTEMPT, not WRITE. This is the mutant that matters. ─────────────────────────

    #[test]
    fn the_stamp_advances_on_attempts_that_produce_no_record() {
        let mut g = HarvestGuard::new();
        for i in 0..10u64 {
            g.attempt(1_000 + i * 250);
        }
        assert_eq!(g.attempts(), 10);
        assert_eq!(g.records(), 0, "the pane was quiet — nothing was written, by design");
        assert_eq!(
            g.last_attempt_ms(),
            1_000 + 9 * 250,
            "the attempt clock advanced anyway; a write-log would still read 0 here",
        );

        let s = g.stamp_json("PANE");
        assert!(s.contains("\"attempts\":10"), "{s}");
        assert!(s.contains("\"records\":0"), "{s}");
        assert!(s.contains("\"at_ms\":3250"), "{s}");
    }

    #[test]
    fn a_quiet_pane_and_a_dead_thread_are_distinguishable_which_is_the_whole_point() {
        let mut quiet = HarvestGuard::new();
        let mut dead = HarvestGuard::new();
        // Both produce no records. The quiet one keeps attempting; the dead one stopped at t=1000.
        dead.attempt(1_000);
        for i in 0..20u64 {
            quiet.attempt(1_000 + i * 250);
        }
        assert_eq!(quiet.records(), dead.records(), "identical by the write-log measure");
        assert!(
            quiet.last_attempt_ms() > dead.last_attempt_ms(),
            "and separable by the attempt measure — 82 MB of .log said the same thing",
        );
    }

    #[test]
    fn the_write_is_throttled_but_the_attempt_clock_is_not() {
        let mut g = HarvestGuard::with_policy(RESET_AFTER, 5_000);
        assert!(g.attempt(0), "the first attempt always writes, so a stamp exists early");
        let mut writes = 0;
        for i in 1..=20u64 {
            if g.attempt(i * 250) {
                writes += 1;
            }
        }
        assert_eq!(g.attempts(), 21, "every poll counted");
        assert_eq!(writes, 1, "only the poll at 5000ms was due");
        assert_eq!(g.last_attempt_ms(), 5_000, "and the clock tracked all of them");
    }

    #[test]
    fn a_record_advances_its_own_clock_without_disturbing_the_attempt_clock() {
        let mut g = HarvestGuard::new();
        g.attempt(1_000);
        g.note_record(1_000);
        g.attempt(2_000);
        let s = g.stamp_json("P");
        assert!(s.contains("\"at_ms\":2000"), "{s}");
        assert!(s.contains("\"last_record_ms\":1000"), "{s}");
        assert!(s.contains("\"records\":1"), "{s}");
    }

    #[test]
    fn a_clean_exit_is_distinguishable_from_a_death() {
        let mut g = HarvestGuard::new();
        g.attempt(500);
        assert!(g.stamp_json("P").contains("\"exited\":false"));
        g.note_exit();
        assert!(
            g.stamp_json("P").contains("\"exited\":true"),
            "the reader ended and the watcher said so — a killed thread cannot write this",
        );
    }

    #[test]
    fn the_stamp_carries_the_panic_message_because_stderr_goes_nowhere() {
        let mut g = HarvestGuard::new();
        g.attempt(0);
        assert!(g.stamp_json("P").contains("\"last_panic\":null"));
        g.note_panic("index out of bounds: the len is 24 but the index is 24".into());
        let s = g.stamp_json("P");
        assert!(s.contains("index out of bounds"), "{s}");
        assert!(s.contains("\"panics\":1"), "{s}");
    }

    #[test]
    fn a_panic_message_with_quotes_does_not_break_the_stamp() {
        let mut g = HarvestGuard::new();
        g.attempt(0);
        g.note_panic("called `Option::unwrap()` on a \"None\" value\nat src/main.rs".into());
        let s = g.stamp_json("P");
        assert!(s.contains("\\\""), "quotes are escaped: {s}");
        assert!(s.contains("\\n"), "newlines are escaped: {s}");
        assert!(!s.contains("\"None\" value"), "the raw quote never lands unescaped: {s}");
    }

    #[test]
    fn the_pane_id_is_escaped_too_rather_than_trusted() {
        let g = HarvestGuard::new();
        let s = g.stamp_json("pa\"ne");
        assert!(s.contains("\"pane\":\"pa\\\"ne\""), "{s}");
    }
}
