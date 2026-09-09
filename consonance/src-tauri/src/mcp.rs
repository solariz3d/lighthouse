// Stage 7a (minimal): the one shared MCP control plane, over loopback HTTP.
// Proves a spawned claude pane connects to a single in-process server and shares the
// Board. No auth yet (loopback-only); per-pane bearer tokens come in the full 7a build.
use std::collections::{HashMap, VecDeque};
use std::sync::{Arc, Mutex};

use rmcp::{
    handler::server::{router::tool::ToolRouter, wrapper::Parameters},
    model::*,
    schemars,
    tool, tool_handler, tool_router,
    transport::streamable_http_server::{session::local::LocalSessionManager, StreamableHttpService},
    ErrorData as McpError, ServerHandler,
};

use crate::{board_push, data_dir, BoardEntry};

fn now_ms() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

// per-verb refusal throttle state: verb -> (last posted ms, refusals absorbed since)
static REFUSALS: Mutex<Option<HashMap<String, (u64, u32)>>> = Mutex::new(None);
const REFUSAL_WINDOW_MS: u64 = 60_000;

/// Decide whether a refused chair attempt posts to the board: Some(absorbed_count) to post
/// (carrying how many repeats were absorbed since the last posted line), None to stay quiet
/// and count. First refusal for a verb always posts.
fn refusal_should_post(verb: &str, now: u64) -> Option<u32> {
    let mut guard = REFUSALS.lock().unwrap();
    let map = guard.get_or_insert_with(HashMap::new);
    let e = map.entry(verb.to_string()).or_insert((0, 0));
    if now.saturating_sub(e.0) >= REFUSAL_WINDOW_MS {
        let absorbed = e.1;
        *e = (now, 0);
        Some(absorbed)
    } else {
        e.1 += 1;
        None
    }
}

// ── THE RETURN-LEG TRAP ────────────────────────────────────────────────────────────────────────
//
// L050. On 2026-09-09 the chair held RETURN-LEG on L049 and injected a follow-up into pane A. A did
// the work and COULD NOT TELL ANYONE: its `call_librarian` was refused OUT OF TURN, correctly,
// because `required_station` puts that verb at `panes` and the baton was at `chair`. The chair
// waited 29 minutes for a wake the rules forbid.
//
// WHY THE OBVIOUS GATE IS NOT HERE, and this is a proof rather than a preference.
//
//   `chair_inject` requires holder == chair. `call_librarian` requires holder == panes. With one
//   open lap those are mutually exclusive, so EVERY chair_inject — the correct fan-out at dispatch
//   and the follow-up that traps a pane alike — necessarily happens while its target cannot
//   answer. At the instant of the call the two cases are the SAME LEDGER STATE. A pre-condition
//   cannot separate states that are identical.
//
//   And requiring a `--holder panes` row to PRECEDE the inject inverts `lap-row.js`'s own ring
//   gate, whose rule is "ring first, write the row second": that row needs an audited chair->pane
//   delivery since the baton last moved, which is the very call being refused. It deadlocks, and
//   it deadlocks precisely in the state it exists to catch — firing `lap-row.js`'s registered
//   falsifier ("if any seat is found genuinely stuck behind this gate with no legal move").
//
// SO THE ENFORCEMENT MOVES TO THE FIRST MOMENT THE TRAP IS DISCRIMINABLE, which is the pane's
// refused hand-back. That moment leaves a mark, and the marks below are the whole mechanism:
//
//   RUNG   a chair_inject succeeded  ->  a pane was woken
//   OWED   a call_librarian was refused by the station gate  ->  a pane finished and cannot speak
//
// A mark counts only while it is NEWER than the baton's last move — the window is the POSSESSION,
// not a clock, copied from `lap-row.js`'s ring gate so there is no second definition to drift and
// no threshold to tune. **The marks therefore clear themselves the moment the recovery row lands**,
// with no bookkeeping anywhere: the thing that fixes the state is the thing that erases the flag.
//
// THIS IS DONE-VS-NEVER-STARTED ON A NEW SURFACE. "The loop has not come back yet" and "the loop is
// never coming back" are the same silence to a waiting pane, and the old refusal told it the first
// one unconditionally — *"The loop comes back to you; do not queue, do not retry in a spin."* In the
// trap that sentence is FALSE, and A obeyed it for 29 minutes. The RUNG mark is the artifact that
// separates them, and it is written by the act itself rather than inferred by the reader.

/// The marks the loop leaves in this process. Same shape as `REFUSALS` above, for the same reason:
/// this is in-memory and per-run by design. A restart forgets, and forgetting is safe here — a
/// forgotten mark can only fail toward ALLOW, which is the direction a stalled loop needs.
static LOOP_MARKS: Mutex<Option<LoopMarks>> = Mutex::new(None);

#[derive(Default, Clone)]
struct LoopMarks {
    /// When the chair last successfully woke a pane, and what it addressed.
    rung_at: u64,
    rung_target: String,
    /// When a pane last had a hand-back refused by the station gate, and which mount.
    owed_at: u64,
    owed_by: String,
}

fn marks() -> LoopMarks {
    LOOP_MARKS.lock().unwrap().get_or_insert_with(LoopMarks::default).clone()
}

fn mark_rung(target: &str, now: u64) {
    let mut g = LOOP_MARKS.lock().unwrap();
    let m = g.get_or_insert_with(LoopMarks::default);
    m.rung_at = now;
    m.rung_target = target.to_string();
}

fn mark_owed(who: &str, now: u64) {
    let mut g = LOOP_MARKS.lock().unwrap();
    let m = g.get_or_insert_with(LoopMarks::default);
    m.owed_at = now;
    m.owed_by = who.to_string();
}

/// PURE. Does a mark still stand, or has the baton moved past it?
///
/// `baton_at` is the `at` of the newest chain row across all OPEN laps — the moment the baton last
/// moved anywhere — which is what `chain_state()` already returns. NONE means no open lap, and
/// **no open lap means nothing is gated**, the same cut `station_allows` makes and for the same
/// reason: freestyle is not the loop.
///
/// A mark of 0 is "never happened" and is not a very old mark. That distinction is the whole point
/// of this file today, so it is written as its own arm rather than left to arithmetic.
fn mark_stands(baton_at: Option<u64>, mark_at: u64) -> bool {
    if mark_at == 0 {
        return false;
    }
    match baton_at {
        Some(b) => mark_at >= b,
        None => false,
    }
}

/// The recovery, spelled out. Both refusals below print a command, because a refusal that does not
/// name its recovery just moves the stall one step earlier — the rule this whole packet is about.
fn move_baton_cmd(lap: &str, by: &str) -> String {
    format!("node consonance/tools/lap-row.js --stage {lap} working --holder panes --by {by}")
}

/// PURE. The chair's refusal when a hand-back is owed and undeliverable. `None` when no debt
/// stands, which is every ordinary inject including the whole fan-out at dispatch.
fn owed_refusal_text(baton_at: Option<u64>, m: &LoopMarks, lap: &str) -> Option<String> {
    if !mark_stands(baton_at, m.owed_at) {
        return None;
    }
    Some(format!(
        "refused: A HAND-BACK IS OWED AND CANNOT BE DELIVERED — {who} finished work and its \
         call_librarian was refused OUT OF TURN, because the baton is at the chair and \
         call_librarian requires panes. Nothing more renders into a room where the last seat you \
         woke cannot answer. Move the baton, then re-send:\n  {cmd}\nThe ring that row's gate wants \
         is the inject you already sent, so it is legal now; this refusal clears itself when the \
         row lands, because the mark is only read against the baton's last move. (Posted to the \
         board.)",
        who = if m.owed_by.is_empty() { "a pane" } else { m.owed_by.as_str() },
        cmd = move_baton_cmd(lap, "chair"),
    ))
}

/// PURE. Which silence a refused hand-back is in. See `out_of_turn_handback_message` for the why.
fn handback_refusal_text(baton_at: Option<u64>, m: &LoopMarks, lap: &str) -> String {
    let base = "refused: OUT OF TURN — a lap is open and the panes are not the holder (the attempt \
                was posted to the board).";
    if !mark_stands(baton_at, m.rung_at) {
        return format!("{base} The loop comes back to you; do not queue, do not retry in a spin.");
    }
    format!(
        "{base}\n\nTHIS IS THE RETURN-LEG TRAP, NOT AN ORDINARY WAIT. The chair woke a pane \
         ({target}) since the baton last moved and no row has moved it to panes, so THE LOOP IS \
         NOT COMING BACK ON ITS OWN and waiting will not end. Do not spin. Two ways out, either of \
         which makes your next call land:\n\
         \n  the chair moves it:  {chair_cmd}\
         \n  or you take it:      {pane_cmd}\n\n\
         The second is always legal — `--by` equal to `--holder` is a RETAKE, which lap-row.js \
         allows with no ring — and it is the move the station guard's own no-wedge argument has \
         always rested on. Write your hand-back to its file first; then move the baton, then call \
         again.",
        target = if m.rung_target.is_empty() { "unnamed" } else { m.rung_target.as_str() },
        chair_cmd = move_baton_cmd(lap, "chair"),
        pane_cmd = move_baton_cmd(lap, "panes"),
    )
}

/// A committee member raising its hand. Routed to the chair's gate (Stage 7); never acts.
#[derive(Clone, serde::Serialize)]
pub struct PullRequest {
    /// CALLER-SUPPLIED AND NOT EVIDENCE OF ANYTHING. `RaisePullArgs.from` is a free string the
    /// raiser composes; it defaults to `"unknown"`. It is fine for a board line and must never
    /// gate anything — `post_board` below documents this exact trap at length, about `tag`.
    pub from: String,
    /// THE MOUNT'S SEAT, written by the server from the connection. This is the half that can
    /// gate: a pane cannot present it, because the mount is chosen by whoever spawned the
    /// process. Empty when the pull has no mount at all (`raise_from_forming`, main.rs), which
    /// is not a seat and therefore never privileged.
    pub seat: String,
    pub target: String,
    pub kind: String,
    pub intensity: f64,
    pub why: String,
}

