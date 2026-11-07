// mkviews.js: camera views for each fixture case from the path frame. node mkviews.js <tree> > views.json
const path=require('path'),T=process.argv[2],R=(p)=>require(path.join(T,p)),A=R('src/core/adapter.js');
const {doc}=require('./fx.js')(T); const P=A.toPath(doc,{step:2}).path.samples;
const at=(s)=>P.reduce((a,b)=>Math.abs(b.s-s)<Math.abs(a.s-s)?b:a);
const pt=(s,u,v,f=0)=>{const q=at(s);return [0,1,2].map(k=>+(q.pos[k]+q.L[k]*u+q.U[k]*v+q.T[k]*f).toFixed(2));};
const V=[];
const add=(name,s,eye,look,fov=55)=>V.push({name,eye:pt(s,...eye),at:pt(s,...look),fov});
// eye/look as [u, v, forward]
add('abrupt-open-low', 300, [-14,-4,-30], [-2,3,4], 50);
add('abrupt-open-side', 300, [-24,6,-10], [-3,5,8], 50);
add('abrupt-open-under', 300, [-6,-12,-14], [0,2,6], 55);
add('abrupt-close-low', 120, [14,-4,30], [2,3,-4], 50);
add('abrupt-close-side', 120, [24,6,10], [3,5,-8], 50);
add('gradual-close', 600, [-28,-4,-40], [-4,6,10], 55);
add('gradual-open', 1860, [28,-4,-40], [4,6,10], 55);
add('closed-run-joint', 180, [-14,-6,-20], [0,3,0], 50);
add('bend', 780, [-30,4,-40], [0,6,0], 60);
add('bank', 1080, [-30,4,-40], [0,6,0], 60);
add('climb', 1420, [-30,-2,-50], [0,6,0], 60);
add('apron-at-open', 340, [30,10,-20], [12,1,0], 55);
add('inside-closed', 240, [0,2,-20], [0,4,10], 70);
console.log(JSON.stringify(V,null,1));
