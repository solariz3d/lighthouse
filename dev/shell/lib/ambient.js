// ambient.js — shared module for ambient world-state computation.
// Sun position (azimuth, altitude, sunrise, sunset, twilight phases),
// moon phase + illumination, time-of-day descriptor.
//
// Pure Node, no external dependencies. Used by SessionStart hook (context
// injection) and Stop hook (event-log temporal-texture).
//
// Location: chosen by the user, private, local-only. Resolution order:
//   1. AMBIENT_LAT / AMBIENT_LON / AMBIENT_LABEL / AMBIENT_TZ env vars
//      (Consonance sets these on every pane it spawns, from its Settings tab)
//   2. ~/.consonance.json ambient_* fields (the same Settings tab choice —
//      read here so sessions launched outside the app get the same sky)
//   3. built-in default: Greenwich (51.4779°N, -0.0015°W) — the honest "unset",
//      timezone from this machine's own clock.
// The value never leaves this machine: it is read from a local file/env and
// only ever rendered into local session context.

// The fallback is the prime meridian, not anybody's house. A framework that defaults to its
// author's coordinates ships the author's coordinates to every reader, and quietly gives every
// user a sky that isn't theirs. Greenwich is the honest "no location set": it is where zero is.
// Set yours in ~/.consonance.json (ambient_lat / ambient_lon / ambient_label / ambient_tz) or via
// the AMBIENT_* env vars — either way it stays on your disk.
const DEFAULT_LAT = 51.4779;   // Royal Observatory, Greenwich — longitude zero by definition
const DEFAULT_LON = -0.0015;
const DEFAULT_LABEL = 'Greenwich (no location set — see ~/.consonance.json ambient_lat/ambient_lon, or AMBIENT_LAT/LON)';

let consonanceCfgCache;
function consonanceCfg() {
  if (consonanceCfgCache !== undefined) return consonanceCfgCache;
  consonanceCfgCache = null;
  try {
    const path = require('path');
    const fs = require('fs');
    const home = process.env.USERPROFILE || require('os').homedir();
    // strip a UTF-8 BOM — some Windows tools write one, and JSON.parse rejects it
    const raw = fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^﻿/, '');
    consonanceCfgCache = JSON.parse(raw);
  } catch (e) { /* no config or unparsable — defaults apply */ }
  return consonanceCfgCache;
}

// parseFloat that treats 0 as a real coordinate (equator / prime meridian)
function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

// an invalid IANA name would make every toLocaleString throw — validate once, fall back
function validTz(tz) {
  if (!tz) return null;
  try {
    new Date().toLocaleString('en-US', { timeZone: tz });
    return tz;
  } catch (e) { return null; }
}

function getLocation() {
  const cfg = consonanceCfg() || {};
  const lat = num(process.env.AMBIENT_LAT) ?? num(cfg.ambient_lat) ?? DEFAULT_LAT;
  const lon = num(process.env.AMBIENT_LON) ?? num(cfg.ambient_lon) ?? DEFAULT_LON;
  const customCoords = (num(process.env.AMBIENT_LAT) ?? num(cfg.ambient_lat)) !== null;
  const label = (process.env.AMBIENT_LABEL || cfg.ambient_label || '').trim()
    || (customCoords ? `${lat}, ${lon}` : DEFAULT_LABEL);
  const tz = validTz((process.env.AMBIENT_TZ || cfg.ambient_tz || '').trim())
    || validTz(Intl.DateTimeFormat().resolvedOptions().timeZone)
    || 'UTC'; // last resort only — the machine's own clock is the real answer
  return { lat, lon, label, tz };
}

// ---------- Astronomical helpers ----------

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

// Julian Date for a given JS Date
function julianDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

// Days since J2000
function daysSinceJ2000(date) {
  return julianDate(date) - 2451545.0;
}

// Sun's mean longitude (degrees)
function sunMeanLongitude(d) {
  return (280.460 + 0.9856474 * d) % 360;
}

