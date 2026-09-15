//! PULL, VERIFY, THEN START — and the retire rule that keeps a machine from waking as its own past.
//!
//! P-SYNC-AT-LAUNCH + P-RETIRE. Pane C, L052, 2026-09-09.
//! Packet: `exo_memory/loop/packet_sync_launch_retire_2026-09-09.md`.
//!
//! ---------------------------------------------------------------------------------------------
//! THE FAILURE THIS EXISTS TO PREVENT, and it is silent
//!
//! Main (`MAIN_SID`), the Librarian (`LIBRARIAN_SID`) and the Third Place (`THIRD_PLACE_SID`) have
//! HARD-CODED session ids, and each of the three spawn paths decides `resume` by asking whether
//! `~/.claude/projects/<encoded cwd>/<sid>.jsonl` exists. On a second machine that file exists too
//! — written by THAT machine's own past. So `--resume` finds it, the seat wakes, it has history,
//! it talks, and nobody notices until it contradicts something. **A plausible success over a wrong
//! source**, which is the same class as the offsets defect (`handback/p-board-replay_2026-09-09.md`:
//! a read that ran before `set_dirs` and used the default directory for six weeks).
//!
//! ---------------------------------------------------------------------------------------------
//! THE ORDER, and the apparent contradiction in the packet, resolved
//!
//! The plan says the pull runs "before `set_dirs` reads anything" AND "after the resolver". Both,
//! because `set_dirs` is not a read — it is the resolver. The rule is three steps, not two:
//!
//!     RESOLVE  (set_dirs)   — decide where the data dir IS
//!     FILL     (--pull)     — put the record there
//!     READ     (everything) — offsets, seeds, seats
//!
//! The offsets bug was a READ before the RESOLVE. A partial pull that proceeds would be a READ
//! before the FILL — the same hazard with a network in the middle, and the larger sibling of it:
//! a seat waking from a half-arrived record and announcing it is in sync.
//!
//! ---------------------------------------------------------------------------------------------
//! THE RULING ON REFUSING TO START — asked for in §8 of the packet, and the answer is NO
//!
//! Refuse-to-start is correct for the record and catastrophic for the keeper: a bad link at 08:00
//! and Consonance opens on neither machine. Nothing here can produce that. The verdicts below never
//! contain a lockout — they differ in WHAT THE HOUSE IS when it opens, never in whether it opens.
//!
//! The same ruling was reached independently by pane E for the live-host guard
//! (`consonance/tools/live-host.js`, "THE FAILURE DIRECTION"), from the precedent already in
//! `main.rs`: `claim_named_singleton` fails OPEN when it cannot tell, because "a launcher bug must
//! never be able to make the app permanently unstartable, and the cost of a second instance is
//! recoverable while the cost of no instance is not." Two seats, two surfaces, one answer. It is
//! cited rather than re-derived because agreement arrived at twice is worth more than a rule
//! written once, and because if E's ruling is ever reversed this one must be revisited with it.
//!
//! **The third shape the packet asked for is `ReadOnly`, and its scope is exact: the window opens,
//! the seats do not wake.** Not a general write-lock — see `READ-ONLY IS ENFORCED AT THE SPAWNS`
//! below for why that is sufficient, argued by enumeration rather than assumed.
//!
//! ---------------------------------------------------------------------------------------------
//! WHY THE DANGEROUS STATE IS RARE, AND WHOSE JOB THAT IS
//!
//! `ReadOnly` exists for one condition only: **the data dir may be half-promoted.** If a pull can
//! write a hundred files into `data\` and stop at the fiftieth, there is no intact local house to
//! fall back on, and starting means starting on a chimera.
//!
//! That state should not be reachable, and removing it is A's, not mine: **`--pull` must fetch and
//! verify into the state checkout and only then promote into `data\`, all-or-nothing.** With an
//! atomic promotion, "partial pull" means "the promotion did not happen" and the local house is
//! untouched and startable — which is `LocalHouse`, not `ReadOnly`. The journal below exists
//! because I cannot verify that A's tool has that property, and an absence has no author.

use std::collections::HashMap;
use std::path::{Path, PathBuf};

// ---------------------------------------------------------------------------------------------
// THE FILES THIS DECISION READS. Named here so there is one place to change them, and so the
// hand-back can hand A and E an exact list rather than a description of one.

/// Written by `state-sync.js --pull`, MACHINE-LOCAL (A's manifest classes it STAYS, and reserved
/// this exact name for this seat). It answers "did THIS machine's pull complete and verify".
pub const COMPLETION_FILE: &str = "sync-completion.json";

/// Created by `state-sync.js --pull` BEFORE the first byte lands in the data dir and removed after
/// the last. Its presence at launch means a promotion began and never recorded finishing.
///
/// A journal, not a lock: it does not prevent anything, it REMEMBERS. The distinction matters
/// because the thing being detected already happened — the writer is gone.
pub const PROMOTION_JOURNAL: &str = "sync-promotion.open";

/// Machine-local, written by US: the state-repo head this machine last adopted, and when.
/// Not in A's manifest yet — see the hand-back; the checker will flag it UNPLACED, which is the
/// correct loud outcome and better than a rule that covers a name nobody chose.
pub const ADOPTED_FILE: &str = "sync-adopted.json";

/// E's cross-machine record (A's manifest: TRAVELS). Optional here on purpose — the retire
/// decision must work at 08:00, and E's Rust lands at a later rebuild.
pub const LIVE_HOST_FILE: &str = "live_host.json";

// ---------------------------------------------------------------------------------------------
// THE FACTS. Every one is an argument; nothing in this module reads a clock, a disk or a network
// except through the explicitly-named helpers below, which take their paths.

/// What happened when we asked the sync tool to fill the data dir.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Pull {
    /// `state-sync.js` is not on disk. This machine is not in the sync — today's world.
    ToolAbsent,
    /// We could not run it at all (no `node`, spawn failed). Named, never silent.
    CouldNotRun(String),
    /// It ran and exited 0.
    Ok,
    /// It ran and exited non-zero, or was killed at the timeout.
    Failed(String),
}

/// `sync-completion.json` as `state-sync.js` actually writes it (A, `writeCompletion`).
///
/// THIS SCHEMA IS A's, NOT A GUESS, AND THE DIFFERENCE MATTERED. The first version of this struct
/// was written against a contract I invented before A's tool existed (`ok` / `commit` /
/// `head_host`). A's record splits the claim in two — `verified` and `installed` — and A's own
/// comment says why: *"a set that verified and never reached the data dir is the quiet
/// half-arrival this packet exists to prevent, and a launcher that only asks 'verified?' would
/// start on it."* A launcher reading my invented field would have found nothing, defaulted to
/// false, and reached a safe verdict FOR THE WRONG REASON — which is a green light nobody could
/// have debugged the day it went amber.
///
/// Every field is `Option` or defaults to the withholding value: a field A renames must degrade to
/// a named unknown, never to a confident wrong answer.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct Completion {
    /// The pulled tree passed the manifest's completeness check.
    pub verified: bool,
    /// The verified tree was written INTO the data dir. Verified-and-not-installed is the record
    /// sitting in the state checkout, having never arrived.
    pub installed: bool,
    /// `"verify"`, `"install"` or `"done"`. `"install"` with `installed: false` is the one state
    /// that means the data dir was PARTLY written: `installTree` copies file by file.
    pub stage: Option<String>,
    /// A's reason for a failure, carried through to the board row rather than restated.
    pub why: Option<String>,
    /// The state-repo head this pull brought in (short sha).
    pub head: Option<String>,
    /// `index.machine` — THE MACHINE THAT AUTHORED THE HEAD, and the one field the retire decision
    /// really wants. A supplies it; the degraded path below survives without it anyway.
    pub pushed_by: Option<String>,
    /// `machineTag()` evaluated on THIS machine, by A's resolver, at pull time.
    ///
    /// THIS FIELD IS WHY THE COMPARISON IS SAFE, and it replaced a bug I had already written.
    /// `pushed_by` and the self-id must come from ONE resolver or they drift, and mine had drifted
    /// already: A's cascade ends at `os.hostname()`, mine ended at `None`, and `desktop-install.ps1`
    /// sets no `machine_tag` at all — so on the desktop A would have written a hostname while this
    /// side returned nothing, and the self-check would never have fired. Taking BOTH sides of the
    /// equality out of the same record removes the whole class: whatever A calls this machine is
    /// what it is compared against.
    pub machine: Option<String>,
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct Facts {
    pub pull: Option<Pull>,
    pub completion: Option<Completion>,
    /// `sync-promotion.open` was present at launch.
    pub promotion_open: bool,
    /// This machine's identity. NOT a hostname: hostnames get renamed and collide (E's reasoning
    /// at `live-host.js`, IDENTITY). `None` is UNKNOWN and is never read as "self".
    pub self_id: Option<String>,
    /// The head this machine adopted at its last non-migrating launch, if any.
    pub adopted_commit: Option<String>,
    /// `live_host.json`'s last holder, when E's file is there. Corroboration, never the only voice.
    pub live_host: Option<String>,
}

impl Facts {
    pub fn pull(&self) -> &Pull {
        self.pull.as_ref().unwrap_or(&Pull::ToolAbsent)
    }
}

/// What the house IS when the window opens. **None of these is a lockout.**
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Verdict {
    /// Not in the sync. Exactly today's behaviour, and the only verdict that changes nothing.
    Standalone { why: String },
    /// The record arrived and this machine already holds it. Resume as normal.
    Resume { why: String, adopt: Option<String> },
    /// The record advanced somewhere that is not this machine's last adoption. Retire this
    /// machine's transcripts for the fixed-id seats and wake them from the synced tails.
    Migrate { why: String, adopt: Option<String> },
    /// The record did not arrive, and the local house is intact. Start AS THIS MACHINE — its own
    /// seats, its own transcripts — and say so. Read-write, because this is not a chimera: it is
    /// the pre-sync world, whose divergence is an append-merge and is what the room lives with now.
    LocalHouse { why: String },
    /// The data dir may be half-promoted. Open the window; wake nothing.
    ReadOnly { why: String },
}

impl Verdict {
    pub fn is_migrate(&self) -> bool {
        matches!(self, Verdict::Migrate { .. })
    }
    pub fn is_read_only(&self) -> bool {
        matches!(self, Verdict::ReadOnly { .. })
    }
    /// The short tag that leads the board row and the log line.
    pub fn tag(&self) -> &'static str {
        match self {
            Verdict::Standalone { .. } => "STANDALONE",
            Verdict::Resume { .. } => "RESUME",
            Verdict::Migrate { .. } => "MIGRATE",
            Verdict::LocalHouse { .. } => "LOCAL HOUSE",
            Verdict::ReadOnly { .. } => "READ-ONLY",
        }
    }
    pub fn why(&self) -> &str {
        match self {
            Verdict::Standalone { why }
            | Verdict::Resume { why, .. }
            | Verdict::Migrate { why, .. }
            | Verdict::LocalHouse { why }
            | Verdict::ReadOnly { why } => why,
        }
    }
}

/// THE DECISION. Pure: same facts, same verdict, no disk, no clock, no network.
///
/// ORDER MATTERS AND IS NOT ALPHABETICAL. The half-promoted check comes first because it is the
/// only fact that invalidates every other one: if the data dir is a chimera, what `live_host.json`
/// or `sync-completion.json` say about it is a reading of a file that may itself be half-arrived.
///
/// THE LEAN, stated before the code so it can be argued with rather than discovered: **when the
/// decision cannot tell self from foreign, it MIGRATES.** The two errors are not symmetric.
/// Retiring when we did not need to costs one warm-resume instead of a vendor resume, is announced,
/// and is undone by moving one file back. Resuming when we should have retired is the silent
/// wrong-source failure this whole module exists to prevent, and it is undetectable from inside —
/// the seat has history and talks. Lean toward the reversible error.
pub fn decide(f: &Facts) -> Verdict {
    if f.promotion_open {
        return Verdict::ReadOnly {
            why: format!(
                "a pull began writing into the data dir and never recorded finishing \
                 ({PROMOTION_JOURNAL} is still present). The record here may be half-arrived, so \
                 no seat is woken from it. Nothing is lost and nothing is locked: re-run \
                 `node consonance/tools/state-sync.js --pull` and relaunch, or delete that file \
                 to declare the data dir sound and start normally."
            ),
        };
    }

    match f.pull() {
        Pull::ToolAbsent => {
            return Verdict::Standalone {
                why: "state-sync.js is not on disk, so this machine is not in the two-machine \
                      sync. Launching exactly as before."
                    .to_string(),
            }
        }
        Pull::CouldNotRun(e) => {
            return Verdict::LocalHouse {
                why: format!(
                    "the pull could not be run ({e}). The data dir was not touched, so this is \
                     THIS MACHINE's house — its own seats, its own transcripts — not the synced \
                     one. Work here diverges from the record until a pull succeeds."
                ),
            }
        }
        Pull::Failed(e) => {
            return Verdict::LocalHouse {
                why: format!(
                    "the pull did not complete ({e}). The data dir was not promoted, so this is \
                     THIS MACHINE's house, not the synced one. Divergence from here is an \
                     append-merge, not a loss — but it is real, and this row is the only warning."
                ),
            }
        }
        Pull::Ok => {}
    }

    // Exit 0 with no completion record is a tool that did not do what its status claims.
    // That is not an outage and must not read as one: name it exactly.
    let Some(c) = f.completion.as_ref() else {
        return Verdict::LocalHouse {
            why: format!(
                "the pull exited 0 but wrote no {COMPLETION_FILE}. An exit code is a claim about a \
                 process; that file is the claim about the record, and only the second one is \
                 checkable. Treating this as synced would be trusting the half of the evidence \
                 that cannot be wrong. Launching as THIS MACHINE's house."
            ),
        };
    };
    if !c.verified {
        return Verdict::LocalHouse {
            why: format!(
                "{COMPLETION_FILE} says the pull did not verify{}. Launching as THIS MACHINE's \
                 house rather than pretending the record arrived.",
                c.why.as_deref().map(|w| format!(" ({w})")).unwrap_or_default()
            ),
        };
    }
    // WHO THIS MACHINE IS, taken from the tool's own record first. `Completion::machine` explains
    // why: both sides of the equality must come from ONE resolver, and the fallback below is only
    // for the case where there is no record at all — in which case there is no `pushed_by` to
    // compare it against either.
    let me = c.machine.as_deref().or(f.self_id.as_deref());

    // WHOSE RECORD IS IT — asked BEFORE "did it install", and the order is load-bearing.
    //
    // The launcher pulls in two phases: verify-only first, and `--install` only when the record is
    // NOT this machine's own (see `sync_at_launch` in main.rs). So on the machine that authored the
    // state, `installed` is deliberately false and means "there was nothing to bring in" — not the
    // half-arrival the next branch is about. Asking "installed?" first would read the safe case as
    // the dangerous one and put the working machine into LocalHouse on every launch.
    if let (Some(head_host), Some(me)) = (c.pushed_by.as_deref(), me) {
        if head_host == me {
            return Verdict::Resume {
                why: format!(
                    "the record's head was authored by this machine ({me}), so nothing was \
                     installed and nothing needed to be. The seats here ARE the synced seats."
                ),
                adopt: c.head.clone(),
            };
        }
    }

    if !c.installed {
        // VERIFIED IS NOT ARRIVED, and A split the two fields precisely so this branch could
        // exist. Which of the two verdicts it takes depends on how far the install got.
        if c.stage.as_deref() == Some("install") {
            return Verdict::ReadOnly {
                why: format!(
                    "the pull verified and then FAILED PART-WAY THROUGH THE INSTALL{} — \
                     `installTree` writes the data dir file by file, so some of it is the record \
                     and some of it is this machine's. No seat is woken from a half-written house. \
                     Nothing is lost and nothing is locked: what was displaced is kept under \
                     `attic/pre-sync-*`, and re-running \
                     `node consonance/tools/state-sync.js --pull --install` finishes the job.",
                    c.why.as_deref().map(|w| format!(" ({w})")).unwrap_or_default()
                ),
            };
        }
        return Verdict::LocalHouse {
            why: format!(
                "the pull VERIFIED BUT DID NOT INSTALL — the record is in the state checkout and \
                 never reached the data dir. That is the quiet half-arrival {COMPLETION_FILE} \
                 splits its two fields to expose, and asking only \"verified?\" would have started \
                 on it. Launching as THIS MACHINE's house; \
                 `state-sync.js --pull --install` is what brings the record in."
            ),
        };
    }

    // The record is here, verified, and installed. The only remaining question is whose it is.
    let commit = c.head.clone();

    // 1. The authored-head answer. `pushed_by` is A's `index.machine`, written by `--push`, and it
    //    is compared against `machine_identity()` in main.rs, which resolves BY A's OWN RULE so
    //    the two sides cannot drift into a permanent false-foreign. The self case was already
    //    answered above; only foreign reaches here.
    if let (Some(head_host), Some(me)) = (c.pushed_by.as_deref(), me) {
        return Verdict::Migrate {
            why: format!(
                "the record's head was authored by {head_host}, not by this machine ({me}). This \
                 machine's transcripts for the fixed-id seats are a different lineage and would \
                 resume as that machine's past — retiring them and waking each seat from the \
                 synced tail."
            ),
            adopt: commit,
        };
    }

    // 2. E's file, when it is there. Corroboration only, and it is bounded by the last sync — it
    //    cannot see a host that started since (A's manifest states the same limit).
    if let (Some(holder), Some(me)) = (f.live_host.as_deref(), me) {
        if holder != me {
            return Verdict::Migrate {
                why: format!(
                    "{LIVE_HOST_FILE} says the house last lived on {holder}, not here ({me}), and \
                     {COMPLETION_FILE} names no head author. Retiring on the weaker of the two \
                     signals, because it is the reversible direction."
                ),
                adopt: commit,
            };
        }
    }

    // 3. Nothing named an author. Have we seen this exact head before? If we adopted it at a
    //    previous launch, nothing new arrived and there is nothing to retire — this is what stops
    //    the degraded mode below from re-retiring on every relaunch.
    if let (Some(head), Some(adopted)) = (commit.as_deref(), f.adopted_commit.as_deref()) {
        if head == adopted {
            return Verdict::Resume {
                why: format!(
                    "the record's head ({}) is the one this machine already adopted, and no \
                     author is recorded. Nothing new arrived; nothing retired.",
                    short(head)
                ),
                adopt: commit,
            };
        }
    }

    // 4. THE DEGRADED MODE, and its cost is stated rather than hidden. Without `pushed_by` the
    //    decision cannot tell "the record advanced elsewhere" from "the record advanced here",
    //    so it takes the reversible error and says which field would end it.
    Verdict::Migrate {
        why: format!(
            "the record advanced to a head this machine has not adopted{}, and nothing names who \
             authored it — {COMPLETION_FILE} carries no `pushed_by` and no usable \
             {LIVE_HOST_FILE}. Retiring, because retiring is reversible (the transcripts are moved, \
             never deleted) and resuming the wrong seat is silent. THIS IS THE DEGRADED ANSWER: \
             one field, `pushed_by`, ends it.",
            commit.as_deref().map(|h| format!(" ({})", short(h))).unwrap_or_default()
        ),
        adopt: commit,
    }
}

fn short(sha: &str) -> String {
    sha.chars().take(7).collect()
}

/// The one line that goes to the board, in the `backfill` announcement's old slot.
///
/// It states the verdict, the reason, and — for a migrate — what was moved and where, because a
/// row that says "retired" without naming the file is a row nobody can undo.
pub fn seam_line(v: &Verdict, retired: &[RetireOutcome]) -> String {
    let mut s = format!("sync at launch — {}: {}", v.tag(), v.why());
    if v.is_migrate() {
        let moved: Vec<&RetireOutcome> = retired.iter().filter(|r| r.moved).collect();
        let failed: Vec<&RetireOutcome> = retired.iter().filter(|r| r.error.is_some()).collect();
        let kept: Vec<&RetireOutcome> = retired.iter().filter(|r| r.kept_carried).collect();
        let absent = retired.len() - moved.len() - failed.len() - kept.len();
        s.push_str(&format!(
            " RETIRED {} transcript(s), {absent} seat(s) had none here",
            moved.len()
        ));
        for r in &moved {
            s.push_str(&format!("; {} -> {}", r.seat, r.to.display()));
        }
        if !kept.is_empty() {
            s.push_str(&format!("; KEPT {} the stick placed", kept.len()));
            for r in &kept {
                s.push_str(&format!("; {} resumes {}", r.seat, r.from.display()));
            }
        }
        for r in &failed {
            // A retire that failed is the dangerous one: the seat will resume the wrong thread and
            // the row must say so in the words that make it findable, not as a soft note.
            s.push_str(&format!(
                "; RETIRE FAILED for {} ({}) — that seat will resume THIS machine's transcript",
                r.seat,
                r.error.as_deref().unwrap_or("unknown")
            ));
        }
    }
    s
}

// ---------------------------------------------------------------------------------------------
// THE RETIRE, as a plan and an application, so the decision is testable without moving a file.

/// One fixed-id seat, as the retire needs it.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SeatTranscript {
    /// "main" / "librarian" / "third place" — for the row, not for any lookup.
    pub seat: String,
    /// The session id — the key the stick's receipt is looked up by.
    pub sid: String,
    /// The exact file `--resume` would find.
    pub from: PathBuf,
    /// Where it goes. Timestamped: see `attic_for`.
    pub to: PathBuf,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RetireOutcome {
    pub seat: String,
    pub from: PathBuf,
    pub to: PathBuf,
    /// The file existed and is now at `to`.
    pub moved: bool,
    /// Present iff the move was attempted and failed. `moved: false` with no error means the seat
    /// simply had no transcript here — a different fact, kept distinct.
    pub error: Option<String>,
    /// The transcript here IS the conversation the stick placed (see `read_carried`), so it was
    /// left where `--resume` finds it. Not moved, not an error, not absent — a fourth fact.
    pub kept_carried: bool,
}

