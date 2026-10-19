**A. Before (v0.4.7, c2d7cb5) and after (d404-a), per look. Script ms of the work frames: median / p95 / p99 (mean of 3 quiet runs); share of frames over 6.0 ms is not stored per bar, so over 6.9 and over 4.2 are given**
| case | before | after | before >6.9 / >4.2 | after >6.9 / >4.2 |
|---|---|---|---|---|
| aqua turn 1000 m | 19.3 / 26.1 / 30.8 | 2.5 / 3.6 / 4.8 | 96% / 96% | 1% / 3% |
| skyline turn 1000 m | 19.1 / 25.9 / 31.7 | 2.5 / 3.7 / 5.2 | 95% / 95% | 1% / 2% |
| glass turn 1000 m | 19.1 / 26.0 / 31.1 | 2.5 / 3.7 / 6.0 | 96% / 96% | 1% / 2% |
| aurora turn 1000 m | 19.0 / 26.1 / 29.7 | 2.5 / 4.1 / 4.8 | 96% / 96% | 1% / 5% |
| sigil turn 1000 m | 18.9 / 25.0 / 28.7 | 2.5 / 3.8 / 5.3 | 96% / 96% | 0% / 2% |
| aqua turn 2000 m | 38.3 / 48.2 / 52.3 | 2.8 / 3.9 / 6.8 | 96% / 97% | 2% / 3% |
| skyline turn 2000 m | 38.4 / 48.4 / 52.7 | 2.8 / 3.8 / 5.6 | 97% / 97% | 1% / 3% |
| glass turn 2000 m | 38.4 / 47.5 / 55.3 | 2.8 / 3.9 / 6.0 | 95% / 96% | 1% / 4% |
| aurora turn 2000 m | 38.5 / 49.9 / 52.4 | 2.9 / 4.3 / 7.1 | 93% / 94% | 2% / 7% |
| sigil turn 2000 m | 38.7 / 46.9 / 52.4 | 2.7 / 3.9 / 7.1 | 95% / 95% | 1% / 4% |
| aqua stretch 1000 m | 8.9 / 11.9 / 15.1 | 2.5 / 3.8 / 5.2 | 97% / 98% | 0% / 4% |
| skyline stretch 1000 m | 8.8 / 12.0 / 18.3 | 2.5 / 3.7 / 4.5 | 97% / 97% | 0% / 2% |
| glass stretch 1000 m | 8.7 / 11.7 / 17.4 | 2.5 / 3.9 / 5.1 | 96% / 97% | 0% / 4% |
| aurora stretch 1000 m | 9.4 / 12.2 / 16.4 | 2.4 / 4.1 / 5.8 | 98% / 98% | 1% / 5% |
| sigil stretch 1000 m | 8.7 / 11.8 / 19.9 | 2.5 / 3.9 / 5.0 | 97% / 98% | 0% / 3% |
| aqua stretch 2000 m | 18.4 / 25.1 / 31.4 | 3.0 / 4.5 / 5.4 | 98% / 98% | 0% / 10% |
| skyline stretch 2000 m | 18.5 / 24.7 / 29.1 | 3.1 / 4.6 / 5.6 | 97% / 97% | 1% / 13% |
| glass stretch 2000 m | 18.4 / 24.7 / 29.3 | 3.0 / 4.3 / 5.2 | 96% / 96% | 1% / 8% |
| aurora stretch 2000 m | 18.7 / 25.2 / 28.5 | 3.0 / 4.8 / 6.7 | 97% / 97% | 1% / 19% |
| sigil stretch 2000 m | 18.6 / 24.4 / 29.4 | 3.0 / 4.4 / 5.4 | 97% / 97% | 0% / 10% |

**B. D399 textures: v0.4.7 + D404 fix against fc8c445 + D404 fix (turn handle), median / p95 / p99, and the difference**
| case | v0.4.7+fix | fc8c445+fix | difference median / p95 | runs |
|---|---|---|---|---|
| aqua turn 1000 m | 2.5 / 3.6 / 4.8 | 2.5 / 3.7 / 4.9 | 0.03 / 0.10 | 3+3 |
| skyline turn 1000 m | 2.5 / 3.7 / 5.2 | 2.5 / 3.8 / 5.2 | 0.00 / 0.10 | 3+3 |
| glass turn 1000 m | 2.5 / 3.7 / 6.0 | 2.5 / 3.7 / 5.3 | -0.07 / -0.00 | 3+3 |
| aurora turn 1000 m | 2.5 / 4.1 / 4.8 | 2.5 / 3.7 / 4.4 | 0.00 / -0.37 | 3+3 |
| sigil turn 1000 m | 2.5 / 3.8 / 5.3 | 2.5 / 3.6 / 4.6 | 0.03 / -0.20 | 3+3 |
| aqua turn 2000 m | 2.8 / 3.9 / 6.8 | 2.8 / 3.8 / 4.7 | 0.00 / -0.13 | 3+3 |
| skyline turn 2000 m | 2.8 / 3.8 / 5.6 | 2.8 / 3.9 / 5.5 | 0.00 / 0.10 | 3+3 |
| glass turn 2000 m | 2.8 / 3.9 / 6.0 | 2.8 / 3.9 / 5.5 | 0.00 / 0.00 | 3+3 |
| aurora turn 2000 m | 2.9 / 4.3 / 7.1 | 2.9 / 4.4 / 5.9 | -0.03 / 0.10 | 3+3 |
| sigil turn 2000 m | 2.7 / 3.9 / 7.1 | 2.7 / 3.8 / 4.4 | 0.00 / -0.07 | 3+3 |

