'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, MaterialFinish, Scale } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { X, Star, ShoppingBag, Heart, ArrowRight, Check, Box, Cpu, Layers } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialFinish>(
    product?.materials[0]?.name || 'Carbon Fiber PA-CF'
  );
  const [selectedScale, setSelectedScale] = useState<Scale>(
    product?.scales[0]?.scale || '1:1 True Scale'
  );

  if (!isOpen || !product) return null;

  const matObj = product.materials.find((m) => m.name === selectedMaterial) || product.materials[0];
  const scaleObj = product.scales.find((s) => s.scale === selectedScale) || product.scales[0];

  const calculatedPrice = Math.round(
    product.basePrice * (matObj?.priceMultiplier || 1) * (scaleObj?.priceMultiplier || 1)
  );

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      selectedMaterial,
      selectedScale,
      unitPrice: calculatedPrice,
      quantity: 1,
      editionNumber: Math.floor(Math.random() * product.editionSize) + 1,
    });
    onClose();
  };

  const isSaved = isInWishlist(product.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Dialog */}
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image & Technical Badges */}
          <div className="relative bg-neutral-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/15 text-[11px] font-mono lowercase">
                {product.specs.layerHeight}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono lowercase">
                {product.specs.infillDensity || '100% Solid'}
              </span>
            </div>

            <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden my-6 group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Quick stock status */}
            <div className="w-full px-4 py-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between text-xs font-mono lowercase">
              <span className="text-neutral-500">production capacity</span>
              <span className="text-white font-semibold">
                {product.stockLeft} units ready of {product.editionSize}
              </span>
            </div>
          </div>

          {/* Right: Product Details & Configurator */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono text-emerald-400 lowercase">
                  {product.category}
                </span>
                <span className="text-neutral-600">•</span>
                <div className="flex items-center gap-1 text-white text-xs font-mono">
                  <Star className="w-3 h-3 fill-white text-white" />
                  <span>{product.rating}</span>
                  <span className="text-neutral-500">({product.reviewCount})</span>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-bold tracking-tight lowercase text-white">
                {product.name}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2 lowercase leading-relaxed">
                {product.tagline}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  {formatPrice(calculatedPrice)}
                </span>
                <span className="text-xs text-neutral-500 font-mono lowercase">
                  calibrated &amp; tested
                </span>
              </div>
            </div>

            {/* Material selector */}
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-2 lowercase">
                engineering filament: <span className="text-white font-semibold">{selectedMaterial}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.materials.map((mat) => (
                  <button
                    key={mat.name}
                    onClick={() => setSelectedMaterial(mat.name)}
                    className={`px-2.5 py-2 text-[11px] rounded-xl border text-left transition-all lowercase ${
                      selectedMaterial === mat.name
                        ? 'border-white bg-white text-black font-semibold shadow-sm'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="w-2 h-2 rounded-full border border-neutral-700 shrink-0"
                        style={{ backgroundColor: mat.color }}
                      />
                      <span className="truncate">{mat.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scale selector */}
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-2 lowercase">
                component scale: <span className="text-white font-semibold">{selectedScale}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.scales.map((s) => (
                  <button
                    key={s.scale}
                    onClick={() => setSelectedScale(s.scale)}
                    className={`px-3 py-2 text-xs rounded-xl border text-left flex items-center justify-between transition-all lowercase font-mono ${
                      selectedScale === s.scale
                        ? 'border-white bg-white text-black font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{s.scale}</span>
                    <span className="text-[10px] text-neutral-500">{s.heightMm}mm H</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-5 rounded-full bg-white text-black font-semibold text-xs lowercase tracking-tight flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>add component to cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id, product.name)}
                  className={`p-3 rounded-full border transition-colors ${
                    isSaved
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                  title={isSaved ? 'Saved in List' : 'Save Component'}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-black text-black' : ''}`} />
                </button>
              </div>

              <Link
                href={`/shop/${product.id}`}
                onClick={onClose}
                className="w-full py-2 text-xs text-center text-neutral-400 hover:text-white font-mono flex items-center justify-center gap-1.5 transition-colors lowercase"
              >
                <span>view detailed 3d metrology &amp; technical specs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
