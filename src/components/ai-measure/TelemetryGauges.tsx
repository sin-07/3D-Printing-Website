'use client';

import React from 'react';
import { StatueAnalysisResult } from '@/types';
import {
  Layers,
  Weight,
  Clock,
  Cpu,
  Box,
  Ruler,
  ShieldCheck,
  Zap,
  Activity,
  AlertCircle,
} from 'lucide-react';

interface TelemetryGaugesProps {
  analysis: StatueAnalysisResult;
  className?: string;
}

export default function TelemetryGauges({ analysis, className = '' }: TelemetryGaugesProps) {
  const {
    dimensions,
    sizeCategory,
    volumeCm3,
    surfaceAreaCm2,
    estimatedWeightGrams,
    complexityScore,
    manufacturingDifficulty,
    estimatedSupportVolumeCm3,
    estimatedMaterialConsumptionGrams,
    estimatedPrintHours,
    totalLayerCount,
    layerHeightMm,
    overallConfidenceScore,
  } = analysis;

  const getConfidenceBadge = (confidence: number, source: string) => {
    let color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (confidence < 75) color = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (confidence < 60) color = 'text-rose-400 bg-rose-500/10 border-rose-500/20';

    const sourceTag =
      source === '3d-model-derived'
        ? 'CAD Mesh'
        : source.includes('reference')
        ? 'Ref Calibrated'
        : source.includes('user')
        ? 'User Calibrated'
        : source.includes('multiview')
        ? 'Multi-View'
        : 'AI Estimated';

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono border font-bold ${color}`}>
        <span>{sourceTag}</span>
        <span>•</span>
        <span>{confidence}%</span>
      </span>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          PHYSICAL TELEMETRY &amp; METROLOGY GAUGES
        </h3>
        <span className="text-[10px] font-mono text-titanium-400">
          Overall System Confidence: <strong className="text-gold-400">{overallConfidenceScore}%</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
        {/* Metric 1: Physical Dimensions */}
        <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-obsidian-700/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-titanium-400 flex items-center gap-1">
              <Ruler className="w-3 h-3 text-gold-400" /> BOUNDS (W×D×H)
            </span>
            {getConfidenceBadge(dimensions.heightMm.confidence, dimensions.heightMm.source)}
          </div>
          <p className="text-foreground font-bold text-sm">
            {dimensions.widthMm.value} × {dimensions.depthMm.value} × {dimensions.heightMm.value} <span className="text-[10px] text-titanium-400">mm</span>
          </p>
          <p className="text-[10px] text-titanium-500">
            {sizeCategory.value}
          </p>
        </div>

        {/* Metric 2: Solid Resin Volume */}
        <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-obsidian-700/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-titanium-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-gold-400" /> DISPLACEMENT
            </span>
            {getConfidenceBadge(volumeCm3.confidence, volumeCm3.source)}
          </div>
          <p className="text-foreground font-bold text-sm">
            {volumeCm3.value} <span className="text-[10px] text-titanium-400">cm³</span>
          </p>
          <p className="text-[10px] text-titanium-500">
            Surface Area: {surfaceAreaCm2.value} cm²
          </p>
        </div>

        {/* Metric 3: Estimated Mass */}
        <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-obsidian-700/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-titanium-400 flex items-center gap-1">
              <Weight className="w-3 h-3 text-gold-400" /> NET MASS
            </span>
            {getConfidenceBadge(estimatedWeightGrams.confidence, estimatedWeightGrams.source)}
          </div>
          <p className="text-foreground font-bold text-sm">
            {estimatedWeightGrams.value} <span className="text-[10px] text-titanium-400">g</span>
          </p>
          <p className="text-[10px] text-titanium-500">
            Total Draw: {estimatedMaterialConsumptionGrams} g (incl. supports)
          </p>
        </div>

        {/* Metric 4: Slicing Layers & Duration */}
        <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-obsidian-700/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-titanium-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-gold-400" /> 16K SLA TIME
            </span>
            {getConfidenceBadge(estimatedPrintHours.confidence, estimatedPrintHours.source)}
          </div>
          <p className="text-foreground font-bold text-sm">
            ~{estimatedPrintHours.value} <span className="text-[10px] text-titanium-400">Hours</span>
          </p>
          <p className="text-[10px] text-titanium-500">
            {totalLayerCount.toLocaleString()} layers @ {layerHeightMm}mm
          </p>
        </div>

        {/* Metric 5: Detail & Complexity Score */}
        <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-obsidian-700/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-titanium-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-gold-400" /> DETAIL RATING
            </span>
            {getConfidenceBadge(complexityScore.confidence, complexityScore.source)}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-foreground font-bold text-sm">
              {complexityScore.value} <span className="text-[10px] text-titanium-400">/ 100</span>
            </p>
            <div className="flex-1 h-1.5 rounded-full bg-obsidian-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-gold-400 to-amber-500"
                style={{ width: `${complexityScore.value}%` }}
              />
            </div>
          </div>
          <p className="text-[10px] text-titanium-500">
            Curvature &amp; feature density
          </p>
        </div>

        {/* Metric 6: Manufacturing Difficulty */}
        <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-obsidian-700/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-titanium-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-gold-400" /> MANUFACTURABILITY
            </span>
            {getConfidenceBadge(manufacturingDifficulty.confidence, manufacturingDifficulty.source)}
          </div>
          <p className={`font-bold text-sm ${
            manufacturingDifficulty.value === 'Low'
              ? 'text-emerald-400'
              : manufacturingDifficulty.value === 'Moderate'
              ? 'text-gold-400'
              : manufacturingDifficulty.value === 'High'
              ? 'text-amber-400'
              : 'text-rose-400'
          }`}>
            {manufacturingDifficulty.value} Difficulty
          </p>
          <p className="text-[10px] text-titanium-500">
            Support matrix: {estimatedSupportVolumeCm3} cm³
          </p>
        </div>
      </div>
    </div>
  );
}
