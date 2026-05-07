import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useState } from 'react';

export function TitleScreen({ onStart }: { onStart: () => void }) {
  const [started, setStarted] = useState(false);

  const handleClick = () => {
    setStarted(true);
    setTimeout(onStart, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: started ? 0 : 1, scale: started ? 1.2 : 1 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15)_0,rgba(0,0,0,0)_50%)]"></div>
      
      {/* Central Warp Gate */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-96 h-96 rounded-full border-4 border-dashed border-cyan-500/20 flex items-center justify-center -z-10"
      >
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.1, 1] }} 
          transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          className="w-64 h-64 rounded-full border border-purple-500/30 flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-cyan-900/40 blur-sm"
        />
      </motion.div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center z-10"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          WARP TYCOON
        </h1>
        <p className="font-mono text-cyan-400 mt-4 tracking-widest text-sm md:text-base">INTERDIMENSIONAL EMPIRE BUILDER</p>
      </motion.div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={handleClick}
        className="mt-16 z-10 bg-slate-900/80 backdrop-blur-md border border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-950/50 px-8 py-4 rounded-full font-bold font-mono text-lg text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all flex items-center gap-3 group"
      >
        <Zap className="w-5 h-5 group-hover:text-yellow-400 transition-colors" /> 
        INITIALIZE
      </motion.button>
    </motion.div>
  );
}
