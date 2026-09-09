# THE STATE REPO RECREATE — the sequence, ordered, with the re-arm as a STEP

**Written 2026-09-09 ~04:50, before it is run, so it is not reconstructed at the moment it is
needed. The keeper's word, 04:57: *"recreate it private once you get to solid ground with the other
work."***

---

## WHY THIS FILE EXISTS RATHER THAN A MESSAGE

The 04:20 hold failed because it was **a sentence in a queue** — it drained behind a 240 s composer
bound, after the push it was meant to stop. The disarm that followed worked because it was **a state
the tool trips over**: `git -C C:\Consonance\state remote get-url --push origin` prints `no_push`
and a push fails hard.

**This sequence must be the second kind too.** A step that has to be remembered is the first kind
wearing a checklist, which is the port rule's own lesson: the disarm is written into the CLONE step
because *a control a seat has to remember to apply afterwards is not a control*.

## SOLID GROUND — the precondition, in the keeper's words

    [x] L052 landed by path per pane        393069d
    [x] L052 filed                          no open lap
    [ ] REBUILD AND LAUNCH HERE ONCE        C's launcher has never run inside the app, and it
                                            must not run for the first time on the desktop at 08:00

**Do not start the sequence until that third box is ticked.**

## THE SEQUENCE

    1  gh repo delete solariz3d/consonance-state --yes

    2  gh repo create solariz3d/consonance-state --private

    3  RE-ARM THE PUSH URL -- THIS STEP IS WHY THE FILE EXISTS.
       The chair disarmed the local clone at 04:45 to make a second accidental push impossible:
           git -C C:\Consonance\state remote set-url --push origin no_push
       That disarm is still in place and WILL BLOCK THE CLEAN PUSH AT OUR OWN WALL. Either re-clone
       fresh (which arrives armed), or restore it explicitly:
           git -C C:\Consonance\state remote set-url --push origin \
               https://github.com/solariz3d/consonance-state.git
           git -C C:\Consonance\state remote get-url --push origin     # must NOT print no_push

    4  node consonance/tools/state-sync.js --push        # from the CORRECTED manifest

    5  git -C C:\Consonance\state ls-files | grep 3d000000
       MUST PRINT NOTHING. The librarian verifies this at its own desk BEFORE anything else touches
       the remote. Non-empty output means stop and do not proceed.

## WHAT IS BEING REPAIRED, so a later reader knows what "nothing" means

Three commits (`cde9b5f`, `f077b8c`, `6dfcc36`) carried **120,098 bytes of the Third Place's
record** — the live tail at 40,107 B and the **archived** tail at 79,991 B. The repo is private and
only A's own clone ever pulled it. The keeper's rule is *never a cloud he did not choose*, and he did
not choose it for that seat.

**Delete-and-recreate was chosen over history-rewrite** because a rewrite leaves the objects
reachable on GitHub's side until their garbage collection runs, which is a window we neither control
nor can verify. Three commits, private, no other clone — the cheap option is also the sure one.

## THE MANIFEST IS ALREADY CORRECT — verified by RESOLUTION, not by reading the rules

    captures/3d000000-0000-4000-8000-000000003d00.txt  ->  captures/3d000000-*.txt   [STAYS]
    captures/archive/3d000000-*.txt                    ->  STAYS
    sync-adopted.json                                  ->  sync-adopted.json         [STAYS]
    sync-pull.log                                      ->  sync-pull.log             [STAYS]

Both Third Place rules sit ahead of the `captures/*.txt` glob; **first match wins**. TRAVELS 47
files / 57.9 MB, UNPLACED 0.

## AFTER

The mirror-state flip stays **OFF** and the Stop hook stays **unregistered** — E measured 4,786 ms
at zero poll against a 5 s bound, so both-on state mirroring is not available over HTTPS git
regardless of this repo's state.

**Then the composer anchor packet (C).** A's finding is that the 240 s hold drains every stop
*after* the thing it was meant to stop — three times in one hour tonight. **That makes the anchor
the loop's stop path rather than housekeeping**, and it is the first packet once this is clean.
