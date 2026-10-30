# Phase 12 — Calculator & Finance Tools

Status: implementation branch prepared; awaiting regression and deployment verification.

## Scope
Add three browser-local calculators without changing existing tool behavior:
- Percentage Calculator: percentage of a value, one value as a percentage of another, and percentage change.
- Compound Interest Calculator: single initial amount, annual nominal interest rate, term and selectable compounding frequency (yearly, half-yearly, quarterly, monthly or daily).
- EMI / Loan Calculator: fixed-rate reducing-balance monthly instalment, total repayment and total interest.

## Calculation assumptions
- Percentage change is (new − old) / |old| × 100; a zero starting value is undefined.
- Compound interest uses A = P(1 + r/n)^(nt), where r is the annual nominal rate as a decimal and n is the selected compounding frequency. No recurring deposits, fees, tax or withdrawals are included.
- EMI uses the standard fixed-rate monthly payment formula. A zero rate is handled as principal / number of months. Payments are assumed at the end of each month; fees, insurance, taxes, rate changes and lender-specific rounding are excluded.
- Currency display is BDT for the initial/loan amounts; the formulas themselves are currency-neutral.
- These are educational estimates, not personalized financial advice or lender quotations.

## Safety and implementation
- All calculation functions are deterministic and run locally in the browser.
- Inputs are validated for finite values, supported rates, periods and compounding frequencies; results that overflow are rejected.
- No new network API, backend, paid service or third-party package is introduced.
- Existing 26 tools, routes, universal Copy / Download / Clear controls, SEO renderer and theme system are preserved.

## Verification boundary
Automated tests exercise the actual pure calculation helpers, known-value examples, zero-interest behavior, invalid inputs, catalogue/router parity, tool markup/wiring, and SEO metadata. Browser interaction, mobile layout, clipboard/download and Day/Night rendering remain separate live QA tasks.