/// THE ATTIC IS OUTSIDE `~/.claude/projects/`, DELIBERATELY, AND THE PACKET SAID "a projects
/// attic". The deviation has a reason and the reason is in this repo's own comments.
///
/// `resume_pane` (main.rs) already moves a leftover jsonl aside before spawning fresh, and states
/// why: "a leftover jsonl for this id can make the fresh `--session-id` collide (already in use)".
/// A retired transcript that still sits anywhere the vendor indexes can therefore either be found
/// by `--resume` or block the fresh `--session-id` — and BOTH failures land as "the seat woke as
/// this machine's past" or "the seat did not wake at all". Moving it out of the indexed tree is
/// what makes the retirement real rather than a rename.
///
/// TIMESTAMPED, and that is the second lesson from the same function: `resume_pane` writes a single
/// `<id>.jsonl.orphaned` and `remove_file`s the previous one first, so its archive is exactly one
/// deep and the second retirement destroys the first. Here every retirement keeps its own name.
/// "RETIRE, NEVER OVERWRITE is the keeper's word, and the attic is what makes it true rather than
/// a label."
pub fn attic_for(home: &Path, encoded_cwd: &str, sid: &str, stamp: &str) -> PathBuf {
    home.join(".claude")
        .join("consonance-attic")
        .join(encoded_cwd)
        .join(format!("{sid}.{stamp}.jsonl"))
}

/// The plan, from paths alone. Nothing is read and nothing is moved.
pub fn retire_plan(
    home: &Path,
    seats: &[(String, String, String)], // (label, sid, encoded cwd)
    stamp: &str,
) -> Vec<SeatTranscript> {
    seats
        .iter()
        .map(|(label, sid, enc)| SeatTranscript {
            seat: label.clone(),
            sid: sid.clone(),
            from: home
                .join(".claude")
                .join("projects")
                .join(enc)
                .join(format!("{sid}.jsonl")),
            to: attic_for(home, enc, sid, stamp),
        })
        .collect()
}

/// Where `dev/tail-carry.js` records the conversations a stick placed on this machine.
pub const CARRIED_FILE: &str = "consonance-carried.json";

pub fn carried_receipt_path(home: &Path) -> PathBuf {
    home.join(".claude").join(CARRIED_FILE)
}

/// Bytes of head scanned for the first timestamped record — `KEY_SCAN_BYTES` in tail-carry.js.
const KEY_SCAN_BYTES: u64 = 1024 * 1024;

/// **THE STICK'S RECEIPT: sid -> the first timestamped record of the conversation it placed.**
///
/// Found 2026-09-14 on L: ARRIVING imported all seven seats from the stick, then the launch saw a
/// D-authored state head, took MIGRATE, and moved the three fixed seats' conversations — the ones
/// the stick had placed one minute earlier — into the attic. The verdict reads who pushed the state
/// repo; it never looked at the conversations. On D the same head was self-authored, so the same
/// carry resumed. The receipt is the fact the verdict was missing: *this* file is the other
/// machine's lineage, delivered on purpose, not this machine's past.
///
/// A missing receipt is the ordinary case and returns an empty map (everything retires, as before).
/// An unreadable one is an `Err`, so the caller can say so rather than silently retiring.
pub fn read_carried(path: &Path) -> Result<HashMap<String, String>, String> {
    let raw = match std::fs::read_to_string(path) {
        Ok(r) => r,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(HashMap::new()),
        Err(e) => return Err(format!("{}: {e}", path.display())),
    };
    let v: serde_json::Value = serde_json::from_str(raw.trim_start_matches('\u{feff}'))
        .map_err(|e| format!("{}: {e}", path.display()))?;
    let seats = v
        .get("seats")
        .and_then(|s| s.as_object())
        .ok_or_else(|| format!("{}: no seats map", path.display()))?;
    Ok(seats
        .iter()
        .filter_map(|(sid, e)| {
            e.get("line").and_then(|l| l.as_str()).map(|l| (sid.clone(), l.to_string()))
        })
        .collect())
}

/// The identity of a conversation, by the same rule as `conversationKey` in tail-carry.js: the
/// first JSONL record carrying a string `"timestamp"`, within the first megabyte, never a line only
/// half read. Compared as text rather than hashed so no new crate is needed; same line, same key.
pub fn first_timestamped_line(p: &Path) -> Option<String> {
    use std::io::Read;
    let size = std::fs::metadata(p).ok()?.len();
    let mut buf = Vec::new();
    std::fs::File::open(p).ok()?.take(KEY_SCAN_BYTES).read_to_end(&mut buf).ok()?;
    let text = String::from_utf8_lossy(&buf);
    let mut lines: Vec<&str> = text.split('\n').collect();
    if (buf.len() as u64) < size {
        lines.pop();
    }
    lines.into_iter().find(|l| {
        !l.trim().is_empty()
            && serde_json::from_str::<serde_json::Value>(l)
                .ok()
                .and_then(|v| v.get("timestamp").map(|t| t.is_string()))
                .unwrap_or(false)
    })
    .map(str::to_string)
}

/// Apply it. A missing source is NOT an error — it is a seat that has never run here, which is the
/// ordinary case on a machine joining the sync — and it is reported as its own outcome so the row
/// can tell "nothing to retire" from "retire failed", which look identical in a count.
///
/// A transcript whose identity matches the stick's receipt for its sid is KEPT: it is the synced
/// lineage already, and retiring it is what woke three seats blank on L, 2026-09-14.
pub fn apply_retire(plan: &[SeatTranscript], carried: &HashMap<String, String>) -> Vec<RetireOutcome> {
    plan.iter()
        .map(|s| {
            if !s.from.exists() {
                return RetireOutcome {
                    seat: s.seat.clone(),
                    from: s.from.clone(),
                    to: s.to.clone(),
                    moved: false,
                    error: None,
                    kept_carried: false,
                };
            }
            if let Some(line) = carried.get(&s.sid) {
                if first_timestamped_line(&s.from).as_deref() == Some(line.as_str()) {
                    return RetireOutcome {
                        seat: s.seat.clone(),
                        from: s.from.clone(),
                        to: s.to.clone(),
                        moved: false,
                        error: None,
                        kept_carried: true,
                    };
                }
            }
            let mkdir = s.to.parent().map(std::fs::create_dir_all).unwrap_or(Ok(()));
            let res = mkdir.and_then(|_| std::fs::rename(&s.from, &s.to));
            match res {
                Ok(()) => RetireOutcome {
                    seat: s.seat.clone(),
                    from: s.from.clone(),
                    to: s.to.clone(),
                    moved: true,
                    error: None,
                    kept_carried: false,
                },
                Err(e) => RetireOutcome {
                    seat: s.seat.clone(),
                    from: s.from.clone(),
                    to: s.to.clone(),
                    moved: false,
                    error: Some(e.to_string()),
                    kept_carried: false,
                },
            }
        })
        .collect()
}

// ---------------------------------------------------------------------------------------------
// READING THE FACTS OFF DISK. Path-taking, for the same reason `load_offsets_from` is:
// an instrument against a silent wrong source cannot have an untestable core.

pub fn read_completion(data_dir: &Path) -> Option<Completion> {
    let raw = std::fs::read_to_string(data_dir.join(COMPLETION_FILE)).ok()?;
    // A BOM has silently killed a JSON parse in this repo twice; strip before parsing.
    let v: serde_json::Value = serde_json::from_str(raw.trim_start_matches('\u{feff}')).ok()?;
    let s = |k: &str| v.get(k).and_then(|x| x.as_str()).map(str::to_string);
    Some(Completion {
        // Absent reads FALSE for both, and that is the withholding direction: a record whose
        // schema drifted must not be able to claim the house arrived.
        verified: v.get("verified").and_then(|x| x.as_bool()).unwrap_or(false),
        installed: v.get("installed").and_then(|x| x.as_bool()).unwrap_or(false),
        stage: s("stage"),
        why: s("why"),
        head: s("head"),
        pushed_by: s("pushed_by"),
        machine: s("machine"),
    })
}

pub fn promotion_open(data_dir: &Path) -> bool {
    data_dir.join(PROMOTION_JOURNAL).exists()
}

pub fn read_adopted(data_dir: &Path) -> Option<String> {
    let raw = std::fs::read_to_string(data_dir.join(ADOPTED_FILE)).ok()?;
    let v: serde_json::Value = serde_json::from_str(raw.trim_start_matches('\u{feff}')).ok()?;
    v.get("commit").and_then(|x| x.as_str()).map(str::to_string)
}

/// Written at every launch that did NOT end in `ReadOnly` — including a migrate, so the next
/// launch sees the head as adopted and does not retire the seats this one just installed.
pub fn write_adopted(data_dir: &Path, commit: Option<&str>, at_unix: u64, verdict: &str) {
    let Some(commit) = commit else { return };
    let body = serde_json::json!({ "commit": commit, "at": at_unix, "verdict": verdict });
    if let Ok(s) = serde_json::to_string_pretty(&body) {
        let p = data_dir.join(ADOPTED_FILE);
        let tmp = p.with_extension(format!("tmp{}", std::process::id()));
        if std::fs::write(&tmp, s).is_ok() {
            let _ = std::fs::rename(&tmp, &p);
        }
    }
}

/// `live_host.json`'s current holder, best-effort. E's file, E's shape — read leniently and treat
/// anything unrecognised as absent, because a mis-read of another seat's format must degrade to
/// "no signal" and never to a confident wrong host.
pub fn read_live_host(data_dir: &Path) -> Option<String> {
    let raw = std::fs::read_to_string(data_dir.join(LIVE_HOST_FILE)).ok()?;
    let v: serde_json::Value = serde_json::from_str(raw.trim_start_matches('\u{feff}')).ok()?;
    for k in ["host", "install_id", "holder", "self_id"] {
        if let Some(s) = v.get(k).and_then(|x| x.as_str()) {
            if !s.trim().is_empty() {
                return Some(s.to_string());
            }
        }
    }
    None
}

// ---------------------------------------------------------------------------------------------
// THE PRIOR-CONVERSATION SECTION for a retired fixed-id seat.
//
// After a retire the seat spawns FRESH (`--session-id`), so its window is empty. The thread is
// carried by the synced capture tail (`captures/<sid>.txt`, A's manifest: TRAVELS, "THE WARM-RESUME
// CARRIERS — this is the thread"). Without this section a migrate produces three amnesiac seats
// and the desktop's first words come from nowhere at all, which is a different failure from the
// one the packet named but no better.
//
// The wording is `warm_resume_brief`'s, deliberately unchanged: a seat that reads two different
// framings of the same event across two paths has been told the room is inconsistent about what a
// restore IS.

/// `transcript` must already be trimmed to fit — the caller owns the budget, because only the
/// caller knows how big the seat's intake already is. `settled`/`now` are formatted by the caller
/// for the same reason: this module takes no clock.
pub fn prior_conversation_section(transcript: &str, interval: Option<&str>) -> String {
    let mut s = String::from(
        "\n\n---\n\n# PRIOR CONVERSATION — you have been here before\n\nConsonance restored this \
         seat from its own capture: the record moved to this machine, and the session file that \
         was here belongs to this machine's own past, not to your thread. It has been retired \
         (moved aside, revivable), not deleted. The exchange below IS your conversation so far — \
         you lived it. Read it as your own memory, not a transcript handed to a stranger, then \
         continue the thread when the user next speaks. Do not re-greet, summarize, or announce \
         that you were restored.\n\n",
    );
    if let Some(i) = interval {
        s.push_str(i);
        s.push_str("\n\n");
    }
    s.push_str("```\n");
    s.push_str(transcript);
    s.push_str("\n```\n");
    s
}

/// When the tail could not ride at all, the seat is told where it is rather than left to wake
/// believing it has no past. Absent-is-silent is the failure this room keeps paying for.
pub fn prior_conversation_pointer(path: &Path, bytes: usize) -> String {
    format!(
        "\n\n---\n\n# PRIOR CONVERSATION — on disk, not in this shell\n\nThe record moved to this \
         machine and the session file that was here has been retired (moved aside, revivable). \
         Your thread is carried by the synced capture tail, and it did NOT fit in this shell: \
         {bytes} bytes at `{}`. Open it before you answer — you have a past here and this shell \
         is not it.\n",
        path.display()
    )
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// THE STICK AT LAUNCH — L059, pane E. `exo_memory/loop/packet_stick_build_2026-09-14.md`, §2 and §3
// as re-ruled at 60e1ccf / b258fc2.
//
// WHAT THIS PART IS, AND WHAT IT REFUSES TO BE. Everything below is pure or `stat`-only. **Nothing
// here starts a process.** That is not a style choice: E-2 measured that asking A's verifier about
// every volume costs a node process (57–67 ms, measured on L) per volume on EVERY launch, stick or no
// stick — a launch that passes "same persist.log rows" while no longer being today's launch. So the
// launch only looks; the setup window, after the intro, is what runs the verifier and the rehearsal.
//
// AND THE IMPORT NEVER RUNS IN THIS PROCESS. The carry's import gate matches the image name
// `consonance.exe`, which exists from process creation (E, L058 §1, measured). The one write is handed
// to A's applier, which waits for this process to be gone (§2).
// ─────────────────────────────────────────────────────────────────────────────────────────────────

/// `<folder>/consonance-transfer/MANIFEST.json` — the manifested layout.
pub const STICK_MANIFEST: [&str; 2] = ["consonance-transfer", "MANIFEST.json"];
/// `<folder>/consonance-tails/ledger.json` — the older layout, which is tonight's real stick.
pub const STICK_LEDGER: [&str; 2] = ["consonance-tails", "ledger.json"];
/// Written by A's applier before anything else (§2); read at launch for the single-applier guard (E-1).
pub const APPLY_STARTED: &str = "stick-apply.started.json";
/// Written by A's applier after the import; shown by the relaunched app, deleted only after showing.
pub const APPLY_RESULT: &str = "stick-apply.result.json";
/// THIS APP'S OWN record of a keeper's "keep this machine's" choice. Read and written by the app
/// alone — never by the applier or the carry — so it is not part of any shared contract. It exists
/// because §2 says neither choice re-shows the window for that seat, and a KEEP forwards nothing, so
/// the next rehearsal still refuses that seat: without a record of the choice it would ask again.
pub const STICK_KEEP: &str = "stick-keep.json";

/// How long after a launch row a conversation's first record may land and still read as launch-born.
/// **One measured sample, stated as one:** tonight's launch-born librarian on L began 18.7 s after the
/// `SYNC AT LAUNCH` row at 1789367339 (first record `2026-09-14T06:29:17.726Z`). Fixed seats wake from
/// a BUTTON, so a slower keeper lands later. That is why this only chooses a DEFAULT and never retires
/// anything — a late click reads as "not launch-born", which defaults to KEEP, the safe direction.
pub const LAUNCH_BORN_WINDOW_SECS: i64 = 120;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StickLayout {
    Manifest,
    Older,
}

impl StickLayout {
    pub fn tag(&self) -> &'static str {
        match self {
            StickLayout::Manifest => "manifest",
            StickLayout::Older => "older",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StickFolder {
    pub folder: PathBuf,
    pub layout: StickLayout,
}

/// §3, "where the stick is".
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StickFind {
    /// No marker anywhere. Spawn nothing, log nothing, withhold nothing.
    None,
    /// Exactly one folder. That FOLDER is the stick; the verifier is handed the folder, not the volume.
    One(StickFolder),
    /// More than one. Every one is named and none is picked; the keeper chooses in the window.
    Many(Vec<StickFolder>),
}

fn layout_at(dir: &Path) -> Option<StickLayout> {
    if dir.join(STICK_MANIFEST[0]).join(STICK_MANIFEST[1]).is_file() {
        Some(StickLayout::Manifest)
    } else if dir.join(STICK_LEDGER[0]).join(STICK_LEDGER[1]).is_file() {
        Some(StickLayout::Older)
    } else {
        None
    }
}

/// **§3: the volume root AND one folder level down, by `stat` alone.** E-5 is why it is two levels:
/// the real stick keeps everything in `D:\consonance-L-20260911\`, so a root-only look reads tonight's
/// stick as no stick at all.
///
/// A child that is a symlink or junction is not followed (`DirEntry::file_type` does not follow them),
/// which keeps `C:\Documents and Settings` and its kind from turning a two-level look into a walk.
/// An unreadable root or child is skipped: a volume we cannot list is not a stick we can carry from.
pub fn find_stick(volume_roots: &[PathBuf]) -> StickFind {
    let mut found = Vec::new();
    for root in volume_roots {
        if let Some(layout) = layout_at(root) {
            found.push(StickFolder { folder: root.clone(), layout });
        }
        let Ok(entries) = std::fs::read_dir(root) else { continue };
        let mut kids: Vec<PathBuf> = entries
            .flatten()
            .filter(|e| e.file_type().map(|t| t.is_dir()).unwrap_or(false))
            .map(|e| e.path())
            .collect();
        kids.sort();
        for kid in kids {
            if let Some(layout) = layout_at(&kid) {
                found.push(StickFolder { folder: kid, layout });
            }
        }
    }
    match found.len() {
        0 => StickFind::None,
        1 => StickFind::One(found.remove(0)),
        _ => StickFind::Many(found),
    }
}

/// What the launch can know about a process from its pid, without starting one.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProcInfo {
    pub name: String,
    pub cmd: Vec<String>,
}

/// §2, "a launch that finds `stick-apply.started.json`" (E-1).
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Handshake {
    Absent,
    /// A live applier. Start none; offer only Close.
    Live { pid: u32, stick: Option<String> },
    /// Named, then treated as absent.
    Stale { why: String },
}

/// A pid is the applier only if its image is node AND one of its arguments NAMES `stick-apply.js` — the
/// file name exactly, after either separator. The image alone is not enough: any node process — this
/// app's own tools included — would pass. A suffix is not enough either: `ends_with("stick-apply.js")`,
/// which this first shipped with, also accepted `not-stick-apply.js` and made the separator
/// normalization beside it decorative (found at L059 R-2, moving the test fixture off this machine's path).
pub fn is_applier(p: &ProcInfo) -> bool {
    let name = p.name.to_ascii_lowercase();
    (name == "node" || name == "node.exe")
        && p.cmd.iter().any(|a| a.replace('\\', "/").rsplit('/').next() == Some("stick-apply.js"))
}

/// Reads the handshake. `probe` answers "what is running under this pid", or `None` for nothing.
///
/// **A pid alive with a different image is STALE, not live.** Windows reuses pids, and a handshake
/// left by an applier killed from outside — which on this machine runs no cleanup (§1, measured by
/// the chair) — outlives its process. Treating any live pid as the applier would leave every later
/// launch saying "a transfer is waiting" forever, which is E's Q1 condition 2.
pub fn read_handshake(data_dir: &Path, probe: &dyn Fn(u32) -> Option<ProcInfo>) -> Handshake {
    let path = data_dir.join(APPLY_STARTED);
    let raw = match std::fs::read_to_string(&path) {
        Ok(r) => r,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Handshake::Absent,
        Err(e) => return Handshake::Stale { why: format!("{APPLY_STARTED} exists but cannot be read ({e})") },
    };
    let v: serde_json::Value = match serde_json::from_str(raw.trim_start_matches('\u{feff}')) {
        Ok(v) => v,
        Err(e) => return Handshake::Stale { why: format!("{APPLY_STARTED} is not JSON ({e})") },
    };
    let Some(pid) = v.get("pid").and_then(|x| x.as_u64()).filter(|p| *p <= u32::MAX as u64) else {
        return Handshake::Stale { why: format!("{APPLY_STARTED} names no pid") };
    };
    let pid = pid as u32;
    let stick = v.get("stick").and_then(|x| x.as_str()).map(str::to_string);
    match probe(pid) {
        None => Handshake::Stale { why: format!("the applier it names (pid {pid}) is not running") },
        Some(p) if is_applier(&p) => Handshake::Live { pid, stick },
        Some(p) => Handshake::Stale {
            why: format!("pid {pid} is alive but is `{}`, not the applier — a reused pid", p.name),
        },
    }
}

/// Every launch on this machine, as unix seconds, from its own `persist.log`. One row per launch:
/// `<unix> SYNC AT LAUNCH <TAG> — <why>`, written by `.setup()` after the verdict.
pub fn launch_times(persist_log: &str) -> Vec<i64> {
    const TAGS: [&str; 5] = ["STANDALONE", "RESUME", "MIGRATE", "LOCAL HOUSE", "READ-ONLY"];
    persist_log
        .lines()
        .filter_map(|line| {
            let (stamp, rest) = line.split_once(' ')?;
            let rest = rest.strip_prefix("SYNC AT LAUNCH ")?;
            if !TAGS.iter().any(|t| rest.starts_with(&format!("{t} —"))) {
                return None;
            }
            stamp.parse::<i64>().ok()
        })
        .collect()
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SeatChoice {
    Take,
    Keep,
    /// **P-DIVERGED D-4: nothing preselected.** On a DIVERGED seat both files are the lineage, so the window
    /// preselects neither and Carry waits until the keeper has chosen.
    None,
}

impl SeatChoice {
    pub fn tag(&self) -> &'static str {
        match self {
            SeatChoice::Take => "take",
            SeatChoice::Keep => "keep",
            SeatChoice::None => "none",
        }
    }
}

/// What the window offers for one `OTHER_CONVERSATION` seat.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ChoiceOffer {
    /// false when `--retire-far` could not take the seat (the stick holds a delta, not a conversation)
    pub take_offered: bool,
    pub default: SeatChoice,
    pub why: String,
}

fn unix_of(ts: &str) -> Option<i64> {
    chrono::DateTime::parse_from_rfc3339(ts).ok().map(|d| d.timestamp())
}

/// **E-4: ruling 1, living in the window.** Only the DEFAULT is decided here; the keeper's click is the
/// decision, and it rides the handshake as `--retire-far` (§2). Nothing is retired by this function.
///
///   not retirable                    TAKE not offered — a delta cannot replace a conversation
///   a pane                           default TAKE — the stick's copy is the carried one
///   a fixed seat, launch-born        default TAKE — began after the export (b) AND within
///                                    LAUNCH_BORN_WINDOW_SECS of a launch on THIS machine's clock (c)
///   any other fixed seat             default KEEP — somebody's lineage until the keeper says otherwise
///
/// (a) — the birth read from the exact file the carry compared — is satisfied upstream: the row's
/// `localFirstTimestamp` is taken from that row's `path` by the tool. (b) crosses two clocks (the export
/// time is the other machine's); (c) is one clock. Both must hold, because each admits a case the other
/// catches (L058 §4.2).
pub fn offer_for(
    kind: &str,
    retirable: bool,
    local_first: Option<&str>,
    exported_at: Option<&str>,
    launches: &[i64],
) -> ChoiceOffer {
    if !retirable {
        return ChoiceOffer {
            take_offered: false,
            default: SeatChoice::Keep,
            why: "the stick holds only a delta for this seat, and a delta cannot replace a whole \
                  conversation. Export this seat whole on the other machine, then carry again."
                .to_string(),
        };
    }
    if kind != "fixed" {
        return ChoiceOffer {
            take_offered: true,
            default: SeatChoice::Take,
            why: "a pane: the stick's copy is the carried one. This machine's goes to the attic, never deleted."
                .to_string(),
        };
    }
    let (Some(born_s), Some(exp_s)) = (local_first, exported_at) else {
        return ChoiceOffer {
            take_offered: true,
            default: SeatChoice::Keep,
            why: "when this machine's conversation began, or when the stick's was exported, is not \
                  recorded — so nothing is preselected for a fixed seat."
                .to_string(),
        };
    };
    let (Some(born), Some(exp)) = (unix_of(born_s), unix_of(exp_s)) else {
        return ChoiceOffer {
            take_offered: true,
            default: SeatChoice::Keep,
            why: format!("a timestamp does not parse ({born_s} / {exp_s}) — nothing is preselected for a fixed seat."),
        };
    };
    let launch = launches.iter().copied().filter(|&l| born >= l && born - l <= LAUNCH_BORN_WINDOW_SECS).max();
    match (born > exp, launch) {
        (true, Some(l)) => ChoiceOffer {
            take_offered: true,
            default: SeatChoice::Take,
            why: format!(
                "this machine's conversation began {born_s}, after the stick's export {exp_s}, and {}s \
                 after a launch here — a launch-born conversation, which cannot be the lineage.",
                born - l
            ),
        },
        (after, _) => ChoiceOffer {
            take_offered: true,
            default: SeatChoice::Keep,
            why: format!(
                "this machine's conversation began {born_s}, {} the stick's export {exp_s}, and not within \
                 {LAUNCH_BORN_WINDOW_SECS}s of a launch here — it may be somebody's lineage. Taking the \
                 stick's retires it to the attic; that is yours to choose.",
                if after { "after" } else { "before" }
            ),
        },
    }
}

/// Has the keeper already chosen KEEP for this seat's carry? Keyed by the carry's export time, so the
/// SAME carry is not asked about twice and a NEW carry for that seat asks again.
pub fn is_kept(keep_json: &str, sid: &str, exported_at: &str) -> bool {
    serde_json::from_str::<serde_json::Value>(keep_json.trim_start_matches('\u{feff}'))
        .ok()
        .and_then(|v| v.get(sid).and_then(|x| x.as_str()).map(|s| s == exported_at))
        .unwrap_or(false)
}

/// Returns the keep record with `sid` set to this carry. An unreadable record is replaced, not merged:
/// the worst it costs is asking about a seat again.
pub fn record_keep(keep_json: &str, sid: &str, exported_at: &str) -> String {
    let mut v = serde_json::from_str::<serde_json::Value>(keep_json.trim_start_matches('\u{feff}'))
        .ok()
        .filter(|v| v.is_object())
        .unwrap_or_else(|| serde_json::json!({}));
    v[sid] = serde_json::Value::String(exported_at.to_string());
    serde_json::to_string_pretty(&v).unwrap_or_else(|_| "{}".to_string())
}

/// What the launch found, before any seat and before any process.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Arrival {
    pub stick: StickFind,
    pub handshake: Handshake,
    pub result_present: bool,
}

