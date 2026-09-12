'use client';

import React, { useState, useRef } from 'react';
import StatueViewer from '@/components/3d/StatueViewer';
import { MaterialFinish } from '@/types';
import {
  RotateCw,
  ZoomIn,
  Eye,
  Layers,
  Crosshair,
  ShieldCheck,
  Maximize2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  selectedMaterial: MaterialFinish;
}

export default function ProductGallery({
  images,
  productName,
  selectedMaterial,
}: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'render' | '3d' | 'blueprint'>('render');
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const safeImages = images && images.length > 0 ? images : ['/images/part_gearbox_pacf.jpg'];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imageContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Gallery Frame */}
      <div className="p-3 sm:p-4 rounded-3xl bg-white border border-neutral-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle Background Blueprint Grid */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none" />

        {/* Viewport Header Bar with Mode Switchers */}
        <div className="relative z-10 flex items-center justify-between pb-3 mb-3 border-b border-neutral-200/80 gap-2 flex-wrap">
          {/* Telemetry Coordinate Chip */}
          <div className="flex items-center gap-2 text-[11px] font-mono lowercase text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[200px] sm:max-w-none">
              [cad viewport // {productName.toLowerCase()}]
            </span>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-mono lowercase">
            <button
              onClick={() => setViewMode('render')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'render'
                  ? 'bg-white text-neutral-950 font-bold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>studio render</span>
            </button>

            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === '3d'
                  ? 'bg-neutral-950 text-white font-bold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow text-amber-400" />
              <span>interactive 3d</span>
            </button>

            <button
              onClick={() => setViewMode('blueprint')}
              className={`hidden sm:flex px-3 py-1.5 rounded-lg transition-all items-center gap-1.5 ${
                viewMode === 'blueprint'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>blueprint</span>
            </button>
          </div>
        </div>

        {/* Main Stage Viewport */}
        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl bg-neutral-50 border border-neutral-200 overflow-hidden">
          {viewMode === '3d' ? (
            /* Interactive 3D Turntable */
            <div className="w-full h-full relative">
              <StatueViewer
                initialMaterial={selectedMaterial}
                height="100%"
                className="w-full h-full rounded-none border-none bg-neutral-900"
              />
            </div>
          ) : viewMode === 'blueprint' ? (
            /* Engineering Blueprint Wireframe Mode */
            <div className="w-full h-full relative bg-[#0b192c] text-sky-200 flex items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d4ed81a_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed81a_1px,transparent_1px)] bg-[size:16px_16px]" />
              <img
                src={safeImages[activeImageIndex]}
                alt={productName}
                className="w-full h-full object-contain filter invert contrast-125 opacity-80 mix-blend-screen"
              />
              <div className="absolute top-4 left-4 z-10 font-mono text-[10px] space-y-1 text-sky-400/90 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-sky-500/20">
                <div className="font-bold text-sky-300">CAD GEOMETRY OVERLAY</div>
                <div>SCALE: 1:1 CALIBRATED</div>
                <div>SURFACE TOLERANCE: ±0.02 mm</div>
                <div>ISOTROPIC GYROID INFILL</div>
              </div>
            </div>
          ) : (
            /* High-Resolution Static Image with Interactive Magnifier */
            <div
              ref={imageContainerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              className="w-full h-full relative cursor-crosshair overflow-hidden group flex items-center justify-center bg-neutral-100"
            >
              <img
                src={safeImages[activeImageIndex]}
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-200 ease-out"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZooming ? 'scale(2.2)' : 'scale(1)',
                }}
              />

              {/* Technical Inspection Overlay Crosshair on Zoom */}
              {isZooming && (
                <div
                  className="absolute pointer-events-none w-20 h-20 rounded-full border border-neutral-900/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.2)] -translate-x-1/2 -translate-y-1/2 transition-opacity hidden sm:block"
                  style={{ left: `${zoomPos.x}%`, top: `${zoomPos.y}%` }}
                >
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-neutral-900/40" />
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-neutral-900/40" />
                </div>
              )}

              {/* Floating Floating Layer Pitch Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-white/90 text-neutral-800 backdrop-blur-md border border-neutral-200/90 text-[10px] font-mono shadow-xs">
                  0.12 mm precision
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 backdrop-blur-md border border-emerald-500/20 text-[10px] font-mono shadow-xs font-semibold">
                  cmm verified
                </span>
              </div>

              {/* Hover Zoom Hint */}
              {!isZooming && (
                <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 text-[11px] text-neutral-600 font-mono shadow-xs pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5 text-neutral-900" />
                  <span>hover to inspect 0.08mm layer detail</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Thumbnail Carousel Bar */}
        <div className="mt-3 pt-3 border-t border-neutral-200/80 flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveImageIndex(idx);
                if (viewMode === '3d') setViewMode('render');
              }}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-neutral-100 ${
                viewMode !== '3d' && activeImageIndex === idx
                  ? 'border-neutral-900 shadow-sm scale-102 ring-2 ring-neutral-900/10'
                  : 'border-neutral-200/80 opacity-70 hover:opacity-100 hover:border-neutral-400'
              }`}
            >
              <img
                src={img}
                alt={`${productName} angle ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1 rounded bg-black/60 text-white font-mono text-[9px]">
                0{idx + 1}
              </span>
            </button>
          ))}

          {/* Quick 3D mode shortcut button in thumbnails */}
          <button
            onClick={() => setViewMode('3d')}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center gap-1 flex-shrink-0 ${
              viewMode === '3d'
                ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm ring-2 ring-neutral-900/10'
                : 'border-neutral-200 bg-neutral-100 text-neutral-600 hover:text-neutral-950 hover:border-neutral-400'
            }`}
          >
            <RotateCw className="w-4 h-4 animate-spin-slow text-amber-500" />
            <span className="text-[10px] font-mono font-bold uppercase">3D 360°</span>
          </button>
        </div>
      </div>

      {/* Engineering Precision Badges below gallery */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            tolerance
          </span>
          <span className="text-xs font-bold font-mono text-neutral-900">
            ±0.02 mm (ISO 2768-m)
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            metrology
          </span>
          <span className="text-xs font-bold font-mono text-neutral-900">
            CMM Calibrated
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            logistics
          </span>
          <span className="text-xs font-bold font-mono text-emerald-600">
            BlueDart Air (Pan-India)
          </span>
        </div>
      </div>
    </div>
  );
}
