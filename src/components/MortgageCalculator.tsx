import React from 'react';
import { ArrowRight, Calculator } from 'lucide-react';
import type { PropertyListing } from '../data/properties';
import {
  calculateMortgage,
  type CurrencyCode,
  formatMoney,
  type MortgageInput,
} from '../utils/mortgage';

interface MortgageCalculatorProps {
  properties: PropertyListing[];
  selectedProperty: PropertyListing;
  onSelectProperty: (property: PropertyListing) => void;
  input: MortgageInput;
  onChangeInput: (next: MortgageInput) => void;
  currency: CurrencyCode;
  onCurrencyChange: (next: CurrencyCode) => void;
  onApplyWithTerms: (summary: {
    property: PropertyListing;
    downPaymentPercent: number;
    estimatedMonthlyNgn: number;
  }) => void;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  input,
  onChangeInput,
  currency,
  onCurrencyChange,
  onApplyWithTerms,
}) => {
  const summary = calculateMortgage(input);
  const principalRatio =
    summary.totalRepaymentNgn > 0
      ? Math.round((summary.loanPrincipalNgn / summary.totalRepaymentNgn) * 100)
      : 100;

  return (
    <section
      id="mortgage"
      aria-labelledby="mortgage-heading"
      className="bg-[#f4f1ec] dark:bg-[#141210] text-[#141210] dark:text-[#f4f1ec] py-16 md:py-24 border-b border-[#141210]/10 dark:border-white/10 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#141210]/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] tracking-[0.22em] uppercase text-[#7b674d] dark:text-[#c8a97e] font-medium">
                MORTGAGE &amp; YIELD PLANNER
              </span>
              <span className="w-16 h-px bg-[#141210]/20 dark:bg-white/20" aria-hidden="true" />
            </div>
            <h2
              id="mortgage-heading"
              className="font-serif text-3xl sm:text-4xl font-normal [text-wrap:balance]"
            >
              Structure Your Financing &amp; Cashflow
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-[#6b645c] dark:text-[#a69e94]">
              <span className="sr-only">Currency</span>
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="px-3 py-2 bg-white dark:bg-[#171513] border border-[#141210]/15 dark:border-white/15 text-xs font-medium text-[#141210] dark:text-[#f4f1ec]"
              >
                <option value="NGN">₦ NGN (Naira)</option>
                <option value="USD">$ USD (Dollar)</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 p-6 md:p-8 bg-white dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10 space-y-6">
            <label className="block text-xs">
              <span className="font-medium text-[#575149] dark:text-[#b5ada2]">
                Reference Property (Optional)
              </span>
              <select
                value={selectedProperty.id}
                onChange={(e) => {
                  const found = properties.find((p) => p.id === e.target.value);
                  if (found) onSelectProperty(found);
                }}
                className="mt-2 w-full px-3.5 py-2.5 text-sm bg-[#faf8f4] dark:bg-[#11100e] border border-[#141210]/15 dark:border-white/15"
              >
                {properties.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} — {formatMoney(item.priceNgn, currency, true)}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <label htmlFor="calc-price" className="font-medium">
                  Property Price
                </label>
                <span className="font-mono tabular-nums text-[#8a6d46] dark:text-[#c8a97e]">
                  {formatMoney(input.propertyPriceNgn, currency)}
                </span>
              </div>
              <input
                id="calc-price"
                type="range"
                min={30_000_000}
                max={350_000_000}
                step={5_000_000}
                value={input.propertyPriceNgn}
                onChange={(e) =>
                  onChangeInput({ ...input, propertyPriceNgn: Number(e.target.value) })
                }
                className="w-full accent-[#c8a97e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <label htmlFor="calc-down" className="font-medium">
                    Down Payment
                  </label>
                  <span className="font-mono tabular-nums text-[#8a6d46] dark:text-[#c8a97e]">
                    {input.downPaymentPercent}% ({formatMoney(summary.downPaymentNgn, currency, true)})
                  </span>
                </div>
                <input
                  id="calc-down"
                  type="range"
                  min={10}
                  max={80}
                  step={5}
                  value={input.downPaymentPercent}
                  onChange={(e) =>
                    onChangeInput({ ...input, downPaymentPercent: Number(e.target.value) })
                  }
                  className="w-full accent-[#c8a97e]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <label htmlFor="calc-rate" className="font-medium">
                    Interest Rate (p.a.)
                  </label>
                  <span className="font-mono tabular-nums text-[#8a6d46] dark:text-[#c8a97e]">
                    {input.annualInterestRate}%
                  </span>
                </div>
                <input
                  id="calc-rate"
                  type="range"
                  min={5}
                  max={24}
                  step={0.5}
                  value={input.annualInterestRate}
                  onChange={(e) =>
                    onChangeInput({ ...input, annualInterestRate: Number(e.target.value) })
                  }
                  className="w-full accent-[#c8a97e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <label htmlFor="calc-term" className="font-medium">
                    Loan Term
                  </label>
                  <span className="font-mono tabular-nums text-[#8a6d46] dark:text-[#c8a97e]">
                    {input.loanTermYears} Years
                  </span>
                </div>
                <input
                  id="calc-term"
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={input.loanTermYears}
                  onChange={(e) =>
                    onChangeInput({ ...input, loanTermYears: Number(e.target.value) })
                  }
                  className="w-full accent-[#c8a97e]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <label htmlFor="calc-yield" className="font-medium">
                    Projected Rental Yield
                  </label>
                  <span className="font-mono tabular-nums text-[#8a6d46] dark:text-[#c8a97e]">
                    {input.annualYieldPercent}% / yr
                  </span>
                </div>
                <input
                  id="calc-yield"
                  type="range"
                  min={4}
                  max={20}
                  step={0.5}
                  value={input.annualYieldPercent}
                  onChange={(e) =>
                    onChangeInput({ ...input, annualYieldPercent: Number(e.target.value) })
                  }
                  className="w-full accent-[#c8a97e]"
                />
              </div>
            </div>
          </div>

          {/* Summary & Amortization Column */}
          <div className="lg:col-span-6 p-6 md:p-8 bg-[#141210] text-[#f4f1ec] border border-white/10 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-[#c8a97e]">
                  Estimated Monthly Payment
                </p>
                <p
                  data-testid="monthly-payment-output"
                  className="mt-1 font-serif text-4xl sm:text-5xl tabular-nums"
                >
                  {formatMoney(summary.monthlyPrincipalAndInterestNgn, currency)}
                </p>
                <p className="mt-1 text-xs text-[#f4f1ec]/65 tabular-nums">
                  + {formatMoney(summary.monthlyMaintenanceNgn, currency)} est. facility upkeep
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-[#f4f1ec]/65">Loan-to-Value</p>
                <p className="font-mono text-2xl text-[#c8a97e] tabular-nums">
                  {summary.ltvPercent}%
                </p>
              </div>
            </div>

            {/* Principal vs Interest Ratio Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2 tabular-nums">
                <span>Principal: {formatMoney(summary.loanPrincipalNgn, currency, true)}</span>
                <span className="text-[#c8a97e]">
                  Total Interest: {formatMoney(summary.totalInterestNgn, currency, true)}
                </span>
              </div>
              <div className="h-2 w-full bg-white/15 overflow-hidden flex">
                <div
                  className="h-full bg-[#f4f1ec]"
                  style={{ width: `${principalRatio}%` }}
                />
                <div
                  className="h-full bg-[#c8a97e]"
                  style={{ width: `${100 - principalRatio}%` }}
                />
              </div>
            </div>

            {/* Rental Yield Cashflow */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 text-xs">
              <div>
                <span className="text-[#f4f1ec]/65">Est. Monthly Rental Income</span>
                <p className="mt-1 text-lg font-medium tabular-nums">
                  {formatMoney(summary.estimatedMonthlyRentNgn, currency)}
                </p>
              </div>
              <div>
                <span className="text-[#f4f1ec]/65">Net Monthly Cashflow</span>
                <p
                  className={`mt-1 text-lg font-medium tabular-nums ${
                    summary.netMonthlyCashflowNgn >= 0 ? 'text-emerald-400' : 'text-[#c8a97e]'
                  }`}
                >
                  {formatMoney(summary.netMonthlyCashflowNgn, currency)}
                </p>
              </div>
            </div>

            {/* Amortization Milestones Table */}
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#c8a97e] mb-3">
                Amortization Schedule Milestones
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left tabular-nums">
                  <thead>
                    <tr className="border-b border-white/10 text-[#f4f1ec]/60">
                      <th className="py-2 font-normal">Year</th>
                      <th className="py-2 font-normal">Principal Paid</th>
                      <th className="py-2 font-normal">Remaining Balance</th>
                      <th className="py-2 font-normal text-right">Equity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.milestones.map((m) => (
                      <tr key={m.year} className="border-b border-white/10 last:border-b-0">
                        <td className="py-2.5 font-mono">Yr {m.year}</td>
                        <td className="py-2.5">{formatMoney(m.principalPaidNgn, currency, true)}</td>
                        <td className="py-2.5">
                          {formatMoney(m.remainingBalanceNgn, currency, true)}
                        </td>
                        <td className="py-2.5 text-right text-[#c8a97e]">{m.equityPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onApplyWithTerms({
                  property: selectedProperty,
                  downPaymentPercent: input.downPaymentPercent,
                  estimatedMonthlyNgn: summary.monthlyPrincipalAndInterestNgn,
                })
              }
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-medium bg-[#c8a97e] text-[#141210] hover:bg-[#b59467] transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4" aria-hidden="true" />
              <span>Apply for {selectedProperty.title} With These Terms</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
