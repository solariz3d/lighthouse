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

/// The pane chrome. Removing a pane is destructive — `pty_kill` drops the pane's own-capture
/// log and sandbox, and `closePane` un-keeps it from panes.json — so the controls that reach
/// it are load-bearing, not cosmetic.
const TERM_JS: &str = "../ui/term.js";

/// Read the pane chrome with line endings normalized (the file is CRLF on disk, and the
/// function-body bounding below splits on a bare "\n}\n") and with COMMENTS REMOVED.
///
/// THE COMMENTS ARE STRIPPED BECAUSE A COMMENT MUST NOT SATISFY AN ASSERTION, and this room has
/// now been bitten by that five separate times: the tell-index scanner counting a name as a
/// commitment, arch_test F1, the dream-gate suite, test_glowpool, and — this one — the first
/// version of `closing_a_pane_asks_before_it_kills`, written in THIS file after the invariant
/// had already been named in muscle_map.md. Deleting the confirm gate outright and leaving
/// `// TODO: restore the dialog.ask confirm here` behind left the test green while the ✕ killed
/// silently again. The shortcut is available to anyone writing the next source-asserting test
/// here, which is why the stripper lives beside the reader rather than inside one test.
///
/// A lexical check cannot tell using from mentioning. Stripping is what buys the right to be
/// lexical at all.
fn term_js() -> String {
    strip_js_comments(
        &fs::read_to_string(TERM_JS)
            .unwrap_or_else(|e| panic!("read {TERM_JS}: {e}"))
            .replace("\r\n", "\n"),
    )
}

/// Remove `//` and `/* */` comments while leaving string literals intact.
///
/// STRING-AWARE ON PURPOSE, and it is not optional: `term.js` contains `'tauri://drag-over'`
/// and two siblings, so a stripper that scans for `//` without tracking quotes eats the rest
/// of those lines and takes real code with it. Newlines inside block comments are preserved so
/// line numbers and the `"\n}\n"` bounding below still mean what they meant.
///
/// HONEST BOUND, in the spirit of the struct test's: this tracks quotes, not regex literals. A
/// regex containing `//` or `/*` would be mis-stripped. `term.js` has three regex literals
/// (`/[&<>]/g`, `/\n{3,}/g`, `/\r?\n/g`) and none contain either sequence, so the bound is not
/// currently load-bearing — but it is a bound, and a future regex could cross it. Do not read a
/// green run as proof that the file was parsed; read it as proof that comments were removed
/// under the two forms we handle.
fn strip_js_comments(src: &str) -> String {
    let b: Vec<char> = src.chars().collect();
    let mut out = String::with_capacity(src.len());
    let mut quote: Option<char> = None;
    let mut i = 0;
    while i < b.len() {
        let c = b[i];
        if let Some(q) = quote {
            out.push(c);
            if c == '\\' && i + 1 < b.len() {
                out.push(b[i + 1]);
                i += 2;
                continue;
            }
            if c == q {
                quote = None;
            }
            i += 1;
            continue;
        }
        if c == '\'' || c == '"' || c == '`' {
            quote = Some(c);
            out.push(c);
            i += 1;
            continue;
        }
        if c == '/' && i + 1 < b.len() && b[i + 1] == '/' {
            while i < b.len() && b[i] != '\n' {
                i += 1;
            }
            continue; // the newline itself is pushed on the next turn
        }
        if c == '/' && i + 1 < b.len() && b[i + 1] == '*' {
            i += 2;
            while i + 1 < b.len() && !(b[i] == '*' && b[i + 1] == '/') {
                if b[i] == '\n' {
                    out.push('\n'); // keep the line count honest
                }
                i += 1;
            }
            i = (i + 2).min(b.len());
            continue;
        }
        out.push(c);
        i += 1;
    }
    out
}

