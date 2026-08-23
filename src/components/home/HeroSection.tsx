'use client';

import React from 'react';
import Link from 'next/link';
import HeroStatueCanvas from '@/components/3d/HeroStatueCanvas';
import MagneticButton from '@/components/animations/MagneticButton';
import RevealText from '@/components/animations/RevealText';
import { ArrowRight, Sparkles, Layers, ShieldCheck, Box, Compass } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Cinematic Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <RevealText delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-900/90 border border-gold-500/40 shadow-gold-glow/20">
                <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-gold-300 tracking-widest uppercase">
                  16K SLA Photopolymer Precision
                </span>
              </div>
            </RevealText>

            {/* Main Headline */}
            <RevealText delay={0.2}>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-display font-black tracking-tight text-foreground leading-[1.08]">
                Masterwork <br />
                <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                  3D Sculptures
                </span>{' '}
                <br />
                &amp; Collectibles.
              </h1>
            </RevealText>

            {/* Subheading */}
            <RevealText delay={0.3}>
              <p className="text-sm sm:text-base text-titanium-300 max-w-xl leading-relaxed mx-auto lg:mx-0">
                Elevating 3D printing into fine art. Aerospace-grade resins cured at{' '}
                <span className="text-gold-400 font-semibold font-mono">0.015mm layers</span>, hand-finished in 24K gold leaf, cold-cast bronze, and serialized for elite collectors worldwide.
              </p>
            </RevealText>

            {/* CTAs */}
            <RevealText delay={0.4}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <MagneticButton>
                  <Link
                    href="/shop"
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:brightness-110 shadow-gold-glow hover:scale-105 transition-all duration-300"
                  >
                    <span>Acquire Masterpieces</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </MagneticButton>

                <MagneticButton>
                  <Link
                    href="/custom-print"
                    className="px-8 py-4 rounded-full bg-obsidian-900/90 border border-gold-500/40 text-gold-300 hover:text-white hover:bg-obsidian-800 font-semibold text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  >
                    <Layers className="w-4 h-4 text-gold-400" />
                    <span>Custom Commission Lab</span>
                  </Link>
                </MagneticButton>
              </div>
            </RevealText>

            {/* Micro Highlights */}
            <RevealText delay={0.5}>
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-titanium-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gold-400" /> NFC Serialized
                </span>
                <span className="text-obsidian-700">•</span>
                <span className="flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-gold-400" /> Flight Case Transit
                </span>
                <span className="text-obsidian-700">•</span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-400" /> Hand-Gilded Finish
                </span>
              </div>
            </RevealText>
          </div>

          {/* Right Column: Interactive 3D Canvas Showcase & Hero Masterpiece */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl p-1 bg-gradient-to-b from-gold-500/40 via-obsidian-800 to-obsidian-950 shadow-2xl shadow-gold-500/10">
              <div className="w-full h-full rounded-[22px] bg-obsidian-950/90 overflow-hidden relative backdrop-blur-xl flex items-center justify-center">
                {/* 3D Interactive Canvas */}
                <div className="absolute inset-0 z-10">
                  <HeroStatueCanvas />
                </div>

                {/* Hero Statue Image Overlay with Depth Blend */}
                <div className="relative z-0 w-4/5 h-4/5 pointer-events-none opacity-90 flex items-center justify-center">
                  <img
                    src="/images/hero_sculpture.jpg"
                    alt="Seraphim Archlyte Masterpiece"
                    className="w-full h-full object-contain filter contrast-110 drop-shadow-[0_20px_35px_rgba(212,175,55,0.25)]"
                  />
                </div>

                {/* Interactive Drag Hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-obsidian-900/90 backdrop-blur-md border border-gold-500/30 text-[10px] font-mono text-gold-300 whitespace-nowrap flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-gold-400 animate-spin-slow" />
                  <span>3D Interactive Gyro Matrix</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Live Metrics Ticker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-obsidian-900/70 border border-obsidian-800 backdrop-blur-xl">
          <div className="text-center p-2">
            <p className="text-xl sm:text-2xl font-display font-bold text-gold-400 font-mono">16K SLA</p>
            <p className="text-[11px] text-titanium-400 font-mono mt-0.5">Ultra-HD Photopolymer</p>
          </div>
          <div className="text-center p-2 border-l border-obsidian-800">
            <p className="text-xl sm:text-2xl font-display font-bold text-gold-400 font-mono">0.015 mm</p>
            <p className="text-[11px] text-titanium-400 font-mono mt-0.5">Micro Layer Precision</p>
          </div>
          <div className="text-center p-2 border-l border-obsidian-800">
            <p className="text-xl sm:text-2xl font-display font-bold text-gold-400 font-mono">100%</p>
            <p className="text-[11px] text-titanium-400 font-mono mt-0.5">Damage-Proof Crated Transit</p>
          </div>
          <div className="text-center p-2 border-l border-obsidian-800">
            <p className="text-xl sm:text-2xl font-display font-bold text-gold-400 font-mono">4.98 / 5</p>
            <p className="text-[11px] text-titanium-400 font-mono mt-0.5">Collector Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
}
