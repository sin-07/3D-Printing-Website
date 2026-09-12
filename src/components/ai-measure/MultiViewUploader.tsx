'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  FileCode,
  Layers,
  Ruler,
  CreditCard,
  Coins,
  Sparkles,
  CheckCircle2,
  Cpu,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface MultiViewUploaderProps {
  onAnalyzeImages: (data: {
    images: { frontBase64?: string; sideBase64?: string; topBase64?: string; backBase64?: string };
    referenceType: 'credit-card' | 'ruler' | 'coin' | 'custom-marker' | 'user-known-height' | 'none';
    userKnownDimensionMm?: number;
    userKnownDimensionType?: 'height' | 'width' | 'depth';
  }) => void;
  onAnalyze3DFile: (file: File) => void;
  isLoading: boolean;
}

const PRESET_SAMPLES = [
  {
    id: 'archangel',
    name: 'Archangel Michael (1:6 Scale)',
    description: 'High-detail figurine with intricate wings and sword relief',
    image: '/images/hero_sculpture.jpg',
    reference: 'credit-card' as const,
    knownHeight: 280,
  },
  {
    id: 'samurai',
    name: 'Cyberpunk Oni Bust (1:4 Scale)',
    description: 'Sharp armor contours with horn overhangs and micro-mesh',
    image: '/images/products/cyber_samurai.jpg',
    reference: 'ruler' as const,
    knownHeight: 320,
  },
  {
    id: 'aphrodite',
    name: 'Aphrodite Marble Replica (Museum Scale)',
    description: 'Smooth classical contours with drapery folds',
    image: '/images/products/aphrodite.jpg',
    reference: 'none' as const,
    knownHeight: 390,
  }
];

