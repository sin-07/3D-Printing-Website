'use client';

import React, { useState, useEffect } from 'react';
import { StatueAnalysisResult, PricingBreakdown } from '@/types';
import { calculateDynamicPrice } from '@/lib/pricing/pricing-engine';
import { DEFAULT_PRICING_CONFIG } from '@/lib/pricing/pricing-config';
import MultiViewUploader from './MultiViewUploader';
import ImageCaliperCanvas from './ImageCaliperCanvas';
import TelemetryGauges from './TelemetryGauges';
import ManualOverrideSheet from './ManualOverrideSheet';
import PricingBreakdownCard from './PricingBreakdownCard';
import StatueViewer from '@/components/3d/StatueViewer';
import RevealText from '@/components/animations/RevealText';
import { useToast } from '@/context/ToastContext';
import { Cpu, Sparkles, Layers, ShieldCheck, RefreshCw, Eye, Sliders, Box } from 'lucide-react';

const INITIAL_ANALYSIS: StatueAnalysisResult = {
  id: 'ANALYSIS-BENCHMARK-1',
  timestamp: new Date().toISOString(),
  imageUrls: {
    previewUrl: '/images/hero_sculpture.jpg',
  },
  dimensions: {
    heightMm: { value: 280, unit: 'mm', confidence: 92, source: 'measured-reference', label: 'Height (28.0 cm)' },
    widthMm: { value: 145, unit: 'mm', confidence: 89, source: 'measured-reference', label: 'Width (14.5 cm)' },
    depthMm: { value: 110, unit: 'mm', confidence: 86, source: 'measured-reference', label: 'Depth (11.0 cm)' },
  },
  sizeCategory: { value: 'Standard Display (1:6 Scale)', confidence: 92, source: 'measured-reference' },
  volumeCm3: { value: 420, unit: 'cm³', confidence: 88, source: 'measured-reference' },
  surfaceAreaCm2: { value: 680, unit: 'cm²', confidence: 85, source: 'measured-reference' },
  infillDensityPercent: 30,
  detectedMaterial: { value: '16K Ultra-HD SLA Resin', confidence: 90, source: 'ai-estimated' },
  recommendedResinId: 'sla-16k-standard',
  estimatedWeightGrams: { value: 246, unit: 'g', confidence: 88, source: 'measured-reference' },
  complexityScore: { value: 78, confidence: 85, source: 'ai-estimated' },
  manufacturingDifficulty: { value: 'High', confidence: 85, source: 'ai-estimated' },
  estimatedSupportVolumeCm3: 135,
  estimatedMaterialConsumptionGrams: 375,
  estimatedPrintHours: { value: 12.8, unit: 'hours', confidence: 90, source: 'ai-estimated' },
  totalLayerCount: 18666,
  layerHeightMm: 0.015,
  segmentation: {
    x: 18,
    y: 12,
    width: 64,
    height: 76,
    contourPoints: [
      { x: 35, y: 14 },
      { x: 50, y: 12 },
      { x: 65, y: 14 },
      { x: 74, y: 30 },
      { x: 80, y: 55 },
      { x: 72, y: 75 },
      { x: 68, y: 88 },
      { x: 32, y: 88 },
      { x: 28, y: 75 },
      { x: 20, y: 55 },
      { x: 26, y: 30 },
    ],
  },
  referenceScale: {
    detected: true,
    type: 'credit-card',
    realDimensionMm: 85.6,
  },
  overallConfidenceScore: 90,
  manualVerificationRequired: false,
  warnings: [],
  notes: 'Calibrated using standard credit card reference in front view.',
};

