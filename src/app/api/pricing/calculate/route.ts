import { NextRequest, NextResponse } from 'next/server';
import { calculateDynamicPrice } from '@/lib/pricing/pricing-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pricing = calculateDynamicPrice({
      heightMm: Number(body.heightMm) || 150,
      widthMm: Number(body.widthMm) || 80,
      depthMm: Number(body.depthMm) || 60,
      volumeCm3: Number(body.volumeCm3) || 120,
      surfaceAreaCm2: body.surfaceAreaCm2 ? Number(body.surfaceAreaCm2) : undefined,
      complexityScore: Number(body.complexityScore) || 50,
      materialId: body.materialId || 'sla-16k-standard',
      finishId: body.finishId || 'raw-cleaned',
      packagingId: body.packagingId || 'standard-box',
      infillDensityPercent: body.infillDensityPercent !== undefined ? Number(body.infillDensityPercent) : 30,
      layerHeightMm: body.layerHeightMm ? Number(body.layerHeightMm) : 0.015,
      currency: body.currency,
    });

    return NextResponse.json({
      success: true,
      pricing,
    });
  } catch (error: any) {
    console.error('Error in /api/pricing/calculate:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate dynamic price.' },
      { status: 500 }
    );
  }
}
