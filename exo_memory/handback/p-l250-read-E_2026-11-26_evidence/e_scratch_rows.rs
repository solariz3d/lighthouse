
    // E SCRATCH (L250 read, never committed): O's rule on keys that nest and names that only begin with a key; prints what it keeps.
    #[test]
    fn e_scratch_nesting_keys() {
        let nest = valid_keys(Some("[S0]
KEY=ROAD
IS_VALID_TRACK=1
[S1]
KEY=ROADSIDE
IS_VALID_TRACK=0
[S2]
KEY=GRASS
IS_VALID_TRACK=0
[S3]
KEY=GRASSPAVED
IS_VALID_TRACK=1
"));
        for n in ["1ROADSIDE", "1ROADSIDE_02", "1ROAD_02", "1GRASSPAVED", "1GRASS", "1ROADSIGN", "10road-x", "1Road", "0ROAD"] { println!("E nest: {n} kept={}", is_valid_track(n, &nest)); }
        let redefined = valid_keys(Some("[S0]
KEY=ROAD
IS_VALID_TRACK=0
"));
        println!("E redefined ROAD=0 in the layout: 1ROAD kept={}", is_valid_track("1ROAD", &redefined));
    }

    // E SCRATCH (L250 read, never committed): one layout's road bytes, named by env (never printed), for the page's pick time.
    #[test]
    #[ignore]
    fn e_scratch_dump() {
        let t = std::time::Instant::now();
        let r = read_road(&installed(), &std::env::var("T180_E_TRACK").unwrap(), &std::env::var("T180_E_LAYOUT").unwrap_or_default()).unwrap();
        let b = encode(&r);
        fs::write(Path::new(&std::env::var("T180_ROAD_DUMP").unwrap()).join("e.road"), &b).unwrap();
        println!("E dump: {} triangles, {} batches, {} bytes, {:.0} ms", r.triangles, r.batches.len(), b.len(), ms(t));
    }
