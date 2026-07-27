// Plane separation, enforced at test time: the Control/Sensor sources must never name an
// Actuator capability (the PTY writer). If this fails, the discriminator has leaked into a
// plane that is supposed to only observe or enqueue. See PLAN §2.2 ("Sensor cannot name an
// actuator"). Run with `cargo test`.
use std::fs;

/// Source files that live in the Control or Sensor planes and must hold no actuator handle.
const CONTROL_SENSOR_SOURCES: &[&str] = &["src/mcp.rs", "src/gate.rs", "src/tether.rs"];

/// Gauge sources must surface numbers, never verdicts or imperatives (light, not lifeguard).
const GAUGE_SOURCES: &[&str] = &["src/tether.rs"];
const VERDICT_PHRASES: &[&str] =
    &["recommend", "should stop", "you should", "stop now", "halt the", "is drifting", "is collapsing"];

/// Names that imply an Actuator capability (writing to a pane's PTY).
const ACTUATOR_NAMES: &[&str] = &["portable_pty", "PtySession", "take_writer", "MasterPty", "clone_killer"];

#[test]
fn gauges_speak_in_numbers_not_verdicts() {
    for path in GAUGE_SOURCES {
        let src = fs::read_to_string(path).unwrap_or_else(|e| panic!("read {path}: {e}")).to_lowercase();
        for phrase in VERDICT_PHRASES {
            assert!(
                !src.contains(phrase),
                "{path} is a gauge (Sensor plane) — it must surface numbers the human reads, never a \
                 verdict or imperative ('{phrase}'). Report the measurement; leave the call to the chair."
            );
        }
    }
}

/// Stage 9: every chair verb in the MCP layer must pass the token gate. Lexical tripwire —
/// the number of `async fn chair_*` tools must equal the number of `self.auth_chair(` call
/// sites. A chair verb without the gate is an unaudited actuator path anyone could call.
#[test]
fn every_chair_verb_authenticates() {
    let src = fs::read_to_string("src/mcp.rs").unwrap_or_else(|e| panic!("read src/mcp.rs: {e}"));
    let verbs = src.matches("async fn chair_").count();
    let auths = src.matches("self.auth_chair(").count();
    assert!(verbs > 0, "expected chair_* verbs in src/mcp.rs (Stage 9)");
    assert_eq!(
        verbs, auths,
        "src/mcp.rs: {verbs} chair verbs but {auths} auth_chair calls — every chair_* tool must \
         gate on the token exactly once, or an unauthenticated path reaches the actuator"
    );
}

#[test]
fn control_and_sensor_planes_hold_no_actuator_handle() {
    for path in CONTROL_SENSOR_SOURCES {
        let src = fs::read_to_string(path).unwrap_or_else(|e| panic!("read {path}: {e}"));
        for forbidden in ACTUATOR_NAMES {
            assert!(
                !src.contains(forbidden),
                "{path} is a Control/Sensor-plane module and must not name an actuator capability \
                 ('{forbidden}'). The PTY writer belongs only to the actuator path reached through \
                 a human-passed gate. Move the side-effect behind the pull queue."
            );
        }
    }
}
