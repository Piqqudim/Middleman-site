import React, { useState } from 'react';
import {
  BedDouble,
  Bookmark,
  BookmarkCheck,
  Calculator,
  Columns2,
  LayoutGrid,
  Map as MapIcon,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import type { ListingMode, PropertyCategory, PropertyListing } from '../data/properties';
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  filterProperties,
  MAX_PORTFOLIO_PRICE_NGN,
  type SearchFilters,
  type SortOption,
} from '../utils/filters';
import { type CurrencyCode, formatMoney } from '../utils/mortgage';
import { PropertyMapView } from './PropertyMapView';

type ExplorerViewMode = 'split' | 'grid' | 'map';

interface ListingsExplorerProps {
  properties: PropertyListing[];
  filters: SearchFilters;
  onFiltersChange: (next: SearchFilters) => void;
  currency: CurrencyCode;
  onCurrencyChange: (next: CurrencyCode) => void;
  savedPropertyIds: string[];
  onToggleSaveProperty: (property: PropertyListing) => void;
  onSelectProperty: (property: PropertyListing) => void;
  onCalculateProperty: (property: PropertyListing) => void;
  onSaveSearch: (name: string, filters: SearchFilters) => Promise<void>;
  viewMode: ExplorerViewMode;
  onViewModeChange: (mode: ExplorerViewMode) => void;
  quotaExceeded: boolean;
}

const CATEGORIES: ('All' | PropertyCategory)[] = [
  'All',
  'Luxury Apartment',
  'Villa & Home',
  'Shortlet Suite',
  'Commercial Land',
];

const LISTING_MODES: ('All' | ListingMode)[] = ['All', 'For Sale', 'Shortlet', 'Investment'];

const AMENITY_OPTIONS = [
  'Infinity Pool',
  'Smart Home',
  '24/7 Power',
  'Gated Security',
  'Concierge',
];

