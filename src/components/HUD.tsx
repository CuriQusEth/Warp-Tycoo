import { useGameStore } from '../store/gameStore';
import { motion } from 'motion/react';
import { Coins, Globe, Diamond } from 'lucide-react';

export function HUD() {
  const credits = useGameStore(s => s.credits);
  const empireValue = useGameStore(s => s.empireValue);
  const dimensionLevel = useGameStore(s => s.dimensionLevel);
  const prestigeGems = useGameStore(s => s.prestigeGems);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  return (
    <div className="fixed top-4 left-4 z-40 flex flex-col gap-3 pointer-events-none">
      <motion.div 
        className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 w-48"
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
        className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 w-48"
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

      {prestigeGems > 0 && (
        <motion.div 
          className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-lg flex items-center gap-3 w-48"
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
    </div>
  );
}