run-to-run sd of p95 across the 10 cases of the fixed tree: mean 0.10 ms, max 0.21 ms

**C. Ladder (aqua), median / p95 / p99, >6.9, >4.2**
| case | v0.4.7 | d404-a |
|---|---|---|
| turn 100 m | 2.4 / 3.9 / 5.6; 1% / 4% | 2.5 / 3.4 / 6.1; 1% / 3% |
| turn 500 m | 8.7 / 11 / 14.8; 82% / 84% | 2.4 / 3.6 / 4.5; 1% / 3% |
| turn 1000 m | 18.8 / 25.4 / 30.7; 93% / 94% | 2.5 / 3.5 / 4.3; 1% / 2% |
| turn 2000 m | 38.4 / 46.1 / 47.9; 95% / 95% | 2.8 / 4 / 5.5; 1% / 4% |
| turn 5000 m | 101.9 / 120.6 / 130.8; 89% / 92% | 3.6 / 5 / 7; 2% / 12% |
| turn 10000 m | 237.4 / 289.9 / 336.8; 94% / 94% | 4.7 / 6.2 / 8.4; 2% / 84% |
| turn 20000 m | 558.5 / 655.7 / 661.4; 100% / 100% | 6.2 / 8 / 18.1; 21% / 95% |
| stretch 100 m | 1.6 / 2.6 / 3.9; 0% / 0% | 2.1 / 3.4 / 4; 0% / 1% |
| stretch 500 m | 5 / 6.2 / 8.5; 3% / 86% | 2.3 / 3.4 / 3.9; 0% / 1% |
| stretch 1000 m | 8.9 / 12.2 / 19.1; 99% / 99% | 2.5 / 3.8 / 5.5; 0% / 4% |
| stretch 2000 m | 18.3 / 24.7 / 31.6; 98% / 98% | 3 / 4.4 / 5.3; 0% / 9% |
| stretch 5000 m | 50.5 / 62.2 / 72.2; 93% / 93% | 1.9 / 6.9 / 8; 5% / 23% |
| stretch 10000 m | 51.2 / 64.4 / 67.5; 99% / 99% | 1.6 / 2.1 / 2.8; 0% / 0% |
| stretch 20000 m | 49.9 / 65.7 / 81.7; 97% / 97% | 1.7 / 2.3 / 4.3; 1% / 1% |

**D. Blur and animation off (d404-a), turn: median / p95 against the blur-on mean**
| case | blur on | blur off |
|---|---|---|
| aqua turn 1000 m | 2.5 / 3.6 / 4.8 | 2.4 / 3.7 / 4.6 |
| skyline turn 1000 m | 2.5 / 3.7 / 5.2 | 2.4 / 3.6 / 5.0 |
| glass turn 1000 m | 2.5 / 3.7 / 6.0 | 2.4 / 3.6 / 5.6 |
| aurora turn 1000 m | 2.5 / 4.1 / 4.8 | 2.5 / 3.8 / 4.5 |
| sigil turn 1000 m | 2.5 / 3.8 / 5.3 | 2.4 / 3.5 / 4.8 |
| aqua turn 2000 m | 2.8 / 3.9 / 6.8 | 2.7 / 3.5 / 4.7 |
| skyline turn 2000 m | 2.8 / 3.8 / 5.6 | 2.6 / 3.7 / 5.4 |
| glass turn 2000 m | 2.8 / 3.9 / 6.0 | 2.7 / 3.9 / 7.0 |
| aurora turn 2000 m | 2.9 / 4.3 / 7.1 | 2.7 / 3.7 / 4.9 |
| sigil turn 2000 m | 2.7 / 3.9 / 7.1 | 2.6 / 3.9 / 4.5 |

**E. Traces (Aurora, 60 Hz limit, 5 s): per frame cost off the main thread, blur on / off**
| tree, length | frames | main script ms | compositor DrawAndSwap ms/frame | GPU flush ms/frame | raster ms |
|---|---|---|---|---|---|
| d399fix-aurora-turn-2000-blur | 528 | 894 | 0.434 | 1.165 | 50.3 |
| d399fix-aurora-turn-2000-noblur | 526 | 843 | 0.157 | 0.714 | 28.0 |
| d404-aurora-turn-1000-blur | 525 | 836 | 0.393 | 1.113 | 44.4 |
| d404-aurora-turn-1000-noblur | 524 | 801 | 0.162 | 0.710 | 26.4 |
| d404-aurora-turn-2000-blur | 528 | 882 | 0.411 | 1.114 | 45.4 |
| d404-aurora-turn-2000-noblur | 528 | 855 | 0.160 | 0.717 | 27.3 |
| v047-aurora-turn-1000-blur | 315 | 3916 | 0.422 | 1.257 | 35.5 |
| v047-aurora-turn-1000-noblur | 316 | 3916 | 0.154 | 0.860 | 23.3 |

**Quiet statistics:** 212 cases, 239 windows timed, 27 rejected (re-run), 0 case(s) with no quiet window. Accepted windows: foreign non-host CPU median 1.75 s, p95 2.73 s, max 3 s (each about 12 to 20 s long); host-service CPU median 7.44 s. Every accepted window had both heavy-run slots held by this session's two live pids at its start and end (checked for all).
