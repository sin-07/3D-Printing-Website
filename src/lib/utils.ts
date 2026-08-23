import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Currency } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; prefix: boolean }> = {
  USD: { rate: 1.0, symbol: '$', prefix: true },
  EUR: { rate: 0.92, symbol: '€', prefix: false },
  GBP: { rate: 0.79, symbol: '£', prefix: true },
  JPY: { rate: 155.0, symbol: '¥', prefix: true },
  CAD: { rate: 1.36, symbol: 'CA$', prefix: true },
  AUD: { rate: 1.52, symbol: 'AU$', prefix: true },
};

export function formatPrice(amountUsd: number, currency: Currency = 'USD'): string {
  const { rate, symbol, prefix } = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = amountUsd * rate;
  
  const formattedNumber = currency === 'JPY'
    ? Math.round(converted).toLocaleString()
    : converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return prefix ? `${symbol}${formattedNumber}` : `${formattedNumber} ${symbol}`;
}

export function truncateText(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function generateSerialNumber(productId: string, editionNum: number): string {
  const prefix = productId.slice(0, 3).toUpperCase();
  return `ATH-${prefix}-${String(editionNum).padStart(4, '0')}`;
}
