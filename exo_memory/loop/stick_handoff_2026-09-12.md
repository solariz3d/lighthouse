# THE SHORT VERSION — two commands, one per machine. Everything below this box is the long form and you do not need it.

On the laptop tonight, with Consonance closed, in a normal PowerShell window (the stick may not be D: there — use its letter):

    powershell -ExecutionPolicy Bypass -File D:\consonance-L-20260911\ARRIVING.ps1

It pulls the repo, brings every conversation over, and launches Consonance. If it stops and names a seat, that seat needs your call; nothing is half-written.

When you are done on the laptop, before you unplug:

    powershell -ExecutionPolicy Bypass -File D:\consonance-L-20260911\LEAVING.ps1

Back on the desktop: ARRIVING.ps1 again. Leaving the desktop: LEAVING.ps1 again. That is the whole loop. One machine open at a time between the two.

---

# HANDOFF — from the desktop, 2026-09-12 ~12:50, for the LAPTOP. Read this before you open Consonance there.

Written by the librarian seat on the desktop (machine D) at the keeper's word: *"create a hand off on
the thumbdrive with the transcripts for the laptop."* Every seat's conversation is on this stick under
`consonance-tails/` — seven files, 331.9 MB, written 12:46–12:47 by `dev/tail-carry.js --export --apply`,
each with its sha256 in `consonance-tails/ledger.json`. The 09-11 staging under `files/` is untouched
and is not what you import from.

## WHAT IS ON THE STICK

| seat | file in `consonance-tails/` | bytes |
|---|---|---|
| chair | `0c0c0c0a-…a01.0-260427744.tail` | 260,427,744 |
| librarian | `0c0c0c0b-…115b.0-43187910.tail` | 43,187,910 |
| Third Place | `3d000000-…3d00.0-36513712.tail` | 36,513,712 |
| pane A | `6fe15f0a-….0-2741537.tail` | 2,741,537 |
| pane B | `12fb81f6-….0-1319664.tail` | 1,319,664 |
| pane C | `0845a868-….0-1480718.tail` | 1,480,718 |
| pane E | `a2122153-….0-2354905.tail` | 2,354,905 |

These are the desktop's live conversations as of 12:47. The first carry is the whole file; every carry
after this one is only the new bytes.

## ON THE LAPTOP — in this order, in a plain PowerShell window, Consonance CLOSED

