fn main() {
    println!("at start: {:?}", std::env::current_exe().unwrap());
    std::thread::sleep(std::time::Duration::from_secs(6));
    println!("after rename: {:?}", std::env::current_exe().unwrap());
}
