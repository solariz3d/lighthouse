// Re-derive the T-180 test-track lap from the BLACKBOX parser on this machine (laptop, blackbox @ edfe852).
const fs = require("fs");
const { parseReplay, extractCar, runStats, parseTelemetry, alignTelemetry } = require("C:/Users/zackn/blackbox/ui/acreplay.js");
const p = "C:/Users/zackn/blackbox/samples/ohyeah2389_t180_mach6_ohyeah2389_t180testtrack__240726-143319.acreplay";
const b = fs.readFileSync(p);
const ab = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
const rep = parseReplay(ab);
const ex = extractCar(rep, 0);
const st = runStats(ex);
const tel = parseTelemetry(ab);
console.log("cars", rep.cars.length, "frames", ex.N, "dt", ex.dt, "intervalMs", rep.intervalMs);
console.log("runStats", JSON.stringify({...st, laps: st.laps.map(l=>l.timeMs)}));
console.log("telemetry", tel ? {ver: tel.ver, schema: tel.schema, count: tel.count, bps: tel.bps} : null);
if (!tel) process.exit(0);
const T = alignTelemetry(tel, ex.N, ex.dt);
console.log("align mode", T.mode, "has", T.has);
// choose lap window: from the frame after the previous line crossing to the lap's crossing frame
const laps = ex.laps;
let a = 0, z = ex.N;
if (laps.length >= 1) { z = laps[laps.length-1].frame; a = laps.length >= 2 ? laps[laps.length-2].frame : Math.max(0, z - Math.round(laps[laps.length-1].timeMs/1000/ex.dt)); }
console.log("lap window frames", a, "->", z, "=", ((z-a)*ex.dt).toFixed(2), "s; lap sawtooth time", laps.length ? (laps[laps.length-1].timeMs/1000).toFixed(3)+" s" : "n/a");
const n = z - a;
let flat=0, lifted=0, braking=0, vmax=0, vmaxGas=0, rpmMax=0, gmin=99, gmax=0, slipMax=0, slipMaxV=0;
const gasAt = i => T.gas[i], brAt = i => T.brake[i], vAt = i => T.speed[i];
for (let i=a;i<z;i++){ const g=gasAt(i), br=brAt(i), v=vAt(i);
  if (g>=0.98) flat++; if (g<0.5 && br<0.05) lifted++; if (br>=0.05) braking++;
  if (v>vmax){vmax=v; vmaxGas=g;} if (T.rpm[i]>rpmMax) rpmMax=T.rpm[i];
  const ge=T.gear[i]; if (ge>gmax) gmax=ge; if (ge>0 && ge<gmin) gmin=ge;
  for(let k=0;k<4;k++){ const s=Math.abs(T.slip[i*4+k]); if (s>slipMax){slipMax=s; slipMaxV=v;} } }
console.log("flat", (100*flat/n).toFixed(1)+"%", "lifted(no brake)", (100*lifted/n).toFixed(1)+"%", "braking", (100*braking/n).toFixed(1)+"%");
console.log("vmax", vmax.toFixed(0), "kph @ gas", vmaxGas.toFixed(2), "| rpm max", rpmMax.toFixed(0), "| gears", gmin, "-", gmax, "| slip max", slipMax.toFixed(2), "@", slipMaxV.toFixed(0), "kph");
// events: brake applications and lifts. A lift = gas falls below 0.5 for >=0.15 s with brake < 0.05 throughout.
const ev=[]; let i=a;
while(i<z){ if (brAt(i)>=0.05){ const s=i; let pk=0; while(i<z && brAt(i)>=0.05){ pk=Math.max(pk,brAt(i)); i++; } ev.push({t:"BRAKE", s, e:i, pk, v0:vAt(s), v1:vAt(i-1)}); } else i++; }
i=a;
while(i<z){ if (gasAt(i)<0.5 && brAt(i)<0.05){ const s=i; let mn=1; while(i<z && gasAt(i)<0.5 && brAt(i)<0.05){ mn=Math.min(mn,gasAt(i)); i++; } if ((i-s)*ex.dt>=0.15) ev.push({t:"LIFT", s, e:i, mn, v0:vAt(s), v1:vAt(i-1)}); } else i++; }
ev.sort((x,y)=>x.s-y.s);
console.log("events", ev.length, "brake", ev.filter(e=>e.t==="BRAKE").length, "lift", ev.filter(e=>e.t==="LIFT").length);
for (const e of ev){ const dur=((e.e-e.s)*ex.dt).toFixed(2); const tt=((e.s-a)*ex.dt).toFixed(1);
  // was a brake within 1.0 s after a lift? then the lift is corner entry, not a free lift
  let tag="";
  if (e.t==="LIFT"){ const nextBrake = ev.find(f=>f.t==="BRAKE" && f.s>=e.s && (f.s-e.e)*ex.dt<=1.0); tag = nextBrake ? "→brake" : (e.v1<e.v0-15 ? "coast" : "FREE"); }
  console.log(`${tt.padStart(6)}s ${e.t.padEnd(5)} ${dur.padStart(5)}s  ${e.v0.toFixed(0).padStart(4)}→${e.v1.toFixed(0).padStart(4)} kph ${e.t==="BRAKE"?("pk "+e.pk.toFixed(2)):("min gas "+e.mn.toFixed(2))} ${tag}`); }
