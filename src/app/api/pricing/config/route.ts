import { NextRequest, NextResponse } from 'next/server';
import { getPricingConfig, updatePricingConfig, resetPricingConfigToDefault } from '@/lib/pricing/pricing-config';

export async function GET() {
  const config = getPricingConfig();
  return NextResponse.json({
    success: true,
    config,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (body.action === 'reset') {
      const resetConfig = resetPricingConfigToDefault();
      return NextResponse.json({
        success: true,
        message: 'Pricing configuration reset to atelier defaults.',
        config: resetConfig,
      });
    }

    const updated = updatePricingConfig(body);
    return NextResponse.json({
      success: true,
      message: 'Pricing parameters saved successfully.',
      config: updated,
    });
  } catch (error: any) {
    console.error('Error updating pricing config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update pricing configuration.' },
      { status: 500 }
    );
  }
}
