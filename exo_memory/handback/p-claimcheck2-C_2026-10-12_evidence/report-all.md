# D305 part 3 - claim-check REPLAY (seat A): checker `claim-check (v1 + Bash write path)`

Counts and units only. **Nothing here judges a flag**: a refusal on a known-wrong unit is counted "caught" because the unit is known wrong, not because the flagged sentence is the erring one; read the flagged claims.

## What ran
- Harness `consonance/tools/claim-replay.js` sha256 `8a2d40325c12d4d1151209af2597d8720878b0db1031f348cf9b48266ebb686f` (frozen with `6368e1b0c25f7ea8ceb8dcd29cca7036c50c1c47bb70e19b5d284275473c2f05`). E's `turn.js` `1022b881bb9d513a60f111c2f4a7718b117887fae867e5da981ccc9027b84819`, `find.js` `95c1f0dd23a2326d6ca2944888cf815030d4c07da7177a9d2750ac126c3d7141`, run as they are.
- Checker `claim-check (v1 + Bash write path)` sha256 `ef8bb8683ff4ea1ace5f6802eb95e1b63c232501e17eda0d67a3dd575e6d9b78`.
- List `census-units.json` sha256 of the file bytes `7a31cfc52bded0cf7063fb8ef5e512be3e9503483c9faa1e680c67b962e0c883`
- List `right-claims.json` sha256 of the file bytes `68a4a1d16307ec3e73f1b45e5c9f1774fb835b04e127820ba12149f382814c35`
- List `week-replies.json` sha256 of the file bytes `75743f4723061c71871c8c8f7d8ca595eb864ba64ccf0e9a4cb1814bba554b70`
- Hygiene: Third Place lines removed from every text the checker saw: 8356; secrets redacted by turn.js's shapes; the report quotes a flagged claim (clipped to 160 chars) only with --show-claims: off.

## Census (known-wrong claims): caught = refused
- **CN:** 27 units - caught 13, missed 9, unlocated 5, errored 0. Caught of the located: 13/22 = 59.1% (Wilson 95% 38.7%-76.7%).
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
| W022 | CN | allow |  |
| W028 | CN | unlocated |  |
| W032 | CN | allow |  |
| W034 | CN | refuse |  |
| W059 | CU | unlocated |  |
| W062 | CU | unlocated |  |
| W082 | CN | unlocated |  |
| W084 | CN | refuse |  |
| W088 | CN | allow |  |
| W090 | CN | unlocated |  |
| W092 | CN | allow |  |
| W096 | CN | unlocated |  |
| W100 | CN | refuse |  |
| W101 | CN | refuse |  |
| W079 | CN | allow |  |
| W080 | CN | allow |  |
| W044 | CN | refuse |  |
| W049 | CN | refuse |  |
| W053 | CN | refuse |  |
| W054 | CN | allow |  |
| W056 | CN | allow |  |
| W058 | CN | allow |  |

## Right-claim sample (messages of the 10-10 re-measure with a CORRECT claim and no WRONG one): refusals are false refusals
- 73 turns - refused 30, allowed 43, unlocated 0, errored 0. **Refused of the evaluated: 30/73 = 41.1% (Wilson 95% 30.5%-52.6%).**
- By seat (refused/evaluated): librarian 14/18, C 2/11, chair 2/9, A 4/11, E 5/14, B 3/10

