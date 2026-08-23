'use client';

import React, { useState } from 'react';
import { Product, MaterialFinish, Scale } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  ShoppingBag,
  Heart,
  Shield,
  Box,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Flame,
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
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [quantity, setQuantity] = useState(1);
  const [includeLighting, setIncludeLighting] = useState(false);
  const [customEngraving, setCustomEngraving] = useState('');
  const [showEngravingInput, setShowEngravingInput] = useState(false);

  const matObj = product.materials.find((m) => m.name === selectedMaterial) || product.materials[0];
  const scaleObj = product.scales.find((s) => s.scale === selectedScale) || product.scales[0];

  const lightingCost = includeLighting ? 45 : 0;
  const engravingCost = showEngravingInput && customEngraving.trim() ? 25 : 0;

  const baseConfiguredPrice = Math.round(
    product.basePrice * (matObj?.priceMultiplier || 1) * (scaleObj?.priceMultiplier || 1)
  );

  const unitPrice = baseConfiguredPrice + lightingCost + engravingCost;
  const totalPrice = unitPrice * quantity;

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      selectedMaterial,
      selectedScale,
      customEngraving: showEngravingInput && customEngraving.trim() ? customEngraving.trim() : undefined,
      includeDisplayLighting: includeLighting,
      unitPrice,
      quantity,
      editionNumber: Math.floor(Math.random() * product.editionSize) + 1,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-2xl bg-obsidian-900/90 border border-gold-500/30 backdrop-blur-xl shadow-2xl">
      {/* Top Header & Live Pricing */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 text-xs font-mono font-bold tracking-wider uppercase">
            {product.rarity} EDITION
          </span>
          <span className="text-xs font-mono text-titanium-400">
            {product.stockLeft} Remaining in Batch
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-display font-bold text-gold-400 font-mono">
            {formatPrice(totalPrice)}
          </span>
          {quantity > 1 && (
            <span className="text-xs text-titanium-400 font-mono">
              ({formatPrice(unitPrice)} each)
            </span>
          )}
        </div>
      </div>

      {/* 1. Scale Selector */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-mono font-bold text-foreground tracking-wider uppercase">
            1. CHOOSE SCULPTURE SCALE
          </span>
          <span className="text-xs font-mono text-gold-400 font-bold">{selectedScale}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {product.scales.map((s) => (
            <button
              key={s.scale}
              onClick={() => setSelectedScale(s.scale)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedScale === s.scale
                  ? 'border-gold-500 bg-gold-500/10 text-gold-200 shadow-gold-glow/20'
                  : 'border-obsidian-700 bg-obsidian-950/70 text-titanium-400 hover:text-white hover:border-obsidian-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-foreground">{s.scale}</span>
                <span className="font-mono text-[10px] text-gold-400">
                  {s.priceMultiplier > 1 ? `+${Math.round((s.priceMultiplier - 1) * 100)}%` : 'Base'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-titanium-400">
                {s.heightMm}mm H × {s.widthMm}mm W • {s.weightKg} kg
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Material Finish Selector */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-mono font-bold text-foreground tracking-wider uppercase">
            2. PHOTOPOLYMER MATERIAL FINISH
          </span>
          <span className="text-xs font-mono text-gold-400 font-bold">{selectedMaterial}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {product.materials.map((mat) => (
            <button
              key={mat.name}
              onClick={() => setSelectedMaterial(mat.name)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedMaterial === mat.name
                  ? 'border-gold-500 bg-gold-500/10 text-gold-200 shadow-gold-glow/20'
                  : 'border-obsidian-700 bg-obsidian-950/70 text-titanium-400 hover:text-white hover:border-obsidian-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-obsidian-600 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: mat.color }}
                />
                <span className="font-semibold text-xs text-foreground leading-tight">
                  {mat.name}
                </span>
              </div>
              <p className="text-[11px] text-titanium-400 leading-normal line-clamp-2">
                {mat.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Luxury Add-ons (LED base + Custom Plaque) */}
      <div className="space-y-2.5 pt-2 border-t border-obsidian-800">
        <span className="text-xs font-mono font-bold text-foreground tracking-wider uppercase block mb-1">
          3. ARTISAN BESPOKE ADD-ONS
        </span>

        {/* LED Base Lighting */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-obsidian-950/70 border border-obsidian-700 cursor-pointer hover:border-gold-500/40 transition-colors">
          <input
            type="checkbox"
            checked={includeLighting}
            onChange={(e) => setIncludeLighting(e.target.checked)}
            className="rounded border-obsidian-700 text-gold-500 focus:ring-gold-500/20"
          />
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-gold-400" />
                Integrated Base Underglow Lighting (USB-C)
              </span>
              <span className="font-mono text-gold-400 font-bold">+{formatPrice(45)}</span>
            </div>
            <p className="text-[11px] text-titanium-400 mt-0.5">
              Hidden diffuse LED array highlighting runic base contours.
            </p>
          </div>
        </label>

        {/* Custom Plaque Engraving */}
        <div className="p-3 rounded-xl bg-obsidian-950/70 border border-obsidian-700">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showEngravingInput}
              onChange={(e) => setShowEngravingInput(e.target.checked)}
              className="rounded border-obsidian-700 text-gold-500 focus:ring-gold-500/20"
            />
            <div className="flex-1 text-xs flex items-center justify-between">
              <span className="font-semibold text-foreground">
                Custom Brass Nameplate Laser Engraving
              </span>
              <span className="font-mono text-gold-400 font-bold">+{formatPrice(25)}</span>
            </div>
          </label>

          {showEngravingInput && (
            <div className="mt-3 pt-3 border-t border-obsidian-800">
              <input
                type="text"
                maxLength={36}
                placeholder="e.g. 'Collector Name - Vault Edition'"
                value={customEngraving}
                onChange={(e) => setCustomEngraving(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-obsidian-900 border border-obsidian-700 rounded-lg text-foreground placeholder-titanium-500 focus:outline-none focus:border-gold-500/50 font-mono uppercase"
              />
              <p className="text-[10px] text-titanium-500 mt-1 font-mono">
                Laser-etched into solid brushed brass nameplate. Max 36 characters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quantity & CTA Button */}
      <div className="pt-4 border-t border-obsidian-800 space-y-3">
        <div className="flex items-center gap-3">
          {/* Quantity selector */}
          <div className="flex items-center bg-obsidian-950 border border-obsidian-700 rounded-xl px-3 py-2.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-titanium-400 hover:text-white font-mono px-2 text-sm"
            >
              -
            </button>
            <span className="font-mono font-bold text-sm px-2 text-foreground">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(5, quantity + 1))}
              className="text-titanium-400 hover:text-white font-mono px-2 text-sm"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <MagneticButton className="flex-1">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-gold-glow transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Acquire Sculpture ({formatPrice(totalPrice)})</span>
            </button>
          </MagneticButton>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id, product.name)}
            className={`p-3.5 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-gold-500/20 border-gold-400 text-gold-300'
                : 'bg-obsidian-950 border-obsidian-700 text-titanium-400 hover:text-white hover:border-gold-500/40'
            }`}
            title={isSaved ? 'Saved in Vault' : 'Save to Vault'}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-gold-400 text-gold-400' : ''}`} />
          </button>
        </div>

        {/* Security & Authenticity badge */}
        <div className="p-3 rounded-xl bg-obsidian-950/60 border border-obsidian-800 flex items-center justify-between text-[11px] text-titanium-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gold-400" />
            Serialized Metal NFC Certificate
          </span>
          <span className="text-gold-400">Laser-Cut Flight Case</span>
        </div>
      </div>
    </div>
  );
}
