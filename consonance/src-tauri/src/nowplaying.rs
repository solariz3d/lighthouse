//! What is actually playing, from Windows' own media session.
//!
//! THE KEEPER'S REASON, and it is the right one: *"so you do not have to guess and listen to some
//! shit without knowing what it is."* An afternoon was spent reading `~467 Hz` and inferring B♭
//! minor from the ratios, which is the instrument's job being done twice — once badly by me, once
//! properly by the API Windows has had all along.
//!
//! WHY SMTC AND NOT A WINDOW TITLE. Spotify's window caption is "Artist - Title" while playing and
//! "Spotify" when paused, which works until it doesn't: Chrome's caption is the tab title, a
//! podcast client's is anything at all, and none of them say whether audio is actually running.
//! `GlobalSystemMediaTransportControlsSessionManager` is what the OS itself uses to draw the
//! volume-key overlay — structured title/artist/album fields plus a real playback status, from any
//! app that registers a session. Zero new dependencies: the `windows` crate is already in the tree
//! via Tauri and this is a feature flag on it.
//!
//! WHICH SESSION. `GetCurrentSession` returns whatever the OS considers foremost, which need not be
//! the process being captured — with Spotify bound and a video paused in a browser, the wrong one
//! is entirely possible. So sessions are searched for one whose source id matches the capture
//! source, and the OS's choice is only a fallback. The result says which path it took, because a
//! title from the wrong app is worse than no title.

use windows::Media::Control::GlobalSystemMediaTransportControlsSessionManager;

#[derive(Clone, Debug, Default, PartialEq, serde::Serialize)]
pub struct NowPlaying {
    pub title: String,
    pub artist: String,
    pub album: String,
    /// The app the session belongs to, as Windows reports it.
    pub source: String,
    /// True when this came from a session matched to the capture source, false when it is the OS's
    /// idea of "current" and might belong to some other app entirely.
    pub matched: bool,
    /// Seconds into the track, extrapolated — see `read`. 0 when the app reports no timeline.
    pub position: f64,
    /// Track length in seconds. 0 when unknown, which a caller must treat as "unknown" and not as
    /// "zero-length": a progress bar dividing by it would render a full or NaN bar.
    pub duration: f64,
    pub playing: bool,
}

/// Windows counts 100-nanosecond ticks from 1601; Unix counts seconds from 1970.
const FILETIME_UNIX_OFFSET_SECS: i64 = 11_644_473_600;

fn now_ticks() -> i64 {
    let d = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default();
    (d.as_secs() as i64 + FILETIME_UNIX_OFFSET_SECS) * 10_000_000 + (d.subsec_nanos() as i64 / 100)
}

/// Seconds into the track, corrected for how long ago the app last reported.
///
/// THE TRAP, and it would have been found later and blamed on something else. SMTC's `Position` is
/// not a live clock — it is a value the media app pushes when it feels like it, and Spotify pushes
/// on seek, pause and track change, not continuously. Reading it raw gives a position that freezes
/// for seconds and then jumps, so "4:31 of 7:23" would sit still while the music moved and every
/// statement about where we are in the piece would be wrong by an unknown amount.
///
/// `LastUpdatedTime` says when the value was true. Adding the elapsed time since — only while
/// actually playing, because a paused track's position genuinely does not advance — reconstructs a
/// live clock from a stale sample. Clamped to the track length so drift cannot run past the end.
pub fn extrapolate(position: f64, last_updated_ticks: i64, duration: f64, playing: bool) -> f64 {
    if !playing || last_updated_ticks <= 0 {
        return position.max(0.0);
    }
    let elapsed = (now_ticks() - last_updated_ticks) as f64 / 10_000_000.0;
    // A negative or absurd delta means the clocks disagree; trust the reported value rather than
    // invent a position from it.
    let live = if (0.0..3600.0).contains(&elapsed) { position + elapsed } else { position };
    if duration > 0.0 { live.clamp(0.0, duration) } else { live.max(0.0) }
}

/// `m:ss`, or `h:mm:ss` past an hour. Unknown durations render as `--:--` rather than `0:00`, which
/// would read as a real position at the start of a real track.
pub fn clock(secs: f64) -> String {
    if !(secs.is_finite() && secs >= 0.0) { return "--:--".into(); }
    let t = secs.round() as u64;
    if t >= 3600 { format!("{}:{:02}:{:02}", t / 3600, (t % 3600) / 60, t % 60) }
    else { format!("{}:{:02}", t / 60, t % 60) }
}