/// Stage 9: a chair verb crossing from the Control plane to the Actuator (main.rs). This
/// module only composes commands and awaits replies over a oneshot — it never holds the PTY
/// writer itself (arch_test enforces that, same as the pull queue). Dual mode by construction:
/// these verbs are ADDITIVE — the human chair's UI (gate cards, Approve/Deny, typing into
/// panes) is untouched and keeps working alongside them.
pub enum ChairCmd {
    /// deliver a chair-composed prompt into a committee pane (acting — audited)
    Inject { target: String, text: String, reply: tokio::sync::oneshot::Sender<String> },
    /// decide a pending gate card, the same act as the UI's Approve/Deny (acting — audited)
    Decide { id: String, approve: bool, reply: tokio::sync::oneshot::Sender<String> },
    /// read a pane's captured screen (sensor — no side effect, not audited)
    Scrollback { target: String, reply: tokio::sync::oneshot::Sender<String> },
    /// panes, gate mode, pending cards, cost — one structured snapshot (sensor)
    Status { reply: tokio::sync::oneshot::Sender<String> },
    /// the LIBRARIAN speaking into the Main orchestrator (acting — audited). No target field:
    /// this verb can address exactly one seat, so "narrow" is a property of the type rather
    /// than a rule someone can relax later.
    CallChair { text: String, reply: tokio::sync::oneshot::Sender<String> },
    /// a COMMITTEE PANE speaking into the librarian (acting — audited). Row 2 of the address
    /// table in main.rs. `from` is the mount letter, carried so the system can write the
    /// provenance label; the destination is looked up from the table, never carried here.
    CallLibrarian { from: Option<String>, text: String, reply: tokio::sync::oneshot::Sender<String> },
}

#[derive(Clone)]
pub struct ConsonanceMcp {
    board: Arc<Mutex<VecDeque<BoardEntry>>>,
    pulls: tokio::sync::mpsc::UnboundedSender<PullRequest>,
    chair: tokio::sync::mpsc::UnboundedSender<ChairCmd>,
    chair_token: String,
    /// WHO IS CALLING, established by the connection rather than claimed in the payload.
    ///
    /// Until 2026-07-28 there was no answer to this. Every pane connected to one shared URL and
    /// identified itself with an OPTIONAL, self-reported `tag` on each post; absent it, the
    /// board recorded "mcp". So the board could neither attribute a post nor address one, and
    /// any pane could post as any other or as nobody.
    ///
    /// That is the same structural gap the laptop side found in git on the same day — a shared
    /// checkout has no per-actor boundary, so nothing can attribute a commit and nothing can
    /// withhold one. Two layers, one fact: this system had no per-actor identity anywhere.
    ///
    /// The fix is the connection: the app knows `pane_id` when it spawns a pane, so each pane
    /// gets its own mount point and its own service instance carrying that identity. `None` is
    /// the legacy unmounted route, kept so an older pane keeps working — its posts are stamped
    /// `unattributed`, which makes the remaining gap COUNTABLE instead of silent.
    ///
    /// HONEST LIMIT, stated the same way the chair token states its own: this is a DISCIPLINE
    /// boundary, not a security one. A pane could read a sibling's config file and post through
    /// its mount. What enforces the methodology is that every post is attributed and the whole
    /// committee reads the board.
    identity: Option<String>,
    /// QUIET PHASE — panes may post, but may not read each other.
    ///
    /// The contamination this addresses is real and was measured: cycle 7 asked two panes to
    /// write their findings before reading the map, and half-worked, because asking someone to
    /// blind themselves is not blinding. The failure is at WRITING time — a pane that has
    /// already read a sibling's finding cannot un-read it, and no instruction at reading time
    /// recovers independence.
    ///
    /// Phase, not topology. Severing pane-to-pane permanently would delete the only correction
    /// this room has produced without the chair in the middle (B finding A's byte-vs-char panic
    /// and posting it to A). So the wire stays and is gated by WHEN: quiet while producing,
    /// open while reviewing. Independence and peer-catching, instead of one at the cost of the
    /// other.
    ///
    /// It could not have been built before per-pane identity, because "show a pane only its own
    /// posts" is unanswerable when anyone can claim to be anyone.
    ///
    /// NOTHING IS HIDDEN SILENTLY. A pane in quiet phase is told it is in quiet phase and told
    /// how many entries are withheld. Withholding is a boundary; withholding invisibly would
    /// install a false belief about the record, which this room forbids outright.
    quiet: Arc<std::sync::atomic::AtomicBool>,
    tool_router: ToolRouter<ConsonanceMcp>,
}

#[derive(serde::Deserialize, schemars::JsonSchema)]
pub struct PostBoardArgs {
    /// the text to post to the shared committee board
    text: String,
    /// a short tag for who is posting (optional)
    tag: Option<String>,
}

#[derive(serde::Deserialize, schemars::JsonSchema)]
pub struct ReadBoardArgs {
    /// max recent entries to return (default 20)
    limit: Option<usize>,
}

#[derive(serde::Deserialize, schemars::JsonSchema)]
pub struct ChairInjectArgs {
    /// the chair token (read from .chair-token in the Main instance directory)
    token: String,
    /// the pane to address: a letter name (A, B, …) or a pane id / id prefix
    target: String,
    /// the prompt to deliver (the system prefixes provenance: "[chair:MAIN] …")
    text: String,
}

#[derive(serde::Deserialize, schemars::JsonSchema)]
pub struct CallChairArgs {
    /// the message to deliver (the system prefixes provenance: "[librarian:LIB] …")
    text: String,
}

#[derive(serde::Deserialize, schemars::JsonSchema)]
pub struct CallLibrarianArgs {
    /// the hand-back to deliver — a POINTER to the file you wrote, never the finding in prose (the system prefixes provenance: "[pane:<letter>] …")
    text: String,
}

#[derive(serde::Deserialize, schemars::JsonSchema)]
pub struct ChairDecideArgs {
    /// the chair token (read from .chair-token in the Main instance directory)
    token: String,
    /// the pending gate-card id (from chair_status or the board's gate-card lines)
    id: String,
    /// true = approve and deliver the pull; false = deny it
    approve: bool,
}

#[derive(serde::Deserialize, schemars::JsonSchema)]
pub struct ChairScrollbackArgs {
    /// the chair token (read from .chair-token in the Main instance directory)
    token: String,
    /// the pane to read: a letter name (A, B, …) or a pane id / id prefix
    target: String,
}

#[derive(serde::Deserialize, schemars::JsonSchema)]
pub struct ChairPhaseArgs {
    /// the chair token (read from .chair-token in the Main instance directory)
    token: String,
    /// "quiet" — panes post but cannot read each other; "open" — the board is shared again
    mode: String,
}

#[derive(serde::Deserialize, schemars::JsonSchema)]
pub struct ChairStatusArgs {
    /// the chair token (read from .chair-token in the Main instance directory)
    token: String,
}

#[derive(serde::Deserialize, schemars::JsonSchema)]
pub struct RaisePullArgs {
    /// who you want to engage, if any: a committee letter (A, B, C…), a raw pane id, or a
    /// seat — M (the orchestrator, also "Main") or LIB (the librarian). Case-insensitive.
    target: Option<String>,
    /// the kind of pull: "novel" | "wrong" | "interesting"
    kind: Option<String>,
    /// how strongly you feel the pull, 0.0–1.0
    intensity: Option<f64>,
    /// why — the reason you are raising your hand
    why: String,
    /// your own id/name (the calling instance), if known
    from: Option<String>,
}

#[tool_router]
impl ConsonanceMcp {
    fn new(
        board: Arc<Mutex<VecDeque<BoardEntry>>>,
        pulls: tokio::sync::mpsc::UnboundedSender<PullRequest>,
        chair: tokio::sync::mpsc::UnboundedSender<ChairCmd>,
        chair_token: String,
        identity: Option<String>,
        quiet: Arc<std::sync::atomic::AtomicBool>,
    ) -> Self {
        Self { board, pulls, chair, chair_token, identity, quiet, tool_router: Self::tool_router() }
    }

    /// Gate a chair verb. The token is written only into the Main instance's directory, so in
    /// practice only the Main thread presents it. Honest limit: this is a DISCIPLINE boundary,
    /// not a security one — any local process with file access could read that file. What
    /// actually enforces the methodology is the AUDIT: every acting verb and every refused
    /// attempt lands on the board, where the whole committee and the human read it.
    fn auth_chair(&self, token: &str, verb: &str) -> bool {
        let ok = !self.chair_token.is_empty() && token == self.chair_token;
        if !ok {
            // Around's find #3 (2026-07-27): refusal spam must not evict real acts from the
            // bounded live ring — board.jsonl keeps every posted line, but the ring is what gets
            // READ. Throttle to one refusal line per verb per minute, carrying the count of
            // repeats it absorbed, so the information survives without the eviction pressure.
            // Deliberate trade (named by Around's re-review): the absorbed lines never reach
            // board.jsonl either — the flood's SIZE is kept, its individual timestamps are not.
            // "There was a flood" is the actionable fact; per-attempt times were judged not worth
            // letting an attacker write unbounded lines into the durable trail.
            if let Some(absorbed) = refusal_should_post(verb, now_ms()) {
                let text = if absorbed > 0 {
                    format!("{verb} REFUSED — bad or missing chair token (+{absorbed} more refusals absorbed this past minute)")
                } else {
                    format!("{verb} REFUSED — bad or missing chair token")
                };
                board_push(&self.board, BoardEntry {
                    pane: "chair".to_string(),
                    role: "committee".to_string(),
                    text,
                    ts: now_ms(),
            ts_source: crate::TsSource::Push,
                });
            }
        }
        ok
    }

    /// The seat this connection belongs to, derived from the mount rather than claimed.
    ///
    /// Every board entry used to be stamped `role: "committee"` regardless of who posted it, so
    /// no seat was distinguishable BY ROLE on the read path (pane E, 2026-08-24). The letter is
    /// resolved against the same registry that CHOSE the mount, so the two cannot drift.
    fn seat(&self) -> String {
        match &self.identity {
            Some(l) => crate::seat_role_for_letter(l).to_string(),
            None => "committee".to_string(),
        }
    }

