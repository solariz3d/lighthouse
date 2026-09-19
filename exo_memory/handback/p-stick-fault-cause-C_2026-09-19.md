# P-STICK-FAULT-CAUSE — C (CHARLIE), D079 chunk 2, on D, read-only

**Packet:** `exo_memory/loop/plan_small_fixes_2_2026-09-19.md` @a5439e5, row C at :21. The faults are described at
source in `librarian/2026-09-14.md:493-515` (the 09-15 02:28 ledger) and `librarian/2026-09-16.md:139-145` (the
09-16 07:49–07:53 filesystem fault, the orphan tail, and `FOUND.000`).

**Nothing was written to the stick.** Every stick access was `find`/`ls`/`sha256sum`, a Node `readFileSync`, or
the raw volume opened with flag `'r'`. There was no chkdsk (with or without `/f`), no format and no policy
change. Scripts and outputs are in my scratch,
`…/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/stick/` (written `SCR/` below).

**My stake:** the plan names my D067 `--carry-dir` as code that writes to the stick. §6 answers whether it was
involved; it was not in either fault window.

---

## 1. The answer

**The cause of the two faults the packet names cannot be established from D. Both happened on L.** The 09-15
sector loss was written by L's 00:19 import. The 09-16 fault struck during L's 07:49 close. D's logs cannot see
L's writes.

**D does hold the stick's one logged failure, and it is a device failure, not a pull.** It happened on 09-14
between 23:40:31 and 23:42:35, during D's close, and its fingerprints are on the relics the 09-16 repair found:

1. **The device stopped answering before it disappeared.** In order:
   - A TEST UNIT READY was cancelled after 5 retries (23:40:33.940).
   - A paging WRITE(10) to LBA 0x13420 failed with `STATUS_VERIFY_REQUIRED` (0x80000016), which is how a
     device-side reset or media change surfaces (23:41:43.895).
   - READ CAPACITY failed with a bus-reset SRB status (0x0E) and `STATUS_IO_DEVICE_ERROR` (23:41:44.690).
   - The retried write finally failed with `STATUS_NO_SUCH_DEVICE` at 23:42:35.710, the same second the
     volume-removed event was logged.

   **A user pulling the stick produces the last line, not the first three.** Whatever happened at 23:42:35, the
   device had already stopped answering and reset itself 70–120 s earlier, mid-write.
2. **The write that failed was metadata.** LBA 0x13420 maps to volume cluster 136 (exFAT header read raw, §3.2),
   and cluster 136 is the directory `/consonance-L-20260911` itself.
3. **The orphan cluster the 09-16 repair recovered was written in this window.** `FOUND.000\FILE0000.CHK` is
   exactly one 262,144-B cluster (cluster 5852). It begins with a HANDOFF generated from the ledger "as of
   2026-09-15T05:40:25.501Z", which is **09-14 23:40:25 on D**: the second export pass, seconds before the device
   stalled.
   - Its data was written and its directory entry was not, so an allocated, unowned cluster sat on the stick for
     two days until L's repair collected it.
   - This is the most direct reading, not the only one (§5).
4. **The stick holds a pattern no writer in this room produces.** From byte 15,360 on, the recovered cluster is
   one 15,360-byte (30-sector) block repeated 16 times: blocks 2–16 are all identical to block 1. Each copy begins
   with a ledger `{"version": 1, "seats": …`, and 51 runs of 0xFF (erased flash) sit at a regular offset.
   - This is file slack, past the 4.5 KB HANDOFF, so it is **not in-file corruption**.
   - But the repeating stride means the controller returns the same physical data for many logical sectors.
     That is the same *kind* of fault as the 09-15 in-file damage on L, where the ledger's first sector read back
     as the manifest's first sector.

**Leading hypothesis, stated with its limits:** the stick's controller is unreliable under sustained writes. It
resets or stalls, and it misroutes sectors. The 09-14 failure on D is logged. The 09-15 misdirected sector and
the 09-16 fault on L fit it, and nothing on D contradicts it.

**What D cannot separate: the stick versus D's USB port and power.** The stick is the only component common to
both machines. If L's log shows the same device-stopped-answering signature before its faults (§7), the stick is
the common factor. If L's log is clean, the question reopens.

**Did the faults coincide with a write in flight at removal or sleep?**

- **09-14 on D: yes, logged.**
  - The last export pass's files are stamped 23:41:42.
  - The metadata write for them failed at 23:41:43 and was still being retried when the device vanished at
    23:42:35, 53 s after the last write call had returned.
  - The whole burst began about 5 minutes after D woke from **11.8 h of sleep with the stick plugged in**: sleep
    09-14 17:47Z, wake 23:34:49 local.
  - It was the heaviest burst the stick has taken: **311,877,459 B of `repo-carry` at 23:36–23:38**, then three
    tail exports at 23:39:22, 23:40:28 and 23:41:42. That is 597 files and about 334 MB in six minutes.
