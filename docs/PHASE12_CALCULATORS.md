# Phase 12 — Calculator & Finance Tools

Phase 12 adds three local calculators to ToolNest. No backend, paid API, account, or live market data is needed for these calculations.

## Percentage Calculator

- **Percent of:** result = percentage × value ÷ 100
- **Part as a percentage of a whole:** result = part ÷ whole × 100
- **Percentage change:** result = (new value − original value) ÷ |original value| × 100
- A zero whole or zero original value is rejected because the ratio would be undefined.

## Compound Interest Calculator

\[
A=P\left(1+\frac{r}{n}\right)^{nt}
\]

- (P): initial principal
- (r): nominal annual interest rate as a decimal
- (n): compounding periods per year (1, 2, 4, 12 or 365)
- (t): time in years
- Interest earned = (A-P)

Assumes a fixed annual rate and no deposits, withdrawals, taxes or fees. Principal must be positive, rate is limited to 0–1000%, and time is greater than 0 up to 100 years.

## EMI / Loan Calculator

\[
EMI=P\cdot\frac{i(1+i)^N}{(1+i)^N-1}
\]

- (P): loan principal
- (i): monthly interest rate = annual percentage rate ÷ 1200
- (N): number of monthly instalments

For a zero-interest loan, EMI = principal ÷ number of months. Tenure is limited to 1–600 whole months. The estimate excludes fees, insurance, taxes, variable rates and lender-specific rounding.

## Display currency

The currency selector formats the displayed values as BDT, USD, EUR, GBP, INR, SAR or AED. It does not convert between currencies and does not retrieve exchange rates.

## Verification

- Regression suite: 40 tests passed, 0 failed.
- Tests include standard examples, zero-rate calculations, invalid denominators, unsupported frequencies, tenure boundaries and overflow guards.
- GitHub Pages deployment completed successfully after PR #31.
- Actual browser interaction QA remains a separate task; automated tests do not replace testing on mobile and desktop.

All outputs are estimates for educational and planning use, not financial, investment, tax or lending advice.
