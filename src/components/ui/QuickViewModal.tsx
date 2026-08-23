'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, MaterialFinish, Scale } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { X, Star, ShoppingBag, Heart, Shield, ArrowRight, Check, Box } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialFinish>('24K Gilded Gold Leaf');
  const [selectedScale, setSelectedScale] = useState<Scale>('1/6 Scale');

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
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-obsidian-950/85 backdrop-blur-md transition-opacity"
      />

      {/* Dialog */}
      <div className="relative w-full max-w-4xl bg-obsidian-900 border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-obsidian-950/80 border border-obsidian-700 text-titanium-300 hover:text-white hover:border-gold-500/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image & Rarity */}
          <div className="relative bg-obsidian-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-obsidian-800">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 text-xs font-mono font-bold">
                {product.rarity}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-obsidian-800 text-titanium-300 text-[10px] font-mono border border-obsidian-700">
                16K SLA RESIN
              </span>
            </div>

            <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden my-4 group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Quick stock status */}
            <div className="w-full px-4 py-2 rounded-lg bg-obsidian-900/80 border border-obsidian-800 flex items-center justify-between text-xs font-mono">
              <span className="text-titanium-400">EDITION SIZE</span>
              <span className="text-gold-400 font-bold">
                {product.stockLeft} LEFT OF {product.editionSize}
              </span>
            </div>
          </div>

          {/* Right: Product Details & Configurator */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-gold-400 tracking-wider uppercase">
                  {product.category}
                </span>
                <span className="text-titanium-500">•</span>
                <div className="flex items-center gap-1 text-gold-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                  <span>{product.rating}</span>
                  <span className="text-titanium-400 font-normal">({product.reviewCount})</span>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
                {product.name}
              </h2>
              <p className="text-xs text-titanium-300 mt-1 line-clamp-2">{product.tagline}</p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-display font-bold text-gold-400 font-mono">
                  {formatPrice(calculatedPrice)}
                </span>
                <span className="text-xs text-titanium-400 font-mono">Tax & Crate Included</span>
              </div>
            </div>

            {/* Material selector */}
            <div>
              <label className="text-xs font-mono text-titanium-300 block mb-2">
                MATERIAL FINISH: <span className="text-gold-400 font-bold">{selectedMaterial}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.materials.map((mat) => (
                  <button
                    key={mat.name}
                    onClick={() => setSelectedMaterial(mat.name)}
                    className={`px-2 py-2 text-[11px] rounded-lg border text-left transition-all ${
                      selectedMaterial === mat.name
                        ? 'border-gold-500 bg-gold-500/10 text-gold-200 font-semibold shadow-gold-glow/20'
                        : 'border-obsidian-700 bg-obsidian-850 text-titanium-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-obsidian-600"
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
              <label className="text-xs font-mono text-titanium-300 block mb-2">
                SCULPTURE SCALE: <span className="text-gold-400 font-bold">{selectedScale}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.scales.map((s) => (
                  <button
                    key={s.scale}
                    onClick={() => setSelectedScale(s.scale)}
                    className={`px-3 py-2 text-xs rounded-lg border text-left flex items-center justify-between transition-all ${
                      selectedScale === s.scale
                        ? 'border-gold-500 bg-gold-500/10 text-gold-200 font-semibold'
                        : 'border-obsidian-700 bg-obsidian-850 text-titanium-400 hover:text-white'
                    }`}
                  >
                    <span>{s.scale}</span>
                    <span className="font-mono text-[10px] text-titanium-400">{s.heightMm}mm H</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-obsidian-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-gold-glow transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Masterpiece Cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id, product.name)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isSaved
                      ? 'bg-gold-500/20 border-gold-400 text-gold-300'
                      : 'bg-obsidian-850 border-obsidian-700 text-titanium-400 hover:text-white'
                  }`}
                  title={isSaved ? 'Saved in Vault' : 'Save to Vault'}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-gold-400 text-gold-400' : ''}`} />
                </button>
              </div>

              <Link
                href={`/shop/${product.id}`}
                onClick={onClose}
                className="w-full py-2 text-xs text-center text-gold-400 hover:text-gold-300 font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full 3D Multi-Angle Showcase & Lore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