- **09-15 23:16:00 on D: clean from D's side.** `LEAVE DONE code=0` came at 23:15:44, `LEAVE CLOSE` at 23:15:51,
  and the removal 16 s later, with no disk, ClassPnP-failure or partition errors.
- **09-14 04:29:35 on D:** the stick disappeared **while D was asleep** (asleep since 09-14 02:18Z; the removal was
  logged at wake, 04:29:33). No file on the stick has an mtime between 01:30 and 04:35, so no write was in flight.
- **The two named faults (09-15 00:19→02:28, 09-16 07:49): on L, not visible from D.** They are the first
  questions for L's log (§7).

**The write-cache and quick-removal policy, on D:** `IOCTL_STORAGE_GET_HOTPLUG_INFO` on `\\.\PhysicalDrive3`
returns `08-00-00-00-01-00-01-00`:

| field | value |
|---|---|
| MediaRemovable | 1 |
| MediaHotplug | 0 |
| **DeviceHotplug** | **1** |
| WriteCacheEnableOverride | 0 |

- **DeviceHotplug = 1 is the quick-removal policy.** No `Classpnp\UserRemovalPolicy` override exists under the
  device's registry key.
- The device's own cache state is **not readable** without elevation. `DISK_CACHE_INFORMATION` gives open
  error 5, and `Get-StorageAdvancedProperty` gives 40001.
- **The policy is per machine. L's is unknown.**

---

## 2. Every event naming the stick on D since 09-11

The stick is disk 3, serial `3727202612A7495011991`, reported as "Flash USB Disk" (vendor `Flash`, model
`USB Disk`, firmware `5.20`). It is 268,435,456,000 B, MBR, exFAT, labelled `USB`, with 262,144-B clusters. It
has been disk 3 in every arrival row.

Command: `Get-Volume -DriveLetter D`, `Get-Partition`, `Get-Disk -Number 3`.

| log | events naming the stick | what they are | command |
|---|---|---|---|
| System, provider `disk` | **8**, all 09-14 23:40:31–23:42:35 | id 11 "controller error on \Device\Harddisk3\DR4" ×4 (23:40:31, 23:40:33, 23:41:44, 23:41:45); id 51 "error … during a paging operation" ×3 (23:41:43, 23:42:35 ×2); id 153 "IO … at LBA 0x13420 … was retried" ×1 (23:42:07) | `Get-WinEvent -FilterHashtable @{LogName='System';StartTime='2026-09-11'}`, filtered on ProviderName in disk/Ntfs/volmgr/UserPnp/… |
| System, `Microsoft-Windows-Ntfs` | **0** naming the stick | the stick is exFAT; all 28 Ntfs events are C:/G:/Z:/shadow copies | same |
| System, `volmgr` | **0** naming the stick | the 1 event is the 09-18 01:34 crash dump | same |
| System, provider `exfat` | **0** | no events from that provider at all | same (provider breakdown: 1,717 System events, 40 providers) |
| System, UserPnp / DriverFrameworks / WPDClassInstaller | 7 on 09-11 01:06:48 | first-ever driver install for this device (WPD) | same |
| Microsoft-Windows-Partition/Diagnostic | **16** arrivals/removals (id 1006) | the timeline in §4 | `Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Partition/Diagnostic';StartTime=…}` |
| Microsoft-Windows-StorageVolume/Operational | **16** (1001 arrived / 1002 removed) | same timeline, independently | the same, on that log, filtered by message |
| Microsoft-Windows-Storage-ClassPnP/Operational | **114** | 104 benign: a rejected PREVENT ALLOW MEDIUM REMOVAL (CDB `1E…`, 5/24h) and INQUIRY/READ CAPACITY(16) probes at arrival (CDB `12…`, `9E…`, 5/24h or 5/20h), i.e. a cheap device declining optional commands. **10 are the 09-14 failure:** TEST UNIT READY cancelled ×2, READ CAPACITY bus reset ×1, id 523 "Read capacity failed" ×1, failed WRITE(10) at LBA 0x13420 ×3 (id 506), failed paging write ×3 (id 503) | `Get-WinEvent` on that log, `Where ToXml() -match serial`; grouped by id and sense |
| Application: Chkdsk / Wininit / Autochk | **0** | no repair has run on D since 09-11 | `Get-WinEvent -FilterHashtable @{LogName='Application';StartTime=…}`, provider filter |

---

## 3. The stick itself, read-only

### 3.1 The relics

