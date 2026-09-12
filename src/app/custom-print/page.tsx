'use client';

import React, { useState, useRef } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import RevealText from '@/components/animations/RevealText';
import {
  Upload,
  Layers,
  FileCode,
  Sparkles,
  CheckCircle2,
  Cpu,
  Clock,
  Weight,
  ShoppingBag,
  Info,
  Sliders,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface MaterialOptionCommission {
  id: string;
  name: string;
  pricePerCm3: number;
  description: string;
  densityGPerCm3: number;
}

const COMMISSION_MATERIALS: MaterialOptionCommission[] = [
  {
    id: 'sla-16k-standard',
    name: '16K Ultra-HD SLA Resin',
    pricePerCm3: 0.38,
    densityGPerCm3: 1.15,
    description: 'Ultra-crisp 15-micron photopolymer for hyper-detailed miniatures, figurines, and sculptures.',
  },
  {
    id: 'titanium-infused',
    name: 'Titanium-Infused Ceramic Resin',
    pricePerCm3: 0.65,
    densityGPerCm3: 1.65,
    description: 'Heavyweight rigid composite with metallic ring and superior impact resistance.',
  },
  {
    id: 'translucent-smoke',
    name: 'Translucent Smoked Optical Resin',
    pricePerCm3: 0.48,
    densityGPerCm3: 1.18,
    description: 'Crystal-clear glass-like clarity with tinted smoke finish displaying internal supports.',
  },
  {
    id: 'tough-engineering',
    name: 'Flexible Tough Impact Polymer',
    pricePerCm3: 0.55,
    densityGPerCm3: 1.2,
    description: 'High tensile strength with slight elasticity for functional prototypes and articulated joints.',
  },
];

interface FinishCommission {
  id: string;
  name: string;
  cost: number;
  description: string;
}

const FINISH_OPTIONS: FinishCommission[] = [
  {
    id: 'raw-cleaned',
    name: 'Raw Ultrasonic Cleaned & UV Cured',
    cost: 0,
    description: 'Supports removed, ultrasonic IPA wash, dual UV post-bake. Ready for your personal painting.',
  },
  {
    id: 'matte-primer',
    name: 'Artisan Micro-Sanded & Primed',
    cost: 35,
    description: 'Hand-buffed with 3000-grit micro-abrasives and coated with premium neutral grey automotive primer.',
  },
  {
    id: 'hand-painted',
    name: 'Master Artisan Hand-Painted Finish',
    cost: 165,
    description: 'Full airbrush shading, wash weathering, and micro-detailed eye/armor highlights by our senior artists.',
  },
  {
    id: 'gilded-gold',
    name: '24K Florentine Gold Leaf Gilded',
    cost: 240,
    description: 'Genuine hand-laid 24-karat Florentine gold leaf accents over obsidian or alabaster resin.',
  },
];

export default function CustomPrintStudio() {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; sizeMb: number } | null>({
    name: 'archangel_custom_v3.stl',
    sizeMb: 48.2,
  });

  const [baseVolumeCm3, setBaseVolumeCm3] = useState(320);
  const [scalePercentage, setScalePercentage] = useState(100);
  const [infillDensity, setInfillDensity] = useState(25);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOptionCommission>(
    COMMISSION_MATERIALS[0]
  );
  const [selectedFinish, setSelectedFinish] = useState<FinishCommission>(FINISH_OPTIONS[0]);
  const [layerHeight, setLayerHeight] = useState('0.015mm (16K Ultra)');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Computations
  const scaleMultiplier = Math.pow(scalePercentage / 100, 3);
  const scaledVolume = Math.round(baseVolumeCm3 * scaleMultiplier);
  const infillAdjustedVolume = Math.round(scaledVolume * (0.3 + (infillDensity / 100) * 0.7));
  const estimatedWeightGrams = Math.round(infillAdjustedVolume * selectedMaterial.densityGPerCm3);
  const estimatedHours = Math.max(4, Math.round((scaledVolume / 25) * 1.8));

  const materialCost = infillAdjustedVolume * selectedMaterial.pricePerCm3;
  const machineTimeCost = estimatedHours * 3.5;
  const resolutionModifier = layerHeight.includes('0.015mm') ? 1.25 : 1.0;

  const totalCalculatedCost = Math.round(
    (materialCost + machineTimeCost) * resolutionModifier + selectedFinish.cost
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile({
        name: uploaded.name,
        sizeMb: Number((uploaded.size / (1024 * 1024)).toFixed(1)),
      });
      // Simulate analyzed mesh volume
      const simulatedVol = Math.floor(Math.random() * 250) + 150;
      setBaseVolumeCm3(simulatedVol);
      showToast('3D Mesh Analyzed', `Calculated volume: ${simulatedVol} cm³`, 'success');
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: 'custom-commission',
      name: `Custom Commission: ${file?.name || 'Artisan STL'}`,
      image: '/images/hero_sculpture.jpg',
      category: 'Limited Editions',
      selectedMaterial: '24K Gilded Gold Leaf',
      selectedScale: '1/6 Scale',
      customEngraving: `Scale: ${scalePercentage}%, Finish: ${selectedFinish.name}`,
      unitPrice: totalCalculatedCost,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>BESPOKE ARTISAN COMMISSIONS</span>
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground">
              Custom 3D Printing Studio
            </h1>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-xs sm:text-sm text-titanium-400 mt-2 leading-relaxed">
              Upload your custom 3D model (.STL, .OBJ, .STEP) for instant optical volume analysis, material configuration, layer slicing, and live quotation.
            </p>
          </RevealText>

          <div className="mt-6 flex justify-center">
            <a
              href="/ai-measure"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500/10 via-gold-500/20 to-gold-500/10 border border-gold-500/40 text-gold-300 hover:text-gold-200 text-xs font-mono transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Have a photo of a statue? Try our <strong>AI Metrology &amp; Instant Pricing Studio →</strong></span>
            </a>
          </div>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: File Upload & Parameters */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Drag & Drop File Uploader */}
            <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-obsidian-700/80 space-y-4">
              <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">
                1. UPLOAD 3D MODEL FILE
              </span>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gold-500/40 hover:border-gold-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-obsidian-950/50 hover:bg-obsidian-950/80 flex flex-col items-center justify-center gap-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl,.obj,.step,.3mf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="p-3 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload or drag &amp; drop 3D file
                  </p>
                  <p className="text-xs text-titanium-400 font-mono mt-1">
                    Accepts .STL, .OBJ, .STEP, .3MF (Up to 250 MB)
                  </p>
                </div>
              </div>

              {/* Uploaded File Pill */}
              {file && (
                <div className="p-3.5 rounded-xl bg-obsidian-950 border border-gold-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-5 h-5 text-gold-400" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground font-mono">{file.name}</h4>
                      <p className="text-[10px] text-titanium-400 font-mono">
                        {file.sizeMb} MB • Volume: {scaledVolume} cm³
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                    ANALYSIS PASSED
                  </span>
                </div>
              )}
            </div>

            {/* 2. Material Formulation */}
            <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-obsidian-700/80 space-y-4">
              <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">
                2. SELECT PHOTOPOLYMER RESIN
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMMISSION_MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedMaterial.id === mat.id
                        ? 'border-gold-500 bg-gold-500/10 text-gold-200 shadow-gold-glow/20'
                        : 'border-obsidian-700 bg-obsidian-950/70 text-titanium-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-foreground">{mat.name}</span>
                        <span className="font-mono text-[10px] text-gold-400 font-bold">
                          ${mat.pricePerCm3}/cm³
                        </span>
                      </div>
                      <p className="text-[11px] text-titanium-400 leading-relaxed">
                        {mat.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Scale & Infill Sliders */}
            <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-obsidian-700/80 space-y-6">
              <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">
                3. DIMENSION SCALE &amp; INFILL
              </span>

              {/* Scale Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-titanium-300">SCULPTURE SCALE</span>
                  <span className="text-gold-400 font-bold">{scalePercentage}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={scalePercentage}
                  onChange={(e) => setScalePercentage(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-titanium-500">
                  <span>50% Mini Scale</span>
                  <span>100% Native STL</span>
                  <span>200% Monumental</span>
                </div>
              </div>

              {/* Infill Density */}
              <div className="space-y-2 pt-4 border-t border-obsidian-800">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-titanium-300">INTERNAL INFILL DENSITY</span>
                  <span className="text-gold-400 font-bold">{infillDensity}% Gyroid Infill</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  step="5"
                  value={infillDensity}
                  onChange={(e) => setInfillDensity(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-titanium-500">
                  <span>15% Lightweight</span>
                  <span>50% Balanced</span>
                  <span>100% Solid Heavy Cast</span>
                </div>
              </div>

              {/* Layer Resolution Toggle */}
              <div className="pt-4 border-t border-obsidian-800">
                <span className="text-xs font-mono text-titanium-300 block mb-2">
                  LAYER SLICE RESOLUTION
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {['0.015mm (16K Ultra)', '0.030mm (Fast Draft)'].map((res) => (
                    <button
                      key={res}
                      onClick={() => setLayerHeight(res)}
                      className={`p-2.5 rounded-lg text-xs font-mono text-center border transition-all ${
                        layerHeight === res
                          ? 'border-gold-500 bg-gold-500/10 text-gold-300 font-bold'
                          : 'border-obsidian-700 bg-obsidian-950 text-titanium-400 hover:text-white'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Finishing Options */}
            <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/80 border border-obsidian-700/80 space-y-4">
              <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">
                4. ARTISAN POST-PROCESSING FINISH
              </span>

              <div className="space-y-2.5">
                {FINISH_OPTIONS.map((f) => (
                  <label
                    key={f.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedFinish.id === f.id
                        ? 'border-gold-500 bg-gold-500/10 text-gold-200 shadow-gold-glow/20'
                        : 'border-obsidian-700 bg-obsidian-950/70 text-titanium-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="finish"
                      checked={selectedFinish.id === f.id}
                      onChange={() => setSelectedFinish(f)}
                      className="mt-1 text-gold-500 focus:ring-gold-500"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{f.name}</span>
                        <span className="font-mono text-gold-400 font-bold">
                          {f.cost === 0 ? 'Included' : `+${formatPrice(f.cost)}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-titanium-400 mt-0.5">{f.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Engineering Telemetry & Instant Quote */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/90 border border-gold-500/30 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-obsidian-800">
                <h3 className="text-lg font-display font-bold text-foreground">
                  Commission Quotation
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 text-[10px] font-mono font-bold">
                  REAL-TIME ESTIMATE
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800">
                  <span className="text-[10px] text-titanium-400 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-gold-400" /> RESIN VOLUME
                  </span>
                  <span className="text-foreground font-bold text-sm block mt-1">
                    {infillAdjustedVolume} cm³
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800">
                  <span className="text-[10px] text-titanium-400 flex items-center gap-1">
                    <Weight className="w-3 h-3 text-gold-400" /> ESTIMATED WEIGHT
                  </span>
                  <span className="text-foreground font-bold text-sm block mt-1">
                    {estimatedWeightGrams} g
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800">
                  <span className="text-[10px] text-titanium-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-400" /> PRINT DURATION
                  </span>
                  <span className="text-foreground font-bold text-sm block mt-1">
                    ~{estimatedHours} Hours
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800">
                  <span className="text-[10px] text-titanium-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-gold-400" /> RESOLUTION
                  </span>
                  <span className="text-gold-400 font-bold text-sm block mt-1">
                    16K (0.015mm)
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-2 border-t border-obsidian-800 text-xs">
                <div className="flex justify-between text-titanium-400 font-mono">
                  <span>Resin Polymer ({selectedMaterial.name})</span>
                  <span>{formatPrice(materialCost)}</span>
                </div>
                <div className="flex justify-between text-titanium-400 font-mono">
                  <span>Laser Machine Time (~{estimatedHours}h)</span>
                  <span>{formatPrice(machineTimeCost)}</span>
                </div>
                <div className="flex justify-between text-titanium-400 font-mono">
                  <span>Post-Processing Finish ({selectedFinish.name})</span>
                  <span>{formatPrice(selectedFinish.cost)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-3 border-t border-obsidian-800 font-mono">
                  <span>Estimated Total</span>
                  <span className="text-2xl text-gold-400 font-display">
                    {formatPrice(totalCalculatedCost)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-gold-glow transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Queue Custom Print Order</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-titanium-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>Non-Disclosure &amp; IP Protection Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
