import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source = 'home_launch_pill' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const reservationsCollection = db.collection('reservations');

    // Check if email already reserved
    const existing = await reservationsCollection.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyReserved: true,
        reservationNumber: existing.reservationNumber,
        spotNumber: existing.spotNumber || 1,
        message: 'Your production batch slot is already secured.',
      });
    }

    // Get current count for spot numbering
    const count = await reservationsCollection.countDocuments();
    const spotNumber = String(count + 1).padStart(4, '0');
    const reservationNumber = `ATH-RES-2026-${spotNumber}`;

    const reservationDoc = {
      reservationNumber,
      spotNumber: count + 1,
      email: email.toLowerCase().trim(),
      source,
      batch: '2026 High-Speed Additive Batch A1',
      priorityTier: count < 50 ? 'Founder Batch Priority' : 'General Queue',
      discountEntitlement: '20% Off First Custom Engineering Batch',
      createdAt: new Date(),
    };

    const result = await reservationsCollection.insertOne(reservationDoc);

    return NextResponse.json(
      {
        success: true,
        insertedId: result.insertedId,
        reservationNumber,
        spotNumber: count + 1,
        message: `spot #${spotNumber} confirmed for 2026 production`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to record reservation in MongoDB:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record reservation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const reservationsCollection = db.collection('reservations');

    const totalCount = await reservationsCollection.countDocuments();
    const recent = await reservationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .project({ email: 0 }) // Mask email for privacy
      .toArray();

    return NextResponse.json({
      totalReservations: totalCount,
      recentSpots: recent,
    });
  } catch (error: any) {
    console.error('Failed to fetch reservations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}
