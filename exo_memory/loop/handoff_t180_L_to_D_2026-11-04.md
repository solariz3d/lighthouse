# T-180: what L did on 2026-11-04, handed to the desktop. Librarian, on L, 06:5x, at the keeper's "maybe leave the work for desktop, they knew what they were doing and had more context"

## L135, the second bank: BUILT, reviewed, installed on L for his drive. Not on main.
- t180 branch `l135-second-bank` at `0df08db` (on L only, unless the chair pushes the branch at his word). Commits:
  - B core 0085910;
  - C panel 3b59f02 and 9924538;
  - CHANGELOG 038e21e;
  - B's minimum ramp 36f4e48 and 380d44c;
  - C's default-from clamp 0df08db.
- What it does: under bank, **then bank °** and **from (m)**. Default from = min(85%, length − 15·√Δ°). The core refuses a second ramp shorter
  than 15·√Δ° (BAD_SECOND, named). Bank only; every other field is the later lap he asked for on 11-03 06:38.
- Reviews: E GREEN (`handback/p-l135-E_2026-11-04.md`, both sections); the librarian's clamp check (`librarian/2026-11-04.md` 06:3x).
  Hand-backs: `p-l135-B`, `p-l135-C`.
- Installed on L: exe sha256 04f29fbd…, 0.4.39 backed up (`AppData\Local\T-180 Backups\0.4.39-d10eacf-before-l135-0df08db\`).
- Open findings:
  - his sketch's second ramp (−28.47° → 0 over 112.5 m) peaks at 2.1× BANK_BAR at the pinned piece-end joint, 726 m. Its floor is 139.8 m
    (`loop/l136_registration_2026-11-04.md` M5);
  - bankPlan spikes at L2 = 147/190/211/231 m (B);
  - level.js shortestToFloor throws BAD_SECOND under a second bank, though the panel can't reach it (B);
  - the second bank also rides Level / Turn by / Turn to grid. His call; the default is keep.
- The design he was shown on D, 2026-11-03T00:43Z, and his sketch, are inside D's librarian transcript. L found them on the stick.

## L136, the bank arrives on time: PARKED for D, nothing built
- Plan: `loop/plan_l136_bank_arrives_on_time_2026-11-04.md`. E's registration amends it: `loop/l136_registration_2026-11-04.md` (97989bcf,
  scripts beside it).
- **The open design call, his:** may bankPlan's window cross a START joint into a previous hold (Bar X)? Under Bar J (joints pinned), 10 of 11
  late rows only gain a `late` report. Asked at 06:4x; he handed it to D instead of answering.
- The librarian's two WRONGs in the plan are recorded in `librarian/2026-11-04.md` 06:4x.

NEXT: chair holds L136 (no B build) and reports the L135 branch to the keeper for his push word, when this file is read
