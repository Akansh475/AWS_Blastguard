import React from 'react';
import { useScrollProgress } from '../../context/ScrollContext';
import { segmentInOut, smoothstep } from '../../utils/math';
import { Network, Server, Database, Globe, ShieldAlert, Cpu, AlertTriangle } from 'lucide-react';

interface Props {
  isSimulation?: boolean;
}

export const SpatialInfrastructureGraph: React.FC<Props> = ({ isSimulation = false }) => {
  const { smoothProgress } = useScrollProgress();

  // Active during Workspace (0.32 - 0.54) or Simulation (0.72 - 0.85)
  const isSim = isSimulation || (smoothProgress >= 0.72 && smoothProgress <= 0.85);
  const isDepTrace = smoothProgress >= 0.40 && smoothProgress <= 0.54;

  const simWave = smoothstep(0.73, 0.84, smoothProgress);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 glass-panel rounded-2xl shadow-2xl border-white/15 relative overflow-hidden backdrop-blur-xl">
      {/* Top VPC Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-white tracking-wider">
            VPC us-east-1 (Production Digital Twin)
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          {isSim ? (
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold animate-pulse">
              ⚠ RISK PROPAGATION ACTIVE
            </span>
          ) : isDepTrace ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
              CRITICAL TRACE: SUBNET-07
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              ● 42 DEPENDENCIES LIVE
            </span>
          )}
        </div>
      </div>

      {/* Gateway / ALB Node */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/10 font-mono text-xs">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="font-bold">Internet Gateway / ALB</span>
          <span className="text-slate-500">•</span>
          <span className="text-[10px] text-slate-300">5.2M req/day</span>
        </div>
      </div>

      {/* Availability Zones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative">
        {/* Connection Beam SVG Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-current z-0">
          {/* Gateway to services */}
          <line
            x1="50%"
            y1="0"
            x2="25%"
            y2="40%"
            stroke={isSim ? '#ef4444' : isDepTrace ? '#f59e0b' : '#38bdf8'}
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
          <line
            x1="50%"
            y1="0"
            x2="75%"
            y2="40%"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          {/* Subnet to service lines */}
          <line
            x1="25%"
            y1="22%"
            x2="25%"
            y2="55%"
            stroke={isSim ? '#ef4444' : isDepTrace ? '#f59e0b' : '#38bdf8'}
            strokeWidth={isSim || isDepTrace ? '3' : '1.5'}
          />
          <line
            x1="75%"
            y1="22%"
            x2="75%"
            y2="55%"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Service to Database lines */}
          <line
            x1="25%"
            y1="65%"
            x2="25%"
            y2="90%"
            stroke={isSim ? '#ef4444' : isDepTrace ? '#f59e0b' : '#38bdf8'}
            strokeWidth={isSim || isDepTrace ? '3' : '1.5'}
          />
          <line
            x1="75%"
            y1="65%"
            x2="75%"
            y2="90%"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>

        {/* ================= ZONE A ================= */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 relative z-10 space-y-4 ${
            isSim
              ? 'bg-red-950/40 border-red-500/50 shadow-lg shadow-red-500/10'
              : isDepTrace
              ? 'bg-amber-950/30 border-amber-500/40'
              : 'bg-slate-900/60 border-white/10'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1 border-b border-white/5">
            <span className="font-bold text-slate-200">us-east-1a (Zone A)</span>
            <span className={isSim ? 'text-red-400 font-bold' : isDepTrace ? 'text-amber-400 font-bold' : 'text-slate-400'}>
              {isSim ? 'CASCADE FAILURE' : isDepTrace ? 'ORIGIN OF CHANGE' : 'Healthy'}
            </span>
          </div>

          {/* Subnet-07 Card */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              isSim
                ? 'bg-red-900/40 border-red-500 text-white shadow-md shadow-red-500/20'
                : isDepTrace
                ? 'bg-amber-900/30 border-amber-500 text-amber-200'
                : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Network className={`w-4 h-4 ${isSim ? 'text-red-400' : isDepTrace ? 'text-amber-400' : 'text-cyan-400'}`} />
              <div>
                <div className="font-mono font-bold text-xs">Subnet-07 (Prod)</div>
                <div className="text-[10px] text-slate-400">CIDR 10.0.1.0/24</div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isSim
                  ? 'bg-red-500/30 text-red-300 border border-red-400 animate-pulse'
                  : isDepTrace
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-cyan-500/20 text-cyan-300'
              }`}
            >
              {isSim ? 'DELETE TARGET' : 'Core Network'}
            </span>
          </div>

          {/* Payment API Node */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              isSim
                ? 'bg-red-900/50 border-red-500/80 text-white'
                : isDepTrace
                ? 'bg-amber-900/40 border-amber-500/70 text-white'
                : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Server className={`w-4 h-4 ${isSim ? 'text-red-400' : isDepTrace ? 'text-amber-400' : 'text-blue-400'}`} />
              <div>
                <div className="font-mono font-bold text-xs">Payment API</div>
                <div className="text-[10px] text-slate-300">2.4M req/hr • 184ms P99</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
              REVENUE CRITICAL
            </span>
          </div>

          {/* Payment Database Node */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              isSim
                ? 'bg-red-950/60 border-red-500/60 text-white'
                : isDepTrace
                ? 'bg-amber-950/40 border-amber-500/50 text-white'
                : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Database className={`w-4 h-4 ${isSim ? 'text-red-400' : isDepTrace ? 'text-amber-400' : 'text-purple-400'}`} />
              <div>
                <div className="font-mono font-bold text-xs">Payment DB (Aurora PG)</div>
                <div className="text-[10px] text-slate-400">Encrypted KMS • Multi-AZ</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
              {isSim ? 'OUTAGE RISK' : 'Tier-1 DB'}
            </span>
          </div>
        </div>

        {/* ================= ZONE B ================= */}
        <div className="p-4 rounded-xl border bg-slate-900/60 border-white/10 relative z-10 space-y-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1 border-b border-white/5">
            <span className="font-bold text-slate-200">us-east-1b (Zone B)</span>
            <span className="text-slate-400">Secondary Path</span>
          </div>

          {/* Subnet-12 */}
          <div className="p-3 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <Network className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="font-mono font-bold text-xs">Subnet-12 (App)</div>
                <div className="text-[10px] text-slate-400">CIDR 10.0.2.0/24</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white/5">
              App Tier
            </span>
          </div>

          {/* Order Service Node */}
          <div className="p-3 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              <div>
                <div className="font-mono font-bold text-xs">Order Service</div>
                <div className="text-[10px] text-slate-400">1.8M req/hr</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-white/5">
              Tier-1 Service
            </span>
          </div>

          {/* Orders Database Node */}
          <div className="p-3 rounded-xl border bg-white/5 border-white/10 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-purple-400" />
              <div>
                <div className="font-mono font-bold text-xs">Orders DB (DynamoDB)</div>
                <div className="text-[10px] text-slate-400">Global Table Active</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white/5">
              Sync Attached
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
