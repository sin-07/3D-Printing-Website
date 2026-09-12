import { NextRequest, NextResponse } from 'next/server';
import { parseSTLGeometry, buildAnalysisFrom3DGeometry } from '@/lib/ai/geometry-service';
import { calculateDynamicPrice } from '@/lib/pricing/pricing-engine';
import { logScanEntry } from '@/lib/pricing/audit-logger';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No 3D file (.STL, .OBJ) provided in request.' },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
    const arrayBuffer = await file.arrayBuffer();

    // 1. Parse exact geometry
    const geometry = parseSTLGeometry(arrayBuffer);
    const analysis = buildAnalysisFrom3DGeometry(geometry, fileName, fileSizeMb);

    // 2. Calculate dynamic price
    const pricing = calculateDynamicPrice({
      heightMm: analysis.dimensions.heightMm.value,
      widthMm: analysis.dimensions.widthMm.value,
      depthMm: analysis.dimensions.depthMm.value,
      volumeCm3: analysis.volumeCm3.value,
      surfaceAreaCm2: analysis.surfaceAreaCm2.value,
      complexityScore: analysis.complexityScore.value,
      materialId: 'sla-16k-standard',
      finishId: 'raw-cleaned',
      packagingId: 'standard-box',
      infillDensityPercent: analysis.infillDensityPercent,
      layerHeightMm: analysis.layerHeightMm,
    });

    // 3. Create Audit Log
    logScanEntry({
      statueName: `3D CAD Mesh: ${fileName}`,
      dimensionsMm: {
        width: analysis.dimensions.widthMm.value,
        height: analysis.dimensions.heightMm.value,
        depth: analysis.dimensions.depthMm.value,
      },
      volumeCm3: analysis.volumeCm3.value,
      materialUsed: '16K Ultra-HD SLA Resin',
      source: '3d-model-derived',
      confidenceScore: 99,
      productionCost: pricing.subtotalCost,
      quotedPrice: pricing.recommendedSellingPrice,
      status: 'Auto-Approved',
      userModified: false,
      notes: `Exact 3D geometry parsed. ${geometry.triangleCount.toLocaleString()} triangles.`,
    });

    return NextResponse.json({
      success: true,
      analysis,
      pricing,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/parse-3d:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse 3D model geometry.' },
      { status: 500 }
    );
  }
}
