'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Currency } from '@/types';
import {
  ShoppingBag,
  Heart,
  Search,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
}

const CURRENCY_CONFIG: Record<Currency, { symbol: string; code: string; label: string; short: string }> = {
  INR: { symbol: '₹', code: 'INR', label: 'Rupees (INR)', short: '₹ INR' },
  USD: { symbol: '$', code: 'USD', label: 'US Dollar (USD)', short: '$ USD' },
  EUR: { symbol: '€', code: 'EUR', label: 'Euro (EUR)', short: '€ EUR' },
  GBP: { symbol: '£', code: 'GBP', label: 'Pound (GBP)', short: '£ GBP' },
};

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const { totalItemsCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { currency, setCurrency } = useCurrency();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isHeroHome = pathname === '/' && !isScrolled;

  const navLinks = [
    { name: 'how it works', href: '/#how-it-works' },
    { name: 'hardware', href: '/#features' },
    { name: 'live slicer', href: '/#live-slicer' },
    { name: 'engineering parts', href: '/shop' },
    { name: 'cad upload', href: '/custom-print' },
  ];

  const currencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHeroHome
          ? 'bg-transparent text-white py-6'
          : 'bg-white/95 text-neutral-900 backdrop-blur-md border-b border-neutral-150/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Left: Minimal Lowercase Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-2xl sm:text-3xl font-bold tracking-tighter lowercase transition-opacity hover:opacity-80"
        >
          <span>aetheris</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block translate-y-0.5"></span>
        </Link>

        {/* Center/Right: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs sm:text-sm font-normal lowercase tracking-normal transition-colors duration-150 ${
                isHeroHome
                  ? 'text-white/90 hover:text-white'
                  : 'text-neutral-700 hover:text-black font-medium'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Currency, Search, Wishlist, Cart, Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Desktop Currency Switcher with INR ₹ Highlight */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors border shadow-2xs ${
                isHeroHome
                  ? 'border-white/25 text-white/90 hover:bg-white/10'
                  : 'border-neutral-200 text-neutral-800 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <span className="font-bold text-amber-500 text-sm leading-none">
                {CURRENCY_CONFIG[currency]?.symbol || '₹'}
              </span>
              <span className="font-semibold">{currency}</span>
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
            </button>

            {currencyDropdownOpen && (
              <div
                onMouseLeave={() => setCurrencyDropdownOpen(false)}
                className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-neutral-200 text-neutral-900 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                  Select Currency
                </div>
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-mono rounded-xl transition-all flex items-center justify-between ${
                      currency === c
                        ? 'bg-neutral-950 text-white font-bold shadow-sm'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-4 text-center font-bold text-sm ${currency === c ? 'text-amber-400' : 'text-amber-600'}`}>
                        {CURRENCY_CONFIG[c].symbol}
                      </span>
                      <span>{CURRENCY_CONFIG[c].label}</span>
                    </div>
                    {currency === c && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className={`p-2 rounded-full transition-colors ${
              isHeroHome
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
            title="Search (Cmd+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={`relative p-2 rounded-full transition-colors ${
              isHeroHome
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={openCartDrawer}
            className={`relative p-2 rounded-full flex items-center gap-1.5 transition-colors ${
              isHeroHome
                ? 'text-white hover:bg-white/10'
                : 'text-neutral-900 hover:bg-neutral-100'
            }`}
            title="Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-mono font-semibold">
              ({totalItemsCount})
            </span>
          </button>

          {/* Animated Hamburger <-> Cross Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className={`md:hidden relative w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-[5px] transition-colors focus:outline-none ${
              isHeroHome && !mobileMenuOpen
                ? 'text-white hover:bg-white/10'
                : 'text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {/* Top Bar (morphs to 45deg diagonal) */}
            <span
              className={`w-5 h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                isHeroHome && !mobileMenuOpen ? 'bg-white' : 'bg-neutral-900'
              } ${
                mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : 'rotate-0 translate-y-0'
              }`}
            />
            {/* Middle Bar (scales to 0 and fades out) */}
            <span
              className={`w-5 h-[2px] rounded-full transition-all duration-200 ease-out ${
                isHeroHome && !mobileMenuOpen ? 'bg-white' : 'bg-neutral-900'
              } ${
                mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`}
            />
            {/* Bottom Bar (morphs to -45deg diagonal) */}
            <span
              className={`w-5 h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                isHeroHome && !mobileMenuOpen ? 'bg-white' : 'bg-neutral-900'
              } ${
                mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : 'rotate-0 translate-y-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Animated Slide/Fade & Staggered Link Entry */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen
            ? 'max-h-[550px] opacity-100 border-b border-neutral-200 shadow-2xl bg-white/98 backdrop-blur-2xl'
            : 'max-h-0 opacity-0 pointer-events-none border-b-0'
        }`}
      >
        <div className="px-6 pt-4 pb-6 flex flex-col gap-4">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  transitionDelay: mobileMenuOpen ? `${idx * 40 + 40}ms` : '0ms',
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium lowercase text-neutral-800 hover:bg-neutral-100 hover:text-black transition-all duration-300 transform ${
                  mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70" />
                  <span>{link.name}</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
              </Link>
            ))}
          </nav>

          {/* Mobile Currency Selector with prominent INR ₹ option */}
          <div className="pt-4 border-t border-neutral-150 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                Select Currency
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Active: {CURRENCY_CONFIG[currency]?.symbol} {currency}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-2 text-xs font-mono rounded-xl border flex items-center justify-between transition-all ${
                    currency === c
                      ? 'bg-neutral-950 text-white border-neutral-950 font-bold shadow-md scale-[1.02]'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`font-bold text-sm ${currency === c ? 'text-amber-400' : 'text-amber-600'}`}>
                      {CURRENCY_CONFIG[c].symbol}
                    </span>
                    <span>{c === 'INR' ? '₹ Rupees' : CURRENCY_CONFIG[c].label.split(' ')[0]}</span>
                  </span>
                  <span className="text-[10px] opacity-60 uppercase">{c}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
