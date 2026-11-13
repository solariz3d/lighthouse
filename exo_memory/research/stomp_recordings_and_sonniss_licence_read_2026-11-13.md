# Recorded heavy footfalls, and the Sonniss licence as read: the read for L199's second pass

**What this is:** the source read the chair's 13:11:15Z packet asked for (a recorded contact, and the Sonniss clause on
loose files read and quoted before any file ships). It was written by a Sonnet subagent of pane E on L, 2026-11-13,
finishing 13:23Z, and is copied here VERBATIM from its final report. Only HTML entities were changed back, and this
header was added. Its downloads are in `C:\Users\zackn\Downloads\dz3-sound-data\stomp2_candidates\` on L only (98 files,
27 MB, `MANIFEST.tsv` with sha256). **None of them was used in a render.** The second pass used Kenney's CC0 takes; see
the L199 hand-back, §8b.

---

I found no ready-made heavy-foot take set under a licence you allow; the closest are a CC0 wet-towel floor-hit pack and some rock and body impacts in the Sonniss GDC bundles. Everything is downloaded into `C:\Users\zackn\Downloads\dz3-sound-data\stomp2_candidates\` (27 MB, 98 files). I could not listen to anything, so "fits a monster foot" is not judged.

## Sonniss licence [read]
I read Version 2.0, effective 27 August 2026, at `https://sonniss.com/gdc-bundle-license/`. The live page is behind a Cloudflare check, so I read the Wayback capture of 10 October 2026 (`web.archive.org/web/20261010102457id_/https://sonniss.com/gdc-bundle-license/`).

- **Grant:** "the Licensor grants the Licensee, a worldwide, non-exclusive, royalty-free license to use all or any of the sound effects"
- **Use and attribution (b):** "Licensee may use and modify the licensed sound effects for personal and commercial projects without attribution to the original creator."
- **Sync (d):** "Licensee may use the licensed sound effects for the purposes of synchronization with audio and visual projects the Licensee is involved with, which includes but is not limited to: games, films, television & interactive projects."
- **Public performance (c):** "…as long as they are synchronized within the Licensee's project. (Games, films, videos, podcasts, apps and interactive projects all count…) This right does not extend to supplying the sound effects themselves, whether as files or as the output of a device or service, where the sound effects rather than a project of the Licensee's are what is being supplied."
- **Redistribution:** "Licensee may not distribute, publish, sub-license or otherwise supply the sound effects as sound effects to any other person, without the Licensor's prior written permission. This applies whether the sound effects are unmodified, modified or re-designed, and whether they are supplied on their own or as part of a sound effects library, sample pack, asset pack, project template, software development kit or anything similar."
- **Finished projects:** "This does not restrict the Licensee's finished projects, which may be shared, published and sold in the normal way."
- **Selling:** "Licensee may not sell any of the sound effects as they come. (Although the sound effects may be sold as incorporated into licensee project)."
- **AI:** training on them is prohibited.
- **Which version applies:** the version published on your download day governs your files. Earlier versions are at `sonniss.com/gdc-bundle-license/previous-versions/`.

**Earlier versions [read]:** Version 1.0, from 28 January 2024 to 27 August 2026, had (b) and (d) word for word as above. Its (c) was only "may publicly perform a reproduction of the sound effects over any form of medium." Before 28 January 2024 it also had a right to "freely distribute… and make an unlimited amount of copies" (paraphrased from the version-history text, not quoted), and no AI clause.

**On your bias, [inferred]:** a game ships its sounds inside "a finished project", so shipping in a game looks allowed, and the redistribution ban is aimed at libraries and packs. But the clause forbids supplying them "as sound effects" and treats "as files" as the risky form. Loose WAVs in an install folder sit close to that line, so I would pack them into the game's own archive or bank. I would email Sonniss if you want loose files. This is my reading, not a legal opinion.

## Sonniss packs: how to fetch [read]
- **Official files:** whole multi-GB parts at `downloads.sonniss.com/...`.
  - GDC 2015: 5 parts, 9.0 GB.
  - GDC 2016: 6 parts, 12.9 GB.
  - GDC 2017: 9 parts, 19.2 GB.
  - GDC 2018: 8 parts, 29.3 GB.
  - GDC 2019: 8 parts, 26.2 GB.
  - GDC 2020: 14 parts, 48.2 GB.
  - GDC 2021–2023: 14 parts, 38.7 GB.
  - GDC 2024: 9 parts, 23.5 GB.
  - There was no 2025 bundle; 2026 has its own page.