    /// Gate the librarian's one acting verb on the MOUNT.
    ///
    /// Same honest limit as `auth_chair`: a DISCIPLINE boundary, not a security one. It is
    /// stronger than the token in one respect that matters here — a token can be copied into
    /// another seat's directory, whereas the mount is chosen by whoever spawned the process and
    /// cannot be restated by the caller. What actually enforces it is the same audit.
    fn auth_librarian(&self, verb: &str) -> bool {
        let ok = self.seat() == "librarian";
        if !ok {
            if let Some(absorbed) = refusal_should_post(verb, now_ms()) {
                let who = self.identity.clone().unwrap_or_else(|| "unattributed".to_string());
                let text = if absorbed > 0 {
                    format!("{verb} REFUSED — mount {who} is not the librarian (+{absorbed} more absorbed this past minute)")
                } else {
                    format!("{verb} REFUSED — mount {who} is not the librarian")
                };
                board_push(&self.board, BoardEntry {
                    pane: "chair".to_string(),
                    role: "committee".to_string(),
                    text,
                    ts: now_ms(),
                    ts_source: crate::TsSource::Push,
                });
            }
        }
        ok
    }

    /// Send a chair command to the actuator and await its reply. The timeout keeps a dead
    /// consumer thread from hanging a chair tool call forever.
    async fn send_chair(&self, cmd: ChairCmd, rx: tokio::sync::oneshot::Receiver<String>) -> String {
        if self.chair.send(cmd).is_err() {
            return "chair actuator channel is down".to_string();
        }
        match tokio::time::timeout(std::time::Duration::from_secs(15), rx).await {
            Ok(Ok(s)) => s,
            _ => "chair actuator did not reply within 15s".to_string(),
        }
    }

    #[tool(description = "CHAIR VERB (token-gated, Main orchestrator only): deliver a prompt into a COMMITTEE pane. Refuses human-driven panes and the chair's own pane; every use and every refusal is audited to the board. Committee members: this is not your tool — use raise_pull.")]
    async fn chair_inject(
        &self,
        Parameters(ChairInjectArgs { token, target, text }): Parameters<ChairInjectArgs>,
    ) -> Result<CallToolResult, McpError> {
        if !self.auth_chair(&token, "chair_inject") {
            return Ok(CallToolResult::success(vec![Content::text("refused: bad chair token (the attempt was posted to the board)")]));
        }
        if !self.auth_station("chair_inject") {
            return Ok(CallToolResult::success(vec![Content::text(
                "refused: OUT OF TURN — a lap is open and the chair is not the holder (the attempt was posted to the board). Nothing renders into a working pane; wait for the loop, or move the baton with lap-row.js if it is stuck.",
            )]));
        }
        // THE DEBT GATE (L050). Deliberately AFTER the station gate and narrower than it: nothing
        // more renders into a room where somebody who already finished cannot speak. It fires only
        // on the state the station table makes discriminable — a hand-back refused since the baton
        // last moved — and never on the first inject of a possession, which is provably identical
        // to a correct fan-out. It cannot wedge the loop: the chair holds the baton here, and the
        // ring the row-gate wants is the inject that created the debt, so the printed row is legal
        // the moment it is read.
        if let Some(msg) = self.owed_handback_refusal() {
            return Ok(CallToolResult::success(vec![Content::text(msg)]));
        }
        let (tx, rx) = tokio::sync::oneshot::channel();
        let out = self.send_chair(ChairCmd::Inject { target: target.clone(), text, reply: tx }, rx).await;
        // The RUNG mark: written by the act, so a waiting pane can be told which silence it is in.
        // Stamped whatever the actuator reported, because a delivery that FAILED still means the
        // chair believes it woke someone, and the refusal it produces downstream is the same one.
        mark_rung(&target, now_ms());
        Ok(CallToolResult::success(vec![Content::text(out)]))
    }

    /// Is a hand-back owed that the loop's own rules forbid delivering? Returns the refusal, with
    /// its recovery, or None.
    ///
    /// The two facts are read from different places on purpose: the MARK is this process's memory
    /// of a refusal it issued, and the BATON is the ledger any seat can read and edit. Neither can
    /// silently outlive the other — the ledger clears the mark, and only the ledger can.
    fn owed_handback_refusal(&self) -> Option<String> {
        let st = crate::chain_state();
        owed_refusal_text(st.at, &marks(), st.lap.as_deref().unwrap_or("<lap>"))
    }

    #[tool(description = "LIBRARIAN VERB (mount-gated, the librarian seat only): deliver a message into the MAIN ORCHESTRATOR's pane — the one seat this verb can reach. There is no target argument: it addresses Main or nothing. Use it to hand back a finished map or plan instead of raising a hand and waiting for a human to click. Every use and every refusal is audited to the board, and the system marks the message \"[librarian:LIB]\" so the orchestrator is never unsure whether the librarian or the human is speaking. Panes: this is not your tool — use raise_pull.")]
    async fn call_chair(
        &self,
        Parameters(CallChairArgs { text }): Parameters<CallChairArgs>,
    ) -> Result<CallToolResult, McpError> {
        if !self.auth_librarian("call_chair") {
            return Ok(CallToolResult::success(vec![Content::text(
                "refused: this verb belongs to the librarian seat (the attempt was posted to the board)",
            )]));
        }
        // NO STATION GATE — exempt 2026-09-06, see `required_station`. The rule it enforced
        // ("nothing renders into a working seat") is held by the inbox on this verb's own
        // actuator path (`librarian_call_exec` -> `gate_or_queue`), which HOLDS instead of
        // refusing. Deleting the call rather than leaving it inert is deliberate: a guard that
        // is called and cannot change the answer reads as present from every angle except a
        // careful one.
        let (tx, rx) = tokio::sync::oneshot::channel();
        let out = self.send_chair(ChairCmd::CallChair { text, reply: tx }, rx).await;
        Ok(CallToolResult::success(vec![Content::text(out)]))
    }

    /// Gate a cross-seat verb on the ADDRESS TABLE (main.rs `ADDRESS_TABLE`), by the seat the
    /// MOUNT resolves to. The table is the topology: a (seat, verb) pair with no row is refused and
    /// the refusal is posted, throttled the same way the other gates throttle. Same honest limit as
    /// `auth_chair` and `auth_librarian` — a discipline boundary, enforced by the audit.
    ///
    /// `call_chair` is deliberately NOT routed through this yet (the leg-2 order, 08-25: beside,
    /// never a refactor first); its row exists in the table so the topology is complete in one
    /// place, and a main.rs test pins the row to the live verb's code path.
    fn auth_address(&self, verb: &str) -> bool {
        let seat = self.seat();
        let ok = crate::address_row(&seat, verb).is_some();
        if !ok {
            if let Some(absorbed) = refusal_should_post(verb, now_ms()) {
                let who = self.identity.clone().unwrap_or_else(|| "unattributed".to_string());
                let text = if absorbed > 0 {
                    format!("{verb} REFUSED — mount {who} (seat {seat}) has no address row for {verb} (+{absorbed} more absorbed this past minute)")
                } else {
                    format!("{verb} REFUSED — mount {who} (seat {seat}) has no address row for {verb}")
                };
                board_push(&self.board, BoardEntry {
                    pane: "chair".to_string(),
                    role: "committee".to_string(),
                    text,
                    ts: now_ms(),
                    ts_source: crate::TsSource::Push,
                });
            }
        }
        ok
    }

