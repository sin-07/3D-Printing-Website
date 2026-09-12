'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { Shield, Box, Send, Award, CheckCircle, Flame, Layers, Cpu, Wrench } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      showToast('Priority Queue Confirmed', 'You will receive priority access for upcoming machine capacity allocations.', 'gold');
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-neutral-950 border-t border-neutral-900 pt-16 pb-12 overflow-hidden text-white select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Top Guarantee Cards (Minimalist Monochrome) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-neutral-900">
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-850 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-800 text-emerald-400 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-white lowercase">500 mm/s corexy</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5 lowercase">
                resonance-compensated motion with 20,000 mm/s² acceleration.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-850 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-800 text-amber-400 flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-white lowercase">±0.01mm metrology</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5 lowercase">
                caliper-verified bearing bores and sub-millimeter tolerances.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-850 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-800 text-blue-400 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-white lowercase">300°c carbon composites</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5 lowercase">
                pa-cf and petg-cf filaments delivering 115 mpa tensile strength.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-850 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-white lowercase">direct-to-print cad</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5 lowercase">
                instant automated slicing and quoting from step, stl, and obj files.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-neutral-900">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight lowercase text-white">
              <span>aetheris</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
            </Link>

            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed lowercase">
              high-precision 3d printing and additive manufacturing. carbon fiber composites, 0.01mm metrology, and direct cad-to-gcode slicing.
            </p>

            <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono lowercase">
              <span>print lab: cell 01 - 12</span>
              <span>•</span>
              <span>corexy &amp; 16k sla</span>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-mono font-medium text-neutral-400 lowercase tracking-wider mb-3.5">
              engineering catalog
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 lowercase">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  functional mechanisms
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  aerospace &amp; drone frames
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  industrial tooling &amp; soft jaws
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  carbon fiber pa-cf parts
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  flexible tpu end-effectors
                </Link>
              </li>
            </ul>
          </div>

          {/* Slicer & Services */}
          <div>
            <h4 className="text-xs font-mono font-medium text-neutral-400 lowercase tracking-wider mb-3.5">
              additive services
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 lowercase">
              <li>
                <Link href="/custom-print" className="hover:text-white transition-colors">
                  instant cad upload &amp; quote
                </Link>
              </li>
              <li>
                <Link href="/#live-slicer" className="hover:text-white transition-colors">
                  live 3d slicer engine
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  300°c hotend &amp; chamber specs
                </Link>
              </li>
              <li>
                <Link href="/#precision" className="hover:text-white transition-colors">
                  metrology &amp; tolerance sheet
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  production batch tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Priority Queue Access */}
          <div>
            <h4 className="text-xs font-mono font-medium text-neutral-400 lowercase tracking-wider mb-3.5">
              production priority
            </h4>
            <p className="text-xs text-neutral-400 mb-3 lowercase">
              receive priority machine cell queue and volume batch pricing updates.
            </p>
            {isSubscribed ? (
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs flex items-center gap-1.5 lowercase">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>priority queue confirmed</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 focus-within:border-neutral-500 transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="enter your engineering email"
                    required
                    className="w-full bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-none lowercase px-1"
                  />
                  <button
                    type="submit"
                    className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono lowercase">
          <p>© 2026 aetheris additive systems inc. all rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-neutral-400 transition-colors">
              machine telemetry api
            </Link>
            <Link href="/about" className="hover:text-neutral-400 transition-colors">
              material safety data (msds)
            </Link>
            <Link href="/about" className="hover:text-neutral-400 transition-colors">
              din en iso 9001
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
