import React, { useState } from 'react';
import { ArrowRight, Globe2, X } from 'lucide-react';
import { HERO_INTERIOR_IMAGE, INSIGHTS, type InsightArticle } from '../data/properties';

interface BrandsAndInsightsProps {
  onExploreListings: () => void;
  onFilterShortlets: () => void;
  onOpenTalk: () => void;
}

export const BrandsAndInsights: React.FC<BrandsAndInsightsProps> = ({
  onExploreListings,
  onFilterShortlets,
  onOpenTalk,
}) => {
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);

  return (
    <>
      {/* Our Brands Dark Showcase */}
      <section
        aria-labelledby="brands-heading"
        className="relative overflow-hidden bg-[#11100e] text-[#f4f1ec] py-16 md:py-24 border-b border-white/10"
      >
        <img
          src={HERO_INTERIOR_IMAGE}
          alt="Luxury architectural lounge"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none select-none"
        />
        <div className="relative max-w-[1280px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[11px] tracking-[0.22em] uppercase text-[#c8a97e] font-medium">
                  OUR BRANDS
                </span>
                <span className="w-16 h-px bg-white/25" aria-hidden="true" />
              </div>

              <h2
                id="brands-heading"
                className="font-serif text-3xl sm:text-4xl font-normal leading-tight [text-wrap:balance]"
              >
                A Portfolio of Excellence.
              </h2>

              <p className="text-sm text-[#f4f1ec]/70 leading-relaxed max-w-xs">
                Multiple brands. One vision — exceptional living and lasting value.
              </p>

              <button
                type="button"
                onClick={onExploreListings}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 text-xs font-medium border border-[#c8a97e]/60 text-[#f4f1ec] hover:bg-[#c8a97e] hover:text-[#141210] transition-colors cursor-pointer"
              >
                <span>Explore Our Brands</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/15 border-y sm:border-y-0 sm:border-l border-white/15">
              <button
                type="button"
                onClick={onExploreListings}
                className="py-10 px-6 flex flex-col items-center justify-center text-center group hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <Globe2 className="w-12 h-12 text-[#f4f1ec]/80 mb-4 stroke-[1.2]" aria-hidden="true" />
                <p className="font-serif text-3xl tracking-[0.06em] font-normal">EMMG</p>
                <p className="mt-1 text-xs text-[#f4f1ec]/75">The Exclusive Middle Man</p>
                <p className="mt-4 text-[11px] text-[#c8a97e] tracking-wide">
                  Real Estate · Apartments · Investments
                </p>
              </button>

              <button
                type="button"
                onClick={onFilterShortlets}
                className="py-10 px-6 flex flex-col items-center justify-center text-center group hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <span className="font-serif text-4xl tracking-tight text-[#f4f1ec]">D&apos;V</span>
                <p className="mt-2 font-serif text-2xl tracking-[0.08em] text-[#f4f1ec]">
                  D&apos;ORVANE
                </p>
                <p className="font-serif italic text-xl text-[#c8a97e] -mt-1">Suites</p>
                <p className="mt-4 text-[11px] text-[#f4f1ec]/70 tracking-wide">
                  Luxury Shortlet Apartments
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section
        aria-labelledby="insights-heading"
        className="bg-[#f4f1ec] dark:bg-[#141210] text-[#141210] dark:text-[#f4f1ec] py-16 md:py-24 border-b border-[#141210]/10 dark:border-white/10 transition-colors"
      >
        <div className="max-w-[1280px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] tracking-[0.22em] uppercase text-[#7b674d] dark:text-[#c8a97e] font-medium">
                  INSIGHTS
                </span>
                <span
                  className="w-16 h-px bg-[#141210]/20 dark:bg-white/20"
                  aria-hidden="true"
                />
              </div>

              <h2
                id="insights-heading"
                className="font-serif text-3xl sm:text-4xl font-normal leading-tight [text-wrap:balance]"
              >
                Learn. Ask. Stay Ahead.
              </h2>

              <p className="text-sm text-[#575149] dark:text-[#b5ada2] leading-relaxed">
                Real estate tips, market trends and lifestyle insights from The Middleman.
              </p>

              <button
                type="button"
                onClick={() => setActiveArticle(INSIGHTS[0])}
                className="pt-2 inline-flex items-center gap-2 text-xs font-medium hover:text-[#8a6d46] dark:hover:text-[#c8a97e] cursor-pointer"
              >
                <span>Browse Articles</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {INSIGHTS.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => setActiveArticle(article)}
                  className="text-left group bg-[#ebe6de] dark:bg-[#1c1916] border border-[#141210]/10 dark:border-white/10 hover:border-[#c8a97e] transition-colors cursor-pointer flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#1e1b18]">
                    <img
                      src={article.image}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <h3 className="font-serif text-lg leading-snug font-medium">
                      {article.title}
                    </h3>
                    <p className="text-[11px] text-[#6b645c] dark:text-[#a69e94] tabular-nums">
                      {article.date} · {article.readTime}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Band & Minimal Footer */}
      <section className="relative overflow-hidden bg-[#181512] text-[#f4f1ec] py-14 md:py-16 border-b border-white/10">
        <img
          src={HERO_INTERIOR_IMAGE}
          alt="Evening architectural lounge"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
        />
        <div className="relative max-w-[1280px] mx-auto px-5 md:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
              Let&apos;s Build Something Great Together.
            </h2>
            <p className="mt-2 text-sm text-[#f4f1ec]/75">
              Have a question? Explore properties or reach out directly.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTalk}
            className="inline-flex items-center gap-2.5 px-6 py-3 text-xs font-medium bg-[#f4f1ec] text-[#141210] hover:bg-[#c8a97e] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </section>

      <footer className="bg-[#0e0d0b] text-[#f4f1ec]/80 py-6">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-semibold text-[#f4f1ec]">AM</span>
            <span className="h-4 w-px bg-white/20" aria-hidden="true" />
            <span className="tracking-[0.2em] uppercase text-[11px]">ASK MIDDLEMAN</span>
          </div>

          <p className="text-[#f4f1ec]/65">Bridging Gaps. Building Success.</p>

          <p className="text-[11px] text-[#f4f1ec]/55 tabular-nums">
            © {new Date().getFullYear()} ASK MIDDLEMAN
          </p>
        </div>
      </footer>

      {/* Insight Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="insight-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-2xl bg-[#faf8f4] dark:bg-[#171513] text-[#141210] dark:text-[#f4f1ec] border border-[#141210]/15 dark:border-white/15 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#141210]/10 dark:border-white/10">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8a6d46] dark:text-[#c8a97e]">
                {activeArticle.category} · {activeArticle.date}
              </span>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Close article"
                className="w-9 h-9 inline-flex items-center justify-center border border-[#141210]/15 dark:border-white/15 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-[16/9] bg-[#1e1b18] overflow-hidden">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-4">
              <h3 id="insight-modal-title" className="font-serif text-3xl leading-tight">
                {activeArticle.title}
              </h3>
              <div className="space-y-3 text-sm leading-relaxed text-[#4f4942] dark:text-[#c7bfb5]">
                {activeArticle.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