impl Arrival {
    /// Seats wait for the setup window when there is anything for it to show.
    pub fn withhold(&self) -> bool {
        !matches!(self.stick, StickFind::None)
            || matches!(self.handshake, Handshake::Live { .. })
            || self.result_present
    }

    /// The rows this launch writes to `persist.log`. **EMPTY on a launch with no stick, no handshake
    /// and no result** — which is the no-stick bar: a launch before this module wrote none of these.
    pub fn log_lines(&self) -> Vec<String> {
        let mut out = Vec::new();
        match &self.stick {
            StickFind::None => {}
            StickFind::One(f) => out.push(format!(
                "STICK FOUND {} layout={} — seats wait for the setup window",
                f.folder.display(),
                f.layout.tag()
            )),
            StickFind::Many(fs) => out.push(format!(
                "STICK FOUND {} folders, none picked: {} — the keeper chooses in the setup window",
                fs.len(),
                fs.iter().map(|f| f.folder.display().to_string()).collect::<Vec<_>>().join(" | ")
            )),
        }
        match &self.handshake {
            Handshake::Absent => {}
            Handshake::Live { pid, .. } => out.push(format!(
                "STICK APPLIER WAITING pid={pid} — a transfer is waiting for this window to close; no second applier is started"
            )),
            Handshake::Stale { why } => out.push(format!("STICK STALE HANDSHAKE — {why}; treated as absent")),
        }
        if self.result_present {
            out.push(format!("STICK RESULT {APPLY_RESULT} present — shown in the setup window before any seat"));
        }
        out
    }
}

/// The launch's whole look at the stick: `stat`s and one small file read. No process, no write.
pub fn arrive(volume_roots: &[PathBuf], data_dir: &Path, probe: &dyn Fn(u32) -> Option<ProcInfo>) -> Arrival {
    Arrival {
        stick: find_stick(volume_roots),
        handshake: read_handshake(data_dir, probe),
        result_present: data_dir.join(APPLY_RESULT).is_file(),
    }
}

/// How the wait for the applier's handshake ended (§2).
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum HandshakeWait {
    /// `stick-apply.started.json` names THIS child's pid, and that pid is the applier. Only this may exit the app.
    Started,
    /// The child exited before writing it — the transfer did not start, and the app stays open.
    ChildExited(Option<i32>),
    /// Nothing proved it started within the window — the app stays open and says so.
    TimedOut,
}

/// §2: *"waits up to 10 s for that file with that pid alive … Absent → does NOT exit."*
///
/// The clock is the loop count, not the wall: `polls` × one injected `sleep`, so the timeout path is a
/// test and not a ten-second wait. **A handshake naming a DIFFERENT pid does not count** — a stale file
/// from an earlier applier must never read as this one having started.
pub fn await_handshake(
    data_dir: &Path,
    child_pid: u32,
    polls: u32,
    child_exit: &mut dyn FnMut() -> Option<Option<i32>>,
    probe: &dyn Fn(u32) -> Option<ProcInfo>,
    sleep: &mut dyn FnMut(),
) -> HandshakeWait {
    for _ in 0..polls {
        if let Handshake::Live { pid, .. } = read_handshake(data_dir, probe) {
            if pid == child_pid {
                return HandshakeWait::Started;
            }
        }
        if let Some(code) = child_exit() {
            return HandshakeWait::ChildExited(code);
        }
        sleep();
    }
    HandshakeWait::TimedOut
}

/// May the setup window close on its own and let the seats spawn? Only when a rehearsal has NOTHING
/// for the keeper to see: the set verifies, nothing carries or stops on import (a stop on a seat the
/// keeper already chose to KEEP for this same carry is not news), and the stick is not behind this
/// machine (no export row would carry). Anything else — including a verifier or rehearsal that
/// returned no contract at all — keeps the window open, where it is named.
pub fn rehearsal_is_quiet(
    verify: &serde_json::Value,
    import: &serde_json::Value,
    export: &serde_json::Value,
    keep_json: &str,
) -> bool {
    let code = |v: &serde_json::Value| v.get("code").and_then(|c| c.as_i64());
    if code(verify) != Some(0) {
        return false;
    }
    if !matches!(code(import), Some(0) | Some(1)) || !matches!(code(export), Some(0) | Some(1)) {
        return false;
    }
    let rows = |v: &serde_json::Value| v.get("rows").and_then(|r| r.as_array()).cloned().unwrap_or_default();
    let flag = |r: &serde_json::Value, k: &str| r.get(k).and_then(|x| x.as_bool()).unwrap_or(false);
    let text = |r: &serde_json::Value, k: &str| r.get(k).and_then(|x| x.as_str()).unwrap_or("").to_string();
    // The seats the keeper already chose to KEEP for THIS carry: the ones whose stop is not news on either side.
    let mut kept_sids: Vec<String> = Vec::new();
    for r in rows(import) {
        if flag(&r, "carries") {
            return false;
        }
        // **P-DIVERGED D-1, E's half.** A ledger a killed applier left un-advanced reads ALREADY_APPLIED or
        // APPLIED_AND_GREW: nothing carries and nothing stops, but the heal runs only from Carry. A window that
        // closed itself here would leave the ledger wedged — so these are news.
        if matches!(text(&r, "verdict").as_str(), "ALREADY_APPLIED" | "APPLIED_AND_GREW") {
            return false;
        }
        if flag(&r, "stops") {
            // §2.6: a DIVERGED seat the keeper kept is recorded exactly as an OTHER_CONVERSATION keep, and read the same.
            let choosable = text(&r, "reason") == "OTHER_CONVERSATION" || text(&r, "verdict") == "DIVERGED";
            let kept = choosable && is_kept(keep_json, &text(&r, "sid"), &text(&r, "exportedAt"));
            if !kept {
                return false;
            }
            kept_sids.push(text(&r, "sid"));
        }
    }
    // **P-DIVERGED D-2.** Keeping this machine's conversation leaves the other machine's tail untaken, so this same
    // machine's export refuses UNIMPORTED_TAIL for that seat. The keeper chose that knowingly; re-opening the window
    // on every launch for it is noise. ONLY that reason, and ONLY for a seat kept on the import side for this carry.
    !rows(export).iter().any(|r| {
        let known = flag(r, "stops") && text(r, "reason") == "UNIMPORTED_TAIL" && kept_sids.contains(&text(r, "sid"));
        (flag(r, "carries") || flag(r, "stops")) && !known
    })
}


/// The image the waiter is told to watch. §3 (11d9eb5) names it literally, and every build of this repo
/// produces `consonance.exe`, so it is the literal and not the running file's name.
pub const APP_IMAGE: &str = "consonance.exe";

/// **§3, "WHAT THE WAITER RUNS" (11d9eb5):** `node dev/stick-waiter.js --data <data_dir> --app-pid <pid>
/// --app-image consonance.exe`. **No `--stick`**: the keeper plugs the stick in at the END of a session, so
/// the waiter finds it when it exports, not at launch. Returned as the args after the script path, so a test
/// can pin the shape without starting anything.
///
/// **P-LEAVE-2 (a), B's D-8:** and `--app-started-at <ISO>`, this session's own recorded start time, beside the
/// pid. A pid is reused by Windows; a pid and the moment its Consonance started are not, so the waiter matches a
/// LEAVE file only when both equal what it is given here.
pub fn waiter_args(data_dir: &Path, app_pid: u32, app_started_at: &str) -> Vec<String> {
    vec![
        "--data".to_string(),
        data_dir.display().to_string(),
        "--app-pid".to_string(),
        app_pid.to_string(),
        "--app-image".to_string(),
        APP_IMAGE.to_string(),
        "--app-started-at".to_string(),
        app_started_at.to_string(),
    ]
}

/// **P-LEAVE-2 (b) 1, B's read2 §8.4 item 1: a spawn that fails after its child is running ends that child.**
/// `spawn_claude_pane`'s `try_clone_reader()?` and `take_writer()?` run after `spawn_command`; an `Err` there used to
/// drop the child, the killer and the flight together, leaving a live `claude.exe` outside Panes and outside the
/// count the close waits on. `kill` is called on `Err` only, before the error returns. Its result is not read: the
/// portable-pty 0.8.1 killer reports it backwards (§2.7 D-1).
pub fn or_kill<T, E: std::fmt::Display>(r: Result<T, E>, kill: &mut dyn FnMut()) -> Result<T, String> {
    r.map_err(|e| {
        kill();
        e.to_string()
    })
}

/// **P-LEAVE-2 (b) 2, B's read2 §8.4 item 2: a live session that a pane id's insert replaces is ended, not dropped.**
/// `insert_pane` passes `map.insert`'s return here. `Some` is the session the map held under that id (reachable from
/// `pty_reopen`, which does not check first): it is killed. `None` kills nothing.
pub fn kill_replaced<V>(replaced: Option<V>, kill: &mut dyn FnMut(&mut V)) {
    if let Some(mut old) = replaced {
        kill(&mut old);
    }
}

/// **P-DIVERGED D-3: the offer for a DIVERGED seat — built beside `offer_for`, not through it.** `offer_for`'s
/// retirable gate answers "can --retire-far take this?", which is the wrong question for a fork (`retirable` is null
/// on DIVERGED rows, and --retire-far ignores them). A fork is taken by `--take-stick`, always possible, and chosen by
/// nobody but the keeper: `take_offered: true`, `default: None`.
///
/// `own_bytes` and `tail_bytes` are the row's `ownBytes` and `bytes` (A's §2.4 / D-7); `this_machine` is the import
/// result's `machine` and `from` its `exportedFrom`. Any of them missing reads "unknown", never a guess.
pub fn diverged_offer(own_bytes: Option<u64>, tail_bytes: Option<u64>, this_machine: Option<&str>, from: Option<&str>) -> ChoiceOffer {
    let n = |b: Option<u64>| b.map(|b| format!("{b} B")).unwrap_or_else(|| "an unknown number of bytes".to_string());
    let here = this_machine.unwrap_or("this machine");
    let there = from.unwrap_or("the other machine");
    ChoiceOffer {
        take_offered: true,
        default: SeatChoice::None,
        why: format!(
            "Two futures of one conversation: {here} wrote {} of its own after the last carry, and {there} wrote {}. \
             TAKE THE STICK'S: {here}'s whole file goes to the attic, and {there}'s continuation takes the seat. \
             KEEP THIS MACHINE'S: {there}'s tail for this seat is not carried, and until it is taken {here}'s later \
             turns for this seat will not export (UNIMPORTED_TAIL). Nothing is chosen for you.",
            n(own_bytes),
            n(tail_bytes)
        ),
    }
}

/// The window's offers for one import rehearsal, keyed by sid — every seat that needs the keeper's choice, and no
/// other. OTHER_CONVERSATION goes through `offer_for` (ruling 1's defaults); DIVERGED through `diverged_offer`. Each
/// offer says whether the keeper already chose KEEP for this carry.
pub fn offers_for_rows(import: &serde_json::Value, keep_json: &str, launches: &[i64]) -> serde_json::Map<String, serde_json::Value> {
    let text = |r: &serde_json::Value, k: &str| r.get(k).and_then(|x| x.as_str()).map(str::to_string);
    let this_machine = text(import, "machine");
    let mut offers = serde_json::Map::new();
    for r in import.get("rows").and_then(|x| x.as_array()).cloned().unwrap_or_default() {
        let Some(sid) = text(&r, "sid") else { continue };
        let exported = text(&r, "exportedAt");
        let o = if text(&r, "reason").as_deref() == Some("OTHER_CONVERSATION") {
            offer_for(
                &text(&r, "kind").unwrap_or_default(),
                r.get("retirable").and_then(|x| x.as_bool()).unwrap_or(false),
                text(&r, "localFirstTimestamp").as_deref(),
                exported.as_deref(),
                launches,
            )
        } else if text(&r, "verdict").as_deref() == Some("DIVERGED") {
            diverged_offer(
                r.get("ownBytes").and_then(|x| x.as_u64()),
                r.get("bytes").and_then(|x| x.as_u64()),
                this_machine.as_deref(),
                text(&r, "exportedFrom").as_deref(),
            )
        } else {
            continue;
        };
        let kept = exported.as_deref().map(|e| is_kept(keep_json, &sid, e)).unwrap_or(false);
        offers.insert(sid, serde_json::json!({ "take_offered": o.take_offered, "default": o.default.tag(), "why": o.why, "kept": kept }));
    }
    offers
}

/// **P-DIVERGED (e): why the seats are not waking.** The spawn funnel refuses on one flag for two reasons, and it said
/// READ-ONLY for both — so a stick hold sent the keeper looking for a half-promoted data dir that was never there.
pub fn withheld_line(read_only: bool, verdict_why: &str) -> String {
    if read_only {
        format!("Consonance opened READ-ONLY and is not waking seats. {verdict_why}")
    } else {
        "The seats are waiting for the transfer window: they wake when you carry, or continue without carrying."
            .to_string()
    }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// P-LEAVE (D063) — THE CLOSE WINDOW: the app saves to the stick itself at close and says when it may be unplugged.
// Packet `loop/packet_leave_window_2026-09-14.md` §2, with §2.7 (9e29daf) overriding where they conflict.
//
// Everything here is pure or takes its outside in: the probe, the sleep, the clock and the export are injected, so
// every branch of step 2 and every ending of step 4 is a test and not a close of the real app.
// ─────────────────────────────────────────────────────────────────────────────────────────────────

/// §2.1: written by the APP after every seat has ended and before tail-carry starts; removed once the result exists.
pub const LEAVE_STARTED: &str = "stick-leave.started.json";
/// §2.1: written by the APP when the save ends however it ends. The WAITER removes it after acting on it (§2.7 D-4).
pub const LEAVE_RESULT: &str = "stick-leave.result.json";
/// The exit waiter's own lock in the data dir (A's `stick-waiter.js` LOCK). Read here only to leave its files alone.
pub const WAITER_LOCK: &str = "stick-waiter.lock";

/// An image name the way pidImage spells it (`tail-carry.js`): lower-case, ".exe" stripped. §2.7 D-7 compares on
/// BOTH sides in this shape, so "consonance.exe" and "consonance" are one image.
pub fn image_stem(name: &str) -> String {
    let lower = name.to_ascii_lowercase();
    lower.strip_suffix(".exe").map(str::to_string).unwrap_or(lower)
}

/// One seat as the Leave ends it: its pane, the pid kept at spawn (§2.7 D-1) and the image that pid ran then.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SeatProc {
    pub pane: String,
    pub pid: Option<u32>,
    pub image: Option<String>,
}

/// What the process list says about one pid (§2.9 B2-2).
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Listing {
    Running(ProcInfo),
    Gone,
    /// The list could not be trusted: it does not even hold the process asking. sysinfo returns an EMPTY list on an
    /// enumeration error (0.30.13 `windows/system.rs:233-239`), and an empty list must never read as "everything ended".
    CannotTell,
}

/// **§2.9 B2-2: the app's own pid is refreshed in the same call, as the list's control.** `listed` is what one
/// enumeration returned for `[pid, own_pid]`. Without `own_pid` in it, nothing in it is evidence: CANNOT TELL.
pub fn listing_from(listed: &HashMap<u32, ProcInfo>, pid: u32, own_pid: u32) -> Listing {
    if !listed.contains_key(&own_pid) {
        return Listing::CannotTell;
    }
    match listed.get(&pid) {
        Some(p) => Listing::Running(p.clone()),
        None => Listing::Gone,
    }
}

/// §2.7 D-1: **a pid is ended when the process is gone or runs another image.** The killer's return value is never
/// evidence (portable-pty 0.8.1 `win/mod.rs:71-78` returns Err on a SUCCESSFUL TerminateProcess).
///
/// A pid whose image was not read at spawn is ended only when it is gone: with no image to compare, a live pid is
/// treated as the seat — the direction that can only cost a NOT DONE, never a false DONE. CANNOT TELL is not ended.
pub fn seat_ended(image_at_spawn: Option<&str>, now: &Listing) -> bool {
    match (now, image_at_spawn) {
        (Listing::Gone, _) => true,
        (Listing::CannotTell, _) => false,
        (Listing::Running(p), Some(img)) => image_stem(&p.name) != image_stem(img),
        (Listing::Running(_), None) => false,
    }
}

/// §2.2 step 1's wait, bounded by `polls` (one check before each injected sleep, one after the last). Returns the
/// panes still running at the bound, in the order given; empty means every seat ended. A seat with no pid never
/// ends here: there is nothing to wait on, so it cannot be called ended.
pub fn await_seats(seats: &[SeatProc], polls: u32, probe: &dyn Fn(u32) -> Listing, sleep: &mut dyn FnMut()) -> Vec<String> {
    let mut alive: Vec<&SeatProc> = seats.iter().collect();
    for round in 0..=polls {
        alive.retain(|s| match s.pid {
            Some(pid) => !seat_ended(s.image.as_deref(), &probe(pid)),
            None => true,
        });
        if alive.is_empty() || round == polls {
            break;
        }
        sleep();
    }
    alive.into_iter().map(|s| s.pane.clone()).collect()
}

/// **§2.9 B2-1: one seat being spawned.** Held from the spawn funnel's entry until the caller's insert into Panes has
/// completed, or until the spawn fails — dropping it is the decrement, so no path can skip it.
#[derive(Debug)]
pub struct Flight {
    count: &'static std::sync::atomic::AtomicUsize,
}

impl Drop for Flight {
    fn drop(&mut self) {
        self.count.fetch_sub(1, std::sync::atomic::Ordering::SeqCst);
    }
}

