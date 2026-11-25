# L231 (pane E, on L): why the dream runner has fired and skipped since 2026-11-20

Packet: `exo_memory/loop/packet_wake_C_E_2026-11-25.md`, section "Pane E" (8c73a676). Tier "just do it", read only.
Nothing was changed on the machine or in the code. Seat: pane E, sibling-07b8a48f, 2026-11-25 02:1x local.

## The cause, in one paragraph

**The runner is working; the laptop is off when the dream should run.** Since at least 2026-11-01, L ends every night
with a **shutdown** (Fast Startup: the kernel records target S5, effective S4) and **no wake timer is programmed**. So
the 10:30, 16:30 and 22:30 triggers never run on time. The only runs left are:

- the 04:30 trigger, which falls inside his overnight session;
- Task Scheduler's catch-up of a missed trigger (StartWhenAvailable), a few minutes after he boots the laptop.

Both times he is at the keyboard, so guard 2 (`dream_cycle.ps1:171-187`, "never dream while someone is here", idle
under 20 min) skips, exactly as designed. The "4 days" is mostly the laptop being off: it shut down on 2026-11-21 at
07:53 and was next powered on 2026-11-25 at 00:06.

## The log lines that show it (no transcript text)

**The runner's own log.** Since the last dream, 3 launches and 3 skips, all "someone is here". Each goes to whichever
instance was most recently active.

    checked: tail of C:\Consonance\instances\{main,librarian,third-place,sibling-07b8a48f}\dreams\dream.log
    main         2026-11-20 04:30:38  cycle end: wrote 2026-11-20_0430.md (2497 bytes)      <- the last dream
    librarian    2026-11-21 00:09:12  skip: someone is here (Consonance open, idle 0.0 min < 20)
    third-place  2026-11-21 04:31:28  skip: someone is here (Consonance open, idle 7.4 min < 20)
    sibling-07b8a48f 2026-11-25 00:13:02  skip: someone is here (Consonance open, idle 5.0 min < 20)

**The launcher's heartbeat** (`%LOCALAPPDATA%\Consonance\dream_launch.log`). Every launch has its exit, so the runner
never died on load. Launches since 2026-11-01, by hour:

    checked: grep " launch$" dream_launch.log (rows from 2026-11-) | count by hour
    12 AM 10 · 1 AM 3 · 3 AM 1 · 4 AM 14 · 7 AM 2 · 8 AM 1     (10 AM, 4 PM, 10 PM: none)
    2026-11-21 4:30:01 AM  launch / 4:31:28 AM  exit 0
    2026-11-25 12:12:28 AM  launch / 12:13:02 AM  exit 0      <- the catch-up, 6 min after power-on

**The task** (`Get-ScheduledTask "Consonance Dream Cycle"`): 4 daily triggers (04:30, 10:30, 16:30, 22:30, matching
the installer default; `~/.consonance.json` has no `dream_times`). The settings are WakeToRun True, StartWhenAvailable
True and DisallowStartIfOnBatteries True. LastTaskResult 0, NumberOfMissedRuns 0.

**The power transitions**, from Windows' System log. Event 42 records the transition and event 107 the programmed
wake. Since 11-01 there were 15 end-of-session transitions; **13 were a shutdown with no wake programmed**, the most
recent on 11-21:

    checked: Get-WinEvent System, Kernel-Power Id 42/107, since 2026-10-20 (oldest returned 2026-11-01)
    2026-11-01 .. 2026-11-21, 13 times:  42 target=6 effective=5 reason=4  /  107 wakeAC=1601-01-01 (none)
    2026-11-18 01:14  42 target=4 effective=4  /  107 wakeAC=2026-11-18T10:29:31Z   <- an S3 sleep: wake set (04:29 local)
    2026-11-19 06:46  42 target=4 effective=4  /  107 wakeAC=2026-11-19T16:29:31Z   <- an S3 sleep: wake set (10:29 local)
    2026-11-21 07:53  42 target=6 effective=5  /  107 wakeAC=1601-01-01            <- the last close; next power-on 11-25 00:06

