import { useGameStore } from '../store/gameStore';
import { motion } from 'motion/react';
import { Coins, Globe, Diamond, RefreshCw, Zap } from 'lucide-react';

export function HUD() {
  const credits = useGameStore(s => s.credits);
  const empireValue = useGameStore(s => s.empireValue);
  const dimensionLevel = useGameStore(s => s.dimensionLevel);
  const prestigeGems = useGameStore(s => s.prestigeGems);
  const prestige = useGameStore(s => s.prestige);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  const currentPrestigeGain = Math.floor(Math.sqrt(empireValue / 1000));

  return (
    <div className="fixed top-4 left-4 z-40 flex flex-col gap-2.5 pointer-events-none">
      <motion.div 
        className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 w-48 pointer-events-auto"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="bg-yellow-500/20 p-2 rounded-lg">
          <Coins className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">CREDITS</div>
          <div className="text-lg font-bold text-white font-mono tracking-wider">{formatNumber(credits)}</div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 w-48 pointer-events-auto"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-purple-500/20 p-2 rounded-lg">
          <Globe className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">DIMENSION LEVEL</div>
          <div className="text-lg font-bold text-purple-400 font-mono tracking-wider">Level {dimensionLevel}</div>
        </div>
      </motion.div>

      {/* Denim 200ms Native Block Indicator */}
      <motion.div 
        className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 p-2.5 rounded-xl shadow-lg flex items-center gap-2.5 w-48 pointer-events-auto"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="bg-cyan-500/20 p-1.5 rounded-lg">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-[10px] text-cyan-300 font-semibold tracking-wider font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            DENIM MAINNET
          </div>
          <div className="text-xs font-bold text-slate-300 font-mono tracking-tight">200ms · 5 BPS</div>
        </div>
      </motion.div>

      {prestigeGems > 0 && (
        <motion.div 
          className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 w-48 pointer-events-auto"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-cyan-500/20 p-2 rounded-lg">
            <Diamond className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">PRESTIGE GEMS</div>
            <div className="text-lg font-bold text-cyan-400 font-mono tracking-wider">{formatNumber(prestigeGems)}</div>
          </div>
        </motion.div>
      )}

      {currentPrestigeGain >= 1 && (
        <motion.button
          className="bg-cyan-900/80 hover:bg-cyan-800/80 backdrop-blur-md border border-cyan-500/50 p-3 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center gap-3 w-48 pointer-events-auto transition-colors mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            if (confirm(`Collapse the Network to gain ${currentPrestigeGain} Prestige Gems? This will reset your empire but grant permanent multipliers.`)) {
              prestige();
            }
          }}
        >
          <div className="bg-cyan-500/20 p-2 rounded-lg">
            <RefreshCw className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs text-cyan-300 font-medium font-sans">COLLAPSE NETWORK</div>
            <div className="text-sm font-bold text-white font-mono">+{formatNumber(currentPrestigeGain)} Gems</div>
          </div>
        </motion.button>
      )}
    </div>
  );
}
