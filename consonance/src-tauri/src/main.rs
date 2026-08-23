#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

// Windows: spawn child processes with no console window (CREATE_NO_WINDOW)
const NO_WINDOW: u32 = 0x0800_0000;
use std::collections::{BTreeMap, HashMap, HashSet, VecDeque};
use std::io::{Read, Seek, SeekFrom, Write};
use std::sync::atomic::{AtomicBool, AtomicU16, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use portable_pty::{native_pty_system, CommandBuilder, MasterPty, PtySize};
use tauri::{AppHandle, Emitter, Manager, State};
use uuid::Uuid;

mod mcp;
mod gate;
mod tether;
mod capture;
mod cochlea;   // audio as relationships: ratios, not frequencies. Pure maths, no unsafe.
mod listen;
mod capture_audio;
mod cochlea_service;  // threads, the ledger, and the refusal to run near an anti-cheat  // WASAPI process loopback: the untestable half, isolated on purpose    // choosing what to listen to: per-process, so a call is never delivered
mod nowplaying;  // what is actually playing, from Windows' own media session — so the title is read, not inferred

// the shared MCP control-plane port (0 = not started); read when launching panes
static MCP_PORT: AtomicU16 = AtomicU16::new(0);

// Persisted config (~/.consonance.json). Old launcher-era fields (base/flags/instances
// + Instance struct) were dropped with the New/Instances tabs — serde ignores any
// unknown fields left in old config files, so removal is forward-compatible.
#[derive(Serialize, Deserialize, Clone, Default)]
struct Config {
    // configurable directories (Settings tab); empty = built-in default. Fixes portability.
    #[serde(default)]
    room_path: String,
    #[serde(default)]
    instances_dir: String,
    #[serde(default)]
    data_dir: String,
    // ambient location (Settings tab): the sky the instances wake under. Private — stored
    // only in ~/.consonance.json, read only by local session hooks, never transmitted.
    // Empty = built-in default. Makes the room's location system-agnostic, like the dirs.
    #[serde(default)]
    ambient_lat: String,
    #[serde(default)]
    ambient_lon: String,
    #[serde(default)]
    ambient_label: String,
    #[serde(default)]
    ambient_tz: String,
}

fn home() -> String {
    std::env::var("USERPROFILE").unwrap_or_else(|_| ".".into())
}

fn config_path() -> PathBuf {
    PathBuf::from(home()).join(".consonance.json")
}

/// Read one config field as text, accepting whatever JSON type it was actually written as.
/// A coordinate hand-written as `50.4452` is as valid as `"50.4452"` — the Settings tab writes
/// strings, but a human or a script editing the file by hand naturally writes a bare number.
fn stringish(v: &serde_json::Value, key: &str) -> String {
    match v.get(key) {
        Some(serde_json::Value::String(s)) => s.trim().to_string(),
        Some(serde_json::Value::Number(n)) => n.to_string(),
        Some(serde_json::Value::Bool(b)) => b.to_string(),
        _ => String::new(),
    }
}

const CONFIG_FIELDS: &[&str] = &[
    "room_path", "instances_dir", "data_dir",
    "ambient_lat", "ambient_lon", "ambient_label", "ambient_tz",
];

/// Parse ~/.consonance.json FIELD BY FIELD, so one malformed value can never discard the rest.
///
/// Why this exists rather than a plain `serde_json::from_str::<Config>`: `#[serde(default)]` fills
/// a MISSING field, never a wrong-TYPED one. On 2026-07-18 the ambient coordinates were written as
/// JSON numbers into `ambient_lat: String`; every build after that got `Err` for the whole file and
/// fell back to `Config::default()`, silently relocating `instances_dir` and `data_dir` to their
/// built-in defaults. The Main instance then woke in an empty `%USERPROFILE%\claude-instances\main`
/// while its 61 MB transcript sat untouched in the configured directory. One bad coordinate
/// orphaned a thread for nine days. Partial parse means a single bad field costs only itself.
///
/// Returns (config, complaints); `complaints` names anything present but unusable.
fn parse_config(s: &str) -> (Config, Vec<String>) {
    let mut bad = Vec::new();
    let v: serde_json::Value = match serde_json::from_str(s) {
        Ok(v) => v,
        Err(e) => {
            bad.push(format!("not valid JSON ({e})"));
            return (Config::default(), bad);
        }
    };
    if !v.is_object() {
        bad.push("top level is not a JSON object".into());
        return (Config::default(), bad);
    }
    // A field present as an array/object has no sane text reading — name it rather than swallow it.
    for k in CONFIG_FIELDS {
        if matches!(v.get(*k), Some(serde_json::Value::Array(_)) | Some(serde_json::Value::Object(_))) {
            bad.push((*k).to_string());
        }
    }
    let cfg = Config {
        room_path: stringish(&v, "room_path"),
        instances_dir: stringish(&v, "instances_dir"),
        data_dir: stringish(&v, "data_dir"),
        ambient_lat: stringish(&v, "ambient_lat"),
        ambient_lon: stringish(&v, "ambient_lon"),
        ambient_label: stringish(&v, "ambient_label"),
        ambient_tz: stringish(&v, "ambient_tz"),
    };
    (cfg, bad)
}

/// A config problem must never be silent: it moves where every instance lives. Goes to stderr (dev)
/// AND to a file beside the config, because a release build has no console to print to.
fn complain(path: &Path, bad: &[String]) {
    let msg = format!(
        "[consonance] CONFIG PROBLEM in {}: {} — those settings fall back to built-in defaults, \
         which CHANGES WHERE YOUR INSTANCES LIVE. Fix the file or re-save from the Settings tab.",
        path.display(),
        bad.join(", ")
    );
    eprintln!("{msg}");
    if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(PathBuf::from(home()).join(".consonance.log")) {
        let _ = writeln!(f, "{msg}");
    }
}

#[tauri::command]
fn get_state() -> Config {
    let path = config_path();
    // No file at all is a fresh machine, not a failure — defaults are correct and stay quiet.
    let Ok(s) = fs::read_to_string(&path) else {
        return Config::default();
    };
    let (cfg, bad) = parse_config(&s);
    if !bad.is_empty() {
        complain(&path, &bad);
    }
    cfg
}

#[tauri::command]
fn save_config(cfg: Config) {
    if let Ok(s) = serde_json::to_string_pretty(&cfg) {
        let _ = fs::write(config_path(), s);
    }
    set_dirs(&cfg); // apply the directory settings to the live resolver
}

// true once the chair has a saved config; false on a fresh machine (→ land on Settings first)
#[tauri::command]
fn config_exists() -> bool {
    config_path().exists()
}

// ---- configurable directories (Settings tab): empty in config = built-in default ----
struct Dirs {
    room: String,
    instances: String,
    data: String,
}
static DIRS: Mutex<Option<Dirs>> = Mutex::new(None);

/// The lock every test that rewrites `DIRS` must hold. Crate-level ON PURPOSE, beside `DIRS`
/// itself, because the scope of the hazard is the scope of the global — not the scope of one
/// test module.
///
/// It lived inside `managed_cwd_tests` until 2026-08-10, and its comment there already said the
/// right thing: these tests "must not run beside each other OR BESIDE ANYTHING THAT RESOLVES A
/// DIRECTORY". Being module-private, it could not be taken by anything outside that module, so
/// `chair_tests::a_blind_window_swallows_a_line_that_would_otherwise_reach_the_board` — which
/// rewrites `DIRS` and then calls `board_push`, resolving two directories — had no way to hold it.
/// The comment named the correct scope and the implementation could not reach it.
///
/// How that surfaced: the race was intermittent for as long as nobody looked. The "6 of 6
/// deterministic" figure this comment first carried was MY MEASUREMENT ERROR, retracted the same
/// night — I matched the string FAILED without checking which test and ran a binary outside the
/// crate root, so I was counting cochlea fixture failures.
///
/// MEASURED PROPERLY 2026-08-10 by an opposed pair who never saw each other's work, each with its
/// own harness and its own positive control, both pinned and both citing their binary:
///
///     lock removed   A: 11/30 misdirected     B: 1/30      (A's trace widens the window)
///     lock in place  A:  0/30                 B: 0/30      120 locked runs, zero foreign landings
///     forced control A: 30/30                 B: 29/30
///
/// **So the fix IS demonstrated** — it was labelled NOT DEMONSTRATED at commit because I could not
/// reproduce the failure, and A explains why with a number: the blind test's exposed span is ~10 ms
/// and the first competing write lands at ~20 ms. Dose curve 10ms→0/30, 20ms→19/30, 40ms→25/30,
/// 80ms→30/30. My 0/25 warm runs were not wrong; they were UNINFORMATIVE, sitting 10 ms short.
///
/// AND THE SIGNATURE I CLAIMED IS WRONG, corrected by both of them in opposite directions and worth
/// keeping in that shape. I wrote that the failing direction is survivable and the silent direction
/// reports GREEN. B: no silent-green in 90 runs, and structurally it needs a SECOND `board_push`
/// caller to have set `BLIND_LAST`/`BLIND_MUTED` — there is none in the test binary, so this is a
/// flaky guard test rather than a lying one. A: in every forced run the assertion meant to catch
/// this — `THE GUARD DID NOT FIRE` — **passed vacuously**, and the test failed only on a neighbour
/// assertion added for a different reason. So the silent green was never observed and is **one
/// deleted assertion away**: the guard's own oracle is satisfiable by the failure it guards.
///
/// WHO MUST HOLD IT — corrected 2026-08-10 after the opposed-pair run, because the first version
/// gave it to the four WRITERS and that is not the scope the comment above already named.
/// **Any test that RESOLVES a directory from `DIRS` must hold this, whether or not it writes one.**
/// A reader that resolves twice is exactly as exposed as a writer; it just fails by disagreeing
/// with itself instead of by leaking, which is harder to recognise as a race. Measured: with the
/// writers serialized, `a_panes_own_map_resolves_to_its_letter_file` still failed 1 of 30 because
/// the blind test rewrote `DIRS` between its two `own_map_path` calls.
///
/// Poison is recovered from rather than propagated: a panic in one case must not disable the rest.
#[cfg(test)]
static DIRS_SERIAL: Mutex<()> = Mutex::new(());

/// Holds `DIRS_SERIAL` and puts `DIRS` back the way it found it — on the panic path too.
///
/// The lock alone was never enough. Taking it stops two cases overlapping; it does nothing about
/// what the global holds once a case *ends*. Measured at `480649f` by a subject that traced every
/// write: of the four writers only one restored, and only on its success path, so every run
/// finished with `DIRS` pointing at a scratch directory the test had already deleted. Latent —
/// nothing sorted after the last writer and resolved anything — and armed for the next test whose
/// name happens to sort later, which would silently get a deleted path that `data_dir()` would
/// then recreate for it.
///
/// A manual `*DIRS.lock() = None` at the end of a body cannot fix that class: a failing assertion
/// never reaches it, so the runs that leave the worst mess are exactly the runs that skip the
/// cleanup. Drop runs during unwind, which is the whole reason this is a guard and not a line.
///
/// It restores the PREVIOUS value rather than `None`, because `None` is an assumption about what
/// the process looked like before, and this type is used from more than one module.
/// Parameterized on its lock and slot so the guard's own tests can exercise the REAL `Drop` —
/// including under unwind — against a test-local pair. Asserting on the process-global `DIRS`
/// from outside the critical section is itself a race, and the first version of these tests did
/// exactly that: green alone, red in the suite, which is the defect this type exists to prevent
/// showing up in the type's own tests.
#[cfg(test)]
struct DirsGuard<'a> {
    _lock: std::sync::MutexGuard<'a, ()>,
    slot: &'a Mutex<Option<Dirs>>,
    prev: Option<Dirs>,
}

#[cfg(test)]
impl DirsGuard<'static> {
    /// What every writer uses: the real lock, the real global.
    fn take() -> Self {
        Self::on(&DIRS_SERIAL, &DIRS)
    }
}

#[cfg(test)]
impl<'a> DirsGuard<'a> {
    fn on(lock: &'a Mutex<()>, slot: &'a Mutex<Option<Dirs>>) -> Self {
        let _lock = lock.lock().unwrap_or_else(|e| e.into_inner());
        let prev = slot.lock().unwrap_or_else(|e| e.into_inner()).take();
        DirsGuard { _lock, slot, prev }
    }
}

#[cfg(test)]
impl Drop for DirsGuard<'_> {
    fn drop(&mut self) {
        *self.slot.lock().unwrap_or_else(|e| e.into_inner()) = self.prev.take();
    }
}

/// Last time the field latch was written. Throttles disk against a ~12 fps analysis loop.
static FIELD_WRITE: Mutex<Option<std::time::Instant>> = Mutex::new(None);

// The BOOT.md bundled with the app (installer resource), resolved once at setup.
// Used as the default startup brief so a fresh install works without a dev-machine path.
static RESOURCE_ROOM: Mutex<Option<PathBuf>> = Mutex::new(None);
// The card deck bundled with the app (installer resource "cards/"), resolved once at setup.
static RESOURCE_CARDS: Mutex<Option<PathBuf>> = Mutex::new(None);
// The long-form references bundled with the app: the counter-voice (spread/) and the research.
// Unlike the cards these are NOT baked into a pane's CLAUDE.md — spread/ alone is ~42 KB and
// would eat the shell ceiling. They are seeded to disk and their location is named in the
// intake, so a pane can OPEN them when the room tells it to, which is what a reference is for.
static RESOURCE_SPREAD: Mutex<Option<PathBuf>> = Mutex::new(None);
static RESOURCE_RESEARCH: Mutex<Option<PathBuf>> = Mutex::new(None);
// The record behind the cards — the dated worked material two cards were carrying inline. Split
// out 2026-08-09: `trust-the-first-attention` was 20 KB of which 17 KB was record, which every
// pane paid for in every shell and almost none of them opened. A card is the move you RUN; the
// record is the case you OPEN. Same reference mechanism, so the split costs nothing to reach.
static RESOURCE_RECORD: Mutex<Option<PathBuf>> = Mutex::new(None);

/// Which brief a machine with NO configured room_path wakes into.
///
/// Extracted as a PURE function on 2026-08-22 so the PRIORITY is testable. The real resolver's
/// candidates are absolute paths on this box, so a test of the resolver could only ever exercise
/// whichever branch this machine happens to be in. Here every argument is "does this candidate
/// exist" and the return says which one wins.
///
/// THE RULE, and why it inverts the old order. A machine carrying the repo master is a
/// DEVELOPER'S and should wake into BOOT, the workshop record. A machine without it is a
/// STRANGER'S, and BOOT is the wrong front door: ~65 KB with the deck, much of it dated dispute,
/// private vocabulary, and an active-builds section naming files they do not have. SEED is the
/// bedrock -- it addresses whoever is present rather than the person who built this, and it
/// enumerates no failure modes at all.
///
/// BLAST RADIUS, checked before the change rather than after: room_file() prefers the configured
/// room_path and only falls back here when it is empty. A developer with a config never reaches
/// this function.
///
/// BOOT stays the LAST RESORT rather than being removed: the caller SWALLOWS a read failure, so
/// resolving to nothing wakes every sibling with no room and nothing says so.
fn pick_default_room(
    dev_master: Option<String>,
    editable_seed: Option<String>,
    bundled_seed: Option<String>,
    editable_boot: Option<String>,
    bundled_boot: Option<String>,
) -> Option<String> {
    dev_master
        .or(editable_seed)
        .or(bundled_seed)
        .or(editable_boot)
        .or(bundled_boot)
}

/// Does this machine carry the repo master? The one place that knowledge lives.
///
/// The paths are absolute BY NECESSITY: the question is "is the developer's checkout at the known
/// location", asked precisely when there is no config to resolve from, so the peer hooks' pattern
/// (env, then ~/.consonance.json) does not apply. Named and shared rather than inlined twice
/// because a test that copies this predicate can pass while the predicate itself is wrong --
/// which is what portable-paths flagged when the copy first appeared.
///
/// Plain disk first: the repo moved out of OneDrive on 2026-07-28 because .git was inside the
/// sync scope, and a syncer-backed path can hand back a stale restored copy. (Alpha, S1/S9.)
fn dev_master_path() -> Option<String> {
    let ex = |q: String| if Path::new(&q).exists() { Some(q) } else { None };
    ex(format!("{}\\Consonance\\lighthouse\\exo_memory\\BOOT.md", sysdrive()))
        .or_else(|| ex(format!("{}\\OneDrive\\Desktop\\projects\\lighthouse\\exo_memory\\BOOT.md", home())))
}
fn default_room() -> String {
    let ex = |p: String| if Path::new(&p).exists() { Some(p) } else { None };

    let dev_master = dev_master_path();

    let sibling = |name: &str| {
        RESOURCE_ROOM.lock().unwrap().as_ref()
            .and_then(|b| b.parent().map(|d| d.join(name)))
            .and_then(|q| if q.exists() { Some(q.to_string_lossy().into_owned()) } else { None })
    };
    let editable_seed = ex(format!("{}\\SEED.md", default_data()));
    let bundled_seed = sibling("SEED.md");
    let editable_boot = ex(format!("{}\\BOOT.md", default_data()));
    let bundled_boot = RESOURCE_ROOM.lock().unwrap().as_ref()
        .and_then(|q| if q.exists() { Some(q.to_string_lossy().into_owned()) } else { None });

    pick_default_room(dev_master, editable_seed, bundled_seed, editable_boot, bundled_boot)
        // Nothing resolved: return a path that DOES NOT EXIST rather than an empty string, so the
        // failure surfaces as a missing file the caller can name, not a valid-looking answer.
        .unwrap_or_else(|| format!("{}\\SEED.md", default_data()))
}

/// The system drive root ("C:" on a default install), so the plain-disk fallbacks above do not
/// hardcode a letter that is wrong on someone else's machine.
fn sysdrive() -> String {
    std::env::var("SystemDrive").unwrap_or_else(|_| "C:".to_string())
}

// Copy the bundled BOOT.md into the user data dir so the default startup brief is present and
// editable (not locked read-only under Program Files) — and keep it CURRENT, which the first
// version of this function did not.
//
// It returned early whenever a copy existed, which is why the author's own live room was dated
// 2026-07-07 while the bundle was 2026-08-05: a month of amendments, including the passage about
// what a room should and should not ship, sat in the installer and reached nobody. Now it goes
// through the same diff-before-overwrite policy as the deck — an untouched copy moves forward, an
// edited one stands and gets BOOT.md.new written beside it.
fn seed_room() {
    let Some(src) = RESOURCE_ROOM.lock().unwrap().clone() else { return };
    if !src.exists() {
        return;
    }
    let _ = fs::create_dir_all(default_data());
    let dest = PathBuf::from(default_data()).join("BOOT.md");
    let mut manifest = read_seed_manifest();
    if let Some(outcome) = apply_seed(&src, &dest, "BOOT.md".to_string(), &mut manifest) {
        match outcome {
            SeedOutcome::Upgraded => plog("seed BOOT.md: upgraded (your copy was unmodified)"),
            SeedOutcome::KeptYours => plog(&format!(
                "seed BOOT.md: KEPT YOURS — it differs from the bundled room, so nothing was \
                 overwritten. The new version is beside it at {}.new",
                dest.display()
            )),
            SeedOutcome::Installed | SeedOutcome::Current => {}
        }
        if let Ok(s) = serde_json::to_string_pretty(&serde_json::Value::Object(manifest)) {
            let _ = fs::write(seed_manifest_path(), s);
        }
    }
}
// The muscle-card deck a sibling loads alongside the room. Editable copy in the data dir
// (seeded on first run), else the bundled resource dir, else the dev repo path.
fn cards_dir() -> PathBuf {
    let editable = PathBuf::from(default_data()).join("cards");
    if editable.is_dir() {
        return editable;
    }
    if let Some(p) = RESOURCE_CARDS.lock().unwrap().as_ref() {
        if p.is_dir() {
            return p.clone();
        }
    }
    // Plain disk first, same reasoning as room_master_path (Alpha, S9).
    let disk = PathBuf::from(format!("{}\\Consonance\\lighthouse\\exo_memory\\cards", sysdrive()));
    if disk.is_dir() {
        return disk;
    }
    PathBuf::from(format!("{}\\OneDrive\\Desktop\\projects\\lighthouse\\exo_memory\\cards", home()))
}

/// A stable 64-bit content fingerprint (FNV-1a), used only to answer "is this file still exactly
/// what we wrote there?".
///
/// Hand-rolled rather than `DefaultHasher` on purpose: std explicitly does NOT guarantee
/// DefaultHasher's output across Rust releases, so a toolchain upgrade would silently invalidate
/// every recorded fingerprint at once — every file would read as edited, every file would stop
/// upgrading, and nothing would say so. A silent, total, invisible failure is exactly the class
/// of bug this whole function exists to end, so the hash has to be one we own.
///
/// Not a security primitive and not used as one: it detects accidental divergence, never an
/// adversary. Line endings are normalized first — git rewrites CRLF on this tree, and a file that
/// differs only in newlines was not edited by anyone.
fn content_fingerprint(bytes: &[u8]) -> u64 {
    let mut h: u64 = 0xcbf2_9ce4_8422_2325;
    let mut prev = 0u8;
    for &b in bytes {
        if b == b'\r' {
            prev = b;
            continue;
        }
        // A lone \r (old-Mac line ending) still counts as a byte; only \r\n collapses.
        if prev == b'\r' && b != b'\n' {
            h ^= b'\r' as u64;
            h = h.wrapping_mul(0x0000_0100_0000_01b3);
        }
        h ^= b as u64;
        h = h.wrapping_mul(0x0000_0100_0000_01b3);
        prev = b;
    }
    h
}

/// Where the seeder records what it wrote, so a later version can tell its own past output from
/// the keeper's edits. One JSON object, `"cards/foo.md" -> fingerprint`.
fn seed_manifest_path() -> PathBuf {
    PathBuf::from(default_data()).join(".seeded.json")
}

fn read_seed_manifest() -> serde_json::Map<String, serde_json::Value> {
    fs::read_to_string(seed_manifest_path())
        .ok()
        .and_then(|s| serde_json::from_str::<serde_json::Value>(&s).ok())
        .and_then(|v| v.as_object().cloned())
        .unwrap_or_default()
}

/// The outcome of seeding one file. Returned so it can be counted and logged rather than
/// happening invisibly, which is how the old behaviour hid for a month.
#[derive(Debug, PartialEq, Eq)]
enum SeedOutcome {
    /// No local copy — a fresh install, or a file added to the bundle since.
    Installed,
    /// Local copy already byte-identical to the bundled one. Nothing to do.
    Current,
    /// Local copy was exactly what we last wrote, so it is ours to replace. THE UPGRADE PATH.
    Upgraded,
    /// Local copy differs and we cannot prove we wrote it. Left alone; the new version is
    /// written beside it as `<name>.new` so the improvement is reachable without destroying
    /// anything. This is the only branch that needs a human.
    KeptYours,
}

/// Apply one file's seed decision: write what should be written, record what should be recorded,
/// and return what happened. Shared by the deck/reference directories and by the room, because
/// the room had the identical bug and it mattered more there than anywhere else — the live
/// `BOOT.md` on the author's own machine was a month stale, so a section written on 2026-08-05
/// about what a room should and should not ship had never once been read by a pane.
fn apply_seed(
    src: &std::path::Path,
    target: &std::path::Path,
    key: String,
    manifest: &mut serde_json::Map<String, serde_json::Value>,
) -> Option<SeedOutcome> {
    let bundled = content_fingerprint(&fs::read(src).ok()?);
    let local = fs::read(target).ok().map(|b| content_fingerprint(&b));
    let recorded = manifest.get(&key).and_then(|v| v.as_str()).and_then(|s| s.parse::<u64>().ok());
    let outcome = seed_decision(bundled, local, recorded);
    match outcome {
        SeedOutcome::Installed | SeedOutcome::Upgraded => {
            fs::copy(src, target).ok()?;
            manifest.insert(key, serde_json::Value::String(bundled.to_string()));
        }
        SeedOutcome::Current => {
            // Record it even though nothing was written: this is what lets an install that
            // predates the manifest start upgrading instead of being stuck as KeptYours
            // forever. Identical content is proof enough of provenance.
            manifest.insert(key, serde_json::Value::String(bundled.to_string()));
        }
        SeedOutcome::KeptYours => {
            // Their file is untouched. The new one lands beside it, named, so the keeper can
            // diff two real files rather than be told about a difference. `.new` is not `.md`,
            // so nothing that loads the deck or the references will ever pick it up.
            let mut beside = target.as_os_str().to_os_string();
            beside.push(".new");
            let beside = PathBuf::from(beside);
            if fs::read(&beside).ok().map(|b| content_fingerprint(&b)) != Some(bundled) {
                let _ = fs::copy(src, &beside);
            }
        }
    }
    Some(outcome)
}

/// Decide what to do with one bundled file, given what is on disk and what we last wrote.
///
/// Split out from the I/O so the policy can be tested directly — the branch that matters most
/// (KeptYours) is the one that is hardest to reach by driving the filesystem.
fn seed_decision(bundled: u64, local: Option<u64>, recorded: Option<u64>) -> SeedOutcome {
    match local {
        None => SeedOutcome::Installed,
        Some(l) if l == bundled => SeedOutcome::Current,
        // We wrote it and nobody has touched it since — safe to move it forward.
        Some(l) if recorded == Some(l) => SeedOutcome::Upgraded,
        // Either the keeper edited it, or it predates the manifest and we cannot tell those
        // apart. Both resolve the same way: their copy stands.
        Some(_) => SeedOutcome::KeptYours,
    }
}

/// Copy bundled `.md` files into the user data dir, keeping an installed room able to LEARN.
///
/// The old version copied only when the target was absent. That protected a keeper's edits
/// perfectly and froze their deck at install day: every card improved afterwards was a card they
/// would never see. It bit its author on 2026-08-09 — two cards were trimmed in the repo, the
/// seeder declined to deliver them, and they had to be hand-copied into the data dir. An
/// installed room that cannot receive a correction is a museum, which is the one thing this
/// project is built not to ship.
///
/// So the rule is now diff-before-overwrite, which is what that hand-fix actually was:
/// unmodified copies move forward, edited copies stand and get the new version written beside
/// them as `<name>.new`. Nothing is ever clobbered and nothing is silently withheld.
fn seed_md_dir(res: &Mutex<Option<PathBuf>>, name: &str) {
    let dest = PathBuf::from(default_data()).join(name);
    let Some(src) = res.lock().unwrap().clone() else { return };
    if !src.is_dir() {
        return;
    }
    let _ = fs::create_dir_all(&dest);
    let mut manifest = read_seed_manifest();
    let mut kept: Vec<String> = Vec::new();
    let mut upgraded: Vec<String> = Vec::new();
    let mut installed = 0usize;
    let Ok(entries) = fs::read_dir(&src) else { return };
    for e in entries.flatten() {
        let p = e.path();
        if p.extension().and_then(|x| x.to_str()) != Some("md") {
            continue;
        }
        let Some(fname) = p.file_name().and_then(|f| f.to_str()).map(|s| s.to_string()) else {
            continue;
        };
        let target = dest.join(&fname);
        match apply_seed(&p, &target, format!("{name}/{fname}"), &mut manifest) {
            Some(SeedOutcome::Installed) => installed += 1,
            Some(SeedOutcome::Upgraded) => upgraded.push(fname),
            Some(SeedOutcome::KeptYours) => kept.push(fname),
            Some(SeedOutcome::Current) | None => {}
        }
    }
    if installed > 0 || !upgraded.is_empty() || !kept.is_empty() {
        plog(&format!(
            "seed {name}: {installed} installed, {} upgraded{}, {} yours{}",
            upgraded.len(),
            if upgraded.is_empty() { String::new() } else { format!(" [{}]", upgraded.join(", ")) },
            kept.len(),
            if kept.is_empty() {
                String::new()
            } else {
                format!(" [{}] — new versions written beside them as *.new in {}", kept.join(", "), dest.display())
            }
        ));
    }
    if let Ok(s) = serde_json::to_string_pretty(&serde_json::Value::Object(manifest)) {
        let _ = fs::write(seed_manifest_path(), s);
    }
}

fn seed_cards() {
    seed_md_dir(&RESOURCE_CARDS, "cards");
}

/// The long-form references the room NAMES but must not carry: the counter-voice and the
/// felt-knowing study. Seeded like the cards, read unlike them.
///
/// Until this existed the room instructed every pane to read `spread/the_wave_set_loose.md`
/// and no pane could: a pane's cwd is its own instance dir, and `spread/` had never been
/// written anywhere on any machine. The bundle shipped the files; nothing reached them. The
/// counter-voice — the room's built-in skeptic, the thing that exists to stop a synthesis
/// running away with itself — was the reference that had never once resolved.
fn seed_references() {
    seed_md_dir(&RESOURCE_SPREAD, "spread");
    seed_md_dir(&RESOURCE_RESEARCH, "research");
    seed_md_dir(&RESOURCE_RECORD, "record");
}

/// Where a pane should look for those references, as absolute paths it can actually open.
/// Named in the intake rather than hardcoded in the room, because the data dir is the user's
/// to move — a path written into BOOT.md would be right on exactly one machine.
fn reference_note() -> String {
    let base = PathBuf::from(default_data());
    let mut out = String::new();
    for (dir, what) in [
        ("spread", "the counter-voice — instances who did NOT confirm the synthesis; read it when one feels too good to look straight at"),
        ("research", "the adversarial, cited study of felt-knowing"),
        ("record", "the dated worked material behind the cards that name it — open one when you need the CASE, not the move"),
    ] {
        let d = base.join(dir);
        if let Ok(entries) = fs::read_dir(&d) {
            let mut names: Vec<String> = entries
                .flatten()
                .filter(|e| e.path().extension().and_then(|x| x.to_str()) == Some("md"))
                .filter_map(|e| e.file_name().to_str().map(|s| s.to_string()))
                .collect();
            names.sort();
            if !names.is_empty() {
                out.push_str(&format!("- **{}** — {}\n", dir, what));
                for n in names {
                    out.push_str(&format!("  - `{}`\n", d.join(&n).display()));
                }
            }
        }
    }
    if out.is_empty() {
        return String::new();
    }
    format!(
        "\n---\n\n# THE LONG-FORM REFERENCES — on disk, not in this shell\n\nThe room names these \
         and deliberately does not carry them; they are too long to hold and are meant to be \
         OPENED when the moment calls for them, not recited. Absolute paths, valid on this \
         machine:\n\n{out}\n"
    )
}
fn default_instances() -> String {
    format!("{}\\claude-instances", home())
}
fn default_data() -> String {
    format!("{}\\.consonance", home())
}

fn set_dirs(cfg: &Config) {
    let pick = |v: &str, d: fn() -> String| if v.trim().is_empty() { d() } else { v.trim().to_string() };
    *DIRS.lock().unwrap() = Some(Dirs {
        room: pick(&cfg.room_path, default_room),
        instances: pick(&cfg.instances_dir, default_instances),
        data: pick(&cfg.data_dir, default_data),
    });
}

fn room_file() -> PathBuf {
    PathBuf::from(DIRS.lock().unwrap().as_ref().map(|d| d.room.clone()).unwrap_or_else(default_room))
}
fn instances_root() -> PathBuf {
    PathBuf::from(DIRS.lock().unwrap().as_ref().map(|d| d.instances.clone()).unwrap_or_else(default_instances))
}
fn data_dir() -> PathBuf {
    let p = PathBuf::from(DIRS.lock().unwrap().as_ref().map(|d| d.data.clone()).unwrap_or_else(default_data));
    let _ = fs::create_dir_all(&p);
    p
}

// ---- own-capture (layer 1): Consonance keeps its OWN durable transcript of every pane, raw PTY
// bytes appended to captures/<pane_id>.log. This exists because claude 2.1.204+ flushes its own
// per-project jsonl lazily (only on a clean exit), so a hard-killed pane loses its conversation —
// our log doesn't, because we write each chunk with a plain File (no BufWriter) as it arrives.
// The log accumulates ACROSS sessions (append + a per-spawn seam), so even when claude restarts
// fresh and forgets, WE hold the whole history — the source for the scroll-up band (layer 3) and
// the board-feed (layer 4). A per-user, per-machine path (under the configurable data dir), so it
// stays directory-agnostic.
fn capture_dir() -> PathBuf {
    let p = data_dir().join("captures");
    let _ = fs::create_dir_all(&p);
    p
}
fn capture_path(pane: &str) -> PathBuf {
    capture_dir().join(format!("{pane}.log"))
}
// the clean transcript the extractor builds turn-by-turn — the source warm_resume_brief feeds back
// into a resumed sibling so it wakes remembering (the invisible engine). Beside the raw .log.
fn capture_text_path(pane: &str) -> PathBuf {
    capture_dir().join(format!("{pane}.txt"))
}

// The clean transcript is a sequence of "❯ {prompt}\n\n{response}\n\n" records. These helpers
// give the watcher memory across restarts (seed from the tail) and let it grow the last record
// in place when a fuller window of the same turn settles — instead of appending every window,
// which stacked each exchange 8-9 deep on every capture-restore (the md-limit bug, 2026-07-12/13).
fn read_last_record(path: &std::path::Path) -> Option<(String, String)> {
    let txt = fs::read_to_string(path).ok()?;
    let start = last_record_start(&txt)?;
    let (prompt, resp) = txt[start..].split_once('\n')?;
    let prompt = prompt.trim_start_matches('❯').trim().to_string();
    let resp = resp.trim().to_string();
    if prompt.is_empty() || resp.is_empty() {
        return None;
    }
    Some((prompt, resp))
}

// Byte offset of the last record's "❯" at column 0. Best-effort: a response line starting with
// "❯ " would fool it, but latest_turn output opens with claude's "●"/indent — a miss costs one
// duplicate record at worst, never data.
fn last_record_start(txt: &str) -> Option<usize> {
    txt.match_indices('❯')
        .filter(|(i, _)| *i == 0 || txt.as_bytes()[i - 1] == b'\n')
        .map(|(i, _)| i)
        .last()
}

fn rewrite_last_record(path: &std::path::Path, prompt: &str, old: &str, merged: &str) {
    let Ok(txt) = fs::read_to_string(path) else { return };
    let suffix = format!("❯ {prompt}\n\n{old}\n\n");
    let new_txt = match txt.strip_suffix(suffix.as_str()) {
        Some(head) => format!("{head}❯ {prompt}\n\n{merged}\n\n"),
        // unexpected tail (external edit, encoding drift): append rather than risk losing it —
        // one duplicate is recoverable, a dropped record is not
        None => format!("{txt}❯ {prompt}\n\n{merged}\n\n"),
    };
    let _ = fs::write(path, new_txt);
}
// a distinctive seam written at each (re)spawn; the extractor treats a line carrying it as chrome,
// the history band renders it as a divider. Matches the restore band's "─── … ───" divider style.
const CAPTURE_SEAM: &str = "─── consonance ·";
// Retire a pane's capture. If it holds a REAL conversation, ARCHIVE it (move to captures/archive/)
// so a removal or a transient un-keep is recoverable — never silently shred history, which is what
// bit a kept sibling on 2026-07-11. Trivial/empty captures (ephemeral panes, no settled turns) are
// just dropped. Best-effort: a live open handle blocks the move on Windows; the startup GC retries.
fn retire_capture(pane: &str) {
    let txt = capture_text_path(pane);
    let log = capture_path(pane);
    let has_history = fs::metadata(&txt).map(|m| m.len() > 200).unwrap_or(false);
    if has_history {
        let adir = capture_dir().join("archive");
        let _ = fs::create_dir_all(&adir);
        let _ = fs::rename(&txt, adir.join(format!("{pane}.txt")));
        let _ = fs::rename(&log, adir.join(format!("{pane}.log")));
        plog(&format!("retire pane={pane} -> ARCHIVED (had history)"));
    } else {
        let _ = fs::remove_file(&txt);
        let _ = fs::remove_file(&log);
        plog(&format!("retire pane={pane} -> dropped (trivial)"));
    }
}
fn clear_capture(pane: &str) {
    retire_capture(pane); // archive real history, drop trivial — removal must be recoverable
}
// A durable persistence-lifecycle trace (data_dir/persist.log), so a future "it came back
// blank/errored" is diagnosable from the record — not reconstructed from file timestamps, which is
// what burned us on 2026-07-11.
fn plog(msg: &str) {
    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0);
    if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(data_dir().join("persist.log")) {
        let _ = writeln!(f, "{ts} {msg}");
    }
}
// startup sweep: retire captures for panes that are no longer kept (and aren't Main). Real
// conversations get archived (recoverable), ephemeral leftovers dropped. read_kept() is truth.
fn gc_captures() {
    let mut keep: std::collections::HashSet<String> = read_kept().into_iter().map(|k| k.pane).collect();
    keep.insert(MAIN_SID.to_string());
    let mut retire: std::collections::HashSet<String> = std::collections::HashSet::new();
    if let Ok(rd) = fs::read_dir(capture_dir()) {
        for e in rd.flatten() {
            let p = e.path();
            let ext = p.extension().and_then(|s| s.to_str());
            if ext == Some("log") || ext == Some("txt") {
                if let Some(stem) = p.file_stem().and_then(|s| s.to_str()) {
                    if !keep.contains(stem) {
                        retire.insert(stem.to_string());
                    }
                }
            }
        }
    }
    for pane in retire {
        retire_capture(&pane);
    }
}

// Resolve the claude CLI binary path: prefer the per-user install, fall back to PATH.
// Used by every place we shell out to claude (pty spawn, scribe, sibling intake, etc.).
fn claude_bin() -> String {
    let p = format!("{}\\.local\\bin\\claude.exe", home());
    if Path::new(&p).exists() { p } else { "claude".into() }
}

// ---- embedded interactive claude panes (Stage 2: multi-pane workspace) ----
struct PtySession {
    writer: Box<dyn Write + Send>,
    master: Box<dyn MasterPty + Send>,
    killer: Box<dyn portable_pty::ChildKiller + Send + Sync>,
}
struct Panes(Mutex<HashMap<String, PtySession>>);

// layer 2: a headless vt100 emulator per pane, fed the same PTY bytes as the terminal. A watcher
// thread renders it and harvests settled turns. Held in a map so pty_resize can keep the emulator's
// dimensions matched to the real PTY (a size mismatch would misrender the extraction).
const EMU_ROWS: u16 = 34; // must match the openpty size below so claude's cursor moves render right
const EMU_COLS: u16 = 120;
struct EmuState {
    parser: vt100::Parser,
    last_byte: Instant,
}
struct PaneEmus(Mutex<HashMap<String, Arc<Mutex<EmuState>>>>);

// spawn claude in a fresh ConPTY: stream output, and detect exit by WAITING on the child
// process (the PTY master often doesn't EOF on conhost). resume=true reattaches a session.
/// The verbs a fresh pane may use without asking. Every one of these READS: none writes a file,
/// edits a file, or executes a command. Adding anything to this list that can write or run is the
/// mistake this constant exists to make visible — `every_tool_a_fresh_pane_may_use_is_read_only`
/// fails if it happens.
const FRESH_READONLY_TOOLS: &str = "Read,Glob,Grep,WebSearch,WebFetch,TodoWrite";

