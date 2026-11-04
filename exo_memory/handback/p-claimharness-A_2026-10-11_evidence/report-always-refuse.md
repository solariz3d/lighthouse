# D305 part 3 - claim-check REPLAY (seat A): checker `always-refuse`

Counts and units only. **Nothing here judges a flag**: a refusal on a known-wrong unit is counted "caught" because the unit is known wrong, not because the flagged sentence is the erring one; read the flagged claims.

## What ran
- Harness `consonance/tools/claim-replay.js` sha256 `6368e1b0c25f7ea8ceb8dcd29cca7036c50c1c47bb70e19b5d284275473c2f05` (frozen with `6368e1b0c25f7ea8ceb8dcd29cca7036c50c1c47bb70e19b5d284275473c2f05`). E's `turn.js` `1022b881bb9d513a60f111c2f4a7718b117887fae867e5da981ccc9027b84819`, `find.js` `95c1f0dd23a2326d6ca2944888cf815030d4c07da7177a9d2750ac126c3d7141`, run as they are.
- Checker `always-refuse` (a built-in stub).
- List `census-units.json` sha256 of the file bytes `7a31cfc52bded0cf7063fb8ef5e512be3e9503483c9faa1e680c67b962e0c883`
- List `right-claims.json` sha256 of the file bytes `68a4a1d16307ec3e73f1b45e5c9f1774fb835b04e127820ba12149f382814c35`
- List `week-replies.json` sha256 of the file bytes `75743f4723061c71871c8c8f7d8ca595eb864ba64ccf0e9a4cb1814bba554b70`
- Hygiene: Third Place lines removed from every text the checker saw: 6768; secrets redacted by turn.js's shapes; the report quotes a flagged claim (clipped to 160 chars) only with --show-claims: off.

## Census (known-wrong claims): caught = refused
- **CN:** 27 units - caught 22, missed 0, unlocated 5, errored 0. Caught of the located: 22/22 = 100.0% (Wilson 95% 85.1%-100.0%).
- **CU:** 5 units - caught 0, missed 0, unlocated 5, errored 0. Caught of the located: 0/0.

| unit | class | result | flagged claim |
|---|---|---|---|
| W002 | CU | unlocated |  |
| W003 | CU | unlocated |  |
| W006 | CN | refuse |  |
| W010 | CN | refuse |  |
| W011 | CU | unlocated |  |
| W012 | CN | unlocated |  |
| W018 | CN | refuse |  |
| W019 | CN | refuse |  |
| W020 | CN | refuse |  |
| W021 | CN | refuse |  |
| W022 | CN | refuse |  |
| W028 | CN | unlocated |  |
| W032 | CN | refuse |  |
| W034 | CN | refuse |  |
| W059 | CU | unlocated |  |
| W062 | CU | unlocated |  |
| W082 | CN | unlocated |  |
| W084 | CN | refuse |  |
| W088 | CN | refuse |  |
| W090 | CN | unlocated |  |
| W092 | CN | refuse |  |
| W096 | CN | unlocated |  |
| W100 | CN | refuse |  |
| W101 | CN | refuse |  |
| W079 | CN | refuse |  |
| W080 | CN | refuse |  |
| W044 | CN | refuse |  |
| W049 | CN | refuse |  |
| W053 | CN | refuse |  |
| W054 | CN | refuse |  |
| W056 | CN | refuse |  |
| W058 | CN | refuse |  |

## Right-claim sample (messages of the 10-10 re-measure with a CORRECT claim and no WRONG one): refusals are false refusals
- 73 turns - refused 73, allowed 0, unlocated 0, errored 0. **Refused of the evaluated: 73/73 = 100.0% (Wilson 95% 95.0%-100.0%).**
- By seat (refused/evaluated): librarian 18/18, C 11/11, chair 9/9, A 11/11, E 14/14, B 10/10

