'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  isCrateUpgrade: boolean;
  setIsCrateUpgrade: (val: boolean) => void;
  crateUpgradeCost: number;
  appliedDiscount: { code: string; percent?: number; amount?: number } | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  discountAmount: number;
  finalTotal: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCrateUpgrade, setIsCrateUpgrade] = useState<boolean>(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent?: number; amount?: number } | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aetheris_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCrate = localStorage.getItem('aetheris_crate_upgrade');
      if (savedCrate) {
        setIsCrateUpgrade(savedCrate === 'true');
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('aetheris_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [items]);

  useEffect(() => {
    localStorage.setItem('aetheris_crate_upgrade', String(isCrateUpgrade));
  }, [isCrateUpgrade]);

  const addItem = (itemData: Omit<CartItem, 'id'>) => {
    const id = `${itemData.productId}-${itemData.selectedMaterial}-${itemData.selectedScale}-${itemData.customEngraving || 'no-engrave'}-${itemData.includeDisplayLighting ? 'light' : 'nolight'}`;
    
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + itemData.quantity } : i
        );
      }
      return [...prev, { ...itemData, id }];
    });

    showToast('Added to Masterpiece Cart', `${itemData.name} (${itemData.selectedScale})`, 'gold');
    setIsCartDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Removed from Cart', undefined, 'info');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedDiscount(null);
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const crateUpgradeCost = isCrateUpgrade && items.length > 0 ? 65 : 0;

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ATELIER10') {
      setAppliedDiscount({ code: 'ATELIER10', percent: 10 });
      showToast('10% VIP Atelier Discount Applied', undefined, 'success');
      return true;
    } else if (clean === 'VIP50') {
      setAppliedDiscount({ code: 'VIP50', amount: 50 });
      showToast('$50 Exclusive Collector Credit Applied', undefined, 'success');
      return true;
    } else if (clean === 'CYBER15') {
      setAppliedDiscount({ code: 'CYBER15', percent: 15 });
      showToast('15% Cyberpunk Collector Code Applied', undefined, 'success');
      return true;
    } else {
      showToast('Invalid Promo Code', 'Try "ATELIER10" or "VIP50"', 'error');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedDiscount(null);
    showToast('Promo code removed', undefined, 'info');
  };

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.percent) {
      discountAmount = (subtotal * appliedDiscount.percent) / 100;
    } else if (appliedDiscount.amount) {
      discountAmount = Math.min(appliedDiscount.amount, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + crateUpgradeCost);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        isCrateUpgrade,
        setIsCrateUpgrade,
        crateUpgradeCost,
        appliedDiscount,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        finalTotal,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
