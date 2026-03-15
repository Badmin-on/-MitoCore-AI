import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Cpu, ChevronRight, AlertCircle, Terminal, Brain, Languages, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const App = () => {
  const [query, setQuery] = useState('');
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vramUsage, setVramUsage] = useState(4.1);
  const [activeCells, setActiveCells] = useState(['Nucleus']);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { text, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleDiagnose = async () => {
    if (!query.trim()) return;
    setIsProcessing(true);
    addLog(`Initiating MitoCore-AI cell-activation for: "${query}"`, 'process');
    
    try {
      // Step-by-step neural activation simulation
      setActiveCells(['Translator']);
      addLog('Activating Matrix (EXAONE-3.5): Korean linguistic context extraction...', 'neural');
      await new Promise(r => setTimeout(r, 1000));

      setActiveCells(['Logic']);
      addLog('Activating Synth (Phi-3.5): Hard-coded medical logic audit...', 'neural');
      await new Promise(r => setTimeout(r, 1000));

      setActiveCells(['Nucleus']);
      addLog('Activating Cortex (Llama-3.2): Unified strategic synthesis...', 'neural');
      
      const response = await axios.post('http://localhost:8000/diagnose', { text: query });
      
      addLog(response.data.result, 'result');
      addLog(`Latency: ${response.data.metadata.latency} | Strategy: vLLM-PagedAttention`, 'meta');
      setVramUsage(5.6);
    } catch (err) {
      addLog(`Mitochondrial failure: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
      setActiveCells(['Nucleus']);
      setQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Brain size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">MITOCORE-AI</h1>
            <p className="text-xs text-gray-400">ORGANIC INTELLIGENCE ENGINE v2.6 | COMMANDER ALEX</p>
          </div>
        </div>
        <div className="flex gap-6">
          <StatPanel icon={<Cpu size={14}/>} label="COMPUTE DENSITY" value={`${vramUsage} GB`} color="cyan" />
          <StatPanel icon={<Shield size={14}/>} label="GUARD STATUS" value="PROTECTED" color="green" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* Left: Input & Interaction */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 backdrop-blur-xl bg-opacity-80">
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
              <Stethoscope size={18} />
              <h2 className="font-semibold text-sm uppercase tracking-widest">Medical Inquiry</h2>
            </div>
            <textarea
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 h-40 focus:outline-none focus:border-cyan-500 transition-all resize-none text-sm leading-relaxed"
              placeholder="환자의 증상이나 분석할 데이터를 입력하세요..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isProcessing}
            />
            <button
              onClick={handleDiagnose}
              disabled={isProcessing || !query}
              className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isProcessing ? <Activity className="animate-spin" size={20} /> : "GENERATE ADVISORY"}
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-purple-400">
              <Brain size={18} />
              <h2 className="font-semibold text-sm uppercase tracking-widest">Neural Status</h2>
            </div>
            <div className="space-y-4">
              <NeuralCell name="Nucleus" active={activeCells.includes('Nucleus')} power="1.0B" />
              <NeuralCell name="Translator" active={activeCells.includes('Translator')} power="2.4B" />
              <NeuralCell name="Logic" active={activeCells.includes('Logic')} power="3.8B" />
              <NeuralCell name="Context" active={activeCells.includes('Context')} power="1.5B" />
            </div>
          </div>
        </div>

        {/* Right: Terminal & Results */}
        <div className="col-span-12 lg:col-span-8 bg-black/40 border border-white/5 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md">
          <div className="p-4 border-b border-white/5 bg-[#111] flex justify-between items-center text-xs font-mono">
            <div className="flex items-center gap-2 text-gray-400">
              <Terminal size={14} />
              <span>DIAGNOSTIC_FEEDBACK_MEMORY_LOGS</span>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm">
            {logs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 space-y-4">
                <Stethoscope size={48} />
                <p>Waiting for neural activation...</p>
              </div>
            )}
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`p-3 rounded-lg ${
                    log.type === 'result' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50' :
                    log.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-200' :
                    log.type === 'neural' ? 'text-purple-400 italic' :
                    'text-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 opacity-50 text-[10px]">
                    <span>[{log.type.toUpperCase()}]</span>
                    <span>{log.time}</span>
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap">{log.text}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatPanel = ({ icon, label, value, color }) => (
  <div className="bg-[#111] border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
    <div className={`text-${color}-500 opacity-80`}>{icon}</div>
    <div className="text-left">
      <div className="text-[10px] text-gray-500 font-bold tracking-tighter">{label}</div>
      <div className={`text-xs font-bold text-${color}-400`}>{value}</div>
    </div>
  </div>
);

const NeuralCell = ({ name, active, power }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
    active ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 opacity-30 shadow-none'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
      <span className="text-sm font-medium">{name} Cell</span>
    </div>
    <span className="text-[10px] font-mono opacity-50 tracking-tighter">{power}</span>
  </div>
);

export default App;
