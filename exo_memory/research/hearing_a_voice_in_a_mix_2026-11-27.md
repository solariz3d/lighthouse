# Hearing a voice inside a full mix: what has been published, and what it would mean for Listen (the Third Place on L, 2026-11-27)

*Asked for by the keeper at 03:59 as research for fun: "What would you want to research for fun if you could?" The
seat chose this because Listen logged 17 rows for the 2:24 song he has on replay (11-26, `heard.jsonl` rows 1941 to
1957), where "Valasy" gave 160. Read 04:0x from the pages named. Nothing was installed, downloaded or run. No speed or
memory figure below was measured on his machines.*

## 1. Why Listen misses a voice over drums (read in `consonance/src-tauri/src/cochlea.rs`, header)

- The cochlea reports ratios between sustained pitches in the whole mix, and emits only on change.
- Drums are broadband and short, so they mask the pitched parts. A sung or rapped voice glides and wavers, so it
  seldom holds long enough to count as settled.
- Seen: Yung Lean "Yoshi City" 78 rows in 3:45 (09-21); Asenssia remix 17 rows in 2:24 (11-26).

## 2. Separating the voice first: offline models

| model | vocals SDR on MUSDB18-HQ | parameters | source |
|---|---|---|---|
| Mel-RoFormer (extra training data) | 13.29 dB | 105M | arXiv 2409.04702, ISMIR 2024 |
| BS-RoFormer (extra training data) | 12.82 dB | not read | same table |
| Mel-RoFormer (MUSDB18-HQ only) | 12.08 dB | 105M | same table |
| Mel-RoFormer small, 24 kHz mono | 11.01 dB | 9.1M | same table |
| Sparse HT Demucs | 9.37 dB | not read | same table |
| HDemucs | 8.04 dB | not read | same table |

- The paper does not say the authors released weights. It points to two open implementations
  (`lucidrains/BS-RoFormer`, `ZFTurbo/Music-Source-Separation-Training`). Community checkpoints are listed there and on
  Hugging Face (viperx, KimberleyJensen); their SDR figures come from different test sets and are not comparable with
  the table above. No repository or licence was opened here.
- Inference speed is not stated in the paper.

## 3. Separating live: real-time models

From arXiv 2511.13146 (Nanjing University, Nov 2025), Table I, MUSDB18-HQ, cSDR in dB, timed on an RTX 3080 Ti with
1024 samples per frame:

| model | latency | vocals | all stems | parameters | GPU time per frame |
|---|---|---|---|---|---|
| RT-STT, quantized | 23 ms | 5.56 | 5.17 | 383K | 1.01 ms |
| HS-TasNet | 23 ms | 5.13 | 4.65 | 42M | 3.90 ms |
| HS-TasNet-Small | 23 ms | 5.21 | 4.48 | 16M | 2.10 ms |
| DTTNet (offline, for reference) | 6,000 ms | 10.12 | 8.06 | 20M | not stated |

- So a live separator is fast enough for any recent GPU and is about 4.5 dB worse on vocals than an offline model in
  the same table (5.56 against 10.12), and about 7 dB worse than the best RoFormer above.
- The paper does not say whether code or weights are released.

## 4. Getting the sung notes directly

- The same Mel-RoFormer paper fine-tunes the separation model into a vocal melody transcriber. It outputs notes
  (onset, pitch, offset) for a single melody line.
- On MIR-ST500 (98 songs): onset-and-pitch F-measure 0.798 for the large model (64.6M parameters) and 0.786 for the
  small one (14.5M); the earlier SpecTNT scored 0.778. On POP909: 0.842 and 0.805.
- Other melody extractors found by search (TONet, MTANet, VOCANO) are older; VOCANO's authors recommend separating
  the voice first.
- No released weights for the transcriber were found. Not checked further.

## 5. What this would mean for Listen (the seat's reading, not a plan)

- The quality gap between live and offline separation is large. The better route is to listen twice: once live, as
  now, and once after the track ends, on the buffered audio, with an offline separator.
- The cochlea would not need to change what it reports. It would be run on two inputs: the vocal stem alone, and
  everything else. The intervals between the sung line and the harmony under it are then one more comparison.
- A separator is a new dependency and a download, and it would run on the GPU, so it needs his yes. It costs no
  Claude usage. It is a second use for the cards he asked about on 11-26, beside the judge.
