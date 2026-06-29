// Plane separation, enforced at test time: the Control/Sensor sources must never name an
// Actuator capability (the PTY writer). If this fails, the discriminator has leaked into a
// plane that is supposed to only observe or enqueue. See PLAN §2.2 ("Sensor cannot name an
// actuator"). Run with `cargo test`.
use std::fs;

/// Source files that live in the Control or Sensor planes and must hold no actuator handle.
const CONTROL_SENSOR_SOURCES: &[&str] = &["src/mcp.rs", "src/gate.rs"];

/// Names that imply an Actuator capability (writing to a pane's PTY).
const ACTUATOR_NAMES: &[&str] = &["portable_pty", "PtySession", "take_writer", "MasterPty", "clone_killer"];

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
