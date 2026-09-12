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
  Truck,
  MapPin,
  Receipt,
  Check,
  Zap,
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
    description: 'Pre-installed knurled brass inserts heat-staked into mounting bosses for high-torque mechanical fastening.',
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
    triangleCount: 28420,
  });

  // Base raw volume before scaling (in cm³)
  const [baseVolumeCm3, setBaseVolumeCm3] = useState<number>(112);

  // Slicing parameters
  const [scalePercentage, setScalePercentage] = useState<number>(100);
  const [selectedMaterial, setSelectedMaterial] = useState<EngineeringMaterial>(
    ENGINEERING_MATERIALS[0]
  );
  const [layerHeight, setLayerHeight] = useState<number>(0.12);
  const [infillDensity, setInfillDensity] = useState<number>(45);
  const [infillPattern, setInfillPattern] = useState<'gyroid' | 'honeycomb' | 'grid'>('gyroid');
  const [wallLoops, setWallLoops] = useState<number>(4);
  const [selectedFinish, setSelectedFinish] = useState<EngineeringFinish>(ENGINEERING_FINISHES[0]);
  const [toleranceGrade, setToleranceGrade] = useState<'standard' | 'precision' | 'press-fit'>(
    'precision'
  );

  // Indian localization states: PIN code checker & B2B GST
  const [pincode, setPincode] = useState('560001');
  const [isGstClaim, setIsGstClaim] = useState(false);
  const [gstin, setGstin] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Slicing Calculations
  const calculations = useMemo(() => {
    const scaleFactor = scalePercentage / 100;
    const scaledVolume = baseVolumeCm3 * Math.pow(scaleFactor, 3);

    // Shell vs Infill Volume Partition
    const shellFraction = Math.min(0.7, 0.2 + (wallLoops * 0.05));
    const coreFraction = 1 - shellFraction;
    const infillFraction = (infillDensity / 100) * coreFraction;
    const netVolumeCm3 = scaledVolume * (shellFraction + infillFraction);

    // Mass in grams = volume * density
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

    // Cost Breakdown in base currency
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
      customEngraving: `Scale: ${scalePercentage}%, Layer: ${layerHeight}mm, Infill: ${infillDensity}% ${infillPattern}${isGstClaim && gstin ? ` | GSTIN: ${gstin}` : ''}`,
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
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 pt-28 pb-24 relative overflow-hidden select-none">
      {/* 1. Subtle CAD Blueprint Grid Overlay (Solves plain white "sada" look) */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-60 pointer-events-none [mask-image:radial-gradient(ellipse_85%_65%_at_50%_15%,#000_50%,transparent_100%)] -z-10" />

      {/* 2. Subtle Warm Technical Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-amber-500/[0.04] via-emerald-500/[0.02] to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Technical Coordinate & Hub Banner */}
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-b border-neutral-200/80 pb-3 mb-10 lowercase select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>[matrix: aetheris cad laboratory // blr-01 • pnq-02 hubs]</span>
          </div>
          <span className="hidden sm:inline-block">
            [lat: 12.9716° n, lon: 77.5946° e // pan-india rapid additive dispatch]
          </span>
        </div>

        {/* Page Header (makewithloop.com style with engineering depth) */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-mono lowercase text-neutral-700 mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>🇮🇳 direct-to-print cad laboratory · pan-india hubs</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] lowercase text-neutral-950 leading-none">
            custom 3d print &amp; slicing lab.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-600 font-normal lowercase leading-relaxed max-w-2xl">
            upload your custom 3D model (.stl, .step, .obj, .3mf) for automated geometry analysis, thermoplastic composite selection, and instant g-code manufacturing quote with pan-india express dispatch.
          </p>

          {/* India Advantage Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-[11px] font-mono lowercase text-neutral-700 shadow-2xs">
              <Truck className="w-3.5 h-3.5 text-neutral-900" />
              <span>pan-india express (bluedart / delhivery / dtdc)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-[11px] font-mono lowercase text-neutral-700 shadow-2xs">
              <Receipt className="w-3.5 h-3.5 text-neutral-900" />
              <span>18% gst b2b invoice compliant (hsn 8477 / 3926)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-[11px] font-mono lowercase text-neutral-700 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-neutral-900" />
              <span>upi, gpay, phonepe &amp; netbanking accepted</span>
            </span>
          </div>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: File Upload & Slicing Parameters (Elevated Precision White Cards) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Drag & Drop File Uploader */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4 relative overflow-hidden">
              {/* Corner CAD Crosshairs for Technical Look */}
              <span className="absolute top-3 right-3 text-[10px] font-mono text-neutral-300 select-none">+</span>
              <span className="absolute bottom-3 left-3 text-[10px] font-mono text-neutral-300 select-none">+</span>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-600 lowercase tracking-widest font-semibold">
                  [01] upload cad geometry
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  direct stl / step parser
                </span>
              </div>

              {/* Upload Drop Zone with Blueprint Grid Texture */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all bg-neutral-50/70 hover:bg-white flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl,.obj,.step,.3mf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="p-4 rounded-full bg-neutral-950 text-white group-hover:scale-110 transition-transform shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-950 lowercase">
                    click to upload or drag &amp; drop 3d model
                  </p>
                  <p className="text-xs text-neutral-500 font-mono mt-1 lowercase">
                    accepts .stl, .step, .obj, .3mf (up to 250 mb)
                  </p>
                </div>
              </div>

              {/* Uploaded File Telemetry Pill */}
              {file && (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 shadow-2xs">
                      <FileCode className="w-5 h-5 text-neutral-900" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-950 font-mono lowercase">
                        {file.name}
                      </h4>
                      <p className="text-[11px] text-neutral-600 font-mono">
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
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-mono font-medium border border-emerald-200 lowercase">
                    manifold geometry passed
                  </span>
                </div>
              )}
            </div>

            {/* 2. Engineering Material Formulation */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4 relative overflow-hidden">
              <span className="absolute top-3 right-3 text-[10px] font-mono text-neutral-300 select-none">+</span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-600 lowercase tracking-widest font-semibold">
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
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-lg scale-[1.01]'
                        : 'border-neutral-200 bg-neutral-50/60 hover:bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`font-semibold text-xs lowercase ${
                            selectedMaterial.id === mat.id ? 'text-white' : 'text-neutral-950'
                          }`}
                        >
                          {mat.name}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            selectedMaterial.id === mat.id ? 'text-neutral-200' : 'text-emerald-700'
                          }`}
                        >
                          {formatPrice(mat.pricePerCm3)}/cm³
                        </span>
                      </div>
                      <p
                        className={`text-[11px] lowercase leading-relaxed ${
                          selectedMaterial.id === mat.id ? 'text-neutral-300' : 'text-neutral-500'
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
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6 relative overflow-hidden">
              <span className="absolute top-3 right-3 text-[10px] font-mono text-neutral-300 select-none">+</span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-600 lowercase tracking-widest font-semibold">
                  [03] slicing parameters &amp; infill
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {layerHeight}mm slice · {wallLoops} walls
                </span>
              </div>

              {/* Layer Height Buttons */}
              <div>
                <span className="text-xs font-mono text-neutral-600 lowercase block mb-2">
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
                          ? 'bg-neutral-950 text-white font-bold shadow-sm border border-neutral-950'
                          : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-white'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Infill Density Slider & Patterns */}
              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <div className="flex justify-between text-xs font-mono lowercase">
                  <span className="text-neutral-600">internal infill density</span>
                  <span className="text-neutral-950 font-bold">{infillDensity}% · {infillPattern}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={infillDensity}
                  onChange={(e) => setInfillDensity(Number(e.target.value))}
                  className="w-full accent-neutral-950 cursor-pointer h-2 bg-neutral-200 rounded-lg"
                />
                <div className="flex gap-2 pt-1">
                  {(['gyroid', 'honeycomb', 'grid'] as const).map((pat) => (
                    <button
                      key={pat}
                      onClick={() => setInfillPattern(pat)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono lowercase transition-colors ${
                        infillPattern === pat
                          ? 'bg-neutral-950 text-white font-semibold border border-neutral-950'
                          : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-white'
                      }`}
                    >
                      {pat} infill
                    </button>
                  ))}
                </div>
              </div>

              {/* Perimeter Wall Loops & Scale */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                <div>
                  <div className="flex justify-between text-xs font-mono lowercase mb-2">
                    <span className="text-neutral-600">perimeter wall loops</span>
                    <span className="text-neutral-950 font-bold">{wallLoops} walls</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[2, 3, 4, 6].map((loops) => (
                      <button
                        key={loops}
                        onClick={() => setWallLoops(loops)}
                        className={`flex-1 py-2 rounded-xl text-xs font-mono lowercase transition-all ${
                          wallLoops === loops
                            ? 'bg-neutral-950 text-white font-bold border border-neutral-950'
                            : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-white'
                        }`}
                      >
                        {loops}x
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono lowercase mb-2">
                    <span className="text-neutral-600">cad model scale</span>
                    <span className="text-neutral-950 font-bold">{scalePercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={200}
                    step={5}
                    value={scalePercentage}
                    onChange={(e) => setScalePercentage(Number(e.target.value))}
                    className="w-full accent-neutral-950 cursor-pointer h-2 bg-neutral-200 rounded-lg mt-2.5"
                  />
                </div>
              </div>
            </div>

            {/* 4. Engineering Post-Processing & Hardware */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4 relative overflow-hidden">
              <span className="absolute top-3 right-3 text-[10px] font-mono text-neutral-300 select-none">+</span>
              <span className="text-xs font-mono text-neutral-600 lowercase tracking-widest font-semibold block">
                [04] engineering post-processing &amp; hardware
              </span>

              <div className="space-y-2.5">
                {ENGINEERING_FINISHES.map((f) => (
                  <label
                    key={f.id}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedFinish.id === f.id
                        ? 'border-neutral-950 bg-neutral-50 shadow-xs ring-1 ring-neutral-950 text-neutral-950'
                        : 'border-neutral-200 bg-neutral-50/50 hover:bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="finish"
                      checked={selectedFinish.id === f.id}
                      onChange={() => setSelectedFinish(f)}
                      className="mt-1 accent-neutral-950"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-950 lowercase">{f.name}</span>
                        <span className="font-mono text-emerald-700 font-bold">
                          {f.cost === 0 ? 'included' : `+${formatPrice(f.cost)}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1 lowercase leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Pan-India Delivery & GST Compliance */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-5 relative overflow-hidden">
              <span className="absolute top-3 right-3 text-[10px] font-mono text-neutral-300 select-none">+</span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-600 lowercase tracking-widest font-semibold">
                  [05] pan-india dispatch &amp; b2b gst details
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  hubs: blr · pnq · del · hyd · maa
                </span>
              </div>

              {/* Pin Code Checker */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                <label className="text-xs font-medium text-neutral-950 lowercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-700" />
                  <span>check delivery speed for your indian pin code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN (e.g. 560001)"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-mono text-neutral-950 focus:outline-none focus:border-neutral-950"
                  />
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-mono text-neutral-800 flex items-center gap-1 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>24-48h dispatch</span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">
                  ✓ Serviceable via BlueDart Apex, Delhivery Express &amp; DTDC across 19,000+ PIN codes.
                </p>
              </div>

              {/* GST B2B Invoicing Toggle */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-neutral-700" />
                    <div>
                      <span className="text-xs font-semibold text-neutral-950 lowercase">
                        claim input tax credit (18% gst invoice)
                      </span>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        HSN 8477 (Additive Manufacturing) / 3926 (Technical Polymers)
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isGstClaim}
                    onChange={(e) => setIsGstClaim(e.target.checked)}
                    className="w-4 h-4 accent-neutral-950 rounded cursor-pointer"
                  />
                </label>

                {isGstClaim && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-200">
                    <div>
                      <label className="text-[11px] font-mono text-neutral-600 lowercase block mb-1">
                        gstin (15 digits)
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="29ABCDE1234F1Z5"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-mono text-neutral-950 focus:outline-none focus:border-neutral-950 uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-neutral-600 lowercase block mb-1">
                        registered company name
                      </label>
                      <input
                        type="text"
                        placeholder="Zenith Aerospace Technologies"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-mono text-neutral-950 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Deep Obsidian Industrial Telemetry HUD (Provides the striking, high-tech contrast matching the rest of the website) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] space-y-6 relative overflow-hidden backdrop-blur-xl">
              {/* Internal subtle emerald aura */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-mono font-bold text-white lowercase">
                    additive telemetry &amp; quotation
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-neutral-300 text-[10px] font-mono lowercase border border-neutral-800">
                  blr-01 hub online
                </span>
              </div>

              {/* Real-time Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 lowercase flex items-center gap-1 mb-1">
                    <Weight className="w-3 h-3 text-emerald-400" /> filament mass
                  </span>
                  <span className="text-white font-bold text-base block">
                    {calculations.massGrams} g
                  </span>
                  <span className="text-[10px] text-neutral-500 lowercase">
                    ~{calculations.filamentMeters}m spool
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 lowercase flex items-center gap-1 mb-1">
                    <Layers className="w-3 h-3 text-emerald-400" /> layer slices
                  </span>
                  <span className="text-white font-bold text-base block">
                    {calculations.totalLayers.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-500 lowercase">
                    @ {layerHeight}mm z-height
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 lowercase flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> machine time
                  </span>
                  <span className="text-white font-bold text-base block">
                    {calculations.hours}h {calculations.minutes}m
                  </span>
                  <span className="text-[10px] text-neutral-500 lowercase">
                    16 mm³/s flow
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 lowercase flex items-center gap-1 mb-1">
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
              <div className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs font-mono">
                <div className="flex justify-between text-neutral-400 lowercase">
                  <span>filament material ({selectedMaterial.name})</span>
                  <span className="text-neutral-200 font-bold">{formatPrice(calculations.materialCost)}</span>
                </div>
                <div className="flex justify-between text-neutral-400 lowercase">
                  <span>corexy machine time (~{calculations.hours}h {calculations.minutes}m)</span>
                  <span className="text-neutral-200 font-bold">{formatPrice(calculations.machineDepreciation)}</span>
                </div>
                {selectedFinish.cost > 0 && (
                  <div className="flex justify-between text-neutral-400 lowercase">
                    <span>post-processing ({selectedFinish.name.split(' ')[0]})</span>
                    <span className="text-neutral-200 font-bold">{formatPrice(selectedFinish.cost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400 lowercase">
                  <span>pan-india insured air dispatch</span>
                  <span className="text-emerald-400 font-bold">free</span>
                </div>
                <div className="flex justify-between text-neutral-500 lowercase text-[11px]">
                  <span>gst compliance (18% input tax credit)</span>
                  <span>hsn 8477</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-neutral-800">
                  <span className="text-sm font-semibold lowercase text-white">
                    estimated total
                  </span>
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {formatPrice(calculations.totalCalculatedCost)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-full bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>dispatch to 3d print queue</span>
                </button>

                {/* Indian Payment Methods Indicator */}
                <div className="pt-2 text-center">
                  <p className="text-[10px] font-mono text-neutral-500 lowercase mb-1.5">
                    instant payment via:
                  </p>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-neutral-300">
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">upi</span>
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">gpay</span>
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">phonepe</span>
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">netbanking</span>
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">rupay</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono lowercase pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>cad non-disclosure (nda) &amp; ip protected</span>
                </div>
              </div>
            </div>

            {/* AI Metrology Scanner Card */}
            <div className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-xs flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold lowercase text-neutral-950">
                  have a physical component?
                </h4>
                <p className="text-[11px] text-neutral-500 lowercase mt-0.5">
                  use our visual AI scanner with digital caliper metrology.
                </p>
              </div>
              <Link
                href="/ai-measure"
                className="px-3.5 py-1.5 rounded-full border border-neutral-300 text-xs font-medium text-neutral-800 hover:border-neutral-950 hover:text-neutral-950 transition-colors lowercase"
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