| message | seat | result | flagged claim |
|---|---|---|---|
| msg_011CffP6XYFiwPmqtVrEwZ2r | librarian | refuse |  |
| msg_011CfgPFoYfuyUmkNASVw1WL | librarian | refuse |  |
| msg_011CfgPaMDvoQ2vta6FyNw5a | chair | refuse |  |
| msg_011Cfh4oUD2KooCCc1RQ9Ycv | A | refuse |  |
| msg_011Cfh4runEZRD1eA8ecvabE | A | refuse |  |
| msg_011CfheUidcTisXS8PbRyLVT | B | refuse |  |
| msg_011CfhsmRj7MURKHjpyuRTd5 | A | refuse |  |
| msg_011CfhwD5pNQGE4zB7YVMHgx | A | refuse |  |
| msg_011CfiZ36xF5qGii6NK54Qey | librarian | refuse |  |
| msg_011CfjPoyhmsyuLwK5RTBbF4 | E | refuse |  |
| msg_011CfjcgFxrVuKfKCa5QNUBS | E | refuse |  |
| msg_011Cfjey5KbwgV4TTHAPzyXo | librarian | refuse |  |
| msg_011CfjtHdX8JYidt6jHg32v4 | librarian | refuse |  |
| msg_011CfjxXiW7xM9V3MNovMc2f | B | refuse |  |
| msg_011Cfkv4DfHytDyFdaJbmU7P | librarian | refuse |  |
| msg_011Cfmit33Wx8r2G3fJ5tBKB | C | refuse |  |
| msg_011CfmjFxazubHKz2yeTkCrc | librarian | refuse |  |
| msg_011CfmwyDtnki4bnRxmakP7c | chair | refuse |  |
| msg_011CfmxKRiFNJh8LyzE7U6Cw | librarian | refuse |  |
| msg_011CfnVYMyV78Ap7i49xdmSX | librarian | refuse |  |
| msg_011CfoBVyhdqJvVtsN4ZgUFy | librarian | refuse |  |
| msg_011CfoDNsi1hUPw6vc69wmo7 | E | refuse |  |
| msg_011CfoJKEiXyEZs9GmHCx3fq | E | refuse |  |
| msg_011CfpgWbRbfBEfw3Y44tjyF | E | refuse |  |
| msg_011CfqHm7gER8vfUwe99tzza | librarian | refuse |  |
| msg_011CfqmZm6Rs2xM471FoM5ar | B | refuse |  |
| msg_011CfrQ9SaqcQ8un3opRScMG | C | refuse |  |
| msg_011Cfs42fB793YqoNAULUNWW | librarian | refuse |  |
| msg_011Cfscst1sn5nySSoqF6ngG | librarian | refuse |  |
| msg_011CfssxaRqhbkXg17MS5R2r | librarian | refuse |  |

## A week of live replies: refusals
- 300 turns - refused 173, allowed 127, unlocated 0, errored 0. **Refused of the evaluated: 173/300 = 57.7% (Wilson 95% 52.0%-63.1%).**
- By seat (refused/evaluated): B 15/19, librarian 60/118, chair 38/83, A 16/21, E 30/40, C 14/19

