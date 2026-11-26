import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import type { AgentProfile } from '../data/properties';
import type { ChatMessageRecord, ConversationRecord } from '../types/portal';

interface AgentsAndMessagingProps {
  agents: AgentProfile[];
  conversations: ConversationRecord[];
  activeConversationId: string | null;
  messages: ChatMessageRecord[];
  onSelectConversation: (conversationId: string) => void;
  onStartChatWithAgent: (agent: AgentProfile) => void;
  onSendMessage: (conversationId: string, body: string) => Promise<void>;
}

const QUICK_PROMPTS = [
  'Schedule a private property inspection',
  'Request verified Certificate of Occupancy',
  'Discuss milestone payment plan',
];

export const AgentsAndMessaging: React.FC<AgentsAndMessagingProps> = ({
  agents,
  conversations,
  activeConversationId,
  messages,
  onSelectConversation,
  onStartChatWithAgent,
  onSendMessage,
}) => {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ?? conversations[0] ?? null;

  const activeAgent =
    agents.find((a) => a.id === activeConversation?.agentId) ?? agents[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !draft.trim() || sending) return;
    const body = draft.trim();
    setDraft('');
    setSending(true);
    try {
      await onSendMessage(activeConversation.id, body);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="agents"
      aria-labelledby="agents-heading"
      className="bg-[#faf8f4] dark:bg-[#0e0d0b] text-[#141210] dark:text-[#f4f1ec] py-16 md:py-24 border-b border-[#141210]/10 dark:border-white/10 transition-colors"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 space-y-14">
        {/* Verified Advisors Directory */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#141210]/10 dark:border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] tracking-[0.22em] uppercase text-[#7b674d] dark:text-[#c8a97e] font-medium">
                  ADVISORY &amp; INSTANT MESSAGING
                </span>
                <span className="w-16 h-px bg-[#141210]/20 dark:bg-white/20" aria-hidden="true" />
              </div>
              <h2
                id="agents-heading"
                className="font-serif text-3xl sm:text-4xl font-normal [text-wrap:balance]"
              >
                Speak Directly With Verified Advisors
              </h2>
            </div>
            <p className="text-sm text-[#575149] dark:text-[#b5ada2] max-w-md">
              Every ASK MIDDLEMAN advisor carries verified regional accreditation for title checks,
              private inspections, and bespoke payment structuring.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {agents.map((agent) => (
              <article
                key={agent.id}
                className="border border-[#141210]/10 dark:border-white/10 bg-white dark:bg-[#171513] flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square overflow-hidden bg-[#1e1b18] border-b border-[#141210]/10 dark:border-white/10">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#8a6d46] dark:text-[#c8a97e]">
                      {agent.locationFocus}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-medium">{agent.name}</h3>
                    <p className="text-xs text-[#6b645c] dark:text-[#a69e94]">{agent.role}</p>

                    <div className="mt-4 pt-3 border-t border-[#141210]/10 dark:border-white/10 space-y-1 text-xs text-[#575149] dark:text-[#b5ada2] tabular-nums">
                      <p>Specialty: {agent.specialty}</p>
                      <p>
                        {agent.activeListings} Active Listings · Reply {agent.responseTime}
                      </p>
                      <p className="inline-flex items-center gap-1 text-[#8a6d46] dark:text-[#c8a97e]">
                        <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{agent.verifiedLicense}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => {
                      onStartChatWithAgent(agent);
                      setMobileShowThread(true);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#141210] text-[#f4f1ec] dark:bg-[#c8a97e] dark:text-[#141210] hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Message {agent.name.split(' ')[0]}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Instant Messaging Workspace */}
        <div
          id="messaging-workspace"
          className="border border-[#141210]/15 dark:border-white/15 bg-white dark:bg-[#171513] grid grid-cols-1 lg:grid-cols-12 min-h-[460px]"
        >
          {/* Conversations List */}
          <div
            className={`lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#141210]/10 dark:border-white/10 ${
              mobileShowThread ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="px-5 py-4 border-b border-[#141210]/10 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-serif text-xl">Advisor Inbox</h3>
              <span className="text-xs text-[#6b645c] dark:text-[#a69e94] tabular-nums">
                {conversations.length} {conversations.length === 1 ? 'thread' : 'threads'}
              </span>
            </div>

            <div className="divide-y divide-[#141210]/10 dark:divide-white/10">
              {conversations.map((conv) => {
                const isSelected = conv.id === activeConversation?.id;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => {
                      onSelectConversation(conv.id);
                      setMobileShowThread(true);
                    }}
                    className={`w-full text-left px-5 py-4 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#f4f1ec] dark:bg-[#221e1a]'
                        : 'hover:bg-[#f4f1ec]/60 dark:hover:bg-[#1e1b18]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm">{conv.agentName}</span>
                      <span className="text-[11px] text-[#6b645c] dark:text-[#a69e94] tabular-nums">
                        {conv.updatedAtLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8a6d46] dark:text-[#c8a97e] mt-0.5 truncate">
                      {conv.propertyTitle}
                    </p>
                    <p className="text-xs text-[#575149] dark:text-[#b5ada2] mt-1 truncate">
                      {conv.lastMessage}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Thread */}
          <div
            className={`lg:col-span-8 flex flex-col justify-between ${
              !mobileShowThread ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {activeConversation ? (
              <>
                <div className="px-5 py-4 border-b border-[#141210]/10 dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileShowThread(false)}
                      aria-label="Back to advisor conversations"
                      className="lg:hidden w-9 h-9 inline-flex items-center justify-center border border-[#141210]/15 dark:border-white/15 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    {activeAgent && (
                      <img
                        src={activeAgent.avatar}
                        alt={activeAgent.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover border border-[#141210]/15 dark:border-white/15 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-serif text-lg leading-tight truncate">
                        {activeConversation.agentName}
                      </p>
                      <p className="text-xs text-[#6b645c] dark:text-[#a69e94] truncate">
                        {activeConversation.propertyTitle} · Typically replies{' '}
                        {activeAgent?.responseTime ?? 'fast'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Scroll List */}
                <div
                  data-testid="chat-message-list"
                  className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[320px] bg-[#faf8f4]/60 dark:bg-[#11100e]/60"
                >
                  {messages.map((msg) => {
                    const isClient = msg.senderRole === 'client';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed border ${
                            isClient
                              ? 'bg-[#141210] text-[#f4f1ec] border-[#141210] dark:bg-[#c8a97e] dark:text-[#141210] dark:border-[#c8a97e]'
                              : 'bg-white dark:bg-[#1c1916] text-[#141210] dark:text-[#f4f1ec] border-[#141210]/10 dark:border-white/10'
                          }`}
                        >
                          <p>{msg.body}</p>
                        </div>
                        <span className="mt-1 text-[11px] text-[#6b645c] dark:text-[#a69e94] tabular-nums">
                          {msg.senderName} · {msg.createdAtLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Replies + Composer */}
                <div className="p-4 border-t border-[#141210]/10 dark:border-white/10 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setDraft(prompt)}
                        className="px-2.5 py-1 text-[11px] border border-[#141210]/15 dark:border-white/15 hover:border-[#c8a97e] text-[#575149] dark:text-[#b5ada2] cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSend} className="flex items-center gap-2.5">
                    <label htmlFor="chat-draft" className="sr-only">
                      Write a message to {activeConversation.agentName}
                    </label>
                    <input
                      id="chat-draft"
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={`Message ${activeConversation.agentName}...`}
                      className="flex-1 px-3.5 py-2.5 text-sm bg-[#faf8f4] dark:bg-[#11100e] border border-[#141210]/15 dark:border-white/15 focus:outline-none focus:border-[#c8a97e]"
                    />
                    <button
                      type="submit"
                      disabled={sending || !draft.trim()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#c8a97e] text-[#141210] hover:bg-[#b59467] disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-sm text-[#6b645c] dark:text-[#a69e94]">
                Select an advisor above to begin an instant conversation.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
