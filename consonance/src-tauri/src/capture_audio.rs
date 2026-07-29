//! WASAPI process loopback — the half that cannot be unit tested.
//!
//! Everything here is unsafe COM against a live audio stack. `cochlea.rs` is deliberately free
//! of it so the maths could be proven on synthesised waveforms before any of this existed, and
//! `listen.rs` decides WHAT to bind to. This file only opens the tap.
//!
//! THE API, and why it is this shape rather than plain loopback. `IAudioClient` on a rendering
//! endpoint gives you the whole mix — every application, including a voice call. Windows 10
//! 2004 added `ActivateAudioInterfaceAsync` against the pseudo-device
//! `VIRTUAL_AUDIO_DEVICE_PROCESS_LOOPBACK`, taking `AUDIOCLIENT_ACTIVATION_PARAMS` that name a
//! target process and an include/exclude mode. Bound to Spotify's tree, Discord's audio is not
//! filtered downstream — it is never written into the buffer. That is the entire justification
//! for the extra complexity, and it is a guarantee rather than a policy.
//!
//! TWO THINGS THAT BITE, both undocumented in the obvious places:
//!
//!   1. The activation is ASYNC and completes on a COM-managed thread. You must supply an
//!      `IActivateAudioInterfaceCompletionHandler` and wait on it. Calling `GetActivateResult`
//!      before completion returns E_ILLEGAL_METHOD_CALL, not a helpful error.
//!   2. The pseudo-device has NO mix format. `GetMixFormat` fails on it, so the format must be
//!      asserted rather than queried — the client resamples to whatever you declare.
//!
//! THREADING. Capture runs on its own thread with its own COM apartment and pushes finished
//! analysis windows down a channel. The audio callback must never block on anything the UI
//! owns; a stalled capture thread produces glitching in the *source application*, which would
//! make a listening feature audible in the thing it is listening to.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::Sender;
use std::sync::Arc;

use windows::core::{implement, Interface, Ref, Result as WinResult, PCWSTR};

/// `AUDIOCLIENT_ACTIVATION_PARAMS` has to reach `ActivateAudioInterfaceAsync` inside a
/// `PROPVARIANT` of type `VT_BLOB` — the signature takes a PROPVARIANT, not the params directly,
/// which is the detail every write-up of this API omits and which fails at runtime rather than
/// at compile time if you pass the struct straight through.
///
/// windows-rs models PROPVARIANT as an opaque type with no BLOB constructor, so the variant is
/// built by layout, exactly as the Microsoft C++ sample does. Layout is fixed by COM and is not
/// going to drift: a 2-byte tag, three reserved shorts, then the union at offset 8.
#[repr(C)]
struct PropVariantBlob {
    vt: u16,
    r1: u16,
    r2: u16,
    r3: u16,
    cb_size: u32,
    _pad: u32,          // the union is pointer-aligned on x64; the blob pointer starts at 16
    p_blob_data: *mut u8,
}
const VT_BLOB: u16 = 65;
use windows::Win32::Foundation::{CloseHandle, HANDLE, WAIT_OBJECT_0};
use windows::Win32::Media::Audio::{
    ActivateAudioInterfaceAsync, IActivateAudioInterfaceAsyncOperation,
    IActivateAudioInterfaceCompletionHandler, IActivateAudioInterfaceCompletionHandler_Impl,
    IAudioCaptureClient, IAudioClient, AUDCLNT_SHAREMODE_SHARED,
    AUDCLNT_STREAMFLAGS_EVENTCALLBACK, AUDCLNT_STREAMFLAGS_LOOPBACK,
    AUDIOCLIENT_ACTIVATION_PARAMS, AUDIOCLIENT_ACTIVATION_PARAMS_0,
    AUDIOCLIENT_ACTIVATION_TYPE_PROCESS_LOOPBACK, AUDIOCLIENT_PROCESS_LOOPBACK_PARAMS,
    PROCESS_LOOPBACK_MODE_INCLUDE_TARGET_PROCESS_TREE, VIRTUAL_AUDIO_DEVICE_PROCESS_LOOPBACK,
    WAVEFORMATEX,
};
use windows::Win32::System::Com::{CoInitializeEx, CoTaskMemFree, COINIT_MULTITHREADED};
use windows::Win32::System::Threading::{CreateEventW, SetEvent, WaitForSingleObject};

