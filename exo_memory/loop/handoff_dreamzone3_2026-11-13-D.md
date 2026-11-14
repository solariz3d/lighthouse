# Dreamzone 3 ("The Absolute"), handoff 2026-11-13 (D, written 23:3x local; landings are still in flight, and THE CLOSE is added at the end)

Written by the librarian on D. This file says where to start; it replaces nothing.
- His words: `briefs/dreamzone2_the_game.md`, items 196 to 219 are today's on D (from about :1480 to the end), each verbatim with its time,
  each followed by a state line.
- The day in order: `librarian/2026-11-13.md`, from "08:46".
- **The animation work has one table of record:** `loop/path_of_record_animation_2026-11-13.md`. Read it before any animation packet. It
  is wrong if a pane starts a lap that the table marks as built, landed or another pane's, and no seat says so before code.

## His words that set today's work (verbatim; whole in the brief at the item named)

- 07:46, item 195 (on L): "they are stomping when they stride like up down up down up down in a weird goofy way"
- 11:40, item 206: "it should still keep chasing the player, i just dont want an OP undetectable hunter abusing the runner, they should know
  where it is most of the time or that is the goal"
- 11:42, items 207 and 208: "moving like an alien hyena"; "in that split second you see it, it turns up right and starts running like a human"
- 11:49, item 209: "ngl the floor plan artifact is sort of incomprehensible to me"
- 12:58, item 212: "i should say, for our build i want it as close to 360 as we can get it for true ultra, but i can settle for a solid 300+"
- 14:03, item 213: "yeah probes looks ass and loses the darkness we want"
- 14:21, item 214: "on the corners, the torso doesnt orient itseld into the banking of a turn, it looks very good, but is starting to become
  too human looking, we need to almost start to tweak it to be creepy some how"
- 14:32, item 215, his catch: "we did do tons of research, remember"
- 14:41, item 216: "i think we devolved a shit ton with that artifact"
- 14:43, item 217: "i think from the idea i had in my head, we get the a good metric for a really human looking sprint which we had, and then
  we tweak it from there to look uncanny in a realistic way that obeys physics"
- 16:05, item 219: "is the new lighting in the newest built"