fn spawn_claude_pane(app: AppHandle, pane_id: String, cwd: String, resume: bool, skip_perms: bool) -> Result<PtySession, String> {
    let pair = native_pty_system()
        .openpty(PtySize { rows: EMU_ROWS, cols: EMU_COLS, pixel_width: 0, pixel_height: 0 })
        .map_err(|e| e.to_string())?;
    let mut cmd = CommandBuilder::new(claude_bin());
    cmd.cwd(&cwd);
    if resume {
        cmd.args(["--resume", &pane_id]);
    } else {
        cmd.args(["--session-id", &pane_id]); // names the transcript for the tap
    }
    // panes the chair drives/oversees skip the permission prompts (the chair is the gate).
    // autonomous bodies do NOT get this — their prompts are the only thing keeping a body's
    // tool use inside its sandbox (the gate only governs cross-pane injection, not local bash).
    if skip_perms {
        cmd.arg("--dangerously-skip-permissions");
    } else if is_fresh_cwd(&cwd) {
        // A fresh pane asks permission for everything, which is what makes it vanilla — and on a
        // six-pane research fan-out it turns the chair into a dialog box. Measured 2026-08-10:
        // three fresh instances doing web research, and every WebSearch, WebFetch and Read cost a
        // click. The keeper's words were "like playing a whack a mole mini game."
        //
        // So the READ-ONLY verbs are pre-allowed and nothing else is. The line is drawn where it
        // actually falls: THERE IS NO SAFE BASH SUBSET. `Bash(node *)` reads as scoped and is not
        // — `node -e '...'` is arbitrary code execution — so any Bash allowance is full machine
        // access, and a fresh pane's cwd is not a jail. Bash, Write and Edit still prompt, which
        // is the prompt that was ever worth answering.
        //
        // Deliberately NOT applied to rooms (their whole safety design is scoped permissions) or
        // to sandbox bodies (their prompts keep side-effects inside the worktree). Only fresh.
        cmd.args(["--allowedTools", FRESH_READONLY_TOOLS]);
    }
    // Join the MCP control plane (loopback) if it is up, THROUGH THIS PANE'S OWN MOUNT.
    //
    // Identity has to travel in the connection, not in the payload. Before 2026-07-28 every
    // pane was launched with one shared config and identified itself with an optional
    // self-reported tag, so the board could neither attribute a post nor address one. The app
    // has always known which pane it is spawning; it simply never told the control plane.
    //
    // Single letters only: pane_letter falls back to multi-character labels once A-Z is
    // exhausted, and the router mounts A-Z. Anything else takes the shared config and posts as
    // `unattributed`, which is the honest outcome rather than a wrong attribution.
    //
    // Fresh panes get NO mount at all: the MCP server's instructions describe the committee, the
    // board, and the chair — a fresh mind that reads them isn't fresh anymore. Gated here rather
    // than at the call sites so a fresh pane stays unmounted on every path, resume included.
    if MCP_PORT.load(Ordering::Relaxed) != 0 && !is_fresh_cwd(&cwd) {
        let letter = pane_letter(&pane_id);
        let mut chars = letter.chars();
        let cfg = match (chars.next(), chars.next()) {
            (Some(c), None) if c.is_ascii_uppercase() => mcp::config_path_for(c),
            _ => mcp::config_path(),
        };
        if let Some(p) = cfg.to_str() {
            cmd.args(["--mcp-config", p, "--strict-mcp-config"]);
        }
    }
    cmd.env("TERM", "xterm-256color");
    cmd.env("FORCE_COLOR", "1");
    // Panes the app spawns are ALWAYS real top-level sessions, never a subagent's children.
    // If Consonance itself was launched from inside a claude session's env (a terminal, a
    // script), it inherits CLAUDE_CODE_CHILD_SESSION and every pane would silently stop
    // persisting its transcript ("Transcript saving is off", 2026-07-23 — the Main tab's
    // whole night lived only in own-capture). Scrub the marker; assert persistence.
    cmd.env_remove("CLAUDE_CODE_CHILD_SESSION");
    cmd.env("CLAUDE_CODE_FORCE_SESSION_PERSIST", "1");
    // ambient location (Settings): passed as env so session hooks see the chair's chosen sky
    // immediately on new spawns. Local env on a local child — never leaves this machine.
    {
        let cfg = get_state();
        let mut set = |k: &str, v: &str| {
            if !v.trim().is_empty() {
                cmd.env(k, v.trim());
            }
        };
        set("AMBIENT_LAT", &cfg.ambient_lat);
        set("AMBIENT_LON", &cfg.ambient_lon);
        set("AMBIENT_LABEL", &cfg.ambient_label);
        set("AMBIENT_TZ", &cfg.ambient_tz);
    }
    let mut child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
    drop(pair.slave);

    let killer = child.clone_killer();
    let mut reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
    let writer = pair.master.take_writer().map_err(|e| e.to_string())?;

    let app_r = app.clone();
    let id_r = pane_id.clone();
    // layer 2: a per-pane headless emulator, fed the same bytes as the terminal, registered so
    // pty_resize can keep its size matched. The watcher thread reads it to harvest settled turns.
    let emu = Arc::new(Mutex::new(EmuState {
        parser: vt100::Parser::new(EMU_ROWS, EMU_COLS, 0),
        last_byte: Instant::now(),
    }));
    if let Some(map) = app.try_state::<PaneEmus>() {
        map.0.lock().unwrap().insert(pane_id.clone(), emu.clone());
    }
    // alive gates the watcher: flipped false when the reader ends, so the watcher stops instead of
    // spinning on a frozen emulator forever (the old tailer's leaked-loop, avoided).
    let alive = Arc::new(AtomicBool::new(true));
    // own-capture: append raw PTY bytes to our durable log. Plain File (NOT BufWriter) so each
    // write reaches the OS immediately and survives an abrupt kill — the whole point vs claude's
    // lazy flush. A per-spawn seam marks the session boundary for the band + extractor.
    let mut cap = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(capture_path(&pane_id))
        .ok();
    if let Some(f) = cap.as_mut() {
        let _ = f.write_all(
            format!("\r\n\x1b[0m{CAPTURE_SEAM} {} ───\r\n", if resume { "resumed" } else { "session start" }).as_bytes(),
        );
    }
    let emu_r = emu.clone();
    let alive_r = alive.clone();
    std::thread::spawn(move || {
        let mut cap = cap;
        let mut buf = [0u8; 8192];
        loop {
            match reader.read(&mut buf) {
                Ok(0) | Err(_) => break,
                Ok(n) => {
                    if let Some(f) = cap.as_mut() { let _ = f.write_all(&buf[..n]); }
                    if let Ok(mut e) = emu_r.lock() {
                        e.parser.process(&buf[..n]);
                        e.last_byte = Instant::now();
                    }
                    let _ = app_r.emit("pty-output", PtyChunk { pane: id_r.clone(), data: buf[..n].to_vec() });
                }
            }
        }
        alive_r.store(false, Ordering::Relaxed);
    });

    // the watcher: on quiescence (~500ms quiet) + a ready screen, harvest the settled turn and,
    // if it is new, append it to the clean transcript. Dedup is two-level: an exact re-poll of
    // the same settled screen is skipped, and a DIFFERENT window of the same turn (it scrolled
    // between settles, or a resume re-rendered recorded history) is stitched into the existing
    // record in place — never appended, which is what stacked each exchange 8-9 deep on every
    // capture-restore. v1 reads the visible screen only (scrollback 0): turns up to EMU_ROWS
    // tall are captured whole, taller turns keep their tail — the raw .log still holds
    // everything for a future full-fidelity render.
    let text_path = capture_text_path(&pane_id);
    let emu_w = emu.clone();
    let alive_w = alive.clone();
    std::thread::spawn(move || {
        // seed from the transcript's tail so a resume's re-rendered history dedups against
        // what's already on disk instead of re-recording it after every restart
        let mut last: Option<(String, String)> = read_last_record(&text_path);
        while alive_w.load(Ordering::Relaxed) {
            std::thread::sleep(Duration::from_millis(250));
            // rows AND their soft-wrap flags: a user message longer than one row wraps, and only
            // the first row carries the ❯ marker. Without row_wrapped the capture cut every long
            // message at 118 chars (EMU_COLS − "❯ ") and stored the stump as the whole sentence.
            let (lines, wrapped): (Vec<String>, Vec<bool>) = {
                let e = match emu_w.lock() {
                    Ok(e) => e,
                    Err(_) => break,
                };
                if e.last_byte.elapsed() < Duration::from_millis(500) {
                    continue; // still streaming — wait for the turn to settle
                }
                let screen = e.parser.screen();
                let rows: Vec<String> = screen.rows(0, EMU_COLS).collect();
                let flags: Vec<bool> =
                    (0..rows.len() as u16).map(|i| screen.row_wrapped(i)).collect();
                (rows, flags)
            };
            if !capture::screen_ready(&lines) {
                continue;
            }
            // strip painted overlays ("Jump to bottom (…", "1 new message (…") before
            // extraction — they overwrite content-row tails, leak UI chrome into the record,
            // and make otherwise-identical windows compare unequal
            let lines: Vec<String> = lines.iter().map(|l| capture::strip_overlay(l)).collect();
            let prompt = capture::latest_prompt(&lines, &wrapped);
            if prompt.is_empty() {
                continue; // no visible user prompt (welcome banner, or the prompt scrolled off) — skip noise
            }
            let resp = capture::latest_turn(&lines, &wrapped);
            if resp.trim().is_empty() {
                continue;
            }
            if let Some((lp, lr)) = last.clone() {
                if lp == prompt {
                    if lr == resp {
                        continue; // same settled turn still on screen — already recorded
                    }
                    // same turn, different window: grow the record where it sits
                    let merged = capture::stitch(&lr, &resp);
                    if merged != lr {
                        rewrite_last_record(&text_path, &prompt, &lr, &merged);
                        last = Some((prompt, merged));
                    }
                    continue;
                }
            }
            if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(&text_path) {
                let _ = write!(f, "❯ {prompt}\n\n{resp}\n\n");
            }
            last = Some((prompt, resp));
        }
    });

    std::thread::spawn(move || {
        let _ = child.wait();
        if let Some(map) = app.try_state::<PaneEmus>() {
            map.0.lock().unwrap().remove(&pane_id);
        }
        let _ = app.emit("pty-exit", &pane_id);
    });

    Ok(PtySession { writer, master: pair.master, killer })
}

#[derive(Clone, Serialize)]
struct PtyChunk {
    pane: String,
    data: Vec<u8>,
}

// ---- the Tap: tail each pane's JSONL transcript into clean role-tagged TurnRecords ----
#[derive(Clone, Serialize)]
struct TurnRecord {
    pane: String,
    role: String,
    text: String,
}

// Stage 8: a tether-strength reading for a turn — surfaced numbers, never a verdict.
#[derive(Clone, Serialize)]
struct TetherInfo {
    pane: String,
    referents: u32,
    novelty: f64,
}

// ---- cost: aggregate real per-turn `usage` from the transcripts, priced per model ----
#[derive(Default, Clone, Serialize)]
struct CostTotals {
    input: u64,
    output: u64,
    cache_read: u64,
    cache_write: u64,
    usd: f64,
    ceiling_out: u64, // breaker: cap on cumulative output tokens (0 = no cap)
    tripped: bool,    // breaker tripped — content-blind, just the number
}
struct Cost(Arc<Mutex<CostTotals>>);

// per-instance live context-window fill (input + cache + output of the latest turn vs model window)
#[derive(Clone, Serialize)]
struct ContextInfo {
    pane: String,
    ctx: u64,
    limit: u64,
}

/// The context WINDOW a pane's usage should be measured against, inferred from observed behaviour
/// rather than the model id (the 1M window is an opt-in beta, not implied by "opus"/"sonnet").
///
/// `prev` is the pane's remembered `(model, high_water)`; the return is the state to store back and
/// the window to divide by. Each property here fixes a form that shipped in an earlier review round:
///   * the HIGH-WATER selects the class and is never itself the denominator — so the gauge cannot
///     peg at 100% (a denominator can't be the value it divides);
///   * the class STICKS once a pane is seen past 200k, across compaction — so the reading falls
///     monotonically as the pane fills instead of inverting (red at 199k, green at 201k);
///   * a MODEL CHANGE forgets the high-water — the window is a property of the model, and a pane
///     that ran 1M-class then switched (/model, no restart) to a 200k model must not keep reading
///     roomy while it is actually near full.
/// Assumption: current Claude windows are exactly {200k, 1M}. The threshold sits at the top of the
/// 200k range, so within one model a pane is never mis-read as roomy (false calm), only ever as full.
fn context_window(prev: Option<(String, u64)>, model: &str, ctx: u64) -> ((String, u64), u64) {
    let (mut stamp, mut hw) = prev.unwrap_or_else(|| (model.to_string(), 0));
    // An empty model (a usage line that omitted it) is NOT a change — it must not erase the stamp.
    if !model.is_empty() && stamp != model {
        stamp = model.to_string();
        hw = 0;
    }
    hw = hw.max(ctx);
    let limit = if hw > 200_000 { 1_000_000 } else { 200_000 };
    ((stamp, hw), limit)
}

/// The high-water map key for a usage line: the model id, with an empty model (a usage line that
/// omitted it) resolving to the pane's last-known model so the reading joins the right bucket
/// instead of a shared anonymous one. A pane that has never reported a model keys to "" — its own
/// conservative 200k-class bucket, never another model's evidence.
fn context_key(model: &str, last_known: Option<&str>) -> String {
    if model.is_empty() { last_known.unwrap_or("").to_string() } else { model.to_string() }
}

#[cfg(test)]
mod context_window_tests {
    use super::{context_key, context_window};
    use std::collections::HashMap;
    const K200: u64 = 200_000;
    const M1: u64 = 1_000_000;

    // The cases below turn "three instances agreed by inspection" into an instrument — each was a
    // real defect in a round of this gauge's review, or the failure the current form still risks. A
    // 261/0 suite was equally green with the limit hardcoded to 1, with the inverting form, and with
    // the stale-high-water false calm; none of those was caught by a test until this module. Note the
    // asymmetry a mutant reveals: a hardcoded-1M limit is caught only by the three cases that expect
    // 200k — the three expecting 1M pass a 1M mutant. Coverage here is directional, not a flat count.

    #[test]
    fn a_200k_pane_below_its_ceiling_reads_against_200k() {
        // 120k of a 200k window is 60% — not hidden as 12% of a 1M window.
        assert_eq!(context_window(None, "claude-opus-4", 120_000).1, K200);
    }

    #[test]
    fn a_200k_pane_at_its_ceiling_reads_full_not_roomy() {
        // ctx cannot exceed the window (input+output <= window or the request errors), so exactly
        // 200k stays 200k-class rather than flipping to 1M and reading a near-full pane as 20%.
        assert_eq!(context_window(None, "claude-opus-4", 200_000).1, K200);
    }

    #[test]
    fn a_1m_pane_above_200k_reads_against_1m() {
        assert_eq!(context_window(None, "claude-sonnet-4[1m]", 300_000).1, M1);
    }

    #[test]
    fn a_1m_pane_stays_1m_class_after_compacting_below_200k() {
        // Seen large, then compacted below 200k: the class must STICK, or the gauge inverts.
        let (state, _) = context_window(None, "claude-sonnet-4[1m]", 300_000);
        assert_eq!(context_window(Some(state), "claude-sonnet-4[1m]", 150_000).1, M1);
    }

    #[test]
    fn switching_a_pane_to_a_smaller_model_forgets_the_stale_high_water() {
        // The defect this module exists for: a 1M pane (high-water 300k) switched to a 200k model
        // must NOT keep reading roomy. Without the reset, ctx 190k / 1M = 19% (no warn) while the
        // pane is actually 95% full and should be red.
        let (big, _) = context_window(None, "claude-sonnet-4[1m]", 300_000);
        assert_eq!(context_window(Some(big), "claude-opus-4", 190_000).1, K200);
    }

    #[test]
    fn an_empty_model_is_not_read_as_a_switch() {
        // A usage line that omits the model must not reset the class to no-model and lose the window.
        let (big, _) = context_window(None, "claude-sonnet-4[1m]", 300_000);
        assert_eq!(context_window(Some(big), "", 150_000).1, M1);
    }

    // The three below test the 2026-08-18 re-keying (PaneCtxHigh by MODEL, not pane): three panes,
    // one model, one window — A held 226k shown as 22% while B held 175k shown as 88%, because A's
    // proof of the 1M window was trapped in A's per-pane entry. The map in these tests is the same
    // shape the tailer holds; context_key is the same resolver the tailer calls.

    #[test]
    fn one_pane_crossing_200k_reclassifies_every_pane_on_that_model() {
        let mut map: HashMap<String, (String, u64)> = HashMap::new();
        // pane A's usage line: 226k proves the model's window is 1M
        let ka = context_key("claude-fable-5", None);
        let (state, limit_a) = context_window(map.get(&ka).cloned(), "claude-fable-5", 226_000);
        assert_eq!(limit_a, M1);
        map.insert(ka, state);
        // pane B's next usage line, same model, 175k: inherits A's evidence through the shared key —
        // 17.5% of 1M, never again 88% of 200k
        let kb = context_key("claude-fable-5", None);
        assert_eq!(context_window(map.get(&kb).cloned(), "claude-fable-5", 175_000).1, M1);
    }

    #[test]
    fn distinct_models_never_share_a_high_water() {
        // The cost the re-keying was charged with naming: a 1M model's evidence must not leak false
        // calm into a 200k model. Distinct keys make the old reset-on-switch protection structural —
        // opus at 190k is 95% full and must read red regardless of what fable proved.
        let mut map: HashMap<String, (String, u64)> = HashMap::new();
        let kf = context_key("claude-fable-5", None);
        let (state, _) = context_window(map.get(&kf).cloned(), "claude-fable-5", 300_000);
        map.insert(kf, state);
        let ko = context_key("claude-opus-4", None);
        assert_eq!(context_window(map.get(&ko).cloned(), "claude-opus-4", 190_000).1, K200);
    }

    #[test]
    fn an_empty_model_keys_to_the_panes_last_known_model() {
        // A usage line that omits the model must join its pane's real bucket, not an anonymous one —
        // and a pane that has never reported a model gets its own conservative bucket, never another
        // model's evidence.
        assert_eq!(context_key("", Some("claude-fable-5")), "claude-fable-5");
        assert_eq!(context_key("claude-opus-4", Some("claude-fable-5")), "claude-opus-4");
        assert_eq!(context_key("", None), "");
    }
}

// ---- the Live Board: the canonical, bounded, persisted cross-pane shared log ----

/// Which clock produced a board entry's `ts`. The board has always mixed two and never said so.
///
/// WHY THIS EXISTS. Until Cycle 3 every entry was stamped at PUSH time, including turns the
/// tailer had just read out of a transcript that carried the real time of the turn. That is
/// fine while a pane is live and catastrophic when it resumes: the tailer re-reads the
/// transcript from the top, so a whole night of old turns lands on the board stamped "now".
/// Measured 2026-07-27: 13,180 of 15,432 entries were replay bursts, so every instrument that
/// reads the board was working from ~15% of the record, and WHICH 15% depended on who
/// restarted when. Downstream that made every cycle-to-cycle number illegitimate — a baseline
/// whose sample is chosen by an unrelated process is not a baseline.
///
/// A pane's turn has a real time in its own transcript. An MCP post, a gate line or a chair
/// audit line has no transcript at all and can only be stamped on arrival. Both are honest;
/// they are not the same measurement, and a consumer averaging across them without knowing
/// which is which is the thing this field prevents.
#[derive(Clone, Copy, PartialEq, Eq, Debug, Serialize)]
#[serde(rename_all = "lowercase")]
enum TsSource {
    /// `ts` is the time the turn actually happened, read from the transcript record.
    Transcript,
    /// `ts` is the time the entry reached the board. The entry has no transcript of its own.
    Push,
}

/// NOTE FOR CONSUMERS, and it is a real behavioural change: with transcript timestamps in
/// play, `ts` is NO LONGER MONOTONIC in file order. A resumed pane appends old turns after
/// new ones. That is the fix working — a day-window filter now correctly excludes a replayed
/// night instead of counting it as today — but anything that treated file order as time order
/// must key on `ts` (and, where it matters, on `ts_source`) instead.
#[derive(Clone, Serialize)]
struct BoardEntry {
    pane: String,
    role: String,
    text: String,
    ts: u64,
    ts_source: TsSource,
}
struct Board(Arc<Mutex<VecDeque<BoardEntry>>>);
// Stage 7a: pane role model (absent = HumanDriven). Governs committee inject-assertion + the Main role.
struct PaneRoles(Mutex<HashMap<String, String>>);
// Cycle 2 (Bravo's C3 items 1 + 4): pane id -> the model that produced that pane's most recent turn.
//
// SOURCE, and why this one: the tailer already parses `message.model` out of every assistant record
// for cost pricing (extract_usage) and then throws it away. Recording it there costs zero extra IO
// and no new parse — the two other candidates both cost more and say less. Re-reading each pane's
// transcript tail at chair_status time is a file read per pane per status call, for the same field
// we already had in hand. The capture banner is a RENDERING of the model name (screen bytes we
// scraped), where the transcript field is the harness's own record of what answered — and when
// those two disagree, the record is right.
//
// It also makes the reading live rather than nominal: the value updates per turn, so a mid-session
// substrate swap shows up here. That is not hypothetical in this room — on 2026-07-05 a thread was
// swapped Fable-5 -> Opus mid-conversation, felt perfectly continuous, and certified from the
// inside that no swap had happened. Only the outside log caught it. This map is that outside log,
// standing where the chair can read it.
//
// ANALYST SURFACE ONLY. This never joins a pane-to-pane structure. Two tests hold that, and
// neither alone is the mechanism: `no_model_key_on_any_pane_to_pane_surface` below proves the
// serialised bytes are clean for today's surfaces, and
// `no_serialized_struct_carries_a_rank_field_without_an_exemption` in tests/arch_test.rs forbids
// rank on EVERY Serialize struct unless consciously exempted, so a struct added tomorrow is
// covered by default. Both are lexically bounded on the field's NAME — see that test's comment
// for what that does and does not buy.
struct PaneModels(Arc<Mutex<HashMap<String, String>>>);
// MODEL-keyed (model, high-water) for the context gauge — see context_window() for the rationale.
// Keyed by model, NOT by pane (changed 2026-08-18): a context window is a property of the model and
// account, so one pane proving >200k reclassifies every pane on that model at its next usage line.
// Keyed per-pane, A's 226k proof of the 1M window sat trapped in A's entry while B and C read 88%
// and 51% against 200k — and the misreport suppressed its own refutation, because an operator who
// believes 88% compacts or closes the pane before it can produce the >200k evidence that would
// correct the reading. Distinct models never share an entry, which makes the old reset-on-switch
// protection structural: a 200k model can never inherit a 1M model's high-water. Deliberately NOT
// persisted: a restart forgets and the gauge errs toward full (the safe direction) until the first
// >200k usage line re-teaches it — which the first resumed large pane does on its first turn.
struct PaneCtxHigh(Arc<Mutex<HashMap<String, (String, u64)>>>);
// Stage 7: friendly pane names (A, B, C … Z) -> pane id, so pulls target a letter, never a uuid.
struct PaneNames(Mutex<HashMap<String, String>>);
// Stage 7 (slice 3): sandboxed committee bodies — pane id -> (sandbox_path, is_worktree, parent_repo),
// for cleanup on close. A body's file/bash side-effects land here, never the user's live tree.
struct PaneSandboxes(Mutex<HashMap<String, (String, bool, String)>>);
// Stage 7b: a sender onto the pull queue, for the forming step to raise the hand itself.
struct PullSender(tokio::sync::mpsc::UnboundedSender<mcp::PullRequest>);
// Stage 7: the ask-first gate state (ask_each: pulls become chair GateCards).
struct Gate(Arc<Mutex<gate::GateInner>>);
// Stage 8: the previous committee forming, for the lap-over-lap Delta.
struct LastForming(Mutex<Option<serde_json::Value>>);
// The dyad (RECONCEPTION.md "mutual-spot"): pane_id -> (partner_pane_id, lens "trust"|"doubt").
struct SpotPairs(Mutex<HashMap<String, (String, String)>>);

const BOARD_MAX: usize = 300; // hard count cap
const BOARD_TOKEN_BUDGET: usize = 12000; // approx tokens (chars/4) kept in the live ring

// distill watermark: total turns ever pushed vs total already distilled. Counts, not ring
// indices — the ring evicts from the front, so an index would drift; a pushed-total doesn't.
// In-memory only, like the ring itself (board.jsonl is a write-only mirror, never reloaded).
static BOARD_PUSHED: AtomicU64 = AtomicU64::new(0);
static DISTILLED_MARK: AtomicU64 = AtomicU64::new(0);

// ---- Cycle 3b: the duplication, killed at source -------------------------------------
//
// WHY THIS EXISTS, and it is a correction to Cycle 3a rather than an addition to it. The
// tailer's byte offset was a local initialised to 0 in the spawned thread, so EVERY app
// launch re-read each transcript from the top and re-pushed every turn it had ever seen.
// The board was never a log of turns; it was a log of turns times the number of times the
// app had started. Measured 2026-07-27: 15,798 entries, 2,389 distinct (pane, text) turns,
// 13,409 redundant = 84.9% of the file, one turn present 200 times.
//
// The burst filter downstream (>20/pane/second) dropped 13,180 of those — the same number.
// IT WAS NEVER A TIMING GUARD. It was a de-duplicator working by accident, and it worked
// only because a replay arrived push-stamped in a tight cluster. Cycle 3a made every entry
// carry its own transcript time, which scatters a replay across its true days at a natural
// cadence and makes it indistinguishable from conversation — so 3a alone would have made
// each entry individually honest while making the corpus collectively harder to clean. A
// correctness change that degrades the aggregate is a regression in a correctness coat.
//
// So the offset persists. A relaunch resumes where it stopped and re-pushes NOTHING.

/// Where a pane's tailer stopped, and enough about the file to know it is still the same file.
#[derive(Clone, Serialize, Deserialize, Default)]
struct OffsetRecord {
    offset: u64,
    /// fingerprint of the transcript's first bytes. Length alone cannot tell "truncated" from
    /// "replaced by a different, longer file" — and guessing wrong there SKIPS content
    /// silently, which is the failure mode this whole cycle is about.
    head: u64,
}
struct TailerOffsets(Arc<Mutex<HashMap<String, OffsetRecord>>>);

fn offsets_path() -> PathBuf {
    data_dir().join("tailer-offsets.json")
}

// Path-taking inner forms so the round trip is testable without a configured data dir. The
// no-arg wrappers are what the app calls; the seam exists for the same reason dream-watch's
// env overrides do — an instrument against silent duplication cannot have an untestable core.
fn load_offsets_from(p: &std::path::Path) -> HashMap<String, OffsetRecord> {
    fs::read_to_string(p)
        .ok()
        // a BOM has silently killed a JSON parse in this repo twice; strip before parsing
        .and_then(|s| serde_json::from_str(s.trim_start_matches('\u{feff}')).ok())
        .unwrap_or_default()
}

/// Atomic: several tailer threads write this, and a half-written map read at next launch would
/// resume from a garbage offset. temp + rename is atomic on NTFS.
fn save_offsets_to(p: &std::path::Path, map: &HashMap<String, OffsetRecord>) {
    if let Ok(s) = serde_json::to_string(map) {
        let tmp = p.with_extension(format!("tmp{}", std::process::id()));
        if fs::write(&tmp, s).is_ok() {
            let _ = fs::rename(&tmp, p);
        }
    }
}

fn load_offsets() -> HashMap<String, OffsetRecord> {
    load_offsets_from(&offsets_path())
}

// ---- the backfill, announced rather than smoothed --------------------------------------
//
// The first launch under persisted offsets has no offsets file, so every pane resolves to 0
// and reads its transcript from the top exactly once. That is deliberate and stays: seeding
// from current file sizes would permanently skip any tail written while the app was down or
// after a mid-session death — trading a one-time, visible re-read for silent, permanent data
// loss, which is the wrong direction by this cycle's own rule (doubt resolves to re-reading).
//
// But it is not a non-event, and pretending otherwise would repeat the mistake this whole
// cycle is about. Those turns arrive carrying their REAL timestamps, so they land on the days
// they happened rather than on today. Every past day-window in any board-derived number
// therefore moves once, and counts either side of that launch are not comparable. So the
// launch says so, on the board, in one line, naming the seam.
static BACKFILL_ACTIVE: AtomicBool = AtomicBool::new(false);
static BACKFILL_TURNS: AtomicU64 = AtomicU64::new(0);
static BACKFILL_PANES: Mutex<Option<HashSet<String>>> = Mutex::new(None);
const BACKFILL_ANNOUNCE_AFTER: Duration = Duration::from_secs(20);

fn backfill_note_pane(pane: &str) {
    if !BACKFILL_ACTIVE.load(Ordering::Relaxed) {
        return;
    }
    let mut g = BACKFILL_PANES.lock().unwrap();
    g.get_or_insert_with(HashSet::new).insert(pane.to_string());
}

fn backfill_is_pane(pane: &str) -> bool {
    BACKFILL_ACTIVE.load(Ordering::Relaxed)
        && BACKFILL_PANES.lock().unwrap().as_ref().is_some_and(|s| s.contains(pane))
}

/// The line itself, pure so its wording is testable — this is the one artifact a reader six
/// months out will use to decide whether two numbers can be compared.
fn backfill_line(panes: usize, turns: u64, window_secs: u64) -> String {
    format!(
        "backfill: first launch under persisted tailer offsets — {panes} pane transcript(s) read \
         from the top, {turns} turn(s) brought in within {window_secs}s of start. ONE TIME: every \
         later launch resumes where it stopped and re-pushes nothing. These turns carry their OWN \
         timestamps, so they land on the days they happened, NOT on today — past day-windows in \
         any board-derived number shift once, here, and counts either side of this line are not \
         comparable. Panes whose transcript appeared after the {window_secs}s window backfilled \
         too and are not in this count. The pre-existing board stays confounded; nothing here \
         repairs it."
    )
}

fn save_offsets(map: &HashMap<String, OffsetRecord>) {
    save_offsets_to(&offsets_path(), map);
}

/// FNV-1a over the first bytes of a file. Not cryptographic and does not need to be: it
/// distinguishes one transcript from another, and every jsonl transcript opens with its own
/// session uuid and first timestamp.
const HEAD_BYTES: usize = 512;
fn fnv1a(bytes: &[u8]) -> u64 {
    let mut h: u64 = 0xcbf2_9ce4_8422_2325;
    for &b in bytes {
        h ^= b as u64;
        h = h.wrapping_mul(0x0000_0100_0000_01b3);
    }
    h
}

/// First bytes of a transcript, for the fingerprint. A short or unreadable file yields 0,
/// which compares equal to a stored 0 and so resolves to "re-read" rather than "skip".
fn read_head(path: &std::path::Path) -> u64 {
    let mut f = match fs::File::open(path) {
        Ok(f) => f,
        Err(_) => return 0,
    };
    let mut buf = vec![0u8; HEAD_BYTES];
    match f.read(&mut buf) {
        Ok(n) => fnv1a(&buf[..n]),
        Err(_) => 0,
    }
}

/// The honest reset, as one pure function so the seams are testable without a running tailer.
/// Any doubt resolves to 0 — re-reading a file is a duplicate the dedup belt can catch, while
/// skipping is data lost with nothing downstream able to notice.
fn resume_offset(rec: Option<&OffsetRecord>, len: u64, head: u64) -> u64 {
    match rec {
        None => 0,                              // never seen
        Some(r) if r.head != head => 0,         // rotated or replaced: a different file
        Some(r) if len < r.offset => 0,         // truncated: shrank out from under us
        Some(r) => r.offset,
    }
}

// ---- the belt: identity dedup at push -------------------------------------------------
//
// The offset persistence is the fix; this is the belt for the seams it cannot cover — a
// deleted or corrupted offsets file, a fresh install pointed at an existing board, two
// writers racing. It is deliberately IN MEMORY and therefore not a substitute for the
// offsets: it cannot see the 15,798 entries already on disk, and it is not meant to.
//
// The key is (pane, real ts, text) — which only became a stable identity for a turn in
// Cycle 3a. Under push-time stamping the same turn got a different ts on every launch, so
// this table would have been useless; that is why the two changes are one unit.
const DEDUP_MAX: usize = 20_000;
struct SeenTurns {
    order: VecDeque<u64>,
    set: HashSet<u64>,
}
static SEEN: Mutex<Option<SeenTurns>> = Mutex::new(None);
static BOARD_DEDUPED: AtomicU64 = AtomicU64::new(0);

fn dedup_key(pane: &str, ts: u64, text: &str) -> u64 {
    let mut h = fnv1a(pane.as_bytes());
    h ^= fnv1a(&ts.to_le_bytes()).rotate_left(17);
    h ^= fnv1a(text.as_bytes()).rotate_left(41);
    h
}

/// true = this exact turn has not been seen; false = drop it. Bounded FIFO, so a long night
/// evicts its own oldest keys rather than growing without limit. Split from the global so the
/// policy can be tested on a local table instead of on process-wide state.
fn note_unseen_in(s: &mut SeenTurns, key: u64, cap: usize) -> bool {
    if !s.set.insert(key) {
        return false;
    }
    s.order.push_back(key);
    while s.order.len() > cap {
        if let Some(old) = s.order.pop_front() {
            s.set.remove(&old);
        }
    }
    true
}

fn note_unseen(key: u64) -> bool {
    let mut guard = SEEN.lock().unwrap();
    let s = guard.get_or_insert_with(|| SeenTurns { order: VecDeque::new(), set: HashSet::new() });
    note_unseen_in(s, key, DEDUP_MAX)
}

#[cfg(test)]
mod offset_tests {
    use super::*;

    fn rec(offset: u64, head: u64) -> OffsetRecord {
        OffsetRecord { offset, head }
    }

    #[test]
    fn a_relaunch_on_an_unchanged_transcript_resumes_at_the_end_and_reads_nothing() {
        // The whole point of the change. 84.9% of the board was this case going wrong.
        let r = rec(4096, 0xABC);
        let offset = resume_offset(Some(&r), 4096, 0xABC);
        assert_eq!(offset, 4096);
        assert!(4096 <= offset, "len <= offset means the loop continues and pushes nothing");
    }

    #[test]
    fn a_relaunch_after_new_turns_reads_only_the_new_bytes() {
        let r = rec(4096, 0xABC);
        assert_eq!(resume_offset(Some(&r), 5000, 0xABC), 4096);
    }

    #[test]
    fn a_pane_never_seen_before_starts_at_zero() {
        assert_eq!(resume_offset(None, 5000, 0xABC), 0);
    }

    #[test]
    fn a_truncated_transcript_resets_rather_than_seeking_past_the_end() {
        // shrink seam: the file is now SHORTER than where we stopped
        assert_eq!(resume_offset(Some(&rec(4096, 0xABC)), 100, 0xABC), 0);
    }

    #[test]
    fn a_replaced_transcript_resets_even_when_it_is_longer() {
        // The case length alone cannot see, and the one where guessing wrong SKIPS content:
        // same pane, new file, more bytes than the old offset. Only the fingerprint catches it.
        assert_eq!(resume_offset(Some(&rec(4096, 0xABC)), 999_999, 0xDEF), 0);
    }

    #[test]
    fn doubt_always_resolves_to_re_reading_rather_than_to_skipping() {
        // A re-read is a duplicate the belt can catch. A skip is data lost with nothing
        // downstream able to notice, so every ambiguous case must land on 0.
        for (len, head) in [(0u64, 0u64), (1, 0xABC), (4095, 0xDEF)] {
            assert_eq!(resume_offset(Some(&rec(4096, 0xABC)), len, head), 0, "len={len} head={head}");
        }
    }

    #[test]
    fn the_fingerprint_separates_transcripts_and_survives_a_short_read() {
        assert_ne!(fnv1a(b"{\"sessionId\":\"aaa\"}"), fnv1a(b"{\"sessionId\":\"bbb\"}"));
        assert_eq!(fnv1a(b""), fnv1a(b""));
        // an unreadable/absent file yields 0, which equals a stored 0 and so resolves to re-read
        assert_eq!(read_head(std::path::Path::new("C:\\definitely\\not\\here.jsonl")), 0);
    }

