'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown, Cpu, Zap, Activity } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[700px] flex flex-col justify-between overflow-hidden bg-neutral-950 text-white select-none">
      {/* Background Image: Warm Studio Workshop (Matching Reference Photo 1) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
        style={{ backgroundImage: "url('/images/loop_hero_workshop.jpg')" }}
      >
        {/* Subtle cinematic gradient overlay to ensure perfect typographic legibility */}
        <div className="absolute inset-0 bg-black/35 backdrop-brightness-[0.88]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      </div>

      {/* Top spacer for navbar */}
      <div className="pt-24" />

      {/* Main Centered Content: Clean Lowercase Typography (Exact Reference Match) */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center my-auto">
        <div className="gsap-hero-left inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono lowercase text-white/90 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>next-gen corexy additive manufacturing</span>
        </div>

        <h1 className="gsap-hero-left text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-medium tracking-[-0.04em] leading-[1.08] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)] lowercase max-w-4xl mx-auto">
          industrial 3d printing. desktop precision.
        </h1>

        {/* 3D Printer Logic Subtitle */}
        <p className="gsap-hero-right mt-5 text-sm sm:text-base text-white/85 font-normal tracking-wide lowercase max-w-2xl mx-auto drop-shadow-sm leading-relaxed">
          high-speed corexy extrusion, 0.08mm layer slicing, and carbon-fiber reinforced thermoplastics engineered for functional prototypes and end-use components.
        </p>

        {/* Minimalist CTA Pills */}
        <div className="gsap-hero-left mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#live-slicer"
            className="px-6 py-2.5 rounded-full bg-white text-neutral-950 text-xs sm:text-sm font-semibold lowercase tracking-tight hover:bg-neutral-200 transition-all shadow-md hover:scale-105"
          >
            test live slicer
          </Link>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-medium lowercase tracking-tight hover:bg-black/60 hover:border-white/60 transition-all hover:scale-105"
          >
            engineering showcase
          </Link>
          <Link
            href="/custom-print"
            className="px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium lowercase tracking-tight hover:bg-white/25 transition-all hover:scale-105"
          >
            upload cad file
          </Link>
        </div>

        {/* Hardware telemetry callouts */}
        <div className="gsap-hero-right mt-10 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-mono text-white/75 lowercase border-t border-white/10 pt-4">
          <span>500 mm/s travel</span>
          <span>•</span>
          <span>300°c all-metal hotend</span>
          <span>•</span>
          <span>±0.01mm metrology</span>
          <span>•</span>
          <span>input shaping</span>
        </div>
      </div>

      {/* Bottom Bar Indicator */}
      <div className="relative z-10 pb-8 flex items-center justify-center">
        <Link
          href="#how-it-works"
          className="flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors"
          aria-label="Scroll down to how it works"
        >
          <span className="text-[11px] font-mono lowercase tracking-widest">scroll</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </Link>
      </div>
    </section>
  );
}