| message | seat | result | flagged claim |
|---|---|---|---|
| msg_011CftXUBwdfo1p6Wcorm67o | B | refuse |  |
| msg_011CfidBkqVBqda2A1dxpinh | librarian | refuse |  |
| msg_011CfoXSBVWvW4JSkh7cFn5c | librarian | refuse |  |
| msg_011CfuCLYYwJRqRSmDQ9Ceh6 | A | refuse |  |
| msg_011CfktGat6Pyd81ocqMqu9C | E | refuse |  |
| msg_011CfjtAQQ8p25B1m4bDPNLk | librarian | refuse |  |
| msg_011CfkyX4o6E7aEZd6hgJCfF | B | refuse |  |
| msg_011Cftp6LSyG3J7PMB1cpMjq | librarian | refuse |  |
| msg_011Cfrzwbi1o7NFcPnuokeS7 | B | refuse |  |
| msg_011CfoBjHjToK6pRRcG3s1he | librarian | refuse |  |
| msg_011CfjgHHtWz4A8D5hwPhwhL | chair | refuse |  |
| msg_011Cfm5E13qxqvpzthjDqHFi | E | refuse |  |
| msg_011Cfn4pegrmECDSArkTQTFR | E | refuse |  |
| msg_011CfsUtGmAps4HELFQfiy4N | chair | refuse |  |
| msg_011Cfk17eaAQuxoMTYjK5xha | librarian | refuse |  |
| msg_011CfjcUiGKAzukTngTzwWew | librarian | refuse |  |
| msg_011Cfs1g5xZJS2esUY2mnanD | chair | refuse |  |
| msg_011Cftp8AMZTGnEJ8EGMwTVR | chair | refuse |  |
| msg_011CfjHDNou59HN438vbpizP | librarian | refuse |  |
| msg_011CfkPXwAXWPs7SKamCGUX4 | E | refuse |  |
| msg_011CfrX2wgvhWou7eN2JcBPw | C | refuse |  |
| msg_011Cfk4hzbj8wcdREFKvZ3mZ | B | refuse |  |
| msg_011CfjchFQQD954ZGuq7KfJQ | E | refuse |  |
| msg_011Cfn5XiyDHe2M1VgRSgcUU | librarian | refuse |  |
| msg_011CfjfUxyhBkFhGjhwKuKi7 | librarian | refuse |  |
| msg_011CfubVYQBv1sqimAocDCyo | E | refuse |  |
| msg_011Cfu7npqcyKphhWdnvmRys | librarian | refuse |  |
| msg_011CfmAHaK18mW134yybCU6Y | librarian | refuse |  |
| msg_011CfutP1ok5ra7MdCgGxuBs | A | refuse |  |
| msg_011CfjyAdeTBG9oEZ1gL65ta | chair | refuse |  |
| msg_011Cfw24tRgFUsyohDwKq3c5 | chair | refuse |  |
| msg_011CfudMjmZi34pYmqwza2gy | A | refuse |  |
| msg_011Cfn7JkhXTHG6G2Weu3Cst | librarian | refuse |  |
| msg_011Cfu26aftGPASfUqundbEV | librarian | refuse |  |
| msg_011CfiZUgoACKzqTFddUTsjQ | librarian | refuse |  |
| msg_011CfjxZuNGkzH4wyB6T7SXK | chair | refuse |  |
| msg_011CfjoGxXzvcU6taWeopcSh | E | refuse |  |
| msg_011Cfuk9PAJuJN37WAEuuSuD | A | refuse |  |
| msg_011CfnBcYrbJH6hTxJX7wEEB | chair | refuse |  |
| msg_011CfjfsaYxZMeVVTAufZp1g | librarian | refuse |  |
| msg_011CfnZZ42jECZWipWWfxi5p | librarian | refuse |  |
| msg_011Cfjn5sGLP9rxzxhCFTg94 | chair | refuse |  |
| msg_011CfnEN2hbSgRveD2RZX8qF | C | refuse |  |
| msg_011CfqSptPwUiAUM1bp1nhCr | E | refuse |  |
| msg_011Cfu3uV8BAKbeCjpb6jyJ1 | librarian | refuse |  |
| msg_011Cfqhqud8e1FtNCfrKRqYr | C | refuse |  |
| msg_011CfqHnXwX12qVogJExfv3i | librarian | refuse |  |
| msg_011CfnWBHwg4ipoWRgeynX2n | C | refuse |  |
| msg_011CfvNKfBwY2Vx34tPjMrud | chair | refuse |  |
| msg_011Cfs3iRbnpEFvfj2KpXwvA | librarian | refuse |  |
| msg_011CfwMN7KFK4T31ehPs99ui | librarian | refuse |  |
| msg_011CfrPCAwEM1d9RYyyHrhKE | chair | refuse |  |
| msg_011Cfv59ZeZDg877YAFxf3mD | E | refuse |  |
| msg_011Cfs2STiioDdHfn3BKSHwY | chair | refuse |  |
| msg_011CfqLEfwBaGEUMk5BsKsiz | C | refuse |  |
| msg_011CfucBLMFqjfrCNVZvSsfY | A | refuse |  |
| msg_011CfmUoM6CKrTDWmfAcDoP5 | chair | refuse |  |
| msg_011CfqmgiGxgqVw1ZurCV75q | chair | refuse |  |
| msg_011CfrZ8dFKNpUchwe6Mnuo2 | B | refuse |  |
| msg_011CfnB1dCKCscMVpggMAheq | C | refuse |  |
(+113 more refusals not listed)
