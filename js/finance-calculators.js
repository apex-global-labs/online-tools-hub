(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ToolNestFinance = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MAX_AMOUNT = 1e12;
  const MAX_RATE = 1000;

  function finiteNumber(value, label) {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new RangeError(label + " must be a valid number.");
    return number;
  }

  function boundedAmount(value, label) {
    const number = finiteNumber(value, label);
    if (Math.abs(number) > MAX_AMOUNT) throw new RangeError(label + " is outside the supported range.");
    return number;
  }

  function boundedResult(value) {
    if (!Number.isFinite(value) || Math.abs(value) > MAX_AMOUNT) throw new RangeError("The result is outside the supported range.");
    return value;
  }

  function boundedRate(value) {
    const rate = finiteNumber(value, "Percentage");
    if (rate < 0 || rate > MAX_RATE) throw new RangeError("Annual interest rate must be between 0% and 1000%.");
    return rate;
  }

  function calculatePercentage(mode, first, second) {
    const a = boundedAmount(first, "First value");
    const b = boundedAmount(second, "Second value");
    if (mode === "of") {
      const result = (a / 100) * b;
      boundedResult(result);
      return { mode, percentage: a, base: b, result };
    }
    if (mode === "what") {
      if (b === 0) throw new RangeError("The whole value cannot be zero.");
      const result = (a / b) * 100;
      boundedResult(result);
      return { mode, part: a, whole: b, result };
    }
    if (mode === "change") {
      if (a === 0) throw new RangeError("The original value cannot be zero when calculating percentage change.");
      const difference = b - a;
      const result = (difference / Math.abs(a)) * 100;
      boundedResult(result);
      return { mode, original: a, current: b, difference, result };
    }
    throw new RangeError("Choose a valid percentage calculation.");
  }

  function calculateCompoundInterest(principalValue, annualRateValue, yearsValue, frequencyValue) {
    const principal = finiteNumber(principalValue, "Principal");
    const annualRate = boundedRate(annualRateValue);
    const years = finiteNumber(yearsValue, "Time");
    const frequency = Number(frequencyValue);
    if (!(principal > 0) || principal > MAX_AMOUNT) throw new RangeError("Principal must be greater than zero and no more than 1 trillion.");
    if (!(years > 0) || years > 100) throw new RangeError("Time must be greater than zero and no more than 100 years.");
    if (![1, 2, 4, 12, 365].includes(frequency)) throw new RangeError("Choose a supported compounding frequency.");
    const periodicRate = annualRate / 100 / frequency;
    const periods = frequency * years;
    const amount = principal * Math.pow(1 + periodicRate, periods);
    const interest = amount - principal;
    if (!Number.isFinite(amount) || !Number.isFinite(interest)) throw new RangeError("The result is too large to calculate safely.");
    return { principal, annualRate, years, frequency, amount, interest };
  }

  function calculateEmi(principalValue, annualRateValue, monthsValue) {
    const principal = finiteNumber(principalValue, "Loan amount");
    const annualRate = boundedRate(annualRateValue);
    const months = Number(monthsValue);
    if (!(principal > 0) || principal > MAX_AMOUNT) throw new RangeError("Loan amount must be greater than zero and no more than 1 trillion.");
    if (!Number.isInteger(months) || months < 1 || months > 600) throw new RangeError("Loan tenure must be a whole number from 1 to 600 months.");
    const monthlyRate = annualRate / 1200;
    const factor = Math.pow(1 + monthlyRate, months);
    const monthlyPayment = monthlyRate === 0
      ? principal / months
      : principal * monthlyRate * factor / (factor - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;
    if (![monthlyPayment, totalPayment, totalInterest].every(Number.isFinite)) {
      throw new RangeError("The result is too large to calculate safely.");
    }
    return { principal, annualRate, months, monthlyPayment, totalPayment, totalInterest };
  }

  return Object.freeze({ calculatePercentage, calculateCompoundInterest, calculateEmi });
});
