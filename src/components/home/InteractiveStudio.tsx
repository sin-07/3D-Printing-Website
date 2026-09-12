'use client';

import React from 'react';
import StatueViewer from '@/components/3d/StatueViewer';
import { Layers, ShieldCheck, Cpu, Sliders, Activity } from 'lucide-react';

export default function InteractiveStudio() {
  return (
    <section className="py-24 bg-neutral-950 relative overflow-hidden border-t border-neutral-900 select-none text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Title */}
        <div className="gsap-appear-left text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-neutral-500 lowercase tracking-widest block mb-2">
            real-time kinematics &amp; toolpath inspection
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-white lowercase">
            3d printed mechanical assembly
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed lowercase max-w-xl mx-auto">
            rotate our real-time 3d turntable to inspect print-in-place planetary gear teeth, extrusion wall perimeters, and layer-by-layer slicing across engineering composites.
          </p>
        </div>

        {/* 3D Part Viewer Turntable */}
        <div className="gsap-appear-right max-w-5xl mx-auto">
          <StatueViewer
            initialMaterial="Carbon Fiber PA-CF"
            height="520px"
            className="border-neutral-800"
          />
        </div>

        {/* Feature Cards below 3D */}
        <div className="gsap-alternate-grid grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="p-2 rounded-lg bg-neutral-800 text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white lowercase">
                print-in-place kinematics
              </h4>
            </div>
            <p className="text-xs text-neutral-400 lowercase leading-relaxed">
              0.18mm kinematic clearance allows all three compound planetary gears to rotate freely directly from the build plate without fasteners or manual assembly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="p-2 rounded-lg bg-neutral-800 text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white lowercase">
                adaptive layer heights
              </h4>
            </div>
            <p className="text-xs text-neutral-400 lowercase leading-relaxed">
              micro-stepping down to 0.08mm eliminates layer staircasing on curved tooth profiles while thicker 0.20mm core infill slashes total print duration by 45%.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="p-2 rounded-lg bg-neutral-800 text-blue-400">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white lowercase">
                carbon fiber reinforced
              </h4>
            </div>
            <p className="text-xs text-neutral-400 lowercase leading-relaxed">
              20% chopped carbon fiber matrix yields 115 MPa tensile strength and 180°C heat deflection, delivering exceptional continuous torque rating up to 45 Nm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