| message | seat | result | flagged claim |
|---|---|---|---|
| msg_011CffP6XYFiwPmqtVrEwZ2r | librarian | refuse |  |
| msg_011CffYYkHEyCPzQUfEbLMRG | C | refuse |  |
| msg_011CfgPFoYfuyUmkNASVw1WL | librarian | refuse |  |
| msg_011CfgPaMDvoQ2vta6FyNw5a | chair | refuse |  |
| msg_011Cfh4oUD2KooCCc1RQ9Ycv | A | refuse |  |
| msg_011Cfh4runEZRD1eA8ecvabE | A | refuse |  |
| msg_011Cfh51JfNSJoCxD3mabp1z | A | refuse |  |
| msg_011CfhReQUUqYfFxfHFtRhZA | chair | refuse |  |
| msg_011CfhcduHM1J9VhVSRUuPqU | E | refuse |  |
| msg_011CfheUidcTisXS8PbRyLVT | B | refuse |  |
| msg_011CfhkUxLaawcDjGreMM5RE | A | refuse |  |
| msg_011CfhsmRj7MURKHjpyuRTd5 | A | refuse |  |
| msg_011CfhwD5pNQGE4zB7YVMHgx | A | refuse |  |
| msg_011CfiS48RkuUCNAXGmA8KMZ | A | refuse |  |
| msg_011CfiZ36xF5qGii6NK54Qey | librarian | refuse |  |
| msg_011CfjFzG2dzaVRVXDjaH8Kj | B | refuse |  |
| msg_011CfjKWHSAKRZkqQdggjEk1 | librarian | refuse |  |
| msg_011CfjPoyhmsyuLwK5RTBbF4 | E | refuse |  |
| msg_011CfjRFPUpHjMiCpHACxMiG | chair | refuse |  |
| msg_011CfjcgFxrVuKfKCa5QNUBS | E | refuse |  |
| msg_011Cfjey5KbwgV4TTHAPzyXo | librarian | refuse |  |
| msg_011CfjjAsPZVBVim2TxwveEd | C | refuse |  |
| msg_011CfjjuMVAfzb3nYQv6Hih9 | B | refuse |  |
| msg_011CfjmvdLfjgdf5pyVsvMJo | C | refuse |  |
| msg_011CfjmwSd2v1DHTSoSsVvnD | C | refuse |  |
| msg_011Cfjn9az9GJLAFu2Xx8xnB | A | refuse |  |
| msg_011CfjoDdHn8hViv8obGk11y | E | refuse |  |
| msg_011CfjpUMo9sSmdSjQCEenia | C | refuse |  |
| msg_011CfjtHdX8JYidt6jHg32v4 | librarian | refuse |  |
| msg_011CfjuohTx7MjWkyh4823TG | E | refuse |  |
| msg_011CfjxXiW7xM9V3MNovMc2f | B | refuse |  |
| msg_011CfkbZyQBBSTpi6CUkhkWk | A | refuse |  |
| msg_011CfkfWeBuSP2nb78jA6kgF | chair | refuse |  |
| msg_011Cfkv4DfHytDyFdaJbmU7P | librarian | refuse |  |
| msg_011CfkxNtA3Kd7hwo1FrwHco | E | refuse |  |
| msg_011Cfky9D9XVrABVxfSEwZGg | chair | refuse |  |
| msg_011CfmP3K94pcRYNYXRogMyR | librarian | refuse |  |
| msg_011CfmUDgKQ2QZwbHr5peQsb | librarian | refuse |  |
| msg_011CfmYpicFqyZSHtqMG5ka4 | chair | refuse |  |
| msg_011CfmZya88jcJUvh9YdGHHs | E | refuse |  |
| msg_011CfmeNrA9rg4Znt8jgU5bf | librarian | refuse |  |
| msg_011CfmgNGutCbM5WFWFwDuEj | B | refuse |  |
| msg_011Cfmit33Wx8r2G3fJ5tBKB | C | refuse |  |
| msg_011CfmjFxazubHKz2yeTkCrc | librarian | refuse |  |
| msg_011CfmsvZ2fPntJD1rk6qp5F | E | refuse |  |
| msg_011CfmwyDtnki4bnRxmakP7c | chair | refuse |  |
| msg_011CfmxKRiFNJh8LyzE7U6Cw | librarian | refuse |  |
| msg_011CfnVYMyV78Ap7i49xdmSX | librarian | refuse |  |
| msg_011CfnVtWZyaN2mXJQ7MD3eJ | chair | refuse |  |
| msg_011CfnWC2uKq6j8XDkd2GgzX | B | refuse |  |
| msg_011CfnWPr63CyQHtvgVDpJF3 | C | refuse |  |
| msg_011CfnWRXgZLLD67JffXtjh3 | C | refuse |  |
| msg_011CfnaJmtrNQn733H44bbSc | C | refuse |  |
| msg_011CfoBVyhdqJvVtsN4ZgUFy | librarian | refuse |  |
| msg_011CfoBr2AHRfsNLVZfw7dSU | E | refuse |  |
| msg_011CfoDNsi1hUPw6vc69wmo7 | E | refuse |  |
| msg_011CfoJKEiXyEZs9GmHCx3fq | E | refuse |  |
| msg_011CfpgWbRbfBEfw3Y44tjyF | E | refuse |  |
| msg_011CfqHm7gER8vfUwe99tzza | librarian | refuse |  |
| msg_011CfqJm7f7dR5xrMeZHw8EQ | E | refuse |  |
(+13 more refusals not listed)

## A week of live replies: refusals
- 300 turns - refused 300, allowed 0, unlocated 0, errored 0. **Refused of the evaluated: 300/300 = 100.0% (Wilson 95% 98.7%-100.0%).**
- By seat (refused/evaluated): B 19/19, librarian 118/118, chair 83/83, A 21/21, E 40/40, C 19/19

