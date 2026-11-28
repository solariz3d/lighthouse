// splice.mjs: re-speaks ONE sentence of the narration and puts it in place of the old one, without moving anything else.
//   node splice.mjs "old words that identify the sentence" "The whole new sentence."
// The new take is laid over the old one's slot. If it is shorter, the pause after it grows by the difference; if it is
// longer, it uses up some of the pause after it (and the script refuses if that pause is too short). Every other
// sentence keeps its exact start time, so no picture that is already timed has to change.
import { KokoroTTS } from "kokoro-js";
import fs from "node:fs";

const VOICE = "am_michael", SPEED = 0.92, SR = 24000;
const [needle, fresh] = process.argv.slice(2);
if (!needle || !fresh) { console.error('usage: node splice.mjs "old words" "The new sentence."'); process.exit(1); }

const tl = JSON.parse(fs.readFileSync("out/timeline.json", "utf8"));
const hits = tl.lines.filter((l) => l.text.includes(needle));
if (hits.length !== 1) { console.error(`"${needle}" matches ${hits.length} sentences; it must match exactly one`); process.exit(1); }
const line = hits[0], next = tl.lines[tl.lines.indexOf(line) + 1];

const wav = fs.readFileSync("out/narration.wav");
const head = wav.subarray(0, 44), pcm = wav.subarray(44);
const say = (s) => s.replace(/\bAI\b/g, "A.I.").replace(/[“”]/g, '"').replace(/’/g, "'");
const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "fp32", device: "cpu" });
const a = (await tts.generate(say(fresh), { voice: VOICE, speed: SPEED })).audio;

const s0 = Math.round(line.start * SR), oldN = Math.round(line.dur * SR);
const room = (next ? Math.round(next.start * SR) : pcm.length / 2) - s0;       // the old take plus the pause after it
if (a.length > room - Math.round(0.6 * SR)) { console.error(`the new take (${(a.length / SR).toFixed(2)} s) does not fit the slot (${(room / SR).toFixed(2)} s) with a pause left`); process.exit(1); }
for (let i = 0; i < room; i++) {
  const v = i < a.length ? Math.max(-32768, Math.min(32767, Math.round(a[i] * 32767))) : 0;
  pcm.writeInt16LE(v, (s0 + i) * 2);
}
fs.copyFileSync("out/timeline.json", "out/timeline.before_splice.json");
fs.writeFileSync("out/narration.wav", Buffer.concat([head, pcm]));
console.log(`was: "${line.text}" (${line.dur} s)`);
line.text = fresh; line.dur = +(a.length / SR).toFixed(3);
fs.writeFileSync("out/timeline.json", JSON.stringify(tl, null, 1));
console.log(`now: "${fresh}" (${line.dur} s), starting at ${line.start} s as before; pause after it ${((room - a.length) / SR).toFixed(2)} s (was ${((room - oldN) / SR).toFixed(2)} s)`);
