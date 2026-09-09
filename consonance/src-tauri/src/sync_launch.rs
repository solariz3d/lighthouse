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
        let absent = retired.len() - moved.len() - failed.len();
        s.push_str(&format!(
            " RETIRED {} transcript(s), {absent} seat(s) had none here",
            moved.len()
        ));
        for r in &moved {
            s.push_str(&format!("; {} -> {}", r.seat, r.to.display()));
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
            from: home
                .join(".claude")
                .join("projects")
                .join(enc)
                .join(format!("{sid}.jsonl")),
            to: attic_for(home, enc, sid, stamp),
        })
        .collect()
}

/// Apply it. A missing source is NOT an error — it is a seat that has never run here, which is the
/// ordinary case on a machine joining the sync — and it is reported as its own outcome so the row
/// can tell "nothing to retire" from "retire failed", which look identical in a count.
pub fn apply_retire(plan: &[SeatTranscript]) -> Vec<RetireOutcome> {
    plan.iter()
        .map(|s| {
            if !s.from.exists() {
                return RetireOutcome {
                    seat: s.seat.clone(),
                    from: s.from.clone(),
                    to: s.to.clone(),
                    moved: false,
                    error: None,
                };
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
                },
                Err(e) => RetireOutcome {
                    seat: s.seat.clone(),
                    from: s.from.clone(),
                    to: s.to.clone(),
                    moved: false,
                    error: Some(e.to_string()),
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

        let out = apply_retire(&plan);
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
        apply_retire(&first);

        let second = retire_plan(&home, &seats(), "20260910-0800");
        std::fs::write(&second[0].from, "tuesday").unwrap();
        apply_retire(&second);

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
        let out = apply_retire(&plan);
        let line = seam_line(&decide(&synced(Some("laptop-L"), Some("desktop-D"))), &out);
        assert!(line.starts_with("sync at launch — MIGRATE:"));
        assert!(line.contains("RETIRED 1 transcript(s), 2 seat(s) had none here"));
        assert!(line.contains("consonance-attic"));
        let _ = std::fs::remove_dir_all(&home);
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
