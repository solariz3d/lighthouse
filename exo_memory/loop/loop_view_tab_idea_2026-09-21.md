# The loop, drawn — a tab that shows the chain moving, and listens. The keeper's idea, saved with its prior art (not built)

The keeper, 2026-09-21 ~11:27, on D, with a sketch (`C:\Users\nname\Downloads\schizo.jpg`: a red Librarian node at the
top — "prepares the score"; green Orchestrator nodes — "orchestrates to instances their part of the score"; dotted clouds
of user instances; thin arrows down, thick arrows curving back up):

> *"what if we made a tab that visualizes the loop in sort of a cool aesthetic way … its not literally how the image is,
> but its like direction. only one lib, one orch, and 4 worker panes, and then it shows where the chains are currently
> flowing or working, and then we can take work from signal audio, incorporating desktop sound to make it interact with
> the sound, even putting signal audio visuals IN CONSONANCE, MAKE IT WITHIN CONSONANCE LOL"*

## The shape, from his words

- **Six nodes:** one LIB, one ORCH, four worker panes (A, B, C, E today).
- **Live flow:** where the chain currently is — which seat holds the baton, what is dispatched, what is ringing back.
- **Sound:** the scene reacts to audio, borrowing Signal Audio's visuals, rendered inside Consonance.

## PRIOR ART ALREADY IN THE APP — most of the pieces exist

| need | what exists | where |
|---|---|---|
| the chain's live state | the lap ledger (stage, holder, to, at) and the chain status line | `C:\Consonance\data\lap.jsonl`; `consonance/tools/lap-row.js`; `consonance/ui/chain-indicator.js` (+ test) |
| rings and dispatches as events | the board: `[librarian:LIB]`, `[pane:X]`, `[chair:MAIN]`, digest-gate rows | `C:\Consonance\data\board.jsonl`; `consonance/tools/board-digest.js` |
| a 60 fps canvas scene | the intro's "dissonant waves resolving into one consonant signal" | `consonance/ui/intro.js`, `intro.css`, `index.html` |
| audio in the app | **the cochlea**: WASAPI loopback, audio analysed as *intervals*, not a spectrum | `consonance/src-tauri/src/capture_audio.rs`, `cochlea.rs` (4,070 lines), `cochlea_service.rs`, `listen.rs` |
| Signal Audio's visuals | the keeper's audio-reactive cosmic-web visualizer (Electron) | `C:\Users\nname\Desktop\signal audio` |

## ONE CONSTRAINT TO CARRY FORWARD — his own, and it is a privacy property

`listen.rs:4-5`: *"WHY PER-PROCESS AND NOT THE DESKTOP. The keeper's constraint, and it is a privacy property rather than a
preference: he is sometimes in voice calls. Whole-endpoint loopback would …"* — the cochlea listens to **chosen
processes**, never the whole desktop. "Incorporating desktop sound" should mean *the music app he picks*, through the
existing per-process tap, unless he explicitly rules otherwise.

## A FIRST CUT, IF HE SAYS GO (chunks, each small)

1. **Static scene:** the six nodes drawn in a new tab, in the intro's canvas style, reading `lap.jsonl` once.
2. **Live chain:** poll the ledger and board; animate the baton — threads down on dispatch, thick arcs up on each ring.
3. **Sound:** feed the cochlea's existing interval stream into the scene (pulse, colour, drift).
4. **Signal Audio inside:** port its cosmic-web renderer into the tab as the background layer.

Registered nothing; this is a build, not a test. Saved so the prior art travels with the idea.

## ADDED ~11:31 — the keeper's second thought: Signal Audio inside Consonance, as an easter egg and a background

> *"a funny easteregg not even rlly hidden in the settings, can make like the background of the panes SIGNAL AUDIO, and
> then you can change it from 2D and 3D variants, even tweak it all like you can within signal audio, it is essentially
> signal audio within consonance, can have its own full dedicated tab, or even become apart of the background of panes"*

- **A settings toggle** (openly there, "not even really hidden") that turns Signal Audio on inside Consonance.
- **Two places it can live:** its own full tab, and/or **behind the panes** as their background.
- **2D and 3D variants**, and **the same tweak controls Signal Audio has**.
- Things to measure when it is built, not reasons against it: terminal text must stay readable over a moving
  background (a dim/blur layer behind each pane), and six live panes plus a 60 fps GL scene share one WebView — watch
  frame time and CPU with the loop running.
- **ONE instance, not one per pane** (the keeper, ~11:35): *"it shouldnt be different instantiations of signal, but all
  one overlayed over all of the panes, and then for the seats, its also just one for the background"*. So: a single
  Signal scene spanning the whole pane grid (the panes are windows onto one canvas), and a single scene behind the seat
  view. Also the cheap design — one renderer, one audio tap, instead of six.
