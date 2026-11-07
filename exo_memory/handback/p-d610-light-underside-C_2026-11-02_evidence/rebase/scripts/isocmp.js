const [a,b]=process.argv.slice(2).map(f=>require(require('path').resolve(f)));
for (const k of ['lap','open']) { const A=a[k],B=b[k]; console.log('==',k,'files',Object.keys(A).length,Object.keys(B).length);
  for (const f of new Set([...Object.keys(A),...Object.keys(B)])) { if (!A[f]||!B[f]) { console.log(' only in one:',f); continue; } if (A[f].sha===B[f].sha) continue; console.log(' changed:',f);
    if (A[f].nodes) { const na=A[f].nodes, nb=B[f].nodes; const ma=new Map(na.meshes.map(m=>[m.name,m.full])), mb=new Map(nb.meshes.map(m=>[m.name,m.full]));
      console.log('  meshes',na.meshes.length,nb.meshes.length,'materials same',JSON.stringify(na.materials)===JSON.stringify(nb.materials)&&JSON.stringify(na.materialDigests)===JSON.stringify(nb.materialDigests));
      const moved=[...ma.keys()].filter(n=>mb.has(n)&&ma.get(n)!==mb.get(n)), gone=[...ma.keys()].filter(n=>!mb.has(n)), added=[...mb.keys()].filter(n=>!ma.has(n));
      console.log('  moved',moved.join(' ')); console.log('  only before',gone.join(' ')); console.log('  only after',added.join(' '));
      console.log('  non-skin moved/gone/added', [...moved,...gone,...added].filter(n=>!/^UNDERSKIN_/.test(n)).length); } } }