export default function AiStatueStudio() {
  const { showToast } = useToast();
  const [analysis, setAnalysis] = useState<StatueAnalysisResult>(INITIAL_ANALYSIS);
  const [previewImage, setPreviewImage] = useState<string>('/images/hero_sculpture.jpg');
  const [activeMaterialId, setActiveMaterialId] = useState<string>('sla-16k-standard');
  const [activeFinishId, setActiveFinishId] = useState<string>('raw-cleaned');
  const [activePackagingId, setActivePackagingId] = useState<string>('standard-box');
  const [infillPercent, setInfillPercent] = useState<number>(30);
  const [layerHeightMm, setLayerHeightMm] = useState<number>(0.015);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'image-calipers' | '3d-turntable'>('image-calipers');

  // Compute pricing
  const [pricing, setPricing] = useState<PricingBreakdown>(() =>
    calculateDynamicPrice({
      heightMm: INITIAL_ANALYSIS.dimensions.heightMm.value,
      widthMm: INITIAL_ANALYSIS.dimensions.widthMm.value,
      depthMm: INITIAL_ANALYSIS.dimensions.depthMm.value,
      volumeCm3: INITIAL_ANALYSIS.volumeCm3.value,
      complexityScore: INITIAL_ANALYSIS.complexityScore.value,
      materialId: 'sla-16k-standard',
      finishId: 'raw-cleaned',
      packagingId: 'standard-box',
      infillDensityPercent: 30,
      layerHeightMm: 0.015,
    })
  );

  const config = DEFAULT_PRICING_CONFIG;
  const currentMaterial = config.materials.find((m) => m.id === activeMaterialId) || config.materials[0];
  const currentFinish = config.finishes.find((f) => f.id === activeFinishId) || config.finishes[0];
  const currentPackaging = config.packagingOptions.find((p) => p.id === activePackagingId) || config.packagingOptions[0];

  // Recalculate pricing on any parameter change
  const recalculateCurrentPricing = (
    height = analysis.dimensions.heightMm.value,
    width = analysis.dimensions.widthMm.value,
    depth = analysis.dimensions.depthMm.value,
    vol = analysis.volumeCm3.value,
    complexity = analysis.complexityScore.value,
    matId = activeMaterialId,
    finId = activeFinishId,
    packId = activePackagingId,
    infill = infillPercent,
    layerH = layerHeightMm
  ) => {
    const calculated = calculateDynamicPrice({
      heightMm: height,
      widthMm: width,
      depthMm: depth,
      volumeCm3: vol,
      complexityScore: complexity,
      materialId: matId,
      finishId: finId,
      packagingId: packId,
      infillDensityPercent: infill,
      layerHeightMm: layerH,
    });
    setPricing(calculated);
  };

  const handleAnalyzeImages = async (data: any) => {
    setIsLoading(true);
    try {
      if (data.images.frontBase64 && data.images.frontBase64.startsWith('data:image')) {
        setPreviewImage(data.images.frontBase64);
      } else if (data.images.frontBase64) {
        setPreviewImage(data.images.frontBase64);
      }

      const res = await fetch('/api/ai/measure-statue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Analysis failed');
      }

      setAnalysis(json.analysis);
      setPricing(json.pricing);
      showToast('AI Metrology Analysis Complete', `Confidence: ${json.analysis.overallConfidenceScore}%`, 'success');
    } catch (e: any) {
      console.error(e);
      showToast('Metrology Scan Notice', e.message || 'Used offline heuristic fallback.', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze3DFile = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/ai/parse-3d', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to parse 3D file');
      }

      setAnalysis(json.analysis);
      setPricing(json.pricing);
      setViewMode('3d-turntable');
      showToast('3D Mesh Parsed (Zero Approximation)', `${json.analysis.volumeCm3.value} cm³ • 100% confidence`, 'gold');
    } catch (e: any) {
      console.error(e);
      showToast('3D Parse Error', e.message || 'Could not parse CAD file', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateValues = (updates: any) => {
    let newHeight = updates.heightMm ?? analysis.dimensions.heightMm.value;
    let newWidth = updates.widthMm ?? analysis.dimensions.widthMm.value;
    let newDepth = updates.depthMm ?? analysis.dimensions.depthMm.value;
    let newInfill = updates.infillPercent ?? infillPercent;
    let newLayerHeight = updates.layerHeightMm ?? layerHeightMm;
    let newMatId = updates.materialId ?? activeMaterialId;
    let newFinId = updates.finishId ?? activeFinishId;
    let newPackId = updates.packagingId ?? activePackagingId;

    if (updates.infillPercent !== undefined) setInfillPercent(newInfill);
    if (updates.layerHeightMm !== undefined) setLayerHeightMm(newLayerHeight);
    if (updates.materialId) setActiveMaterialId(newMatId);
    if (updates.finishId) setActiveFinishId(newFinId);
    if (updates.packagingId) setActivePackagingId(newPackId);

    // Update derived metrics
    const newVol = Math.max(10, Math.round((newHeight * newWidth * newDepth * 0.38) / 1000));
    const matDef = config.materials.find((m) => m.id === newMatId) || config.materials[0];
    const newWeight = Math.round(newVol * (0.3 + (newInfill / 100) * 0.7) * matDef.densityGPerCm3);
    const newLayers = Math.ceil(newHeight / newLayerHeight);
    const newHours = Number(((newLayers * 5.4) / 3600).toFixed(1));

    setAnalysis((prev) => ({
      ...prev,
      dimensions: {
        heightMm: { ...prev.dimensions.heightMm, value: newHeight, source: 'measured-user', label: `Height (${(newHeight / 10).toFixed(1)} cm)` },
        widthMm: { ...prev.dimensions.widthMm, value: newWidth, source: 'measured-user', label: `Width (${(newWidth / 10).toFixed(1)} cm)` },
        depthMm: { ...prev.dimensions.depthMm, value: newDepth, source: 'measured-user', label: `Depth (${(newDepth / 10).toFixed(1)} cm)` },
      },
      volumeCm3: { ...prev.volumeCm3, value: newVol, source: 'measured-user' },
      estimatedWeightGrams: { ...prev.estimatedWeightGrams, value: newWeight, source: 'measured-user' },
      estimatedPrintHours: { ...prev.estimatedPrintHours, value: newHours },
      totalLayerCount: newLayers,
      layerHeightMm: newLayerHeight,
    }));

    recalculateCurrentPricing(
      newHeight,
      newWidth,
      newDepth,
      newVol,
      analysis.complexityScore.value,
      newMatId,
      newFinId,
      newPackId,
      newInfill,
      newLayerHeight
    );
  };

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>AI METROLOGY &amp; DYNAMIC PRICING ENGINE</span>
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground">
              Statue Metrology &amp; Instant Quote
            </h1>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-xs sm:text-sm text-titanium-400 leading-relaxed">
              Capture or upload statue imagery with optical reference calibration, or drop CAD models for zero-approximation 16K SLA volume slicing and itemized production quotation.
            </p>
          </RevealText>
        </div>

        {/* Step 1: Input Multi-Angle Uploader */}
        <MultiViewUploader
          onAnalyzeImages={handleAnalyzeImages}
          onAnalyze3DFile={handleAnalyze3DFile}
          isLoading={isLoading}
        />

        {/* Studio Workspace: Visualizer + Telemetry + Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visualizers & Telemetry Gauges (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Viewport Mode Switcher */}
            <div className="flex items-center justify-between bg-obsidian-900/80 p-2 rounded-xl border border-obsidian-700/80">
              <span className="text-xs font-mono text-titanium-300 font-semibold px-2">
                ACTIVE VIEWPORT
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('image-calipers')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    viewMode === 'image-calipers'
                      ? 'bg-gold-500 text-obsidian-950 font-bold'
                      : 'text-titanium-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Optical Calipers</span>
                </button>
                <button
                  onClick={() => setViewMode('3d-turntable')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    viewMode === '3d-turntable'
                      ? 'bg-gold-500 text-obsidian-950 font-bold'
                      : 'text-titanium-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Laser Scanner</span>
                </button>
              </div>
            </div>

            {/* Viewport 1: Image Caliper Canvas */}
            {viewMode === 'image-calipers' ? (
              <ImageCaliperCanvas
                analysis={analysis}
                imageSrc={previewImage}
              />
            ) : (
              /* Viewport 2: 3D Turntable Scanner */
              <div className="rounded-2xl border border-gold-500/30 overflow-hidden shadow-2xl bg-obsidian-950">
                <StatueViewer
                  initialMaterial="24K Gilded Gold Leaf"
                  height="460px"
                />
              </div>
            )}

            {/* Telemetry Gauges */}
            <TelemetryGauges analysis={analysis} />

            {/* Fine-Tuning & Manual Overrides */}
            <ManualOverrideSheet
              heightMm={analysis.dimensions.heightMm.value}
              widthMm={analysis.dimensions.widthMm.value}
              depthMm={analysis.dimensions.depthMm.value}
              infillPercent={infillPercent}
              layerHeightMm={layerHeightMm}
              selectedMaterialId={activeMaterialId}
              selectedFinishId={activeFinishId}
              selectedPackagingId={activePackagingId}
              onUpdateValues={handleUpdateValues}
            />
          </div>

          {/* Right Column: Sticky Pricing Breakdown (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <PricingBreakdownCard
              pricing={pricing}
              analysis={analysis}
              selectedMaterialName={currentMaterial.name}
              selectedFinishName={currentFinish.name}
              selectedPackagingName={currentPackaging.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
