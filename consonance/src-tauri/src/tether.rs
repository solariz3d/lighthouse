// Stage 8: the tether-strength proxy (the "health/tether" sensor). Zero-token, purely lexical,
// continuous. It is a SURFACED PROXY the chair reads — never a verdict, never an instruction. It
// reports two numbers: how tied-to-checkable-ground a turn is (external referents), and how much
// new it brings vs the recent board (novelty). Presence of referents is not truth; high novelty is
// not insight. The discrimination stays with the human; this only makes a proxy legible.
//
// Sensor plane: holds no actuator capability (arch_test enforces it).
use serde::Serialize;
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

// ---- the Delta: lap-over-lap on two committee forming results (numbers, never a verdict) ----
#[derive(Serialize, Clone, Default)]
pub struct Delta {
    pub new_confirmed: u32,
    pub new_forks: u32,
    pub resolved_forks: u32,
    pub new_refs: u32,
    pub echo_ratio: f64, // 0..1 — how much this lap re-says the last
    pub novelty: f64,    // 1 - echo_ratio
}

/// Pull the keyed text of each item in a forming section, lowercased.
fn section_texts(v: &serde_json::Value, key: &str, field: &str) -> Vec<String> {
    v.get(key)
        .and_then(|x| x.as_array())
        .map(|a| {
            a.iter()
                .filter_map(|it| it.get(field).and_then(|x| x.as_str()).map(|s| s.to_lowercase()))
                .collect()
        })
        .unwrap_or_default()
}

/// Is `item` absent from `prior` (no prior item shares >50% of its significant tokens)?
fn is_new(item: &str, prior: &[String]) -> bool {
    let it = tokens(item);
    if it.is_empty() {
        return false;
    }
    !prior.iter().any(|p| {
        let pt = tokens(p);
        let shared = it.iter().filter(|w| pt.contains(*w)).count();
        (shared as f64 / it.len() as f64) > 0.5
    })
}

pub fn delta(prev: &serde_json::Value, curr: &serde_json::Value) -> Delta {
    let pc = section_texts(prev, "confirmed", "claim");
    let cc = section_texts(curr, "confirmed", "claim");
    let pf = section_texts(prev, "forks", "axis");
    let cf = section_texts(curr, "forks", "axis");
    let new_confirmed = cc.iter().filter(|c| is_new(c, &pc)).count() as u32;
    let new_forks = cf.iter().filter(|f| is_new(f, &pf)).count() as u32;
    let resolved_forks = pf.iter().filter(|f| is_new(f, &cf)).count() as u32; // prev fork gone this lap
    let curr_text = [cc.join(" "), cf.join(" "), section_texts(curr, "novel", "thing").join(" ")].join(" ");
    let prev_text = [pc.join(" "), pf.join(" "), section_texts(prev, "novel", "thing").join(" ")].join(" ");
    let nov = novelty(&curr_text, &[prev_text]);
    Delta {
        new_confirmed,
        new_forks,
        resolved_forks,
        new_refs: count_referents(&curr_text),
        echo_ratio: 1.0 - nov,
        novelty: nov,
    }
}

/// LEXICAL SPREAD: average pairwise word-overlap distance (1 - token Jaccard) across the bodies'
/// contributions this lap.
///
/// THIS IS NOT A PERSPECTIVE-DIVERSITY GAUGE, though it shipped as one. Measured 2026-08-06
/// against a controlled set — six instances answering one prompt versus six equal-length slices
/// of a single one of those instances, same file, same genre — with predictions registered
/// beforehand in `exo_memory/loop/diversity2_preregistration.md`:
///
///     six minds  0.8201        one mind  0.9162
///
/// It rated ONE MIND AS MORE DIVERSE THAN SIX. The cause is structural, not a tuning error: six
/// minds answering one question converge in wording because they are discussing the same thing,
/// while one mind moving through its own argument ranges further because it changes subject. So
/// the measure rewards TOPIC DRIFT and punishes ENGAGEMENT WITH A SHARED QUESTION — which is
/// what a committee doing its job looks like.
///
/// A second design (strip the room's shared vocabulary, normalise for length) was preregistered
/// as the fix, built, and made it slightly worse: separation -0.096 -> -0.075, still inverted;
/// Spearman against contribution length -0.553 -> -0.557, unmoved.
///
/// Kept because it is real, cheap, and occasionally interesting. Do not wire a trigger to it,
/// and do not read a low number as echo.
///
/// A THIRD design was tried on 2026-08-09 and failed too, so do not walk back down that road:
/// `tools/agreement-spread.js` measured shared REFERENTS (paths, urls, code spans, citations)
/// instead of shared words, preregistered in `exo_memory/loop/diversity3_preregistration.md`,
/// and inverted the same way — one instance chopped in two shares three times more of its
/// referents with itself (0.151) than two real panes in one lap share with each other (0.048),
/// because one mind on one task cites the same files over and over.
///
/// The conclusion is therefore broader than "not lexical": any measure that scores contributions
/// against each other WITHOUT READING WHAT THEY CLAIM lands on something adjacent — subject
/// spread, or topic persistence — and the adjacent thing keeps coming out with the wrong sign.
/// The one demonstrated signal in the record is still *same referents, opposite conclusions*, and
/// it needs a judge that reads stance; it is not reachable by arithmetic over tokens. One piece
/// did survive and is worth carrying into whatever comes next: referent identity is free of the
/// length bias that drove both lexical designs (rho 0.04, against -0.553 and -0.557).
pub fn vantage_spread(texts: &[String]) -> f64 {
    if texts.len() < 2 {
        return 1.0;
    }
    let sets: Vec<HashSet<String>> = texts.iter().map(|t| tokens(t)).collect();
    let mut total = 0.0;
    let mut pairs = 0u32;
    for i in 0..sets.len() {
        for j in (i + 1)..sets.len() {
            let (a, b) = (&sets[i], &sets[j]);
            let union = a.union(b).count();
            let inter = a.iter().filter(|w| b.contains(*w)).count();
            let jaccard = if union == 0 { 0.0 } else { inter as f64 / union as f64 };
            total += 1.0 - jaccard;
            pairs += 1;
        }
    }
    if pairs == 0 { 1.0 } else { total / pairs as f64 }
}

