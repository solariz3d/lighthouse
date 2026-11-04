
#[cfg(test)]
mod d074_print_rows {
    use super::*;
    #[test]
    fn print_rows() {
        let mk = |v: &[Composer]| { let mut r = Reads::default(); for c in v { r.note(*c); } r };
        let nr = Composer::Unreadable(Unreadable::NoRow);
        let cases: Vec<(&str, PaneGate, Forced, Reads)> = vec![
            ("all text", PaneGate::Ready, Forced::SignalOutranked, mk(&[Composer::HasText; 960])),
            ("all unreadable", PaneGate::Ready, Forced::SignalOutranked, mk(&[nr; 960])),
            ("mixed", PaneGate::Ready, Forced::SignalOutranked, mk(&[Composer::HasText, nr, Composer::HasText, nr, Composer::HasText])),
            ("no stamp", PaneGate::Unstamped, Forced::NoUsableSignal, mk(&[Composer::Empty, Composer::HasText, nr])),
            ("contradicted", PaneGate::Contradicted, Forced::SignalContradicted, mk(&[Composer::Unreadable(Unreadable::NoScreen); 2])),
        ];
        for (name, g, f, r) in cases {
            println!("ROW {name}: {}", delivery_note_with(g, Some(f), Some(&r)));
        }
        println!("ROW old outranked: {}", delivery_note(PaneGate::Ready, Some(Forced::SignalOutranked)));
        println!("ROW old contradicted: {}", delivery_note(PaneGate::Contradicted, Some(Forced::SignalContradicted)));
    }
}
