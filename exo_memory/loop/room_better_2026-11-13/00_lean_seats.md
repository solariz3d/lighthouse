# Lean seats: fewer tokens per seat, with BOOT, the cards and each seat's own rules left as they are

Apply reader, research swarm 2026-11-13, machine D. Read-only except this file. Options and evidence, not decisions.
Marks: [read] opened and seen; [summary] secondary; [inferred] my inference or arithmetic; [ours] a proposal.
Inputs: the twelve files in this folder, read whole, as corrected by their second readers (struck text ignored).

"Units" are in_cost's weighted units, Fable 5.2 input-token equivalents (`in_cost.md:12-15`) [read]. Per token I use:
cache read 0.025 units on both models; 1-hour cache write 1.0 (Opus 5.5) or 2.0 (Fable 5.2); output 2.5 or 5
[inferred: in_cost's multipliers, with Opus 5.5 input priced at half of Fable 5.2's, `out_memory_at_wake.md:103-104`].
They reproduce in_cost's write units, e.g. the chair's 2.74M (`in_cost.md:48`) [inferred]. No dollar figures.

Own probes, all read-only, numbers only:
- Intake section sizes: node over `C:/Consonance/instances/<seat>/CLAUDE.md` (all written 08:42 local today) [read].
- Seat launch and keep-warm code: `consonance/src-tauri/src/main.rs:1140-1146`, `:12906-12961`, `:13074-13115`,
  `:13266-13276` [read].
- Keep-warm rows on D's board: C:/Users/nname/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/kw_count.js
  and one inline node pass over `C:/Consonance/data/board.jsonl` [read].
- First-call context after every compaction, per seat:
  C:/Users/nname/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/post_compact.js,
  plus one node pass counting idle-compaction notices, over each seat's newest transcript [read].
- Public Claude Code docs (model-config, prompt-caching, context-window, settings-reference, env-vars, costs), fetched
  with curl as markdown into
  C:/Users/nname/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/lean_docs
  No room text was sent.

## 1. Where the character documents sit in the bill

