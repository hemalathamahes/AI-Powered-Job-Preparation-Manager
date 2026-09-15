import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  User,
  Trash2,
  Copy,
  Check,
  ArrowUpRight,
  HelpCircle,
  Briefcase,
  CheckSquare,
  FileText,
} from 'lucide-react';
import { ChatMessage, PrepStats, Task, JobApplication } from '../types';
import { ApiService } from '../services/api';

interface AiAssistantViewProps {
  chatHistory: ChatMessage[];
  onSendMessage: (userMsg: string, aiMsg: string) => void;
  onClearHistory: () => void;
  stats: PrepStats;
  tasks: Task[];
  applications: JobApplication[];
  targetRole: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  chatHistory,
  onSendMessage,
  onClearHistory,
  stats,
  tasks,
  applications,
  targetRole,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How should I prioritize my study time this week?',
    'Give me a mock question for a Senior Full Stack round',
    'How do I negotiate salary for an offer stage?',
    'Review the STAR framework for handling team conflict',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    setInputMessage('');
    setIsLoading(true);

    // Context summarizing current candidate status
    const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
    const activeCompanies = applications.map((a) => a.company).join(', ');
    const context = `Target Role: ${targetRole}. Readiness Index: ${stats.readinessScore}%. Pending Tasks: ${pendingTasks}. Active Companies: ${activeCompanies || 'None'}.`;

    try {
      const historyFormatted = chatHistory.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await ApiService.sendChatMessage(text, historyFormatted, context);
      onSendMessage(text, res.response);
    } catch (e: any) {
      console.error('Failed to send chat:', e);
      onSendMessage(
        text,
        "I ran into an issue connecting to the AI Career Coach. Please ensure the server is active and retry."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col rounded-2xl border border-zinc-200/80 bg-white shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                AI Career Strategist & Interview Coach
              </h2>
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Online
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Grounded in your active tasks, target role ({targetRole}), and pipeline
            </p>
          </div>
        </div>

        {chatHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">
              How can I accelerate your job prep today?
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Ask me to organize your study week, practice tough behavioral follow-ups, critique resume bullets, or draft negotiation counter-offers.
            </p>

            {/* Quick Prompts */}
            <div className="mt-6 grid grid-cols-1 gap-2 w-full text-left">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="group flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-2.5 text-xs text-zinc-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:border-indigo-900"
                >
                  <span>{prompt}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-indigo-600" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white text-xs font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`relative max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'border border-zinc-200/80 bg-zinc-50/70 text-zinc-800 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {!isUser && (
                    <div className="mt-2 flex items-center justify-end border-t border-zinc-200/40 pt-2 text-[10px] text-zinc-400 dark:border-zinc-800/40">
                      <button
                        onClick={() => handleCopy(msg.content, index)}
                        className="flex items-center gap-1 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-zinc-700 text-xs font-bold dark:bg-zinc-800 dark:text-zinc-300">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white text-xs font-bold">
              AI
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/60">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                Thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-zinc-100 p-4 dark:border-zinc-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything (e.g., 'What are good questions to ask Stripe interviewers?')..."
            className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
