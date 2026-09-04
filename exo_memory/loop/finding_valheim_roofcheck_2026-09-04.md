# The rain path in Valheim's WearNTear is unthrottled and unclaimed

*Read from the keeper's own install, 2026-09-04. Every claim below re-derives from a command
printed beside it. Decompiled with dnSpyEx 6.6.0 (portable, scratchpad only — nothing installed).*

    ASSEMBLY  G:\SteamLibrary\steamapps\common\Valheim\valheim_Data\Managed\assembly_valheim.dll
    COMMAND   dnSpy.Console.exe <assembly> -t WearNTear
              dnSpy.Console.exe <assembly> -o <outdir>     (608 .cs files)

## THE MECHANISM, in four hops

    WearNTearUpdater.Update()          every frame
      -> UpdateWearNTear(dt, time)     once per second (m_sleepUntil gate)
         -> foreach (w in GetAllInstances()) w.UpdateCover(dt);      UNTHROTTLED
            -> if (EnvMan.IsWet()) m_haveRoof = HaveRoof();          4s internal timer
               -> m_roof || RoofCheck(...)
                  -> Physics.SphereCastNonAlloc(pos, 0.1f, Vector3.up, hits, 100f, s_rayMask)

**One 100-metre spherecast per building piece, every 4 seconds, whenever it is raining.**

Dry, the loop is nearly free: `IsWet()` is false and `UpdateCover` early-returns on its timer.
Rain flips one global and the cost becomes O(pieces).

## TWO SEPARATE DEFECTS, and they are not the same defect

**1. The throttle exists and this pass bypasses it.** `WearNTearUpdater` budgets `UpdateWear`
carefully — `m_updatesPerFrame` self-tunes between 5 and 100 against measured frame time, which
is real engineering. The `UpdateCover` pass and the `UpdateAshlandsMaterialValues` pass sit
OUTSIDE that budget as two plain `foreach` loops over the whole list. A 5,000-piece base is
10,000 calls landing in one frame, once per second.

**2. There is no negative caching.** `return this.m_roof || RoofCheck(...)` short-circuits, so a
piece that HAS a roof caches the GameObject and stays cheap forever. A piece with NO roof caches
nothing and re-casts every 4 seconds for as long as it rains. **The most exposed base pays the
most**, which is inverted: fences, paths, decking and outer walls are exactly the pieces that can
never benefit from the cache.

## PRIOR ART — checked, and the gap is real

`ontrigger/ValheimPerformanceOptimizations` (33 stars, pushed 2026-08-28, not archived) is the
serious performance mod. `Patches/WearNTearPatches.cs`, 389 lines, patches exactly:

    [HarmonyPatch(typeof(WearNTear), "UpdateSupport")]        prefix + transpiler
    [HarmonyPatch(typeof(WearNTear), nameof(ClearCachedSupport))]
    [HarmonyPatch(typeof(WearNTear), "OnDestroy")]

Grepped for the rain path in that file: `RoofCheck` 0, `UpdateCover` 0, `HaveRoof` 0, `IsWet` 0,
`m_roof` 0, `UpdateWearNTear` 0. **The structural-integrity half is solved; the rain half is
untouched.** Its other 20 patches are heightmap, terrain, ZDO, ZNetScene, clutter, water, prefabs.

**AND THE NEAR-MISS, RECORDED BECAUSE IT IS THE POINT.** The first prior-art pass reported "no
WearNTear patch in VPO" off a filtered listing cut at `head -20`. `WearNTearPatches.cs` sorts
after `V...` and was truncated out. **A correct command, a correct output, and a sentence wider
than the query** — the class at `muscle_map.md`, hit inside the very check meant to prevent
building something that already exists. Caught by re-running unfiltered, not by care.

## THE TECHNIQUE TO BORROW, from the same file

VPO caches per-instance data in a `ConditionalWeakTable<WearNTear, CachedWearNTear>` with a
`Stack<>` pool, so entries die with the piece and nothing leaks. That is the correct structure
for a negative roof cache, and reusing it means the patch matches the ecosystem's existing shape
rather than inventing one.

## WHAT IS NOT ESTABLISHED — the load-bearing sentence

**The mechanism is read from source. The MAGNITUDE is not measured.** Nobody has profiled
`WearNTear.UpdateCover` on a real base in rain. It could be 30% of frame time or 3%. Every
sentence above is about what the code DOES; none is about what it COSTS.

    FALSIFIER, registered before any patch is written:
    if Unity's profiler on a >2,000-piece base during rain does not attribute a
    measurable share of frame time to WearNTear.UpdateCover / RoofCheck, this finding is a
    correct reading of cold code and not a performance problem, and no mod should be built.

## THE PROPOSED PATCH, in three parts

    1  budget the UpdateCover pass with the m_updatesPerFrame counter already in the class
    2  cache negative roof results (ConditionalWeakTable, VPO's own technique) — the real win
    3  skip pieces where OutsideActiveArea is true — the pattern is used elsewhere in WearNTear

## LICENSING, ruled rather than left open

The game's code is Iron Gate's. Publishing a modified `assembly_valheim.dll` distributes their
copyrighted work whatever licence is attached to it, and open-sourcing does not confer the right
to relicense. **The patch ships as Harmony only** — our code, a few KB, surviving game updates,
installable beside other mods. The legal path and the better-engineering path are the same path.