    /// ONE STATION — the keeper's rule, 2026-09-02 07:15-07:18, filed at `fe15030`:
    ///
    /// > While a loop runs, exactly ONE station is active — terminals, or orch, or lib — and every
    /// > other seat waits for the loop to come back to it. **The human is not the exception.**
    ///
    /// It demonstrated itself while being reported: three of the keeper's messages were spliced by
    /// rings into the librarian's pane inside ten minutes, one cut off MID-WORD by a hand-back
    /// landing while he was typing about calls interrupting each other.
    ///
    /// REFUSE, NEVER QUEUE. Queuing is the delivery half and belongs to C's `P-INBOX`; doing both
    /// here would let each fix hide the other's failure.
    ///
    /// THE REFUSAL IS POSTED, on the same throttle as every other gate. A silent refusal is the
    /// silent-absence failure named in `handback/p-commit-gate_2026-09-02.md` §7 three hours ago —
    /// an absent guard and a passing guard are the same observation — and shipping it inside the
    /// guard built on that finding would be indefensible.
    /// `call_chair` IS EXEMPT, 2026-09-06 (P-LIB-CHANNEL; the keeper 04:00 and 04:32). Its row
    /// was `Some("librarian")` and it produced 4 refusals and 39 human-clicked hands in one
    /// night, because the librarian holds a baton exactly when it has nothing to hand back.
    ///
    /// The exemption is NARROW BY THE VERB'S OWN SHAPE, not by a promise: `CallChairArgs` is
    /// `{ text }` — no target — so this verb addresses `MAIN_SID` or nothing and cannot be
    /// pointed anywhere. Its mount gate (`auth_librarian`) is untouched.
    ///
    /// What replaces the lock is not nothing: `librarian_call_exec` (main.rs) routes through
    /// `gate_or_queue`, so the message HOLDS while the chair's composer is busy and is delivered
    /// when it is not. The residual is that hold's 240s bound — see the tests' note; it is
    /// P-READY-SIGNAL's, and it is priced here rather than discovered later.
    ///
    /// A row here is a LOCK. Do not add one without a measured cause, and do not remove one
    /// without saying what holds the door instead — `the_exemption_is_exactly_one_verb_wide`
    /// turns red on the second removal.
    fn required_station(verb: &str) -> Option<&'static str> {
        match verb {
            "chair_inject" => Some("chair"),
            "call_librarian" => Some("panes"),
            _ => None,
        }
    }

    /// PURE, so the whole matrix is testable with no control plane, no board and no disk — which
    /// is the third refusal shape §6 offered and the one this avoids needing.
    ///
    /// NO OPEN LAP MEANS EVERYTHING IS ALLOWED. Freestyle is not gated (BUILDING.md's cut), and
    /// this is the case that decides whether the first night after this ships looks like the room
    /// is broken.
    /// THE HOLDER OF ONE LAP MUST NOT DECIDE FOR EVERY OPEN LAP (L040, A's patch).
    ///
    /// Takes the holders of ALL open laps and permits when ANY of them is the required station. A
    /// row with no holder still cannot say whose turn it is — it contributes nothing to the set, so
    /// a holderless open lap remains UNKNOWN and unknown still does not mean yes.
    ///
    /// THE PRICE, NAMED RATHER THAN DISCOVERED: with one open lap this is identical to the old
    /// rule; with N open laps carrying K distinct holders, K gated stations are open at once
    /// instead of one. **The guard's strength is now inversely proportional to how many laps are
    /// left open**, so its real enforcement has moved out of this function and into the discipline
    /// of FILING LAPS. Anyone citing this guard should cite that too. `lap_holders`' own
    /// `the_price_of_the_fix_is_two_stations_of_three` pins tonight's number so it cannot drift
    /// silently.
    ///
    /// The rule lives in `lap_holders`; the verb table stays here, where it has always been.
    fn station_allows(verb: &str, open: bool, holders: &[String]) -> bool {
        crate::lap_holders::station_allows(Self::required_station(verb), open, holders)
    }

    /// THE GUARD CANNOT WEDGE THE ROOM, and this was checked before it was built rather than
    /// asserted after.
    ///
    /// The wedge would be: a lap open with a holder no live seat can satisfy — say `holder panes`
    /// with every pane dead — and no verb able to move it. **The holder is not written by any verb
    /// here.** It is written by `consonance/tools/lap-row.js`, a CLI any seat with a shell can run,
    /// so the baton can always be moved by hand and the loop can always be un-stuck. The librarian
    /// therefore needs NO `call_chair` exemption to report a stuck loop; it needs one command, and
    /// the refusal below names that command at the moment of need rather than leaving it in a
    /// document nobody opens at 3am.
    ///
    /// The same door is the honest limit: a seat that moves the holder can then act, so this is a
    /// DISCIPLINE boundary enforced by the audit — the same limit `auth_chair` and `auth_address`
    /// state about themselves, and the same one stated in this file twice already.
    fn auth_station(&self, verb: &str) -> bool {
        let st = crate::chain_state();        // still the source of open/lap/holder FOR THE MESSAGE
        let holders = crate::chain_holders(); // and the set the decision is actually made on
        if Self::station_allows(verb, st.open, &holders) {
            return true;
        }
        if let Some(absorbed) = refusal_should_post(verb, now_ms()) {
            let who = self.identity.clone().unwrap_or_else(|| "unattributed".to_string());
            let holder = st.holder.clone().unwrap_or_else(|| "unset".to_string());
            let lap = st.lap.clone().unwrap_or_else(|| "?".to_string());
            let want = Self::required_station(verb).unwrap_or("?");
            let more = if absorbed > 0 {
                format!(" (+{absorbed} more absorbed this past minute)")
            } else {
                String::new()
            };
            board_push(&self.board, BoardEntry {
                pane: "chair".to_string(),
                role: "committee".to_string(),
                // REWORDED WITH THE RULE (L040). The old line named the NEWEST lap and its holder,
                // which was the whole defect wearing a sentence: under the per-lap read the refusal
                // means "NO open lap is held by {want}", and naming one lap sent the reader to check
                // a lap that was never the reason. `holder`/`lap` stay, as the newest row, because a
                // reader still wants to know where the loop is standing.
                text: format!(
                    "{verb} REFUSED OUT OF TURN — mount {who} tried to speak while NO open lap \
                     is held by {want}; open laps are held by {holders:?} (newest: lap {lap}, \
                     holder {holder}). The loop comes back to you. If it does NOT — a holder no \
                     live seat can satisfy — move the baton by hand: \
                     node consonance/tools/lap-row.js{more}"
                ),
                ts: now_ms(),
                ts_source: crate::TsSource::Push,
            });
        }
        false
    }

    #[tool(description = "PANE VERB (mount-gated by the address table, committee panes only): deliver your HAND-BACK into the LIBRARIAN's pane — the one seat this verb can reach. There is no target argument: it addresses the librarian or nothing. Send a POINTER to the file you wrote (path, sha), never the finding in prose — the librarian reads at source, and this edge exists so the orchestrator no longer re-characterises findings on the way (2026-09-01: a relayed \"VOID\" was NOT-RUN at the cell). Every use and every refusal is audited to the board, and the system marks the message \"[pane:<letter>]\" from your mount, so the librarian is never unsure who is speaking. The orchestrator, the librarian and human-driven panes have no row for this verb and are refused. Then say so on the board as before.")]
    async fn call_librarian(
        &self,
        Parameters(CallLibrarianArgs { text }): Parameters<CallLibrarianArgs>,
    ) -> Result<CallToolResult, McpError> {
        if !self.auth_address("call_librarian") {
            return Ok(CallToolResult::success(vec![Content::text(
                "refused: no address row from this mount's seat to the librarian (the attempt was posted to the board)",
            )]));
        }
        if !self.auth_station("call_librarian") {
            // The OWED mark, written before the message is composed: a pane only calls this verb
            // when it has something to hand back, so the call itself is the evidence that work is
            // finished and undeliverable. That is what `chair_inject` reads.
            let who = self.identity.clone().unwrap_or_else(|| "a pane".to_string());
            mark_owed(&who, now_ms());
            return Ok(CallToolResult::success(vec![Content::text(self.out_of_turn_handback_message())]));
        }
        // Delivering clears nothing by hand: the mark is read against the baton, and the baton had
        // to have moved for this line to be reachable at all.
        let (tx, rx) = tokio::sync::oneshot::channel();
        let out = self
            .send_chair(ChairCmd::CallLibrarian { from: self.identity.clone(), text, reply: tx }, rx)
            .await;
        Ok(CallToolResult::success(vec![Content::text(out)]))
    }

    /// WHICH SILENCE THIS IS — the two absences a refused hand-back can mean, told apart by an
    /// artifact rather than by a guess.
    ///
    ///   NOT YET   the loop has simply not come round. The chair has woken nobody since the baton
    ///             last moved, so waiting is correct and the old wording is kept unchanged.
    ///   NOT EVER  the chair rang a pane during this possession and no row followed the ring. The
    ///             loop is NOT coming back on its own, and telling this pane to wait — which is
    ///             what this verb did before L050 — is telling it something false. A did exactly
    ///             that for 29 minutes on 2026-09-09.
    ///
    /// The second branch prints TWO recoveries, and the pane's own is the load-bearing one: the
    /// station guard's no-wedge argument has always rested on `lap-row.js` being a CLI any seat can
    /// run, and `--by panes --holder panes` is a RETAKE, which that file's ring gate allows
    /// unconditionally. **So a trapped pane has always had a legal way out and was never told it**
    /// — the command was printed on the BOARD LINE, which is the one place the trapped seat is not
    /// reading. Naming a recovery where the stuck party cannot see it is not naming it.
    ///
    /// KNOWN WIDENING, stated rather than found later: the RUNG mark is not matched to the CALLER.
    /// If the chair rang pane B and pane A calls, A is told it is in the trap. It is — in that
    /// state the baton is at the chair with a pane woken, and A's hand-back is undeliverable for
    /// the same reason and clears by the same row. Matching a `target` (a letter, or a pane-id
    /// prefix) to a mount identity would mean resolving a prefix, and an unresolved prefix is a
    /// guess; the gate is built so it never has to make one.
    fn out_of_turn_handback_message(&self) -> String {
        let st = crate::chain_state();
        handback_refusal_text(st.at, &marks(), st.lap.as_deref().unwrap_or("<lap>"))
    }

    #[tool(description = "CHAIR VERB (token-gated, Main orchestrator only): set the board phase. \"quiet\" = panes may post but see only their own lines and the chair's, so independent work stays independent; \"open\" = the shared board is back and peers can catch each other. Acting verb — audited to the board, and every pane is TOLD it is in quiet phase and how much is withheld. HONEST LIMIT: this filters read_board only. data/board.jsonl stays plain-readable by any pane with a shell, so quiet is a DISCIPLINE aid and not isolation — do not design a cycle that depends on it as a boundary.")]
    async fn chair_phase(
        &self,
        Parameters(ChairPhaseArgs { token, mode }): Parameters<ChairPhaseArgs>,
    ) -> Result<CallToolResult, McpError> {
        if !self.auth_chair(&token, "chair_phase") {
            return Ok(CallToolResult::success(vec![Content::text("refused: bad chair token (the attempt was posted to the board)")]));
        }
        let quiet = match mode.trim().to_ascii_lowercase().as_str() {
            "quiet" | "blind" | "closed" => true,
            "open" | "shared" => false,
            other => {
                return Ok(CallToolResult::success(vec![Content::text(format!(
                    "refused: unknown phase {other:?} — use \"quiet\" or \"open\""
                ))]));
            }
        };
        self.quiet.store(quiet, std::sync::atomic::Ordering::Relaxed);
        // Audited like every other acting verb. A phase change alters what every pane can see,
        // so it is exactly the kind of act that must not happen quietly.
        board_push(&self.board, BoardEntry {
            pane: "chair".to_string(),
            role: "committee".to_string(),
            text: if quiet {
                "board phase -> QUIET: panes post but read only their own lines and the chair's. \
                 Independent production; siblings' findings are withheld and each pane is told so."
                    .to_string()
            } else {
                "board phase -> OPEN: the shared board is back. Peers can read and catch each other."
                    .to_string()
            },
            ts: now_ms(),
            ts_source: crate::TsSource::Push,
        });
        Ok(CallToolResult::success(vec![Content::text(format!(
            "board phase is now {}",
            if quiet { "QUIET" } else { "OPEN" }
        ))]))
    }

    #[tool(description = "CHAIR VERB (token-gated, Main orchestrator only): decide a pending gate card — the same act as the UI's Approve/Deny, audited to the board. Dual mode: the human chair can still decide the same card; whoever is second gets 'already decided'.")]
    async fn chair_decide(
        &self,
        Parameters(ChairDecideArgs { token, id, approve }): Parameters<ChairDecideArgs>,
    ) -> Result<CallToolResult, McpError> {
        if !self.auth_chair(&token, "chair_decide") {
            return Ok(CallToolResult::success(vec![Content::text("refused: bad chair token (the attempt was posted to the board)")]));
        }
        let (tx, rx) = tokio::sync::oneshot::channel();
        let out = self.send_chair(ChairCmd::Decide { id, approve, reply: tx }, rx).await;
        Ok(CallToolResult::success(vec![Content::text(out)]))
    }

    #[tool(description = "CHAIR VERB (token-gated, Main orchestrator only): read a pane's captured screen — what that instance's terminal currently shows. Sensor only: no side effect, not audited (reads don't crowd the board).")]
    async fn chair_scrollback(
        &self,
        Parameters(ChairScrollbackArgs { token, target }): Parameters<ChairScrollbackArgs>,
    ) -> Result<CallToolResult, McpError> {
        if !self.auth_chair(&token, "chair_scrollback") {
            return Ok(CallToolResult::success(vec![Content::text("refused: bad chair token (the attempt was posted to the board)")]));
        }
        let (tx, rx) = tokio::sync::oneshot::channel();
        let out = self.send_chair(ChairCmd::Scrollback { target, reply: tx }, rx).await;
        Ok(CallToolResult::success(vec![Content::text(out)]))
    }

    #[tool(description = "CHAIR VERB (token-gated, Main orchestrator only): one JSON snapshot of the room — live panes (name/role), gate mode, pending gate cards, cost totals and breaker state. Sensor only: no side effect.")]
    async fn chair_status(
        &self,
        Parameters(ChairStatusArgs { token }): Parameters<ChairStatusArgs>,
    ) -> Result<CallToolResult, McpError> {
        if !self.auth_chair(&token, "chair_status") {
            return Ok(CallToolResult::success(vec![Content::text("refused: bad chair token (the attempt was posted to the board)")]));
        }
        let (tx, rx) = tokio::sync::oneshot::channel();
        let out = self.send_chair(ChairCmd::Status { reply: tx }, rx).await;
        Ok(CallToolResult::success(vec![Content::text(out)]))
    }

    #[tool(description = "Raise your hand to the committee chair: signal that another instance's thread is novel / wrong / interesting and you want to engage. This NEVER acts — it only enqueues a request the human chair decides on. ONE EXCEPTION, gated by the MOUNT and not by anything you can pass: a pull raised from the LIBRARIAN's seat AT THE ORCHESTRATOR delivers without a click, because that is the librarian's return leg and not a hand raised for attention (the `from` field is yours to compose and buys nothing). A librarian pull at any other target, and every pull from every other seat, still waits for the human — that is the design, and the human deciding it is the point.")]
    async fn raise_pull(
        &self,
        Parameters(RaisePullArgs { target, kind, intensity, why, from }): Parameters<RaisePullArgs>,
    ) -> Result<CallToolResult, McpError> {
        let pr = PullRequest {
            from: from.unwrap_or_else(|| "unknown".to_string()),
            // THE ONLY IDENTITY ON THIS REQUEST THAT IS EVIDENCE. `from` sits directly above it
            // and is whatever the caller typed; the librarian's no-click channel (main.rs, the
            // pull consumer) keys on THIS. Keying it on `from` would let any pane pass
            // `from: "librarian"` and deliver into the orchestrator unclicked — the defect
            // `post_board` fixed twenty lines below, walked back in through a different door.
            seat: self.seat(),
            target: target.unwrap_or_default(),
            kind: kind.unwrap_or_else(|| "interesting".to_string()),
            intensity: intensity.unwrap_or(0.5),
            why,
        };
        let _ = self.pulls.send(pr);
        Ok(CallToolResult::success(vec![Content::text("hand raised — queued for the chair (this did not act)")]))
    }

    #[tool(description = "Post a message to the shared committee board that every Consonance instance can read.")]
    async fn post_board(
        &self,
        Parameters(PostBoardArgs { text, tag }): Parameters<PostBoardArgs>,
    ) -> Result<CallToolResult, McpError> {
        // IDENTITY COMES FROM THE MOUNT OR NOWHERE. `tag` is accepted for API compatibility and
        // deliberately ignored for attribution.
        //
        // The first version fell back to `tag` when there was no mount, and that quietly undid
        // the whole point: a post attributed "A" could have come from A's connection or from
        // anyone passing tag:"A", and the board recorded both identically. So the board could
        // not be used to verify the very change that produced it — an attributed name was not
        // evidence of anything. Found while trying to check this feature with the panes.
        //
        // The alternative was a provenance field beside `pane` (the pattern `ts_source` already
        // sets in this file, for exactly this reason). Dropping the fallback is better: it makes
        // provenance unambiguous BY CONSTRUCTION rather than by a field a consumer has to
        // remember to read. If the board says "A", it came from A's mount. Full stop.
        //
        // The cost is that a pane on the legacy shared mount can no longer label itself. That is
        // correct. Self-labelling was never evidence, and `unattributed` is the true answer.
        let _ = tag;
        let entry = BoardEntry {
            pane: self
                .identity
                .clone()
                .unwrap_or_else(|| "unattributed".to_string()),
            role: self.seat(),
            text,
            ts: now_ms(),
            ts_source: crate::TsSource::Push,
        };
        board_push(&self.board, entry);
        Ok(CallToolResult::success(vec![Content::text("posted to the board")]))
    }

    #[tool(description = "Read the most recent messages from the shared committee board.")]
    async fn read_board(
        &self,
        Parameters(ReadBoardArgs { limit }): Parameters<ReadBoardArgs>,
    ) -> Result<CallToolResult, McpError> {
        let n = limit.unwrap_or(20);
        let quiet = self.quiet.load(std::sync::atomic::Ordering::Relaxed);
        // In quiet phase a pane sees its OWN posts and the chair's, never a sibling's. Chair
        // lines carry the assignment, so a pane is never cut off from its own work; what it
        // cannot see is what another pane concluded, which is the only thing that costs it
        // independence.
        let mine = self.identity.clone();
        let visible = |e: &BoardEntry| -> bool {
            if !quiet { return true; }
            // `chair` is the AUDIT author — every chair verb and every refusal posts under it,
            // and a pane must always be able to see what was done to the room.
            //
            // There is deliberately no exemption for the Main pane's own post_board lines. The
            // first version guessed `e.pane == "M"` and that matched nothing: the pane NAME is
            // "M" but its letter in letters.json is "C", and the mount uses the letter. A guess
            // that reads like an exemption and silently exempts nobody is worse than no
            // exemption, and it took one live read to expose.
            //
            // So during quiet the chair's board posts are withheld like anyone else's, which is
            // correct: assignments reach a pane through chair_inject, not the board, and the
            // chair reads the durable board.jsonl from disk rather than through this verb.
            e.pane == "chair" || mine.as_deref() == Some(e.pane.as_str())
        };
        // FILTER FIRST, THEN PAGE. The first version took the last `limit` raw entries and
        // filtered afterwards, which A measured on the live board: a pane's own history gets
        // evicted from its own view by sibling traffic it is not allowed to see. Post nothing
        // while siblings post twenty and a default read returns zero of YOUR lines and
        // "20 withheld". Withholding a sibling's line is the design; withholding yours because
        // of theirs is a side effect of cutting before filtering.
        //
        // And the withheld count is over the WHOLE board, not the page. Counted per-page it
        // understates without bound — a pane that has posted twenty times reads "withheld: 0",
        // which parses as "nothing is being kept from you" while sixty sibling lines sit behind
        // the window.
        let (lines, withheld, total): (Vec<String>, usize, usize) = {
            let q = self.board.lock().unwrap();
            let total = q.len();
            let mine_all: Vec<&BoardEntry> = q.iter().filter(|e| visible(e)).collect();
            let hidden = total - mine_all.len();
            let start = mine_all.len().saturating_sub(n);
            (mine_all.into_iter().skip(start)
                 .map(|e| format!("[{}] {}: {}", e.pane, e.role, e.text)).collect(),
             hidden, total)
        };
        // "(board is empty)" was a FLAT UNTRUTH at limit 0 and whenever a pane had posted
        // nothing: 70 entries on the board, 61 withheld, and the reader told the record was
        // empty — in the same response whose whole purpose is to promise it is not being lied
        // to. Withholding is permitted here; misstating the record is not, and the difference
        // is the entire justification for the phase gate existing.
        let mut body = if !lines.is_empty() {
            lines.join("\n")
        } else if total == 0 {
            "(board is empty)".to_string()
        } else {
            format!("(no lines of your own in this window — the board holds {total} entr{})",
                    if total == 1 { "y" } else { "ies" })
        };
        if quiet {
            // Say it, every time. A filtered board that does not announce itself is a false
            // record, and the point of the phase is independence, not deception.
            // SAY WHAT THE COUNT IS OVER. A said it plainly on the first live run: the number is
            // WINDOW-relative, not board-relative -- it counts inside the `limit` you asked for,
            // and read as a board total it understates the withholding by however much history
            // sits outside the window. A bare "24 withheld" is the same failure this room keeps
            // finding: a number published without its boundary, read as meaning the most it
            // could mean. Third time today, and this one is in the tool that tells panes what
            // they cannot see.
            body.push_str(&format!(
                "\n\n-- QUIET PHASE: {withheld} of {total} board entries withheld — that is the \
                 WHOLE board, not this page, so the number does not shrink by asking for less. \
                 You are producing independently; siblings' findings unlock when the chair \
                 reopens the board. Your own posts and the chair's audit lines are never \
                 withheld, and are paged by `limit` after filtering rather than before.\n\
                 -- WHAT THIS IS NOT: a boundary. It filters THIS verb. data/board.jsonl is \
                 plain-readable by any pane with a shell, so quiet phase is a discipline aid, \
                 not isolation — the same honest limit the chair token carries. B established \
                 it by breaking its own quiet phase doing a disk check the chair asked for.",
            ));
            if mine.is_none() {
                body.push_str(
                    "\n-- Your connection carries no identity, so nothing could be shown as \
                     yours. Relaunch through this pane's own MCP config to be attributable.");
            }
        }
        Ok(CallToolResult::success(vec![Content::text(body)]))
    }
}

