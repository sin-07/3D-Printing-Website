'use client';

import React from 'react';

export default function ProcessStepsSection() {
  const steps = [
    {
      num: 1,
      title: 'slices',
      desc: 'ai cad slicing & g-code',
      detail: 'automated geometry validation, adaptive layer slicing (0.08mm - 0.28mm), and isotropic gyroid infill generation.',
    },
    {
      num: 2,
      title: 'prints',
      desc: 'high-speed corexy extrusion',
      detail: '500 mm/s linear velocity, 300°c all-metal hotend, and 20,000 mm/s² resonance-compensated acceleration.',
    },
    {
      num: 3,
      title: 'verifies',
      desc: 'metrology & heat-set finishing',
      detail: '±0.01mm micrometer dimensional inspection, stress-relief annealing, and brass threaded insert installation.',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative w-full bg-white text-black select-none py-24 sm:py-32 border-t border-neutral-150 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 w-full">
        {/* Top Center Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-neutral-400 lowercase tracking-widest block mb-2">
            the additive workflow
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] lowercase text-black leading-tight">
            one system. three easy steps.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-normal lowercase mt-4 max-w-xl mx-auto">
            from 3d cad model to high-performance functional engineering part with zero friction.
          </p>
        </div>

        {/* Center Visual: Framed Macro Industrial Nozzle Showcase */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/10] rounded-3xl overflow-hidden shadow-xl border border-neutral-200 mb-16 group">
          <img
            src="/images/loop_macro_nozzle.jpg"
            alt="Macro 3D print nozzle hotend"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-6 text-xs font-mono text-white/90">
            <span>300°c hardened steel cht nozzle · dual 5015 part cooling blowers</span>
          </div>
        </div>

        {/* Bottom 3-Column Layout with Vertical Hairline Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200 border-t border-b border-neutral-200 py-6 md:py-0">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col items-center text-center px-6 py-8 md:py-10 group transition-transform duration-300 hover:scale-[1.02]"
            >
              {/* Step circle badge `(1)` */}
              <div className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-xs font-mono text-neutral-800 mb-4 transition-colors group-hover:border-black group-hover:bg-black group-hover:text-white">
                <span>{step.num}</span>
              </div>

              {/* Step Verb */}
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight lowercase text-black mb-1.5">
                {step.title}
              </h3>

              {/* Step Descriptor */}
              <p className="text-sm sm:text-base text-neutral-600 font-normal lowercase tracking-normal">
                {step.desc}
              </p>

              {/* Detail text */}
              <p className="text-xs text-neutral-400 font-normal lowercase mt-2.5 max-w-xs leading-relaxed">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