/// B2-1's entry, race-free by its order: INCREMENT first, THEN read the phase. A close that sets its phase before this
/// read refuses the spawn; a close that sets it after sees this flight in the count and waits for it.
pub fn enter_flight(
    count: &'static std::sync::atomic::AtomicUsize,
    phase: &std::sync::atomic::AtomicU8,
    idle: u8,
) -> Option<Flight> {
    count.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
    let flight = Flight { count };
    if phase.load(std::sync::atomic::Ordering::SeqCst) != idle {
        return None; // `flight` drops here: the decrement
    }
    Some(flight)
}

/// B2-1's wait: called after the phase is set, before Panes is drained. Returns the count still in flight at the bound
/// (0 when every spawn landed in Panes or failed).
pub fn await_flights(count: &std::sync::atomic::AtomicUsize, polls: u32, sleep: &mut dyn FnMut()) -> usize {
    for round in 0..=polls {
        let n = count.load(std::sync::atomic::Ordering::SeqCst);
        if n == 0 || round == polls {
            return n;
        }
        sleep();
    }
    0
}

/// How one Leave's save ended (§2.2 step 4, with §2.7 D-2).
#[derive(Debug, Clone, PartialEq)]
pub struct LeaveEnding {
    pub done: bool,
    pub code: Option<i64>,
    pub why: Option<String>,
    pub rows: Vec<serde_json::Value>,
}

/// **§2.7 D-2: DONE requires ALL of — every seat's pid ended within the bound, tail-carry exit 0, and no row stops.**
/// Every other ending is NOT DONE, with why: a seat alive at the bound (named), exit 1 (the seat that stopped, named),
/// exit 2 including LEDGER_LOCKED (the carry's own why, which names the holder), exit 3, a timeout, a spawn failure,
/// or output that is not the contract (those three arrive as `Err` from `run_carry_json`, code null) — and, by §2.9 B2-1,
/// any spawn still in flight at its bound.
pub fn leave_ending(alive: &[String], in_flight: usize, carry: &Result<serde_json::Value, String>) -> LeaveEnding {
    let mut why: Vec<String> = Vec::new();
    // §2.9 B2-1: a seat still being spawned at the bound was never killed and never waited on.
    if in_flight > 0 {
        why.push(if in_flight == 1 {
            "1 seat was still being started at the bound, so it was never ended, and what it writes is not on the stick".to_string()
        } else {
            format!("{in_flight} seats were still being started at the bound, so they were never ended, and what they write is not on the stick")
        });
    }
    if !alive.is_empty() {
        why.push(format!(
            "{} seat{} had not ended when the save began, so what {} writes next is not on the stick: {}",
            alive.len(),
            if alive.len() == 1 { "" } else { "s" },
            if alive.len() == 1 { "it" } else { "they" },
            alive.join(", ")
        ));
    }
    let (code, rows) = match carry {
        Err(e) => {
            why.push(e.clone());
            (None, Vec::new())
        }
        Ok(v) => {
            let code = v.get("code").and_then(|c| c.as_i64());
            let rows = v.get("rows").and_then(|r| r.as_array()).cloned().unwrap_or_default();
            let text = |r: &serde_json::Value, k: &str| r.get(k).and_then(|x| x.as_str()).map(str::to_string);
            let stopped: Vec<String> = rows
                .iter()
                .filter(|r| r.get("stops").and_then(|x| x.as_bool()).unwrap_or(false))
                .map(|r| {
                    let sid = text(r, "sid").unwrap_or_default();
                    format!(
                        "{} ({}) stopped: {}{}",
                        text(r, "seat").unwrap_or_else(|| "a seat".into()),
                        sid.get(..8).unwrap_or(&sid),
                        text(r, "reason").or_else(|| text(r, "verdict")).unwrap_or_else(|| "no reason given".into()),
                        text(r, "why").map(|w| format!(" — {w}")).unwrap_or_default()
                    )
                })
                .collect();
            let outcome = text(v, "outcome").unwrap_or_else(|| "no outcome".into());
            match code {
                None => why.push(format!("the carry returned no exit code ({outcome})")),
                Some(0) => {}
                Some(c) if stopped.is_empty() => why.push(format!(
                    "{outcome} (exit {c}): {}",
                    text(v, "why").unwrap_or_else(|| "the carry gave no reason".into())
                )),
                Some(_) => {}
            }
            why.extend(stopped);
            (code, rows)
        }
    };
    LeaveEnding { done: why.is_empty() && code == Some(0), code, why: if why.is_empty() { None } else { Some(why.join("; ")) }, rows }
}

/// Write `value` to `path` tmp-then-rename (§2.1), so a reader never sees half a record.
pub fn write_json_atomic(path: &Path, value: &serde_json::Value) -> Result<(), String> {
    let name = path.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default();
    let tmp = path.with_file_name(format!("{name}.tmp"));
    let body = serde_json::to_string_pretty(value).map_err(|e| format!("could not encode {name} ({e})"))?;
    std::fs::write(&tmp, body).map_err(|e| format!("could not write {name} ({e})"))?;
    std::fs::rename(&tmp, path).map_err(|e| {
        let _ = std::fs::remove_file(&tmp);
        format!("could not put {name} in place ({e})")
    })
}

/// §2.2 step 5: write LEAVE_RESULT, THEN remove LEAVE_STARTED. In that order, so there is no moment with neither
/// file — which the waiter would read as case d and export again. Called again on a retry after a failed write.
pub fn write_leave_result(data_dir: &Path, result: &serde_json::Value) -> Result<(), String> {
    write_json_atomic(&data_dir.join(LEAVE_RESULT), result)?;
    match std::fs::remove_file(data_dir.join(LEAVE_STARTED)) {
        Ok(()) => Ok(()),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
        // The result is written, so the waiter reads case b whatever this file says; the failure is named, not fatal.
        Err(e) => Err(format!("the result was written, but {LEAVE_STARTED} could not be removed ({e})")),
    }
}

/// What the close does after the seats have ended.
#[derive(Debug, Clone, PartialEq)]
pub enum LeaveRun {
    /// No stick: exit as today — no Leave screen, no files.
    Exit,
    /// The Leave screen, with the result it shows. `written` is the result file's write: the exit button exists only
    /// once it is `Ok` (§2.2 step 6).
    Shown { result: serde_json::Value, written: Result<(), String> },
}

/// **§2.2 steps 2 to 5.** `alive` is step 1's answer and `in_flight` §2.9 B2-1's; `export` runs `tail-carry --export --json --apply` for the one
/// folder and is called only after LEAVE_STARTED is on disk.
///
/// **P-LEAVE-2 (a):** `app_started_at` is this session's recorded start time, the same string its waiter was given,
/// written as `appStartedAt` in BOTH files. Not `startedAt`, which the result already uses for when the Leave began.
pub fn run_leave(
    data_dir: &Path,
    app_pid: u32,
    alive: &[String],
    in_flight: usize,
    find: StickFind,
    app_started_at: &str,
    now: &dyn Fn() -> String,
    export: &mut dyn FnMut(&Path) -> Result<serde_json::Value, String>,
) -> LeaveRun {
    let result = |started_at: Option<&str>, stick: Option<String>, e: &LeaveEnding| {
        serde_json::json!({
            "pid": app_pid,
            "image": APP_IMAGE,
            "appStartedAt": app_started_at,
            "startedAt": started_at,
            "at": now(),
            "stick": stick,
            "outcome": if e.done { "DONE" } else { "NOT_DONE" },
            "code": e.code,
            "why": e.why,
            "rows": e.rows,
        })
    };
    match find {
        StickFind::None => LeaveRun::Exit,
        StickFind::Many(folders) => {
            // Nothing is picked and nothing is exported. "stick" is null: there is no one folder to name, so every
            // one is named in why instead (B's D-10 — 2.1 does not define the field for this branch).
            let named = folders.iter().map(|f| f.folder.display().to_string()).collect::<Vec<_>>().join(" | ");
            let e = leave_ending(alive, in_flight, &Err(format!("more than one stick folder, and none is picked: {named}. Nothing was saved")));
            let r = result(None, None, &e);
            let written = write_leave_result(data_dir, &r);
            LeaveRun::Shown { result: r, written }
        }
        StickFind::One(f) => {
            let stick = f.folder.display().to_string();
            let started_at = now();
            let started = serde_json::json!({ "pid": app_pid, "image": APP_IMAGE, "appStartedAt": app_started_at, "at": started_at, "stick": stick });
            let ending = match write_json_atomic(&data_dir.join(LEAVE_STARTED), &started) {
                // Not exported without it: a Consonance stopped mid-save must be tellable from one that never began,
                // or the waiter's case c cannot exist (§2.3).
                Err(e) => leave_ending(alive, in_flight, &Err(format!("{e}, so nothing was saved"))),
                Ok(()) => leave_ending(alive, in_flight, &export(&f.folder)),
            };
            let r = result(Some(&started_at), Some(stick), &ending);
            let written = write_leave_result(data_dir, &r);
            LeaveRun::Shown { result: r, written }
        }
    }
}

/// What the launch does with LEAVE_* files it finds (§2.7 D-4).
#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct LeaveCleanup {
    pub remove: Vec<(PathBuf, String)>,
    pub keep: Vec<(PathBuf, String)>,
}

/// **§2.7 D-4: THE WAITER OWNS REMOVAL.** The launch removes a LEAVE_* file only when `stick-waiter.lock` names no live
/// holder AND the Consonance the file names is not live. Run after `set_dirs`, and before this launch starts its own
/// waiter, so a lock found here is the previous session's.
///
/// **As ruled, and no further.** A file naming THIS process's pid names a live Consonance, so it is kept — although it
/// was written by an earlier Consonance that had the same pid. B's D-8 is built for the WAITER by P-LEAVE-2 (a): both
/// files now carry `appStartedAt`, and the waiter matches on the pid AND it. This cleanup does not read the field —
/// P-LEAVE-2 did not rule it here — so such a file is still kept, and the waiter that owns it reads it as stale.
///
/// No LEAVE_* file: nothing is read at all, not even the lock.
pub fn leave_cleanup(data_dir: &Path, probe: &dyn Fn(u32) -> Listing) -> LeaveCleanup {
    let mut out = LeaveCleanup::default();
    let files: Vec<PathBuf> = [LEAVE_STARTED, LEAVE_RESULT].iter().map(|n| data_dir.join(n)).filter(|p| p.is_file()).collect();
    if files.is_empty() {
        return out;
    }
    let lock = data_dir.join(WAITER_LOCK);
    if lock.exists() {
        let holder = std::fs::read_to_string(&lock)
            .ok()
            .and_then(|raw| serde_json::from_str::<serde_json::Value>(raw.trim_start_matches('\u{feff}')).ok())
            .and_then(|v| v.get("pid").and_then(|p| p.as_u64()))
            .filter(|p| *p <= u32::MAX as u64);
        let why = match holder {
            None => Some(format!("{WAITER_LOCK} cannot be read, so whether the last session's waiter is live cannot be told")),
            Some(pid) => match probe(pid as u32) {
                // §2.9 B2-2: a list that cannot be trusted removes nothing.
                Listing::CannotTell => Some("the process list could not be read, so whether the last session's waiter is live cannot be told".to_string()),
                Listing::Running(p) if image_stem(&p.name) == "node" => {
                    Some(format!("the last session's exit waiter (pid {pid}) is live, and it removes these after acting on them"))
                }
                _ => None,
            },
        };
        if let Some(why) = why {
            out.keep = files.into_iter().map(|f| (f, why.clone())).collect();
            return out;
        }
    }
    for f in files {
        let pid = std::fs::read_to_string(&f)
            .ok()
            .and_then(|raw| serde_json::from_str::<serde_json::Value>(raw.trim_start_matches('\u{feff}')).ok())
            .and_then(|v| v.get("pid").and_then(|p| p.as_u64()))
            .filter(|p| *p <= u32::MAX as u64)
            .map(|p| p as u32);
        match pid {
            None => out.remove.push((f, "it names no pid, so no waiter can match it".into())),
            Some(p) => match probe(p) {
                Listing::CannotTell => out.keep.push((f, "the process list could not be read, so whether it is stale cannot be told".into())),
                Listing::Running(info) if image_stem(&info.name) == image_stem(APP_IMAGE) => {
                    out.keep.push((f, format!("the Consonance it names (pid {p}) is still running")))
                }
                _ => out.remove.push((f, format!("the Consonance it names (pid {p}) is not running"))),
            },
        }
    }
    out
}

// END OF THE STICK AT LAUNCH

#[cfg(test)]
mod tests {
    use super::*;

    fn ok_completion(pushed_by: Option<&str>, head: Option<&str>) -> Completion {
        Completion {
            verified: true,
            installed: true,
            stage: Some("done".to_string()),
            why: None,
            head: head.map(str::to_string),
            pushed_by: pushed_by.map(str::to_string),
            machine: None,
        }
    }

    fn synced(pushed_by: Option<&str>, me: Option<&str>) -> Facts {
        Facts {
            pull: Some(Pull::Ok),
            completion: Some(ok_completion(pushed_by, Some("aaaaaaa1111"))),
            promotion_open: false,
            self_id: me.map(str::to_string),
            adopted_commit: None,
            live_host: None,
        }
    }

    // ---- the case the desktop hits at 08:00 --------------------------------------------------

    /// THE PACKET'S OBJECTIVE, as a test. A verified pull whose head was authored elsewhere must
    /// migrate — this is the whole reason the module exists.
    #[test]
    fn a_verified_pull_authored_elsewhere_migrates() {
        let v = decide(&synced(Some("laptop-L"), Some("desktop-D")));
        assert!(v.is_migrate(), "got {v:?}");
        assert!(v.why().contains("laptop-L") && v.why().contains("desktop-D"));
    }

    /// THE FALSIFIER, as a test: a seat whose first words come from this machine's own transcript.
    /// The head is ours, so nothing may be retired — otherwise every relaunch on the machine that
    /// is doing the work throws away its own vendor-side resume.
    #[test]
    fn a_verified_pull_we_authored_resumes_and_retires_nothing() {
        let v = decide(&synced(Some("desktop-D"), Some("desktop-D")));
        assert!(!v.is_migrate(), "got {v:?}");
        assert!(matches!(v, Verdict::Resume { .. }));
    }

    /// THE LEAN, pinned. Unknown identity is not "probably fine" — it takes the reversible error.
    /// If this test is ever flipped, the module's stated policy has been reversed and the comment
    /// on `decide` must be rewritten with it.
    #[test]
    fn an_unknown_head_author_migrates_because_retiring_is_the_reversible_error() {
        let v = decide(&synced(None, Some("desktop-D")));
        assert!(v.is_migrate(), "got {v:?}");
        assert!(v.why().contains("pushed_by"), "the row must name the field that would end it");
    }

    /// ...but it must not THRASH. Once a head is adopted, the next launch on the same head does
    /// nothing, even with no author recorded. Without this, the degraded mode retires the seats it
    /// installed one launch earlier, every launch, forever.
    #[test]
    fn an_already_adopted_head_does_not_retire_again() {
        let mut f = synced(None, Some("desktop-D"));
        f.adopted_commit = Some("aaaaaaa1111".to_string());
        let v = decide(&f);
        assert!(matches!(v, Verdict::Resume { .. }), "got {v:?}");
    }

    /// E's file decides when the tool names no author, and the row says it is the weaker signal —
    /// so a reader of the board can tell which evidence moved the machine.
    #[test]
    fn live_host_corroborates_when_the_tool_names_no_author() {
        let mut f = synced(None, Some("desktop-D"));
        f.live_host = Some("laptop-L".to_string());
        let v = decide(&f);
        assert!(v.is_migrate(), "got {v:?}");
        assert!(v.why().contains("live_host.json") && v.why().contains("reversible"));
    }

    // ---- the refusal ruling ------------------------------------------------------------------

    /// THE RULING THE PACKET ASKED FOR, as an executable assertion rather than a paragraph.
    /// No combination of facts may produce a state in which the app does not open.
    #[test]
    fn no_verdict_is_ever_a_lockout() {
        let pulls = [
            Pull::ToolAbsent,
            Pull::CouldNotRun("node not found".into()),
            Pull::Failed("exit 1".into()),
            Pull::Ok,
        ];
        let half_installed = Completion {
            verified: true,
            installed: false,
            stage: Some("install".to_string()),
            ..Default::default()
        };
        let completions = [
            None,
            Some(Completion::default()),
            Some(ok_completion(None, None)),
            Some(ok_completion(Some("other"), Some("bbbb"))),
            Some(half_installed),
        ];
        let mut seen = 0;
        for p in &pulls {
            for c in &completions {
                for promo in [false, true] {
                    for me in [None, Some("desktop-D")] {
                        let f = Facts {
                            pull: Some(p.clone()),
                            completion: c.clone(),
                            promotion_open: promo,
                            self_id: me.map(str::to_string),
                            adopted_commit: None,
                            live_host: None,
                        };
                        let v = decide(&f);
                        // Every verdict opens the window. `ReadOnly` is the strictest and it still
                        // opens — it withholds the SEATS, and it says how to proceed anyway.
                        assert!(!v.why().is_empty(), "every verdict must state its reason");
                        if v.is_read_only() {
                            assert!(
                                v.why().contains("nothing is locked"),
                                "the strictest verdict must say it is not a lockout: {}",
                                v.why()
                            );
                        }
                        seen += 1;
                    }
                }
            }
        }
        assert_eq!(seen, 4 * 5 * 2 * 2, "the enumeration must be exhaustive, not illustrative");
    }

    /// The one condition that withholds the seats, and the only one.
    #[test]
    fn a_half_promoted_data_dir_is_the_only_read_only() {
        let mut f = synced(Some("laptop-L"), Some("desktop-D"));
        f.promotion_open = true;
        assert!(decide(&f).is_read_only());
        f.promotion_open = false;
        assert!(!decide(&f).is_read_only());
    }

    /// A pull that could not run is NOT the same as a pull that half-ran, and the difference is
    /// the difference between a normal launch and a withheld one. `absenceClass` in E's live-host
    /// module is the same lesson on a different surface: an absence has no author.
    #[test]
    fn a_pull_that_never_ran_leaves_the_local_house_startable() {
        let f = Facts {
            pull: Some(Pull::CouldNotRun("node is not on PATH".into())),
            ..Default::default()
        };
        let v = decide(&f);
        assert!(matches!(v, Verdict::LocalHouse { .. }), "got {v:?}");
        assert!(v.why().contains("node is not on PATH"), "the cause must reach the row");
    }

    /// EXIT 0 IS NOT EVIDENCE ABOUT THE RECORD. This is L045's defect stated as a rule: a
    /// command's status taken as the state of the world. `cargo test --lib` returned exit 0 on a
    /// crate with no lib target and tested nothing.
    #[test]
    fn exit_zero_with_no_completion_record_is_not_synced() {
        let f = Facts { pull: Some(Pull::Ok), completion: None, ..Default::default() };
        let v = decide(&f);
        assert!(matches!(v, Verdict::LocalHouse { .. }), "got {v:?}");
        assert!(v.why().contains("exit code is a claim about a process"));
    }

    /// No tool, no change. The laptop tonight must launch exactly as it did last night.
    #[test]
    fn without_the_tool_nothing_changes() {
        assert!(matches!(decide(&Facts::default()), Verdict::Standalone { .. }));
    }

    // ---- the retire, from fixture files ------------------------------------------------------

