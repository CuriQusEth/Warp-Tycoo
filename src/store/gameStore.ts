import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StationType = 'Extractor' | 'Warehouse' | 'Defense' | 'Refinery';

export interface Station {
  id: string;
  x: number;
  y: number;
  level: number;
  type: StationType;
  baseIncome: number;
  cost: number;
}

export interface WarpGate {
  id: string;
  dimensionName: string;
  multiplier: number;
  cost: number;
  active: boolean;
}

interface GameState {
  credits: number;
  empireValue: number;
  dimensionLevel: number;
  prestigeGems: number;
  stations: Station[];
  warpGates: WarpGate[];
  lastSaved: number;
  
  // Actions
  addCredits: (amount: number) => void;
  buyStation: (x: number, y: number, type: StationType) => void;
  upgradeStation: (id: string) => void;
  updateStationPosition: (id: string, x: number, y: number) => void;
  openWarpGate: (id: string) => void;
  prestige: () => void;
  tick: (timeDelta: number) => void;
}

const INITIAL_STATION_COST = 50;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      credits: 0,
      empireValue: 0,
      dimensionLevel: 1,
      prestigeGems: 0,
      stations: [
        { id: '1', x: 50, y: 50, level: 1, type: 'Extractor', baseIncome: 1, cost: 100 }
      ],
      warpGates: [
        { id: 'g1', dimensionName: 'Alpha Centauri', multiplier: 1.5, cost: 500, active: false },
        { id: 'g2', dimensionName: 'Sirius B', multiplier: 3.0, cost: 5000, active: false },
        { id: 'g3', dimensionName: 'Void Nebula', multiplier: 10.0, cost: 50000, active: false },
      ],
      lastSaved: Date.now(),

      addCredits: (amount) => set((state) => ({ 
        credits: state.credits + amount,
        empireValue: Math.max(state.empireValue, state.credits + amount) // simple empire value logic
      })),

      buyStation: (x, y, type) => set((state) => {
        if (state.credits < INITIAL_STATION_COST) return state;
        const newStation: Station = {
          id: Math.random().toString(36).substr(2, 9),
          x, y, level: 1, type, baseIncome: type === 'Extractor' ? 2 : 5, cost: 100
        };
        return {
          credits: state.credits - INITIAL_STATION_COST,
          stations: [...state.stations, newStation]
        };
      }),

      upgradeStation: (id) => set((state) => {
        const station = state.stations.find(s => s.id === id);
        if (!station || state.credits < station.cost) return state;
        
        return {
          credits: state.credits - station.cost,
          stations: state.stations.map(s => 
            s.id === id ? { ...s, level: s.level + 1, baseIncome: s.baseIncome * 1.5, cost: s.cost * 2 } : s
          )
        };
      }),

      updateStationPosition: (id, x, y) => set((state) => ({
        stations: state.stations.map(s => s.id === id ? { ...s, x, y } : s)
      })),

      openWarpGate: (id) => set((state) => {
        const gate = state.warpGates.find(g => g.id === id);
        if (!gate || state.credits < gate.cost || gate.active) return state;

        return {
          credits: state.credits - gate.cost,
          dimensionLevel: state.dimensionLevel + 1,
          warpGates: state.warpGates.map(g => g.id === id ? { ...g, active: true } : g)
        };
      }),

      prestige: () => set((state) => {
        // Very basic prestige math
        const earnedGems = Math.floor(Math.sqrt(state.empireValue / 1000));
        if (earnedGems < 1) return state;
        
        return {
          credits: 0,
          empireValue: 0,
          dimensionLevel: 1,
          prestigeGems: state.prestigeGems + earnedGems,
          stations: [
            { id: '1', x: 50, y: 50, level: 1, type: 'Extractor', baseIncome: 1, cost: 100 }
          ],
          warpGates: state.warpGates.map(g => ({...g, active: false})),
          lastSaved: Date.now()
        };
      }),

      tick: (timeDelta) => set((state) => {
        // Calculate income per second
        let income = state.stations.reduce((acc, s) => acc + s.baseIncome, 0);
        
        // Multipliers
        const activeGates = state.warpGates.filter(g => g.active);
        let multiplier = 1;
        activeGates.forEach(g => multiplier *= g.multiplier);
        
        // Prestige multiplier
        multiplier *= (1 + state.prestigeGems * 0.1); 

        // timeDelta is in milliseconds
        const generated = (income * multiplier * (timeDelta / 1000));

        return {
          credits: state.credits + generated,
          empireValue: state.empireValue + generated,
          lastSaved: Date.now()
        };
      })
    }),
    {
      name: 'warp-tycoon-storage',
    }
  )
);
