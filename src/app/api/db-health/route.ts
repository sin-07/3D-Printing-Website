import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
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
