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
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#EDFCE2]/95 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(60,120,40,0.18)] z-10 custom-scrollbar flex flex-col gap-6 border border-[#BCE99A] rounded-3xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#BCE99A]/60 pb-4">
            <div>
              <div className="text-[11px] font-black tracking-[0.16em] uppercase text-[#15803D]">
                BLAST RADIUS TOPOLOGY
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E4726] mt-0.5 tracking-tight">
                Impact Analysis: {request.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#54825A] mt-1 font-medium">
                Simulated dependency graph in region <span className="font-bold text-[#1E4726]">{request.region}</span> ({request.environment})
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#DCF8C6] hover:bg-[#D4F7B2] text-[#54825A] hover:text-[#1E4726] flex items-center justify-center transition-colors border border-[#BCE99A] shadow-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#BCE99A] shadow-xs">
            <div className="text-center">
              <div className="text-xl font-black text-[#EF4444]">{request.riskScore}/100</div>
              <div className="text-[11px] font-bold text-[#54825A]">Risk Index</div>
            </div>
            <div className="text-center border-x border-[#BCE99A]/60">
              <div className="text-xl font-black text-[#1E4726]">{request.affectedResources}</div>
              <div className="text-[11px] font-bold text-[#54825A]">Affected Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-[#EF4444]">{request.criticalServices}</div>
              <div className="text-[11px] font-bold text-[#54825A]">Critical Services</div>
            </div>
          </div>

          {/* Simulated Topology Node Map */}
          <div className="p-5 rounded-2xl bg-[#F4FDEE] border border-[#BCE99A] flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#54825A]">
              <span className="flex items-center gap-1.5">
                <Network className="w-4 h-4 text-[#15803D]" />
                Target Origin: <span className="text-[#1E4726]">{request.target}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFECEC] text-[#EF4444] font-bold text-[11px] border border-[#FCD5CF]">
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
                        ? 'bg-[#FFECEC] border-[#FCD5CF] shadow-xs'
                        : node.isCritical
                        ? 'bg-[#FFFFFF] border-[#FCD5CF]'
                        : 'bg-[#FFFFFF] border-[#BCE99A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#1E4726] truncate">{node.name}</span>
                      {isOrigin && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EF4444] text-white">ORIGIN</span>}
                      {!isOrigin && node.isCritical && <span className="text-[10px] font-bold text-[#EF4444]">CRITICAL</span>}
                    </div>
                    <div className="text-[11px] text-[#54825A] flex items-center justify-between mt-1">
                      <span>{node.metrics?.tier || node.type}</span>
                      <span className="font-mono text-[10px] text-[#1E4726] font-semibold">{node.metrics?.requests || 'Active'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex justify-end gap-3 pt-2 border-t border-[#BCE99A]/60">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#DCF8C6] hover:bg-[#D4F7B2] border border-[#BCE99A] text-xs font-bold text-[#1E4726] transition-colors shadow-xs cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Detailed PDF blast radius report generated for ${request.title}.`);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#BAF084] hover:bg-[#A8EB6C] text-xs font-black text-[#1E4726] transition-colors shadow-xs cursor-pointer border border-[#8CD94B]"
            >
              Export Audit Report
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
