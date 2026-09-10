import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Grid,
  X,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Radio,
  CheckCircle2,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Web Audio tone synthesizer for phone ring, DTMF dial tones, and connect chimes
const playPhoneSound = (type: 'ring' | 'connect' | 'hangup' | 'dtmf', digit?: string) => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'ring') {
      // Standard US/Indian dual tone ring: 440Hz + 480Hz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = 440;
      osc2.frequency.value = 480;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } else if (type === 'connect') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'hangup') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'dtmf') {
      const dtmfFreqs: Record<string, [number, number]> = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
      };
      const freqs = dtmfFreqs[digit || '1'] || [697, 1209];
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // AudioContext permission fallback
  }
};

interface AvailableContact {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  phone: string;
  type: 'recruiter' | 'mentor' | 'faculty' | 'ai';
  initialSpeech: string;
}

const PRESET_CONTACTS: AvailableContact[] = [
  {
    id: 'c1',
    name: 'Priya Sen',
    role: 'University Talent Acquisition Lead',
    company: 'TechNova',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    type: 'recruiter',
    initialSpeech: 'Hi Surya! Glad we could connect on call. We were impressed with your capstone architecture and wanted to discuss your Technical Round 1 schedule and interview expectations.'
  },
  {
    id: 'c2',
    name: 'Sneha Rao',
    role: 'Principal Cloud Architect',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    phone: '+91 98765 24680',
    type: 'mentor',
    initialSpeech: 'Hello Surya! Great to hear from you. I saw your system design portfolio. Let us walk through how you would scale your distributed queue during interview scenarios.'
  },
  {
    id: 'c3',
    name: 'Dr. K. Ramanathan',
    role: 'Dean & Head of Placements',
    company: 'Apex Institute of Technology',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    phone: '+91 98765 13579',
    type: 'faculty',
    initialSpeech: 'Greetings Surya! I am reviewing your placement profile. Your academic records and technical skills look solid for upcoming Day-1 marquee recruiters.'
  },
  {
    id: 'c4',
    name: 'Apex AI Voice Career Advisor',
    role: 'Autonomous Placement Coach',
    company: 'CareerSync AI',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    phone: 'Toll-Free 1800-SYNC-CAREER',
    type: 'ai',
    initialSpeech: 'Hello Surya! I am your AI career voice coach. I have analyzed your target career role and identified skill gaps. What would you like to practice today?'
  }
];

