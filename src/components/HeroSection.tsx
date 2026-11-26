import React from 'react';
import {
  ArrowRight,
  Calculator,
  LayoutDashboard,
  MapPin,
  Moon,
  Sun,
  UserCheck,
} from 'lucide-react';

const OWNER_HERO_IMAGE =
  '/assets/aistudio/WhatsApp_Image_2026-11-26_at_06.14.43__1__d35f62c1.jpeg';

interface HeroSectionProps {
  onExploreListings: () => void;
  onOpenMapView: () => void;
  onOpenCalculator: () => void;
  onOpenDashboard: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  userDisplayName: string | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreListings,
  onOpenMapView,
  onOpenCalculator,
  onOpenDashboard,
  isDark,
  onToggleTheme,
  userDisplayName,
}) => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0b0a09] text-[#f4f1ec] border-b border-white/10"
    >
      {/* Desktop Full-Bleed Owner Hero Composition (coordinate-locked aspect wrapper masks baked-in left text & top bar) */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none select-none"
      >
        <div className="relative h-full w-full">
          <div className="absolute right-0 bottom-0 h-[106%] aspect-[1170/471] max-w-none">
            <img
              src={OWNER_HERO_IMAGE}
              alt="Darlington, founder of Ask Middleman, in monochrome editorial portrait"
              className="w-full h-full object-cover object-center"
            />
            {/* Mask baked-in left typography (0-48% of source image) into solid #0b0a09 */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, #0b0a09 0%, #0b0a09 47.5%, rgba(11,10,9,0.94) 50.5%, rgba(11,10,9,0.45) 54.5%, rgba(11,10,9,0) 60%)',
              }}
            />
            {/* Mask baked-in top navbar (0-12% of source image) cleanly above cap crown */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, #0b0a09 0%, #0b0a09 8.5%, rgba(11,10,9,0.88) 11.5%, rgba(11,10,9,0) 17.5%)',
              }}
            />
            {/* Mask top-right baked-in CTA pill edge cleanly into dark sky without bounding seam */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(240px 85px at 94% 5%, #0b0a09 45%, rgba(11,10,9,0.75) 68%, rgba(11,10,9,0) 100%)',
              }}
            />
          </div>
          {/* Extra left-side solid & feathered protection for narrower desktop screens */}
          <div
            className="absolute inset-y-0 left-0 w-[56%]"
            style={{
              background:
                'linear-gradient(90deg, #0b0a09 0%, #0b0a09 62%, rgba(11,10,9,0.75) 82%, rgba(11,10,9,0) 100%)',
            }}
          />
          {/* Subtle bottom fade behind the workspace utility strip */}
          <div
            className="absolute inset-x-0 bottom-0 h-20"
            style={{
              background:
                'linear-gradient(180deg, rgba(11,10,9,0) 0%, rgba(11,10,9,0.65) 100%)',
            }}
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-10 pt-10 sm:pt-14 md:pt-20">
        <div className="md:min-h-[430px] lg:min-h-[480px] flex flex-col justify-center pb-6 md:pb-16">
          <div className="max-w-xl lg:max-w-[560px]">
            <div className="flex items-center gap-4 mb-5 md:mb-6">
              <span className="text-[11px] tracking-[0.24em] uppercase text-[#c8a97e] font-medium">
                ASK MIDDLEMAN
              </span>
              <span className="w-16 h-px bg-[#c8a97e]/45" aria-hidden="true" />
            </div>

            <h1 className="font-serif text-[44px] sm:text-[54px] lg:text-[66px] leading-[1.03] tracking-[-0.015em] font-normal text-[#f4f1ec] [text-wrap:balance]">
              Real Estate.
              <br />
              Business.{' '}
              <em className="italic font-normal text-[#c8a97e]">Lifestyle.</em>
            </h1>

            <p className="mt-5 md:mt-6 text-base md:text-[17px] leading-relaxed text-[#f4f1ec]/75 max-w-md">
              Building wealth through strategic real estate, premium apartments and smart
              investments.
            </p>

            <div className="mt-8 md:mt-9 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreListings}
                className="inline-flex items-center gap-3 px-6 py-3.5 text-sm font-medium border border-[#c8a97e]/65 text-[#f4f1ec] hover:bg-[#c8a97e] hover:text-[#141210] hover:border-[#c8a97e] transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a97e]"
              >
                <span>Explore Listings</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onOpenMapView}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm text-[#f4f1ec]/80 hover:text-[#c8a97e] border border-white/15 hover:border-[#c8a97e]/50 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
              >
                <MapPin className="w-4 h-4 text-[#c8a97e]" aria-hidden="true" />
                <span>Interactive Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Seamless Full-Bleed Portrait Spread (< md) */}
      <div
        aria-hidden="true"
        className="md:hidden relative w-full h-[270px] -mt-2 overflow-hidden pointer-events-none select-none"
      >
        <div className="absolute right-[-36px] bottom-0 h-[112%] aspect-[1170/471] max-w-none">
          <img
            src={OWNER_HERO_IMAGE}
            alt="Darlington, founder of Ask Middleman, in monochrome editorial portrait"
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, #0b0a09 0%, #0b0a09 47.5%, rgba(11,10,9,0.9) 50.5%, rgba(11,10,9,0) 58%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, #0b0a09 0%, #0b0a09 10%, rgba(11,10,9,0.85) 14%, rgba(11,10,9,0) 24%)',
            }}
          />
        </div>
        <div
          className="absolute inset-x-0 top-0 h-14"
          style={{
            background: 'linear-gradient(180deg, #0b0a09 0%, rgba(11,10,9,0) 100%)',
          }}
        />
      </div>

      {/* Sleek Workspace Utility Strip anchored across Hero Bottom */}
      <div className="relative z-10 bg-[#0b0a09]/85 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-6 text-[#f4f1ec]/75">
            <span className="tabular-nums">Benin City · Lagos · Abuja</span>
            <span aria-hidden="true" className="hidden sm:inline text-white/25">
              |
            </span>
            <button
              type="button"
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-1.5 hover:text-[#c8a97e] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Calculator className="w-3.5 h-3.5 text-[#c8a97e]" aria-hidden="true" />
              <span>Mortgage &amp; Yield Calculator</span>
            </button>
            <button
              type="button"
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-1.5 hover:text-[#c8a97e] transition-colors cursor-pointer whitespace-nowrap"
            >
              {userDisplayName ? (
                <UserCheck className="w-3.5 h-3.5 text-[#c8a97e]" aria-hidden="true" />
              ) : (
                <LayoutDashboard className="w-3.5 h-3.5 text-[#c8a97e]" aria-hidden="true" />
              )}
              <span>
                {userDisplayName
                  ? `Dashboard · ${userDisplayName.split(' ')[0]}`
                  : 'Application Status Dashboard'}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-white/20 hover:border-[#c8a97e] text-[#f4f1ec] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#c8a97e]" aria-hidden="true" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#c8a97e]" aria-hidden="true" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