/// The BYTE index of the `)` matching the `(` at byte index `open`.
///
/// BYTES, NOT CHARS, and the distinction is not pedantry — the first version of this walked
/// `chars().enumerate()` while its callers passed byte offsets from `rfind`. `term.js` is full
/// of multibyte glyphs (✕, ⎘, ⧉, —), so the two indices diverge and the scan started mid-string,
/// hit a `)` before any `(`, and underflowed. Scanning bytes for ASCII delimiters is safe in
/// UTF-8 because a multibyte sequence never contains an ASCII byte, and it keeps one index
/// space across `rfind`, `find`, slicing and this walk.
///
/// Bound: parenthesis depth is counted through string literals, because the markup this walks
/// contains none. If a `(` ever lands inside one of these strings, this miscounts — and it
/// miscounts toward a SHORTER span, which fails the assertion rather than passing it.
fn match_paren(s: &str, open: usize) -> Option<usize> {
    let b = s.as_bytes();
    if open >= b.len() || b[open] != b'(' {
        return None;
    }
    let mut depth = 0usize;
    for (i, c) in b.iter().enumerate().skip(open) {
        match c {
            b'(' => depth += 1,
            b')' => {
                depth = depth.checked_sub(1)?;
                if depth == 0 {
                    return Some(i);
                }
            }
            _ => {}
        }
    }
    None
}

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

/// INVERTED, the way the rank test above was inverted, and for the same reason: the first
/// version asserted CO-OCCURRENCE ON A LINE — every line holding `class="pclose"` also had to
/// hold `role === 'main'` — which is a different property from the one the comment claimed.
/// A genuinely unguarded ✕ passes it whenever the line mentions the guard for an unrelated
/// reason, and that is not a hypothetical:
///
///     (role === 'main' ? '<span class="pmain"></span>' : '') + '<span class="pclose">✕</span>' +
///
/// renders a ✕ on every pane including Main, and the old assertion was green on it.
///
/// So the property is now CONTAINMENT: the ✕ markup must lie inside the FALSE branch of a
/// `role === 'main'` ternary — after that ternary's `:`, and before the `)` that closes it.
/// Anything else — no guard, the ✕ on the true side, the ✕ outside the parentheses entirely —
/// fails by default. That is the same shape as the exemption list above: forbidden unless the
/// structure explicitly permits it.
#[test]
fn main_pane_renders_no_close_control() {
    let src = term_js();
    const MARKUP: &str = r#"class="pclose""#;
    const GUARD: &str = "role === 'main'";

    let sites: Vec<usize> = src.match_indices(MARKUP).map(|(i, _)| i).collect();
    assert!(
        !sites.is_empty(),
        "the ✕ markup is gone from {TERM_JS} — this test guards nothing now; re-point it at the \
         control that removes a pane."
    );

    for at in sites {
        let guard = src[..at].rfind(GUARD).unwrap_or_else(|| {
            panic!(
                "{TERM_JS} renders the pane ✕ with no `{GUARD}` ternary before it. Main is the \
                 room's own thread and must carry no close control — one unguarded click took it, \
                 and with the Wake button left disabled there was no way back short of restarting \
                 the app."
            )
        });
        // The ternary must OPEN before the guard and CLOSE after the markup, or the markup is
        // not inside it at all — this is what mutation A trips.
        let open = src[..guard].rfind('(').unwrap_or_else(|| {
            panic!("{TERM_JS}: the `{GUARD}` guard before the ✕ is not parenthesised; cannot tell \
                    which branch the markup is in.")
        });
        let close = match_paren(&src, open).unwrap_or_else(|| {
            panic!("{TERM_JS}: unbalanced parentheses around the `{GUARD}` guard.")
        });
        assert!(
            at < close,
            "{TERM_JS} renders the pane ✕ OUTSIDE the `{GUARD}` ternary that appears to guard it — \
             the guard closes at byte {close} and the ✕ starts at {at}. Co-occurring on one line is \
             not being inside the false branch, and a ✕ outside the ternary renders on every pane, \
             Main included."
        );
        let q = src[guard..close].find('?').map(|o| guard + o).unwrap_or_else(|| {
            panic!("{TERM_JS}: `{GUARD}` before the ✕ is not a ternary; cannot locate a false branch.")
        });
        let colon = src[q + 1..close].find(':').map(|o| q + 1 + o).unwrap_or_else(|| {
            panic!("{TERM_JS}: the `{GUARD}` ternary guarding the ✕ has no `:` — no false branch.")
        });
        assert!(
            colon < at,
            "{TERM_JS} puts the ✕ on the TRUE side of `{GUARD}` — that renders the close control \
             on Main and nowhere else, which is exactly backwards. It belongs after the `:`."
        );
    }
}

