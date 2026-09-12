'use client';

import React, { useState } from 'react';
import { StatueAnalysisResult } from '@/types';
import { ShieldCheck, AlertTriangle, Eye, Ruler, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

interface ImageCaliperCanvasProps {
  analysis: StatueAnalysisResult;
  imageSrc?: string;
  className?: string;
}

export default function ImageCaliperCanvas({
  analysis,
  imageSrc = '/images/hero_sculpture.jpg',
  className = '',
}: ImageCaliperCanvasProps) {
  const [showOverlays, setShowOverlays] = useState(true);
  const [showContour, setShowContour] = useState(true);

  const { dimensions, segmentation, referenceScale, overallConfidenceScore, manualVerificationRequired, warnings } = analysis;
  const heightMm = dimensions.heightMm.value;
  const widthMm = dimensions.widthMm.value;
  const depthMm = dimensions.depthMm.value;

  const sourceLabel =
    dimensions.heightMm.source === '3d-model-derived'
      ? '3D-Model Derived'
      : dimensions.heightMm.source === 'measured-reference'
      ? 'Measured (Reference Scale)'
      : dimensions.heightMm.source === 'measured-user'
      ? 'Measured (User Calibrated)'
      : dimensions.heightMm.source === 'measured-multiview'
      ? 'Measured (Multi-view Triangulation)'
      : 'AI Estimated';

  const sourceBadgeColor =
    dimensions.heightMm.source === '3d-model-derived'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : dimensions.heightMm.source.startsWith('measured')
      ? 'bg-gold-500/10 text-gold-400 border-gold-500/30'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

  const seg = segmentation || { x: 18, y: 12, width: 64, height: 76 };

  return (
    <div className={`relative rounded-2xl bg-obsidian-950 border border-gold-500/20 overflow-hidden shadow-2xl ${className}`}>
      {/* Top Banner Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-obsidian-950/95 via-obsidian-950/70 to-transparent p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border uppercase flex items-center gap-1.5 ${sourceBadgeColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {sourceLabel}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-obsidian-900/90 text-titanium-300 border border-obsidian-700 text-[10px] font-mono">
            {overallConfidenceScore}% Confidence
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-obsidian-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-obsidian-800">
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              showOverlays ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-titanium-400 hover:text-white'
            }`}
          >
            Calipers
          </button>
          <button
            onClick={() => setShowContour(!showContour)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              showContour ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-titanium-400 hover:text-white'
            }`}
          >
            Contour
          </button>
        </div>
      </div>

      {/* Main Visual Image & SVG Measurement Overlay Container */}
      <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full flex items-center justify-center bg-radial-gradient overflow-hidden">
        {/* Background Image */}
        <img
          src={imageSrc}
          alt="Statue AI Metrology Scan"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
        />

        {/* Laser Grid Background Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Interactive SVG Caliper & Segmentation Layer */}
        {showOverlays && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Bounding Box Rect */}
            <rect
              x={seg.x}
              y={seg.y}
              width={seg.width}
              height={seg.height}
              fill="rgba(212, 175, 55, 0.05)"
              stroke="#d4af37"
              strokeWidth="0.5"
              strokeDasharray="2 1.5"
              className="animate-pulse"
            />

            {/* Corner Caliper Brackets */}
            {/* Top Left */}
            <path d={`M ${seg.x} ${seg.y + 4} L ${seg.x} ${seg.y} L ${seg.x + 4} ${seg.y}`} fill="none" stroke="#d4af37" strokeWidth="1.2" />
            {/* Top Right */}
            <path d={`M ${seg.x + seg.width - 4} ${seg.y} L ${seg.x + seg.width} ${seg.y} L ${seg.x + seg.width} ${seg.y + 4}`} fill="none" stroke="#d4af37" strokeWidth="1.2" />
            {/* Bottom Left */}
            <path d={`M ${seg.x} ${seg.y + seg.height - 4} L ${seg.x} ${seg.y + seg.height} L ${seg.x + 4} ${seg.y + seg.height}`} fill="none" stroke="#d4af37" strokeWidth="1.2" />
            {/* Bottom Right */}
            <path d={`M ${seg.x + seg.width - 4} ${seg.y + seg.height} L ${seg.x + seg.width} ${seg.y + seg.height} L ${seg.x + seg.width} ${seg.y + seg.height - 4}`} fill="none" stroke="#d4af37" strokeWidth="1.2" />

            {/* Contour Polygon Outline */}
            {showContour && seg.contourPoints && seg.contourPoints.length > 0 && (
              <polygon
                points={seg.contourPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="rgba(0, 240, 255, 0.06)"
                stroke="#00f0ff"
                strokeWidth="0.6"
                strokeDasharray="1.5 1"
              />
            )}

            {/* Vertical Caliper (Height Dimension) */}
            <line x1={seg.x - 4} y1={seg.y} x2={seg.x - 4} y2={seg.y + seg.height} stroke="#d4af37" strokeWidth="0.8" />
            <line x1={seg.x - 6} y1={seg.y} x2={seg.x - 2} y2={seg.y} stroke="#d4af37" strokeWidth="0.8" />
            <line x1={seg.x - 6} y1={seg.y + seg.height} x2={seg.x - 2} y2={seg.y + seg.height} stroke="#d4af37" strokeWidth="0.8" />

            {/* Horizontal Caliper (Width Dimension) */}
            <line x1={seg.x} y1={seg.y + seg.height + 4} x2={seg.x + seg.width} y2={seg.y + seg.height + 4} stroke="#d4af37" strokeWidth="0.8" />
            <line x1={seg.x} y1={seg.y + seg.height + 2} x2={seg.x} y2={seg.y + seg.height + 6} stroke="#d4af37" strokeWidth="0.8" />
            <line x1={seg.x + seg.width} y1={seg.y + seg.height + 2} x2={seg.x + seg.width} y2={seg.y + seg.height + 6} stroke="#d4af37" strokeWidth="0.8" />
          </svg>
        )}

        {/* Floating Dimension Readout Labels (HTML overlays positioned precisely) */}
        {showOverlays && (
          <>
            {/* Height Readout (Left) */}
            <div
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-obsidian-950/90 border border-gold-500/60 backdrop-blur-md px-2.5 py-1 rounded-md shadow-gold-glow/20 flex flex-col items-center"
            >
              <span className="text-[9px] font-mono text-titanium-400">HEIGHT (Z)</span>
              <span className="text-xs font-mono font-bold text-gold-400">
                {heightMm} mm
              </span>
              <span className="text-[9px] font-mono text-titanium-400">
                {(heightMm / 10).toFixed(1)} cm
              </span>
            </div>

            {/* Width Readout (Bottom Center) */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-obsidian-950/90 border border-gold-500/60 backdrop-blur-md px-3 py-1 rounded-md shadow-gold-glow/20 flex items-center gap-2"
            >
              <div className="text-center">
                <span className="text-[8px] font-mono text-titanium-400 block">WIDTH (X)</span>
                <span className="text-xs font-mono font-bold text-gold-400">
                  {widthMm} mm
                </span>
              </div>
              <div className="h-4 w-px bg-obsidian-700" />
              <div className="text-center">
                <span className="text-[8px] font-mono text-titanium-400 block">DEPTH (Y)</span>
                <span className="text-xs font-mono font-bold text-gold-400">
                  {depthMm} mm
                </span>
              </div>
            </div>
          </>
        )}

        {/* Reference Scale Badge in Bottom Left */}
        {referenceScale && referenceScale.detected && (
          <div className="absolute bottom-4 left-4 bg-obsidian-900/90 border border-emerald-500/40 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-[10px] font-mono text-emerald-300">
            <Ruler className="w-3.5 h-3.5 text-emerald-400" />
            <span>Calibrated: {referenceScale.type}</span>
          </div>
        )}
      </div>

      {/* Warnings & Notice Footer */}
      {manualVerificationRequired && (
        <div className="p-3.5 bg-amber-500/10 border-t border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-300">Manual Verification Recommended</p>
            <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
              {warnings[0] || 'Image lacks calibrated physical scale markers. You can adjust the real-world dimensions below with real-time recalculation.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
