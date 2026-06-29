// Stage 7: the ask-first gate (Control plane — holds NO actuator handle; arch_test enforces it).
// Slice 1: ask_each. A pull below the chair's threshold drops (counted as a suppressed pull);
// otherwise it becomes a GateCard the human Approves or Denies. Delivering an approved pull (the
// inject into the target pane) is the Actuator's job and lives in main.rs, never here.
use serde::Serialize;
use std::collections::{HashMap, VecDeque};

// Global auto-approval rate cap (across ALL bodies — the committee's "global per-round bound", so a
// colluding pair can't each stay under a per-body limit while the sum runs away). Our envelope's
// exchange counter is already global; this adds burst protection for large envelopes.
pub const RATE_CAP: u32 = 6;
pub const RATE_WINDOW_MS: u64 = 15_000;

#[derive(Clone, Copy, PartialEq)]
pub enum GateMode {
    AskEach,
    OpenChannel,
    // Batched arrives in a later slice.
}

/// A chair-granted auto-approve window. When any bound is exhausted the gate snaps back to AskEach.
/// (token_budget is carried for slice 4's cost breaker; slice 2 enforces exchanges + ttl.)
pub struct Envelope {
    pub remaining_exchanges: u32,
    pub deadline_ms: u64,
}

/// A pull surfaced to the chair for a decision.
#[derive(Serialize, Clone)]
pub struct GateCard {
    pub id: String,
    pub from: String,
    pub target: String,
    pub kind: String,
    pub intensity: f64,
    pub why: String,
}

pub struct GateInner {
    pub mode: GateMode,
    pub pull_threshold: f64,
    pub pending: HashMap<String, crate::mcp::PullRequest>,
    pub suppressed: u64,
    pub envelope: Option<Envelope>,
    pub auto_window: VecDeque<u64>, // timestamps of recent auto-approvals (rate cap)
}

impl Default for GateInner {
    fn default() -> Self {
        Self {
            mode: GateMode::AskEach,
            pull_threshold: 0.4,
            pending: HashMap::new(),
            suppressed: 0,
            envelope: None,
            auto_window: VecDeque::new(),
        }
    }
}

impl GateInner {
    pub fn remaining(&self) -> u32 {
        self.envelope.as_ref().map_or(0, |e| e.remaining_exchanges)
    }
    pub fn mode_label(&self) -> String {
        match self.mode {
            GateMode::AskEach => "ask-each".to_string(),
            GateMode::OpenChannel => format!("open-channel · {} left", self.remaining()),
        }
    }
}
