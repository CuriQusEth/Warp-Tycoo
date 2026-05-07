import { useAccount, useConnect, useDisconnect, useSendTransaction, useSignMessage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useGameStore } from '../store/gameStore';
import { BUILDER_CODE, getAttributionCalldata } from '../lib/erc8021/utils';
import { encodeAgentApproval } from '../lib/erc8004/agents';
import { motion } from 'motion/react';
import { Share2, Zap, Shield, Wallet, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Web3Panel() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction } = useSendTransaction();
  const { signMessageAsync } = useSignMessage();
  const empireValue = useGameStore(s => s.empireValue);
  const dimensionLevel = useGameStore(s => s.dimensionLevel);

  const [isOpen, setIsOpen] = useState(false);

  const handleSayGM = async () => {
    if (!isConnected) return;
    try {
      // Simulate Say GM on-chain with ERC8021 attribution
      // A simple 0 value transaction to ourselves or a dummy contract
      const originalCalldata = '0x12345678'; // Example sayGM() signature
      const data = getAttributionCalldata(originalCalldata);
      
      await sendTransaction({
        to: address, // sending to self just for demo
        value: 0n,
        data,
      });
      alert('GM said on-chain! Builders Code appended via ERC-8021.');
    } catch (e) {
      console.error(e);
      alert('Failed to send GM');
    }
  };

  const recordEmpire = async () => {
    if (!isConnected) return;
    try {
        const message = `I hereby declare my Warp Empire on Base Mainnet.
Empire Value: ${empireValue.toFixed(0)}
Dimension Reached: Level ${dimensionLevel}
Builder: ${BUILDER_CODE}
SIWE: Trustless recording active.`;

        const signature = await signMessageAsync({ account: address as `0x${string}`, message });
        console.log("SIWE Signature:", signature);
        
        // ERC8004 mock approval
        encodeAgentApproval(address as string, ['empire_record']);
        
        alert(`Empire Recorded Successfully! Signature: ${signature.slice(0, 10)}...`);
    } catch(e) {
        console.error(e);
        alert('Failed to record empire.');
    }
  };


  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full font-mono text-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]"
      >
        <Wallet className="w-4 h-4" />
        {isConnected ? `${address?.slice(0,6)}...${address?.slice(-4)}` : 'Connect Base Wallet'}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/95 border border-purple-500/30 backdrop-blur-lg p-5 rounded-xl shadow-2xl flex flex-col gap-4 min-w-[280px]"
        >
            {!isConnected ? (
                <button 
                  onClick={() => connect({ connector: injected() })}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-500 hover:to-cyan-400 transition-all active:scale-95"
                >
                  Connect Injected Wallet
                </button>
            ) : (
                <>
                   <div className="text-slate-300 text-sm font-mono space-y-1">
                      <div className="flex justify-between"><span>Base Network:</span> <span className="text-green-400">Connected</span></div>
                      <div className="flex justify-between"><span>ERC-8021:</span> <span className="text-purple-400">Active</span></div>
                      <div className="flex justify-between"><span>ERC-8004:</span> <span className="text-pink-400">Ready</span></div>
                   </div>

                   <hr className="border-slate-800" />

                   <button onClick={handleSayGM} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg font-mono text-sm border border-slate-700 transition-colors">
                      <Zap className="w-4 h-4 text-yellow-400" /> Say GM (On-Chain)
                   </button>
                   
                   <button onClick={recordEmpire} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(219,39,119,0.4)] hover:shadow-[0_0_25px_rgba(219,39,119,0.6)] transition-all">
                      <Shield className="w-4 h-4" /> Record Empire (SIWE)
                   </button>

                   <button onClick={() => disconnect()} className="text-xs text-slate-500 hover:text-slate-400 mt-2 text-center underline">
                      Disconnect
                   </button>
                </>
            )}
        </motion.div>
      )}
    </div>
  );
}
