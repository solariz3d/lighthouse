// add_rows_reread.js <kn5road.rs>: appends pane E's re-read scratch rows (never committed) inside kn5road.rs's tests module. Undo: git checkout -- that file.
'use strict';
const fs = require('fs');
const p = process.argv[2];
let s = fs.readFileSync(p, 'utf8');
if (s.includes('e_scratch_start_patches')) { console.log('already there'); process.exit(0); }
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const add = [
  '',
  '    // E SCRATCH (L250 re-read, never committed): for every layout, the road within 40 m of its start and of its AI line\'s first point, as encode()',
  '    // writes it (the header\'s start kept), to T180_E_PATCH/<layout number>.road; names never printed. The node side runs road.js on these.',
  '    #[test]',
  '    #[ignore]',
  '    fn e_scratch_start_patches() {',
  '        let tracks = installed();',
  '        let out = PathBuf::from(std::env::var("T180_E_PATCH").unwrap());',
  '        let all = crate::reference::list_layouts(&tracks).unwrap();',
  '        for (n, l) in all.iter().enumerate() {',
  '            let r = match read_road(&tracks, &l.track, &l.layout) { Ok(r) => r, Err(_) => { println!("E patch layout {}: REFUSED", n + 1); continue; } };',
  '            let mut c: Vec<[f64; 2]> = Vec::new();',
  '            if let Ok(st) = &r.start { c.push([st.pos[0], st.pos[2]]); }',
  '            if l.has_ai { if let Ok(b) = crate::reference::read_shape(&tracks, &l.track, &l.layout) { if b.len() >= 28 {',
  '                let f = |o: usize| f32::from_le_bytes([b[o], b[o + 1], b[o + 2], b[o + 3]]) as f64; c.push([f(16), f(24)]); } } }',
  '            const R: f64 = 40.0;',
  '            let (mut batches, mut tris, mut verts) = (Vec::new(), 0usize, 0usize);',
  '            for b in &r.batches {',
  '                let (mut pos, mut idx, mut map): (Vec<f32>, Vec<u16>, std::collections::HashMap<u16, u16>) = (Vec::new(), Vec::new(), std::collections::HashMap::new());',
  '                for t in b.idx.chunks(3) {',
  '                    let xs: Vec<f64> = t.iter().map(|&i| b.pos[i as usize * 3] as f64).collect(); let zs: Vec<f64> = t.iter().map(|&i| b.pos[i as usize * 3 + 2] as f64).collect();',
  '                    let (x0, x1, z0, z1) = (xs.iter().cloned().fold(f64::MAX, f64::min), xs.iter().cloned().fold(f64::MIN, f64::max), zs.iter().cloned().fold(f64::MAX, f64::min), zs.iter().cloned().fold(f64::MIN, f64::max));',
  '                    if !c.iter().any(|p| p[0] >= x0 - R && p[0] <= x1 + R && p[1] >= z0 - R && p[1] <= z1 + R) { continue; }',
  '                    for &i in t { let k = *map.entry(i).or_insert_with(|| { let k = (pos.len() / 3) as u16; pos.extend_from_slice(&b.pos[i as usize * 3..i as usize * 3 + 3]); k }); idx.push(k); }',
  '                    tris += 1;',
  '                }',
  '                if !idx.is_empty() { verts += pos.len() / 3; batches.push(Batch { pos, idx }); }',
  '            }',
  '            let patch = Road { batches, files: r.files, missing: r.missing, meshes: r.meshes, triangles: tris, vertices: verts, keys: r.keys.clone(), surfaces: r.surfaces, start: r.start.clone() };',
  '            fs::write(out.join(format!("{}.road", n + 1)), encode(&patch)).unwrap();',
  '            println!("E patch layout {}: ai={} start={} patch {} triangles of {}", n + 1, l.has_ai as u8, r.start.as_ref().map_or("none", |s| s.from), tris, r.triangles);',
  '        }',
  '    }',
  '',
  '    // E SCRATCH (L250 re-read, never committed): one layout\'s whole road bytes, named by env (never printed), for the real panel in a page.',
  '    #[test]',
  '    #[ignore]',
  '    fn e_scratch_dump() {',
  '        let t = std::time::Instant::now();',
  '        let r = read_road(&installed(), &std::env::var("T180_E_TRACK").unwrap(), &std::env::var("T180_E_LAYOUT").unwrap_or_default()).unwrap();',
  '        let b = encode(&r);',
  '        fs::write(Path::new(&std::env::var("T180_ROAD_DUMP").unwrap()).join(std::env::var("T180_E_OUT").unwrap()), &b).unwrap();',
  '        println!("E dump: {} triangles, {} batches, {} bytes, start {:?}, {:.0} ms", r.triangles, r.batches.len(), b.len(), r.start.as_ref().map(|s| s.from), ms(t));',
  '    }',
].join(nl) + nl;
const at = s.lastIndexOf('}');
s = s.slice(0, at) + add + s.slice(at);
fs.writeFileSync(p, s);
console.log('added');
