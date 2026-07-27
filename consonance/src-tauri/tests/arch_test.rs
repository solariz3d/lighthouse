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

// ---- Cycle 2 (Bravo item 1): the model stays on the analyst surface ----
//
// A pane must never be told another pane's model as ambient context. The moment rank rides a
// pane-to-pane structure, every member reads every other member's rank on every turn — and the
// rank gradient stops being something the room can study, because the room is now marinating in
// it. Blind the contributor, label the record (C3): the model belongs on chair_status and on the
// chair's own audit line, and nowhere a pane can see it about a peer.
//
// INVERTED ON PURPOSE — and the first version of this test was wrong in a way worth recording,
// because the failure is the interesting part. It iterated a hand-kept list of pane-to-pane
// structs while its comment claimed it caught "a NEW struct nobody thought to enumerate." Those
// are opposite properties. A list can only ever catch drift in things already on it; a struct
// added tomorrow is, by definition, not on it. Alpha proved it in one move: a fresh
// `PeerInfo { pane, model }` passed all five arch tests. The author had falsified that the test
// caught drift in the LISTED structs and then wrote a comment about un-listed ones — testing what
// was built rather than what was claimed.
//
// So the polarity is flipped. The assertion now runs over EVERY Serialize-deriving struct in the
// file and requires an explicit EXEMPTION to carry a rank field. A new struct is therefore
// forbidden by default: adding one that leaks rank means editing the exemption list, in the diff,
// with a reason — which is the only version of this that a reviewer can actually police.
//
// HONEST BOUND (Alpha's F2, and the inversion mitigates but does not remove it): this is LEXICAL.
// It matches field NAMES against a small list of words. A field called `provenance`, `flavour` or
// `origin` carrying the same fact sails straight through, and no string-matching test can fix
// that. What the inversion buys is that such a field still has to appear in a NEW struct or an
// existing one, and the exemption list stays short enough to read — so the defence is ultimately
// the reviewer, with this test making the reviewer's job small and specific rather than
// open-ended. Do not read a green run here as proof that no rank leaked; read it as proof that
// none leaked under the names we know to look for.
//
// The structural half (`no_model_key_on_any_pane_to_pane_surface`, in main.rs) proves the actual
// serialised bytes are clean for the surfaces that exist today. Neither alone is the mechanism.

/// Field names that carry a pane's rank. Lexical, and deliberately short — see the bound above.
const RANKISH_FIELDS: &[&str] = &["model", "rank", "tier", "substrate", "engine"];

/// Serialize structs allowed to name a model, each with the reason it is not a pane-to-pane
/// surface. ADDING TO THIS LIST IS THE WHOLE POINT: it is a conscious act, visible in a diff.
const EXEMPT_STRUCTS: &[(&str, &str)] = &[
    ("Config", "machine configuration, not a pane-addressed structure — the local config already \
                names dream_model, and no pane learns a peer's rank from it"),
];

/// Every `#[derive(..Serialize..)] struct Name { .. }` in a source file, as (name, body).
fn serialize_structs(src: &str) -> Vec<(String, String)> {
    let mut out = Vec::new();
    let mut rest = src;
    while let Some(i) = rest.find("#[derive(") {
        let after = &rest[i + "#[derive(".len()..];
        let Some(attr_end) = after.find(")]") else { break };
        let attr = &after[..attr_end];
        let tail = &after[attr_end + 2..];
        rest = tail;
        if !attr.contains("Serialize") {
            continue;
        }
        let Some(s) = tail.find("struct ") else { continue };
        if s > 200 {
            continue; // the derive belongs to something else (enum, fn) — not a struct decl
        }
        let name_start = s + "struct ".len();
        let Some(brace) = tail[name_start..].find('{') else { continue };
        let name = tail[name_start..name_start + brace].trim();
        // reject tuple structs (`struct Board(..)`), generics, and anything not a bare identifier
        if name.is_empty() || !name.chars().all(|c| c.is_alphanumeric() || c == '_') {
            continue;
        }
        let body_start = name_start + brace;
        let Some(close) = tail[body_start..].find("\n}") else { continue };
        out.push((name.to_string(), tail[body_start..body_start + close].to_string()));
    }
    out
}

/// Field names declared in a struct body. Parsed as fields rather than substring-searched, so a
/// word appearing in a COMMENT can never trip the assertion — a false positive here would teach
/// people to work around the test, which is worse than the leak it guards.
fn field_names(body: &str) -> Vec<String> {
    body.lines()
        .map(|l| l.trim())
        .filter(|l| !l.starts_with("//") && !l.starts_with("#["))
        .filter_map(|l| {
            let code = l.split("//").next().unwrap_or(l).trim();
            let (name, _) = code.split_once(':')?;
            let name = name.trim().trim_start_matches("pub ").trim();
            if !name.is_empty() && name.chars().all(|c| c.is_alphanumeric() || c == '_') {
                Some(name.to_ascii_lowercase())
            } else {
                None
            }
        })
        .collect()
}

#[test]
fn no_serialized_struct_carries_a_rank_field_without_an_exemption() {
    let src = fs::read_to_string("src/main.rs").expect("read src/main.rs");
    let structs = serialize_structs(&src);

    // An arch test that quietly asserts over an empty set is the exact failure this one was
    // rewritten to escape: it passes, forever, while checking nothing. Prove the parser found the
    // file before trusting anything it says about it.
    assert!(
        structs.len() >= 8,
        "only {} Serialize structs found in src/main.rs — the parser is broken and this assertion \
         is vacuous. A green arch test over an empty set is worse than no test.",
        structs.len()
    );
    for known in ["BoardEntry", "SiblingInfo", "TurnRecord", "TetherInfo", "ContextInfo"] {
        assert!(
            structs.iter().any(|(n, _)| n == known),
            "{known} was not discovered by the parser — if it was renamed, fix the parser; a silent \
             miss here reopens the hole this test exists to close"
        );
    }

    for (name, body) in &structs {
        if let Some((_, why)) = EXEMPT_STRUCTS.iter().find(|(n, _)| n == name) {
            assert!(!why.is_empty(), "an exemption must carry its reason");
            continue;
        }
        for field in field_names(body) {
            assert!(
                !RANKISH_FIELDS.contains(&field.as_str()),
                "struct {name} declares `{field}` and is not on the exemption list. Serialized \
                 structs reach panes; a pane told its peers' ranks is a pane handed the gradient, \
                 which is the thing the room is trying to measure. Rank belongs on chair_status \
                 (the analyst) and the chair's audit line. If {name} genuinely is not a \
                 pane-to-pane surface, add it to EXEMPT_STRUCTS with the reason — consciously, in \
                 the diff, where a reviewer will see it."
            );
        }
    }
}

/// The other direction, so the rule can never be satisfied by deleting the feature:
/// NEVER BLIND THE ANALYST. The chair-analyst pane object must keep carrying the model.
#[test]
fn the_chair_analyst_surface_is_not_blinded() {
    let src = fs::read_to_string("src/main.rs").expect("read src/main.rs");
    let at = src.find("fn status_pane_obj(").expect("status_pane_obj is the chair-analyst pane surface");
    let tail = &src[at..];
    let end = tail.find("\n}").expect("status_pane_obj body");
    assert!(
        tail[..end].contains("\"model\""),
        "status_pane_obj must carry the model — the analyst classifying for rank effects needs the \
         ranks, or the study is impossible by construction. Blinding belongs on the contributor \
         side of a fork, never on the reader of the record."
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
