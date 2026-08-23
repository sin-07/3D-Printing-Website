'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { X, Trash2, Plus, Minus, ShieldCheck, Box, ArrowRight, Sparkles, Tag } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
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

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  const freeShippingThreshold = 500;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-obsidian-900 border-l border-gold-500/20 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-obsidian-700/80 flex items-center justify-between bg-obsidian-950/60">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30">
                <Box className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-foreground">
                  Collector Vault Cart
                </h2>
                <p className="text-xs text-titanium-400 font-mono">
                  {totalItemsCount} {totalItemsCount === 1 ? 'Masterwork' : 'Masterworks'}
                </p>
              </div>
            </div>

            <button
              onClick={closeCartDrawer}
              className="p-2 rounded-lg text-titanium-400 hover:text-white hover:bg-obsidian-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-obsidian-850 border-b border-obsidian-800 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-titanium-300">
                Add <span className="text-gold-400 font-bold">{formatPrice(remainingForFreeShipping)}</span> more for{' '}
                <span className="text-gold-400 font-semibold">Free Insured Air Freight</span>
              </p>
            ) : (
              <p className="text-emerald-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Unlocked: Free Insured Worldwide White-Glove Shipping
              </p>
            )}
            <div className="w-full h-1.5 bg-obsidian-950 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-amber-400 transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-obsidian-800 border border-obsidian-700 flex items-center justify-center mb-4">
                  <Box className="w-8 h-8 text-titanium-400" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">Your Vault is Empty</h3>
                <p className="text-xs text-titanium-400 mb-6 max-w-xs">
                  Discover our limited 16K SLA resin sculptures and limited edition drops.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCartDrawer}
                  className="px-6 py-2.5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs tracking-wider uppercase hover:brightness-110 transition-all shadow-gold-glow"
                >
                  Explore Sculptures
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-obsidian-850/80 border border-obsidian-700/60 flex gap-3 group hover:border-gold-500/30 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-obsidian-950 flex-shrink-0 border border-obsidian-700">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-foreground leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-titanium-400 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-gold-400/90 font-mono mt-0.5">
                        {item.selectedScale} • {item.selectedMaterial}
                      </p>
                      {item.customEngraving && (
                        <p className="text-[10px] text-titanium-400 font-mono mt-0.5">
                          Engraved: &quot;{item.customEngraving}&quot;
                        </p>
                      )}
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-obsidian-800">
                      <div className="flex items-center gap-1.5 bg-obsidian-900 border border-obsidian-700 rounded-md px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-titanium-400 hover:text-white p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold px-2 text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-titanium-400 hover:text-white p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold font-mono text-gold-300">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Actions (When Items Exist) */}
          {items.length > 0 && (
            <div className="p-5 border-t border-obsidian-700/80 bg-obsidian-950/90 space-y-4">
              {/* Wooden Crate Upgrade Toggle */}
              <label className="flex items-center gap-3 p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-700 cursor-pointer hover:border-gold-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={isCrateUpgrade}
                  onChange={(e) => setIsCrateUpgrade(e.target.checked)}
                  className="rounded border-obsidian-700 text-gold-500 focus:ring-gold-500/20"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Artisan Wooden Crate Upgrade</span>
                    <span className="font-mono text-gold-400 font-bold">+$65</span>
                  </div>
                  <p className="text-[10px] text-titanium-400">
                    Hand-crafted pine display crate with brass latches & laser-cut foam.
                  </p>
                </div>
              </label>

              {/* Promo Code Form */}
              {appliedDiscount ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                    <Tag className="w-3.5 h-3.5" />
                    Code &quot;{appliedDiscount.code}&quot; Applied (-{formatPrice(discountAmount)})
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-titanium-400 hover:text-white p-1 text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. ATELIER10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-obsidian-900 border border-obsidian-700 rounded-lg text-foreground placeholder-titanium-500 focus:outline-none focus:border-gold-500/50 uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-700 text-xs font-semibold text-gold-300 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-obsidian-800">
                <div className="flex justify-between text-titanium-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Discount</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {isCrateUpgrade && (
                  <div className="flex justify-between text-gold-400">
                    <span>Artisan Wooden Crate</span>
                    <span className="font-mono">+{formatPrice(crateUpgradeCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-foreground pt-1.5 border-t border-obsidian-800">
                  <span>Estimated Total</span>
                  <span className="font-mono text-gold-400 text-base">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCartDrawer}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-gold-glow"
                >
                  <span>Proceed to Luxury Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCartDrawer}
                  className="w-full py-2.5 rounded-xl bg-obsidian-900 border border-obsidian-700 text-titanium-300 hover:text-white hover:border-gold-500/40 font-semibold text-xs text-center block transition-colors"
                >
                  View Full Cart Details
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-titanium-400">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>100% Insured Transit • Serialized NFC Certificate Included</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
