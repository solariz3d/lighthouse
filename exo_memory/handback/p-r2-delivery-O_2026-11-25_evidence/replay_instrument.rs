#[cfg(test)]
mod o_r2_replay_tmp {
    use super::*;
    /// TEMPORARY (pane O, R2): replay a slice of a capture and print the composer reading at each step.
    #[test]
    #[ignore]
    fn o_r2_replay() {
        let path = std::env::var("R2_LOG").unwrap();
        let from: u64 = std::env::var("R2_FROM").unwrap().parse().unwrap();
        let watch: u64 = std::env::var("R2_WATCH").unwrap().parse().unwrap();
        let to: u64 = std::env::var("R2_TO").unwrap().parse().unwrap();
        let msg = std::fs::read_to_string(std::env::var("R2_MSG").unwrap()).unwrap();
        use std::io::{Read, Seek, SeekFrom};
        let mut f = std::fs::File::open(&path).unwrap();
        f.seek(SeekFrom::Start(from)).unwrap();
        let mut buf = vec![0u8; (to - from) as usize];
        f.read_exact(&mut buf).unwrap();
        let mut p = vt100::Parser::new(61, 305, 0);
        let mut last = String::new();
        let step = 16usize;
        let mut i = 0usize;
        while i < buf.len() {
            let j = (i + step).min(buf.len());
            p.process(&buf[i..j]);
            i = j;
            if from + (i as u64) < watch { continue; }
            let s = p.screen();
            let (_, cols) = s.size();
            let rendered: Vec<String> = s.rows(0, cols).collect();
            let typed = typed_only(s);
            let c = composer_state(&rendered, &typed);
            let ours = ours_in_box(&rendered, &msg);
            let row = composer_row(&rendered).map(|k| rendered[k].trim_end().to_string()).unwrap_or_default();
            let foot = rendered.iter().rev().find(|l| !l.trim().is_empty()).cloned().unwrap_or_default();
            let line = format!("{c:?} ours={ours} composer={row:?} footer={:?}", foot.trim());
            if line != last { println!("@{} {}", from + i as u64, line); last = line; }
        }
    }
}
