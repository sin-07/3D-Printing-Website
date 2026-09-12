'use client';

import React, { useState } from 'react';
import { Volume2, ShieldCheck, Thermometer, Cpu, Flame, Layers } from 'lucide-react';

export default function HardwareChamberSection() {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const features = [
    {
      icon: Volume2,
      label: '<32 dB acoustic dampening',
      detail: 'closed-loop 48v silent drivers with input shaping cancel resonance frequencies.',
    },
    {
      icon: Flame,
      label: '300°c all-metal hotend',
      detail: 'ceramic heater with hardened steel cht nozzle outputs up to 32 mm³/s volumetric flow.',
    },
    {
      icon: Thermometer,
      label: '110°c magnetic pei bed',
      detail: 'textured spring steel flex plate with 36-point automatic dual load-cell leveling.',
    },
    {
      icon: ShieldCheck,
      label: 'hermetic hepa + carbon filter',
      detail: 'sealed chamber with negative pressure scrubbing removes 99.9% ultrafine particles and vocs.',
    },
  ];

  return (
    <section
      id="features"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-neutral-950 text-white select-none py-20 sm:py-28"
    >
      {/* Background Image: Dark Industrial Hardware Chamber with Amber Glow (Matching Photo 4) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/loop_hardware_chamber.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-brightness-[0.88]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70" />
      </div>

      {/* Top Headline */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono lowercase text-neutral-300 mb-4">
          <span>hardware architecture &amp; kinematics</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.03em] lowercase text-white drop-shadow-lg">
          quiet &amp; powerful extrusion
        </h2>
        <p className="mt-4 text-sm sm:text-base text-white/80 font-normal lowercase max-w-lg mx-auto">
          high-temperature additive manufacturing engineered inside an acoustically isolated, hermetically sealed enclosure.
        </p>
      </div>

      {/* Center visual focus area */}
      <div className="flex-1 min-h-[160px] sm:min-h-[240px]" />

      {/* Bottom Spec Pills */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {features.map((feat, idx) => (
            <div
              key={feat.label}
              onMouseEnter={() => setActiveTab(idx)}
              onMouseLeave={() => setActiveTab(null)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer backdrop-blur-md ${
                activeTab === idx
                  ? 'bg-white text-black border-white shadow-xl scale-[1.03]'
                  : 'bg-black/60 border-white/20 text-white hover:border-white/40'
              }`}
            >
              <feat.icon
                className={`w-4 h-4 mb-2 ${
                  activeTab === idx ? 'text-amber-600' : 'text-amber-400'
                }`}
              />
              <h4 className="text-xs sm:text-sm font-semibold tracking-tight lowercase">
                {feat.label}
              </h4>
              <p
                className={`text-[11px] font-normal lowercase mt-1 leading-snug ${
                  activeTab === idx ? 'text-neutral-600' : 'text-neutral-400'
                }`}
              >
                {feat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
