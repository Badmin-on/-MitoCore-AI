import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Cpu, ChevronRight, AlertCircle, Terminal, Brain, Settings, Zap, Dna, Activity as PulseIcon, Globe, Lock, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './index.css';

// @service[MitoCoreUI] layer:FRONTEND
const App = () => {
  const [query, setQuery] = useState('');
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hwProfile, setHwProfile] = useState(null);
  const [activeModels, setActiveModels] = useState({});
  const [activeCells, setActiveCells] = useState(['Nucleus']);
  const [showConfig, setShowConfig] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8000/status');
      setHwProfile(res.data.profile);
      setActiveModels(res.data.models);
    } catch (err) {
      console.error("Failed to fetch status:", err);
    }
  };

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { text, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleUpdateConfig = async (cell, model) => {
    const newModels = { ...activeModels, [cell]: model };
    try {
      await axios.post('http://localhost:8000/config/models', newModels);
      setActiveModels(newModels);
      addLog(`Neural Re-Link: ${cell} → ${model}`, 'neural');
    } catch (err) {
      addLog(`Sync error: ${err.message}`, 'error');
    }
  };

  const handleDiagnose = async () => {
    if (!query.trim()) return;
    setIsProcessing(true);
    addLog(`Activating Mitochondrial Core [Tier: ${hwProfile?.tier}]`, 'process');
    
    try {
      setActiveCells(['Translator']);
      addLog(`[MATRIX] Extraction initiated: ${activeModels.Matrix}`, 'neural');
      await new Promise(r => setTimeout(r, 600));

      setActiveCells(['Logic']);
      addLog(`[SYNTH] Cross-verification: ${activeModels.Synth}`, 'neural');
      await new Promise(r => setTimeout(rOffset => rOffset, 600));

      setActiveCells(['Nucleus']);
      addLog(`[CORTEX] Final fusion active: ${activeModels.Cortex}`, 'neural');
      
      const response = await axios.post('http://localhost:8000/diagnose', { text: query });
      
      addLog(response.data.result, 'result');
      addLog(`Intelligence Density: ${response.data.metadata.latency} latency | vLLM Engine`, 'meta');
    } catch (err) {
      addLog(`Biological boundary breach: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
      setActiveCells(['Nucleus']);
      setQuery('');
      fetchStatus();
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#f8fafc] flex flex-col font-sans p-6 lg:p-10 relative overflow-hidden">
      <div className="neural-background" />
      <div className="glow-orb" style={{ top: '-10%', right: '-10%' }} />
      <div className="glow-orb" style={{ bottom: '-10%', left: '-10%', background: 'var(--purple-glow)' }} />

      {/* Premium Header */}
      <header className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-8 z-10">
        <div className="flex items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.5)] border border-white/20"
          >
            <Brain size={32} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              MITOCORE-AI
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-cyan-400 opacity-80">
                {hwProfile?.gpu_name || 'NEURAL_SCANNING'}
              </span>
              <div className="h-px w-8 bg-white/10" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Globe size={10} /> GLOBAL_BRAIN_V2.6
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <StatComponent icon={<Cpu size={14} />} label="VRAM_LOAD" value={`${hwProfile?.vram_free_gb || 0}GB`} sub={`${hwProfile?.vram_total_gb || 0}GB`} color="cyan" />
          <StatComponent icon={<Shield size={14} />} label="BIO_TIER" value={hwProfile?.tier || '...'} sub="OPTIMIZED" color="purple" />
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${showConfig ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 'glass-panel text-gray-400 hover:bg-white/5'}`}
          >
            <Settings size={22} className={showConfig ? 'animate-spin-slow' : ''} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-10 overflow-hidden z-10">
        <AnimatePresence>
          {showConfig && (
            <motion.aside 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full lg:w-96 glass-panel p-8 flex flex-col gap-10 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-cyan-400 flex items-center gap-3 tracking-[0.3em]">
                  <Terminal size={16}/> CONFIGURATION
                </h2>
                <div className="flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                </div>
              </div>
              
              <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(activeModels).map(([cell, model]) => (
                  <div key={cell} className="group relative">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 block opacity-60 group-hover:opacity-100 transition-opacity">
                      {cell} Specialization
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={model} 
                        onChange={(e) => handleUpdateConfig(cell, e.target.value)}
                        className="w-full bg-black/60 border border-white/5 rounded-xl p-4 text-xs text-white outline-none focus:border-cyan-500/50 hover:bg-black/90 transition-all font-mono"
                      />
                      <Zap size={10} className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/30" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-3xl border border-cyan-500/20">
                <div className="flex gap-4 items-start">
                  <Activity size={20} className="text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-cyan-400 font-black tracking-widest uppercase">VIRAL_OPTIMIZATION</p>
                    <p className="text-[10px] text-gray-400 mt-2 leading-relaxed font-bold">
                      PagedAttention serving enabled. 8GB VRAM is now 400% more efficient than static loading.
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <section className="flex-1 grid grid-cols-12 gap-10 overflow-hidden">
          {/* Main Inquiry Panel */}
          <div className="col-span-12 xl:col-span-5 flex flex-col gap-8 h-full">
            <motion.div 
              layout
              className="glass-panel p-10 flex flex-col flex-1 shadow-2xl relative group"
            >
              <div className="flex items-center justify-between mb-8 text-gray-500">
                <div className="flex items-center gap-3">
                  <Dna size={20} className="group-hover:text-cyan-400 transition-colors" />
                  <h2 className="text-xs font-black uppercase tracking-[0.5em]">Neural Prompt</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={12} />
                  <span className="text-[10px] font-bold">LOCAL_ONLY</span>
                </div>
              </div>

              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Submit symptoms, code, or research data..."
                className="w-full flex-1 bg-transparent border-none text-xl lg:text-2xl text-white placeholder-white/10 outline-none transition-all resize-none font-medium leading-relaxed"
              />

              <div className="mt-8 flex items-center justify-between gap-6">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020202] bg-gray-800 flex items-center justify-center text-[8px] font-bold">
                      SLM
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-[#020202] bg-cyan-500 text-black flex items-center justify-center text-[10px] font-black shadow-lg">
                    {Object.keys(activeModels).length || 0}
                  </div>
                </div>

                <button 
                  onClick={handleDiagnose}
                  disabled={isProcessing || !query.trim()}
                  className={`px-10 py-5 rounded-2xl font-black text-sm tracking-[0.5em] transition-all flex items-center justify-center gap-4 active:scale-95 ${
                    isProcessing 
                    ? 'bg-white/5 text-gray-600 grayscale cursor-not-allowed' 
                    : 'bg-[#f8fafc] text-black hover:bg-cyan-500 hover:text-black shadow-[0_20px_50px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  {isProcessing ? 'PROCESSING' : 'ACTIVATE CORE'}
                  {!isProcessing && <Zap size={18} fill="currentColor" />}
                </button>
              </div>
            </motion.div>

            {/* Neural Topology */}
            <div className="glass-panel p-8">
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mb-8 flex justify-between">
                INTELLIGENCE_TOPOLOGY
                <span className="text-cyan-500">ACTIVE</span>
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <CellNode name="MATRIX" active={activeCells.includes('Translator')} icon={<Globe size={14}/>} />
                <CellNode name="SYNTH" active={activeCells.includes('Logic')} icon={<Shield size={14}/>} />
                <CellNode name="CORTEX" active={activeCells.includes('Nucleus')} icon={<Brain size={14}/>} />
              </div>
            </div>
          </div>

          {/* Results Stream */}
          <div className="col-span-12 xl:col-span-7 flex flex-col overflow-hidden h-full">
            <div className="glass-panel flex-1 flex flex-col overflow-hidden relative">
              <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <PulseIcon size={18} className="text-cyan-500" />
                    <div className="absolute inset-0 bg-cyan-500 blur-md opacity-50 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/50">Bio-Signaling Stream</span>
                </div>
                <div className="flex gap-4">
                   <button className="text-gray-500 hover:text-white transition-colors"><Share2 size={16}/></button>
                   <div className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-black rounded-full border border-purple-500/20">AGENTIC_V2.6</div>
                </div>
              </div>
              
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-10">
                    <Brain size={120} className="mb-10 animate-pulse text-gray-500" />
                    <p className="text-sm font-black uppercase tracking-[1em] text-center ml-4">NEURAL_VOID</p>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`relative group ${log.type === 'result' ? 'mb-12' : ''}`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                         <div className={`w-1 h-4 rounded-full ${
                           log.type === 'error' ? 'bg-red-500' : 
                           log.type === 'neural' ? 'bg-purple-500' :
                           log.type === 'result' ? 'bg-cyan-500' : 'bg-gray-700'
                         }`} />
                         <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${
                           log.type === 'error' ? 'text-red-400' : 
                           log.type === 'neural' ? 'text-purple-400' :
                           log.type === 'result' ? 'text-cyan-400' : 'text-gray-500'
                         }`}>
                           {log.type} // {log.time}
                         </span>
                      </div>
                      <div className={`text-base leading-relaxed ${log.type === 'result' ? 'text-[#f8fafc] font-semibold bg-white/[0.03] p-8 rounded-3xl border border-white/5 shadow-inner' : 'text-gray-400 pl-5'}`}>
                        {log.text}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const StatComponent = ({ icon, label, value, sub, color }) => (
  <div className="glass-panel px-6 py-3 flex items-center gap-5 group hover:bg-white/[0.05] transition-all cursor-default">
    <div className={`text-${color}-500 group-hover:scale-110 transition-transform`}>{icon}</div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-black text-white">{value}</span>
        <span className="text-[9px] font-bold text-gray-600">/ {sub}</span>
      </div>
    </div>
  </div>
);

const CellNode = ({ name, active, icon }) => (
  <div className={`flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all duration-700 ${
    active ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-transparent border-white/5 opacity-20 filter grayscale'
  }`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-gray-600'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-black tracking-widest ${active ? 'text-white' : 'text-gray-600'}`}>{name}</span>
    {active && <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />}
  </div>
);

export default App;