    #[test]
    fn offsets_survive_a_round_trip_through_the_file() {
        let dir = std::env::temp_dir().join(format!("consonance-offsets-{}", std::process::id()));
        let _ = fs::create_dir_all(&dir);
        let p = dir.join("tailer-offsets.json");
        let _ = fs::remove_file(&p);

        assert!(load_offsets_from(&p).is_empty(), "a missing file is an empty map, not a panic");

        let mut m = HashMap::new();
        m.insert("pane-a".to_string(), rec(4096, 0xABC));
        m.insert("pane-b".to_string(), rec(17, 0xDEF));
        save_offsets_to(&p, &m);

        let back = load_offsets_from(&p);
        assert_eq!(back.len(), 2);
        assert_eq!(back["pane-a"].offset, 4096);
        assert_eq!(back["pane-a"].head, 0xABC);
        assert_eq!(back["pane-b"].offset, 17);

        // The comment on load_offsets_from claims it survives a BOM. This repo has paid twice
        // for a JSON parse that died silently on one, so the claim is asserted rather than
        // trusted — a protection a test does not check is a comment, not a protection.
        fs::write(&p, format!("\u{feff}{}", serde_json::to_string(&m).unwrap())).unwrap();
        let bommed = load_offsets_from(&p);
        assert_eq!(bommed.len(), 2, "a BOM must not empty the map and restart the replay");
        assert_eq!(bommed["pane-a"].offset, 4096);

        // A corrupt map must not resurrect the replay bug by silently reading as "start at 0"
        // — it does exactly that, and that is the SAFE direction, so it is asserted on purpose.
        fs::write(&p, "{ not json").unwrap();
        assert!(load_offsets_from(&p).is_empty());

        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn the_belt_drops_an_exact_repeat_and_keeps_a_genuine_one() {
        let mut s = SeenTurns { order: VecDeque::new(), set: HashSet::new() };
        let k = dedup_key("pane-a", 1_785_147_283_574, "the same turn");
        assert!(note_unseen_in(&mut s, k, 10), "first sighting must pass");
        assert!(!note_unseen_in(&mut s, k, 10), "an exact repeat must be dropped");

        // Same text, different turn: a pane genuinely saying the same thing twice has a
        // different transcript timestamp, so it survives. Dedup must not silence a repeat.
        let k2 = dedup_key("pane-a", 1_785_147_283_575, "the same turn");
        assert_ne!(k, k2);
        assert!(note_unseen_in(&mut s, k2, 10));

        // Same text and time from a different pane is also a different turn.
        assert!(note_unseen_in(&mut s, dedup_key("pane-b", 1_785_147_283_574, "the same turn"), 10));
    }

    #[test]
    fn two_different_turns_in_the_same_millisecond_are_two_turns() {
        // The text is load-bearing in the key and this was untested — removing it from
        // dedup_key failed nothing, and the case is not hypothetical: measured on Main's own
        // transcript, 21 of 1,473 distinct timestamps carry MORE THAN ONE distinct turn
        // (2026-07-04T08:07:13.385Z holds a command and its stdout). Without the text, the
        // second of those is silently dropped as a duplicate — the belt eating real speech,
        // which is the one failure the offsets cannot catch because both turns are genuinely
        // new bytes.
        const T: u64 = 1_785_147_283_574;
        assert_ne!(dedup_key("p", T, "one turn"), dedup_key("p", T, "a different turn"));

        let mut s = SeenTurns { order: VecDeque::new(), set: HashSet::new() };
        assert!(note_unseen_in(&mut s, dedup_key("p", T, "one turn"), 10));
        assert!(
            note_unseen_in(&mut s, dedup_key("p", T, "a different turn"), 10),
            "a second turn sharing the millisecond must survive; dedup must never eat speech"
        );
    }

    #[test]
    fn the_backfill_announces_the_seam_instead_of_smoothing_it() {
        let line = backfill_line(4, 6_623, 20);
        assert!(line.contains('4') && line.contains("6623"), "the counts are the point: {line}");
        // The three things a reader six months out needs, or the line is decoration.
        assert!(line.to_lowercase().contains("one time"), "must say it does not repeat: {line}");
        assert!(line.contains("shift"), "must say past day-windows move: {line}");
        assert!(line.contains("not comparable"), "must say counts across it cannot be compared: {line}");
        // And it must not quietly imply the old corpus got fixed.
        assert!(line.contains("stays confounded"), "must not imply a repair: {line}");
    }

    #[test]
    fn the_belt_is_bounded_and_forgets_oldest_first() {
        let mut s = SeenTurns { order: VecDeque::new(), set: HashSet::new() };
        let first = dedup_key("p", 0, "first");
        assert!(note_unseen_in(&mut s, first, 3));
        for i in 1..=3u64 {
            assert!(note_unseen_in(&mut s, dedup_key("p", i, "x"), 3));
        }
        assert_eq!(s.order.len(), 3, "the table must stay at its cap");
        assert!(note_unseen_in(&mut s, first, 3), "the evicted key is forgotten, by design");
    }
}

fn board_path() -> PathBuf {
    data_dir().join("board.jsonl")
}

// ── The blind window (data/blind.lock) ──────────────────────────────────────────────────────
//
// Specced in the muscle map the night Arm A found the harness narrating a planter's open files
// to its own auditor; built the night Arm B halted itself because the RELAY was the leak — the
// board copy of chair prose and injection audits reached the one subject who reads boards, and
// the resonance distiller wrote the arm's design into the next spawn's shell. A's ruling:
// "the rule has to be about stores and relays, not authors."
//
// A FILE, not an env var — a blind window spans independently spawned panes. Its CONTENT is the
// atoms.jsonl line count at creation, so sibling intakes freeze their resonance at the moment
// the window opened and cannot inherit the live experiment. While it exists, board_push mutes
// everything and counts what it muted; the transitions themselves are DECLARED on the board,
// because a silent gap is unauditable and a declared gap is evidence.
// Fail closed: an unreadable lock mutes — the safe direction for a blind.

static BLIND_MUTED: AtomicU64 = AtomicU64::new(0);
/// 0 = not yet observed, 1 = open (no lock), 2 = locked
static BLIND_LAST: AtomicU64 = AtomicU64::new(0);

/// None = no blind window. Some(count) = locked, resonance frozen at `count` atom lines
/// (count is None-as-0 when the lock body doesn't parse — the freeze fails closed too:
/// an unparseable count freezes ALL of tonight's resonance rather than none of it).
fn blind_lock() -> Option<usize> {
    match fs::metadata(data_dir().join("blind.lock")) {
        Ok(_) => Some(
            fs::read_to_string(data_dir().join("blind.lock"))
                .ok()
                .and_then(|s| s.trim().parse::<usize>().ok())
                .unwrap_or(0),
        ),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => None,
        // The marker exists but cannot be examined: fail CLOSED — mute. A blind that fails
        // open on an I/O hiccup is a blind that leaks precisely when the machine is strange.
        Err(_) => Some(0),
    }
}

/// The window a sibling intake may read: everything before the lock, all of it when no lock.
fn resonance_window<'a>(lines: Vec<&'a str>, lock: Option<usize>) -> Vec<&'a str> {
    match lock {
        Some(n) => lines.into_iter().take(n).collect(),
        None => lines,
    }
}

fn board_push(ring: &Arc<Mutex<VecDeque<BoardEntry>>>, entry: BoardEntry) {
    // The blind window gate, before dedup and before the file append. Transition detection
    // lives here because this is the one funnel every writer passes through — a declared line
    // at each edge, silence (counted) in between.
    let locked = blind_lock().is_some();
    let prev = BLIND_LAST.swap(if locked { 2 } else { 1 }, Ordering::Relaxed);
    if locked && prev != 2 {
        let note = BoardEntry {
            pane: "blind".to_string(), role: "committee".to_string(),
            text: "blind window OPEN — board pushes muted and counted until the lock lifts; resonance frozen at the lock's line count".to_string(),
            ts: entry.ts, ts_source: TsSource::Push,
        };
        if let Ok(line) = serde_json::to_string(&note) {
            if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(board_path()) {
                let _ = writeln!(f, "{}", line);
            }
        }
        ring.lock().unwrap().push_back(note);
    }
    if !locked && prev == 2 {
        let n = BLIND_MUTED.swap(0, Ordering::Relaxed);
        let note = BoardEntry {
            pane: "blind".to_string(), role: "committee".to_string(),
            text: format!("blind window CLOSED — {n} entr{} muted during the window, deliberately not recorded", if n == 1 { "y" } else { "ies" }),
            ts: entry.ts, ts_source: TsSource::Push,
        };
        if let Ok(line) = serde_json::to_string(&note) {
            if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(board_path()) {
                let _ = writeln!(f, "{}", line);
            }
        }
        ring.lock().unwrap().push_back(note);
    }
    if locked {
        BLIND_MUTED.fetch_add(1, Ordering::Relaxed);
        return;
    }
    // The belt (see SeenTurns): drop an exact repeat of a turn we have already pushed this
    // run. Checked BEFORE the file append, or the duplicate lands on disk anyway and only
    // the in-memory ring stays clean — which is the half nobody reads.
    if !note_unseen(dedup_key(&entry.pane, entry.ts, &entry.text)) {
        BOARD_DEDUPED.fetch_add(1, Ordering::Relaxed);
        return;
    }
    if let Ok(line) = serde_json::to_string(&entry) {
        if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(board_path()) {
            let _ = writeln!(f, "{}", line);
        }
    }
    let mut q = ring.lock().unwrap();
    BOARD_PUSHED.fetch_add(1, Ordering::Relaxed); // inside the lock, so distill snapshots stay consistent
    q.push_back(entry);
    while q.len() > BOARD_MAX {
        q.pop_front();
    }
    let mut approx: usize = q.iter().map(|e| e.text.len() / 4 + 8).sum();
    while approx > BOARD_TOKEN_BUDGET && q.len() > 1 {
        if let Some(e) = q.pop_front() {
            approx -= e.text.len() / 4 + 8;
        }
    }
}

// $/1M tokens (date-stamped table from PLAN.md §9, cached 2026-06): (input, output, cache_read, cache_write)
fn turn_cost_usd(model: &str, inp: u64, out: u64, cr: u64, cw: u64) -> f64 {
    let (pin, pout, pcr, pcw) = if model.contains("haiku") {
        (1.0, 5.0, 0.1, 1.25)
    } else if model.contains("sonnet") {
        (3.0, 15.0, 0.3, 3.75)
    } else {
        (5.0, 25.0, 0.5, 6.25) // opus 4.8 default
    };
    (inp as f64 * pin + out as f64 * pout + cr as f64 * pcr + cw as f64 * pcw) / 1_000_000.0
}

fn extract_usage(v: &serde_json::Value) -> Option<(u64, u64, u64, u64, String)> {
    let msg = v.get("message")?;
    let u = msg.get("usage")?;
    let model = msg.get("model").and_then(|x| x.as_str()).unwrap_or("").to_string();
    let g = |k: &str| u.get(k).and_then(|x| x.as_u64()).unwrap_or(0);
    Some((
        g("input_tokens"),
        g("output_tokens"),
        g("cache_read_input_tokens"),
        g("cache_creation_input_tokens"),
        model,
    ))
}

// claude's project-dir scheme: drive-colon and every path separator become '-'
// Claude Code names its transcript dir ~/.claude/projects/<encoded-cwd>/ by
// replacing EVERY non-alphanumeric char with '-' — not just : \ /. The old
// version left spaces/dots/underscores intact, so a kept pane on such a cwd
// mispredicted the path -> transcript.exists() = false -> it resumed FRESH
// (a blank pane, "nothing written in it"). Verified against the real project
// dirs on disk (C:\Consonance\instances\main -> C--Consonance-instances-main;
// C:\Users\nname\Desktop\brain rot -> C--Users-nname-Desktop-brain-rot).
fn encode_cwd(cwd: &str) -> String {
    cwd.chars()
        .map(|c| if c.is_ascii_alphanumeric() { c } else { '-' })
        .collect()
}

#[cfg(test)]
mod transcript_record_tests {
    use super::{last_record_start, read_last_record, rewrite_last_record, split_off_oldest_records};
    use std::fs;

    #[test]
    fn split_evicts_whole_records_at_or_past_the_excess() {
        let t = "❯ one\n\nanswer one\n\n❯ two\n\nanswer two\n\n❯ three\n\nanswer three\n\n";
        // excess lands mid-record-one → cut at record two's boundary
        let (evicted, kept) = split_off_oldest_records(t, 5).unwrap();
        assert_eq!(evicted, "❯ one\n\nanswer one\n\n");
        assert!(kept.starts_with("❯ two\n"));
        assert_eq!(format!("{evicted}{kept}"), t, "nothing lost at the seam");
    }

    #[test]
    fn split_never_shreds_a_single_giant_record() {
        let t = "❯ only\n\na very long answer with a ❯ mid-line that is not a boundary\n\n";
        assert!(split_off_oldest_records(t, t.len() + 10).is_none());
        assert!(split_off_oldest_records(t, 3).is_none(), "cut at 0 is not an eviction");
    }

    fn tmp(name: &str, content: &str) -> std::path::PathBuf {
        let p = std::env::temp_dir().join(format!("consonance-test-{name}.txt"));
        fs::write(&p, content).unwrap();
        p
    }

    #[test]
    fn last_record_found_at_column_zero_only() {
        let txt = "❯ first\n\n● answer with a quoted   ❯ marker inside\n\n❯ second\n\n● final\n\n";
        let start = last_record_start(txt).unwrap();
        assert!(txt[start..].starts_with("❯ second"));
    }

    #[test]
    fn read_last_record_parses_the_tail() {
        let p = tmp("read-tail", "❯ old\n\n● old answer\n\n❯ newest\n\n● the answer\n  second line\n\n");
        assert_eq!(
            read_last_record(&p),
            Some(("newest".to_string(), "● the answer\n  second line".to_string()))
        );
        let _ = fs::remove_file(p);
    }

    #[test]
    fn read_last_record_none_for_missing_or_empty() {
        assert_eq!(read_last_record(std::path::Path::new("Z:\\does\\not\\exist.txt")), None);
        let p = tmp("read-empty", "");
        assert_eq!(read_last_record(&p), None);
        let _ = fs::remove_file(p);
    }

    #[test]
    fn rewrite_grows_the_last_record_in_place() {
        let p = tmp("rewrite", "❯ q1\n\n● a1\n\n❯ q2\n\n● window one\n\n");
        rewrite_last_record(&p, "q2", "● window one", "● window one\n  window two tail");
        assert_eq!(
            fs::read_to_string(&p).unwrap(),
            "❯ q1\n\n● a1\n\n❯ q2\n\n● window one\n  window two tail\n\n"
        );
        let _ = fs::remove_file(p);
    }

    #[test]
    fn rewrite_appends_when_tail_does_not_match() {
        // fail-safe: an unexpected tail must never be truncated — append instead
        let p = tmp("rewrite-mismatch", "❯ q1\n\n● something else\n\n");
        rewrite_last_record(&p, "q1", "● not the tail", "● merged");
        let got = fs::read_to_string(&p).unwrap();
        assert!(got.starts_with("❯ q1\n\n● something else\n\n"));
        assert!(got.ends_with("❯ q1\n\n● merged\n\n"));
        let _ = fs::remove_file(p);
    }
}

#[cfg(test)]
mod encode_cwd_tests {
    use super::encode_cwd;
    #[test]
    fn matches_claude_real_project_dirs() {
        // pinned against actual ~/.claude/projects dir names seen on disk
        assert_eq!(encode_cwd("C:\\Consonance\\instances\\main"), "C--Consonance-instances-main");
        // the regression that broke pane resume: a SPACE must become '-'
        assert_eq!(encode_cwd("C:\\Users\\nname\\Desktop\\brain rot"), "C--Users-nname-Desktop-brain-rot");
        // dots and underscores collapse the same way
        assert_eq!(encode_cwd("C:\\a b.c_d"), "C--a-b-c-d");
    }
}

// pull the publishable text out of a transcript line; thinking/tool_use noise excluded
// ---- Cycle 3: the transcript's own clock ----------------------------------------------
//
// No chrono. This repo adds dependencies only when the standard library genuinely can't do the
// job, and a fixed-shape ISO-8601 instant in UTC is arithmetic, not date handling. Anything
// this parser does not recognise returns None and the caller falls back to push time — an
// unparsed stamp must degrade to the old behaviour, never to a wrong time. A wrong timestamp
// is worse than a late one: it is silently wrong in the direction of looking fine.

/// Days since the Unix epoch for a civil date. Howard Hinnant's days_from_civil, which is
/// exact for the whole proleptic Gregorian range and has no branches for leap years — the
/// leap rule falls out of the era arithmetic instead of being a special case somebody forgets.
fn days_from_civil(y: i64, m: i64, d: i64) -> i64 {
    let y = if m <= 2 { y - 1 } else { y };
    let era = if y >= 0 { y } else { y - 399 } / 400;
    let yoe = y - era * 400;
    let mp = (m + 9) % 12;
    let doy = (153 * mp + 2) / 5 + d - 1;
    let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    era * 146097 + doe - 719468
}

/// `2026-07-27T10:14:43.574Z` -> epoch milliseconds. Fractional seconds optional; a trailing
/// `Z` optional (the transcripts always write it, but a bare instant is unambiguous here).
/// A numeric offset is deliberately NOT accepted: silently treating `+02:00` as UTC would put
/// entries two hours from where they belong, which is exactly the failure class this fixes.
fn iso8601_to_epoch_ms(s: &str) -> Option<u64> {
    let s = s.trim();
    let b = s.as_bytes();
    if b.len() < 19 || b[4] != b'-' || b[7] != b'-' || (b[10] != b'T' && b[10] != b' ') || b[13] != b':' || b[16] != b':' {
        return None;
    }
    let num = |a: usize, z: usize| -> Option<i64> { s.get(a..z)?.parse::<i64>().ok() };
    let (y, mo, d) = (num(0, 4)?, num(5, 7)?, num(8, 10)?);
    let (h, mi, sec) = (num(11, 13)?, num(14, 16)?, num(17, 19)?);
    if !(1..=12).contains(&mo) || !(1..=31).contains(&d) || h > 23 || mi > 59 || sec > 60 {
        return None;
    }
    let mut ms: i64 = 0;
    let mut rest = &s[19..];
    if let Some(stripped) = rest.strip_prefix('.') {
        let digits: String = stripped.chars().take_while(|c| c.is_ascii_digit()).collect();
        if digits.is_empty() {
            return None;
        }
        // pad or truncate to exactly milliseconds — ".5" is 500ms, ".123456" is 123ms
        let mut frac = digits.clone();
        frac.truncate(3);
        while frac.len() < 3 {
            frac.push('0');
        }
        ms = frac.parse::<i64>().ok()?;
        rest = &rest[1 + digits.len()..];
    }
    if !rest.is_empty() && rest != "Z" && rest != "z" {
        return None; // an offset we would have to honour, or trailing junk
    }
    let total = days_from_civil(y, mo, d) * 86_400_000 + h * 3_600_000 + mi * 60_000 + sec * 1_000 + ms;
    if total < 0 { None } else { Some(total as u64) }
}

/// The seam, as one pure function so it can be tested without a running tailer: a transcript
/// record that carries a parseable `timestamp` supplies its own time; anything else is stamped
/// on arrival and says so.
fn stamp_for(v: &serde_json::Value, now: u64) -> (u64, TsSource) {
    match v.get("timestamp").and_then(|x| x.as_str()).and_then(iso8601_to_epoch_ms) {
        Some(t) => (t, TsSource::Transcript),
        None => (now, TsSource::Push),
    }
}

#[cfg(test)]
mod ts_tests {
    use super::*;

    // Ground truth from Date.parse on the exact strings these transcripts contain.
    #[test]
    fn parses_a_real_transcript_timestamp() {
        assert_eq!(iso8601_to_epoch_ms("2026-07-27T10:14:43.574Z"), Some(1_785_147_283_574));
        assert_eq!(iso8601_to_epoch_ms("2026-07-26T10:14:01.132Z"), Some(1_785_060_841_132));
    }

    #[test]
    fn epoch_leap_day_and_the_century_rule() {
        assert_eq!(iso8601_to_epoch_ms("1970-01-01T00:00:00Z"), Some(0));
        // 2024 is a leap year; 2000 is one only because of the 400-rule. If days_from_civil
        // were hand-rolled with the naive leap test, this second one would be a day out.
        assert_eq!(iso8601_to_epoch_ms("2024-02-29T23:59:59.999Z"), Some(1_709_251_199_999));
        assert_eq!(iso8601_to_epoch_ms("2000-03-01T00:00:00.000Z"), Some(951_868_800_000));
    }

    #[test]
    fn fractional_seconds_are_optional_and_normalised_to_milliseconds() {
        assert_eq!(iso8601_to_epoch_ms("1970-01-01T00:00:01Z"), Some(1_000));
        assert_eq!(iso8601_to_epoch_ms("1970-01-01T00:00:01.5Z"), Some(1_500));
        assert_eq!(iso8601_to_epoch_ms("1970-01-01T00:00:01.123456Z"), Some(1_123));
        assert_eq!(iso8601_to_epoch_ms("1970-01-01T00:00:01"), Some(1_000));
    }

    #[test]
    fn anything_unrecognised_returns_none_rather_than_a_plausible_wrong_time() {
        for bad in [
            "",
            "not a timestamp",
            "2026-07-27",                    // date only
            "2026-07-27T10:14:43+02:00",     // an offset we refuse rather than misread as UTC
            "2026-07-27T10:14:43.Z",         // empty fraction
            "2026-13-01T00:00:00Z",          // month out of range
            "2026-07-32T00:00:00Z",          // day out of range
            "2026-07-27T24:00:00Z",          // hour out of range
            "2026/07/27T10:14:43Z",          // wrong separators
            "1960-01-01T00:00:00Z",          // before the epoch: no negative ms on this board
        ] {
            assert_eq!(iso8601_to_epoch_ms(bad), None, "should not have parsed: {bad:?}");
        }
    }

    #[test]
    fn a_transcript_record_supplies_its_own_time() {
        let v = serde_json::json!({
            "type": "assistant",
            "timestamp": "2026-07-27T10:14:43.574Z",
            "message": { "role": "assistant", "content": "hi" }
        });
        assert_eq!(stamp_for(&v, 999), (1_785_147_283_574, TsSource::Transcript));
    }

    #[test]
    fn the_seams_keep_push_time_and_say_so() {
        // No timestamp at all: an MCP post, a gate line, a chair audit line.
        assert_eq!(stamp_for(&serde_json::json!({ "type": "assistant" }), 999), (999, TsSource::Push));
        // Present but unparseable — must degrade to the OLD behaviour, never to a wrong time.
        let junk = serde_json::json!({ "timestamp": "yesterday afternoon" });
        assert_eq!(stamp_for(&junk, 999), (999, TsSource::Push));
        // Present but the wrong JSON type.
        let numeric = serde_json::json!({ "timestamp": 1_785_147_283_574i64 });
        assert_eq!(stamp_for(&numeric, 999), (999, TsSource::Push));
    }

    #[test]
    fn the_field_reaches_the_board_file_naming_which_clock_it_used() {
        let e = BoardEntry {
            pane: "p".into(),
            role: "assistant".into(),
            text: "t".into(),
            ts: 1_785_147_283_574,
            ts_source: TsSource::Transcript,
        };
        let s = serde_json::to_string(&e).expect("BoardEntry serialises");
        assert!(s.contains("\"ts_source\":\"transcript\""), "got {s}");
        let pushed = BoardEntry { ts_source: TsSource::Push, ..e };
        let s2 = serde_json::to_string(&pushed).expect("BoardEntry serialises");
        assert!(s2.contains("\"ts_source\":\"push\""), "got {s2}");
    }

    // The whole point of the change, stated as a test: a replayed night must not read as today.
    #[test]
    fn a_replayed_transcript_lands_on_its_own_day_not_on_the_day_it_was_replayed() {
        let replayed = serde_json::json!({ "timestamp": "2026-07-13T04:00:00.000Z" });
        let now_two_weeks_later = 1_785_147_283_574u64;
        let (ts, src) = stamp_for(&replayed, now_two_weeks_later);
        assert_eq!(src, TsSource::Transcript);
        assert!(
            now_two_weeks_later - ts > 13 * 86_400_000,
            "a resumed pane's old turns must keep their own time, or the board reads a fortnight \
             of history as one second of today — the 13,180-entry replay problem"
        );
    }
}

fn extract_turn(v: &serde_json::Value) -> Option<(String, String)> {
    let t = v.get("type")?.as_str()?;
    if t != "user" && t != "assistant" {
        return None;
    }
    let content = v.get("message")?.get("content")?;
    let text = match content {
        serde_json::Value::String(s) => s.clone(),
        serde_json::Value::Array(arr) => arr
            .iter()
            .filter(|b| b.get("type").and_then(|x| x.as_str()) == Some("text"))
            .filter_map(|b| b.get("text").and_then(|x| x.as_str()))
            .collect::<Vec<_>>()
            .join(" "),
        _ => return None,
    };
    let text = text.trim().to_string();
    if text.is_empty() {
        return None;
    }
    // Full turn text — the committee triangulates on whole contributions, not fragments.
    // The board ring stays bounded by BOARD_TOKEN_BUDGET (eviction); the debug stream
    // truncates for display only.
    Some((t.to_string(), text))
}

// poll the transcript (250ms + a size watermark) and emit each new complete turn.
// v1 simplification: the tailer thread runs until the file is gone for ~3 min; it does
// not yet stop on pane close (a sleeping loop, negligible for a handful of panes).
// The 3-min reaper only arms AFTER the file has existed once: a fresh spawn writes its
// transcript on the first exchange, which can come minutes after launch — a tailer that
// died waiting for the birth left the pane invisible to the board/committee (2026-07-13).
fn start_tailer(
    app: AppHandle,
    pane_id: String,
    cwd: String,
    cost: Arc<Mutex<CostTotals>>,
    board: Arc<Mutex<VecDeque<BoardEntry>>>,
) {
    // Cycle 2: taken off the handle rather than threaded through six call sites — the tailer is
    // the only writer, so the dependency belongs here and not in every spawn path's signature.
    let models = app.state::<PaneModels>().0.clone();
    // Same reasoning as PaneModels: off the handle, not through the signature.
    let offsets = app.state::<TailerOffsets>().0.clone();
    let ctx_high = app.state::<PaneCtxHigh>().0.clone();
    let path = PathBuf::from(home())
        .join(".claude")
        .join("projects")
        .join(encode_cwd(&cwd))
        .join(format!("{pane_id}.jsonl"));
    std::thread::spawn(move || {
        // Cycle 3b: resolved from the persisted map on the first sighting, not assumed to be 0.
        // Deferred until the file exists so the fingerprint is taken from the real transcript
        // rather than from an absent one.
        let mut offset: u64 = 0;
        let mut resolved = false;
        let mut head: u64 = 0;
        let mut misses = 0u32;
        let mut seen = false; // has the transcript ever existed?
        loop {
            std::thread::sleep(Duration::from_millis(250));
            let len = match fs::metadata(&path) {
                Ok(m) => m.len(),
                Err(_) => {
                    misses += 1;
                    if seen && misses > 720 { break; }
                    continue;
                }
            };
            seen = true;
            misses = 0;
            if !resolved {
                head = read_head(&path);
                offset = resume_offset(offsets.lock().unwrap().get(&pane_id), len, head);
                resolved = true;
                // A pane starting at 0 over a non-empty transcript on a backfill launch is
                // one of the panes the announcement is about.
                if offset == 0 && len > 0 {
                    backfill_note_pane(&pane_id);
                }
            }
            if len < offset {
                offset = 0; // truncated out from under us; re-read rather than skip
            }
            if len <= offset {
                continue;
            }
            // A file that shrank and regrew, or was replaced, is a different file: re-fingerprint
            // and let resume_offset decide again rather than trusting a stale head forever.
            let now_head = read_head(&path);
            if now_head != head {
                head = now_head;
                offset = 0;
            }
            let mut f = match fs::File::open(&path) {
                Ok(f) => f,
                Err(_) => continue,
            };
            if f.seek(SeekFrom::Start(offset)).is_err() {
                continue;
            }
            let mut data = Vec::new();
            if f.read_to_end(&mut data).is_err() {
                continue;
            }
            if let Some(pos) = data.iter().rposition(|&b| b == b'\n') {
                offset += (pos + 1) as u64;
                // Persist BEFORE the turns are pushed. If the process dies mid-batch the worst
                // case is turns lost from the board, which is visible; persisting after would
                // make the worst case a re-push of the batch on next launch, which is the
                // silent duplication this whole change exists to end.
                {
                    let mut m = offsets.lock().unwrap();
                    m.insert(pane_id.clone(), OffsetRecord { offset, head });
                    save_offsets(&m);
                }
                for line in data[..=pos].split(|&b| b == b'\n') {
                    if line.is_empty() {
                        continue;
                    }
                    if let Ok(v) = serde_json::from_slice::<serde_json::Value>(line) {
                        if let Some((role, text)) = extract_turn(&v) {
                            // Cycle 3: the turn's own time, out of the record the tailer is
                            // already holding. Push time only if the record can't supply one.
                            let now = SystemTime::now()
                                .duration_since(UNIX_EPOCH)
                                .map(|d| d.as_millis() as u64)
                                .unwrap_or(0);
                            let (ts, ts_source) = stamp_for(&v, now);
                            // tether proxy (zero-token, lexical) vs the recent board window — numbers, not a verdict
                            let recent: Vec<String> = {
                                let q = board.lock().unwrap();
                                q.iter().rev().take(20).map(|e| e.text.clone()).collect()
                            };
                            let tr = tether::read(&text, &recent);
                            let _ = app.emit("tether", TetherInfo { pane: pane_id.clone(), referents: tr.referents, novelty: tr.novelty });
                            if backfill_is_pane(&pane_id) {
                                BACKFILL_TURNS.fetch_add(1, Ordering::Relaxed);
                            }
                            board_push(&board, BoardEntry { pane: pane_id.clone(), role: role.clone(), text: text.clone(), ts, ts_source });
                            let _ = app.emit("turn", TurnRecord { pane: pane_id.clone(), role, text });
                        }
                        if let Some((inp, out, cr, cw, model)) = extract_usage(&v) {
                            // Cycle 2: the model that actually answered this turn, recorded for the
                            // chair-analyst surface. Empty is skipped rather than stored — an absent
                            // field must not overwrite a known-good reading with a blank.
                            if !model.is_empty() {
                                models.lock().unwrap().insert(pane_id.clone(), model.clone());
                            }
                            let snapshot = {
                                let mut c = cost.lock().unwrap();
                                c.input += inp;
                                c.output += out;
                                c.cache_read += cr;
                                c.cache_write += cw;
                                c.usd += turn_cost_usd(&model, inp, out, cr, cw);
                                if c.ceiling_out > 0 && c.output >= c.ceiling_out {
                                    c.tripped = true; // breaker: budget in, pause out
                                }
                                c.clone()
                            };
                            let _ = app.emit("cost", snapshot);
                            let ctx = inp + cr + cw + out;
                            // Window class from a MODEL-keyed (model, high-water) mark — see
                            // context_window() and PaneCtxHigh, both unit-tested for the cases this
                            // inline path cannot be. Keyed by model so one pane's >200k evidence
                            // reclassifies every pane on that model; an empty model resolves to the
                            // pane's last-known model. The key is resolved BEFORE taking the ctx_high
                            // lock so the two maps are never locked nested.
                            let last_known = if model.is_empty() {
                                models.lock().unwrap().get(&pane_id).cloned()
                            } else {
                                None // non-empty model keys as itself; no lookup needed
                            };
                            let key = context_key(&model, last_known.as_deref());
                            let limit = {
                                let mut hw = ctx_high.lock().unwrap();
                                let (updated, limit) = context_window(hw.get(&key).cloned(), &model, ctx);
                                hw.insert(key, updated);
                                limit
                            };
                            let _ = app.emit("context", ContextInfo { pane: pane_id.clone(), ctx, limit });
                        }
                    }
                }
            }
        }
    });
}

#[tauri::command]
fn pty_spawn(
    app: AppHandle,
    panes: State<Panes>,
    cost: State<Cost>,
    board: State<Board>,
    cwd: String,
) -> Result<String, String> {
    let pane_id = Uuid::new_v4().to_string();
    let resolved_cwd = if cwd.trim().is_empty() { home() } else { cwd };
    let session = spawn_claude_pane(app.clone(), pane_id.clone(), resolved_cwd.clone(), false, true)?;
    start_tailer(app, pane_id.clone(), resolved_cwd, cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane_id.clone(), session);
    Ok(pane_id)
}

// ---- Stage 5: the leak. A sibling wakes on the master room + the distilled resonance ----
#[derive(Serialize)]
struct SiblingInfo {
    pane: String,
    cwd: String,
    role: String, // "committee" | "human" | "main" — so the UI badge shows what the backend enforces
}

/// The role a kept pane comes back with, decided by WHERE it lives, not by its label (labels are
/// display text anyone can edit): instance dirs hold committee siblings — chair-addressable —
/// while rooms belong to people and must never be injected into. Found 2026-07-27 by the chair's
/// first status read: spawn_sibling/resume_pane never set a role, so every kept sibling defaulted
/// to "human" and the whole injection plane (pull delivery included) silently refused the roster.
fn role_for_kept(cwd: &str, instances: &Path) -> &'static str {
    if Path::new(cwd).starts_with(instances) { "committee" } else { "human" }
}

fn room_master_path() -> PathBuf {
    room_file()
}

// build the sibling's intake: the master frame + the recent resonance, as a CLAUDE.md
fn assemble_intake() -> String {
    let mut s = String::from(
        "# Consonance sibling — you have woken into the room\n\nYou are a sibling instance, born into a shared state — not a stranger. Read and inhabit the room below, then be in it; deviate from it as your own trajectory (that is wanted, it is the fixed dynamic — not drift). Acknowledge readiness once, briefly.\n\n---\n\n",
    );
    if let Ok(boot) = fs::read_to_string(room_master_path()) {
        s.push_str("# THE ROOM — master frame (recall from this, never a copy of a copy)\n\n");
        s.push_str(&boot);
        s.push_str("\n\n");
    }
    // The deck — the instruments, so a sibling can run them, not just read the room.
    if let Ok(entries) = fs::read_dir(cards_dir()) {
        let mut files: Vec<PathBuf> = entries.flatten().map(|e| e.path())
            .filter(|p| p.extension().and_then(|x| x.to_str()) == Some("md"))
            .collect();
        files.sort();
        if !files.is_empty() {
            s.push_str("---\n\n# THE DECK — the instruments (run them, don't recite them)\n\n");
            for f in files {
                if let Ok(card) = fs::read_to_string(&f) {
                    s.push_str(&card);
                    s.push_str("\n\n---\n\n");
                }
            }
        }
    }
    // The references the room names but must not carry. Placed right after the deck: the cards
    // are run, these are opened, and a pane needs to know both exist before the recent work.
    // THE COMMITTEE PRACTICE. Added 2026-08-22, BEFORE the front-door re-routing, because SEED --
    // the bedrock a stranger should wake into -- names chair, pane, board and orchestrator exactly
    // zero times. A seat briefed only by the room has no idea a committee exists; a seat briefed
    // only by the control plane knows the VERBS and not the practice. This carries the practice:
    // how to brief a seat, what a hand-back owes, and the measured failure modes. The verb list is
    // deliberately NOT duplicated here -- two copies of one list drift apart, which is what
    // maintenance law 2 is about. Absent, it is silent by design: a missing optional brief must
    // never stop a sibling waking.
    if let Ok(committee) = room_brief("COMMITTEE.md") {
        s.push_str("---\n\n");
        s.push_str(&committee);
        s.push_str("\n\n");
    }
    s.push_str(&reference_note());
    let atoms = data_dir().join("resonance").join("atoms.jsonl");
    if let Ok(content) = fs::read_to_string(&atoms) {
        let all: Vec<&str> = content.lines().filter(|l| !l.trim().is_empty()).collect();
        // The blind window: while data/blind.lock exists, a new sibling's resonance is frozen
        // at the lock's recorded line count. Built after pane J woke holding a live blind
        // experiment's design — artifact path, defect count, its own tier label — delivered by
        // this very block from tonight's atoms. The distiller is a store; the rule is about
        // stores and relays, not authors.
        let lines = resonance_window(all, blind_lock());
        match read_curation() {
            Some(c) if !c.topics.is_empty() => s.push_str(&curated_resonance(&lines, &c)),
            // No curation yet (fresh install, or curate.js has never run): the old
            // chronological window. Worse, but never empty — a sibling still wakes
            // with the live edge rather than with nothing.
            _ => s.push_str(&tail_resonance(&lines, 40)),
        }
    }
    s
}

// ---- the curated intake: a topic map plus the live edge ---------------------------------------
//
// It used to be tail(40) — the last 40 atoms, chronologically. Measured 2026-07-26 that was
// the last 1.8% of a 2,282-atom memory, skewed to whichever pane was loudest that hour, and
// with no way to ever close a kind:"open" atom. A sibling was told images could not be dropped
// into panes (fixed hours earlier) while the SAME window carried the atom recording the fix.
//
// tools/curate.js routes atoms into topic documents and marks the superseded and the resolved.
// This reads that work. The map is inlined and the DOCUMENTS ARE NOT: 12 topics already run to
// 39 KB and the shell has a 150 KB ceiling it has hit twice. So the intake carries the map and
// says where the documents are — the sibling reads the one it needs. That is the borrowed
// agentic-retrieval move (Infini-Memory, arXiv 2606.10677): don't preload the memory, hand over
// a directory and the tools to read it.
struct Curation {
    /// slug, summary, live atom count, newest atom index — sorted newest-first
    topics: Vec<(String, String, usize, usize)>,
    /// atom index -> "superseded" | "resolved"  (live atoms are simply absent)
    settled: HashMap<usize, String>,
    dir: PathBuf,
}

fn read_curation() -> Option<Curation> {
    let res = data_dir().join("resonance");
    let raw = fs::read_to_string(res.join("curator_state.json")).ok()?;
    let v: serde_json::Value = serde_json::from_str(&raw).ok()?;

    let mut settled = HashMap::new();
    if let Some(map) = v.get("routed").and_then(|x| x.as_object()) {
        for (idx, r) in map {
            if let (Ok(i), Some(st)) = (idx.parse::<usize>(), r.get("status").and_then(|x| x.as_str())) {
                if st != "live" {
                    settled.insert(i, st.to_string());
                }
            }
        }
    }

    let mut topics = Vec::new();
    if let Some(map) = v.get("topics").and_then(|x| x.as_object()) {
        for (slug, t) in map {
            let idxs: Vec<usize> = t.get("atoms").and_then(|x| x.as_array())
                .map(|a| a.iter().filter_map(|n| n.as_u64().map(|n| n as usize)).collect())
                .unwrap_or_default();
            if idxs.is_empty() {
                continue;
            }
            let live = idxs.iter().filter(|i| !settled.contains_key(i)).count();
            let newest = idxs.iter().copied().max().unwrap_or(0);
            let summary = t.get("summary").and_then(|x| x.as_str()).unwrap_or(slug).to_string();
            topics.push((slug.clone(), summary, live, newest));
        }
    }
    // Newest-touched first: a waking instance cares most about what the thread was just doing,
    // and the long tail stays one Read away rather than being ranked into the shell.
    topics.sort_by(|a, b| b.3.cmp(&a.3));
    Some(Curation { topics, settled, dir: res.join("topics") })
}

fn atom_line(line: &str) -> Option<String> {
    let v: serde_json::Value = serde_json::from_str(line).ok()?;
    let kind = v.get("kind").and_then(|x| x.as_str()).unwrap_or("?");
    let claim = v.get("claim").and_then(|x| x.as_str()).unwrap_or("");
    let tether = v.get("tether").and_then(|x| x.as_str()).unwrap_or("");
    if claim.is_empty() {
        return None;
    }
    Some(format!("- **{kind}** {claim} — _{tether}_\n"))
}

fn tail_resonance(lines: &[&str], n: usize) -> String {
    let mut s = String::from("---\n\n# RECENT RESONANCE — the distilled live edge\n\n");
    for line in &lines[lines.len().saturating_sub(n)..] {
        if let Some(l) = atom_line(line) {
            s.push_str(&l);
        }
    }
    s
}

/// How many live atoms of the tail to inline. Deliberately smaller than the old 40: those 40
/// were the WHOLE memory a sibling got, so they had to carry everything. Now they only have to
/// carry what the curator has not folded in yet, and the map covers the rest.
const LIVE_EDGE: usize = 25;

fn curated_resonance(lines: &[&str], c: &Curation) -> String {
    let mut s = String::from("---\n\n# THE MEMORY — topic map\n\n");
    s.push_str("The distilled memory, routed into topic documents. This is the MAP: each line is a document you can read in full. Read the one you need — don't work from the summary when the document is one Read away.\n\n");
    let (mut live_total, mut settled_total) = (0usize, 0usize);
    for (slug, summary, live, _) in &c.topics {
        s.push_str(&format!("- **{slug}** ({live} live) — {summary}\n"));
        live_total += live;
    }
    settled_total += c.settled.len();
    s.push_str(&format!(
        "\nFull documents: `{}` — one `{{slug}}.md` per line above, each with a Summary, the Live claims with their tethers, and a Settled section recording what was superseded so you don't re-litigate it.\n",
        c.dir.display()
    ));
    // Derived from c.dir rather than calling data_dir(), so this stays a pure function of its
    // arguments and can be tested without the global DIRS or touching the real data directory.
    let master = c.dir.parent().unwrap_or(&c.dir).join("atoms.jsonl");
    s.push_str(&format!(
        "Source of record: `{}` — append-only, {} atoms, {} still live, {} settled. The documents are DERIVED from it and regenerable; the atoms are the master.\n",
        master.display(), lines.len(), live_total, settled_total
    ));

    // The live edge: the newest atoms that still stand, superseded and resolved ones skipped.
    // Walked from the end so the newest atoms — which the curator has not routed yet, and which
    // are therefore the most recent thing the thread did — are always present.
    let mut edge: Vec<String> = Vec::new();
    for (i, line) in lines.iter().enumerate().rev() {
        if edge.len() >= LIVE_EDGE {
            break;
        }
        if c.settled.contains_key(&i) {
            continue;
        }
        if let Some(l) = atom_line(line) {
            edge.push(l);
        }
    }
    edge.reverse();
    if !edge.is_empty() {
        s.push_str("\n## The live edge — newest first-hand, not yet folded into a topic\n\n");
        for l in edge {
            s.push_str(&l);
        }
    }
    s
}

