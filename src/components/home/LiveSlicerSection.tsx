'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Layers, Sliders, Cpu, Activity, Clock, Weight, DollarSign, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface PresetModel {
  id: string;
  name: string;
  heightMm: number;
  baseVolumeCm3: number;
  recommendedMaterial: string;
}

const PRESET_MODELS: PresetModel[] = [
  {
    id: 'gearbox',
    name: 'planetary gearbox (5:1)',
    heightMm: 58,
    baseVolumeCm3: 110,
    recommendedMaterial: 'Carbon Fiber PA-CF',
  },
  {
    id: 'drone-arm',
    name: 'topological drone arm',
    heightMm: 38,
    baseVolumeCm3: 42,
    recommendedMaterial: 'Carbon Fiber PA-CF',
  },
  {
    id: 'turbine',
    name: 'centrifugal turbine',
    heightMm: 42,
    baseVolumeCm3: 88,
    recommendedMaterial: 'Industrial PETG',
  },
  {
    id: 'gripper',
    name: 'compliant gripper',
    heightMm: 32,
    baseVolumeCm3: 65,
    recommendedMaterial: 'TPU 95A Flexible',
  },
];

interface MaterialSpec {
  id: string;
  name: string;
  density: number; // g/cm³
  costPerKg: number;
  baseTensileMPa: number;
  nozzleTemp: number;
  bedTemp: number;
}

const MATERIALS: MaterialSpec[] = [
  {
    id: 'pacf',
    name: 'Carbon Fiber PA-CF',
    density: 1.18,
    costPerKg: 75,
    baseTensileMPa: 115,
    nozzleTemp: 285,
    bedTemp: 100,
  },
  {
    id: 'plaplus',
    name: 'PLA+ Biopolymer',
    density: 1.24,
    costPerKg: 32,
    baseTensileMPa: 75,
    nozzleTemp: 215,
    bedTemp: 60,
  },
  {
    id: 'petg',
    name: 'Industrial PETG',
    density: 1.27,
    costPerKg: 38,
    baseTensileMPa: 68,
    nozzleTemp: 245,
    bedTemp: 80,
  },
  {
    id: 'tpu',
    name: 'TPU 95A Flexible',
    density: 1.21,
    costPerKg: 52,
    baseTensileMPa: 48,
    nozzleTemp: 230,
    bedTemp: 50,
  },
];

