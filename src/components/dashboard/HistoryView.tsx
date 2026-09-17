import React, { useState } from 'react';
import { History, ShieldCheck, ShieldAlert, ArrowUpRight, Search, Download, Calendar, Filter } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Blocked' | 'Approved' | 'RolledBack'>('All');
  const [search, setSearch] = useState('');

  const historyItems = [
    {
      id: 'cr-8842',
      ticket: 'CR-8842',
      title: 'Delete subnet-07 (Prod-Network)',
      target: 'subnet-07',
      env: 'Production',
      region: 'ap-south-1',
      action: 'DELETE',
      author: 'alex.k (Cloud Platform)',
      time: '14 minutes ago',
      decision: 'BLOCKED',
      riskScore: 87,
      impact: '11 affected services, 3 critical',
      policy: 'PRODUCTION_CHANGE_REQUIRES_APPROVAL'
    },
    {
      id: 'cr-8841',
      ticket: 'CR-8841',
      title: 'Scale ECS worker cluster to 16 replicas',
      target: 'ecs-payment-workers',
      env: 'Staging',
      region: 'ap-south-1',
      action: 'SCALE',
      author: 'ci-cd-pipeline',
      time: '1 hour ago',
      decision: 'APPROVED',
      riskScore: 22,
      impact: '0 downtime, capacity +50%',
      policy: 'STANDARD_AUTOSCALE_POLICY'
    },
    {
      id: 'cr-8840',
      ticket: 'CR-8840',
      title: 'Modify security group ingress port 5432',
      target: 'sg-aurora-db',
      env: 'Production',
      region: 'ap-south-1',
      action: 'MODIFY',
      author: 'devops-bot',
      time: '3 hours ago',
      decision: 'BLOCKED',
      riskScore: 94,
      impact: 'Database exposed to 0.0.0.0/0',
      policy: 'PERIMETER_INGRESS_ISOLATION'
    },
    {
      id: 'cr-8839',
      ticket: 'CR-8839',
      title: 'Rotate KMS root master key',
      target: 'kms-prod-master',
      env: 'Production',
      region: 'ap-south-1',
      action: 'ROTATE',
      author: 'sec-ops-lead',
      time: '6 hours ago',
      decision: 'APPROVED',
      riskScore: 18,
      impact: 'Non-disruptive key alias repoint',
      policy: 'SECURITY_AUTOMATION_COMPLIANT'
    },
    {
      id: 'cr-8838',
      ticket: 'CR-8838',
      title: 'Terminate canary instance i-09f4b1e84a',
      target: 'i-09f4b1e84a',
      env: 'Production',
      region: 'us-east-1',
      action: 'TERMINATE',
      author: 'alex.k',
      time: '12 hours ago',
      decision: 'APPROVED',
      riskScore: 12,
      impact: 'Traffic successfully drained',
      policy: 'CANARY_DRAIN_POLICY'
    },
    {
      id: 'cr-8837',
      ticket: 'CR-8837',
      title: 'Delete DynamoDB backup table orders-2025',
      target: 'dynamodb-orders-2025',
      env: 'Production',
      region: 'ap-south-1',
      action: 'DELETE',
      author: 'data-eng-bot',
      time: '1 day ago',
      decision: 'BLOCKED',
      riskScore: 89,
      impact: 'Compliance lock active until 2027',
      policy: 'COMPLIANCE_RETENTION_LOCK'
    }
  ];

  const filtered = historyItems.filter((item) => {
    const matches =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.ticket.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase());
    if (!matches) return false;
    if (filter === 'Blocked') return item.decision === 'BLOCKED';
    if (filter === 'Approved') return item.decision === 'APPROVED';
    return true;
  });

  return (
    <div className="flex flex-col gap-5 w-full select-none">
      {/* 1. Header & Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-[#71717A]">TOTAL EVALUATED</span>
          <span className="text-2xl font-black text-[#18181B]">142</span>
          <span className="text-[10px] text-[#16A34A] font-bold">100% Analyzed in &lt;500ms</span>
        </div>
        <div className="glass-card p-4 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-[#71717A]">OUTAGES PREVENTED</span>
          <span className="text-2xl font-black text-[#E03131]">29</span>
          <span className="text-[10px] text-[#E03131] font-bold">High Blast Radius Blocked</span>
        </div>
        <div className="glass-card p-4 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-[#71717A]">SAFE CHANGES APPROVED</span>
          <span className="text-2xl font-black text-[#16A34A]">113</span>
          <span className="text-[10px] text-[#16A34A] font-bold">Zero Production Regressions</span>
        </div>
        <div className="glass-card p-4 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-[#71717A]">CEDAR POLICY COMPLIANCE</span>
          <span className="text-2xl font-black text-[#18181B]">100%</span>
          <span className="text-[10px] text-[#F89C26] font-bold">Autonomous Governance</span>
        </div>
      </div>

      {/* 2. History List Panel */}
      <div className="glass-panel p-6 flex flex-col gap-4 shadow-[0_8px_30px_rgba(210,180,110,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#18181B]">Audit Trail & Change History</h2>
            <p className="text-xs text-[#71717A]">Chronological record of automated blast radius safety checks.</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center p-1 rounded-full bg-white/50 backdrop-blur-md border border-white/70 text-xs font-semibold shadow-xs">
              {(['All', 'Blocked', 'Approved'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                    filter === tab ? 'bg-[#18181B] text-white shadow-md' : 'text-[#52525B] hover:text-[#18181B]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Export CSV */}
            <button
              onClick={() => alert('Audit log exported as CSV.')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/60 hover:bg-white/90 border border-white/80 text-xs font-semibold text-[#18181B] transition-all backdrop-blur-md shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex flex-col gap-2.5 pt-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl glass-item transition-all flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                  item.decision === 'BLOCKED' ? 'bg-[#FFECEC]/90 text-[#E03131] border border-[#FCD5CF]' : 'bg-[#ECFDF5]/90 text-[#16A34A] border border-[#BBF7D0]'
                }`}>
                  {item.decision === 'BLOCKED' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#18181B]">{item.ticket}</span>
                    <span className="text-[11px] text-[#71717A]">• {item.time}</span>
                    <span className="text-[11px] text-[#71717A]">• {item.author}</span>
                  </div>
                  <div className="text-xs font-bold text-[#18181B] mt-0.5">{item.title}</div>
                  <div className="text-[11px] text-[#71717A] mt-0.5">{item.impact}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#18181B]">Risk: {item.riskScore}/100</div>
                  <div className="text-[10px] text-[#71717A]">{item.region} • {item.env}</div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs ${
                  item.decision === 'BLOCKED'
                    ? 'bg-[#FFECEC]/90 text-[#E03131] border border-[#FCD5CF]'
                    : 'bg-[#ECFDF5]/90 text-[#16A34A] border border-[#BBF7D0]'
                }`}>
                  {item.decision}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
