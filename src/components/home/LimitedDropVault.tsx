'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { useCurrency } from '@/context/CurrencyContext';
import { useToast } from '@/context/ToastContext';
import RevealText from '@/components/animations/RevealText';
import { Clock, Flame, ShieldAlert, Sparkles, ArrowRight, Lock, Bell } from 'lucide-react';

export default function LimitedDropVault() {
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 12,
    minutes: 38,
    seconds: 45,
  });

  const [isNotified, setIsNotified] = useState(false);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dropProduct = PRODUCTS.find((p) => p.id === 'serpentus-mechanica') || PRODUCTS[0];

  const handleNotify = () => {
    setIsNotified(true);
    showToast(
      'Priority Alert Enabled',
      'You will receive an SMS & Email notification 15 minutes before the vault opens.',
      'gold'
    );
  };

  return (
    <section className="py-20 bg-obsidian-950 relative overflow-hidden border-t border-obsidian-800">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner container */}
        <div className="relative rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/40 p-8 sm:p-12 shadow-2xl overflow-hidden">
          {/* Top Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
              <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
              <span>UPCOMING ATELIER VAULT DROP</span>
            </div>

            <div className="text-xs font-mono text-titanium-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              <span>STRICT MAXIMUM 100 NUMBERED UNITS WORLDWIDE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Drop Details & Ticking Clock */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono text-gold-400 font-bold uppercase tracking-wider">
                  Mythic Tier 1/4 Scale • Serialized #001 to #100
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mt-2">
                  {dropProduct.name}
                </h2>
                <p className="text-sm text-titanium-300 mt-2 leading-relaxed max-w-xl">
                  {dropProduct.description}
                </p>
              </div>

              {/* Ticking Countdown Boxes */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md">
                <div className="p-3 sm:p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-700 text-center">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-gold-400 font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-titanium-400 block uppercase mt-1">Days</span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-700 text-center">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-gold-400 font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-titanium-400 block uppercase mt-1">Hours</span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-700 text-center">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-gold-400 font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-titanium-400 block uppercase mt-1">Mins</span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-obsidian-950/80 border border-gold-500/40 text-center shadow-gold-glow/20">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-gold-300 font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-gold-400 block uppercase mt-1">Secs</span>
                </div>
              </div>

              {/* Reservation & Notify Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleNotify}
                  className={`px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                    isNotified
                      ? 'bg-emerald-500 text-obsidian-950'
                      : 'bg-gold-500 text-obsidian-950 hover:brightness-110 shadow-gold-glow'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>{isNotified ? 'VIP Priority Alert Set' : 'Set VIP Drop Alert'}</span>
                </button>

                <Link
                  href={`/shop/${dropProduct.id}`}
                  className="px-6 py-3.5 rounded-full bg-obsidian-900 border border-obsidian-700 hover:border-gold-500/40 text-titanium-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <span>Inspect Prototype</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Drop Statue Teaser Image */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-obsidian-950 border border-gold-500/30 p-2 group shadow-2xl">
                <img
                  src={dropProduct.image}
                  alt={dropProduct.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-obsidian-900/90 backdrop-blur-md border border-obsidian-700 flex items-center justify-between text-xs font-mono">
                  <span className="text-titanium-300">ESTIMATED DROP PRICE</span>
                  <span className="text-gold-400 font-bold text-sm">
                    {formatPrice(dropProduct.basePrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