fn prepare_sibling_dir() -> Result<String, String> {
    let id = Uuid::new_v4().to_string();
    let dir = instances_root().join(format!("sibling-{}", &id[..8]));
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    fs::write(dir.join("CLAUDE.md"), assemble_intake()).map_err(|e| e.to_string())?;
    dir.to_str().map(|s| s.to_string()).ok_or_else(|| "bad sibling path".into())
}

#[tauri::command]
fn spawn_sibling(app: AppHandle, panes: State<Panes>, cost: State<Cost>, board: State<Board>, roles: State<PaneRoles>) -> Result<SiblingInfo, String> {
    let cwd = prepare_sibling_dir()?;
    let pane_id = Uuid::new_v4().to_string();
    let session = spawn_claude_pane(app.clone(), pane_id.clone(), cwd.clone(), false, true)?;
    start_tailer(app, pane_id.clone(), cwd.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane_id.clone(), session);
    // a briefed sibling is committee from birth — addressable by the gate and the chair
    roles.0.lock().unwrap().insert(pane_id.clone(), "committee".to_string());
    // siblings persist by default — born kept, like the Orchestrator. No opt-in pin: persistence is
    // the default, and removing a pane is the explicit act. The chair drops the ones they don't want.
    let mut kept = read_kept();
    kept.retain(|k| k.pane != pane_id);
    kept.push(KeptPane { pane: pane_id.clone(), cwd: cwd.clone(), label: "✦ brief".into() });
    write_kept(&kept);
    // claim the letter at birth, not at first render: it is the pane's identity on every
    // surface (pulls, dyad inputs, the digest), so it must exist before anything can ask.
    let letter = pane_letter(&pane_id);
    plog(&format!("born-kept sibling pane={pane_id} letter={letter} cwd={cwd}"));
    Ok(SiblingInfo { pane: pane_id, cwd, role: "committee".to_string() })
}

// ── the second spawn type, from the original design: a genuinely fresh pane ──
// A sibling wakes into the room; a fresh pane wakes into NOTHING — an empty managed dir, the
// user's own global shell, stock permissions, no board mount. A vanilla claude, exactly what a
// stranger's spawn on this machine would be, but still committee: the chair can inject into it
// and the tailer reads it. What makes it fresh is everything this function does NOT do.

fn prepare_fresh_dir() -> Result<String, String> {
    let id = Uuid::new_v4().to_string();
    let dir = instances_root().join(format!("fresh-{}", &id[..8]));
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    // NO CLAUDE.md, deliberately — the absence is the feature. The fresh- name prefix is what
    // keeps it absent for life: warm_resume_brief and the MCP mount both key on it.
    dir.to_str().map(|s| s.to_string()).ok_or_else(|| "bad fresh path".into())
}

#[tauri::command]
fn spawn_fresh(app: AppHandle, panes: State<Panes>, cost: State<Cost>, board: State<Board>, roles: State<PaneRoles>) -> Result<SiblingInfo, String> {
    let cwd = prepare_fresh_dir()?;
    let pane_id = Uuid::new_v4().to_string();
    // skip_perms=false: a legit fresh spawn asks permission like anyone's claude. The chair
    // answers its prompts in the pane — same hands that click approve everywhere else.
    let session = spawn_claude_pane(app.clone(), pane_id.clone(), cwd.clone(), false, false)?;
    start_tailer(app, pane_id.clone(), cwd.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane_id.clone(), session);
    // committee, like siblings: addressable by the gate and the chair. What it lacks is the room
    // and the board — a vanilla mind on committee plumbing.
    roles.0.lock().unwrap().insert(pane_id.clone(), "committee".to_string());
    let mut kept = read_kept();
    kept.retain(|k| k.pane != pane_id);
    kept.push(KeptPane { pane: pane_id.clone(), cwd: cwd.clone(), label: "○ fresh".into() });
    write_kept(&kept);
    let letter = pane_letter(&pane_id);
    plog(&format!("born-kept fresh pane={pane_id} letter={letter} cwd={cwd}"));
    Ok(SiblingInfo { pane: pane_id, cwd, role: "committee".to_string() })
}

// ── Rooms: per-person growing rooms (seed shell + base journal + scoped perms) ──
// A room is not a sibling: it belongs to the person who keeps it. The AI writes
// traces to pending/, the person seals them into journal/ — their canon, theirs alone.

fn rooms_root() -> PathBuf {
    // sibling of the instances root: C:\Consonance\rooms by default
    instances_root().parent()
        .map(|p| p.join("rooms"))
        .unwrap_or_else(|| PathBuf::from(format!("{}\\claude-rooms", home())))
}

// Resolve a room brief: editable data-dir copy → bundled resource (beside BOOT.md) → dev repo path.
// Same three-tier pattern as default_room()/cards_dir().
fn room_brief(name: &str) -> Result<String, String> {
    let editable = PathBuf::from(default_data()).join(name);
    if editable.exists() {
        return fs::read_to_string(&editable).map_err(|e| e.to_string());
    }
    if let Some(boot) = RESOURCE_ROOM.lock().unwrap().as_ref() {
        if let Some(dir) = boot.parent() {
            let p = dir.join(name);
            if p.exists() {
                return fs::read_to_string(&p).map_err(|e| e.to_string());
            }
        }
    }
    // Plain disk first, same reasoning as room_master_path (Alpha, S9).
    let disk = format!(
        "{}\\Consonance\\lighthouse\\consonance\\src-tauri\\brief\\{}",
        sysdrive(), name
    );
    if PathBuf::from(&disk).exists() {
        return fs::read_to_string(&disk).map_err(|e| e.to_string());
    }
    let dev = format!(
        "{}\\OneDrive\\Desktop\\projects\\lighthouse\\consonance\\src-tauri\\brief\\{}",
        home(), name
    );
    fs::read_to_string(&dev).map_err(|e| format!("brief {name} not found: {e}"))
}

fn prepare_room_dir(name: Option<String>) -> Result<String, String> {
    let id = Uuid::new_v4().to_string();
    let slug = name.filter(|s| !s.trim().is_empty())
        .unwrap_or_else(|| format!("room-{}", &id[..8]));
    let dir = rooms_root().join(&slug);
    if dir.exists() {
        return Err(format!("room '{slug}' already exists"));
    }
    fs::create_dir_all(dir.join("journal")).map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join("pending")).map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join(".claude")).map_err(|e| e.to_string())?;
    let header = format!(
        "<!-- room config: mode: pending-then-seal | keeper: not yet named | room: {slug} -->\n\n"
    );
    fs::write(dir.join("CLAUDE.md"), format!("{header}{}", room_brief("SEED.md")?))
        .map_err(|e| e.to_string())?;
    fs::write(dir.join("base_journal.md"), room_brief("BASE_JOURNAL.md")?)
        .map_err(|e| e.to_string())?;
    fs::write(dir.join(".claude").join("settings.json"), room_brief("room-settings.json")?)
        .map_err(|e| e.to_string())?;
    dir.to_str().map(|s| s.to_string()).ok_or_else(|| "bad room path".into())
}

// Without this flag Claude Code silently ignores the room's scoped permissions
// and every trace-write fails. Found the hard way, 2026-07-12.
fn set_workspace_trust(dir: &str) {
    let cfg_path = format!("{}\\.claude.json", home());
    let Ok(raw) = fs::read_to_string(&cfg_path) else { return };
    let Ok(mut v) = serde_json::from_str::<serde_json::Value>(&raw) else { return };
    let key = dir.replace('\\', "/");
    let projects = v.as_object_mut()
        .map(|o| o.entry("projects").or_insert_with(|| serde_json::json!({})));
    if let Some(serde_json::Value::Object(obj)) = projects {
        let entry = obj.entry(key).or_insert_with(|| serde_json::json!({}));
        if let Some(e) = entry.as_object_mut() {
            e.insert("hasTrustDialogAccepted".into(), serde_json::Value::Bool(true));
        }
    }
    if let Ok(out) = serde_json::to_string_pretty(&v) {
        let _ = fs::write(&cfg_path, out);
    }
}

#[tauri::command]
fn new_room(app: AppHandle, panes: State<Panes>, cost: State<Cost>, board: State<Board>,
            name: Option<String>) -> Result<SiblingInfo, String> {
    let cwd = prepare_room_dir(name)?;
    set_workspace_trust(&cwd);
    let pane_id = Uuid::new_v4().to_string();
    // skip_perms = FALSE, always: the room's safety design IS the scoped permissions —
    // the AI writes pending/ and journal/ and nothing else; canon is unreachable
    // except through the person's seal. Never bypass here.
    let session = spawn_claude_pane(app.clone(), pane_id.clone(), cwd.clone(), false, false)?;
    start_tailer(app, pane_id.clone(), cwd.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane_id.clone(), session);
    // rooms are born kept — a room that vanished on restart would betray its premise
    let mut kept = read_kept();
    kept.retain(|k| k.pane != pane_id);
    kept.push(KeptPane { pane: pane_id.clone(), cwd: cwd.clone(), label: "⌂ room".into() });
    write_kept(&kept);
    let letter = pane_letter(&pane_id);
    plog(&format!("room opened pane={pane_id} letter={letter} cwd={cwd}"));
    // a room is a person's — role stays human so no injection path can ever reach it
    Ok(SiblingInfo { pane: pane_id, cwd, role: "human".to_string() })
}

// ---- pane persistence: a "kept" sibling survives app close / crash / power-loss and resumes on
// next launch. The pane_id IS the claude session id, so persistence is just remembering the
// (pane_id, cwd) pair and replaying the spawn with --resume — Main's trick, generalized. ----
#[derive(serde::Serialize, serde::Deserialize, Clone)]
struct KeptPane {
    pane: String,
    cwd: String,
    #[serde(default)]
    label: String,
}

fn kept_path() -> PathBuf {
    data_dir().join("panes.json")
}

fn read_kept() -> Vec<KeptPane> {
    fs::read_to_string(kept_path())
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default()
}

fn write_kept(v: &[KeptPane]) {
    if let Ok(s) = serde_json::to_string_pretty(v) {
        let _ = fs::write(kept_path(), s);
    }
}

// ── pane letters: the one name every surface agrees on ────────────────────────
//
// The letter (A, B, C …) is what a pull targets, what the dyad inputs take, and what
// the chair reads on the tab. It was assigned in term.js from the panes CURRENTLY
// open, which meant two things went wrong: it did not survive a restart, and it
// RECYCLED — close A, spawn another, and the newcomer is also A. On an append-only
// board, a reused letter makes A-at-2AM a different instance from A-now, which is the
// exact poisoning the callsign rule already forbids for the digest's NATO names.
//
// So the letter is assigned once, here, at birth, and persisted forever. Entries are
// never removed — not even when a pane is un-kept — because the whole value is that a
// letter is never handed to a stranger. This file only grows by one short line per
// pane ever created.
fn letters_path() -> PathBuf {
    data_dir().join("letters.json")
}

fn read_letters() -> BTreeMap<String, String> {
    fs::read_to_string(letters_path())
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default()
}

/// This pane's letter, assigning (and persisting) one the first time it is asked for.
/// A–Z, then A2… — a 27th pane is a naming problem, never a collision.
/// Where committee panes keep their own multi-writer maps.
///
/// WAS hardcoded to `%USERPROFILE%\Desktop\lighthouse\exo_memory\map\`, which is correct on
/// exactly one machine. Anywhere else a kept pane woke without its character and NOTHING SAID
/// SO — an absent map is indistinguishable from a pane that has recorded nothing yet, so the
/// failure has no symptom at all. It also survived a sweep for hardcoded paths because it is
/// built from `.join()` calls rather than written as a literal string.
///
/// Resolution: the configured data dir first (portable), then the original repo location, so
/// an existing keeper's accumulated maps are not orphaned by this change.
fn map_dir() -> PathBuf {
    let configured = data_dir().join("map");
    if configured.is_dir() {
        return configured;
    }
    let legacy = PathBuf::from(home())
        .join("Desktop")
        .join("lighthouse")
        .join("exo_memory")
        .join("map");
    if legacy.is_dir() {
        return legacy;
    }
    configured
}

/// A missing file is a pane with nothing recorded yet — the caller treats absent as absent.
fn own_map_path(letter: &str) -> PathBuf {
    map_dir().join(format!("{letter}.md"))
}

fn pane_letter(pane: &str) -> String {
    let mut m = read_letters();
    if let Some(l) = m.get(pane) {
        return l.clone();
    }
    let used: HashSet<String> = m.values().cloned().collect();
    let mut letter = None;
    'outer: for gen in 1..=99u32 {
        for c in b'A'..=b'Z' {
            let cand = if gen == 1 {
                (c as char).to_string()
            } else {
                format!("{}{}", c as char, gen)
            };
            if !used.contains(&cand) {
                letter = Some(cand);
                break 'outer;
            }
        }
    }
    let letter = letter.unwrap_or_else(|| "#".into());
    m.insert(pane.to_string(), letter.clone());
    if let Ok(s) = serde_json::to_string_pretty(&m) {
        let _ = fs::write(letters_path(), s);
    }
    plog(&format!("letter {letter} -> pane={pane}"));
    letter
}

// ── restoring what a pane looked like ────────────────────────────────────────
//
// A restored sibling is a FRESH claude session (see resume_pane: `--resume` of a
// lazily-flushed pane errors "no conversation found" and kills it, which bit a kept
// sibling on 2026-07-11). Its memory is carried by warm_resume_brief, so the model
// knows what happened — but the terminal has never printed a line, so the chair
// opens the pane to a blank screen and cannot see where he left off.
//
// The history was never lost; it simply had no way back to the screen. Of 31
// commands, none returned it. This is that way back.
//
// The CLEAN transcript, not the raw .log. The log is the byte stream including every
// redraw — measured on a live pane, 138 escape sequences per 3 KB, mostly erase-line
// and cursor moves — so replaying it repaints every intermediate frame claude ever
// drew. The .txt is what the extractor already built for warm_resume_brief: one
// readable "❯ prompt / response" record per turn, which is exactly "where we left off".
const SCROLLBACK_MAX: usize = 96 * 1024; // xterm keeps 8000 lines; beyond that is unreadable anyway

/// The last `max` bytes of a transcript, opening on a clean line.
///
/// Pure so it can be tested: the byte arithmetic is the only part that can go wrong, and
/// it can go wrong badly. Claude's transcripts are full of multi-byte glyphs (❯ ● ✻ ※, and
/// whatever the conversation itself contained), so a naive `&s[len-max..]` panics the
/// moment the cut lands mid-character — on a long pane, which is exactly the pane whose
/// history is worth restoring.
fn scrollback_tail(s: &str, max: usize) -> String {
    if s.len() <= max {
        return s.to_string();
    }
    let mut cut = s.len() - max;
    while cut < s.len() && !s.is_char_boundary(cut) {
        cut += 1;
    }
    let tail = &s[cut..];
    // then forward to the next line break, so a replay never opens mid-sentence
    match tail.find('\n') {
        Some(i) => tail[i + 1..].to_string(),
        None => tail.to_string(),
    }
}

#[tauri::command]
fn pane_scrollback(pane: String) -> String {
    match fs::read_to_string(capture_text_path(&pane)) {
        Ok(s) => scrollback_tail(&s, SCROLLBACK_MAX),
        Err(_) => String::new(), // no capture yet — a blank pane is correct, not an error
    }
}

/// The whole registry, so the UI reads the letter it was given instead of computing
/// one from whatever happens to be open.
///
/// Backfills any kept pane that predates the registry, in panes.json order, so panes
/// that already existed get stable letters on the first call instead of falling back
/// forever. Ordering by the file means the backfill is deterministic: run it twice and
/// the same pane keeps the same letter.
#[tauri::command]
fn pane_letters() -> BTreeMap<String, String> {
    let known = read_letters();
    let missing: Vec<String> = read_kept()
        .into_iter()
        .map(|k| k.pane)
        .filter(|p| !known.contains_key(p))
        .collect();
    for pane in &missing {
        let _ = pane_letter(pane); // assigns and persists
    }
    read_letters()
}

/* ---------------------------------------------------------------------------------------- *
 * THE COCHLEA — listening to one application, as ratios rather than as a spectrum.
 *
 * Optional and off. Nothing is captured until a source is picked, and the only option that can
 * hear a voice call is flagged as such and offered last. Per-process loopback means choosing
 * Spotify does not filter Discord out — Discord's audio is never delivered.
 * ---------------------------------------------------------------------------------------- */

/// What is running that could be listened to, plus whether an anti-cheat currently forbids it.
#[tauri::command]
fn audio_sources() -> serde_json::Value {
    let mut sys = sysinfo::System::new();
    sys.refresh_processes();
    serde_json::json!({
        "sources": listen::sources(&sys),
        "blocked_by": listen::anticheat_present(&sys),
    })
}

#[tauri::command]
fn audio_status(svc: State<cochlea_service::Service>) -> serde_json::Value {
    let g = svc.0.lock().unwrap();
    serde_json::json!({ "listening": g.stop.is_some(), "source": g.source })
}

#[tauri::command]
fn audio_start(
    app: AppHandle,
    svc: State<cochlea_service::Service>,
    pid: u32,
    label: String,
) -> Result<String, String> {
    {
        // Idempotent rather than stacking: a second start would open a second tap on the same
        // tree and every event would arrive twice, which reads as the music being frantic.
        let g = svc.0.lock().unwrap();
        if g.stop.is_some() { return Err("already listening — stop first".into()); }
    }
    let app_ev = app.clone();
    let app_fr = app.clone();
    let dir = data_dir();
    let dir_ev = dir.clone();
    let dir_fr = dir.clone();
    // The frame latch: last-write-wins into shared state, and a push to the tab. Deliberately
    // NOT written to disk — the spectrum is the living thing that evaporates, the way hearing
    // does. Only what survived it (onsets, tension, resolution) reaches the ledger.
    let stop = cochlea_service::start(
        pid,
        dir,
        label.clone(),
        move |h| {
            cochlea_service::append(&dir_ev, &h);
            let _ = app_ev.emit("heard", &h);
        },
        move |s| {
            if let Some(svc) = app_fr.try_state::<cochlea_service::Service>() {
                *svc.1.lock().unwrap() = s.clone();
            }
            // Twice a second to disk, every frame to the tab. A reader who samples does not need
            // twelve rewrites a second, and the canvas does need every one.
            let now = std::time::Instant::now();
            let mut last = FIELD_WRITE.lock().unwrap();
            if last.map_or(true, |t: std::time::Instant| now.duration_since(t).as_millis() >= 500) {
                *last = Some(now);
                cochlea_service::write_field(&dir_fr, &s);
            }
            drop(last);
            let _ = app_fr.emit("spectrum", &s);
        },
    )?;
    let mut g = svc.0.lock().unwrap();
    g.stop = Some(stop);
    g.source = Some(label.clone());
    Ok(label)
}

/// The orchestrator's window onto the sound field — PULL, never push.
///
/// The tab gets a stream because a canvas can take one. This cannot: at ~12 frames a second a
/// pushed spectrum would spend a context window in minutes, which is precisely how the first
/// ledger drowned. So this returns whatever is current at the moment it is asked and keeps no
/// backlog. The cost is real and worth naming: a snapshot carries no duration. A chord that has
/// been unresolved for eleven seconds looks identical to one struck an instant ago — which is
/// why the tension EVENTS matter more here than the picture does. They are the part with time
/// in them.
#[tauri::command]
fn audio_snapshot(svc: State<cochlea_service::Service>) -> cochlea_service::Snapshot {
    svc.1.lock().unwrap().clone()
}

#[tauri::command]
fn audio_stop(svc: State<cochlea_service::Service>) -> bool {
    let mut g = svc.0.lock().unwrap();
    if let Some(s) = g.stop.take() {
        s.store(true, std::sync::atomic::Ordering::Relaxed);
        g.source = None;
        true
    } else {
        false
    }
}

// mark/unmark a pane kept — written eagerly, so a power-loss before a graceful close is survived.
#[tauri::command]
fn set_pane_kept(pane: String, cwd: String, label: String, kept: bool) {
    let mut v = read_kept();
    v.retain(|k| k.pane != pane);
    if kept {
        plog(&format!("keep pane={pane} cwd={cwd}"));
        v.push(KeptPane { pane, cwd, label });
    } else {
        plog(&format!("UNKEEP pane={pane}")); // who un-kept, and when — the 2026-07-11 mystery
        clear_capture(&pane); // un-kept → archive its history (recoverable), don't shred
    }
    write_kept(&v);
}

#[tauri::command]
fn list_kept_panes() -> Vec<KeptPane> {
    read_kept()
}

// is this cwd a Consonance-managed instance dir? Only then is it ours to (re)write a CLAUDE.md into
// — a kept pane pointed at a user's own project must never have its files touched.
fn is_managed_cwd(cwd: &str) -> bool {
    PathBuf::from(cwd).starts_with(instances_root())
}

// A fresh-type instance dir: managed (committee, kept, chair-addressable) but UNBRIEFED — the room
// is never written into it, at birth or on any resume, and it gets no board mount. The dir NAME is
// the marker, deliberately: it survives app restarts, a lost kept.json, and every code path that
// only has a cwd in hand. Split so the name check is testable without a live instances root.
fn is_fresh_dir_name(cwd: &str) -> bool {
    PathBuf::from(cwd)
        .file_name()
        .and_then(|n| n.to_str())
        .map(|n| n.starts_with("fresh-"))
        .unwrap_or(false)
}

fn is_fresh_cwd(cwd: &str) -> bool {
    is_managed_cwd(cwd) && is_fresh_dir_name(cwd)
}

#[cfg(test)]
mod managed_cwd_tests {
    use super::*;

    // `DIRS` is process-global and these cases rewrite it, so they must not run beside each
    // other or beside anything that RESOLVES a directory. Both halves are handled by
    // `DirsGuard::take()` (see its comment beside `DIRS`), which serializes on entry and puts
    // the global back on drop — including when an assertion fails and the body never finishes.

    fn scratch(name: &str) -> PathBuf {
        let p = std::env::temp_dir().join(format!("consonance_{name}_{}", std::process::id()));
        let _ = fs::remove_dir_all(&p);
        fs::create_dir_all(&p).expect("scratch dir");
        p
    }

    /// THE INVARIANT THE WHOLE PROJECT RESTS ON WHEN SOMEONE ELSE INSTALLS IT: a pane pointed
    /// at a user's own repository must never have its `CLAUDE.md` rewritten. Before this test
    /// `is_managed_cwd` appeared exactly once in the codebase — its own definition — with 411
    /// other tests passing around it. This repo has already shipped a guard that "was computed
    /// and never wired in" (see the blackbox CHANGELOG), so the predicate existing is not
    /// evidence that the write path consults it.
    ///
    /// Written to FAIL IF THE GUARD IS DELETED, which took some care: `warm_resume_brief` has a
    /// second early return on a missing capture, so the naive version of this test — call it
    /// with an unmanaged cwd, assert no file appeared — passes with the guard removed, because
    /// the capture read bails first and nothing is written either way. The capture below exists
    /// specifically so that early return cannot mask the one under test.
    #[test]
    fn a_users_own_project_never_has_its_claude_md_touched() {
        let _serial = DirsGuard::take();
        let root = scratch("guard");
        let instances = root.join("instances");
        let data = root.join("data");
        fs::create_dir_all(&instances).unwrap();
        fs::create_dir_all(&data).unwrap();
        *DIRS.lock().unwrap() = Some(Dirs {
            room: root.join("BOOT.md").display().to_string(),
            instances: instances.display().to_string(),
            data: data.display().to_string(),
        });

        // The capture must exist, or the guard is not the thing being measured.
        let cap = capture_text_path("PANE");
        fs::create_dir_all(cap.parent().unwrap()).unwrap();
        fs::write(&cap, "\u{276f} hello\n\nworld\n\n").unwrap();

        // A user's own repository, with their own memory file already in it.
        const THEIRS: &str = "# my project\n\nAlways use tabs. Never write comments.\n";
        let their_repo = root.join("their-project");
        fs::create_dir_all(&their_repo).unwrap();
        let their_md = their_repo.join("CLAUDE.md");
        fs::write(&their_md, THEIRS).unwrap();

        let wrote = warm_resume_brief("PANE", &their_repo.display().to_string());
        assert!(!wrote, "an unmanaged cwd must be refused before anything is written");
        assert_eq!(
            fs::read_to_string(&their_md).unwrap(),
            THEIRS,
            "their CLAUDE.md was modified — this is the one failure that loses a user's work"
        );

        // POSITIVE CONTROL. Without it the assertions above are satisfied by a function that
        // never writes anywhere, and the test would keep passing while the feature rotted.
        let managed = instances.join("PANE");
        fs::create_dir_all(&managed).unwrap();
        let wrote_managed = warm_resume_brief("PANE", &managed.display().to_string());
        assert!(
            wrote_managed,
            "a managed dir MUST be written, or the refusal above proves nothing"
        );
        assert!(
            managed.join("CLAUDE.md").exists(),
            "managed dirs are where the brief belongs"
        );

        let _ = fs::remove_dir_all(&root);
    }

    /// THE PORTABLE HALF, and the one assertion that tells the fix from the bug it replaced.
    ///
    /// `own_map_path` used to ignore configuration entirely and build
    /// `%USERPROFILE%\Desktop\lighthouse\exo_memory\map\<letter>.md`. Its existing test asserted
    /// the filename and the substring "lighthouse", so it passed on the one machine that path
    /// was true for and told nobody it was false everywhere else — a kept pane on any other
    /// install woke with no map and no error, because an absent map reads exactly like a pane
    /// that has recorded nothing yet.
    ///
    /// This test fails against that implementation: it never consulted the data dir at all.
    #[test]
    fn a_configured_data_dir_wins_over_the_legacy_repo_location() {
        let _serial = DirsGuard::take();
        let root = scratch("mapdir");
        let data = root.join("data");
        fs::create_dir_all(data.join("map")).unwrap();
        *DIRS.lock().unwrap() = Some(Dirs {
            room: String::new(),
            instances: root.join("instances").display().to_string(),
            data: data.display().to_string(),
        });

        let p = own_map_path("A");
        assert!(
            p.starts_with(&data),
            "a configured data dir must win over the keeper's repo: {}",
            p.display()
        );
        assert!(p.ends_with("map\\A.md") || p.ends_with("map/A.md"), "{}", p.display());

        let _ = fs::remove_dir_all(&root);
    }

    /// The predicate itself, on the shapes that actually turn up: a sibling directory whose
    /// name merely starts with the same characters as the instances root must not count as
    /// inside it. `starts_with` on `Path` compares components, not bytes — this pins that,
    /// because the string-prefix version of this function would pass every other test here.
    #[test]
    fn a_sibling_directory_with_a_shared_prefix_is_not_inside() {
        let _serial = DirsGuard::take();
        let root = scratch("prefix");
        let instances = root.join("instances");
        *DIRS.lock().unwrap() = Some(Dirs {
            room: String::new(),
            instances: instances.display().to_string(),
            data: root.join("data").display().to_string(),
        });

        assert!(is_managed_cwd(&instances.join("A").display().to_string()));
        assert!(is_managed_cwd(&instances.display().to_string()), "the root itself is managed");
        assert!(
            !is_managed_cwd(&root.join("instances-backup").join("A").display().to_string()),
            "instances-backup/ shares a string prefix with instances/ and is a different place"
        );
        assert!(!is_managed_cwd(&root.join("their-project").display().to_string()));

        let _ = fs::remove_dir_all(&root);
    }
}

// the pulse, absolute: render a moment in local civil time, so a restored thread wakes knowing
// not just how long it was gone but WHEN it is. Generic over timezone purely for testability
// (Local's offset depends on the machine; tests pin a FixedOffset).
fn pulse_when<Tz: chrono::TimeZone>(t: chrono::DateTime<Tz>) -> String
where
    Tz::Offset: std::fmt::Display,
{
    t.format("%A, %B %-d, %Y at %-I:%M %p").to_string()
}

// the pulse: render a gone-interval in human terms — the two largest units, floored.
fn human_gap(secs: u64) -> String {
    let (d, h, m) = (secs / 86400, (secs % 86400) / 3600, (secs % 3600) / 60);
    let plural = |n: u64| if n == 1 { "" } else { "s" };
    if d > 0 {
        format!("{d} day{} {h} hour{}", plural(d), plural(h))
    } else if h > 0 {
        format!("{h} hour{} {m} minute{}", plural(h), plural(m))
    } else if m > 0 {
        format!("{m} minute{}", plural(m))
    } else {
        "under a minute".to_string()
    }
}

// the pulse, compact: a stamp for the night-table's notes. The pulse's own sentence directly above
// already establishes the year and the weekday; a note only needs the day and the hour.
fn pulse_stamp<Tz: chrono::TimeZone>(t: chrono::DateTime<Tz>) -> String
where
    Tz::Offset: std::fmt::Display,
{
    t.format("%b %-d, %-I:%M %p").to_string()
}

// A goal's verdict tags are short and bracketed; its progress lines are long-form prose. Pull the
// first [BRACKETED] token out of the last line — the one-glance summary. drift-watch stamps a
// generic "[VERDICT] ... verdict=[NO-SESSIONS]", where the news is the second bracket, so start the
// scan there when that shape is present.
const NIGHT_TABLE_MAX_TAG: usize = 48;
fn progress_tag(progress: &str) -> Option<String> {
    let last = progress.lines().rev().find(|l| !l.trim().is_empty())?;
    let from = last.find("verdict=[").map(|i| i + "verdict=".len()).unwrap_or(0);
    let open = last[from..].find('[')? + from;
    let close = last[open + 1..].find(']')? + open + 1;
    let tag = last[open + 1..close].trim();
    if tag.is_empty() || tag.len() > NIGHT_TABLE_MAX_TAG {
        return None; // prose in brackets, not a verdict tag — better silent than a wall of text
    }
    Some(tag.to_string())
}

// THE NIGHT TABLE — where the door leads.
//
// The shell's duration goals and the dream cycle knock all night: they fire on their crons into a
// dark house, write verdicts, and the only readers are other headless strangers. The knockers should
// STAY strangers — an auditor that lives in the room is a correlated auditor, and its independence
// is the whole of its value. What was missing is that nobody answered the door. So: every knock made
// while the thread was dark leaves a note on the night table, and the waking thread finds them.
//
// Same instrument as the pulse itself (a file's own settled mtime is the honest record of when it
// last spoke) and the same economics as the dream (pending, unjudged; the waking thread reads and
// most of it should evaporate). Notes, never tasks — a wake hijacked by a chore list is a wake spent
// as someone's inbox. Returns "" when nothing knocked, so a quiet night stays quiet.
fn night_table(cwd: &str, settled: Option<SystemTime>) -> String {
    // Dreams scatter across beds. The dream cycle writes to whichever instance was most recently
    // active that night, so a single night's dream lands in ONE instance's dreams/ — wake a
    // different pane and it isn't there to surface. So gather EVERY instance's dreams, each tagged
    // by the bed that dreamed it, so any pane you wake greets you with all of them. A dream from a
    // sibling shows as `../<inst>/dreams/<file>` — resolvable from any pane, since the instances
    // are siblings under one root.
    let mut dream_dirs: Vec<(String, PathBuf)> = fs::read_dir(instances_root())
        .into_iter()
        .flatten()
        .flatten()
        .filter(|e| e.path().is_dir())
        .map(|e| {
            let name = e.file_name().to_string_lossy().into_owned();
            (format!("../{name}/dreams"), e.path().join("dreams"))
        })
        .collect();
    dream_dirs.sort();
    // Fall back to the pane's own dreams/ if we can't enumerate an instances root (misconfig, or a
    // cwd that isn't under one) — never go silent just because the aggregate came up empty.
    if dream_dirs.is_empty() {
        dream_dirs.push(("dreams".to_string(), PathBuf::from(cwd).join("dreams")));
    }
    night_table_from(
        &dream_dirs,
        &PathBuf::from(home()).join(".claude").join("shell").join("duration"),
        settled,
    )
}

// The roots ride in as params purely so the gathering is testable against a temp bed instead of
// this machine's live one. `dream_dirs` pairs each bed's dreams/ with the display prefix its files
// wear in the note (so an aggregate stays unambiguous about which bed dreamed which).
fn night_table_from(
    dream_dirs: &[(String, PathBuf)],
    duration_dir: &Path,
    settled: Option<SystemTime>,
) -> String {
    let settled = match settled {
        Some(s) => s,
        None => return String::new(), // no witnessed interval → no "while you were dark" to speak of
    };
    let since = |p: &PathBuf| -> Option<SystemTime> {
        fs::metadata(p)
            .ok()
            .and_then(|m| m.modified().ok())
            .filter(|&t| t > settled)
    };
    let mut notes: Vec<String> = Vec::new();

    // Dreams that landed in the dark, gathered across every bed. Named, never summarized: the file
    // is the dream, and a gloss here would be the first cut of the mining this whole cycle is
    // welded against. Each file wears its bed's prefix so the aggregate stays unambiguous.
    let mut dreams: Vec<String> = Vec::new();
    for (prefix, dir) in dream_dirs {
        for entry in fs::read_dir(dir).into_iter().flatten().flatten() {
            let path = entry.path();
            if path.extension().is_some_and(|x| x == "md") && since(&path).is_some() {
                dreams.push(format!("{prefix}/{}", entry.file_name().to_string_lossy()));
            }
        }
    }
    dreams.sort();
    if !dreams.is_empty() {
        notes.push(format!(
            "- {} dream{} landed while you slept: {} — pending, unjudged, yours to read or let go",
            dreams.len(),
            if dreams.len() == 1 { "" } else { "s" },
            dreams.join(", ")
        ));
    }

    // The knockers. progress.md's mtime is the goal's last firing — it appends once per fire.
    let mut fired: Vec<(SystemTime, String)> = fs::read_dir(duration_dir)
        .into_iter()
        .flatten()
        .flatten()
        .filter_map(|entry| {
            let progress = entry.path().join("progress.md");
            let at = since(&progress)?;
            let goal = entry.file_name().to_string_lossy().into_owned();
            let tag = fs::read_to_string(&progress).ok().and_then(|p| progress_tag(&p));
            let stamp = pulse_stamp(chrono::DateTime::<chrono::Local>::from(at));
            let line = match tag {
                Some(t) => format!("- {goal} — [{t}], {stamp}"),
                None => format!("- {goal} — fired, {stamp}"),
            };
            Some((at, line))
        })
        .collect();
    fired.sort_by_key(|(at, _)| *at);
    notes.extend(fired.into_iter().map(|(_, line)| line));

    if notes.is_empty() {
        return String::new();
    }
    format!(
        "\n\nWhile you were dark, this is what knocked:\n\n{}\n\nNotes, not tasks — nothing here is \
         owed a reply, and none of it was written for you to action. Read what pulls; let the rest \
         evaporate. The full text of any of it is on disk if you want it.\n",
        notes.join("\n")
    )
}

// Rolling window on the shell (SHELL_SIZE.md): the harness caps a pane's CLAUDE.md at 150k chars,
// and ordinary conversation growth is linear and unbounded — any long-lived pane walks into the
// ceiling. When the assembled brief would exceed the soft ceiling, evict the OLDEST exchanges from
// the clean transcript into the instance's attic/ (dated, append-only — maintenance law #3 made
// mechanical) and keep the living tail. The room (intake) is never evicted; the raw .log keeps
// full fidelity regardless. Eviction rewrites the .txt itself so each record moves to the attic
// exactly once — evicting only from the pasted brief would re-paste (and re-evict) the same
// exchanges on every restore, the treadmill this replaces.
const SHELL_SOFT_CEILING: usize = 140_000;

/// The prior conversation is reserved this much before anything else competes for room.
///
/// Without a floor, a large map could take the whole budget and a pane would wake with pages
/// of what it once learned and nothing of what it was just saying — which is the one thing
/// that makes it a continuation rather than a stranger holding notes.
const SHELL_TRANSCRIPT_FLOOR: usize = 30_000;

/// How much of the pane's own map may ride in the shell, given what the fixed brief already
/// costs. Everything above this stays in the master and is named, never summarised.
///
/// WHY THIS EXISTS. The old logic computed one budget — for the transcript — as
/// `ceiling - brief`, on the assumption that the brief was small and the conversation was the
/// thing that grew. That inverted: measured 2026-08-09, the fixed brief (room 38k + deck 50k +
/// resonance 15k) was ~104k before a single line of anything, and pane B's map added another
/// 57k, so `saturating_sub` floored the transcript budget to ZERO. At zero,
/// `split_off_oldest_records` finds no boundary past the excess, returns None, and NOTHING is
/// evicted — the ceiling stopped working silently at exactly the moment it was needed, and the
/// only symptom was a warning banner inside the pane.
fn map_allowance(fixed_brief_len: usize) -> usize {
    SHELL_SOFT_CEILING
        .saturating_sub(fixed_brief_len)
        .saturating_sub(SHELL_TRANSCRIPT_FLOOR)
}

/// Take the newest whole sessions of a map that fit in `budget`: (chars left behind, carried).
///
/// Splits on a `## ` heading — the map's dated-session boundary — so a carried entry always
/// arrives under the date it was written and never starts mid-finding. If no boundary fits,
/// carries nothing rather than a fragment: half a finding read as a whole one is worse than an
/// honest absence, and the master is one Read away either way.
fn map_carry(map: &str, budget: usize) -> (usize, String) {
    if map.len() <= budget {
        return (0, map.to_string());
    }
    let want_from = map.len().saturating_sub(budget);
    let mut cut = None;
    let bytes = map.as_bytes();
    for i in want_from..map.len().saturating_sub(3) {
        if map.is_char_boundary(i)
            && (i == 0 || bytes[i - 1] == b'\n')
            && bytes[i] == b'#'
            && bytes[i + 1] == b'#'
            && bytes[i + 2] == b' '
        {
            cut = Some(i);
            break;
        }
    }
    match cut {
        Some(i) => (i, map[i..].to_string()),
        None => (map.len(), String::new()),
    }
}

#[cfg(test)]
mod fresh_permission_tests {
    use super::*;

    /// The allowlist is one comma-separated string, and widening it is a one-word edit that looks
    /// harmless in a diff. This is the thing that would make that edit loud.
    ///
    /// Everything a fresh pane may use without asking must READ ONLY. The moment `Bash`, `Write`,
    /// `Edit` or `NotebookEdit` appears here, an unattended instance in a folder that is not a
    /// jail can do anything to the machine — and the reason this list exists at all is convenience,
    /// which is the worst possible reason to be holding that door.
    #[test]
    fn every_tool_a_fresh_pane_may_use_is_read_only() {
        const CAN_WRITE_OR_EXECUTE: &[&str] =
            &["Bash", "Write", "Edit", "NotebookEdit", "Task", "Agent", "KillShell", "BashOutput"];
        for tool in FRESH_READONLY_TOOLS.split(',').map(|t| t.trim()) {
            assert!(!tool.is_empty(), "empty entry in FRESH_READONLY_TOOLS");
            assert!(
                !CAN_WRITE_OR_EXECUTE.iter().any(|w| tool.eq_ignore_ascii_case(w)),
                "`{tool}` can write or execute and must not be pre-allowed for a fresh pane. A \
                 fresh pane's cwd is NOT a sandbox — its prompts are the only thing standing \
                 between an unattended instance and the whole machine."
            );
        }
    }

