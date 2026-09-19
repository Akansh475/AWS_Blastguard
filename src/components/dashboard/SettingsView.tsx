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
      <div className="bg-[#FFFFFF] border border-[#BCE99A] rounded-2xl p-6 flex items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-[#1E4726] tracking-tight">Safety Engine & Governance Settings</h2>
          <p className="text-xs text-[#54825A]">Configure AWS live inspection, Cedar policy rules, and alerting channels.</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#BAF084] hover:bg-[#A8EB6C] text-[#1E4726] text-xs font-black transition-all shadow-xs cursor-pointer border border-[#8CD94B]"
        >
          {saved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Save className="w-3.5 h-3.5 stroke-[2.5]" />}
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* 2. AWS Connections & Digital Twin */}
      <div className="bg-[#FFFFFF] border border-[#BCE99A] rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Server className="w-4 h-4 text-[#15803D]" />
          <h3 className="text-sm font-black text-[#1E4726] tracking-tight">AWS Cloud Environment & Digital Twin</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-[#F4FDEE] border border-[#BCE99A] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1E4726]">Active AWS Accounts & Regions</div>
              <div className="text-[11px] text-[#54825A]">ap-south-1 (Production Primary) • us-east-1 (Failover Replica)</div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A34A] border border-[#BBF7D0] font-bold text-[10px] shadow-xs">
              LIVE SYNC
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4FDEE] border border-[#BCE99A] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1E4726]">Cross-Account IAM Inspector Role</div>
              <div className="font-mono text-[11px] text-[#54825A]">arn:aws:iam::894129481928:role/BlastGuardInspector</div>
            </div>
            <span className="text-xs text-[#15803D] font-bold">Verified ✓</span>
          </div>
        </div>
      </div>

      {/* 3. Cedar Policy & Risk Thresholds */}
      <div className="bg-[#FFFFFF] border border-[#BCE99A] rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#E03131]" />
          <h3 className="text-sm font-black text-[#1E4726] tracking-tight">Cedar Policy Engine & Risk Gates</h3>
        </div>

        <div className="space-y-3 text-xs">
          {/* Strict Mode Toggle */}
          <div className="p-4 rounded-2xl bg-[#F4FDEE] border border-[#BCE99A] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1E4726]">Strict Production Safety Barrier</div>
              <div className="text-[11px] text-[#54825A]">Automatically block changes that violate Cedar perimeter policies.</div>
            </div>
            <button
              onClick={() => setStrictMode(!strictMode)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                strictMode ? 'bg-[#15803D]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                strictMode ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Risk Threshold Slider */}
          <div className="p-4 rounded-2xl bg-[#F4FDEE] border border-[#BCE99A] flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-[#1E4726]">Auto-Block Risk Score Threshold</div>
                <div className="text-[11px] text-[#54825A]">Changes scoring at or above this value trigger an immediate hard block.</div>
              </div>
              <span className="text-sm font-black text-[#E03131] px-2.5 py-0.5 rounded-lg bg-[#FFFFFF] border border-[#FCD5CF] shadow-xs">{riskThreshold} / 100</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
              className="w-full accent-[#15803D] cursor-pointer"
            />
          </div>

          {/* Senior Architect Signoff Toggle */}
          <div className="p-4 rounded-2xl bg-[#F4FDEE] border border-[#BCE99A] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1E4726]">Require Senior Cloud Architect Approval</div>
              <div className="text-[11px] text-[#54825A]">Mandate dual cryptographic sign-off for Subnet and Core IAM deletions.</div>
            </div>
            <button
              onClick={() => setRequireArchitectSignoff(!requireArchitectSignoff)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                requireArchitectSignoff ? 'bg-[#15803D]' : 'bg-[#D1D5DB]'
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
      <div className="bg-[#FFFFFF] border border-[#BCE99A] rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Bell className="w-4 h-4 text-[#15803D]" />
          <h3 className="text-sm font-black text-[#1E4726] tracking-tight">Alert Notifications & Webhooks</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-[#F4FDEE] border border-[#BCE99A] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1E4726]">Slack Incident Dispatcher</div>
              <div className="text-[11px] text-[#54825A]">Channel: #aws-production-safety • Real-time gate blocks</div>
            </div>
            <button
              onClick={() => setSlackAlerts(!slackAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${
                slackAlerts ? 'bg-[#15803D]' : 'bg-[#D1D5DB]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                slackAlerts ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4FDEE] border border-[#BCE99A] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1E4726]">PagerDuty High-Urgency Escalation</div>
              <div className="font-mono text-[11px] text-[#54825A]">Integration Key: pd-service-blastguard-safety</div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A34A] border border-[#BBF7D0] font-bold text-[10px] shadow-xs">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
