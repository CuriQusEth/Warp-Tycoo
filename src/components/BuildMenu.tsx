import { useState } from 'react';
import { useGameStore, StationType } from '../store/gameStore';
import { Pickaxe, Component, Factory, Shield, Rocket, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STATION_OPTIONS: { type: StationType, icon: any, label: string, desc: string }[] = [
  { type: 'Extractor', icon: Pickaxe, label: 'Extractor', desc: 'Basic raw material income.' },
  { type: 'Warehouse', icon: Component, label: 'Warehouse', desc: 'Higher passive income.' },
  { type: 'Refinery', icon: Factory, label: 'Refinery', desc: 'Advanced resource processing.' },
  { type: 'Defense', icon: Shield, label: 'Defense Array', desc: 'Protects from dimensional instability.' },
];

export function BuildMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const buyStation = useGameStore(s => s.buyStation);
  const openWarpGate = useGameStore(s => s.openWarpGate);
  const prestige = useGameStore(s => s.prestige);
  const warpGates = useGameStore(s => s.warpGates);
  const credits = useGameStore(s => s.credits);

  const handleBuy = (type: StationType) => {
    // Drop in center slightly randomized
    const x = window.innerWidth / 2 - 40 + (Math.random() * 60 - 30);
    const y = window.innerHeight / 2 - 40 + (Math.random() * 60 - 30);
    if (credits >= 100) {
       buyStation(x, y, type);
       if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(50);
       }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 border border-slate-700 border-b-0 px-6 py-2 rounded-t-2xl flex items-center gap-2 text-slate-300 hover:text-white transition-colors shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      >
        <Rocket className="w-5 h-5 text-purple-400" />
        <span className="font-bold tracking-widest text-sm">EMPIRE COMMAND</span>
        <ChevronUp className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 p-4 max-h-[60vh] overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
              
              {/* STATIONS */}
              <div className="flex-1 space-y-3">
                <h3 className="text-cyan-400 font-bold font-mono tracking-widest text-sm border-b border-slate-800 pb-2">BUILD STATIONS (Drag on field)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {STATION_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    const canAfford = credits >= 100;
                    return (
                      <button 
                        key={opt.type}
                        onClick={() => handleBuy(opt.type)}
                        disabled={!canAfford}
                        className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${canAfford ? 'border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/50' : 'border-slate-800 bg-slate-900/50 opacity-50 cursor-not-allowed'}`}
                      >
                        <div className="bg-black/30 p-2 rounded-lg"><Icon className="w-6 h-6 text-slate-300" /></div>
                        <div>
                          <div className="font-bold text-white text-sm">{opt.label}</div>
                          <div className="text-[10px] text-slate-400 font-mono">$100 · {opt.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* WARP GATES */}
              <div className="flex-1 space-y-3">
                <h3 className="text-purple-400 font-bold font-mono tracking-widest text-sm border-b border-slate-800 pb-2">WARP NETWORK</h3>
                <div className="space-y-2">
                  {warpGates.map(gate => {
                     const canAfford = credits >= gate.cost;
                     return (
                      <div key={gate.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-700 bg-slate-800/50">
                        <div>
                           <div className="font-bold text-white text-sm">{gate.dimensionName}</div>
                           <div className="text-[10px] text-purple-400 font-mono">{gate.multiplier}x Global Multiplier</div>
                        </div>
                        {gate.active ? (
                           <span className="text-xs text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-full">ACTIVE</span>
                        ) : (
                           <button 
                             onClick={() => {
                                openWarpGate(gate.id);
                                if (window.navigator && window.navigator.vibrate) {
                                   window.navigator.vibrate([100, 50, 100]); // stronger vibration
                                }
                             }}
                             disabled={!canAfford}
                             className={`px-4 py-1 text-xs font-bold rounded-full transition-all ${canAfford ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                           >
                              OPEN (${gate.cost})
                           </button>
                        )}
                      </div>
                     )
                  })}
                </div>
              </div>

              {/* PRESTIGE */}
              <div className="w-full md:w-64 space-y-3">
                 <h3 className="text-yellow-400 font-bold font-mono tracking-widest text-sm border-b border-slate-800 pb-2">EMPIRE RESET</h3>
                 <div className="bg-yellow-950/20 border border-yellow-900/50 p-4 rounded-xl text-center space-y-3">
                    <div className="text-xs text-slate-300">Collapse your empire to harvest raw dimensional energy.</div>
                    <button 
                      onClick={prestige}
                      className="w-full py-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-bold text-sm tracking-widest rounded-lg shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                    >
                       PRESTIGE NOW
                    </button>
                 </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
