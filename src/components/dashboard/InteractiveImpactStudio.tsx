import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  RotateCcw,
  Network,
  Server,
  Database,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Globe,
  Radio,
  FileText,
  CheckCircle2,
  Terminal,
  Cpu
} from 'lucide-react';
import { DashboardChangeRequest, INFRA_NODES, INFRA_LINKS, AGENT_PIPELINE } from '../../data/mockData';

interface InteractiveImpactStudioProps {
  isOpen: boolean;
  onClose: () => void;
  request: DashboardChangeRequest;
}

export const InteractiveImpactStudio: React.FC<InteractiveImpactStudioProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const [activeTab, setActiveTab] = useState<'topology' | 'pipeline' | 'policy'>('topology');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('payment-api');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPhase, setSimulationPhase] = useState<'idle' | 'severing' | 'cascade' | 'blocked'>('idle');

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationPhase('severing');
    setTimeout(() => {
      setSimulationPhase('cascade');
    }, 1200);
    setTimeout(() => {
      setSimulationPhase('blocked');
      setIsSimulating(false);
    }, 2500);
  };

  const handleResetSimulation = () => {
    setSimulationPhase('idle');
    setIsSimulating(false);
  };

  const selectedNode = INFRA_NODES.find((n) => n.id === selectedNodeId) || INFRA_NODES[1];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#18181B]/40 backdrop-blur-md"
        />

        {/* Studio Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden glass-panel p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.18)] z-10 flex flex-col gap-4 border border-white/80"
        >
          {/* ========================================================================= */}
          {/* 1. TOP STUDIO HEADER */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFECEC]/90 text-[#E03131] border border-[#FCD6CF] flex items-center justify-center shrink-0 shadow-xs backdrop-blur-md">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#F89C26]">
                    BLAST RADIUS STUDIO
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFECEC]/90 text-[#E03131] border border-[#FCD6CF] font-bold text-[10px] backdrop-blur-md">
                    Risk Index: {request.riskScore}/100
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#18181B]">
                  Live Blast Radius: {request.title}
                </h2>
              </div>
            </div>

            {/* Studio Navigation Tabs + Simulation Controller + Close */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 rounded-full bg-white/50 backdrop-blur-md border border-white/70 text-xs font-semibold shadow-xs">
                <button
                  onClick={() => setActiveTab('topology')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'topology' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#52525B] hover:text-[#18181B]'
                  }`}
                >
                  Topology Graph
                </button>
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'pipeline' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#52525B] hover:text-[#18181B]'
                  }`}
                >
                  AI Pipeline ({AGENT_PIPELINE.length})
                </button>
                <button
                  onClick={() => setActiveTab('policy')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'policy' ? 'bg-[#18181B] text-white shadow-sm' : 'text-[#52525B] hover:text-[#18181B]'
                  }`}
                >
                  Cedar Policy
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/60 hover:bg-white/90 text-[#52525B] flex items-center justify-center transition-all backdrop-blur-md border border-white/80 shadow-xs cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. MAIN STUDIO BODY */}
          {/* ========================================================================= */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-4 max-h-[calc(92vh-150px)]">
            {/* TAB 1: TOPOLOGY GRAPH */}
            {activeTab === 'topology' && (
              <div className="flex flex-col gap-4">
                {/* Simulation Control Bar */}
                <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#52525B]">
                    <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'text-[#EF4444] animate-pulse' : 'text-[#16A34A]'}`} />
                    <span>
                      {simulationPhase === 'idle' && 'Digital Twin Ready (AWS ap-south-1 live sync)'}
                      {simulationPhase === 'severing' && '⚡ Simulating ENI severance on subnet-07...'}
                      {simulationPhase === 'cascade' && '🚨 Cascade outage detected in Payment API & Aurora DB!'}
                      {simulationPhase === 'blocked' && '🛡️ Safety Gate Enforced: Change Terminated.'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunSimulation}
                      disabled={isSimulating}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F89C26] hover:bg-[#E88B0E] text-[#18181B] text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-75"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isSimulating ? 'Simulating...' : 'Simulate Blast Radius'}</span>
                    </button>
                    <button
                      onClick={handleResetSimulation}
                      className="p-1.5 rounded-full bg-white/70 hover:bg-white text-[#52525B] transition-colors shadow-sm cursor-pointer"
                      title="Reset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Interactive Network Graph Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* Left: Visual Graph Canvas (8 cols) */}
                  <div className="lg:col-span-8 p-4 rounded-3xl bg-[#FAF4E2]/70 border border-[#F4E3B8] flex flex-col gap-4 relative overflow-hidden shadow-inner">
                    {/* Origin Target Node */}
                    <div className="flex justify-center">
                      <div
                        onClick={() => setSelectedNodeId('subnet-07')}
                        className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all shadow-md ${
                          selectedNodeId === 'subnet-07'
                            ? 'bg-[#FFECEC] border-[#E03131] ring-2 ring-[#E03131]/30'
                            : 'bg-white border-[#FCD5CF] hover:bg-[#FFF5F5]'
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full bg-[#E03131] animate-pulse" />
                        <div className="text-left">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#E03131]">ORIGIN RESOURCE</div>
                          <div className="text-xs font-black text-[#18181B]">subnet-07 (10.0.4.0/24)</div>
                        </div>
                      </div>
                    </div>

                    {/* SVG Connector Lines */}
                    <div className="relative w-full h-8 flex items-center justify-center pointer-events-none">
                      <svg className="w-full h-full overflow-visible">
                        <line
                          x1="50%"
                          y1="0"
                          x2="25%"
                          y2="100%"
                          stroke={simulationPhase !== 'idle' ? '#EF4444' : '#F89C26'}
                          strokeWidth={simulationPhase !== 'idle' ? '3' : '2'}
                          strokeDasharray="4 4"
                          className={simulationPhase !== 'idle' ? 'animate-pulse' : ''}
                        />
                        <line
                          x1="50%"
                          y1="0"
                          x2="50%"
                          y2="100%"
                          stroke={simulationPhase !== 'idle' ? '#EF4444' : '#F89C26'}
                          strokeWidth={simulationPhase !== 'idle' ? '3' : '2'}
                          strokeDasharray="4 4"
                        />
                        <line
                          x1="50%"
                          y1="0"
                          x2="75%"
                          y2="100%"
                          stroke={simulationPhase !== 'idle' ? '#EF4444' : '#F89C26'}
                          strokeWidth={simulationPhase !== 'idle' ? '3' : '2'}
                          strokeDasharray="4 4"
                        />
                      </svg>
                    </div>

                    {/* Direct Impact Tier Nodes */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'payment-api', name: 'Payment API', reqs: '2.4M/hr', status: 'critical', icon: Server },
                        { id: 'order-service', name: 'Order Service', reqs: '1.8M/hr', status: 'warning', icon: Server },
                        { id: 'auth-broker', name: 'Auth Broker', reqs: '3.1M/hr', status: 'critical', icon: Cpu }
                      ].map((item) => {
                        const isSelected = selectedNodeId === item.id;
                        const isDead = simulationPhase === 'cascade' || simulationPhase === 'blocked';
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedNodeId(item.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 shadow-sm ${
                              isSelected
                                ? 'bg-white border-[#F89C26] ring-2 ring-[#F89C26]/30'
                                : 'bg-white/80 border-white hover:bg-white'
                            } ${isDead ? 'ring-2 ring-[#EF4444]/40 bg-[#FFF2F2]' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <item.icon className={`w-3.5 h-3.5 ${isDead ? 'text-[#EF4444]' : 'text-[#F89C26]'}`} />
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isDead ? 'bg-[#EF4444] text-white' : 'bg-[#FFECEC] text-[#E03131]'}`}>
                                {isDead ? 'OUTAGE' : 'CRITICAL'}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-[#18181B] truncate">{item.name}</div>
                            <div className="text-[10px] text-[#71717A]">{item.reqs}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Secondary SVG Connectors */}
                    <div className="relative w-full h-6 flex items-center justify-center pointer-events-none">
                      <svg className="w-full h-full overflow-visible">
                        <line x1="25%" y1="0" x2="35%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="75%" y1="0" x2="65%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                      </svg>
                    </div>

                    {/* Downstream Infrastructure Nodes */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'aurora-db', name: 'Aurora PG Multi-AZ DB', type: 'Database Tier', icon: Database },
                        { id: 'backup-vault', name: 'Disaster Recovery Vault', type: 'S3 Glacier Immutable', icon: Database }
                      ].map((item) => {
                        const isSelected = selectedNodeId === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedNodeId(item.id)}
                            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 shadow-sm ${
                              isSelected
                                ? 'bg-white border-[#F89C26] ring-2 ring-[#F89C26]/30'
                                : 'bg-white/70 border-white hover:bg-white'
                            }`}
                          >
                            <item.icon className="w-4 h-4 text-[#52525B]" />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-[#18181B] truncate">{item.name}</div>
                              <div className="text-[10px] text-[#71717A] truncate">{item.type}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Selected Node Telemetry Inspector (4 cols) */}
                  <div className="lg:col-span-4 p-4 rounded-3xl bg-white/70 border border-white/80 flex flex-col gap-3.5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-black/5 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">Node Inspector</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A34A] font-bold">LIVE TELEMETRY</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#18181B]">{selectedNode.name}</h4>
                      <p className="text-[11px] text-[#71717A] mt-0.5">Type: {selectedNode.type} • ID: {selectedNode.id}</p>
                    </div>

                    {/* Metrics List */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-2 rounded-xl bg-[#FAF6EA]">
                        <span className="text-[#71717A]">Tier Classification</span>
                        <span className="font-bold text-[#18181B]">{selectedNode.metrics?.tier || 'Core'}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-xl bg-[#FAF6EA]">
                        <span className="text-[#71717A]">Throughput at Risk</span>
                        <span className="font-mono font-bold text-[#E03131]">{selectedNode.metrics?.requests || 'Active'}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-xl bg-[#FAF6EA]">
                        <span className="text-[#71717A]">Impact Severity</span>
                        <span className="font-bold text-[#E03131]">{selectedNode.isCritical ? 'Critical Tier 0' : 'Tier 1 Warning'}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="p-3 rounded-2xl bg-[#FFF0ED] border border-[#FCD6CF] text-[11px] text-[#D9383A] leading-relaxed">
                      <strong>Blast Radius Root Cause:</strong> Deletion of subnet-07 drops the primary Elastic Network Interface (ENI) attached to this container, severing incoming traffic.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI AGENT PIPELINE */}
            {activeTab === 'pipeline' && (
              <div className="flex flex-col gap-3">
                <div className="text-xs text-[#71717A]">
                  Autonomous analysis pipeline executed in <strong>420ms</strong> before gate enforcement:
                </div>
                <div className="space-y-2">
                  {AGENT_PIPELINE.map((agent, i) => (
                    <div
                      key={agent.id}
                      className="p-3.5 rounded-2xl bg-white/70 border border-white/80 flex items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#18181B] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#18181B]">{agent.name} AGENT</span>
                            <span className="text-[10px] text-[#71717A]">• {agent.role}</span>
                          </div>
                          <div className="text-[11px] text-[#52525B] mt-0.5">{agent.detail}</div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        agent.status === 'completed'
                          ? 'bg-[#ECFDF5] text-[#16A34A]'
                          : 'bg-[#FFECEC] text-[#E03131]'
                      }`}>
                        {agent.status === 'completed' ? 'PASSED' : 'ALERT'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CEDAR POLICY & REMEDIATION */}
            {activeTab === 'policy' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cedar Policy Definition */}
                <div className="p-4 rounded-3xl bg-white/70 border border-white/80 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#18181B]">
                    <ShieldAlert className="w-4 h-4 text-[#E03131]" />
                    <span>Cedar Policy Engine Verification</span>
                  </div>
                  <pre className="p-3.5 rounded-2xl bg-[#18181B] text-[#A6E22E] font-mono text-[11px] overflow-x-auto leading-relaxed">
{`// Policy: PRODUCTION_CHANGE_REQUIRES_APPROVAL
permit(
  principal in Role::"SeniorCloudArchitect",
  action in [Action::"deleteSubnet", Action::"modifySecurityGroup"],
  resource in Environment::"Production"
)
when {
  context.blastRadiusScore < 30
};`}
                  </pre>
                  <p className="text-[11px] text-[#E03131] font-semibold">
                    ✕ VIOLATION: Current blast radius score is 87/100, exceeding the 30/100 automated clearance limit.
                  </p>
                </div>

                {/* Remediation Strategy */}
                <div className="p-4 rounded-3xl bg-white/70 border border-white/80 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#18181B]">
                    <Terminal className="w-4 h-4 text-[#F89C26]" />
                    <span>Recommended Safe Migration Plan</span>
                  </div>
                  <div className="space-y-2 text-xs text-[#52525B]">
                    <div className="p-2.5 rounded-xl bg-[#FAF6EA] flex items-start gap-2">
                      <span className="font-bold text-[#18181B]">1.</span>
                      <span>Drain ENI traffic from subnet-07 to subnet-08 in AZ-2.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF6EA] flex items-start gap-2">
                      <span className="font-bold text-[#18181B]">2.</span>
                      <span>Verify Payment API health check status on secondary subnet.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF6EA] flex items-start gap-2">
                      <span className="font-bold text-[#18181B]">3.</span>
                      <span>Re-run BlastGuard simulation to confirm risk score drops below 20/100.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 3. STUDIO FOOTER */}
          {/* ========================================================================= */}
          <div className="flex items-center justify-between border-t border-black/5 pt-3">
            <span className="text-[11px] text-[#71717A]">
              BlastGuard Autonomous Safety System • Real-Time Engine
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/70 hover:bg-white text-xs font-semibold text-[#18181B] transition-colors shadow-sm cursor-pointer"
              >
                Close Studio
              </button>
              <button
                onClick={() => {
                  alert(`Audit report for ${request.title} exported as PDF.`);
                }}
                className="px-4 py-2 rounded-xl bg-[#F89C26] hover:bg-[#E88B0E] text-xs font-bold text-[#18181B] transition-colors shadow-sm cursor-pointer"
              >
                Export Incident Report
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