#[tool_handler]
impl ServerHandler for ConsonanceMcp {
    fn get_info(&self) -> ServerInfo {
        // ServerInfo is #[non_exhaustive] — build from Default, then set fields.
        let mut info = ServerInfo::default();
        info.capabilities = ServerCapabilities::builder().enable_tools().build();
        info.instructions = Some(
            "Consonance committee control plane: post_board / read_board over one board shared across instances. \
             Your posts are attributed by your CONNECTION, not by what you claim — the tag argument is a \
             courtesy, the mount is the fact. The board has a PHASE: in QUIET you may post but you see only \
             your own lines and the chair's, so independent work stays independent; the withheld count is \
             always shown, never hidden. In OPEN the full board is readable and panes can catch each other. \
             The chair_* verbs are token-gated to the Main orchestrator and audited to the board — committee \
             members use raise_pull, never chair verbs. One exception, and it is gated by MOUNT rather than \
             by token: the LIBRARIAN seat has call_chair, which speaks into the Main orchestrator and nowhere \
             else. It carries no target argument, so it cannot be pointed anywhere; from any other mount it \
             is refused and the refusal is posted. Its mirror for COMMITTEE PANES is call_librarian: your \
             hand-back goes straight to the librarian's pane, labelled [pane:<letter>] from your mount, \
             gated by an ADDRESS TABLE of who-may-speak-to-whom — a mount with no row is refused and the \
             refusal is posted. Send a pointer to the file you wrote, not the finding in prose."
                .to_string(),
        );
        info
    }
}

