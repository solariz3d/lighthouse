# D552: the ramp between B and C, laid and rendered beside F. Librarian, 2026-10-30 16:4x

The user, 16:32, on the D550 page: "maybe between B and C?" B is the quick rise / long fade shape (aRise 0.1, aFall 0.9) over 151 m; C is the same shape over 500 m. Between them is the same shape over a middle length. F on the page (a 20 m rise, then a fade over 300 m, done by 235 m) is already close to that; the difference is whether the rise is a tenth of the ramp (30 m at 300 m) or a fixed 20 m. This lap lays the literal "between" so he compares it with F and says which.

## Part 1 (pane E, PROVE IT for the shape, on the d550-e branch df8e440)

Candidate G: aRise 0.1 / aFall 0.9 over 300 m on his piece (1,000 m straight, then 1,000 m at bank -41.38 with the start box ticked, cup 15.5, width 31). The same rows as D550 §7: lean at 10 / 20 / 50 / 100 / 200 m, done-by, peak roll and where, kink (the rate's largest change over 2 m), the checker's roll read; and the same for 20° and 54° in the tables only. The ramp harness whole only if any production code moves; if G is a parameter of what df8e440 already has, say so and run the ramp tests once. Hand-back `p-d552-rampG-E_2026-10-30.md`.

## Part 2 (pane O, CHECK IT, after E)

The three glass renders of G with handles off, the D550 rig at 2ca43d2 plus E's branch: cam1 60 m before the joint looking along, cam2 200 m past looking back, cam3 overhead 150 m. Same lighting and size as the eighteen on the page. Hand-back `p-d552-renders-O_2026-10-30.md` with the three PNG paths.

From me: G added to the page beside F (tab, rows, the numbers); the user looks and says G, F, or a length.

Then, on his word: E lays the chosen shape as the "at start" default (its rows, the panel's start spread), C builds and installs for his look, and 0.4.31 follows with the whole queue finished (his 16:32: "lets finish all work on queue before the next release").

Falsifier (D550's, unchanged): if he looks at G beside F and says neither, the next move is a live handle in the app ("bank over ... m", or a drag on the ghost), not an eighth candidate.

surfaced: plan_d550 (the candidates table), p-d550-ramp-E_2026-10-30.md §7 (B and C's rows), p-d550-renders-O (the rig at 2ca43d2), the D550 page index.html (the F row and tab).
