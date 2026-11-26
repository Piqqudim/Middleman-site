import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import type { PropertyListing } from '../data/properties';
import type { CurrencyCode } from '../utils/mortgage';
import { formatMoney } from '../utils/mortgage';

interface FeaturedShowcaseProps {
  properties: PropertyListing[];
  currency: CurrencyCode;
  onSelectProperty: (property: PropertyListing) => void;
  onViewAll: () => void;
}

export const FeaturedShowcase: React.FC<FeaturedShowcaseProps> = ({
  properties,
  currency,
  onSelectProperty,
  onViewAll,
}) => {
  const primary = properties.find((p) => p.featuredRank === 1) ?? properties[0];
  const secondaryTop = properties.find((p) => p.featuredRank === 2) ?? properties[1];
  const secondaryBottom = properties.find((p) => p.featuredRank === 3) ?? properties[2];

  if (!primary || !secondaryTop || !secondaryBottom) return null;

  return (
    <section
      aria-labelledby="featured-heading"
      className="bg-[#f4f1ec] dark:bg-[#141210] text-[#141210] dark:text-[#f4f1ec] py-16 md:py-24 border-b border-[#141210]/10 dark:border-white/10 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Editorial Intro */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[11px] tracking-[0.22em] uppercase text-[#7b674d] dark:text-[#c8a97e] font-medium">
                  FEATURED PROPERTIES
                </span>
                <span
                  className="flex-1 max-w-[72px] h-px bg-[#141210]/20 dark:bg-white/20"
                  aria-hidden="true"
                />
              </div>

              <h2
                id="featured-heading"
                className="font-serif text-3xl sm:text-4xl leading-[1.12] font-normal [text-wrap:balance]"
              >
                Exceptional Spaces. Timeless Value.
              </h2>

              <p className="mt-5 text-sm md:text-[15px] leading-relaxed text-[#575149] dark:text-[#b5ada2]">
                From luxury apartments to prime real estate investments, discover properties that
                fit your lifestyle.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#141210]/10 dark:border-white/10">
              <button
                type="button"
                onClick={onViewAll}
                className="inline-flex items-center gap-2.5 text-sm font-medium text-[#141210] dark:text-[#f4f1ec] hover:text-[#9c7847] dark:hover:text-[#c8a97e] transition-colors cursor-pointer"
              >
                <span>View All Listings</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right 1+2 Asymmetric Property Showcase */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Large Primary Card */}
            <button
              type="button"
              onClick={() => onSelectProperty(primary)}
              className="md:col-span-7 group relative text-left overflow-hidden bg-[#1e1b18] min-h-[340px] md:min-h-[410px] border border-[#141210]/10 dark:border-white/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a97e]"
            >
              <img
                src={primary.image}
                alt={primary.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between gap-4 text-[#f4f1ec]">
                <div>
                  <h3 className="font-serif text-2xl font-medium leading-tight">
                    {primary.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#f4f1ec]/75">{primary.subtitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-[#c8a97e] uppercase tracking-wider">From</p>
                  <p className="font-serif text-xl sm:text-2xl tabular-nums">
                    {formatMoney(primary.priceNgn, currency, true)}
                  </p>
                </div>
              </div>
            </button>

            {/* Stacked Secondary Cards */}
            <div className="md:col-span-5 flex flex-col gap-5">
              {[secondaryTop, secondaryBottom].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectProperty(item)}
                  className="group relative flex-1 text-left overflow-hidden bg-[#1e1b18] min-h-[195px] border border-[#141210]/10 dark:border-white/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a97e]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3 text-[#f4f1ec]">
                    <div className="min-w-0">
                      <h3 className="font-serif text-xl font-medium leading-snug truncate">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#f4f1ec]/75 flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-[#c8a97e] shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.subtitle}</span>
                      </p>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 text-[#f4f1ec]/80 group-hover:translate-x-1 transition-transform shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
