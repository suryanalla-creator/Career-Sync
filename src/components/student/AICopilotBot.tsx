import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  RotateCcw,
  Lightbulb,
  Zap,
  ArrowRight,
  Sparkles,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAREER_ROLE_OPTIONS } from '../../data/careerRolesData';

export interface BotMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  provider?: string;
  actionTab?: string;
  actionLabel?: string;
}

interface AICopilotBotProps {
  className?: string;
  heightClass?: string;
}

const generateMsgId = (prefix: string) => `${prefix}-${Date.now()}`;
const getFormattedTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const AICopilotBot: React.FC<AICopilotBotProps> = ({
  className = '',
  heightClass = 'h-[580px]'
}) => {
  const { studentProfile, selectedCareerRoleId, setActiveTab, skillsWeHave } = useApp();

  const activeRoleId = selectedCareerRoleId || 'fullstack-engineer';
  const activeRole = CAREER_ROLE_OPTIONS.find(r => r.id === activeRoleId) || CAREER_ROLE_OPTIONS[0];
  const activeBranch = studentProfile?.department || 'Computer Science & Engineering';

  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('careersync_gemini_api_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState('');
  const [keySavedToast, setKeySavedToast] = useState(false);
  const [hasServerApiKey, setHasServerApiKey] = useState(false);
  const [activeProvider, setActiveProvider] = useState('CareerSync Smart Engine');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check server AI status on mount
  useEffect(() => {
    fetch('/api/ai/status')
      .then(res => res.json())
      .then(data => {
        if (data.hasApiKey) {
          setHasServerApiKey(true);
          setActiveProvider(data.provider || 'Live LLM');
        } else if (apiKey) {
          setActiveProvider('Google Gemini (Custom Key)');
        }
      })
      .catch(() => {
        // silently fallback
      });
  }, [apiKey]);

  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello ${studentProfile.name}! 👋 I am your CareerSync AI Placement Copilot. Your target role is **${activeRole.title}** and your Industry Readiness score is currently **${studentProfile.industryReadinessScore}%**.\n\nAsk me about required skills, crack technical interview rounds, optimize for recruiter ATS, or request a customized roadmap!`,
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    `Skills needed for ${activeRole.title}`,
    `How to crack campus technical interviews?`,
    `Recommended certifications for ATS boost`,
    `Bridge my current skill gaps`
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = tempKeyInput.trim();
    setApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('careersync_gemini_api_key', cleanKey);
      setActiveProvider('Google Gemini 2.0 (Custom Key)');
    } else {
      localStorage.removeItem('careersync_gemini_api_key');
      setActiveProvider(hasServerApiKey ? 'Server LLM Engine' : 'CareerSync Smart Engine');
    }
    setShowKeyModal(false);
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 3000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    const userMsg: BotMessage = {
      id: generateMsgId('usr'),
      sender: 'user',
      text: query,
      timestamp: getFormattedTime()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          history: messages.slice(-6).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          })),
          customApiKey: apiKey || undefined,
          context: {
            studentName: studentProfile.name,
            roleTitle: activeRole.title,
            department: studentProfile.department,
            college: studentProfile.college,
            readinessScore: studentProfile.industryReadinessScore,
            skills: activeRole.keySkills
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: BotMessage = {
        id: generateMsgId('ai'),
        sender: 'ai',
        text: data.reply || 'Here is what I found for your career path.',
        provider: data.provider,
        timestamp: getFormattedTime(),
        actionTab: data.actionTab,
        actionLabel: data.actionLabel
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Backend chat API failed, using fallback:', err);
      // Client-side smart fallback if backend network is unreachable
      const lower = query.toLowerCase();
      let reply = '';
      let actionTab: string | undefined;
      let actionLabel: string | undefined;

      if (lower.includes('skill') || lower.includes('require') || lower.includes('learn')) {
        const topSkills = (activeRole.keySkills || []).slice(0, 4).join(', ');
        const verifiedText = skillsWeHave && skillsWeHave.length > 0
          ? `You currently have verified competency in **${skillsWeHave.slice(0, 3).join(', ')}**.`
          : `You have not yet completed verified skill assessments for this role.`;
        reply = `For **${activeRole.title}**, recruiters in Tier-1 product companies prioritize:\n• **${topSkills}**\n\n${verifiedText} I recommend taking an assessment test in your Skill Profile to validate technical proficiency.`;
        actionTab = 'skill-profile';
        actionLabel = 'Check Skills & Take Assessment';
      } else if (lower.includes('interview') || lower.includes('crack') || lower.includes('round')) {
        reply = `Top interview playbook for **B.Tech ${activeBranch}** candidates targeting **${activeRole.title}**:\n1. **Data Structures & Algorithms**: Master 50 LeetCode Mediums on Trees, Graphs, DP, and HashMaps.\n2. **System Design**: Be ready to design a scalable URL shortener, real-time chat, or notification service.\n3. **Behavioral**: Use the STAR method for leadership and conflict resolution.`;
        actionTab = 'career-path';
        actionLabel = 'Open Career Roadmap';
      } else {
        reply = `Based on your profile in **${activeBranch}** and target role **${activeRole.title}**, you are well-positioned for top tier campus placement drives. Ask me any specific technical or interview question!`;
        actionTab = 'jobs-internships';
        actionLabel = 'Explore Jobs & Internships Hub';
      }

      const aiMsg: BotMessage = {
        id: generateMsgId('ai'),
        sender: 'ai',
        text: reply,
        provider: 'CareerSync Smart Engine',
        timestamp: getFormattedTime(),
        actionTab,
        actionLabel
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-reset',
        sender: 'ai',
        text: `Chat restarted. Hello ${studentProfile.name}! What would you like guidance on regarding **${activeRole.title}**?`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className={`bg-white rounded-3xl border-2 border-indigo-100 shadow-lg overflow-hidden flex flex-col ${heightClass} ${className} relative`}>
      {/* Key Saved Toast */}
      {keySavedToast && (
        <div className="absolute top-16 right-4 z-30 bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>API Key settings updated!</span>
        </div>
      )}

      {/* Bot Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between border-b border-indigo-800/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">CareerSync AI Placement Copilot</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                apiKey || hasServerApiKey
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
              }`}>
                <Sparkles className="w-2.5 h-2.5" /> {apiKey || hasServerApiKey ? 'Live LLM Active' : 'Live AI Copilot'}
              </span>
            </div>
            <p className="text-[11px] text-indigo-200 truncate max-w-xs sm:max-w-md">
              Personalized for {activeRole.title} &bull; {studentProfile.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* API Key Configure Button */}
          <button
            onClick={() => {
              setTempKeyInput(apiKey);
              setShowKeyModal(true);
            }}
            title="Configure Gemini API Key"
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              apiKey
                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/30'
                : 'bg-white/10 text-indigo-200 hover:text-white hover:bg-white/20'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{apiKey ? 'Gemini Key Linked' : 'API Key'}</span>
          </button>

          <button
            onClick={handleResetChat}
            title="Restart Chat"
            className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2.5 bg-indigo-50/60 border-b border-indigo-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-indigo-900 font-bold flex items-center gap-1 pl-1 whitespace-nowrap">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Prompts:
        </span>
        {quickPrompts.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 font-medium whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className="space-y-1.5 max-w-[85%] sm:max-w-[80%]">
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line prose prose-sm max-w-none">
                  {msg.text}
                </div>

                {msg.actionTab && msg.actionLabel && (
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab(msg.actionTab as any)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-indigo-600" />
                      {msg.actionLabel}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.provider && (
                  <span className="text-indigo-600 font-semibold">{msg.provider}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="flex items-center gap-1 text-indigo-700 font-medium">
              CareerSync AI is thinking
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={`Ask AI Bot about ${activeRole.title}, interview rounds, ATS keywords...`}
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!chatInput.trim() || isTyping}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">LLM API Key Settings</h3>
                  <p className="text-[11px] text-slate-500">Google Gemini &bull; OpenAI GPT</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Live Gemini 2.0 / 1.5 Flash Support</span>
              </div>
              <p className="text-[11px] leading-relaxed text-indigo-800">
                You can provide your Google Gemini API key (from Google AI Studio) to power live real-time LLM reasoning and placement answers.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Get free Gemini API Key from Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Gemini / OpenAI API Key
                </label>
                <input
                  type="password"
                  value={tempKeyInput}
                  onChange={(e) => setTempKeyInput(e.target.value)}
                  placeholder="AIzaSy... or sk-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-indigo-500 focus:outline-none bg-slate-50"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Stored safely in your local browser session or sent to local server route.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                {apiKey ? (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKey('');
                      setTempKeyInput('');
                      localStorage.removeItem('careersync_gemini_api_key');
                      setShowKeyModal(false);
                      setKeySavedToast(true);
                      setTimeout(() => setKeySavedToast(false), 3000);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                  >
                    Clear Key
                  </button>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
                  >
                    Save &amp; Connect
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

