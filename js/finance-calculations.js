/* ToolNest Phase 12 — browser-local finance calculation helpers. */
(() => {
  "use strict";

  const finiteNumber = (value, label) => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError(label + " must be a finite number.");
    }
    return value;
  };

  function calculatePercentage(mode, first, second) {
    finiteNumber(first, "First value");
    finiteNumber(second, "Second value");
    let result;
    if (mode === "of") result = (first / 100) * second;
    else if (mode === "is") {
      if (second === 0) throw new RangeError("The second value cannot be zero for this calculation.");
      result = (first / second) * 100;
    } else if (mode === "change") {
      if (first === 0) throw new RangeError("Percentage change is undefined when the starting value is zero.");
      result = ((second - first) / Math.abs(first)) * 100;
    } else throw new RangeError("Choose a valid percentage calculation.");
    if (!Number.isFinite(result)) throw new RangeError("The result is too large to calculate safely.");
    return result;
  }

  function calculateCompoundInterest(principal, annualRatePercent, years, frequency) {
    finiteNumber(principal, "Initial amount");
    finiteNumber(annualRatePercent, "Annual interest rate");
    finiteNumber(years, "Time period");
    finiteNumber(frequency, "Compounding frequency");
    if (principal <= 0 || principal > 1e15) throw new RangeError("Initial amount must be greater than zero and no more than 1,000,000,000,000,000.");
    if (annualRatePercent < 0 || annualRatePercent > 1000) throw new RangeError("Annual interest rate must be between 0% and 1000%.");
    if (years <= 0 || years > 100) throw new RangeError("Time period must be greater than zero and no more than 100 years.");
    if (![1, 2, 4, 12, 365].includes(frequency)) throw new RangeError("Choose a supported compounding frequency.");
    const periods = frequency * years;
    const ratePerPeriod = annualRatePercent / 100 / frequency;
    const amount = principal * Math.pow(1 + ratePerPeriod, periods);
    if (!Number.isFinite(amount)) throw new RangeError("The result is too large to calculate safely.");
    return { amount, interest: amount - principal, periods };
  }

  function calculateLoanEmi(principal, annualRatePercent, months) {
    finiteNumber(principal, "Loan amount");
    finiteNumber(annualRatePercent, "Annual interest rate");
    finiteNumber(months, "Loan term");
    if (principal <= 0 || principal > 1e15) throw new RangeError("Loan amount must be greater than zero and no more than 1,000,000,000,000,000.");
    if (annualRatePercent < 0 || annualRatePercent > 1000) throw new RangeError("Annual interest rate must be between 0% and 1000%.");
    if (!Number.isInteger(months) || months < 1 || months > 600) throw new RangeError("Loan term must be a whole number of months from 1 to 600.");
    const monthlyRate = annualRatePercent / 1200;
    const monthlyPayment = monthlyRate === 0
      ? principal / months
      : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
    const totalPayment = monthlyPayment * months;
    if (![monthlyPayment, totalPayment].every(Number.isFinite)) throw new RangeError("The result is too large to calculate safely.");
    return { monthlyPayment, totalPayment, totalInterest: totalPayment - principal };
  }

  window.ToolNestFinance = Object.freeze({
    calculatePercentage,
    calculateCompoundInterest,
    calculateLoanEmi
  });
})();