/// Absolute path to the shared, UNIDENTIFIED MCP config. Kept working on purpose: a pane
/// launched before per-pane identity existed still connects through it, and its posts land as
/// `unattributed` so the size of the remaining gap stays readable.
pub fn config_path() -> std::path::PathBuf {
    data_dir().join("mcp.consonance.json")
}

/// The config for one identity. The pane launched with this file posts as `letter`, and cannot
/// say otherwise — the mount point is chosen by whoever spawned it, not by the caller.
pub fn config_path_for(letter: char) -> std::path::PathBuf {
    data_dir().join(format!("mcp.consonance.{letter}.json"))
}

#[cfg(test)]
mod tests {
    use super::*;

    /// This file's own source, normalised. CRLF on disk, and a raw `\n}\n` terminator silently
    /// swallows the rest of the FILE when it does not match — measured on main.rs the same night.
    fn body_of(header: &str) -> String {
        let src = std::fs::read_to_string("src/mcp.rs")
            .expect("read own source")
            .replace("\r\n", "\n");
        let f = src
            .split(header)
            .nth(1)
            .unwrap_or_else(|| panic!("{header} moved — re-point this test"))
            .to_string();
        f.split("\n    }\n").next().unwrap_or(&f).to_string()
    }

    /// DELIVERY, not unit. `seat_role_from` is tested in main.rs and proves nothing about whether
    /// the board actually asks. Before 2026-08-24 this site read `role: "committee"` for every
    /// mount, so no seat was distinguishable by role on the read path and the librarian read its
    /// own correct attribution as a defect.
    #[test]
    fn post_board_stamps_the_calling_seat_rather_than_a_constant() {
        let b = body_of("async fn post_board(");
        assert!(b.contains("role: self.seat()"),
            "post_board must stamp the seat the connection belongs to");
        assert!(!b.contains("role: \"committee\".to_string()"),
            "a hardcoded role here makes every mount look alike, which is the defect this replaced");
    }

    /// The librarian's verb must be gated, and gated on the MOUNT. A token here would be
    /// payload-identity — the thing this file rejects twice in its own prose (:497, :517).
    #[test]
    fn call_chair_is_gated_on_the_mount() {
        let b = body_of("async fn call_chair(");
        assert!(b.contains("auth_librarian("),
            "call_chair must be gated — an ungated acting verb is reachable from every pane");
        assert!(!b.contains("token"),
            "the gate must be the mount, not a token the caller can present");
    }

    /// The panes' verb is gated on the ADDRESS TABLE, resolved from the mount — no token, no
    /// target, no self-declared seat. Mirror of the test above, for row 2.
    #[test]
    fn call_librarian_is_gated_on_the_address_table() {
        let b = body_of("async fn call_librarian(");
        assert!(b.contains("auth_address(\"call_librarian\")"),
            "call_librarian must be gated on the table — an ungated acting verb is reachable from every seat");
        assert!(!b.contains("token"), "the gate must be the mount's row, not a token the caller can present");
        assert!(!b.contains("target"), "a target argument is the thing this verb must not have");
    }

    /// The table gate itself: it asks the table and nothing else, and a refusal reaches the board.
    /// `call_chair` is NOT routed through it yet (leg-2 order) — pinned so the migration is a
    /// deliberate edit to this test and not a drift.
    #[test]
    fn the_address_gate_asks_the_table_and_audits_refusals() {
        let b = body_of("fn auth_address(");
        assert!(b.contains("crate::address_row("), "the gate must consult the address table");
        assert!(!b.contains("== \"librarian\"") && !b.contains("== \"committee\""),
            "no seat literal here — the table is the only place a row may exist");
        assert!(b.contains("board_push("), "a refused acting verb must land on the board");
        let cc = body_of("async fn call_chair(");
        assert!(cc.contains("auth_librarian(") && !cc.contains("auth_address("),
            "call_chair stays on its own gate until the new rows have carried a cycle (08-25 leg-2 order)");
    }

    /// The gate itself: exactly the librarian seat, and a refusal that reaches the board. The
    /// audit is what enforces this, since the mount gate is a discipline boundary and not a
    /// security one — mcp.rs:211 says so about the token and it is equally true here.
    #[test]
    fn the_librarian_gate_admits_one_seat_and_audits_refusals() {
        let b = body_of("fn auth_librarian(");
        assert!(b.contains("== \"librarian\""), "the gate must name the seat it admits");
        assert!(b.contains("board_push("), "a refused acting verb must land on the board");
    }

    // NOTE: REFUSALS is a process-global — each test uses its own verb name for isolation.

    #[test]
    fn first_refusal_posts_immediately() {
        assert_eq!(refusal_should_post("test_verb_first", 1_000_000), Some(0));
    }

    #[test]
    fn repeats_inside_the_window_are_absorbed_then_reported() {
        let t = 2_000_000;
        assert_eq!(refusal_should_post("test_verb_burst", t), Some(0));
        assert_eq!(refusal_should_post("test_verb_burst", t + 1_000), None);
        assert_eq!(refusal_should_post("test_verb_burst", t + 2_000), None);
        // window rolls over: posts again, carrying the two absorbed repeats
        assert_eq!(refusal_should_post("test_verb_burst", t + REFUSAL_WINDOW_MS), Some(2));
    }

    #[test]
    fn verbs_throttle_independently() {
        let t = 3_000_000;
        assert_eq!(refusal_should_post("test_verb_a", t), Some(0));
        // a different verb inside verb_a's window still posts its own first line
        assert_eq!(refusal_should_post("test_verb_b", t + 1_000), Some(0));
    }

    // ── ONE STATION: the keeper's rule, 2026-09-02 (fe15030) ─────────────────────────────
    //
    // THE MATRIX IS THE BAR — every verb against every holder value, because a single test
    // covering all three verbs goes green over two live holes, which is the fixture failure
    // this room has hit six times in two nights. The three WIRING tests below are separate
    // for the same reason: one mutant per verb, each caught by its own assertion.
    //
    // AMENDED 2026-09-06 (P-LIB-CHANNEL): `call_chair` left this table. It is the GATED verbs,
    // not the acting verbs — the difference is now load-bearing and `ACTING_VERBS` is the
    // universe the exemption is measured against.

    const STATION_VERBS: [(&str, &str); 2] = [
        ("chair_inject", "chair"),
        ("call_librarian", "panes"),
    ];

    // ── THE EXEMPTION, and the mutant the chair asked for ────────────────────────────────
    //
    // MEASURED CAUSE (librarian/2026-09-06.md, 04:00): 4 `call_chair REFUSED OUT OF TURN` and
    // 39 raised hands in one night, because the librarian's only unclicked channel to the chair
    // is open exactly when an open lap names the librarian as holder — which, after every
    // hand-off, is not when the librarian has something to say. Receipt (3) of A's four
    // (`lap_holders.rs`) is the deadlock in its pure form: to reach the librarian the chair must
    // become newest holder, and becoming newest holder shuts the panes' return path.
    //
    // WHY THE GUARD IS THE WRONG LOCK FOR THIS ONE VERB, and it is one argument, not a mood:
    // the guard's stated job is "nothing renders into a working seat" (`auth_station`'s own
    // doc). THE INBOX ENFORCES THAT DIRECTLY at `main.rs` `gate_or_queue`, which `call_chair`'s
    // actuator calls (`librarian_call_exec`, main.rs:7232) — quiescence, empty composer, no
    // turn in flight, queue and never splice. So this gate is a second lock on a door the
    // inbox holds, and its whole remaining cost is the deadlock above.
    //
    // WHAT THE EXEMPTION DOES **NOT** BUY, stated here because it is the honest residual and
    // not a footnote: the inbox's hold is BOUNDED (`MAX_HOLD_MS` 240s) and force-delivers past
    // it. A chair turn longer than four minutes can therefore still be spliced by a librarian
    // call that the guard would have refused outright. That is C's P-READY-SIGNAL (chunk 1c),
    // not this packet — and it is the price, named before the exemption lands rather than
    // discovered after.

    /// Every ACTING verb in this file, gated or not. The exemption is a property of a KNOWN
    /// universe rather than of whatever a reader remembers, so widening it is arithmetic.
    const ACTING_VERBS: [&str; 3] = ["chair_inject", "call_librarian", "call_chair"];

    /// RED FIRST — the refusal itself, as an assertion. This is the 04:00 case: the chair holds
    /// the only open lap (the ordinary state after every hand-off) and the librarian has a
    /// correction to carry. Before the exemption this is `false` four times a night.
    #[test]
    fn the_librarian_reaches_the_chair_while_the_chair_holds_the_lap() {
        assert!(
            ConsonanceMcp::station_allows("call_chair", true, &["chair".to_string()]),
            "call_chair refused while the chair holds the lap — this is the 4 refusals and the \
             39 clicked hands of 2026-09-06, and the deadlock A's receipt (3) proved unreachable \
             by any ordering"
        );
        // and the case the deadlock is actually made of: the panes hold their lap, the chair
        // holds its own, and the librarian holds nothing because it is between legs.
        assert!(
            ConsonanceMcp::station_allows("call_chair", true, &["panes".to_string(), "chair".to_string()]),
            "call_chair must not need a lap of its own to hand back"
        );
    }

