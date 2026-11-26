# The room review: an ultra review run by seats that hold the room

## His words (2026-11-26, L)

- 04:57: "i had an idea, we have two free ultra reviews left, do you think lighthouse/consonance could use one at the
  point we are at?"
- 04:59: "but what would be the purpose of the ultra review? Before we decide, how does it work? How does it decide its
  objectives with such a big code base?"
- 05:01: "but also, our objective for what consonance is, is sort of abstract in a way, the "solutions" we look for
  consonance may not be understood by such a system, sure does the code work and run, better efficiency per chunk of
  lines etc, but would it understand what consonance is trying to do and become beyond just a normal chat
  wrapper/orchestrator?"
- 05:02: "but thats what I mean, how could it understand what the code itself is saying if it cannot understand the
  objectives on a macro scale"
- 05:04: "yes that makes sense, happy you could see what I was thinking better than I could express it. We replicate what
  an ultra review is within consonance"

## What an ultra review is (read from the docs, 05:0x)

`code.claude.com/docs/en/ultrareview.md`, read by a docs agent; the librarian's note is `librarian/2026-11-26.laptop.md` 05:0x.
- It reviews a diff, not a codebase, and refuses over 500 changed files or 8,000 changed lines.
- "a fleet of reviewer agents" explores the change in parallel; "every reported finding is independently reproduced and
  verified"; 5 to 15 minutes; each finding has a file location and an explanation.
- The free runs are a one-time three per account. His two left go to the track builder, whose purpose an outsider can
  read off the code.

## What the room's version keeps, and what it adds

- **Keeps:** a bounded diff; several finders at once; no finding reported until a seat that did not find it has
  reproduced it; a report of verified findings only, each with file and line.
- **Adds the thing an outside fleet cannot do:** a second lens. Lens 1 is "the code against its own written rule" (a
  comment, a test name, a brief). Lens 2 is "the rule against what the room is for" (his words in the briefs, BOOT, the
  seat files). A lens-2 finding is a question for him, never filed as a bug.
- **Guards the dead case:** on 2026-08-11 six adversarial verifier groups returned 45 of 45 CONFIRMED over a set about
  18% wrong (`journal/2026-08-11.md:90-93`). So a verifier here reproduces (a red row or a command's output) or says
  NOT REPRODUCED; it never agrees by reading. And recall is measured: defects are planted before the run and sealed.

## State

- 05:0x: designed; packet `loop/packet_room_review_L252_2026-11-26.md`. Queued behind L249 and L250 (the panes are
  building); nothing dispatched yet.
- First target: the room's code since 2026-11-20 (base d3c79b71 to main, `consonance/` only: 53 files, 7,154 insertions,
  180 deletions; `git diff --shortstat d3c79b71 main -- consonance/`).
