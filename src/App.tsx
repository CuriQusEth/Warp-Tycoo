import { useState } from 'react';
import { Web3Provider } from './components/Web3Provider';
import { Web3Panel } from './components/Web3Panel';
import { GameBoard } from './components/GameBoard';
import { HUD } from './components/HUD';
import { BuildMenu } from './components/BuildMenu';
import { TitleScreen } from './components/TitleScreen';
import { useGameLoop } from './hooks/useGameLoop';

function GameContent() {
  const [gameStarted, setGameStarted] = useState(false);
  useGameLoop();

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-50 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {!gameStarted && <TitleScreen onStart={() => setGameStarted(true)} />}
      
      <div className={`transition-opacity duration-1000 ${gameStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Web3Panel />
        <HUD />
        <GameBoard />
        <BuildMenu />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <GameContent />
    </Web3Provider>
  );
}