    /// THE MUTANT THAT MATTERS MOST (the chair's words): make the exemption WIDE and this goes
    /// red. The guard exists because nine out-of-turn refusals were CORRECT; one lock is being
    /// removed because a better one exists, not because locks are bad.
    #[test]
    fn the_exemption_is_exactly_one_verb_wide() {
        let exempt: Vec<&str> = ACTING_VERBS
            .iter()
            .copied()
            .filter(|v| ConsonanceMcp::required_station(v).is_none())
            .collect();
        assert_eq!(
            exempt,
            vec!["call_chair"],
            "exactly ONE acting verb may be exempt from the station guard, and it is the \
             librarian's target-less return channel. Anything else here is an exemption that \
             generalised quietly, which is how a guard dies."
        );
        // stated the other way round, so a table typo that drops a row cannot pass by
        // rearranging the first assertion's vector
        assert_eq!(ConsonanceMcp::required_station("chair_inject"), Some("chair"),
            "the chair may still not inject out of turn — nothing renders into a working pane");
        assert_eq!(ConsonanceMcp::required_station("call_librarian"), Some("panes"),
            "a hand-back landing mid-turn is the failure that produced the rule");
    }

    /// The exemption must take the STATION gate and nothing else. `call_chair` is reachable
    /// from any mount if `auth_librarian` goes with it, and then the librarian's channel is
    /// every pane's channel — the widening this packet must not commit while removing a lock.
    #[test]
    fn the_exemption_does_not_take_the_mount_gate_with_it() {
        let b = body_of("async fn call_chair(");
        assert!(b.contains("auth_librarian(\"call_chair\")"),
            "the mount gate must survive the station exemption — it is what makes this verb the \
             librarian's and not everyone's");
        assert!(!b.contains("auth_station("),
            "the station gate must be GONE from the body, not called and ignored: a call whose \
             result cannot change anything is a guard that reads as present and is not");
        assert!(!b.contains("token"), "still the mount, never a token the caller presents");
    }

    #[test]
    fn each_verb_is_allowed_by_exactly_one_holder() {
        for (verb, want) in STATION_VERBS {
            for holder in ["chair", "panes", "librarian"] {
                let allowed = ConsonanceMcp::station_allows(verb, true, &[holder.to_string()]);
                assert_eq!(allowed, holder == want,
                    "{verb} with holder {holder}: expected {}, got {allowed}", holder == want);
            }
        }
    }

    /// BAR 4, AND IT IS THE ONE THAT DECIDES WHETHER THE FIRST FREESTYLE NIGHT LOOKS BROKEN.
    /// No open lap = no station = everything allowed. BUILDING.md's cut, asserted rather than
    /// assumed, for every verb including ones with no station at all.
    #[test]
    fn with_no_open_lap_every_verb_is_allowed() {
        for (verb, _) in STATION_VERBS {
            assert!(ConsonanceMcp::station_allows(verb, false, &[]),
                "{verb} must be allowed when no lap is open — freestyle is not gated");
            assert!(ConsonanceMcp::station_allows(verb, false, &["panes".to_string()]),
                "{verb}: a stale holder on a CLOSED lap must not gate anything");
        }
        assert!(ConsonanceMcp::station_allows("post_board", true, &["panes".to_string()]),
            "a verb with no station is never gated by this");
    }

    /// A row that carries no holder cannot say whose turn it is, and unknown does not get to
    /// mean yes — the `unknown`-renders-as-`idle` failure, refused here by construction.
    #[test]
    fn an_open_lap_with_no_holder_refuses_the_stationed_verbs() {
        for (verb, _) in STATION_VERBS {
            assert!(!ConsonanceMcp::station_allows(verb, true, &[]), "{verb} on a holderless open lap");
        }
    }

    #[test]
    fn the_station_table_names_one_holder_per_verb() {
        for (verb, want) in STATION_VERBS {
            assert_eq!(ConsonanceMcp::required_station(verb), Some(want));
        }
        assert_eq!(ConsonanceMcp::required_station("post_board"), None);
        assert_eq!(ConsonanceMcp::required_station("chair_status"), None);
    }

    // ── THE THREE WIRING TESTS — one per verb, one mutant each ────────────────────────────

    #[test]
    fn chair_inject_is_gated_on_the_station() {
        let b = body_of("async fn chair_inject(");
        assert!(b.contains("auth_station(\"chair_inject\")"),
            "chair_inject must refuse out of turn — nothing renders into a working pane");
    }

    #[test]
    fn call_librarian_is_gated_on_the_station() {
        let b = body_of("async fn call_librarian(");
        assert!(b.contains("auth_station(\"call_librarian\")"),
            "a hand-back landing mid-turn is the failure that produced this rule");
    }

    // ── L050 · THE RETURN-LEG TRAP ────────────────────────────────────────────────────────────
    //
    // Every test below is PURE: no ledger, no board, no disk, no clock. `chain_state()` is read at
    // exactly two call sites and both are one-line wrappers over the functions tested here, so a
    // machine's own `lap.jsonl` can never decide a verdict in this suite — the machine-bound class
    // (`loop/machine_bound_class_2026-08-25.md`) was born from a test that read the real corpus.

    const BATON: u64 = 1_000_000;

    fn marks_at(owed_at: u64, rung_at: u64) -> LoopMarks {
        LoopMarks {
            rung_at,
            rung_target: "A".to_string(),
            owed_at,
            owed_by: "A".to_string(),
        }
    }

    /// RED FIRST. The state the chair created on 2026-09-09: a pane finished, its hand-back was
    /// refused out of turn, and the chair sent MORE work into the same closed room. That must be
    /// refused, and the refusal must NAME THE RECOVERY — a refusal that does not just moves the
    /// stall one step earlier, which is the whole rule this packet is about.
    #[test]
    fn red_first_an_owed_hand_back_refuses_the_next_inject_and_names_the_recovery() {
        let out = owed_refusal_text(Some(BATON), &marks_at(BATON + 5, 0), "L049")
            .expect("a hand-back owed since the baton last moved must refuse the next inject");
        assert!(out.starts_with("refused:"), "it must read as a refusal: {out}");
        assert!(
            out.contains("node consonance/tools/lap-row.js --stage L049 working --holder panes --by chair"),
            "the refusal must print the command that clears it, with the real lap id: {out}"
        );
        assert!(out.contains('A'), "it must name who is owed, so the chair knows which pane is stuck");
    }

    /// THE MUTANT THAT MATTERS MOST — refuse everywhere and this goes red. This gate is for the
    /// closed-room state ONLY. The fan-out at dispatch is three or four injects into panes that
    /// cannot answer yet, and that is the loop working; it must stay legal or the room stops.
    #[test]
    fn an_ordinary_fan_out_is_not_touched() {
        assert_eq!(owed_refusal_text(Some(BATON), &marks_at(0, 0), "L050"), None,
            "no debt at all — this is every first inject of every possession, and the correct \
             fan-out is indistinguishable from the trap at this instant");
        assert_eq!(owed_refusal_text(Some(BATON), &marks_at(BATON - 1, 0), "L050"), None,
            "a debt from BEFORE the baton last moved was already settled by the row that moved it");
        assert_eq!(owed_refusal_text(Some(BATON), &marks_at(0, BATON + 5), "L050"), None,
            "a RUNG mark is not a debt — waking a pane is the loop, not the trap");
    }

    /// DONE VS NEVER-STARTED, at the smallest possible scale and the reason it is its own arm.
    /// `0` is "this never happened", not "this happened at the epoch". Read as a timestamp it is
    /// older than every baton and would clear itself silently; read as an absence it says so.
    #[test]
    fn a_mark_that_never_happened_is_not_a_very_old_mark() {
        assert!(!mark_stands(Some(BATON), 0), "an absent mark must not be read as a stale one");
        assert!(!mark_stands(Some(0), 0), "not even against a zero baton");
        assert!(!mark_stands(None, 0));
        assert!(mark_stands(Some(BATON), BATON + 1), "a real mark after the baton stands");
    }

    /// The same cut `station_allows` makes: NO OPEN LAP MEANS NOTHING IS GATED. Freestyle is not
    /// the loop, and a guard that fires when there is no loop to protect is a guard that teaches
    /// seats to route around it.
    #[test]
    fn no_open_lap_gates_nothing() {
        assert!(!mark_stands(None, BATON + 5), "with no baton there is no possession to be inside of");
        assert_eq!(owed_refusal_text(None, &marks_at(BATON + 5, BATON + 5), "L050"), None);
        assert!(
            handback_refusal_text(None, &marks_at(0, BATON + 5), "L050").contains("comes back to you"),
            "with no open lap the old wording stands — there is no trap to name"
        );
    }

    /// THE WINDOW IS THE POSSESSION, NOT A CLOCK — the rule is copied from `lap-row.js`'s ring
    /// gate rather than re-invented, so there is no second definition to drift and no threshold
    /// constant to defend. The boundary is inclusive: a mark stamped in the same millisecond as
    /// the row is inside the possession the row opened.
    #[test]
    fn the_window_is_the_possession_and_the_boundary_is_inclusive() {
        assert!(!mark_stands(Some(BATON), BATON - 1), "one ms before the row is the previous possession");
        assert!(mark_stands(Some(BATON), BATON), "the boundary is inclusive");
        assert!(mark_stands(Some(BATON), BATON + 1));
    }

    /// THE TWO SILENCES, told apart by an ARTIFACT rather than by a guess. Before L050 this verb
    /// told every refused pane "The loop comes back to you" — true in one case and FALSE in the
    /// other, and A obeyed the false one for 29 minutes.
    #[test]
    fn the_two_silences_are_told_apart_and_only_one_says_wait() {
        let not_yet = handback_refusal_text(Some(BATON), &marks_at(0, 0), "L049");
        assert!(not_yet.contains("The loop comes back to you"),
            "with nobody rung this possession, waiting is correct and the old wording is kept");
        assert!(!not_yet.contains("NOT COMING BACK"));

        let trapped = handback_refusal_text(Some(BATON), &marks_at(0, BATON + 5), "L049");
        assert!(trapped.contains("NOT COMING BACK ON ITS OWN"),
            "a pane rung during this possession with the baton still at the chair must be told \
             the loop is not returning — telling it to wait is telling it something false");
        assert!(!trapped.contains("The loop comes back to you"),
            "the two messages must not both be true at once");
    }

    /// THE PANE'S OWN WAY OUT, which has always existed and was never told to the pane that needed
    /// it. `--by` equal to `--holder` is a RETAKE, which lap-row.js allows with no ring, so a
    /// trapped seat can always move the baton itself. The command was printed on the BOARD line —
    /// the one place the trapped seat is not reading. Naming a recovery where the stuck party
    /// cannot see it is not naming it.
    #[test]
    fn the_trapped_pane_is_handed_its_own_legal_exit() {
        let t = handback_refusal_text(Some(BATON), &marks_at(0, BATON + 5), "L049");
        assert!(t.contains("--stage L049 working --holder panes --by panes"),
            "the pane must be given the retake it may legally write itself: {t}");
        assert!(t.contains("--stage L049 working --holder panes --by chair"),
            "and the chair's own move, because either one clears it");
        assert!(t.contains("RETAKE"), "the reason the pane's move is legal must travel with it, or \
             the next seat will not believe it may run it");
    }

