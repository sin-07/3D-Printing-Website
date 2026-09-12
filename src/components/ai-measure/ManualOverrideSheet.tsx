'use client';

import React, { useState } from 'react';
import { MaterialPricingDef, FinishPricingDef, PackagingPricingDef, PricingConfig } from '@/types';
import { DEFAULT_PRICING_CONFIG } from '@/lib/pricing/pricing-config';
import { Sliders, Layers, Sparkles, Box, Cpu, RefreshCw, Lock, Unlock } from 'lucide-react';

interface ManualOverrideSheetProps {
  heightMm: number;
  widthMm: number;
  depthMm: number;
  infillPercent: number;
  layerHeightMm: number;
  selectedMaterialId: string;
  selectedFinishId: string;
  selectedPackagingId: string;
  onUpdateValues: (updates: {
    heightMm?: number;
    widthMm?: number;
    depthMm?: number;
    infillPercent?: number;
    layerHeightMm?: number;
    materialId?: string;
    finishId?: string;
    packagingId?: string;
  }) => void;
  className?: string;
}

export default function ManualOverrideSheet({
  heightMm,
  widthMm,
  depthMm,
  infillPercent,
  layerHeightMm,
  selectedMaterialId,
  selectedFinishId,
  selectedPackagingId,
  onUpdateValues,
  className = '',
}: ManualOverrideSheetProps) {
  const [aspectLock, setAspectLock] = useState(true);
  const config = DEFAULT_PRICING_CONFIG;

  const handleHeightChange = (newHeight: number) => {
    if (aspectLock && heightMm > 0) {
      const ratio = newHeight / heightMm;
      onUpdateValues({
        heightMm: Math.round(newHeight),
        widthMm: Math.round(widthMm * ratio),
        depthMm: Math.round(depthMm * ratio),
      });
    } else {
      onUpdateValues({ heightMm: Math.round(newHeight) });
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-2xl bg-obsidian-900/90 border border-obsidian-700/80 backdrop-blur-xl shadow-2xl space-y-6 ${className}`}>
      <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider block">
            FINE-TUNE &amp; MANUAL OVERRIDES
          </span>
          <h3 className="text-lg font-display font-bold text-foreground">
            Adjust Dimensions &amp; Manufacturing Specs
          </h3>
        </div>
        <button
          onClick={() => setAspectLock(!aspectLock)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors ${
            aspectLock
              ? 'bg-gold-500/10 border-gold-500/30 text-gold-300'
              : 'bg-obsidian-950 border-obsidian-800 text-titanium-400'
          }`}
          title={aspectLock ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
        >
          {aspectLock ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span>{aspectLock ? 'Proportions Locked' : 'Free Aspect'}</span>
        </button>
      </div>

      {/* 1. Dimension Sliders */}
      <div className="space-y-4">
        {/* Height Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-titanium-300">STATUE HEIGHT (Z-AXIS)</span>
            <span className="text-gold-400 font-bold">{heightMm} mm ({(heightMm / 10).toFixed(1)} cm)</span>
          </div>
          <input
            type="range"
            min="40"
            max="600"
            step="5"
            value={heightMm}
            onChange={(e) => handleHeightChange(Number(e.target.value))}
            className="w-full accent-gold-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-titanium-500">
            <span>40mm (Miniature)</span>
            <span>250mm (1:6 Display)</span>
            <span>600mm (Monumental)</span>
          </div>
        </div>

        {/* Width & Depth Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-titanium-400">WIDTH (X)</span>
              <span className="text-foreground font-bold">{widthMm} mm</span>
            </div>
            <input
              type="range"
              min="20"
              max="400"
              step="2"
              value={widthMm}
              onChange={(e) => onUpdateValues({ widthMm: Number(e.target.value) })}
              className="w-full accent-gold-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-titanium-400">DEPTH (Y)</span>
              <span className="text-foreground font-bold">{depthMm} mm</span>
            </div>
            <input
              type="range"
              min="20"
              max="400"
              step="2"
              value={depthMm}
              onChange={(e) => onUpdateValues({ depthMm: Number(e.target.value) })}
              className="w-full accent-gold-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. Infill & Resolution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-obsidian-800">
        {/* Infill Density */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-titanium-300">INFILL DENSITY</span>
            <span className="text-gold-400 font-bold">{infillPercent}% Gyroid</span>
          </div>
          <input
            type="range"
            min="15"
            max="100"
            step="5"
            value={infillPercent}
            onChange={(e) => onUpdateValues({ infillPercent: Number(e.target.value) })}
            className="w-full accent-gold-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-titanium-500">
            <span>15% Light</span>
            <span>30% Standard</span>
            <span>100% Solid</span>
          </div>
        </div>

        {/* Layer Height Slicing */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-titanium-300 block">LAYER RESOLUTION</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: 0.015, label: '0.015mm (16K Ultra)' },
              { val: 0.030, label: '0.030mm (Fast Slicing)' },
            ].map((res) => (
              <button
                key={res.val}
                onClick={() => onUpdateValues({ layerHeightMm: res.val })}
                className={`p-2.5 rounded-lg text-xs font-mono text-center border transition-all ${
                  layerHeightMm === res.val
                    ? 'border-gold-500 bg-gold-500/10 text-gold-300 font-bold'
                    : 'border-obsidian-700 bg-obsidian-950 text-titanium-400 hover:text-white'
                }`}
              >
                {res.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Photopolymer Resin Material Formulation */}
      <div className="space-y-3 pt-4 border-t border-obsidian-800">
        <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">
          SELECT PHOTOPOLYMER RESIN
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {config.materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => onUpdateValues({ materialId: mat.id })}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedMaterialId === mat.id
                  ? 'border-gold-500 bg-gold-500/10 text-gold-200 shadow-gold-glow/20'
                  : 'border-obsidian-800 bg-obsidian-950/70 text-titanium-400 hover:text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-foreground">{mat.name}</span>
                  <span className="font-mono text-[10px] text-gold-400 font-bold">
                    ${mat.costPerKg}/kg
                  </span>
                </div>
                <p className="text-[10px] text-titanium-400 line-clamp-2">{mat.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Finishing Options */}
      <div className="space-y-3 pt-4 border-t border-obsidian-800">
        <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">
          ARTISAN POST-PROCESSING FINISH
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {config.finishes.map((f) => (
            <button
              key={f.id}
              onClick={() => onUpdateValues({ finishId: f.id })}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedFinishId === f.id
                  ? 'border-gold-500 bg-gold-500/10 text-gold-200 shadow-gold-glow/20'
                  : 'border-obsidian-800 bg-obsidian-950/70 text-titanium-400 hover:text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-foreground">{f.name}</span>
                  <span className="font-mono text-[10px] text-gold-400 font-bold">
                    {f.baseCost === 0 ? 'Included' : `+$${f.baseCost}`}
                  </span>
                </div>
                <p className="text-[10px] text-titanium-400 line-clamp-2">{f.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Archival Packaging */}
      <div className="space-y-3 pt-4 border-t border-obsidian-800">
        <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">
          ARCHIVAL PACKAGING &amp; CRATE
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {config.packagingOptions.map((p) => (
            <button
              key={p.id}
              onClick={() => onUpdateValues({ packagingId: p.id })}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedPackagingId === p.id
                  ? 'border-gold-500 bg-gold-500/10 text-gold-200 shadow-gold-glow/20'
                  : 'border-obsidian-800 bg-obsidian-950/70 text-titanium-400 hover:text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-foreground">{p.name}</span>
                  <span className="font-mono text-[10px] text-gold-400 font-bold">+${p.cost}</span>
                </div>
                <p className="text-[10px] text-titanium-400 line-clamp-2">{p.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