- Not known: speed and memory on the 5070 Ti; which community checkpoint is licensed for this use; how a separated
  rap vocal, which has little stable pitch, would read even when clean.

## 6. Already made (added 04:1x at his word: "if it is, it was probably already made, we should look it up")

All of this section is from search summaries. No repository, licence or release page was opened.

| what | where | what the search said |
|---|---|---|
| Separate, then write out the sung melody and the chords | `Devleu0/Melody-Chord-Transcriber` | local web app, MIT; separates with Mel-Band RoFormer or Demucs, tracks the vocal with RMVPE into notes, uses Basic Pitch for the accompaniment; exports MIDI, lead sheets, MusicXML |
| Chords, key, tempo, melody and timed lyrics | `WiwatCha/lyrichord-free` | local, MIT; chords per beat, then key, then RMVPE for the sung melody |
| Separation as a package | `audio-separator` on PyPI | `pip install "audio-separator[gpu]"` for NVIDIA cards; wraps the UVR and RoFormer checkpoints |
| Separation on a stream | `nnyj/python-audio-separator-live` | a third-party benchmark on an RTX 5080: about 0.10 s per 1.6 s window for a vocals Mel-Band RoFormer model |
| Chord, melody, drum and vocal-pitch models | Omnizart | a Python toolbox with a command line |
| Live stems in DJ software | VirtualDJ, djay Neural Mix | real-time on the GPU; one vendor page claims about 30 times real time on an RTX laptop; reviewers say live stems are audibly worse than prepared ones |

- **So the seat's "listen twice" is already built by others** as far as separating and transcribing go. His guess
  was right.
- **Not found:** a tool that does this on whatever a streaming app is playing. The DJ programs disable stems for
  Spotify and Apple Music. Listen already taps one application's audio on his machine, which is the piece those tools
  lack.
- **Not found either:** anything that reports the result as relations (intervals, settled or restless) for a reader
  like a seat. That part is the cochlea's and exists here.

## 7. Melody-Chord-Transcriber, opened (04:1x, at his "yes"; read with `gh api`, nothing cloned)

- **Standing** (`gh api repos/Devleu0/Melody-Chord-Transcriber`): created 2026-10-30, last push 2026-11-11, 3 stars,
  0 forks, MIT. One author, one month old.
- **Pipeline** (its README and `backend/app/pipeline/`):
  - `audio-separator` with `vocals_mel_band_roformer.ckpt` (two stems) or `htdemucs_ft.yaml` (four stems);
  - RMVPE pitch tracking on the vocal stem at 100 frames a second, then about 100 lines of note segmentation
    (`vocal.py`) that smooths vibrato and returns notes plus a continuous pitch curve;
  - Basic Pitch on the accompaniment; a BTC transformer for chords (170 classes); librosa for beats.
- **Its own figures:** "A 4 GB GPU is enough". On an RTX 3050 Laptop (4 GB) a 3:30 song takes about 2 minutes end to
  end with RoFormer; `config.py` gives 0.65 s of processing per second of audio. Weights are about 1 GB in total.
- **Needs:** Python 3.11 (set up by `uv`), ffmpeg on the path, CUDA 12 drivers for the GPU. Node 18 is needed only
  for its browser front end.
- **The useful seam:** the backend is an HTTP service. `POST /api/jobs/upload` takes an audio file and
  `GET /api/jobs/{id}/result` returns notes, pitch curve, beats and chords as JSON. The front end is not required.
- **Licences** (its `THIRD_PARTY_NOTICES.md`, plus two `gh api` checks):
  - MIT: the app, `python-audio-separator` (1,515 stars, pushed 2026-10-29), Demucs, BTC, the RMVPE code and weights;
  - Apache-2.0: Basic Pitch;
  - **no licence stated:** `KimberleyJensen/Mel-Band-Roformer-Vocal-Model` (440 stars; GitHub reports no licence, and
    its README names none). That is the better-sounding separator. `htdemucs_ft` is the MIT alternative.
- **Not for this use:** its link input downloads through yt-dlp, and its README says that may break sites' terms.
  Listen already has the audio it taps; only the file-upload path would matter here.
- **The seat's reading:** the second listen could be this backend, or the same four libraries called directly. The
  result is symbolic (sung notes, chords, beats), so the intervals between the sung line and the chord under it can
  be computed from the JSON without changing the cochlea. Keeping tapped audio on disk, even briefly, is a step
  beyond what Listen does now, and is his call.
