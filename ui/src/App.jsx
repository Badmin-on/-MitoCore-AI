import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Cpu, ChevronRight, AlertCircle, Terminal, Brain, Settings, Zap, Dna, Activity as PulseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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
      addLog(`Neural Link Updated: ${cell} → ${model}`, 'neural');
    } catch (err) {
      addLog(`Configuration failed: ${err.message}`, 'error');
    }
  };

  const handleDiagnose = async () => {
    if (!query.trim()) return;
    setIsProcessing(true);
    addLog(`Initiating MitoCore-AI [Tier: ${hwProfile?.tier}] for: "${query}"`, 'process');
    
    try {
      setActiveCells(['Translator']);
      addLog(`Activating Matrix (${activeModels.Matrix}): Context extraction...`, 'neural');
      await new Promise(r => setTimeout(r, 800));

      setActiveCells(['Logic']);
      addLog(`Activating Synth (${activeModels.Synth}): Logic verification...`, 'neural');
      await new Promise(r => setTimeout(rOffset => rOffset, 800));

      setActiveCells(['Nucleus']);
      addLog(`Activating Cortex (${activeModels.Cortex}): Strategic synthesis...`, 'neural');
      
      const response = await axios.post('http://localhost:8000/diagnose', { text: query });
      
      addLog(response.data.result, 'result');
      addLog(`Latency: ${response.data.metadata.latency} | Efficiency: vLLM-Optimized`, 'meta');
    } catch (err) {
      addLog(`Neural fracture: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
      setActiveCells(['Nucleus']);
      setQuery('');
      fetchStatus();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Header Dashboard */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-cyan-400/50">
            <Brain size={28} className="text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic">MITOCORE-AI</h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] uppercase opacity-70">
              {hwProfile?.gpu_name || 'NEURAL_SCAN_IN_PROGRESS'}
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <StatPanel icon={<Cpu size={14}/>} label="VRAM" value={`${hwProfile?.vram_free_gb || 0} / ${hwProfile?.vram_total_gb || 0} GB`} color="cyan" />
          <StatPanel icon={<Shield size={14}/>} label="TIER" value={hwProfile?.tier || '...'} color="green" />
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`p-3 rounded-xl border transition-all ${showConfig ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden relative">
        <AnimatePresence>
          {showConfig && (
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-80 bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 flex flex-col gap-8 shadow-2xl z-20"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-cyan-400 flex items-center gap-2 tracking-widest">
                  <Terminal size={14}/> NEURAL CONFIG
                </h2>
                <div className="text-[9px] bg-green-500/10 text-green-400 px-2 py-1 rounded-full font-bold">AUTO_SYNC</div>
              </div>
              
              <div className="space-y-6">
                {Object.entries(activeModels).map(([cell, model]) => (
                  <div key={cell} className="space-y-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-cyan-500/30 transition-all">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block">{cell} Specialist</label>
                    <input 
                      type="text" 
                      value={model} 
                      onChange={(e) => handleUpdateConfig(cell, e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-cyan-200 outline-none focus:border-cyan-500 group-hover:bg-black/80 transition-all font-mono"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-auto p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 flex gap-4 items-start">
                <Zap size={18} className="text-cyan-400 shrink-0 mt-1" />
                <div>
                  <p className="text-[10px] text-cyan-400 font-black tracking-widest uppercase">VLLM NUCLEUS</p>
                  <p className="text-[9px] text-gray-400 mt-1 leading-relaxed font-bold">PagedAttention & Continuous Batching are enforcing zero-latency memory swaps for the {hwProfile?.tier} suite.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Interaction Area */}
        <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
          {/* Input Panel */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-8 flex flex-col shadow-inner">
              <div className="flex items-center gap-3 mb-6 text-gray-500">
                <Dna size={18} />
                <h2 className="text-xs font-black uppercase tracking-[0.3em]">Genetic Inquiry</h2>
              </div>
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Submit medical scenario or intelligence prompt..."
                className="w-full flex-1 bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-gray-200 focus:border-cyan-500/30 outline-none transition-all resize-none min-h-[240px] leading-relaxed"
              />
              <button 
                onClick={handleDiagnose}
                disabled={isProcessing || !query.trim()}
                className={`w-full mt-6 py-5 rounded-2xl font-black text-sm tracking-[0.4em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                  isProcessing 
                  ? 'bg-white/5 text-gray-600 grayscale cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-cyan-500 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]'
                }`}
              >
                {isProcessing ? 'CALCULATING...' : 'FIRE_NUCLEUS'}
                {!isProcessing && <Zap size={16} />}
              </button>
            </div>

            <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-8">
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-8">Cellular Propagation</h3>
              <div className="space-y-4">
                <CellStatus name="Matrix" active={activeCells.includes('Translator')} power={activeModels.Matrix} />
                <CellStatus name="Synth" active={activeCells.includes('Logic')} power={activeModels.Synth} />
                <CellStatus name="Cortex" active={activeCells.includes('Nucleus')} power={activeModels.Cortex} />
              </div>
            </div>
          </div>

          {/* Logs Stream */}
          <div className="col-span-12 lg:col-span-8 flex flex-col overflow-hidden">
            <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl">
              <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-3">
                  <PulseIcon size={16} className="text-cyan-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Neutral Signaling Stream</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full uppercase">8GB Optimized</div>
                </div>
              </div>
              
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-30">
                    <Activity size={64} className="mb-6 animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-[0.5em]">Awaiting Genetic Signal...</p>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`group border-l-[3px] transition-all pl-6 py-2 ${
                        log.type === 'error' ? 'border-red-500 bg-red-500/5' : 
                        log.type === 'neural' ? 'border-purple-500 bg-purple-500/5' :
                        log.type === 'result' ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-baseline mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          log.type === 'error' ? 'text-red-400' : 
                          log.type === 'neural' ? 'text-purple-400' :
                          log.type === 'result' ? 'text-cyan-400' : 'text-gray-500'
                        }`}>
                          {log.type}
                        </span>
                        <span className="text-[9px] text-gray-600 font-mono font-bold tracking-tighter opacity-50">{log.time}</span>
                      </div>
                      <p className={`text-sm leading-relaxed ${log.type === 'result' ? 'text-gray-100 font-medium' : 'text-gray-400 underline-offset-4 decoration-white/5'}`}>
                        {log.text}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatPanel = ({ icon, label, value, color }) => (
  <div className="bg-white/5 border border-white/5 pl-4 pr-6 py-2 rounded-2xl flex items-center gap-4 backdrop-blur-md">
    <div className={`text-${color}-500 opacity-60`}>{icon}</div>
    <div>
      <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{label}</div>
      <div className="text-xs font-black text-gray-200 tracking-tight">{value}</div>
    </div>
  </div>
);

const CellStatus = ({ name, active, power }) => (
  <div className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${
    active ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-transparent border-white/5 opacity-20'
  }`}>
    <div className="flex items-center gap-4">
      <div className={`w-3 h-3 rounded-full ${active ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-gray-700'}`} />
      <span className={`text-xs font-black tracking-widest uppercase ${active ? 'text-white' : 'text-gray-500'}`}>{name} Cell</span>
    </div>
    <span className="text-[9px] font-mono text-cyan-400/50 font-bold tracking-tighter overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">{power?.split(':')[0]}</span>
  </div>
);

export default App;
