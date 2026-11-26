import assert from 'node:assert/strict';
import test from 'node:test';
import { PROPERTIES } from '../data/properties';
import {
  canAdvanceStage,
  getNextApplicationStage,
  getStageIndex,
  isTerminalStatus,
} from './applications';
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  describeFilterSummary,
  filterProperties,
} from './filters';
import { calculateMortgage, formatMoney } from './mortgage';

test('calculateMortgage computes standard principal, interest, LTV, and milestones accurately', () => {
  const result = calculateMortgage({
    propertyPriceNgn: 120_000_000,
    downPaymentPercent: 25,
    annualInterestRate: 12,
    loanTermYears: 15,
    annualYieldPercent: 11.4,
    annualMaintenancePercent: 1.5,
  });

  assert.equal(result.downPaymentNgn, 30_000_000);
  assert.equal(result.loanPrincipalNgn, 90_000_000);
  assert.equal(result.ltvPercent, 75);
  // 90M at 12% p.a. over 180 months -> ~1,080,151 NGN/mo
  assert.ok(result.monthlyPrincipalAndInterestNgn > 1_075_000);
  assert.ok(result.monthlyPrincipalAndInterestNgn < 1_085_000);
  assert.equal(result.milestones.length, 3);
  assert.equal(result.milestones[0].year, 1);
  assert.equal(result.milestones[1].year, 5);
  assert.equal(result.milestones[2].year, 15);
  assert.equal(result.milestones[2].remainingBalanceNgn, 0);
  assert.equal(result.milestones[2].equityPercent, 100);
});

test('calculateMortgage handles zero interest rate without NaN', () => {
  const result = calculateMortgage({
    propertyPriceNgn: 60_000_000,
    downPaymentPercent: 50,
    annualInterestRate: 0,
    loanTermYears: 10,
    annualYieldPercent: 10,
    annualMaintenancePercent: 0,
  });

  assert.equal(result.loanPrincipalNgn, 30_000_000);
  assert.equal(result.monthlyPrincipalAndInterestNgn, 250_000);
  assert.equal(result.totalInterestNgn, 0);
});

test('formatMoney formats NGN and USD compact and full figures cleanly', () => {
  assert.equal(formatMoney(120_000_000, 'NGN', true), '₦120.0M');
  assert.equal(formatMoney(160_000_000, 'USD', true), '$100K');
  assert.equal(formatMoney(1_500_000, 'NGN', false), '₦1,500,000');
});

test('filterProperties filters by location, category, bedrooms, price, and amenities', () => {
  const all = filterProperties(PROPERTIES, DEFAULT_FILTERS);
  assert.equal(all.length, PROPERTIES.length);
  assert.equal(all[0].id, 'prop-dorvane-residences');

  const beninVillas = filterProperties(PROPERTIES, {
    ...DEFAULT_FILTERS,
    query: 'Benin',
    minBeds: 4,
    maxPriceNgn: 130_000_000,
  });
  assert.equal(beninVillas.length, 2);

  const poolListings = filterProperties(PROPERTIES, {
    ...DEFAULT_FILTERS,
    amenities: ['Infinity Pool'],
    sortBy: 'price-desc',
  });
  assert.equal(poolListings.length, 2);
  assert.equal(poolListings[0].id, 'prop-emmg-ikoyi-terrace');
});

test('countActiveFilters and describeFilterSummary reflect active constraints', () => {
  assert.equal(countActiveFilters(DEFAULT_FILTERS), 0);
  assert.equal(describeFilterSummary(DEFAULT_FILTERS), 'All Benin, Lagos & Abuja Listings');

  const custom = {
    ...DEFAULT_FILTERS,
    query: 'GRA',
    minBeds: 3,
    amenities: ['Smart Home'],
  };
  assert.equal(countActiveFilters(custom), 3);
  assert.match(describeFilterSummary(custom), /"GRA"/);
  assert.match(describeFilterSummary(custom), /3\+ Beds/);
});

test('application stage transitions obey non-terminal progression and terminal locks', () => {
  assert.equal(getStageIndex('Submitted'), 0);
  assert.equal(canAdvanceStage('Submitted'), true);
  assert.equal(getNextApplicationStage('Submitted'), 'Document Verification');
  assert.equal(getNextApplicationStage('Underwriting & Legal'), 'Approved & Closing');
  assert.equal(canAdvanceStage('Approved & Closing'), false);
  assert.equal(getNextApplicationStage('Approved & Closing'), null);
  assert.equal(isTerminalStatus('Approved & Closing'), true);
  assert.equal(isTerminalStatus('Withdrawn'), true);
  assert.equal(isTerminalStatus('Inspection Scheduled'), false);
});
