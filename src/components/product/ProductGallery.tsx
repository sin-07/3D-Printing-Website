'use client';

import React, { useState, useRef } from 'react';
import StatueViewer from '@/components/3d/StatueViewer';
import { MaterialFinish } from '@/types';
import { Box, Sparkles, ZoomIn, Eye, RotateCw } from 'lucide-react';

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
  const [is3DMode, setIs3DMode] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imageContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails Sidebar */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:w-20 flex-shrink-0">
        {/* 3D Turntable Mode Button */}
        <button
          onClick={() => setIs3DMode(true)}
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border flex flex-col items-center justify-center gap-1 transition-all flex-shrink-0 ${
            is3DMode
              ? 'border-gold-500 bg-gold-500/10 text-gold-300 shadow-gold-glow/40'
              : 'border-obsidian-700 bg-obsidian-900 text-titanium-400 hover:text-white hover:border-gold-500/30'
          }`}
        >
          <RotateCw className="w-5 h-5 animate-spin-slow text-gold-400" />
          <span className="text-[10px] font-mono font-bold uppercase">3D 360°</span>
        </button>

        {/* Regular Images */}
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveImageIndex(idx);
              setIs3DMode(false);
            }}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all flex-shrink-0 bg-obsidian-950 ${
              !is3DMode && activeImageIndex === idx
                ? 'border-gold-500 ring-2 ring-gold-500/30 shadow-gold-glow/40'
                : 'border-obsidian-800 opacity-60 hover:opacity-100 hover:border-gold-500/30'
            }`}
          >
            <img src={img} alt={`${productName} angle ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Viewport Stage */}
      <div className="flex-1 relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl bg-obsidian-950 border border-obsidian-700/80 overflow-hidden shadow-2xl">
        {is3DMode ? (
          /* Interactive 3D Turntable Mode */
          <div className="w-full h-full relative">
            <StatueViewer
              initialMaterial={selectedMaterial}
              height="100%"
              className="w-full h-full rounded-none border-none"
            />
          </div>
        ) : (
          /* High-Resolution Static Image with Magnifying Zoom */
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
            className="w-full h-full relative cursor-crosshair overflow-hidden group flex items-center justify-center"
          >
            <img
              src={images[activeImageIndex] || images[0]}
              alt={productName}
              className="w-full h-full object-cover transition-transform duration-200"
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZooming ? 'scale(2.2)' : 'scale(1)',
              }}
            />

            {/* Hover Hint */}
            {!isZooming && (
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian-900/80 backdrop-blur-md border border-obsidian-700 text-[11px] text-titanium-300 font-mono pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-gold-400" />
                <span>Hover to Magnify 16K Resin Detail</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