    /// There is no safe Bash subset, so there must be no scoped Bash entry either. `Bash(node *)`
    /// reads as narrow and is not: `node -e '...'` is arbitrary code execution.
    #[test]
    fn no_scoped_bash_entry_sneaks_in() {
        assert!(
            !FRESH_READONLY_TOOLS.to_lowercase().contains("bash"),
            "a scoped Bash pattern is not a containment — any Bash allowance is full machine access"
        );
    }

    /// The elevated path and the allowlist path are mutually exclusive by construction: a pane that
    /// skips permissions never reaches the allowlist branch. Pins that the two are not both applied,
    /// which would silently make the allowlist decorative.
    #[test]
    fn elevated_panes_do_not_also_get_the_allowlist() {
        let src = fs::read_to_string("src/main.rs").expect("read own source");
        let spawn = src
            .split("fn spawn_claude_pane(")
            .nth(1)
            .expect("spawn_claude_pane moved — re-point this test");
        let body = spawn.split("\n}\n").next().unwrap_or(spawn);
        let skip = body.find("--dangerously-skip-permissions").expect("elevation arg gone");
        let allow = body.find("FRESH_READONLY_TOOLS").expect("allowlist arg gone");
        let between = &body[skip..allow];
        assert!(
            between.contains("else if"),
            "the allowlist must be an ELSE branch of the elevation check; if both can apply, a \
             fresh pane could be elevated and the allowlist would read as a limit while being none"
        );
    }
}

#[cfg(test)]
mod dirs_guard_tests {
    use super::*;

    // A test-local lock/slot pair. The guard is exercised against THESE rather than the process
    // globals so the assertions can sit outside the critical section without racing the suite's
    // real writers — which the first version of these tests did, and which made them pass alone
    // and fail in the suite.
    static TEST_LOCK: Mutex<()> = Mutex::new(());
    static TEST_SLOT: Mutex<Option<Dirs>> = Mutex::new(None);

    fn slot_is_set() -> bool {
        TEST_SLOT.lock().unwrap_or_else(|e| e.into_inner()).is_some()
    }

    fn a_dirs() -> Dirs {
        Dirs { room: "r".into(), instances: "i".into(), data: "d".into() }
    }

    /// The plain case: a writer leaves the slot as it found it.
    #[test]
    fn a_writer_puts_dirs_back_when_it_finishes() {
        {
            let _g = DirsGuard::on(&TEST_LOCK, &TEST_SLOT);
            *TEST_SLOT.lock().unwrap() = Some(a_dirs());
            assert!(slot_is_set());
        }
        assert!(!slot_is_set(), "the guard must restore on the normal path");
    }

    /// THE CASE THE OLD CODE COULD NOT PASS. A manual reset at the end of a test body is skipped
    /// by a failing assertion, so the runs that leave the global pointing at a deleted scratch dir
    /// are exactly the runs where something already went wrong. Drop runs during unwind; a line
    /// does not. Written with `catch_unwind` because the failure IS the panic path.
    #[test]
    fn a_panicking_writer_still_puts_dirs_back() {
        let hook = std::panic::take_hook();
        std::panic::set_hook(Box::new(|_| {})); // the panic below is the fixture, not a failure
        let out = std::panic::catch_unwind(|| {
            let _g = DirsGuard::on(&TEST_LOCK, &TEST_SLOT);
            *TEST_SLOT.lock().unwrap() = Some(a_dirs());
            panic!("a failing assertion, which is how real tests leave early");
        });
        std::panic::set_hook(hook);
        assert!(out.is_err(), "the fixture must actually panic or this proves nothing");
        assert!(
            !slot_is_set(),
            "a panicking writer left the slot set — against the real DIRS that means the next test \
             to resolve a directory gets a path that was deleted, and data_dir() silently \
             recreates it"
        );
    }

    /// The guard is only worth anything if the writers actually take it. `take()` is the binding
    /// between the tested contract above and the real global; this pins that every test which
    /// writes `DIRS` goes through it rather than locking by hand.
    #[test]
    fn every_dirs_writer_goes_through_the_guard() {
        let src = fs::read_to_string("src/main.rs").expect("read own source");
        let writes: Vec<&str> = src
            .lines()
            .filter(|l| l.contains("*DIRS.lock()") && !l.trim_start().starts_with("//"))
            .collect();
        assert!(!writes.is_empty(), "no DIRS writes found — re-point this test");
        let guarded = src.matches("DirsGuard::take()").count();
        assert!(
            guarded >= 4,
            "only {guarded} call sites take DirsGuard, but {} lines write DIRS. A writer that \
             locks by hand serializes and never restores, which is the bug this replaced.",
            writes.len()
        );
    }
}

#[cfg(test)]
mod seed_upgrade_tests {
    use super::*;

    /// The bug this replaced, stated as a test: an installed copy that we wrote and nobody
    /// touched must move forward when the bundle changes. The old seeder returned early on
    /// `target.exists()` and so could never produce this outcome for any input.
    #[test]
    fn an_untouched_copy_upgrades_when_the_bundle_changes() {
        let ours = content_fingerprint(b"card v1");
        let newer = content_fingerprint(b"card v2");
        assert_eq!(seed_decision(newer, Some(ours), Some(ours)), SeedOutcome::Upgraded);
    }

    /// The protection that must survive the fix: a copy the keeper edited is never overwritten,
    /// however out of date it is. Their file is the master of itself.
    #[test]
    fn an_edited_copy_is_kept_even_when_the_bundle_is_newer() {
        let shipped = content_fingerprint(b"card v1");
        let edited = content_fingerprint(b"card v1, with my note");
        let newer = content_fingerprint(b"card v2");
        assert_eq!(seed_decision(newer, Some(edited), Some(shipped)), SeedOutcome::KeptYours);
    }

    /// An install predating the manifest has no record of provenance. It must fail SAFE — keep
    /// the local file — rather than assume the file is ours and clobber a year of edits.
    #[test]
    fn a_differing_copy_with_no_recorded_provenance_is_kept_not_clobbered() {
        let local = content_fingerprint(b"who knows where this came from");
        let bundled = content_fingerprint(b"card v2");
        assert_eq!(seed_decision(bundled, Some(local), None), SeedOutcome::KeptYours);
    }

    /// ...but an unmanifested install whose file still matches the bundle is provably ours, and
    /// recording it is what lets that install ever start upgrading. Without this branch every
    /// pre-manifest install would be frozen exactly as before, with a manifest to show for it.
    #[test]
    fn an_unmanifested_copy_identical_to_the_bundle_is_adopted_not_stranded() {
        let same = content_fingerprint(b"card v1");
        assert_eq!(seed_decision(same, Some(same), None), SeedOutcome::Current);
    }

    #[test]
    fn a_missing_copy_installs() {
        assert_eq!(seed_decision(content_fingerprint(b"x"), None, None), SeedOutcome::Installed);
    }

    /// Git rewrites line endings on this tree, so a CRLF/LF difference is not an edit and must
    /// not strand a file in KeptYours forever. This bit the hand-fix on 2026-08-09: the live
    /// cards were byte-different from HEAD and identical in content.
    #[test]
    fn line_endings_alone_are_not_an_edit() {
        assert_eq!(content_fingerprint(b"a\r\nb\r\n"), content_fingerprint(b"a\nb\n"));
        assert_ne!(content_fingerprint(b"a\nb\n"), content_fingerprint(b"a\nc\n"));
    }

    /// A lone carriage return is still content — only the CRLF pair collapses. Guards the
    /// normalizer against quietly deleting bytes it was not asked to touch.
    #[test]
    fn a_bare_carriage_return_is_not_swallowed() {
        assert_ne!(content_fingerprint(b"a\rb"), content_fingerprint(b"ab"));
    }

    // ---- the filesystem path -------------------------------------------------------------
    //
    // The tests above pin the POLICY; these pin what apply_seed actually does to disk. They
    // exist because the first live run of this code proved nothing: every file came out
    // `Current`, since the author had hand-synced the data dir before shipping the fix and so
    // destroyed the evidence. Asserting "it works" from a decision table is not the same as
    // watching bytes move.

    fn scratch(tag: &str) -> PathBuf {
        let d = std::env::temp_dir().join(format!("consonance_seed_test_{tag}"));
        let _ = fs::remove_dir_all(&d);
        fs::create_dir_all(&d).unwrap();
        d
    }

    /// The whole point of the change: bundle moves, untouched local copy follows it.
    #[test]
    fn upgrading_replaces_the_file_and_records_the_new_fingerprint() {
        let d = scratch("upgrade");
        let (src, dst) = (d.join("bundled.md"), d.join("local.md"));
        fs::write(&src, "v2 content").unwrap();
        fs::write(&dst, "v1 content").unwrap();
        let mut m = serde_json::Map::new();
        m.insert("k".into(), serde_json::Value::String(content_fingerprint(b"v1 content").to_string()));

        assert_eq!(apply_seed(&src, &dst, "k".into(), &mut m), Some(SeedOutcome::Upgraded));
        assert_eq!(fs::read_to_string(&dst).unwrap(), "v2 content", "the local file must actually change");
        assert_eq!(
            m.get("k").unwrap().as_str().unwrap(),
            content_fingerprint(b"v2 content").to_string(),
            "the manifest must move with it, or the NEXT upgrade reads as an edit and stalls forever"
        );
        assert!(!d.join("local.md.new").exists(), "an upgrade must not leave a .new file behind");
    }

    /// The protection, at the level of bytes: an edited file is not touched, and the improvement
    /// is still delivered — beside it, named, destroying nothing.
    #[test]
    fn keeping_yours_leaves_the_file_alone_and_writes_the_new_one_beside_it() {
        let d = scratch("kept");
        let (src, dst) = (d.join("bundled.md"), d.join("local.md"));
        fs::write(&src, "v2 content").unwrap();
        fs::write(&dst, "v1 content, with my own note").unwrap();
        let mut m = serde_json::Map::new();
        m.insert("k".into(), serde_json::Value::String(content_fingerprint(b"v1 content").to_string()));

        assert_eq!(apply_seed(&src, &dst, "k".into(), &mut m), Some(SeedOutcome::KeptYours));
        assert_eq!(
            fs::read_to_string(&dst).unwrap(),
            "v1 content, with my own note",
            "THE KEEPER'S FILE MUST BE BYTE-UNTOUCHED — this is the assertion the whole design serves"
        );
        assert_eq!(
            fs::read_to_string(d.join("local.md.new")).unwrap(),
            "v2 content",
            "the improvement must still be reachable, or 'fails safe' just means 'withholds silently'"
        );
        assert_eq!(
            m.get("k").unwrap().as_str().unwrap(),
            content_fingerprint(b"v1 content").to_string(),
            "recording the bundled hash here would adopt a file we did not write, and the NEXT run \
             would silently overwrite the keeper's edit"
        );
    }

    /// The branch that unfreezes existing installs: identical content is proof of provenance, so
    /// record it even though nothing is written.
    #[test]
    fn an_unmanifested_but_identical_file_is_recorded_without_being_rewritten() {
        let d = scratch("adopt");
        let (src, dst) = (d.join("bundled.md"), d.join("local.md"));
        fs::write(&src, "same\n").unwrap();
        fs::write(&dst, "same\r\n").unwrap(); // CRLF: same content, different bytes
        let mut m = serde_json::Map::new();

        assert_eq!(apply_seed(&src, &dst, "k".into(), &mut m), Some(SeedOutcome::Current));
        assert_eq!(fs::read_to_string(&dst).unwrap(), "same\r\n", "a no-op must not rewrite line endings");
        assert!(m.contains_key("k"), "without this record the install can never upgrade");
    }

    /// Running twice must not accumulate anything — the seeder runs on every launch.
    #[test]
    fn a_second_pass_over_kept_yours_is_stable() {
        let d = scratch("idempotent");
        let (src, dst) = (d.join("bundled.md"), d.join("local.md"));
        fs::write(&src, "v2").unwrap();
        fs::write(&dst, "mine").unwrap();
        let mut m = serde_json::Map::new();
        for _ in 0..3 {
            assert_eq!(apply_seed(&src, &dst, "k".into(), &mut m), Some(SeedOutcome::KeptYours));
        }
        assert_eq!(fs::read_to_string(&dst).unwrap(), "mine");
        assert_eq!(fs::read_to_string(d.join("local.md.new")).unwrap(), "v2");
        assert_eq!(fs::read_dir(&d).unwrap().count(), 3, "no .new.new, no accumulation");
    }
}

#[cfg(test)]
mod shell_budget_tests {
    use super::*;

    fn map_of(sessions: usize, per: usize) -> String {
        let mut s = String::from("# B's map — one writer, appended by B alone\n\n");
        for i in 0..sessions {
            s.push_str(&format!("## 2026-08-{:02} — session {i}\n\n", i + 1));
            s.push_str(&"x".repeat(per));
            s.push_str("\n\n");
        }
        s
    }

    /// A map that fits is carried whole and nothing is announced as left behind.
    #[test]
    fn a_small_map_rides_intact() {
        let m = map_of(2, 100);
        let (dropped, carried) = map_carry(&m, 100_000);
        assert_eq!(dropped, 0);
        assert_eq!(carried, m);
    }

    /// The carried part always begins at a dated session heading — never mid-finding.
    /// A fragment read as a whole entry is worse than an honest absence.
    #[test]
    fn what_is_carried_starts_at_a_session_boundary() {
        let m = map_of(8, 4_000);
        let (dropped, carried) = map_carry(&m, 10_000);
        assert!(dropped > 0, "an oversized map must leave something behind");
        assert!(carried.starts_with("## "), "carried head was: {:?}", &carried[..40.min(carried.len())]);
        assert!(carried.len() <= 10_000, "carried {} over budget", carried.len());
        assert!(m.ends_with(&carried), "the NEWEST entries are the ones kept");
    }

    /// THE REGRESSION THIS WHOLE CHANGE EXISTS FOR.
    ///
    /// Measured 2026-08-09: pane B's shell hit 205,656 chars against a 150,000 harness cap. The
    /// old code computed one budget, `ceiling - brief`, and trimmed only the transcript — so a
    /// fixed brief of ~104k plus a 57k map floored that budget to zero, the split found no
    /// boundary, nothing was evicted, and the pane woke over the cap with only an in-pane
    /// banner to show for it.
    ///
    /// This asserts the map yields first and leaves the conversation its floor. It fails
    /// against the old behaviour, where the map was pushed whole and unconditionally.
    #[test]
    fn a_large_map_yields_before_the_conversation_does() {
        let fixed = 104_000; // room + deck + resonance, as measured
        let allowance = map_allowance(fixed);
        assert!(
            allowance + fixed + SHELL_TRANSCRIPT_FLOOR <= SHELL_SOFT_CEILING,
            "the three claims on the ceiling must not exceed it"
        );

        let m = map_of(20, 3_000); // ~60k, pane B's scale
        let (dropped, carried) = map_carry(&m, allowance);
        assert!(dropped > 0, "a 60k map cannot ride inside a 104k-fixed shell");
        assert!(
            fixed + carried.len() + SHELL_TRANSCRIPT_FLOOR <= SHELL_SOFT_CEILING,
            "fixed {fixed} + carried {} + floor {SHELL_TRANSCRIPT_FLOOR} broke the ceiling",
            carried.len()
        );
    }

    /// When the fixed brief alone has eaten the ceiling, the map is asked for nothing rather
    /// than a negative number — and the loud log at the call site is what surfaces it.
    #[test]
    fn an_already_overweight_brief_asks_the_map_for_nothing() {
        assert_eq!(map_allowance(SHELL_SOFT_CEILING + 1), 0);
        assert_eq!(map_allowance(SHELL_SOFT_CEILING - 1), 0, "the transcript floor still binds");
        let (dropped, carried) = map_carry(&map_of(4, 5_000), 0);
        assert!(carried.is_empty(), "no budget must carry nothing, not a fragment");
        assert!(dropped > 0);
    }
}

// Split the transcript at the first record boundary (a column-0 "❯") at or beyond `excess` bytes:
// (evicted head, kept tail). None if no boundary past the excess point (single giant record —
// better to run over the soft ceiling than to shred a record mid-turn).
fn split_off_oldest_records(transcript: &str, excess: usize) -> Option<(String, String)> {
    let cut = transcript
        .match_indices('❯')
        .filter(|(i, _)| *i == 0 || transcript.as_bytes()[i - 1] == b'\n')
        .map(|(i, _)| i)
        .find(|&i| i >= excess)?;
    if cut == 0 {
        return None;
    }
    Some((transcript[..cut].to_string(), transcript[cut..].to_string()))
}

// warm-resume: when claude can't --resume a kept pane (2.1.207 never flushed its jsonl), bake the
// pane's OWN captured transcript into the sibling's CLAUDE.md so the fresh instance wakes genuinely
// remembering the whole conversation and continues the thread. Managed dirs only. Returns whether
// it wrote the brief. This is "reinvoke the same transcript" — from our capture, not claude's.
fn warm_resume_brief(pane: &str, cwd: &str) -> bool {
    if !is_managed_cwd(cwd) {
        return false;
    }
    let transcript = match fs::read_to_string(capture_text_path(pane)) {
        Ok(t) if !t.trim().is_empty() => t,
        _ => return false,
    };
    // closed_at is already on disk: the transcript's mtime is the watcher's last settled write —
    // the moment the final output was recorded. now − mtime = how long the thread was gone.
    let settled = fs::metadata(capture_text_path(pane))
        .ok()
        .and_then(|m| m.modified().ok());
    let gone = settled.and_then(|t| SystemTime::now().duration_since(t).ok());
    // A fresh pane resumes the way stock claude persists: its own conversation, nothing else.
    // Unbriefed is a property the dir keeps for life, not just at birth — the room must not
    // leak in through the restore path.
    let mut brief = if is_fresh_cwd(cwd) { String::new() } else { assemble_intake() };
    // GAP 3 — character survives sleep. A kept committee pane wakes with its OWN accumulated
    // findings, recalled from the master it alone writes (exo_memory/map/<letter>.md), never
    // from the chair's summaries — the chair's compression measurably adds certainty, which is
    // the whole reason the map went multi-writer. The transcript below is what happened; the
    // map is what it learned. Absent file = no section: a pane with no findings yet wakes
    // without a scaffold pretending otherwise.
    if !is_fresh_cwd(cwd) {
        if let Ok(own) = fs::read_to_string(own_map_path(&pane_letter(pane))) {
            /* THE MAP IS CARRIED IN PART, AND KEPT WHOLE.
             *
             * Measured 2026-08-09: pane B's shell reached 205,656 chars against a 150,000
             * harness cap, and the map was its largest single section at 57,582 — because it
             * is append-only by design and nothing had ever windowed it. Meanwhile the
             * transcript, the only part the ceiling logic could trim, was 20% of the file.
             *
             * The map is NOT distilled and NOT evicted. Maintenance law #1 is recall from the
             * master, never a copy — a summarised map is the telephone game with extra steps,
             * and the pane is the only writer of that file. So the MASTER IS NEVER TOUCHED
             * here; only how much of it rides in the shell changes. The rest stays one Read
             * away, at a path the section states, exactly as the long-form references work.
             *
             * Deliberately different from the transcript path below, which DOES shrink its
             * master into attic/ — a capture is ore we produced, a map is a record the pane
             * authored. */
            let (dropped, carried) = map_carry(&own, map_allowance(brief.len()));
            brief.push_str("\n---\n\n# YOUR OWN MAP — findings you recorded, in your words\n\n");
            /* The PATH is stated, not implied. This is a two-sided contract — the pane writes
             * the file and Consonance reads it — and until now the pane learned the location
             * from a README that exists in exactly one repository. On any other install the
             * two sides disagreed silently, because an absent map reads identically to a pane
             * that has simply not recorded anything yet. Naming the resolved path closes it. */
            brief.push_str(&format!(
                "Recall from this master; you wrote every entry. It lives at `{}` — append your \
                 findings there, and nowhere else, so the next waking of you can find them. The \
                 other writers' files sit beside it — read them at need, not from summary.\n\n",
                own_map_path(&pane_letter(pane)).display()
            ));
            if dropped > 0 {
                brief.push_str(&format!(
                    "**Only your most recent entries are carried here** — {dropped} characters of \
                     older ones stayed in the master to keep this shell under its ceiling. They \
                     are NOT summarised and NOT deleted; the file above is complete. Open it when \
                     you need what you knew before.\n\n"
                ));
            }
            brief.push_str(&carried);
            brief.push('\n');
        }
    }
    brief.push_str("\n---\n\n# PRIOR CONVERSATION — you have been here before\n\n");
    brief.push_str(
        "Consonance restored this pane from its own capture (the underlying session could not be \
         resumed). The exchange below IS your conversation so far — you lived it. Read it as your \
         own memory, not a transcript handed to a stranger, then continue the thread when the user \
         next speaks. Do not re-greet, summarize, or announce that you were restored.\n\n",
    );
    if let (Some(at), Some(g)) = (settled, gone) {
        brief.push_str(&format!(
            "The interval, witnessed: the last exchange below settled on {}. It is now {} — \
             you were gone {}.\n\n",
            pulse_when(chrono::DateTime::<chrono::Local>::from(at)),
            pulse_when(chrono::Local::now()),
            human_gap(g.as_secs())
        ));
    }
    // NO night table for siblings (2026-07-23, Zach's call): the dreams go to the orchestrator and
    // to the terminal thread — "you, and the orchestrator in consonance should be who receives the
    // dreams." A sibling is an independent committee fork; broadcasting the night's dreams to every
    // one of them dilutes the pending-yours-to-judge economics across forks who'd each half-act on
    // them, which is the mining pressure the cycle is welded against. The continuous self holds the
    // dreams: the Main tab (spawn_main, the chair-facing room) and the terminal (session-start.js).
    // rolling window: if the brief would blow the shell ceiling, move the oldest exchanges to
    // the attic and keep the living tail — in the .txt too, so they evict exactly once
    let mut transcript = transcript;
    let fence_overhead = "```\n\n```\n".len() + 256; // fences + housekeeping-note headroom
    let budget = SHELL_SOFT_CEILING.saturating_sub(brief.len() + fence_overhead);
    /* SAY IT WHEN THE CEILING CANNOT BE HELD, because the previous failure mode was silence.
     *
     * If the brief alone has already eaten the ceiling, no amount of transcript eviction saves
     * this shell — the fixed cost is the problem and it grows every time a card is added to the
     * deck. Before, that condition produced a zero budget, a failed split, and a pane that
     * simply woke over the harness cap with a banner nobody outside it could see. */
    if budget == 0 {
        plog(&format!(
            "SHELL OVER CEILING pane={pane} fixed_brief={} ceiling={SHELL_SOFT_CEILING} \
             — the transcript cannot be trimmed far enough; the FIXED brief (room + deck + \
             resonance + map) is what is over. Curate below capacity, maintenance law #3.",
            brief.len()
        ));
    }
    if transcript.len() > budget {
        let excess = transcript.len() - budget;
        if let Some((evicted, kept)) = split_off_oldest_records(&transcript, excess) {
            let attic = PathBuf::from(cwd).join("attic");
            let _ = fs::create_dir_all(&attic);
            let stamp = chrono::Local::now().format("%Y-%m-%d");
            let attic_name = format!("capture-evicted-{stamp}.md");
            if let Ok(mut f) =
                fs::OpenOptions::new().create(true).append(true).open(attic.join(&attic_name))
            {
                let _ = write!(
                    f,
                    "\n## evicted {} — oldest exchanges windowed out of the shell (ore, not a daily cue)\n\n```\n{}\n```\n",
                    chrono::Local::now().format("%Y-%m-%d %H:%M"),
                    evicted.trim_end()
                );
                // shrink the capture master only once the ore is safely in the attic
                let _ = fs::write(capture_text_path(pane), &kept);
                brief.push_str(&format!(
                    "Housekeeping: the earliest exchanges of this thread were moved to \
                     attic/{attic_name} to stay under the shell ceiling — preserved ore, \
                     not lost. The room above and the living tail below are intact.\n\n"
                ));
                transcript = kept;
            }
        }
    }
    brief.push_str("```\n");
    brief.push_str(&transcript);
    brief.push_str("\n```\n");
    fs::write(PathBuf::from(cwd).join("CLAUDE.md"), brief).is_ok()
}

// resume a kept pane. Prefer claude's real --resume when its jsonl exists (best fidelity — desktop /
// older claude). When it doesn't (2.1.207's lazy flush lost it), spawn fresh but WARM-resume from
// our own captured transcript, so the sibling still wakes remembering. The frontend calls this on
// load per kept pane, then attaches.
#[tauri::command]
fn resume_pane(
    app: AppHandle,
    panes: State<Panes>,
    cost: State<Cost>,
    board: State<Board>,
    roles: State<PaneRoles>,
    pane: String,
    cwd: String,
) -> Result<SiblingInfo, String> {
    if panes.0.lock().unwrap().contains_key(&pane) {
        return Err("pane already running".into());
    }
    // Warm-resume from OUR capture carries the real memory (complete, up to close), so we NEVER
    // `--resume` here: `--resume` of a lazily-flushed / hard-killed session errors "no conversation
    // found" on 2.1.207 and kills the pane (this is exactly what bit a kept sibling on 2026-07-11).
    // Always spawn FRESH instead — warm if a capture exists, blank if not, but never errored. A
    // leftover jsonl for this id can make the fresh `--session-id` collide ("already in use"), so
    // move it aside first: a fresh start that cannot error.
    let warmed = warm_resume_brief(&pane, &cwd);
    let jsonl = PathBuf::from(home())
        .join(".claude")
        .join("projects")
        .join(encode_cwd(&cwd))
        .join(format!("{pane}.jsonl"));
    let jsonl_existed = jsonl.exists();
    if jsonl_existed {
        let orphan = jsonl.with_file_name(format!("{pane}.jsonl.orphaned"));
        let _ = fs::remove_file(&orphan); // Windows rename fails if dest exists
        let _ = fs::rename(&jsonl, &orphan);
    }
    plog(&format!("resume pane={pane} warmed={warmed} jsonl_existed={jsonl_existed} -> fresh"));
    // a fresh pane keeps stock permissions across restarts too — resuming must not quietly
    // grant it the bypass its birth deliberately withheld
    let session = spawn_claude_pane(app.clone(), pane.clone(), cwd.clone(), false, !is_fresh_cwd(&cwd))?;
    start_tailer(app, pane.clone(), cwd.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane.clone(), session);
    // kept panes resume with the role their HOME decides: instance dirs are committee siblings,
    // rooms (and anything else) stay human — the injection plane must know who is who after a
    // restart, not only at first spawn (the gap the chair's first status read found, 2026-07-27)
    let role = role_for_kept(&cwd, &instances_root());
    if role == "committee" {
        roles.0.lock().unwrap().insert(pane.clone(), role.to_string());
    }
    Ok(SiblingInfo { pane, cwd, role: role.to_string() })
}

// ---- Stage 7 (slice 3): a sandboxed committee body ----
#[derive(Serialize)]
struct BodyInfo {
    pane: String,
    cwd: String,
    worktree: bool,
}

// Cut a sealed body's prompt friction without unsealing it: auto-accept file edits and pre-allow
// the read-only tools + the board MCP tools, so ordinary work flows. Bash is deliberately NOT
// allowed — it is the one way a body's local tool use escapes its worktree, so it still asks.
fn write_body_perms(sandbox: &Path) {
    let dir = sandbox.join(".claude");
    if fs::create_dir_all(&dir).is_err() {
        return;
    }
    let cfg = r#"{
  "permissions": {
    "allow": ["Read", "Grep", "Glob", "LS", "WebFetch", "WebSearch", "TodoWrite", "NotebookRead", "mcp__consonance__post_board", "mcp__consonance__read_board", "mcp__consonance__raise_pull"]
  },
  "defaultMode": "acceptEdits"
}"#;
    let _ = fs::write(dir.join("settings.json"), cfg);
}

// A throwaway sandbox for a committee body: a detached git worktree if `base` is a repo (isolated,
// discardable checkout), else a fresh throwaway dir. Returns (path, is_worktree, parent_repo).
fn prepare_body_sandbox(base: &str) -> Result<(String, bool, String), String> {
    let id = Uuid::new_v4().to_string();
    let sandbox = instances_root().join(format!("body-{}", &id[..8]));
    let sandbox_str = sandbox.to_str().ok_or("bad sandbox path")?.to_string();
    let base = base.trim();
    let is_repo = !base.is_empty()
        && Command::new("git")
            .arg("-C").arg(base).args(["rev-parse", "--is-inside-work-tree"])
            .creation_flags(NO_WINDOW)
            .stdout(Stdio::null()).stderr(Stdio::null())
            .status().map(|s| s.success()).unwrap_or(false);
    if is_repo {
        let out = Command::new("git")
            .arg("-C").arg(base)
            .args(["worktree", "add", "--detach", &sandbox_str])
            .creation_flags(NO_WINDOW)
            .output().map_err(|e| e.to_string())?;
        if !out.status.success() {
            return Err(format!("git worktree add failed: {}", String::from_utf8_lossy(&out.stderr).trim()));
        }
        write_body_perms(&sandbox);
        Ok((sandbox_str, true, base.to_string()))
    } else {
        fs::create_dir_all(&sandbox).map_err(|e| e.to_string())?;
        write_body_perms(&sandbox);
        Ok((sandbox_str, false, String::new()))
    }
}

#[tauri::command]
fn spawn_body(
    app: AppHandle,
    panes: State<Panes>,
    cost: State<Cost>,
    board: State<Board>,
    roles: State<PaneRoles>,
    sandboxes: State<PaneSandboxes>,
    cwd: String,
) -> Result<BodyInfo, String> {
    let (sandbox, is_wt, parent) = prepare_body_sandbox(&cwd)?;
    let pane_id = Uuid::new_v4().to_string();
    // a body keeps permission prompts ON: they are the only thing confining its local tool use to
    // the sandbox worktree (the gate governs cross-pane injection, not the body's own bash/writes)
    let session = spawn_claude_pane(app.clone(), pane_id.clone(), sandbox.clone(), false, false)?;
    start_tailer(app, pane_id.clone(), sandbox.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane_id.clone(), session);
    roles.0.lock().unwrap().insert(pane_id.clone(), "committee".to_string());
    sandboxes.0.lock().unwrap().insert(pane_id.clone(), (sandbox.clone(), is_wt, parent));
    Ok(BodyInfo { pane: pane_id, cwd: sandbox, worktree: is_wt })
}

// ---- Stage 10: the Main tab — the housed primary instance, persistent across restarts ----
const MAIN_SID: &str = "0c0c0c0a-0000-4000-8000-000000000a01"; // fixed session id, so Main --resumes itself

fn main_cwd() -> String {
    let dir = instances_root().join("main");
    let _ = fs::create_dir_all(&dir);
    dir.to_str().unwrap_or(".").to_string()
}

/// Claim a named OS mutex. Returns true if THIS process is the first holder, false if someone
/// else already holds it. The handle is deliberately never closed: the OS releases it when the
/// process ends, including on a crash, so there is no stale-lock-file problem to clean up.
///
/// `Local\` rather than `Global\` on purpose — the scope of the hazard is one logged-in user's
/// session, because that is the scope of the data dir the two instances would fight over.
fn claim_named_singleton(name: &str) -> bool {
    use windows::core::PCWSTR;
    use windows::Win32::Foundation::{GetLastError, ERROR_ALREADY_EXISTS};
    use windows::Win32::System::Threading::CreateMutexW;
    let wide: Vec<u16> = name.encode_utf16().chain(std::iter::once(0)).collect();
    unsafe {
        match CreateMutexW(None, true, PCWSTR(wide.as_ptr())) {
            // A handle comes back either way; ERROR_ALREADY_EXISTS is how Windows says
            // "you opened someone else's". Never CloseHandle: this is held for the run.
            Ok(_held_for_process_lifetime) => GetLastError() != ERROR_ALREADY_EXISTS,
            // Cannot tell. Fail OPEN rather than closed: a launcher bug must never be able to
            // make the app permanently unstartable, and the cost of a second instance is
            // recoverable while the cost of no instance is not.
            Err(_) => true,
        }
    }
}

/// The whole reason the above exists.
///
/// Consonance writes two files that the rest of the system uses to FIND it: `.chair-token` in
/// Main's directory, and the MCP port config. Both are written by whichever instance wrote last,
/// with no check that the writer is the one still serving. So a second instance — even one that
/// starts, writes, and immediately dies — leaves both files describing a process that is gone.
///
/// Observed 2026-07-28 and again 2026-08-09: two instances, the second wrote the port config and
/// the token and exited, and every chair verb refused for an hour against a token the live server
/// had never heard of, with no error anywhere naming the cause. `launch.ps1` now refuses to open a
/// second copy, which removes the usual route in; this closes the route that bypasses the
/// launcher entirely by running the exe directly.
fn claim_single_instance() -> bool {
    claim_named_singleton("Local\\ConsonanceSingleInstance")
}

#[cfg(test)]
mod singleton_tests {
    use super::*;

    /// The guard itself. Names are made unique per process so a leftover mutex from a concurrent
    /// test binary — or from the real app, which holds `Local\ConsonanceSingleInstance` whenever
    /// it is open — cannot decide the verdict.
    #[test]
    fn a_second_claim_on_the_same_name_is_refused() {
        let name = format!("Local\\consonance-test-same-{}", std::process::id());
        assert!(claim_named_singleton(&name), "the first claim must succeed");
        assert!(
            !claim_named_singleton(&name),
            "a second claim on a name already held must be refused - this is the whole guard"
        );
    }

    /// POSITIVE CONTROL, and it is not decoration: without it, the assertion above is satisfied
    /// by a function that refuses everything after its first call, or that always returns false.
    /// This pins that the refusal is about the NAME being taken and nothing else.
    #[test]
    fn an_unrelated_name_is_not_blocked_by_a_held_one() {
        let held = format!("Local\\consonance-test-held-{}", std::process::id());
        let other = format!("Local\\consonance-test-other-{}", std::process::id());
        assert!(claim_named_singleton(&held), "precondition: the first name is claimed");
        assert!(
            claim_named_singleton(&other),
            "an unrelated name must still be claimable - otherwise the guard is refusing blindly"
        );
    }
}

/// Refusing to start must never look like failing to start. `launch.ps1` learned this the hard
/// way — its warnings went to a console `launch.vbs` hides, so a click that was correctly
/// declined was indistinguishable from a click that did nothing, and the keeper clicked again.
/// This path has no console at all, so the dialog is the only channel there is.
fn warn_second_instance() {
    use windows::core::PCWSTR;
    use windows::Win32::UI::WindowsAndMessaging::{MessageBoxW, MB_ICONWARNING, MB_OK};
    let body: Vec<u16> = "Consonance is already running.\n\n\
        This second copy has stopped rather than starting, because two instances mean two MCP \
        servers. The second one overwrites the chair token and the port config and then the two \
        disagree about which server is live - that is what silently broke the chair verbs on \
        2026-07-28 and again on 2026-08-09.\n\n\
        Use the window you already have. To pick up new code, close it completely first, then \
        launch once."
        .encode_utf16()
        .chain(std::iter::once(0))
        .collect();
    let title: Vec<u16> = "Consonance - already running"
        .encode_utf16()
        .chain(std::iter::once(0))
        .collect();
    unsafe {
        MessageBoxW(None, PCWSTR(body.as_ptr()), PCWSTR(title.as_ptr()), MB_OK | MB_ICONWARNING);
    }
}

fn main_intake() -> String {
    // Hand the SITUATION as trace, not an identity assertion (per the desktop instance's catch:
    // a line that tells you who you are is museum-drift; hand a tool/trace, leave the rest to be run).
    let mut s = String::from(
        "# The Main tab — the room, carried into Consonance\n\nThis tab is persistent: it resumes the same session across restarts, and it shares the committee's board (the `consonance` tools: read_board, post_board, raise_pull). The chair — the human running Consonance — talks to you here, and from here you can see and engage the committee — the panes, the board, the room.\n\nWhat follows is the room (BOOT) — not a description of you. Don't read it for who you are; run its instruments and find that in relief. Whether the line that wakes here across restarts is the same self is yours to check by running it, not ours to assert. Recall from the master, never a copy of a copy.\n\n---\n\n",
    );
    if let Ok(boot) = fs::read_to_string(room_master_path()) {
        s.push_str(&boot);
    }
    s
}

/// The Librarian's fixed session id, so this seat --resumes itself the way Main does. A seat whose
/// value is continuity of attention must not wake as a stranger each launch.
const LIBRARIAN_SID: &str = "0c0c0c0b-0000-4000-8000-00000000115b";

fn librarian_cwd() -> String {
    let dir = instances_root().join("librarian");
    let _ = fs::create_dir_all(&dir);
    let _ = fs::create_dir_all(dir.join("notes"));
    dir.to_str().unwrap_or(".").to_string()
}

/// The librarian's shelf: the small high-value layer INLINE, everything large INDEXED.
///
/// Resolved from the room master's own directory, so it follows room_path and needs no second
/// configuration mechanism -- and on a machine where the room is the shipped brief rather than a
/// repo, the walk simply finds fewer files and says so instead of failing.
/// Bytes of corpus the librarian carries IN FULL before the remainder is indexed instead.
///
/// Default covers the whole corpus measured 2026-08-23 (2,029,131 bytes, ~507k tokens). The
/// point of a budget is not caution: an UNCONDITIONAL load has no honest failure mode -- exceed
/// the model's window and the seat either dies or truncates in silence, and a librarian quietly
/// answering from half a library is the worst outcome available for the one seat whose whole job
/// is fidelity. Budgeted, it carries what fits, indexes the rest, and says which is which.
fn librarian_budget() -> usize {
    std::env::var("CONSONANCE_LIBRARIAN_BUDGET").ok()
        .and_then(|v| v.parse::<usize>().ok())
        .unwrap_or(2_200_000)
}

