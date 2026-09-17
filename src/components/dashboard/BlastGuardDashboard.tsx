import React, { useState } from 'react';
import { useScrollProgress } from '../../context/ScrollContext';
import { CHANGE_REQUESTS_LIST, AGENT_PIPELINE, INFRA_NODES, STATS } from '../../data/mockData';
import { ChangeRequestItem } from '../../types';
import { SpatialInfrastructureGraph } from '../overlay/SpatialInfrastructureGraph';
import { AuditReportModal } from '../ui/AuditReportModal';
import {
  ArrowLeft,
  Search,
  Filter,
  ShieldAlert,
  ShieldX,
  ShieldCheck,
  AlertTriangle,
  Server,
  Network,
  Activity,
  CheckCircle2,
  Clock,
  ChevronRight,
  Download,
  Terminal,
  Layers,
  Database,
  Globe,
  Radio,
  RefreshCw,
  FileText,
  Trash2,
  Lock
} from 'lucide-react';

export const BlastGuardDashboard: React.FC = () => {
  const { closeDashboard } = useScrollProgress();
  const [selectedTicketId, setSelectedTicketId] = useState<string>('cr-8842');
  const [filterType, setFilterType] = useState<'ALL' | 'PRODUCTION' | 'CRITICAL' | 'BLOCKED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [actionConfirmed, setActionConfirmed] = useState(false);

  const selectedTicket: ChangeRequestItem =
    CHANGE_REQUESTS_LIST.find((t) => t.id === selectedTicketId) || CHANGE_REQUESTS_LIST[0];

  const filteredTickets = CHANGE_REQUESTS_LIST.filter((ticket) => {
    const matchesSearch =
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'PRODUCTION') return ticket.environment === 'PRODUCTION';
    if (filterType === 'CRITICAL') return ticket.riskLevel === 'CRITICAL';
    if (filterType === 'BLOCKED') return ticket.status === 'BLOCKED';
    return true;
  });

  const handleSimulate = () => {
    setIsSimulating(true);
    setActionConfirmed(false);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Enterprise Command Center Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={closeDashboard}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>CINEMATIC VIEW</span>
          </button>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.2em] text-white">
              BLASTGUARD
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-semibold uppercase">
              COMMAND CENTER
            </span>
          </div>
        </div>

        {/* Live System Telemetry Badges */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono text-slate-400">
          <div className="hidden md:flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AWS ap-south-1 (Live Twin)</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cedar Policy Engine v3.2 Active</span>
          </div>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-mono transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-orange-400' : ''}`} />
            <span>{isSimulating ? 'Evaluating Graph...' : 'Re-evaluate'}</span>
          </button>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden min-h-[calc(100vh-57px)]">
        {/* ========================================================================= */}
        {/* COLUMN 1: Change Requests (Cols 1-3) */}
        {/* ========================================================================= */}
        <section className="lg:col-span-3 border-r border-white/10 bg-slate-950/40 p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-57px)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-white">
                CHANGE REQUESTS
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filteredTickets.length} active
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search resource, ID, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-white/5 text-[10px] font-mono">
            {(['ALL', 'PRODUCTION', 'CRITICAL', 'BLOCKED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  filterType === f
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Ticket list cards */}
          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {filteredTickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicket.id;
              const isCritical = ticket.riskLevel === 'CRITICAL';
              return (
                <button
                  key={ticket.id}
                  onClick={() => {
                    setSelectedTicketId(ticket.id);
                    setActionConfirmed(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 group relative ${
                    isSelected
                      ? 'bg-slate-900/95 border-orange-500/60 shadow-lg shadow-orange-950/20 ring-1 ring-orange-500/30'
                      : 'bg-slate-900/40 hover:bg-slate-900/70 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-white group-hover:text-orange-300 transition-colors">
                      {ticket.ticketId}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase ${
                        ticket.status === 'BLOCKED'
                          ? 'bg-red-500/15 border-red-500/30 text-red-300'
                          : ticket.status === 'APPROVED'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono font-semibold uppercase ${
                        ticket.action === 'DELETE'
                          ? 'text-red-400'
                          : ticket.action === 'MODIFY'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {ticket.action}
                    </span>
                    <span className="text-xs font-mono text-slate-200 font-medium truncate">
                      {ticket.target}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-white/5">
                    <span>{ticket.requestedBy}</span>
                    <span
                      className={`font-semibold ${
                        isCritical ? 'text-red-400' : 'text-slate-300'
                      }`}
                    >
                      Risk: {ticket.riskScore}/100
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* COLUMN 2: Selected Change Request & Digital Twin Topology (Cols 4-8) */}
        {/* ========================================================================= */}
        <section className="lg:col-span-5 border-r border-white/10 bg-slate-950/20 p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-57px)]">
          {/* Selected Ticket Meta Header */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-mono font-bold text-white">
                    {selectedTicket.ticketId} · {selectedTicket.target}
                  </h1>
                  <p className="text-xs font-mono text-slate-400">
                    Resource: <code className="text-orange-300">{selectedTicket.resourceType}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-white/10 text-slate-300">
                  {selectedTicket.region}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 font-bold">
                  {selectedTicket.environment}
                </span>
              </div>
            </div>

            {/* Subnet / VPC Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">VPC ID</span>
                <span className="text-white font-medium">{selectedTicket.vpc}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">CIDR Block</span>
                <span className="text-white font-medium">{selectedTicket.cidr || 'N/A'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Author</span>
                <span className="text-slate-200 truncate block">{selectedTicket.requestedBy}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Timeline</span>
                <span className="text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {selectedTicket.requestedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Autonomous Multi-Agent Pipeline Stepper */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                AUTONOMOUS MULTI-AGENT ANALYSIS PIPELINE
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                7 / 7 agents resolved
              </span>
            </div>

            <div className="space-y-2">
              {AGENT_PIPELINE.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-white font-bold tracking-wide mr-2">
                        {step.name}
                      </span>
                      <span className="text-slate-400 text-[11px] hidden sm:inline">
                        {step.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 text-[11px] text-right hidden md:inline">
                      {step.detail}
                    </span>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Spatial Infrastructure Digital Twin Graph */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold flex items-center gap-2">
                <Network className="w-3.5 h-3.5 text-orange-400" />
                VPC TOPOLOGY DIGITAL TWIN
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Live simulation
              </span>
            </div>

            <SpatialInfrastructureGraph isSimulation={true} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* COLUMN 3: Decision / Blast Radius Impact & Governance (Cols 9-12) */}
        {/* ========================================================================= */}
        <section className="lg:col-span-4 bg-slate-950/60 p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-57px)]">
          {/* Decision Status Box */}
          <div
            className={`p-6 rounded-3xl border shadow-2xl space-y-5 transition-all duration-300 ${
              selectedTicket.status === 'BLOCKED'
                ? 'bg-red-950/20 border-red-500/40 shadow-red-950/20'
                : 'bg-emerald-950/20 border-emerald-500/40 shadow-emerald-950/20'
            }`}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedTicket.status === 'BLOCKED' ? (
                  <ShieldX className="w-6 h-6 text-red-400" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                )}
                <span className="text-xs font-mono tracking-[0.25em] uppercase text-slate-300 font-bold">
                  SAFETY GATE DECISION
                </span>
              </div>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-bold">
                {selectedTicket.status}
              </span>
            </div>

            {/* Big Risk Dial Score */}
            <div className="flex items-baseline justify-between border-y border-white/10 py-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Blast-Radius Risk Score
                </span>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-5xl sm:text-6xl font-extralight tracking-tighter ${
                      selectedTicket.riskScore > 75
                        ? 'text-red-500'
                        : selectedTicket.riskScore > 40
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {selectedTicket.riskScore}
                  </span>
                  <span className="text-slate-400 font-mono text-sm">/ 100</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Risk Level
                </span>
                <span
                  className={`text-sm font-mono font-bold uppercase px-2.5 py-1 rounded-lg border ${
                    selectedTicket.riskLevel === 'CRITICAL'
                      ? 'bg-red-500/20 border-red-500/40 text-red-400'
                      : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  }`}
                >
                  {selectedTicket.riskLevel}
                </span>
              </div>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Direct Services</span>
                <span className="text-lg font-bold text-red-400">
                  {selectedTicket.directImpactCount} components
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Indirect Services</span>
                <span className="text-lg font-bold text-amber-400">
                  {selectedTicket.indirectImpactCount} components
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase block">Production Traffic At Risk</span>
                <span className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-400" />
                  {selectedTicket.trafficAtRisk}
                </span>
              </div>
            </div>

            {/* Reason explanation */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1 text-xs font-mono text-slate-300">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                BlastGuard Autonomous Evaluation:
              </span>
              <p className="leading-relaxed">{selectedTicket.reason}</p>
            </div>

            {/* Cedar Policy Verification */}
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-[11px]">
                <Lock className="w-3.5 h-3.5" />
                <span>Cedar Policy Check: VIOLATION</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Policy <code className="text-red-300">PRODUCTION_CHANGE_REQUIRES_APPROVAL</code> evaluated to <strong>FAIL</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setActionConfirmed(true)}
                className={`w-full py-3.5 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                  actionConfirmed
                    ? 'bg-red-700 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50'
                }`}
              >
                <ShieldX className="w-4 h-4" />
                <span>
                  {actionConfirmed ? 'SAFETY BARRIER ACTIVE: BLOCKED' : 'ENFORCE BLOCK CHANGE'}
                </span>
              </button>

              <button
                onClick={() => setShowAuditModal(true)}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-200 font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-orange-400" />
                <span>VIEW FULL AUDIT REPORT</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Audit Report Modal */}
      <AuditReportModal isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} />
    </div>
  );
};
