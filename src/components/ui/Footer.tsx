'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { Sparkles, Shield, Box, Send, Globe, Award, Layers, CheckCircle } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      showToast('VIP Drop Access Confirmed', 'You will receive priority access 2 hours before general public.', 'gold');
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-obsidian-950 border-t border-gold-500/20 pt-16 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-12 border-b border-obsidian-800">
          <div className="p-4 rounded-xl bg-obsidian-900/60 border border-obsidian-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">16K SLA Photopolymer</h4>
              <p className="text-[11px] text-titanium-400 mt-0.5">
                0.015mm layer slicing with imperceptible surface layering.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900/60 border border-obsidian-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Serialized Authenticity</h4>
              <p className="text-[11px] text-titanium-400 mt-0.5">
                Every unit includes an embedded cryptographic NFC metal card.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900/60 border border-obsidian-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Hard-Shell Flight Crates</h4>
              <p className="text-[11px] text-titanium-400 mt-0.5">
                Custom laser-cut EVA foam cases for 100% damage-proof transit.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900/60 border border-obsidian-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">White-Glove Guarantee</h4>
              <p className="text-[11px] text-titanium-400 mt-0.5">
                Full replacement insurance on all worldwide crated shipments.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-obsidian-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 via-gold-600 to-obsidian-900 p-0.5">
                <div className="w-full h-full bg-obsidian-950 rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                </div>
              </div>
              <span className="font-display font-bold tracking-[0.2em] text-foreground text-lg">
                AETHERIS ATELIER
              </span>
            </Link>

            <p className="text-xs text-titanium-400 max-w-sm leading-relaxed">
              Pioneering hyper-detailed 3D sculpture engineering. Merging aerospace-grade photopolymers, Florentine gilding, and fine arts master sculpting.
            </p>

            <div className="flex items-center gap-3 text-xs text-titanium-400 font-mono">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-gold-400" /> Atelier: Kyoto &amp; Zurich
              </span>
              <span>•</span>
              <span>16K SLA Lab 405nm</span>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-xs font-mono font-bold text-gold-400 tracking-wider uppercase mb-3">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-titanium-300">
              <li>
                <Link href="/shop" className="hover:text-gold-300 transition-colors">
                  Mythology &amp; Seraphs
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold-300 transition-colors">
                  Cyberpunk &amp; Neo-Tokyo
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold-300 transition-colors">
                  Eldritch &amp; Dark Gothic
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold-300 transition-colors">
                  Museum Busts &amp; Kintsugi
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold-300 transition-colors">
                  Vault Limited Drops
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier Services */}
          <div>
            <h4 className="text-xs font-mono font-bold text-gold-400 tracking-wider uppercase mb-3">
              Atelier Services
            </h4>
            <ul className="space-y-2 text-xs text-titanium-300">
              <li>
                <Link href="/custom-print" className="hover:text-gold-300 transition-colors">
                  Custom 3D Commission Lab
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  16K Photopolymer Tech
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  Hand-Gilding Process
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-gold-300 transition-colors">
                  Collector Saved Vault
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-gold-300 transition-colors">
                  Crated Shipping Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* VIP Newsletter */}
          <div>
            <h4 className="text-xs font-mono font-bold text-gold-400 tracking-wider uppercase mb-3">
              VIP Drop Access
            </h4>
            <p className="text-xs text-titanium-400 mb-3">
              Receive private reservation links 2 hours before limited runs are opened.
            </p>
            {isSubscribed ? (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Priority Access Activated</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="collector@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-obsidian-900 border border-obsidian-700 rounded-lg text-foreground placeholder-titanium-500 focus:outline-none focus:border-gold-500/50"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-gold-500 text-obsidian-950 rounded-md font-bold hover:brightness-110 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-titanium-500">
                  Strictly zero spam. Maximum 1 notification per exclusive drop.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright & certification */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-titanium-400 font-mono">
          <p>© 2026 AETHERIS 3D ATELIER. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>16K SLA CERTIFIED</span>
            <span>•</span>
            <span>NFC CRYPTO KEYS</span>
            <span>•</span>
            <span>BIODEGRADABLE BIO-RESIN COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
