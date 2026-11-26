import type { ListingMode, PropertyCategory, PropertyListing } from '../data/properties';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'yield-desc';

export interface SearchFilters {
  query: string;
  category: 'All' | PropertyCategory;
  listingMode: 'All' | ListingMode;
  minBeds: number;
  maxPriceNgn: number;
  amenities: string[];
  sortBy: SortOption;
}

export const MAX_PORTFOLIO_PRICE_NGN = 300_000_000;

export const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  category: 'All',
  listingMode: 'All',
  minBeds: 0,
  maxPriceNgn: MAX_PORTFOLIO_PRICE_NGN,
  amenities: [],
  sortBy: 'featured',
};

export function filterProperties(
  listings: PropertyListing[],
  filters: SearchFilters
): PropertyListing[] {
  const q = filters.query.trim().toLowerCase();

  const filtered = listings.filter((item) => {
    if (q) {
      const haystack = `${item.title} ${item.location} ${item.district} ${item.subtitle} ${item.category}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.category !== 'All' && item.category !== filters.category) {
      return false;
    }

    if (filters.listingMode !== 'All' && item.listingMode !== filters.listingMode) {
      return false;
    }

    if (filters.minBeds > 0 && item.beds < filters.minBeds) {
      return false;
    }

    if (item.priceNgn > filters.maxPriceNgn) {
      return false;
    }

    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every((amenity) => item.amenities.includes(amenity));
      if (!hasAll) return false;
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.priceNgn - b.priceNgn;
    if (filters.sortBy === 'price-desc') return b.priceNgn - a.priceNgn;
    if (filters.sortBy === 'yield-desc') return b.annualYieldPercent - a.annualYieldPercent;
    const rankA = a.featuredRank ?? 99;
    const rankB = b.featuredRank ?? 99;
    if (rankA !== rankB) return rankA - rankB;
    return b.annualYieldPercent - a.annualYieldPercent;
  });
}

export function countActiveFilters(filters: SearchFilters): number {
  let count = 0;
  if (filters.query.trim()) count++;
  if (filters.category !== 'All') count++;
  if (filters.listingMode !== 'All') count++;
  if (filters.minBeds > 0) count++;
  if (filters.maxPriceNgn < MAX_PORTFOLIO_PRICE_NGN) count++;
  count += filters.amenities.length;
  return count;
}

export function describeFilterSummary(filters: SearchFilters): string {
  const parts: string[] = [];
  if (filters.query.trim()) parts.push(`"${filters.query.trim()}"`);
  if (filters.category !== 'All') parts.push(filters.category);
  if (filters.listingMode !== 'All') parts.push(filters.listingMode);
  if (filters.minBeds > 0) parts.push(`${filters.minBeds}+ Beds`);
  if (filters.maxPriceNgn < MAX_PORTFOLIO_PRICE_NGN) {
    parts.push(`Up to ₦${Math.round(filters.maxPriceNgn / 1_000_000)}M`);
  }
  if (filters.amenities.length > 0) {
    parts.push(filters.amenities.join(', '));
  }
  return parts.length > 0 ? parts.join(' · ') : 'All Benin, Lagos & Abuja Listings';
}