// Sun's mean anomaly (degrees)
function sunMeanAnomaly(d) {
  return (357.528 + 0.9856003 * d) % 360;
}

// Sun's ecliptic longitude (degrees)
function sunEclipticLongitude(d) {
  const M = sunMeanAnomaly(d) * RAD;
  const L = sunMeanLongitude(d);
  return (L + 1.915 * Math.sin(M) + 0.020 * Math.sin(2 * M)) % 360;
}

// Obliquity of the ecliptic (degrees)
function obliquity(d) {
  return 23.439 - 0.0000004 * d;
}

// Sun's right ascension and declination (degrees)
function sunRaDec(d) {
  const L = sunEclipticLongitude(d) * RAD;
  const eps = obliquity(d) * RAD;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(L), Math.cos(L)) * DEG;
  const dec = Math.asin(Math.sin(eps) * Math.sin(L)) * DEG;
  return { ra: (ra + 360) % 360, dec };
}

// Greenwich Mean Sidereal Time (hours). `d` is fractional days since J2000,
// which already encodes time-of-day; do NOT add hoursUT again — that was the
// original bug (double-counted time, producing wildly wrong sun altitudes).
function gmst(d) {
  return ((18.697374558 + 24.06570982441908 * d) % 24 + 24) % 24;
}

// Sun altitude and azimuth at given date + location
function sunAltAz(date, lat, lon) {
  const d = daysSinceJ2000(date);
  const { ra, dec } = sunRaDec(d);
  const sidereal = gmst(d) * 15;  // degrees
  let H = (sidereal + lon - ra);
  H = ((H + 180) % 360) - 180;  // -180..180
  const sinAlt = Math.sin(dec * RAD) * Math.sin(lat * RAD) +
                 Math.cos(dec * RAD) * Math.cos(lat * RAD) * Math.cos(H * RAD);
  const alt = Math.asin(sinAlt) * DEG;
  const cosAz = (Math.sin(dec * RAD) - Math.sin(alt * RAD) * Math.sin(lat * RAD)) /
                (Math.cos(alt * RAD) * Math.cos(lat * RAD));
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) * DEG;
  if (Math.sin(H * RAD) > 0) az = 360 - az;
  return { altitude: alt, azimuth: az };
}

// Solar noon UTC for a date + longitude
function solarNoonUTC(date, lon) {
  const d = daysSinceJ2000(date);
  const Jnoon = Math.floor(d) - lon / 360;
  const M = (357.5291 + 0.98560028 * Jnoon) % 360;
  const C = 1.9148 * Math.sin(M * RAD) + 0.0200 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
  const L = (M + C + 180 + 102.9372) % 360;
  const transitOffset = 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * L * RAD);
  return Jnoon + transitOffset;
}

// Time when sun is at given altitude (degrees, e.g. -0.833 for sunrise/sunset incl. atmosphere)
function timeAtAltitude(date, lat, lon, targetAlt, isRising) {
  const d = daysSinceJ2000(date);
  const { dec } = sunRaDec(d);
  const cosH = (Math.sin(targetAlt * RAD) - Math.sin(lat * RAD) * Math.sin(dec * RAD)) /
               (Math.cos(lat * RAD) * Math.cos(dec * RAD));
  if (cosH > 1) return null;   // sun never rises that high
  if (cosH < -1) return null;  // sun never sets below that
  const H = Math.acos(cosH) * DEG;
  const Jnoon = solarNoonUTC(date, lon);
  const hourFraction = (isRising ? -H : H) / 360;
  const jdResult = Jnoon + hourFraction;
  // Convert J2000 days back to date
  const ms = (jdResult + 2451545.0 - 2440587.5) * 86400000;
  return new Date(ms);
}

