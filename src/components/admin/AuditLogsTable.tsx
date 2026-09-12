'use client';

import React, { useState, useEffect } from 'react';
import { AuditLogEntry } from '@/types';
import { useToast } from '@/context/ToastContext';
import { ShieldCheck, AlertTriangle, CheckCircle, Search, Filter, RefreshCw, FileText, ArrowRight } from 'lucide-react';

export default function AuditLogsTable() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-status',
          id,
          status: 'Admin-Approved',
          reviewedBy: 'Atelier Master (Admin)',
          notes: 'Manually inspected metrology and authorized for print queue.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Quote Approved', `Log ${id} authorized.`, 'success');
        fetchLogs();
      }
    } catch (e: any) {
      showToast('Action Failed', e.message, 'error');
    }
  };

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.statueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/90 border border-obsidian-700/80 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Table Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-800 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider block">
            AUDIT TRAIL &amp; APPROVAL QUEUE
          </span>
          <h2 className="text-2xl font-display font-bold text-foreground">
            AI Metrology Scans &amp; Dynamic Quotes
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-titanium-400" />
            <input
              type="text"
              placeholder="Search statue or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-obsidian-950 border border-obsidian-700 text-xs font-mono text-foreground placeholder:text-titanium-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-obsidian-950 border border-obsidian-700 text-xs font-mono text-titanium-300 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Statuses</option>
            <option value="Auto-Approved">Auto-Approved</option>
            <option value="Flagged for Review">Flagged for Review</option>
            <option value="Admin-Approved">Admin-Approved</option>
            <option value="User-Ordered">User-Ordered</option>
          </select>

          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-2 rounded-lg border border-obsidian-700 bg-obsidian-950 text-titanium-400 hover:text-white"
            title="Refresh logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-obsidian-800 text-titanium-400">
              <th className="pb-3 font-semibold">ID / Timestamp</th>
              <th className="pb-3 font-semibold">Statue Name</th>
              <th className="pb-3 font-semibold">Dimensions (mm)</th>
              <th className="pb-3 font-semibold">Volume / Material</th>
              <th className="pb-3 font-semibold">Source / Score</th>
              <th className="pb-3 font-semibold">Quoted Price</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-titanium-500">
                  No scan logs matching current criteria.
                </td>
              </tr>
            ) : (
              filtered.map((log) => {
                const statusBadge =
                  log.status === 'Admin-Approved' || log.status === 'Auto-Approved'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : log.status === 'Flagged for Review'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-gold-500/10 text-gold-400 border-gold-500/30';

                return (
                  <tr key={log.id} className="hover:bg-obsidian-950/40 transition-colors">
                    <td className="py-3.5">
                      <span className="font-bold text-foreground block">{log.id}</span>
                      <span className="text-[10px] text-titanium-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3.5 max-w-[180px]">
                      <span className="text-titanium-200 font-semibold truncate block">
                        {log.statueName}
                      </span>
                      {log.userModified && (
                        <span className="text-[9px] text-amber-400 font-mono">User Adjusted</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      {log.dimensionsMm.width} × {log.dimensionsMm.depth} × {log.dimensionsMm.height} mm
                    </td>
                    <td className="py-3.5">
                      <span className="text-foreground font-bold">{log.volumeCm3} cm³</span>
                      <span className="text-[10px] text-titanium-500 block truncate max-w-[140px]">
                        {log.materialUsed}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] border border-obsidian-700 bg-obsidian-950 text-titanium-300">
                        {log.source === '3d-model-derived' ? 'CAD' : log.source.includes('reference') ? 'Ref' : 'AI'} • {log.confidenceScore}%
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-gold-400">
                      ${log.quotedPrice}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border font-bold ${statusBadge}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {log.status === 'Flagged for Review' ? (
                        <button
                          onClick={() => handleApprove(log.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-[10px] font-bold"
                        >
                          Approve Quote
                        </button>
                      ) : (
                        <span className="text-[10px] text-titanium-500">Verified</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
