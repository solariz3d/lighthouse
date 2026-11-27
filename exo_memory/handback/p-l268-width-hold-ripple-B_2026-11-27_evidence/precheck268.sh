#!/bin/sh
# precheck268.sh (pane B, L268): every candidate mutant for the hold's harness, one at a time, against the hold's rows on a temporary copy (h6check.js). Light: one
# row file a mutant, BelowNormal is set by the caller. usage: sh precheck268.sh <tree> <h6check.js>
T="$1"; H="$2"; EX=src/core/extend.js
c() { printf '%s => ' "$1"; node "$H" "$T" "$EX" "$2" "$3" 2>&1 | tail -1; }
c "H1 never held" 'const holdW = held && !given(targets.w) && from.w.m !== 0 ? from.w.v : undefined, holdR' 'const holdW = undefined, holdR'
c "H2 the blend over the whole piece" "channelFn(from.w, holdW, holdR, 'w')" "channelFn(from.w, holdW, Lof('w'), 'w')"
c "H3 the end not pinned" 'if (holdW !== undefined) { const w = laid.channels.w' 'if (false) { const w = laid.channels.w'
c "H4 the blend starts level" 'channelFn(from.w, holdW,' 'channelFn({ v: from.w.v, m: 0 }, holdW,'
c "H5 a typed width held" 'held && !given(targets.w) && from.w.m' 'held && from.w.m'
c "H6 the end pin kinks" 'z[n - 1] = holdW; z[n - 2] = holdW; laid' 'z[n - 1] = holdW; z[n - 2] = holdW; z[1] = holdW; laid'
c "N1 the hold fitted again" 'if (holdR !== undefined) rampControl(piece, ' 'if (false) rampControl(piece, '
c "N2 no knots for the hold's ramp" 'const knots = holdR === undefined ? knots0 :' 'const knots = true ? knots0 :'
c "N3 the bank piece's knots dropped (extend)" ', shortRamps.length ? undefined : knots0);' ');'
c "N4 the joint not held (rampControl held false)" "rampControl(piece, 'w', from.w, holdW, holdR, held, sub)" "rampControl(piece, 'w', from.w, holdW, holdR, false, sub)"
c "N5 the hold's ramp the whole piece" 'holdR = holdW === undefined ? undefined : startRampM(length, knotM)' 'holdR = holdW === undefined ? undefined : length'
c "N6 the bank piece's knots dropped (rampKnots)" '(base || D.evenKnots(length, knotM))' 'D.evenKnots(length, knotM)'
c "LEVEL a level head held too" '&& from.w.m !== 0 ? from.w.v : undefined, holdR' '? from.w.v : undefined, holdR'
