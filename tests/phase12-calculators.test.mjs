import test from "node:test";
import assert from "node:assert/strict";
import "../js/finance-calculators.js";

const finance = globalThis.ToolNestFinance;

test("percentage calculator covers percent-of, what-percent and percentage change", () => {
  assert.equal(finance.calculatePercentage("of", 15, 200).result, 30);
  assert.equal(finance.calculatePercentage("what", 45, 300).result, 15);
  assert.equal(finance.calculatePercentage("change", 100, 120).result, 20);
  assert.equal(finance.calculatePercentage("change", 100, 80).result, -20);
  assert.equal(finance.calculatePercentage("change", 100, 100).result, 0);
});

test("percentage calculator rejects zero denominators, invalid modes and extreme values", () => {
  assert.throws(() => finance.calculatePercentage("what", 10, 0), /cannot be zero/);
  assert.throws(() => finance.calculatePercentage("change", 0, 10), /original value cannot be zero/);
  assert.throws(() => finance.calculatePercentage("unknown", 1, 2), /valid percentage/);
  assert.throws(() => finance.calculatePercentage("of", 1e13, 2), /supported range/);
  assert.throws(() => finance.calculatePercentage("of", Infinity, 2), /valid number/);
  assert.throws(() => finance.calculatePercentage("of", 1e12, 1e12), /result is outside/);
});

test("compound interest matches annual, monthly and zero-rate examples", () => {
  const annual = finance.calculateCompoundInterest(1000, 10, 2, 1);
  assert.ok(Math.abs(annual.amount - 1210) < 1e-9);
  assert.ok(Math.abs(annual.interest - 210) < 1e-9);
  const monthly = finance.calculateCompoundInterest(1000, 10, 2, 12);
  assert.ok(Math.abs(monthly.amount - 1220.390961) < 0.00001);
  assert.equal(finance.calculateCompoundInterest(500, 0, 5, 12).amount, 500);
});

test("compound interest validates principal, rate, time and compounding frequency", () => {
  assert.throws(() => finance.calculateCompoundInterest(0, 5, 2, 12), /Principal must be greater/);
  assert.throws(() => finance.calculateCompoundInterest(100, -1, 2, 12), /between 0% and 1000%/);
  assert.throws(() => finance.calculateCompoundInterest(100, 5, 0, 12), /Time must be greater/);
  assert.throws(() => finance.calculateCompoundInterest(100, 5, 2, 3), /frequency/);
  assert.throws(() => finance.calculateCompoundInterest(1e12, 1000, 100, 365), /too large/);
});

test("EMI matches a standard loan example and zero-interest calculation", () => {
  const result = finance.calculateEmi(120000, 12, 12);
  assert.ok(Math.abs(result.monthlyPayment - 10661.8542) < 0.001);
  assert.ok(Math.abs(result.totalPayment - result.monthlyPayment * 12) < 0.000001);
  assert.ok(result.totalInterest > 0);
  assert.equal(finance.calculateEmi(120000, 0, 12).monthlyPayment, 10000);
  assert.equal(finance.calculateEmi(120000, 0, 12).totalInterest, 0);
});

test("EMI validates loan amount, interest rate and tenure boundaries", () => {
  assert.throws(() => finance.calculateEmi(0, 12, 12), /Loan amount must be greater/);
  assert.throws(() => finance.calculateEmi(1000, -2, 12), /between 0% and 1000%/);
  assert.throws(() => finance.calculateEmi(1000, 10, 0), /1 to 600 months/);
  assert.throws(() => finance.calculateEmi(1000, 10, 12.5), /whole number/);
  assert.throws(() => finance.calculateEmi(1000, 10, 601), /1 to 600 months/);
});
