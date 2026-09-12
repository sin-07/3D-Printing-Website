'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency } from '@/types';
import { formatPrice as formatPriceUtil } from '@/lib/utils';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('INR');

  useEffect(() => {
    const saved = localStorage.getItem('aetheris_currency') as Currency;
    if (saved && ['INR', 'USD', 'EUR', 'GBP'].includes(saved)) {
      setCurrencyState(saved);
    } else {
      setCurrencyState('INR');
      localStorage.setItem('aetheris_currency', 'INR');
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('aetheris_currency', c);
  };

  const formatPrice = (amountUsd: number) => {
    return formatPriceUtil(amountUsd, currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
