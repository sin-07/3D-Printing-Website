'use client';

import React, { useState } from 'react';
import SlaPrintSimulator from '@/components/3d/SlaPrintSimulator';
import RevealText from '@/components/animations/RevealText';
import { Cpu, Layers, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function TechnologySection() {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <section className="py-20 bg-obsidian-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>THE ENGINEERING BEHIND THE ART</span>
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
              0.015mm Slicing. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-gold-400 bg-clip-text text-transparent">
                Invisible Layer Lines.
              </span>
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-xs sm:text-sm text-titanium-400 mt-3 leading-relaxed">
              Standard consumer 3D printers print at 0.2mm layers leaving visible stair-stepping. Our industrial 16K SLA arrays cure at a microscopic 0.015mm (15 microns), delivering silky-smooth museum surfaces ready for Florentine gilding.
            </p>
          </RevealText>
        </div>

        {/* SLA Simulator Component */}
        <div className="mb-16">
          <SlaPrintSimulator />
        </div>

        {/* 3-Column Tech Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <span className="font-mono font-bold text-sm">01</span>
            </div>
            <h3 className="text-base font-bold text-foreground">16K Monochrome LCD Array</h3>
            <p className="text-xs text-titanium-400 leading-relaxed">
              Equipped with 15,360 × 8,640 pixel resolution and a parallel optical quartz matrix ensuring zero parallax beam divergence across large build plates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <span className="font-mono font-bold text-sm">02</span>
            </div>
            <h3 className="text-base font-bold text-foreground">Ceramic &amp; Titanium Infill</h3>
            <p className="text-xs text-titanium-400 leading-relaxed">
              Custom-blended photopolymers reinforced with sub-micron ceramic particles deliver substantial heft, thermal stability, and authentic cold-cast feel.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <span className="font-mono font-bold text-sm">03</span>
            </div>
            <h3 className="text-base font-bold text-foreground">Modular Neodymium Keying</h3>
            <p className="text-xs text-titanium-400 leading-relaxed">
              Multi-part assemblies utilize precision-toleranced N52 rare-earth magnetic keys for seamless tool-free assembly and ultra-sturdy display stability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
