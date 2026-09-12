import { AuditLogEntry } from '@/types';

// In-memory store initialized with realistic initial benchmark records
let auditLogs: AuditLogEntry[] = [
  {
    id: 'LOG-ATH-9081',
    timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    statueName: 'Archangel Michael Statue Scan',
    dimensionsMm: { width: 145, height: 280, depth: 110 },
    volumeCm3: 420,
    materialUsed: '16K Ultra-HD SLA Resin',
    source: '3d-model-derived',
    confidenceScore: 99,
    productionCost: 112.5,
    quotedPrice: 175,
    status: 'Admin-Approved',
    reviewedBy: 'Senior Atelier Master',
    userModified: false,
    notes: 'Exact STL mesh geometry parsed with 16-micron resolution.'
  },
  {
    id: 'LOG-ATH-9082',
    timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    statueName: 'Cyber Samurai Figurine',
    dimensionsMm: { width: 95, height: 210, depth: 85 },
    volumeCm3: 260,
    materialUsed: 'Titanium-Infused Ceramic Resin',
    source: 'measured-reference',
    confidenceScore: 91,
    productionCost: 86.2,
    quotedPrice: 135,
    status: 'User-Ordered',
    reviewedBy: 'Auto Slicer Pipeline',
    userModified: true,
    notes: 'Calibrated using standard credit card reference in front angle.'
  },
  {
    id: 'LOG-ATH-9083',
    timestamp: new Date(Date.now() - 3600 * 1000 * 14).toISOString(),
    statueName: 'Aphrodite Museum Bust (Uncalibrated photo)',
    dimensionsMm: { width: 180, height: 350, depth: 160 },
    volumeCm3: 780,
    materialUsed: 'Obsidian High-Density Composite',
    source: 'ai-estimated',
    confidenceScore: 68,
    productionCost: 215.0,
    quotedPrice: 340,
    status: 'Flagged for Review',
    reviewedBy: undefined,
    userModified: false,
    notes: 'Low confidence (68%) due to single uncalibrated viewpoint.'
  }
];

export function getAuditLogs(): AuditLogEntry[] {
  return [...auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function logScanEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `LOG-ATH-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
  };
  auditLogs.unshift(newEntry);
  // Cap at 200 logs
  if (auditLogs.length > 200) {
    auditLogs = auditLogs.slice(0, 200);
  }
  return newEntry;
}

export function updateAuditLogStatus(id: string, status: AuditLogEntry['status'], reviewedBy?: string, notes?: string): boolean {
  const found = auditLogs.find((l) => l.id === id);
  if (found) {
    found.status = status;
    if (reviewedBy) found.reviewedBy = reviewedBy;
    if (notes) found.notes = notes;
    return true;
  }
  return false;
}
