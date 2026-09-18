import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  X,
  Send,
  Sparkles,
  GripHorizontal,
  Bot,
  Maximize2,
  Minimize2,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Network
} from 'lucide-react';
import { DashboardChangeRequest } from '../../data/mockData';

interface FloatingChatbotWidgetProps {
  request: DashboardChangeRequest;
  onOpenImpactStudio?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  hasAction?: boolean;
}

export const FloatingChatbotWidget: React.FC<FloatingChatbotWidgetProps> = ({
  request,
  onOpenImpactStudio,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Hello! I'm **BlastGuard AI Assistant**.\n\nI've analyzed **${request.title}** on AWS \`${request.region}\` (\`${request.environment}\`).\n\nDeleting this subnet will sever Elastic Network Interfaces (ENIs) for Payment API and trigger cascade database outages. How can I assist you with this change?`,
      hasAction: true,
    },
  ]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Generate smart response based on query
    setTimeout(() => {
      let botReply = '';
      let action = false;
      const q = query.toLowerCase();

      if (q.includes('why') && q.includes('blocked')) {
        botReply = `🛡️ **Why this change is BLOCKED:**\n\n1. **Cedar Policy Violation**: Policy \`PRODUCTION_CHANGE_REQUIRES_APPROVAL\` was triggered.\n2. **High Risk Index**: Scored **${request.riskScore} / 100** (automated clearance ceiling is 30/100).\n3. **ENI Severance**: \`${request.resourceName}\` provides primary network interfaces to **3 critical production services** with zero standby failovers in AZ-2.`;
        action = true;
      } else if (q.includes('resource') || q.includes('affected') || q.includes('show') || q.includes('11')) {
        botReply = `📦 **11 Affected Resources Breakdown:**\n\n• **Payment API Service** (Revenue Critical • 2.4M req/hr live)\n• **Order Service Core** (Tier 1 • 1.8M req/hr)\n• **Auth & Session Broker** (Tier 0 • 3.1M req/hr)\n• **Aurora PG Multi-AZ Cluster** (Database tier)\n• **Datadog APM Ingress** (Monitoring pipeline)\n• *Plus 6 dependent microservices.*`;
        action = true;
      } else if (q.includes('risk') || q.includes('explain') || q.includes('score')) {
        botReply = `⚠️ **Blast Radius Risk Assessment (${request.riskScore}/100 - Critical):**\n\n• **Direct Impact**: 7 services\n• **Indirect Ripple**: 11 downstream dependencies\n• **Downtime Estimate**: Immediate 502 Bad Gateway for 100% of checkout transactions\n• **Blast Horizon**: Revenue loss projected at $42,000 / min without failover route.`;
        action = true;
      } else if (q.includes('fix') || q.includes('remed') || q.includes('how to')) {
        botReply = `🔧 **Recommended Safe Remediation Plan:**\n\n1. Drain ENI container traffic from \`${request.resourceName}\` to secondary subnet \`subnet-08\` in AZ-2.\n2. Verify health check telemetry for Payment API on the secondary subnet.\n3. Re-run BlastGuard simulation to confirm blast radius drops below **20/100** before applying deletion.`;
        action = true;
      } else {
        botReply = `I evaluated **"${query}"** against our live AWS digital twin for **${request.title}**.\n\nOur automated Cedar safety engine recommends draining container traffic to \`subnet-08\` in AZ-2 before deletion to ensure zero production disruptions.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          hasAction: action,
        },
      ]);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Chat reset. I am ready to evaluate **${request.title}** or answer any AWS blast-radius questions!`,
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <AnimatePresence>
        {/* ========================================================================= */}
        {/* BIGGER & DRAGGABLE MOVABLE ASSISTANT WINDOW */}
        {/* ========================================================================= */}
        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.08}
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`glass-panel p-5 sm:p-6 flex flex-col gap-4 shadow-[0_25px_70px_rgba(210,180,110,0.28)] border border-white/90 mb-3 ${
              isExpanded
                ? 'w-[90vw] sm:w-[620px] lg:w-[680px] h-[75vh]'
                : 'w-[92vw] sm:w-[480px] lg:w-[520px] h-[580px]'
            }`}
          >
            {/* 1. DRAGGABLE WINDOW HEADER (Drag Handle) */}
            <div className="flex items-center justify-between border-b border-black/8 pb-3.5 cursor-grab active:cursor-grabbing">
              {/* Mascot + Title */}
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F89C26]/30 to-[#F89C26]/10 border border-[#F89C26]/30 flex items-center justify-center shrink-0 shadow-xs">
                  <img
                    src="/mascot-icon.svg"
                    alt="BlastGuard Mascot"
                    className="w-7 h-7 object-contain"
                  />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22C55E]"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#18181B] tracking-tight">
                      Ask BlastGuard
                    </h3>
                    <span className="px-2 py-0.2 rounded-full bg-[#F89C26]/20 text-[#18181B] text-[10px] font-bold uppercase tracking-wider">
                      AI COPILOT
                    </span>
                  </div>
                  <p className="text-xs text-[#71717A] mt-0.5">
                    Live Digital Twin • Drag window anywhere
                  </p>
                </div>
              </div>

              {/* Drag Indicator & Action Controls */}
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {/* Drag Grip Handle */}
                <div
                  className="px-2 py-1 rounded-lg bg-white/50 text-[#8E8E93] hover:text-[#18181B] flex items-center justify-center cursor-grab active:cursor-grabbing mr-1"
                  title="Drag window"
                >
                  <GripHorizontal className="w-4 h-4" />
                </div>

                {/* Reset Chat */}
                <button
                  onClick={handleResetChat}
                  className="w-8 h-8 rounded-full bg-white/60 hover:bg-white text-[#52525B] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Expand / Minimize Window */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-8 h-8 rounded-full bg-white/60 hover:bg-white text-[#52525B] flex items-center justify-center transition-all shadow-2xs cursor-pointer hidden sm:flex"
                  title={isExpanded ? 'Restore size' : 'Expand window'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#52525B] hover:text-[#18181B] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. SUGGESTED PROMPT CHIPS */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              {[
                { label: 'Why was this blocked?', text: 'Why was this change blocked?' },
                { label: 'Show 11 affected resources', text: 'Show all 11 affected resources' },
                { label: 'Explain the risk', text: 'Explain the blast radius risk assessment' },
                { label: 'Recommended safe fix', text: 'What is the recommended safe migration plan?' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleSendMessage(chip.text)}
                  className="px-3.5 py-1.5 rounded-full bg-white/65 hover:bg-white border border-white/90 text-xs font-bold text-[#18181B] transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#F89C26]" />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* 3. SCROLLABLE CHAT MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1.5 flex flex-col gap-3.5 text-xs sm:text-sm">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-4 rounded-3xl max-w-[92%] leading-relaxed ${
                        isUser
                          ? 'bg-[#18181B] text-white font-medium rounded-br-xs shadow-sm'
                          : 'glass-card border border-white/90 text-[#18181B] rounded-bl-xs shadow-xs whitespace-pre-line'
                      }`}
                    >
                      {m.text}

                      {/* Interactive View Impact Button inside Bot Reply */}
                      {!isUser && m.hasAction && onOpenImpactStudio && (
                        <div className="mt-3 pt-2.5 border-t border-black/8 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#71717A]">
                            Want to inspect the graph?
                          </span>
                          <button
                            onClick={onOpenImpactStudio}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F89C26] hover:bg-[#E88B0E] text-[#18181B] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            <Network className="w-3.5 h-3.5" />
                            <span>Open Topology Studio →</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* 4. CHAT INPUT BAR */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2.5 pt-2 border-t border-black/8"
            >
              <input
                type="text"
                placeholder="Ask about this change, Cedar policy, or AWS dependencies..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-white/70 focus:bg-white border border-white/85 text-xs sm:text-sm font-medium text-[#18181B] placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#F89C26]/40 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 rounded-2xl bg-[#F89C26] hover:bg-[#E88B0E] text-[#18181B] font-bold transition-all shadow-sm disabled:opacity-40 cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* COLLAPSED FLOATING WIDGET PILL */}
      {/* ========================================================================= */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel px-5 py-3 flex items-center gap-3.5 shadow-[0_12px_40px_rgba(210,180,110,0.25)] border border-white/90 hover:border-white transition-all cursor-pointer"
      >
        {/* Orange Mascot Head with glowing aura */}
        <div className="relative w-10 h-10 rounded-2xl bg-[#F89C26]/20 border border-[#F89C26]/30 flex items-center justify-center shrink-0 shadow-2xs">
          <img
            src="/mascot-icon.svg"
            alt="Ask BlastGuard Mascot"
            className="w-7 h-7 object-contain"
          />
          <span className="absolute -top-1 -right-1 text-sm animate-bounce">
            ✨
          </span>
        </div>

        {/* Text */}
        <div className="text-left">
          <div className="text-xs sm:text-sm font-black text-[#18181B] leading-tight">
            Ask BlastGuard
          </div>
          <div className="text-[11px] font-medium text-[#71717A] leading-tight mt-0.5">
            Need help?
          </div>
        </div>

        {/* Up / Down Chevron */}
        <div className="w-7 h-7 rounded-full bg-white/70 border border-white/80 flex items-center justify-center text-[#52525B] ml-1 shadow-2xs">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </motion.button>
    </div>
  );
};
