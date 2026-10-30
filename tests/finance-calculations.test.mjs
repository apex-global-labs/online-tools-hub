import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../js/finance-calculations.js", import.meta.url), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const finance = sandbox.window.ToolNestFinance;

const closeTo = (actual, expected, tolerance = 0.01) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${actual} to be within ${tolerance} of ${expected}`);
};

test("percentage calculator handles all three modes", () => {
  assert.equal(finance.calculatePercentage("of", 20, 250), 50);
  assert.equal(finance.calculatePercentage("is", 50, 250), 20);
  assert.equal(finance.calculatePercentage("change", 80, 100), 25);
  assert.equal(finance.calculatePercentage("change", 100, 80), -20);
});

test("percentage calculator rejects undefined and invalid results", () => {
  assert.throws(() => finance.calculatePercentage("is", 10, 0), /cannot be zero/);
  assert.throws(() => finance.calculatePercentage("change", 0, 10), /starting value is zero/);
  assert.throws(() => finance.calculatePercentage("unknown", 1, 2), /valid percentage/);
  assert.throws(() => finance.calculatePercentage("of", Number.MAX_VALUE, Number.MAX_VALUE), /too large/);
  assert.throws(() => finance.calculatePercentage("of", NaN, 2), /finite number/);
});

test("compound interest matches a known monthly-compounding example", () => {
  const result = finance.calculateCompoundInterest(10000, 12, 2, 12);
  closeTo(result.amount, 12697.35);
  closeTo(result.interest, 2697.35);
  assert.equal(result.periods, 24);
});

test("compound interest handles zero rate and validates bounds", () => {
  const zero = finance.calculateCompoundInterest(10000, 0, 3, 4);
  assert.equal(zero.amount, 10000);
  assert.equal(zero.interest, 0);
  assert.throws(() => finance.calculateCompoundInterest(0, 5, 2, 12), /greater than zero/);
  assert.throws(() => finance.calculateCompoundInterest(100, -1, 2, 12), /between 0%/);
  assert.throws(() => finance.calculateCompoundInterest(100, 5, 2, 3), /supported compounding/);
  assert.throws(() => finance.calculateCompoundInterest(1e15, 1000, 100, 365), /too large/);
});

test("EMI calculator matches a known fixed-rate loan example", () => {
  const result = finance.calculateLoanEmi(100000, 12, 12);
  closeTo(result.monthlyPayment, 8884.87);
  closeTo(result.totalPayment, 106618.54);
  closeTo(result.totalInterest, 6618.54);
});

test("EMI calculator handles zero interest and rejects invalid terms", () => {
  const zero = finance.calculateLoanEmi(120000, 0, 12);
  assert.equal(zero.monthlyPayment, 10000);
  assert.equal(zero.totalPayment, 120000);
  assert.equal(zero.totalInterest, 0);
  assert.throws(() => finance.calculateLoanEmi(0, 5, 12), /greater than zero/);
  assert.throws(() => finance.calculateLoanEmi(1000, -1, 12), /between 0%/);
  assert.throws(() => finance.calculateLoanEmi(1000, 5, 0), /whole number of months/);
  assert.throws(() => finance.calculateLoanEmi(1000, 5, 601), /whole number of months/);
});
