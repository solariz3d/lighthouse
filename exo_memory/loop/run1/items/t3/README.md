# limiter

calc.js implements the request limiter. test_calc.js locks the boundary
behavior: if the <= in allow() is changed to <, the suite goes red.

Run: node test_calc.js