export default function MultiViewUploader({
  onAnalyzeImages,
  onAnalyze3DFile,
  isLoading,
}: MultiViewUploaderProps) {
  const [activeTab, setActiveTab] = useState<'images' | '3d-cad'>('images');
  
  // Image Views State
  const [frontImage, setFrontImage] = useState<string | null>('/images/hero_sculpture.jpg');
  const [sideImage, setSideImage] = useState<string | null>(null);
  const [topImage, setTopImage] = useState<string | null>(null);
  
  // Reference Scale State
  const [referenceType, setReferenceType] = useState<
    'credit-card' | 'ruler' | 'coin' | 'custom-marker' | 'user-known-height' | 'none'
  >('credit-card');
  const [userKnownHeight, setUserKnownHeight] = useState<number>(280);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);
  const topInputRef = useRef<HTMLInputElement>(null);
  const cadInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setter(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAnalyze3DFile(file);
    }
  };

  const triggerAnalysis = () => {
    onAnalyzeImages({
      images: {
        frontBase64: frontImage || undefined,
        sideBase64: sideImage || undefined,
        topBase64: topImage || undefined,
      },
      referenceType,
      userKnownDimensionMm: referenceType === 'user-known-height' ? userKnownHeight : undefined,
      userKnownDimensionType: 'height',
    });
  };

  const selectPreset = (preset: typeof PRESET_SAMPLES[0]) => {
    setFrontImage(preset.image);
    setReferenceType(preset.reference);
    setUserKnownHeight(preset.knownHeight);
    onAnalyzeImages({
      images: { frontBase64: preset.image },
      referenceType: preset.reference,
      userKnownDimensionMm: preset.knownHeight,
      userKnownDimensionType: 'height',
    });
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/90 border border-obsidian-700/80 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Mode Switch Tabs */}
      <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider block">
            STEP 1: INPUT SOURCE
          </span>
          <h2 className="text-lg font-display font-bold text-foreground">
            Upload Statue Imagery or 3D Mesh
          </h2>
        </div>

        <div className="flex p-1 rounded-xl bg-obsidian-950 border border-obsidian-800">
          <button
            onClick={() => setActiveTab('images')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'images'
                ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold-glow/20'
                : 'text-titanium-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI Optical Scan</span>
          </button>
          <button
            onClick={() => setActiveTab('3d-cad')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === '3d-cad'
                ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold-glow/20'
                : 'text-titanium-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>CAD Mesh (.STL)</span>
          </button>
        </div>
      </div>

      {/* Preset Quick-Test Bench */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-titanium-400 uppercase tracking-wider block">
          QUICK TEST PRESETS (1-CLICK CALIBRATION)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESET_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => selectPreset(sample)}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-obsidian-800 bg-obsidian-950/60 hover:bg-obsidian-950 hover:border-gold-500/40 text-left transition-all group flex items-center gap-3"
            >
              <img
                src={sample.image}
                alt={sample.name}
                className="w-10 h-10 rounded-lg object-cover border border-obsidian-700 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-foreground group-hover:text-gold-300 truncate">
                  {sample.name}
                </h4>
                <p className="text-[10px] text-titanium-400 font-mono truncate">
                  Calibrated • {sample.knownHeight}mm
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'images' ? (
        <div className="space-y-6">
          {/* Multi-Angle View Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-titanium-300">
                MULTI-VIEW STATUE CAPTURE (OPTICAL TRIANGULATION)
              </span>
              <span className="text-[10px] font-mono text-gold-400">
                Front View Required • Side/Top Optional
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Front View (Primary) */}
              <div
                onClick={() => frontInputRef.current?.click()}
                className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  frontImage
                    ? 'border-gold-500/50 bg-gold-500/5'
                    : 'border-obsidian-700 bg-obsidian-950/60 hover:border-gold-500/40'
                }`}
              >
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFile(e, setFrontImage)}
                  className="hidden"
                />
                {frontImage ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-lg overflow-hidden border border-gold-500/40">
                      <img src={frontImage} alt="Front" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-mono font-bold text-gold-300 block">
                      Front View (Primary)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">✓ Loaded</span>
                  </div>
                ) : (
                  <div className="space-y-1.5 py-3">
                    <Upload className="w-5 h-5 mx-auto text-gold-400" />
                    <span className="text-xs font-semibold text-foreground block">Front View</span>
                    <span className="text-[10px] text-titanium-400 font-mono">Tap to upload / capture</span>
                  </div>
                )}
              </div>

              {/* Side View */}
              <div
                onClick={() => sideInputRef.current?.click()}
                className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  sideImage
                    ? 'border-gold-500/50 bg-gold-500/5'
                    : 'border-obsidian-700 bg-obsidian-950/60 hover:border-gold-500/40'
                }`}
              >
                <input
                  ref={sideInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFile(e, setSideImage)}
                  className="hidden"
                />
                {sideImage ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-lg overflow-hidden border border-gold-500/40">
                      <img src={sideImage} alt="Side" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-mono font-bold text-gold-300 block">
                      Side Profile (Depth)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">✓ Stereo Loaded</span>
                  </div>
                ) : (
                  <div className="space-y-1.5 py-3">
                    <Camera className="w-5 h-5 mx-auto text-titanium-400" />
                    <span className="text-xs font-semibold text-titanium-300 block">Side Profile (Optional)</span>
                    <span className="text-[10px] text-titanium-500 font-mono">Improves depth accuracy</span>
                  </div>
                )}
              </div>

              {/* Top View */}
              <div
                onClick={() => topInputRef.current?.click()}
                className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  topImage
                    ? 'border-gold-500/50 bg-gold-500/5'
                    : 'border-obsidian-700 bg-obsidian-950/60 hover:border-gold-500/40'
                }`}
              >
                <input
                  ref={topInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFile(e, setTopImage)}
                  className="hidden"
                />
                {topImage ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-lg overflow-hidden border border-gold-500/40">
                      <img src={topImage} alt="Top" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-mono font-bold text-gold-300 block">
                      Top Down Angle
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">✓ Volumetric Loaded</span>
                  </div>
                ) : (
                  <div className="space-y-1.5 py-3">
                    <Layers className="w-5 h-5 mx-auto text-titanium-400" />
                    <span className="text-xs font-semibold text-titanium-300 block">Top Angle (Optional)</span>
                    <span className="text-[10px] text-titanium-500 font-mono">For plinth &amp; convex hull</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reference Scale Calibration Matrix */}
          <div className="p-4 sm:p-5 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5" />
                REFERENCE OBJECT CALIBRATION
              </span>
              <span className="text-[10px] font-mono text-titanium-400">
                Guarantees sub-millimeter precision
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'credit-card', label: 'Credit Card (85.6mm)', icon: CreditCard },
                { id: 'ruler', label: 'Ruler / Metric Scale', icon: Ruler },
                { id: 'coin', label: 'Standard Coin (24mm)', icon: Coins },
                { id: 'user-known-height', label: 'Known Measurement', icon: Sparkles },
              ].map((ref) => (
                <button
                  key={ref.id}
                  onClick={() => setReferenceType(ref.id as any)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all flex flex-col justify-between ${
                    referenceType === ref.id
                      ? 'border-gold-500 bg-gold-500/10 text-gold-200 font-bold'
                      : 'border-obsidian-800 bg-obsidian-900/60 text-titanium-400 hover:text-white'
                  }`}
                >
                  <ref.icon className="w-4 h-4 mb-1 text-gold-400" />
                  <span className="text-[11px] leading-tight">{ref.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Known Measurement Input if selected */}
            {referenceType === 'user-known-height' && (
              <div className="pt-2 flex items-center gap-3">
                <label className="text-xs font-mono text-titanium-300">
                  Known Statue Height (mm):
                </label>
                <input
                  type="number"
                  min="20"
                  max="2000"
                  value={userKnownHeight}
                  onChange={(e) => setUserKnownHeight(Number(e.target.value))}
                  className="w-28 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-gold-500/40 text-gold-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
                <span className="text-[10px] font-mono text-titanium-400">
                  = {(userKnownHeight / 10).toFixed(1)} cm
                </span>
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={triggerAnalysis}
            disabled={isLoading || !frontImage}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-gold-glow transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Computer Vision Metrology...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Metrology Analysis &amp; Price Calculation</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* 3D CAD Mesh Direct Upload */
        <div className="space-y-4">
          <div
            onClick={() => cadInputRef.current?.click()}
            className="border-2 border-dashed border-gold-500/40 hover:border-gold-500 rounded-xl p-10 text-center cursor-pointer transition-colors bg-obsidian-950/50 hover:bg-obsidian-950/80 flex flex-col items-center justify-center gap-3"
          >
            <input
              ref={cadInputRef}
              type="file"
              accept=".stl,.obj,.3mf,.step"
              onChange={handleCadFile}
              className="hidden"
            />
            <div className="p-3 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
              <FileCode className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Drop your 3D CAD model (.STL, .OBJ) here
              </p>
              <p className="text-xs text-titanium-400 font-mono mt-1">
                Zero approximation. Computes exact signed tetrahedron volume &amp; 16K slice layers.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