    fn fixture_root(name: &str) -> PathBuf {
        let p = std::env::temp_dir().join(format!("consonance-retire-{name}-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&p);
        p
    }

    fn seats() -> Vec<(String, String, String)> {
        vec![
            ("main".into(), "0c0c0c0a-0000-4000-8000-000000000a01".into(), "C--Consonance-instances-main".into()),
            ("librarian".into(), "0c0c0c0b-1111".into(), "C--Consonance-instances-librarian".into()),
            ("third place".into(), "0c0c0c0c-2222".into(), "C--Consonance-instances-third-place".into()),
        ]
    }

    /// THE RETIRE DECISION EXERCISED FROM FIXTURE FILES — the packet's §4 bar. Nobody can re-run
    /// 08:00, so the migration is proved on a fake home directory that this test builds.
    #[test]
    fn retire_moves_the_transcript_out_of_the_indexed_tree_and_it_is_revivable() {
        let home = fixture_root("basic");
        let plan = retire_plan(&home, &seats(), "20260909-0800");
        // Only two of the three seats have ever run on this fixture machine.
        for s in plan.iter().take(2) {
            std::fs::create_dir_all(s.from.parent().unwrap()).unwrap();
            std::fs::write(&s.from, format!("this machine's own past for {}\n", s.seat)).unwrap();
        }

        let out = apply_retire(&plan, &HashMap::new());
        assert_eq!(out.iter().filter(|o| o.moved).count(), 2);
        assert_eq!(out.iter().filter(|o| o.error.is_some()).count(), 0);
        // The third is "nothing to retire", NOT a failure — the two must never collapse into one
        // count, because one is routine and the other means a seat woke on the wrong thread.
        let third = &out[2];
        assert!(!third.moved && third.error.is_none());

        // THE FILE `--resume` WOULD FIND IS GONE...
        assert!(!plan[0].from.exists(), "the vendor must not be able to find it");
        // ...AND IT IS OUT OF ~/.claude/projects ENTIRELY, not merely renamed inside it.
        let projects = home.join(".claude").join("projects");
        assert!(!plan[0].to.starts_with(&projects), "an attic inside projects/ is still indexed");
        // ...AND IT IS STILL THERE. Retire, never overwrite.
        assert_eq!(
            std::fs::read_to_string(&plan[0].to).unwrap(),
            "this machine's own past for main\n"
        );

        // REVIVABLE means exactly one move back, and this asserts it rather than claiming it.
        std::fs::rename(&plan[0].to, &plan[0].from).unwrap();
        assert!(plan[0].from.exists(), "a retired transcript that cannot be revived is a deleted one");
        let _ = std::fs::remove_dir_all(&home);
    }

    /// THE LESSON FROM `resume_pane`, which keeps a single `.orphaned` file and deletes the
    /// previous one: an archive exactly one deep destroys the first retirement on the second
    /// migration. Two migrations, two files, both readable.
    #[test]
    fn a_second_retirement_does_not_destroy_the_first() {
        let home = fixture_root("twice");
        let first = retire_plan(&home, &seats(), "20260909-0800");
        std::fs::create_dir_all(first[0].from.parent().unwrap()).unwrap();
        std::fs::write(&first[0].from, "monday").unwrap();
        apply_retire(&first, &HashMap::new());

        let second = retire_plan(&home, &seats(), "20260910-0800");
        std::fs::write(&second[0].from, "tuesday").unwrap();
        apply_retire(&second, &HashMap::new());

        assert_ne!(first[0].to, second[0].to, "the stamp must make the names distinct");
        assert_eq!(std::fs::read_to_string(&first[0].to).unwrap(), "monday");
        assert_eq!(std::fs::read_to_string(&second[0].to).unwrap(), "tuesday");
        let _ = std::fs::remove_dir_all(&home);
    }

    /// A FAILED RETIRE IS THE DANGEROUS OUTCOME and must be loud in the row, in words that say
    /// what it means for the seat — not a count of successes with a quiet remainder.
    #[test]
    fn the_seam_row_names_a_failed_retire_and_what_it_costs() {
        let out = vec![RetireOutcome {
            seat: "main".into(),
            from: PathBuf::from("a"),
            to: PathBuf::from("b"),
            moved: false,
            error: Some("Access is denied. (os error 5)".into()),
            kept_carried: false,
        }];
        let line = seam_line(&decide(&synced(Some("laptop-L"), Some("desktop-D"))), &out);
        assert!(line.contains("RETIRE FAILED for main"));
        assert!(line.contains("will resume THIS machine's transcript"));
    }

    /// The row a reader can act on: which seats moved, and to where.
    #[test]
    fn the_seam_row_names_where_each_transcript_went() {
        let home = fixture_root("row");
        let plan = retire_plan(&home, &seats(), "20260909-0800");
        std::fs::create_dir_all(plan[0].from.parent().unwrap()).unwrap();
        std::fs::write(&plan[0].from, "x").unwrap();
        let out = apply_retire(&plan, &HashMap::new());
        let line = seam_line(&decide(&synced(Some("laptop-L"), Some("desktop-D"))), &out);
        assert!(line.starts_with("sync at launch — MIGRATE:"));
        assert!(line.contains("RETIRED 1 transcript(s), 2 seat(s) had none here"));
        assert!(line.contains("consonance-attic"));
        let _ = std::fs::remove_dir_all(&home);
    }

    // ---- the stick's receipt: a carried conversation is not this machine's past ----------------

    /// Vendor-shaped: a header with no timestamp (byte-identical across conversations under one
    /// sid), then timestamped turns. The first timestamped record is the identity.
    fn convo(first_stamp: &str) -> String {
        format!(
            "{{\"type\":\"mode\",\"sessionId\":\"s\"}}\n{{\"type\":\"user\",\"timestamp\":\"{first_stamp}\",\"uuid\":\"u0\"}}\n"
        )
    }

    fn write_receipt(home: &Path, sid: &str, line: &str) {
        let p = carried_receipt_path(home);
        std::fs::create_dir_all(p.parent().unwrap()).unwrap();
        let body = serde_json::json!({ "version": 1, "seats": { sid: { "seat": "main", "line": line } } });
        std::fs::write(p, body.to_string()).unwrap();
    }

    /// THE 2026-09-14 CASE. The stick placed D's conversation for a fixed seat, the state head is
    /// D-authored so the verdict is MIGRATE — and the placed conversation must stay where
    /// `--resume` finds it, not go to the attic.
    #[test]
    fn a_conversation_the_stick_placed_is_kept_through_a_migrate() {
        let home = fixture_root("carried");
        let plan = retire_plan(&home, &seats(), "20260914-0037");
        let carried = convo("2026-06-30T05:00:00.000Z");
        std::fs::create_dir_all(plan[0].from.parent().unwrap()).unwrap();
        // It grew after the carry (the seat resumed and talked): identity is the first record, not size.
        std::fs::write(&plan[0].from, format!("{carried}{{\"type\":\"assistant\",\"timestamp\":\"2026-09-14T06:40:00Z\"}}\n")).unwrap();
        write_receipt(&home, &plan[0].sid, carried.lines().nth(1).unwrap());

        let receipt = read_carried(&carried_receipt_path(&home)).unwrap();
        let out = apply_retire(&plan, &receipt);

        assert!(out[0].kept_carried && !out[0].moved && out[0].error.is_none());
        assert!(plan[0].from.exists(), "the carried conversation must stay where --resume finds it");
        let _ = std::fs::remove_dir_all(&home);
    }

    /// The receipt names the sid, but the file here is a DIFFERENT conversation under it — this
    /// machine's own past, the case the retire exists for. It still retires.
    #[test]
    fn a_different_conversation_under_a_carried_sid_still_retires() {
        let home = fixture_root("carried-other");
        let plan = retire_plan(&home, &seats(), "20260914-0037");
        std::fs::create_dir_all(plan[0].from.parent().unwrap()).unwrap();
        std::fs::write(&plan[0].from, convo("2026-09-11T00:27:29.000Z")).unwrap();
        write_receipt(&home, &plan[0].sid, convo("2026-06-30T05:00:00.000Z").lines().nth(1).unwrap());

        let out = apply_retire(&plan, &read_carried(&carried_receipt_path(&home)).unwrap());

        assert!(out[0].moved && !out[0].kept_carried);
        assert!(!plan[0].from.exists());
        let _ = std::fs::remove_dir_all(&home);
    }

    #[test]
    fn no_receipt_is_an_empty_map_and_a_broken_one_is_an_error() {
        let home = fixture_root("receipt-read");
        assert!(read_carried(&carried_receipt_path(&home)).unwrap().is_empty());
        let p = carried_receipt_path(&home);
        std::fs::create_dir_all(p.parent().unwrap()).unwrap();
        std::fs::write(&p, "{not json").unwrap();
        assert!(read_carried(&p).is_err(), "an unreadable receipt must be said, not read as none");
        let _ = std::fs::remove_dir_all(&home);
    }

    #[test]
    fn the_seam_row_names_a_kept_seat_and_does_not_count_it_absent() {
        let out = vec![RetireOutcome {
            seat: "main".into(),
            from: PathBuf::from("a.jsonl"),
            to: PathBuf::from("b"),
            moved: false,
            error: None,
            kept_carried: true,
        }];
        let line = seam_line(&decide(&synced(Some("laptop-L"), Some("desktop-D"))), &out);
        assert!(line.contains("RETIRED 0 transcript(s), 0 seat(s) had none here"), "{line}");
        assert!(line.contains("KEPT 1 the stick placed; main resumes a.jsonl"), "{line}");
    }

    // ---- reading the facts -------------------------------------------------------------------

    #[test]
    fn completion_and_adopted_round_trip_through_disk() {
        let dir = fixture_root("read");
        std::fs::create_dir_all(&dir).unwrap();
        assert_eq!(read_completion(&dir), None, "absent is None, never a default-true");
        assert!(!promotion_open(&dir));

        // The literal `state-sync.js` writes, field for field (A, `writeCompletion`).
        std::fs::write(
            dir.join(COMPLETION_FILE),
            r#"{"version":1,"written_by":"consonance/tools/state-sync.js","machine":"D",
                "verified":true,"installed":true,"installed_into":"C:\\Consonance\\data",
                "stage":"done","why":null,"failures":[],"head":"deadbee",
                "pushed_by":"L","pushed_at":"2026-09-09T08:00:00.000Z"}"#,
        )
        .unwrap();
        let c = read_completion(&dir).unwrap();
        assert!(c.verified && c.installed);
        assert_eq!(c.pushed_by.as_deref(), Some("L"));
        assert_eq!(c.head.as_deref(), Some("deadbee"));
        assert_eq!(c.stage.as_deref(), Some("done"));

        write_adopted(&dir, Some("deadbeefcafe"), 1788943357, "MIGRATE");
        assert_eq!(read_adopted(&dir).as_deref(), Some("deadbeefcafe"));

        std::fs::write(dir.join(PROMOTION_JOURNAL), "").unwrap();
        assert!(promotion_open(&dir), "the journal's PRESENCE is the signal, not its contents");
        let _ = std::fs::remove_dir_all(&dir);
    }

    /// A BOM has silently killed a JSON parse in this repo twice (`load_offsets_from` says so).
    /// It must not be able to turn a verified pull into an unverified one.
    #[test]
    fn a_bom_does_not_make_a_verified_pull_read_as_unverified() {
        let dir = fixture_root("bom");
        std::fs::create_dir_all(&dir).unwrap();
        std::fs::write(dir.join(COMPLETION_FILE), "\u{feff}{\"verified\":true}").unwrap();
        assert!(read_completion(&dir).unwrap().verified);
        let _ = std::fs::remove_dir_all(&dir);
    }

    /// **VERIFIED IS NOT ARRIVED.** `--pull` without `--install` leaves the record in the state
    /// checkout, and A split the record's two fields precisely so a launcher could not miss it:
    /// *"a launcher that only asks 'verified?' would start on it."* This is that launcher, not
    /// starting on it.
    #[test]
    fn verified_but_never_installed_is_the_local_house_not_the_synced_one() {
        let mut f = synced(Some("laptop-L"), Some("desktop-D"));
        let c = f.completion.as_mut().unwrap();
        c.installed = false;
        c.stage = Some("done".to_string());
        let v = decide(&f);
        assert!(matches!(v, Verdict::LocalHouse { .. }), "got {v:?}");
        assert!(v.why().contains("VERIFIED BUT DID NOT INSTALL"));
        assert!(v.why().contains("--pull --install"), "the row must name the way out");
    }

    /// **THE REAL RECORD, NOT AN INVENTED ONE.** This is `sync-completion.json` verbatim as
    /// `state-sync.js --pull` wrote it on this machine at 2026-09-09 09:50Z, when the state repo
    /// and the local tree had diverged. It is here because every other fixture in this module is
    /// my own idea of A's output, and the first version of this module was built entirely on an
    /// idea of A's output that turned out to be wrong in every field name.
    #[test]
    fn the_first_real_completion_record_this_tool_ever_wrote_is_the_local_house() {
        let dir = fixture_root("real");
        std::fs::create_dir_all(&dir).unwrap();
        std::fs::write(
            dir.join(COMPLETION_FILE),
            r#"{
  "version": 1,
  "written_by": "consonance/tools/state-sync.js",
  "at": "2026-09-09T09:50:16.454Z",
  "machine": "L",
  "state_dir": "C:\\Consonance\\state",
  "data_dir": "C:\\Consonance\\data",
  "verified": false,
  "installed": false,
  "stage": "fast-forward",
  "why": "merge: origin/main - not something we can merge",
  "failures": []
}"#,
        )
        .unwrap();
        let f = Facts {
            // The tool exited 1, so this arm is reached twice over — but the record alone must
            // also be enough, which is what this asserts.
            pull: Some(Pull::Ok),
            completion: read_completion(&dir),
            self_id: Some("L".to_string()),
            ..Default::default()
        };
        let v = decide(&f);
        assert!(matches!(v, Verdict::LocalHouse { .. }), "got {v:?}");
        assert!(v.why().contains("not something we can merge"), "A's reason must reach the row");
        let _ = std::fs::remove_dir_all(&dir);
    }

    /// **EVERY STAGE `state-sync.js` CAN WRITE, AND WHAT EACH ONE MEANS HERE.** Enumerated from
    /// the tool's five `writeCompletion` call sites rather than reasoned about — the same move
    /// that made L051's refusal clause safe. Exactly one of them withholds the seats; if A adds a
    /// sixth stage, the `_` arm below is what this test does NOT cover and the hand-back says so.
    #[test]
    fn every_stage_the_tool_writes_maps_to_a_stated_verdict() {
        let cases: [(&str, bool, bool, fn(&Verdict) -> bool); 5] = [
            ("fetch", false, false, |v| matches!(v, Verdict::LocalHouse { .. })),
            ("fast-forward", false, false, |v| matches!(v, Verdict::LocalHouse { .. })),
            ("verify", false, false, |v| matches!(v, Verdict::LocalHouse { .. })),
            ("install", true, false, |v| v.is_read_only()),
            ("done", true, true, |v| v.is_migrate()),
        ];
        for (stage, verified, installed, want) in cases {
            let f = Facts {
                pull: Some(Pull::Ok),
                completion: Some(Completion {
                    verified,
                    installed,
                    stage: Some(stage.to_string()),
                    why: None,
                    head: Some("deadbee".to_string()),
                    pushed_by: Some("laptop-L".to_string()),
                    machine: None,
                }),
                self_id: Some("desktop-D".to_string()),
                ..Default::default()
            };
            let v = decide(&f);
            assert!(want(&v), "stage {stage} produced {v:?}");
        }
        // And the `done` stage with `installed: false` is the third shape of that one stage —
        // the record verified and never arrived, which is a different thing from a failed install.
        let f = Facts {
            pull: Some(Pull::Ok),
            completion: Some(Completion {
                verified: true,
                installed: false,
                stage: Some("done".to_string()),
                pushed_by: Some("laptop-L".to_string()),
                ..Default::default()
            }),
            self_id: Some("desktop-D".to_string()),
            ..Default::default()
        };
        assert!(matches!(decide(&f), Verdict::LocalHouse { .. }));
    }

    /// **THE TWO-PHASE PULL'S SAFETY PROPERTY, on the decision side.** Phase one runs without
    /// `--install`, so on the machine that authored the record `installed` is deliberately false.
    /// Asking "installed?" before "whose?" would read that safe case as the half-arrival and put
    /// the working machine into LocalHouse at every launch.
    #[test]
    fn our_own_record_resumes_even_though_nothing_was_installed() {
        let f = Facts {
            pull: Some(Pull::Ok),
            completion: Some(Completion {
                verified: true,
                installed: false,
                stage: Some("done".to_string()),
                head: Some("deadbee".to_string()),
                pushed_by: Some("L".to_string()),
                ..Default::default()
            }),
            self_id: Some("L".to_string()),
            ..Default::default()
        };
        let v = decide(&f);
        assert!(matches!(v, Verdict::Resume { .. }), "got {v:?}");
        assert!(v.why().contains("nothing needed to be"));
    }

    /// **BOTH SIDES OF THE EQUALITY COME FROM ONE RESOLVER — the bug I had already written.**
    ///
    /// `desktop-install.ps1` sets no `machine_tag`, and the two cascades did not agree past that
    /// point: `state-sync.js` ends at `os.hostname()`, `machine_identity()` ends at `None`. So on
    /// the desktop A would have stamped a hostname into `pushed_by` while this side supplied
    /// nothing, the self-check would never have fired, and the launcher would have migrated
    /// forever with nothing naming why. Taking the self-id out of A's own record removes the class.
    ///
    /// The fixture makes it explicit: `self_id` here is deliberately WRONG, and the decision still
    /// comes out right because the record's own `machine` field is what is compared.
    #[test]
    fn the_self_id_is_taken_from_the_tools_own_record_not_from_a_second_resolver() {
        let f = Facts {
            pull: Some(Pull::Ok),
            completion: Some(Completion {
                verified: true,
                installed: true,
                stage: Some("done".to_string()),
                head: Some("deadbee".to_string()),
                pushed_by: Some("DESKTOP-7F2A".to_string()),
                machine: Some("DESKTOP-7F2A".to_string()),
                ..Default::default()
            }),
            // What a second resolver would have said on that machine: nothing.
            self_id: None,
            ..Default::default()
        };
        assert!(matches!(decide(&f), Verdict::Resume { .. }), "the tool's own reading must win");
    }

    /// **THE HALF-PROMOTED DATA DIR, FROM A's OWN RECORD.** `installTree` copies file by file, so
    /// a failure at `stage: "install"` means some of the data dir is the record and some is this
    /// machine's. That is the one condition that withholds the seats — and it is detected from the
    /// tool's report rather than from the journal I had assumed A would write, which A does not.
    #[test]
    fn an_install_that_failed_part_way_withholds_the_seats() {
        let mut f = synced(Some("laptop-L"), Some("desktop-D"));
        let c = f.completion.as_mut().unwrap();
        c.installed = false;
        c.stage = Some("install".to_string());
        c.why = Some("EPERM writing board.jsonl".to_string());
        let v = decide(&f);
        assert!(v.is_read_only(), "got {v:?}");
        assert!(v.why().contains("EPERM"), "A's reason must reach the row, not be restated");
        assert!(v.why().contains("attic/pre-sync-*"), "the row must name where the displaced went");
    }

