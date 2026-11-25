Rows run by pane C at l233-next-move-glow bd113955 (worktree C:\Consonance\lh-wt-c-l233), 2026-11-25 ~09:22Z.

1. The helper with the app gone and the exe missing (pid 999917 checked dead first: process.kill(pid,0) -> ESRCH):
   node consonance/tools/relaunch.js --pid 999917 --exe "<scratch>\l233\no-such-dir\consonance.exe" --log "<scratch>\l233\log1.jsonl"
   -> exit 0; relaunch_missing_exe.jsonl holds one row, outcome "opened". Nothing was opened.
2. Why: spawn_err.js does what defaultLaunch does, but stays alive to listen:
   node spawn_err.js "<scratch>\l233\no-such-dir\consonance.exe"
   -> "spawn returned, pid undefined", then "error event: ENOENT" (after spawn returns; relaunch.js has already logged and exited).
3. B's own files: node consonance/tools/relaunch.test.js -> 8 passed, 0 failed; node consonance/ui/next-move.test.js -> 23 passed, 0 failed.
