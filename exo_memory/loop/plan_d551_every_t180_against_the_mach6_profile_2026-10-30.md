# D551: every installed T-180 against the checker's Mach 6 profile, from the cars' own data. Librarian, 2026-10-30 16:4x

The user, 16:32: "Lets also see how the rest of the t-180s i tested compared to the mach 6. since someone said it is mandatory to test the other t-180s too and they are right, the ones i tested worked good so i dont think we have a problem." The checker's one car profile (`src/validate/limits.js` MACH6, header: "the Mach 6 is the only car FINDINGS measured, so it is the default") was measured on the regular Mach 6 (D515) and on the active one (D544: needs its own profile; the regular one is conservative for it). Nothing on disk measures any other car.

## What is on the machine (checked 16:38)

- 27 T-180 cars in `G:\SteamLibrary\steamapps\common\assettocorsa\content\cars\`: 10 regular/active pairs (ohyeah2389: mach6, typea, gladiator; ma_t180: augury, gigerbon, grx, hangul, krysha, typee, typef) and singles (ohyeah2389 corsair, demo, fumee, talon, proto_mach4; hys mach5, mach5_awd). Each ships `data.acd` (O's `acd.js` from D544 unpacks it, keyed by the folder name) and `collider.kn5`.
- The user's replays (`Documents\Assetto Corsa\replay`): every replay on OUR tracks is the Mach 6 (regular or active). Other cars appear only elsewhere: one Talon (singer speedway, 2026-01-18) and one Gladiator hotlap (Eagleton). So a replay comparison on CRAZY TEST needs him to drive, which this lap does not ask; the data comparison needs nothing from him.

## Part 1 (pane O, CHECK IT: measurement only, nothing in the app changes)

For every car above, unpack its data into O's scratchpad (as D544: other creators' files never enter a repo; raw outputs print folder names and stay there too) and read, per car: `car.ini` TOTALMASS and the graphics/physics offsets; `suspensions.ini` per axle: type, ride height, travel (packer range / rod length / bump stop), spring rate, damper; `tyres.ini` radius and vertical rate; `aero.ini` wings; and the downforce law in `extension\...script.lua` or the data (the Mach 6 active's `-200 x speed x suction` from the ray 0.4 m up, 1.0 m ahead, `limits.js` downforceRay/downforce): whether each car has the same law, different constants, or none; `collider.kn5` height and length (tools/kn5.cjs reads it). Then the derived figures the profile rests on, where the data gives them: the load at which the suspension runs out (spring rate x travel / mass share, both axles), the chassis clearance at that load, the downforce in g at 100 m/s. Table: car x those columns, the Mach 6 regular as the reference row, each cell marked lower / stiffer / weaker than the Mach 6 or not.

The answer the lap wants, in one line per car: does the Mach 6 profile stay CONSERVATIVE for it (the car runs out later, sits higher, pulls harder), or not. Cars that fail that test are named, with the column that fails. Where a value cannot be read from the data (an encrypted extension, a law in a script the reader cannot follow), say "not read", never estimate.

From me, after O: an Artifact page for the user with the table, the Mach 6 row first, failing cells coloured, and the replay he could drive if he wants a measured answer for a car that fails (CRAZY TEST in that car, saved replay; O's D515/D544 rig runs on it unchanged).

Tier: check it. BelowNormal, no window, no game, nothing written into the game folder or t180. One hand-back, `p-d551-cars-O_2026-10-30.md`.

Falsifier: if any car's data puts it on the UNSAFE side of the Mach 6 in any column the profile's reds and ambers rest on (shorter travel at a lower load, a lower chassis, weaker or absent downforce), the checker needs either a profile for that car or the worst case as its default, and "the ones I tested worked good" is a report about the Mach 6 side of the fleet; if every car sits inside the Mach 6, the single profile stands and his report is consistent with the data. Either way the number comes from the cars' files, not from feel.

surfaced: limits.js MACH6 header and downforceRay; p-d544-active-O_2026-10-29.md (the active car table, acd.js); D515 bands.txt; the replay folder listing (Mach 6 only on our tracks).
