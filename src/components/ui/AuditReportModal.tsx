import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, FileText, Download, AlertTriangle, Terminal } from 'lucide-react';
import { STATS } from '../../data/mockData';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-950 border border-white/15 p-6 md:p-8 text-slate-200 shadow-2xl ring-1 ring-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-mono text-white">
                  BLASTGUARD INCIDENT AUDIT REPORT
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  REF: AUDIT-2026-CR8842 • VPC: {STATS.changeRequest.vpc}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="mt-6 space-y-6 text-sm">
            {/* Executive Summary */}
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-red-400 uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>Executive Decision Summary</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-xs md:text-sm">
                The autonomous BlastGuard policy engine intercepted and <strong>BLOCKED</strong> the deletion
                of resource <code className="px-1.5 py-0.5 rounded bg-black/60 text-red-300 font-mono text-xs">{STATS.changeRequest.target}</code>.
                Execution of this change would have severed ENI network interfaces for <strong>Payment API</strong>,
                causing a revenue-critical production outage.
              </p>
            </div>

            {/* Impact Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <span className="text-slate-400 uppercase font-semibold">Affected Core Services</span>
                <ul className="space-y-1 text-slate-300">
                  <li className="flex items-center gap-1.5 text-red-400">
                    <span>✕</span> Payment API Service (2.4M req/hr)
                  </li>
                  <li className="flex items-center gap-1.5 text-amber-400">
                    <span>✕</span> Order Fulfillment Engine (Tier 1)
                  </li>
                  <li className="flex items-center gap-1.5 text-amber-400">
                    <span>✕</span> Auth & Session Broker (3.1M req/hr)
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <span className="text-slate-400 uppercase font-semibold">Downstream Database Replicas</span>
                <ul className="space-y-1 text-slate-300">
                  <li className="flex items-center gap-1.5 text-slate-300">
                    <span>•</span> Aurora PostgreSQL Multi-AZ Cluster
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-300">
                    <span>•</span> DynamoDB Global Order Tables
                  </li>
                  <li className="flex items-center gap-1.5 text-purple-400">
                    <span>•</span> Immutable S3 Disaster Recovery Vault
                  </li>
                </ul>
              </div>
            </div>

            {/* Rollback & Remediation Procedure */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
              <span className="text-xs font-mono uppercase text-orange-400 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Recommended Safe Migration Path
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-xs font-mono text-slate-300">
                <li>Provision replacement subnet in secondary AZ (<code className="text-orange-300">us-east-1c</code>).</li>
                <li>Migrate Payment API elastic network interfaces with zero downtime blue/green rollout.</li>
                <li>Re-run BlastGuard autonomous pre-flight simulation before queuing deletion ticket.</li>
              </ol>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500">
              BlastGuard Autonomous Safety Intelligence v2.4
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('BlastGuard Audit Log JSON successfully exported to clipboard/file.');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-orange-400 transition-colors shadow-lg shadow-orange-950/40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit JSON</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
