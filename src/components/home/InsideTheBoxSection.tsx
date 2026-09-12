'use client';

import React from 'react';
import { Box, Cpu, Waves, Sun, Wrench, ShieldCheck, Flame, Layers } from 'lucide-react';

export default function InsideTheBoxSection() {
  const items = [
    {
      num: '01',
      title: 'corexy additive workstation',
      desc: '300×300×300mm build volume, carbon fiber x-rail, and 48v closed-loop silent drivers.',
      icon: Cpu,
    },
    {
      num: '02',
      title: 'magnetic pei spring steel plate',
      desc: 'double-sided powder-coated textured surface for instant auto-release upon cooling.',
      icon: Layers,
    },
    {
      num: '03',
      title: 'hardened steel cht nozzle kit',
      desc: '0.4mm and 0.6mm high-flow nozzles rated up to 350°c for abrasive carbon fiber composites.',
      icon: Flame,
    },
    {
      num: '04',
      title: '0.01mm digital vernier caliper',
      desc: 'aerospace-grade hardened stainless steel with digital lcd readout for part metrology.',
      icon: Wrench,
    },
    {
      num: '05',
      title: '1kg aerospace pa-cf spool',
      desc: 'pre-dried carbon fiber reinforced nylon in vacuum-sealed aluminum desiccant pouch.',
      icon: Box,
    },
    {
      num: '06',
      title: 'flight transit case & tool kit',
      desc: 'airtight heavy-duty crate with hex wrenches, torque wrench, and spare silicone socks.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="inside-the-box"
      className="py-24 sm:py-32 bg-neutral-950 text-white select-none border-t border-neutral-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="gsap-appear-left max-w-3xl mb-16 sm:mb-20">
          <span className="text-xs font-mono text-neutral-500 lowercase tracking-widest block mb-2">
            package contents &amp; ecosystem
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] lowercase text-white leading-none">
            inside the box.
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 font-normal lowercase mt-4 leading-relaxed max-w-xl">
            everything required to start manufacturing aerospace-grade composite prototypes and functional mechanisms on day one.
          </p>
        </div>

        {/* 6-Item Minimalist Grid (makewithloop.com style on Dark) */}
        <div className="gsap-alternate-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          {items.map((item) => (
            <div
              key={item.num}
              className="bg-neutral-900/90 p-8 sm:p-10 flex flex-col justify-between transition-colors duration-300 hover:bg-neutral-850 group"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-mono text-neutral-500 font-semibold">
                    [{item.num}]
                  </span>
                  <item.icon className="w-5 h-5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight lowercase text-white mb-3">
                  {item.title}
                </h3>
              </div>

              <p className="text-sm text-neutral-400 lowercase font-normal leading-relaxed mt-4">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
