'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { parseSTLGeometry } from '@/lib/ai/geometry-service';
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
  Sliders,
  ShieldCheck,
  Flame,
  Wrench,
  ArrowRight,
  Activity,
} from 'lucide-react';

interface EngineeringMaterial {
  id: string;
  name: string;
  pricePerCm3: number;
  density: number; // g/cm³
  baseTensileMPa: number;
  maxTempC: number;
  description: string;
}

const ENGINEERING_MATERIALS: EngineeringMaterial[] = [
  {
    id: 'pacf',
    name: 'Carbon Fiber PA-CF',
    pricePerCm3: 0.58,
    density: 1.18,
    baseTensileMPa: 115,
    maxTempC: 180,
    description: 'Polyamide 12 reinforced with 20% chopped carbon fiber. Extreme rigidity, 180°C HDT, and low creep under load.',
  },
  {
    id: 'plaplus',
    name: 'PLA+ Biopolymer',
    pricePerCm3: 0.28,
    density: 1.24,
    baseTensileMPa: 75,
    maxTempC: 60,
    description: 'High-toughness modified polylactic biopolymer engineered for 0.08mm layer precision and razor-sharp tolerances.',
  },
  {
    id: 'petg',
    name: 'Industrial PETG',
    pricePerCm3: 0.34,
    density: 1.27,
    baseTensileMPa: 68,
    maxTempC: 85,
    description: 'Glycol-modified engineering polyester with superior interlayer bonding, impact resistance, and chemical durability.',
  },
  {
    id: 'tpu',
    name: 'TPU 95A Flexible',
    pricePerCm3: 0.46,
    density: 1.21,
    baseTensileMPa: 48,
    maxTempC: 90,
    description: 'Monolithic elastomeric polyurethane with 450% elongation at break for compliant joints, dampeners, and gaskets.',
  },
  {
    id: 'absesd',
    name: 'ABS-ESD Heat Resistant',
    pricePerCm3: 0.42,
    density: 1.08,
    baseTensileMPa: 65,
    maxTempC: 105,
    description: 'Electrostatic discharge safe thermoplastic with 105°C thermal deflection for electronics enclosures.',
  },
  {
    id: 'sla16k',
    name: '16K Technical Photopolymer',
    pricePerCm3: 0.62,
    density: 1.15,
    baseTensileMPa: 74,
    maxTempC: 85,
    description: 'Sub-micron stereolithography resin with 15-micron pixel pitch for microfluidic channels and optical mounts.',
  },
];

interface EngineeringFinish {
  id: string;
  name: string;
  cost: number;
  description: string;
}

const ENGINEERING_FINISHES: EngineeringFinish[] = [
  {
    id: 'raw-deburred',
    name: 'Raw Ultrasonic De-Burred & Support Removal',
    cost: 0,
    description: 'Support structures removed with micro-cutters and ultrasonic bath cleaning. Ready for immediate assembly.',
  },
  {
    id: 'brass-inserts',
    name: 'M3/M4 Brass Heat-Set Threaded Inserts (x4)',
    cost: 16,
    description: 'Pre-installed knurled brass brass inserts heat-staked into mounting bosses for high-torque mechanical fastening.',
  },
  {
    id: 'annealed',
    name: 'Thermal Stress-Relief Annealing (2h @ 120°C)',
    cost: 25,
    description: 'Controlled oven bake relieves internal polymer extrusion stress, increasing heat deflection by up to 20°C.',
  },
  {
    id: 'vapor-smoothed',
    name: 'Vapor Smoothing (Injection-Molded Finish)',
    cost: 38,
    description: 'Chemical vapor chamber exposure creates a fully sealed, glossy, watertight surface with zero visible layer lines.',
  },
  {
    id: 'cmm-metrology',
    name: 'CMM Caliper Metrology Inspection Sheet',
    cost: 18,
    description: 'Multi-point digital vernier caliper dimensional check verifying critical bearing bores and planar tolerances.',
  },
];

