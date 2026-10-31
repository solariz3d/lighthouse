# The keeper's tracks are not in this folder

The three ELYSIUM documents D437 read are the keeper's and stay out of the repository (O's practice, `exo_memory/handback/p-d433-O_2026-10-22_evidence/PRIVATE-TRACKS.md`; mine in D436). Copies live only in pane P's scratchpad, `…\scratchpad\d437\save\`, and are named here by digest:

| file | sha256 | bytes | what |
|---|---|---|---|
| `eq-ELYSIUM.t180track` (19:37 save) | `3452907a5e4ccfff7961c4ba3b5bb34e0253745941fd5cbc7f64501606c2cf08` | 105,126 | the new ELYSIUM: 44 pieces, 27,592 m, closed, pit lane on p1 (R, 100–900 m, 12 m out, 8 m wide, 12 boxes) |
| `eq-ELYSIUM.t180undo` | `ad0d4a342739db76dca85e3099149d6b8d60276f4ec1ab7c1bfd49180de92e4c` | 1,940,240 | 73 past states, 0 future; past[0] has 0 pieces (the lap was built in this session, with its pit lane from the first piece) |
| `eq-ELYSIUM.t180track.before-d344` (10-16 15:28) | `9b1d45118fe092358f9f5402c3ea56b06717e67c79cf6068e269df6cab042363` | 95,894 | the older ELYSIUM: 46 pieces, 25,046 m, closed, the same pit lane |
| `eq-ELYSIUM.t180track.before-d337` (10-16 08:17) | `a7e905432e60bf0497d4106c5f7485ff6101a3e5cfd7ec9cdf3967e83c9247c1` | 104,381 | 49 pieces, 27,290 m, closed, the same pit lane |

The crash dumps (WebView2 Crashpad reports, read from copies) are not here either, by size and because they hold the renderer's memory; their digests:

| dump | sha256 | bytes | when |
|---|---|---|---|
| `30eaa807-edc3-4fe2-8341-3647bb346bd0.dmp` | `46421cf0c751126fce712b232933e466b0f9ce2951a890eed05331ce8cff559a` | 8,591,213 | 2026-10-22 19:38:29 (the white screen) |
| `a807bf54-a027-4ba1-9122-a103a403e12d.dmp` | `3f73e2ff2af2069eb0f93524c900ab33ed392295e6f07e7398fd2c2793778e24` | 8,464,414 | 2026-10-15 12:18:15 |
| `354a95cd-5f85-4b6f-942c-13ad5fe6e004.dmp` | `e690da8117a1477d7fde303d2b993943ebc2ea9a41162086fed782496c7f1926` | 8,487,388 | 2026-10-15 13:53:06 |
| `70a69525-7f81-4ca1-b5b0-e90555589a03.dmp` | `69f7ad063263c916f5be255e80e369b767b74c52697fa543e0cbb7ed8f99b9c7` | 8,201,704 | 2026-10-15 16:07:49 |

What IS here: the cdb reads of the dumps (`dumps-cdb/`), their Crashpad annotation strings (`dumps-annotations/`), the scripts, and the node and Chrome logs. The logs name piece ids and stations, never the document. The forced export's kn5 (208,608,219 B, sha256 `4a216d3bc4d4d8471f1393fb88fd74f7044d9abfcc8ef06af1c4cd7cd2457d38`) stays in the scratchpad.

Nothing in the keeper's tracks folder or AC folder was written; the builder was not launched.

The headless runs' own Crashpad dumps (§3; read from copies in `…\scratchpad\d437\dumps-headless\`, each ~2.6 MB of the renderer's memory) are not here either:

| dump | sha256 | bytes | run |
|---|---|---|---|
| `ba6cdc59-d810-40c7-b63e-02742410fb6b.dmp` | `a4d930432c8d5fcae4c8dae3585caaeea28b25501bb5b922feff09956b0e3691` | 2,684,496 | pass 1, b6969da, 19:59:50 |
| `aa90605f-a6d4-49d0-a1c4-4d0503694ca7.dmp` | `8401986ac29a928dbdc59bbd8ecc275064a8cb3fbb074b87057e3240cea5dbf8` | 2,677,760 | pass 1, 6261a22, 20:14:47 |
| `68019c78-04bd-4dd3-9819-fc12e4533b8e.dmp` | `4335c4f9d28ee377285b0766ed0a1180cfb9578015ce33dc726bd80a52b653af` | 2,713,424 | pass 2, b6969da, 20:43:00 |
| `21fc5c0d-1b50-49fc-bf71-d90fa877b15f.dmp` | `2366e18756414f02efa414176971c0e66cff62ffca1400a21119daf303b226a1` | 2,668,832 | pass 2, 6261a22, 20:57:57 |
| `75c09d9d-82df-42f6-9a70-396dff4017f3.dmp` | `d76c02a83967756a87e9c5f07b3fe799ec4271ada9a1458192114afdc5ce31ad` | 2,671,568 | pass 3, 6261a22, 22:37:48 |

Pass 3's b6969da dump was deleted with its profile folder by the script's own cleanup (hand-back §8). What IS here: `dumps-headless/annot-*.txt` and `cdb-*.txt`, the reads.