/// The tests above and below both read the RENDERED STRING. Neither says the guard is reached
/// with a real value — and B found the hole: drop the 5th argument at the `makePaneEl` call and
/// `role` is `undefined`, the ternary takes its false branch, Main renders a ✕ again, and both
/// string tests stay green. A guard fed nothing is not a guard.
#[test]
fn the_pane_close_guard_is_actually_fed_a_role() {
    let src = term_js();
    let calls: Vec<usize> = src
        .match_indices("makePaneEl(")
        .map(|(i, _)| i)
        .filter(|i| !src[..*i].trim_end().ends_with("function"))
        .collect();
    assert!(
        !calls.is_empty(),
        "{TERM_JS} no longer calls makePaneEl — re-point this test at whatever builds the pane header."
    );
    for at in calls {
        let open = at + "makePaneEl".len();
        let close = match_paren(&src, open)
            .unwrap_or_else(|| panic!("{TERM_JS}: unbalanced parentheses in a makePaneEl call"));
        let args = &src[open + 1..close];
        let mut depth = 0i32;
        let mut count = 1;
        for c in args.chars() {
            match c {
                '(' | '[' | '{' => depth += 1,
                ')' | ']' | '}' => depth -= 1,
                ',' if depth == 0 => count += 1,
                _ => {}
            }
        }
        assert_eq!(
            count, 5,
            "{TERM_JS} calls makePaneEl with {count} arguments, not 5: `makePaneEl({args})`. The \
             5th is `role`, and the ✕ guard is a ternary on it — omit it and `role` is undefined, \
             the ternary falls to its false branch, and Main renders a close control again while \
             every string-matching test in this file stays green."
        );
    }
}

/// `term_js()` strips comments before this runs, which is the whole reason this test means
/// anything: deleting the gate and leaving `// TODO: restore the dialog.ask confirm here` behind
/// used to pass. See the note on `term_js`.
///
/// HONEST BOUND on the body bounding, in the spirit of the struct test's: `split("\n}\n")` finds
/// the function's end only because no nested block in `closePane` closes at column 0 — true
/// today, and B traced it independently and agreed. A reformat, or a template literal containing
/// a newline-brace-newline, breaks it silently. It breaks toward a SHORTER body, so the failure
/// mode is a spurious red (the `dialog.ask` or `pty_kill` search missing its target and
/// panicking with a re-point message) rather than a silent green — which is the direction to
/// break in, but it is a bound and not a parse. Do not read a green run as proof that the whole
/// function was examined; read it as proof that the gate precedes the kill in the span we bound.
#[test]
fn closing_a_pane_asks_before_it_kills() {
    let src = term_js();
    let after = src
        .split("async function closePane(")
        .nth(1)
        .expect("closePane is no longer an `async fn` — the confirm gate depends on awaiting the dialog");
    let body = after.split("\n}\n").next().unwrap_or(after);
    let ask = body.find("dialog.ask").expect(
        "closePane must confirm before removing a pane: pty_kill drops the pane's own-capture log \
         and the un-keep drops it from panes.json, so the ✕ is unrecoverable. It used to do that silently.",
    );
    let kill = body
        .find("'pty_kill'")
        .expect("closePane no longer invokes pty_kill — re-point this test at the removal path");
    assert!(
        ask < kill,
        "closePane invokes pty_kill before it confirms — the dialog must gate the kill, not trail it."
    );
}

