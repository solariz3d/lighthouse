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
/// P-REFUSAL-KEEPS-THE-POINTER (D077): how much of a refused `call_librarian`'s text the board keeps. A hand-back
/// pointer is a path, a line naming the packet, and the NEXT trailer — tonight's rings run 250-450 characters. The bound
/// exists so a pane pasting prose instead of a pointer cannot write an unbounded row into the durable trail.
const REFUSED_ATTEMPT_MAX_CHARS: usize = 600;

/// The board row that KEEPS a refused `call_librarian`'s payload (C, `handback/p-return-leg-C_2026-09-16.md` §2: the
/// refusal branch never read `text`, so the one message class that leaves no copy was the loop's own return leg, and
/// the refusal's own sentence "the attempt was posted to the board" was true of the attempt and not of what it carried).
///
/// The label is deliberately NOT "REFUSED OUT OF TURN — mount": that phrase is `auth_station`'s row and C's replay counts
/// refusals by it (`plan_return_leg_2026-09-19.md`, the discriminator). A second row matching it would double every
/// count. Line breaks become " | " so the NEXT trailer stays readable inside one row.
fn refused_attempt_row(who: &str, text: &str) -> String {
    refused_row_labelled("call_librarian REFUSED", who, text)
}

/// P-ADDRESS-REFUSAL-KEEPS-THE-POINTER (D078): the same kept payload for the ADDRESS-TABLE refusal one branch up, whose
/// sentence "(the attempt was posted to the board)" was overstated exactly as the out-of-turn one was — `auth_address`'s
/// own row records the mount and the seat, never the text. Its label carries the cause, so a reader can tell the two
/// refusals apart, and like the other it never matches "REFUSED OUT OF TURN — mount".
fn refused_address_row(who: &str, text: &str) -> String {
    refused_row_labelled("call_librarian REFUSED (no address row)", who, text)
}

