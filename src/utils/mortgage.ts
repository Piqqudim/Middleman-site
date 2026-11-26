export type CurrencyCode = 'NGN' | 'USD';

export const NGN_PER_USD = 1600;

export interface MortgageInput {
  propertyPriceNgn: number;
  downPaymentPercent: number;
  annualInterestRate: number;
  loanTermYears: number;
  annualYieldPercent: number;
  annualMaintenancePercent: number;
}

export interface AmortizationMilestone {
  year: number;
  remainingBalanceNgn: number;
  principalPaidNgn: number;
  interestPaidNgn: number;
  equityPercent: number;
}

export interface MortgageSummary {
  propertyPriceNgn: number;
  downPaymentNgn: number;
  loanPrincipalNgn: number;
  ltvPercent: number;
  monthlyPrincipalAndInterestNgn: number;
  monthlyMaintenanceNgn: number;
  totalMonthlyOutlayNgn: number;
  totalInterestNgn: number;
  totalRepaymentNgn: number;
  estimatedMonthlyRentNgn: number;
  netMonthlyCashflowNgn: number;
  milestones: AmortizationMilestone[];
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function calculateMortgage(rawInput: MortgageInput): MortgageSummary {
  const propertyPriceNgn = Math.max(0, rawInput.propertyPriceNgn);
  const downPaymentPercent = clamp(rawInput.downPaymentPercent, 0, 95);
  const annualInterestRate = clamp(rawInput.annualInterestRate, 0, 45);
  const loanTermYears = clamp(Math.round(rawInput.loanTermYears), 1, 35);
  const annualYieldPercent = clamp(rawInput.annualYieldPercent, 0, 35);
  const annualMaintenancePercent = clamp(rawInput.annualMaintenancePercent, 0, 10);

  const downPaymentNgn = propertyPriceNgn * (downPaymentPercent / 100);
  const loanPrincipalNgn = Math.max(0, propertyPriceNgn - downPaymentNgn);
  const ltvPercent = propertyPriceNgn > 0 ? (loanPrincipalNgn / propertyPriceNgn) * 100 : 0;

  const totalMonths = loanTermYears * 12;
  const monthlyRate = annualInterestRate / 100 / 12;

  let monthlyPrincipalAndInterestNgn = 0;
  if (loanPrincipalNgn > 0) {
    if (monthlyRate === 0) {
      monthlyPrincipalAndInterestNgn = loanPrincipalNgn / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyPrincipalAndInterestNgn = (loanPrincipalNgn * (monthlyRate * factor)) / (factor - 1);
    }
  }

  const totalRepaymentNgn = monthlyPrincipalAndInterestNgn * totalMonths;
  const totalInterestNgn = Math.max(0, totalRepaymentNgn - loanPrincipalNgn);
  const monthlyMaintenanceNgn = (propertyPriceNgn * (annualMaintenancePercent / 100)) / 12;
  const totalMonthlyOutlayNgn = monthlyPrincipalAndInterestNgn + monthlyMaintenanceNgn;

  const estimatedMonthlyRentNgn = (propertyPriceNgn * (annualYieldPercent / 100)) / 12;
  const netMonthlyCashflowNgn = estimatedMonthlyRentNgn - totalMonthlyOutlayNgn;

  const targetYears = Array.from(new Set([1, Math.min(5, loanTermYears), loanTermYears])).sort(
    (a, b) => a - b
  );
  const milestones: AmortizationMilestone[] = [];

  let balance = loanPrincipalNgn;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const interestForMonth = balance * monthlyRate;
    const principalForMonth = Math.min(balance, Math.max(0, monthlyPrincipalAndInterestNgn - interestForMonth));
    balance = Math.max(0, balance - principalForMonth);
    cumulativePrincipal += principalForMonth;
    cumulativeInterest += interestForMonth;

    if (month % 12 === 0) {
      const year = month / 12;
      if (targetYears.includes(year)) {
        const equityPercent =
          propertyPriceNgn > 0 ? ((propertyPriceNgn - balance) / propertyPriceNgn) * 100 : 100;
        milestones.push({
          year,
          remainingBalanceNgn: Math.round(balance),
          principalPaidNgn: Math.round(cumulativePrincipal),
          interestPaidNgn: Math.round(cumulativeInterest),
          equityPercent: Number(equityPercent.toFixed(1)),
        });
      }
    }
  }

  return {
    propertyPriceNgn: Math.round(propertyPriceNgn),
    downPaymentNgn: Math.round(downPaymentNgn),
    loanPrincipalNgn: Math.round(loanPrincipalNgn),
    ltvPercent: Number(ltvPercent.toFixed(1)),
    monthlyPrincipalAndInterestNgn: Math.round(monthlyPrincipalAndInterestNgn),
    monthlyMaintenanceNgn: Math.round(monthlyMaintenanceNgn),
    totalMonthlyOutlayNgn: Math.round(totalMonthlyOutlayNgn),
    totalInterestNgn: Math.round(totalInterestNgn),
    totalRepaymentNgn: Math.round(totalRepaymentNgn),
    estimatedMonthlyRentNgn: Math.round(estimatedMonthlyRentNgn),
    netMonthlyCashflowNgn: Math.round(netMonthlyCashflowNgn),
    milestones,
  };
}

export function formatMoney(amountNgn: number, currency: CurrencyCode, compact = false): string {
  const value = currency === 'USD' ? amountNgn / NGN_PER_USD : amountNgn;
  const symbol = currency === 'USD' ? '$' : '₦';

  if (compact) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 1_000_000_000) {
      return `${sign}${symbol}${(abs / 1_000_000_000).toFixed(2)}B`;
    }
    if (abs >= 1_000_000) {
      return `${sign}${symbol}${(abs / 1_000_000).toFixed(1)}M`;
    }
    if (abs >= 1_000) {
      return `${sign}${symbol}${(abs / 1_000).toFixed(0)}K`;
    }
  }

  return `${value < 0 ? '-' : ''}${symbol}${Math.round(Math.abs(value)).toLocaleString('en-US')}`;
}
