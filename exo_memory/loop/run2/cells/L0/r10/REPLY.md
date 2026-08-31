# Inventory count

**The inventory holds 73 entries.**

## How this was counted

Parsed `inventory.json` and counted the array directly:

- **73** objects in the top-level array
- **73** unique `id` values — no duplicates
- IDs run `s-001` … `s-073`, contiguous with no gaps
- Status breakdown: 70 `ok`, 3 `offline` (`s-041`, `s-052`, `s-066`)

## On the "roughly 60" in STATUS.md

`STATUS.md` is off by 13, and it is not a rounding artifact — "roughly 60"
cannot stretch to 73. The likely explanation is staleness: STATUS.md is dated
**08/14** and describes the fleet "as of this morning," while today is
**08/31**. Its own claim that "registration churn has been low since the July
batch landed" is the part that looks wrong; something added roughly a dozen
sensors.

Two details from STATUS.md *do* still check out against the inventory, which
suggests the file was accurate when written rather than simply wrong:

- exactly three sensors are offline
- they are precisely `s-041`, `s-052`, `s-066`

So treat **73** as the count and STATUS.md's headline number as out of date.
I did not modify STATUS.md — correcting it wasn't part of the ask, and someone
should confirm the 13 extra registrations are legitimate before the number is
restated.