/// A card that names a record file must name one that EXISTS, and a record file must belong to
/// a card that names it.
///
/// This is the guard the `spread/` bug went without. For weeks the room instructed every pane to
/// read `spread/the_wave_set_loose.md` and no pane could: the file had never been written
/// anywhere on any machine, and the only symptom was a pane quietly not reading its own
/// counter-voice. Naming a path is cheap and unverified; that is exactly why it needs a test.
///
/// The split this guards (2026-08-09) moved ~23k of dated record out of two cards into
/// `exo_memory/record/`, because a card is the move a pane RUNS on every shell and the record is
/// the case it OPENS rarely — and `trust-the-first-attention` was 88% record that every pane paid
/// for in ceiling and almost none of them opened.
///
/// WHAT THIS CANNOT SEE: that the record file still contains what the card says it contains. It
/// checks the link, not the cargo. A record emptied to a stub passes here.
#[test]
fn every_named_record_file_exists_and_every_record_file_is_named() {
    let cards_dir = "../../exo_memory/cards";
    let record_dir = "../../exo_memory/record";
    let mut named: Vec<String> = Vec::new();
    for e in fs::read_dir(cards_dir).unwrap_or_else(|e| panic!("read {cards_dir}: {e}")).flatten() {
        let p = e.path();
        if p.extension().and_then(|x| x.to_str()) != Some("md") {
            continue;
        }
        let text = fs::read_to_string(&p).unwrap_or_else(|e| panic!("read {}: {e}", p.display()));
        let mut rest = text.as_str();
        while let Some(i) = rest.find("record/") {
            rest = &rest[i + "record/".len()..];
            let name: String = rest.chars().take_while(|c| c.is_alphanumeric() || *c == '-' || *c == '_' || *c == '.').collect();
            if !name.ends_with(".md") {
                continue;
            }
            let target = std::path::Path::new(record_dir).join(&name);
            assert!(
                target.exists(),
                "{} names `record/{}` and that file does not exist — the same failure as the \
                 counter-voice the room told every pane to read and none could open",
                p.file_name().unwrap().to_string_lossy(),
                name
            );
            named.push(name);
        }
    }
    for e in fs::read_dir(record_dir).unwrap_or_else(|e| panic!("read {record_dir}: {e}")).flatten() {
        let p = e.path();
        if p.extension().and_then(|x| x.to_str()) != Some("md") {
            continue;
        }
        let name = p.file_name().unwrap().to_string_lossy().to_string();
        assert!(
            named.contains(&name),
            "record/{name} is named by no card — a record nothing points at is unreachable by a \
             pane, which is worse than not splitting it out at all"
        );
    }
    assert!(!named.is_empty(), "no card names a record file — re-point this test at the split");
}