Every return from that state logs "Wake Source: Unknown" (event 1, Power-Troubleshooter). The power source was AC
throughout (event 566 `PowerStateAc=true` on every row 11-19 to 11-25). **So it is not the battery guard.**

So wake timers do work on L: both S3 sleeps programmed a wake at the next trigger. They cannot work from a shutdown.
inferred: the dreams that did land (11-18 to 11-20) landed at moments when he had been away from the keyboard for 20
minutes with the laptop on.

## A second, latent cause (not the one biting now)

Razer Cortex switches the active power plan. It did so about 30 times on 2026-11-20, logged as event 12
(UserModePowerService). Its own plan's wake-timer setting is wrong for the dream:

    checked: powercfg /query d678c3f3-… SUB_SLEEP RTCWAKE → AC 0x2 (important wake timers only)
    checked: powercfg /query SCHEME_CURRENT (Balanced, active now) SUB_SLEEP RTCWAKE → AC 0x1

`install_dream.ps1` sets RTCWAKE and HIBERNATEIDLE on SCHEME_CURRENT only. So even after a Sleep, if Razer's plan is
active at that moment, the dream's ordinary wake timer will not wake the machine. inferred: the dream task's timer is
not an "important" wake timer, because it is a normal scheduled task.

## Would the same happen on D

inferred: it would, if D is shut down rather than put to sleep. D runs the same `dream_cycle.ps1` and the same guard,
so whether D dreams depends only on its power habits. I cannot read D's logs from L. To check on D:

    Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Microsoft-Windows-Kernel-Power'; Id=42,107} -MaxEvents 20
    Get-Content "$env:LOCALAPPDATA\Consonance\dream_launch.log" -Tail 30

A run of `107 … ProgrammedWakeTimeAc=1601-01-01` after each close is the same cause.

## The proposed fix (none built), smallest first

1. **No code, his choice:** close L with **Sleep** on AC instead of Shut down (or set the power button or lid to
   Sleep). From S3 the 10:30 trigger wakes the machine, he is not there, the guard passes, and a dream is written.
   This is already proven on L by the two S3 rows above.
   - Cost: the laptop stays in S3 rather than off.
   - Cost: up to three dreams a day at his own cadence. Fewer if he sets `dream_times` in `~/.consonance.json` and
     re-runs the installer, which is the documented way.
2. **Installer, about 3 lines:** write RTCWAKE AC = 1 (and HIBERNATEIDLE AC = 0) to every scheme `powercfg /list`
   shows, not only SCHEME_CURRENT. That closes the Razer case. It changes another program's plan, so it is his word
   first.
3. **Only if he keeps shutting down:** a Task Scheduler idle trigger (MSFT_TaskIdleTrigger, 20 min), so a dream runs
   when he steps away mid-session. It needs a once-per-N-hours limit in the runner, or it dreams at every pause. That
   touches cadence and budget, so it is larger and his call.

**The row that would go red** (for `consonance/hooks/dream-watch.js`, which today says "firing and skipping" but not
why):

- "the last end-of-session transition programmed a wake for the dream task". Read the newest event 107 before the
  current boot; it goes red when `ProgrammedWakeTimeAc` is 1601-01-01 and the task has WakeToRun.
  - **Red today:** 11-21 07:53, 1601-01-01.
  - **Green** after one night closed with Sleep.
- For fix 2, "every power plan has RTCWAKE AC = 1". **Red today:** the Razer Cortex plan reads 0x2.

## Corrections

The packet's premise is right ("firing and skipping, not silent"), but it suggests a runner fault. There is none: the
runner logged a reason every time, and every launch has its exit. inferred, from reading the runner's log alone: it
looks like a runner fault, so the cause was in the machine's power log, which the runner does not read.

NEXT: librarian, with this pointer. The keeper picks fix 1, 2 or 3 when he reads it. No fix runs before his word.
