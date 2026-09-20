import React, { useState } from 'react';
import {
  CheckCircle,
  Lightbulb,
  Sparkles,
  Bot,
  ShieldAlert,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';

interface AIExplanationCardProps {
  request: DashboardChangeRequest;
  onOpenChatbot?: () => void;
}

export const AIExplanationCard: React.FC<AIExplanationCardProps> = ({
  request,
  onOpenChatbot,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'security' | 'policies' | 'recommendations'>('summary');

  // 6 AI Agents execution data
  const agents = [
    { name: 'Supervisor Agent', desc: 'Orchestrating analysis...', time: '2.1s' },
    { name: 'Dependency Agent', desc: `Found ${request.affectedResources} related resources`, time: '3.4s' },
    { name: 'Topology Agent', desc: 'Mapped network relationships', time: '2.8s' },
    { name: 'Security Agent', desc: 'Detected 2 security concerns', time: '1.9s' },
    { name: 'Policy Agent', desc: 'Found 1 policy violation', time: '1.2s' },
    { name: 'Impact Agent', desc: 'Calculated blast radius...', time: '1.0s' },
  ];

  // Recent Activity events
  const activities = [
    { title: 'Analysis completed', time: '12.4s ago', status: 'done' },
    { title: 'Impact calculation finished', time: '13.1s ago', status: 'done' },
    { title: 'Policy check completed', time: '14.3s ago', status: 'done' },
    { title: 'Security analysis completed', time: '16.2s ago', status: 'done' },
    { title: 'Dependency mapping completed', time: '18.5s ago', status: 'done' },
    { title: 'Analysis started', time: '20.1s ago', status: 'start' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full font-sans select-none">
      {/* ========================================================================= */}
      {/* CARD 1: AI AGENT EXECUTION (Cols 1-4) */}
      {/* ========================================================================= */}
      <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#EFE8DF] rounded-3xl p-5 shadow-sm shadow-[rgba(180,160,140,0.06)] flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#18181B] tracking-tight">
              AI Agent Execution
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-[10px] font-bold">
              Completed in 12.4s
            </span>
          </div>

          {/* Agents List */}
          <div className="space-y-2.5 mt-1">
            {agents.map((agent, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 fill-[#16A34A] text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#18181B] truncate leading-tight">
                      {agent.name}
                    </div>
                    <div className="text-[10px] text-[#71717A] truncate leading-tight">
                      {agent.desc}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#16A34A] shrink-0">
                  {agent.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: AGENT INSIGHTS (Cols 5-8) */}
      {/* ========================================================================= */}
      <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#EFE8DF] rounded-3xl p-5 shadow-sm shadow-[rgba(180,160,140,0.06)] flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          {/* Header + Tabs */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-[#18181B] tracking-tight">
                Agent Insights
              </h3>
            </div>

            {/* Insight Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'summary'
                    ? 'bg-[#FFF4EB] text-[#FF7A30] border border-[#FED7AA]'
                    : 'text-[#71717A] hover:text-[#18181B] bg-transparent'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-[#FFF4EB] text-[#FF7A30] border border-[#FED7AA]'
                    : 'text-[#71717A] hover:text-[#18181B] bg-transparent'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('policies')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'policies'
                    ? 'bg-[#FFF4EB] text-[#FF7A30] border border-[#FED7AA]'
                    : 'text-[#71717A] hover:text-[#18181B] bg-transparent'
                }`}
              >
                Policies
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'recommendations'
                    ? 'bg-[#FFF4EB] text-[#FF7A30] border border-[#FED7AA]'
                    : 'text-[#71717A] hover:text-[#18181B] bg-transparent'
                }`}
              >
                Recommendations
              </button>
            </div>
          </div>

          {/* AI Analysis Summary */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-[#FAF5FF] border border-[#E9D5FF] text-[#9333EA] flex items-center justify-center text-[10px] font-black">
                Ai
              </div>
              <span className="text-xs font-bold text-[#18181B]">
                AI Analysis Summary
              </span>
            </div>

            <p className="text-[11px] text-[#52525B] leading-relaxed">
              {activeTab === 'summary' &&
                `Deleting ${request.resourceName} will directly impact ${request.criticalServices} critical services including the Payment API, which handles 2.4M requests per hour. This change will also affect the primary RDS database and violate production change policies. The blast radius extends to ${request.affectedResources} resources across multiple service tiers, with a high risk of customer-facing downtime.`}
              {activeTab === 'security' &&
                `Active Elastic Network Interfaces (ENIs) are bound to ${request.resourceName}. Deletion will instantly severed private communication channels between Payment DB and Payment API.`}
              {activeTab === 'policies' &&
                `Violates POLICY-002: Production VPC subnets with active database dependencies cannot be destroyed via automated pipelines without Senior Staff approval.`}
              {activeTab === 'recommendations' &&
                `1. Provision replacement subnet in secondary AZ. 2. Migrate RDS read replicas. 3. Update route tables before deleting ${request.resourceName}.`}
            </p>
          </div>
        </div>

        {/* Tip Box (Yellow / Amber) */}
        <div className="p-2.5 rounded-2xl bg-[#FFFBEB] border border-[#FEF3C7] flex items-start gap-2 mt-3">
          <Lightbulb className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <span className="text-[10.5px] text-[#92400E] leading-tight font-medium">
            Consider creating a new subnet and migrating services before decommissioning this subnet.
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 3: RECENT ACTIVITY (Cols 9-12) */}
      {/* ========================================================================= */}
      <div className="lg:col-span-3 bg-[#FFFFFF] border border-[#EFE8DF] rounded-3xl p-5 shadow-sm shadow-[rgba(180,160,140,0.06)] flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#18181B] tracking-tight">
              Recent Activity
            </h3>
            <button className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer">
              View All
            </button>
          </div>

          {/* Timeline List */}
          <div className="space-y-3 mt-1">
            {activities.map((act, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {act.status === 'done' ? (
                    <div className="w-4 h-4 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 fill-[#16A34A] text-white" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    </div>
                  )}
                  <span className="text-xs font-bold text-[#18181B] truncate">
                    {act.title}
                  </span>
                </div>
                <span className="text-[10px] text-[#71717A] shrink-0 font-medium">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIExplanationCard;
