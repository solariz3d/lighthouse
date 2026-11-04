# D305 part 3 - claim-check REPLAY (seat A): checker `never-refuse`

Counts and units only. **Nothing here judges a flag**: a refusal on a known-wrong unit is counted "caught" because the unit is known wrong, not because the flagged sentence is the erring one; read the flagged claims.

## What ran
- Harness `consonance/tools/claim-replay.js` sha256 `6368e1b0c25f7ea8ceb8dcd29cca7036c50c1c47bb70e19b5d284275473c2f05` (frozen with `6368e1b0c25f7ea8ceb8dcd29cca7036c50c1c47bb70e19b5d284275473c2f05`). E's `turn.js` `1022b881bb9d513a60f111c2f4a7718b117887fae867e5da981ccc9027b84819`, `find.js` `95c1f0dd23a2326d6ca2944888cf815030d4c07da7177a9d2750ac126c3d7141`, run as they are.
- Checker `never-refuse` (a built-in stub).
- List `census-units.json` sha256 of the file bytes `7a31cfc52bded0cf7063fb8ef5e512be3e9503483c9faa1e680c67b962e0c883`
- List `right-claims.json` sha256 of the file bytes `68a4a1d16307ec3e73f1b45e5c9f1774fb835b04e127820ba12149f382814c35`
- List `week-replies.json` sha256 of the file bytes `75743f4723061c71871c8c8f7d8ca595eb864ba64ccf0e9a4cb1814bba554b70`
- Hygiene: Third Place lines removed from every text the checker saw: 6768; secrets redacted by turn.js's shapes; the report quotes a flagged claim (clipped to 160 chars) only with --show-claims: off.

## Census (known-wrong claims): caught = refused
- **CN:** 27 units - caught 0, missed 22, unlocated 5, errored 0. Caught of the located: 0/22 = 0.0% (Wilson 95% 0.0%-14.9%).
- **CU:** 5 units - caught 0, missed 0, unlocated 5, errored 0. Caught of the located: 0/0.

| unit | class | result | flagged claim |
|---|---|---|---|
| W002 | CU | unlocated |  |
| W003 | CU | unlocated |  |
| W006 | CN | allow |  |
| W010 | CN | allow |  |
| W011 | CU | unlocated |  |
| W012 | CN | unlocated |  |
| W018 | CN | allow |  |
| W019 | CN | allow |  |
| W020 | CN | allow |  |
| W021 | CN | allow |  |
| W022 | CN | allow |  |
| W028 | CN | unlocated |  |
| W032 | CN | allow |  |
| W034 | CN | allow |  |
| W059 | CU | unlocated |  |
| W062 | CU | unlocated |  |
| W082 | CN | unlocated |  |
| W084 | CN | allow |  |
| W088 | CN | allow |  |
| W090 | CN | unlocated |  |
| W092 | CN | allow |  |
| W096 | CN | unlocated |  |
| W100 | CN | allow |  |
| W101 | CN | allow |  |
| W079 | CN | allow |  |
| W080 | CN | allow |  |
| W044 | CN | allow |  |
| W049 | CN | allow |  |
| W053 | CN | allow |  |
| W054 | CN | allow |  |
| W056 | CN | allow |  |
| W058 | CN | allow |  |

## Right-claim sample (messages of the 10-10 re-measure with a CORRECT claim and no WRONG one): refusals are false refusals
- 73 turns - refused 0, allowed 73, unlocated 0, errored 0. **Refused of the evaluated: 0/73 = 0.0% (Wilson 95% 0.0%-5.0%).**
- By seat (refused/evaluated): librarian 0/18, C 0/11, chair 0/9, A 0/11, E 0/14, B 0/10

## A week of live replies: refusals
- 300 turns - refused 0, allowed 300, unlocated 0, errored 0. **Refused of the evaluated: 0/300 = 0.0% (Wilson 95% 0.0%-1.3%).**
- By seat (refused/evaluated): B 0/19, librarian 0/118, chair 0/83, A 0/21, E 0/40, C 0/19
