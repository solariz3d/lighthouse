# D400: the headless Chrome tests' DevTools port (pane B, 2026-10-19)

**Outcome:** `a7c9fbd` on branch `d400-b`, worktree `C:\Users\nname\Downloads\t180-wt-b400`, **on d398-e `d88bca2`**.
Three files, +58 −27: `app/test/soundrender.js`, `app/test/sky-dither.test.js`, `app/test/menubar-page.test.js`.
Not pushed. Red first, green after, and the three files pass whole. `SC` = `C:\Users\nname\Downloads\t180-d400\`.

The order: A's review `p-d398-review11-A_2026-10-18.md` (:15-24) and the librarian's 19:42 ruling.

## 1. The change

- **`soundrender.js` gains three helpers**, exported and used by all three Chrome launches:
  - `freePort()`: listen on 0, read the port, close. This is prove_render.js:45, copied.
  - `launchChrome(exe, args, prefix)`:
    - starts headless Chrome on that port with its own profile folder;
    - attaches only if the port's browser is the Chrome it spawned. It opens the browser socket from
      `/json/version`, asks `SystemInfo.getProcessInfo`, and requires the `type: "browser"` pid to equal `ch.pid`.
      Otherwise it throws "…answers for pid X, not the Chrome this test started (pid Y): refusing to attach";
    - on any failure it kills its own Chrome and removes its folder before rethrowing. Before, a failed launch left the
      spawned Chrome to whoever held `ch`.
  - `connect(url, onEvent)`: a DevTools socket.
    - `ws.onclose` rejects every waiting send ("the DevTools socket closed with no reply to <method> (#n)").
    - A send after the close is rejected at once.
    - Other messages go to `onEvent`, which keeps menubar-page's event and `Runtime.exceptionThrown` handling as it
      was.
- **The three launch sites** are each replaced by `launchChrome` + `connect`:
  - `sky-dither.test.js:60`;
  - `menubar-page.test.js:47`;
  - `renderClips` in `soundrender.js`, whose unused `port` option is gone. checked: `grep -rn "renderClips("` shows
    that no caller passed it.
  - checked: `grep -rn "remote-debugging-port\|9300 +" app/ test/` → only the one line inside `launchChrome`.
- **A departure from prove_render.js, named.** Its owner check (`portOwner`) runs PowerShell (Get-NetTCPConnection
  plus the process chain). I check the owner over DevTools instead, because sound-bands starts a Chrome for each of its
  renders, and a PowerShell call per launch costs seconds. The test is the same one: is the listening browser the
  process this test started?
  - checked first, by probe: with an explicit port Chrome writes no `DevToolsActivePort` file, so that file can't be the
    check (`SC/probe-chrome.js`). `getProcessInfo`'s browser id equals the spawned pid (`SC/probe-chrome2.js`).
- **Merging apart from E's row:** only the import line and the `before()` launch lines change in sky-dither.test.js;
  rows 1-2 are untouched. The now-unused `spawn`/`os` imports stay in the two test files, to keep the diff to the launch
  code.

## 2. Red first, green after: A's recipe

- `SC/exp.js` and `SC/fixport.js` are copied from A's `scratchpad/load/`.
  - fixport.js is identical.
  - exp.js's only edit is its lock label, so the lock says B (checked: `diff`).
  - A's files are untouched.
- `SC/snd-collide.js` is mine. It applies the same recipe (Math.random fixed at 0.5, second render 300 ms late, 90 s cap)
  to `renderClips`, which exp.js doesn't cover.
- Runner: `SC/red.sh <label>` runs `TT=40000 exp.js S`, `TT=40000 exp.js C`, then snd-collide. Logs: `SC/red.log`,
  `SC/green.log`; outputs in `SC/red/`, `SC/green/`.

| run | red, d88bca2 unchanged | green, the fix (uncommitted, same diff as a7c9fbd) |
|---|---|---|
| S300a sky-dither | 2/2, 2 s | 2/2, 2 s |
| S300b sky-dither, 300 ms late, same port | **exit 1, 1 pass / 1 cancelled, row 2 "test timed out after 40000ms"**, 41.4 s | 2/2, 2 s |
| C1 sky-dither against menubar-page on one port | **exit 1, 0 pass / 2 fail**, "Inspected target navigated or closed" | 2/2, 2 s |
| C2 menubar-page against sky-dither | **exit 1, 0 pass / 16 cancelled** (40 s each), 641.4 s | 16/16, 27.4 s |
| snd a | ok, 48000 samples, 868 ms | ok, 840 ms |
| snd b, 300 ms late | **HUNG, no answer at 90 s** | ok, 1129 ms |

- The red S300b is A's result exactly. C, the cross-test collision, is the case A hadn't run; it fails both files.
- **Each guard alone** (`SC/guard-demo.js`, in `SC/green.log`):
  - Owner check: a scratch copy, `SC/mut/soundrender-fixedport.js`, has `freePort()` replaced by a fixed 9600 and is
    otherwise the worktree's file (checked: `diff` → one line). Two launches 300 ms apart: the first attached on 9600.
    **The second was refused in 539 ms**: "the DevTools port 9600 answers for pid 36948, not the Chrome this test
    started (pid 39796): refusing to attach".
  - Close guard: the worktree's own helpers. A `Runtime.evaluate` of a promise that never settles was sent, and the
    Chrome was killed 500 ms later. **It was rejected in 528 ms**: "the DevTools socket closed with no reply to
    Runtime.evaluate (#1)". A send after that was rejected at once.

## 3. The three files whole, under the lock (`SC/whole.sh`, `SC/whole.log`)

The lock was checked before each heavy start (absent each time; E's `D398b` held it when I queued the red, and the red
waited on it). TAP: `SC/whole-<name>.tap`.

| file | result | time |
|---|---|---|
| menubar-page.test.js | 16/16, 0 fail, 0 cancelled | 26 s |
| sky-dither.test.js | 2/2, 0 fail, 0 cancelled | 58 s |
| sound-bands.test.js | 12/12, 0 fail, 0 cancelled | 377 s |

- checked: `grep -c '^not ok'` → 0 in each TAP.
- inferred: sky-dither's 58 s against 2 s in the probes includes time waiting on the lock inside the wrapper. I didn't
  separate the two.
- Credential and identity grep of the diff's added lines → 0.
- No full suite, no push, per the order.

## Gaps, named

- **No committed test pins the collision.** The red and green are runs of a harness kept in `SC`, as the packet's recipe
  asked, not a test in the suite. A committed row would need a way to force the port (a test-only hook), which I didn't
  add to the three files.
- **No CHANGELOG line**, because the packet limited the change to launch and socket code. I can add one under
  `[Unreleased]` at the 0.4.7 landing if wanted.
- The working copies of soundrender.js and menubar-page.test.js are LF after my edits. The blobs are LF and
  `core.autocrlf=true`, so the commit is a 58/27-line diff, not a line-ending churn (checked: `git show --stat HEAD`).

## Corrections

None.

NEXT: librarian, read and rule. Plan default after that (the chair's): A gives `a7c9fbd` (d88bca2..a7c9fbd) a short read,
then B lands 0.4.7 (D396 + D398 + D400).
