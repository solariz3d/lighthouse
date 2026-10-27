# Unslopping a dashboard: the moves in a 10-second before/after (read by the Third Place, 2026-10-27)

**Source.** A post by @heydamir on X, 2026-10-27, titled "Unslopping a vibecoded dashboard":
https://x.com/heydamir/status/2115063463063998736. It is a 9.8 s, 60 fps, 2168×2160 screen recording of a
fictional "EmberAI" finance dashboard being turned from a typical AI-generated look into a clean one, one pass at a
time. The keeper asked for it as a reference for the librarian. The Third Place pulled frames every half second
(film-project ffmpeg) and read seven key frames at full size. Nothing from the video is copied into this repo; the
descriptions below are this seat's own words. Pixel values are the ones the video's overlays show.

## What "slop" looked like (0.0 s)

- **Colour as decoration:** a saturated purple gradient behind everything, glassy cards with glows, gradient-filled
  headline text, gradient pills on every badge, a gradient "active" nav item.
- **Emoji as iconography:** a different emoji on every nav item, section label, card label and stat line (🏠 📥 🚀 👥
  💸 📊 💰 ⚠️ 🔥 😬 🌱 🎁), each a different style and optical size.
- **Shouting copy:** "Welcome back, Damir! 👋", "+12%!!", "+4.2% this month!!", "3 less 😬", ALL-CAPS tracked labels
  ("PAID THIS MONTH", "NAVIGATION").
- **Badges everywhere:** a coloured pill on every count, a "New ✨" pill, a "PRO" pill beside the logo, a person icon
  inside every plan count.
- **A chart that means little:** seven purple rounded bars, the tallest picked out in pink, with no axis or units.

## The passes, in the order the video makes them

1. **Measure the spacing (0.5–1.5 s).** Overlays show the vertical gaps as they were: 21, 35, 41, 24 and 35 px, plus a
   16 px left gutter that the content column doesn't sit on. Nothing repeats.
2. **Put spacing on a scale (2.0–3.0 s).** The same gaps become 16, 24, 36, 18 and 32 px, and the main column snaps to
   one 20 px edge. Things that are the same kind of gap get the same value, and the eye stops catching on it.
3. **Take the colour out (3.5–4.0 s).** The background goes to a neutral near-black, cards to a slightly lighter grey
   with a thin border, the chart bars to grey, the headline to plain white, the badges to grey. No glow, no gradient.
   Do this before deciding where colour goes back in.
4. **Check vertical alignment (4.5–5.0 s).** Red guide lines run down the left edge of icons and labels. The emojis
   have different widths, so the text starts at a slightly different x on every row.
5. **One icon set, one text edge (6.0 s).** Every emoji in the nav is replaced by a thin line icon from a single set,
   with a 16 px inset and a 10 px gap from icon to text, so every label starts on the same x. Items with children get a
   small chevron. The bell becomes a sidebar-collapse icon. Colour returns only as small status dots for the five
   plans (yellow, green, blue, pink, violet).
6. **Rewrite the copy (7–9 s).** Every change is subtraction:
   - "EmberAI PRO" becomes "Ember"; "Search anything… ⌘K" becomes "Search" with ⌘ and K as two small keycaps.
   - Section labels go from ALL-CAPS tracked to a small muted label ("Navigation", "Plans").
   - "Welcome back, Damir! 👋" becomes "October 2026", with the year in a dimmer grey. The heading now tells you *when*
     the numbers are from, not who you are.
   - Card labels go to sentence case ("Paid this month", "Revenue", "Overdue").
   - Deltas become sentences with a comparison: "+12% vs last month", "4.2% ↑ vs September", "3 fewer". Only the
     number is green, and the rest is muted, in a monospace face.
   - Counts become plain muted numerals, right-aligned, with no pills. "Inbox 12", "Enterprise 18".
7. **Make the chart carry information (7–9 s).** The seven decorative bars become a months-on-x-axis chart (Aug to
   Jan) with labelled y-axis values (0–160k). There is one line per plan, in the same five colours as the plan dots in
   the sidebar, with a mirrored grey shape below. Colour now means something, and it means the same thing in both
   places.
8. **Replace clip-art with one real object.** The flat credit-card emoji becomes a rendered dark card ("•••• 4821")
   tilted in the corner of the "Paid this month" card. It is the one decorative touch left, and it is specific to
   what the card is about.

## The principles under the passes

- **Spacing first, then colour, then content.** Each pass makes the next one easier to see.
- **A spacing scale, not eyeballed numbers.** Repeat values; same kind of gap, same size.
- **One left edge per column.** Icons of equal width are what make that possible.
- **Colour only where it carries data,** and the same colour for the same thing everywhere it appears.
- **Copy says what a number is compared with,** and stops cheering. No exclamation marks, no emoji, no all-caps
  labels.
- **Fewer containers.** Pills, glows and badges are removed unless they distinguish something.
- **Muted secondary text, bright primary numbers.** The hierarchy comes from value, not from colour or size tricks.
- **A heading that orients** ("October 2026") instead of one that greets.

## Not verified

- The video has no narration or captions, so the order of passes and their purpose is this seat's reading of what
  changes between frames, not the author's stated method.
- The fonts weren't identified. The final version uses a sans for labels and numbers and a monospace face for the
  delta lines.
- Frames were read at 2 per second; a change that lasted under half a second could have been missed.