/// The analysis window. 4096 at 48 kHz is ~85 ms and ~11.7 Hz per bin — short enough that a
/// chord change is not smeared across two reports, long enough to separate a fifth in the bass.
pub const WINDOW: usize = 4096;
pub const SAMPLE_RATE: u32 = 48_000;

/// Completion handler for the async activation. Its only job is to release the waiter.
#[implement(IActivateAudioInterfaceCompletionHandler)]
struct ActivationDone(HANDLE);

impl IActivateAudioInterfaceCompletionHandler_Impl for ActivationDone_Impl {
    fn ActivateCompleted(&self, _op: Ref<'_, IActivateAudioInterfaceAsyncOperation>) -> WinResult<()> {
        unsafe { let _ = SetEvent(self.0); }
        Ok(())
    }
}

/// Float32 stereo at 48 kHz, asserted because the pseudo-device cannot be asked.
fn format() -> WAVEFORMATEX {
    WAVEFORMATEX {
        // WAVE_FORMAT_IEEE_FLOAT. The constant lives in Win32::Media::Multimedia and pulling
        // that whole feature in for one integer is not worth it.
        wFormatTag: 3,
        nChannels: 2,
        nSamplesPerSec: SAMPLE_RATE,
        nAvgBytesPerSec: SAMPLE_RATE * 2 * 4,
        nBlockAlign: 2 * 4,
        wBitsPerSample: 32,
        cbSize: 0,
    }
}

