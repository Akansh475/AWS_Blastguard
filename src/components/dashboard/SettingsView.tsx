import React, { useState } from 'react';
import { Settings, Shield, Bell, Key, Server, Check, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [strictMode, setStrictMode] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(80);
  const [requireArchitectSignoff, setRequireArchitectSignoff] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 w-full select-none max-w-4xl mx-auto font-sans">
      {/* 1. Header */}
      <div className="bg-[#FFFFFF] border border-[#EFE8DF] rounded-3xl p-6 flex items-center justify-between gap-4 shadow-sm shadow-[rgba(180,160,140,0.06)]">
        <div>
          <h2 className="text-lg font-black text-[#18181B] tracking-tight">Safety Engine & Governance Settings</h2>
          <p className="text-xs text-[#71717A]">Configure AWS live inspection, Cedar policy rules, and alerting channels.</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF7A30] hover:bg-[#E86518] text-white text-xs font-black transition-all shadow-xs cursor-pointer"
        >
          {saved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Save className="w-3.5 h-3.5 stroke-[2.5]" />}
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* 2. AWS Connections & Digital Twin */}
      <div className="bg-[#FFFFFF] border border-[#EFE8DF] rounded-3xl p-6 flex flex-col gap-4 shadow-sm shadow-[rgba(180,160,140,0.06)]">
        <div className="flex items-center gap-2.5">
          <Server className="w-4 h-4 text-[#FF7A30]" />
          <h3 className="text-sm font-black text-[#18181B] tracking-tight">AWS Cloud Environment & Digital Twin</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">Active AWS Accounts & Regions</div>
              <div className="text-[11px] text-[#71717A]">ap-south-1 (Production Primary) • us-east-1 (Failover Replica)</div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] font-bold text-[10px] shadow-2xs">
              LIVE SYNC
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">Cross-Account IAM Inspector Role</div>
              <div className="font-mono text-[11px] text-[#71717A]">arn:aws:iam::894129481928:role/CloudGuardInspector</div>
            </div>
            <span className="text-xs text-[#16A34A] font-bold">Verified ✓</span>
          </div>
        </div>
      </div>

      {/* 3. Cedar Policy & Risk Thresholds */}
      <div className="bg-[#FFFFFF] border border-[#EFE8DF] rounded-3xl p-6 flex flex-col gap-4 shadow-sm shadow-[rgba(180,160,140,0.06)]">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#EF4444]" />
          <h3 className="text-sm font-black text-[#18181B] tracking-tight">Cedar Policy Engine & Risk Gates</h3>
        </div>

        <div className="space-y-3 text-xs">
          {/* Strict Mode Toggle */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">Strict Production Safety Barrier</div>
              <div className="text-[11px] text-[#71717A]">Automatically block changes that violate Cedar perimeter policies.</div>
            </div>
            <button
              onClick={() => setStrictMode(!strictMode)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                strictMode ? 'bg-[#FF7A30]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                strictMode ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Risk Threshold Slider */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-[#18181B]">Auto-Block Risk Score Threshold</div>
                <div className="text-[11px] text-[#71717A]">Changes scoring at or above this value trigger an immediate hard block.</div>
              </div>
              <span className="text-sm font-black text-[#EF4444] px-2.5 py-0.5 rounded-lg bg-[#FFFFFF] border border-[#FECDD3] shadow-2xs">{riskThreshold} / 100</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
              className="w-full accent-[#FF7A30] cursor-pointer"
            />
          </div>

          {/* Senior Architect Signoff Toggle */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">Require Senior Cloud Architect Approval</div>
              <div className="text-[11px] text-[#71717A]">Mandate dual cryptographic sign-off for Subnet and Core IAM deletions.</div>
            </div>
            <button
              onClick={() => setRequireArchitectSignoff(!requireArchitectSignoff)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                requireArchitectSignoff ? 'bg-[#FF7A30]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                requireArchitectSignoff ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Alerting Channels */}
      <div className="bg-[#FFFFFF] border border-[#EFE8DF] rounded-3xl p-6 flex flex-col gap-4 shadow-sm shadow-[rgba(180,160,140,0.06)]">
        <div className="flex items-center gap-2.5">
          <Bell className="w-4 h-4 text-[#FF7A30]" />
          <h3 className="text-sm font-black text-[#18181B] tracking-tight">Alert Notifications & Webhooks</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">Slack Incident Dispatcher</div>
              <div className="text-[11px] text-[#71717A]">Channel: #aws-production-safety • Real-time gate blocks</div>
            </div>
            <button
              onClick={() => setSlackAlerts(!slackAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                slackAlerts ? 'bg-[#FF7A30]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                slackAlerts ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DF] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">PagerDuty High-Urgency Escalation</div>
              <div className="font-mono text-[11px] text-[#71717A]">Integration Key: pd-service-cloudguard-safety</div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] font-bold text-[10px] shadow-2xs">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
