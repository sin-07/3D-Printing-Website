'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Currency } from '@/types';
import MagneticButton from '@/components/animations/MagneticButton';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Globe,
  Layers,
  Box,
  Compass,
  Award,
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
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Masterpieces', href: '/shop', icon: Box },
    { name: 'Custom Studio', href: '/custom-print', icon: Layers },
    { name: 'The Atelier', href: '/about', icon: Award },
  ];

  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-obsidian-950/85 backdrop-blur-xl border-b border-gold-500/20 py-3.5 shadow-2xl'
          : 'bg-gradient-to-b from-obsidian-950/90 via-obsidian-950/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 via-gold-600 to-obsidian-900 p-0.5 shadow-gold-glow/40 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-obsidian-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold tracking-[0.2em] text-foreground text-sm sm:text-base group-hover:text-gold-300 transition-colors">
              AETHERIS
            </span>
            <span className="text-[9px] font-mono tracking-widest text-gold-400/80 uppercase">
              16K 3D Atelier
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-obsidian-900/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-obsidian-700/60 shadow-inner-light">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-1.5 text-xs font-medium tracking-wide rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-500 text-obsidian-950 font-semibold shadow-gold-glow/50'
                    : 'text-titanium-300 hover:text-white hover:bg-obsidian-800/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (Search, Currency, Wishlist, Cart, Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger Button */}
          <MagneticButton>
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-full bg-obsidian-900/80 border border-obsidian-700 text-titanium-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors flex items-center gap-2"
              title="Search masterworks (Cmd+K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline text-xs text-titanium-400 font-mono">
                Search <kbd className="text-[10px] bg-obsidian-800 px-1 py-0.5 rounded border border-obsidian-700">⌘K</kbd>
              </span>
            </button>
          </MagneticButton>

          {/* Currency Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="px-2.5 py-1.5 rounded-full bg-obsidian-900/80 border border-obsidian-700 text-xs font-mono text-titanium-300 hover:text-white hover:border-gold-500/40 flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-gold-400" />
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-titanium-400" />
            </button>

            {currencyDropdownOpen && (
              <div
                onMouseLeave={() => setCurrencyDropdownOpen(false)}
                className="absolute right-0 mt-2 w-28 rounded-xl bg-obsidian-900 border border-gold-500/30 backdrop-blur-xl shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150"
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
                        ? 'bg-gold-500 text-obsidian-950 font-bold'
                        : 'text-titanium-300 hover:bg-obsidian-800 hover:text-white'
                    }`}
                  >
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Link */}
          <MagneticButton>
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-full bg-obsidian-900/80 border border-obsidian-700 text-titanium-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors inline-block"
              title="Saved Vault"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 text-obsidian-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </MagneticButton>

          {/* Cart Drawer Trigger */}
          <MagneticButton>
            <button
              onClick={openCartDrawer}
              className="relative p-2.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 text-obsidian-950 font-bold shadow-gold-glow hover:brightness-110 transition-all duration-200 flex items-center gap-2"
              title="Masterpiece Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="text-xs font-mono font-black px-1">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </MagneticButton>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-obsidian-900 border border-obsidian-700 text-titanium-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-obsidian-950/95 border-b border-obsidian-700 backdrop-blur-2xl px-6 py-6 animate-in slide-in-from-top duration-200 flex flex-col gap-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-gold-500 text-obsidian-950 font-semibold'
                    : 'text-titanium-300 hover:bg-obsidian-900 hover:text-white'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Currency & Quick Actions */}
          <div className="pt-4 border-t border-obsidian-800 flex items-center justify-between">
            <span className="text-xs font-mono text-titanium-400">SELECT CURRENCY</span>
            <div className="flex items-center gap-1">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 text-xs font-mono rounded ${
                    currency === c ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-titanium-400'
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
