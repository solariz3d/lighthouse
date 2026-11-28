// narrate.mjs: speaks the narration in SCRIPT.md, one sentence at a time, and writes
//   out/narration.wav      the whole narration, with the pauses
//   out/timeline.json      every sentence with its start and length in seconds, measured from the real audio
//
//   node narrate.mjs            everything
//   node narrate.mjs 4          one section only (for a test): out/section_4.wav
//
// Voice: Kokoro, voice am_michael at speed 0.92, the voice he chose for the September films.
import { KokoroTTS } from "kokoro-js";
import fs from "node:fs";
import path from "node:path";

const VOICE = "am_michael", SPEED = 0.92, SR = 24000;
const GAP_SENTENCE = 0.34, GAP_PARAGRAPH = 0.95, GAP_SECTION = 2.6;      // seconds of silence
const only = process.argv[2] ? Number(process.argv[2]) : null;

// ---- read the spoken lines out of SCRIPT.md: sections, paragraphs, sentences ----
const src = fs.readFileSync(path.resolve("..", "SCRIPT.md"), "utf8").replace(/\r/g, "");
const body = src.split(/^## 1\. /m)[1].split(/^## What is (?:his to decide|not checked yet)/m)[0];
const sections = [];
let cur = { n: 1, title: body.split("\n")[0].trim(), paras: [] }, para = [], inBracket = false;
const flush = () => { if (para.length) { cur.paras.push(para.join(" ")); para = []; } };
for (const line of body.split("\n").slice(1)) {
  const m = line.match(/^## (\d+)\. (.*)$/);
  if (m) { flush(); sections.push(cur); cur = { n: Number(m[1]), title: m[2].trim(), paras: [] }; continue; }
  if (line.startsWith("[")) { flush(); inBracket = !line.trimEnd().endsWith("]"); continue; }
  if (inBracket) { if (line.trimEnd().endsWith("]")) inBracket = false; continue; }
  if (line.startsWith("---")) continue;
  if (!line.trim()) { flush(); continue; }
  para.push(line.trim());
}
flush(); sections.push(cur);

const sentences = (p) => p.match(/[^.!?]+[.!?]+["”']?(?=\s|$)/g)?.map((s) => s.trim()).filter(Boolean) ?? [p];
// what is said aloud, where the page's spelling would be read wrongly
const say = (s) => s.replace(/\bAI\b/g, "A.I.").replace(/[“”]/g, '"').replace(/’/g, "'");

const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "fp32", device: "cpu" });
fs.mkdirSync("out", { recursive: true });

const chunks = [], timeline = [];
let t = 0.8;
chunks.push(new Float32Array(Math.round(0.8 * SR)));
const silence = (sec) => { chunks.push(new Float32Array(Math.round(sec * SR))); t += Math.round(sec * SR) / SR; };

for (const sec of sections) {
  if (only && sec.n !== only) continue;
  for (const [pi, p] of sec.paras.entries()) {
    for (const [si, s] of sentences(p).entries()) {
      const audio = await tts.generate(say(s), { voice: VOICE, speed: SPEED });
      const a = audio.audio;                                   // Float32Array at 24 kHz
      timeline.push({ section: sec.n, title: sec.title, para: pi, sentence: si, text: s, start: +t.toFixed(3), dur: +(a.length / SR).toFixed(3) });
      chunks.push(a); t += a.length / SR;
      silence(GAP_SENTENCE);
    }
    silence(GAP_PARAGRAPH - GAP_SENTENCE);
  }
  silence(GAP_SECTION - GAP_PARAGRAPH);
  console.log(`section ${sec.n} (${sec.title}) done at ${t.toFixed(1)} s`);
}

// ---- write one 16-bit mono WAV ----
const total = chunks.reduce((n, c) => n + c.length, 0);
const pcm = Buffer.alloc(total * 2);
let o = 0;
for (const c of chunks) for (let i = 0; i < c.length; i++, o += 2) pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(c[i] * 32767))), o);
const head = Buffer.alloc(44);
head.write("RIFF", 0); head.writeUInt32LE(36 + pcm.length, 4); head.write("WAVEfmt ", 8); head.writeUInt32LE(16, 16);
head.writeUInt16LE(1, 20); head.writeUInt16LE(1, 22); head.writeUInt32LE(SR, 24); head.writeUInt32LE(SR * 2, 28);
head.writeUInt16LE(2, 32); head.writeUInt16LE(16, 34); head.write("data", 36); head.writeUInt32LE(pcm.length, 40);
const name = only ? `section_${only}` : "narration";
fs.writeFileSync(`out/${name}.wav`, Buffer.concat([head, pcm]));
fs.writeFileSync(`out/${only ? `timeline_${only}` : "timeline"}.json`, JSON.stringify({ voice: VOICE, speed: SPEED, total: +t.toFixed(3), lines: timeline }, null, 1));
console.log(`wrote out/${name}.wav: ${t.toFixed(1)} s, ${timeline.length} sentences`);
