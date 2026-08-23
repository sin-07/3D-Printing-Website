'use client';

import React, { useState, useEffect } from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';
import SmoothScroll from '@/components/animations/SmoothScroll';
import CustomCursor from '@/components/animations/CustomCursor';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import CartDrawer from '@/components/ui/CartDrawer';
import SearchModal from '@/components/ui/SearchModal';

export default function ProvidersShell({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ToastProvider>
      <CurrencyProvider>
        <WishlistProvider>
          <CartProvider>
            <SmoothScroll>
              <CustomCursor />
              <div className="flex flex-col min-h-screen">
                <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <CartDrawer />
              <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            </SmoothScroll>
          </CartProvider>
        </WishlistProvider>
      </CurrencyProvider>
    </ToastProvider>
  );
}