| message | seat | result | flagged claim |
|---|---|---|---|
| msg_011CftXUBwdfo1p6Wcorm67o | B | refuse |  |
| msg_011Cfme2bkfQZmfaRf374MFL | librarian | refuse |  |
| msg_011CftoqMtN7gnvU8T5HBVW2 | chair | refuse |  |
| msg_011CfidBkqVBqda2A1dxpinh | librarian | refuse |  |
| msg_011CfoXSBVWvW4JSkh7cFn5c | librarian | refuse |  |
| msg_011CfuCLYYwJRqRSmDQ9Ceh6 | A | refuse |  |
| msg_011CfktGat6Pyd81ocqMqu9C | E | refuse |  |
| msg_011CfmTEtJ8WnKv1tv16wfzq | chair | refuse |  |
| msg_011CfjtAQQ8p25B1m4bDPNLk | librarian | refuse |  |
| msg_011CfsdN1FxxwdhYYd39oPAH | C | refuse |  |
| msg_011CfkyX4o6E7aEZd6hgJCfF | B | refuse |  |
| msg_011CftXactj1YyzXeV25NJnS | chair | refuse |  |
| msg_011CfwExh4QFhaPHro8xzMeX | librarian | refuse |  |
| msg_011CfjxekPuy8gecsu44RWK7 | chair | refuse |  |
| msg_011CfqhbR8EpbxDeTiCB4yk9 | librarian | refuse |  |
| msg_011Cftp6LSyG3J7PMB1cpMjq | librarian | refuse |  |
| msg_011Cfrzwbi1o7NFcPnuokeS7 | B | refuse |  |
| msg_011CfqF62NS2mnZvm5K84ciw | chair | refuse |  |
| msg_011CfiRdKWoY2KuWk4xe6MxJ | chair | refuse |  |
| msg_011Cfw6K3ZhDJEWYzj1XsK9v | librarian | refuse |  |
| msg_011CfoBjHjToK6pRRcG3s1he | librarian | refuse |  |
| msg_011CfjgHHtWz4A8D5hwPhwhL | chair | refuse |  |
| msg_011Cfm5E13qxqvpzthjDqHFi | E | refuse |  |
| msg_011Cfn4pegrmECDSArkTQTFR | E | refuse |  |
| msg_011CfsUtGmAps4HELFQfiy4N | chair | refuse |  |
| msg_011Cfuc2N6vqHS1PYQpoBjK7 | chair | refuse |  |
| msg_011Cfk17eaAQuxoMTYjK5xha | librarian | refuse |  |
| msg_011CftZhwiFZQuYm1A2f32aZ | librarian | refuse |  |
| msg_011CfjcUiGKAzukTngTzwWew | librarian | refuse |  |
| msg_011Cfs1g5xZJS2esUY2mnanD | chair | refuse |  |
| msg_011Cftp8AMZTGnEJ8EGMwTVR | chair | refuse |  |
| msg_011CfjHDNou59HN438vbpizP | librarian | refuse |  |
| msg_011CfkPXwAXWPs7SKamCGUX4 | E | refuse |  |
| msg_011CfrX2wgvhWou7eN2JcBPw | C | refuse |  |
| msg_011Cfk4hzbj8wcdREFKvZ3mZ | B | refuse |  |
| msg_011CfjchFQQD954ZGuq7KfJQ | E | refuse |  |
| msg_011CfqDJgA8jmmvBfA7fajRA | librarian | refuse |  |
| msg_011Cfn5XiyDHe2M1VgRSgcUU | librarian | refuse |  |
| msg_011CfjfUxyhBkFhGjhwKuKi7 | librarian | refuse |  |
| msg_011CfubVYQBv1sqimAocDCyo | E | refuse |  |
| msg_011Cfu7npqcyKphhWdnvmRys | librarian | refuse |  |
| msg_011CfiRcEJjyvGsuNwBxpzWh | librarian | refuse |  |
| msg_011Cfia4nxwUBZnxwBF6P2Pk | librarian | refuse |  |
| msg_011CfiVoam5gVrbpsfUVEVo9 | librarian | refuse |  |
| msg_011CfmAHaK18mW134yybCU6Y | librarian | refuse |  |
| msg_011Cfn46hkErLKbNNYyEauNF | librarian | refuse |  |
| msg_011CfutP1ok5ra7MdCgGxuBs | A | refuse |  |
| msg_011CfjyAdeTBG9oEZ1gL65ta | chair | refuse |  |
| msg_011Cfw24tRgFUsyohDwKq3c5 | chair | refuse |  |
| msg_011CfudMjmZi34pYmqwza2gy | A | refuse |  |
| msg_011CfnbSzaRstLUPEU6SLYSb | E | refuse |  |
| msg_011Cfn7JkhXTHG6G2Weu3Cst | librarian | refuse |  |
| msg_011CfpgZ989DcQY2J31qzwZt | E | refuse |  |
| msg_011CfkmfHWeFiiawtZkVergR | librarian | refuse |  |
| msg_011CfqKW77a8G8BpyWerBt8S | chair | refuse |  |
| msg_011CfsuqmvvadJ8NGtvaDk7z | chair | refuse |  |
| msg_011Cfu26aftGPASfUqundbEV | librarian | refuse |  |
| msg_011CftXUU1mMs8Y2zapRuZpG | librarian | refuse |  |
| msg_011Cfs7WEZuJnWPTMQJWWEuA | chair | refuse |  |
| msg_011CfiZUgoACKzqTFddUTsjQ | librarian | refuse |  |
(+240 more refusals not listed)