- **Mirrors:** `ftpmirror.your.org/pub/misc/sonniss*` carries 2015–2019 and honours HTTP Range requests, so I fetched single files out of the zips. The official host blocks scripted requests; the feralhosting mirror (2020–2024) returned 504 on ranged requests.
- **What each pack contains:** only about 4 sample files per publisher library, 5,486 files across 2015–2019. A set of 4 to 10 same-kind footfall takes from one Sonniss pack does not exist in those years. The long multi-hit files are the useful ones.

## Candidates

| Source | Licence (as stated) | Credit owed | Takes / format | Downloaded |
|---|---|---|---|---|
| OpenGameArt, "12 wet towel hitting/falling/punching floor sounds" (qubodup) | Page: "CC0". The archive's `info.txt` says MIT/ZLIB/newBSD multi-licence and asks that the copyright notice be kept. | None under CC0. Safest to credit Iwan Gabovitch. | 12 FLAC, 44.1 kHz, 1.2 MB; same kind, short | Yes |
| OpenGameArt, "75 CC0 breaking / falling / hit sfx" (rubberduck) | Page: "CC0" | None | `bfh1_hit` ×13, `rock_falling` ×9, `falling` ×7, `metal_hit` ×6 and more; OGG; 1.6 MB | Yes |
| OpenGameArt, "Thud Underfoot" (spookymodem) | Page: "CC-BY 3.0" | Yes, credit spookymodem | 1 WAV, 44.1 kHz, 2.36 s | Yes |
| OpenGameArt, "moving-boulder" | Page: "CC0" | None | `boulder_drop_0.ogg`, 1 file | Yes |
| Sonniss 2016, Mattia Cellotto, "Rocks Momentum" | Sonniss v2.0 | None | "Collapsed Stone House" 19 s and "Woodshed" 12 s; both 96 kHz 24-bit multi-hit WAVs, so they can be cut into takes | Yes |
| Sonniss 2018–2019 singles: Red Libraries "Bodyfall" (Concrete_Generic, 1.14 s, 96 kHz mono); The Chris Alan "Body Slam Floor 08" (0.45 s); Soundrangers "boulder_impact_on_stones_14"; SoundMorph "Rupture Concrete_Impact_B02" (3 s, 48 kHz) | Sonniss v2.0 | None | 1 each | Yes |

The wet-towel pack is the best fit I found, as the same kind of heavy soft hit on a hard floor. The 75-pack is mixed: `hit` and `falling` are the likely stand-ins for a foot, and I did not check which sound like one. Of the downloaded files I opened, only the wet towel and OpenGameArt entries were checked against their pages. The unlisted OpenGameArt candidates `jump-landing`, `different-steps` and `footsteps-0` (all CC0) I did not download.

- **Pixabay [read]:** the content licence allows modification and use without attribution. It forbids selling or distributing content "on a Standalone basis". It does not mention games or audio, and says only the full Terms of Service are binding. I could not confirm it covers a commercial game, and I downloaded nothing from it.
- **Freesound [inferred]:** CC0 items would be allowed, but previews are reduced-quality MP3s, so I would not use them for the contact sound.

## Rejected
- OpenGameArt "sledgehammer concrete" is GPL 3.0. "falling-body" and "foot-walking-step-sounds…" are GPL or CC-BY-SA with GPL, so I skipped them.
- "Mech Stomp" is a mechanical sound, not a monster.

## Not opened
- Sonniss 2020–2026 pack contents: the official host blocks scripted access and the feralhosting mirror returned 504 on ranged requests.
- Freesound pages, and any listing for archive.org or Wikimedia Commons. Searches turned up nothing usable there, and the searches themselves were weak [not opened].
- The Sonniss licence text inside the zips, and any bundle readme.

## Manifest
`MANIFEST.tsv` (in the folder) lists path, source URL, licence as quoted, credit, sha256 and size for all 98 files: the archives, their extracted copies and the loose files. The OpenGameArt archives are kept as fetched, extracted with Windows `tar.exe` into `oga/x_*`. Sonniss files sit in `sonniss/`, each pulled out of the mirror zip by byte range as one file.