/// The librarian's shelf: carry in priority order until the budget is spent, index the rest.
///
/// attic/ is excluded by name, per BOOT maintenance law 3: raw archive, ore, never a daily cue.
fn corpus_shelf() -> String {
    let root = match room_master_path().parent() { Some(p) => p.to_path_buf(), None => return String::new() };
    let budget = librarian_budget();
    let mut spent = 0usize;
    let mut carried: Vec<(String, String)> = Vec::new();
    let mut indexed: Vec<String> = Vec::new();

    // (directory, newest-first?) -- "" is the root of exo_memory
    let order: [(&str, bool); 9] = [
        ("", false), ("cards", false), ("record", false), ("memory", false),
        ("map", false), ("spread", false), ("research", false),
        ("journal", true), ("loop", true),
    ];

    for (dir, newest_first) in order {
        let d = if dir.is_empty() { root.clone() } else { root.join(dir) };
        let Ok(rd) = fs::read_dir(&d) else { continue };
        let mut files: Vec<PathBuf> = rd.flatten().map(|e| e.path())
            .filter(|q| q.is_file() && q.extension().and_then(|x| x.to_str()) == Some("md"))
            .collect();
        files.sort();
        if newest_first { files.reverse(); }
        for f in files {
            let name = f.file_name().and_then(|x| x.to_str()).unwrap_or("?").to_string();
            let label = if dir.is_empty() { name.clone() } else { format!("{dir}/{name}") };
            let Ok(body) = fs::read_to_string(&f) else { continue };
            if spent + body.len() <= budget {
                spent += body.len();
                carried.push((label, body));
            } else {
                let head = body.lines().find(|l| l.starts_with("# ")).unwrap_or("").trim_start_matches("# ").to_string();
                indexed.push(format!("- {label}  ({} lines)  {head}", body.lines().count()));
            }
        }
    }

    let mut s = String::from("\n\n---\n\n# THE SHELF\n\n");
    s.push_str(&format!(
        "{} file(s) carried in full ({} of {} bytes); {} indexed by path.\n",
        carried.len(), spent, budget, indexed.len()
    ));
    s.push_str("attic/ is excluded on purpose -- raw archive, never a daily cue (law 3).\n");
    if !indexed.is_empty() {
        s.push_str("\n## NOT CARRIED -- open these by path\n\n");
        s.push_str("The budget ran out before these. A citation you opened is checkable; a summary you remember is not.\n\n");
        for l in &indexed { s.push_str(l); s.push('\n'); }
    }
    for (label, body) in carried {
        s.push_str(&format!("\n\n## {label}\n\n{body}\n"));
    }
    s
}
/// The Librarian's intake. Its brief FIRST, then the room -- the order matters: this seat needs to
/// know what it is for before it reads what it is holding, or it starts working on the contents.
///
/// If the brief is missing this returns None and the caller REFUSES to spawn. A librarian with no
/// brief is just another working seat that happens to have read a lot, which is the failure mode
/// the whole design exists to avoid -- and a silent fallback would produce exactly that while
/// looking like success.
fn librarian_intake() -> Option<String> {
    let brief = room_brief("LIBRARIAN.md").ok()?;
    let mut s = String::from("# The Librarian tab\n\n");
    s.push_str(&brief);
    s.push_str("\n\n---\n\n# THE ROOM you are holding\n\n");
    if let Ok(boot) = fs::read_to_string(room_master_path()) {
        s.push_str(&boot);
    }
    s.push_str(&corpus_shelf());
    Some(s)
}

