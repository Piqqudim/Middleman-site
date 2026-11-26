import React, { useState } from 'react';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';

export type NavSectionId = 'home' | 'listings' | 'agents' | 'mortgage' | 'dashboard';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (section: NavSectionId) => void;
  onOpenTalk: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const NAV_ITEMS: { id: NavSectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'listings', label: 'Listings' },
  { id: 'agents', label: 'Agents' },
  { id: 'mortgage', label: 'Mortgage' },
  { id: 'dashboard', label: 'Dashboard' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenTalk,
  isDark,
  onToggleTheme,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (id: NavSectionId) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#11100e]/95 backdrop-blur-md border-b border-white/10 text-[#f4f1ec]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="flex items-center gap-3.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c8a97e]"
        >
          <span className="font-serif text-2xl md:text-[28px] font-semibold tracking-tight leading-none text-[#f4f1ec]">
            AM
          </span>
          <span className="h-5 w-px bg-white/25" aria-hidden="true" />
          <span className="text-[11px] tracking-[0.22em] font-medium text-[#f4f1ec]/90 uppercase">
            ASK MIDDLEMAN
          </span>
        </a>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-normal"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c8a97e] ${
                  isActive
                    ? 'text-[#f4f1ec]'
                    : 'text-[#f4f1ec]/70 hover:text-[#f4f1ec]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-px bg-[#c8a97e] transition-opacity duration-150 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action (Desktop) + Mobile Menu Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenTalk}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 text-xs font-medium tracking-wide border border-[#c8a97e]/60 rounded-full text-[#f4f1ec] hover:bg-[#c8a97e] hover:text-[#141210] hover:border-[#c8a97e] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a97e]"
          >
            <span>Let&apos;s Talk</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#f4f1ec] border border-white/15 hover:border-[#c8a97e]/60 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#141210] px-5 py-5 space-y-2">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.id);
                  }}
                  className={`flex items-center justify-between min-h-[44px] py-2.5 border-b border-white/10 text-base ${
                    isActive ? 'text-[#c8a97e] font-medium' : 'text-[#f4f1ec]/85'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-60" aria-hidden="true" />
                </a>
              );
            })}
          </nav>

          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm border border-white/20 text-[#f4f1ec] hover:border-[#c8a97e] transition-colors cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-[#c8a97e]" aria-hidden="true" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#c8a97e]" aria-hidden="true" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenTalk();
              }}
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#c8a97e] text-[#141210] cursor-pointer"
            >
              <span>Let&apos;s Talk</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
