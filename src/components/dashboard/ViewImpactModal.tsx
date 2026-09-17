import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Network, AlertTriangle, ShieldCheck, Database, Server, Activity } from 'lucide-react';
import { DashboardChangeRequest, INFRA_NODES, INFRA_LINKS } from '../../data/mockData';

interface ViewImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: DashboardChangeRequest;
}

export const ViewImpactModal: React.FC<ViewImpactModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/25 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10 custom-scrollbar flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-black/5 pb-4">
            <div>
              <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#F89C26]">
                BLAST RADIUS TOPOLOGY
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-0.5">
                Impact Analysis: {request.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#71717A] mt-1">
                Simulated dependency graph in region <span className="font-semibold text-[#18181B]">{request.region}</span> ({request.environment})
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#52525B] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/50 border border-white/70">
            <div className="text-center">
              <div className="text-xl font-black text-[#E03131]">{request.riskScore}/100</div>
              <div className="text-[11px] font-medium text-[#71717A]">Risk Index</div>
            </div>
            <div className="text-center border-x border-black/5">
              <div className="text-xl font-black text-[#18181B]">{request.affectedResources}</div>
              <div className="text-[11px] font-medium text-[#71717A]">Affected Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-[#E03131]">{request.criticalServices}</div>
              <div className="text-[11px] font-medium text-[#71717A]">Critical Services</div>
            </div>
          </div>

          {/* Simulated Topology Node Map */}
          <div className="p-5 rounded-2xl bg-[#FFFDF7] border border-[#F6E2B3] flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-semibold text-[#52525B]">
              <span className="flex items-center gap-1.5">
                <Network className="w-4 h-4 text-[#F89C26]" />
                Target Origin: <span className="text-[#18181B]">{request.target}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFECEC] text-[#E03131] font-bold text-[11px]">
                High Blast Radius
              </span>
            </div>

            {/* Nodes Visualizer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {INFRA_NODES.slice(0, 6).map((node) => {
                const isOrigin = node.id === 'subnet-07';
                return (
                  <div
                    key={node.id}
                    className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                      isOrigin
                        ? 'bg-[#FFECEC]/80 border-[#FCD5CF] shadow-sm'
                        : node.isCritical
                        ? 'bg-[#FFF5F2]/80 border-[#FDE2DC]'
                        : 'bg-white/80 border-[#E5E7EB]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#18181B] truncate">{node.name}</span>
                      {isOrigin && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E03131] text-white">ORIGIN</span>}
                      {!isOrigin && node.isCritical && <span className="text-[10px] font-semibold text-[#E03131]">CRITICAL</span>}
                    </div>
                    <div className="text-[11px] text-[#71717A] flex items-center justify-between mt-1">
                      <span>{node.metrics?.tier || node.type}</span>
                      <span className="font-mono text-[10px] text-[#52525B]">{node.metrics?.requests || 'Active'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex justify-end gap-3 pt-2 border-t border-black/5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-white/80 text-xs font-semibold text-[#18181B] transition-colors shadow-sm cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Detailed PDF blast radius report generated for ${request.title}.`);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#F89C26] hover:bg-[#E88B0E] text-xs font-bold text-[#18181B] transition-colors shadow-sm cursor-pointer"
            >
              Export Audit Report
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
