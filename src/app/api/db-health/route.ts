import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        status: 'unconfigured',
        message: 'MONGODB_URI is not set in environment variables. Please add it to your Vercel Project Settings.',
      });
    }

    const startTime = Date.now();
    const db = await getDatabase();
    const pingResult = await db.command({ ping: 1 });
    const latencyMs = Date.now() - startTime;

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    return NextResponse.json({
      status: 'connected',
      database: db.databaseName,
      latencyMs,
      ping: pingResult,
      collections: collectionNames,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MongoDB health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Failed to connect to MongoDB Atlas',
      },
      { status: 500 }
    );
  }
}