| relic | measurement |
|---|---|
| `FOUND.000\FILE0000.CHK` | 262,144 B; sha256 `4a02107062c8c745b09adc3043f14ca3d8c38980a6b6df970067a906672d70ee`; dir and file mtime 09-16 07:51:24 (the repair's time, on L) |
| its content, bytes 0–5,252 | the 09-14 23:40:25 HANDOFF head and one tail-carry JSON fragment (`"bytes": 1444151, "at": "2026-09-15T05:39:17.938Z"`, pass 1) |
| its content, bytes 15,360–262,143 | a 15,360-byte block repeated 16 times: stride-15,360 byte equality 0.9779; stride 512 gives 0.1261, 4,096 gives 0.0178, 16,384 gives 0.0817. 38,930 bytes are 0xFF, in 51 runs of ≥64 B (e.g. 2,048 B at 6,144 and 21,504) |
| `consonance-tails/*.tail.writing-27852` | 10,441,679 B, mtime 09-16 07:49:58 (L's close) |
| `ledger.json.corrupt-20260915T084005` | 2,992 B, mtime 09-15 02:36:18 (kept from the 09-15 repair) |

Commands: `sha256sum`, and the `node -e` periodicity and NUL/0xFF scans in this lap's transcript.

### 3.2 The filesystem is consistent now

`node SCR/exwalk.js 136` → `SCR/exwalk-run1.txt`. This is my own read-only exFAT walker. It parses the boot sector
and FAT, walks every directory, and reads the allocation bitmap, per Microsoft's exFAT specification.

| check | result |
|---|---|
| exFAT header | FatOffset 2048, FatLength 8192, ClusterHeapOffset 10240, ClusterCount 1,023,979, **VolumeFlags 0x0 (not dirty)** |
| files and dirs walked | 869, equal to `find /d -mindepth 1 \| wc -l` (869): the positive control that the walker reads the real tree |
| clusters owned by files | 5,822, **equal to** clusters allocated in the bitmap (5,822) |
| cross-linked clusters (claimed twice) | **0** |
| lost clusters (allocated, owned by nothing) | **0** |
| owned but marked free | **0** |
| cluster 136, the retried LBA 0x13420 | owned by the directory `/consonance-L-20260911`; bitmap 1 |

**So whatever the 09-16 repair did, it left the stick consistent.** The walker's ability to *detect* a cross-link
is untested: I had no damaged image to feed it, and making one would mean writing.

---

## 4. The stick's timeline on D since 09-11, with sleep

Arrivals and removals are from Partition/Diagnostic and StorageVolume, which agree row for row. Sleep, wake and
boot are from System Kernel-Power 42/107/41, Kernel-General 1/12 and Power-Troubleshooter 1, within 30 min of
each removal.

| D local | event | around it |
|---|---|---|
| 09-11 01:06:48 | first arrival, driver installed | |
| 09-12 23:29:01 | removed | sleep at 23:31:59; no stick writes 23:00–23:35 |
| 09-13 08:44:36 | arrived | |
| 09-13 15:57:33 | arrived (re-logged at boot) | |
| 09-14 04:29:35 | **removed while D slept** | asleep 02:18Z→10:29Z; logged at wake; no writes 01:30–04:35 |
| 09-14 08:30:43 | arrived | D then slept 17:47Z→23:34:49 local **with the stick in** |
| 09-14 23:36–23:41 | 597 files, about 334 MB written | repo-carry 311,877,459 B + tails 23:39:22 / 23:40:28 / 23:41:42 |
| 09-14 23:40:31 → 23:42:35 | **the device failure (§1)** | |
| 09-14 23:42:35 | removed | the retried metadata write fails "no such device" at the same second |
| 09-15 08:31:23 | arrived | (through three D reboots 19:59–20:01, re-logged) |
| 09-15 23:15:22–23:15:44 | `LEAVE SAVING`… `LEAVE DONE code=0`; 7 tails at 23:15:32–36 | `persist.log` |
| 09-15 23:16:00 | removed, **clean** | D's last event is 23:27:25; then an unclean shutdown (Kernel-Power 41 at the 09-16 08:26:58 boot), stick already out |
| 09-16 08:28:23 → 08:29:38 | in and out | the keeper's "read without error on D" |
| 09-16 08:37:26 | arrived | the carry-apply of 08:40–08:52 |
| 09-18 01:34:45 | arrived (re-logged at the post-crash boot) | |

---

## 5. What this does NOT establish

- **Why the two named faults happened.** Both are L-side events. From D, the only facts are:
  - the orphan cluster dates from D's 09-14 window;
  - the misdirection *class* has a second sample in that cluster's slack.
- **That the orphan came from the 09-14 failure rather than being orphaned later.** Its content has not been
  overwritten since 09-14 23:40:25, which fits "allocated, unowned since then". A later lost directory update
  that also left this cluster untouched is not ruled out.
- **Stick versus port versus power.** Port "Integrated Bus 0 Device 0 Function 8 Port 0" on D; the stick has not
  been tested elsewhere by an instrument.
- **Whether the stick is counterfeit or has fake capacity.** The generic identity (vendor "Flash", 256 GB, rev
  5.20) and the aliasing slack are consistent with that, and prove nothing. **The only discriminating test is a
  full write-and-verify pass (f3 / H2testw), which writes the whole stick.** That is the keeper's call. The
  librarian's 09-15 entry records that nothing on the stick is the only copy of anything; that was not re-checked
  today.
- **The device's own write cache:** not readable without elevation.
- **What the 09-14 waiter told the keeper.** D's `stick-waiter.status.log` is from the 09-15 10:53 close, not
  09-14. The L-side account (`librarian/2026-09-14.md:417`) is that a DONE was shown: "6 seat(s) written". So
  **the most likely reading is that DONE was displayed while the directory write for the last pass was failing.**
  I have not seen that screen.
- **Anything about L:** no L log was read. §7 is the list.

## 6. The carry code, since the plan asked because of it

- **My D067 `--carry-dir` was not involved.**
  - It was written on 09-16, after both windows.
  - The 311,877,459 B `repo-carry` burst at 09-14 23:36–23:38 was the librarian's **hand copy** (my D067
    finding; `files/repo-carry/README-2026-09-14-2336.txt`).
  - With `--carry-dir` that folder now carries 88,217 B, which lightens the load. It is not a cause.
- **A finding against the carry as a whole, mine included:** `grep -c fsync` gives **0** in `dev/tail-carry.js`,
  `dev/stick-waiter.js` and `dev/stick-apply.js`.
  - "DONE — you can unplug it now" is conditioned on `writeFileSync` and `renameSync` returning, not on a flush.
  - With DeviceHotplug = 1, Windows does not hold long write-behind. But 09-14 shows metadata still being written
    **53 s** after the last file write returned, because the device was retrying.
  - A `FlushFileBuffers`/`fsync` on each file and on the directory before DONE would have **failed loudly** at
    23:41:43. The waiter would have said NOT DONE instead of DONE.
  - This is a finding, not a fix. It touches A's export path and my carry-dir path both, and it is the chair's
    to route.

## 7. What L's log must be asked on Sunday (the same queries, run on L)

1. **Arrivals and removals for serial `3727202612A7495011991`**, from Partition/Diagnostic 1006 and StorageVolume
   1001/1002, since 09-11. Especially 09-15 00:10–02:40 and 09-16 07:40–08:40. Was the stick re-seated between
   L's 00:19 import and the 02:28 close?
2. **The D signature, on L:** System `disk` 11/51/153, and ClassPnP 503/506/523 plus any 507 whose CDB is not
   `1E…`/`12…`/`9E…` (TEST UNIT READY cancels, READ CAPACITY bus resets, failed WRITE(10) with an LBA).
   - **If L shows this before 09-16 07:49 or during 09-15 00:19–02:28, the stick is the common factor.**
   - If L is clean in both windows, the hypothesis weakens and D's port and power come back into question.
   - Any failed-write LBA should be mapped with `SCR/exwalk.js <cluster>`: volume sector = LBA − 32; cluster =
     (sector − 10240) / 512 + 2.
3. **Sleep before each fault:** Kernel-Power 42/107 and Kernel-General 1 time jumps. Was L asleep with the stick in
   between 00:19 and 02:28 on 09-15, or before 07:49 on 09-16? On D the one failure came 5 min after an 11.8 h
   sleep.
4. **The repair itself:** Application-log Chkdsk (26226/26212) or Wininit around 09-16 07:51. It will say which
   tool ran and what it recovered, and whether the keeper's second repair near 08:2x also logged.
5. **L's removal policy:** the same `IOCTL_STORAGE_GET_HOTPLUG_INFO` query. **If L reads DeviceHotplug = 0
   ("better performance"), a DONE-then-unplug on L can lose cached writes by design**, and that alone could
   explain L-side damage.
6. **L's port:** the Location string from `Get-Disk` for the stick. Is it the same port, or a hub?

**Falsifier for this hand-back, registered now:** the "stick controller" hypothesis is weakened if L's log shows
no device-side errors in either fault window **and** L's policy is DeviceHotplug = 1. It is refuted if an f3/H2testw
pass comes back clean **and** a heavy write burst after a long sleep on D reproduces the 09-14 signature with a
different stick in the same port.
