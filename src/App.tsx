import { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { Sun } from 'lucide-react';
import { Web3Provider } from './components/Web3Provider';
import { Web3Panel } from './components/Web3Panel';
import { GameBoard } from './components/GameBoard';
import { HUD } from './components/HUD';
import { BuildMenu } from './components/BuildMenu';
import { TitleScreen } from './components/TitleScreen';
import { useGameLoop } from './hooks/useGameLoop';
import { getAttributionCalldata } from './lib/erc8021/utils';

function GameContent() {
  const [gameStarted, setGameStarted] = useState(false);
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  useGameLoop();

  const sendGMTransaction = () => {
    // Basic GM interaction on-chain
    // Using ERC-8021 attribution as configured in requirements
    const calldata = getAttributionCalldata('0x'); // Empty calldata for simple GM 

    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3', // Specific contract from requirements
      value: BigInt(0),
      // Here data is passed as general raw transaction data for ERC-8021
      data: calldata,
    });
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-50 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {!gameStarted && <TitleScreen onStart={() => setGameStarted(true)} />}
      
      <div className={`transition-opacity duration-1000 ${gameStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Web3Panel />
        <HUD />
        <GameBoard />
        <BuildMenu />

        {isConnected && gameStarted && (
          <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
            <button
              onClick={sendGMTransaction}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
              <Sun className="w-4 h-4" />
              Say GM
            </button>
          </div>
        )}
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

