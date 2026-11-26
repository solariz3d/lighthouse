// R2 item 2 (pane O): keep-warm and Third Place rows on D's board since a day, counted per day; the last of each kind printed.
const fs = require("fs"), rl = require("readline");
const since = Date.parse(process.argv[2] || "2026-11-14T00:00:00Z");
const r = rl.createInterface({ input: fs.createReadStream("C:/Consonance/data/board.jsonl") });
const pat = [
  ["tp_ping", /^keep-warm -> the Third Place/],
  ["tp_waiting", /Third Place: waiting/],
  ["hour", /visit hour ->/],
  ["held", /held for the Third Place/],
  ["visit_refused", /^keep-warm visit .*(not kept|refused)/i],
  ["tp_missed", /keep-warm.*Third Place.*(missed|cache window|EXITED)/i],
  ["kw_not_sent", /^keep-warm NOT SENT/],
  ["kw_all", /^keep-warm/],
];
const c = {}, last = {}, roles = {};
r.on("line", (l) => {
  let j; try { j = JSON.parse(l); } catch { return; }
  const ts = typeof j.ts === "number" ? j.ts : Date.parse(j.ts);
  if (!(ts >= since)) return;
  const t = String(j.text || "");
  if (j.role === "third_place" || /third.place/i.test(j.pane || "")) roles[j.pane + " " + j.role] = (roles[j.pane + " " + j.role] || 0) + 1;
  for (const [k, re] of pat) if (re.test(t)) {
    const d = new Date(ts).toISOString().slice(0, 10);
    c[k + " " + d] = (c[k + " " + d] || 0) + 1;
    last[k] = new Date(ts).toISOString() + " " + t.slice(0, 170);
  }
});
r.on("close", () => {
  console.log(Object.entries(c).sort().map((x) => x.join(": ")).join("\n"));
  console.log("LAST:"); for (const [k, v] of Object.entries(last)) console.log(" ", k, v);
  console.log("ROWS FROM A third_place ROLE/PANE:", roles);
});
