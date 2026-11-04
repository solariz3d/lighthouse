const u=JSON.parse(require('fs').readFileSync('G:/worktrees/c-d301-wt/exo_memory/handback/p-misssample-A_2026-10-11_evidence/out/units.json','utf8')).units;
const [a,b]=process.argv.slice(2).map(Number);
for(const x of u.slice(a,b)){
 const t=x.transcript||{};const c=t.claim, ct=t.correction_turn;
 console.log(`\n===== ${x.id} | ${x.stratum}/${x.src} | finder ${x.finder} | day ${x.day} | ${x.correction_at} | seat ${x.seat_by_filename}`);
 console.log(`corr line ${x.correction_line_time&&x.correction_line_time.t} file1st ${x.correction_file_first_commit&&x.correction_file_first_commit.t}`);
 if(x.claim_at)console.log(`CLAIM ${x.claim_at} @${JSON.stringify(x.claim_line_time)}: ${x.claim_text}`);
 console.log('TEXT: '+x.correction_text);
 for(const r of x.cited_refs)console.log(`  ref ${r.cited} -> ${r.resolved||'-'} (${r.how}) 1st ${r.first_commit||'-'} line ${r.line_time||'-'}`);
 console.log(`  transcript ${t.status}${t.why?' why '+t.why:''}`);
 if(c)console.log(`  claim ${c.seat} ${c.ts} span "${c.matched_span.slice(0,60)}" openedBefore ${JSON.stringify(c.opened_before_claim_in_turn)} whole ${JSON.stringify(c.opened_in_whole_turn).slice(0,400)} afterCorrFile ${c.after_correction_file_first_commit} afterCorrLine ${c.after_correction_line_time}`);
 if(ct)console.log(`  corrturn ${ct.seat} ${ct.ts} whole ${JSON.stringify(ct.opened_in_whole_turn).slice(0,300)} citedAlreadyRead ${JSON.stringify(ct.cited_paths_already_read_in_this_transcript).slice(0,300)}`);
}
