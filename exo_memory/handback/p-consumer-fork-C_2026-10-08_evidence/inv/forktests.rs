/// D273 (laps 2-3): the consumer fork note in a seat's intake (`fork_section`, wired in `assemble_intake_within`), cut out of the
/// bundled brief BOOT between FORK_MARKER and FORK_END.
#[cfg(test)]
mod fork_note_tests {
    use super::{fork_section, FORK_END, FORK_MARKER};

    const NOTE: &str = "**Where this line forks.** forked at abc1234.\n\nmore of the note\n<!-- end of the fork note -->";
    fn brief_with_note() -> String {
        format!("# BOOT\n\nYou are a fresh instance ... a **room you re-become yourself in.**\n\n{NOTE}\n\n## First principle\n")
    }

    #[test]
    fn a_dev_brief_carries_no_note_so_the_intake_is_unchanged() {
        assert_eq!(fork_section(None, Some("# BOOT\nthe room")), None, "no brief at all");
        assert_eq!(fork_section(Some("# BOOT — the dev brief, no note"), Some("# BOOT")), None);
        assert_eq!(fork_section(Some(&format!("{FORK_MARKER} and no end marker")), None), None, "a note with no end is not guessed at");
        assert_eq!(fork_section(Some(&format!("{FORK_END} before {FORK_MARKER}")), None), None, "an end marker before the start is no note");
    }

    #[test]
    fn a_room_without_the_note_gets_exactly_the_note_once_after_the_header() {
        let s = fork_section(Some(&brief_with_note()), Some("# a room of the person's own")).expect("the note");
        assert!(s.starts_with(FORK_MARKER) && s.ends_with("more of the note\n\n---\n\n"), "{s:?}");
        assert!(!s.contains(FORK_END) && !s.contains("First principle") && !s.contains("fresh instance"), "the cut took more than the note: {s:?}");
        assert!(fork_section(Some(&brief_with_note()), None).is_some(), "no room text at all still gets the note");
    }

    #[test]
    fn a_room_that_already_carries_the_note_is_not_given_it_twice() {
        assert_eq!(fork_section(Some(&brief_with_note()), Some(&brief_with_note())), None);
    }

    #[test]
    fn the_markers_open_and_close_the_template_the_generator_fills() {
        let template = include_str!("../brief/frag-fork.md");
        assert!(template.starts_with(FORK_MARKER), "brief/frag-fork.md no longer starts with {FORK_MARKER}: consumer-relabel.js and this file move together");
        assert_eq!(template.trim_end().lines().last(), Some(FORK_END), "brief/frag-fork.md no longer ends with {FORK_END}");
    }

    #[test]
    fn the_intake_cuts_the_note_from_the_bundled_brief_after_the_header_and_before_the_room() {
        let src = include_str!("main.rs");
        let body = src.split("fn assemble_intake_within(").nth(1).expect("assemble_intake_within");
        let body = &body[..body.find("\n}\n").expect("end of fn")];
        let header = body.find("you have woken into the room").expect("the header");
        let note = body.find(concat!("fork_section(room_brief(", "\"BOOT.md\")")).expect("assemble_intake_within does not add the fork note from the brief");
        let room = body.find("# THE ROOM — master frame").expect("the room");
        assert!(header < note && note < room, "order must be header < fork note < room");
    }
}