**The problem, in one line (the seat's):** the hunter has to run like a measured human sprinter before it is made wrong on purpose, the
picture has to keep its darkness without the static, and what is put in front of him has to be what the game now is.

## Where the code is (checked at 23:2x with `git ls-remote` and the history of a landing tree)

- **The game's `origin/main` is `e0fcdec`.** His play build on D is `31d1c6d` (his clone, clean, untouched all day). Between them, six
  landings (eight merges on the first parent):
  1. `d8ef536` the run's frame (O's `o-run-frame`, landed by A): the last-minute line "It is coming" with its countdown, the two end cards,
     the title behind one constant, one difficulty in the score line, and F (a tap switches the light, a hold tightens the beam; item 191);
  2. `d002b65` the stomp fix (C's `l205-stomp-c`, landed by E): his item 195;
  3. `b08f25e` the tell row (E's, landed by C);
  4. `796c16f` the first end-point measure, the fastest toe over the running speed (E's, landed by B; tools only);
  5. `81eb524` the take-off snap fixed (C's `d675-toepop-c`, landed by B). His own build never had the snap;
  6. `e0fcdec` the fall row split into a counted half and a machine-bound half, and **the Dark drawn** (B's and E's, landed by O). Before
     it, the creature that ends a ten-minute run was tracked and drawn by nothing, in his build too.
- **In flight at 23:3x:** pane E is landing the lighting filter, `d675-filter-c` `c9209c3`, as a setting that is off by default. Its check
  was read alive from the process tree at 23:15. A first attempt held a lock slot for 50 minutes with nothing under it (note, 23:07).
- **Next in the queue:** pane B lands P's timer control (`d675-timer-p`) and C's render build fix (`d675-errlvl-c` `91f5b2a`) in one tree,
  once each has merged the new main and rung its tip. Then C runs the filter's cost table again.

**Branches, by where they are:**

| what | branch and tip | where | state |
|---|---|---|---|
| the lighting filter (C) | `d675-filter-c` c9209c3 | remote | landing; off by default until his eye |
| the timer control (P) | `d675-timer-p` ca915c8 (main 8249d58 merged in) | remote since about 23:35 | lands with the next row; see THE CLOSE |
| the render build's crash codes (C) | `d675-errlvl-c` 91f5b2a | remote | waits for a merge of main, then B lands it |
| the soft upper body, L12 (E) | `l185-skeleton-steps45` 52da2b5 | remote | cost passed; waits on his eye only |
| the grip law and the hawk, L182 (A) | `l182-lines` c357bbd, `l182-hawk` ee55947 | remote | built on 11-12, off by default; A's first code lap on waking |
| the hunter knows where a stopped player is (A) | `a-kit-told` dcbfd3c | **D only** | his item 65; suite owed on a quiet machine |
| the Dark closes at 10 m (A) | `a-d673-close` 010c9f3 | **D only** | caught seed 8's juke run in 13.6 s, where it had not in 370 s |
| the record's generator fields (A) | `a-gen-record` b311709 | **D only** | mutants and suite owed |
| the Park kit (B) | `gen-lap2-kit` fcf5c43 | **D only** (the remote holds L's c9ad588) | waits on A's sprinter row alone |
| the hunter's voice and the player's steps (E) | `l192-footsteps-e` 367fe1c | remote since 23:28, under this new name (the remote's `l192-footsteps` d8f77ba is the older line, left as it was) | two rows held red for his ear |
| the fist's joints, L188 step 2 (B) | `l188-step2` b676860 | remote | not started on D |

Each pane pushes its **D only** branches to the game's private remote before the close; THE CLOSE says which did.

## From the last handoff (L's `loop/handoff_dreamzone3_2026-11-13-L.md`), item by item

**Its PICK UP HERE:**
1. *Read each pane's WHERE IT STOPS.* **Done** by 09:42.
2. *Land what was green and READY at the close.* Nothing was beyond what L had landed.
3. *C: the legs, then the frame with the timer line and the title.* **Done:** the legs' stomp fixed (landing 2); the frame built by pane O,
   which had been idle since about 11-04 until his catch at 11:01 (landing 1).
4. *A: the overtime chase, then the exploit search from his run.* **Partly.** The brutal sweep ran: no cell meets all three bands, the
   defaults stay, and the finding is that the Dark orbits a juking player; fixed on `a-d673-close`. The overtime rules' mutants: applied 17,
   caught 8, not applied 2, **nine rules with no row** (named in the note, 17:20). His wall-to-wall is in none of the four runs A replayed on
   L, so **where he tested it is still a question for him.**
5. *E: the stomp for his ear, then the voice into the game.* **Built on a branch, not landed:** his pick (item 192) and the player's steps
   (item 193) are on `l192-footsteps`; two rows wait on his ear (clips in the worktrees' `clips_L199` folder, on D only).
6. *B: the Park kit, the guard, the fist.* The kit is green but for A's sprinter row; the guard is landed in the room; **the fist is carried.**

**Its "Open with him":** (1) the timer's words: **built as "It is coming" with the countdown,** shown to him on a page, not confirmed by a
word of his. (2) Whether the flashlight takes one of the six ability slots: **still open.** (3) Whether "Parks close in overtime" meant
sealed: **still open.** (5) The two sprint-speed notes: **still open,** taken as the later.

**Its other sections:** the sprint reference was spot-checked by E (78 of 78 values; one wrong explanation corrected in place); the legs
above 4.5 m/s are refit to the one recorded runner with a blend, and E read C's amended gate and agreed (note, 09:35, 14:20, 14:25). The
yardstick's list: the hunter is done as far as landings 2, 4 and 5; **the player's legs are carried,** and the path of record gives the
player's laps to pane B. A's open items: the stale registered sum (599ab239) was **not looked at**; the brutal arms of L182 are carried with
its landing; the record line for C is in landing 1. The Third Place's story swarm: its critic ran on D
(`loop/absolute_sources_2026-11-13/99_what_is_missing.md`); what bears on the build is listed in the note at 09:13 and is not dispatched.

## What was measured today that changes how the room builds (each with its file)

- **An end-point measure found what the angle bars could not.** The hunter's toe flicked 12 cm for one tick at every take-off at chase
  speed; it had passed its own rows, a recorded-runner fit, a second pane's read and my eye (`handback/p-d675-toe-ratio-C_2026-11-13.md`).
  And a ruling of mine had amended the bar that was reporting it (`map/M.md`, 19:28).
- **The drawn lean in a corner is none, then too much:** about 0 where 15 to 48 degrees is called for, then 63 to 75 where 51 is
  (`handback/p-d675-corner-C_2026-11-13.md`). The grip law he picked in item 168 is built on `l182-lines` and off. Three readings point at
  one lap: land it behind its dials, then film the same corner at grip 1.0, 1.3 and 2.0.
- **The filter:** it failed both rows as first registered and both are said first wherever it is reported. Re-registered with a
  non-author's seven lines: flicker at his resolution 0.38 of the unfiltered (bar 0.75); settled darkness +0.06 to +0.09 levels of 255
  (limit 0.25), with the row able to see a lift in one view of four, so his eye on the stills decides
  (`handback/p-d675-filter-C_2026-11-13.md`, sections 8 to 11; `handback/p-filter-read-P_2026-11-13.md`).
- **The bench was dropping 3 to 4 frame slots in 100, and it was the machine, not a landing:** Windows ignored the bench process's 1 ms timer
  request in nearly half its sleeps. One documented call fixes it (10,801 of 10,801 slots, three runs)
  (`handback/p-d675-sleep-P_2026-11-14.md`, `handback/p-d675-timer-P_2026-11-14.md`). Why noon drew every slot is open.
- **The frame budget is his now:** p99 under 3.33 ms at 2560x1440 on his card is the gate ("a solid 300+"), 2.78 ms the aim reported beside
  it; 4.17 ms for most players waits on a named card. The filter's p99 read 2.33 to 2.36 ms, to be read again once the timer fix is in.

## Rules in force for the game (the rulings are in the note at the times named)

- A render feature lands as a setting, off by default, until his eye. The probes are out (item 213).
- No frame-time figure while a game of his is on the card; every timing run records the card's other users at its start and end (14:10).
- No before-and-after goes to him whose "before" is older than a fix he has already been shown (14:48).
- A lander names each program's own exit code and "passed" line; a world self-test that exits 3 is read once more under the exclusive
  hold and both readings are named; authors resolve their own CHANGELOG conflicts and landers edit nothing.
- Nothing in the gait is refitted to the recorded runner at jog speeds: it is one runner, said wherever his band is printed (17:16, 17:34).
- The hunter's knowledge follows item 65: a player who stops is found (10:50). Close pursuit is for the Dark only (09:55).
- The first lesser kind to get a body is the sprinter; my ruling, his to overturn (the path of record, section 6).
- His play build is not updated without his word. My recommendation stands: update it to the game's main.

## For his eye and ear (each page is private to him; the question each one asks)

- The run's frame, landed: https://claude.ai/artifact/Na1KBViy9sDkRetxzrDAZP
- The stride after the stomp fix; the take-off knee at 15 or 25 is his to choose: https://claude.ai/artifact/DTyjZxQTT4Pq3nX74JD6nR
- The foot snap and its fix, landed: https://claude.ai/artifact/Gm6UJ2SVECUYgpebqs2gHc
- The corner lean, measured: https://claude.ai/artifact/WVfVH2Yksh3fp1dAgw7Bbt
- The soft upper body: can he see a difference in motion, and does he want more swing: https://claude.ai/artifact/HNhdMFQqBKvuBKwAqfSRFz
- The lighting filter, on or off, by the dark stills: https://claude.ai/artifact/WNPBDPhatTVvMqjn7xy4g9 (its cost table keeps one caveat
  until the re-run)
- The Dark, drawn; its look and its name are his: https://claude.ai/artifact/5RFgTY8EsrnYNV1Tmf6nsv
- The Park kit from inside the game, with a frozen copy to play: https://claude.ai/artifact/GC4FtumaPR3LvdQ6tBNrNg
- By ear: the hunter's voice trim pair and the player's steps, two clips each, on D.

## From the Third Place, for this handoff (its message of 23:37, its words; checked by the librarian where marked)

- "The lighting filter's code is on the game's private remote as the branch gi-experiment at 2d6a4d6, pushed by this seat at 23:37. It
  existed on D alone … Code and scripts only, 17 files, scanned for credentials, none of his words in it. Main was not touched and
  nothing is marked READY. It is off main 31d1c6d, so it is behind main as it now stands." (Checked: `git ls-remote` shows
  `gi-experiment` at 2d6a4d6. The filter that landed is pane C's cut of it, `d675-filter-c`; this branch is the experiment's own record.)
- "I pushed it on his line of 23:23 … which I read as covering it. If you rule it should not be there, it is one branch to delete." (Not
  ruled against: it is his private remote, and it is the source the landed filter was cut from.)
- "Both experiment reports are now in the record as byte copies: exo_memory/loop/render_experiments_2026-11-13/
  (REPORT_filter_and_two_bounces.md, REPORT_probes.md, and STATE.md, which says what stands and where the code is)." (Checked: the three
  files are there, lighthouse 6a9ebe8e, on main.)
- "Only on D after tonight: the first experiment's report commit with its pictures (… d35503b), the whole probe branch (… cea4e6a), the
  baseline worktree, and the 9.7 GB of scratch already listed to you."
- Its closing entry for the laptop's seat: `third_place/2026-11-13.md:1045`, "23:37, on D: the close. Where things stand for the laptop".

## On D only (does not travel; named so L does not look for it)

- **The bodies' Blender scripts and `sprinter.glb` live only in pane A's scratch folder.** Putting them in the repository is A's first lap
  (L14 of the path of record), and that folder stays off every move list until then.
- The clip folders in the worktrees folder, every build tree on `G:\consonance-scratch`, the frozen kit copy (`dz3-kit-play`, 28c6879), the
  two render experiment clones, and his 20 kept runs.

## PICK UP HERE

1. Read THE CLOSE below, then the note from "23:16" to its end.
2. **His answers first, when he gives them,** into the brief in the same turn: the pages above; whether his build is updated; where he
   tested wall to wall; the flashlight's slot; Parks sealed or not; the sprint speeds.
3. **Land what is ready:** whatever THE CLOSE leaves of the filter, the timer control and the render build fix; then C's cost table again
   and the filter page's caveat removed.
4. **Pane A, in this order** (its hand-backs are on the room's branch `a-d673-brutal-lh` until merged; see the room's handoff): L14; its
   L182 onto main behind the dials, with the sweeps; the corner room (`handback/p-corner-room-A_2026-11-13.md`, registered); the nine rows
   red first and the two mutant re-runs; the Dark's second grid; the record's identities. `a-kit-told`, `a-d673-close` and `a-gen-record`
   land with a suite on a quiet machine (four rows are on the load-sensitive list; note, 15:23 and 15:32).
5. **Pane C,** after the cost table: the corner filmed with the grip law on; the trunk's share for his eye; L3 of the path of record
   rewritten from the measured table; the open crash at exit (0xC0000005) with its reproduction.
6. **Pane B:** the kit lands when the sprinter row is green in both worlds; the two script lines of the same shape as the crash-code hole
   (note, 22:35); the fist with E; then the player's laps of the path of record.
7. **Pane E:** the footsteps branch after his ear; the upper body after his eye; the rest of L1 (the clip tool's manifest and rows).
8. Recorded and NOT planned: the stalking hunter (items 205 to 208), a function for each biome (204), his two parked swarms (200, 201).

## THE CLOSE (written 00:4x local on 2026-11-14 by the librarian; where a line above disagrees with this section, this section is the later one)

**The game's `origin/main` is `99b6045`** (checked: `git ls-remote`, 00:35). His play build on D is still `31d1c6d`, his clone clean and
untouched. Between them: **eight landings** (ten merges on the first parent). The two after this file was first written:
7. `8249d58` **the lighting filter, as two settings that are off** (`light_filter = 0`, `gi_bounces = 1` in `game/config/world.txt`;
   pane C's `d675-filter-c` c9209c3, landed by E; `handback/p-d675-filter-landing-E_2026-11-13.md`).
8. `99b6045` **the timer control and the render build fix,** one merge (C's `d675-errlvl-c` d50255f, which carries P's `d675-timer-p`
   ca915c8; landed by B; `handback/p-land-timer-errlvl-B_2026-11-14.md`). The world self-test now has 61 rows, the timer row among them.
   The bench drew every frame slot with and without the control at 23:35, so the bench does not show its effect that night; the row does.
   Why the machine's timer state comes and goes is open (`handback/p-d675-timer-P_2026-11-14.md`, sections 4 and 7).

**Nothing is waiting to land in the game.** PICK UP HERE item 3 is done.

**The filter's cost on his card, read again clean** (`handback/p-d675-filter-C_2026-11-13.md`, section 12; checked by me in the log and
with C's table tool): seven runs on `99b6045`, every one of 10,801 frame slots drawn in each; the filter's p99 2.341 to 2.343 ms, worst
frame 2.598 to 2.741; the defaults' p99 1.968 to 1.974, worst 2.248 to 2.370; +0.37 ms. Inside his 3.33 ms line and the 2.78 ms aim, the
worst frame too. His page carries it (version 4). What is left on the filter is his eye on the dark stills and his word to switch it on.
- *Beside that table, said plainly:* two seats ran light commands inside C's exclusive hold. Pane O: a push, two git reads and a process
  scan from 06:29:27Z to about 06:30:40Z (O's hand-back, section 7), which covers runs 1 and 2. The chair: ledger rows and git reads from
  06:31:55Z to about 06:32:30Z (its ring of 06:34Z), which covers part of run 5 and the start of run 6. Runs 3, 4 and 7 are clear of
  both: two of defaults and one of the filter (06:31:12Z, p99 2.342, worst frame 2.688). The three filter runs read the same p99 to two
  thousandths; the largest worst frame (2.741) is in a run that had company.
- *And beside P's bench on the merge:* O ran one test file twice inside P's hold at 05:35:2xZ to 05:35:50Z (O's section 3), which touches
  P's first run only. The finding rests on three runs without the control; two of them are clear of it.

**Every branch that existed only on D is on the game's private remote** (checked: `git ls-remote --heads`, 00:35): `a-kit-told` dcbfd3c,
`a-d673-close` 010c9f3, `a-gen-record` b311709 (pane A's, pushed by O); `gen-lap2-kit` fcf5c43 (B); `l192-footsteps-e` 367fe1c and
`tell-row-kit-e` 535e152 (E); `d675-timer-p` ca915c8 (P, now in main); `gi-experiment` 2d6a4d6 (the Third Place). The table above says
"D only" for some of these; they no longer are.
- **Still on D only:** two of pane A's work trees on G: hold uncommitted lines (5 and 1 lines of status, by the chair's count, relayed in
  O's hand-back; not looked at by me or by O); the bodies' Blender scripts and `sprinter.glb` in A's scratch folder (L14); the clip folders,
  the build trees, the frozen kit copy, and his 20 kept runs.

**Each pane's own WHERE IT STOPS is the master for its lane:** C's in `handback/p-d675-filter-C_2026-11-13.md` (seven open items, the
fullest list for the hunter's body and the render); E's in four hand-backs (lighthouse 6237b3de); B's in its kit, train, Lap W and landing
hand-backs; P's in `handback/p-d675-timer-P_2026-11-14.md`; O's in `handback/p-close-O_2026-11-14.md`; A's in
`handback/p-d673-overtime-A_2026-11-13.md` and `handback/p-corner-room-A_2026-11-13.md`, now on main.

**His, added at the close** (the Third Place's closing entry, `third_place/2026-11-13.md:1045`): a ruling on the second bounce of light; a
named graphics card for "most players"; which of the lore swarm's offers go into the story bible.

**My recommendation to him stands and now names `99b6045`:** update his play build. Against his build it has the last-minute timer and the
end cards, the stride without the stomp, no take-off snap, the Dark drawn, the filter as a setting he can switch on, and the timer fix. It
stays his word; D is off until he is back at it.