export default function LiveSlicerSection() {
  const { formatPrice } = useCurrency();

  const [selectedModel, setSelectedModel] = useState<PresetModel>(PRESET_MODELS[0]);
  const [layerHeight, setLayerHeight] = useState<number>(0.12);
  const [infillDensity, setInfillDensity] = useState<number>(40);
  const [infillPattern, setInfillPattern] = useState<'gyroid' | 'honeycomb' | 'grid'>('gyroid');
  const [wallLoops, setWallLoops] = useState<number>(4);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialSpec>(MATERIALS[0]);

  // Real 3D printing logic calculation
  const calculations = useMemo(() => {
    const totalLayers = Math.round(selectedModel.heightMm / layerHeight);

    // Shell volume vs Infill volume
    // Shell volume fraction depends on wallLoops
    const shellFraction = Math.min(0.6, wallLoops * 0.08);
    const effectiveInfill = shellFraction + (1 - shellFraction) * (infillDensity / 100);
    const netVolumeCm3 = selectedModel.baseVolumeCm3 * effectiveInfill;

    // Filament Mass (g)
    const massGrams = Math.round(netVolumeCm3 * selectedMaterial.density);

    // Filament length in meters for 1.75mm diameter filament
    // Area of 1.75mm circle = π * (1.75 / 2)^2 ≈ 2.405 mm² = 0.02405 cm²
    const filamentLengthMeters = Math.round(netVolumeCm3 / (0.02405 * 100));

    // Print speed & time: based on volumetric extrusion (~14 mm³/s average on modern CoreXY)
    // plus layer travel overhead
    const volumeMm3 = netVolumeCm3 * 1000;
    const extrusionSec = volumeMm3 / 16;
    const layerChangeOverheadSec = totalLayers * 0.9;
    const totalSec = extrusionSec + layerChangeOverheadSec;
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.round((totalSec % 3600) / 60);

    // Tensile strength estimate (MPa)
    const tensileFactor = (infillDensity / 100) * 0.55 + (wallLoops / 6) * 0.45;
    const tensileMpa = Math.round(selectedMaterial.baseTensileMPa * tensileFactor);

    // Cost estimate
    const materialCost = (massGrams / 1000) * selectedMaterial.costPerKg;
    const machineHours = totalSec / 3600;
    const machineDepreciation = machineHours * 3.5;
    const baseHandling = 8.0;
    const totalQuote = Math.max(18, Math.round(materialCost + machineDepreciation + baseHandling));

    return {
      totalLayers,
      massGrams,
      filamentLengthMeters,
      hours,
      minutes,
      tensileMpa,
      totalQuote,
    };
  }, [selectedModel, layerHeight, infillDensity, wallLoops, selectedMaterial]);

  return (
    <section
      id="live-slicer"
      className="py-24 sm:py-32 bg-white text-black select-none border-t border-neutral-200 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="gsap-appear-left max-w-3xl mb-16 sm:mb-20">
          <span className="text-xs font-mono text-neutral-400 lowercase tracking-widest block mb-2">
            g-code simulation engine
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] lowercase text-black leading-none">
            live 3d slicer &amp; telemetry.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-normal lowercase mt-4 leading-relaxed max-w-xl">
            tweak layer heights, infill density, and composite filaments. our real-time slicing engine computes exact machine toolpaths, layer counts, and fabrication costs.
          </p>
        </div>

        <div className="gsap-split-row grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Slicer Controls & Input Parameters */}
          <div className="gsap-col-left lg:col-span-7 bg-neutral-50 border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
            {/* 1. Model Preset Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-neutral-500 lowercase tracking-wider">
                  [01] target cad model
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {selectedModel.heightMm}mm z-height · {selectedModel.baseVolumeCm3}cm³
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium lowercase tracking-tight text-left transition-all ${
                      selectedModel.id === model.id
                        ? 'bg-black text-white shadow-md'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Layer Height Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-neutral-500 lowercase tracking-wider">
                  [02] layer slicing height
                </span>
                <span className="text-xs font-bold font-mono text-black">
                  {layerHeight.toFixed(2)} mm
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { val: 0.08, label: '0.08mm ultra' },
                  { val: 0.12, label: '0.12mm fine' },
                  { val: 0.16, label: '0.16mm optimal' },
                  { val: 0.20, label: '0.20mm draft' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setLayerHeight(item.val)}
                    className={`py-2 rounded-xl text-xs font-medium lowercase text-center transition-all ${
                      layerHeight === item.val
                        ? 'bg-black text-white font-bold'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Infill Density & Pattern */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-neutral-500 lowercase tracking-wider">
                  [03] internal infill density
                </span>
                <span className="text-xs font-bold font-mono text-black">
                  {infillDensity}% · {infillPattern}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={infillDensity}
                onChange={(e) => setInfillDensity(Number(e.target.value))}
                className="w-full accent-black h-2 bg-neutral-200 rounded-lg cursor-pointer"
              />
              <div className="flex items-center justify-between mt-3 gap-2">
                {(['gyroid', 'honeycomb', 'grid'] as const).map((pat) => (
                  <button
                    key={pat}
                    onClick={() => setInfillPattern(pat)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono lowercase transition-colors ${
                      infillPattern === pat
                        ? 'bg-neutral-800 text-white'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    {pat}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Wall Loops / Shells */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-neutral-500 lowercase tracking-wider">
                  [04] perimeter wall loops
                </span>
                <span className="text-xs font-bold font-mono text-black">
                  {wallLoops} walls ({(wallLoops * 0.4).toFixed(1)}mm solid shell)
                </span>
              </div>
              <div className="flex gap-2">
                {[2, 3, 4, 6].map((loops) => (
                  <button
                    key={loops}
                    onClick={() => setWallLoops(loops)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium lowercase text-center transition-all ${
                      wallLoops === loops
                        ? 'bg-black text-white font-bold'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {loops} perimeters
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Filament & Material Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-neutral-500 lowercase tracking-wider">
                  [05] engineering filament
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  nozzle: {selectedMaterial.nozzleTemp}°c · bed: {selectedMaterial.bedTemp}°c
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedMaterial.id === mat.id
                        ? 'bg-white border-black shadow-md ring-1 ring-black'
                        : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-bold lowercase text-black mb-1">
                      {mat.name}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      {mat.baseTensileMPa} mpa tensile · {mat.density} g/cm³
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Telemetry HUD & Instant Quote */}
          <div className="gsap-col-right lg:col-span-5 flex flex-col gap-6">
            {/* Live Telemetry Display Card */}
            <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-800">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono lowercase tracking-wider text-neutral-300">
                    slicer telemetry ready
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase text-neutral-500 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                  corexy 500mm/s
                </span>
              </div>

              {/* Slicing Metrics Grid */}
              <div className="grid grid-cols-2 gap-6 my-6">
                <div>
                  <span className="text-[11px] font-mono text-neutral-400 lowercase block mb-1">
                    total layer slices
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                    {calculations.totalLayers.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 block mt-0.5">
                    @ {layerHeight}mm z-step
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-neutral-400 lowercase block mb-1">
                    estimated print time
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                    {calculations.hours}h {calculations.minutes}m
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 block mt-0.5">
                    16 mm³/s flow
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-neutral-400 lowercase block mb-1">
                    filament mass
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                    {calculations.massGrams} g
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 block mt-0.5">
                    ~{calculations.filamentLengthMeters}m spool
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-neutral-400 lowercase block mb-1">
                    tensile strength
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-emerald-400">
                    {calculations.tensileMpa} MPa
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 block mt-0.5">
                    yield tolerance
                  </span>
                </div>
              </div>

              {/* Simulated Layer Toolpath Visual Bar */}
              <div className="bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800/80 mb-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
                  <span>toolpath distribution</span>
                  <span>{wallLoops * 2} loops + {infillDensity}% infill</span>
                </div>
                <div className="h-3 w-full rounded-full bg-neutral-800 flex overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(50, wallLoops * 10)}%` }}
                    title="Outer & Inner Perimeters"
                  />
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${infillDensity * 0.4}%` }}
                    title="Structural Infill"
                  />
                  <div
                    className="bg-blue-500 flex-1 h-full opacity-60"
                    title="Internal Cavity"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    walls
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                    {infillPattern} infill
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                    travels
                  </span>
                </div>
              </div>

              {/* Instant Price & Quote Box */}
              <div className="pt-4 border-t border-neutral-800 flex items-end justify-between">
                <div>
                  <span className="text-xs font-mono text-neutral-400 lowercase block mb-1">
                    instant print estimate
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {formatPrice(calculations.totalQuote)}
                  </div>
                </div>

                <Link
                  href="/custom-print"
                  className="px-5 py-3 rounded-full bg-white text-black font-semibold text-xs lowercase tracking-tight hover:bg-neutral-200 transition-all shadow-lg flex items-center gap-1.5 hover:scale-105"
                >
                  <span>order 3d print</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Custom File Upload Callout Box */}
            <div className="p-6 rounded-3xl border border-neutral-200 bg-white flex items-center justify-between shadow-xs">
              <div>
                <h4 className="text-sm font-bold lowercase text-black">
                  have your own cad file?
                </h4>
                <p className="text-xs text-neutral-500 lowercase mt-0.5">
                  drop your STL, STEP, or OBJ for instant automated slicing.
                </p>
              </div>
              <Link
                href="/custom-print"
                className="px-4 py-2 rounded-full border border-neutral-300 text-xs font-medium text-neutral-800 hover:border-black hover:text-black transition-colors lowercase"
              >
                upload stl &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
