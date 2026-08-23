'use client';

import React from 'react';
import StatueViewer from '@/components/3d/StatueViewer';
import RevealText from '@/components/animations/RevealText';
import { Sparkles, Layers, ShieldCheck, Cpu } from 'lucide-react';

export default function InteractiveStudio() {
  return (
    <section className="py-20 bg-obsidian-950 relative overflow-hidden border-t border-b border-obsidian-800">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE 3D MATERIAL LAB</span>
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
              Explore Our Signature <br />
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 bg-clip-text text-transparent">
                Resin &amp; Metal Finishes
              </span>
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-xs sm:text-sm text-titanium-400 mt-3 leading-relaxed">
              Interact with our real-time 3D turntable viewer. Toggle between 24K Gilded Gold Leaf, Obsidian Onyx, Antique Bronze Patina, and Cyberpunk Chameleon Chromes under studio illumination.
            </p>
          </RevealText>
        </div>

        {/* 3D Statue Viewer Turntable */}
        <div className="max-w-5xl mx-auto">
          <StatueViewer
            initialMaterial="24K Gilded Gold Leaf"
            height="520px"
            className="shadow-2xl border-gold-500/30"
          />
        </div>

        {/* Feature Cards below 3D */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
          <div className="p-5 rounded-xl bg-obsidian-900/60 border border-obsidian-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-foreground">16K Optical Matrix</h4>
            </div>
            <p className="text-xs text-titanium-400 leading-relaxed">
              Photons focused through quartz optical lenses eliminate pixel step distortion even on razor-sharp wing feathers and armor edges.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-obsidian-900/60 border border-obsidian-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-foreground">Multi-Stage UV Annealing</h4>
            </div>
            <p className="text-xs text-titanium-400 leading-relaxed">
              Thermal chamber baking and nitrogen bath UV exposure permanently stabilize resin polymers against warping, UV yellowing, or brittle wear.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-obsidian-900/60 border border-obsidian-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-foreground">Hand-Gilded by Artisans</h4>
            </div>
            <p className="text-xs text-titanium-400 leading-relaxed">
              Each limited run is hand-inspected, airbrushed with custom automotive pigments, and accented with real Florentine 24K gold leaf.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
