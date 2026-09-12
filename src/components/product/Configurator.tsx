'use client';

import React, { useState } from 'react';
import { Product, MaterialFinish, Scale } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Lock,
  Flame,
  Truck,
  FileText,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import MagneticButton from '@/components/animations/MagneticButton';

interface ConfiguratorProps {
  product: Product;
  selectedMaterial: MaterialFinish;
  setSelectedMaterial: (m: MaterialFinish) => void;
  selectedScale: Scale;
  setSelectedScale: (s: Scale) => void;
}

export default function Configurator({
  product,
  selectedMaterial,
  setSelectedMaterial,
  selectedScale,
  setSelectedScale,
}: ConfiguratorProps) {
  const { addItem, openCartDrawer } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [quantity, setQuantity] = useState(1);
  const [includeThreadedInserts, setIncludeThreadedInserts] = useState(false);
  const [includeAnnealing, setIncludeAnnealing] = useState(false);
  const [includeCmmReport, setIncludeCmmReport] = useState(false);

  const matObj =
    product.materials.find((m) => m.name === selectedMaterial) || product.materials[0];
  const scaleObj =
    product.scales.find((s) => s.scale === selectedScale) || product.scales[0];

  // Engineering add-on costs in USD base (converted cleanly via CurrencyContext)
  const insertsCost = includeThreadedInserts ? 4 : 0;
  const annealingCost = includeAnnealing ? 6 : 0;
  const cmmCost = includeCmmReport ? 8 : 0;

  const baseConfiguredPrice = Math.round(
    product.basePrice * (matObj?.priceMultiplier || 1) * (scaleObj?.priceMultiplier || 1)
  );

  const unitPrice = baseConfiguredPrice + insertsCost + annealingCost + cmmCost;

  // Volume discount calculation
  let volumeDiscountRate = 0;
  if (quantity >= 6) {
    volumeDiscountRate = 0.12; // 12% off for 6+ units
  } else if (quantity >= 3) {
    volumeDiscountRate = 0.05; // 5% off for 3-5 units
  }

  const rawTotal = unitPrice * quantity;
  const totalPrice = Math.round(rawTotal * (1 - volumeDiscountRate));

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      selectedMaterial,
      selectedScale,
      customEngraving: includeThreadedInserts
        ? 'CNC Brass Inserts (M3/M4)'
        : undefined,
      includeDisplayLighting: includeAnnealing,
      unitPrice,
      quantity,
      editionNumber: Math.floor(Math.random() * product.editionSize) + 1,
    });
    openCartDrawer();
  };

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] select-none">
      {/* Top Header & Production Telemetry */}
      <div className="border-b border-neutral-200/80 pb-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[11px] font-mono lowercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>queue: {product.stockLeft} units ready in bengaluru farm</span>
          </div>

          <span className="text-[11px] font-mono lowercase text-neutral-400">
            part ref: #{product.id.slice(0, 10)}
          </span>
        </div>

        {/* Live INR Price Header */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-neutral-950">
            {formatPrice(totalPrice)}
          </span>
          {quantity > 1 && (
            <span className="text-xs text-neutral-500 font-mono">
              ({formatPrice(unitPrice)} / unit)
            </span>
          )}
          {volumeDiscountRate > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold">
              {Math.round(volumeDiscountRate * 100)}% batch discount applied
            </span>
          )}
        </div>

        <p className="text-[11px] text-neutral-400 font-mono mt-1">
          inclusive of all taxes • 18% gst b2b tax invoice compliant
        </p>
      </div>

      {/* 1. Engineering Material Selector */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider">
            1. Select Engineering Material
          </span>
          <span className="text-xs font-mono text-neutral-500 font-semibold lowercase">
            {selectedMaterial}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {product.materials.map((mat) => {
            const isSelected = selectedMaterial === mat.name;
            return (
              <button
                key={mat.name}
                onClick={() => setSelectedMaterial(mat.name)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-neutral-950 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-950'
                    : 'border-neutral-200/90 bg-neutral-50/50 hover:bg-neutral-100/60 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 w-full">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full border shadow-2xs flex-shrink-0"
                      style={{
                        backgroundColor: mat.color,
                        borderColor: isSelected ? '#ffffff40' : '#00000020',
                      }}
                    />
                    <span
                      className={`font-semibold text-xs truncate ${
                        isSelected ? 'text-white' : 'text-neutral-900'
                      }`}
                    >
                      {mat.name}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] ml-1.5 flex-shrink-0 ${
                      isSelected ? 'text-amber-400' : 'text-neutral-500'
                    }`}
                  >
                    {mat.priceMultiplier > 1
                      ? `+${Math.round((mat.priceMultiplier - 1) * 100)}%`
                      : 'base'}
                  </span>
                </div>

                <p
                  className={`text-[10px] leading-relaxed line-clamp-2 ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {mat.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Scale & Envelope Selector */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider">
            2. Production Scale Envelope
          </span>
          <span className="text-xs font-mono text-neutral-500 font-semibold lowercase">
            {selectedScale}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {product.scales.map((s) => {
            const isSelected = selectedScale === s.scale;
            return (
              <button
                key={s.scale}
                onClick={() => setSelectedScale(s.scale)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-neutral-950 bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-950'
                    : 'border-neutral-200/90 bg-neutral-50/50 hover:bg-neutral-100/60 text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-semibold text-xs ${
                      isSelected ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {s.scale}
                  </span>
                  <span
                    className={`font-mono text-[10px] ${
                      isSelected ? 'text-amber-400' : 'text-neutral-500'
                    }`}
                  >
                    {s.priceMultiplier > 1
                      ? `+${Math.round((s.priceMultiplier - 1) * 100)}%`
                      : 'standard'}
                  </span>
                </div>
                <p
                  className={`text-[10px] font-mono ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {s.heightMm}×{s.widthMm}×{s.depthMm} mm • {s.weightKg} kg
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Industrial Add-ons & Secondary Operations */}
      <div className="space-y-2.5 pt-4 border-t border-neutral-200/80">
        <span className="text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider block mb-1">
          3. Secondary Machine Operations
        </span>

        {/* Brass Threaded Inserts */}
        <label className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200 cursor-pointer hover:bg-neutral-100/60 transition-colors">
          <input
            type="checkbox"
            checked={includeThreadedInserts}
            onChange={(e) => setIncludeThreadedInserts(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
          />
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-neutral-700" />
                M3/M4 Brass Threaded Heat-Set Inserts
              </span>
              <span className="font-mono text-neutral-900 font-bold">
                +{formatPrice(4)}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Heat-staked knurled brass inserts for heavy dynamic machine mounting.
            </p>
          </div>
        </label>

        {/* Thermal Stress Annealing */}
        <label className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200 cursor-pointer hover:bg-neutral-100/60 transition-colors">
          <input
            type="checkbox"
            checked={includeAnnealing}
            onChange={(e) => setIncludeAnnealing(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
          />
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                Thermal Stress-Relief Annealing Cycle
              </span>
              <span className="font-mono text-neutral-900 font-bold">
                +{formatPrice(6)}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Controlled ramp-down oven cycle to boost HDT by 15°C and eliminate internal stresses.
            </p>
          </div>
        </label>

        {/* CMM Metrology Verification */}
        <label className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200 cursor-pointer hover:bg-neutral-100/60 transition-colors">
          <input
            type="checkbox"
            checked={includeCmmReport}
            onChange={(e) => setIncludeCmmReport(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
          />
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Mitutoyo CMM Calibration Certificate
              </span>
              <span className="font-mono text-neutral-900 font-bold">
                +{formatPrice(8)}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Physical report certifying dimensional compliance to ISO 2768-m.
            </p>
          </div>
        </label>
      </div>

      {/* 4. Quantity Stepper & Add To Cart CTA */}
      <div className="pt-4 border-t border-neutral-200/80 space-y-3">
        <div className="flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-2xl px-3 py-2.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-neutral-500 hover:text-neutral-900 font-mono px-2 text-base font-bold transition-colors"
            >
              -
            </button>
            <span className="font-mono font-bold text-sm px-3 text-neutral-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(25, quantity + 1))}
              className="text-neutral-500 hover:text-neutral-900 font-mono px-2 text-base font-bold transition-colors"
            >
              +
            </button>
          </div>

          {/* Primary CTA Button */}
          <MagneticButton className="flex-1">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 px-6 rounded-2xl bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-800 shadow-md transition-all active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Dispatch to 3D Print Queue ({formatPrice(totalPrice)})</span>
            </button>
          </MagneticButton>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id, product.name)}
            className={`p-3.5 rounded-2xl border transition-colors ${
              isSaved
                ? 'bg-neutral-950 border-neutral-950 text-white'
                : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:border-neutral-400'
            }`}
            title={isSaved ? 'Saved in Vault' : 'Save to Vault'}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Pan-India Trust Guarantees */}
        <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-neutral-500 font-mono gap-2">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-neutral-700" />
            BlueDart Air Dispatch (24-48 hrs)
          </span>
          <span className="flex items-center gap-1.5 text-neutral-700 font-semibold">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            GST B2B Tax Invoice Compliant
          </span>
        </div>
      </div>
    </div>
  );
}
