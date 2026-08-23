'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Cpu, Layers, Sparkles, Activity } from 'lucide-react';

export default function SlaPrintSimulator() {
  const [progress, setProgress] = useState(42);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentLayer, setCurrentLayer] = useState(1480);
  const totalLayers = 3520;

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return Number((prev + 0.5).toFixed(1));
      });
      setCurrentLayer((prev) => {
        if (prev >= totalLayers) return 1;
        return prev + 18;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-obsidian-900 via-obsidian-850 to-obsidian-950 border border-obsidian-700/80 p-6 md:p-8 shadow-2xl overflow-hidden">
      {/* Background ambient UV glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-lg md:text-xl font-display font-bold text-foreground">
              16K SLA Photopolymer Vat Simulator
            </h3>
          </div>
          <p className="text-titanium-400 text-xs mt-1">
            Real-time optical laser curing at 0.015 mm per slice with nitrogen barrier.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-xs font-semibold text-gold-400 hover:text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={() => {
              setProgress(0);
              setCurrentLayer(1);
            }}
            className="p-1.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-titanium-400 hover:text-white transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Simulation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left: SLA Chamber Visualizer */}
        <div className="lg:col-span-7 relative h-72 md:h-80 bg-obsidian-950/80 rounded-xl border border-obsidian-700/60 overflow-hidden flex flex-col justify-end p-4">
          {/* Top Z-Axis Stepper Rails */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-obsidian-800/60 border-b border-obsidian-700 flex items-center justify-between px-4 text-[10px] font-mono text-titanium-400">
            <span>MICRON LEAD-SCREW: ±0.001mm</span>
            <span>DUAL LINEAR RAILS</span>
          </div>

          {/* Ascending Build Plate */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-48 transition-all duration-300 ease-out flex flex-col items-center"
            style={{
              bottom: `${Math.min(75, 20 + (progress / 100) * 55)}%`,
            }}
          >
            {/* Metal Build Plate */}
            <div className="w-full h-4 bg-gradient-to-r from-titanium-600 via-titanium-300 to-titanium-600 rounded-t shadow-lg flex items-center justify-center">
              <span className="text-[9px] font-mono text-obsidian-950 font-bold tracking-widest">
                BUILD PLATFORM
              </span>
            </div>

            {/* Emerging Resin Sculpture Model */}
            <div className="relative w-36 overflow-hidden flex flex-col items-center">
              <img
                src="/images/hero_sculpture.jpg"
                alt="3D Printing In Progress"
                className="w-32 h-44 object-cover rounded filter contrast-125 brightness-110 drop-shadow-[0_0_15px_rgba(157,78,221,0.6)]"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
                }}
              />
            </div>
          </div>

          {/* Active UV Laser Curing Interface (Resin Vat Surface) */}
          <div className="relative z-20 w-full h-16 bg-gradient-to-t from-purple-950/80 via-purple-900/40 to-transparent border-t-2 border-cyan-400/80 backdrop-blur-xs flex items-center justify-center">
            {/* Glowing Laser Scan Pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-shimmer" />
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold tracking-wider z-10">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>405nm MONOCHROME MATRIX EXPOSURE</span>
            </div>
          </div>
        </div>

        {/* Right: Live Telemetry & Print Analytics */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-obsidian-800/60 border border-obsidian-700/50">
            <div className="flex justify-between items-center text-xs text-titanium-300 mb-1.5 font-mono">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gold-400" />
                LAYER PROGRESS
              </span>
              <span className="text-gold-400 font-bold font-mono">
                {currentLayer.toLocaleString()} / {totalLayers.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2.5 bg-obsidian-950 rounded-full overflow-hidden border border-obsidian-700">
              <div
                className="h-full bg-gradient-to-r from-gold-500 via-amber-400 to-cyan-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-obsidian-800/40 border border-obsidian-700/40">
              <p className="text-[10px] text-titanium-400 font-mono">OPTICAL RESOLUTION</p>
              <p className="text-foreground font-bold font-mono text-sm mt-0.5">16K (15 Micron)</p>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-800/40 border border-obsidian-700/40">
              <p className="text-[10px] text-titanium-400 font-mono">Z-STEP LAYER HEIGHT</p>
              <p className="text-gold-400 font-bold font-mono text-sm mt-0.5">0.015 mm</p>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-800/40 border border-obsidian-700/40">
              <p className="text-[10px] text-titanium-400 font-mono">VAT TEMPERATURE</p>
              <p className="text-foreground font-bold font-mono text-sm mt-0.5">28.4 °C (Stable)</p>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-800/40 border border-obsidian-700/40">
              <p className="text-[10px] text-titanium-400 font-mono">NITROGEN PURGE</p>
              <p className="text-cyan-400 font-bold font-mono text-sm mt-0.5">99.8% Active</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center gap-3">
            <Activity className="w-5 h-5 text-gold-400 flex-shrink-0" />
            <p className="text-xs text-gold-200">
              Zero support artifacting on visible surfaces. Sub-surface scatter calibrated for bronze and alabaster finishes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
