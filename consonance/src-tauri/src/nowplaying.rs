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
        if !self.matched {
            // Said out loud rather than hidden: this is the OS's guess, not a match to what is
            // being captured, and it can be a different application's audio.
            s.push_str("  (system session, may not be the captured app)");
        }
        s
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
            if !wanted.is_empty() && (low.contains(&wanted) || wanted.contains(low.trim_end_matches(".exe"))) {
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

    Some(NowPlaying {
        title: title.trim().to_string(),
        artist: props.Artist().map(|t| t.to_string()).unwrap_or_default().trim().to_string(),
        album: props.AlbumTitle().map(|t| t.to_string()).unwrap_or_default().trim().to_string(),
        source,
        matched,
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
            album: String::new(),
            source: "Chrome".into(),
            matched: false,
        };
        assert!(np.line().contains("may not be the captured app"));
        let ok = NowPlaying { matched: true, ..np.clone() };
        assert!(!ok.line().contains("may not be"));
        assert_eq!(ok.line(), "Samuel Barber — Adagio for Strings, Op. 11");
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