impl NowPlaying {
    /// One line for a ledger or a monitor. Empty when there is nothing worth saying.
    pub fn line(&self) -> String {
        if self.title.is_empty() { return String::new(); }
        let mut s = if self.artist.is_empty() {
            self.title.clone()
        } else {
            format!("{} — {}", self.artist, self.title)
        };
        if self.duration > 0.0 {
            // The length goes in the ledger line because that is the one place it is durable: the
            // position changes every second and belongs in the live snapshot, but "how long is this
            // thing" is a fact about the track and worth keeping beside its name.
            s.push_str(&format!("  [{}]", clock(self.duration)));
        }
        if !self.matched {
            // Said out loud rather than hidden: this is the OS's guess, not a match to what is
            // being captured, and it can be a different application's audio.
            s.push_str("  (system session, may not be the captured app)");
        }
        s
    }

    /// `3:42 / 7:23`, or just the position when the length is unknown.
    pub fn elapsed(&self) -> String {
        if self.duration > 0.0 {
            format!("{} / {}", clock(self.position), clock(self.duration))
        } else {
            clock(self.position)
        }
    }
}

/// Read the current media session. `want` is the capture source's label, used to prefer the session
/// belonging to it.
///
/// Returns None when nothing is playing or WinRT is unavailable. A failure here must never be more
/// than a missing title — this is a convenience on top of the listening, not part of it.
pub fn read(want: &str) -> Option<NowPlaying> {
    let mgr = GlobalSystemMediaTransportControlsSessionManager::RequestAsync().ok()?.get().ok()?;
    let wanted = want.to_ascii_lowercase();

    // Prefer a session whose source id looks like the app being captured. Windows reports ids like
    // "Spotify.exe" or an AUMID; a substring test is the pragmatic match and a wrong match is
    // reported rather than assumed.
    let mut chosen = None;
    let mut matched = false;
    if let Ok(sessions) = mgr.GetSessions() {
        for s in sessions {
            let id = s.SourceAppUserModelId().map(|i| i.to_string()).unwrap_or_default();
            let low = id.to_ascii_lowercase();
            let low_trim = low.trim_end_matches(".exe");
            // An empty/unreadable session id must NOT match: `wanted.contains("")` is always true,
            // so a session whose SourceAppUserModelId() errored to "" would be chosen first and
            // stamped matched:true — reporting the wrong app's title and resetting the dynamics
            // window on its track changes. Require a real id on both sides of the substring test.
            if !wanted.is_empty() && !low_trim.is_empty()
                && (low.contains(&wanted) || wanted.contains(low_trim)) {
                chosen = Some((s, id));
                matched = true;
                break;
            }
        }
    }
    if chosen.is_none() {
        let s = mgr.GetCurrentSession().ok()?;
        let id = s.SourceAppUserModelId().map(|i| i.to_string()).unwrap_or_default();
        chosen = Some((s, id));
    }
    let (session, source) = chosen?;

    let props = session.TryGetMediaPropertiesAsync().ok()?.get().ok()?;
    let title = props.Title().map(|t| t.to_string()).unwrap_or_default();
    if title.trim().is_empty() { return None; }

    // Playback status 4 is Playing in GlobalSystemMediaTransportControlsSessionPlaybackStatus.
    // Anything else — paused, stopped, changing — means the position is not advancing.
    let playing = session.GetPlaybackInfo().ok()
        .and_then(|i| i.PlaybackStatus().ok())
        .map(|s| s.0 == 4)
        .unwrap_or(false);

    // A timeline is optional: plenty of sources report a title and no position at all. Absent
    // timeline must read as "unknown", never as position 0 of a 0-length track.
    let (position, duration) = match session.GetTimelineProperties() {
        Ok(tl) => {
            let pos = tl.Position().map(|t| t.Duration as f64 / 10_000_000.0).unwrap_or(0.0);
            let end = tl.EndTime().map(|t| t.Duration as f64 / 10_000_000.0).unwrap_or(0.0);
            let start = tl.StartTime().map(|t| t.Duration as f64 / 10_000_000.0).unwrap_or(0.0);
            let last = tl.LastUpdatedTime().map(|d| d.UniversalTime).unwrap_or(0);
            // EndTime is not always zero-based — a chapter or a stream can start partway in.
            let dur = (end - start).max(0.0);
            (extrapolate((pos - start).max(0.0), last, dur, playing), dur)
        }
        Err(_) => (0.0, 0.0),
    };

    Some(NowPlaying {
        title: title.trim().to_string(),
        artist: props.Artist().map(|t| t.to_string()).unwrap_or_default().trim().to_string(),
        album: props.AlbumTitle().map(|t| t.to_string()).unwrap_or_default().trim().to_string(),
        source,
        matched,
        position,
        duration,
        playing,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn an_unmatched_session_says_so_in_its_own_line() {
        // A title from the wrong application is worse than no title: it would have me confidently
        // describing the harmony of something else entirely.
        let np = NowPlaying {
            title: "Adagio for Strings, Op. 11".into(),
            artist: "Samuel Barber".into(),
            source: "Chrome".into(),
            matched: false,
            ..Default::default()
        };
        assert!(np.line().contains("may not be the captured app"));
        let ok = NowPlaying { matched: true, ..np.clone() };
        assert!(!ok.line().contains("may not be"));
        assert_eq!(ok.line(), "Samuel Barber — Adagio for Strings, Op. 11");
    }

    #[test]
    fn a_stale_position_is_carried_forward_while_playing() {
        // The trap this exists for: SMTC's Position is a value the app PUSHES, not a clock. Spotify
        // pushes on seek, pause and track change. Read raw, the position freezes for seconds then
        // jumps, so every statement about where we are in a piece is wrong by an unknown amount.
        let three_secs_ago = now_ticks() - 3 * 10_000_000;
        let live = extrapolate(100.0, three_secs_ago, 443.0, true);
        assert!((live - 103.0).abs() < 0.5, "expected ~103s, got {live:.1}");

        // Paused, the position genuinely does not advance and must not be extrapolated.
        let held = extrapolate(100.0, three_secs_ago, 443.0, false);
        assert!((held - 100.0).abs() < 0.01, "a paused track moved to {held:.1}");
    }

    #[test]
    fn extrapolation_cannot_run_past_the_end_or_backwards() {
        let long_ago = now_ticks() - 600 * 10_000_000;      // ten minutes of staleness
        let clamped = extrapolate(400.0, long_ago, 443.0, true);
        assert!(clamped <= 443.0, "ran past the end to {clamped:.1}");
        // A clock disagreement giving a negative delta must not rewind the track.
        let future = now_ticks() + 60 * 10_000_000;
        assert_eq!(extrapolate(100.0, future, 443.0, true), 100.0);
        assert_eq!(extrapolate(-5.0, 0, 443.0, false), 0.0);
    }

    #[test]
    fn an_unknown_length_reads_as_unknown_not_as_zero() {
        // 0:00 would look like a real position at the start of a real track, and a progress bar
        // dividing by a zero length renders full or NaN.
        assert_eq!(clock(f64::NAN), "--:--");
        assert_eq!(clock(-1.0), "--:--");
        let np = NowPlaying { title: "x".into(), matched: true, position: 61.0, duration: 0.0, ..Default::default() };
        assert_eq!(np.elapsed(), "1:01", "with no length, show the position alone");
        assert!(!np.line().contains('['), "no length means no length in the line: {}", np.line());
    }

    #[test]
    fn the_clock_reads_the_way_a_player_shows_it() {
        assert_eq!(clock(0.0), "0:00");
        assert_eq!(clock(9.0), "0:09");
        assert_eq!(clock(443.0), "7:23");        // the Adagio
        assert_eq!(clock(3600.0), "1:00:00");
        let np = NowPlaying { title: "t".into(), matched: true, position: 222.0, duration: 443.0, ..Default::default() };
        assert_eq!(np.elapsed(), "3:42 / 7:23");
    }

    #[test]
    fn nothing_playing_produces_no_line_rather_than_a_dash() {
        // An empty line is skipped by the caller; a placeholder would land in the ledger as though
        // it were an event.
        assert_eq!(NowPlaying::default().line(), "");
    }

    #[test]
    fn a_title_without_an_artist_still_reads() {
        let np = NowPlaying { title: "untitled sketch".into(), matched: true, ..Default::default() };
        assert_eq!(np.line(), "untitled sketch");
    }

    #[test]
    fn reading_the_real_session_does_not_panic() {
        // Cannot assert a title — the machine may have nothing playing. What IS worth pinning is
        // that the WinRT path returns rather than panicking or hanging, on whatever this machine
        // happens to be doing.
        //
        // The print is diagnostics, not decoration: `None` here is ambiguous between "nothing is
        // playing" and "the WinRT path is broken", and those need different fixes. Run with
        // `cargo test nowplaying -- --nocapture` while something plays to tell them apart.
        match read("spotify") {
            Some(np) => println!("  [nowplaying] source={:?} matched={} -> {}", np.source, np.matched, np.line()),
            None => println!("  [nowplaying] no session (nothing playing, or WinRT unavailable)"),
        }
    }
}
