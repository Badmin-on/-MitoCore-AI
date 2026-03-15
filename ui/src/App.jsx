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
    <div className="flex h-screen w-full bg-[#0d0d0d] text-white">
      {/* Sidebar - GPT Style */}
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={() => setMessages([])}>
          <Plus size={18} />
          <span>New Session</span>
        </button>
        
        <div className="flex-1 space-y-2 overflow-y-auto">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-2 mb-4">MitoCore Streams</div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-default border border-white/5">
            <MessageSquare size={16} className="text-cyan-400" />
            <span className="text-sm font-medium truncate">Medical Reasoning Unit</span>
          </div>
        </div>

        {/* Hardware Footer */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Cpu size={14} />
              <span>{hwProfile?.gpu_name?.split(' ')[0] || 'GPU'}</span>
            </div>
            <span className="text-cyan-400 font-bold">{hwProfile?.tier}</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(hwProfile?.vram_free_gb / hwProfile?.vram_total_gb) * 100}%` }}
              className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
            />
          </div>
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-white">
              <Settings size={16} />
              <span>Settings</span>
            </div>
            <Maximize2 size={12} className="text-gray-600" />
          </button>
        </div>
      </aside>

      {/* Main Chat Container */}
      <main className="chat-container">
        {/* Header Overlay */}
        <header className="absolute top-0 left-0 right-0 p-4 flex justify-center z-10">
          <div className="bg-[#050505]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 flex gap-4 text-[10px] font-bold tracking-widest text-gray-500">
            <span className="flex items-center gap-2">
              <Server size={12} className="text-green-500" /> LOCAL_ENGINE
            </span>
            <div className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-2 text-cyan-400">
              <Brain size={12} /> MITOCORE_ORCHESTRATOR
            </span>
          </div>
        </header>

        <div ref={scrollRef} className="messages-stream">
          {messages.length === 0 && !currentStep && (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20 mt-20">
              <Brain size={64} className="mb-6" />
              <h2 className="text-2xl font-black tracking-tighter italic">MITOCORE-AI</h2>
              <p className="text-xs font-bold tracking-[0.3em] mt-2">ORGANIC INTELLIGENCE FUSION</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`message-wrapper ${msg.role === 'assistant' ? 'bg-white/[0.02]' : ''}`}>
              <div className={`message-avatar ${msg.role === 'user' ? 'user-avatar' : 'ai-avatar'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Brain size={18} className="text-black" />}
              </div>
              <div className="message-content">
                <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mb-1">
                  {msg.role === 'user' ? 'Commander Alex' : 'MitoCore Nucleus'}
                </div>
                {msg.content}
                {msg.metadata && (
                  <div className="mt-4 flex gap-4 text-[9px] font-bold text-gray-500 border-t border-white/5 pt-3">
                    <span className="text-cyan-500">LATENCY: {msg.metadata.latency}</span>
                    <span>ENGINE: VLLM_PAGED_ATTENTION</span>
                    <span className="uppercase">SUITE: {msg.metadata.tier}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Neural Progression Status (Inline) */}
          {currentStep && (
            <div className="message-wrapper bg-white/[0.02]">
              <div className="message-avatar ai-avatar">
                <Brain size={18} className="text-black" />
              </div>
              <div className="message-content">
                <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mb-2">MitoCore Nucleus</div>
                <div className="neural-status-indicator">
                  <div className="status-dot">
                    <div className={`dot ${currentStep === 'Matrix' ? 'active' : ''} ${currentStep !== 'Matrix' && currentStep !== null ? 'bg-cyan-500' : ''}`} />
                    <span>MATRIX_SCAN</span>
                  </div>
                  <div className="status-dot">
                    <div className={`dot ${currentStep === 'Synth' ? 'active' : ''} ${messages.length > 0 && currentStep === 'Cortex' ? 'bg-cyan-500' : ''}`} />
                    <span>SYNTH_VERIFY</span>
                  </div>
                  <div className="status-dot">
                    <div className={`dot ${currentStep === 'Cortex' ? 'active' : ''}`} />
                    <span>CORTEX_FUSION</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar - Pill Design */}
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
              placeholder="Ask MitoCore anything..."
              className="chat-input"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="send-btn"
            >
              <Send size={18} />
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
