import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fileName,
      fileSizeMb,
      dimensionsMm,
      triangleCount,
      slicingParams,
      calculations,
      customerDetails,
      cloudinaryUrl,
    } = body;

    const quoteId = `ATH-CAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const db = await getDatabase();
    const customPrintsCollection = db.collection('custom_prints');

    const quoteDoc = {
      quoteId,
      file: {
        name: fileName || 'unnamed_cad_model.step',
        sizeMb: fileSizeMb || 0,
        dimensionsMm: dimensionsMm || { width: 0, height: 0, depth: 0 },
        triangleCount: triangleCount || 0,
        cloudinaryUrl: cloudinaryUrl || '',
      },
      slicingParams: {
        scalePercentage: slicingParams?.scalePercentage || 100,
        material: slicingParams?.material || 'Carbon Fiber PA-CF',
        layerHeight: slicingParams?.layerHeight || 0.12,
        infillDensity: slicingParams?.infillDensity || 45,
        infillPattern: slicingParams?.infillPattern || 'gyroid',
        wallLoops: slicingParams?.wallLoops || 4,
        finish: slicingParams?.finish || 'Raw As-Printed (Technical)',
        toleranceGrade: slicingParams?.toleranceGrade || 'precision',
      },
      calculations: {
        scaledVolumeCm3: calculations?.scaledVolume || 0,
        netVolumeCm3: calculations?.netVolumeCm3 || 0,
        massGrams: calculations?.massGrams || 0,
        filamentMeters: calculations?.filamentMeters || 0,
        totalLayers: calculations?.totalLayers || 0,
        printDurationHours: calculations?.hours || 0,
        printDurationMinutes: calculations?.minutes || 0,
        tensileYieldMPa: calculations?.tensileYieldMPa || 0,
        estimatedCostINR: calculations?.totalCalculatedCost || 0,
      },
      customerDetails: {
        pincode: customerDetails?.pincode || '560001',
        isGstClaim: Boolean(customerDetails?.isGstClaim),
        gstin: customerDetails?.gstin || '',
        companyName: customerDetails?.companyName || '',
        email: customerDetails?.email || '',
      },
      status: 'quote_generated',
      createdAt: new Date(),
    };

    const result = await customPrintsCollection.insertOne(quoteDoc);

    return NextResponse.json(
      {
        success: true,
        quoteId,
        insertedId: result.insertedId,
        message: 'CAD configuration saved to MongoDB Atlas',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to save custom print quote:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save CAD quote' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quoteId = searchParams.get('quoteId');

    const db = await getDatabase();
    const customPrintsCollection = db.collection('custom_prints');

    if (quoteId) {
      const quote = await customPrintsCollection.findOne({ quoteId });
      if (!quote) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      }
      return NextResponse.json({ quote });
    }

    const recentQuotes = await customPrintsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      count: recentQuotes.length,
      quotes: recentQuotes,
    });
  } catch (error: any) {
    console.error('Failed to fetch CAD quotes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
