// D424 mutant rows for consonance/src-tauri/src/pane_exit.rs (seat A), for consonance/tools/mutant-harness.js.
// Scored by the pane_exit modules (pane_exit::tests, pane_exit_wiring_tests) and the inbox rows (composer_tristate_tests).
module.exports = {
  label: 'd424-pane_exit',
  repo: 'C:/Users/nname/Downloads/lh-d424-a',
  rel: 'consonance/src-tauri/src/pane_exit.rs',
  score: { cmd: require('path').join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe'), args: ['test', '--bin', 'consonance', '--', 'pane_exit', 'composer_tristate_tests'], cwd: 'consonance/src-tauri' },
  rows: [
    ['P1 a committee pane is prompted again (the old rule)', '    if seat == Seat::Human {\n        return ExitAction::Prompt;\n    }', '    if seat != Seat::Fixed {\n        return ExitAction::Prompt;\n    }'],
    ['P2 a human pane is reopened', '    if seat == Seat::Human {\n        return ExitAction::Prompt;\n    }', '    if false {\n        return ExitAction::Prompt;\n    }'],
    ['P3 the once is not kept', 'if auto_reopened.insert(pane.to_string()) { ExitAction::ReopenOnce } else { ExitAction::ExitedAgain }', '{ auto_reopened.insert(pane.to_string()); ExitAction::ReopenOnce }'],
    ['P4 an exited pid is never refused', '(Liveness::Exited { .. }, Some(e)) => ExitGate::Refuse(*e),', '(Liveness::Exited { .. }, Some(_)) => ExitGate::Open,'],
    ['P5 a running reopen refuses instead of holding', '(Liveness::Exited { .. }, _) if reopening.contains(pane) => ExitGate::AwaitReopen,', '(Liveness::Exited { .. }, _) if false => ExitGate::AwaitReopen,'],
    ['P6 the exit gate ignores the pid the map holds', 'match (liveness(exits, pane, current_pid), exits.get(pane)) {', 'match (liveness(exits, pane, exits.get(pane).and_then(|e| e.pid)), exits.get(pane)) {'],
    ['P7 a timeless stamp passes for the new child', 'stamp_at_ms.map_or(true, |s| s < r)', 'stamp_at_ms.map_or(false, |s| s < r)'],
    ['P8 the stamp comparison is flipped', 'stamp_at_ms.map_or(true, |s| s < r)', 'stamp_at_ms.map_or(true, |s| s > r)'],
    ['P9 a pane never reopened loses its stamp', '        None => false,\n        Some(r) => stamp_at_ms', '        None => true,\n        Some(r) => stamp_at_ms'],
    ['P10 the chair is not a sender', '    if text.starts_with("[chair:MAIN] ") {\n        return Some("M");', '    if text.starts_with("[chair:MAIN] ") {\n        return None;'],
    ['P11 any text is a pane letter', '(!letter.is_empty() && letter.chars().all(|c| c.is_ascii_alphanumeric())).then_some(letter)', '(!letter.is_empty()).then_some(letter)'],
    ['P12 the refusal row reads DELIVERED', '"REFUSED NOT DELIVERED -> {short} ({when};', '"DELIVERED -> {short} ({when};'],
    ['P13 the refusal note carries a sender', '"[delivery, from the app — not the keeper] REFUSED: your message', '"[chair:MAIN] REFUSED: your message'],
    ['P14 the exit code is not named', 'Some(c) => format!("its claude process exited by itself (exit code {c}) at {}", utc_clock(e.at_ms)),', 'Some(_) => format!("its claude process exited by itself at {}", utc_clock(e.at_ms)),'],
    ['P15 the exit time is not named', 'format!("{:02}:{:02}:{:02}Z", (s / 3600) % 24, (s / 60) % 60, s % 60)', 'String::from("an unknown time")'],
    ['P16 a lettered sender is told', 'Some(letter) => Recipient::NotTold(letter),', 'Some(letter) => Recipient::Tell(letter),'],
    ['P17 a new session keeps the dead child\'s exit', '    exits.remove(pane);\n', '    let _ = &exits;\n'],
    ['P18 a new session records no reopen time', '    reopened_at.insert(pane.to_string(), now_ms);', '    let _ = (&reopened_at, now_ms);'],
  ],
};
