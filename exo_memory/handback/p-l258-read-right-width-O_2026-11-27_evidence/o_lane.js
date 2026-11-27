// o_lane.js (pane O, L258 track 2 read; scratch): where the pit lane builder puts the road's edge on a split road, against the same road with its sides equal.
// The run that gave lane_measure.txt was this text, given to node -e in the worktree at e4e7ecc. usage: node o_lane.js (cwd: the branch tree)
const D=require("./src/core/document.js"),E=require("./src/core/extend.js"),AD=require("./src/core/adapter.js"),MESH=require("./src/geom/mesh.js"),PLX=require("./src/export/pitlane.js");
let d=E.extend(D.createDoc("v"),{length:120,first:{w:19.1},targets:{kh:0}}); d=E.extend(d,{length:300,transition:60,targets:{kh:1/400,phi:8*Math.PI/180}});
d=E.extend(d,{length:100,transition:{wd:5},targets:{wd:3.5}}); d=E.extend(d,{length:300}); d=E.extend(d,{length:100,transition:{wd:5},targets:{wd:0}}); d=E.extend(d,{length:200});
const run=(doc,label)=>{ const pid=doc.pieces[3].id; const lane={side:"R",leave:{word:pid,along:40},rejoin:{word:pid,along:260},offsetM:6,width:8,divergeM:60,mergeM:56,speedKmh:80};
 const tp=AD.toPath(doc,{step:1}), mm=MESH.buildMesh(tp.path,tp.segments,{selfCheck:true}); const r=PLX.laneForExport(tp.path,tp.segments,mm,lane,{selfCheck:true});
 const L=r.lane, s0=520+150, q=L.at(s0); const P=tp.path.samples.reduce((a,x)=>Math.abs(x.s-s0)<Math.abs(a.s-s0)?x:a);
 const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]); console.log(label, JSON.stringify({red:r.red.length, at_s:s0, roadEdgeFromCentre:+dist(q.edge,P.pos).toFixed(3), laneInnerFromRoadEdge:+dist(q.inner,q.edge).toFixed(3)})); };
run(d,"split (right half 11.3)");
const flat={...d,pieces:d.pieces.map(P=>P.type!=="road"?P:(({split,...rest})=>({...rest,channels:{...P.channels,wd:P.channels.wd.map(()=>0)}}))(P))};
run(flat,"same road, sides equal (9.55)");