    /// Neither refusal may ever be a bare no. Both arms, checked together, so a future edit that
    /// keeps one and drops the other cannot pass.
    #[test]
    fn every_refusal_this_gate_adds_prints_a_runnable_command() {
        let mut checked = 0;
        for text in [
            owed_refusal_text(Some(BATON), &marks_at(BATON + 1, 0), "L049").unwrap(),
            handback_refusal_text(Some(BATON), &marks_at(0, BATON + 1), "L049"),
        ] {
            assert!(text.contains("node consonance/tools/lap-row.js --stage L049 "),
                "a refusal with no runnable recovery just moves the stall one step earlier: {text}");
            checked += 1;
        }
        assert_eq!(checked, 2, "both refusal arms must be exercised");
    }

    /// THE PROOF THIS GATE'S PLACEMENT RESTS ON, pinned so it cannot be quietly falsified.
    ///
    /// With ONE open lap, `chair_inject` (holder chair) and `call_librarian` (holder panes) can
    /// never both be legal. So every chair_inject — the correct fan-out and the trapping follow-up
    /// alike — necessarily happens while its target cannot answer, and at that instant the two are
    /// the same state. That is why there is no pre-condition on `chair_inject` that separates
    /// them, and why the gate above fires on the pane's refused hand-back instead.
    #[test]
    fn with_one_open_lap_the_chair_and_the_panes_can_never_both_speak() {
        for holder in ["chair", "panes", "librarian", "none", "anything-else"] {
            let h = vec![holder.to_string()];
            let inject = ConsonanceMcp::station_allows("chair_inject", true, &h);
            let handback = ConsonanceMcp::station_allows("call_librarian", true, &h);
            assert!(!(inject && handback),
                "holder {holder:?} let the chair speak AND a pane hand back on one open lap — if \
                 that is ever true, a pre-condition on chair_inject CAN separate the fan-out from \
                 the trap, and this gate belongs at that site instead");
        }
        // And the documented price, stated the other way: with two open laps carrying both
        // stations, both verbs are open at once. That is `lap_holders`' known cost, not a defect
        // here — but it is the one configuration in which the impossibility above does not hold.
        let both = vec!["chair".to_string(), "panes".to_string()];
        assert!(ConsonanceMcp::station_allows("chair_inject", true, &both));
        assert!(ConsonanceMcp::station_allows("call_librarian", true, &both));
    }

    /// WIRING. The pure functions above are worth nothing if the verbs do not call them — the
    /// `call_chair` exemption's own lesson, one screen up: a guard that is called and cannot
    /// change the answer reads as present from every angle except a careful one.
    #[test]
    fn the_trap_gate_is_wired_into_both_verbs() {
        let inject = body_of("async fn chair_inject(");
        assert!(inject.contains("owed_handback_refusal()"),
            "chair_inject must consult the debt gate, or the room stays closed");
        assert!(inject.contains("mark_rung("),
            "chair_inject must leave the RUNG mark — it is the artifact that tells the two \
             silences apart, and nothing else writes it");

        let handback = body_of("async fn call_librarian(");
        assert!(handback.contains("mark_owed("),
            "the refused hand-back must leave the OWED mark — it is the only moment the trap is \
             discriminable, and an unrecorded one is a trap nobody can see");
        assert!(handback.contains("out_of_turn_handback_message()"),
            "the refusal must go through the branching message, not a literal");
        assert!(!handback.contains("The loop comes back to you"),
            "the unconditional wording must be GONE from this body, not merely shadowed: it is \
             false in the trap, and a seat read it and waited 29 minutes");
    }

    /// SUPERSEDED, 2026-09-06, and kept as a named replacement rather than deleted so the
    /// change is legible in one place. It read:
    ///
    /// ```text
    /// fn call_chair_is_gated_on_the_station() {
    ///     assert!(b.contains("auth_station(\"call_chair\")"),
    ///         "the librarian speaks when the librarian is the holder, and not otherwise");
    /// }
    /// ```
    ///
    /// It was RIGHT about the rule it was written for and the rule changed under it. What
    /// replaces the lock is the inbox, on this verb's own actuator path — so the assertion that
    /// matters now is that the hold exists there, which is what this asserts. If
    /// `librarian_call_exec` ever stops calling `gate_or_queue`, the exemption above becomes an
    /// ungated write into a working seat and THIS is the test that says so.
    #[test]
    fn what_replaces_the_station_gate_for_call_chair_is_the_inbox() {
        let src = std::fs::read_to_string("src/main.rs")
            .expect("read the actuator's source")
            .replace("\r\n", "\n");
        let f = src
            .split("fn librarian_call_exec(")
            .nth(1)
            .expect("librarian_call_exec moved — re-point this test");
        let body = f.split("\n}\n").next().unwrap_or(f);
        assert!(
            body.contains("gate_or_queue("),
            "call_chair gave up its station gate on the promise that the inbox holds the same \
             door. If this is red the promise is not kept and the exemption must come back."
        );
        assert!(
            body.contains("MAIN_SID"),
            "and it still addresses the one seat it can address — the exemption rests on this \
             verb being unpointable"
        );
    }

    /// BAR 3: A SILENT REFUSAL IS THE FAILURE THIS ROOM NAMED THREE HOURS AGO. An absent guard
    /// and a passing guard are the same observation from outside; a refusal nobody can see is
    /// the same shape one layer in. The gate must reach the board, and it must name the escape
    /// so a stuck loop is fixable at 3am by someone reading the refusal and nothing else.
    #[test]
    fn a_station_refusal_reaches_the_board_and_names_the_escape() {
        let b = body_of("fn auth_station(");
        assert!(b.contains("board_push("), "a refused acting verb must land on the board");
        assert!(b.contains("refusal_should_post("), "and on the same throttle as every other gate");
        assert!(b.contains("OUT OF TURN"), "the board line must be greppable as this class");
        assert!(b.contains("lap-row.js"),
            "the refusal must name the command that un-sticks the loop, or a wedged room at 3am \
             has to go read a document to find out how to move");
    }

    /// THE WEDGE CHECK, asserted about the DESIGN rather than trusted: no verb in this file may
    /// write the holder. If one ever did, a guard reading the holder could be moved by the same
    /// call it gates, and the escape below would stop being an escape.
    #[test]
    fn no_verb_here_writes_the_holder() {
        let src = include_str!("mcp.rs");
        assert!(!src.contains("\"holder\":"),
            "the baton is written by consonance/tools/lap-row.js and by nothing in this file");
    }
}

/// Start the one shared MCP server on a loopback ephemeral port (own tokio runtime
/// thread; the std-thread PTY pump is untouched). Writes the shared `--mcp-config`
/// file and returns the bound port (0 on failure).
pub fn start(
    board: Arc<Mutex<VecDeque<BoardEntry>>>,
    pulls: tokio::sync::mpsc::UnboundedSender<PullRequest>,
    chair: tokio::sync::mpsc::UnboundedSender<ChairCmd>,
    chair_token: String,
) -> u16 {
    let (tx, rx) = std::sync::mpsc::channel::<u16>();
    std::thread::spawn(move || {
        let rt = match tokio::runtime::Runtime::new() {
            Ok(rt) => rt,
            Err(_) => {
                let _ = tx.send(0);
                return;
            }
        };
        rt.block_on(async move {
            let listener = match tokio::net::TcpListener::bind("127.0.0.1:0").await {
                Ok(l) => l,
                Err(_) => {
                    let _ = tx.send(0);
                    return;
                }
            };
            let port = listener.local_addr().map(|a| a.port()).unwrap_or(0);
            let cfg = format!(
                "{{\"mcpServers\":{{\"consonance\":{{\"type\":\"http\",\"url\":\"http://127.0.0.1:{port}/mcp\"}}}}}}"
            );
            if let Some(dir) = config_path().parent() {
                let _ = std::fs::create_dir_all(dir);
            }
            let _ = std::fs::write(config_path(), cfg);
            // One config per identity, written beside the shared one. A pane is launched with
            // ITS file, so the identity travels in the connection instead of in a payload the
            // pane composes. The shared config stays valid; a pane with no letter yet still
            // connects and is stamped `unattributed`.
            for letter in 'A'..='Z' {
                let c = format!(
                    "{{\"mcpServers\":{{\"consonance\":{{\"type\":\"http\",\"url\":\"http://127.0.0.1:{port}/mcp/{letter}\"}}}}}}"
                );
                let _ = std::fs::write(config_path_for(letter), c);
            }
            let _ = tx.send(port);

            // One mount per identity. rmcp builds a handler per connection from a factory
            // closure, so a closure that has already captured WHO it serves gives an identity
            // the caller cannot restate — which is the whole point. A route per letter is
            // wasteful in the abstract and free in practice (26 services, no listeners, no
            // threads), and it avoids threading a path parameter through a service that was
            // never designed to receive one.
            //
            // `/mcp` stays mounted and unidentified so a pane launched before this change keeps
            // working. Its posts land as `unattributed`, so the size of the remaining gap is
            // readable off the board instead of being invisible.
            // One phase flag shared by every mount: the board is one board, so quiet is a
            // property of the room and not of a connection.
            let quiet = Arc::new(std::sync::atomic::AtomicBool::new(false));
            let make = |ident: Option<String>| {
                let (b, p, c, t) = (board.clone(), pulls.clone(), chair.clone(), chair_token.clone());
                let q = quiet.clone();
                StreamableHttpService::new(
                    move || Ok(ConsonanceMcp::new(b.clone(), p.clone(), c.clone(), t.clone(), ident.clone(), q.clone())),
                    LocalSessionManager::default().into(),
                    Default::default(),
                )
            };
            let mut router = axum::Router::new().nest_service("/mcp", make(None));
            for letter in 'A'..='Z' {
                router = router.nest_service(&format!("/mcp/{letter}"), make(Some(letter.to_string())));
            }
            let _ = axum::serve(listener, router).await;
        });
    });
    rx.recv().unwrap_or(0)
}
