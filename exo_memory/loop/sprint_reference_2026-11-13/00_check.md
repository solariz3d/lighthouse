# Second reader: check of six sprint-reference files (2026-11-13)

Each source was downloaded again into
`C:/Users/zackn/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/sprint/check/<key>/`
and read there. Scripts are in `.../check/_scripts/` (my own C3D reader, table and figure extractors). Details are in
the "Second reader" section at the end of each file. Counts are approximate: one table cell = one number.

| file | numbers checked | numbers wrong | definitions wrong | other |
|---|---|---|---|---|
| simtk_dorn_running.md | ~150 (63 timing cells re-derived from EVENT.TIMES and markers, 44 elbow cells, C3D parameters, static trial, model ranges, PubMed) | 0 | 0 | ankle axis filled in (oblique Delp axis); note that the ankle at 10-20 % of the stride moves up to ~10 deg with the method |
| miyashiro2019.md | ~90 (Table 1, Table 4 Condition A, 4 re-evaluated equations, methods) | 0 | 0 | 2 notes: R2 > 0.13 rule is in the Methods p.3; authors call the hip-at-toe-off change negligible |
| bissas2021.md | ~130 (Table 1 rebuilt column by column, methods, % and P values) | 0 | 0 | 1 mark struck: "no markers" was tagged [read, §6] but §6 says only that force plates were impossible |
| bezodis2019.md | ~110 (Tables 1-2, manuscript lines, 32 Fig 4 cells, 20 Fig 2-3 cells, Crossref) | 0 | 0 | none |
| schache2011.md | ~55 (participants, methods, Table 1 swing and stance values, 4 toe-off positions re-measured from tick marks) | 0 | 0 | none |
| nagahara2014.md | ~140 (Tables 1-2, results text, 66 Fig 6 cells, Fig 4 and 5 reads, methods) | 0 | 0 | none |

Not checked by me: SimTK's 3D Cardan values as such (checked by a varied 2D method instead), the paper behind the
SimTK data (not obtainable), Schache SDC1/SDC2, Bissas Table 2 row by row, Miyashiro Supplementary Table 1.