- **Not measured:** anything on the 5070 Ti or the 5080.

## 8. Measured on L (04:22 to 05:00, at his "well lets use what we cant do ourselves then")

**Installed**, all inside one folder named `hear`, in the `Consonance` folder at the root of the laptop's system drive
(outside the repo and the app; deleting the folder removes it):
a Python 3.12 environment of 3.8 GB with `torch 2.14.1+cu130`, `audio-separator 0.48.0`, `onnxruntime-gpu 1.32.0`,
librosa, and `audioread`; and 1.07 GB of weights (`vocals_mel_band_roformer.ckpt` 913 MB, `rmvpe.pt` 181 MB).

- **Two install faults, both fixed.** Installing `audio-separator` replaced the GPU build of PyTorch with
  `2.15.0+cpu`; `torchaudio` has no 2.14 build on the cu130 index, so it was removed (nothing here imports it). The
  package also needed `audioread`, which it does not declare.
- **The card is recognised:** `torch.cuda.get_arch_list()` includes `sm_120` on the RTX 5070 Ti Laptop GPU.

**Ours, in that folder:** `hear.py` (separate, follow the voice, split into notes, report), `test_hear.py` (10 tests
of the note splitting; `python -m unittest test_hear` passes), and `rows.rs` (the app's own `cochlea.rs` included
read-only and fed a file the way `cochlea_service.rs` feeds it live; `rustc -O rows.rs -o rows.exe`).

**The test song:** Josh Woodward, "Same Boat", CC BY 4.0, 202.5 s, from joshwoodward.com.

| run | result |
|---|---|
| `python hear.py songs/same_boat.wav roformer`, weights already on disk | separation 36.5 s, voice following 3.0 s, 5.1 times real time; peak GPU memory reported by PyTorch 2,041 MB |
| the same, first run including the 1.07 GB download | 59.5 s and 6.4 s |
| sung notes found | 237 notes in 72.9 voiced seconds, F2 to B3, median note 0.24 s; first note at 20.6 s |

| what the cochlea was fed (`rows.exe`) | events | settled | restless | chords voted | onsets |
|---|---|---|---|---|---|
| the full mix | 218 | 113 | 75 | 10 | 1 |
| the band alone | 245 | 128 | 85 | 14 | 1 |
| the voice alone | 74 | 12 | 28 | 0 | 12 |

- **What this shows.** Taking the voice out gives the cochlea a little more of the band (245 against 218 events, 14
  chords against 10). The voice alone gives it little, because one voice has no intervals with itself; what it does
  report is 12 onsets, which is where phrases begin. The 237 notes come from the pitch tracker, and the cochlea would
  never have reported them.
- **What this does not show.** This song is an acoustic one with light drums, and the cochlea already read its mix at
  about one event a second. The blind spot was measured on a drum-heavy remix (17 rows in 144 s). That case has not
  been tested, because no such audio file was on hand.
- **Not checked:** whether the 237 notes are the right notes. No transcription of the song was compared.

## Sources
- https://www.joshwoodward.com/song/SameBoat (the test song, CC BY 4.0)
- https://github.com/Devleu0/Melody-Chord-Transcriber (README, notices and pipeline files read with `gh api`)
- https://github.com/KimberleyJensen/Mel-Band-Roformer-Vocal-Model (README and licence field read with `gh api`)
- https://github.com/nomadkaraoke/python-audio-separator (licence field read with `gh api`)
- https://github.com/WiwatCha/lyrichord-free (search summary only)
- https://pypi.org/project/audio-separator/ (search summary only)
- https://github.com/nnyj/python-audio-separator-live/blob/main/README.md (search summary only)
- https://en.wikipedia.org/wiki/Stem_(audio) (search summary only)
- https://dj.studio/blog/stem-separation-usability-bench-test-dj-apps (search summary only)
- https://arxiv.org/abs/2409.04702 (read in the HTML version through a fetch agent)
- https://arxiv.org/abs/2511.13146 (read in the HTML version through a fetch agent)
- https://github.com/ZFTurbo/Music-Source-Separation-Training/blob/main/docs/pretrained_models.md (search summary only)
- https://huggingface.co/AEmotionStudio/roformer-models (search summary only)
- https://mvsep.com/en/algorithms (search summary only)
- https://sonicstate.com/news/2026/02/02/real-time-source-separation-on-gpu/ (search summary only)
- https://github.com/B05901022/VOCANO (search summary only)
