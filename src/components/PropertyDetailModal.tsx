import React, { useState } from 'react';
import {
  BedDouble,
  Bath,
  Bookmark,
  Calculator,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Maximize2,
  MessageSquare,
  X,
} from 'lucide-react';
import type { AgentProfile, PropertyListing } from '../data/properties';
import type { ApplicationType } from '../utils/applications';
import { calculateMortgage, type CurrencyCode, formatMoney } from '../utils/mortgage';

interface PropertyDetailModalProps {
  property: PropertyListing | null;
  agent: AgentProfile | undefined;
  currency: CurrencyCode;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (property: PropertyListing) => void;
  onOpenCalculator: (property: PropertyListing) => void;
  onMessageAgent: (agent: AgentProfile, property: PropertyListing) => void;
  onSubmitApplication: (payload: {
    property: PropertyListing;
    agent: AgentProfile;
    applicationType: ApplicationType;
    downPaymentPercent: number;
    estimatedMonthlyNgn: number;
    notes: string;
  }) => Promise<void>;
}

const APPLICATION_TYPES: ApplicationType[] = [
  'Purchase Financing',
  'Outright Acquisition',
  'Shortlet Corporate Lease',
  'Investment Allocation',
];

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  agent,
  currency,
  isSaved,
  onClose,
  onToggleSave,
  onOpenCalculator,
  onMessageAgent,
  onSubmitApplication,
}) => {
  const [applicationType, setApplicationType] = useState<ApplicationType>('Purchase Financing');
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  if (!property) return null;

  const mortgagePreview = calculateMortgage({
    propertyPriceNgn: property.priceNgn,
    downPaymentPercent,
    annualInterestRate: 12,
    loanTermYears: 15,
    annualYieldPercent: property.annualYieldPercent,
    annualMaintenancePercent: 1.5,
  });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    setIsSubmitting(true);
    try {
      await onSubmitApplication({
        property,
        agent,
        applicationType,
        downPaymentPercent,
        estimatedMonthlyNgn:
          applicationType === 'Outright Acquisition'
            ? 0
            : mortgagePreview.monthlyPrincipalAndInterestNgn,
        notes: notes.trim() || `Initial inquiry for ${property.title} (${property.location}).`,
      });
      setSubmittedNotice(true);
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-modal-title"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#faf8f4] dark:bg-[#171513] text-[#141210] dark:text-[#f4f1ec] border border-[#141210]/15 dark:border-white/15 max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#faf8f4]/95 dark:bg-[#171513]/95 backdrop-blur-sm border-b border-[#141210]/10 dark:border-white/10">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#8a6d46] dark:text-[#c8a97e]">
              {property.category} · {property.listingMode}
            </p>
            <h2 id="property-modal-title" className="font-serif text-2xl sm:text-3xl truncate">
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSave(property)}
              aria-label={isSaved ? 'Remove property from saved' : 'Save property'}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#c8a97e] text-[#141210] border-[#c8a97e]'
                  : 'border-[#141210]/20 dark:border-white/20 hover:border-[#c8a97e]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close property details"
              className="w-10 h-10 inline-flex items-center justify-center border border-[#141210]/15 dark:border-white/15 hover:border-[#c8a97e] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 overflow-hidden bg-[#1e1b18] aspect-[16/10] border border-[#141210]/10 dark:border-white/10">
              <img
                src={property.image}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-5 space-y-5">
              <div>
                <p className="text-xs text-[#6b645c] dark:text-[#a69e94] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c8a97e]" aria-hidden="true" />
                  <span>{property.location}</span>
                </p>
                <p className="mt-2 font-serif text-3xl sm:text-4xl tabular-nums">
                  {formatMoney(property.priceNgn, currency)}
                </p>
                <p className="mt-1 text-xs text-[#6b645c] dark:text-[#a69e94] tabular-nums">
                  Projected Annual Yield: {property.annualYieldPercent}% · Title:{' '}
                  {property.titleDocument}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 py-4 border-y border-[#141210]/10 dark:border-white/10 text-xs">
                <div>
                  <span className="text-[#6b645c] dark:text-[#a69e94] flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5" aria-hidden="true" /> Beds
                  </span>
                  <p className="mt-1 text-base font-medium tabular-nums">
                    {property.beds > 0 ? property.beds : 'Plot'}
                  </p>
                </div>
                <div>
                  <span className="text-[#6b645c] dark:text-[#a69e94] flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5" aria-hidden="true" /> Baths
                  </span>
                  <p className="mt-1 text-base font-medium tabular-nums">
                    {property.baths > 0 ? property.baths : '—'}
                  </p>
                </div>
                <div>
                  <span className="text-[#6b645c] dark:text-[#a69e94] flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" /> Area
                  </span>
                  <p className="mt-1 text-base font-medium tabular-nums">{property.sqm} sqm</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#4f4942] dark:text-[#c7bfb5]">
                {property.description}
              </p>

              <div className="text-xs text-[#6b645c] dark:text-[#a69e94]">
                {property.amenities.join(' · ')}
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenCalculator(property)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-[#141210]/20 dark:border-white/20 hover:border-[#c8a97e] transition-colors cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-[#c8a97e]" aria-hidden="true" />
                  <span>Open Mortgage Plan</span>
                </button>
                {agent && (
                  <button
                    type="button"
                    onClick={() => onMessageAgent(agent, property)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#141210] text-[#f4f1ec] dark:bg-[#f4f1ec] dark:text-[#141210] hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Message {agent.name.split(' ')[0]}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Assigned Advisor + Quick Application Submission */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-[#141210]/10 dark:border-white/10">
            {agent && (
              <div className="md:col-span-5 p-5 border border-[#141210]/10 dark:border-white/10 bg-[#f4f1ec] dark:bg-[#1e1b18] space-y-3">
                <p className="text-[11px] tracking-[0.18em] uppercase text-[#8a6d46] dark:text-[#c8a97e]">
                  Lead Property Advisor
                </p>
                <div className="flex items-center gap-3.5">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover border border-[#141210]/15 dark:border-white/15"
                  />
                  <div>
                    <h3 className="font-serif text-xl font-medium">{agent.name}</h3>
                    <p className="text-xs text-[#6b645c] dark:text-[#a69e94]">{agent.role}</p>
                    <p className="text-[11px] text-[#8a6d46] dark:text-[#c8a97e] mt-0.5">
                      Avg reply: {agent.responseTime} · {agent.verifiedLicense}
                    </p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-[#575149] dark:text-[#b5ada2]">
                  {agent.bio}
                </p>
              </div>
            )}

            <form
              onSubmit={handleApply}
              className="md:col-span-7 p-5 border border-[#141210]/10 dark:border-white/10 space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-serif text-xl">Start Acquisition Application</h3>
                <span className="text-xs text-[#6b645c] dark:text-[#a69e94] tabular-nums">
                  Est. {formatMoney(mortgagePreview.monthlyPrincipalAndInterestNgn, currency)}/mo
                </span>
              </div>

              {submittedNotice && (
                <div className="p-3 border border-emerald-700/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    Application submitted. Track real-time progress inside your Dashboard.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs">
                  <span className="text-[#6b645c] dark:text-[#a69e94]">Acquisition Path</span>
                  <select
                    value={applicationType}
                    onChange={(e) => setApplicationType(e.target.value as ApplicationType)}
                    className="mt-1.5 w-full px-3 py-2.5 bg-white dark:bg-[#11100e] border border-[#141210]/20 dark:border-white/20 text-sm"
                  >
                    {APPLICATION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs">
                  <span className="text-[#6b645c] dark:text-[#a69e94]">
                    Down Payment ({downPaymentPercent}%)
                  </span>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    step={5}
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="mt-3 w-full accent-[#c8a97e]"
                  />
                </label>
              </div>

              <label className="block text-xs">
                <span className="text-[#6b645c] dark:text-[#a69e94]">
                  Application Notes / Preferred Inspection Date
                </span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Request survey verification, schedule private viewing, or specify tranche timeline..."
                  className="mt-1.5 w-full px-3 py-2 bg-white dark:bg-[#11100e] border border-[#141210]/20 dark:border-white/20 text-sm"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#c8a97e] text-[#141210] hover:bg-[#b59467] disabled:opacity-60 transition-colors cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Application to Dashboard'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
