import React, { useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Check,
  FileText,
  LogIn,
  LogOut,
  Search,
  Trash2,
} from 'lucide-react';
import type { PropertyListing } from '../data/properties';
import type {
  ApplicationRecord,
  SavedPropertyRecord,
  SavedSearchRecord,
} from '../types/portal';
import {
  APPLICATION_STAGES,
  canAdvanceStage,
  getStageIndex,
} from '../utils/applications';
import { type CurrencyCode, formatMoney } from '../utils/mortgage';

type DashboardTab = 'applications' | 'searches' | 'saved';

interface ClientDashboardProps {
  user: { uid: string; displayName: string | null; email: string | null } | null;
  authLoading: boolean;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  applications: ApplicationRecord[];
  savedSearches: SavedSearchRecord[];
  savedProperties: SavedPropertyRecord[];
  properties: PropertyListing[];
  currency: CurrencyCode;
  onAdvanceApplication: (appId: string) => Promise<void>;
  onWithdrawApplication: (appId: string) => Promise<void>;
  onApplySavedSearch: (search: SavedSearchRecord) => void;
  onDeleteSavedSearch: (searchId: string) => Promise<void>;
  onOpenPropertyById: (propertyId: string) => void;
  onRemoveSavedProperty: (savedId: string) => Promise<void>;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  user,
  authLoading,
  onSignIn,
  onSignOut,
  applications,
  savedSearches,
  savedProperties,
  currency,
  onAdvanceApplication,
  onWithdrawApplication,
  onApplySavedSearch,
  onDeleteSavedSearch,
  onOpenPropertyById,
  onRemoveSavedProperty,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('applications');

