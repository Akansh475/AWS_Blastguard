import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';

interface DecisionColumnProps {
  request: DashboardChangeRequest;
  onViewImpact: () => void;
}

export const DecisionColumn: React.FC<DecisionColumnProps> = ({ request, onViewImpact }) => {
  const [approvalRequested, setApprovalRequested] = useState(false);

  const handleRequestApproval = () => {
    setApprovalRequested(true);
    setTimeout(() => {
      alert(`Approval requested for ${request.title} (Ticket submitted to Slack #aws-governance).`);
    }, 100);
  };

  // Determine card style based on request status
  const isBlocked = request.status === 'Blocked';
  const isApproved = request.status === 'Approved';

  return (
    <section className="glass-panel p-5 sm:p-6 flex flex-col justify-between gap-5 w-full select-none shadow-[0_8px_30px_rgba(210,180,110,0.12)]">
      {/* 1. Header */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#18181B]">
          Decision
        </h2>
      </div>

      {/* 2. Central Decision Card */}
      <div
        className={`rounded-[24px] p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3.5 transition-all ${
          isBlocked
            ? 'glass-alert-blocked'
            : isApproved
            ? 'glass-alert-approved'
            : 'glass-alert-pending'
        }`}
      >
        {/* Warning / Success / Pending Circle Icon */}
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0">
          {isBlocked ? (
            <div className="w-12 h-12 rounded-full border-2 border-[#E03131] bg-white/50 backdrop-blur-md flex items-center justify-center text-[#E03131] shadow-xs">
              <span className="text-2xl font-bold leading-none">!</span>
            </div>
          ) : isApproved ? (
            <div className="w-12 h-12 rounded-full border-2 border-[#16A34A] bg-white/50 backdrop-blur-md flex items-center justify-center text-[#16A34A] shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-[#D97706] bg-white/50 backdrop-blur-md flex items-center justify-center text-[#D97706] shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className={`text-lg sm:text-xl font-bold ${
            isBlocked ? 'text-[#D9383A]' : isApproved ? 'text-[#16A34A]' : 'text-[#D97706]'
          }`}
        >
          {request.decisionTitle}
        </h3>

        {/* Description Subtext */}
        <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed max-w-[240px]">
          {request.decisionMessage}
        </p>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex items-center gap-2.5 pt-1">
        {/* View Impact Button (Frosted White Glass) */}
        <button
          onClick={onViewImpact}
          className="flex-1 py-2.5 px-3.5 rounded-xl bg-white/60 hover:bg-white/90 border border-white/80 text-xs sm:text-sm font-semibold text-[#18181B] transition-all backdrop-blur-md shadow-xs hover:shadow active:scale-98 cursor-pointer text-center"
        >
          View Impact
        </button>

        {/* Request Approval Button (Warm Gold / Orange Pill) */}
        <button
          onClick={handleRequestApproval}
          disabled={approvalRequested}
          className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#F89C26] hover:bg-[#E88B0E] text-xs sm:text-sm font-bold text-[#18181B] transition-all shadow-[0_4px_14px_rgba(248,156,38,0.35)] hover:shadow-[0_6px_18px_rgba(248,156,38,0.45)] active:scale-98 cursor-pointer text-center disabled:opacity-75"
        >
          {approvalRequested ? 'Requested ✓' : 'Request Approval'}
        </button>
      </div>
    </section>
  );
};
