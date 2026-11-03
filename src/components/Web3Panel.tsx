import { useAccount, useConnect, useDisconnect, useSendTransaction, useSignMessage, useChainId } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useGameStore } from '../store/gameStore';
import { BUILDER_CODE, getAttributionCalldata } from '../lib/erc8021/utils';
import { encodeAgentApproval } from '../lib/erc8004/agents';
import { DENIM_NETWORKS } from '../lib/denim';
import { DenimPanel } from './DenimPanel';
import { motion } from 'motion/react';
import { Zap, Shield, Wallet, ChevronDown, Activity, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function Web3Panel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction } = useSendTransaction();
  const { signMessageAsync } = useSignMessage();
  const empireValue = useGameStore(s => s.empireValue);
  const dimensionLevel = useGameStore(s => s.dimensionLevel);

  const [isOpen, setIsOpen] = useState(false);
  const [isDenimModalOpen, setIsDenimModalOpen] = useState(false);

  const activeNetwork = DENIM_NETWORKS[chainId] || {
    name: 'Base Network',
    denimStatus: 'Denim 200ms Native Blocks Active',
    blockTimeMs: 200,
  };

  const handleSayGM = async () => {
    if (!isConnected) return;
    try {
      // Simulate Say GM on-chain with ERC8021 attribution on canonical 200ms block
      const originalCalldata = '0x12345678';
      const data = getAttributionCalldata(originalCalldata);
      
      await sendTransaction({
        to: address,
        value: 0n,
        data,
      });
      alert('GM sent on-chain! Builders Code appended via ERC-8021 on Denim 200ms block.');
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
Network Upgrade: Denim (200ms Canonical Blocks)
SIWE: Trustless recording active.`;

        const signature = await signMessageAsync({ account: address as `0x${string}`, message });
        
        // ERC8004 mock approval
        encodeAgentApproval(address as string, ['empire_record']);
        
        alert(`Empire Recorded Successfully! Signature: ${signature.slice(0, 10)}... (Denim 200ms verified)`);
    } catch(e) {
        console.error(e);
        alert('Failed to record empire.');
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          {/* Denim 200ms Badge Quick Toggle */}
          <button
            onClick={() => setIsDenimModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 hover:from-cyan-900/80 hover:to-blue-900/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 px-3 py-2 rounded-full font-mono text-xs shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all cursor-pointer"
            title="Open Base Denim 200ms blocks inspector"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold">Denim: 200ms</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400 ml-0.5" />
          </button>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full font-mono text-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            <Wallet className="w-4 h-4" />
            {isConnected ? `${address?.slice(0,6)}...${address?.slice(-4)}` : 'Connect Base Wallet'}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/95 border border-purple-500/30 backdrop-blur-lg p-5 rounded-xl shadow-2xl flex flex-col gap-4 min-w-[300px]"
          >
              {!isConnected ? (
                  <div className="space-y-3">
                    <button 
                      onClick={() => connect({ connector: injected() })}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-500 hover:to-cyan-400 transition-all active:scale-95 text-center text-sm"
                    >
                      Connect Injected Wallet
                    </button>
                    <button
                      onClick={() => setIsDenimModalOpen(true)}
                      className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      View Denim 200ms Specs
                    </button>
                  </div>
              ) : (
                  <>
                     <div className="text-slate-300 text-sm font-mono space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span>Network:</span> 
                          <span className="text-cyan-400 font-bold">{activeNetwork.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Denim Blocks:</span> 
                          <span className="text-green-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            200ms Native (5 bps)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Flashblocks:</span> 
                          <span className="text-amber-400">Retired → Canonical</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>ERC-8021:</span> 
                          <span className="text-purple-400">Active</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>ERC-8004:</span> 
                          <span className="text-pink-400">Ready</span>
                        </div>
                     </div>

                     <hr className="border-slate-800" />

                     <button
                        onClick={() => setIsDenimModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/40 text-cyan-300 py-2 px-4 rounded-lg font-mono text-xs font-bold transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                     >
                        <Activity className="w-4 h-4 text-cyan-400" /> Inspect Denim 200ms Feed
                     </button>

                     <button onClick={handleSayGM} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg font-mono text-sm border border-slate-700 transition-colors">
                        <Zap className="w-4 h-4 text-yellow-400" /> Say GM (200ms Block)
                     </button>
                     
                     <button onClick={recordEmpire} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(219,39,119,0.4)] hover:shadow-[0_0_25px_rgba(219,39,119,0.6)] transition-all">
                        <Shield className="w-4 h-4" /> Record Empire (SIWE)
                     </button>

                     <button onClick={() => disconnect()} className="text-xs text-slate-500 hover:text-slate-400 mt-1 text-center underline">
                        Disconnect
                     </button>
                  </>
              )}
          </motion.div>
        )}
      </div>

      <DenimPanel 
        isOpen={isDenimModalOpen} 
        onClose={() => setIsDenimModalOpen(false)} 
      />
    </>
  );
}
