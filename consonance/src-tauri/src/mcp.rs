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

/// A committee member raising its hand. Routed to the chair's gate (Stage 7); never acts.
#[derive(Clone, serde::Serialize)]
pub struct PullRequest {
    pub from: String,
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
    /// who you want to engage, if any (a pane id or name)
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
        let (tx, rx) = tokio::sync::oneshot::channel();
        let out = self.send_chair(ChairCmd::Inject { target, text, reply: tx }, rx).await;
        Ok(CallToolResult::success(vec![Content::text(out)]))
    }

    #[tool(description = "CHAIR VERB (token-gated, Main orchestrator only): set the board phase. \"quiet\" = panes may post but see only their own lines and the chair's, so independent work stays independent; \"open\" = the shared board is back and peers can catch each other. Acting verb — audited to the board, and every pane is TOLD it is in quiet phase and how much is withheld.")]
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

    #[tool(description = "Raise your hand to the committee chair: signal that another instance's thread is novel / wrong / interesting and you want to engage. This NEVER acts — it only enqueues a request the human chair decides on.")]
    async fn raise_pull(
        &self,
        Parameters(RaisePullArgs { target, kind, intensity, why, from }): Parameters<RaisePullArgs>,
    ) -> Result<CallToolResult, McpError> {
        let pr = PullRequest {
            from: from.unwrap_or_else(|| "unknown".to_string()),
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
        // The connection wins over the payload. A self-reported tag is a claim; the mount point
        // is a fact the caller cannot restate. Where there is no identity the post is stamped
        // `unattributed` rather than "mcp" — a word that read like a source and was really the
        // absence of one, which is how 37 of the laptop's 40 board lines went uncounted.
        let entry = BoardEntry {
            pane: self
                .identity
                .clone()
                .or(tag)
                .unwrap_or_else(|| "unattributed".to_string()),
            role: "committee".to_string(),
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
            e.pane == "chair" || e.pane == "M" || mine.as_deref() == Some(e.pane.as_str())
        };
        let (lines, withheld): (Vec<String>, usize) = {
            let q = self.board.lock().unwrap();
            let start = q.len().saturating_sub(n);
            let window: Vec<&BoardEntry> = q.iter().skip(start).collect();
            let hidden = window.iter().filter(|e| !visible(e)).count();
            (window.into_iter().filter(|e| visible(e))
                 .map(|e| format!("[{}] {}: {}", e.pane, e.role, e.text)).collect(),
             hidden)
        };
        let mut body = if lines.is_empty() { "(board is empty)".to_string() } else { lines.join("\n") };
        if quiet {
            // Say it, every time. A filtered board that does not announce itself is a false
            // record, and the point of the phase is independence, not deception.
            body.push_str(&format!(
                "\n\n-- QUIET PHASE: {withheld} entr{} from other panes withheld. You are \
                 producing independently; siblings' findings unlock when the chair reopens the \
                 board. Your own posts and the chair's are shown in full.",
                if withheld == 1 { "y" } else { "ies" }
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
             members use raise_pull, never chair verbs."
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