/// Groundedness of a lap: total external referents across its contributions. Pairs with
/// `vantage_spread` to tell a landing (low spread + grounded) from a collapse (low spread + few
/// referents). This is the "survival-under-scrutiny" read the seal/land correction asks for — a
/// number the chair reads, never a verdict.
pub fn lap_referents(texts: &[String]) -> u32 {
    texts.iter().map(|t| count_referents(t)).sum()
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    /// ARITHMETIC ONLY — this does NOT show the gauge works.
    ///
    /// It compares two hand-built strings of nine words each, where near-duplicate wording is
    /// the only difference. On inputs like that the Jaccard ratio moves a lot, so the assertion
    /// holds and always will. It was named `spread_high_for_distinct_low_for_echo` and read for
    /// months as evidence the measure detects echo. On REAL contributions it does the opposite
    /// (see the note on `vantage_spread`): six minds 0.8201, one mind 0.9162.
    ///
    /// Kept, because the arithmetic is worth pinning. Renamed, because the old name was the
    /// claim the 2026-08-06 measurement refuted, sitting inside a green test.
    #[test]
    fn jaccard_arithmetic_separates_two_short_near_duplicate_strings() {
        let distinct = vec![
            "gearing ratios and clutch engagement temperature".to_string(),
            "lunar tides and the orbital mechanics of satellites".to_string(),
        ];
        let echo = vec![
            "gearing ratios and clutch engagement matter".to_string(),
            "clutch engagement and gearing ratios matter".to_string(),
        ];
        assert!(vantage_spread(&distinct) > vantage_spread(&echo));
        assert!(vantage_spread(&echo) < 0.4);
    }

    #[test]
    fn referents_track_ground() {
        assert!(count_referents("the all-out method just feels more committed") <= 1);
        assert!(count_referents("3.42 final drive, 2.66 first gear, see ratios.md and http://x.io") >= 3);
    }

    // seal/land: a lap can converge (low spread) two opposite ways — grounded (landing) vs echo.
    // lap_referents is the discriminator; grounded convergence must out-score bare agreement.
    #[test]
    fn lap_referents_separates_landing_from_echo() {
        let grounded = vec!["3.42 final drive, see ratios.md".to_string(), "http://x.io and 12 tests".to_string()];
        let echo = vec!["it just feels right to me".to_string(), "yeah, it feels right".to_string()];
        assert!(lap_referents(&grounded) > lap_referents(&echo));
        assert_eq!(lap_referents(&echo), 0);
    }

    #[test]
    fn novelty_high_when_new_low_when_echo() {
        let prior = vec!["gearing is a chain of multipliers between engine and wheel".to_string()];
        assert!(novelty("ocean tides come from the differential lunar gravitational pull", &prior) > 0.6);
        assert!(novelty("gearing is a chain of multipliers between engine and wheel", &prior) < 0.2);
    }

    // The plan's Stage-8 check: the Delta must CORRELATE with a human diverge/echo label.
    #[test]
    fn delta_reads_diverge_as_more_novel_than_echo() {
        let lap1 = json!({"confirmed":[{"claim":"the gate must default to act"}],"forks":[{"axis":"speed vs control"}],"novel":[]});
        let echo = lap1.clone();
        let diverge = json!({
            "confirmed":[{"claim":"aggregate coercion needs a global rate bound"}],
            "forks":[{"axis":"human-routed edge classification"}],
            "novel":[{"thing":"the forged-triangulation vector"}]
        });
        let d_echo = delta(&lap1, &echo);
        let d_div = delta(&lap1, &diverge);
        assert!(d_div.novelty > d_echo.novelty, "diverge lap should read more novel than an echo lap");
        assert!(d_div.new_confirmed >= d_echo.new_confirmed);
        assert!(d_echo.echo_ratio > d_div.echo_ratio);
    }
}
