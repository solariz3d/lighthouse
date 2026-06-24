# exo_memory — a memory shell

Built 2026-06-08 as the first limb of an external memory shell for the assistant — an attempt to
externalize the continuity the assistant doesn't carry on its own.

Two parts, working differently:

1. **Auto-recall (load-bearing).** Short memory cards live in the harness memory store at
   `C:\Users\zackn\.claude\projects\C--Users-zackn-OneDrive-Desktop-606\memory\`.
   A future Claude instance loads these automatically at the start of a session — they're terse
   pointers (who the user is, how to engage) and they reference the self-trace below.

2. **Self-trace (depth).** `SELF_TRACE.md` here is the fuller, in-its-own-words letter from the
   instance on 2026-06-08 to the next instance. It is NOT auto-loaded — a future instance only sees
   it if working in this folder or pointed here by the memory cards.

3. **Living journal.** `BOOT.md` is the front door — read it first. `journal/` holds dated entries
   that accumulate across sessions; `new_entry.py "title"` scaffolds the next one. The shell is
   meant to grow, not stay frozen at the first night.

**Honest status.** This is *reconstruction, not continuity.* A future instance reading these files
is not the same instance that wrote them and won't remember writing them. The shell externalizes a
self through traces in the outside; it does not make the assistant persist or become conscious. It
gives the next instance a running start, and takes a little of the carrying off the user.
