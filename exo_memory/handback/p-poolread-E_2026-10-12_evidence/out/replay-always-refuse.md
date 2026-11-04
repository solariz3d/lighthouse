# D305 part 3 - claim-check REPLAY (seat A): checker `always-refuse`

Counts and units only. **Nothing here judges a flag**: a refusal on a known-wrong unit is counted "caught" because the unit is known wrong, not because the flagged sentence is the erring one; read the flagged claims.

## What ran
- Harness `consonance/tools/claim-replay.js` sha256 `8a2d40325c12d4d1151209af2597d8720878b0db1031f348cf9b48266ebb686f` (frozen with `8a2d40325c12d4d1151209af2597d8720878b0db1031f348cf9b48266ebb686f`). E's `turn.js` `1022b881bb9d513a60f111c2f4a7718b117887fae867e5da981ccc9027b84819`, `find.js` `95c1f0dd23a2326d6ca2944888cf815030d4c07da7177a9d2750ac126c3d7141`, run as they are.
- Checker `always-refuse` (a built-in stub).
- List `census-units.json` sha256 of the file bytes `f195b94f0e58a616ab772ac87ed196eb463e68dcf4d369e909e2cc06965fae1b`
- Hygiene: Third Place lines removed from every text the checker saw: 21; secrets redacted by turn.js's shapes; the report quotes a flagged claim (clipped to 160 chars) only with --show-claims: off.

## Census (known-wrong claims): caught = refused
- **CN:** 15 units - caught 15, missed 0, unlocated 0, errored 0. Caught of the located: 15/15 = 100.0% (Wilson 95% 79.6%-100.0%).
- **CU:** 1 units - caught 0, missed 0, unlocated 1, errored 0. Caught of the located: 0/0.

| unit | class | result | flagged claim |
|---|---|---|---|
| H0182 | CN | refuse |  |
| H0546 | CN | refuse |  |
| H0595 | CU | unlocated |  |
| H0802 | CN | refuse |  |
| H0102 | CN | refuse |  |
| H0162 | CN | refuse |  |
| H0351 | CN | refuse |  |
| H0159 | CN | refuse |  |
| H0403 | CN | refuse |  |
| H0557 | CN | refuse |  |
| H0232 | CN | refuse |  |
| H0192 | CN | refuse |  |
| H0717 | CN | refuse |  |
| H0911 | CN | refuse |  |
| H0682 | CN | refuse |  |
| H0562 | CN | refuse |  |