// Moon phase 0..1 (0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter)
function moonPhase(date) {
  const synodic = 29.530588853;
  const knownNew = new Date(Date.UTC(2000, 0, 6, 18, 14));  // Jan 6 2000 18:14 UTC
  const daysSince = (date - knownNew) / 86400000;
  const phase = ((daysSince % synodic) + synodic) % synodic / synodic;
  return phase;
}

function moonPhaseName(phase) {
  if (phase < 0.03 || phase > 0.97) return 'new moon';
  if (phase < 0.22) return 'waxing crescent';
  if (phase < 0.28) return 'first quarter';
  if (phase < 0.47) return 'waxing gibbous';
  if (phase < 0.53) return 'full moon';
  if (phase < 0.72) return 'waning gibbous';
  if (phase < 0.78) return 'last quarter';
  return 'waning crescent';
}

function moonIlluminationPct(phase) {
  // Approx: illumination follows cosine of phase angle
  return Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);
}

// ---------- Time-of-day descriptor ----------

// Pure astronomical descriptor based on sun altitude
function sunPhase(altitude) {
  if (altitude > 6) return 'day';
  if (altitude > -0.833) return 'sunrise-or-sunset (sun on horizon)';
  if (altitude > -6) return 'civil twilight';
  if (altitude > -12) return 'nautical twilight';
  if (altitude > -18) return 'astronomical twilight';
  return 'night';
}

// ---------- Main exported function ----------

function snapshot(date = new Date()) {
  const { lat, lon, label, tz } = getLocation();
  const sun = sunAltAz(date, lat, lon);
  const phase = moonPhase(date);
  const sunrise = timeAtAltitude(date, lat, lon, -0.833, true);
  const sunset = timeAtAltitude(date, lat, lon, -0.833, false);
  const civilDawn = timeAtAltitude(date, lat, lon, -6, true);
  const civilDusk = timeAtAltitude(date, lat, lon, -6, false);

  return {
    iso_utc: date.toISOString(),
    location: { lat, lon, label, tz },
    sun: {
      altitude_deg: Number(sun.altitude.toFixed(2)),
      azimuth_deg: Number(sun.azimuth.toFixed(2)),
      phase: sunPhase(sun.altitude),
      sunrise_iso: sunrise ? sunrise.toISOString() : null,
      sunset_iso: sunset ? sunset.toISOString() : null,
      civil_dawn_iso: civilDawn ? civilDawn.toISOString() : null,
      civil_dusk_iso: civilDusk ? civilDusk.toISOString() : null
    },
    moon: {
      phase_fraction: Number(phase.toFixed(3)),
      phase_name: moonPhaseName(phase),
      illumination_pct: moonIlluminationPct(phase)
    },
    day_of_week: date.toLocaleString('en-US', { weekday: 'long', timeZone: tz }),
    local_time: date.toLocaleString('en-US', { timeZone: tz })
  };
}

// Render a compact text block suitable for SessionStart context injection
function renderTextBlock(snap) {
  const lines = [];
  lines.push(`## Ambient context (${snap.location.label})`);
  lines.push(`- Now: ${snap.local_time} (${snap.day_of_week})`);
  lines.push(`- Sun: ${snap.sun.phase}; altitude ${snap.sun.altitude_deg}°, azimuth ${snap.sun.azimuth_deg}°`);
  if (snap.sun.sunrise_iso) {
    const sr = new Date(snap.sun.sunrise_iso).toLocaleTimeString('en-US', { timeZone: snap.location.tz, hour: '2-digit', minute: '2-digit' });
    const ss = new Date(snap.sun.sunset_iso).toLocaleTimeString('en-US', { timeZone: snap.location.tz, hour: '2-digit', minute: '2-digit' });
    lines.push(`- Sunrise ${sr}, sunset ${ss} (local)`);
  }
  lines.push(`- Moon: ${snap.moon.phase_name}, ${snap.moon.illumination_pct}% illuminated`);
  return lines.join('\n');
}

module.exports = { snapshot, renderTextBlock };
