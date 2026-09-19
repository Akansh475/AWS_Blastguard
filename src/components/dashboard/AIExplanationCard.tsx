import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';
import { BlastGuardApiClient } from '../../services/apiClient';
import { ExplanationRecord } from '../../ai/types/explanation.model';

interface AIExplanationCardProps {
  request: DashboardChangeRequest;
  onOpenChatbot?: () => void;
}

export const AIExplanationCard: React.FC<AIExplanationCardProps> = ({
  request,
  onOpenChatbot,
}) => {
  const [explanation, setExplanation] = useState<ExplanationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('Why was this blocked?');
  const [error, setError] = useState<string | null>(null);

  // Load explanation on request change or trigger
  const fetchExplanation = async (force = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await BlastGuardApiClient.explainRequest(request.id, force);
      setExplanation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate explanation');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically load or use cached explanation
    fetchExplanation(false);
  }, [request.id]);

  const promptOptions = [
    'Why was this blocked?',
    'Show affected resources',
    'Explain the risk',
  ];

  return (
    <div className="bg-[#FFFFFF] border border-[#BCE99A] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      {/* Header: Title + Prompt Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#BAF084] to-[#A4EB67] border border-[#8CD94B]/60 flex items-center justify-center text-[#1E4726] shadow-xs">
            <Sparkles className="w-4 h-4 text-[#1E4726]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#1E4726] tracking-tight">
              ASK BLASTGUARD
            </h3>
            <p className="text-[11px] text-[#54825A]">
              Amazon Bedrock AI-Powered Safety Explanation
            </p>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {promptOptions.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setSelectedPrompt(prompt);
                fetchExplanation(false);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedPrompt === prompt
                  ? 'bg-[#276735] text-white shadow-xs'
                  : 'bg-[#F4FDEE] hover:bg-[#E2F9D2] text-[#54825A] border border-[#BCE99A]'
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation Content Box */}
      <div className="p-4 rounded-xl bg-[#F4FDEE] border border-[#BCE99A] flex flex-col gap-3">
        {isLoading ? (
          <div className="flex items-center gap-3 py-4 text-xs font-semibold text-[#54825A]">
            <RefreshCw className="w-4 h-4 animate-spin text-[#15803D]" />
            <span>Consulting Amazon Bedrock infrastructure intelligence...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2.5 text-xs text-[#EF4444]">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : explanation ? (
          <>
            {/* Summary Banner */}
            <div className="text-xs text-[#1E4726] font-medium leading-relaxed">
              <span className="font-bold text-[#EF4444]">
                {explanation.explanation.headline || 'Change Blocked'}:{' '}
              </span>
              {explanation.explanation.summary ||
                `${request.resourceName} is production infrastructure with dependencies on multiple critical services. The proposed deletion affects ${request.affectedResources} resources, including ${request.criticalServices} critical services and ${request.externalDependencies} external dependencies.`}
            </div>

            {/* Why Blocked Bullet Points */}
            {explanation.explanation.whyBlocked && (
              <div className="space-y-1.5 pt-2 border-t border-[#BCE99A]/60">
                <div className="text-[11px] font-bold text-[#54825A] uppercase tracking-wider">
                  Key Findings
                </div>
                <div className="space-y-1">
                  {Array.isArray(explanation.explanation.whyBlocked) ? (
                    explanation.explanation.whyBlocked.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#1E4726]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0 mt-1.5" />
                        <span>{reason}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start gap-2 text-xs text-[#1E4726]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0 mt-1.5" />
                      <span>{explanation.explanation.whyBlocked}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommended Action */}
            {explanation.explanation.recommendedActions && explanation.explanation.recommendedActions.length > 0 && (
              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#BCE99A] text-xs text-[#1E4726] shadow-2xs">
                <span className="font-bold text-[#15803D]">Recommended Review: </span>
                <span>{explanation.explanation.recommendedActions[0]}</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-xs text-[#54825A]">
            Click a prompt above to generate a deterministic AI safety explanation.
          </div>
        )}
      </div>
    </div>
  );
};