    /// Another seat's file, read leniently: an unrecognised shape degrades to NO SIGNAL, never to
    /// a confident wrong host. E owns `live_host.json` and may change it without telling this file.
    #[test]
    fn an_unrecognised_live_host_shape_is_no_signal_not_a_wrong_host() {
        let dir = fixture_root("livehost");
        std::fs::create_dir_all(&dir).unwrap();
        std::fs::write(dir.join(LIVE_HOST_FILE), r#"{"machine":"laptop-L"}"#).unwrap();
        assert_eq!(read_live_host(&dir), None, "an unknown key must not be guessed at");
        std::fs::write(dir.join(LIVE_HOST_FILE), r#"{"host":"laptop-L"}"#).unwrap();
        assert_eq!(read_live_host(&dir).as_deref(), Some("laptop-L"));
        let _ = std::fs::remove_dir_all(&dir);
    }

    /// The seat must never be told it has no past when it has one it could not carry.
    #[test]
    fn a_tail_that_could_not_ride_becomes_a_pointer_not_a_silence() {
        let p = PathBuf::from("C:\\Consonance\\data\\captures\\main.txt");
        let s = prior_conversation_pointer(&p, 240_000);
        assert!(s.contains("240000") && s.contains("captures"));
        assert!(s.contains("you have a past here and this shell is not it"));
    }

    /// The restore wording is shared with `warm_resume_brief` on purpose — a seat that meets two
    /// framings of one event has been told the room disagrees with itself about what a restore is.
    #[test]
    fn the_prior_conversation_section_keeps_the_rooms_restore_wording() {
        let s = prior_conversation_section("❯ hi\n\n● hello\n", Some("The interval, witnessed: ..."));
        assert!(s.contains("Read it as your own memory, not a transcript handed to a stranger"));
        assert!(s.contains("Do not re-greet, summarize, or announce that you were restored"));
        assert!(s.contains("retired (moved aside, revivable), not deleted"));
        assert!(s.contains("❯ hi"));
    }
}

/// L059, pane E — the stick at launch. Behavioural against real temp directories, plus two wiring
/// assertions where a behaviour cannot be observed from inside a test (a process that was NOT started).
#[cfg(test)]
mod stick_tests {
    use super::*;
    use std::fs;

    fn scratch(tag: &str) -> PathBuf {
        let d = std::env::temp_dir().join(format!("consonance_l059_{tag}_{}", std::process::id()));
        let _ = fs::remove_dir_all(&d);
        fs::create_dir_all(&d).unwrap();
        d
    }

    fn put(p: &Path, body: &str) {
        fs::create_dir_all(p.parent().unwrap()).unwrap();
        fs::write(p, body).unwrap();
    }

    fn nothing_runs(_: u32) -> Option<ProcInfo> {
        None
    }

    // ── THE NO-STICK BAR ────────────────────────────────────────────────────────────────────────

    /// **THE NO-STICK TEST — against THE NO-STICK BAR, RESTATED (§3, ~03:30).** Two volumes that look like
    /// a working machine (ordinary folders, a `HANDOFF.md` with nothing beside it, a `consonance-tails/` with
    /// no ledger in it), no handshake, no result. The launch look must find NO stick, write NO persist.log
    /// row and withhold NO seat. The bar's one permitted spawn, the exit waiter, is pinned separately in
    /// main.rs (`the_exit_waiter_is_started_on_every_launch_and_logs_only_when_it_cannot_start`).
    #[test]
    fn a_launch_with_no_stick_writes_no_row_and_withholds_no_seat() {
        let c = scratch("nostick_c");
        let d = scratch("nostick_d");
        let data = scratch("nostick_data");
        fs::create_dir_all(c.join("Users").join("someone")).unwrap();
        fs::create_dir_all(c.join("Windows")).unwrap();
        put(&d.join("photos").join("HANDOFF.md"), "a handoff with no ledger beside it is not a stick");
        fs::create_dir_all(d.join("backup").join("consonance-tails")).unwrap();

        let a = arrive(&[c.clone(), d.clone()], &data, &nothing_runs);

        assert_eq!(a.stick, StickFind::None, "a launch with no stick found one");
        assert!(a.log_lines().is_empty(), "a no-stick launch writes rows a launch before the module did not: {:?}", a.log_lines());
        assert!(!a.withhold(), "a no-stick launch withholds the seats");
        for p in [c, d, data] {
            let _ = fs::remove_dir_all(p);
        }
    }

    /// **AND IT WRITES NO FILE.** THE NO-STICK BAR, RESTATED allows a no-stick launch exactly one new file,
    /// the waiter's own `stick-waiter.lock`, and that is the waiter's to write. The launch look adds none:
    /// the volumes and the data dir hold exactly the same entries after it as before.
    #[test]
    fn a_launch_with_no_stick_writes_no_file() {
        let c = scratch("nofile_c");
        let data = scratch("nofile_data");
        fs::create_dir_all(c.join("Users")).unwrap();
        put(&data.join("persist.log"), "1789367339 SYNC AT LAUNCH RESUME — fine
");
        let listing = |d: &Path| -> Vec<String> {
            let mut v: Vec<String> = fs::read_dir(d).unwrap().flatten().map(|e| e.file_name().to_string_lossy().to_string()).collect();
            v.sort();
            v
        };
        let (c0, d0) = (listing(&c), listing(&data));

        let _ = arrive(&[c.clone()], &data, &nothing_runs);

        assert_eq!((listing(&c), listing(&data)), (c0, d0), "the launch look left a file behind on a launch with no stick");
        for p in [c, data] {
            let _ = fs::remove_dir_all(p);
        }
    }

    /// **AND IT STARTS NO PROCESS** — which no assertion inside a test can observe, so it is pinned at
    /// the source: nothing the launch calls may start one. E-2's measurement is why this matters: a
    /// verifier asked about every volume passes the rows bar above and still costs every launch a node
    /// process per volume.
    #[test]
    fn the_launch_look_at_the_stick_starts_no_process() {
        let src = fs::read_to_string("src/sync_launch.rs").expect("read own source");
        let start = src.find("// THE STICK AT LAUNCH").expect("the stick block is gone — re-point this test");
        let end = src[start..].find("// END OF THE STICK AT LAUNCH").map(|e| start + e).expect("the end marker is gone — re-point this test");
        let block = &src[start..end];
        for needle in [concat!("Command", "::new"), concat!(".spawn", "("), concat!("process::", "Command")] {
            assert!(!block.contains(needle), "the launch-time stick code starts a process (`{needle}`)");
        }
    }

    // ── §3: WHERE THE STICK IS ─────────────────────────────────────────────────────────────────
    //
    // These mirror §3's ONE find table row for row, and add no row it does not have (the table's own rule:
    // the same rule lives in A's Node waiter, and two copies drift on the case only one of them tests).
    // Row 1, no marker, is the no-stick test above.

    /// **E-5, as a test: tonight's real stick keeps everything one folder down.** The folder, not the
    /// volume, is the stick.
    #[test]
    fn the_real_sticks_shape_is_found_one_folder_down_as_the_older_layout() {
        let d = scratch("realshape");
        let folder = d.join("consonance-L-20260911");
        put(&folder.join("consonance-tails").join("ledger.json"), "{}");
        put(&folder.join("HANDOFF.md"), "x");

        assert_eq!(
            find_stick(&[d.clone()]),
            StickFind::One(StickFolder { folder: folder.clone(), layout: StickLayout::Older }),
            "the real stick's layout (a ledger one folder down, no MANIFEST) is not found"
        );
        let _ = fs::remove_dir_all(d);
    }

    #[test]
    fn a_manifest_at_the_volume_root_is_the_manifested_layout() {
        let d = scratch("rootmanifest");
        put(&d.join("consonance-transfer").join("MANIFEST.json"), "{}");
        assert_eq!(find_stick(&[d.clone()]), StickFind::One(StickFolder { folder: d.clone(), layout: StickLayout::Manifest }));
        let _ = fs::remove_dir_all(d);
    }

    /// Two folders: every one named, none picked.
    #[test]
    fn two_stick_folders_are_both_named_and_neither_is_picked() {
        let d = scratch("many");
        put(&d.join("a").join("consonance-tails").join("ledger.json"), "{}");
        put(&d.join("b").join("consonance-transfer").join("MANIFEST.json"), "{}");
        match find_stick(&[d.clone()]) {
            StickFind::Many(fs_) => assert_eq!(fs_.len(), 2, "not every folder was named"),
            other => panic!("two stick folders were resolved to {other:?} — one was picked for the keeper"),
        }
        let _ = fs::remove_dir_all(d);
    }

    /// Two levels down is not the stick — the look is the root and ONE folder, as §3 rules.
    #[test]
    fn a_marker_two_folders_down_is_not_found() {
        let d = scratch("deep");
        put(&d.join("a").join("b").join("consonance-tails").join("ledger.json"), "{}");
        assert_eq!(find_stick(&[d.clone()]), StickFind::None, "the look went deeper than one folder");
        let _ = fs::remove_dir_all(d);
    }

    // ── §2: THE HANDSHAKE (E-1) ─────────────────────────────────────────────────────────────────

    fn applier(pid: u32) -> impl Fn(u32) -> Option<ProcInfo> {
        move |p| {
            (p == pid).then(|| ProcInfo {
                name: "node.exe".to_string(),
                // Machine-neutral: the consumer scan refused this machine's absolute path here (L059 R-2).
                // A BACKSLASH on purpose — the name check splits on '/' after normalizing separators, so this
                // fixture only reads as the applier if that normalization is really there.
                cmd: vec!["node".into(), "dev\\stick-apply.js".into(), "--stick".into()],
            })
        }
    }

    #[test]
    fn no_handshake_file_is_absent() {
        let data = scratch("hs_absent");
        assert_eq!(read_handshake(&data, &nothing_runs), Handshake::Absent);
        let _ = fs::remove_dir_all(data);
    }

    /// A live applier: the launch starts no second one. The seats wait, and the window offers Close.
    #[test]
    fn a_live_applier_is_live_and_withholds_the_seats() {
        let data = scratch("hs_live");
        put(&data.join(APPLY_STARTED), r#"{"pid":4242,"image":"node","script":"stick-apply.js","at":"x","stick":"D:\\s"}"#);
        let a = arrive(&[], &data, &applier(4242));
        assert_eq!(a.handshake, Handshake::Live { pid: 4242, stick: Some("D:\\s".to_string()) });
        assert!(a.withhold(), "a launch with an applier waiting would spawn seats and could start a second applier");
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn a_handshake_whose_pid_is_dead_is_stale_and_does_not_withhold() {
        let data = scratch("hs_dead");
        put(&data.join(APPLY_STARTED), r#"{"pid":4242}"#);
        let a = arrive(&[], &data, &nothing_runs);
        assert!(matches!(a.handshake, Handshake::Stale { .. }), "a dead applier reads as {:?}", a.handshake);
        assert!(!a.withhold(), "a stale handshake is treated as absent, and absent withholds nothing");
        let _ = fs::remove_dir_all(data);
    }

    /// **PID REUSE.** The pid is alive, but it is somebody else's process.
    #[test]
    fn a_handshake_whose_pid_was_reused_by_another_image_is_stale() {
        let data = scratch("hs_reuse");
        put(&data.join(APPLY_STARTED), r#"{"pid":4242}"#);
        let other = |p: u32| (p == 4242).then(|| ProcInfo { name: "chrome.exe".into(), cmd: vec!["chrome".into()] });
        assert!(matches!(read_handshake(&data, &other), Handshake::Stale { .. }), "a reused pid reads as the applier");
        let _ = fs::remove_dir_all(data);
    }

    /// Node alone is not the applier — the app's own tools are node too.
    #[test]
    fn a_node_process_that_is_not_the_applier_is_stale() {
        let data = scratch("hs_othernode");
        put(&data.join(APPLY_STARTED), r#"{"pid":4242}"#);
        let other = |p: u32| (p == 4242).then(|| ProcInfo { name: "node.exe".into(), cmd: vec!["node".into(), "dev/tail-carry.js".into()] });
        assert!(matches!(read_handshake(&data, &other), Handshake::Stale { .. }));
        let _ = fs::remove_dir_all(data);
    }

    /// **The IMAGE half, on its own.** Every other stale case also fails the script check, so none of them
    /// would notice the image test going missing. Here the argument names the applier's script exactly and
    /// only the image is wrong — an editor with the file open.
    #[test]
    fn a_process_that_is_not_node_is_stale_even_when_it_names_the_applier_script() {
        let data = scratch("hs_notnode");
        put(&data.join(APPLY_STARTED), r#"{"pid":4242}"#);
        let editor = |p: u32| (p == 4242).then(|| ProcInfo { name: "notepad.exe".into(), cmd: vec!["notepad".into(), "dev\\stick-apply.js".into()] });
        assert!(matches!(read_handshake(&data, &editor), Handshake::Stale { .. }), "a non-node process holding the script's name reads as the applier");
        let _ = fs::remove_dir_all(data);
    }

    /// A script whose name merely ENDS in `stick-apply.js` is not the applier.
    #[test]
    fn a_node_process_running_a_lookalike_script_name_is_stale() {
        let data = scratch("hs_lookalike");
        put(&data.join(APPLY_STARTED), r#"{"pid":4242}"#);
        let other = |p: u32| (p == 4242).then(|| ProcInfo { name: "node.exe".into(), cmd: vec!["node".into(), "dev\\not-stick-apply.js".into()] });
        assert!(matches!(read_handshake(&data, &other), Handshake::Stale { .. }), "a lookalike script name reads as the applier");
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn an_unparseable_handshake_is_stale_not_absent() {
        let data = scratch("hs_junk");
        put(&data.join(APPLY_STARTED), "not json");
        assert!(matches!(read_handshake(&data, &nothing_runs), Handshake::Stale { .. }));
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn a_result_waiting_to_be_shown_withholds_the_seats() {
        let data = scratch("result");
        put(&data.join(APPLY_RESULT), "{}");
        assert!(arrive(&[], &data, &nothing_runs).withhold(), "the relaunched app spawns seats before showing what the apply did");
        let _ = fs::remove_dir_all(data);
    }

    // ── E-4: THE FIXED-SEAT RULE, AS A DEFAULT ─────────────────────────────────────────────────────

    const LAUNCH: i64 = 1789367339; // L, 2026-09-14 06:28:59Z — the real launch row
    const BORN_18S: &str = "2026-09-14T06:29:17.726Z"; // the real launch-born librarian, 18.7 s later
    const EXPORTED_BEFORE: &str = "2026-09-12T18:00:00.000Z";

    #[test]
    fn a_pane_defaults_to_the_sticks_copy() {
        let o = offer_for("pane", true, Some("2026-01-01T00:00:00Z"), Some(EXPORTED_BEFORE), &[]);
        assert_eq!((o.take_offered, o.default), (true, SeatChoice::Take));
    }

    /// **The real case.** Tonight's launch-born librarian defaults to TAKE.
    #[test]
    fn a_fixed_seat_born_after_the_export_and_at_a_launch_defaults_to_take() {
        let o = offer_for("fixed", true, Some(BORN_18S), Some(EXPORTED_BEFORE), &[LAUNCH]);
        assert_eq!(o.default, SeatChoice::Take, "{}", o.why);
    }

    /// **The lineage.** A fixed seat that began before the export is never preselected for retirement.
    #[test]
    fn a_fixed_seat_born_before_the_export_defaults_to_keep() {
        let o = offer_for("fixed", true, Some("2026-08-15T03:00:00Z"), Some(EXPORTED_BEFORE), &[1786762800]);
        assert_eq!(o.default, SeatChoice::Keep, "a lineage conversation is preselected for retirement: {}", o.why);
    }

    /// Condition (c) on its own: after the export by the other machine's clock, but nowhere near a
    /// launch on this one — the skew case (L058 §4.2) and the button pressed late alike.
    #[test]
    fn a_fixed_seat_after_the_export_but_not_at_a_launch_defaults_to_keep() {
        let o = offer_for("fixed", true, Some(BORN_18S), Some(EXPORTED_BEFORE), &[LAUNCH - 3600]);
        assert_eq!(o.default, SeatChoice::Keep, "{}", o.why);
    }

    /// Condition (b) on its own: at a launch here, but before the export.
    #[test]
    fn a_fixed_seat_at_a_launch_but_before_the_export_defaults_to_keep() {
        let o = offer_for("fixed", true, Some(BORN_18S), Some("2026-09-14T07:00:00Z"), &[LAUNCH]);
        assert_eq!(o.default, SeatChoice::Keep, "{}", o.why);
    }

    #[test]
    fn a_fixed_seat_with_no_recorded_times_defaults_to_keep() {
        assert_eq!(offer_for("fixed", true, None, Some(EXPORTED_BEFORE), &[LAUNCH]).default, SeatChoice::Keep);
        assert_eq!(offer_for("fixed", true, Some(BORN_18S), None, &[LAUNCH]).default, SeatChoice::Keep);
        assert_eq!(offer_for("fixed", true, Some("yesterday"), Some(EXPORTED_BEFORE), &[LAUNCH]).default, SeatChoice::Keep);
    }

    /// A delta cannot replace a conversation, so TAKE is not offered at all — for either kind.
    #[test]
    fn take_is_not_offered_when_the_stick_holds_only_a_delta() {
        for kind in ["pane", "fixed"] {
            let o = offer_for(kind, false, Some(BORN_18S), Some(EXPORTED_BEFORE), &[LAUNCH]);
            assert!(!o.take_offered, "{kind}: TAKE offered on a delta, which the applier would then refuse");
        }
    }

    #[test]
    fn launch_times_reads_one_row_per_launch_and_nothing_else() {
        let log = "1789367337 SYNC AT LAUNCH — the record's head is not this machine's; installing\n\
                   1789367339 SYNC AT LAUNCH MIGRATE — the record's head was authored by D\n\
                   1789367339 resume pane=6fe15f0a jsonl_existed=false -> fresh\n\
                   1789368914 SYNC AT LAUNCH RESUME — fine\n";
        assert_eq!(launch_times(log), vec![1789367339, 1789368914]);
    }

    // ── §2: NEITHER CHOICE RE-SHOWS THE WINDOW ─────────────────────────────────────────────────────

    #[test]
    fn a_kept_seat_is_not_asked_about_again_for_the_same_carry() {
        let rec = record_keep("", "sid-1", "2026-09-14T01:00:00Z");
        assert!(is_kept(&rec, "sid-1", "2026-09-14T01:00:00Z"), "the keeper's KEEP was not remembered");
    }

    #[test]
    fn a_new_carry_for_a_kept_seat_is_asked_about_again() {
        let rec = record_keep("", "sid-1", "2026-09-14T01:00:00Z");
        assert!(!is_kept(&rec, "sid-1", "2026-09-15T01:00:00Z"), "a KEEP silently swallowed a later carry");
    }

    #[test]
    fn a_keep_record_keeps_other_seats() {
        let rec = record_keep(&record_keep("", "a", "t1"), "b", "t2");
        assert!(is_kept(&rec, "a", "t1") && is_kept(&rec, "b", "t2"));
    }

    #[test]
    fn an_unreadable_keep_record_keeps_nothing_and_is_replaced() {
        assert!(!is_kept("not json", "a", "t1"));
        assert!(is_kept(&record_keep("not json", "a", "t1"), "a", "t1"));
    }

    // ── §2: THE APP DOES NOT EXIT UNTIL THE APPLIER HAS STARTED ─────────────────────────────────────

    /// **The bar.** The handshake never appears: the wait ends TimedOut, never Started — and the app
    /// exits only on Started (`the_app_exits_only_when_the_applier_has_started`, in main.rs).
    #[test]
    fn the_wait_never_reports_started_when_the_handshake_never_appears() {
        let data = scratch("wait_never");
        let mut sleeps = 0;
        let got = await_handshake(&data, 777, 100, &mut || None, &applier(777), &mut || sleeps += 1);
        assert_eq!(got, HandshakeWait::TimedOut);
        assert_eq!(sleeps, 100, "the wait gave up before its whole window");
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn the_handshake_of_this_child_is_started() {
        let data = scratch("wait_ok");
        put(&data.join(APPLY_STARTED), r#"{"pid":777}"#);
        assert_eq!(await_handshake(&data, 777, 100, &mut || None, &applier(777), &mut || {}), HandshakeWait::Started);
        let _ = fs::remove_dir_all(data);
    }

    /// A handshake left by an EARLIER applier is not this one starting.
    #[test]
    fn a_handshake_naming_another_pid_does_not_count() {
        let data = scratch("wait_otherpid");
        put(&data.join(APPLY_STARTED), r#"{"pid":555}"#);
        let both = |p: u32| applier(555)(p).or_else(|| applier(777)(p));
        assert_eq!(await_handshake(&data, 777, 5, &mut || None, &both, &mut || {}), HandshakeWait::TimedOut);
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn a_child_that_dies_before_the_handshake_is_named_at_once() {
        let data = scratch("wait_died");
        let mut sleeps = 0;
        let got = await_handshake(&data, 777, 100, &mut || Some(Some(2)), &nothing_runs, &mut || sleeps += 1);
        assert_eq!(got, HandshakeWait::ChildExited(Some(2)));
        assert_eq!(sleeps, 0, "a child already gone was waited on for the whole window");
        let _ = fs::remove_dir_all(data);
    }

    // ── WHEN THE WINDOW MAY CLOSE ON ITS OWN ───────────────────────────────────────────────────────

    fn js(s: &str) -> serde_json::Value {
        serde_json::from_str(s).unwrap()
    }

    #[test]
    fn a_rehearsal_with_nothing_to_carry_is_quiet() {
        let i = js(r#"{"code":0,"rows":[{"sid":"a","carries":false,"stops":false}]}"#);
        let e = js(r#"{"code":0,"rows":[{"sid":"a","carries":false,"stops":false}]}"#);
        assert!(rehearsal_is_quiet(&js(r#"{"code":0}"#), &i, &e, ""));
    }

    #[test]
    fn a_seat_that_would_carry_is_not_quiet() {
        let i = js(r#"{"code":0,"rows":[{"sid":"a","carries":true,"stops":false}]}"#);
        assert!(!rehearsal_is_quiet(&js(r#"{"code":0}"#), &i, &js(r#"{"code":0,"rows":[]}"#), ""));
    }

    /// Call 2's last case: the stick does not have this machine's last session.
    #[test]
    fn a_stick_behind_this_machine_is_not_quiet() {
        let e = js(r#"{"code":0,"rows":[{"sid":"a","carries":true}]}"#);
        assert!(!rehearsal_is_quiet(&js(r#"{"code":0}"#), &js(r#"{"code":0,"rows":[]}"#), &e, ""));
    }

    #[test]
    fn a_set_that_does_not_verify_is_not_quiet() {
        assert!(!rehearsal_is_quiet(&js(r#"{"code":1}"#), &js(r#"{"code":0,"rows":[]}"#), &js(r#"{"code":0,"rows":[]}"#), ""));
    }

    /// A verifier that returned no contract (A's `--verify-set` not on disk yet) is not quiet: it is named.
    #[test]
    fn a_verifier_that_returned_nothing_is_not_quiet() {
        assert!(!rehearsal_is_quiet(&js(r#"{}"#), &js(r#"{"code":0,"rows":[]}"#), &js(r#"{"code":0,"rows":[]}"#), ""));
    }

    #[test]
    fn a_refused_seat_the_keeper_already_kept_for_this_carry_is_quiet() {
        let i = js(r#"{"code":1,"rows":[{"sid":"a","carries":false,"stops":true,"reason":"OTHER_CONVERSATION","exportedAt":"t1"}]}"#);
        let e = js(r#"{"code":0,"rows":[]}"#);
        assert!(rehearsal_is_quiet(&js(r#"{"code":0}"#), &i, &e, &record_keep("", "a", "t1")));
        assert!(!rehearsal_is_quiet(&js(r#"{"code":0}"#), &i, &e, ""), "an unkept refusal was waved through");
    }

    /// A seat that stopped for any OTHER reason is never quieted by a KEEP.
    #[test]
    fn a_keep_does_not_quiet_a_refusal_of_another_kind() {
        let i = js(r#"{"code":1,"rows":[{"sid":"a","carries":false,"stops":true,"reason":"HISTORY_REWRITTEN","exportedAt":"t1"}]}"#);
        assert!(!rehearsal_is_quiet(&js(r#"{"code":0}"#), &i, &js(r#"{"code":0,"rows":[]}"#), &record_keep("", "a", "t1")));
    }

    /// LEDGER_LOCKED and "could not run" are exit 2; an interrupted apply is 3. Neither is quiet.
    #[test]
    fn a_rehearsal_that_could_not_run_or_crashed_part_way_is_not_quiet() {
        for c in [2, 3] {
            let i = js(&format!(r#"{{"code":{c},"rows":[]}}"#));
            assert!(!rehearsal_is_quiet(&js(r#"{"code":0}"#), &i, &js(r#"{"code":0,"rows":[]}"#), ""), "import code {c}");
        }
    }

    /// §3's find table, the row added at ~03:30: a marker at the volume root AND another in a first-level
    /// folder of the same volume -> AMBIGUOUS, both named.
    #[test]
    fn a_marker_at_the_root_and_another_one_folder_down_are_both_named() {
        let d = scratch("rootandchild");
        put(&d.join("consonance-transfer").join("MANIFEST.json"), "{}");
        put(&d.join("consonance-L-20260911").join("consonance-tails").join("ledger.json"), "{}");
        match find_stick(&[d.clone()]) {
            StickFind::Many(fs_) => {
                let names: Vec<PathBuf> = fs_.into_iter().map(|f| f.folder).collect();
                assert!(names.contains(&d) && names.contains(&d.join("consonance-L-20260911")), "not both named: {names:?}");
            }
            other => panic!("a root marker and a first-level marker resolved to {other:?} — one was picked for the keeper"),
        }
        let _ = fs::remove_dir_all(d);
    }

    /// **The waiter's argv, exactly as ruled** — and no `--stick`, which would fix a path at launch and skip
    /// the export on the exit where the keeper plugged the stick in late.
    #[test]
    fn the_waiter_is_told_the_data_dir_the_app_pid_and_the_app_image_and_no_stick() {
        // P-LEAVE-2 (a) extends the ruled argv by `--app-started-at <ISO>` (B's D-8): the expected vec changed with it.
        let args = waiter_args(Path::new("C:\\Consonance\\data"), 23900, "2026-09-15T05:40:12.345Z");
        assert_eq!(
            args,
            vec!["--data", "C:\\Consonance\\data", "--app-pid", "23900", "--app-image", "consonance.exe", "--app-started-at", "2026-09-15T05:40:12.345Z"]
        );
        assert!(!args.iter().any(|a| a == "--stick"), "the waiter was handed a stick path fixed at launch");
    }
}


/// **P-DIVERGED (L058, third use) — the window's half: a door for two futures of one conversation.**
/// `exo_memory/loop/packet_diverged_2026-09-14.md` §2.5, §2.6, §2.8 D-1..D-6.
///
/// The rows below are REAL: `dev/tail-carry.js` at 6dbdae9, unmodified, run with `--json` on a mkdtemp fixture of
/// two machines (`scratchpad/diverged/gen_rows.js` in pane E's hand-back). Seat aaaaaaaa forked (D exported a tail, L
/// wrote its own), bbbbbbbb holds another conversation on L, cccccccc is unmoved. Only the `path` fields — temp
/// directories — were stripped. A test built on hand-written rows is how D-2 hid: the test before it passed `[]`.
#[cfg(test)]
mod diverged_tests {
    use super::*;

    const REAL: &str = r#"{"import":{"code":1,"machine":"L","rows":[{"seat":"pane a","sid":"aaaaaaaa-1111-4111-8111-111111111111","kind":"pane","verdict":"DIVERGED","reason":null,"why":"this machine has written 139 bytes of its OWN since the last carry, on top of the same prefix. Two futures of one conversation cannot be concatenated. Nothing is lost — but which one continues is a decision, not a merge.","stops":true,"carries":false,"bytes":0,"offset":154,"toOffset":275,"localSize":293,"localFirstTimestamp":"2026-09-10T10:00:00.000Z","carriedFirstTimestamp":"2026-09-10T10:00:00.000Z","exportedAt":"2026-09-14T13:11:00.693Z","exportedFrom":"D","retirable":null,"result":null},{"seat":"pane b","sid":"bbbbbbbb-2222-4222-8222-222222222222","kind":"pane","verdict":"REFUSED","reason":"OTHER_CONVERSATION","why":"this machine holds a DIFFERENT conversation under this sid (key 47519714924aba9e… vs 925b1f31c04ac5f5…). Nothing here can merge two conversations. To let the carried one take the seat, name it: --retire-far bbbbbbbb-2222-4222-8222-222222222222","stops":true,"carries":false,"bytes":0,"offset":154,"toOffset":273,"localSize":136,"localFirstTimestamp":"2026-09-13T08:00:00.000Z","carriedFirstTimestamp":"2026-09-10T10:00:00.000Z","exportedAt":"2026-09-14T13:11:00.693Z","exportedFrom":"D","retirable":false,"result":null},{"seat":"pane c","sid":"cccccccc-3333-4333-8333-333333333333","kind":"pane","verdict":"NOTHING_PENDING","reason":null,"why":null,"stops":false,"carries":false,"bytes":0,"offset":null,"toOffset":null,"localSize":null,"localFirstTimestamp":null,"carriedFirstTimestamp":"2026-09-10T10:00:00.000Z","exportedAt":null,"exportedFrom":null,"retirable":null,"result":null}]},"export":{"code":1,"machine":"L","rows":[{"seat":"pane a","sid":"aaaaaaaa-1111-4111-8111-111111111111","kind":"pane","verdict":"REFUSED","reason":"UNIMPORTED_TAIL","why":"the stick still carries an unimported tail from D — import it on the machine it is for before exporting over it","stops":true,"carries":false,"bytes":0,"offset":null,"toOffset":null,"localSize":293,"localFirstTimestamp":"2026-09-10T10:00:00.000Z","carriedFirstTimestamp":"2026-09-10T10:00:00.000Z","exportedAt":null,"exportedFrom":null,"retirable":null,"result":null},{"seat":"pane b","sid":"bbbbbbbb-2222-4222-8222-222222222222","kind":"pane","verdict":"REFUSED","reason":"UNIMPORTED_TAIL","why":"the stick still carries an unimported tail from D — import it on the machine it is for before exporting over it","stops":true,"carries":false,"bytes":0,"offset":null,"toOffset":null,"localSize":136,"localFirstTimestamp":"2026-09-13T08:00:00.000Z","carriedFirstTimestamp":"2026-09-10T10:00:00.000Z","exportedAt":null,"exportedFrom":null,"retirable":null,"result":null},{"seat":"pane c","sid":"cccccccc-3333-4333-8333-333333333333","kind":"pane","verdict":"UP_TO_DATE","reason":null,"why":null,"stops":false,"carries":false,"bytes":0,"offset":null,"toOffset":null,"localSize":154,"localFirstTimestamp":"2026-09-10T10:00:00.000Z","carriedFirstTimestamp":"2026-09-10T10:00:00.000Z","exportedAt":null,"exportedFrom":null,"retirable":null,"result":null}]}}"#;
    const FORK: &str = "aaaaaaaa-1111-4111-8111-111111111111";
    const OTHER: &str = "bbbbbbbb-2222-4222-8222-222222222222";
    const STILL: &str = "cccccccc-3333-4333-8333-333333333333";

    fn real() -> (serde_json::Value, serde_json::Value) {
        let v: serde_json::Value = serde_json::from_str(REAL).unwrap();
        (v["import"].clone(), v["export"].clone())
    }
    fn exported_at(import: &serde_json::Value, sid: &str) -> String {
        import["rows"].as_array().unwrap().iter().find(|r| r["sid"] == sid).unwrap()["exportedAt"].as_str().unwrap().to_string()
    }
    fn verified() -> serde_json::Value {
        serde_json::json!({ "code": 0, "layout": "manifest" })
    }

    // ── §2.5 · D-3 · D-4: the offer on a DIVERGED row ───────────────────────────────────────────────

    /// Both files are the lineage, so nothing is preselected — for any kind.
    #[test]
    fn a_diverged_row_is_offered_take_with_nothing_preselected() {
        let (import, _) = real();
        let offers = offers_for_rows(&import, "", &[]);
        assert_eq!(offers[FORK]["take_offered"], true, "a forked seat is offered no door");
        assert_eq!(offers[FORK]["default"], "none", "a choice between two lineages was made for the keeper");
    }

    /// The offer says what each choice does to the seat, in the keeper's terms.
    #[test]
    fn a_diverged_offer_names_what_take_and_keep_each_do() {
        let (import, _) = real();
        let why = offers_for_rows(&import, "", &[])[FORK]["why"].as_str().unwrap().to_string();
        assert!(why.contains("attic") && why.contains("will not export"), "the choices are not named: {why}");
    }

    /// The DIVERGED branch sits beside offer_for and does not take its rows: OTHER_CONVERSATION still gets offer_for.
    #[test]
    fn an_other_conversation_row_is_still_offered_through_offer_for() {
        let (import, _) = real();
        let row = import["rows"].as_array().unwrap().iter().find(|r| r["sid"] == OTHER).unwrap().clone();
        let through = offer_for("pane", row["retirable"].as_bool().unwrap_or(false), row["localFirstTimestamp"].as_str(), row["exportedAt"].as_str(), &[]);
        assert_eq!(offers_for_rows(&import, "", &[])[OTHER]["default"], through.default.tag());
    }

    #[test]
    fn a_row_that_needs_no_choice_is_offered_nothing() {
        let (import, _) = real();
        assert!(offers_for_rows(&import, "", &[]).get(STILL).is_none(), "an unmoved seat was offered a choice");
    }

    #[test]
    fn a_kept_diverged_row_says_so() {
        let (import, _) = real();
        let keep = record_keep("", FORK, &exported_at(&import, FORK));
        assert_eq!(offers_for_rows(&import, &keep, &[])[FORK]["kept"], true);
    }

    // ── §2.6 · D-2: a KEEP is quiet, measured with the export rows it really produces ───────────────

    /// **D-2.** Both stopped seats kept for this carry: the window stays closed, although the same machine's export
    /// refuses UNIMPORTED_TAIL for both of them.
    #[test]
    fn kept_seats_are_quiet_although_their_export_refuses_unimported_tail() {
        let (import, export) = real();
        let keep = record_keep(&record_keep("", FORK, &exported_at(&import, FORK)), OTHER, &exported_at(&import, OTHER));
        assert!(rehearsal_is_quiet(&verified(), &import, &export, &keep), "a KEEP re-opens the window on every launch");
    }

    /// The fork not kept: that is still news.
    #[test]
    fn an_unkept_fork_is_not_quiet() {
        let (import, export) = real();
        let keep = record_keep("", OTHER, &exported_at(&import, OTHER));
        assert!(!rehearsal_is_quiet(&verified(), &import, &export, &keep));
    }

    /// A keep for an EARLIER carry of the same seat does not quiet this one.
    #[test]
    fn a_keep_for_an_earlier_carry_does_not_quiet_this_one() {
        let (import, export) = real();
        let keep = record_keep(&record_keep("", FORK, "2026-09-01T00:00:00.000Z"), OTHER, &exported_at(&import, OTHER));
        assert!(!rehearsal_is_quiet(&verified(), &import, &export, &keep));
    }

    /// UNIMPORTED_TAIL on the export side is ignored only for a sid kept on the import side — not for any seat.
    #[test]
    fn an_unimported_tail_for_a_seat_nobody_kept_is_still_news() {
        let (import, mut export) = real();
        let keep = record_keep(&record_keep("", FORK, &exported_at(&import, FORK)), OTHER, &exported_at(&import, OTHER));
        let still = export["rows"].as_array_mut().unwrap().iter_mut().find(|r| r["sid"] == STILL).unwrap();
        still["verdict"] = "REFUSED".into();
        still["reason"] = "UNIMPORTED_TAIL".into();
        still["stops"] = true.into();
        assert!(!rehearsal_is_quiet(&verified(), &import, &export, &keep), "an export stop was waved through for a seat that was never kept");
    }

    /// D-2 is narrow in its REASON too: a kept seat whose export stops for anything but UNIMPORTED_TAIL is still news.
    /// (The real fork row, its reason changed — the one field this test is about.)
    #[test]
    fn a_kept_seats_export_stop_of_another_reason_is_still_news() {
        let (import, mut export) = real();
        let keep = record_keep(&record_keep("", FORK, &exported_at(&import, FORK)), OTHER, &exported_at(&import, OTHER));
        let fork = export["rows"].as_array_mut().unwrap().iter_mut().find(|r| r["sid"] == FORK).unwrap();
        fork["reason"] = "HISTORY_REWRITTEN".into();
        assert!(!rehearsal_is_quiet(&verified(), &import, &export, &keep), "a KEEP silenced an export stop it was never about");
    }

    /// **D-1, the half that makes E's Carry reachable.** A ledger a killed applier left un-advanced reads
    /// ALREADY_APPLIED or APPLIED_AND_GREW: nothing carries, nothing stops — and the heal only runs from Carry, so the
    /// window must not close itself on it.
    #[test]
    fn a_seat_whose_ledger_still_needs_healing_is_not_quiet() {
        for verdict in ["ALREADY_APPLIED", "APPLIED_AND_GREW"] {
            let import = serde_json::json!({ "code": 0, "rows": [{ "sid": FORK, "verdict": verdict, "carries": false, "stops": false }] });
            let export = serde_json::json!({ "code": 0, "rows": [] });
            assert!(!rehearsal_is_quiet(&verified(), &import, &export, ""), "{verdict} closed the window before the heal could run");
        }
    }

    // ── (e) the withheld-seat line ─────────────────────────────────────────────────────────────────

    #[test]
    fn a_read_only_launch_says_read_only() {
        assert!(withheld_line(true, "the data dir may be half-promoted").contains("READ-ONLY"));
    }

    /// A stick hold is not READ-ONLY, and saying so sent the keeper looking for a broken data dir.
    #[test]
    fn a_stick_hold_says_the_seats_are_waiting_for_the_transfer_window() {
        let line = withheld_line(false, "");
        assert!(line.contains("transfer window") && !line.contains("READ-ONLY"), "{line}");
    }
}

/// P-LEAVE (D063). The outcome tests read REAL `tail-carry --export --json --apply` objects: `dev/tail-carry.js` from the
/// working tree at 0d27f61, unmodified, run through `T.main` on a mkdtemp two-machine fixture by pane E's
/// `scratchpad/leave/gen_leave_rows.js`. Only `path` and `stick` (temp directories) were nulled.
#[cfg(test)]
mod leave_tests {
    use super::*;
    use std::cell::Cell;
    use std::fs;

    const REAL: &str = r#"{"done":{"tool":"tail-carry","contract":1,"mode":"export","apply":true,"machine":"D","stick":null,"code":0,"outcome":"CARRIED","why":null,"rows":[{"seat":"main","sid":"0c0c0c0a-0000-4000-8000-000000000a01","kind":"fixed","verdict":"NOTHING_YET","reason":null,"why":"no transcript on this machine yet","stops":false,"carries":false,"bytes":0,"offset":null,"toOffset":null,"path":null,"localSize":null,"localFirstTimestamp":null,"carriedFirstTimestamp":null,"exportedAt":null,"exportedFrom":null,"retirable":null,"takeable":null,"ownBytes":null,"result":null},{"seat":"librarian","sid":"0c0c0c0b-0000-4000-8000-00000000115b","kind":"fixed","verdict":"NOTHING_YET","reason":null,"why":"no transcript on this machine yet","stops":false,"carries":false,"bytes":0,"offset":null,"toOffset":null,"path":null,"localSize":null,"localFirstTimestamp":null,"carriedFirstTimestamp":null,"exportedAt":null,"exportedFrom":null,"retirable":null,"takeable":null,"ownBytes":null,"result":null},{"seat":"third place","sid":"3d000000-0000-4000-8000-000000003d00","kind":"fixed","verdict":"NOTHING_YET","reason":null,"why":"no transcript on this machine yet","stops":false,"carries":false,"bytes":0,"offset":null,"toOffset":null,"path":null,"localSize":null,"localFirstTimestamp":null,"carriedFirstTimestamp":null,"exportedAt":null,"exportedFrom":null,"retirable":null,"takeable":null,"ownBytes":null,"result":null},{"seat":"pane a","sid":"aaaaaaaa-1111-4111-8111-111111111111","kind":"pane","verdict":"UP_TO_DATE","reason":null,"why":null,"stops":false,"carries":false,"bytes":0,"offset":null,"toOffset":null,"path":null,"localSize":154,"localFirstTimestamp":"2026-09-10T10:00:00.000Z","carriedFirstTimestamp":"2026-09-10T10:00:00.000Z","exportedAt":null,"exportedFrom":null,"retirable":null,"takeable":null,"ownBytes":null,"result":null},{"seat":"pane c","sid":"cccccccc-3333-4333-8333-333333333333","kind":"pane","verdict":"TAIL","reason":null,"why":null,"stops":false,"carries":true,"bytes":119,"offset":154,"toOffset":273,"path":null,"localSize":273,"localFirstTimestamp":"2026-09-10T10:00:00.000Z","carriedFirstTimestamp":"2026-09-10T10:00:00.000Z","exportedAt":null,"exportedFrom":null,"retirable":null,"takeable":null,"ownBytes":null,"result":{"ok":true,"why":null,"size":273,"sha256":"25a6756d3836ec08dd6181c0b1e02420ba87e9993c31a69ccabed0688f686164","aside":null,"tailFile":"cccccccc-3333-4333-8333-333333333333.154-273.tail","advanced":false}}],"receipt":null,"staleLock":null},"stop":{"tool":"tail-carry","contract":1,"mode":"export","apply":true,"machine":"L","stick":null,"code":1,"outcome":"STOPPED","why":null,"rows":[{"seat":"main","sid":"0c0c0c0a-0000-4000-8000-000000000a01","kind":"fixed","verdict":"NOTHING_YET","reason":null,"why":"no transcript on this machine yet","stops":false,"carries":false,"bytes":0,"offset":null,"toOffset":null,"path":null,"localSize":null,"localFirstTimestamp":null,"carriedFirstTimestamp":null,"exportedAt":null,"exportedFrom":null,"retirable":null,"takeable":null,"ownBytes":null,"result":null},{"seat":"librarian","sid":"0c0c0c0b-0000-4000-8000-00000000115b","kind":"fixed","verdict":"NOTHING_YET","reason":null,"why":"no transcript on this machine yet","stops":false,"carries":false,"bytes":0,"offset":null,"toOffset":null,"path":null,"localSize":null,"localFirstTimestamp":null,"carriedFirstTimestamp":null,"exportedAt":null,"exportedFrom":null,"retirable":null,"takeable":null,"ownBytes":null,"result":null},{"seat":"third place","sid":"3d000000-0000-4000-8000-000000003d00","kind":"fixed","verdict":"NOTHING_YET","reason":null,"why":"no transcript on this machine yet","stops":false,"carries":false,"bytes":0,"offset":null,"toOffset":null,"path":null,"localSize":null,"localFirstTimestamp":null,"carriedFirstTimestamp":null,"exportedAt":null,"exportedFrom":null,"retirable":null,"takeable":null,"ownBytes":null,"result":null},{"seat":"pane a","sid":"aaaaaaaa-1111-4111-8111-111111111111","kind":"pane","verdict":"REFUSED","reason":"UNIMPORTED_TAIL","why":"the stick still carries an unimported tail from D — import it on the machine it is for before exporting over it","stops":true,"carries":false,"bytes":0,"offset":null,"toOffset":null,"path":null,"localSize":273,"localFirstTimestamp":"2026-09-10T10:00:00.000Z","carriedFirstTimestamp":"2026-09-10T10:00:00.000Z","exportedAt":null,"exportedFrom":null,"retirable":null,"takeable":null,"ownBytes":null,"result":null},{"seat":"pane c","sid":"cccccccc-3333-4333-8333-333333333333","kind":"pane","verdict":"REFUSED","reason":"UNIMPORTED_TAIL","why":"the stick still carries an unimported tail from D — import it on the machine it is for before exporting over it","stops":true,"carries":false,"bytes":0,"offset":null,"toOffset":null,"path":null,"localSize":154,"localFirstTimestamp":"2026-09-10T10:00:00.000Z","carriedFirstTimestamp":"2026-09-10T10:00:00.000Z","exportedAt":null,"exportedFrom":null,"retirable":null,"takeable":null,"ownBytes":null,"result":null}],"receipt":null,"staleLock":null},"locked":{"tool":"tail-carry","contract":1,"mode":"export","apply":true,"machine":null,"stick":null,"code":2,"outcome":"LEDGER_LOCKED","why":"the stick's ledger is locked by a live node (pid 34468, tail-carry.js, since 2026-09-15T06:27:00.288Z)","rows":[],"receipt":null,"staleLock":null}}"#;

    fn real(which: &str) -> serde_json::Value {
        serde_json::from_str::<serde_json::Value>(REAL).unwrap()[which].clone()
    }

    fn scratch(tag: &str) -> PathBuf {
        let d = std::env::temp_dir().join(format!("consonance_leave_{tag}_{}", std::process::id()));
        let _ = fs::remove_dir_all(&d);
        fs::create_dir_all(&d).unwrap();
        d
    }

    fn listing(d: &Path) -> Vec<String> {
        let mut v: Vec<String> = fs::read_dir(d).unwrap().flatten().map(|e| e.file_name().to_string_lossy().to_string()).collect();
        v.sort();
        v
    }

    fn read(p: &Path) -> serde_json::Value {
        serde_json::from_str(&fs::read_to_string(p).unwrap()).unwrap()
    }

    fn one(folder: &Path) -> StickFind {
        StickFind::One(StickFolder { folder: folder.to_path_buf(), layout: StickLayout::Older })
    }

    /// This session's recorded start time, as `main` hands it to the waiter and to the Leave (P-LEAVE-2 a).
    const APP_T: &str = "2026-09-15T05:40:12.345Z";

    /// **P-LEAVE-2 (a), B's D-8:** the file the waiter reads in case c carries the session's start time, so a
    /// session 1 file is never read as session 2's when Windows gives session 2 the same pid.
    #[test]
    fn the_started_file_carries_this_sessions_start_time() {
        let data = scratch("appstarted_s");
        let mut seen: Option<serde_json::Value> = None;
        let _ = run_leave(&data, 4242, &[], 0, one(Path::new("D:\\stick")), APP_T, &at, &mut |_| {
            seen = fs::read_to_string(data.join(LEAVE_STARTED)).ok().map(|s| serde_json::from_str(&s).unwrap());
            Ok(real("done"))
        });
        let started = seen.expect("no STARTED file during the export");
        assert_eq!(started["appStartedAt"], serde_json::json!(APP_T), "LEAVE_STARTED does not carry appStartedAt: {started}");
        let _ = fs::remove_dir_all(data);
    }

    /// Case b's file, on BOTH branches that write one: the one folder, and the several folders nothing is picked from.
    #[test]
    fn the_result_file_carries_this_sessions_start_time_on_every_branch_that_writes_one() {
        let data = scratch("appstarted_r");
        let many = StickFind::Many(vec![
            StickFolder { folder: PathBuf::from("E:\\a"), layout: StickLayout::Older },
            StickFolder { folder: PathBuf::from("F:\\b"), layout: StickLayout::Older },
        ]);
        for find in [one(Path::new("D:\\stick")), many] {
            let LeaveRun::Shown { result, written } = run_leave(&data, 4242, &[], 0, find, APP_T, &at, &mut |_| Ok(real("done"))) else {
                panic!("no Leave screen")
            };
            assert!(written.is_ok(), "{written:?}");
            assert_eq!(result["appStartedAt"], serde_json::json!(APP_T), "the result shown does not carry appStartedAt: {result}");
            assert_eq!(read(&data.join(LEAVE_RESULT))["appStartedAt"], serde_json::json!(APP_T), "the result on disk does not");
            // Not written INTO startedAt, which already means when the Leave began.
            assert_ne!(result["startedAt"], serde_json::json!(APP_T));
        }
        let _ = fs::remove_dir_all(data);
    }

    /// **P-LEAVE-2 (b) 1:** the error returns AND the child is killed, exactly once; an `Ok` kills nothing.
    #[test]
    fn a_spawn_step_that_fails_after_the_child_runs_kills_the_child_and_returns_the_error() {
        let mut kills = 0;
        let r: Result<u8, String> = or_kill(Err::<u8, _>("no reader"), &mut || kills += 1);
        assert_eq!((r, kills), (Err("no reader".to_string()), 1), "a failed step left its child running");
        let mut kills = 0;
        let r = or_kill(Ok::<u8, &str>(7), &mut || kills += 1);
        assert_eq!((r, kills), (Ok(7), 0), "a step that worked killed its child");
    }

    /// **P-LEAVE-2 (b) 2:** through a real map — the session the id held is killed, the new one is not, and a fresh id
    /// kills nothing.
    #[test]
    fn an_insert_that_replaces_a_session_kills_the_one_it_replaces_and_not_the_new_one() {
        let mut map: std::collections::HashMap<String, (&str, u32)> = std::collections::HashMap::new();
        let mut killed: Vec<&str> = Vec::new();
        kill_replaced(map.insert("p1".into(), ("first", 0)), &mut |s: &mut (&str, u32)| killed.push(s.0));
        assert!(killed.is_empty(), "a fresh pane id killed something: {killed:?}");
        kill_replaced(map.insert("p1".into(), ("second", 0)), &mut |s: &mut (&str, u32)| killed.push(s.0));
        assert_eq!(killed, vec!["first"], "the replaced session was not the one killed");
        assert_eq!(map["p1"].0, "second");
    }

    fn at() -> String {
        "2026-09-15T06:30:00.000Z".to_string()
    }

    fn named(name: &'static str) -> impl Fn(u32) -> Listing {
        move |_| Listing::Running(ProcInfo { name: name.to_string(), cmd: Vec::new() })
    }

    fn gone(_: u32) -> Listing {
        Listing::Gone
    }

    // ── §2.2 STEP 2: one test per branch ─────────────────────────────────────────────────────────────

    #[test]
    fn with_no_stick_the_close_exits_as_today_and_writes_no_file() {
        let data = scratch("none");
        let before = listing(&data);
        let called = Cell::new(false);
        let run = run_leave(&data, 4242, &[], 0, StickFind::None, APP_T, &at, &mut |_| {
            called.set(true);
            Ok(real("done"))
        });
        assert_eq!((run, called.get(), listing(&data)), (LeaveRun::Exit, false, before));
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn with_many_stick_folders_nothing_is_saved_and_the_result_names_every_folder() {
        let data = scratch("many");
        let (a, b) = (PathBuf::from("E:\\consonance-A"), PathBuf::from("F:\\consonance-B"));
        let find = StickFind::Many(vec![
            StickFolder { folder: a.clone(), layout: StickLayout::Older },
            StickFolder { folder: b.clone(), layout: StickLayout::Manifest },
        ]);
        let called = Cell::new(false);
        let LeaveRun::Shown { result, written } = run_leave(&data, 4242, &[], 0, find, APP_T, &at, &mut |_| {
            called.set(true);
            Ok(real("done"))
        }) else {
            panic!("more than one stick folder exited with no Leave screen")
        };
        let why = result["why"].as_str().unwrap_or("").to_string();
        assert!(written.is_ok(), "{written:?}");
        assert!(!called.get(), "a folder was exported although none was picked");
        assert_eq!(result["outcome"], "NOT_DONE");
        assert!(why.contains(&a.display().to_string()) && why.contains(&b.display().to_string()), "not every folder is named: {why}");
        assert_eq!(read(&data.join(LEAVE_RESULT)), result, "the result on disk is not the one shown");
        assert!(!data.join(LEAVE_STARTED).exists(), "a save that never began left a STARTED file");
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn with_one_stick_folder_started_is_on_disk_before_the_export_and_gone_after_the_result() {
        let data = scratch("one");
        let stick = PathBuf::from("D:\\consonance-L-20260911");
        let mut seen: Option<serde_json::Value> = None;
        let run = run_leave(&data, 4242, &[], 0, one(&stick), APP_T, &at, &mut |f| {
            assert_eq!(f, Path::new("D:\\consonance-L-20260911"), "the export was not handed the found folder");
            seen = fs::read_to_string(data.join(LEAVE_STARTED)).ok().map(|s| serde_json::from_str(&s).unwrap());
            Ok(real("done"))
        });
        let LeaveRun::Shown { result, written } = run else { panic!("one stick folder exited with no Leave screen") };
        let started = seen.expect("tail-carry ran before stick-leave.started.json was written");
        assert_eq!(
            (started["pid"].clone(), started["image"].clone(), started["stick"].clone()),
            (serde_json::json!(4242), serde_json::json!("consonance.exe"), serde_json::json!("D:\\consonance-L-20260911"))
        );
        assert!(written.is_ok(), "{written:?}");
        assert!(!data.join(LEAVE_STARTED).exists(), "STARTED was left beside the result");
        assert_eq!(read(&data.join(LEAVE_RESULT)), result);
        assert_eq!(result["startedAt"], started["at"]);
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn a_started_file_that_cannot_be_written_means_nothing_is_exported() {
        let data = scratch("nostarted");
        fs::create_dir_all(data.join(LEAVE_STARTED)).unwrap(); // a directory where the file must go
        let called = Cell::new(false);
        let run = run_leave(&data, 4242, &[], 0, one(Path::new("D:\\stick")), APP_T, &at, &mut |_| {
            called.set(true);
            Ok(real("done"))
        });
        let LeaveRun::Shown { result, .. } = run else { panic!("no Leave screen") };
        assert_eq!((called.get(), result["outcome"].as_str()), (false, Some("NOT_DONE")));
        let _ = fs::remove_dir_all(data);
    }

    // ── §2.2 STEP 4 with §2.7 D-2: one test per ending ─────────────────────────────────────────────────

    #[test]
    fn exit_zero_with_every_seat_ended_and_no_stop_is_done() {
        let e = leave_ending(&[], 0, &Ok(real("done")));
        assert_eq!((e.done, e.code, e.why), (true, Some(0), None));
    }

    #[test]
    fn a_seat_alive_at_the_bound_is_not_done_although_the_carry_exits_zero() {
        let e = leave_ending(&["0c0c0c0b-0000-4000-8000-00000000115b".to_string()], 0, &Ok(real("done")));
        assert!(!e.done && e.why.as_deref().unwrap_or("").contains("0c0c0c0b-0000-4000-8000-00000000115b"), "{e:?}");
    }

    #[test]
    fn exit_one_is_not_done_and_names_the_seat_that_stopped() {
        let e = leave_ending(&[], 0, &Ok(real("stop")));
        let why = e.why.clone().unwrap_or_default();
        assert!(!e.done && e.code == Some(1) && why.contains("aaaaaaaa") && why.contains("UNIMPORTED_TAIL"), "{e:?}");
    }

    #[test]
    fn ledger_locked_is_not_done_and_names_the_holder() {
        let e = leave_ending(&[], 0, &Ok(real("locked")));
        let why = e.why.clone().unwrap_or_default();
        assert!(!e.done && e.code == Some(2) && why.contains("LEDGER_LOCKED") && why.contains("pid 34468"), "{e:?}");
    }

    #[test]
    fn a_crashed_carry_is_not_done_with_its_reason() {
        // Not generated: no fixture makes tail-carry crash. The shape is its catch-all (tail-carry.js:1414).
        let crashed = serde_json::json!({ "code": 3, "outcome": "CRASHED", "why": "ENOSPC: no space left on device", "rows": [] });
        let e = leave_ending(&[], 0, &Ok(crashed));
        assert!(!e.done && e.why.as_deref().unwrap_or("").contains("CRASHED") && e.why.as_deref().unwrap_or("").contains("ENOSPC"), "{e:?}");
    }

    #[test]
    fn a_timeout_is_not_done_with_no_code() {
        let e = leave_ending(&[], 0, &Err("the carry did not finish within 600s and was stopped".into()));
        assert!(!e.done && e.code.is_none() && e.why.as_deref().unwrap_or("").contains("600s"), "{e:?}");
    }

    #[test]
    fn a_spawn_failure_is_not_done_with_no_code() {
        let e = leave_ending(&[], 0, &Err("could not start node (program not found)".into()));
        assert!(!e.done && e.code.is_none() && e.why.as_deref().unwrap_or("").contains("could not start node"), "{e:?}");
    }

    #[test]
    fn output_that_is_not_the_contract_is_not_done() {
        let e = leave_ending(&[], 0, &Err("the carry exited 0 without its JSON contract on stdout".into()));
        assert!(!e.done && e.why.is_some(), "{e:?}");
    }

    #[test]
    fn exit_zero_with_a_stopping_row_is_still_not_done() {
        let mut v = real("stop");
        v["code"] = serde_json::json!(0);
        assert!(!leave_ending(&[], 0, &Ok(v)).done);
    }

    // ── §2.7 D-1: what "ended" means, and the bounded wait ──────────────────────────────────────────────

    #[test]
    fn a_seat_is_ended_when_its_pid_is_gone() {
        assert!(seat_ended(Some("claude.exe"), &Listing::Gone));
    }

    #[test]
    fn a_seat_still_running_its_own_image_is_not_ended_in_any_spelling() {
        let p = ProcInfo { name: "CLAUDE".into(), cmd: Vec::new() };
        assert!(!seat_ended(Some("claude.exe"), &Listing::Running(p)));
    }

    #[test]
    fn a_reused_pid_running_another_image_is_ended() {
        let p = ProcInfo { name: "notepad.exe".into(), cmd: Vec::new() };
        assert!(seat_ended(Some("claude.exe"), &Listing::Running(p)));
    }

    #[test]
    fn a_live_pid_whose_image_was_never_read_is_not_ended() {
        let p = ProcInfo { name: "notepad.exe".into(), cmd: Vec::new() };
        assert!(!seat_ended(None, &Listing::Running(p)));
    }

    #[test]
    fn the_wait_names_the_seats_still_running_at_the_bound_and_sleeps_between_checks_only() {
        let seats = vec![
            SeatProc { pane: "gone".into(), pid: Some(1), image: Some("claude.exe".into()) },
            SeatProc { pane: "stuck".into(), pid: Some(2), image: Some("claude.exe".into()) },
            SeatProc { pane: "no-pid".into(), pid: None, image: None },
        ];
        let probe = |pid: u32| if pid == 2 { Listing::Running(ProcInfo { name: "claude.exe".into(), cmd: Vec::new() }) } else { Listing::Gone };
        let mut sleeps = 0;
        let alive = await_seats(&seats, 5, &probe, &mut || sleeps += 1);
        assert_eq!((alive, sleeps), (vec!["stuck".to_string(), "no-pid".to_string()], 5));
    }

    #[test]
    fn the_wait_returns_as_soon_as_every_seat_has_ended() {
        let seats = vec![SeatProc { pane: "a".into(), pid: Some(1), image: Some("claude.exe".into()) }];
        let checks = Cell::new(0);
        let probe = |_: u32| {
            checks.set(checks.get() + 1);
            if checks.get() < 3 { Listing::Running(ProcInfo { name: "claude.exe".into(), cmd: Vec::new() }) } else { Listing::Gone }
        };
        let mut sleeps = 0;
        let alive = await_seats(&seats, 100, &probe, &mut || sleeps += 1);
        assert_eq!((alive.len(), sleeps), (0, 2));
    }

    // ── §2.2 step 5's order ────────────────────────────────────────────────────────────────────────────

    #[test]
    fn started_stays_when_the_result_cannot_be_written() {
        let data = scratch("order");
        fs::write(data.join(LEAVE_STARTED), "{\"pid\":4242}").unwrap();
        fs::create_dir_all(data.join(LEAVE_RESULT)).unwrap(); // a directory where the file must go
        let w = write_leave_result(&data, &serde_json::json!({ "pid": 4242 }));
        assert!(w.is_err() && data.join(LEAVE_STARTED).is_file(), "the waiter would find neither file: {w:?}");
        let _ = fs::remove_dir_all(data);
    }

    // ── §2.7 D-4 and D-8: the launch's cleanup ─────────────────────────────────────────────────────────

    fn with_files(tag: &str, pid: u32) -> PathBuf {
        let data = scratch(tag);
        fs::write(data.join(LEAVE_STARTED), format!("{{\"pid\":{pid},\"image\":\"consonance.exe\"}}")).unwrap();
        fs::write(data.join(LEAVE_RESULT), format!("{{\"pid\":{pid},\"image\":\"consonance.exe\",\"outcome\":\"DONE\"}}")).unwrap();
        data
    }

    #[test]
    fn a_launch_with_no_leave_file_reads_nothing() {
        let data = scratch("clean_none");
        fs::write(data.join(WAITER_LOCK), "{\"pid\":7}").unwrap();
        let c = leave_cleanup(&data, &|_| panic!("the probe ran on a launch with no LEAVE file"));
        assert_eq!(c, LeaveCleanup::default());
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn a_live_waiter_lock_keeps_every_leave_file() {
        let data = with_files("clean_waiter", 500);
        fs::write(data.join(WAITER_LOCK), "{\"pid\":7,\"image\":\"node\"}").unwrap();
        let probe = |pid: u32| if pid == 7 { Listing::Running(ProcInfo { name: "node.exe".into(), cmd: Vec::new() }) } else { Listing::Gone };
        let c = leave_cleanup(&data, &probe);
        assert_eq!((c.remove.len(), c.keep.len()), (0, 2), "{c:?}");
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn an_unreadable_waiter_lock_keeps_every_leave_file() {
        let data = with_files("clean_badlock", 500);
        fs::write(data.join(WAITER_LOCK), "not json").unwrap();
        let c = leave_cleanup(&data, &gone);
        assert_eq!((c.remove.len(), c.keep.len()), (0, 2), "{c:?}");
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn a_dead_waiter_and_a_dead_app_remove_both_files() {
        let data = with_files("clean_dead", 500);
        fs::write(data.join(WAITER_LOCK), "{\"pid\":7,\"image\":\"node\"}").unwrap();
        let c = leave_cleanup(&data, &gone);
        assert_eq!((c.remove.len(), c.keep.len()), (2, 0), "{c:?}");
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn no_waiter_lock_and_a_dead_app_remove_both_files() {
        let data = with_files("clean_nolock", 500);
        let c = leave_cleanup(&data, &gone);
        assert_eq!((c.remove.len(), c.keep.len()), (2, 0), "{c:?}");
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn a_waiter_pid_reused_by_another_image_is_not_a_live_waiter() {
        let data = with_files("clean_reusedwaiter", 500);
        fs::write(data.join(WAITER_LOCK), "{\"pid\":7,\"image\":\"node\"}").unwrap();
        let c = leave_cleanup(&data, &named("svchost.exe"));
        assert_eq!(c.keep.len(), 0, "{c:?}");
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn a_leave_file_naming_a_live_consonance_is_kept() {
        let data = with_files("clean_liveapp", 500);
        let c = leave_cleanup(&data, &named("Consonance.exe"));
        assert_eq!((c.remove.len(), c.keep.len()), (0, 2), "{c:?}");
        let _ = fs::remove_dir_all(data);
    }

    /// D-8 (§2.8 a) is built for the waiter by P-LEAVE-2, not for this cleanup: a file naming this launch's own pid names
    /// a LIVE Consonance, so D-4 as ruled still keeps it.
    #[test]
    fn a_leave_file_naming_this_launchs_own_pid_is_kept_as_ruled() {
        let data = with_files("clean_ownpid", 99);
        let c = leave_cleanup(&data, &named("consonance.exe"));
        assert_eq!((c.remove.len(), c.keep.len()), (0, 2), "{c:?}");
        let _ = fs::remove_dir_all(data);
    }

    #[test]
    fn the_leave_files_name_the_app_image_in_the_rust_spelling_and_match_pidimages_shape() {
        assert_eq!((APP_IMAGE, image_stem(APP_IMAGE).as_str()), ("consonance.exe", "consonance"));
    }

    // ── §2.9 B2-1: a seat in flight does not escape the drain ─────────────────────────────────────────

    use std::sync::atomic::{AtomicU8, AtomicUsize, Ordering};

    #[test]
    fn a_spawn_held_in_flight_across_the_drain_is_never_done() {
        static COUNT: AtomicUsize = AtomicUsize::new(0);
        static PHASE: AtomicU8 = AtomicU8::new(0);
        let flight = enter_flight(&COUNT, &PHASE, 0).expect("a spawn before the close was refused");
        PHASE.store(1, Ordering::SeqCst); // the close begins while the spawn is still in flight
        let mut sleeps = 0;
        let in_flight = await_flights(&COUNT, 3, &mut || sleeps += 1);
        let e = leave_ending(&[], in_flight, &Ok(real("done")));
        assert!((in_flight, sleeps, e.done) == (1, 3, false) && e.why.as_deref().unwrap_or("").contains("1 seat was still being started"), "{in_flight} {sleeps} {e:?}");
        drop(flight);
        assert_eq!(COUNT.load(Ordering::SeqCst), 0, "a landed flight left the count raised");
    }

    /// The ORDER is the race-freedom (§2.9 B2-1: "INCREMENT first, THEN read LEAVE_PHASE"), and no single-threaded test
    /// can observe it — both orders refuse a late spawn identically. So it is pinned at the source.
    #[test]
    fn the_flight_is_counted_before_the_phase_is_read() {
        let src = fs::read_to_string("src/sync_launch.rs").expect("read own source");
        let at = src.find(concat!("pub fn enter", "_flight(")).expect("no enter_flight");
        let body = &src[at..at + src[at..].find("\n}\n").unwrap()];
        let count = body.find(concat!("count.fetch", "_add(1")).expect("the flight is not counted");
        let phase = body.find(concat!("phase.", "load(")).expect("the phase is not read");
        assert!(count < phase, "the phase is read before the flight is counted — a close can drain between the two");
    }

    #[test]
    fn a_spawn_entering_after_the_close_began_is_refused_and_leaves_no_count() {
        static COUNT: AtomicUsize = AtomicUsize::new(0);
        static PHASE: AtomicU8 = AtomicU8::new(1);
        assert!(enter_flight(&COUNT, &PHASE, 0).is_none(), "a spawn woke after the close began");
        assert_eq!(COUNT.load(Ordering::SeqCst), 0);
    }

    #[test]
    fn a_flight_that_lands_during_the_wait_lets_the_drain_proceed() {
        static COUNT: AtomicUsize = AtomicUsize::new(0);
        static PHASE: AtomicU8 = AtomicU8::new(0);
        let mut flight = Some(enter_flight(&COUNT, &PHASE, 0).unwrap());
        PHASE.store(1, Ordering::SeqCst);
        let in_flight = await_flights(&COUNT, 100, &mut || drop(flight.take()));
        assert_eq!(in_flight, 0);
    }

    #[test]
    fn a_seat_still_starting_is_named_in_the_result_file_too() {
        let data = scratch("inflight");
        let run = run_leave(&data, 4242, &[], 2, one(Path::new("D:\\stick")), APP_T, &at, &mut |_| Ok(real("done")));
        let LeaveRun::Shown { result, .. } = run else { panic!("no Leave screen") };
        assert!(result["outcome"] == "NOT_DONE" && result["why"].as_str().unwrap_or("").contains("2 seats were still being started"), "{result}");
        let _ = fs::remove_dir_all(data);
    }

    // ── §2.9 B2-2: an empty process list is CANNOT TELL, never "all ended" ─────────────────────────────

    #[test]
    fn an_empty_process_list_is_cannot_tell() {
        assert_eq!(listing_from(&HashMap::new(), 7, 99), Listing::CannotTell);
    }

    #[test]
    fn a_list_holding_the_app_says_gone_for_a_pid_it_lacks_and_running_for_one_it_has() {
        let me = ProcInfo { name: "consonance.exe".into(), cmd: Vec::new() };
        let seat = ProcInfo { name: "claude.exe".into(), cmd: Vec::new() };
        let listed: HashMap<u32, ProcInfo> = [(99, me), (8, seat.clone())].into_iter().collect();
        assert_eq!((listing_from(&listed, 7, 99), listing_from(&listed, 8, 99)), (Listing::Gone, Listing::Running(seat)));
    }

    #[test]
    fn the_wait_counts_an_empty_list_as_alive_to_the_bound() {
        let seats = vec![SeatProc { pane: "a".into(), pid: Some(7), image: Some("claude.exe".into()) }];
        let empty = HashMap::new();
        let probe = |pid: u32| listing_from(&empty, pid, 99);
        let mut sleeps = 0;
        assert_eq!((await_seats(&seats, 4, &probe, &mut || sleeps += 1), sleeps), (vec!["a".to_string()], 4));
    }

    #[test]
    fn the_cleanup_removes_nothing_on_an_empty_list() {
        let data = with_files("clean_emptylist", 500);
        let empty = HashMap::new();
        let c = leave_cleanup(&data, &|pid| listing_from(&empty, pid, 99));
        assert_eq!((c.remove.len(), c.keep.len()), (0, 2), "{c:?}");
        let _ = fs::remove_dir_all(data);
    }

    /// Each probe call is its own enumeration, so one can fail while the next succeeds. A waiter that CANNOT be checked
    /// keeps every file even when the files' own app pid then reads plainly gone. (The first form of this test failed
    /// every call alike, and mutant Y6 — the waiter's CANNOT TELL ignored — survived it: the per-file check kept the
    /// files for it.)
    #[test]
    fn the_cleanup_removes_nothing_when_the_waiter_lock_cannot_be_checked_against_the_list() {
        let data = with_files("clean_emptylist_lock", 500);
        fs::write(data.join(WAITER_LOCK), "{\"pid\":7,\"image\":\"node\"}").unwrap();
        let empty = HashMap::new();
        let me: HashMap<u32, ProcInfo> = [(99, ProcInfo { name: "consonance.exe".into(), cmd: Vec::new() })].into_iter().collect();
        let probe = |pid: u32| if pid == 7 { listing_from(&empty, pid, 99) } else { listing_from(&me, pid, 99) };
        let c = leave_cleanup(&data, &probe);
        assert_eq!((c.remove.len(), c.keep.len()), (0, 2), "{c:?}");
        let _ = fs::remove_dir_all(data);
    }
}
