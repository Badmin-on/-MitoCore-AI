import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  Cpu, 
  Shield, 
  Brain, 
  Send, 
  User, 
  Zap, 
  Check, 
  Maximize2,
  Terminal,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './index.css';

// @service[MitoCoreConversationalUI] layer:FRONTEND
const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hwProfile, setHwProfile] = useState(null);
  const [activeModels, setActiveModels] = useState({});
  const [showConfig, setShowConfig] = useState(false);
  const [currentStep, setCurrentStep] = useState(null); // 'Matrix', 'Synth', 'Cortex'
  
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentStep]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8000/status');
      setHwProfile(res.data.profile);
      setActiveModels(res.data.models);
    } catch (err) {
      console.error("Status check failed:", err);
    }
  };

  const adjustTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);
    
    try {
      // Step-by-step neural progression
      setCurrentStep('Matrix');
      await new Promise(r => setTimeout(r, 800));
      
      setCurrentStep('Synth');
      await new Promise(r => setTimeout(rOffset => rOffset, 800));
      
      setCurrentStep('Cortex');
      const response = await axios.post('http://localhost:8000/diagnose', { text: userMsg });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.result,
        metadata: response.data.metadata 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'error', content: `Neural fracture: ${err.message}` }]);
    } finally {
      setIsProcessing(false);
      setCurrentStep(null);
      fetchStatus();
    }
  };

  return (
    <div className="flex h-screen w-full text-white relative">
      {/* Ambient Viral Elements */}
      <div className="ambient-bg" />
      <div className="glow-orb-top" />

      {/* Sidebar - Pro Style */}
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={() => setMessages([])}>
          <Plus size={16} />
          <span>New Session</span>
        </button>
        
        <div className="flex-1 space-y-2 overflow-y-auto mt-2">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 mb-4 opacity-70">Active Streams</div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-default border border-white/5 shadow-inner">
            <MessageSquare size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold truncate tracking-wide">MitoCore General</span>
          </div>
        </div>

        {/* Hardware Footer */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-5">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-gray-400 font-mono tracking-wide">
              <Cpu size={14} className="text-purple-400" />
              <span>{hwProfile?.gpu_name?.split(' ')[0] || 'GPU'}</span>
            </div>
            <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase border border-cyan-500/30 px-2 py-0.5 rounded-md bg-cyan-500/10">
              {hwProfile?.tier || 'SYNC'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(hwProfile?.vram_free_gb / hwProfile?.vram_total_gb) * 100}%` }}
              className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
            />
          </div>
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group"
          >
            <div className="flex items-center gap-3 text-sm font-medium text-gray-400 group-hover:text-white">
              <Settings size={16} />
              <span>Engine Settings</span>
            </div>
            <Maximize2 size={12} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
          </button>
        </div>
      </aside>

      {/* Main Chat Container */}
      <main className="chat-container">
        {/* Superior Glass Header */}
        <header className="chat-header">
          <div className="chat-header-pill">
            <span className="flex items-center gap-2 text-[#94a3b8]">
              <Server size={12} className="text-green-400" /> 
              VLLM_ENGINE
            </span>
            <div className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-2 text-cyan-400">
              <Brain size={12} /> 
              MITOCORE_ORCHESTRATOR
            </span>
          </div>
        </header>

        <div ref={scrollRef} className="messages-stream">
          {messages.length === 0 && !currentStep && (
            <div className="flex-1 flex flex-col items-center justify-center opacity-40 mt-10">
              <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
                 <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full" />
                 <Brain size={48} className="text-white relative z-10 drop-shadow-2xl" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter italic" style={{ fontFamily: 'Outfit, sans-serif' }}>MITOCORE-AI</h2>
              <p className="text-[10px] font-bold tracking-[0.4em] mt-3 text-cyan-100 uppercase">Organic Neural Fusion</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`message-wrapper ${msg.role === 'assistant' ? 'bg-white/[0.01] border-y border-white/[0.02]' : ''}`}>
              <div className={`message-avatar ${msg.role === 'user' ? 'user-avatar' : 'ai-avatar'}`}>
                {msg.role === 'user' ? <User size={16} className="text-gray-400" /> : <Brain size={18} className="text-black" />}
              </div>
              <div className="message-content">
                <div className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2 font-bold flex items-center gap-2">
                  {msg.role === 'user' ? 'Commander' : 'MitoCore Nucleus'}
                </div>
                {msg.content}
                {msg.metadata && (
                  <div className="meta-block">
                    <span className="text-cyan-400 flex items-center gap-2"><Zap size={10}/> {msg.metadata.latency}</span>
                    <span className="text-purple-400 border-l border-white/10 pl-4">{msg.metadata.tier} SUITE</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Neural Progression Status (Inline) */}
          {currentStep && (
            <div className="message-wrapper">
              <div className="message-avatar ai-avatar">
                <Brain size={18} className="text-black" />
              </div>
              <div className="message-content">
                <div className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-3 font-bold">MitoCore Nucleus</div>
                <div className="neural-status-indicator">
                  <div className={`status-dot ${currentStep === 'Matrix' ? 'text-white' : ''}`}>
                    <div className={`dot ${currentStep === 'Matrix' ? 'active' : ''} ${currentStep !== 'Matrix' && currentStep !== null ? 'bg-cyan-500 shadow-[0_0_8px_cyan]' : ''}`} />
                    <span>MATRIX_EXTRACT</span>
                  </div>
                  <div className={`status-dot ${currentStep === 'Synth' ? 'text-white' : ''}`}>
                    <div className={`dot ${currentStep === 'Synth' ? 'active' : ''} ${messages.length > 0 && currentStep === 'Cortex' ? 'bg-cyan-500 shadow-[0_0_8px_cyan]' : ''}`} />
                    <span>SYNTH_VERIFY</span>
                  </div>
                  <div className={`status-dot ${currentStep === 'Cortex' ? 'text-white' : ''}`}>
                    <div className={`dot ${currentStep === 'Cortex' ? 'active' : ''}`} />
                    <span>CORTEX_FUSION</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Premium Input Pill */}
        <footer className="input-container">
          <div className="input-pill">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextarea();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Inject neural directive..."
              className="chat-input"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="send-btn"
            >
              <Send size={16} strokeWidth={2.5} />
            </button>
          </div>
        </footer>
      </main>

      {/* Config Overlay (Sidebar-Style) */}
      <AnimatePresence>
        {showConfig && (hwProfile && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-80 bg-[#050505] border-l border-white/10 p-8 z-50 shadow-2xl flex flex-col gap-10"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-gray-500">Engine Settings</h2>
              <button onClick={() => setShowConfig(false)} className="text-gray-500 hover:text-white"><Plus size={18} className="rotate-45" /></button>
            </div>

            <div className="space-y-8">
              {Object.entries(activeModels).map(([cell, model]) => (
                <div key={cell} className="space-y-3">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{cell} Specialist</label>
                  <input 
                    type="text" 
                    value={model} 
                    onChange={(e) => handleUpdateConfig(cell, e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs font-mono text-cyan-200 outline-none focus:border-cyan-500/30"
                  />
                </div>
              ))}
            </div>

            <div className="mt-auto p-4 bg-cyan-500/5 rounded-2xl border border-white/5">
              <div className="flex gap-3 mb-2">
                <Zap size={14} className="text-cyan-400" />
                <span className="text-[10px] font-black tracking-widest">LOCAL_SOVEREIGNTY</span>
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed">
                Hardware: {hwProfile.gpu_name}<br/>
                Tier: {hwProfile.tier} Suite Active.
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const CellStatus = ({ name, active, power }) => (
  <div className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${
    active ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-transparent border-white/5 opacity-20'
  }`}>
    <div className="flex items-center gap-4">
      <div className={`w-3 h-3 rounded-full ${active ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-gray-700'}`} />
      <span className={`text-xs font-black tracking-widest uppercase ${active ? 'text-white' : 'text-gray-500'}`}>{name} Cell</span>
    </div>
    <span className="text-[9px] font-mono text-cyan-400/50 font-bold tracking-tighter">{power?.split(':')[0]}</span>
  </div>
);

export default App;