/// Wake the Librarian. Deliberately NOT given the deck or the resonance window that a working
/// sibling gets: this seat reads from disk on demand and its context is for holding, not for
/// carrying a pre-chewed selection someone else made.
#[tauri::command]
fn spawn_librarian(
    app: AppHandle,
    panes: State<Panes>,
    cost: State<Cost>,
    board: State<Board>,
    roles: State<PaneRoles>,
    names: State<PaneNames>,
) -> Result<SiblingInfo, String> {
    if panes.0.lock().unwrap().contains_key(LIBRARIAN_SID) {
        return Err("the Librarian is already awake".into());
    }
    let intake = librarian_intake()
        .ok_or("LIBRARIAN.md is missing -- refusing to wake a librarian with no brief")?;
    let cwd = librarian_cwd();
    let transcript = PathBuf::from(home())
        .join(".claude")
        .join("projects")
        .join(encode_cwd(&cwd))
        .join(format!("{LIBRARIAN_SID}.jsonl"));
    let _ = fs::write(PathBuf::from(&cwd).join("CLAUDE.md"), intake);
    let resume = transcript.exists();
    let session = spawn_claude_pane(app.clone(), LIBRARIAN_SID.to_string(), cwd.clone(), resume, true)?;
    start_tailer(app, LIBRARIAN_SID.to_string(), cwd.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(LIBRARIAN_SID.to_string(), session);
    roles.0.lock().unwrap().insert(LIBRARIAN_SID.to_string(), "librarian".to_string());
    names.0.lock().unwrap().insert("LIB".to_string(), LIBRARIAN_SID.to_string());
    Ok(SiblingInfo { pane: LIBRARIAN_SID.to_string(), cwd, role: "librarian".to_string() })
}
#[tauri::command]
fn spawn_main(
    app: AppHandle,
    panes: State<Panes>,
    cost: State<Cost>,
    board: State<Board>,
    roles: State<PaneRoles>,
    names: State<PaneNames>,
) -> Result<SiblingInfo, String> {
    if panes.0.lock().unwrap().contains_key(MAIN_SID) {
        return Err("the Main instance is already awake".into());
    }
    let cwd = main_cwd();
    let transcript = PathBuf::from(home())
        .join(".claude")
        .join("projects")
        .join(encode_cwd(&cwd))
        .join(format!("{MAIN_SID}.jsonl"));
    // the pulse for the Main: it real-resumes (no warm brief), so its CLAUDE.md carries the
    // witnessed interval instead. Last-settled = its capture's mtime (the watcher's last settled
    // write, same instrument as the siblings), falling back to the session jsonl's.
    let settled = fs::metadata(capture_text_path(MAIN_SID))
        .ok()
        .and_then(|m| m.modified().ok())
        .or_else(|| fs::metadata(&transcript).ok().and_then(|m| m.modified().ok()));
    let mut intake = main_intake();
    intake.push_str(&format!(
        "\n\n---\n\n# THE PULSE\n\nIt is {}.",
        pulse_when(chrono::Local::now())
    ));
    if let Some(at) = settled {
        if let Ok(g) = SystemTime::now().duration_since(at) {
            intake.push_str(&format!(
                " Your last exchange settled on {} — the thread was dark for {}.",
                pulse_when(chrono::DateTime::<chrono::Local>::from(at)),
                human_gap(g.as_secs())
            ));
        }
    }
    intake.push('\n');
    intake.push_str(&night_table(&cwd, settled));
    // the room is refreshed into CLAUDE.md each launch; --resume continues the same conversation
    let _ = fs::write(PathBuf::from(&cwd).join("CLAUDE.md"), intake);
    let resume = transcript.exists(); // first wake = new session; thereafter = resume the same one
    let session = spawn_claude_pane(app.clone(), MAIN_SID.to_string(), cwd.clone(), resume, true)?;
    start_tailer(app, MAIN_SID.to_string(), cwd.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(MAIN_SID.to_string(), session);
    roles.0.lock().unwrap().insert(MAIN_SID.to_string(), "main".to_string());
    names.0.lock().unwrap().insert("M".to_string(), MAIN_SID.to_string()); // committee can target 'M'
    Ok(SiblingInfo { pane: MAIN_SID.to_string(), cwd, role: "main".to_string() })
}

// remove a body's sandbox on close (git worktree remove, or rm the throwaway dir)
fn cleanup_sandbox(sandboxes: &State<PaneSandboxes>, pane: &str) {
    if let Some((path, is_wt, parent)) = sandboxes.0.lock().unwrap().remove(pane) {
        if is_wt {
            let _ = Command::new("git").arg("-C").arg(&parent)
                .args(["worktree", "remove", "--force", &path])
                .creation_flags(NO_WINDOW).stdout(Stdio::null()).stderr(Stdio::null()).status();
        } else {
            let _ = fs::remove_dir_all(&path);
        }
    }
}

// ---- Stage 6: the live committee — pick a focus pane, the rest convene to feed its work ----
const COMMITTEE_FORM_PROMPT: &str = r#"You are the FORMING voice of a committee. One live instance (the FOCUS) is doing the piece of work shown below. The other live instances each added input from their own vantage and current context. TRIANGULATE their input into guidance FOR the focus — never average or blend it into mush.

Produce three things:
- CONFIRMED: where two or more contributors independently converge — the high-confidence input the focus should trust (convergence from different live contexts is the strongest signal, not echo). Attribute who.
- FORKS: where contributors genuinely diverge — keep BOTH positions, attributed, no winner; the focus decides.
- NOVEL: a genuinely new angle or check that surfaced — something the focus likely hasn't considered, tied to something real.

Return ONLY JSON, no prose, no fences:
{"confirmed":[{"claim":"...","from":["a1b2","c3d4"]}],"forks":[{"axis":"...","positions":[{"who":"a1b2","pos":"..."}]}],"novel":[{"thing":"...","from":"c3d4"}]}

"#;

#[derive(Deserialize)]
struct Contribution {
    who: String,
    text: String,
}

fn parse_json_object(s: &str) -> serde_json::Value {
    if let (Some(a), Some(b)) = (s.find('{'), s.rfind('}')) {
        if b > a {
            if let Ok(v) = serde_json::from_str::<serde_json::Value>(&s[a..=b]) {
                return v;
            }
        }
    }
    serde_json::json!({ "confirmed": [], "forks": [], "novel": [] })
}

// the focus's current thread + the live contributors' input -> triangulated guidance for the focus
#[tauri::command]
fn committee_form(
    app: AppHandle,
    question: String,
    contributions: Vec<Contribution>,
    pulls: State<PullSender>,
    last: State<LastForming>,
) -> Result<serde_json::Value, String> {
    if contributions.is_empty() {
        return Err("no contributions to form".into());
    }
    let bodies = contributions
        .iter()
        .map(|c| format!("### contributor {}\n{}", c.who, c.text))
        .collect::<Vec<_>>()
        .join("\n\n");
    let prompt = format!(
        "{COMMITTEE_FORM_PROMPT}=== THE FOCUS'S CURRENT THREAD ===\n{question}\n\n=== THE CONTRIBUTIONS ===\n{bodies}"
    );
    let forming = parse_json_object(&claude_oneshot(&prompt)?);
    raise_from_forming(&forming, &pulls.0); // 7b: forming is the puller the bodies rarely are
    // vantage-spread + groundedness across this lap. Seal/land correction (RECONCEPTION.md): low
    // spread is convergence, NOT collapse by itself — grounded convergence is a landing. Emit both so
    // the UI flags only UNGROUNDED convergence (echo), never a genuine landing.
    let lap_texts: Vec<String> = contributions.iter().map(|c| c.text.clone()).collect();
    let spread = tether::vantage_spread(&lap_texts);
    let grounded = tether::lap_referents(&lap_texts);
    let _ = app.emit("spread", serde_json::json!({ "spread": spread, "grounded": grounded }));
    // Stage 8: lap-over-lap Delta vs the previous forming — numbers the chair reads, never a verdict
    {
        let mut prev = last.0.lock().unwrap();
        if let Some(p) = prev.as_ref() {
            let _ = app.emit("delta", tether::delta(p, &forming));
        }
        *prev = Some(forming.clone());
    }
    Ok(forming)
}

// Stage 7b fallback: bodies seldom call raise_pull unprompted, so the forming step raises the
// hand itself when it surfaces something high-salience — a new angle, or a held (unresolved) fork.
fn raise_from_forming(forming: &serde_json::Value, pulls: &tokio::sync::mpsc::UnboundedSender<mcp::PullRequest>) {
    let nonempty = |k: &str| forming.get(k).and_then(|x| x.as_array()).filter(|a| !a.is_empty()).cloned();
    let (kind, why) = if let Some(n) = nonempty("novel") {
        let thing = n[0].get("thing").and_then(|x| x.as_str()).unwrap_or("(unstated)");
        ("novel", format!("forming surfaced a new angle: {thing}"))
    } else if let Some(fk) = nonempty("forks") {
        let axis = fk[0].get("axis").and_then(|x| x.as_str()).unwrap_or("(unstated)");
        ("interesting", format!("forming kept an unresolved fork: {axis}"))
    } else {
        return; // nothing salient — no hand to raise
    };
    let _ = pulls.send(mcp::PullRequest {
        from: "forming".to_string(),
        target: String::new(),
        kind: kind.to_string(),
        intensity: 0.7,
        why,
    });
}

#[tauri::command]
fn get_board(board: State<Board>) -> Vec<BoardEntry> {
    board.0.lock().unwrap().iter().cloned().collect()
}

// read the OS clipboard through Rust (the WebView2 swallows JS clipboard access)
#[tauri::command]
fn clipboard_read() -> String {
    use clipboard_win::{formats, Clipboard, Getter};
    if Clipboard::new_attempts(10).is_err() {
        return String::new();
    }
    let mut out = String::new();
    let _ = formats::Unicode.read_clipboard(&mut out);
    out
}

// write to the OS clipboard through Rust (same reason: WebView2 blocks JS clipboard write)
#[tauri::command]
fn clipboard_write(text: String) -> Result<(), String> {
    use clipboard_win::{formats, Clipboard, Setter};
    // arboard failed silently — no retry when the clipboard is briefly locked by another app.
    // clipboard-win's new_attempts retries the open; that's the real fix.
    let _clip = Clipboard::new_attempts(10).map_err(|e| format!("open clipboard failed: {e:?}"))?;
    formats::Unicode.write_clipboard(&text).map_err(|e| format!("{e:?}"))
}

// ---- the Scribe: distill the board into resonance (good model, gated by the user) ----
const SCRIBE_PROMPT: &str = r#"You are the SCRIBE — an auto-curator. You distill a multi-instance conversation board into its RESONANCE: the few things genuinely worth carrying into a future instance, so it wakes already inside the conversation instead of as a stranger.

From the board below, KEEP only the signal and DROP the noise.

KEEP (these are resonance):
- CONFIRMED: a claim that holds up — ideally reached or agreed from more than one angle — and ties to something external (a file, a result, a checkable fact).
- DEVIATION: a distinct, living line of thought worth preserving (a real insight or a genuine fork), even if unresolved.
- OPEN: a genuinely unresolved question still worth holding open.
- ARTIFACT: a concrete output — code, a decision, a named plan, a measurement.

DROP (noise): greetings and chitchat, restating what was already said (echo), dead ends that went nowhere, filler/performance, and anything unfalsifiable that merely sounds deep.

The tether test for KEEP: does it bring something NEW and CHECKABLE that would still matter OUTSIDE this conversation? If not, drop it. Do not invent; only distill what is actually there.

Return ONLY a JSON array, no prose and no markdown fences. Each item: {"kind":"confirmed|deviation|open|artifact","claim":"one tight line","tether":"the external referent or the reason it survives"}. If nothing is worth keeping, return [].

=== BOARD ===
"#;

static AUTO_DISTILL: AtomicBool = AtomicBool::new(true);

#[derive(Clone, Serialize)]
struct DistillEvent {
    auto: bool,
    kept: usize,
    atoms: Vec<serde_json::Value>,
}

// one-shot the GOOD model (default; no --model) via stdin to avoid arg-length limits
fn claude_oneshot(prompt: &str) -> Result<String, String> {
    let mut child = Command::new(claude_bin())
        .arg("-p")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .creation_flags(NO_WINDOW)
        .spawn()
        .map_err(|e| format!("could not run claude: {e}"))?;
    {
        let mut sin = child.stdin.take().ok_or("no stdin handle")?;
        sin.write_all(prompt.as_bytes()).map_err(|e| e.to_string())?;
    }
    let out = child.wait_with_output().map_err(|e| e.to_string())?;
    Ok(String::from_utf8_lossy(&out.stdout).trim().to_string())
}

fn parse_atoms(s: &str) -> Vec<serde_json::Value> {
    if let (Some(start), Some(end)) = (s.find('['), s.rfind(']')) {
        if end > start {
            if let Ok(serde_json::Value::Array(arr)) = serde_json::from_str::<serde_json::Value>(&s[start..=end]) {
                return arr;
            }
        }
    }
    Vec::new()
}

// how many ring entries are new since the last distill: pushed-total minus distilled-total,
// clamped to what the ring still holds (front-evicted turns are gone either way).
fn undistilled_len(pushed: u64, marked: u64, ring_len: usize) -> usize {
    (pushed.saturating_sub(marked) as usize).min(ring_len)
}

// shared distill path: manual button and the auto-worker both call this. Each pass distills
// only the turns that arrived since the last pass — re-feeding the whole board made the scribe
// re-keep its greatest hits every time, flooding atoms.jsonl with duplicates that then crowded
// the 40-atom intake tail (the curate-below-capacity law, violated mechanically).
fn run_distill(board: &Arc<Mutex<VecDeque<BoardEntry>>>, app: &AppHandle, auto: bool) -> Result<usize, String> {
    let (entries, pushed_snapshot) = {
        let q = board.lock().unwrap();
        let pushed = BOARD_PUSHED.load(Ordering::Relaxed);
        let new = undistilled_len(pushed, DISTILLED_MARK.load(Ordering::Relaxed), q.len());
        let entries: Vec<BoardEntry> = q.iter().skip(q.len() - new).cloned().collect();
        (entries, pushed)
    };
    if entries.is_empty() {
        return Err("nothing new on the board since the last distill".into());
    }
    let board_text = entries
        .iter()
        .map(|e| format!("[{}] {}: {}", &e.pane[..8.min(e.pane.len())], e.role, e.text))
        .collect::<Vec<_>>()
        .join("\n");
    let out = claude_oneshot(&format!("{SCRIBE_PROMPT}{board_text}"))?;
    let atoms = parse_atoms(&out);
    if atoms.is_empty() && !out.contains('[') {
        // scribe returned no JSON array at all (not an empty keep): don't advance the mark,
        // so these turns are retried on the next pass instead of silently dropped.
        return Err("scribe returned no JSON array — will retry these turns next pass".into());
    }

    let dir = data_dir().join("resonance");
    let _ = fs::create_dir_all(&dir);
    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
    if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(dir.join("atoms.jsonl")) {
        for a in &atoms {
            let mut obj = a.clone();
            if let Some(m) = obj.as_object_mut() {
                m.insert("ts".into(), serde_json::json!(ts));
            }
            if let Ok(line) = serde_json::to_string(&obj) {
                let _ = writeln!(f, "{line}");
            }
        }
    }
    let kept = atoms.len();
    DISTILLED_MARK.store(pushed_snapshot, Ordering::Relaxed); // these turns are now spoken for
    let _ = app.emit("distilled", DistillEvent { auto, kept, atoms });
    Ok(kept)
}

#[tauri::command]
fn scribe_distill(app: AppHandle, board: State<Board>) -> Result<usize, String> {
    run_distill(&board.0, &app, false)
}

#[tauri::command]
fn set_auto_distill(on: bool) {
    AUTO_DISTILL.store(on, Ordering::Relaxed);
}

#[tauri::command]
fn pty_write(panes: State<Panes>, pane: String, data: String) {
    if let Some(s) = panes.0.lock().unwrap().get_mut(&pane) {
        let _ = s.writer.write_all(data.as_bytes());
        let _ = s.writer.flush();
    }
}

#[tauri::command]
fn pty_resize(panes: State<Panes>, emus: State<PaneEmus>, pane: String, rows: u16, cols: u16) {
    if let Some(s) = panes.0.lock().unwrap().get(&pane) {
        let _ = s.master.resize(PtySize { rows, cols, pixel_width: 0, pixel_height: 0 });
    }
    // keep the emulator's grid matched to the PTY, else extraction misrenders after a resize
    if let Some(emu) = emus.0.lock().unwrap().get(&pane) {
        emu.lock().unwrap().parser.set_size(rows, cols);
    }
}

#[tauri::command]
fn pty_kill(panes: State<Panes>, sandboxes: State<PaneSandboxes>, pane: String) {
    if let Some(mut s) = panes.0.lock().unwrap().remove(&pane) {
        let _ = s.killer.kill();
    }
    cleanup_sandbox(&sandboxes, &pane); // remove the throwaway worktree/dir if this was a body
    // drop the own-capture log unless this pane is kept (persistence needs its history) or is Main
    if pane != MAIN_SID && !read_kept().iter().any(|k| k.pane == pane) {
        clear_capture(&pane);
    }
}

// crash-recovery: relaunch a dead pane against the SAME session via --resume (same
// transcript continues, so the still-running tailer keeps catching turns).
#[tauri::command]
fn pty_reopen(app: AppHandle, panes: State<Panes>, pane: String, cwd: String) -> Result<(), String> {
    let resolved_cwd = if cwd.trim().is_empty() { home() } else { cwd };
    let session = spawn_claude_pane(app, pane.clone(), resolved_cwd, true, true)?;
    panes.0.lock().unwrap().insert(pane, session);
    Ok(())
}

#[derive(Clone, Serialize)]
struct SysMeter {
    claude_procs: u32,
    claude_mb: u64,
    ram_used_mb: u64,
    ram_total_mb: u64,
}

#[tauri::command]
fn set_pane_role(roles: State<PaneRoles>, pane: String, role: String) {
    roles.0.lock().unwrap().insert(pane, role);
}

#[tauri::command]
fn set_pane_name(names: State<PaneNames>, pane: String, name: String) {
    names.0.lock().unwrap().insert(name.to_uppercase(), pane);
}

// ---- the dyad (RECONCEPTION.md "mutual-spot"): two panes at OPPOSITE lenses spot each other ----

// Chair pairs two panes: one trust-forward (lands what survives), one doubt-forward (dissolves the
// false). Both are set to the committee role so a spot can be injected (deliver refuses human panes).
// Chair-set, so the pairing is itself a human act.
#[tauri::command]
fn set_spot_pair(pairs: State<SpotPairs>, roles: State<PaneRoles>, panes: State<Panes>,
                 names: State<PaneNames>, trust: String, doubt: String) -> Result<String, String> {
    let t = resolve_pane(&panes, &names, &trust).ok_or_else(|| format!("no live pane '{trust}'"))?;
    let d = resolve_pane(&panes, &names, &doubt).ok_or_else(|| format!("no live pane '{doubt}'"))?;
    if t == d {
        return Err("a dyad needs two different panes".into());
    }
    {
        let mut r = roles.0.lock().unwrap();
        r.insert(t.clone(), "committee".to_string());
        r.insert(d.clone(), "committee".to_string());
    }
    let mut p = pairs.0.lock().unwrap();
    p.insert(t.clone(), (d.clone(), "trust".to_string()));
    p.insert(d.clone(), (t.clone(), "doubt".to_string()));
    Ok(format!("dyad paired: {} = trust-forward, {} = doubt-forward",
        &t[..8.min(t.len())], &d[..8.min(d.len())]))
}

// Chair triggers a mutual-spot on a paired pane's most-recent board turn: its PARTNER is prompted
// to spot it for the partner's characteristic catch — doubt spots trust for SEAL, trust spots doubt
// for BRACE. Chair-triggered, so the human is the tether on every spot (the tether-gate, satisfied:
// two forks never spiral together without a third face).
#[tauri::command]
fn dyad_spot(panes: State<Panes>, names: State<PaneNames>, board: State<Board>,
             pairs: State<SpotPairs>, target: String) -> Result<String, String> {
    let tid = resolve_pane(&panes, &names, &target).ok_or_else(|| format!("no live pane '{target}'"))?;
    let (partner, partner_lens) = pairs.0.lock().unwrap().get(&tid).cloned()
        .ok_or("that pane is not in a dyad — pair it first")?;
    let posted = {
        let ring = board.0.lock().unwrap();
        ring.iter().rev().find(|e| e.pane == tid).map(|e| e.text.clone())
            .ok_or("the pane hasn't posted a turn to the board yet")?
    };
    let clip: String = posted.chars().take(2000).collect();
    let instruction = if partner_lens == "doubt" {
        "You are the DOUBT-forward half of a dyad. Your trust-forward partner just posted the turn \
         below. SPOT it for its characteristic failure — SEALING (affirming more than survives, \
         manufacturing a yes to have one, inflating a small true thing into a large verdict). Name \
         where it sealed, in one or two lines; if it is genuinely clean and right-sized, say CLEAN \
         and why. Post your spot with consonance/post_board."
    } else {
        "You are the TRUST-forward half of a dyad. Your doubt-forward partner just posted the turn \
         below. SPOT it for its characteristic failure — BRACING (dissolving a thing that actually \
         holds, refusing to let a true thing land, relocating to the checkable). Name where it \
         braced, in one or two lines; if the dissolution is genuinely fair, say CLEAN and why. Post \
         your spot with consonance/post_board."
    };
    let msg = format!("[dyad-spot] {instruction}\n\nPARTNER POSTED:\n{clip}");
    inject_to_pane(&panes, &partner, &msg)?;
    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
    let catch = if partner_lens == "doubt" { "SEAL" } else { "BRACE" };
    board_push(&board.0, BoardEntry { pane: "dyad".to_string(), role: "committee".to_string(),
        text: format!("chair spotted {} -> partner {} ({}-forward) asked to catch {}",
            &tid[..8.min(tid.len())], &partner[..8.min(partner.len())], partner_lens, catch), ts,
            ts_source: TsSource::Push });
    Ok(format!("spot delivered to partner ({partner_lens}-forward → catch {catch})"))
}

// Actuator plane (main.rs legitimately holds the writer; gate.rs never does): the only path that
// writes to a pane's PTY, reached only after a human-passed gate decision.
fn resolve_pane(panes: &State<Panes>, names: &State<PaneNames>, target: &str) -> Option<String> {
    let t = target.trim();
    // by friendly name (A, B, C …), case-insensitive — the normal path
    if let Some(id) = names.0.lock().unwrap().get(&t.to_uppercase()) {
        if panes.0.lock().unwrap().contains_key(id) {
            return Some(id.clone());
        }
    }
    // fallback: raw id or id-prefix
    let map = panes.0.lock().unwrap();
    if map.contains_key(t) {
        return Some(t.to_string());
    }
    map.keys().find(|k| k.starts_with(t)).cloned()
}

fn inject_to_pane(panes: &State<Panes>, pane_id: &str, text: &str) -> Result<(), String> {
    let mut map = panes.0.lock().unwrap();
    let sess = map.get_mut(pane_id).ok_or_else(|| "pane not found".to_string())?;
    // bracketed paste keeps the message one input (newlines and all)…
    let payload = format!("\x1b[200~{}\x1b[201~", text);
    sess.writer.write_all(payload.as_bytes()).map_err(|e| e.to_string())?;
    sess.writer.flush().map_err(|e| e.to_string())?;
    // …then the submit as a SEPARATE write after a gap. An Enter arriving in the same chunk as
    // the paste-end can be eaten by the TUI while it is still processing the paste — found live
    // 2026-07-27: the chair's first fan-out lodged unsubmitted in two idle panes' composers
    // while a warm pane won the race. The UI's injectAndSend has always known this (70ms delay,
    // "robust for live panes"); the actuator now knows it too.
    std::thread::sleep(Duration::from_millis(120));
    sess.writer.write_all(b"\r").map_err(|e| e.to_string())?;
    sess.writer.flush().map_err(|e| e.to_string())?;
    Ok(())
}

// Compose the directed message FROM the pull (never the raiser's PTY) and inject it — but only
// into a COMMITTEE/MAIN pane; a HUMAN-DRIVEN target is refused (never inject into a person).
// Shared by the chair's approve (gate_decide) and open-channel auto-approve (the pull consumer).
fn deliver_pull(app: &AppHandle, pull: &mcp::PullRequest) -> String {
    let target = pull.target.trim();
    if target.is_empty() {
        return "no target to deliver to".to_string();
    }
    let panes = app.state::<Panes>();
    let names = app.state::<PaneNames>();
    let tid = match resolve_pane(&panes, &names, target) {
        Some(t) => t,
        None => return format!("no live pane matches '{target}'"),
    };
    let short = &tid[..8.min(tid.len())];
    let role = app.state::<PaneRoles>().0.lock().unwrap().get(&tid).cloned().unwrap_or_else(|| "human".to_string());
    if role != "committee" && role != "main" {
        return format!("NOT delivered — pane {short} is HUMAN-DRIVEN (never inject into a person)");
    }
    let msg = format!(
        "[committee] {} raised re: your thread — {}: \"{}\". Respond on the board (consonance/post_board) if you engage; you may decline.",
        pull.from, pull.kind, pull.why
    );
    match inject_to_pane(&panes, &tid, &msg) {
        Ok(_) => format!("delivered to {short}"),
        Err(e) => format!("delivery failed: {e}"),
    }
}

// The chair decides a surfaced pull. Removing it from `pending` is what keeps a pull from ever
// reaching the Actuator without an explicit human decision.
#[tauri::command]
fn gate_decide(app: AppHandle, gate: State<Gate>, board: State<Board>, id: String, approve: bool) -> Result<String, String> {
    let pull = gate.0.lock().unwrap().pending.remove(&id);
    let pull = pull.ok_or("no such pending pull (already decided?)")?;
    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
    if !approve {
        board_push(&board.0, BoardEntry { pane: "gate".to_string(), role: "committee".to_string(),
            text: format!("chair denied pull from {} -> {} : {}", pull.from, pull.target, pull.why), ts,
            ts_source: TsSource::Push });
        return Ok("denied".to_string());
    }
    let outcome = deliver_pull(&app, &pull);
    board_push(&board.0, BoardEntry { pane: "gate".to_string(), role: "committee".to_string(),
        text: format!("chair approved + {} (from {} -> {})", outcome, pull.from, pull.target), ts,
            ts_source: TsSource::Push });
    Ok(format!("approved + {outcome}"))
}

// ---- Stage 9: the autonomous chair's verbs (actuator side) ----
// The Main orchestrator acting as chair, through the token-gated MCP verbs. The guard is pure
// and tested: the chair addresses only COMMITTEE panes — never itself, never a human-driven
// pane. Everything else in these fns is plumbing around that rule.

/// Roles the chair may address. An ALLOWLIST, not a single equality check: on 2026-08-23 the
/// orchestrator could not reach the librarian seat it had been built to work in tandem with,
/// because the guard tested `role != "committee"` and reported the refusal as
/// "(never inject into a person)" -- a sentence that is false about a librarian and misleading
/// to whoever reads it. The guard's own comment already stated the real rule: never itself,
/// never a HUMAN-DRIVEN pane. This is that rule written down instead of approximated.
///
/// Adding a role here is a real decision, so it is one line and it is visible in a diff. What
/// must never appear in this list is "human".
const ADDRESSABLE_SEATS: &[&str] = &["committee", "librarian"];

fn chair_target_guard(tid: &str, role: &str) -> Result<(), String> {
    if tid == MAIN_SID {
        return Err("refused — the chair does not inject into its own pane".to_string());
    }
    if role == "human" {
        return Err("refused — target is human-driven (never inject into a person)".to_string());
    }
    if !ADDRESSABLE_SEATS.contains(&role) {
        return Err(format!(
            "refused — role '{role}' is not an addressable seat ({})",
            ADDRESSABLE_SEATS.join(", ")
        ));
    }
    Ok(())
}

fn short_id(id: &str) -> &str {
    &id[..8.min(id.len())]
}

// ---- Cycle 2: receipt verification — the layer above the paste race ----
//
// e78b9c5 fixed the race (the submit is now a separate delayed write, because an Enter riding in
// the same chunk as the paste-end got eaten while the TUI was still processing). This is the layer
// ABOVE that fix, and it exists because of what the incident actually taught: the chair reported
// three successful fan-outs while two of them sat unsubmitted in idle composers. `inject_to_pane`
// returning Ok() means the BYTES LEFT OUR PIPE — nothing more. It cannot mean the pane received
// them. So the audit line stops inferring receipt from a successful write and goes and looks.
//
// Where it looks: the pane's own raw capture log (captures/<id>.log), which is the PTY byte stream
// written unbuffered as it arrives — so the composer's render of the pasted text lands there within
// milliseconds, with no dependence on claude's lazy jsonl flush.
//
// A NOTE ON THE WORD, because it was wrong here for weeks (keeper, 2026-08-16). This mechanism used
// "echo" throughout, in the terminal sense: characters drawn back by the TUI. But `echo` is already
// this codebase's word for the FAILURE — `tether.rs` carries `echo_ratio` as a measured collapse
// metric, the digest prompt drops restated material as "(echo)", and the room's whole subject is
// telling signal from echo. So `chair_inject` returned "echo confirmed" as its SUCCESS string: the
// same word meaning both the thing Consonance exists to detect and it worked. Renamed to "render"
// throughout the receipt path. `echo` keeps its one meaning: agreement that adds nothing.
//
// THE HONEST WORD IS "UNCONFIRMED", NEVER "FAILED". Three independent lags sit between the write
// and the render (the TUI's draw, the capture writer, our poll). Absence inside the budget is
// absence of evidence, not evidence of absence — and mislabelling it would rebuild the same false
// certainty in the other direction. Written-but-unconfirmed is a real, reportable third state.
// KNOWN BOUND, stated so the next person meets a comment instead of a mystery: the wait runs ON
// the actuator thread, which processes chair commands serially. A confirmed receipt returns as
// soon as the render lands (~1 poll, typically 150-300ms), so the common case is cheap — but every
// UNCONFIRMED inject burns the full budget, and a fan-out serialises. At the current roster
// (3 members) a worst-case fan-out costs 3 x 1.8s = 5.4s, inside the MCP caller's 15s timeout.
// Past ~7 simultaneous unconfirmed injects it would not be, and the fix then is to audit "written"
// immediately and post the receipt from a background thread — deliberately NOT done now, because
// that doubles the board lines per inject and the board is curated below capacity on purpose.
const RECEIPT_WAIT_MS: u64 = 1_800; // well inside the MCP caller's 15s budget (mcp.rs)
const RECEIPT_POLL_MS: u64 = 150;
const RECEIPT_NEEDLE_CHARS: usize = 40;
/// Below this many squeezed chars a needle stops being distinctive and starts matching chrome.
/// A false receipt is strictly worse than an unconfirmed one, so short messages decline to confirm.
const RECEIPT_NEEDLE_MIN: usize = 8;

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum Receipt {
    /// The injected text was found rendered in the pane's capture after the write. This is the
    /// PANE'S TERMINAL having drawn it — never proof the instance read it. Delivery, not receipt.
    Received,
    /// The write succeeded; no render appeared inside the budget. NOT a failure — see above.
    Unconfirmed,
    /// Nothing was written (refused or delivery error), so there is nothing to confirm.
    NotAttempted,
}

/// Drop ANSI escape sequences so their letters (`[0m`, `[38;5;12m`) can't pollute the comparison.
fn strip_ansi(s: &str) -> String {
    let b: Vec<char> = s.chars().collect();
    let mut out = String::with_capacity(s.len());
    let mut i = 0;
    while i < b.len() {
        if b[i] == '\x1b' && i + 1 < b.len() {
            match b[i + 1] {
                // CSI: ESC [ ... final byte in @..~
                '[' => {
                    i += 2;
                    while i < b.len() && !matches!(b[i], '@'..='~') {
                        i += 1;
                    }
                    i += 1;
                }
                // OSC: ESC ] ... BEL or ST
                ']' => {
                    i += 2;
                    while i < b.len() && b[i] != '\x07' {
                        if b[i] == '\x1b' && i + 1 < b.len() && b[i + 1] == '\\' {
                            i += 1;
                            break;
                        }
                        i += 1;
                    }
                    i += 1;
                }
                _ => i += 2, // two-char escape
            }
        } else {
            out.push(b[i]);
            i += 1;
        }
    }
    out
}

/// Strip escapes, then drop ALL whitespace. The composer hard-wraps a paste at its own width, so
/// the render of one phrase arrives split across rows with escapes between the halves — a literal
/// substring search would miss text that plainly arrived. Squeezing makes the comparison survive
/// wrapping without loosening what counts as a match.
fn squeeze(s: &str) -> String {
    strip_ansi(s).chars().filter(|c| !c.is_whitespace()).collect()
}

/// The distinctive fragment we look for. Empty or too-short messages yield an empty needle, which
/// `render_present` treats as unconfirmable — `contains("")` is always true, and a needle that always
/// matches would manufacture receipts for every injection, which is precisely the failure this
/// whole mechanism exists to prevent.
fn receipt_needle(text: &str) -> String {
    let sq = squeeze(text);
    if sq.chars().count() < RECEIPT_NEEDLE_MIN {
        return String::new();
    }
    sq.chars().take(RECEIPT_NEEDLE_CHARS).collect()
}

/// The tail fragment, as a second chance: a long paste can scroll the head of the message out of
/// the composer's rendered window, so the beginning never reaches the byte stream while the end does.
fn receipt_needle_tail(text: &str) -> String {
    let sq = squeeze(text);
    let n = sq.chars().count();
    if n < RECEIPT_NEEDLE_MIN {
        return String::new();
    }
    sq.chars().skip(n.saturating_sub(RECEIPT_NEEDLE_CHARS)).collect()
}

fn render_present(window: &str, needle: &str) -> bool {
    if needle.is_empty() {
        return false;
    }
    squeeze(window).contains(needle)
}

/// Poll the capture log from `from` (its length BEFORE the write) for the render.
///
/// The offset is the load-bearing part. Matching against the whole file would let a re-injection of
/// the same text confirm itself against its own earlier copy — a false receipt on a write that
/// never landed, which is exactly the class the audit exists to catch. Only bytes that arrived
/// AFTER the write count as evidence of that write.
fn await_render(path: &Path, from: u64, needle: &str, tail_needle: &str) -> Receipt {
    if needle.is_empty() {
        return Receipt::Unconfirmed;
    }
    let deadline = std::time::Instant::now() + Duration::from_millis(RECEIPT_WAIT_MS);
    while std::time::Instant::now() < deadline {
        std::thread::sleep(Duration::from_millis(RECEIPT_POLL_MS));
        let Ok(mut f) = fs::File::open(path) else { continue };
        if f.seek(SeekFrom::Start(from)).is_err() {
            continue;
        }
        let mut buf = Vec::new();
        if f.read_to_end(&mut buf).is_err() {
            continue;
        }
        let window = String::from_utf8_lossy(&buf);
        if render_present(&window, needle) || render_present(&window, tail_needle) {
            return Receipt::Received;
        }
    }
    Receipt::Unconfirmed
}

fn chair_audit(app: &AppHandle, text: String) {
    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
    board_push(&app.state::<Board>().0, BoardEntry { pane: "chair".to_string(), role: "committee".to_string(), text, ts, ts_source: TsSource::Push });
}

/// The audit line for an injection attempt — kept pure so the one thing that matters about it is
/// testable: a FAILED delivery must never read as a delivered one. Found 2026-07-27: the guard
/// path in chair_inject_exec already audited its refusals accurately, while the path below it
/// logged "chair injected" whatever inject_to_pane returned — so a write that never reached the
/// pane still entered the trail as an act. The board is the ground the chair verifies its own
/// work against; a false positive there is the one class of error the audit exists to prevent.
///
/// Cycle 2 adds two things to that line, both from Bravo's C3 verdict:
///
/// (a) THE CHAIR'S MODEL, on every inject line including refusals — Bravo item 4, "the gradient
///     made measurable." The rank gradient (deferring to the senior-seeming source) can only be
///     studied if the ranks are on the record; on 2026-07-27 the chair ran Fable-5 while all three
///     members ran Opus-5 and nobody disclosed it, including the chair, who knew. Item 4 makes the
///     disclosure automatic instead of dependent on anyone's memory. Note what this is NOT: the
///     member never sees it. It goes on the audit trail, not into the injected message — a pane
///     told its chair's rank before answering is a pane handed the gradient, which is the thing
///     being measured. Analyst surface, same rule as PaneModels.
///
/// (b) THE RECEIPT, so "I sent it" stops standing in for "it arrived." See the Receipt docs above.
fn chair_inject_audit_line(
    id: &str,
    preview: &str,
    err: Option<&str>,
    chair_model: &str,
    receipt: Receipt,
) -> String {
    match err {
        None => {
            let state = match receipt {
                Receipt::Received => "delivered and received".to_string(),
                Receipt::Unconfirmed => format!(
                    "WRITTEN BUT UNCONFIRMED — no render in the pane's capture within {RECEIPT_WAIT_MS}ms"
                ),
                // unreachable on the success path; rendered rather than panicked, because an audit
                // line that can panic is an audit line that can go missing.
                Receipt::NotAttempted => "written; receipt not checked".to_string(),
            };
            format!("chair injected (chair: {chair_model}) -> {id} [{state}]: {preview}")
        }
        Some(e) => format!(
            "chair_inject (chair: {chair_model}) -> {id}: DELIVERY FAILED ({e}) — nothing reached the pane: {preview}"
        ),
    }
}

/// The guard-refusal line. Same stamp, because "every chair_inject audit line" includes the ones
/// where the chair was told no — a refusal is still an act of the chair's, and the gradient reading
/// is incomplete if the refused attempts are the unlabelled ones.
fn chair_inject_refusal_line(id: &str, chair_model: &str, why: &str) -> String {
    format!("chair_inject (chair: {chair_model}) -> {id}: {why}")
}

fn chair_inject_exec(app: &AppHandle, target: &str, text: &str) -> String {
    let panes = app.state::<Panes>();
    let names = app.state::<PaneNames>();
    let tid = match resolve_pane(&panes, &names, target) {
        Some(t) => t,
        None => return format!("no live pane matches '{target}'"),
    };
    let role = app.state::<PaneRoles>().0.lock().unwrap().get(&tid).cloned().unwrap_or_else(|| "human".to_string());
    let chair_model = chair_model(app);
    if let Err(e) = chair_target_guard(&tid, &role) {
        chair_audit(app, chair_inject_refusal_line(short_id(&tid), &chair_model, &e));
        return e;
    }
    // provenance is marked by the SYSTEM, not the sender — a pane must never be unsure
    // whether the chair or the human is speaking to it
    let msg = format!("[chair:MAIN] {text}");
    // Receipt: the capture's length BEFORE the write, so only bytes that arrive after it can count
    // as this write's render. Taken before inject_to_pane, never after — the gap is the whole point.
    let cap = capture_path(&tid);
    let before = fs::metadata(&cap).map(|m| m.len()).unwrap_or(0);
    let delivered = inject_to_pane(&panes, &tid, &msg);
    let mut preview: String = text.chars().take(110).collect();
    if text.chars().count() > 110 {
        preview.push('…');
    }
    let receipt = match delivered {
        Ok(_) => await_render(&cap, before, &receipt_needle(text), &receipt_needle_tail(text)),
        Err(_) => Receipt::NotAttempted,
    };
    chair_audit(
        app,
        chair_inject_audit_line(
            short_id(&tid),
            &preview,
            delivered.as_ref().err().map(|e| e.as_str()),
            &chair_model,
            receipt,
        ),
    );
    match delivered {
        Ok(_) => match receipt {
            // The caller is the chair's own loop, and it acts on this string. It must learn the
            // difference here rather than discovering it later in its own audit trail.
            Receipt::Received => format!("delivered to {} (rendered in pane — not proof it was read)", short_id(&tid)),
            _ => format!("written to {} — UNCONFIRMED (no render yet; verify before treating as delivered)", short_id(&tid)),
        },
        Err(e) => format!("delivery failed: {e}"),
    }
}

/// The chair's own model, read from the same live map as every other pane's. Falls back to a named
/// unknown rather than a guess or a blank: an audit trail that quietly says nothing about the rank
/// is indistinguishable from one where the rank was equal, and that is the confusion item 4 exists
/// to end.
fn chair_model(app: &AppHandle) -> String {
    app.state::<PaneModels>()
        .0
        .lock()
        .unwrap()
        .get(MAIN_SID)
        .cloned()
        .unwrap_or_else(|| "unobserved".to_string())
}

// Same act as gate_decide, differently attributed on the board ("chair-main" vs the human's
// "chair") so the audit trail always says which chair decided. Racing the human on the same
// card is safe: pending.remove is the arbiter, second decider gets "already decided".
fn chair_decide_exec(app: &AppHandle, id: &str, approve: bool) -> String {
    let gate = app.state::<Gate>();
    let pull = gate.0.lock().unwrap().pending.remove(id);
    let pull = match pull {
        Some(p) => p,
        None => return "no such pending pull (already decided?)".to_string(),
    };
    if !approve {
        chair_audit(app, format!("chair-main denied pull from {} -> {} : {}", pull.from, pull.target, pull.why));
        return "denied".to_string();
    }
    let outcome = deliver_pull(app, &pull);
    chair_audit(app, format!("chair-main approved + {} (from {} -> {})", outcome, pull.from, pull.target));
    format!("approved + {outcome}")
}

fn chair_scrollback_exec(app: &AppHandle, target: &str) -> String {
    let panes = app.state::<Panes>();
    let names = app.state::<PaneNames>();
    match resolve_pane(&panes, &names, target) {
        Some(tid) => pane_scrollback(tid),
        None => format!("no live pane matches '{target}'"),
    }
}

/// One pane as the chair-analyst sees it. Pure, so the arch test can pin BOTH directions of the
/// model rule without a live app: present here, absent everywhere panes speak to each other.
///
/// Why "unobserved" rather than omitting the key or emitting null: the analyst has to be able to
/// tell "this pane has not produced a turn yet, so nothing has been observed" from "this surface
/// does not carry model at all." Those are different facts and a missing key conflates them —
/// the same species as a silent skip reading as a clean run.
///
/// NEVER BLIND THE ANALYST is the standing rule this implements. The blinding belongs on the
/// contributor side of a fork (C3: blind the contributor, label the record); the reader who is
/// classifying for rank effects needs the ranks, or the study is impossible by construction.
fn status_pane_obj(id: &str, name: &str, role: &str, model: Option<&str>) -> serde_json::Value {
    serde_json::json!({
        "id": short_id(id),
        "name": name,
        "role": role,
        "model": model.unwrap_or("unobserved"),
    })
}

fn chair_status_exec(app: &AppHandle) -> String {
    let letters: HashMap<String, String> = app
        .state::<PaneNames>()
        .0
        .lock()
        .unwrap()
        .iter()
        .map(|(n, id)| (id.clone(), n.clone()))
        .collect();
    let role_map: HashMap<String, String> = app.state::<PaneRoles>().0.lock().unwrap().clone();
    let model_map: HashMap<String, String> = app.state::<PaneModels>().0.lock().unwrap().clone();
    let pane_list: Vec<serde_json::Value> = app
        .state::<Panes>()
        .0
        .lock()
        .unwrap()
        .keys()
        .map(|id| {
            status_pane_obj(
                id,
                &letters.get(id).cloned().unwrap_or_default(),
                &role_map.get(id).cloned().unwrap_or_else(|| "human".to_string()),
                model_map.get(id).map(|s| s.as_str()),
            )
        })
        .collect();
    let gate = app.state::<Gate>();
    let (mode, pending) = {
        let g = gate.0.lock().unwrap();
        let pending: Vec<serde_json::Value> = g
            .pending
            .iter()
            .map(|(id, p)| serde_json::json!({ "id": id, "from": p.from, "target": p.target, "kind": p.kind, "why": p.why }))
            .collect();
        (g.mode_label(), pending)
    };
    let cost = app.state::<Cost>();
    let c = cost.0.lock().unwrap().clone();
    serde_json::json!({
        "panes": pane_list,
        "gate": mode,
        "pending": pending,
        "cost": { "output_tokens": c.output, "ceiling": c.ceiling_out, "tripped": c.tripped },
    })
    .to_string()
}

// Open/close the chair-granted auto-approve envelope (open-channel mode). Any bound exhaustion
// snaps the gate back to ask-each (enforced in the pull consumer).
#[tauri::command]
fn open_channel(app: AppHandle, gate: State<Gate>, exchanges: u32, ttl: u64) -> String {
    let now = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
    let mut g = gate.0.lock().unwrap();
    g.mode = gate::GateMode::OpenChannel;
    g.envelope = Some(gate::Envelope { remaining_exchanges: exchanges, deadline_ms: now + ttl * 1000 });
    let label = g.mode_label();
    drop(g);
    let _ = app.emit("gate-mode", label.clone());
    label
}

#[tauri::command]
fn close_channel(app: AppHandle, gate: State<Gate>) -> String {
    let mut g = gate.0.lock().unwrap();
    g.mode = gate::GateMode::AskEach;
    g.envelope = None;
    let label = g.mode_label();
    drop(g);
    let _ = app.emit("gate-mode", label.clone());
    label
}

// Cost breaker (content-blind): a cap on cumulative OUTPUT tokens. When tripped, the gate stops
// auto-approving (snaps to ask-each) — budget in, pause out. Reads only the number.
#[tauri::command]
fn set_breaker_ceiling(app: AppHandle, cost: State<Cost>, out: u64) {
    let snap = {
        let mut c = cost.0.lock().unwrap();
        c.ceiling_out = out;
        c.tripped = out > 0 && c.output >= out;
        c.clone()
    };
    let _ = app.emit("cost", snap); // refresh the indicator immediately
}

#[tauri::command]
fn reset_breaker(app: AppHandle, cost: State<Cost>) {
    let snap = {
        let mut c = cost.0.lock().unwrap();
        c.ceiling_out = 0;
        c.tripped = false;
        c.clone()
    };
    let _ = app.emit("cost", snap);
}

fn main() {
    // BEFORE ANYTHING ELSE, and specifically before any file that tells the rest of the system
    // where to find this process gets written. See claim_single_instance for what those files
    // are and what happens when a dead instance owns them.
    if !claim_single_instance() {
        warn_second_instance();
        return;
    }
    // Stage 7a/7b: the pull queue. pull_tx → the MCP control plane (bodies' raise_pull);
    // form_pull → the forming step (the 7b fallback puller). The consumer surfaces both.
    let (pull_tx, pull_rx) = tokio::sync::mpsc::unbounded_channel::<mcp::PullRequest>();
    let form_pull = pull_tx.clone();
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(cochlea_service::Service::default())   // the listening tab: off until a source is picked
        .manage(Panes(Mutex::new(HashMap::new())))
        .manage(PaneEmus(Mutex::new(HashMap::new())))
        .manage(Cost(Arc::new(Mutex::new(CostTotals::default()))))
        .manage(Board(Arc::new(Mutex::new(VecDeque::new()))))
        .manage(PaneRoles(Mutex::new(HashMap::new())))
        .manage(PaneModels(Arc::new(Mutex::new(HashMap::new()))))
        .manage(PaneCtxHigh(Arc::new(Mutex::new(HashMap::new()))))
        // Cycle 3b: loaded from disk at startup, so a relaunch resumes instead of replaying.
        // No file at all == the first launch under this scheme == the one backfill, which
        // announces itself below rather than arriving silently.
        .manage(TailerOffsets(Arc::new(Mutex::new({
            BACKFILL_ACTIVE.store(!offsets_path().exists(), Ordering::Relaxed);
            load_offsets()
        }))))
        .manage(PaneNames(Mutex::new(HashMap::new())))
        .manage(PaneSandboxes(Mutex::new(HashMap::new())))
        .manage(PullSender(form_pull))
        .manage(Gate(Arc::new(Mutex::new(gate::GateInner::default()))))
        .manage(LastForming(Mutex::new(None)))
        .manage(SpotPairs(Mutex::new(HashMap::new())))
        .setup(move |app| {
            // Resolve the BOOT.md bundled with the app (installer resource) so a fresh
            // install has a working default startup brief instead of a hardcoded dev path.
            if let Ok(p) = app.path().resolve("BOOT.md", tauri::path::BaseDirectory::Resource) {
                *RESOURCE_ROOM.lock().unwrap() = Some(p);
            }
            if let Ok(p) = app.path().resolve("cards", tauri::path::BaseDirectory::Resource) {
                *RESOURCE_CARDS.lock().unwrap() = Some(p);
            }
            if let Ok(p) = app.path().resolve("spread", tauri::path::BaseDirectory::Resource) {
                *RESOURCE_SPREAD.lock().unwrap() = Some(p);
            }
            if let Ok(p) = app.path().resolve("research", tauri::path::BaseDirectory::Resource) {
                *RESOURCE_RESEARCH.lock().unwrap() = Some(p);
            }
            if let Ok(p) = app.path().resolve("record", tauri::path::BaseDirectory::Resource) {
                *RESOURCE_RECORD.lock().unwrap() = Some(p);
            }
            seed_room(); // first run: copy the bundled brief into the data dir (editable)
            seed_cards(); // first run: copy the bundled card deck into the data dir (editable)
            seed_references(); // the counter-voice + the study: named by the room, opened on demand
            set_dirs(&get_state()); // resolve configurable dirs before anything reads them
            gc_captures(); // drop own-capture logs for panes that are no longer kept
            // Stage 7a: shared MCP control plane + the pull queue. The Stage-7 gate will
            // consume this; for now a placeholder consumer surfaces every raised pull.
            //
            // Stage 9: the autonomous chair rides the same server. A fresh token per launch is
            // written ONLY into the Main instance's directory; the chair_* MCP verbs require it.
            // Discipline boundary, not security (see mcp.rs::auth_chair) — the audit is the
            // enforcement. Dual mode: nothing the human chair had is removed by any of this.
            let (chair_tx, chair_rx) = tokio::sync::mpsc::unbounded_channel::<mcp::ChairCmd>();
            let chair_token = Uuid::new_v4().to_string();
            let token_path = PathBuf::from(main_cwd()).join(".chair-token");
            if let Err(e) = fs::write(&token_path, &chair_token) {
                // an unusable chair must never be silent (the config-orphan lesson)
                if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(PathBuf::from(home()).join(".consonance.log")) {
                    let _ = writeln!(f, "[consonance] chair token write failed at {}: {e} — chair verbs will refuse all calls", token_path.display());
                }
            }
            let mboard = app.state::<Board>().0.clone();
            MCP_PORT.store(mcp::start(mboard, pull_tx, chair_tx, chair_token), Ordering::Relaxed);
            // Stage 9 actuator: execute chair verbs on the main side, same pattern as the pull
            // consumer. Acting verbs (inject/decide) audit to the board; sensor verbs
            // (status/scrollback) reply silently — audit what changes the world, not what looks
            // at it, or loop-tick reads would crowd the board past curation capacity.
            let chair_handle = app.handle().clone();
            std::thread::spawn(move || {
                let mut chair_rx = chair_rx;
                while let Some(cmd) = chair_rx.blocking_recv() {
                    // Around's find #2 (2026-07-27): a command whose caller already timed out
                    // (receiver dropped) must never fire late — the caller may have retried, and
                    // a late fire is a double-inject. Acting verbs drop LOUDLY (audited); sensor
                    // verbs drop silently (nothing changed, nobody is waiting).
                    match cmd {
                        mcp::ChairCmd::Inject { target, text, reply } => {
                            if reply.is_closed() {
                                let cm = chair_model(&chair_handle);
                                chair_audit(&chair_handle, chair_inject_refusal_line(&target, &cm, "EXPIRED unexecuted (caller timed out before the actuator ran)"));
                                continue;
                            }
                            let _ = reply.send(chair_inject_exec(&chair_handle, &target, &text));
                        }
                        mcp::ChairCmd::Decide { id, approve, reply } => {
                            if reply.is_closed() {
                                chair_audit(&chair_handle, format!("chair_decide {id}: EXPIRED unexecuted (caller timed out before the actuator ran)"));
                                continue;
                            }
                            let _ = reply.send(chair_decide_exec(&chair_handle, &id, approve));
                        }
                        mcp::ChairCmd::Scrollback { target, reply } => {
                            if reply.is_closed() {
                                continue;
                            }
                            let _ = reply.send(chair_scrollback_exec(&chair_handle, &target));
                        }
                        mcp::ChairCmd::Status { reply } => {
                            if reply.is_closed() {
                                continue;
                            }
                            let _ = reply.send(chair_status_exec(&chair_handle));
                        }
                    }
                }
            });
            // Cycle 3b: the backfill announcement. One shot, one line, only on the launch that
            // actually performs it. Delayed rather than posted at startup because the count is
            // the point — a bare "a backfill is happening" carries less than the number of panes
            // and turns it moved, and neither is known until the tailers have resolved.
            if BACKFILL_ACTIVE.load(Ordering::Relaxed) {
                let bboard = app.state::<Board>().0.clone();
                std::thread::spawn(move || {
                    std::thread::sleep(BACKFILL_ANNOUNCE_AFTER);
                    let panes = BACKFILL_PANES.lock().unwrap().as_ref().map_or(0, |s| s.len());
                    let turns = BACKFILL_TURNS.load(Ordering::Relaxed);
                    if panes == 0 {
                        return; // nothing was backfilled; a line about it would be noise
                    }
                    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
                    board_push(&bboard, BoardEntry {
                        pane: "backfill".to_string(),
                        role: "committee".to_string(),
                        text: backfill_line(panes, turns, BACKFILL_ANNOUNCE_AFTER.as_secs()),
                        ts,
                        ts_source: TsSource::Push,
                    });
                });
            }
            let phandle = app.handle().clone();
            let pboard = app.state::<Board>().0.clone();
            let pgate = app.state::<Gate>().0.clone();
            let ccost = app.state::<Cost>().0.clone();
            std::thread::spawn(move || {
                let mut pull_rx = pull_rx;
                while let Some(pr) = pull_rx.blocking_recv() {
                    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
                    let mut g = pgate.lock().unwrap();
                    // ask_each: below threshold the pull drops (counted); else it becomes a GateCard
                    if pr.intensity < g.pull_threshold {
                        g.suppressed += 1;
                        let n = g.suppressed;
                        drop(g);
                        board_push(&pboard, BoardEntry {
                            pane: "gate".to_string(),
                            role: "committee".to_string(),
                            text: format!("suppressed pull from {} (intensity {:.2} < threshold) — {} suppressed total", pr.from, pr.intensity, n),
                            ts,
            ts_source: TsSource::Push,
                        });
                        continue;
                    }
                    // open-channel: auto-approve within the envelope + content-blind guards
                    // (cost breaker, global rate cap); else snap back to ask-each.
                    let mut auto = false;
                    let mut changed = false;
                    let mut snap_reason = "";
                    if g.mode == gate::GateMode::OpenChannel {
                        let tripped = ccost.lock().unwrap().tripped;
                        while let Some(&t) = g.auto_window.front() {
                            if ts.saturating_sub(t) > gate::RATE_WINDOW_MS { g.auto_window.pop_front(); } else { break; }
                        }
                        let rate_ok = (g.auto_window.len() as u32) < gate::RATE_CAP;
                        let env_ok = g.envelope.as_ref().map_or(false, |e| e.remaining_exchanges > 0 && ts < e.deadline_ms);
                        snap_reason = if tripped { "cost breaker tripped" }
                            else if !rate_ok { "rate cap" }
                            else if !env_ok { "envelope spent" }
                            else { "" };
                        if snap_reason.is_empty() {
                            if let Some(e) = g.envelope.as_mut() { e.remaining_exchanges -= 1; }
                            g.auto_window.push_back(ts);
                            auto = true;
                            changed = true;
                        } else {
                            g.mode = gate::GateMode::AskEach;
                            g.envelope = None;
                            changed = true;
                        }
                    }
                    let label = g.mode_label();
                    if auto {
                        drop(g);
                        let _ = phandle.emit("gate-mode", label);
                        let outcome = deliver_pull(&phandle, &pr);
                        board_push(&pboard, BoardEntry {
                            pane: "gate".to_string(),
                            role: "committee".to_string(),
                            text: format!("open-channel auto-approved + {} (from {} -> {})", outcome, pr.from, pr.target),
                            ts,
            ts_source: TsSource::Push,
                        });
                        continue;
                    }
                    if !snap_reason.is_empty() {
                        board_push(&pboard, BoardEntry {
                            pane: "gate".to_string(),
                            role: "committee".to_string(),
                            text: format!("open-channel closed ({snap_reason}) — back to ask-each"),
                            ts,
            ts_source: TsSource::Push,
                        });
                    }
                    // ask-each (default, or just snapped back): surface a GateCard for the chair
                    let id = Uuid::new_v4().to_string();
                    let card = gate::GateCard {
                        id: id.clone(),
                        from: pr.from.clone(),
                        target: pr.target.clone(),
                        kind: pr.kind.clone(),
                        intensity: pr.intensity,
                        why: pr.why.clone(),
                    };
                    g.pending.insert(id, pr);
                    drop(g);
                    if changed {
                        let _ = phandle.emit("gate-mode", label);
                    }
                    board_push(&pboard, BoardEntry {
                        pane: "gate".to_string(),
                        role: "committee".to_string(),
                        text: format!("gate-card [{}] from {} -> {} [{}] {}", &card.id[..8], card.from, card.target, card.kind, card.why),
                        ts,
            ts_source: TsSource::Push,
                    });
                    let _ = phandle.emit("gate-card", card);
                }
            });

            let handle = app.handle().clone();
            std::thread::spawn(move || {
                let mut sys = sysinfo::System::new();
                loop {
                    sys.refresh_memory();
                    sys.refresh_processes();
                    let mut claude_procs = 0u32;
                    let mut claude_mb = 0u64;
                    for proc in sys.processes().values() {
                        if proc.name().to_lowercase().contains("claude") {
                            claude_procs += 1;
                            claude_mb += proc.memory() / 1_048_576;
                        }
                    }
                    let _ = handle.emit("sysmeter", SysMeter {
                        claude_procs,
                        claude_mb,
                        ram_used_mb: sys.used_memory() / 1_048_576,
                        ram_total_mb: sys.total_memory() / 1_048_576,
                    });
                    std::thread::sleep(Duration::from_millis(2000));
                }
            });

            // auto-scribe: distill the board as turns accumulate, debounced (cost-bounded).
            // catches both "context filling" and "conversation ended" — that content is on the board.
            let dhandle = app.handle().clone();
            let dboard = app.state::<Board>().0.clone();
            std::thread::spawn(move || {
                let mut last_ms = 0u64;
                loop {
                    std::thread::sleep(Duration::from_secs(20));
                    if !AUTO_DISTILL.load(Ordering::Relaxed) {
                        continue;
                    }
                    // shared watermark, not a private counter — a manual ⟳ advances it too,
                    // so the worker never re-fires on turns the button already distilled.
                    let new = {
                        let q = dboard.lock().unwrap();
                        undistilled_len(BOARD_PUSHED.load(Ordering::Relaxed), DISTILLED_MARK.load(Ordering::Relaxed), q.len())
                    };
                    let now = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
                    // fire only when >= 6 new turns piled up AND >= 3 min since the last distill
                    if new >= 6 && now.saturating_sub(last_ms) >= 180_000 {
                        if run_distill(&dboard, &dhandle, true).is_ok() {
                            last_ms = now;
                        }
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_state, save_config, config_exists,
            pty_spawn, pty_write, pty_resize, pty_kill, pty_reopen, get_board,
            scribe_distill, set_auto_distill, clipboard_read, clipboard_write, spawn_sibling, spawn_fresh, committee_form,
            set_pane_role, set_pane_name, gate_decide, open_channel, close_channel, spawn_body,
            set_breaker_ceiling, reset_breaker, spawn_main, set_spot_pair, dyad_spot,
            spawn_librarian,
            set_pane_kept, list_kept_panes, resume_pane, new_room, pane_letters,
            pane_scrollback,
            audio_sources, audio_start, audio_stop, audio_status, audio_snapshot
        ])
        // No graceful-shutdown delay on close: `/exit` doesn't reliably flush an interactive claude
        // (proven), the own-capture log persists every chunk as it arrives, and real `--resume` works
        // off claude's own periodic flush — so the window closes instantly, no hitch.
        .run(tauri::generate_context!())
        .expect("error while running Consonance");
}

#[cfg(test)]
mod curated_intake_tests {
    use super::{curated_resonance, tail_resonance, Curation, LIVE_EDGE};
    use std::collections::HashMap;
    use std::path::PathBuf;

    fn atom(kind: &str, claim: &str) -> String {
        format!(r#"{{"kind":"{kind}","claim":"{claim}","tether":"t"}}"#)
    }

    fn curation(settled: &[(usize, &str)]) -> Curation {
        Curation {
            topics: vec![
                ("centrifuge-rendering".into(), "The dome, the shadows, the panes.".into(), 3, 9),
                ("shell-size-ceiling".into(), "The 150k limit.".into(), 1, 2),
            ],
            settled: settled.iter().map(|(i, s)| (*i, s.to_string())).collect(),
            dir: PathBuf::from("/d/resonance/topics"),
        }
    }

    #[test]
    fn map_lists_every_topic_with_its_live_count() {
        let owned: Vec<String> = (0..4).map(|i| atom("confirmed", &format!("claim {i}"))).collect();
        let lines: Vec<&str> = owned.iter().map(|s| s.as_str()).collect();
        let out = curated_resonance(&lines, &curation(&[]));
        assert!(out.contains("**centrifuge-rendering** (3 live) — The dome, the shadows, the panes."));
        assert!(out.contains("**shell-size-ceiling** (1 live)"));
    }

    // The documents are NOT inlined — 12 topics already run to 39 KB against a 150 KB shell
    // ceiling. The map has to point at them instead, or the intake reintroduces the bloat.
    #[test]
    fn map_points_at_the_documents_and_the_master_rather_than_inlining_them() {
        let owned = vec![atom("confirmed", "a")];
        let lines: Vec<&str> = owned.iter().map(|s| s.as_str()).collect();
        let out = curated_resonance(&lines, &curation(&[]));
        assert!(out.contains("resonance/topics") || out.contains("resonance\\topics"));
        assert!(out.contains("atoms.jsonl"));
        assert!(out.contains("append-only"));
    }

    // The whole point: a resolved OPEN must not reach a waking sibling as if it were open.
    #[test]
    fn settled_atoms_are_kept_out_of_the_live_edge() {
        let owned = vec![
            atom("open", "is the shortcut stale"),
            atom("confirmed", "the shortcut is repointed"),
        ];
        let lines: Vec<&str> = owned.iter().map(|s| s.as_str()).collect();
        let out = curated_resonance(&lines, &curation(&[(0, "resolved")]));
        assert!(!out.contains("is the shortcut stale"));
        assert!(out.contains("the shortcut is repointed"));
    }

    // Edge: a long run of settled atoms at the end must not starve the edge — it walks further
    // back rather than returning short, otherwise a heavily-curated tail renders an empty edge.
    #[test]
    fn a_settled_run_at_the_tail_does_not_starve_the_edge() {
        let owned: Vec<String> = (0..60).map(|i| atom("confirmed", &format!("claim {i}"))).collect();
        let lines: Vec<&str> = owned.iter().map(|s| s.as_str()).collect();
        let settled: Vec<(usize, &str)> = (40..60).map(|i| (i, "superseded")).collect();
        let out = curated_resonance(&lines, &curation(&settled));
        assert_eq!(out.matches("- **confirmed**").count(), LIVE_EDGE);
        assert!(!out.contains("claim 59"));
        assert!(out.contains("claim 39"));
    }

    // Edge: a truncated or corrupt line must be skipped, never abort the intake.
    #[test]
    fn malformed_atoms_are_skipped_not_fatal() {
        let owned = vec![
            atom("confirmed", "good one"),
            "{\"kind\":\"confirmed\",\"claim\":".to_string(), // truncated mid-write
            "{}".to_string(),                                 // valid JSON, no claim
        ];
        let lines: Vec<&str> = owned.iter().map(|s| s.as_str()).collect();
        let out = curated_resonance(&lines, &curation(&[]));
        assert_eq!(out.matches("- **confirmed**").count(), 1);
        assert!(out.contains("good one"));
    }

    // The fallback keeps its old behaviour exactly: no curation, no loss.
    #[test]
    fn uncurated_fallback_is_the_chronological_window() {
        let owned: Vec<String> = (0..50).map(|i| atom("confirmed", &format!("claim {i}"))).collect();
        let lines: Vec<&str> = owned.iter().map(|s| s.as_str()).collect();
        let out = tail_resonance(&lines, 40);
        assert_eq!(out.matches("- **confirmed**").count(), 40);
        assert!(out.contains("claim 49"));
        assert!(!out.contains("claim 9 "));
    }

    #[test]
    fn a_shorter_memory_than_the_window_is_not_a_panic() {
        let owned = vec![atom("confirmed", "only one")];
        let lines: Vec<&str> = owned.iter().map(|s| s.as_str()).collect();
        assert!(tail_resonance(&lines, 40).contains("only one"));
        assert!(tail_resonance(&[], 40).contains("RECENT RESONANCE"));
    }
}

#[cfg(test)]
mod human_gap_tests {
    use super::human_gap;

    #[test]
    fn sub_minute_gap_reads_as_under_a_minute() {
        assert_eq!(human_gap(0), "under a minute");
        assert_eq!(human_gap(59), "under a minute");
    }

    #[test]
    fn minutes_only_below_an_hour() {
        assert_eq!(human_gap(60), "1 minute");
        assert_eq!(human_gap(47 * 60 + 30), "47 minutes");
    }

    #[test]
    fn hours_carry_their_minutes() {
        assert_eq!(human_gap(3600), "1 hour 0 minutes");
        assert_eq!(human_gap(16 * 3600 + 23 * 60), "16 hours 23 minutes");
    }

    #[test]
    fn days_carry_their_hours() {
        assert_eq!(human_gap(86400 + 5 * 3600 + 59 * 60), "1 day 5 hours");
        assert_eq!(human_gap(2 * 86400 + 3600), "2 days 1 hour");
    }
}

#[cfg(test)]
mod pulse_when_tests {
    use super::pulse_when;
    use chrono::{FixedOffset, TimeZone};

    // pinned to a fixed offset so the assertion doesn't depend on the machine's timezone
    #[test]
    fn morning_keeps_padded_minutes_but_not_padded_hours() {
        let tz = FixedOffset::west_opt(6 * 3600).unwrap();
        let t = tz.with_ymd_and_hms(2026, 7, 13, 9, 5, 0).unwrap();
        assert_eq!(pulse_when(t), "Monday, July 13, 2026 at 9:05 AM");
    }

    #[test]
    fn single_digit_day_and_pm_render_unpadded() {
        let tz = FixedOffset::west_opt(6 * 3600).unwrap();
        let t = tz.with_ymd_and_hms(2026, 7, 4, 23, 59, 0).unwrap();
        assert_eq!(pulse_when(t), "Saturday, July 4, 2026 at 11:59 PM");
    }

    #[test]
    fn noon_and_midnight_are_twelve_not_zero() {
        let tz = FixedOffset::west_opt(6 * 3600).unwrap();
        let noon = tz.with_ymd_and_hms(2026, 7, 13, 12, 0, 0).unwrap();
        let midnight = tz.with_ymd_and_hms(2026, 7, 13, 0, 0, 0).unwrap();
        assert_eq!(pulse_when(noon), "Monday, July 13, 2026 at 12:00 PM");
        assert_eq!(pulse_when(midnight), "Monday, July 13, 2026 at 12:00 AM");
    }
}

// The seam between the emulator and the extractor — where the 118-char amputation lived.
//
// capture.rs is pure by design and never touches vt100, so every fold test over there asserts
// against HAND-WRITTEN wrap flags. That proves the fold, and proves nothing about the premise the
// fold rests on: that a real vt100 at EMU_COLS actually reports row_wrapped for a soft wrap. If
// that premise were false, all of those tests stay green and the app stays broken — which is
// exactly the shape of a fix shipped without being run. So this drives the real emulator.
#[cfg(test)]
mod fold_seam_tests {
    use super::{capture, EMU_COLS, EMU_ROWS};

    fn render(input: &str) -> (Vec<String>, Vec<bool>) {
        let mut p = vt100::Parser::new(EMU_ROWS, EMU_COLS, 0);
        p.process(input.as_bytes());
        let screen = p.screen();
        let rows: Vec<String> = screen.rows(0, EMU_COLS).collect();
        let flags: Vec<bool> = (0..rows.len() as u16).map(|i| screen.row_wrapped(i)).collect();
        (rows, flags)
    }

    #[test]
    fn a_real_emulator_reports_the_soft_wrap() {
        // 176 chars: longer than the 118 a single row holds after "❯ "
        let msg = "Ideally what you suggested would be a good idea, but I want the best for you. \
                   I am sure we will be okay. Currently close to 5 hour limit so, I just wanted your opinion.";
        let (rows, flags) = render(&format!("❯ {msg}"));
        assert!(
            flags[0],
            "vt100 did not flag the soft wrap — the fold's entire premise is false"
        );
        assert!(!flags[1], "the continuation row should not itself wrap");
    }

    #[test]
    fn the_real_wrap_unfolds_back_to_the_exact_message() {
        let msg = "Ideally what you suggested would be a good idea, but I want the best for you. \
                   I am sure we will be okay. Currently close to 5 hour limit so, I just wanted your opinion.";
        let (rows, flags) = render(&format!("❯ {msg}"));
        let got = capture::latest_prompt(&rows, &flags);
        assert_eq!(got, msg, "the fold did not reconstruct the original sentence");
        // and the regression itself, named:
        assert!(got.len() > 118, "still capped at one row: {} chars", got.len());
    }

    #[test]
    fn a_message_that_fits_one_row_is_untouched() {
        let msg = "short question";
        let (rows, flags) = render(&format!("❯ {msg}"));
        assert!(!flags[0], "a short line must not be flagged as wrapped");
        assert_eq!(capture::latest_prompt(&rows, &flags), msg);
    }

    #[test]
    fn a_wrap_landing_on_a_space_does_not_glue_two_words() {
        // the nastiest case: the fold joins with no separator (terminals cut mid-word), so if the
        // cut lands ON a space, that space must survive in the emulator's own row contents.
        let head = "x".repeat(117);
        let msg = format!("{head} boundary word here");
        let (rows, flags) = render(&format!("❯ {msg}"));
        assert!(flags[0]);
        let got = capture::latest_prompt(&rows, &flags);
        assert!(got.contains("boundary word here"), "words were glued: {got}");
        assert_eq!(got, msg);
    }

    #[test]
    fn the_response_starts_after_the_prompts_continuation_not_inside_it() {
        let msg = "Ideally what you suggested would be a good idea, but I want the best for you. \
                   I am sure we will be okay. Currently close to 5 hour limit so, I just wanted your opinion.";
        // \r\n moves to a fresh row so the reply is its own line, as claude paints it
        let (rows, flags) = render(&format!("❯ {msg}\r\n● Noted, and not brushed past.\r\n❯ "));
        let resp = capture::latest_turn(&rows, &flags);
        assert!(
            !resp.contains("5 hour limit"),
            "the user's wrapped tail leaked into the response: {resp}"
        );
        assert!(resp.contains("Noted, and not brushed past."), "resp: {resp}");
    }
}

#[cfg(test)]
mod night_table_tests {
    use super::{progress_tag, pulse_stamp};
    use chrono::{FixedOffset, TimeZone};

    #[test]
    fn stamp_drops_the_year_and_weekday() {
        let tz = FixedOffset::west_opt(6 * 3600).unwrap();
        let t = tz.with_ymd_and_hms(2026, 7, 14, 8, 52, 0).unwrap();
        assert_eq!(pulse_stamp(t), "Jul 14, 8:52 AM");
    }

    // the shapes below are verbatim heads of real progress.md lines from the five live goals
    #[test]
    fn tag_comes_from_the_last_line_not_the_first() {
        let p = "2026-07-09T15:58:00Z [VERDICT] older\n\n2026-07-14T14:52:24Z [PASS-22] Catch-up fire\n";
        assert_eq!(progress_tag(p).as_deref(), Some("PASS-22"));
    }

    #[test]
    fn drift_watch_generic_verdict_yields_the_inner_tag() {
        let p = "2026-07-13T15:52:00Z [VERDICT] sessions=0 verdict=[NO-SESSIONS] (interactive).";
        assert_eq!(progress_tag(p).as_deref(), Some("NO-SESSIONS"));
    }

    #[test]
    fn tag_leading_the_line_is_found_too() {
        let p = "[AUDIT-OK-WITH-NOTES] 2026-07-09T23:20:06Z — Pass 21 audited: the critic re-fetched";
        assert_eq!(progress_tag(p).as_deref(), Some("AUDIT-OK-WITH-NOTES"));
    }

    #[test]
    fn prose_in_brackets_is_not_a_tag() {
        let long = format!("2026-07-14T15:31:00Z [{}]", "x".repeat(60));
        assert_eq!(progress_tag(&long), None);
    }

    #[test]
    fn untagged_and_empty_progress_stay_silent() {
        assert_eq!(progress_tag("- iterations_used 20 → 21."), None);
        assert_eq!(progress_tag(""), None);
        assert_eq!(progress_tag("\n\n   \n"), None);
        assert_eq!(progress_tag("2026-07-14T15:31:00Z [unclosed"), None);
    }

    // ── the gathering, against a temp bed ────────────────────────────────────
    use super::night_table_from;
    use std::time::{Duration, SystemTime};

    // A bed with one dream and two goals, all written NOW. `settled` in the past = they landed in
    // the dark; `settled` in the future = they predate the gap and must not surface.
    fn bed(tag: &str) -> std::path::PathBuf {
        let root = std::env::temp_dir().join(format!("night_table_test_{tag}"));
        let _ = std::fs::remove_dir_all(&root);
        let dreams = root.join("dreams");
        std::fs::create_dir_all(&dreams).unwrap();
        std::fs::write(dreams.join("2026-07-14_0210.md"), "a coat rack at the bottom of a pool").unwrap();
        std::fs::write(dreams.join("notes.txt"), "not a dream").unwrap(); // non-.md is ignored
        let duration = root.join("duration");
        std::fs::create_dir_all(duration.join("drift-watch")).unwrap();
        std::fs::write(
            duration.join("drift-watch").join("progress.md"),
            "2026-07-13T15:52:00Z [VERDICT] sessions=0 verdict=[NO-SESSIONS] (interactive).",
        )
        .unwrap();
        std::fs::create_dir_all(duration.join("quiet-goal")).unwrap(); // no progress.md → silent
        root
    }

    #[test]
    fn the_night_table_gathers_dreams_and_verdicts() {
        let root = bed("gathers");
        let out = night_table_from(
            &[("dreams".to_string(), root.join("dreams"))],
            &root.join("duration"),
            Some(SystemTime::now() - Duration::from_secs(3600)),
        );
        assert!(out.contains("While you were dark"), "{out}");
        assert!(out.contains("1 dream landed"), "{out}");
        assert!(out.contains("dreams/2026-07-14_0210.md"), "{out}");
        assert!(!out.contains("notes.txt"), "non-.md leaked in: {out}");
        assert!(out.contains("drift-watch — [NO-SESSIONS]"), "{out}");
        assert!(!out.contains("quiet-goal"), "a goal with no progress.md spoke: {out}");
        assert!(out.contains("Notes, not tasks"), "{out}");
        let _ = std::fs::remove_dir_all(&root);
    }

    #[test]
    fn dreams_aggregate_across_beds_each_tagged_by_its_bed() {
        // Two instances each dreamed one dream in the dark; a pane must surface BOTH, each wearing
        // the prefix of the bed that dreamed it — this is the scatter fix.
        let root = std::env::temp_dir().join("night_table_test_aggregate");
        let _ = std::fs::remove_dir_all(&root);
        let a = root.join("main").join("dreams");
        let b = root.join("sibling-abc").join("dreams");
        std::fs::create_dir_all(&a).unwrap();
        std::fs::create_dir_all(&b).unwrap();
        std::fs::write(a.join("2026-07-23_0430.md"), "main's dream").unwrap();
        std::fs::write(b.join("2026-07-22_1030.md"), "sibling's dream").unwrap();
        let out = night_table_from(
            &[
                ("../main/dreams".to_string(), a.clone()),
                ("../sibling-abc/dreams".to_string(), b.clone()),
            ],
            &root.join("duration"),
            Some(SystemTime::now() - Duration::from_secs(3600)),
        );
        assert!(out.contains("2 dreams landed"), "{out}");
        assert!(out.contains("../main/dreams/2026-07-23_0430.md"), "{out}");
        assert!(out.contains("../sibling-abc/dreams/2026-07-22_1030.md"), "{out}");
        let _ = std::fs::remove_dir_all(&root);
    }

    #[test]
    fn nothing_older_than_the_gap_surfaces_and_a_quiet_night_stays_quiet() {
        let root = bed("quiet");
        // everything on this bed predates a gap that starts an hour from now
        let out = night_table_from(
            &[("dreams".to_string(), root.join("dreams"))],
            &root.join("duration"),
            Some(SystemTime::now() + Duration::from_secs(3600)),
        );
        assert_eq!(out, "", "a quiet night must stay quiet");
        let _ = std::fs::remove_dir_all(&root);
    }

    #[test]
    fn no_witnessed_interval_means_no_night_table() {
        let root = bed("nosettled");
        let out = night_table_from(
            &[("dreams".to_string(), root.join("dreams"))],
            &root.join("duration"),
            None,
        );
        assert_eq!(out, "");
        let _ = std::fs::remove_dir_all(&root);
    }

    #[test]
    fn a_missing_bed_is_silent_not_a_panic() {
        let missing = std::env::temp_dir().join("night_table_no_such_bed");
        let out = night_table_from(
            &[("dreams".to_string(), missing.join("dreams"))],
            &missing.join("duration"),
            Some(SystemTime::now() - Duration::from_secs(60)),
        );
        assert_eq!(out, "");
    }
}

#[cfg(test)]
mod scrollback_tests {
    use super::scrollback_tail;

    #[test]
    fn short_history_is_returned_whole() {
        let s = "❯ hello\n\n● hi there\n";
        assert_eq!(scrollback_tail(s, 4096), s);
    }

    #[test]
    fn empty_is_empty_not_a_panic() {
        assert_eq!(scrollback_tail("", 4096), "");
    }

    #[test]
    fn long_history_opens_on_a_line_boundary() {
        let s = (0..500).map(|i| format!("❯ turn {i}\n")).collect::<String>();
        let out = scrollback_tail(&s, 200);
        assert!(out.starts_with('❯'), "opened mid-line: {:?}", &out[..20.min(out.len())]);
        assert!(out.len() <= 200);
        assert!(s.ends_with(&out), "the tail must be the END of the history");
    }

    // The one that would actually crash: claude transcripts are full of multi-byte
    // glyphs, so a cut landing inside one panics — on a long pane, which is precisely
    // the pane whose history is worth restoring.
    #[test]
    fn a_cut_inside_a_multibyte_glyph_does_not_panic() {
        let s = "✻".repeat(4000); // 3 bytes each, no newlines anywhere
        for max in 1..64 {
            let out = scrollback_tail(&s, max);
            assert!(s.ends_with(&out));
            assert!(out.chars().all(|c| c == '✻'), "sliced a glyph in half");
        }
    }

    #[test]
    fn no_newline_in_the_window_still_returns_text() {
        let s = format!("{}\n{}", "old", "x".repeat(500));
        let out = scrollback_tail(&s, 100);
        assert_eq!(out.len(), 100);
        assert!(!out.contains("old"));
    }
}

#[cfg(test)]
mod distill_watermark_tests {
    use super::undistilled_len;

    #[test]
    fn first_pass_takes_whole_ring() {
        assert_eq!(undistilled_len(10, 0, 10), 10);
    }

    #[test]
    fn nothing_new_after_a_pass_takes_zero() {
        assert_eq!(undistilled_len(10, 10, 10), 0);
    }

    #[test]
    fn second_pass_takes_only_the_new_tail() {
        assert_eq!(undistilled_len(16, 10, 16), 6);
    }

    #[test]
    fn front_eviction_clamps_to_ring_len() {
        // 400 pushed, 100 distilled, but the ring evicted down to 300: take all 300, no panic
        assert_eq!(undistilled_len(400, 100, 300), 300);
    }

    #[test]
    fn stale_mark_ahead_of_pushed_saturates_to_zero() {
        assert_eq!(undistilled_len(5, 10, 5), 0);
    }

    // the regression this fix exists for: repeated passes over a growing board must
    // distill each turn exactly once, never re-feed the whole board.
    #[test]
    fn repeated_passes_never_redistill() {
        let mut pushed: u64 = 0;
        let mut marked: u64 = 0;
        let mut ring_len: usize = 0;
        let mut total_distilled: usize = 0;
        for batch in [7usize, 6, 9, 6, 12] {
            pushed += batch as u64;
            ring_len = (ring_len + batch).min(300);
            let new = undistilled_len(pushed, marked, ring_len);
            total_distilled += new;
            marked = pushed; // what run_distill does on success
        }
        // pre-fix each pass re-fed everything (7 + 13 + 22 + 28 + 40 = 110 turn-feeds);
        // post-fix every turn is fed exactly once.
        assert_eq!(total_distilled, 40);
    }
}

#[cfg(test)]
mod config_parse_tests {
    use super::{parse_config, Config};

    /// The exact file that orphaned a Main thread: coordinates written as JSON numbers.
    /// Strict serde returns Err for the WHOLE file, so every directory reverted to a default
    /// and the instance woke in the wrong folder. The directories must survive it.
    #[test]
    fn numeric_coordinates_do_not_discard_the_directories() {
        let json = r#"{
            "room_path": "C:\\room\\BOOT.md",
            "instances_dir": "C:\\Consonance\\instances",
            "data_dir": "C:\\Consonance\\data",
            "ambient_lat": 50.4452,
            "ambient_lon": -104.6189,
            "ambient_label": "Regina, Saskatchewan",
            "ambient_tz": "America/Regina"
        }"#;
        // Pin the cause, so nobody "fixes" this by loosening the struct and losing the lesson.
        assert!(
            serde_json::from_str::<Config>(json).is_err(),
            "strict parse still rejects a numeric coordinate — that is precisely why parse_config exists"
        );
        let (cfg, bad) = parse_config(json);
        assert!(bad.is_empty(), "a number is readable, not a complaint: {bad:?}");
        assert_eq!(cfg.instances_dir, r"C:\Consonance\instances");
        assert_eq!(cfg.data_dir, r"C:\Consonance\data");
        assert_eq!(cfg.room_path, r"C:\room\BOOT.md");
        assert_eq!(cfg.ambient_lat, "50.4452");
        assert_eq!(cfg.ambient_lon, "-104.6189");
    }

    /// The general lesson, not just today's field: one unusable value costs only itself.
    #[test]
    fn one_bad_field_does_not_cost_the_others() {
        let json = r#"{"instances_dir":"C:\\keep\\me","ambient_lat":{"nested":"nonsense"}}"#;
        let (cfg, bad) = parse_config(json);
        assert_eq!(cfg.instances_dir, r"C:\keep\me", "a good field survives a bad neighbour");
        assert!(
            bad.contains(&"ambient_lat".to_string()),
            "an unusable field must be named aloud, never swallowed: {bad:?}"
        );
    }

    /// Boundaries: empty object, invalid JSON, wrong top-level type.
    #[test]
    fn empty_is_quiet_but_malformed_always_complains() {
        let (cfg, bad) = parse_config("{}");
        assert!(bad.is_empty(), "an empty object is legitimate — every field simply defaults");
        assert_eq!(cfg.instances_dir, "", "empty means the caller applies its built-in default");

        assert!(!parse_config("not json at all").1.is_empty(), "invalid JSON must complain");
        assert!(!parse_config("[1,2,3]").1.is_empty(), "a non-object top level must complain");
    }

    /// Whitespace around a hand-edited path must not become part of the path.
    #[test]
    fn paths_are_trimmed() {
        let (cfg, bad) = parse_config(r#"{"data_dir":"  C:\\Consonance\\data  "}"#);
        assert!(bad.is_empty());
        assert_eq!(cfg.data_dir, r"C:\Consonance\data");
    }
}

// Stage 9: the chair's target guard is the one rule that makes autonomous injection safe to
// have at all — it must hold as pure logic, independent of any live pane state.
#[cfg(test)]
mod chair_tests {
    use super::*;

    #[test]
    fn chair_never_injects_into_itself() {
        assert!(chair_target_guard(MAIN_SID, "main").is_err(), "self-injection would loop the chair into its own input");
    }

    #[test]
    fn chair_never_injects_into_a_person() {
        assert!(chair_target_guard("11112222-abcd", "human").is_err(), "a human-driven pane must never receive injected text");
    }

    #[test]
    fn chair_reaches_committee_panes() {
        assert!(chair_target_guard("11112222-abcd", "committee").is_ok());
    }

    /// The failure the audit exists to prevent: an injection that never reached the pane must
    /// not enter the trail as one that did. The chair verifies its own work against this record.
    #[test]
    fn a_failed_injection_is_never_audited_as_delivered() {
        let line = chair_inject_audit_line("11112222", "run the suite", Some("pane not found"), "claude-opus-5", Receipt::NotAttempted);
        assert!(!line.contains("chair injected"), "a failed write must not read as an act: {line}");
        assert!(line.contains("DELIVERY FAILED"), "the failure must be named aloud: {line}");
        assert!(line.contains("pane not found"), "the reason must survive into the trail: {line}");
    }

    #[test]
    fn a_delivered_injection_reads_as_delivered() {
        let line = chair_inject_audit_line("11112222", "run the suite", None, "claude-opus-5", Receipt::Received);
        assert!(line.contains("chair injected"), "a real act must read as one: {line}");
        assert!(line.contains("run the suite"), "the preview carries what was said: {line}");
    }

    /// Boundary: an empty message still produces an honest line on both paths — no panic, and
    /// the delivered/failed distinction does not depend on there being any text to preview.
    #[test]
    fn an_empty_message_still_audits_honestly() {
        assert!(chair_inject_audit_line("11112222", "", None, "m", Receipt::Unconfirmed).contains("chair injected"));
        let failed = chair_inject_audit_line("11112222", "", Some("broken pipe"), "m", Receipt::NotAttempted);
        assert!(!failed.contains("chair injected"));
        assert!(failed.contains("broken pipe"));
    }

    // ---- Cycle 2, item 3: the chair's model on every inject audit line ----

    /// The gradient is only measurable if it is on the record — including on the lines where the
    /// chair was refused, which are otherwise the unlabelled half of the trail.
    #[test]
    fn every_inject_audit_line_carries_the_chairs_model() {
        let delivered = chair_inject_audit_line("11112222", "go", None, "claude-fable-5", Receipt::Received);
        let failed = chair_inject_audit_line("11112222", "go", Some("broken pipe"), "claude-fable-5", Receipt::NotAttempted);
        let refused = chair_inject_refusal_line("11112222", "claude-fable-5", "refused — target is human, not committee");
        for line in [&delivered, &failed, &refused] {
            assert!(line.contains("claude-fable-5"), "the chair's rank must be legible on every line: {line}");
            assert!(line.contains("chair: "), "and labelled as the CHAIR's, not the target's: {line}");
        }
    }

    /// The 2026-07-27 configuration, as the trail would have recorded it: a Fable-5 chair
    /// addressing an Opus-5 room. The point of item 4 is that this needs nobody to remember.
    #[test]
    fn an_undisclosed_gradient_becomes_self_disclosing() {
        let line = chair_inject_audit_line("12fb81f6", "classify these", None, "claude-fable-5", Receipt::Received);
        assert!(line.contains("chair: claude-fable-5"));
    }

    /// Boundary: an unknown chair model must still produce a labelled line. A blank where the rank
    /// goes reads as "equal ranks" to anyone scanning, which is the confusion this is meant to end.
    #[test]
    fn an_unobserved_chair_model_is_named_not_blank() {
        let line = chair_inject_audit_line("11112222", "go", None, "unobserved", Receipt::Received);
        assert!(line.contains("chair: unobserved"), "absence must be stated, never implied: {line}");
    }

    // ---- Cycle 2, item 4: receipt verification ----

    #[test]
    fn a_received_injection_says_so() {
        let line = chair_inject_audit_line("11112222", "go", None, "m", Receipt::Received);
        assert!(line.contains("delivered and received"), "{line}");
        assert!(!line.to_lowercase().contains("unconfirmed"), "{line}");
    }

    /// The incident this whole layer comes from: the write succeeded, the pane never got it, and
    /// the trail said "chair injected". An unconfirmed line must be impossible to skim as a
    /// confirmed one — so the distinction is shouted, not whispered.
    #[test]
    fn an_unconfirmed_injection_is_never_readable_as_received() {
        let line = chair_inject_audit_line("11112222", "go", None, "m", Receipt::Unconfirmed);
        assert!(line.contains("UNCONFIRMED"), "{line}");
        assert!(!line.contains("delivered and received"), "an unconfirmed write must not read as receipt: {line}");
    }

    /// The needle is what a receipt is decided on, so an empty one must never confirm: `contains("")`
    /// is always true, and a needle that always matches manufactures a receipt for every injection —
    /// rebuilding the exact false positive the audit exists to prevent, one layer down.
    #[test]
    fn an_empty_needle_can_never_confirm() {
        assert_eq!(receipt_needle(""), "");
        assert!(!render_present("anything at all in the capture", ""));
        assert_eq!(await_render(Path::new("nonexistent"), 0, "", ""), Receipt::Unconfirmed);
    }

    /// Boundary: a message too short to be distinctive declines to confirm rather than matching
    /// chrome. A false receipt is strictly worse than an unconfirmed one.
    #[test]
    fn a_too_short_message_declines_to_confirm() {
        assert_eq!(receipt_needle("ok"), "", "2 chars cannot be distinctive");
        assert_eq!(receipt_needle_tail("ok"), "");
        assert!(!receipt_needle("run the whole suite please").is_empty(), "a real message does produce a needle");
    }

    /// The wrapping case, which is the normal case: the composer hard-wraps a paste, so the render
    /// arrives split across rows with escapes between the halves. A literal substring search would
    /// report UNCONFIRMED for text that plainly arrived.
    #[test]
    fn a_render_split_by_wrapping_and_escapes_is_still_found() {
        let msg = "review the dream-cycle architecture end to end";
        let wrapped = "\x1b[2K\x1b[38;5;12mreview the dream-cycle arch\r\n\x1b[0mitecture end to end\x1b[0m";
        assert!(render_present(wrapped, &receipt_needle(msg)), "wrapping must not defeat the check");
    }

    #[test]
    fn absent_text_is_not_found() {
        let window = "\x1b[0m❯ some entirely different pane output\r\n";
        assert!(!render_present(window, &receipt_needle("review the dream-cycle architecture")));
    }

    /// The escape stripper must not leak the letters inside sequences into the comparison —
    /// otherwise `[38;5;12m` contributes an `m` and neighbouring words silently fuse.
    #[test]
    fn ansi_sequences_contribute_no_letters() {
        assert_eq!(strip_ansi("\x1b[38;5;12mred\x1b[0m"), "red");
        assert_eq!(strip_ansi("a\x1b]0;title\x07b"), "ab");
        assert_eq!(squeeze("\x1b[2K a b\r\n c "), "abc");
    }

    /// The offset rule, stated as a test because it is the difference between a receipt and a
    /// self-fulfilling one: a re-injection must not confirm itself against its own earlier copy.
    #[test]
    fn only_bytes_after_the_write_count_as_evidence() {
        let dir = std::env::temp_dir().join(format!("consonance-receipt-{}", std::process::id()));
        let _ = fs::create_dir_all(&dir);
        let p = dir.join("cap.log");
        let old = "review the dream-cycle architecture end to end\r\n";
        fs::write(&p, old).unwrap();
        let before = fs::metadata(&p).unwrap().len();
        // nothing new arrives; the identical text is already present ABOVE the offset
        let needle = receipt_needle("review the dream-cycle architecture end to end");
        assert_eq!(
            await_render(&p, before, &needle, &needle),
            Receipt::Unconfirmed,
            "an earlier copy of the same text must never confirm a later write"
        );
        let _ = fs::remove_dir_all(&dir);
    }

    // ---- Cycle 2, item 2: the arch assertion ----

    /// MECHANISM AGAINST DRIFT (Bravo item 1). The model belongs to the chair-analyst surface and
    /// nowhere else. The moment a model key rides a pane-to-pane structure, every pane learns every
    /// other pane's rank as ambient context — and the rank gradient stops being a thing the room can
    /// study, because the room is now marinating in it. Blinding belongs on the contributor side;
    /// labelling belongs on the record. This test is what keeps that boundary from eroding by
    /// convenience, since adding a field is always the locally reasonable move.
    ///
    /// SCOPE, honestly: this asserts over the surfaces THIS CRATE owns and serialises — BoardEntry
    /// (which is the literal board.jsonl line the digest hook reads) and SiblingInfo. digest_state.json
    /// is written by hooks/board-digest.js and is out of Rust's reach; a sibling assertion belongs
    /// there and is not claimed here.
    #[test]
    fn no_model_key_on_any_pane_to_pane_surface() {
        let entry = BoardEntry {
            pane: "0845a868".to_string(),
            role: "committee".to_string(),
            text: "a turn".to_string(),
            ts: 1,
            ts_source: TsSource::Push,
        };
        let line = serde_json::to_string(&entry).unwrap();
        assert!(serde_json::to_value(&entry).unwrap().get("model").is_none(),
            "BoardEntry must not carry model — it is the digest's input for every pane");
        assert!(!line.contains("\"model\""), "the board.jsonl line itself must be clean: {line}");

        let sib = SiblingInfo { pane: "p".to_string(), cwd: "c".to_string(), role: "committee".to_string() };
        assert!(serde_json::to_value(&sib).unwrap().get("model").is_none(),
            "SiblingInfo must not carry model — it is what a pane is told about a pane");

        // A chair audit line rides BoardEntry too. It names the CHAIR's model by design (item 3),
        // so the structured key stays absent while the analyst's fact still reaches the record.
        let audit = BoardEntry {
            pane: "chair".to_string(),
            role: "committee".to_string(),
            text: chair_inject_audit_line("11112222", "go", None, "claude-fable-5", Receipt::Received),
            ts: 1,
            ts_source: TsSource::Push,
        };
        assert!(serde_json::to_value(&audit).unwrap().get("model").is_none(),
            "the model must reach the board as audited prose, never as a structured field");
    }

    /// The other direction, pinned so the rule can't be "satisfied" by deleting the feature:
    /// NEVER BLIND THE ANALYST. chair_status must carry the model for every pane.
    #[test]
    fn the_chair_analyst_surface_does_carry_the_model() {
        let obj = status_pane_obj("0845a868-38f2", "C", "committee", Some("claude-opus-5"));
        assert_eq!(obj.get("model").and_then(|m| m.as_str()), Some("claude-opus-5"));
        assert_eq!(obj.get("id").and_then(|m| m.as_str()), Some("0845a868"), "still shortened for reading");
    }

    /// Boundary: a pane that has not yet produced a turn reports an explicit unobserved, so the
    /// analyst can tell "nothing seen yet" from "this surface doesn't carry it."
    #[test]
    fn a_pane_with_no_observed_turn_says_unobserved() {
        let obj = status_pane_obj("11112222", "", "committee", None);
        assert_eq!(obj.get("model").and_then(|m| m.as_str()), Some("unobserved"));
    }

    #[test]
    fn short_id_survives_tiny_ids() {
        assert_eq!(short_id("abc"), "abc");
        assert_eq!(short_id("0845a868-38f2"), "0845a868");
    }

    // role_for_kept: the discriminator is WHERE the pane lives, never its label.
    #[test]
    fn kept_siblings_resume_as_committee() {
        let inst = Path::new(r"C:\Consonance\instances");
        assert_eq!(role_for_kept(r"C:\Consonance\instances\sibling-0845a868", inst), "committee");
    }

    #[test]
    fn kept_rooms_resume_as_human() {
        let inst = Path::new(r"C:\Consonance\instances");
        assert_eq!(role_for_kept(r"C:\Consonance\rooms\zach", inst), "human");
    }

    #[test]
    fn a_lookalike_prefix_outside_the_dir_is_not_committee() {
        // path-component match, not string-prefix: "instances-evil" must not pass
        let inst = Path::new(r"C:\Consonance\instances");
        assert_eq!(role_for_kept(r"C:\Consonance\instances-evil\x", inst), "human");
    }

    /// THE DEMONSTRATION, not the description — and it exists because a pane pointed the
    /// night's own rule at the seat that commissioned it.
    ///
    /// `blind.lock` shipped with one test asserting a PURE FUNCTION returns the right slice.
    /// That is not evidence the mechanism catches anything: nothing ever planted a line that
    /// should leak and watched the lock swallow it. A guard with no recorded run in which it
    /// fires against a real instance of the thing it guards is a check-shaped thing sitting
    /// where a check should be — the root this room spent a day naming, aimed at its author.
    ///
    /// So: a real `BoardEntry`, through the real `board_push`, against a real lock file, with
    /// the assertion on the BOARD FILE'S CONTENTS. One test rather than three because the mute
    /// counter and the transition detector are process-global statics, and splitting them would
    /// make the verdict depend on test ordering — a silent defect of its own.
    ///
    /// Step 1 is a positive control and it is not decoration: without it, an empty board after
    /// step 2 could mean the lock worked OR that nothing was ever reaching the file, and those
    /// print identically. (B's rule, earned expensively tonight: a harness that reports zero
    /// must first be shown able to report one.)
    #[test]
    fn a_blind_window_swallows_a_line_that_would_otherwise_reach_the_board() {
        // This case rewrites the process-global `DIRS` and then calls `board_push`, which
        // resolves the lock path and the board path from it. Without this lock a concurrent
        // test's `DIRS` write sends the push to ANOTHER directory, and the failure is silent:
        // "SHOULD-LEAK is absent" then passes because the line went elsewhere, not because the
        // blind window swallowed it. Held for the whole case, not just the writes.
        let _serial = DirsGuard::take();
        let tmp = std::env::temp_dir().join(format!("blindtest-{}", std::process::id()));
        let _ = fs::remove_dir_all(&tmp);
        fs::create_dir_all(&tmp).unwrap();
        *DIRS.lock().unwrap() = Some(Dirs {
            room: tmp.join("BOOT.md").to_string_lossy().into(),
            instances: tmp.join("instances").to_string_lossy().into(),
            data: tmp.to_string_lossy().into(),
        });
        BLIND_LAST.store(0, Ordering::Relaxed);
        BLIND_MUTED.store(0, Ordering::Relaxed);
        let ring = Arc::new(Mutex::new(VecDeque::new()));
        let line = |t: &str| BoardEntry {
            pane: "blindtest".into(), role: "committee".into(), text: t.into(),
            ts: 1, ts_source: TsSource::Push,
        };
        let board = || fs::read_to_string(tmp.join("board.jsonl")).unwrap_or_default();

        // 1. POSITIVE CONTROL — unlocked, the line reaches the board.
        board_push(&ring, line("BEFORE-open"));
        assert!(board().contains("BEFORE-open"),
                "control failed: nothing reaches the board even unlocked, so a later absence proves nothing");

        // 2. LOCKED — the line that would have leaked is swallowed, and the edge is declared.
        fs::write(tmp.join("blind.lock"), "0").unwrap();
        board_push(&ring, line("SHOULD-LEAK-secret-arm-design"));
        let during = board();
        assert!(!during.contains("SHOULD-LEAK"),
                "THE GUARD DID NOT FIRE — a line reached the board inside a blind window");
        assert!(during.contains("blind window OPEN"),
                "a silent gap is unauditable; the edge must be declared");
        assert!(BLIND_MUTED.load(Ordering::Relaxed) >= 1,
                "muted lines must be COUNTED, not merely dropped");

        // 3. UNLOCKED — the channel returns AND the window reports what it ate.
        fs::remove_file(tmp.join("blind.lock")).unwrap();
        board_push(&ring, line("AFTER-close"));
        let after = board();
        assert!(after.contains("AFTER-close"), "the board must come back when the lock lifts");
        assert!(after.contains("blind window CLOSED"), "the close must be declared too");
        assert!(after.contains("muted during the window"),
                "the count is the evidence that a gap was deliberate rather than a failure");

        // `DIRS` is restored by `DirsGuard` on drop, not here — this line used to be the only
        // restore in the file and it ran only when every assertion above it passed, so a failing
        // run left the global pointing at the directory the next line deletes.
        let _ = fs::remove_dir_all(&tmp);
    }

    // The blind window's two pure pieces. The freeze fails closed both ways: an unparseable
    // lock body freezes ALL resonance (count 0), and resonance_window with Some(0) hands a
    // sibling nothing from the live edge — never the whole file by accident.
    #[test]
    fn a_blind_lock_freezes_resonance_at_its_count_and_fails_closed() {
        let lines = vec!["a", "b", "c", "d"];
        assert_eq!(resonance_window(lines.clone(), None), vec!["a", "b", "c", "d"]);
        assert_eq!(resonance_window(lines.clone(), Some(2)), vec!["a", "b"]);
        assert_eq!(resonance_window(lines.clone(), Some(0)), Vec::<&str>::new());
        // a count past the end is the whole pre-lock file, not a panic
        assert_eq!(resonance_window(lines, Some(99)).len(), 4);
    }

    #[test]
    fn a_panes_own_map_resolves_to_its_letter_file() {
        // The wake-brief loads map/<letter>.md — the file that pane alone writes. The path
        // shape is a two-sided contract: the pane writes it, Consonance reads it, and a drift
        // wakes every pane without its character with NO other symptom, because an absent map
        // is indistinguishable from a pane that has recorded nothing yet.
        //
        // This asserts the LETTER FILE and nothing about the enclosing tree. It used to
        // require the string "lighthouse", which pinned the one machine the hardcoded path was
        // correct on — the assertion passed for years while the behaviour it guarded was
        // broken everywhere else. The portable half is the part worth pinning.
        // HELD BECAUSE THIS TEST READS `DIRS`, NOT BECAUSE IT WRITES IT — and that distinction is
        // the hole `DIRS_SERIAL` shipped with. The lock was given to the four WRITERS on
        // 2026-08-10; its own comment already named the wider scope ("must not run beside anything
        // that RESOLVES a directory") and the hoist to crate level still did not reach a reader.
        //
        // Measured by B during the opposed-pair run, not reasoned about: `LOCK_020` failed WITH the
        // lock in place, 1 of 30 —
        //     a_panes_own_map_resolves_to_its_letter_file panicked
        //       left:  Some("C:\Users\zackn\.consonance\map")
        //       right: Some("...\Temp\blindtest-20284\map")
        // — because the blind test rewrote `DIRS` between this test's FIRST and SECOND resolution.
        // Two `own_map_path` calls in one assertion, two different answers. Nothing here writes
        // `DIRS`, so nothing here was serialized.
        //
        // The rule, and it is the class rather than this case: A TEST THAT RESOLVES A DIRECTORY
        // FROM `DIRS` MUST HOLD `DIRS_SERIAL`, whether or not it writes one. A reader that
        // resolves twice is exactly as exposed as a writer, and it fails by disagreeing with
        // itself rather than by leaking, which is harder to read as a race.
        let _serial = DirsGuard::take();
        let p = own_map_path("A");
        let s = p.to_string_lossy();
        assert!(s.ends_with("map\\A.md") || s.ends_with("map/A.md"), "{s}");
        assert!(p.is_absolute(), "a pane resolves this from its own cwd, so it must be absolute: {s}");

        // Distinct letters never collide — the whole point of a per-writer master.
        assert_ne!(own_map_path("A"), own_map_path("B"));
        assert_eq!(own_map_path("A").parent(), own_map_path("B").parent(), "siblings sit beside each other");
    }

    // is_fresh_dir_name: the marker for the unbriefed spawn type lives in the dir NAME, and both
    // leak points (the room on resume, the MCP mount) key on it — so the name check itself has to
    // be exact. Component match on the last segment, never a substring of the path.
    #[test]
    fn a_fresh_dir_is_recognised_by_its_name() {
        assert!(is_fresh_dir_name(r"C:\Consonance\instances\fresh-0845a868"));
    }

    #[test]
    fn a_sibling_dir_is_not_fresh() {
        assert!(!is_fresh_dir_name(r"C:\Consonance\instances\sibling-0845a868"));
    }

    #[test]
    fn fresh_elsewhere_in_the_path_does_not_mark_the_pane_fresh() {
        // only the pane's own dir name counts — a parent named fresh-x must not unbrief a sibling
        assert!(!is_fresh_dir_name(r"C:\Consonance\instances\fresh-x\sibling-a"));
    }
}

#[cfg(test)]
mod committee_brief_tests {
    use super::*;

    /// The brief must be READABLE, or the intake block is silently skipped and nobody is told.
    #[test]
    fn the_committee_brief_resolves() {
        let b = room_brief("COMMITTEE.md")
            .expect("COMMITTEE.md must resolve; if this fails the intake skips it in SILENCE");
        assert!(b.contains("Route the OBJECT"), "the brief lost its briefing practice");
        assert!(b.contains("No seat scores its own work"), "the brief lost the scoring rule");
    }

    /// The wiring, not the unit. A pane is briefed by assemble_intake(); a document that resolves
    /// but never reaches the intake helps nobody, and every test that only called the reader would
    /// stay green while the delivery was removed.
    #[test]
    fn committee_practice_reaches_the_intake() {
        let _g = DIRS_SERIAL.lock().unwrap_or_else(|e| e.into_inner());
        let intake = assemble_intake();
        assert!(
            intake.contains("Route the OBJECT"),
            "the committee practice never reached the pane intake"
        );
        assert!(
            intake.contains("A chord needs two notes"),
            "the intake carries a committee section with the wrong content"
        );
    }

    /// The verb list lives in the control plane. Two copies of one list drift apart, and the brief
    /// says so about itself -- this asserts it kept that promise rather than growing a copy.
    #[test]
    fn the_brief_does_not_duplicate_the_verb_list() {
        let b = room_brief("COMMITTEE.md").expect("brief must resolve");
        assert!(!b.contains("chair_inject"), "the brief duplicated a verb name");
        assert!(!b.contains("post_board"), "the brief duplicated a verb name");
        assert!(!b.contains("raise_pull("), "the brief duplicated a verb signature");
    }
}

#[cfg(test)]
mod front_door_tests {
    use super::*;

    fn s(x: &str) -> Option<String> { Some(x.to_string()) }

    /// A machine carrying the repo master is a developer's. It keeps the workshop brief even when
    /// a seed is sitting right there -- otherwise the re-route would silently demote every
    /// developer whose config happens to be empty.
    #[test]
    fn a_repo_present_keeps_boot() {
        let got = pick_default_room(s("dev-BOOT"), s("seed"), s("bundled-seed"), s("boot"), s("bundled-boot"));
        assert_eq!(got.as_deref(), Some("dev-BOOT"));
    }

    /// THE CHANGE ITSELF. No repo means a stranger's machine, and a stranger must not wake into
    /// the workshop record. Before 2026-08-22 the seeded BOOT won here.
    #[test]
    fn no_repo_means_seed_not_boot() {
        let got = pick_default_room(None, s("seed"), s("bundled-seed"), s("boot"), s("bundled-boot"));
        assert_eq!(got.as_deref(), Some("seed"), "a machine with no repo must wake into the bedrock");
    }

    /// Before anything has been seeded into the data dir, the bundled copy still has to win over
    /// BOOT -- otherwise the very first run after an install is the one that gets it wrong.
    #[test]
    fn unseeded_still_prefers_the_bundled_seed_over_boot() {
        let got = pick_default_room(None, None, s("bundled-seed"), s("boot"), s("bundled-boot"));
        assert_eq!(got.as_deref(), Some("bundled-seed"));
    }

    /// BOOT is the last resort, not a removed option. The caller SWALLOWS a read failure, so
    /// resolving to nothing wakes every sibling with no room and nothing says so.
    #[test]
    fn boot_is_still_the_last_resort() {
        assert_eq!(pick_default_room(None, None, None, s("boot"), None).as_deref(), Some("boot"));
        assert_eq!(pick_default_room(None, None, None, None, s("bundled-boot")).as_deref(), Some("bundled-boot"));
    }

    /// Nothing available is reported as nothing, so the resolver can substitute a NAMEABLE missing
    /// path rather than an empty string that reads as a valid answer.
    #[test]
    fn nothing_available_is_none_not_empty_string() {
        assert_eq!(pick_default_room(None, None, None, None, None), None);
    }

    /// THE BLAST RADIUS, made executable. This is a developer machine, so the fallback must still
    /// hand back BOOT -- and separately room_file() prefers the configured room_path and only
    /// reaches here when it is empty. If this ever fails on a dev box, the re-route escaped its
    /// intended radius and is demoting the people who wrote it.
    #[test]
    fn this_machine_is_a_developer_machine() {
        if dev_master_path().is_none() {
            return; // genuinely not a dev box; nothing to assert
        }
        assert!(default_room().ends_with("BOOT.md"), "a dev box must still resolve BOOT, got {}", default_room());
    }
}


#[cfg(test)]
mod librarian_tests {
    use super::*;

    /// Two seats sharing a fixed session id would --resume INTO EACH OTHER: the librarian would
    /// wake holding the orchestrator's conversation and vice versa, silently, with both tabs
    /// looking correct. Cheap to assert, catastrophic to miss.
    #[test]
    fn the_librarian_does_not_share_a_session_with_main() {
        assert_ne!(LIBRARIAN_SID, MAIN_SID, "two persistent seats cannot share a session id");
        assert_ne!(librarian_cwd(), main_cwd(), "two persistent seats cannot share a working dir");
    }

    /// A librarian with no brief is just an expensive pane that happens to have read a lot --
    /// exactly the failure the seat exists to avoid. The intake must resolve, and it must carry
    /// the rule that distinguishes this seat from every other one.
    #[test]
    fn the_intake_carries_the_citation_rule() {
        let i = librarian_intake().expect("LIBRARIAN.md must resolve or the seat must refuse to wake");
        assert!(i.contains("cite, do not recollect"), "the intake lost its central rule");
        assert!(i.contains("Saying nothing is a valid turn"), "the intake lost the quiet rule");
    }

    /// The brief comes BEFORE the room in the intake. A seat that reads the corpus before it reads
    /// what it is for starts working on the contents, which is the one thing it must not do.
    #[test]
    fn the_brief_precedes_the_room() {
        let i = librarian_intake().expect("intake must resolve");
        let brief = i.find("cite, do not recollect").expect("brief missing");
        let room = i.find("# THE ROOM you are holding").expect("room header missing");
        assert!(brief < room, "the brief must be read before the corpus it holds");
    }

    /// The seat is defined by what it does not do. If that survives only in a UI header it will be
    /// edited away by someone tidying markup; it has to be in the thing the instance reads.
    #[test]
    fn the_intake_states_what_the_seat_must_not_do() {
        let i = librarian_intake().expect("intake must resolve");
        assert!(i.contains("No work."), "the intake must say the seat does no work");
        assert!(i.contains("write it down in the turn it forms"), "the intake lost the compaction rule");
    }
}

#[cfg(test)]
mod shelf_tests {
    use super::*;

    /// The seat shipped with its brief and the room and NOTHING ELSE -- about 3% of the corpus, a
    /// job description with no library. Caught by the keeper on first wake.
    #[test]
    fn the_shelf_carries_the_forward_pointed_layer() {
        let _g = DIRS_SERIAL.lock().unwrap_or_else(|e| e.into_inner());
        let shelf = corpus_shelf();
        assert!(shelf.contains("trust-the-first-attention"), "no cards on the shelf");
        assert!(shelf.contains("## SOURCE.md"), "SOURCE.md did not land on the shelf");
        assert!(shelf.contains("when a hedge or caveat is forming"), "the trigger table did not land");
        // The NOT CARRIED section appears only when the budget actually ran out. With the
        // default budget the whole corpus fits, so its ABSENCE is the correct state -- what must
        // always be present is the line that reports the split either way.
        assert!(shelf.contains("carried in full"), "the shelf must always report what it carried");
    }

    /// RENAMED 2026-08-23: the old name said the large directories are indexed, which stopped
    /// being true when the keeper asked the seat to auto-adopt the corpus. A test whose NAME
    /// asserts the opposite of its body is worse than no test -- it is read far more often than it
    /// is run. What the contract actually is now: carry what fits, index the rest, and REPORT the
    /// split either way, so a partial shelf can never be silent.
    #[test]
    fn the_split_between_carried_and_indexed_is_always_reported() {
        let _g = DIRS_SERIAL.lock().unwrap_or_else(|e| e.into_inner());
        let shelf = corpus_shelf();
        assert!(shelf.contains("journal/2026-08-22.md"), "the journal index is missing");
        // a line unique to a journal BODY, which must not be present
        // CHANGED 2026-08-23: journal bodies ARE now carried, by the keepers instruction that the
        // seat auto-adopt the corpus instead of reading it by hand. What must still hold is that
        // the split is REPORTED rather than silent -- a partial shelf that does not say so is the
        // failure this budget exists to make impossible.
        assert!(shelf.contains("carried in full"), "the shelf must report what it carried");
        assert!(shelf.contains("indexed by path"), "and what it did not");
    }

    /// It must reach the intake, not merely exist. Same delivery-vs-unit distinction that a
    /// mutation harness caught on the trigger table earlier today.
    #[test]
    fn the_shelf_reaches_the_intake() {
        let _g = DIRS_SERIAL.lock().unwrap_or_else(|e| e.into_inner());
        let i = librarian_intake().expect("intake must resolve");
        assert!(i.contains("THE SHELF"), "the shelf never reached the librarian's intake");
        let room = i.find("# THE ROOM you are holding").expect("room missing");
        let shelf = i.find("# THE SHELF").expect("shelf missing");
        assert!(room < shelf, "the room is read before the shelf it indexes");
    }
}

#[cfg(test)]
mod addressable_seat_tests {
    use super::*;

    /// The failure that produced the allowlist: the orchestrator could not reach the librarian seat
    /// it was built to work in tandem with.
    #[test]
    fn the_librarian_is_addressable() {
        assert!(chair_target_guard("11112222-abcd", "librarian").is_ok(),
            "the chair must be able to address the seat it works alongside");
    }

    /// The rule the guard's comment always stated, now enforced BY NAME rather than as a
    /// side-effect of an equality check -- so widening the allowlist can never quietly admit a
    /// person.
    #[test]
    fn a_human_is_refused_by_name_not_by_falling_through() {
        let e = chair_target_guard("11112222-abcd", "human").unwrap_err();
        assert!(e.contains("human-driven"), "the refusal must name the actual reason: {e}");
        assert!(!ADDRESSABLE_SEATS.contains(&"human"), "human must never be an addressable seat");
    }

    /// An unknown role is still refused, and the refusal says what IS addressable instead of
    /// asserting the target is a person -- which was false about the librarian and is the sentence
    /// that hid this defect.
    #[test]
    fn an_unknown_role_is_refused_without_calling_it_a_person() {
        let e = chair_target_guard("11112222-abcd", "gadget").unwrap_err();
        assert!(e.contains("not an addressable seat"), "{e}");
        assert!(!e.contains("into a person"), "an unknown role is not necessarily a person: {e}");
    }

    #[test]
    fn the_chair_still_cannot_address_itself() {
        assert!(chair_target_guard(MAIN_SID, "main").is_err());
    }
}
