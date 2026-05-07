import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { Component, Cpu, Shield, Factory, Pickaxe, Zap } from 'lucide-react';

const STATION_COLORS = {
  Extractor: 'text-amber-400 border-amber-500/50 bg-amber-950/40 shadow-[0_0_15px_rgba(251,191,36,0.2)]',
  Warehouse: 'text-blue-400 border-blue-500/50 bg-blue-950/40 shadow-[0_0_15px_rgba(96,165,250,0.2)]',
  Refinery: 'text-purple-400 border-purple-500/50 bg-purple-950/40 shadow-[0_0_15px_rgba(192,132,252,0.2)]',
  Defense: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40 shadow-[0_0_15px_rgba(52,211,153,0.2)]',
};

const STATION_ICONS = {
  Extractor: Pickaxe,
  Warehouse: Component,
  Refinery: Factory,
  Defense: Shield,
};

export function GameBoard() {
  const stations = useGameStore(s => s.stations);
  const upgradeStation = useGameStore(s => s.upgradeStation);
  const updateStationPosition = useGameStore(s => s.updateStationPosition);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-auto">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Central Warp Gate Visual */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-dashed border-cyan-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.2)]"
        >
          <motion.div 
            animate={{ rotate: -360, scale: [1, 1.1, 1] }} 
            transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border border-purple-500/50 flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-sm"
          >
             <Zap className="w-12 h-12 text-cyan-400 opacity-80" />
          </motion.div>
        </motion.div>
      </div>

      {/* Stations */}
      {stations.map(station => {
        const Icon = STATION_ICONS[station.type] || Cpu;
        const colorClass = STATION_COLORS[station.type];
        
        return (
          <motion.div
            key={station.id}
            drag
            dragMomentum={false}
            initial={false}
            animate={{ x: station.x, y: station.y }}
            onDragEnd={(_, info) => {
              // Since animate is tied to x, y, we add the drag offset
              updateStationPosition(station.id, station.x + info.offset.x, station.y + info.offset.y);
            }}
            className={`absolute w-20 h-20 rounded-xl border flex flex-col items-center justify-center cursor-move touch-none backdrop-blur-md transition-shadow hover:z-10 ${colorClass}`}
            onClick={() => {
               upgradeStation(station.id);
               if (window.navigator && window.navigator.vibrate) {
                  window.navigator.vibrate(30);
               }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-8 h-8 mb-1" />
            <div className="text-[10px] font-bold font-mono bg-black/50 px-1.5 py-0.5 rounded">Lv.{station.level}</div>
            
            {/* Upgrade Hint */}
            <div className="absolute -top-2 -right-2 bg-green-500 text-black text-[9px] font-bold px-1 rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity">
              UPG: ${formatNumber(station.cost)}
            </div>
            
            {/* Income Ping Animation */}
            <motion.div 
              animate={{ y: -20, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute top-0 text-[10px] text-green-400 font-mono pointer-events-none"
            >
              +${formatNumber(station.baseIncome)}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function formatNumber(num: number) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return Math.floor(num).toString();
}
