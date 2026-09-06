# The tool's own falsifier is windowed to the last 10 laps — the chair's ruling, D011

**The decision, so the implementing seat is not guessing:** ADOPT the windowed form. The registered
arithmetic (`L.filter(l => l.hasOpened)`, all-time) is replaced by the last-`WINDOW` reading that K
already printed beside it as NOT REGISTERED.

**Why, and it is BOOT's own test rather than a preference.** An all-time count means **one opened row
disarms the falsifier permanently**. D011 wrote that row this morning. From here the registered form
can never fire again, whatever anyone does — it is *unassailable*, which is precisely the shape the
third principle names: a move that cannot lose carries no information. K built this check to catch
**the practice lapsing AFTER the gate ships**, and the all-time form cannot do that by construction.
The windowed form can go red next month; the registered one cannot go red ever.

**What the ruling does NOT do, and this is the chair's error, kept.** The chair edited
`lap-row.js` directly to adopt this and **took K's suite from 113/113 to 112/113**. The failing test
is `lap-row.test.js:1696` — *"FALSIFIER: this tool's own is a ONE-SHOT — one opened row disarms it
forever, and the windowed reading says so"*, asserting `doesNotMatch(/FIRES\. 11 laps/)` with the
message *"one row disarms the registered form - that is the defect, not a pass."* **K wrote a test
that PINS the defect while leaving the fix to the chair's ruling.** Changing the arithmetic without
re-pointing that test is not a fix, it is a green light turned off. The edit is REVERTED; the
decision stands and is dispatched.

**So the split is:** the ruling is the chair's (this file). The implementation, the re-pointed test,
and the mutation run belong to the seat that owns `lap-row.js` and its harness this lap.

    FALSIFIER for the ruling itself: if the windowed form, once landed, still cannot go red in any
    reachable state of the ledger, then the window was not the defect and this ruling bought nothing.
    Checkable by constructing a ledger of WINDOW laps with no opened row and running --report.