/// Open a loopback tap on one process tree and stream mono analysis windows down `tx`.
///
/// `pid` of 0 binds the whole endpoint — the only mode that can hear a call, and the caller is
/// responsible for having said so. Runs until `stop` is set or the source exits.
pub fn run(pid: u32, tx: Sender<Vec<f32>>, stop: Arc<AtomicBool>) -> Result<(), String> {
    unsafe {
        // Its own apartment: this thread outlives any UI call and must not inherit one.
        let _ = CoInitializeEx(None, COINIT_MULTITHREADED);

        let mut params = AUDIOCLIENT_ACTIVATION_PARAMS {
            ActivationType: AUDIOCLIENT_ACTIVATION_TYPE_PROCESS_LOOPBACK,
            Anonymous: AUDIOCLIENT_ACTIVATION_PARAMS_0 {
                ProcessLoopbackParams: AUDIOCLIENT_PROCESS_LOOPBACK_PARAMS {
                    TargetProcessId: pid,
                    ProcessLoopbackMode: PROCESS_LOOPBACK_MODE_INCLUDE_TARGET_PROCESS_TREE,
                },
            },
        };

        let event = CreateEventW(None, false, false, PCWSTR::null())
            .map_err(|e| format!("CreateEventW: {e}"))?;
        let handler: IActivateAudioInterfaceCompletionHandler = ActivationDone(event).into();

        let blob = PropVariantBlob {
            vt: VT_BLOB,
            r1: 0, r2: 0, r3: 0,
            cb_size: std::mem::size_of::<AUDIOCLIENT_ACTIVATION_PARAMS>() as u32,
            _pad: 0,
            p_blob_data: &mut params as *mut _ as *mut u8,
        };

        let op = ActivateAudioInterfaceAsync(
            VIRTUAL_AUDIO_DEVICE_PROCESS_LOOPBACK,
            &<IAudioClient as Interface>::IID,
            Some(&blob as *const _ as *const _),
            &handler,
        )
        .map_err(|e| format!("ActivateAudioInterfaceAsync: {e} — process loopback needs Windows 10 2004+"))?;

        // Calling GetActivateResult before this returns E_ILLEGAL_METHOD_CALL, which reads like
        // a usage bug rather than a race and costs an hour to recognise.
        if WaitForSingleObject(event, 5_000) != WAIT_OBJECT_0 {
            let _ = CloseHandle(event);
            return Err("activation did not complete within 5s".into());
        }
        let _ = CloseHandle(event);

        let mut hr = windows::core::HRESULT(0);
        let mut unknown = None;
        op.GetActivateResult(&mut hr, &mut unknown)
            .map_err(|e| format!("GetActivateResult: {e}"))?;
        hr.ok().map_err(|e| format!("activation failed: {e} — is the target still running?"))?;
        let client: IAudioClient = unknown.ok_or("no interface returned")?
            .cast().map_err(|e| format!("cast to IAudioClient: {e}"))?;

        let fmt = format();
        client
            .Initialize(
                AUDCLNT_SHAREMODE_SHARED,
                AUDCLNT_STREAMFLAGS_LOOPBACK | AUDCLNT_STREAMFLAGS_EVENTCALLBACK,
                10_000_000, // 1s buffer in 100ns units; generous, this is not a low-latency path
                0,
                &fmt,
                None,
            )
            .map_err(|e| format!("Initialize: {e}"))?;

        let ready = CreateEventW(None, false, false, PCWSTR::null())
            .map_err(|e| format!("CreateEventW(ready): {e}"))?;
        client.SetEventHandle(ready).map_err(|e| format!("SetEventHandle: {e}"))?;
        let cap: IAudioCaptureClient = client.GetService().map_err(|e| format!("GetService: {e}"))?;
        client.Start().map_err(|e| format!("Start: {e}"))?;

        let mut window: Vec<f32> = Vec::with_capacity(WINDOW);
        while !stop.load(Ordering::Relaxed) {
            // A timeout rather than an infinite wait: a source that goes silent stops signalling,
            // and an un-timed wait would make the stop flag unobservable until the next sound.
            if WaitForSingleObject(ready, 200) != WAIT_OBJECT_0 {
                continue;
            }
            loop {
                let mut data: *mut u8 = std::ptr::null_mut();
                let mut frames: u32 = 0;
                let mut flags: u32 = 0;
                if cap.GetBuffer(&mut data, &mut frames, &mut flags, None, None).is_err() {
                    break;
                }
                if frames == 0 {
                    let _ = cap.ReleaseBuffer(0);
                    break;
                }
                // AUDCLNT_BUFFERFLAGS_SILENT: the pointer may be garbage and must not be read.
                // Silence still advances the window, or a paused source would freeze the last
                // chord in place and report it as held forever.
                const SILENT: u32 = 0x2;
                if flags & SILENT != 0 {
                    window.extend(std::iter::repeat(0.0).take(frames as usize));
                } else {
                    let s = std::slice::from_raw_parts(data as *const f32, frames as usize * 2);
                    // downmix to mono: intervals are a property of the mix, not of a channel
                    window.extend(s.chunks_exact(2).map(|c| (c[0] + c[1]) * 0.5));
                }
                let _ = cap.ReleaseBuffer(frames);

                while window.len() >= WINDOW {
                    let chunk: Vec<f32> = window.drain(..WINDOW).collect();
                    if tx.send(chunk).is_err() {
                        stop.store(true, Ordering::Relaxed);
                        break;
                    }
                }
            }
        }

        let _ = client.Stop();
        let _ = CloseHandle(ready);
        Ok(())
    }
}

/// Free a COM-allocated format block. Kept because a future GetMixFormat path needs it and
/// forgetting it leaks once per start.
#[allow(dead_code)]
pub unsafe fn free_format(p: *mut WAVEFORMATEX) {
    if !p.is_null() { CoTaskMemFree(Some(p as *const _)); }
}
