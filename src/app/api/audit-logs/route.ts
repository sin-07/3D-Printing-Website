import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs, logScanEntry, updateAuditLogStatus } from '@/lib/pricing/audit-logger';

export async function GET() {
  const logs = getAuditLogs();
  return NextResponse.json({
    success: true,
    logs,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (body.action === 'update-status' && body.id && body.status) {
      const ok = updateAuditLogStatus(body.id, body.status, body.reviewedBy, body.notes);
      return NextResponse.json({
        success: ok,
        message: ok ? 'Log status updated.' : 'Log not found.',
      });
    }

    const created = logScanEntry(body);
    return NextResponse.json({
      success: true,
      log: created,
    });
  } catch (error: any) {
    console.error('Error in /api/audit-logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process audit log request.' },
      { status: 500 }
    );
  }
}
