import React from 'react';
import type { Metadata } from 'next';
import AiStatueStudio from '@/components/ai-measure/AiStatueStudio';

export const metadata: Metadata = {
  title: 'AI Statue Metrology & Instant Pricing | Aetheris 3D Atelier',
  description:
    'Upload statue imagery or 3D CAD mesh files for instant optical volume calculation, scale segmentation, layer slicing analysis, and real-time manufacturing pricing.',
};

export default function AiMeasurePage() {
  return <AiStatueStudio />;
}
