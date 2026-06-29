// Stage 7: the ask-first gate (Control plane — holds NO actuator handle; arch_test enforces it).
// Slice 1: ask_each. A pull below the chair's threshold drops (counted as a suppressed pull);
// otherwise it becomes a GateCard the human Approves or Denies. Delivering an approved pull (the
// inject into the target pane) is the Actuator's job and lives in main.rs, never here.
use serde::Serialize;
use std::collections::HashMap;

#[derive(Clone, Copy)]
pub enum GateMode {
    AskEach,
    // OpenChannel(envelope) and Batched arrive in later slices.
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
}

impl Default for GateInner {
    fn default() -> Self {
        Self {
            mode: GateMode::AskEach,
            pull_threshold: 0.4,
            pending: HashMap::new(),
            suppressed: 0,
        }
    }
}