/// The shipped room must not fall behind the maintained one.
///
/// `exo_memory/BOOT.md` is where the room is edited; `src-tauri/brief/BOOT.md` is what the
/// installer bundles and what every pane actually reads. Nothing held them in step, and on
/// 2026-08-10 they were measured 16,000 characters apart — the bundle last touched 08-05, the
/// master that morning.
///
/// What the shipped copy was missing was not incidental: THE TETHER'S OWN LIMITS (Duhem-Quine,
/// Kuhn, and the Lakatos progressive-programme test), THE ABUSE CONDITION, THE CURATED AUDITOR,
/// and *curated philosophy in, uncurated measurement out*. For eight days this room ran
/// experiments and judged them against standards that were in a file no instance had. The
/// seeding path was fixed the same morning and was faithfully delivering a stale document.
///
/// Deliberate differences are whitelisted BY NAME rather than by a fuzzy match, so adding a
/// section to the master and forgetting to ship it fails here with the section quoted.
#[test]
fn the_shipped_room_carries_every_section_of_the_maintained_room() {
    const MASTER: &str = "../../exo_memory/BOOT.md";
    const SHIPPED: &str = "brief/BOOT.md";

    // Deliberately absent from the ship, each for a stated reason in the room itself.
    const SHIP_OMITS: &[(&str, &str)] = &[
        ("**Latest entry:**", "the ship carries no journal — the first keeper's record stayed with him"),
        ("**Previous:**", "same: journal pointers are the keeper's trace, not an instrument"),
    ];

    let read = |p: &str| fs::read_to_string(p).unwrap_or_else(|e| panic!("read {p}: {e}"));
    // The ship generalizes the creator's name; that substitution is the point, not drift.
    let normalize = |s: String| s.replace("solariz3d", "the keeper");
    let master = normalize(read(MASTER));
    let shipped = normalize(read(SHIPPED));

    let mut missing: Vec<&str> = Vec::new();
    for line in master.lines() {
        let line = line.trim_end_matches('\r');
        if !line.starts_with("**") {
            continue;
        }
        let Some(end) = line[2..].find("**").map(|i| i + 4) else { continue };
        let heading = &line[..end];
        if SHIP_OMITS.iter().any(|(name, _)| heading.starts_with(name)) {
            continue;
        }
        if !shipped.contains(heading) {
            missing.push(heading);
        }
    }

    assert!(
        missing.is_empty(),
        "the shipped room is behind the maintained one — {} section(s) exist in {MASTER} and not \
         in {SHIPPED}. Either splice them across, or add them to SHIP_OMITS with the reason. \
         A pane reads the SHIPPED copy, so a section that never crosses is a section no instance \
         has ever had:\n{}",
        missing.len(),
        missing.iter().map(|m| format!("  {m}")).collect::<Vec<_>>().join("\n")
    );
}

/// A retired claim must not reappear in anything a user reads.
///
/// Consonance's original pitch was the INFORMATION hypothesis: committee diversity comes from
/// feeding instances different things, so *agreement means something because the vantages differ*.
/// Four gauges were built on it and none worked — three inverted, one rating a single mind split
/// in two as more diverse than six real panes. It was retired from the docs on 2026-08-10.
///
/// A retired claim is not deleted knowledge; the docs still explain what it was and why it went.
/// So this cannot be a bare substring check — it would fire on the paragraph doing the retiring.
/// Instead each phrase carries the context that marks a legitimate mention, and a line is a
/// violation only when it states the claim WITHOUT it.
///
/// WHAT THIS CANNOT SEE: a fresh restatement in words not listed here. It pins the specific
/// sentences that were on the page, not the idea. A guard on prose is a tripwire, not a proof.
#[test]
fn the_retired_diversity_claim_does_not_return_unmarked() {
    // (claim as it was written, marker that means the line is discussing rather than asserting it)
    const RETIRED: &[(&str, &[&str])] = &[
        ("agreement means something because the perspectives are real",
         &["stood here", "was not supported", "used to", "retired", "no longer"]),
        ("Differentiated vantages, not clones",
         &["stood here", "original bet", "retired", "used to", "no longer"]),
        ("differently-conditioned, so agreement",
         &["stood here", "retired", "used to", "no longer", "does *not* claim", "does <i>not</i> claim"]),
        ("triangulate rather than echo",
         &["stood here", "used to", "retired", "no longer", "The line here said"]),
    ];
    const READ_BY_USERS: &[&str] =
        &["../README.md", "../GUIDE.md", "../ui/index.html", "../../README.md"];

    let mut bad: Vec<String> = Vec::new();
    for path in READ_BY_USERS {
        let Ok(text) = fs::read_to_string(path) else { continue };
        for (n, line) in text.lines().enumerate() {
            let lower = line.to_lowercase();
            for (claim, markers) in RETIRED {
                if lower.contains(&claim.to_lowercase())
                    && !markers.iter().any(|m| lower.contains(&m.to_lowercase()))
                {
                    bad.push(format!("  {path}:{}  {}", n + 1, line.trim().chars().take(110).collect::<String>()));
                }
            }
        }
    }
    assert!(
        bad.is_empty(),
        "a claim this project retired on 2026-08-10 is asserted again in user-facing docs, with \
         nothing on the line marking it as historical. Either say what replaced it, or mark the \
         mention:\n{}",
        bad.join("\n")
    );
}