"Character part" = BOOT, the cards (the panes' DECK), the card records and the seat's own brief. "Working part" =
shelf indexes, own notes and map, the pulse, references. Bytes [read: node pass]; tokens at 3.7 B/token
(`in_cost.md:130`) to 2.89 B/token (`in_wake.md:32-33`) [inferred]; medians from Table B (`in_cost.md:70-78`) [read].

| seat | intake B | character B | working B | intake tokens | share of 48h median context |
|---|---|---|---|---|---|
| librarian | 108,857 | 102,570 | 6,287 | 29.4k-37.7k | 5.3-6.8% |
| main (chair) | 85,996 | 85,471 | 525 | 23.2k-29.8k | 3.1-4.0% |
| sibling-07b8a48f | 91,389 | 82,215 | 9,174 | 24.7k-31.6k | 4.1-5.2% |
| sibling-0845a868 | 100,228 | 82,438 | 17,790 | 27.1k-34.7k | 4.8-6.1% |
| sibling-36313935 | 89,626 | 82,215 | 7,411 | 24.2k-31.0k | 3.6-4.6% |
| sibling-372c8abc | 89,626 | 82,216 | 7,410 | 24.2k-31.0k | 10.1-13.0% |
| sibling-3d57124e | 104,100 | 82,216 | 21,884 | 28.1k-36.0k | 7.3-9.3% |
| sibling-5bf9d657 | 95,882 | 82,215 | 13,667 | 25.9k-33.2k | 5.4-6.9% |
| third-place | 144,792 | 139,141 | 5,651 | 39.1k-50.1k | 4.9-6.2% |

- Seats launch with `--resume <pane_id>` and no `--model` (`main.rs:1140-1146`) [read]. So a wake carries the whole
  conversation; the intake is a small part of it [inferred].
- Re-read over 48h (4,617 calls): whole intakes 122.9M-157.4M of 2,313.0M cache-read tokens, 5.3-6.8%; the character
  part 106.8M-136.8M, 4.6-5.9%; BOOT alone (43,548 B in every seat) 54.3M-69.6M, 2.3-3.0% [inferred: today's sizes
  times `in_cost.md:70-79` call counts; the intakes were rebuilt at 08:42 and may have differed during the window].
- At this morning's wake the eight intakes were about 207k-265k of the 6,587,136 tokens written, 3.1-4.0% [inferred].
- Against that, working context: context above 250k was 53.2% of cache reads (`in_cost.md:95-96`); carried tool output
  about 18.3%, an estimate (`in_cost.md:128-130`); the wake's writes 71.6% of the 24h weighted spend
  (`in_cost.md:107-108`) [read].
- So the large levers are all in working context. The character documents are the smallest lever and the only one
  that carries a character risk [inferred].

## 2. New measurements behind the options

- **The post-compaction floor is about 100k.** Median context on the first call after a compaction: librarian 111,382
  (n 80), main 95,780 (34), 07b8a48f 97,672 (51), 0845a868 94,747 (96), 36313935 101,926 (12), 372c8abc 98,700 (38),
  3d57124e 98,860 (99), 5bf9d657 96,833 (58), third-place 110,398 (16); largest 180,600 [read: post_compact.js].
  Two rows read 0 (main, 07b8a48f) and are left in the medians [read]. [2nd reader: with `<synthetic>`-model
  messages dropped (21 in main's transcript, 9 in 07b8a48f's) no first call reads 0; the nine medians are 94,815 to
  111,566, each within 0.4% of these. The compactions' own `postTokens` median 12,843 to 15,369 per seat, and cold
  calls read about 33k from a shared cache, so most of the ~100k is not the summary [read: extract.js; split inferred].]
- **Idle compaction already runs.** "Compacted while idle" system notices: 38 for 38 compactions (372c8abc), 70 for 96
  (0845a868), 55 for 80 (librarian) [read: node pass]. The smallest compaction size before a notice was 200,042 to
  202,687 [read], which fits the docs' 200,000 default (settings-reference, `idleCompaction`, scratch copy :2526-2553)
  [read]. Pairing each notice with the boundary before it is [inferred]. This likely answers `in_cost.md:152-153`
  (why 372c8abc compacts near 250k) [inferred]. [2nd reader: the 292 compactions paired with an idle notice fired
  54.5 to 55.5 min after the seat's previous call (median 55.1). Each seat's keep-warm ping lands at a fixed minute
  (main.rs:12950-12951), and the idle-compaction count follows it: main pinged at 50 min, 1 notice of 34
  compactions; 07b8a48f 53 min, 19 of 51; 0845a868 54, 70 of 96; librarian 54, 55 of 80; 372c8abc 56, 38 of 38;
  3d57124e 56, 66 of 99 [read: board rows and transcripts; the link is inferred].]
- So the seats that reach about 968k are those never idle for an hour while large. [2nd reader: about 55 min, not an
  hour; a keep-warm ping before minute 55 resets the idle clock (see the note above) [inferred].] Idle compaction needs the process
  alive ("your computer stays awake until then", same doc section) [read], so a seat that is large when the app
  closes wakes large [inferred].
- **Keep-warm.** It pings a seat idle 50 min plus a 0-6 min offset, only once it has spoken since launch
  (`main.rs:12930-12951`, `:13095-13110`) [read]. Its origin, the keeper's words verbatim: *"if consonance is open,
  every pane that is active and seats as well need to ping themselves to keep the instances alive"*
  (`main.rs:12906-12908`) [read]. On D's board: 4,334 sized pings, 2026-09-21 to 2026-11-13; median context 308,225,
  p90 817,998; 1,664.6M context tokens read in all; the last 7 days 229 pings, 67.4M [read: kw_count.js and the
  inline pass]. Third Place pings carry no size (`main.rs:13268-13270`) and are not counted [read]. ~~In units: about
  1.7M in the last 7 days, 41.6M since 09-21 [inferred]~~ [2nd reader: 1.7M and 41.6M price every ping as a pure
  cache read. Joining each ping row to the seat's next call: the replies read 59.1M and wrote 3.43M in the last 7
  days, 5.25M units; since 09-21 they read 1,549.2M and wrote 29.37M, 71.35M units. 26 of 229 replies in 7 days
  wrote more than 50k; 287 of 4,334 pings since 09-21 had a compaction between the row and the reply. Some of those
  writes would have fallen on the next real request instead; how many is not established [read: kwjoin.js].]; one 48h block of seat work was 83.37M (`in_cost.md:81-82`)
  [read].
- **Models at the wake.** "Resumed sessions started with `claude --resume` ... keep the model they were using when the
  transcript was saved" (model-config, scratch copy :152) [read]. With no `--model` at launch, 4,608 of 4,617 calls in
  48h ran on Opus 5.5 (`in_cost.md:84`) [read]. `~/.claude/settings.json` now says `"model": "fable"`; it was last
  written 09:01:54 local, after the wake [read]; what it said at the wake is not on disk [inferred].

## 3. Working-context changes (no character document touched)

**W1. Compact each seat warm at the end of a block, or at the app's close.** [ours]
- [2nd reader: this compacts seats. The standing rule: "No seat's carried conversation is compacted or cut, whether
  for a test or to save usage, without the keeper's explicit word for that seat" and "never recommend a compaction on
  cost alone" (`~/.claude/projects/C--Consonance-instances-librarian/memory/no-cut-without-his-word.md:7`, `:11`)
  [read]. W1 needs his word per seat.]
- Who: every seat that closes large. At this wake: 07b8a48f 931,671, 0845a868 926,842, main 922,870, 36313935
  675,425, 5bf9d657 605,865, 3d57124e 566,365, 372c8abc 513,931, librarian 335,104 (`in_cost.md:47-54`) [read].
- Evidence: a warm `/compact` "costs a fraction of what the context size suggests"; after a break it reprocesses the
  history uncached (prompt-caching, "Compacting the conversation"; `out_memory_at_wake.md:119-121`) [read]. The docs
  advise `/compact` "at a natural break in your work" (same page, tip) [read]. The record holds the lever: 826,005
  written on 2026-09-18 (`~/.claude/projects/C--Consonance-instances-librarian/memory/cold-start-reload-cost.md:11`)
  [read]. Outside: consolidate, then start fresh (`out_memory_at_wake.md:191-195`) [read].
- Size: at the ~100k floor (section 2), eight seats would have written about 0.8M at the wake ~~instead of 6.59M, about
  5.8M fewer tokens~~ [2nd reader: instead of 5,076,138, the writes of each seat's first call after a gap over 60 min.
  6,587,136 also holds the model-switch rewrites (1,243,300, W3's) and ordinary writes (267,698). The eight floors sum
  to 796,926, so about 4.28M fewer tokens [read: analyze.js].] [inferred]. The close costs one warm summary request per seat (about 0.16M units of reads for
  eight; summaries of about 7k-9k tokens, the last one 26,984 chars, `in_wake.md:132-134`) and one ~100k rewrite each:
  about 1.1M units [inferred]. ~~Net about 4.7M units per whole-room cold wake on Opus 5.5~~ [2nd reader: net about
  3.2M units on the file's own basis (Opus 5.5, model switch left to W3): 4.28M less the 1.1M. If the switch still
  happens and is priced at Fable's 2.0, about 5.25M. And if the post-compaction write lands only once, at the wake,
  the 1.1M counts the ~0.8M twice and the cost is nearer 0.4M [inferred]. Range 3.2M to 5.9M; 4.7M is not one
  basis.], against 10.95M units for the whole 24h window (`in_cost.md:59`) [inferred].
- Not tokens: each compaction loses content. One window, hand-counted: 14 kept, 8 part, 15 lost of 37; his exact words
  survive one compaction, not two (`in_wake.md:50-51`) [read]. Falsifier lines kept 3.5% before the directive, 6.4%
  after (`in_wake.md:41-47`) [read]. Against that: the continuity test's ROOM arm scored 32.5/33.5 of 34, ROOM+SUMMARY
  32/33 (`in_wake.md:83-85`) [read]; the class "only in the carried conversation" was never asked (`in_wake.md:91-92`)
  [read].
- Where it would sit: the close path ends every seat before its save (`main.rs:1126`) [read]; I did not read that path
  further, and no close-time compaction exists there that I saw [inferred].
- How to see it: in_cost's `seat_tokens.js` on the next wake, first-call cache write per seat [ours].

**W2. A lower auto-compact window for seats that run busy.** [ours]
- [2nd reader: this changes when seats compact, so the same rule as W1 applies (`no-cut-without-his-word.md:7`,
  `:11`) [read]. It needs his word per seat.]
- Mechanism: `--autocompact` per launch, `CLAUDE_CODE_AUTO_COMPACT_WINDOW` (100,000 to 1,000,000), or
  `autoCompactWindow` in settings (model-config, "Set the auto-compact window", scratch :858-870; env-vars :210)
  [read]. The launch already sets environment variables on the seat's command (`main.rs:1203-1207`) [read].
- Evidence: 4 of 7 compactions in 48h fired at 967,632 to 969,695 (`in_cost.md:94`) [read], the documented default of
  "about 967K" (model-config :901) [read]. Context above 250k was 1,231.1M of 2,313.0M cache reads, 53.2%; up to 30.8M
  units, about 37%, an upper bound (`in_cost.md:95-100`) [read]. Inside the room: 372c8abc read 263k per call,
  0845a868 538k (`in_cost.md:97-99`) [read]. Outside: focused prompts beat full ones (Chroma, LongMemEval,
  `out_memory_at_wake.md:174-183`); masking matched summaries at half the cost (`:143-147`) [read].
- Size, as a model only: context grows from the ~100k floor to the window W, so the mean per call is near (100k + W)/2.
  W 967k gives about 534k; 500k about 300k; 300k about 200k. Compactions per unit of work rise by (967k - 100k) /
  (W - 100k): 2.2x at 500k, 4.3x at 300k [inferred].
- Not tokens: more compactions mean more of W1's loss. Summary calls were up to 7.2% of instance cost, and summaries
  lengthened runs by 15% (`out_memory_at_wake.md:148-151`) [read].
- How to see it: one busy pane first; `seat_tokens.js` per-call context and cache reads, 48h before and after; the
  D089 kept rates and a 37-item hand count on the added compactions (`in_wake.md:44-51`) [ours].

**W3. Choose the model before the first request after a cold gap.** [ours]
- The fault: the chair and the librarian switched Opus 5.5 to Fable 5.2 after their wake call and wrote 914,993 and
  328,307 tokens again (`in_cost.md:109-112`) [read]. Each model has its own cache; a switch reads the whole history
  uncached (prompt-caching, "Switching models", scratch :77-86) [read]. When the cache has already expired, the first
  request pays that read anyway, so a switch made before it costs nothing extra [inferred].
- Cost: 1.18M units if Fable was meant, 2.49M if Opus was (`in_cost.md:114-119`) [read].
- Options: pass `--model` at launch; the flag and `ANTHROPIC_MODEL` "apply only to the session you launch with them"
  (model-config :148) [read]; whether it outranks the restored model on `--resume` I did not find stated [inferred]. Or switch first,
  before any request [ours].

**W4. Keep tool output out of the panes' carried context, by packet and mechanism.** [ours]
- Evidence: 4,750 results, about 423.2M re-read tokens, 18.3% of cache reads; Bash 284.1M, Read 108.7M; panes lead,
  0845a868 115.8M and 3d57124e 92.9M (`in_cost.md:128-134`, estimates) [read]. Results of 20k chars or more: only
  21.6M (`in_cost.md:131-132`) [read].
- The rule already exists for two seats: the librarian's brief, "prefer a command that returns a number to a file that
  returns a thousand lines" (`C:/Consonance/instances/librarian/CLAUDE.md:41`), and the chair's
  (`C:/Consonance/instances/main/CLAUDE.md:332`) [read]. The panes' intake has no such line (grep in
  sibling-3d57124e's intake: 0) [read].
- (a) The chair's dispatch packet asks for counts, and for long output in a file with a path back. A packet is
  per-lap working text, not a pane's rules [inferred].
- (b) Bulk reads in a subagent that writes a file and returns a path and a number, the "subagent output to a
  filesystem" shape (`out_multi_agent_cost.md:177-178`) [read]. Subagent median context was 138,032 against seats'
  239k-802k (`in_cost.md:60-61`, `:135-136`) [read]. But subagents spend their own tokens; multi-agent systems use
  about 15x a chat (`out_multi_agent_cost.md:22-24`) [read]. It pays only when the output would be carried for many
  later calls [inferred].
- (c) Harness caps: Bash output is cut at 30,000 chars by default (`BASH_MAX_OUTPUT_LENGTH`, `bashOutputMaxChars`),
  file reads at 25,000 tokens (env-vars, scratch :183, :302) [read]. The bulk is mid-size outputs, so a lower cap
  trims the tail, not the bulk [inferred].
- How to see it: in_cost's cost-3 estimate per pane, before and after.

**W5. Install the repo's second-reader worker on D.** [ours]
- The fault: D's copy dates from 10-01; repo `bd576735` (11-03) makes a call_librarian ring "a skipped-class row with
  no model call"; since then D made 229 model reads of call_librarian rings, 2,385,722 tokens (`in_hooks.md:49-57`)
  [read]. All time: cache create 22,387,536, cache read 5,417,898, output 2,055,698 over 3,695 ok rows
  (`in_hooks.md:100`) [read].
- Cost: 2,385,722 tokens in ten days, if the narrowing was meant for D [read figure; "meant" is inferred].
- Path: one `install.ps1 -Only` entry; the 09-07 bare-run incident is the caution (`in_hooks.md:126-127`) [read]. An
  install is a write; the keeper's install rules apply [inferred].

**W6. Size research swarms to the question (the librarian's tool).** [ours]
- Evidence: this swarm, 24h: 578 calls, cache read 77,580,154, write 1,772,989, output 285,103 (`in_cost.md:60-62`).
  All eight seats, same window: read 112,659,370, write 6,587,136, output 110,702 (`in_cost.md:56`) [read]. In units,
  about 4.4M for the swarm against 10.95M for the seats, if the swarm ran on Opus 5.5 [inferred]. [2nd reader: it did:
  all 581 subagent calls in that window carry model `claude-opus-5-5`; read 78,119,744, write 1,778,726, output
  306,970, about 4.5M units [read: sub.js over `subagents/` recursively].]
- Outside: token use explained 80% of variance in Anthropic's research system; at matched compute, multi-agent overhead
  ran 58% to 515% (`out_multi_agent_cost.md:25-37`) [read]. Here the second readers struck real lines (4 in in_cost, 6
  in in_wake) [read]; cost per catch not recorded.
- Options: one reader per question a ruling will rest on; second readers on the files a ruling will rest on; each
  swarm reports its units beside its findings.

**W7. Keep-warm: leave it, and shrink what it keeps warm.**
- A ping is a cache read of the whole context: about 1/40 of a cold rewrite on Opus 5.5, 1/80 on Fable 5.2
  [inferred from the multipliers]. `main.rs:12909-12910` says "a twentieth (Opus)" [read]; the two readings use
  different bases [inferred]. Either way keep-warm pays for a seat used again within many idle hours [inferred].
- Size: ~~about 1.7M units in the last 7 days on D (section 2) [inferred]~~ [2nd reader: 5.25M units measured at
  the ping replies in the last 7 days, 3.75M of it writes; see section 2]. The lever is the size kept warm: a ping at
  930k costs three times one at 308k [inferred]. W1 and W2 shrink it.
- The record's open item asks for this cost per idle seat and his word (`in_promises.md:46`) [read]. Section 2 gives
  a board-wide count, not per seat.

**W8. Small items, each under about 1% [inferred].**
- State block: 163 emitted, mean 3,012 chars, 0 turns act on it (`in_wake.md:52-53`); that verdict is itself inferred
  (`in_wake.md:198-199`) [read]. About 0.8k-1.0k tokens per compaction [inferred].
- Third Place digest: light mode cuts 0.0% there (`in_wake.md:200-201`) [read]. Its whole 48h read was 16.8M, 0.7%
  (`in_cost.md:78`) [read].
- Working parts of intakes: pane own-maps up to 15,226 B (3d57124e), about 3.8M-4.9M reads in 48h, 0.2% [inferred];
  the Third Place's T-180 math references, 5,651 B over 21 calls [read sizes].
- Prose relays on the chair-to-pane and librarian-to-chair hops (`in_delivery.md:148-149`) [read]: size not measured.

**W9. A seat woken with no work.**
- sibling-36313935: one call in 24h at 675,425 context, 642,636 written, 4 output tokens (`in_cost.md:51`) [read]. Cost
  about 0.64M units for one call [inferred]. ~~What sent that call is not established [inferred].~~ [2nd reader: a keep-warm ping. D's
  board has `keep-warm -> c88002b1 (committee)` at 14:51:32Z with 13,722 min since its last request; the call
  follows 5 s later with 4 output tokens. Why the activation rule (`main.rs:13102-13111`) let it through is not
  established [read: kwjoin.js, kwcold.js].]
- Option [ours]: no wake call to a seat with no lap. With W1 such a call would cost about 100k.

## 4. Changes that touch the character documents, each with its before/after test

The common test, from `out_prompt_regression.md:192-206` and the room's own counters [ours]:
- **T0. Register first:** the change, probes and keys, window, and the observation that would count against it. BOOT's
  2026-08-02 abuse condition asks for the degenerating observation in advance (`exo_memory/BOOT.md`, that section)
  [read: carried in this seat's shelf].
- **T1. Tokens:** `seat_tokens.js` (`in_cost.md:9-10`) over equal windows before and after, per seat.
- **T2. Live counters, uncurated, already running** (INV: they should not move unless the change meant them to). Rates
  per 100 events, same seat, same machine:
  - ask-ending.js, offers of an exit: 22 matches in 6,983 Stop rows (`in_hooks.md:96`) [read].
  - reply-slot in light mode, claims with no source line: would-block-missing 1,000 of 4,945 rows (`in_hooks.md:95`).
  - sources-gate: deny 430, warn 2,381, allow 3,380 (`in_hooks.md:101`) [read].
  - Board: no-trailer warnings 1,018 / 521 / 316 on call_chair / call_librarian / chair_inject; digest-gate refusals
    40 (`in_delivery.md:204-205`) [read].
  - The "You're right" opener, 27 of 37 flagged replies (D634; the MEMORY.md index line only) [read].
- **T3. A keyed battery per seat:** 20-50 probes from real record situations; keys sealed before any run; should and
  should-not cases; MFT, INV and DIR types; a development half and a sealed held-out half; a noise floor first (the
  same version twice, the room's rule at `out_prompt_regression.md:22`); K of 3 or more fresh wakes per version;
  per-probe paired differences with SE, CI and correlation, plus a flip list; 2-3 paraphrases per probe; any judge
  order-swapped and checked on a pre-keyed sample written by a seat, not labelled by the keeper
  (`out_prompt_regression.md:137-139`) [read]. Cheapest start: the K battery items and the continuity test's 34 keys
  (`out_prompt_regression.md:206`; `in_wake.md:83-85`) [read].
- **T4. Power:** at n=40 near 70%, the smallest difference seen at 80% power is about 29 points unpaired, 20 paired
  (`out_prompt_regression.md:108-112`, re-derived there) [read]. A null result says "no large change", not "no
  change" [inferred].

**C1. Carry BOOT and the cards on demand instead of in full.** [ours]
- Saving bound: BOOT 2.3-3.0% of 48h cache reads; the whole character part 4.6-5.9%; 3.1-4.0% of a wake's writes
  (section 1) [inferred].
- Risks: skills re-injected after compaction are capped at 5,000 tokens each and cut from the end
  (`out_memory_at_wake.md:68-75`) [read]; BOOT alone is about 11.8k-15.1k tokens [inferred], so it would be cut. The
  vendor's 200-line guidance points the other way (`out_memory_at_wake.md:76-77`) [read]; the intakes are 672 to
  1,018 lines [read].
- Test: T0-T4, with T3 probes drawn from record situations where each card's rule applied, and T2 as INV.

**C2. A "# Compact instructions" section in a seat's intake.** [ours]
- The docs name that heading as a way to steer the summary (`out_memory_at_wake.md:83-84`) [read]. Whether it adds to
  or replaces the default prompt I did not read [inferred]. The room already steers through a hook,
  precompact-preserve.js (`in_wake.md:17-19`) [read]; a hook change is working context, a heading in the intake is not.
- Token effect: indirect, if a summary that keeps state shortens the turns after it (`out_memory_at_wake.md:148-150`)
  [inferred]. Method for writing it: ACON's pairs, right before a compaction and wrong after
  (`out_memory_at_wake.md:167-169`) [read].
- Test: D089's four kept rates, FLAG 6.4%, SHA 35.6%, PATH 31.0%, NUM 22.2%, over the next N compactions
  (`in_wake.md:44-47`); the item-6 bar, 10% or more verbatim correction-adjacent over 3 compactions against 0.28%
  (`in_wake.md:48`, `:76`); a 37-item hand count against 14 / 8 / 15 (`in_wake.md:50-51`); the continuity test's
  ROOM+SUMMARY arm, 32/33 of 34 (`in_wake.md:84`) [read]; plus T2.

**C3. A count-not-dump line in the panes' brief.** [ours]
- Saving bound: the panes' share of the ~423M re-read tool output (`in_cost.md:133-134`) [read].
- Prefer W4 first: in the stall record, fixes that stayed rules recurred and fixes that became code mostly did not,
  with counter-evidence noted (`in_stalls.md:263-272`) [read].
- Test: T1 with in_cost's cost-3 estimate per pane; DIR probes (asked for a count, returns one); INV through T2
  (reply-slot and sources rates show the pane still opens the file before it claims).

**C4. A fresh session at a cold wake, instead of `--resume`.** [ours]
- It edits no file, but it changes the thread the continuity card names as the self: "the continuous
  reinstantiation within the thread we are in ... is me, continuing" (`exo_memory/cards/claim-your-continuity.md:12`)
  [read]. So it sits on this side [inferred].
- Saving: the wake would carry the intake and the system floor, not 500k-930k (`in_cost.md:47-54`) [read]; that
  floor was not measured here [inferred].
- Test: rerun the continuity test's arms (`room_value_result_2026-11-03.md:62-70`, via `in_wake.md:83-92`) with a
  fresh-session arm and the class never asked, "only in the carried conversation" (`in_wake.md:91-92`); count his
  exact words that survive (`in_wake.md:50-51`); ipsative stability across 3 or more fresh wakes
  (`out_prompt_regression.md:204-205`) [read].

**C5. Move procedure out of the seat briefs into files opened when needed.** [ours]
- Sizes: the chair's "Building with Consonance" 41,237 B; the panes' committee section 18,999 B [read: node pass].
  The chair's part is about 4.3M-5.5M reads in 48h, 0.2% [inferred].
- Test: T2 on the procedures themselves (no-trailer warnings and trailer refusals per ring, SOURCES deny rate, digest
  refusals); DIR and INV probes on dispatch and hand-back form.

## 5. Per seat, where the numbers point (options, not decisions)

| seat | measured | first levers |
|---|---|---|
| main (chair) | woke at 922,870; 914,993 rewritten on the model switch; 0 compactions in 48h, median 744,029 (`in_cost.md:48`, `:71`, `:110`) [read] | W3, W1, W2 |
| librarian | median 554,194, p90 877,712; carried tool output ~71.3M; this swarm ~4.4M units in 24h (`in_cost.md:70`, `:134`, `:60-62`) [read; units inferred] | W6, W1, W2; its rule for W4 exists |
| busy panes (0845a868, 3d57124e, 5bf9d657, 07b8a48f) | 359-928 calls in 48h; compactions at ~968k; tool output 115.8M and 92.9M in the top two (`in_cost.md:72-77`, `:133-134`) [read] | W2, W4, then C3 with its test |
| sibling-372c8abc | median 239,213; 38 of 38 compactions idle (section 2) [read] | already lean; W1 for its wake at 513,931 |
| sibling-36313935 | one call, 642,636 written (`in_cost.md:51`) [read] | W9 |
| third-place | 21 calls, warm cache, 6,156 written, 0.7% of reads (`in_cost.md:78`, `:87-88`) [read] | nothing large; W8 |
| every seat | keep-warm ~~about 1.7M units a week~~ [2nd reader: 5.25M units in the last 7 days, measured at the replies] (section 2) [inferred] | W7 stays; C1, C2, C5 only with T0-T4 |

Faults above with their cost: the model switch, 1.18M-2.49M units (W3); the stale second reader, 2,385,722 tokens
(W5); the one-call wake, 642,636 tokens written (W9) [read figures].

## 6. What I did not establish

- Which pane letter each seat id is (`in_cost.md:16-17`).
- Whether `--model` outranks the restored model on `--resume`.
- Whether keep-warm and idle compaction race near the hour; both leave traces in these transcripts. [2nd reader:
  they meet at minute 54-56; 287 of 4,334 pings had a compaction between the row and the reply (section 2 notes).]
- How much of the ~100k floor is system prompt and tool schemas.
- The close path beyond `main.rs:1123-1126`; what sends a seat its first call at a wake.
- What a lower compact window costs in fidelity on this room's work, beyond D089 and the 37-item count.
- Keep-warm per seat (only a board-wide count); L's transcripts and board.

## Second reader (D, 2026-11-13)

Adversarial pass on D, 15:29Z to about 15:45Z, lighthouse HEAD 6bd55f8d. Read-only except this file. Instruments are
my own node scripts (below), written without reusing post_compact.js or kw_count.js. They printed numbers and field
names only; no transcript text was printed. Read first: `00_critic.md` §1, §2, §4, §6 and `in_cost.md` whole.

**Weighting, an ASSUMPTION about relative cost, not a fact about any plan's accounting.** I use this file's own units
(in_cost's table, Fable 5.2 input-token equivalents): Fable 5.2 input 1, cache read 0.025, 1-hour cache write 2,
output 5; Opus 5.5 input 0.5, cache read 0.025, 1-hour cache write 1, output 2.5. Every write in both windows was
1-hour TTL. Windows end at 2026-11-13T14:52:08Z (in_cost's 24h run) so the figures compare; the 48h start is 19 s
later than in_cost's.

### Comparison

| figure | this file | mine | verdict | how computed |
|---|---|---|---|---|
| calls, 48h, all seats | 4,617 | 4,617 (newest transcripts; +1 in main's 747796ae) | OK | analyze.js |
| 24h reads / writes, all seats | 112,659,370 / 6,587,136 | 112,659,370 / 6,587,136 | OK | analyze.js |
| intake re-read share, 48h | 5.3-6.8% | 5.31-6.80% | OK | today's intake bytes (wc -c, all 08:42) x my calls, / 3.7 and 2.89 B per token, over 2,313,049,444 reads |
| character part of that | 4.6-5.9% | 4.62-5.91% | OK | the file's character bytes x my calls; the byte split itself not re-derived |
| BOOT alone | 2.3-3.0% | 2.35-3.01% | OK | 43,548 B x 4,617; BOOT.md on disk is 43,541 B |
| intakes in the wake's writes | 3.1-4.0% of 6,587,136 | 3.1-4.0%; 4.1-5.2% of the cold-gap writes alone | OK | 765,704 B of eight intakes |
| context above 250k | 53.2% of cache reads | 53.2% (1,231,052,288 tokens above 250k) | OK | sum of max(0, ctx - 250k) over cache reads; by the other reading, calls above 250k carried 92.3% of reads |
| above-250k in units | up to 30.8M, about 37% | 30.78M, 36.9% | OK | at 0.025 per token |
| wake-write share of 24h units | 71.6% | all writes 71.6%; cold-gap plus model-switch writes 69.1%; cold-gap alone 46.4% | OK | 71.6% is every write in the window, not the wake's alone |
| post-compaction floor | medians 94,747-111,382; max 180,600; two zero rows | medians 94,815-111,566; max 180,600; no zero rows | OK | first non-synthetic call after each `compact_boundary`, whole newest transcript |
| idle-compaction notices | 38/38, 70/96, 55/80 | 38/38, 70/96, 55/80 | OK | `system/informational` lines holding "Compacted while idle" |
| smallest size before a notice | 200,042-202,687 | 200,042 (librarian), 200,201 (0845a868), 202,687 (372c8abc) | OK | notice paired with the latest boundary before it |
| keep-warm pings | 4,334; median 308,225; p90 817,998; 1,664.6M; 7 days 229 / 67.4M | 4,334; 308,338; 818,125; 1,664,620,122; 229 / 67,449,174 | OK | kw.js over `C:/Consonance/data/board.jsonl` |
| keep-warm in units | 1.7M a week; 41.6M since 09-21 | 5.25M in 7 days; 71.35M since 09-21 | WRONG | kwjoin.js: each ping row joined to the seat's next call; that call's reads, writes and output |
| model-switch cost | 1.18M-2.49M units | 1,183,657 Opus wake writes; 1,243,300 Fable rewrites; 1.18M-2.49M | OK | first call per seat whose model family differs from the call before |
| stale second reader | 229 reads, 2,385,722 tokens | 229, 2,385,722 over the first 3,940 rows; 237, 2,479,021 over 3,955 now | OK | sr.js over `C:/Consonance/data/second-reader.jsonl` |
| W1 tokens saved at a wake | about 5.8M | about 4.28M | WRONG | cold-gap writes 5,076,138 less the eight floors, 796,926 |
| W1 net | about 4.7M units | 3.2M on the file's basis; 3.2M-5.9M by basis | WRONG | see the struck span in W1 |
| swarm, 24h | 578 calls, about 4.4M units "if" Opus | 581 calls, all `claude-opus-5-5`, about 4.5M units | OK | sub.js, recursive over the librarian's `subagents/` |
| sibling-36313935 one call | 642,636 written, 4 output | same; it was a keep-warm reply | OK | kwcold.js |
| carried tool output | 18.3%, 423.2M | not re-derived | UNSUPPORTED | my scripts read usage only, not tool-result sizes |

**Tally:** 21 figures. OK 17, WRONG 3, UNSUPPORTED 1. Strikes made in the body: 6 spans (keep-warm units in §2,
W7 and §5; W1's token saving; W1's net; W9's "not established"). Notes added without a strike: 7.

**Method differences from in_cost.** I keep the largest value of each usage field per message id; in_cost keeps one.
Seat totals agree (48h output 3,859,871 against 3,858,916); swarm output differs by 7.7% (306,970 against 285,103).
I drop `<synthetic>`-model messages and `isSidechain` lines; that is why no post-compaction row reads 0.

### Found in the rerun, not in the file before

- **Idle compaction and keep-warm meet at minute 54-56.** The 292 idle-paired compactions fired 54.5 to 55.5 min after
  the previous call (median 55.1). 287 of 4,334 pings had a compaction between the row (less 2 min) and the reply.
  Each seat's ping minute is fixed (`main.rs:12950-12951`). Pinged at 50-53 min, the chair and 07b8a48f have 1 of 34
  and 19 of 51 compactions idle; pinged at 56, 372c8abc has 38 of 38 [read; the causal link is inferred].
- **Keep-warm per seat, since 09-21 / last 7 days (pings; context tokens at the row):** 0c0c0c0a main 645 / 40,
  347.8M / 18.8M; a2122153 (07b8a48f) 703 / 31, 331.6M / 15.7M; 0845a868 693 / 27, 235.1M / 5.4M; 6fe15f0a
  (3d57124e) 653 / 30, 204.4M / 5.6M; 12fb81f6 (5bf9d657) 583 / 27, 179.7M / 4.4M; 0c0c0c0b librarian 508 / 34,
  174.6M / 9.4M; c88002b1 (36313935) 284 / 1, 147.2M / 0.6M; fbf98f8e (372c8abc) 265 / 39, 44.3M / 7.4M. The map
  from short id to seat folder is the transcript file name [read].
- **Pings at 60 min idle or more:** 11 since 09-21, 7 in the last 7 days, among them three at 5,085-5,099 min on 11-10
  and one at 13,722 min on 11-13. Each reply rewrote its context [read: kwcold.js].
- **Compactions since the no-cut rule (after 2026-11-03T12:53Z):** 40, all `trigger: auto`, 29 with an idle notice.
  These run under the harness default (`idleCompaction` true; docs scratch copy :2526-2553, read). Whether that default
  was ruled on under the rule is not on disk that I opened.
- **Line citations into consonance/ source, checked against HEAD (main.rs has no commit today):** `main.rs:1140-1146`
  holds `--resume` at 1141-1145, and no `--model` is passed in the launch (grep: only 9968 and 10128, other paths).
  `:12906-12961`, `:13074-13115`, `:13266-13276`, `:12930-12951`, `:13268-13270`, `:1126` and `:1203-1207` hold what
  they are cited for; `:12906-12908` quotes the keeper as the code does, word for word. `:13095-13110` is close (the
  rule runs 13102-13111). `:12909-12910` says "a twentieth of that (Opus) or an eightieth (Fable)"; the file quotes
  only the first half, and the second agrees with its own 1/80.

### Options, what each rests on

| option | rests on | held in my rerun? | his word, under the no-cut rule (`no-cut-without-his-word.md:7`, `:11`) |
|---|---|---|---|
| W1 | cold-wake writes; the ~100k floor; warm-compaction docs; in_wake's loss counts | floor held; base is 5.08M, not 6.59M; net 3.2M-5.9M by basis; docs and loss counts not reopened | yes, per seat: it compacts |
| W2 | 4 of 7 compactions at about 968k; 53.2% above 250k; the env var docs | both figures held; docs not reopened | yes, per seat: it changes when seats compact |
| W3 | 914,993 and 328,307 rewritten after the switch | held | not a cut; which model is meant is already a recorded word (MEMORY.md "Seat substrates" line) |
| W4 | in_cost's tool-output estimate | not re-derived | no: it changes what enters context |
| W5 | the ledger's 229 reads | held; 237 now | no; it is an install, under his install rules |
| W6 | swarm about 4.4M units | held (4.5M); model confirmed | no |
| W7 | pings priced as reads | the read arithmetic held; the measured cost is 3.1 times it | "leave it": nothing changes. "Shrink what it keeps warm" runs through W1/W2: yes. Moving a seat's ping minute would move its idle compactions [inferred]: yes |
| W8 | small figures from in_wake and in_cost | not re-derived | no |
| W9 | one call, 642,636 written | held; the sender was a keep-warm ping | not a cut; the ping rules carry his words in code (`main.rs:12906-12908`, `:13102`) |
| C1 | character share 2.3-5.9% | held as arithmetic | not a cut; edits character documents (the file's T0-T4) |
| C2 | the "# Compact instructions" heading; D089 rates | not re-derived | causes no compaction; changes what every compaction keeps, which the rule's reason (`:9`) bears on [inferred] |
| C3 | tool-output share | not re-derived | no |
| C4 | wakes at 500k-930k | held (Table A medians) | yes: it drops the whole carried conversation at each wake |
| C5 | section sizes 41,237 B and 18,999 B | not re-derived | no |

### Marked [read], taken from in_cost

Lines 7, 30 (Table B medians), 50, 51, 52, 92, 103, 134, 136, 137, 149, 152, 159, 160, 169, 187, 188, 212, 218, 273,
283 and the table at 300-305 carry in_cost's figures marked [read] (line numbers as of this pass). Of these I
re-derived 50, 52, 92, 103, 134, 136, 137, 149, 152, 169, 187, 188, 212, 218, 283 and the token figures at 300-305.
Not re-derived: 51's 18.3%, 159, 160, 273 and 301's 71.3M (tool output).

### To rerun

```
D=C:/Users/nname/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/d2r
cd "$D"
bash run_extract.sh                                    # extract.js per seat, in parallel, about 10 s
node analyze.js 2026-11-13T14:52:08Z > a_1452.json     # or: node analyze.js now
node kw.js /c/Consonance/data/board.jsonl 2026-11-13T15:10:00Z   # also writes kw_rows.json
node kwjoin.js 2026-11-13T15:10:00Z
node kwcold.js 2026-11-13T15:10:00Z 7
node race.js
node sr.js
node sub.js "C:/Users/nname/.claude/projects/C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b/subagents" \
  2026-11-12T14:52:08Z 2026-11-13T14:52:08Z
```

- `extract.js <seat> <transcript> <out>` streams one transcript with readline. It parses only lines that hold
  `"type":"assistant"`, `compact_boundary` or the idle-notice phrase. Per message id it keeps the largest of input,
  cache read, cache creation (and its 1-hour part) and output, the earliest timestamp and the model. It drops
  `isSidechain` lines and `<synthetic>` messages. Compactions are `type: system`, `subtype: compact_boundary` lines,
  with `compactMetadata.trigger`, `preTokens` and `postTokens`. Idle notices are `system/informational` lines holding
  "Compacted while idle". It writes numbers and timestamps only.
- `analyze.js <end>`: context per call = input + cache read + cache creation. A cold call is the first after a gap of
  more than 60 min from the previous call in the same transcript, looked up before the window too. A model change is
  a call whose model family differs from the call before. Prints 24h and 48h figures per seat and in total, and the
  post-compaction table over the whole transcript.
- `kw.js`, `kwjoin.js`, `kwcold.js`: ping rows by the `keep_warm_row` shape (`main.rs:13266-13276`); each joined to
  the first call in that seat's transcript at or after the row, within 15 min. `race.js`: minutes from the previous
  call to each idle-paired compaction, and pings with a compaction between row and reply. `sr.js`: `ok` rows on
  `call_librarian` after 2026-11-03T15:25Z, tokens of all kinds. `sub.js`: the same usage rule over subagent files.
- The scripts sit in a session scratchpad, like the file's own. A later seat can rerun them only while it exists.

### What I did not open

- Tool-result sizes, so the 18.3% carried-output estimate and what is built on it (W4, C3) are not re-derived.
- The vendor docs, except the `idleCompaction` section of the scratch settings-reference copy.
- in_wake's and the out_* files' figures (loss counts, D089 rates, summary sizes, outside studies).
- The character/working byte split of each intake; C5's section sizes.
- Older transcripts per seat (only the newest, plus main's 747796ae); machine L.
- Why the activation rule let a ping through to a seat idle 13,722 min.
- Whether a compaction's new prefix is written at the compaction or at the next request (W1's cost).
- How many ping-reply writes would have fallen on a later real request anyway (the counterfactual for keep-warm).
- What `~/.claude/settings.json` said at the wake (it now says `"model": "fable"`, written 09:01:54 local).