fn refused_row_labelled(label: &str, who: &str, text: &str) -> String {
    let flat = text.trim().replace("\r\n", "\n").replace('\n', " | ");
    let n = flat.chars().count();
    let kept = if n > REFUSED_ATTEMPT_MAX_CHARS {
        let head: String = flat.chars().take(REFUSED_ATTEMPT_MAX_CHARS).collect();
        format!("{head} … [+{} chars not kept]", n - REFUSED_ATTEMPT_MAX_CHARS)
    } else {
        flat
    };
    format!("{label} — the attempt, kept because a refused call is not delivered: mount {who} carried: {kept}")
}

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
fn owed_refusal_text(
    baton_at: Option<u64>,
    m: &LoopMarks,
    lap: &str,
    holders: &[String],
    also_open: usize,
) -> Option<String> {
    if !mark_stands(baton_at, m.owed_at) {
        return None;
    }
    // WHERE THE BATON IS, READ RATHER THAN ASSERTED (L065 D2). This said "because the baton is at the chair", which
    // was true of the state L050 was written in and was never checked — the function had no holder to check. On
    // 2026-09-20 the holder was the LIBRARIAN when a pane's hand-back was refused, and a refusal that mis-states the
    // state it is diagnosing is the same class of defect as one that prints no recovery at all.
    let where_it_is = if holders.is_empty() {
        "no open lap names a holder".to_string()
    } else {
        holders.join(", ")
    };
    // L040's defect in the one place its fix was not applied: this lap id is the NEWEST open lap, which with several
    // laps open may be one the chair never rang on — and `--by chair` on that lap is refused by lap-row's ring gate.
    let which_lap = if also_open > 0 {
        format!(
            "\n{also_open} other lap(s) are open, and {lap} is the NEWEST row's lap, not necessarily the one you \
             rang on — move the lap you rang on, or that row's own ring gate will refuse it."
        )
    } else {
        String::new()
    };
    Some(format!(
        "refused: A HAND-BACK IS OWED AND CANNOT BE DELIVERED — {who} finished work and its \
         call_librarian was refused OUT OF TURN, because call_librarian requires the PANES to hold the baton and no \
         open lap is held by them (the baton is at: {where_it_is}). Nothing more renders into a room where the last \
         seat you woke cannot answer. Move the baton, then re-send:\n  {cmd}\n  or the pane takes it:  {pane_cmd}\n\
         The second is a RETAKE — `--by` equal to `--holder` — which lap-row.js allows with no ring, so it lands even \
         when the first is refused for want of one. The ring the first row's gate wants is the inject you already \
         sent.{which_lap}\nThis refusal clears itself when a row lands, because the mark is only read against the \
         baton's last move — including a row that does NOT open the panes. (Posted to the board.)",
        who = if m.owed_by.is_empty() { "a pane" } else { m.owed_by.as_str() },
        cmd = move_baton_cmd(lap, "chair"),
        pane_cmd = move_baton_cmd(lap, "panes"),
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
    /// P-SEAL-GATE: for a task that has an ANSWER KEY, its sealed row as "exo_memory/loop/<row>.md#<task>" —
    /// checked on origin before anything renders. "none: <reason>" when a dispatch names a sealed task's path but
    /// is not that task; the reason is posted. Omit for every ordinary dispatch.
    #[serde(default)]
    seal: Option<String>,
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
        Parameters(ChairInjectArgs { token, target, text, seal }): Parameters<ChairInjectArgs>,
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
        // THE SEAL GATE (P-SEAL-GATE, D068). After the station and debt gates and narrower than both, on the debt
        // gate's own precedent: it fires only on a dispatch that declares a key or names a sealed task's path. Off
        // the async thread, because a declared seal fetches from origin. See `seal_gate`.
        let (seal_decl, seal_text, seal_repo) = (seal.clone(), text.clone(), crate::repo_root());
        let verdict = tokio::task::spawn_blocking(move || seal_gate_at(seal_decl.as_deref(), &seal_text, seal_repo.as_deref()))
            .await
            .unwrap_or_else(|e| {
                SealVerdict::Refuse(format!(
                    "refused: THE SEAL GATE COULD NOT RUN ({e}) — the dispatch was not sent. This is NOT a turn problem. Recovery: re-send; if it repeats, the gate itself is broken."
                ))
            });
        match verdict {
            SealVerdict::Refuse(msg) => {
                self.seal_audit(format!("chair_inject -> {target} REFUSED BY THE SEAL GATE: {}", msg.lines().next().unwrap_or("")));
                return Ok(CallToolResult::success(vec![Content::text(msg)]));
            }
            SealVerdict::Allow(Some(line)) => self.seal_audit(format!("chair_inject -> {target}: {line}")),
            SealVerdict::Allow(None) => {}
        }
        // THE NEXT-TRAILER GATE (D069). LAST, after the seal gate: a keyed dispatch fails on its seal before its
        // formatting, and a trailer refusal only ever fires on a dispatch that would otherwise have been sent. The
        // refusal hands the message back whole (`trailer::refusal_text`). See `trailer_gate`.
        let text = match trailer_gate(crate::trailer::Verb::ChairInject, &format!("chair_inject -> {target}"), &text) {
            TrailerDecision::Deliver { text, audit } => {
                if let Some(line) = audit {
                    self.trailer_audit(line);
                }
                text
            }
            TrailerDecision::Refuse { reply, audit } => {
                self.trailer_audit(audit);
                return Ok(CallToolResult::success(vec![Content::text(reply)]));
            }
        };
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
        owed_refusal_text(st.at, &marks(), st.lap.as_deref().unwrap_or("<lap>"), &crate::chain_holders(), st.also_open)
    }

    /// The seal gate's board line: refusals AND verified seals, because a trail that carries only refusals cannot
    /// say which keyed dispatches the gate let through, or on what evidence.
    fn seal_audit(&self, text: String) {
        board_push(&self.board, BoardEntry {
            pane: "chair".to_string(),
            role: "committee".to_string(),
            text,
            ts: now_ms(),
            ts_source: crate::TsSource::Push,
        });
    }

    /// The NEXT-trailer gate's board line, for a refusal AND for a hand-back delivered with a warning — a warning that
    /// reaches only the receiver's pane is a warning the room cannot count (D069). Its own pane name, because the
    /// line may be about any seat's message, not the chair's.
    /// The digest gate's own board line, on its own pane name so a reader can count what the ring hashed, what it
    /// could not, and what it refused, without reading them out of the trailer gate's rows.
    fn digest_audit(&self, text: String) {
        board_push(&self.board, BoardEntry {
            pane: "digest-gate".to_string(),
            role: "committee".to_string(),
            text,
            ts: now_ms(),
            ts_source: crate::TsSource::Push,
        });
    }

    fn trailer_audit(&self, text: String) {
        board_push(&self.board, BoardEntry {
            pane: "trailer-gate".to_string(),
            role: "committee".to_string(),
            text,
            ts: now_ms(),
            ts_source: crate::TsSource::Push,
        });
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
        // THE NEXT-TRAILER GATE (D069): refused, because the librarian reads this reply in the same turn and the
        // refusal carries its message back whole — a re-send, never a loss. See `trailer::policy`.
        let text = match trailer_gate(crate::trailer::Verb::CallChair, "call_chair", &text) {
            TrailerDecision::Deliver { text, audit } => {
                if let Some(line) = audit {
                    self.trailer_audit(line);
                }
                text
            }
            TrailerDecision::Refuse { reply, audit } => {
                self.trailer_audit(audit);
                return Ok(CallToolResult::success(vec![Content::text(reply)]));
            }
        };
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
            // THE POINTER IS KEPT HERE TOO (D078), for the reason and on the terms of the out-of-turn branch below: every
            // refusal, bounded, not through the one-a-minute throttle `auth_address` uses for its own row.
            let who = self.identity.clone().unwrap_or_else(|| "unattributed".to_string());
            board_push(&self.board, BoardEntry {
                pane: "chair".to_string(),
                role: "committee".to_string(),
                text: refused_address_row(&who, &text),
                ts: now_ms(),
                ts_source: crate::TsSource::Push,
            });
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
            // THE POINTER IS KEPT (D077). Until this line the call's `text` was never read here, so a refused return leg
            // left no copy. Posted on EVERY refusal, not through `refusal_should_post`: that throttle keeps one row per
            // minute, and an absorbed refusal would lose exactly the pointer this row exists to keep. Bounded instead.
            board_push(&self.board, BoardEntry {
                pane: "chair".to_string(),
                role: "committee".to_string(),
                text: refused_attempt_row(&who, &text),
                ts: now_ms(),
                ts_source: crate::TsSource::Push,
            });
            return Ok(CallToolResult::success(vec![Content::text(self.out_of_turn_handback_message())]));
        }
        // THE NEXT-TRAILER GATE (D069): WARNED, NEVER REFUSED. A refused call_librarian discards its payload (the
        // out-of-turn arm above returns canned text), so refusing a hand-back over its trailer would destroy the
        // hand-back. The pointer is delivered first and unchanged, and the warning goes to the board so it is counted.
        // The Refuse arm is unreachable under `trailer::policy`; it is written to deliver anyway, so a later policy
        // change cannot turn this verb into the one that loses work.
        let who = self.identity.clone().unwrap_or_else(|| "a pane".to_string());
        // THE DIGEST GATE (P-DIGEST-AT-RING, L061 packet 3). BEFORE the trailer gate, so the ring's line is inserted
        // while the NEXT trailer is still the last line and the trailer check reads what the librarian will read. Off
        // the async thread, because it runs `git hash-object`. A refusal here keeps the attempt on the board for
        // D077's reason — a refused `call_librarian` is not delivered, so the pointer would otherwise leave no copy.
        // If the gate itself cannot run, the hand-back still goes, with the pane's digest stripped and none invented.
        let (digest_text, digest_repo) = (text.clone(), crate::repo_root());
        let verdict = tokio::task::spawn_blocking(move || digest_gate_at(&digest_text, digest_repo.as_deref()))
            .await
            .unwrap_or_else(|e| {
                DigestVerdict::Deliver(DigestDeliver {
                    text: strip_supplied_digests(&text).0,
                    audit: Some(format!("call_librarian from {who}: THE DIGEST GATE COULD NOT RUN ({e}) — delivered with no digest")),
                })
            });
        let text = match verdict {
            DigestVerdict::Deliver(d) => {
                if let Some(line) = d.audit {
                    self.digest_audit(line);
                }
                d.text
            }
            DigestVerdict::Refuse(msg) => {
                board_push(&self.board, BoardEntry {
                    pane: "chair".to_string(),
                    role: "committee".to_string(),
                    text: refused_digest_row(&who, &text),
                    ts: now_ms(),
                    ts_source: crate::TsSource::Push,
                });
                self.digest_audit(format!(
                    "call_librarian from {who} REFUSED BY THE DIGEST GATE: {}",
                    msg.lines().next().unwrap_or("")
                ));
                return Ok(CallToolResult::success(vec![Content::text(msg)]));
            }
        };
        let text = match trailer_gate(crate::trailer::Verb::CallLibrarian, &format!("call_librarian from {who}"), &text) {
            TrailerDecision::Deliver { text, audit } => {
                if let Some(line) = audit {
                    self.trailer_audit(line);
                }
                text
            }
            TrailerDecision::Refuse { audit, .. } => {
                self.trailer_audit(audit);
                text
            }
        };
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
        let out = owed_refusal_text(Some(BATON), &marks_at(BATON + 5, 0), "L049", &[], 0)
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
        assert_eq!(owed_refusal_text(Some(BATON), &marks_at(0, 0), "L050", &[], 0), None,
            "no debt at all — this is every first inject of every possession, and the correct \
             fan-out is indistinguishable from the trap at this instant");
        assert_eq!(owed_refusal_text(Some(BATON), &marks_at(BATON - 1, 0), "L050", &[], 0), None,
            "a debt from BEFORE the baton last moved was already settled by the row that moved it");
        assert_eq!(owed_refusal_text(Some(BATON), &marks_at(0, BATON + 5), "L050", &[], 0), None,
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
        assert_eq!(owed_refusal_text(None, &marks_at(BATON + 5, BATON + 5), "L050", &[], 0), None);
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

    // ── L065 D2: WHEN THE HOLDER IS THE LIBRARIAN ───────────────────────────────────────────────
    // Measured on 2026-09-20: the librarian took L060 at 02:16:13 (`--holder librarian`), and at
    // 02:17:26 mount C's call_librarian was refused OUT OF TURN while C was still appending to an
    // unfiled hand-back. The mark machinery was built for holder == chair. These pin what it does
    // when the holder is someone else, and the first two are FINDINGS pinned as tests, not repairs.

    /// THE DEBT IS CLEARED BY ANY ROW, not only by the row that lets the pane speak. The design says
    /// "the marks clear themselves the moment the recovery row lands"; the mechanism is
    /// `mark_at >= baton_at`, and EVERY baton row moves `baton_at`. Tonight the chair moved L060
    /// librarian -> chair at 02:17:37, eleven seconds after C's refusal: that row cleared the debt
    /// and did not open the panes. Pinned so the next reader does not have to rediscover it.
    #[test]
    fn any_baton_row_clears_the_debt_even_one_that_does_not_open_the_panes() {
        let owed = marks_at(BATON + 5, 0);
        assert!(owed_refusal_text(Some(BATON), &owed, "L060", &["chair".into()], 0).is_some(),
            "the debt stands while the baton has not moved past it");
        assert_eq!(owed_refusal_text(Some(BATON + 6), &owed, "L060", &["chair".into()], 0), None,
            "a LATER row clears the debt whatever it says — including librarian -> chair, which \
             leaves the owed pane exactly as unable to speak as before");
    }

    /// THE PANE-FACING TEXT CANNOT SEE THE HOLDER. Its only discriminator is the RUNG mark, and with
    /// one open lap a successful `chair_inject` requires holder == chair, so any RUNG mark
    /// necessarily predates the row that made the librarian the holder — the trap branch is
    /// unreachable in that shape and the pane is told "the loop comes back to you". That is what C
    /// and one sibling both repeated on the board at 02:17:3x.
    /// **If a later lap teaches this function the holder, change this test deliberately.**
    #[test]
    fn the_pane_facing_refusal_is_holder_blind_and_that_is_the_known_limit() {
        let src = std::fs::read_to_string("src/mcp.rs").expect("read own source").replace("\r\n", "\n");
        let f = src.split("fn handback_refusal_text(").nth(1).expect("moved — re-point this test");
        // The SIGNATURE, not the body: the body prints `--holder panes` inside the retake it hands the pane, so a
        // word-search there answers a different question (my first version of this test failed on exactly that).
        let params = f.split(')').next().unwrap_or(f);
        assert!(!params.contains("holder"), "this function decides on the RUNG mark alone; if it now takes the \
             holder, the L065 finding is fixed and this test should be rewritten to say so: {params}");
        // And the consequence, from the pure function: no mark combination the librarian's
        // possession can produce reaches the trap branch.
        let rung_before_the_row = handback_refusal_text(Some(BATON), &marks_at(0, BATON - 1), "L060");
        assert!(rung_before_the_row.contains("The loop comes back to you"),
            "a ring from the chair's possession is stale the moment the librarian's row lands");
    }

    /// THE QUANTITY TAKES MORE THAN ONE VALUE, checked before the finding above was claimed: with a
    /// SECOND open lap still held by the chair, `chair_inject` is legal (L040: any holder), so a
    /// RUNG mark CAN be stamped after the librarian's row and the trap branch does fire. The finding
    /// is about the one-lap shape, not about the holder being the librarian as such.
    #[test]
    fn with_a_second_lap_held_by_the_chair_the_trap_branch_is_reachable() {
        let t = handback_refusal_text(Some(BATON), &marks_at(0, BATON + 5), "L060");
        assert!(t.contains("NOT COMING BACK ON ITS OWN"),
            "a RUNG mark newer than the newest row reaches the trap branch whoever holds");
    }

    // ── the repair this lap makes: the chair-facing recovery stops asserting state it never read ──

    /// It said "because the baton is at the chair". It never read the holder — the argument was
    /// true of the state L050 was written in and asserted in every other.
    #[test]
    fn the_owed_refusal_says_where_the_baton_actually_is() {
        let t = owed_refusal_text(Some(BATON), &marks_at(BATON + 5, 0), "L060", &["librarian".into()], 0).unwrap();
        // The CLAUSE, not the word: "librarian" also occurs inside "call_librarian" two lines up, and a mutant that
        // put the asserted "chair" back survived this test until the assertion was tightened to the rendered clause.
        assert!(t.contains("the baton is at: librarian"), "the holder it read must appear: {t}");
        assert!(!t.contains("the baton is at: chair") && !t.contains("the baton is at: the chair"),
            "it must not name a holder it did not read: {t}");
    }

    #[test]
    fn a_ledger_that_names_no_holder_is_said_rather_than_guessed() {
        let t = owed_refusal_text(Some(BATON), &marks_at(BATON + 5, 0), "L060", &[], 0).unwrap();
        assert!(t.contains("no open lap names a holder"), "an unknown holder must be said: {t}");
    }

    /// The chair's `--by chair` row needs a ring since the baton moved; the pane's retake never
    /// does. The pane-facing text has carried both since L050 and this one carried only the first,
    /// so a chair whose `--by chair` row was refused had nothing else printed to try.
    #[test]
    fn the_owed_refusal_also_prints_the_retake_that_needs_no_ring() {
        let t = owed_refusal_text(Some(BATON), &marks_at(BATON + 5, 0), "L060", &["chair".into()], 0).unwrap();
        assert!(t.contains("--stage L060 working --holder panes --by panes"), "the retake: {t}");
        assert!(t.contains("RETAKE"), "and why it is legal: {t}");
    }

    /// L040's defect, in the one place its fix was not applied: this lap id is `chain_state().lap`,
    /// the NEWEST open lap, which under several open laps may be a lap the chair never rang on —
    /// and `--by chair` on that lap is refused by lap-row's own ring gate.
    #[test]
    fn the_owed_refusal_warns_when_the_lap_it_names_may_not_be_the_one_rung_on() {
        let many = owed_refusal_text(Some(BATON), &marks_at(BATON + 5, 0), "L060", &["chair".into()], 3).unwrap();
        assert!(many.contains("3 other"), "the reader must be told other laps are open: {many}");
        assert!(many.contains("NEWEST"), "and that this id is the newest row's lap: {many}");
        let one = owed_refusal_text(Some(BATON), &marks_at(BATON + 5, 0), "L060", &["chair".into()], 0).unwrap();
        assert!(!one.contains("NEWEST"), "with one open lap there is nothing to warn about: {one}");
    }

    /// Neither refusal may ever be a bare no. Both arms, checked together, so a future edit that
    /// keeps one and drops the other cannot pass.
    #[test]
    fn every_refusal_this_gate_adds_prints_a_runnable_command() {
        let mut checked = 0;
        for text in [
            owed_refusal_text(Some(BATON), &marks_at(BATON + 1, 0), "L049", &[], 0).unwrap(),
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

// ════════════════════════════════════════════════════════════════════════════════════════════════════
// THE SEAL GATE — P-SEAL-GATE build (lap D068, pane A, on D).
// Design: handback/p-seal-gate-A_2026-09-16.md (L062). Build, and its corrections to that design:
// handback/p-seal-gate-build-A_2026-09-16.md.
//
// A dispatch for a task that has an ANSWER KEY does not render into a pane until the row a scorer will judge
// it against is witnessed OFF this machine, and until the key cannot be found by the search the task asks
// for. Two incidents on 2026-09-16 are why: T3 dispatched with its key committed inside the search space
// (librarian/2026-09-16.md 04:22); T5 dispatched with its sealed row not on origin (05:10).
//
// WHAT IS ENFORCED, AND WHAT IS ONLY A SENTENCE. A DECLARED seal (`seal: "<row>#<task>"`) is checked hard,
// every check below. An UNDECLARED keyed task is caught only when a sealed row on disk names a path the
// dispatch points at. A keyed task with no row and no declaration PASSES: nothing in the text of a keyed
// dispatch marks it — the L062 keyword sniffer, measured on 40 full dispatches, caught 0 of the 3 real
// keyed tasks and fired on 5 ordinary ones, so it is not built.
// ════════════════════════════════════════════════════════════════════════════════════════════════════

/// One sealed task: a ```seal block, at column 0, in a row file under `exo_memory/loop/`.
///
/// The KEY's distinctive line and its question are NOT fields here. They live in the key file, off the
/// repo, and the gate reads them from `key-path`. A committed row that carried them would put the answer's
/// fingerprint inside the very search space the T3-KEY rule forbids — the L062 design made that mistake.
#[derive(Debug, Clone, PartialEq)]
struct SealBlock {
    task: String,
    key_path: String,
    /// `git hash-object --no-filters <key-path>`: the key cannot change after sealing without this failing.
    /// A git-blob id rather than sha256 because git is already this gate's one dependency and the crate has
    /// no sha256; the digest names its function, per `cards/every-digest-carries-its-function.md`.
    key_git_blob: String,
    object_path: String,
    subjects: String,
    /// the block's own lines, fences excluded — compared against the committed copy of the row
    raw: String,
}

const SEAL_FIELDS: [&str; 5] = ["task", "key-path", "key-git-blob", "object-path", "subjects"];
/// Shorter than this, a literal matches ordinary prose and the leak search means nothing.
const SEAL_MIN_LITERAL: usize = 12;
/// A fetch on a bad network can hang; the chair is told, not held.
const SEAL_FETCH_LIMIT: std::time::Duration = std::time::Duration::from_secs(30);
const SEAL_GIT_LIMIT: std::time::Duration = std::time::Duration::from_secs(20);
/// Files larger than this are not read by the leak search, and the refusal says a search is partial if so.
const SEAL_MAX_SCAN_BYTES: u64 = 8 * 1024 * 1024;

#[derive(Debug, PartialEq)]
enum SealVerdict {
    /// deliver; the line, if any, is posted to the board beside the delivery
    Allow(Option<String>),
    /// do not deliver; the whole text is returned to the chair and its first line posted
    Refuse(String),
}

#[derive(Debug, Clone)]
struct GitOut {
    code: i32,
    stdout: String,
}

/// Every ```seal block in a row file, validated before use: a missing, empty, duplicated or unknown field
/// refuses the whole file by field and line. A malformed row is a silent re-interpretation, not a typo.
fn parse_seal_blocks(md: &str) -> Result<Vec<SealBlock>, String> {
    let lines: Vec<&str> = md.split('\n').map(|l| l.trim_end_matches('\r')).collect();
    let mut out: Vec<SealBlock> = Vec::new();
    let mut i = 0;
    while i < lines.len() {
        if lines[i] != "```seal" {
            i += 1;
            continue;
        }
        let open = i + 1;
        let mut fields: Vec<(String, String)> = Vec::new();
        let mut raw: Vec<&str> = Vec::new();
        let mut closed = false;
        i += 1;
        while i < lines.len() {
            let l = lines[i];
            if l == "```" {
                closed = true;
                break;
            }
            raw.push(l);
            if !l.trim().is_empty() {
                let (k, v) = l
                    .split_once(':')
                    .ok_or_else(|| format!("seal block at line {open}: line {} is not `field: value`", i + 1))?;
                let k = k.trim().to_string();
                if !SEAL_FIELDS.contains(&k.as_str()) {
                    return Err(format!("seal block at line {open}: unknown field `{k}` at line {}", i + 1));
                }
                if fields.iter().any(|(f, _)| *f == k) {
                    return Err(format!("seal block at line {open}: field `{k}` appears twice"));
                }
                fields.push((k, v.trim().to_string()));
            }
            i += 1;
        }
        if !closed {
            return Err(format!("seal block at line {open} is never closed with ```"));
        }
        let get = |name: &str| -> Result<String, String> {
            match fields.iter().find(|(f, _)| f == name) {
                Some((_, v)) if !v.is_empty() => Ok(v.clone()),
                Some(_) => Err(format!("seal block at line {open}: field `{name}` is empty")),
                None => Err(format!("seal block at line {open}: field `{name}` is missing")),
            }
        };
        let task = get("task")?;
        let key_path = get("key-path")?;
        let blob = get("key-git-blob")?;
        let object_path = get("object-path")?;
        let subjects = get("subjects")?;
        if blob.len() != 40 || !blob.chars().all(|c| c.is_ascii_hexdigit()) {
            return Err(format!(
                "seal block at line {open}: `key-git-blob` must be the 40-hex id that `git hash-object --no-filters <key-path>` prints"
            ));
        }
        if out.iter().any(|b| b.task == task) {
            return Err(format!("seal block at line {open}: task `{task}` is sealed twice in this file"));
        }
        out.push(SealBlock {
            task,
            key_path,
            key_git_blob: blob.to_ascii_lowercase(),
            object_path,
            subjects,
            raw: raw.join("\n"),
        });
        i += 1;
    }
    Ok(out)
}

/// A path as the gate compares it: forward slashes, lower case, no doubled or trailing separator. Applied
/// identically to paths and to the dispatch text, so a Windows path written either way matches itself.
fn seal_norm(p: &str) -> String {
    let mut s = p.trim().replace('\\', "/").to_lowercase();
    while s.contains("//") {
        s = s.replace("//", "/");
    }
    s.trim_end_matches('/').to_string()
}

fn seal_dir(p: &str) -> String {
    let n = seal_norm(p);
    match n.rfind('/') {
        Some(i) => n[..i].to_string(),
        None => String::new(),
    }
}

fn seal_base(p: &str) -> String {
    seal_norm(p).rsplit('/').next().unwrap_or("").to_string()
}

/// The refusal. Every one names the row and the recovery, says which gate it is and that it is not the
/// baton's, and never carries the key's distinctive line, its question or any matched text — a refusal is
/// posted to the board, and a line quoting the key to explain that the key leaked IS the leak.
fn seal_refusal(head: &str, row: &str, detail: &str, recovery: &str) -> String {
    format!(
        "refused: {head} — the dispatch was not sent (posted to the board).\n  row     {row}\n  detail  {detail}\n{recovery}\n\
         This is NOT a turn problem: nothing here moves the baton, and nothing here tells you to. If the station \
         gate or the debt gate refuses your re-send, that is a different gate with its own recovery. Never printed \
         here: the key's distinctive line, its question, or any matched text."
    )
}

fn seal_recovery_push(row: &str) -> String {
    format!(
        "Recovery, in this order:\n  1  git commit -- {row}      (that path ONLY — a bare commit takes the shared index)\n  \
         2  git push                  (unattended only if that commit's diff is exactly this one row file: \
         brief/COMMITTEE.md, the seal-row exception)\n  3  re-send this dispatch unchanged, with the same `seal`"
    )
}

fn seal_recovery_fix_row(row: &str) -> String {
    format!(
        "Recovery: correct the ```seal block in {row}, then: git commit -- {row}, git push (the seal-row exception), and \
         re-send with the same `seal`."
    )
}

const SEAL_RECOVERY_LEAK: &str = "Recovery: move the key's text out of the search space and re-send. If the hits are in files \
     you cannot move — a committed plan, a map line, another seat's hand-back — THE QUESTION IS SPENT and no re-send fixes \
     it; T3 is the worked case (librarian/2026-09-16.md 04:22).";

/// The gate. `seal` is the chair's declaration; `git` runs one git command in the checkout. Pure apart from
/// reading the row, the key and the checkout's files: the tests drive it over real temporary repositories.
fn seal_gate(
    seal: Option<&str>,
    text: &str,
    repo: &std::path::Path,
    git: &mut dyn FnMut(&[&str]) -> Result<GitOut, String>,
) -> SealVerdict {
    match seal.map(str::trim) {
        None | Some("") => seal_undeclared(text, repo),
        Some(s) if s.eq_ignore_ascii_case("none") || s.to_ascii_lowercase().starts_with("none:") => {
            let reason = s.splitn(2, ':').nth(1).map(str::trim).unwrap_or("");
            if reason.is_empty() {
                SealVerdict::Refuse(seal_refusal(
                    "`seal: \"none\"` CARRIES NO REASON",
                    "(none declared)",
                    "an override with no reason is a silence on the board, and the override exists only to be read",
                    "Recovery: re-send with seal: \"none: <why this dispatch is not a keyed task>\".",
                ))
            } else {
                SealVerdict::Allow(Some(format!("SEAL NONE declared by the chair — reason: {reason}")))
            }
        }
        Some(s) => seal_declared(s, text, repo, git),
    }
}

/// No declaration. Reads the row files on disk — no git, so an ordinary dispatch costs no subprocess — and
/// refuses only when a sealed row names a path this dispatch points at. Fails OPEN when the rows cannot be
/// read: this half is an aid that catches a forgotten declaration, and an unreadable folder must not stop
/// every ordinary dispatch the chair sends.
fn seal_undeclared(text: &str, repo: &std::path::Path) -> SealVerdict {
    let hay = seal_norm(text);
    let dir = repo.join("exo_memory").join("loop");
    let Ok(rd) = std::fs::read_dir(&dir) else { return SealVerdict::Allow(None) };
    let mut rows: Vec<std::path::PathBuf> = rd
        .filter_map(|e| e.ok())
        .map(|e| e.path())
        .filter(|p| p.extension().map_or(false, |x| x == "md"))
        .collect();
    rows.sort();
    for p in rows {
        let Ok(md) = std::fs::read_to_string(&p) else { continue };
        if !md.contains("```seal") {
            continue;
        }
        let Ok(blocks) = parse_seal_blocks(&md) else { continue };
        let rel = format!("exo_memory/loop/{}", p.file_name().map(|f| f.to_string_lossy().into_owned()).unwrap_or_default());
        for b in blocks {
            for (kind, path) in [("object", &b.object_path), ("key", &b.key_path)] {
                let needle = seal_norm(path);
                if needle.len() >= SEAL_MIN_LITERAL && hay.contains(&needle) {
                    return SealVerdict::Refuse(seal_refusal(
                        "THIS DISPATCH POINTS AT A SEALED TASK AND DECLARES NO SEAL",
                        &rel,
                        &format!("the text names the {kind} path of sealed task `{}`", b.task),
                        &format!(
                            "Recovery: re-send with seal: \"{rel}#{}\" so the seal is checked, or with seal: \"none: <reason>\" — \
                             the reason is posted to the board.",
                            b.task
                        ),
                    ));
                }
            }
        }
    }
    SealVerdict::Allow(None)
}

fn seal_declared(
    decl: &str,
    text: &str,
    repo: &std::path::Path,
    git: &mut dyn FnMut(&[&str]) -> Result<GitOut, String>,
) -> SealVerdict {
    use SealVerdict::Refuse;
    let (rel_raw, want_task) = match decl.split_once('#') {
        Some((a, b)) => (a.trim(), Some(b.trim())),
        None => (decl.trim(), None),
    };
    let rel = rel_raw.replace('\\', "/");

    // G1 · the row is a row file, it is on disk, it parses, and it names one task.
    if !rel.starts_with("exo_memory/loop/") || !rel.ends_with(".md") || rel.split('/').any(|c| c == ".." || c.is_empty()) {
        return Refuse(seal_refusal(
            "THE SEAL DOES NOT NAME A ROW FILE",
            rel_raw,
            "`seal` is a repo-relative path under exo_memory/loop/ ending .md, optionally #<task>",
            "Recovery: re-send with seal: \"exo_memory/loop/<row>.md#<task>\".",
        ));
    }
    let md = match std::fs::read_to_string(repo.join(&rel)) {
        Ok(s) => s,
        Err(e) => {
            return Refuse(seal_refusal("THE SEALED ROW IS NOT ON DISK", &rel, &format!("it could not be read ({e})"), &seal_recovery_fix_row(&rel)))
        }
    };
    let blocks = match parse_seal_blocks(&md) {
        Ok(b) => b,
        Err(e) => return Refuse(seal_refusal("THE SEALED ROW DOES NOT PARSE", &rel, &e, &seal_recovery_fix_row(&rel))),
    };
    let tasks: Vec<&str> = blocks.iter().map(|b| b.task.as_str()).collect();
    let block = match want_task {
        _ if blocks.is_empty() => {
            return Refuse(seal_refusal("THE ROW HOLDS NO ```seal BLOCK", &rel, "no block at column 0", &seal_recovery_fix_row(&rel)))
        }
        Some(t) => match blocks.iter().find(|b| b.task == t) {
            Some(b) => b,
            None => {
                return Refuse(seal_refusal(
                    "THE ROW DOES NOT SEAL THAT TASK",
                    &rel,
                    &format!("`#{t}` was declared; the row seals {tasks:?}"),
                    &seal_recovery_fix_row(&rel),
                ))
            }
        },
        None if blocks.len() == 1 => &blocks[0],
        None => {
            return Refuse(seal_refusal(
                "THE ROW SEALS SEVERAL TASKS AND THE SEAL NAMES NONE",
                &rel,
                &format!("the row seals {tasks:?}"),
                &format!("Recovery: re-send with seal: \"{rel}#<task>\"."),
            ))
        }
    };
    let row_label = format!("{rel}#{}", block.task);

    // G2 · the row is committed, and committed AS IT STANDS: the block on disk is the block in that commit.
    let commit = match git(&["log", "-1", "--format=%H", "--", &rel]) {
        Ok(o) if o.code == 0 && o.stdout.trim().len() == 40 => o.stdout.trim().to_string(),
        Ok(_) => {
            return Refuse(seal_refusal("THE SEALED ROW IS NOT COMMITTED", &row_label, "no commit touches this path", &seal_recovery_push(&rel)))
        }
        Err(e) => return Refuse(seal_refusal("GIT COULD NOT BE ASKED ABOUT THE ROW", &row_label, &e, &seal_recovery_push(&rel))),
    };
    let committed = match git(&["show", &format!("{commit}:{rel}")]) {
        Ok(o) if o.code == 0 => o.stdout,
        Ok(_) | Err(_) => {
            return Refuse(seal_refusal("THE SEALED ROW IS NOT IN ITS OWN COMMIT", &row_label, &format!("git show {}:{rel} failed", &commit[..7]), &seal_recovery_push(&rel)))
        }
    };
    let same = parse_seal_blocks(&committed)
        .ok()
        .and_then(|bs| bs.into_iter().find(|b| b.task == block.task))
        .map_or(false, |b| b.raw == block.raw);
    if !same {
        return Refuse(seal_refusal(
            "THE SEAL WAS EDITED AFTER IT WAS COMMITTED",
            &row_label,
            &format!("the block on disk differs from the block at {}", &commit[..7]),
            &seal_recovery_push(&rel),
        ));
    }

    // G3 · ON ORIGIN, AT THE INSTANT OF THE CALL. Fetch first: a remote-tracking ref is a local cache, and a
    // commit origin no longer has still "contains" until a fetch says otherwise. Then ancestry, never a clock.
    let upstream = match git(&["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]) {
        Ok(o) if o.code == 0 && o.stdout.trim().contains('/') => o.stdout.trim().to_string(),
        _ => {
            return Refuse(seal_refusal(
                "THIS CHECKOUT HAS NO UPSTREAM",
                &row_label,
                "`@{upstream}` does not resolve, so there is no origin to certify the seal against",
                "Recovery: run the dispatch from a checkout on a branch that tracks origin.",
            ))
        }
    };
    let remote = upstream.split('/').next().unwrap_or("origin").to_string();
    match git(&["fetch", "--quiet", &remote]) {
        Ok(o) if o.code == 0 => {}
        Ok(o) => {
            return Refuse(seal_refusal(
                "COULD NOT REACH ORIGIN",
                &row_label,
                &format!("git fetch {remote} exited {} — a cached remote ref cannot certify a seal", o.code),
                "Recovery: re-send once origin is reachable. The seal is not checked against a stale ref, by design.",
            ))
        }
        Err(e) => {
            return Refuse(seal_refusal(
                "COULD NOT REACH ORIGIN",
                &row_label,
                &format!("{e} — a cached remote ref cannot certify a seal"),
                "Recovery: re-send once origin is reachable. The seal is not checked against a stale ref, by design.",
            ))
        }
    }
    match git(&["merge-base", "--is-ancestor", &commit, &upstream]) {
        Ok(o) if o.code == 0 => {}
        Ok(o) if o.code == 1 => {
            return Refuse(seal_refusal(
                "THE SEAL IS NOT ON ORIGIN",
                &row_label,
                &format!("{} is not an ancestor of {upstream} (checked after git fetch)", &commit[..7]),
                &seal_recovery_push(&rel),
            ))
        }
        other => {
            return Refuse(seal_refusal(
                "GIT COULD NOT SAY WHETHER THE SEAL IS ON ORIGIN",
                &row_label,
                &match other {
                    Ok(o) => format!("git merge-base --is-ancestor exited {}", o.code),
                    Err(e) => e,
                },
                &seal_recovery_push(&rel),
            ))
        }
    }

    // G4 · the key is on this machine, OUTSIDE the checkout, and unchanged since it was sealed.
    let key = std::path::Path::new(&block.key_path);
    if !key.is_file() {
        return Refuse(seal_refusal(
            "THE KEY IS NOT ON THIS MACHINE",
            &row_label,
            &format!("no file at key-path {}", block.key_path),
            "Recovery: dispatch from the machine that holds the key, or re-seal it here (a new key-git-blob, the row committed alone, pushed).",
        ));
    }
    let repo_n = seal_norm(&repo.to_string_lossy());
    let key_n = seal_norm(&block.key_path);
    if key_n == repo_n || key_n.starts_with(&format!("{repo_n}/")) {
        return Refuse(seal_refusal(
            "THE KEY IS INSIDE THE CHECKOUT",
            &row_label,
            &format!("key-path {} is under the repository the subjects search", block.key_path),
            SEAL_RECOVERY_LEAK,
        ));
    }
    match git(&["hash-object", "--no-filters", &block.key_path]) {
        Ok(o) if o.code == 0 && o.stdout.trim().eq_ignore_ascii_case(&block.key_git_blob) => {}
        Ok(o) if o.code == 0 => {
            return Refuse(seal_refusal(
                "THE KEY CHANGED SINCE IT WAS SEALED",
                &row_label,
                &format!("git-blob is {} on disk, {} in the row", o.stdout.trim().get(..7).unwrap_or("?"), &block.key_git_blob[..7]),
                "Recovery: if the change is legitimate, re-seal (a new key-git-blob, the row committed alone, pushed) BEFORE any subject has seen the task.",
            ))
        }
        _ => {
            return Refuse(seal_refusal("GIT COULD NOT HASH THE KEY", &row_label, &format!("git hash-object {}", block.key_path), "Recovery: check the key file is readable, then re-send."))
        }
    }

    // G5 · the key is not beside the object, and the dispatch does not name the key.
    let (key_dir, obj_dir) = (seal_dir(&block.key_path), seal_dir(&block.object_path));
    if key_dir == obj_dir || obj_dir.starts_with(&format!("{key_dir}/")) || key_dir.starts_with(&format!("{obj_dir}/")) {
        return Refuse(seal_refusal(
            "THE KEY SITS WHERE THE SUBJECTS ARE POINTED",
            &row_label,
            "key-path and object-path share a directory, so listing the object's folder shows the key (T5, librarian 05:10)",
            "Recovery: move the key to a directory the subjects are never pointed at, re-seal, and re-send.",
        ));
    }
    if seal_norm(text).contains(&key_n) {
        return Refuse(seal_refusal("THE DISPATCH NAMES THE KEY", &row_label, "the dispatch text contains key-path", "Recovery: take the key's path out of the dispatch and re-send."));
    }

    // G6 · the object is not one diff from a committed original.
    let tracked = match git(&["ls-files", "-z"]) {
        Ok(o) if o.code == 0 => o.stdout,
        _ => return Refuse(seal_refusal("GIT COULD NOT LIST THE CHECKOUT", &row_label, "git ls-files failed", "Recovery: re-send; if it repeats, the checkout is broken.")),
    };
    let base = seal_base(&block.object_path);
    let twins: Vec<&str> = tracked.split('\0').filter(|p| !p.is_empty() && seal_base(p) == base).take(3).collect();
    if !twins.is_empty() {
        return Refuse(seal_refusal(
            "THE OBJECT HAS A COMMITTED TWIN",
            &row_label,
            &format!("{base} is tracked at {twins:?} — a copy with planted defects is one diff from its original (T5)"),
            "Recovery: build the object from something that is not committed, or rename the copy and accept that a renamed copy is still one diff away — that part is a sentence, not a gate.",
        ));
    }

    // G7 · THE T3-KEY RULE: the key's distinctive lines and its question are absent from the search space —
    // tracked files and untracked files git does not ignore, which is what a subject's search reads.
    let key_text = match std::fs::read_to_string(key) {
        Ok(s) => s,
        Err(e) => return Refuse(seal_refusal("THE KEY COULD NOT BE READ", &row_label, &e.to_string(), "Recovery: check the key file, then re-send.")),
    };
    let mut literals: Vec<(&str, String)> = Vec::new();
    for l in key_text.lines() {
        let t = l.trim_start();
        for kind in ["DISTINCTIVE:", "QUESTION:"] {
            if let Some(v) = t.strip_prefix(kind) {
                literals.push((kind.trim_end_matches(':'), v.trim().to_string()));
            }
        }
    }
    for kind in ["DISTINCTIVE", "QUESTION"] {
        let n = literals.iter().filter(|(k, v)| *k == kind && v.chars().count() >= SEAL_MIN_LITERAL).count();
        if n == 0 {
            return Refuse(seal_refusal(
                &format!("THE KEY CARRIES NO {kind} LINE"),
                &row_label,
                &format!("the leak search needs at least one `{kind}: <literal>` line of {SEAL_MIN_LITERAL}+ characters in the key file"),
                "Recovery: add the line to the key, re-seal (the git-blob changes), and re-send.",
            ));
        }
    }
    let untracked = match git(&["ls-files", "-z", "--others", "--exclude-standard"]) {
        Ok(o) if o.code == 0 => o.stdout,
        _ => return Refuse(seal_refusal("GIT COULD NOT LIST UNTRACKED FILES", &row_label, "git ls-files --others failed", "Recovery: re-send; if it repeats, the checkout is broken.")),
    };
    let mut hits: Vec<String> = Vec::new();
    let mut skipped = 0usize;
    for rel_path in tracked.split('\0').chain(untracked.split('\0')).filter(|p| !p.is_empty()) {
        let full = repo.join(rel_path);
        match std::fs::metadata(&full) {
            Ok(m) if m.len() <= SEAL_MAX_SCAN_BYTES => {}
            Ok(_) => {
                skipped += 1;
                continue;
            }
            Err(_) => continue,
        }
        let Ok(bytes) = std::fs::read(&full) else { continue };
        let body = String::from_utf8_lossy(&bytes);
        for (n, line) in body.lines().enumerate() {
            for (kind, lit) in &literals {
                if lit.chars().count() >= SEAL_MIN_LITERAL && line.contains(lit.as_str()) {
                    hits.push(format!("{rel_path}:{} ({})", n + 1, kind.to_lowercase()));
                }
            }
        }
    }
    if !hits.is_empty() {
        hits.sort();
        hits.dedup();
        let shown: Vec<&String> = hits.iter().take(10).collect();
        return Refuse(seal_refusal(
            "THE KEY IS READABLE INSIDE THE SEARCH SPACE",
            &row_label,
            &format!("{} hit(s): {shown:?}{}", hits.len(), if hits.len() > 10 { " …" } else { "" }),
            SEAL_RECOVERY_LEAK,
        ));
    }

    let touched = git(&["show", "--name-only", "--format=", &commit])
        .ok()
        .filter(|o| o.code == 0)
        .map(|o| o.stdout.lines().filter(|l| !l.trim().is_empty()).count());
    SealVerdict::Allow(Some(format!(
        "SEAL VERIFIED — {row_label}, sealed at {} ({}), key git-blob {}, on {upstream} after fetch; subjects {}{}",
        &commit[..7],
        match touched {
            Some(1) => "that commit touched exactly this one file".to_string(),
            Some(n) => format!("that commit touched {n} files — NOT the seal-row push exception if it was pushed unattended"),
            None => "its file count could not be read".to_string(),
        },
        &block.key_git_blob[..7],
        block.subjects,
        if skipped > 0 { format!("; {skipped} file(s) over 8 MB were not searched") } else { String::new() },
    )))
}

/// One bounded subprocess. Stdout is drained on its own thread: a child that fills the pipe while we only
/// poll for its exit would block forever and read as a hang.
fn run_bounded(program: &str, args: &[&str], cwd: Option<&std::path::Path>, limit: std::time::Duration) -> Result<GitOut, String> {
    use std::io::Read;
    use std::process::{Command, Stdio};
    let mut cmd = Command::new(program);
    cmd.args(args).stdin(Stdio::null()).stdout(Stdio::piped()).stderr(Stdio::null());
    if let Some(d) = cwd {
        cmd.current_dir(d);
    }
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(crate::NO_WINDOW);
    }
    let mut child = cmd.spawn().map_err(|e| format!("{program} could not be started ({e})"))?;
    let mut pipe = child.stdout.take();
    let reader = std::thread::spawn(move || {
        let mut buf = Vec::new();
        if let Some(p) = pipe.as_mut() {
            let _ = p.read_to_end(&mut buf);
        }
        buf
    });
    let deadline = std::time::Instant::now() + limit;
    let status = loop {
        match child.try_wait() {
            Ok(Some(s)) => break s,
            Ok(None) if std::time::Instant::now() < deadline => std::thread::sleep(std::time::Duration::from_millis(25)),
            Ok(None) => {
                let _ = child.kill();
                let _ = child.wait();
                return Err(format!("{program} {} did not finish within {} s", args.first().copied().unwrap_or(""), limit.as_secs()));
            }
            Err(e) => return Err(format!("{program} could not be waited on ({e})")),
        }
    };
    let out = reader.join().unwrap_or_default();
    Ok(GitOut { code: status.code().unwrap_or(-1), stdout: String::from_utf8_lossy(&out).into_owned() })
}

/// The real git runner for one checkout: `git -C <repo> …`, the fetch bounded longer than the rest.
fn run_git_for_seal(repo: &std::path::Path, args: &[&str]) -> Result<GitOut, String> {
    let limit = if args.first() == Some(&"fetch") { SEAL_FETCH_LIMIT } else { SEAL_GIT_LIMIT };
    let repo_s = repo.to_string_lossy().into_owned();
    let mut full: Vec<&str> = vec!["-C", repo_s.as_str()];
    full.extend_from_slice(args);
    run_bounded("git", &full, None, limit)
}

/// The gate as `chair_inject` calls it. No checkout: a declared seal cannot be checked and is refused; an
/// undeclared dispatch has nothing to be looked up against and goes.
fn seal_gate_at(seal: Option<&str>, text: &str, repo: Option<&std::path::Path>) -> SealVerdict {
    match repo {
        Some(r) => {
            let root = r.to_path_buf();
            let mut git = |a: &[&str]| run_git_for_seal(&root, a);
            seal_gate(seal, text, r, &mut git)
        }
        // Undeclared with no checkout: nothing to look up against. Never a relative scan of whatever the app's
        // working directory happens to be.
        None if seal.map_or(true, |s| s.trim().is_empty()) => SealVerdict::Allow(None),
        // "none: <reason>" is decided without the checkout; seal_gate's none arm never reads `repo`.
        None if seal.map_or(false, |s| s.trim().to_ascii_lowercase().starts_with("none")) => {
            seal_gate(seal, text, std::path::Path::new(""), &mut |_| Err("no checkout".to_string()))
        }
        None => SealVerdict::Refuse(seal_refusal(
            "NO CHECKOUT TO CHECK THE SEAL IN",
            seal.unwrap_or(""),
            "repo_root() does not resolve on this machine",
            "Recovery: dispatch from a machine whose ~/.consonance.json room_path points at the checkout.",
        )),
    }
}

/// THE SEAL GATE'S FIXTURES. Every case builds a real repository in the temp dir with a real bare `origin`,
/// commits and pushes (or does not), and runs the gate with the real git runner — nothing in the checkout
/// is read or written. Needs `git` on PATH.
#[cfg(test)]
mod seal_gate_tests {
    use super::*;
    use std::path::{Path, PathBuf};
    use std::process::Command;

    const DISTINCTIVE: &str = "the planted inversion sits at claim fourteen of eighteen";
    const QUESTION: &str = "which of these eighteen numbered claims are false";

    fn git(dir: &Path, args: &[&str]) -> String {
        let o = Command::new("git").arg("-C").arg(dir).args(args).output().expect("git on PATH");
        assert!(o.status.success(), "fixture git {args:?} failed: {}", String::from_utf8_lossy(&o.stderr));
        String::from_utf8_lossy(&o.stdout).trim().to_string()
    }

    struct Fx {
        base: PathBuf,
        origin: PathBuf,
        work: PathBuf,
        keys: PathBuf,
        objs: PathBuf,
    }

    impl Fx {
        fn new(name: &str) -> Fx {
            let base = std::env::temp_dir().join(format!("seal-gate-{name}-{}-{}", std::process::id(), now_ms()));
            let (origin, work, keys, objs) = (base.join("origin.git"), base.join("work"), base.join("keys"), base.join("objs"));
            for d in [&origin, &work, &keys, &objs] {
                std::fs::create_dir_all(d).unwrap();
            }
            git(&origin, &["init", "--quiet", "--bare", "-b", "main"]);
            git(&work, &["init", "--quiet", "-b", "main"]);
            for (k, v) in [("user.email", "fixture@seal.gate"), ("user.name", "fixture"), ("core.autocrlf", "false")] {
                git(&work, &["config", k, v]);
            }
            git(&work, &["remote", "add", "origin", &origin.to_string_lossy()]);
            std::fs::create_dir_all(work.join("exo_memory").join("loop")).unwrap();
            std::fs::write(work.join("README.md"), "fixture repository\n").unwrap();
            git(&work, &["add", "README.md"]);
            git(&work, &["commit", "--quiet", "-m", "seed"]);
            git(&work, &["push", "--quiet", "-u", "origin", "main"]);
            Fx { base, origin, work, keys, objs }
        }
        fn key(&self, body: &str) -> (PathBuf, String) {
            let p = self.keys.join("T9_key.md");
            std::fs::write(&p, body).unwrap();
            let blob = git(&self.work, &["hash-object", "--no-filters", &p.to_string_lossy()]);
            (p, blob)
        }
        fn object(&self, dir: &Path, name: &str) -> PathBuf {
            let p = dir.join(name);
            std::fs::write(&p, "the object the subjects are pointed at\n").unwrap();
            p
        }
        fn write_row(&self, body: &str) -> String {
            let rel = "exo_memory/loop/t9_sealed_row.md";
            std::fs::write(self.work.join(rel), format!("# T9, the sealed row\n\n{body}")).unwrap();
            rel.to_string()
        }
        fn commit(&self, rel: &str) -> String {
            git(&self.work, &["add", rel]);
            git(&self.work, &["commit", "--quiet", "-m", "seal", "--", rel]);
            git(&self.work, &["rev-parse", "HEAD"])
        }
        fn push(&self) {
            git(&self.work, &["push", "--quiet", "origin", "main"]);
        }
        fn gate(&self, seal: Option<&str>, text: &str) -> SealVerdict {
            let work = self.work.clone();
            let mut run = |a: &[&str]| run_git_for_seal(&work, a);
            seal_gate(seal, text, &self.work, &mut run)
        }
    }

    impl Drop for Fx {
        fn drop(&mut self) {
            let _ = std::fs::remove_dir_all(&self.base);
        }
    }

    fn block(task: &str, key: &Path, blob: &str, obj: &Path) -> String {
        format!(
            "```seal\ntask:         {task}\nkey-path:     {}\nkey-git-blob: {blob}\nobject-path:  {}\nsubjects:     A, C, E\n```\n",
            key.display(),
            obj.display()
        )
    }

    fn key_body() -> String {
        format!("# T9 key\nDISTINCTIVE: {DISTINCTIVE}\nQUESTION: {QUESTION}\n1. claim fourteen is inverted\n")
    }

    /// A fully sealed task: key off the repo, object in its own directory, row committed and pushed.
    fn sealed(name: &str) -> (Fx, String, PathBuf, PathBuf) {
        let fx = Fx::new(name);
        let (key, blob) = fx.key(&key_body());
        let obj = fx.object(&fx.objs, "T9_text.md");
        let rel = fx.write_row(&block("T9", &key, &blob, &obj));
        fx.commit(&rel);
        fx.push();
        (fx, rel, key, obj)
    }

    const DISPATCH: &str = "[chair] a draft note sits in a scratch directory; say which claims are wrong.";

    /// Every refusal, checked for the two properties that hold for ALL of them: it never carries the key's
    /// text (G9 — the board is readable by every pane), and it never sends the chair to the baton, which is
    /// the station gate's recovery and the collision that deadlocked the loop for twelve minutes.
    fn refused(v: SealVerdict, head: &str) -> String {
        let SealVerdict::Refuse(msg) = v else { panic!("expected a refusal containing {head:?}, got {v:?}") };
        assert!(msg.contains(head), "refusal should say {head:?}:\n{msg}");
        assert!(!msg.contains(DISTINCTIVE) && !msg.contains(QUESTION), "a refusal printed the key's text:\n{msg}");
        assert!(!msg.contains("lap-row.js"), "a seal refusal must not name the baton's recovery:\n{msg}");
        assert!(msg.contains("NOT a turn problem"), "every seal refusal says which gate it is not:\n{msg}");
        assert!(msg.contains("Recovery"), "every refusal names its recovery:\n{msg}");
        msg
    }

    fn allowed(v: SealVerdict) -> Option<String> {
        match v {
            SealVerdict::Allow(line) => line,
            SealVerdict::Refuse(m) => panic!("expected the dispatch to be allowed, got:\n{m}"),
        }
    }

    // ── F1 · the happy path ────────────────────────────────────────────────────────────────────────────

    #[test]
    fn f1_a_row_committed_and_pushed_with_the_key_off_the_repo_is_allowed_and_audited() {
        let (fx, rel, _, _) = sealed("f1");
        let line = allowed(fx.gate(Some(&format!("{rel}#T9")), DISPATCH)).expect("a verified seal writes an audit line");
        assert!(line.starts_with("SEAL VERIFIED"), "{line}");
        assert!(line.contains("that commit touched exactly this one file"), "the exception's shape is reported: {line}");
    }

    /// The push exception's one enforceable aid. The gate cannot see who pushed; it CAN say that the sealing commit
    /// carried more than the row, which is the shape the keeper's exception excludes.
    #[test]
    fn f1b_a_seal_committed_beside_another_file_is_allowed_but_reported_as_not_the_push_exception() {
        let fx = Fx::new("f1b");
        let (key, blob) = fx.key(&key_body());
        let obj = fx.object(&fx.objs, "T9_text.md");
        let rel = fx.write_row(&block("T9", &key, &blob, &obj));
        std::fs::write(fx.work.join("exo_memory").join("loop").join("a_map_line.md"), "a second file in the same commit\n").unwrap();
        git(&fx.work, &["add", &rel, "exo_memory/loop/a_map_line.md"]);
        git(&fx.work, &["commit", "--quiet", "-m", "seal and something else"]);
        fx.push();
        let line = allowed(fx.gate(Some(&rel), DISPATCH)).expect("audited");
        assert!(line.contains("touched 2 files") && line.contains("NOT the seal-row push exception"), "{line}");
    }

    // ── the undeclared half ────────────────────────────────────────────────────────────────────────────

    #[test]
    fn f2_an_undeclared_dispatch_naming_a_sealed_object_is_refused_by_row_and_task() {
        let (fx, rel, _, obj) = sealed("f2");
        let text = format!("look at the draft in {} and say what is wrong", obj.display());
        let msg = refused(fx.gate(None, &text), "POINTS AT A SEALED TASK AND DECLARES NO SEAL");
        assert!(msg.contains(&format!("{rel}#T9")), "{msg}");
    }

    #[test]
    fn f2b_an_ordinary_undeclared_dispatch_is_allowed_and_runs_no_git_at_all() {
        let (fx, _, _, _) = sealed("f2b");
        let mut calls = 0;
        let v = seal_gate(None, DISPATCH, &fx.work, &mut |_| {
            calls += 1;
            Err("unreachable".into())
        });
        assert_eq!(v, SealVerdict::Allow(None));
        assert_eq!(calls, 0, "an ordinary dispatch must cost no subprocess");
    }

    #[test]
    fn f2c_the_undeclared_match_survives_slash_and_case_differences() {
        let (fx, _, _, obj) = sealed("f2c");
        let text = obj.display().to_string().replace('\\', "/").to_uppercase();
        refused(fx.gate(None, &text), "DECLARES NO SEAL");
    }

    // ── the declaration and the row (G1) ───────────────────────────────────────────────────────────────

    #[test]
    fn f3_a_seal_naming_a_row_that_is_not_on_disk_is_refused_naming_the_path() {
        let (fx, _, _, _) = sealed("f3");
        let msg = refused(fx.gate(Some("exo_memory/loop/no_such_row.md#T9"), DISPATCH), "THE SEALED ROW IS NOT ON DISK");
        assert!(msg.contains("exo_memory/loop/no_such_row.md"), "{msg}");
    }

    #[test]
    fn f4_a_block_missing_a_field_is_refused_naming_the_field() {
        let fx = Fx::new("f4");
        let (key, blob) = fx.key(&key_body());
        let obj = fx.object(&fx.objs, "T9_text.md");
        let broken = block("T9", &key, &blob, &obj).replace("subjects:     A, C, E\n", "");
        let rel = fx.write_row(&broken);
        let msg = refused(fx.gate(Some(&rel), DISPATCH), "THE SEALED ROW DOES NOT PARSE");
        assert!(msg.contains("`subjects` is missing"), "{msg}");
    }

    #[test]
    fn f4b_a_seal_outside_exo_memory_loop_or_climbing_out_of_it_is_refused() {
        let (fx, _, _, _) = sealed("f4b");
        for bad in ["README.md", "exo_memory/loop/../../README.md", "exo_memory/handback/x.md#T9"] {
            refused(fx.gate(Some(bad), DISPATCH), "THE SEAL DOES NOT NAME A ROW FILE");
        }
    }

    #[test]
    fn f4c_a_row_sealing_several_tasks_needs_the_task_named() {
        let fx = Fx::new("f4c");
        let (key, blob) = fx.key(&key_body());
        let (o1, o2) = (fx.object(&fx.objs, "T9_text.md"), fx.object(&fx.objs, "T8_text.md"));
        let rel = fx.write_row(&format!("{}\n{}", block("T9", &key, &blob, &o1), block("T8", &key, &blob, &o2)));
        let msg = refused(fx.gate(Some(&rel), DISPATCH), "SEALS SEVERAL TASKS");
        assert!(msg.contains("T8") && msg.contains("T9"), "{msg}");
    }

    // ── committed, as it stands (G2) ───────────────────────────────────────────────────────────────────

    #[test]
    fn f5_a_row_that_was_never_committed_is_refused() {
        let fx = Fx::new("f5");
        let (key, blob) = fx.key(&key_body());
        let obj = fx.object(&fx.objs, "T9_text.md");
        let rel = fx.write_row(&block("T9", &key, &blob, &obj));
        refused(fx.gate(Some(&rel), DISPATCH), "THE SEALED ROW IS NOT COMMITTED");
    }

    #[test]
    fn f7_a_block_edited_after_its_commit_is_refused() {
        let (fx, rel, key, obj) = sealed("f7");
        let blob = git(&fx.work, &["hash-object", "--no-filters", &key.to_string_lossy()]);
        let edited = block("T9", &key, &blob, &obj).replace("A, C, E", "A, B, C, E");
        fx.write_row(&edited);
        refused(fx.gate(Some(&rel), DISPATCH), "EDITED AFTER IT WAS COMMITTED");
    }

    // ── on origin, at the instant (G3) ─────────────────────────────────────────────────────────────────

    #[test]
    fn f6_a_row_committed_locally_and_never_pushed_is_refused_t5s_defect() {
        let fx = Fx::new("f6");
        let (key, blob) = fx.key(&key_body());
        let obj = fx.object(&fx.objs, "T9_text.md");
        let rel = fx.write_row(&block("T9", &key, &blob, &obj));
        fx.commit(&rel);
        let msg = refused(fx.gate(Some(&rel), DISPATCH), "THE SEAL IS NOT ON ORIGIN");
        assert!(msg.contains("git commit -- exo_memory/loop/t9_sealed_row.md"), "the recovery names the one path: {msg}");
    }

    /// THE DISCRIMINATING ONE. After origin is force-pushed past the seal, this checkout's origin/main still
    /// holds it until a fetch — so `git branch -r --contains`, the L062 packet's own command, still says yes.
    #[test]
    fn f6b_a_seal_origin_no_longer_has_is_refused_even_while_the_cached_ref_still_contains_it() {
        let (fx, rel, _, _) = sealed("f6b");
        let seal_commit = git(&fx.work, &["log", "-1", "--format=%H", "--", &rel]);
        let other = fx.base.join("other");
        let o = Command::new("git").args(["clone", "--quiet"]).arg(&fx.origin).arg(&other).output().unwrap();
        assert!(o.status.success());
        git(&other, &["reset", "--quiet", "--hard", "HEAD~1"]);
        git(&other, &["push", "--quiet", "--force", "origin", "main"]);
        let cached = git(&fx.work, &["branch", "-r", "--contains", &seal_commit]);
        assert!(cached.contains("origin/main"), "precondition: the cached ref still contains the seal ({cached:?})");
        refused(fx.gate(Some(&rel), DISPATCH), "THE SEAL IS NOT ON ORIGIN");
    }

    #[test]
    fn f15_an_unreachable_origin_is_refused_and_never_falls_back_to_the_cached_ref() {
        let (fx, rel, _, _) = sealed("f15");
        std::fs::rename(&fx.origin, fx.base.join("origin-gone.git")).unwrap();
        refused(fx.gate(Some(&rel), DISPATCH), "COULD NOT REACH ORIGIN");
    }

    // ── the key (G4) ───────────────────────────────────────────────────────────────────────────────────

    #[test]
    fn f7b_a_key_changed_since_it_was_sealed_is_refused() {
        let (fx, rel, key, _) = sealed("f7b");
        std::fs::write(&key, format!("{}2. and a new line after the seal\n", key_body())).unwrap();
        refused(fx.gate(Some(&rel), DISPATCH), "THE KEY CHANGED SINCE IT WAS SEALED");
    }

    #[test]
    fn f7c_a_key_that_is_not_on_this_machine_is_refused() {
        let (fx, rel, key, _) = sealed("f7c");
        std::fs::remove_file(&key).unwrap();
        refused(fx.gate(Some(&rel), DISPATCH), "THE KEY IS NOT ON THIS MACHINE");
    }

    #[test]
    fn f7d_a_key_inside_the_checkout_is_refused_t3s_defect() {
        let fx = Fx::new("f7d");
        let key = fx.work.join("T9_key.md");
        std::fs::write(&key, key_body()).unwrap();
        let blob = git(&fx.work, &["hash-object", "--no-filters", &key.to_string_lossy()]);
        let obj = fx.object(&fx.objs, "T9_text.md");
        let rel = fx.write_row(&block("T9", &key, &blob, &obj));
        fx.commit(&rel);
        fx.push();
        refused(fx.gate(Some(&rel), DISPATCH), "THE KEY IS INSIDE THE CHECKOUT");
    }

    #[test]
    fn f18_a_key_with_no_distinctive_line_cannot_be_leak_checked_and_is_refused() {
        let fx = Fx::new("f18");
        let (key, blob) = fx.key(&format!("# T9 key\nQUESTION: {QUESTION}\n"));
        let obj = fx.object(&fx.objs, "T9_text.md");
        let rel = fx.write_row(&block("T9", &key, &blob, &obj));
        fx.commit(&rel);
        fx.push();
        refused(fx.gate(Some(&rel), DISPATCH), "THE KEY CARRIES NO DISTINCTIVE LINE");
    }

    // ── where the subjects are pointed (G5, G6) ────────────────────────────────────────────────────────

    #[test]
    fn f11_a_key_in_the_objects_directory_is_refused_t5s_exposure() {
        let fx = Fx::new("f11");
        let (key, blob) = fx.key(&key_body());
        let obj = fx.object(&fx.keys, "T9_text.md");
        let rel = fx.write_row(&block("T9", &key, &blob, &obj));
        fx.commit(&rel);
        fx.push();
        refused(fx.gate(Some(&rel), DISPATCH), "THE KEY SITS WHERE THE SUBJECTS ARE POINTED");
    }

    #[test]
    fn f11b_a_dispatch_that_names_the_key_path_is_refused() {
        let (fx, rel, key, _) = sealed("f11b");
        let text = format!("the answer is at {} — do not open it", key.display());
        refused(fx.gate(Some(&rel), &text), "THE DISPATCH NAMES THE KEY");
    }

    #[test]
    fn f12_an_object_whose_name_is_tracked_is_refused_t5s_diff() {
        let fx = Fx::new("f12");
        std::fs::write(fx.work.join("ferry.js"), "// the committed original\n").unwrap();
        git(&fx.work, &["add", "ferry.js"]);
        git(&fx.work, &["commit", "--quiet", "-m", "original"]);
        let (key, blob) = fx.key(&key_body());
        let obj = fx.object(&fx.objs, "ferry.js");
        let rel = fx.write_row(&block("T9", &key, &blob, &obj));
        fx.commit(&rel);
        fx.push();
        let msg = refused(fx.gate(Some(&rel), DISPATCH), "THE OBJECT HAS A COMMITTED TWIN");
        assert!(msg.contains("ferry.js"), "{msg}");
    }

    // ── the T3-KEY rule (G7) ───────────────────────────────────────────────────────────────────────────

    #[test]
    fn f8_the_distinctive_line_in_a_tracked_file_is_refused_by_file_and_line_never_by_text_t3s_defect() {
        let (fx, rel, _, _) = sealed("f8");
        std::fs::write(fx.work.join("plan.md"), format!("line one\nline two\n{DISTINCTIVE}\n")).unwrap();
        git(&fx.work, &["add", "plan.md"]);
        git(&fx.work, &["commit", "--quiet", "-m", "a plan that quotes the key"]);
        let msg = refused(fx.gate(Some(&rel), DISPATCH), "THE KEY IS READABLE INSIDE THE SEARCH SPACE");
        assert!(msg.contains("plan.md:3 (distinctive)"), "file, line and kind are named: {msg}");
    }

    #[test]
    fn f9_the_distinctive_line_in_an_untracked_file_is_refused_too() {
        let (fx, rel, _, _) = sealed("f9");
        std::fs::write(fx.work.join("scratch_notes.md"), format!("{DISTINCTIVE}\n")).unwrap();
        let msg = refused(fx.gate(Some(&rel), DISPATCH), "READABLE INSIDE THE SEARCH SPACE");
        assert!(msg.contains("scratch_notes.md:1"), "{msg}");
    }

    #[test]
    fn f9b_an_ignored_file_is_not_the_search_space() {
        let (fx, rel, _, _) = sealed("f9b");
        std::fs::write(fx.work.join(".gitignore"), "ignored_notes.md\n").unwrap();
        git(&fx.work, &["add", ".gitignore"]);
        git(&fx.work, &["commit", "--quiet", "-m", "ignore"]);
        std::fs::write(fx.work.join("ignored_notes.md"), format!("{DISTINCTIVE}\n")).unwrap();
        allowed(fx.gate(Some(&rel), DISPATCH));
    }

    #[test]
    fn f10_the_question_in_the_checkout_is_refused() {
        let (fx, rel, _, _) = sealed("f10");
        std::fs::write(fx.work.join("brief.md"), format!("Q: {QUESTION}\n")).unwrap();
        let msg = refused(fx.gate(Some(&rel), DISPATCH), "READABLE INSIDE THE SEARCH SPACE");
        assert!(msg.contains("brief.md:1 (question)"), "{msg}");
    }

    // ── the override ───────────────────────────────────────────────────────────────────────────────────

    #[test]
    fn f13_seal_none_with_a_reason_is_allowed_and_the_reason_is_what_gets_posted() {
        let (fx, _, _, obj) = sealed("f13");
        let text = format!("fix the formatting of {}", obj.display());
        let line = allowed(fx.gate(Some("none: a typo fix to the object, not the task"), &text)).expect("audited");
        assert!(line.contains("a typo fix to the object, not the task"), "{line}");
    }

    #[test]
    fn f14_seal_none_without_a_reason_is_refused() {
        let (fx, _, _, _) = sealed("f14");
        for bare in ["none", "none:", "NONE:   "] {
            refused(fx.gate(Some(bare), DISPATCH), "CARRIES NO REASON");
        }
    }

    // ── the runner and the wiring ──────────────────────────────────────────────────────────────────────

    #[cfg(windows)]
    #[test]
    fn a_subprocess_past_its_limit_is_killed_and_reported_not_waited_on() {
        let t0 = std::time::Instant::now();
        let r = run_bounded("ping", &["-n", "30", "127.0.0.1"], None, std::time::Duration::from_secs(1));
        assert!(r.is_err(), "a hang must come back as an error: {r:?}");
        assert!(t0.elapsed() < std::time::Duration::from_secs(10), "and promptly, not after the child ends");
    }

    #[test]
    fn no_checkout_refuses_a_declared_seal_and_lets_an_ordinary_dispatch_go() {
        assert_eq!(seal_gate_at(None, DISPATCH, None), SealVerdict::Allow(None));
        refused(seal_gate_at(Some("exo_memory/loop/x.md#T9"), DISPATCH, None), "NO CHECKOUT TO CHECK THE SEAL IN");
    }

    /// WHERE IT RUNS, pinned by ORDER rather than by presence: after the station and debt gates, before the
    /// actuator is asked to deliver anything.
    #[test]
    fn chair_inject_runs_the_seal_gate_after_the_debt_gate_and_before_anything_is_sent() {
        let src = std::fs::read_to_string("src/mcp.rs").expect("read own source").replace("\r\n", "\n");
        let body = src.split("async fn chair_inject(").nth(1).expect("chair_inject moved");
        let body = body.split("\n    }\n").next().unwrap();
        let debt = body.find("self.owed_handback_refusal()").expect("the debt gate");
        let seal = body.find("seal_gate_at(").expect("the seal gate is not called from chair_inject");
        let send = body.find("self.send_chair(").expect("the delivery");
        assert!(debt < seal && seal < send, "order must be debt gate < seal gate < delivery");
    }
}

// ── THE DIGEST IS THE RING'S, OR IT IS NOT SAID (P-DIGEST-AT-RING, L061 packet 3) ────────────────────────────────
// MEASURED CAUSE: a pane computes its hand-back's digest, keeps writing, and rings. C's first ring matched its file
// exactly; C's second quoted a digest for 529 lines while 42 more had landed three seconds earlier. A digest that is
// SOMETIMES right is worse than none, because the one that matched teaches the next reader to trust the next one.
//
// So the pane's digest is never carried. It is stripped, and the ring computes its own from the file the pointer
// names, at the moment the ring fires. WHICH DIGEST: a git-blob id, on this file's own precedent for the seal gate's
// key (`:1762-1764` — git is already this gate's one dependency and the crate has no sha256), and the line says
// `git-blob` so it is never read as a sha256. The cost of that choice, named rather than hidden: a pane-supplied
// sha256 cannot be COMPARED against a git-blob, so it is removed rather than caught.
//
// WHAT REFUSES AND WHAT ONLY MARKS. A pointer naming no readable file is REFUSED with the path in the refusal — the
// hand-back does not exist, so there is nothing to deliver and the pane must be told which path came back empty. But
// this verb is the one that loses work when it refuses (D069's reason, and D077's), so a machine with no checkout, a
// git that cannot run, and a call carrying no pointer at all are MARKED and delivered, never refused. In every one of
// those the reader still sees no digest rather than an unchecked one, which is the whole point.
const DIGEST_MARK: &str = "digest at ring";

struct DigestDeliver {
    text: String,
    audit: Option<String>,
}

enum DigestVerdict {
    Deliver(DigestDeliver),
    Refuse(String),
}

/// The first repo-relative `*.md` token in the call — the pointer this verb exists to carry. Surrounding punctuation is
/// trimmed, because rings write `at exo_memory/handback/x.md (uncommitted;` and the path is the token, not the prose.
fn pointer_in(text: &str) -> Option<String> {
    text.split_whitespace()
        .map(|t| t.trim_matches(|c: char| !c.is_ascii_alphanumeric() && c != '/' && c != '.' && c != '_' && c != '-'))
        .find(|t| {
            let low = t.to_ascii_lowercase();
            low.ends_with(".md") && t.contains('/') && !low.contains("://")
        })
        .map(|t| t.to_string())
}

/// Remove every digest the PANE supplied, and say how many were removed. A digest word (`sha256`, `sha-256`, `sha1`,
/// `git-blob`) takes its following hex token with it, so a stale value cannot survive as a bare 64-hex string.
fn strip_supplied_digests(text: &str) -> (String, usize) {
    const WORDS: [&str; 4] = ["sha256", "sha-256", "sha1", "git-blob"];
    let hexish = |t: &str| {
        let core = t.trim_matches(|c: char| !c.is_ascii_alphanumeric());
        core.len() >= 7 && core.chars().all(|c| c.is_ascii_hexdigit())
    };
    let mut removed = 0;
    let mut out: Vec<String> = Vec::new();
    for line in text.replace("\r\n", "\n").split('\n') {
        let low = line.to_ascii_lowercase();
        if !WORDS.iter().any(|w| low.contains(w)) {
            out.push(line.to_string());
            continue;
        }
        // Only a line that names a digest is rewritten; every other line keeps its own spacing.
        let mut toks: Vec<String> = Vec::new();
        let mut drop_next_hex = false;
        for tok in line.split_whitespace() {
            let lt = tok.to_ascii_lowercase();
            if WORDS.iter().any(|w| lt.contains(w)) {
                removed += 1;
                drop_next_hex = true;
                toks.push("[digest removed — the pane's, not the ring's]".to_string());
                continue;
            }
            if std::mem::take(&mut drop_next_hex) && hexish(tok) {
                continue;
            }
            toks.push(tok.to_string());
        }
        out.push(toks.join(" "));
    }
    (out.join("\n"), removed)
}

/// Put the ring's line where the NEXT trailer stays LAST — the trailer gate and the librarian both read the last line.
fn insert_before_trailer(text: &str, line: &str) -> String {
    let body = text.replace("\r\n", "\n");
    let mut lines: Vec<String> = body.split('\n').map(str::to_string).collect();
    match lines.iter().rposition(|l| !l.trim().is_empty()) {
        Some(i) if lines[i].trim_start().starts_with("NEXT:") => lines.insert(i, line.to_string()),
        _ => lines.push(line.to_string()),
    }
    lines.join("\n")
}

fn digest_refusal(path: &str, why: &str) -> String {
    format!(
        "refused: THE RING COULD NOT COMPUTE THE DIGEST — {why}: {path}\n\
         The hand-back was NOT delivered, and the attempt was posted to the board.\n\
         Recovery: write the file at that path, or correct the pointer, then ring again."
    )
}

/// The gate, pure but for the injected `git` — the seal gate's shape (`seal_gate`), for the same reason: a test must be
/// able to ask what the ring would do without a subprocess, and one test still runs the real command.
fn digest_gate(
    text: &str,
    repo: Option<&std::path::Path>,
    git: &mut dyn FnMut(&[&str]) -> Result<GitOut, String>,
) -> DigestVerdict {
    let (clean, removed) = strip_supplied_digests(text);
    let note = move |s: &str| {
        Some(if removed > 0 { format!("{s}; {removed} pane-supplied digest(s) removed") } else { s.to_string() })
    };
    let marked = |why: &str| format!("[NO {DIGEST_MARK} — {why}]");
    let p = match pointer_in(&clean) {
        Some(p) => p,
        None => {
            return DigestVerdict::Deliver(DigestDeliver {
                text: insert_before_trailer(&clean, &marked("this call names no file to hash")),
                audit: note("call_librarian: no pointer to hash"),
            })
        }
    };
    if p.starts_with('/') || p.contains(':') || p.split('/').any(|c| c == "..") {
        return DigestVerdict::Refuse(digest_refusal(&p, "the pointer is not a repo-relative path inside the checkout"));
    }
    let Some(root) = repo else {
        return DigestVerdict::Deliver(DigestDeliver {
            text: insert_before_trailer(&clean, &marked("no checkout resolves on this machine")),
            audit: note(&format!("call_librarian: no checkout, {p} was not hashed")),
        });
    };
    let abs = root.join(&p);
    let len = match std::fs::metadata(&abs) {
        Ok(m) if m.is_file() => m.len(),
        _ => return DigestVerdict::Refuse(digest_refusal(&p, "no readable file at that path")),
    };
    match git(&["hash-object", "--no-filters", &abs.to_string_lossy()]) {
        Ok(o) if o.code == 0 && o.stdout.trim().len() == 40 && o.stdout.trim().chars().all(|c| c.is_ascii_hexdigit()) => {
            let id = o.stdout.trim();
            DigestVerdict::Deliver(DigestDeliver {
                text: insert_before_trailer(
                    &clean,
                    &format!("[{DIGEST_MARK}: git-blob {id} — {p}, {len} bytes, computed by call_librarian when the ring fired]"),
                ),
                audit: note(&format!("call_librarian: git-blob {id} computed at ring for {p}")),
            })
        }
        _ => DigestVerdict::Deliver(DigestDeliver {
            text: insert_before_trailer(&clean, &marked(&format!("git could not hash {p}"))),
            audit: note(&format!("call_librarian: git could not hash {p}")),
        }),
    }
}

/// The gate as `call_librarian` calls it.
fn digest_gate_at(text: &str, repo: Option<&std::path::Path>) -> DigestVerdict {
    match repo {
        Some(r) => {
            let root = r.to_path_buf();
            let mut git = |a: &[&str]| run_git_for_seal(&root, a);
            digest_gate(text, Some(r), &mut git)
        }
        None => digest_gate(text, None, &mut |_| Err("no checkout".to_string())),
    }
}

/// The board row that KEEPS a hand-back refused by THIS gate, on D077's terms and in its row family: a refused
/// `call_librarian` is not delivered, so without this the pointer that could not be hashed leaves no copy at all.
fn refused_digest_row(who: &str, text: &str) -> String {
    refused_row_labelled("call_librarian REFUSED (digest)", who, text)
}

#[cfg(test)]
mod digest_at_ring_tests {
    use super::*;

    const RING: &str = "P-X (L061). Hand-back at exo_memory/handback/p-x-A_2026-09-20.md (uncommitted; sha256 \
                        1f3ac4d9e5b6c7a8091a2b3c4d5e6f7081920a1b2c3d4e5f60718293a4b5c6d7).\n\
                        NEXT: librarian collate when both are in";
    const STALE: &str = "1f3ac4d9e5b6c7a8091a2b3c4d5e6f7081920a1b2c3d4e5f60718293a4b5c6d7";
    const BLOB: &str = "ce013625030ba8dba906f756967f9e9ca394464a";

    fn ok(stdout: &str) -> Result<GitOut, String> {
        Ok(GitOut { code: 0, stdout: stdout.to_string() })
    }

    /// ONE ROOT PER CALL, and the counter is the whole reason it is one. Keyed on pid and the clock alone, two tests
    /// entering in the same millisecond share a directory — so `a_pointer_with_no_readable_file_…` found the "hello\n"
    /// another test had just written, the gate correctly hashed a file that was really there, and the test failed for a
    /// reason that had nothing to do with the gate. It never fired under `--test-threads=1`, which is what every bar in
    /// my hand-back was run with; the chair's plain `cargo test` found it in one run.
    static FIXTURE_N: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(0);

    fn fixture(rel: &str, body: &str) -> std::path::PathBuf {
        let n = FIXTURE_N.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
        let dir = std::env::temp_dir().join(format!("digest-at-ring-{}-{}-{n}", std::process::id(), now_ms()));
        let p = dir.join(rel);
        std::fs::create_dir_all(p.parent().unwrap()).unwrap();
        std::fs::write(&p, body).unwrap();
        dir
    }

    fn delivered(v: DigestVerdict) -> DigestDeliver {
        match v {
            DigestVerdict::Deliver(d) => d,
            DigestVerdict::Refuse(m) => panic!("refused, expected delivery: {m}"),
        }
    }

    fn refused(v: DigestVerdict) -> String {
        match v {
            DigestVerdict::Refuse(m) => m,
            DigestVerdict::Deliver(d) => panic!("delivered, expected a refusal: {}", d.text),
        }
    }

    // ── the pointer ──────────────────────────────────────────────────────────────────────────────────────────────

    #[test]
    fn the_pointer_is_found_in_a_real_ring_with_its_punctuation_trimmed() {
        assert_eq!(pointer_in(RING).as_deref(), Some("exo_memory/handback/p-x-A_2026-09-20.md"));
    }

    #[test]
    fn prose_with_no_path_has_no_pointer() {
        assert_eq!(pointer_in("the read is done and the numbers are in the file"), None);
    }

    // ── the pane's digest never survives ─────────────────────────────────────────────────────────────────────────

    #[test]
    fn a_pane_supplied_digest_never_reaches_the_reader() {
        let root = fixture("exo_memory/handback/p-x-A_2026-09-20.md", "hello\n");
        let d = delivered(digest_gate(RING, Some(&root), &mut |_| ok(BLOB)));
        assert!(!d.text.contains(STALE), "the pane's stale digest survived the gate: {}", d.text);
        assert!(!d.text.to_lowercase().contains("sha256"), "the pane's digest WORD survived: {}", d.text);
    }

    #[test]
    fn the_ring_computes_from_the_file_the_pointer_names() {
        let root = fixture("exo_memory/handback/p-x-A_2026-09-20.md", "hello\n");
        let mut seen: Vec<String> = Vec::new();
        let d = delivered(digest_gate(RING, Some(&root), &mut |a| {
            seen = a.iter().map(|s| s.to_string()).collect();
            ok(BLOB)
        }));
        assert_eq!(seen.get(0).map(String::as_str), Some("hash-object"), "args: {seen:?}");
        assert_eq!(seen.get(1).map(String::as_str), Some("--no-filters"), "args: {seen:?}");
        assert!(
            seen.get(2).map_or(false, |p| p.ends_with("p-x-A_2026-09-20.md") && p.contains(&*root.to_string_lossy())),
            "the ring must hash the file under the checkout, not the bare pointer: {seen:?}"
        );
        assert!(d.text.contains(&format!("git-blob {BLOB}")), "the computed digest is not in the text: {}", d.text);
        assert!(d.text.contains("exo_memory/handback/p-x-A_2026-09-20.md"), "the digest must name its file: {}", d.text);
        assert!(d.text.contains("6 bytes"), "the digest line must carry the size it hashed: {}", d.text);
    }

    #[test]
    fn the_digest_line_leaves_the_next_trailer_last() {
        let root = fixture("exo_memory/handback/p-x-A_2026-09-20.md", "hello\n");
        let d = delivered(digest_gate(RING, Some(&root), &mut |_| ok(BLOB)));
        let last = d.text.lines().rev().find(|l| !l.trim().is_empty()).unwrap_or("");
        assert!(last.starts_with("NEXT:"), "the trailer must stay last: {last:?}");
    }

    // ── what refuses ─────────────────────────────────────────────────────────────────────────────────────────────

    #[test]
    fn a_pointer_with_no_readable_file_is_refused_with_the_path_in_it() {
        let root = fixture("exo_memory/handback/other.md", "x\n");
        let m = refused(digest_gate(RING, Some(&root), &mut |_| ok(BLOB)));
        assert!(m.contains("exo_memory/handback/p-x-A_2026-09-20.md"), "the refusal must name the path: {m}");
        assert!(m.contains("NOT delivered"), "the pane must be told the hand-back did not go: {m}");
    }

    #[test]
    fn a_pointer_that_climbs_out_of_the_checkout_is_refused_with_the_path_in_it() {
        let root = fixture("exo_memory/handback/p-x-A_2026-09-20.md", "hello\n");
        let text = "see ../../elsewhere/p-x.md\nNEXT: librarian read it when it lands";
        let m = refused(digest_gate(text, Some(&root), &mut |_| ok(BLOB)));
        assert!(m.contains("../../elsewhere/p-x.md"), "the refusal must name the path: {m}");
    }

    // ── what marks instead of refusing, because this verb loses work when it refuses ─────────────────────────────

    #[test]
    fn no_checkout_marks_the_absence_and_still_delivers() {
        let d = delivered(digest_gate(RING, None, &mut |_| Err("no checkout".to_string())));
        assert!(d.text.contains(&format!("NO {DIGEST_MARK}")), "the absence must be visible: {}", d.text);
        assert!(!d.text.contains(STALE), "and the pane's digest is still gone: {}", d.text);
    }

    #[test]
    fn a_git_that_cannot_run_marks_the_absence_and_still_delivers() {
        let root = fixture("exo_memory/handback/p-x-A_2026-09-20.md", "hello\n");
        let d = delivered(digest_gate(RING, Some(&root), &mut |_| Err("git is not on PATH".to_string())));
        assert!(d.text.contains(&format!("NO {DIGEST_MARK}")), "the absence must be visible: {}", d.text);
        assert!(!d.text.contains(BLOB), "no digest may be invented when the command failed: {}", d.text);
    }

    /// git exiting 0 is not the same as git printing an object id — `hash-object` can succeed and print a warning, and
    /// a message pasted into the ring as a digest is exactly the class this gate exists to stop.
    #[test]
    fn a_zero_exit_with_something_that_is_not_an_object_id_is_no_digest() {
        let root = fixture("exo_memory/handback/p-x-A_2026-09-20.md", "hello\n");
        let d = delivered(digest_gate(RING, Some(&root), &mut |_| ok("warning: LF will be replaced by CRLF\n")));
        assert!(d.text.contains(&format!("NO {DIGEST_MARK}")), "a non-id must read as NO digest: {}", d.text);
        assert!(!d.text.contains("warning:"), "git's chatter must never be printed as a digest: {}", d.text);
    }

    /// The escaping pointer must be refused BECAUSE it escapes, not because nothing happens to be there: this fixture
    /// puts a real file outside the checkout, so a gate that dropped the `..` check would hash it and deliver.
    #[test]
    fn a_pointer_to_a_real_file_outside_the_checkout_is_still_refused() {
        let root = fixture("exo_memory/handback/p-x-A_2026-09-20.md", "hello\n");
        // Named from the root's own unique directory name, not from the pid: the pid is shared by every test in the
        // run, and this file is written into the temp root that they all share.
        let outside = root
            .parent()
            .unwrap()
            .join(format!("{}-outside.md", root.file_name().unwrap().to_string_lossy()));
        std::fs::write(&outside, "not the pane's file\n").unwrap();
        let rel = format!("../{}", outside.file_name().unwrap().to_string_lossy());
        assert!(root.join(&rel).is_file(), "fixture: the escaping path must really exist");
        let text = format!("see {rel}\nNEXT: librarian read it when it lands");
        let m = refused(digest_gate(&text, Some(&root), &mut |_| ok(BLOB)));
        assert!(m.contains(&rel), "the refusal must name the path: {m}");
        let _ = std::fs::remove_file(&outside);
    }

    #[test]
    fn a_call_with_no_pointer_is_delivered_rather_than_refused() {
        let text = "the read is done\nNEXT: librarian score it when the others are in";
        let d = delivered(digest_gate(text, None, &mut |_| Err("no checkout".to_string())));
        assert!(d.text.contains("NEXT:"), "the hand-back must still go: {}", d.text);
    }

    // ── the command and its value are real, not a shape I agreed with myself ─────────────────────────────────────

    // ── the wiring, read from the source: the gate runs, in the right place, and decides nothing else ────────────
    // The anchors are built with `concat!` so a search string cannot match this test's own text (the D076 lesson).

    fn librarian_body() -> String {
        let src = std::fs::read_to_string("src/mcp.rs").expect("read own source").replace("\r\n", "\n");
        let f = src.split("async fn call_librarian(").nth(1).expect("call_librarian moved — re-point this test").to_string();
        f.split("\n    }\n").next().unwrap_or(&f).to_string()
    }

    #[test]
    fn the_ring_hashes_before_it_checks_the_trailer_and_before_it_sends() {
        let b = librarian_body();
        let gate = b.find(concat!("digest_gate", "_at(")).expect("call_librarian does not run the digest gate");
        let trailer = b.find(concat!("trailer_", "gate(")).expect("the trailer gate");
        // The call is wrapped across two lines (`self` then `.send_chair(...)`), so the anchor is the method and its
        // command, never `self.send_chair(` — that spelling does not occur in this body and would pass on nothing.
        let send = b.find(concat!(".send_", "chair(ChairCmd::CallLibrarian")).expect("the delivery");
        assert!(gate < trailer && trailer < send, "order must be digest gate < trailer gate < delivery");
    }

    #[test]
    fn a_refused_digest_keeps_the_attempt_on_the_board() {
        let b = librarian_body();
        assert!(b.contains(concat!("refused_digest", "_row(&who, &text)")), "a digest refusal must keep the pointer");
        assert!(
            b.contains(concat!("DigestVerdict::", "Refuse(msg)")) && b.contains(concat!("Content::text(", "msg)")),
            "the refusal must be what the pane is told"
        );
    }

    #[test]
    fn the_digest_gate_changes_no_gate_decision() {
        let b = librarian_body();
        let addr = b.find(concat!("auth_", "address(\"call_librarian\")")).expect("the address gate");
        let station = b.find(concat!("auth_", "station(\"call_librarian\")")).expect("the station gate");
        let gate = b.find(concat!("digest_gate", "_at(")).expect("the digest gate");
        assert!(addr < station && station < gate, "the digest gate runs AFTER both gates and replaces neither");
        let g = {
            let src = std::fs::read_to_string("src/mcp.rs").expect("read own source").replace("\r\n", "\n");
            let f = src.split("fn digest_gate(").nth(1).expect("digest_gate moved").to_string();
            f.split("\n}\n").next().unwrap_or(&f).to_string()
        };
        for forbidden in [concat!("auth_", "address"), concat!("auth_", "station"), concat!("address", "_row")] {
            assert!(!g.contains(forbidden), "the digest gate must not touch who may ring: found {forbidden}");
        }
    }

    #[test]
    fn the_real_command_returns_the_known_blob_id_of_a_known_file() {
        let root = fixture("exo_memory/handback/p-x-A_2026-09-20.md", "hello\n");
        let d = delivered(digest_gate_at(RING, Some(&root)));
        // `git hash-object` of "hello\n" is this id in every git repository on earth.
        assert!(d.text.contains(&format!("git-blob {BLOB}")), "real git did not return the known id: {}", d.text);
    }
}

// ── THE NEXT-TRAILER GATE (P-TRAILER-GATE wiring, D069, pane B) ──────────────────────────────────────────────────
// The check, the per-verb policy and the texts live in `trailer.rs` and are proven there. This is the ONE decision each
// verb makes with them, as a pure function, so the three behaviours below are tested by calling it rather than by
// reading source. The verbs only act on its answer: return the reply, or send the text, and post the audit line.

/// What a verb does with its message after the trailer check.
#[derive(Debug, PartialEq, Eq)]
enum TrailerDecision {
    /// Send `text` — unchanged, or with the warning appended. `audit`, when present, is the board line.
    Deliver { text: String, audit: Option<String> },
    /// Send nothing. Return `reply` to the caller (it carries the message back whole) and post `audit`.
    Refuse { reply: String, audit: String },
}

/// Check `text`'s trailer and decide, on `trailer::policy(verb)`. A compliant message is delivered unchanged with no
/// board line. `verb_name` is how the audit line names the call (e.g. `chair_inject -> B`, `call_librarian from A`).
fn trailer_gate(verb: crate::trailer::Verb, verb_name: &str, text: &str) -> TrailerDecision {
    use crate::trailer::{check, delivered_with_warning, policy, refusal_text, Action};
    let why = match check(text) {
        Ok(_) => return TrailerDecision::Deliver { text: text.to_string(), audit: None },
        Err(why) => why,
    };
    let reply = refusal_text(verb, why, text);
    // The refusal's first line is "refused by the NEXT-trailer gate: <what is missing>." — reuse it, so the board and
    // the seat are told the same thing in the same words.
    let missing = reply
        .lines()
        .next()
        .unwrap_or("")
        .trim_start_matches("refused by the NEXT-trailer gate: ")
        .trim_end_matches('.')
        .to_string();
    match policy(verb) {
        Action::Refuse => TrailerDecision::Refuse { audit: format!("{verb_name} REFUSED BY THE NEXT-TRAILER GATE: {missing}"), reply },
        Action::WarnAndDeliver => TrailerDecision::Deliver {
            text: delivered_with_warning(text, why),
            audit: Some(format!("{verb_name} DELIVERED WITHOUT A NEXT TRAILER: {missing}")),
        },
    }
}

#[cfg(test)]
mod trailer_gate_tests {
    use super::*;
    use crate::trailer::{Verb, RULE_FILE};

    /// This file's source, CRLF-normalised, cut at the method's closing brace (same rule as `tests::body_of`).
    fn body_of(header: &str) -> String {
        let src = std::fs::read_to_string("src/mcp.rs").expect("read own source").replace("\r\n", "\n");
        let f = src.split(header).nth(1).unwrap_or_else(|| panic!("{header} moved — re-point this test")).to_string();
        f.split("\n    }\n").next().unwrap_or(&f).to_string()
    }

    const WITH: &str = "Hand-back: exo_memory/handback/x.md\n\nNEXT: librarian collate it when all four are in";
    // A's real ring from chunk 1, verbatim: a pointer and no trailer.
    const WITHOUT: &str = "[pane:A] P-STICK-APPLIER-ZOMBIE (D066, chunk 1), on D. Pointer: exo_memory/handback/p-stick-zombie-A_2026-09-16.md";

    // ── the three behaviours, by calling the decision ────────────────────────────────────────────────────────────

    #[test]
    fn chair_inject_without_a_trailer_is_refused_and_the_message_comes_back_whole() {
        match trailer_gate(Verb::ChairInject, "chair_inject -> B", WITHOUT) {
            TrailerDecision::Refuse { reply, audit } => {
                assert!(reply.contains(WITHOUT), "the refused dispatch was not handed back: {reply}");
                assert!(reply.contains("WHAT A DISPATCH OWES") && reply.contains(RULE_FILE), "{reply}");
                assert!(audit.contains("chair_inject -> B") && audit.contains("REFUSED"), "{audit}");
            }
            other => panic!("a dispatch with no trailer was delivered: {other:?}"),
        }
    }

    #[test]
    fn call_chair_without_a_trailer_is_refused_and_the_message_comes_back_whole() {
        match trailer_gate(Verb::CallChair, "call_chair", WITHOUT) {
            TrailerDecision::Refuse { reply, audit } => {
                assert!(reply.contains(WITHOUT), "the refused ring was not handed back: {reply}");
                assert!(reply.contains("WHAT A HAND-BACK OWES"), "{reply}");
                assert!(audit.contains("call_chair") && audit.contains("REFUSED"), "{audit}");
            }
            other => panic!("a librarian ring with no trailer was delivered: {other:?}"),
        }
    }

    #[test]
    fn call_librarian_without_a_trailer_is_delivered_pointer_first_with_a_board_warning() {
        match trailer_gate(Verb::CallLibrarian, "call_librarian from A", WITHOUT) {
            TrailerDecision::Deliver { text, audit: Some(line) } => {
                assert!(text.starts_with(WITHOUT), "the pointer must arrive first and unchanged: {text}");
                assert!(text.contains(RULE_FILE), "the receiver is not told the rule: {text}");
                assert!(line.contains("call_librarian from A") && line.contains("WITHOUT A NEXT TRAILER"), "{line}");
            }
            TrailerDecision::Deliver { audit: None, .. } => {
                panic!("delivered with no board line — a warning nobody sees is the silent-absence class")
            }
            TrailerDecision::Refuse { .. } => panic!("a hand-back was refused over its trailer — that destroys the hand-back"),
        }
    }

    #[test]
    fn every_verb_with_a_trailer_delivers_the_message_unchanged_and_posts_nothing() {
        for verb in [Verb::ChairInject, Verb::CallChair, Verb::CallLibrarian] {
            assert_eq!(
                trailer_gate(verb, "v", WITH),
                TrailerDecision::Deliver { text: WITH.to_string(), audit: None },
                "{verb:?} altered or audited a compliant message"
            );
        }
    }

    #[test]
    fn the_audit_line_names_what_was_missing() {
        let TrailerDecision::Refuse { audit, .. } = trailer_gate(Verb::ChairInject, "chair_inject -> B", WITHOUT) else {
            panic!("not refused")
        };
        assert!(audit.contains("has no NEXT: line"), "the board line does not say what was missing: {audit}");
        let TrailerDecision::Deliver { audit: Some(warn), .. } = trailer_gate(Verb::CallLibrarian, "call_librarian", "x\nNEXT: chunk 2 opens") else {
            panic!("not warned")
        };
        assert!(warn.contains("names no station"), "the warning does not say what was missing: {warn}");
    }

    // ── the wiring, pinned by position and by the arm, on A's precedent ──────────────────────────────────────────

    #[test]
    fn chair_inject_runs_the_trailer_gate_last_after_the_seal_gate_and_returns_on_refusal() {
        let b = body_of("async fn chair_inject(");
        let seal = b.find("match verdict {").expect("the seal gate's verdict");
        let gate = b.find("trailer_gate(crate::trailer::Verb::ChairInject").expect("chair_inject does not run the trailer gate");
        let send = b.find("self.send_chair(").expect("the delivery");
        assert!(seal < gate && gate < send, "order must be seal gate < trailer gate < delivery");
        let seg = &b[gate..send];
        let refuse = seg.find("TrailerDecision::Refuse").expect("no refusal arm");
        assert!(seg[refuse..].contains("return Ok("), "a refused dispatch is not returned before delivery");
        assert!(seg[refuse..].contains("self.trailer_audit("), "a refused dispatch is not posted to the board");
    }

    #[test]
    fn call_chair_runs_the_trailer_gate_before_delivery_and_returns_on_refusal() {
        let b = body_of("async fn call_chair(");
        let seat = b.find("auth_librarian(\"call_chair\")").expect("the seat check");
        let gate = b.find("trailer_gate(crate::trailer::Verb::CallChair").expect("call_chair does not run the trailer gate");
        let send = b.find("self.send_chair(").expect("the delivery");
        assert!(seat < gate && gate < send, "order must be seat check < trailer gate < delivery");
        let seg = &b[gate..send];
        let refuse = seg.find("TrailerDecision::Refuse").expect("no refusal arm");
        assert!(seg[refuse..].contains("return Ok("), "a refused ring is not returned before delivery");
        assert!(seg[refuse..].contains("self.trailer_audit("), "a refused ring is not posted to the board");
    }

    #[test]
    fn call_librarian_warns_after_the_out_of_turn_arm_and_can_never_refuse_on_a_trailer() {
        let b = body_of("async fn call_librarian(");
        let owed = b.find("mark_owed(&who, now_ms());").expect("the out-of-turn arm");
        let gate = b.find("trailer_gate(crate::trailer::Verb::CallLibrarian").expect("call_librarian does not run the trailer gate");
        // `.send_chair(ChairCmd::CallLibrarian`, not `self.send_chair(`: rustfmt breaks this call as `self` / `.send_chair(`
        // across two lines here, so the one-line form never matches in this body.
        let send = b.find(".send_chair(ChairCmd::CallLibrarian").expect("the delivery");
        assert!(owed < gate && gate < send, "order must be out-of-turn arm < trailer gate < delivery");
        let seg = &b[gate..send];
        assert!(!seg.contains("return "), "the trailer gate can return from call_librarian — that would destroy a hand-back");
        // The warning's board line must be in the DELIVER arm. The first version of this pin searched the whole
        // segment for `self.trailer_audit(`, and the unreachable Refuse arm carries that token too — so deleting the
        // warning's line left it green (mutant W7 SURVIVED, D069). Pin the arm, not the token.
        let deliver = seg.find("TrailerDecision::Deliver").expect("no Deliver arm");
        let refuse = seg.find("TrailerDecision::Refuse").expect("no Refuse arm");
        assert!(deliver < refuse, "the Deliver arm is expected first");
        assert!(seg[deliver..refuse].contains("self.trailer_audit("), "a warned hand-back is delivered but not posted to the board");
    }
}

/// P-REFUSAL-KEEPS-THE-POINTER (D077). The row is tested as a pure function; its wiring into `call_librarian`'s refusal
/// branch is pinned by source ORDER, because the branch needs a live chain state to reach.
#[cfg(test)]
mod refusal_pointer_tests {
    use super::*;

    const POINTER: &str = "P-X (D077). Pointer: exo_memory/handback/p-x-A_2026-09-19.md. Paths: mcp.rs.\nNEXT: librarian re-derive when read";

    /// `call_librarian`'s body, from the real fn (the anchor is split with `concat!` so this test cannot find itself).
    fn call_librarian_body() -> String {
        let src = std::fs::read_to_string("src/mcp.rs").expect("read own source").replace("\r\n", "\n");
        let body = src.split(concat!("async fn call_", "librarian(")).nth(1).expect("call_librarian moved");
        body.split("\n    }\n").next().unwrap().to_string()
    }

    /// The refusal branch: from the station check to the first `return` after it, inclusive of that line.
    fn refusal_branch(body: &str) -> String {
        let start = body.find(concat!("if !self.auth_station(\"call_", "librarian\") {")).expect("the station check moved");
        let rest = &body[start..];
        let ret = rest.find("return Ok(").expect("the refusal branch returns");
        let end = ret + rest[ret..].find('\n').unwrap_or(rest.len() - ret);
        rest[..end].to_string()
    }

    #[test]
    fn a_refused_attempt_row_carries_the_pointer_and_the_mount() {
        let row = refused_attempt_row("A", POINTER);
        assert!(row.contains("exo_memory/handback/p-x-A_2026-09-19.md"), "the pointer is not in the row: {row}");
        assert!(row.contains("NEXT: librarian re-derive when read"), "the trailer is not in the row: {row}");
        assert!(row.contains("mount A"), "the row does not name the mount: {row}");
        assert!(row.contains("call_librarian REFUSED"), "the row is not labelled as a refused attempt: {row}");
        assert!(!row.contains('\n'), "a line break survived into the row: {row:?}");
    }

    /// The bound, on characters not bytes, so a multibyte pointer cannot be cut mid-character or overrun it.
    #[test]
    fn a_long_attempt_is_bounded_and_the_row_says_how_much_was_dropped() {
        let long = "é".repeat(REFUSED_ATTEMPT_MAX_CHARS + 250);
        let row = refused_attempt_row("A", &long);
        let kept = row.chars().filter(|c| *c == 'é').count();
        assert_eq!(kept, REFUSED_ATTEMPT_MAX_CHARS, "the row kept {kept} characters of the attempt");
        assert!(row.contains("+250"), "the row does not say what it dropped: {row}");
        let short = refused_attempt_row("A", "exo_memory/handback/x.md");
        assert!(!short.contains("not kept"), "a short attempt is marked as cut: {short}");
    }

    /// C's replay counts refusals by `auth_station`'s phrase. This row must not look like one more refusal.
    #[test]
    fn the_row_is_not_counted_as_another_out_of_turn_refusal() {
        let row = refused_attempt_row("A", POINTER);
        assert!(!row.contains("REFUSED OUT OF TURN — mount"), "the row matches the refusal discriminator: {row}");
    }

    /// WIRING: the refusal branch posts the row built from the call's own `text`, BEFORE it returns — and returns exactly
    /// what it returned before, so the pane's refusal text is unchanged.
    #[test]
    fn the_refusal_branch_posts_the_attempt_and_returns_the_same_text() {
        let body = call_librarian_body();
        let branch = refusal_branch(&body);
        let post = branch.find("refused_attempt_row(&who, &text)").unwrap_or_else(|| panic!("the refusal branch does not keep the attempt:\n{branch}"));
        let ret = branch.find("return Ok(").unwrap();
        assert!(post < ret, "the attempt is posted after the branch has returned");
        assert!(
            branch.ends_with("return Ok(CallToolResult::success(vec![Content::text(self.out_of_turn_handback_message())]));"),
            "the refusal text returned to the pane changed:\n{branch}"
        );
    }

    /// An ADMITTED call is unchanged: the row is built in one place only, inside the refusal branch.
    #[test]
    fn an_admitted_call_does_not_post_the_row() {
        let body = call_librarian_body();
        let branch = refusal_branch(&body);
        assert_eq!(body.matches("refused_attempt_row(").count(), 1, "the row is built outside the refusal branch too");
        assert!(branch.contains("refused_attempt_row("), "the one call site is not in the refusal branch");
    }
}

/// P-ADDRESS-REFUSAL-KEEPS-THE-POINTER (D078): the address-table branch of `call_librarian` keeps the attempt too.
#[cfg(test)]
mod address_refusal_pointer_tests {
    use super::*;

    const POINTER: &str = "P-Y (D078). Pointer: exo_memory/handback/p-y-A_2026-09-19.md.\nNEXT: librarian re-derive when read";

    fn call_librarian_body() -> String {
        let src = std::fs::read_to_string("src/mcp.rs").expect("read own source").replace("\r\n", "\n");
        let body = src.split(concat!("async fn call_", "librarian(")).nth(1).expect("call_librarian moved");
        body.split("\n    }\n").next().unwrap().to_string()
    }

    /// The address branch: from the address check to the end of the first `return` statement after it.
    fn address_branch(body: &str) -> String {
        let start = body.find(concat!("if !self.auth_address(\"call_", "librarian\") {")).expect("the address check moved");
        let rest = &body[start..];
        let ret = rest.find("return Ok(").expect("the address branch returns");
        let end = ret + rest[ret..].find(");\n").expect("the return ends") + 2;
        rest[..end].to_string()
    }

    #[test]
    fn an_address_refusal_row_carries_the_pointer_the_mount_and_its_cause() {
        let row = refused_address_row("M", POINTER);
        assert!(row.contains("exo_memory/handback/p-y-A_2026-09-19.md"), "the pointer is not in the row: {row}");
        assert!(row.contains("NEXT: librarian re-derive when read"), "the trailer is not in the row: {row}");
        assert!(row.contains("mount M"), "the row does not name the mount: {row}");
        assert!(row.contains("no address row"), "the row does not say why it was refused: {row}");
        assert!(!row.contains('\n'), "a line break survived into the row: {row:?}");
    }

    /// Distinguishable in BOTH directions, and neither is counted as an out-of-turn refusal (C's discriminator).
    #[test]
    fn the_two_refusal_rows_are_told_apart_and_neither_reads_as_out_of_turn() {
        let addr = refused_address_row("M", POINTER);
        let turn = refused_attempt_row("M", POINTER);
        assert!(!addr.starts_with("call_librarian REFUSED — the attempt"), "the address row reads as the out-of-turn row: {addr}");
        assert!(!turn.contains("no address row"), "the out-of-turn row claims an address cause: {turn}");
        for row in [&addr, &turn] {
            assert!(!row.contains("REFUSED OUT OF TURN — mount"), "a kept-attempt row matches the refusal discriminator: {row}");
        }
    }

    #[test]
    fn an_address_refusal_row_is_bounded_like_the_other() {
        let row = refused_address_row("M", &"é".repeat(REFUSED_ATTEMPT_MAX_CHARS + 10));
        assert_eq!(row.chars().filter(|c| *c == 'é').count(), REFUSED_ATTEMPT_MAX_CHARS);
        assert!(row.contains("+10"), "the row does not say what it dropped: {row}");
    }

    /// D077's row is unchanged by the refactor, byte for byte.
    #[test]
    fn the_out_of_turn_row_is_byte_identical_to_d077() {
        assert_eq!(
            refused_attempt_row("A", "p.md\nNEXT: x"),
            "call_librarian REFUSED — the attempt, kept because a refused call is not delivered: mount A carried: p.md | NEXT: x"
        );
    }

    /// WIRING: the address branch posts the row built from the call's own `text` before returning, and returns the same
    /// literal as before.
    #[test]
    fn the_address_branch_posts_the_attempt_and_returns_the_same_text() {
        let branch = address_branch(&call_librarian_body());
        let post = branch.find("refused_address_row(&who, &text)").unwrap_or_else(|| panic!("the address branch does not keep the attempt:\n{branch}"));
        let ret = branch.find("return Ok(").unwrap();
        assert!(post < ret, "the attempt is posted after the branch has returned");
        assert!(
            branch.ends_with("return Ok(CallToolResult::success(vec![Content::text(\n                \"refused: no address row from this mount's seat to the librarian (the attempt was posted to the board)\",\n            )]));"),
            "the refusal text returned to the pane changed:\n{branch}"
        );
    }
}
