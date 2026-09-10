import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Paperclip,
  Search,
  CheckCheck,
  Phone,
  Video,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessagesDrawer: React.FC = () => {
  const {
    isMessagesOpen,
    setIsMessagesOpen,
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    startPhoneCall
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{
    name: string;
    size: string;
    url: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  // Auto-scroll to bottom on conversation change or new message
  useEffect(() => {
    if (isMessagesOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isMessagesOpen, activeConv?.messages.length, activeConv?.id]);

  if (!isMessagesOpen || !activeConv) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedAttachment) return;

    sendMessage(activeConv.id, inputMessage, selectedAttachment || undefined);
    setInputMessage('');
    setSelectedAttachment(null);
    setShowAttachmentMenu(false);
  };

  const handleQuickPrompt = (promptText: string) => {
    sendMessage(activeConv.id, promptText);
  };

  const handleStartCall = () => {
    startPhoneCall({
      name: activeConv.contactName,
      role: activeConv.contactRole,
      avatar: activeConv.contactAvatar
    });
  };

  const filteredConversations = conversations.filter(c =>
    c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contactRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PRESET_ATTACHMENTS = [
    { name: 'Surya_FullStack_Placement_Resume.pdf', size: '1.2 MB', url: '#' },
    { name: 'Distributed_Systems_Capstone_Summary.pdf', size: '840 KB', url: '#' },
    { name: 'FullStack_Developer_Certificate.pdf', size: '420 KB', url: '#' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col md:flex-row border-l border-slate-200">
        
        {/* Left: Conversations List */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Direct Messages</h2>
              <p className="text-[11px] text-slate-500">Recruiters, Mentors &amp; Faculty</p>
            </div>
            <button
              onClick={() => setIsMessagesOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Contacts */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                  conv.id === activeConv?.id ? 'bg-blue-50/80 border-r-4 border-blue-600' : 'hover:bg-white'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.contactAvatar}
                    alt={conv.contactName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 truncate">{conv.contactName}</p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{conv.contactRole}</p>
                  <p className="text-xs text-slate-600 truncate mt-1">{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Conversation Thread */}
        <div className="flex-1 flex flex-col h-full bg-white">
          {/* Thread Header with Phone & Video Call Actions */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeConv.contactAvatar}
                  alt={activeConv.contactName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                {activeConv.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{activeConv.contactName}</h3>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  {activeConv.online ? 'Online now' : 'Active today'} • {activeConv.contactRole}
                </p>
              </div>
            </div>

            {/* Quick In-Chat Actions: Direct Phone Call & Video Call */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <button
                onClick={handleStartCall}
                className="p-2 hover:text-emerald-700 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-emerald-200 bg-emerald-50/50 shadow-2xs"
                title="Start Direct Phone Call"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold hidden sm:inline">Call</span>
              </button>

              <button
                onClick={handleStartCall}
                className="p-2 hover:text-blue-700 hover:bg-blue-50 text-blue-600 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-blue-200 bg-blue-50/50"
                title="Start Video Meeting"
              >
                <Video className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold hidden sm:inline">Video</span>
              </button>

              <button
                onClick={() => setIsMessagesOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer ml-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Bubble Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
            <div className="text-center my-2">
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                End-to-End Encrypted Professional Career Thread
              </span>
            </div>

            {activeConv.messages.map((msg) => {
              const isMe = msg.senderId === 'std-101';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={msg.senderAvatar || activeConv.contactAvatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Attachment preview if present */}
                    {msg.attachment && (
                      <div className={`mt-2 p-2 rounded-xl flex items-center gap-2 border text-xs ${
                        isMe ? 'bg-blue-700/60 border-blue-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        <FileText className="w-4 h-4 text-amber-300 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-[11px]">{msg.attachment.name}</p>
                          <span className="text-[9px] opacity-75">{msg.attachment.size}</span>
                        </div>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isMe ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" /> Suggestions:
            </span>
            <button
              onClick={() => handleQuickPrompt('Could we schedule a quick 10-minute phone call to review my interview readiness?')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
            >
              📞 Request Phone Call
            </button>
            <button
              onClick={() => handleQuickPrompt('Can you review my resume and verified skill portfolio for this role?')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
            >
              📄 Review My Resume
            </button>
            <button
              onClick={() => handleQuickPrompt('What are the key technical concepts and coding topics covered in Round 1?')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
            >
              💻 Interview Topics
            </button>
            <button
              onClick={() => handleQuickPrompt('Which online courses would you recommend to bridge my remaining skill gaps?')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
            >
              ⚡ Bridge Skill Gaps
            </button>
          </div>

          {/* Attachment Picker Popover */}
          {showAttachmentMenu && (
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs space-y-1.5 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-[11px]">Select Document to Share:</span>
                <button
                  onClick={() => setShowAttachmentMenu(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_ATTACHMENTS.map((att, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedAttachment(att);
                      setShowAttachmentMenu(false);
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                      selectedAttachment?.name === att.name
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold truncate">{att.name}</p>
                      <span className="text-[9px] text-slate-400">{att.size}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Attachment Badge */}
          {selectedAttachment && (
            <div className="px-4 py-1.5 bg-blue-50 border-t border-blue-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-800">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold text-[11px] truncate">Attached: {selectedAttachment.name}</span>
                <span className="text-[9px] text-blue-500">({selectedAttachment.size})</span>
              </div>
              <button
                onClick={() => setSelectedAttachment(null)}
                className="text-blue-600 hover:text-blue-800 font-bold text-xs cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}

          {/* Message Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                showAttachmentMenu || selectedAttachment
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Attach Resume / Portfolio File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${activeConv.contactName}...`}
              className="flex-1 bg-slate-100 hover:bg-slate-200/50 focus:bg-white text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-blue-500 focus:outline-none transition-colors"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() && !selectedAttachment}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