export const PhoneCallModal: React.FC = () => {
  const {
    isPhoneCallOpen,
    setIsPhoneCallOpen,
    activeCallContact,
    setActiveCallContact,
    setIsMessagesOpen,
    activeCareerRole
  } = useApp();

  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedDigits, setDialedDigits] = useState('');
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [speechTranscript, setSpeechTranscript] = useState<Array<{ sender: string; text: string; time: string }>>([]);

  // Resolve current active contact
  const activePreset = PRESET_CONTACTS.find(c => c.name === activeCallContact?.name) || PRESET_CONTACTS[0];
  const contactName = activeCallContact?.name || activePreset.name;
  const contactRole = activeCallContact?.role || activePreset.role;
  const contactAvatar = activeCallContact?.avatar || activePreset.avatar;
  const contactPhone = activeCallContact?.phone || activePreset.phone;

  // Ringing sound effect interval ref
  const ringIntervalRef = useRef<number | null>(null);

  // Initialize or reset call on open
  useEffect(() => {
    if (!isPhoneCallOpen) {
      setCallStatus('ringing');
      setCallDuration(0);
      setIsMuted(false);
      setIsVideoOn(false);
      setShowKeypad(false);
      setDialedDigits('');
      return;
    }

    // Start ringing
    setCallStatus('ringing');
    setCallDuration(0);
    playPhoneSound('ring');

    ringIntervalRef.current = window.setInterval(() => {
      playPhoneSound('ring');
    }, 2800);

    // Auto-connect after 3.2 seconds
    const connectTimer = window.setTimeout(() => {
      if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
      playPhoneSound('connect');
      setCallStatus('connected');
      const initialText = activePreset.initialSpeech;
      setCurrentSpeech(initialText);
      setSpeechTranscript([
        {
          sender: contactName,
          text: initialText,
          time: '00:01'
        }
      ]);
    }, 3200);

    return () => {
      if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
      clearTimeout(connectTimer);
    };
  }, [isPhoneCallOpen, contactName, activePreset.initialSpeech]);

  // Duration timer when connected
  useEffect(() => {
    if (callStatus !== 'connected') return;

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus]);

  if (!isPhoneCallOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    playPhoneSound('hangup');
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    setCallStatus('ended');
  };

  const handleRedial = () => {
    setCallStatus('ringing');
    setCallDuration(0);
    playPhoneSound('ring');
    setTimeout(() => {
      playPhoneSound('connect');
      setCallStatus('connected');
    }, 2500);
  };

  const handleKeypadPress = (digit: string) => {
    playPhoneSound('dtmf', digit);
    setDialedDigits(prev => prev + digit);
  };

  const handleTopicQuestion = (topicText: string) => {
    const timeStr = formatTimer(callDuration);
    let reply = '';

    if (topicText.includes('resume')) {
      reply = `Regarding your resume: Your ${activeCareerRole.title} projects and verified certifications give you strong positioning. Focus on explaining your architectural trade-offs clearly.`;
    } else if (topicText.includes('interview')) {
      reply = `Our interview format consists of 45 mins live problem solving (Data Structures, Algorithms) followed by 15 mins reviewing your system design and team collaboration experience.`;
    } else if (topicText.includes('skill') || topicText.includes('gaps')) {
      reply = `You have great momentum! Completing the online courses tagged with "⚡ Bridges Gap" in CareerSync will ensure you clear our ATS screening with full marks.`;
    } else if (topicText.includes('stipend') || topicText.includes('culture')) {
      reply = `TechNova offers a competitive ₹45,000/month internship stipend with full-time conversion packages between ₹14-18 LPA, including hybrid flexibility.`;
    } else {
      reply = `That is an excellent question, Surya. Let's make sure you practice mock scenarios on the CareerSync assessment portal before our final evaluation.`;
    }

    setSpeechTranscript(prev => [
      ...prev,
      { sender: 'You', text: topicText, time: timeStr },
      { sender: contactName, text: reply, time: formatTimer(callDuration + 1) }
    ]);
    setCurrentSpeech(reply);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden flex flex-col text-white relative">
        
        {/* Top Control Bar */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${callStatus === 'connected' ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${callStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {callStatus === 'ringing' && 'Ringing & Connecting...'}
              {callStatus === 'connected' && `HD Voice Call • ${formatTimer(callDuration)}`}
              {callStatus === 'ended' && 'Call Disconnected'}
            </span>
          </div>

          <button
            onClick={() => setIsPhoneCallOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Switcher Strip */}
        <div className="px-4 py-2.5 bg-slate-950/30 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">Call Contact:</span>
          {PRESET_CONTACTS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setActiveCallContact({
                  name: preset.name,
                  role: preset.role,
                  avatar: preset.avatar,
                  phone: preset.phone,
                  company: preset.company
                });
                if (callStatus === 'ended') {
                  setCallStatus('ringing');
                  setCallDuration(0);
                  playPhoneSound('ring');
                }
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                contactName === preset.name
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <img src={preset.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
              <span>{preset.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Caller Avatar & Identity Area */}
        <div className="p-6 flex flex-col items-center text-center space-y-3">
          {/* Avatar with Animated Pulse Waves */}
          <div className="relative my-2">
            {callStatus === 'ringing' && (
              <>
                <div className="absolute -inset-3 rounded-full bg-blue-500/20 animate-ping" />
                <div className="absolute -inset-6 rounded-full bg-indigo-500/10 animate-pulse" />
              </>
            )}
            {callStatus === 'connected' && (
              <div className="absolute -inset-2 rounded-full bg-emerald-500/25 animate-pulse" />
            )}
            <img
              src={contactAvatar}
              alt={contactName}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 transition-all relative z-10 shadow-xl ${
                callStatus === 'connected' ? 'border-emerald-500 shadow-emerald-500/20' : 'border-blue-500'
              }`}
            />
            {callStatus === 'connected' && (
              <span className="absolute bottom-1 right-1 z-20 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                <Radio className="w-3 h-3 text-white" />
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl font-black text-white">{contactName}</h2>
            <p className="text-xs text-blue-400 font-semibold mt-0.5">{contactRole}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{contactPhone}</p>
          </div>

          {/* Connected Audio Waveform Visualizer */}
          {callStatus === 'connected' && (
            <div className="flex items-center gap-1.5 h-6 my-1">
              {[40, 75, 100, 60, 90, 45, 80, 55, 95, 30].map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%`, animationDelay: `${i * 0.1}s` }}
                  className="w-1 bg-emerald-400 rounded-full animate-pulse transition-all"
                />
              ))}
              <span className="text-[11px] text-emerald-400 font-bold ml-2">Active Audio</span>
            </div>
          )}

          {callStatus === 'ringing' && (
            <div className="py-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold">
                <Radio className="w-3.5 h-3.5 animate-spin" />
                Establishing End-to-End Secure Call...
              </span>
            </div>
          )}
        </div>

        {/* Video Camera Viewfinder (if video enabled) */}
        {isVideoOn && callStatus === 'connected' && (
          <div className="mx-6 mb-4 p-3 bg-slate-950 rounded-2xl border border-slate-800 relative">
            <div className="aspect-video w-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative">
              <img
                src={contactAvatar}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-white flex items-center gap-1">
                <Video className="w-3 h-3 text-emerald-400" />
                HD Video Feed
              </div>
              <div className="absolute bottom-2 right-2 w-20 h-14 rounded-lg border-2 border-emerald-400 overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Live Speaking Dialogue Transcript (When Connected) */}
        {callStatus === 'connected' && (
          <div className="px-6 pb-2 space-y-2">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-xs text-slate-200 leading-relaxed shadow-inner">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Live Spoken Dialogue
              </div>
              <p className="italic">"{currentSpeech}"</p>
            </div>

            {/* Quick Discussion Topic Prompts */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ask on Call:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleTopicQuestion('Can we review my resume strengths and capstone?')}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-left rounded-xl text-[11px] font-semibold text-slate-200 transition-colors truncate cursor-pointer"
                >
                  📄 Review my resume
                </button>
                <button
                  onClick={() => handleTopicQuestion('What is the technical interview format and coding rounds?')}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-left rounded-xl text-[11px] font-semibold text-slate-200 transition-colors truncate cursor-pointer"
                >
                  💻 Interview format
                </button>
                <button
                  onClick={() => handleTopicQuestion('Which online courses will best bridge my skill gaps?')}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-left rounded-xl text-[11px] font-semibold text-slate-200 transition-colors truncate cursor-pointer"
                >
                  ⚡ Bridge skill gaps
                </button>
                <button
                  onClick={() => handleTopicQuestion('Can you share details on the stipend and team culture?')}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-left rounded-xl text-[11px] font-semibold text-slate-200 transition-colors truncate cursor-pointer"
                >
                  💼 Stipend &amp; culture
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dial Keypad Overlay (If opened) */}
        {showKeypad && callStatus !== 'ended' && (
          <div className="px-6 py-2 bg-slate-950/70 border-t border-slate-800">
            <div className="text-center font-mono text-lg font-bold text-blue-400 tracking-widest h-7">
              {dialedDigits || 'Enter Keypad Extension'}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleKeypadPress(d)}
                  className="h-10 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-white text-base shadow-xs transition-colors cursor-pointer"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Post-Call Summary View (When Ended) */}
        {callStatus === 'ended' && (
          <div className="px-6 py-4 space-y-4">
            <div className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Call Summary Saved
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] block">Duration:</span>
                  <span className="font-mono font-bold text-white">{formatTimer(callDuration)}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Quality:</span>
                  <span className="font-bold text-emerald-400">HD Lossless 48kHz</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 pt-1">
                Notes: Discussed {activeCareerRole.title} requirements, capstone review, and interview readiness tips with {contactName}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsPhoneCallOpen(false);
                  setIsMessagesOpen(true);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                Send Follow-up Message
              </button>
              <button
                onClick={handleRedial}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Redial
              </button>
            </div>
          </div>
        )}

        {/* In-Call Action Control Buttons */}
        {callStatus !== 'ended' && (
          <div className="p-5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-around gap-2">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-full transition-all cursor-pointer ${
                isMuted
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Keypad Toggle Button */}
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className={`p-3.5 rounded-full transition-all cursor-pointer ${
                showKeypad
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title="Keypad"
            >
              <Grid className="w-5 h-5" />
            </button>

            {/* Speaker Button */}
            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-3.5 rounded-full transition-all cursor-pointer ${
                isSpeakerOn
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Video Toggle Button */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3.5 rounded-full transition-all cursor-pointer ${
                isVideoOn
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* End Call Button (Big Red) */}
            <button
              onClick={handleEndCall}
              className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all hover:scale-105 cursor-pointer"
              title="End Call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
