// Stage 8: the tether-strength proxy (the "health/tether" sensor). Zero-token, purely lexical,
// continuous. It is a SURFACED PROXY the chair reads — never a verdict, never an instruction. It
// reports two numbers: how tied-to-checkable-ground a turn is (external referents), and how much
// new it brings vs the recent board (novelty). Presence of referents is not truth; high novelty is
// not insight. The discrimination stays with the human; this only makes a proxy legible.
//
// Sensor plane: holds no actuator capability (arch_test enforces it).
use std::collections::HashSet;

pub struct TetherReading {
    pub referents: u32,
    pub novelty: f64, // 0..1 — fraction of this turn's significant words unseen in the recent window
}

/// Significant word-tokens (lowercased, length > 3), for the novelty overlap.
fn tokens(s: &str) -> HashSet<String> {
    s.to_lowercase()
        .split(|c: char| !c.is_alphanumeric())
        .filter(|w| w.len() > 3)
        .map(|w| w.to_string())
        .collect()
}

/// Count external-referent markers: URLs, file paths, numbers, code spans, citations. A lexical
/// proxy for "tied to ground that holds up outside the conversation" — not a measure of truth.
pub fn count_referents(text: &str) -> u32 {
    let mut n = 0u32;
    for raw in text.split_whitespace() {
        let t = raw.trim_matches(|c: char| !c.is_alphanumeric() && !"/\\.:`#".contains(c));
        if t.is_empty() {
            continue;
        }
        let lower = t.to_lowercase();
        let is_url = lower.starts_with("http") || lower.starts_with("www.");
        let is_path = (t.contains('/') || t.contains('\\')) && t.len() > 2;
        let is_num = t.chars().any(|c| c.is_ascii_digit())
            && t.chars().all(|c| c.is_ascii_digit() || ".,:%-/$kKmMbBxX".contains(c));
        let is_code = raw.contains('`');
        let is_citation = t.starts_with('#') && t.len() > 1; // e.g. #1641
        if is_url || is_path || is_num || is_code || is_citation {
            n += 1;
        }
    }
    n
}

/// Fraction of this turn's significant words NOT present in the recent board window.
/// 1.0 = all new vocabulary; near 0 = re-saying what's already on the board ("agreeing louder").
pub fn novelty(text: &str, recent: &[String]) -> f64 {
    let cur = tokens(text);
    if cur.is_empty() {
        return 0.0;
    }
    let mut prior: HashSet<String> = HashSet::new();
    for r in recent {
        prior.extend(tokens(r));
    }
    if prior.is_empty() {
        return 1.0;
    }
    let fresh = cur.iter().filter(|t| !prior.contains(*t)).count();
    fresh as f64 / cur.len() as f64
}

pub fn read(text: &str, recent: &[String]) -> TetherReading {
    TetherReading { referents: count_referents(text), novelty: novelty(text, recent) }
}