export const ListingsExplorer: React.FC<ListingsExplorerProps> = ({
  properties,
  filters,
  onFiltersChange,
  currency,
  onCurrencyChange,
  savedPropertyIds,
  onToggleSaveProperty,
  onSelectProperty,
  onCalculateProperty,
  onSaveSearch,
  viewMode,
  onViewModeChange,
  quotaExceeded,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savingSearchOpen, setSavingSearchOpen] = useState(false);
  const [searchLabel, setSearchLabel] = useState('');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(
    properties[0]?.id ?? null
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredListings = filterProperties(properties, filters);
  const activeCount = countActiveFilters(filters);

  const toggleAmenity = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    const nextAmenities = exists
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onFiltersChange({ ...filters, amenities: nextAmenities });
  };

  const handleSaveSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const label = searchLabel.trim() || `${filters.category} · ${filters.listingMode}`;
    await onSaveSearch(label, filters);
    setSearchLabel('');
    setSavingSearchOpen(false);
    setSaveFeedback(`Saved "${label}" to your Dashboard.`);
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  return (
    <section
      id="listings"
      aria-labelledby="listings-heading"
      className="bg-[#faf8f4] dark:bg-[#0e0d0b] text-[#141210] dark:text-[#f4f1ec] py-16 md:py-24 border-b border-[#141210]/10 dark:border-white/10 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        {/* Section Header + Currency / View Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#141210]/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] tracking-[0.22em] uppercase text-[#7b674d] dark:text-[#c8a97e] font-medium">
                PORTFOLIO &amp; MAP SEARCH
              </span>
              <span
                className="w-16 h-px bg-[#141210]/20 dark:bg-white/20"
                aria-hidden="true"
              />
            </div>
            <h2
              id="listings-heading"
              className="font-serif text-3xl sm:text-4xl font-normal [text-wrap:balance]"
            >
              Curated Properties Across Nigeria
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Currency Segmented Control */}
            <div
              role="group"
              aria-label="Display currency"
              className="inline-flex border border-[#141210]/15 dark:border-white/15 bg-[#f4f1ec] dark:bg-[#171513] p-0.5"
            >
              {(['NGN', 'USD'] as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onCurrencyChange(code)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    currency === code
                      ? 'bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210]'
                      : 'text-[#575149] dark:text-[#a69e94] hover:text-[#141210] dark:hover:text-[#f4f1ec]'
                  }`}
                >
                  {code === 'NGN' ? '₦ NGN' : '$ USD'}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div
              role="group"
              aria-label="Listings view mode"
              className="inline-flex border border-[#141210]/15 dark:border-white/15 bg-[#f4f1ec] dark:bg-[#171513] p-0.5"
            >
              <button
                type="button"
                onClick={() => onViewModeChange('split')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210]'
                    : 'text-[#575149] dark:text-[#a69e94]'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Split</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210]'
                    : 'text-[#575149] dark:text-[#a69e94]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('map')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210]'
                    : 'text-[#575149] dark:text-[#a69e94]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="py-6 space-y-4 border-b border-[#141210]/10 dark:border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <label className="md:col-span-5 relative block">
              <span className="sr-only">Search by location, district, or property title</span>
              <Search
                className="w-4 h-4 text-[#7b674d] dark:text-[#c8a97e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
                placeholder="Search GRA Benin, Uselu, Ikoyi, Maitama, D'ORVANE..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#171513] border border-[#141210]/15 dark:border-white/15 focus:outline-none focus:border-[#c8a97e]"
              />
            </label>

            <label className="md:col-span-2 block">
              <span className="sr-only">Listing mode</span>
              <select
                value={filters.listingMode}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    listingMode: e.target.value as 'All' | ListingMode,
                  })
                }
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#171513] border border-[#141210]/15 dark:border-white/15"
              >
                {LISTING_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === 'All' ? 'All Modes' : mode}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-2 block">
              <span className="sr-only">Minimum bedrooms</span>
              <select
                value={filters.minBeds}
                onChange={(e) =>
                  onFiltersChange({ ...filters, minBeds: Number(e.target.value) })
                }
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#171513] border border-[#141210]/15 dark:border-white/15"
              >
                <option value={0}>Any Bedrooms</option>
                <option value={2}>2+ Bedrooms</option>
                <option value={3}>3+ Bedrooms</option>
                <option value={4}>4+ Bedrooms</option>
              </select>
            </label>

            <div className="md:col-span-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                aria-expanded={showAdvanced}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  showAdvanced
                    ? 'border-[#c8a97e] bg-[#c8a97e]/15 text-[#141210] dark:text-[#f4f1ec]'
                    : 'border-[#141210]/15 dark:border-white/15 hover:border-[#c8a97e]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#c8a97e]" aria-hidden="true" />
                <span>Filters{activeCount > 0 ? ` (${activeCount})` : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => setSavingSearchOpen((prev) => !prev)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-medium bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210] hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save Search</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Property categories">
              {CATEGORIES.map((category) => {
                const isActive = filters.category === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => onFiltersChange({ ...filters, category })}
                    className={`px-3.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#141210] text-[#f4f1ec] border-[#141210] dark:bg-[#c8a97e] dark:text-[#141210] dark:border-[#c8a97e]'
                        : 'bg-transparent text-[#575149] dark:text-[#a69e94] border-[#141210]/15 dark:border-white/15 hover:border-[#c8a97e]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#6b645c] dark:text-[#a69e94] tabular-nums">
                {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'}
              </span>

              <label className="inline-flex items-center gap-2">
                <span className="text-[#6b645c] dark:text-[#a69e94]">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, sortBy: e.target.value as SortOption })
                  }
                  className="px-2.5 py-1 bg-white dark:bg-[#171513] border border-[#141210]/15 dark:border-white/15 text-xs"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="yield-desc">Highest Yield %</option>
                </select>
              </label>

              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => onFiltersChange(DEFAULT_FILTERS)}
                  className="inline-flex items-center gap-1 text-xs text-[#8a6d46] dark:text-[#c8a97e] hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Expandable Advanced Filter Panel */}
          {showAdvanced && (
            <div className="p-5 bg-[#f4f1ec] dark:bg-[#171513] border border-[#141210]/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium">Maximum Budget</span>
                  <span className="font-mono tabular-nums text-[#8a6d46] dark:text-[#c8a97e]">
                    {filters.maxPriceNgn >= MAX_PORTFOLIO_PRICE_NGN
                      ? 'No ceiling'
                      : formatMoney(filters.maxPriceNgn, currency, true)}
                  </span>
                </div>
                <input
                  type="range"
                  min={40_000_000}
                  max={MAX_PORTFOLIO_PRICE_NGN}
                  step={5_000_000}
                  value={filters.maxPriceNgn}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, maxPriceNgn: Number(e.target.value) })
                  }
                  aria-label="Maximum budget slider"
                  className="w-full accent-[#c8a97e]"
                />
              </div>

              <div className="md:col-span-7">
                <p className="text-xs font-medium mb-2">Essential Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const selected = filters.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1.5 text-xs border transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#c8a97e] text-[#141210] border-[#c8a97e] font-medium'
                            : 'bg-white dark:bg-[#11100e] border-[#141210]/15 dark:border-white/15 hover:border-[#c8a97e]'
                        }`}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Save Search Inline Form */}
          {savingSearchOpen && (
            <form
              onSubmit={handleSaveSearchSubmit}
              className="p-4 bg-[#f4f1ec] dark:bg-[#171513] border border-[#c8a97e]/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <input
                type="text"
                value={searchLabel}
                onChange={(e) => setSearchLabel(e.target.value)}
                placeholder="Name this saved search (e.g., GRA Benin 3+ Bed Villas)"
                className="flex-1 px-3.5 py-2 text-sm bg-white dark:bg-[#11100e] border border-[#141210]/20 dark:border-white/20"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210] cursor-pointer"
                >
                  Confirm Save
                </button>
                <button
                  type="button"
                  onClick={() => setSavingSearchOpen(false)}
                  className="px-3 py-2 text-xs border border-[#141210]/20 dark:border-white/20 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {saveFeedback && (
            <p className="text-xs text-[#8a6d46] dark:text-[#c8a97e] font-medium">
              {saveFeedback}
            </p>
          )}
        </div>

        {/* Results Viewport */}
        {filteredListings.length === 0 ? (
          <div className="py-16 text-center border border-[#141210]/10 dark:border-white/10 mt-8 bg-[#f4f1ec] dark:bg-[#171513] px-6">
            <h3 className="font-serif text-2xl">No properties match those exact filters.</h3>
            <p className="mt-2 text-sm text-[#6b645c] dark:text-[#a69e94]">
              Broaden your budget ceiling or reset active filters to explore our full portfolio.
            </p>
            <button
              type="button"
              onClick={() => onFiltersChange(DEFAULT_FILTERS)}
              className="mt-5 px-5 py-2.5 text-xs font-medium bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210] cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div
            className={`mt-8 grid gap-6 ${
              viewMode === 'split'
                ? 'grid-cols-1 lg:grid-cols-12 items-start'
                : 'grid-cols-1'
            }`}
          >
            {/* Listings Cards Column */}
            {viewMode !== 'map' && (
              <div
                className={
                  viewMode === 'split'
                    ? 'lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5'
                    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                }
              >
                {filteredListings.map((property) => {
                  const isSaved = savedPropertyIds.includes(property.id);
                  const isActive = selectedMarkerId === property.id;
                  return (
                    <article
                      key={property.id}
                      onMouseEnter={() => setHoveredId(property.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`group flex flex-col border bg-white dark:bg-[#171513] transition-colors ${
                        isActive
                          ? 'border-[#c8a97e]'
                          : 'border-[#141210]/10 dark:border-white/10 hover:border-[#c8a97e]/60'
                      }`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#1e1b18]">
                        <img
                          src={property.image}
                          alt={property.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => onToggleSaveProperty(property)}
                          aria-label={isSaved ? `Unsave ${property.title}` : `Save ${property.title}`}
                          className="absolute top-3 right-3 w-9 h-9 inline-flex items-center justify-center bg-[#11100e]/80 text-[#f4f1ec] hover:text-[#c8a97e] border border-white/15 cursor-pointer"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-[#c8a97e]" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-[#f4f1ec]">
                          <span className="text-[11px] uppercase tracking-[0.16em] text-[#c8a97e]">
                            {property.listingMode}
                          </span>
                          <span className="font-serif text-xl tabular-nums">
                            {formatMoney(property.priceNgn, currency, true)}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-xl font-medium leading-snug">
                            {property.title}
                          </h3>
                          <p className="mt-1 text-xs text-[#6b645c] dark:text-[#a69e94] flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#c8a97e] shrink-0" aria-hidden="true" />
                            <span>{property.location}</span>
                          </p>
                          <p className="mt-3 text-xs text-[#575149] dark:text-[#b5ada2] tabular-nums flex items-center gap-2">
                            <BedDouble className="w-3.5 h-3.5 text-[#8a6d46] dark:text-[#c8a97e]" aria-hidden="true" />
                            <span>
                              {property.beds > 0 ? `${property.beds} Beds` : 'Titled Land'} ·{' '}
                              {property.sqm} sqm · {property.annualYieldPercent}% Yield
                            </span>
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#141210]/10 dark:border-white/10 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMarkerId(property.id);
                              onSelectProperty(property);
                            }}
                            className="text-xs font-medium text-[#141210] dark:text-[#f4f1ec] hover:text-[#8a6d46] dark:hover:text-[#c8a97e] transition-colors cursor-pointer"
                          >
                            View Property &amp; Apply →
                          </button>

                          <button
                            type="button"
                            onClick={() => onCalculateProperty(property)}
                            aria-label={`Calculate mortgage for ${property.title}`}
                            className="inline-flex items-center gap-1 text-xs text-[#6b645c] dark:text-[#a69e94] hover:text-[#c8a97e] cursor-pointer"
                          >
                            <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Calc</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Map Column */}
            {viewMode !== 'grid' && (
              <div
                className={
                  viewMode === 'split'
                    ? 'lg:col-span-5 lg:sticky lg:top-24'
                    : 'w-full'
                }
              >
                <PropertyMapView
                  properties={filteredListings}
                  currency={currency}
                  selectedPropertyId={selectedMarkerId}
                  hoveredPropertyId={hoveredId}
                  onSelectMarker={(p) => setSelectedMarkerId(p.id)}
                  onOpenDetail={onSelectProperty}
                  quotaExceeded={quotaExceeded}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
