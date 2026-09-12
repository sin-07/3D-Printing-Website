import { NextRequest, NextResponse } from 'next/server';
import { analyzeStatueImages } from '@/lib/ai/vision-service';
import { calculateDynamicPrice } from '@/lib/pricing/pricing-engine';
import { logScanEntry } from '@/lib/pricing/audit-logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { images, referenceType, userKnownDimensionMm, userKnownDimensionType, additionalNotes } = body;

    if (!images || (!images.frontBase64 && !images.sideBase64 && !images.topBase64)) {
      return NextResponse.json(
        { error: 'At least one statue photo is required for analysis.' },
        { status: 400 }
      );
    }

    // 1. Run Statue Image Analysis
    const analysis = await analyzeStatueImages({
      images,
      referenceType,
      userKnownDimensionMm: userKnownDimensionMm ? Number(userKnownDimensionMm) : undefined,
      userKnownDimensionType,
      additionalNotes,
    });

    // 2. Compute Initial Pricing
    const pricing = calculateDynamicPrice({
      heightMm: analysis.dimensions.heightMm.value,
      widthMm: analysis.dimensions.widthMm.value,
      depthMm: analysis.dimensions.depthMm.value,
      volumeCm3: analysis.volumeCm3.value,
      surfaceAreaCm2: analysis.surfaceAreaCm2.value,
      complexityScore: analysis.complexityScore.value,
      materialId: analysis.recommendedResinId,
      finishId: 'raw-cleaned',
      packagingId: 'standard-box',
      infillDensityPercent: analysis.infillDensityPercent,
      layerHeightMm: analysis.layerHeightMm,
    });

    // 3. Create Audit Log Entry
    logScanEntry({
      statueName: 'Optical AI Statue Scan',
      dimensionsMm: {
        width: analysis.dimensions.widthMm.value,
        height: analysis.dimensions.heightMm.value,
        depth: analysis.dimensions.depthMm.value,
      },
      volumeCm3: analysis.volumeCm3.value,
      materialUsed: analysis.detectedMaterial.value,
      source: analysis.dimensions.heightMm.source,
      confidenceScore: analysis.overallConfidenceScore,
      productionCost: pricing.subtotalCost,
      quotedPrice: pricing.recommendedSellingPrice,
      status: analysis.overallConfidenceScore >= 75 ? 'Auto-Approved' : 'Flagged for Review',
      userModified: false,
      notes: analysis.notes,
    });

    return NextResponse.json({
      success: true,
      analysis,
      pricing,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/measure-statue:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze statue image.' },
      { status: 500 }
    );
  }
}