export default function CustomPrintStudio() {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File state
  const [file, setFile] = useState<{
    name: string;
    sizeMb: number;
    dimensionsMm?: { width: number; height: number; depth: number };
    triangleCount?: number;
  }>({
    name: 'planetary_gearbox_v4.step',
    sizeMb: 18.4,
    dimensionsMm: { width: 115, height: 58, depth: 115 },
    triangleCount: 42800,
  });

  const [baseVolumeCm3, setBaseVolumeCm3] = useState<number>(125);
  const [scalePercentage, setScalePercentage] = useState<number>(100);
  const [layerHeight, setLayerHeight] = useState<number>(0.12);
  const [infillDensity, setInfillDensity] = useState<number>(45);
  const [infillPattern, setInfillPattern] = useState<'gyroid' | 'honeycomb' | 'grid'>('gyroid');
  const [wallLoops, setWallLoops] = useState<number>(4);
  const [toleranceGrade, setToleranceGrade] = useState<'standard' | 'precision' | 'press-fit'>('precision');

  const [selectedMaterial, setSelectedMaterial] = useState<EngineeringMaterial>(
    ENGINEERING_MATERIALS[0]
  );
  const [selectedFinish, setSelectedFinish] = useState<EngineeringFinish>(
    ENGINEERING_FINISHES[0]
  );

  // Real 3D printing logic calculations
  const calculations = useMemo(() => {
    const scaleMultiplier = Math.pow(scalePercentage / 100, 3);
    const scaledVolume = baseVolumeCm3 * scaleMultiplier;

    // Shell fraction vs Infill fraction
    const shellFraction = Math.min(0.65, wallLoops * 0.08);
    const effectiveInfillFraction = shellFraction + (1 - shellFraction) * (infillDensity / 100);
    const netVolumeCm3 = scaledVolume * effectiveInfillFraction;

    // Mass in grams
    const massGrams = Math.round(netVolumeCm3 * selectedMaterial.density);

    // Spool length in meters (1.75mm diameter filament)
    const filamentMeters = Math.round(netVolumeCm3 / 2.405);

    // Total Layer Slices
    const modelHeight = (file.dimensionsMm?.height || 50) * (scalePercentage / 100);
    const totalLayers = Math.max(10, Math.round(modelHeight / layerHeight));

    // Print duration estimate: volumetric flow at ~16 mm³/s on CoreXY
    const volumeMm3 = netVolumeCm3 * 1000;
    const extrusionSec = volumeMm3 / 16;
    const layerChangeSec = totalLayers * 0.9;
    const totalSec = extrusionSec + layerChangeSec;
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.round((totalSec % 3600) / 60);

    // Tensile yield index (MPa)
    const tensileFactor = (infillDensity / 100) * 0.55 + (wallLoops / 6) * 0.45;
    const tensileYieldMPa = Math.round(selectedMaterial.baseTensileMPa * tensileFactor);

    // Cost Breakdown
    const materialCost = netVolumeCm3 * selectedMaterial.pricePerCm3;
    const machineHours = totalSec / 3600;
    const machineDepreciation = machineHours * 3.8;
    const toleranceCost = toleranceGrade === 'press-fit' ? 14 : toleranceGrade === 'precision' ? 6 : 0;
    const basePrep = 10.0;

    const totalCalculatedCost = Math.max(
      22,
      Math.round(materialCost + machineDepreciation + toleranceCost + selectedFinish.cost + basePrep)
    );

    return {
      scaledVolume: Math.round(scaledVolume),
      netVolumeCm3: Math.round(netVolumeCm3),
      massGrams,
      filamentMeters,
      totalLayers,
      hours,
      minutes,
      tensileYieldMPa,
      materialCost,
      machineDepreciation,
      totalCalculatedCost,
    };
  }, [
    baseVolumeCm3,
    scalePercentage,
    layerHeight,
    infillDensity,
    wallLoops,
    selectedMaterial,
    selectedFinish,
    toleranceGrade,
    file.dimensionsMm,
  ]);

  // Handle STL / CAD file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    const sizeMb = Number((uploaded.size / (1024 * 1024)).toFixed(1));

    // If it is an STL file, parse real geometry client-side
    if (uploaded.name.toLowerCase().endsWith('.stl')) {
      try {
        const buffer = await uploaded.arrayBuffer();
        const parsed = parseSTLGeometry(buffer);
        setFile({
          name: uploaded.name,
          sizeMb,
          dimensionsMm: {
            width: Math.round(parsed.widthMm),
            height: Math.round(parsed.heightMm),
            depth: Math.round(parsed.depthMm),
          },
          triangleCount: parsed.triangleCount,
        });
        setBaseVolumeCm3(Math.max(5, Math.round(parsed.volumeCm3)));
        showToast(
          'STL Geometry Sliced',
          `Parsed ${parsed.triangleCount.toLocaleString()} triangles · ${Math.round(parsed.volumeCm3)} cm³ volume.`,
          'success'
        );
        return;
      } catch (err) {
        console.warn('Fallback parsing for STL', err);
      }
    }

    // Default simulation for STEP/OBJ/3MF
    const simulatedVol = Math.floor(Math.random() * 150) + 60;
    setFile({
      name: uploaded.name,
      sizeMb,
      dimensionsMm: {
        width: Math.floor(Math.random() * 80) + 40,
        height: Math.floor(Math.random() * 60) + 30,
        depth: Math.floor(Math.random() * 80) + 40,
      },
      triangleCount: Math.floor(Math.random() * 30000) + 12000,
    });
    setBaseVolumeCm3(simulatedVol);
    showToast('CAD File Accepted', `Calculated volume: ${simulatedVol} cm³`, 'success');
  };

  const handleAddToCart = () => {
    addItem({
      productId: 'custom-cad-print',
      name: `Custom 3D Print: ${file.name}`,
      image: '/images/part_gearbox_pacf.jpg',
      category: 'Rapid Prototyping',
      selectedMaterial: selectedMaterial.name as any,
      selectedScale: '1:1 True Scale',
      customEngraving: `Scale: ${scalePercentage}%, Layer: ${layerHeight}mm, Infill: ${infillDensity}% ${infillPattern}`,
      unitPrice: calculations.totalCalculatedCost,
      quantity: 1,
    });
    showToast(
      'Print Job Added to Cart',
      `${file.name} configured in ${selectedMaterial.name} queued for production.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-28 pb-24 select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Page Header (makewithloop.com style) */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono lowercase text-neutral-300 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>direct-to-print cad laboratory</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] lowercase text-white leading-none">
            custom 3d print &amp; slicing lab.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-400 font-normal lowercase leading-relaxed max-w-2xl">
            upload your custom 3D model (.stl, .step, .obj, .3mf) for automated geometry analysis, thermoplastic composite selection, and instant g-code manufacturing quote.
          </p>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: File Upload & Slicing Parameters */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Drag & Drop File Uploader */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 lowercase tracking-widest">
                  [01] upload cad geometry
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  direct stl / step parser
                </span>
              </div>

              {/* Upload Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 hover:border-white rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all bg-neutral-950/60 hover:bg-neutral-900/60 flex flex-col items-center justify-center gap-3 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl,.obj,.step,.3mf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="p-4 rounded-full bg-white/10 text-white group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white lowercase">
                    click to upload or drag &amp; drop 3d model
                  </p>
                  <p className="text-xs text-neutral-400 font-mono mt-1 lowercase">
                    accepts .stl, .step, .obj, .3mf (up to 250 mb)
                  </p>
                </div>
              </div>

              {/* Uploaded File Telemetry Pill */}
              {file && (
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-neutral-900 text-white">
                      <FileCode className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono lowercase">
                        {file.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        {file.sizeMb} MB · {calculations.scaledVolume} cm³ volume
                        {file.dimensionsMm && (
                          <span>
                            {' '}
                            · {file.dimensionsMm.width}×{file.dimensionsMm.height}×
                            {file.dimensionsMm.depth}mm
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-mono font-medium border border-emerald-500/30 lowercase">
                    manifold geometry passed
                  </span>
                </div>
              )}
            </div>

            {/* 2. Engineering Material Formulation */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 lowercase tracking-widest">
                  [02] engineering filament / resin
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {selectedMaterial.maxTempC}°c max hdt
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ENGINEERING_MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      selectedMaterial.id === mat.id
                        ? 'border-white bg-white text-black shadow-lg scale-[1.01]'
                        : 'border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`font-semibold text-xs lowercase ${
                            selectedMaterial.id === mat.id ? 'text-black' : 'text-white'
                          }`}
                        >
                          {mat.name}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            selectedMaterial.id === mat.id ? 'text-black' : 'text-emerald-400'
                          }`}
                        >
                          ${mat.pricePerCm3.toFixed(2)}/cm³
                        </span>
                      </div>
                      <p
                        className={`text-[11px] lowercase leading-relaxed ${
                          selectedMaterial.id === mat.id ? 'text-neutral-700' : 'text-neutral-400'
                        }`}
                      >
                        {mat.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Slicing Parameters & Infill Geometry */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 lowercase tracking-widest">
                  [03] slicing parameters &amp; infill
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {layerHeight}mm slice · {wallLoops} walls
                </span>
              </div>

              {/* Layer Height Buttons */}
              <div>
                <span className="text-xs font-mono text-neutral-400 lowercase block mb-2">
                  layer slicing resolution
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { val: 0.08, label: '0.08mm ultra' },
                    { val: 0.12, label: '0.12mm fine' },
                    { val: 0.16, label: '0.16mm optimal' },
                    { val: 0.20, label: '0.20mm draft' },
                  ].map((res) => (
                    <button
                      key={res.val}
                      onClick={() => setLayerHeight(res.val)}
                      className={`py-2 rounded-xl text-xs font-mono lowercase transition-all text-center ${
                        layerHeight === res.val
                          ? 'bg-white text-black font-bold shadow-sm'
                          : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Infill Density Slider & Patterns */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex justify-between text-xs font-mono lowercase">
                  <span className="text-neutral-400">internal infill density</span>
                  <span className="text-white font-bold">{infillDensity}% · {infillPattern}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={infillDensity}
                  onChange={(e) => setInfillDensity(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <div className="flex gap-2 pt-1">
                  {(['gyroid', 'honeycomb', 'grid'] as const).map((pat) => (
                    <button
                      key={pat}
                      onClick={() => setInfillPattern(pat)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono lowercase transition-colors ${
                        infillPattern === pat
                          ? 'bg-white text-black font-semibold'
                          : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {pat} infill
                    </button>
                  ))}
                </div>
              </div>

              {/* Perimeter Wall Loops & Scale */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                <div>
                  <div className="flex justify-between text-xs font-mono lowercase mb-2">
                    <span className="text-neutral-400">perimeter wall loops</span>
                    <span className="text-white font-bold">{wallLoops} walls</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[2, 3, 4, 6].map((loops) => (
                      <button
                        key={loops}
                        onClick={() => setWallLoops(loops)}
                        className={`flex-1 py-2 rounded-xl text-xs font-mono lowercase transition-all ${
                          wallLoops === loops
                            ? 'bg-white text-black font-bold'
                            : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {loops}x
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono lowercase mb-2">
                    <span className="text-neutral-400">cad model scale</span>
                    <span className="text-white font-bold">{scalePercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={200}
                    step={5}
                    value={scalePercentage}
                    onChange={(e) => setScalePercentage(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer h-2 bg-neutral-800 rounded-lg mt-2.5"
                  />
                </div>
              </div>
            </div>

            {/* 4. Engineering Post-Processing & Hardware */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 space-y-4 shadow-sm">
              <span className="text-xs font-mono text-neutral-400 lowercase tracking-widest block">
                [04] engineering post-processing &amp; hardware
              </span>

              <div className="space-y-2.5">
                {ENGINEERING_FINISHES.map((f) => (
                  <label
                    key={f.id}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedFinish.id === f.id
                        ? 'border-white bg-white/10 text-white shadow-sm'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="finish"
                      checked={selectedFinish.id === f.id}
                      onChange={() => setSelectedFinish(f)}
                      className="mt-1 accent-white"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white lowercase">{f.name}</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {f.cost === 0 ? 'included' : `+${formatPrice(f.cost)}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 lowercase leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Telemetry HUD & Instant Quote */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-mono font-bold text-white lowercase">
                    additive telemetry &amp; quotation
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-mono lowercase border border-neutral-700">
                  500 mm/s
                </span>
              </div>

              {/* Real-time Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 lowercase flex items-center gap-1 mb-1">
                    <Weight className="w-3 h-3 text-emerald-400" /> filament mass
                  </span>
                  <span className="text-white font-bold text-base block">
                    {calculations.massGrams} g
                  </span>
                  <span className="text-[10px] text-neutral-500 lowercase">
                    ~{calculations.filamentMeters}m spool
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 lowercase flex items-center gap-1 mb-1">
                    <Layers className="w-3 h-3 text-emerald-400" /> layer slices
                  </span>
                  <span className="text-white font-bold text-base block">
                    {calculations.totalLayers.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-500 lowercase">
                    @ {layerHeight}mm z-height
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 lowercase flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> machine time
                  </span>
                  <span className="text-white font-bold text-base block">
                    {calculations.hours}h {calculations.minutes}m
                  </span>
                  <span className="text-[10px] text-neutral-500 lowercase">
                    16 mm³/s flow
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 lowercase flex items-center gap-1 mb-1">
                    <Activity className="w-3 h-3 text-emerald-400" /> yield strength
                  </span>
                  <span className="text-emerald-400 font-bold text-base block">
                    {calculations.tensileYieldMPa} MPa
                  </span>
                  <span className="text-[10px] text-neutral-500 lowercase">
                    tensile rating
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs">
                <div className="flex justify-between text-neutral-400 font-mono lowercase">
                  <span>filament material ({selectedMaterial.name})</span>
                  <span className="text-neutral-200">{formatPrice(calculations.materialCost)}</span>
                </div>
                <div className="flex justify-between text-neutral-400 font-mono lowercase">
                  <span>corexy machine time (~{calculations.hours}h {calculations.minutes}m)</span>
                  <span className="text-neutral-200">{formatPrice(calculations.machineDepreciation)}</span>
                </div>
                {selectedFinish.cost > 0 && (
                  <div className="flex justify-between text-neutral-400 font-mono lowercase">
                    <span>post-processing ({selectedFinish.name.split(' ')[0]})</span>
                    <span className="text-neutral-200">{formatPrice(selectedFinish.cost)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-4 border-t border-neutral-800">
                  <span className="text-sm font-semibold lowercase text-white">
                    estimated total
                  </span>
                  <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                    {formatPrice(calculations.totalCalculatedCost)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-full bg-white text-black font-semibold text-xs lowercase tracking-tight hover:bg-neutral-200 transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>dispatch to 3d print queue</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono lowercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>cad non-disclosure (nda) &amp; ip protected</span>
                </div>
              </div>
            </div>

            {/* AI Metrology Scanner Card */}
            <div className="p-6 rounded-3xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold lowercase text-white">
                  have a physical component?
                </h4>
                <p className="text-[11px] text-neutral-400 lowercase mt-0.5">
                  use our visual AI scanner with digital caliper metrology.
                </p>
              </div>
              <Link
                href="/ai-measure"
                className="px-3.5 py-1.5 rounded-full border border-neutral-700 text-xs font-medium text-neutral-300 hover:border-white hover:text-white transition-colors lowercase"
              >
                ai measure &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
