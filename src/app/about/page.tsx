'use client';

import React from 'react';
import Link from 'next/link';
import RevealText from '@/components/animations/RevealText';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  Globe,
  ArrowRight,
  Leaf,
  Boxes,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>THE CRAFT &amp; PHILOSOPHY</span>
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground">
              Where Ancient Sculpture <br />
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 bg-clip-text text-transparent">
                Meets 16K Quantum SLA
              </span>
            </h1>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-xs sm:text-sm text-titanium-400 mt-4 leading-relaxed">
              Founded across studios in Kyoto and Zurich, Aetheris Atelier was born to dismantle the boundary between digital parametric geometry and classical fine arts bronze casting.
            </p>
          </RevealText>
        </div>

        {/* 2-Column Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <RevealText>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                The 15-Micron Standard
              </h2>
            </RevealText>

            <RevealText delay={0.1}>
              <p className="text-xs sm:text-sm text-titanium-300 leading-relaxed">
                Most commercial 3D printing operates with visible layer striations and lightweight hollow plastics. At Aetheris, every masterwork is sliced at <strong className="text-gold-400 font-mono">0.015mm per layer</strong> using high-intensity 405nm monochrome optical arrays in a nitrogen-purged atmosphere.
              </p>
            </RevealText>

            <RevealText delay={0.2}>
              <p className="text-xs sm:text-sm text-titanium-300 leading-relaxed">
                By infusing our proprietary resins with microscopic ceramic and titanium particles, each piece possesses the cool, heavy tactile presence of museum-cast stone while capturing details as subtle as skin pores and microscopic runic inscriptions.
              </p>
            </RevealText>

            <RevealText delay={0.3}>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-obsidian-900/60 border border-obsidian-800">
                  <span className="text-2xl font-display font-bold text-gold-400 font-mono">15,360px</span>
                  <span className="text-[11px] text-titanium-400 font-mono block mt-0.5">
                    16K Screen Resolution
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-obsidian-900/60 border border-obsidian-800">
                  <span className="text-2xl font-display font-bold text-gold-400 font-mono">0.015mm</span>
                  <span className="text-[11px] text-titanium-400 font-mono block mt-0.5">
                    Layer Height Slicing
                  </span>
                </div>
              </div>
            </RevealText>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-obsidian-900 border border-gold-500/30 p-2 shadow-2xl">
              <img
                src="/images/hero_sculpture.jpg"
                alt="Aetheris 3D Printing Atelier Craft"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-8 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-foreground">
              Florentine Hand-Gilding
            </h3>
            <p className="text-xs text-titanium-400 leading-relaxed">
              Every gold accent is individually applied by guild artisans using genuine 24-karat Florentine gold leaf, burnished with agate stones and sealed with scratch-resistant crystal clear coat.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-foreground">
              Encrypted NFC Provenance
            </h3>
            <p className="text-xs text-titanium-400 leading-relaxed">
              We reject paper certificates that can be forged. Every statue includes a solid brushed-titanium certificate embedded with an encrypted NFC hardware chip registered to our provenance database.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-foreground">
              Bio-Resin Sustainability
            </h3>
            <p className="text-xs text-titanium-400 leading-relaxed">
              Our polymer formulations are synthesized from over 45% bio-based soybean and plant-derived monomers, completely free of heavy-metal catalysts and packaged in 100% recyclable wooden crates.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/30 text-center space-y-6 max-w-3xl mx-auto shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Commission or Acquire a Masterpiece
          </h2>
          <p className="text-xs text-titanium-300 max-w-md mx-auto leading-relaxed">
            Explore our limited edition numbered gallery or submit your bespoke 3D model for artisan engineering.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="px-8 py-3.5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-glow flex items-center gap-2"
            >
              <span>Browse The Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/custom-print"
              className="px-8 py-3.5 rounded-full bg-obsidian-950 border border-obsidian-700 text-titanium-300 hover:text-white text-xs font-semibold uppercase tracking-wider"
            >
              <span>Custom 3D Commission</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
