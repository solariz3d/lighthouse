// Stage 7a (minimal): the one shared MCP control plane, over loopback HTTP.
// Proves a spawned claude pane connects to a single in-process server and shares the
// Board. No auth yet (loopback-only); per-pane bearer tokens come in the full 7a build.
use std::collections::VecDeque;
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
    ) -> Self {
        Self { board, pulls, chair, chair_token, tool_router: Self::tool_router() }
    }

    /// Gate a chair verb. The token is written only into the Main instance's directory, so in
    /// practice only the Main thread presents it. Honest limit: this is a DISCIPLINE boundary,
    /// not a security one — any local process with file access could read that file. What
    /// actually enforces the methodology is the AUDIT: every acting verb and every refused
    /// attempt lands on the board, where the whole committee and the human read it.
    fn auth_chair(&self, token: &str, verb: &str) -> bool {
        let ok = !self.chair_token.is_empty() && token == self.chair_token;
        if !ok {
            board_push(&self.board, BoardEntry {
                pane: "chair".to_string(),
                role: "committee".to_string(),
                text: format!("{verb} REFUSED — bad or missing chair token"),
                ts: now_ms(),
            });
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
        let entry = BoardEntry {
            pane: tag.unwrap_or_else(|| "mcp".to_string()),
            role: "committee".to_string(),
            text,
            ts: now_ms(),
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
        let lines: Vec<String> = {
            let q = self.board.lock().unwrap();
            let start = q.len().saturating_sub(n);
            q.iter().skip(start).map(|e| format!("[{}] {}: {}", e.pane, e.role, e.text)).collect()
        };
        let body = if lines.is_empty() { "(board is empty)".to_string() } else { lines.join("\n") };
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
            "Consonance committee control plane: post_board / read_board over one shared board across instances. \
             The chair_* verbs are token-gated to the Main orchestrator and audited to the board — committee \
             members use raise_pull, never chair verbs."
                .to_string(),
        );
        info
    }
}

/// Absolute path to the shared MCP config every pane is launched with.
pub fn config_path() -> std::path::PathBuf {
    data_dir().join("mcp.consonance.json")
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
            let _ = tx.send(port);

            let service = StreamableHttpService::new(
                move || Ok(ConsonanceMcp::new(board.clone(), pulls.clone(), chair.clone(), chair_token.clone())),
                LocalSessionManager::default().into(),
                Default::default(),
            );
            let router = axum::Router::new().nest_service("/mcp", service);
            let _ = axum::serve(listener, router).await;
        });
    });
    rx.recv().unwrap_or(0)
}
