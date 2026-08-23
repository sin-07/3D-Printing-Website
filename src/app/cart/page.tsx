'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  Trash2,
  Plus,
  Minus,
  Box,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Tag,
  Lock,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    isCrateUpgrade,
    setIsCrateUpgrade,
    crateUpgradeCost,
    appliedDiscount,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    finalTotal,
    totalItemsCount,
  } = useCart();

  const { formatPrice } = useCurrency();
  const [promoInput, setPromoInput] = useState('');

  const freeShippingThreshold = 500;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-2">
            <Box className="w-3.5 h-3.5" />
            <span>COLLECTOR DISPATCH VAULT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground">
            Masterpiece Cart
          </h1>
          <p className="text-xs sm:text-sm text-titanium-400 mt-1 font-mono">
            {totalItemsCount} {totalItemsCount === 1 ? 'Sculpture' : 'Sculptures'} Allocated in Cart
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="p-16 rounded-3xl bg-obsidian-900/60 border border-obsidian-800 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-obsidian-950 border border-obsidian-700 flex items-center justify-center mx-auto text-gold-400">
              <Box className="w-10 h-10 opacity-60" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Your Collector Vault is Empty
            </h2>
            <p className="text-xs sm:text-sm text-titanium-400 max-w-md mx-auto leading-relaxed">
              Explore our gallery of limited-run 16K SLA photopolymer statues, busts, and bespoke 3D prints.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-glow transition-all"
            >
              <span>Explore The Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Main Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress */}
              <div className="p-4 rounded-2xl bg-obsidian-900/80 border border-obsidian-800 text-xs">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-titanium-300">
                    Add <span className="text-gold-400 font-bold">{formatPrice(remainingForFreeShipping)}</span> more for{' '}
                    <span className="text-gold-400 font-semibold">Free Insured Global White-Glove Air Freight</span>
                  </p>
                ) : (
                  <p className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Unlocked: Free Worldwide Insured Flight-Case Freight
                  </p>
                )}
                <div className="w-full h-2 bg-obsidian-950 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 rounded-2xl bg-obsidian-900/70 border border-obsidian-800/80 hover:border-gold-500/30 transition-colors flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    {/* Thumbnail + Details */}
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-obsidian-950 overflow-hidden border border-obsidian-700 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-gold-400/90 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <h3 className="text-base font-bold text-foreground leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-titanium-300 font-mono">
                          {item.selectedScale} • {item.selectedMaterial}
                        </p>
                        {item.customEngraving && (
                          <p className="text-[11px] text-gold-400/80 font-mono">
                            Engraving: &quot;{item.customEngraving}&quot;
                          </p>
                        )}
                        <p className="text-xs font-mono font-bold text-gold-400 pt-1">
                          {formatPrice(item.unitPrice)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Item Total */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-obsidian-800">
                      <div className="flex items-center gap-2 bg-obsidian-950 border border-obsidian-700 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-titanium-400 hover:text-white p-1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-sm px-2 text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-titanium-400 hover:text-white p-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold font-mono text-gold-400">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg text-titanium-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-xs font-mono text-gold-400 hover:text-gold-300 transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Exploring Masterworks</span>
                </Link>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/90 border border-gold-500/30 backdrop-blur-xl shadow-2xl space-y-6">
                <h3 className="text-lg font-display font-bold text-foreground pb-4 border-b border-obsidian-800">
                  Order Summary
                </h3>

                {/* Wooden Crate Upgrade Toggle */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-obsidian-950 border border-obsidian-700 cursor-pointer hover:border-gold-500/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={isCrateUpgrade}
                    onChange={(e) => setIsCrateUpgrade(e.target.checked)}
                    className="mt-0.5 rounded border-obsidian-700 text-gold-500 focus:ring-gold-500/20"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Handmade Pine Display Crate</span>
                      <span className="font-mono text-gold-400 font-bold">+$65</span>
                    </div>
                    <p className="text-[10px] text-titanium-400 mt-0.5">
                      Includes brass hardware latches & laser-cut custom EVA foam nesting.
                    </p>
                  </div>
                </label>

                {/* Promo Code Box */}
                {appliedDiscount ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                    <span className="flex items-center gap-2 text-emerald-400 font-mono">
                      <Tag className="w-4 h-4" />
                      Promo &quot;{appliedDiscount.code}&quot; Active (-{formatPrice(discountAmount)})
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-titanium-400 hover:text-white text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (ATELIER10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground placeholder-titanium-500 focus:outline-none focus:border-gold-500/50 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-700 text-xs font-semibold text-gold-300 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Cost Breakdown */}
                <div className="space-y-2.5 pt-2 border-t border-obsidian-800 text-xs font-mono">
                  <div className="flex justify-between text-titanium-400">
                    <span>Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-emerald-400">
                      <span>VIP Credit Applied</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  {isCrateUpgrade && (
                    <div className="flex justify-between text-gold-400">
                      <span>Pine Display Crate</span>
                      <span>+{formatPrice(crateUpgradeCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-titanium-400">
                    <span>Worldwide Insured Transit</span>
                    <span className="text-emerald-400">
                      {remainingForFreeShipping === 0 ? 'Complimentary' : formatPrice(45)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-foreground pt-3 border-t border-obsidian-800">
                    <span>Total Investment</span>
                    <span className="text-2xl font-display text-gold-400">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Checkout Link */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 shadow-gold-glow transition-all"
                  >
                    <span>Proceed to Luxury Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-titanium-400 font-mono text-center">
                    <Lock className="w-3.5 h-3.5 text-gold-400" />
                    <span>256-Bit Encrypted Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
