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
  Menu,
  X,
  ChevronDown,
  Globe,
  ArrowUpRight,
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
}

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

        {/* Center/Right: Desktop Navigation Links (Exact reference aesthetic) */}
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

        {/* Right Actions: Currency, Search, Wishlist, Cart */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Currency Switcher */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono flex items-center gap-1 transition-colors border ${
                isHeroHome
                  ? 'border-white/25 text-white/90 hover:bg-white/10'
                  : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>{currency}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {currencyDropdownOpen && (
              <div
                onMouseLeave={() => setCurrencyDropdownOpen(false)}
                className="absolute right-0 mt-2 w-28 rounded-xl bg-white border border-neutral-200 text-neutral-900 shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center justify-between ${
                      currency === c
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
                    }`}
                  >
                    <span>{c}</span>
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isHeroHome
                ? 'text-white hover:bg-white/10'
                : 'text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-neutral-900 border-b border-neutral-200 px-6 py-6 animate-in slide-in-from-top duration-200 shadow-2xl flex flex-col gap-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium lowercase text-neutral-800 hover:bg-neutral-100 hover:text-black transition-colors"
              >
                <span>{link.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-500 uppercase">currency</span>
            <div className="flex items-center gap-1">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 text-xs font-mono rounded ${
                    currency === c ? 'bg-black text-white font-bold' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
