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
    <div className="flex flex-col gap-5 w-full select-none max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="glass-panel p-6 flex items-center justify-between gap-4 shadow-[0_8px_30px_rgba(210,180,110,0.12)]">
        <div>
          <h2 className="text-lg font-bold text-[#18181B]">Safety Engine & Governance Settings</h2>
          <p className="text-xs text-[#71717A]">Configure AWS live inspection, Cedar policy rules, and alerting channels.</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F89C26] hover:bg-[#E88B0E] text-[#18181B] text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* 2. AWS Connections & Digital Twin */}
      <div className="glass-panel p-6 flex flex-col gap-4 shadow-[0_8px_30px_rgba(210,180,110,0.12)]">
        <div className="flex items-center gap-2.5">
          <Server className="w-4 h-4 text-[#F89C26]" />
          <h3 className="text-sm font-bold text-[#18181B]">AWS Cloud Environment & Digital Twin</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl glass-item flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">Active AWS Accounts & Regions</div>
              <div className="text-[11px] text-[#71717A]">ap-south-1 (Production Primary) • us-east-1 (Failover Replica)</div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5]/90 text-[#16A34A] border border-[#BBF7D0] font-bold text-[10px] backdrop-blur-md shadow-xs">
              LIVE SYNC
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-item flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">Cross-Account IAM Inspector Role</div>
              <div className="font-mono text-[11px] text-[#52525B]">arn:aws:iam::894129481928:role/BlastGuardInspector</div>
            </div>
            <span className="text-xs text-[#71717A] font-semibold">Verified ✓</span>
          </div>
        </div>
      </div>

      {/* 3. Cedar Policy & Risk Thresholds */}
      <div className="glass-panel p-6 flex flex-col gap-4 shadow-[0_8px_30px_rgba(210,180,110,0.12)]">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#E03131]" />
          <h3 className="text-sm font-bold text-[#18181B]">Cedar Policy Engine & Risk Gates</h3>
        </div>

        <div className="space-y-3 text-xs">
          {/* Strict Mode Toggle */}
          <div className="p-4 rounded-2xl glass-item flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">Strict Production Safety Barrier</div>
              <div className="text-[11px] text-[#71717A]">Automatically block changes that violate Cedar perimeter policies.</div>
            </div>
            <button
              onClick={() => setStrictMode(!strictMode)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                strictMode ? 'bg-[#F89C26]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                strictMode ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Risk Threshold Slider */}
          <div className="p-4 rounded-2xl glass-item flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-[#18181B]">Auto-Block Risk Score Threshold</div>
                <div className="text-[11px] text-[#71717A]">Changes scoring at or above this value trigger an immediate hard block.</div>
              </div>
              <span className="text-sm font-black text-[#E03131] px-2 py-0.5 rounded-lg bg-white/70 border border-white/80 backdrop-blur-md">{riskThreshold} / 100</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
              className="w-full accent-[#F89C26] cursor-pointer"
            />
          </div>

          {/* Senior Architect Signoff Toggle */}
          <div className="p-4 rounded-2xl glass-item flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">Require Senior Cloud Architect Approval</div>
              <div className="text-[11px] text-[#71717A]">Mandate dual cryptographic sign-off for Subnet and Core IAM deletions.</div>
            </div>
            <button
              onClick={() => setRequireArchitectSignoff(!requireArchitectSignoff)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                requireArchitectSignoff ? 'bg-[#F89C26]' : 'bg-[#D1D5DB]'
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
      <div className="glass-panel p-6 flex flex-col gap-4 shadow-[0_8px_30px_rgba(210,180,110,0.12)]">
        <div className="flex items-center gap-2.5">
          <Bell className="w-4 h-4 text-[#F89C26]" />
          <h3 className="text-sm font-bold text-[#18181B]">Alert Notifications & Webhooks</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl glass-item flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">Slack Incident Dispatcher</div>
              <div className="text-[11px] text-[#71717A]">Channel: #aws-production-safety • Real-time gate blocks</div>
            </div>
            <button
              onClick={() => setSlackAlerts(!slackAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                slackAlerts ? 'bg-[#F89C26]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                slackAlerts ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="p-4 rounded-2xl glass-item flex items-center justify-between">
            <div>
              <div className="font-bold text-[#18181B]">PagerDuty High-Urgency Escalation</div>
              <div className="font-mono text-[11px] text-[#52525B]">Integration Key: pd-service-blastguard-safety</div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5]/90 text-[#16A34A] border border-[#BBF7D0] font-bold text-[10px] backdrop-blur-md shadow-xs">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