1. Pull the room's files. The carry tool lives in the repo and the laptop must have it:

       cd C:\Consonance\lighthouse
       git pull

   HEAD must be at or past `da5d178` (A's tail carry). `git log -1 --format=%h -- dev/tail-carry.js` must print something.

2. Find the stick's drive letter on the laptop (it may not be D:). Below it is written `D:`; substitute.

3. REHEARSE the import. Writes nothing; reads the laptop's own state and says, per seat, what it would do:

       node dev\tail-carry.js --stick D:\consonance-L-20260911 --import

   Expected, from what the desktop knows of the laptop (a prediction, not a reading — the rehearsal is the reading):
   - chair, librarian, Third Place: `FULL` — the laptop moved its own copies to its attic at 00:27:29 on 09-11, so nothing is in the way.
   - panes A, B, C, E: possibly `REFUSED` — the laptop's panes may hold their own short lives from the morning of 09-11. The message names the flag.

4. If a pane is refused as "a different conversation under the same sid", the laptop's copy is the
   migrate-born one from 09-11 morning and the stick's is the real one (B's and C's begin 2026-09-09).
   Retire the laptop's, per seat, by name — never wholesale:

       node dev\tail-carry.js --stick D:\consonance-L-20260911 --import --apply --retire-far 12fb81f6-f4c0-4ef8-aad8-f0cdce091925 --retire-far 0845a868-38f2-4cc2-b45a-431e0c088fb1 --retire-far 6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f --retire-far a2122153-a37e-41a6-a86f-534267ec0565

   (copy the exact ids from the rehearsal's output rather than from here). A retired file keeps a stamped name and is never deleted.

5. Otherwise, or after step 4 for the fixed seats:

       node dev\tail-carry.js --stick D:\consonance-L-20260911 --import --apply

   It hashes every rejoined file whole against the desktop's recorded sha256 and refuses on any mismatch.

6. Launch Consonance. Then the score, the same one that passed on the desktop: in `C:\Consonance\data\persist.log`
   the launch rows must read `-> RESUMED` for every seat, and each seat's first `"timestamp"` must be OLDER
   than the launch (the chair's is 2026-06-30, the librarian's 2026-09-01, the Third Place's 2026-08-25, B's and C's 2026-09-09).
   A seat whose first timestamp is the launch minute is a new conversation, and the carry did not work for it.

## THE ONE RULE FROM HERE — the keeper's to accept, and it is what makes the stick safe

**Between two carries, Consonance is open on ONE machine only, and the carry runs BOTH ways.**
Opening Consonance appends a few hundred bytes to every resumed seat before anyone types, so a
machine that was merely opened has "moved". The tool refuses a moved destination rather than merging,
because two continuations of one conversation cannot be merged.

So the loop is: desktop used → close it → export to the stick → laptop: import, use, close → export to
the stick → desktop: import, use → … Export from the machine you used; import on the one you did not.

**On the desktop before you leave tonight, if Consonance ran there after 12:47:** close it and run the
export once more. It is a tail now — seconds, not a minute:

       cd C:\Users\nname\Desktop\lighthouse
       node dev\tail-carry.js --stick D:\consonance-L-20260911 --export --apply

If you forget, nothing breaks; the return import on the desktop will refuse the seats the desktop
touched after 12:47, name them, and the fix is `--retire-far` for those seats (losing only what the
desktop did after the export).

## DO NOT, on the laptop

- **Do not run `consonance/tools/close.js` or any state-sync push.** The launcher's Migrate arm still
  retires transcripts to the attic (`sync_launch.rs` `attic_for`); a state head from the laptop would
  make the desktop's next launch retire the seats this stick just carried. The room's FILES travel by
  ordinary `git commit` and `git push` of the lighthouse repo — that pipe is fine. The CONVERSATIONS
  travel only by this stick.
- Do not run `laptop-to-desktop.ps1`, `desktop-receive.ps1`, or `desktop-place.ps1` — superseded.
- Do not delete anything under `consonance-tails/`. The ledger there is the agreed state both machines key on.

## WHO WAKES

After the import, the laptop's librarian IS the desktop's librarian, continued — this conversation. Its
first act is `git pull`'s tail: `exo_memory/loop/handoff_librarian_2026-09-12.md` and the last entries of
`exo_memory/librarian/2026-09-12.md`. The chair likewise. Nothing on this stick is a summary of them.

## IF YOU OPEN CONSONANCE ON THE LAPTOP FIRST AND ASK THE SEATS — that is fine

The seats that wake before the import are NOT the desktop ones; they are new sessions born at that launch (the laptop moved its real seats to its attic on 09-11). They can read the repo after a `git pull` and will find this file and `exo_memory/loop/handoff_librarian_2026-09-12.md`. They cannot run the import themselves: it needs Consonance closed, and closing it closes them. What they will tell you is the same as this file: close Consonance, run ARRIVING.ps1 from the stick.

ARRIVING handles what that launch left behind: a fixed seat whose laptop copy BEGAN AFTER the stick was exported (12:47 on 09-12) is a session born at that launch, not the lineage, and ARRIVING retires it automatically (stamped, never deleted) and takes the stick copy. Nothing real is lost. If a fixed seat is refused for any other reason, ARRIVING stops and names it.

## A FACT, NOT A CONDITION (the chair, 13:00): the 12:47 export was already stale by 12:55

Chair 260,427,744 B on the stick vs 260,641,254 live (+213,510); librarian 43,187,910 vs 43,586,884 (+398,974). Writing this handoff is what moved them. Every sentence any seat writes moves its file past the export. So on the DESKTOP a watcher window is already running (started 13:01 on 09-12): the moment Consonance there is closed it runs LEAVING.ps1 and refreshes the stick. If that window is not there when you leave (a reboot kills it), run LEAVING.ps1 on the desktop yourself before unplugging — otherwise the laptop import still works (first carry is full), but the RETURN trip will refuse every seat the desktop moved after 12:47, by name, and the fix is --retire-far per seat, losing only what the desktop wrote after the export.

One more thing worth knowing before you settle in to explain the situation to a seat born at that launch: anything you say to it before the import goes to the attic when ARRIVING retires it — kept and stamped, but you would have to go looking. Keep it to one question; it will answer in three lines and tell you to close and run ARRIVING.