  return (
    <section
      id="dashboard"
      aria-labelledby="dashboard-heading"
      className="bg-[#f4f1ec] dark:bg-[#141210] text-[#141210] dark:text-[#f4f1ec] py-16 md:py-24 border-b border-[#141210]/10 dark:border-white/10 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        {/* Header & Auth Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#141210]/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] tracking-[0.22em] uppercase text-[#7b674d] dark:text-[#c8a97e] font-medium">
                PERSONALIZED CLIENT PORTAL
              </span>
              <span className="w-16 h-px bg-[#141210]/20 dark:bg-white/20" aria-hidden="true" />
            </div>
            <h2
              id="dashboard-heading"
              className="font-serif text-3xl sm:text-4xl font-normal [text-wrap:balance]"
            >
              Application Status &amp; Saved Searches
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-medium">{user.displayName || 'Client Account'}</p>
                  <p className="text-[11px] text-[#6b645c] dark:text-[#a69e94]">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs border border-[#141210]/20 dark:border-white/20 hover:border-[#c8a97e] cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={authLoading}
                onClick={onSignIn}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210] hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{authLoading ? 'Connecting...' : 'Sign In with Google to Sync'}</span>
              </button>
            )}
          </div>
        </div>

        {!user && (
          <div className="mt-6 p-4 border border-[#c8a97e]/45 bg-[#c8a97e]/10 text-xs flex flex-wrap items-center justify-between gap-3">
            <p className="text-[#4f4942] dark:text-[#e5ded4]">
              You are viewing a local session workspace. Sign in with Google anytime to persist
              saved searches, property bookmarks, and live applications across devices.
            </p>
            <button
              type="button"
              onClick={onSignIn}
              className="font-medium underline underline-offset-4 text-[#141210] dark:text-[#c8a97e] cursor-pointer"
            >
              Sign In Now
            </button>
          </div>
        )}

        {/* Summary KPI Strip */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10">
            <p className="text-xs text-[#6b645c] dark:text-[#a69e94]">Ongoing Applications</p>
            <p className="mt-1 font-serif text-3xl tabular-nums">{applications.length}</p>
          </div>
          <div className="p-5 bg-white dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10">
            <p className="text-xs text-[#6b645c] dark:text-[#a69e94]">Saved Search Alerts</p>
            <p className="mt-1 font-serif text-3xl tabular-nums">{savedSearches.length}</p>
          </div>
          <div className="p-5 bg-white dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10">
            <p className="text-xs text-[#6b645c] dark:text-[#a69e94]">Bookmarked Properties</p>
            <p className="mt-1 font-serif text-3xl tabular-nums">{savedProperties.length}</p>
          </div>
        </div>

        {/* Dashboard Sub-Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Client dashboard sections"
          className="mt-8 flex flex-wrap gap-2 border-b border-[#141210]/10 dark:border-white/10 pb-4"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'applications'}
            onClick={() => setActiveTab('applications')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border transition-colors cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-[#141210] text-[#f4f1ec] border-[#141210] dark:bg-[#c8a97e] dark:text-[#141210] dark:border-[#c8a97e]'
                : 'bg-white dark:bg-[#171513] border-[#141210]/15 dark:border-white/15'
            }`}
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Application Status ({applications.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'searches'}
            onClick={() => setActiveTab('searches')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border transition-colors cursor-pointer ${
              activeTab === 'searches'
                ? 'bg-[#141210] text-[#f4f1ec] border-[#141210] dark:bg-[#c8a97e] dark:text-[#141210] dark:border-[#c8a97e]'
                : 'bg-white dark:bg-[#171513] border-[#141210]/15 dark:border-white/15'
            }`}
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Saved Searches ({savedSearches.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-[#141210] text-[#f4f1ec] border-[#141210] dark:bg-[#c8a97e] dark:text-[#141210] dark:border-[#c8a97e]'
                : 'bg-white dark:bg-[#171513] border-[#141210]/15 dark:border-white/15'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Bookmarked Properties ({savedProperties.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'applications' && (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="p-10 text-center bg-white dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10">
                  <p className="font-serif text-2xl">No active applications yet.</p>
                  <p className="mt-2 text-xs text-[#6b645c] dark:text-[#a69e94]">
                    Open any property listing or use the Mortgage Calculator to submit an acquisition
                    request.
                  </p>
                </div>
              ) : (
                applications.map((app) => {
                  const stageIdx = getStageIndex(app.status);
                  const canAdvance = canAdvanceStage(app.status);

                  return (
                    <article
                      key={app.id}
                      data-testid={`application-card-${app.id}`}
                      className="p-6 bg-white dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10 space-y-5"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-[#8a6d46] dark:text-[#c8a97e]">
                            {app.applicationType} · Advisor: {app.agentName}
                          </p>
                          <h3 className="mt-1 font-serif text-2xl font-medium">
                            {app.propertyTitle}
                          </h3>
                          <p className="mt-1 text-xs text-[#6b645c] dark:text-[#a69e94] tabular-nums">
                            Down payment: {app.downPaymentPercent}% · Est. Monthly:{' '}
                            {app.estimatedMonthlyNgn > 0
                              ? formatMoney(app.estimatedMonthlyNgn, currency)
                              : 'Outright'}
                            {' · '}Updated {app.updatedAtLabel}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <span className="px-3 py-1 text-xs font-medium border border-[#c8a97e]/60 bg-[#c8a97e]/15 text-[#141210] dark:text-[#f4f1ec]">
                            Status: {app.status}
                          </span>
                          {canAdvance && (
                            <button
                              type="button"
                              onClick={() => onAdvanceApplication(app.id)}
                              className="px-3 py-1.5 text-xs font-medium bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210] hover:opacity-90 cursor-pointer"
                            >
                              Advance Milestone
                            </button>
                          )}
                          {app.status !== 'Withdrawn' &&
                            app.status !== 'Approved & Closing' && (
                              <button
                                type="button"
                                onClick={() => onWithdrawApplication(app.id)}
                                className="px-3 py-1.5 text-xs border border-[#141210]/20 dark:border-white/20 hover:border-red-500 hover:text-red-500 cursor-pointer"
                              >
                                Withdraw
                              </button>
                            )}
                        </div>
                      </div>

                      {/* 5-Stage Progress Tracker */}
                      {app.status !== 'Withdrawn' && (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                          {APPLICATION_STAGES.map((stage, idx) => {
                            const completed = idx <= stageIdx;
                            const isCurrent = idx === stageIdx;
                            return (
                              <div
                                key={stage}
                                className={`p-3 border text-xs ${
                                  isCurrent
                                    ? 'border-[#c8a97e] bg-[#c8a97e]/15 font-medium'
                                    : completed
                                      ? 'border-[#141210]/25 dark:border-white/25 bg-[#f4f1ec] dark:bg-[#1e1b18]'
                                      : 'border-[#141210]/10 dark:border-white/10 opacity-55'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-mono text-[10px] tabular-nums">
                                    0{idx + 1}
                                  </span>
                                  {completed && (
                                    <Check
                                      className="w-3.5 h-3.5 text-[#8a6d46] dark:text-[#c8a97e]"
                                      aria-hidden="true"
                                    />
                                  )}
                                </div>
                                <p className="leading-snug">{stage}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <p className="text-xs text-[#575149] dark:text-[#b5ada2] border-t border-[#141210]/10 dark:border-white/10 pt-3">
                        Notes: {app.notes}
                      </p>
                    </article>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'searches' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedSearches.length === 0 ? (
                <div className="md:col-span-2 p-10 text-center bg-white dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10">
                  <p className="font-serif text-2xl">No saved searches yet.</p>
                  <p className="mt-2 text-xs text-[#6b645c] dark:text-[#a69e94]">
                    Use &ldquo;Save Search&rdquo; in the Portfolio Explorer to bookmark your exact
                    property criteria.
                  </p>
                </div>
              ) : (
                savedSearches.map((search) => (
                  <article
                    key={search.id}
                    className="p-5 bg-white dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-serif text-xl font-medium">{search.name}</h3>
                        <span className="text-[11px] text-[#6b645c] dark:text-[#a69e94] tabular-nums">
                          {search.createdAtLabel}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-[#575149] dark:text-[#b5ada2] tabular-nums">
                        {search.category} · {search.listingMode} ·{' '}
                        {search.minBeds > 0 ? `${search.minBeds}+ Beds` : 'Any Beds'} · Up to{' '}
                        {formatMoney(search.maxPriceNgn, currency, true)}
                        {search.query ? ` · "${search.query}"` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#141210]/10 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => onApplySavedSearch(search)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8a6d46] dark:text-[#c8a97e] hover:underline cursor-pointer"
                      >
                        <span>Run Search</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteSavedSearch(search.id)}
                        aria-label={`Delete saved search ${search.name}`}
                        className="inline-flex items-center gap-1 text-xs text-[#6b645c] hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedProperties.length === 0 ? (
                <div className="md:col-span-3 p-10 text-center bg-white dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10">
                  <p className="font-serif text-2xl">No bookmarked properties yet.</p>
                  <p className="mt-2 text-xs text-[#6b645c] dark:text-[#a69e94]">
                    Click the bookmark icon on any residence to keep it shortlisted here.
                  </p>
                </div>
              ) : (
                savedProperties.map((saved) => (
                  <article
                    key={saved.id}
                    className="p-5 bg-white dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#8a6d46] dark:text-[#c8a97e]">
                        {saved.location}
                      </p>
                      <h3 className="mt-1 font-serif text-xl font-medium">{saved.propertyTitle}</h3>
                      <p className="mt-1 font-serif text-lg tabular-nums">
                        {formatMoney(saved.priceNgn, currency)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#141210]/10 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => onOpenPropertyById(saved.propertyId)}
                        className="text-xs font-medium hover:text-[#c8a97e] cursor-pointer"
                      >
                        Inspect Listing →
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveSavedProperty(saved.id)}
                        aria-label={`Remove ${saved.propertyTitle} from bookmarks`}
                        className="text-xs text-[#6b645c] hover:text-red-500 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
