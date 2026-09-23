# Fuse the Claude Code update into Consonance's own restart — the keeper's idea, saved with its prior art (not built)

*Librarian, on L, 2026-09-23 ~01:0x. The keeper, verbatim: "you know how claude auto updates in the pane after a startup?
Would it be possible we can fuse the claude update with the consonance rebuild so that we dont have to restart every
time there is an update."*

## WHAT IS TRUE NOW, MEASURED ON L AT 01:0x
- Every seat launches the same `~/.local/bin/claude.exe` (`consonance/src-tauri/src/main.rs:918`) with **no `--model`
  flag** (`:8310`). The model comes from `~/.claude/settings.json` → `"model": "opus[1m]"`, an alias that the RUNNING
  binary resolves. Auto-update is on (`"autoUpdatesChannel": "latest"`), and **nothing in Consonance touches updates**
  (grep of `launch.ps1`, `main.rs`, `install.ps1` for `claude update` / `autoUpdates` → 0).
- `~/.local/share/claude/versions/` holds **2.1.273, 2.1.278 and 2.1.280**. The seats' transcripts show **two versions in
  the room at once**: 2.1.280 in the chair, the Third Place, this seat and two panes; **2.1.278 in two panes**, one of
  which is C (`sibling-0845a868`). C's last rows also read **"Login expired · Please run /login"**. The keeper ran
  `/login` only in this seat.
- **A running claude.exe never swaps its own binary.** An update is downloaded, and it takes effect only when that
  process restarts. So a room whose seats started at different moments ends up with mixed versions, and the alias
  `opus[1m]` can resolve differently in different seats.

## PRIOR ART
- `loop/packet_composer_update_2026-09-09.md` (L050): **an auto-update at launch changed the composer's screen, and
  every delivery that night forced at the 240 s bound (6 of 6)**, because the predicate did not know. Updates arriving
  on their own schedule have already broken the room once.
- Cold-start cost (this seat's memory, 2026-09-18/19): a restart makes each seat re-read its whole conversation
  uncached. **A model change forces that re-read anyway**, because the prompt cache is per model.
- Keep-warm (`loop/plan_keep_warm_2026-09-21.md`) covers idle gaps, not restarts.

## THE SHAPE THAT FITS (a proposal, not a design)
1. **Turn Claude Code's own auto-update OFF for the room's seats**, so no seat changes version mid-session. Confirm
   the exact setting or env var against the current docs before building; do not guess the key.
2. **Consonance runs `claude update` once, at launch, before any seat starts** (`claude update` exists: "Check for
   updates and install if available"). Every launch then starts every seat on one version, the newest.
3. **An update never forces a restart.** When a newer version exists mid-session, the app says so, and the update is
   taken at the next restart the keeper was going to do anyway (a rebuild, a machine change, the leave window). One
   restart, not two.
4. **Record the version per seat** (the transcripts already carry it) in the launch receipt, so a mixed room is
   visible, not discovered.

## WHAT IT CANNOT DO, STATED NOW
- It cannot give a new binary to a running process. Getting new code or a new model into a seat always means one
  restart of that seat, and one uncached re-read of its conversation.
- The saving is in **count**: updates stop adding restarts of their own, and stop splitting the room across versions.
- Its falsifier: after it lands, any launch whose receipt shows two Claude Code versions across seats, or any
  mid-session version change in a seat's transcript, means it failed.
