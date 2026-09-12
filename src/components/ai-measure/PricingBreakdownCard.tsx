'use client';

import React, { useState } from 'react';
import { PricingBreakdown, StatueAnalysisResult } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import {
  ShoppingBag,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  DollarSign,
  Sparkles,
  Layers,
  Cpu,
  Zap,
} from 'lucide-react';

interface PricingBreakdownCardProps {
  pricing: PricingBreakdown;
  analysis: StatueAnalysisResult;
  selectedMaterialName: string;
  selectedFinishName: string;
  selectedPackagingName: string;
  className?: string;
}

export default function PricingBreakdownCard({
  pricing,
  analysis,
  selectedMaterialName,
  selectedFinishName,
  selectedPackagingName,
  className = '',
}: PricingBreakdownCardProps) {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: 'ai-custom-statue',
      name: `Custom Statue: ${analysis.file3dName || 'AI Optical Scan'} (${(analysis.dimensions.heightMm.value / 10).toFixed(1)}cm)`,
      image: analysis.imageUrls.previewUrl || '/images/hero_sculpture.jpg',
      category: 'Limited Editions',
      selectedMaterial: selectedMaterialName as any,
      selectedScale: '1/6 Scale',
      customEngraving: `Dim: ${analysis.dimensions.widthMm.value}x${analysis.dimensions.depthMm.value}x${analysis.dimensions.heightMm.value}mm | Finish: ${selectedFinishName}`,
      unitPrice: pricing.recommendedSellingPrice,
      quantity: 1,
    });
  };

  return (
    <div className={`p-6 sm:p-8 rounded-2xl bg-obsidian-900/90 border border-gold-500/30 backdrop-blur-xl shadow-2xl space-y-6 ${className}`}>
      {/* Title & Live Status */}
      <div className="flex items-center justify-between pb-4 border-b border-obsidian-800">
        <div>
          <span className="text-[10px] font-mono font-bold text-gold-400 uppercase tracking-widest block">
            DYNAMIC PRICING ENGINE
          </span>
          <h3 className="text-xl font-display font-bold text-foreground">
            Production Cost &amp; Price
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 text-[10px] font-mono font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
          REAL-TIME QUOTE
        </span>
      </div>

      {/* Production Cost Breakdown Table */}
      <div className="space-y-2.5 text-xs font-mono">
        <div className="flex justify-between text-titanium-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400/80" />
            1. Raw Photopolymer ({selectedMaterialName})
          </span>
          <span className="text-foreground">{formatPrice(pricing.materialCost)}</span>
        </div>

        <div className="flex justify-between text-titanium-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400/80" />
            2. Support Structures &amp; Resin Waste
          </span>
          <span className="text-foreground">{formatPrice(pricing.supportWasteCost)}</span>
        </div>

        <div className="flex justify-between text-titanium-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400/80" />
            3. 16K Laser Exposure Operations
          </span>
          <span className="text-foreground">{formatPrice(pricing.printingCost)}</span>
        </div>

        <div className="flex justify-between text-titanium-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400/80" />
            4. Electricity Consumption
          </span>
          <span className="text-foreground">{formatPrice(pricing.electricityCost)}</span>
        </div>

        <div className="flex justify-between text-titanium-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400/80" />
            5. Machine Hourly Depreciation
          </span>
          <span className="text-foreground">{formatPrice(pricing.machineDepreciation)}</span>
        </div>

        <div className="flex justify-between text-titanium-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400/80" />
            6. Technician Labor (Slicing, Wash &amp; UV Cure)
          </span>
          <span className="text-foreground">{formatPrice(pricing.laborCost)}</span>
        </div>

        <div className="flex justify-between text-titanium-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400/80" />
            7. Surface Finish ({selectedFinishName})
          </span>
          <span className="text-foreground">{formatPrice(pricing.finishingCost)}</span>
        </div>

        <div className="flex justify-between text-titanium-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400/80" />
            8. Archival Packaging ({selectedPackagingName})
          </span>
          <span className="text-foreground">{formatPrice(pricing.packagingCost)}</span>
        </div>

        {/* Subtotal Production Cost */}
        <div className="flex justify-between pt-2.5 border-t border-obsidian-800 text-titanium-300 font-semibold">
          <span>Total Manufacturing Base Cost:</span>
          <span>{formatPrice(pricing.subtotalCost)}</span>
        </div>

        <div className="flex justify-between text-titanium-400">
          <span>Target Atelier Profit Margin ({pricing.profitMarginPercent}%):</span>
          <span className="text-emerald-400">+{formatPrice(pricing.profitAmount)}</span>
        </div>
      </div>

      {/* Recommended Selling Price Total Display */}
      <div className="p-4 rounded-xl bg-obsidian-950 border border-gold-500/40 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-titanium-400 block uppercase">
            RECOMMENDED SELLING PRICE
          </span>
          <span className="text-2xl sm:text-3xl font-display font-bold text-gold-400">
            {formatPrice(pricing.recommendedSellingPrice)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-emerald-400 block font-bold">
            ✓ ALL-INCLUSIVE
          </span>
          <span className="text-[10px] font-mono text-titanium-500">
            Zero Hidden Slicing Fees
          </span>
        </div>
      </div>

      {/* Formula Inspector Accordion */}
      <div className="border border-obsidian-800 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="w-full p-3 bg-obsidian-950/70 text-left text-xs font-mono text-titanium-400 hover:text-gold-300 flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gold-400" />
            Pricing Engine Formula Formula Inspector
          </span>
          {showFormulaDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFormulaDetails && (
          <div className="p-4 bg-obsidian-950 border-t border-obsidian-800 space-y-2 text-[11px] font-mono text-titanium-400">
            <p className="text-gold-300 font-bold">
              Final Price = Material + Printing + Electricity + Machine + Labor + Support/Waste + Finishing + Packaging + Profit
            </p>
            <p className="text-titanium-500 text-[10px]">
              Every metric dynamically updates when dimensions, material density, infill gyroid percentage, or layer slices change.
            </p>
          </div>
        )}
      </div>

      {/* Queue Order Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleAddToCart}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-gold-glow transition-all active:scale-[0.99]"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Queue Custom Print Order ({formatPrice(pricing.recommendedSellingPrice)})</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-titanium-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span>Serialized Atelier NFC Plaque &amp; Certificate of Authenticity Included</span>
        </div>
      </div>
    </div>
  );
}
