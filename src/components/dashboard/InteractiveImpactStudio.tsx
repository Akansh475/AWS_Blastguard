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
          className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden bg-[#EDFCE2]/95 backdrop-blur-xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(60,120,40,0.18)] z-10 flex flex-col gap-4 border border-[#BCE99A] rounded-3xl"
        >
          {/* ========================================================================= */}
          {/* 1. TOP STUDIO HEADER */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BCE99A]/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFECEC] text-[#EF4444] border border-[#FCD5CF] flex items-center justify-center shrink-0 shadow-xs">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black tracking-[0.16em] uppercase text-[#15803D]">
                    BLAST RADIUS STUDIO
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFECEC] text-[#EF4444] border border-[#FCD5CF] font-bold text-[10px]">
                    Risk Index: {request.riskScore}/100
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#1E4726] tracking-tight">
                  Live Blast Radius: {request.title}
                </h2>
              </div>
            </div>

            {/* Studio Navigation Tabs + Simulation Controller + Close */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 rounded-full bg-[#F4FDEE] border border-[#BCE99A] text-xs font-bold shadow-xs">
                <button
                  onClick={() => setActiveTab('topology')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'topology' ? 'bg-[#276735] text-white shadow-xs' : 'text-[#54825A] hover:text-[#1E4726]'
                  }`}
                >
                  Topology Graph
                </button>
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'pipeline' ? 'bg-[#276735] text-white shadow-xs' : 'text-[#54825A] hover:text-[#1E4726]'
                  }`}
                >
                  AI Pipeline ({AGENT_PIPELINE.length})
                </button>
                <button
                  onClick={() => setActiveTab('policy')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'policy' ? 'bg-[#276735] text-white shadow-xs' : 'text-[#54825A] hover:text-[#1E4726]'
                  }`}
                >
                  Cedar Policy
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#DCF8C6] hover:bg-[#D4F7B2] text-[#54825A] hover:text-[#1E4726] flex items-center justify-center transition-all border border-[#BCE99A] shadow-xs cursor-pointer ml-1"
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
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#BCE99A] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#54825A]">
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
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#BAF084] hover:bg-[#A8EB6C] text-[#1E4726] text-xs font-black transition-all shadow-xs cursor-pointer disabled:opacity-75 border border-[#8CD94B]"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isSimulating ? 'Simulating...' : 'Simulate Blast Radius'}</span>
                    </button>
                    <button
                      onClick={handleResetSimulation}
                      className="p-1.5 rounded-xl bg-[#DCF8C6] hover:bg-[#D4F7B2] text-[#54825A] hover:text-[#1E4726] transition-colors shadow-xs cursor-pointer border border-[#BCE99A]"
                      title="Reset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Interactive Network Graph Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* Left: Visual Graph Canvas (8 cols) */}
                  <div className="lg:col-span-8 p-5 rounded-3xl bg-[#F4FDEE] border border-[#BCE99A] flex flex-col gap-4 relative overflow-hidden shadow-inner">
                    {/* Origin Target Node */}
                    <div className="flex justify-center">
                      <div
                        onClick={() => setSelectedNodeId('subnet-07')}
                        className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all shadow-xs ${
                          selectedNodeId === 'subnet-07'
                            ? 'bg-[#FFECEC] border-2 border-[#EF4444]'
                            : 'bg-[#FFFFFF] border-[#FCD5CF] hover:bg-[#FFF5F5]'
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-pulse" />
                        <div className="text-left">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#EF4444]">ORIGIN RESOURCE</div>
                          <div className="text-xs font-black text-[#1E4726]">subnet-07 (10.0.4.0/24)</div>
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
                          stroke={simulationPhase !== 'idle' ? '#EF4444' : '#15803D'}
                          strokeWidth={simulationPhase !== 'idle' ? '3' : '2'}
                          strokeDasharray="4 4"
                          className={simulationPhase !== 'idle' ? 'animate-pulse' : ''}
                        />
                        <line
                          x1="50%"
                          y1="0"
                          x2="50%"
                          y2="100%"
                          stroke={simulationPhase !== 'idle' ? '#EF4444' : '#15803D'}
                          strokeWidth={simulationPhase !== 'idle' ? '3' : '2'}
                          strokeDasharray="4 4"
                        />
                        <line
                          x1="50%"
                          y1="0"
                          x2="75%"
                          y2="100%"
                          stroke={simulationPhase !== 'idle' ? '#EF4444' : '#15803D'}
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
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 shadow-xs ${
                              isSelected
                                ? 'bg-[#FFFFFF] border-2 border-[#15803D]'
                                : 'bg-[#FFFFFF] border-[#BCE99A] hover:bg-[#F4FDEE]'
                            } ${isDead ? 'ring-2 ring-[#EF4444]/40 bg-[#FFF2F2]' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <item.icon className={`w-3.5 h-3.5 ${isDead ? 'text-[#EF4444]' : 'text-[#15803D]'}`} />
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isDead ? 'bg-[#EF4444] text-white' : 'bg-[#FFECEC] text-[#EF4444]'}`}>
                                {isDead ? 'OUTAGE' : 'CRITICAL'}
                              </span>
                            </div>
                            <div className="text-xs font-black text-[#1E4726] truncate">{item.name}</div>
                            <div className="text-[10px] text-[#54825A]">{item.reqs}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Secondary SVG Connectors */}
                    <div className="relative w-full h-6 flex items-center justify-center pointer-events-none">
                      <svg className="w-full h-full overflow-visible">
                        <line x1="25%" y1="0" x2="35%" y2="100%" stroke="#BCE99A" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="75%" y1="0" x2="65%" y2="100%" stroke="#BCE99A" strokeWidth="1.5" strokeDasharray="3 3" />
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
                            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 shadow-xs ${
                              isSelected
                                ? 'bg-[#FFFFFF] border-2 border-[#15803D]'
                                : 'bg-[#FFFFFF] border-[#BCE99A] hover:bg-[#F4FDEE]'
                            }`}
                          >
                            <item.icon className="w-4 h-4 text-[#54825A]" />
                            <div className="min-w-0">
                              <div className="text-xs font-black text-[#1E4726] truncate">{item.name}</div>
                              <div className="text-[10px] text-[#54825A] truncate">{item.type}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Selected Node Telemetry Inspector (4 cols) */}
                  <div className="lg:col-span-4 p-4 rounded-3xl bg-[#FFFFFF] border border-[#BCE99A] flex flex-col gap-3.5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#BCE99A]/60 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#54825A]">Node Inspector</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A34A] border border-[#BBF7D0] font-bold">LIVE TELEMETRY</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-[#1E4726]">{selectedNode.name}</h4>
                      <p className="text-[11px] text-[#54825A] mt-0.5">Type: {selectedNode.type} • ID: {selectedNode.id}</p>
                    </div>

                    {/* Metrics List */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-2.5 rounded-xl bg-[#F4FDEE] border border-[#BCE99A]">
                        <span className="text-[#54825A] font-medium">Tier Classification</span>
                        <span className="font-bold text-[#1E4726]">{selectedNode.metrics?.tier || 'Core'}</span>
                      </div>
                      <div className="flex justify-between p-2.5 rounded-xl bg-[#F4FDEE] border border-[#BCE99A]">
                        <span className="text-[#54825A] font-medium">Throughput at Risk</span>
                        <span className="font-mono font-bold text-[#EF4444]">{selectedNode.metrics?.requests || 'Active'}</span>
                      </div>
                      <div className="flex justify-between p-2.5 rounded-xl bg-[#F4FDEE] border border-[#BCE99A]">
                        <span className="text-[#54825A] font-medium">Impact Severity</span>
                        <span className="font-bold text-[#EF4444]">{selectedNode.isCritical ? 'Critical Tier 0' : 'Tier 1 Warning'}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="p-3 rounded-2xl bg-[#FFECEC] border border-[#FCD5CF] text-[11px] text-[#E03131] leading-relaxed">
                      <strong>Blast Radius Root Cause:</strong> Deletion of subnet-07 drops the primary Elastic Network Interface (ENI) attached to this container, severing incoming traffic.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI AGENT PIPELINE */}
            {activeTab === 'pipeline' && (
              <div className="flex flex-col gap-3">
                <div className="text-xs text-[#54825A] font-medium">
                  Autonomous analysis pipeline executed in <strong className="text-[#1E4726]">420ms</strong> before gate enforcement:
                </div>
                <div className="space-y-2">
                  {AGENT_PIPELINE.map((agent, i) => (
                    <div
                      key={agent.id}
                      className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#BCE99A] flex items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#276735] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#1E4726]">{agent.name} AGENT</span>
                            <span className="text-[10px] text-[#54825A]">• {agent.role}</span>
                          </div>
                          <div className="text-[11px] text-[#54825A] mt-0.5">{agent.detail}</div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        agent.status === 'completed'
                          ? 'bg-[#ECFDF5] text-[#16A34A] border border-[#BBF7D0]'
                          : 'bg-[#FFECEC] text-[#EF4444] border border-[#FCD5CF]'
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
                <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#BCE99A] flex flex-col gap-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-black text-[#1E4726]">
                    <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                    <span>Cedar Policy Engine Verification</span>
                  </div>
                  <pre className="p-3.5 rounded-2xl bg-[#1E4726] text-[#BAF084] font-mono text-[11px] overflow-x-auto leading-relaxed border border-[#54825A]">
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
                  <p className="text-[11px] text-[#EF4444] font-semibold">
                    ✕ VIOLATION: Current blast radius score is 87/100, exceeding the 30/100 automated clearance limit.
                  </p>
                </div>

                {/* Remediation Strategy */}
                <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#BCE99A] flex flex-col gap-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-black text-[#1E4726]">
                    <Terminal className="w-4 h-4 text-[#15803D]" />
                    <span>Recommended Safe Migration Plan</span>
                  </div>
                  <div className="space-y-2 text-xs text-[#54825A]">
                    <div className="p-2.5 rounded-xl bg-[#F4FDEE] border border-[#BCE99A] flex items-start gap-2">
                      <span className="font-black text-[#1E4726]">1.</span>
                      <span>Drain ENI traffic from subnet-07 to subnet-08 in AZ-2.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F4FDEE] border border-[#BCE99A] flex items-start gap-2">
                      <span className="font-black text-[#1E4726]">2.</span>
                      <span>Verify Payment API health check status on secondary subnet.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F4FDEE] border border-[#BCE99A] flex items-start gap-2">
                      <span className="font-black text-[#1E4726]">3.</span>
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
          <div className="flex items-center justify-between border-t border-[#BCE99A]/60 pt-3">
            <span className="text-[11px] text-[#54825A] font-medium">
              BlastGuard Autonomous Safety System • Real-Time Engine
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#DCF8C6] hover:bg-[#D4F7B2] border border-[#BCE99A] text-xs font-bold text-[#1E4726] transition-colors shadow-xs cursor-pointer"
              >
                Close Studio
              </button>
              <button
                onClick={() => {
                  alert(`Audit report for ${request.title} exported as PDF.`);
                }}
                className="px-4 py-2 rounded-xl bg-[#BAF084] hover:bg-[#A8EB6C] text-xs font-black text-[#1E4726] transition-colors shadow-xs cursor-pointer border border-[#8CD94B]"
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
