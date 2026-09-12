'use client';

import React from 'react';
import Link from 'next/link';

export default function PrecisionMetrologySection() {
  return (
    <section
      id="precision"
      className="relative w-full min-h-screen flex items-center bg-white text-black py-24 sm:py-32 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <div className="gsap-split-row grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Minimalist Typography & Giant Stat Callout */}
          <div className="gsap-col-left lg:col-span-7 flex flex-col justify-center">
            {/* Bold Lowercase Headline */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-[-0.04em] leading-[1.08] text-black lowercase">
              consistent precision. every time.
            </h2>

            {/* Explanatory Paragraph */}
            <p className="mt-8 text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-xl lowercase">
              choose your exact engineering tolerance. our hardened dual-gear extrusion system and closed-loop optical feedback monitor extrusion bead geometry in real time, delivering consistent press-fit bearing pockets and sub-millimeter kinematic fits.
            </p>

            {/* Giant Stat Display: 0.01 mm precision */}
            <div className="mt-12 sm:mt-16 flex items-baseline gap-3 sm:gap-4">
              <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[140px] font-extrabold tracking-tighter leading-none text-black">
                0.01
              </span>
              <div className="flex flex-col justify-end pb-2 sm:pb-4">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight lowercase text-black">
                  mm
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight lowercase text-neutral-800">
                  precision
                </span>
              </div>
            </div>

            {/* Interactive Link to AI Measure / CAD Upload */}
            <div className="mt-8">
              <Link
                href="/custom-print"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold lowercase tracking-tight text-neutral-900 border-b border-black pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors"
              >
                <span>launch instant cad tolerance inspector &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Digital Caliper Photography on Pure White */}
          <div className="gsap-col-right lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden bg-white flex items-center justify-center p-2 group">
              <img
                src="/images/loop_caliper_precision.jpg"
                alt="0.01mm digital caliper precision metrology measurement"
                className="w-full h-full object-contain filter contrast-105 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
