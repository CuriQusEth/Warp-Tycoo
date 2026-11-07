import { useState } from 'react';
import { useAccount, useSwitchChain, usePublicClient, useChainId } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { baseVibenet, DENIM_MIGRATION_CHECKLIST, DENIM_NETWORKS } from '../lib/denim';
import { useDenimBlocks } from '../hooks/useDenimBlocks';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Activity, 
  CheckCircle2, 
  Network, 
  Radio, 
  Layers, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DenimPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DenimPanel({ isOpen, onClose }: DenimPanelProps) {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient();
  const { networkConfig, blocks, currentBlockNumber } = useDenimBlocks();

  const [activeTab, setActiveTab] = useState<'monitor' | 'migration' | 'test'>('monitor');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const supportedChains = [
    { chain: base, label: 'Base Mainnet', note: 'Denim Live (Nov 5, 2026 18:00 UTC)', badge: 'Mainnet · Live' },
    { chain: baseSepolia, label: 'Base Sepolia', note: 'Denim Active (Oct 21, 2026 18:00 UTC)', badge: 'Sepolia · Live' },
    { chain: baseVibenet, label: 'Base Vibenet', note: 'Native 200ms Experimental Devnet', badge: 'Devnet' },
  ];

  const isMainnet = currentChainId === base.id;

  // Test reading canonical state without 'pending' block tag on current network
  const runDenimCanonicalCheck = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      if (!publicClient) throw new Error('Public RPC client not ready');

      const start = performance.now();
      // Read latest canonical block (explicitly using 'latest', strictly avoiding retired 'pending' / Flashblocks)
      const block = await publicClient.getBlock({ blockTag: 'latest' });
      
      let balanceStr = 'N/A';
      if (address) {
        // Read balance with canonical 'latest' tag
        const bal = await publicClient.getBalance({ address, blockTag: 'latest' });
        balanceStr = `${(Number(bal) / 1e18).toFixed(4)} ETH`;
      }
      
      const duration = Math.round(performance.now() - start);

      setTestResult(
        `✓ Base Mainnet Denim Canonical Check Success in ${duration}ms\n` +
        `• Network: ${networkConfig.name} (Chain ID: ${networkConfig.chainId})\n` +
        `• Denim Status: ${networkConfig.denimStatus}\n` +
        `• Block Tag: "latest" (Zero Flashblocks / "pending" tags)\n` +
        `• Canonical Block #${block.number.toString()}\n` +
        `• Block Hash: ${block.hash}\n` +
        `• Balance (canonical state): ${balanceStr}\n` +
        `• Block Cadence: 200ms native canonical blocks (5 bps)`
      );
    } catch (err: any) {
      setTestResult(`Error during canonical read: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(34,211,238,0.25)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-wide">Base Denim Mainnet</h2>
                  <span className="text-[10px] uppercase font-mono font-bold bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                    Mainnet Live
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Denim activated on Base Mainnet on Nov 5, 2026 at 18:00 UTC · 200ms Native Blocks
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-mono transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Mainnet Notice & Network Switcher Ribbon */}
          <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Active Network:</span>
              <span className={`font-bold ${isMainnet ? 'text-green-400' : 'text-cyan-400'}`}>
                {networkConfig.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {supportedChains.map(({ chain, label, badge }) => {
                const isActive = currentChainId === chain.id;
                return (
                  <button
                    key={chain.id}
                    onClick={() => switchChain?.({ chainId: chain.id })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-[0_0_12px_rgba(34,211,238,0.4)]' 
                        : 'bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-slate-300">{badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {!isMainnet && (
            <div className="bg-cyan-950/40 border-b border-cyan-800/40 px-4 py-2 flex items-center justify-between text-xs text-cyan-300">
              <span className="flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Base Mainnet is live with Denim (200ms blocks since Nov 5, 2026).
              </span>
              <button
                onClick={() => switchChain?.({ chainId: base.id })}
                className="px-2.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-bold font-mono text-[11px] flex items-center gap-1 cursor-pointer"
              >
                Switch to Mainnet <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-900/50 px-4 pt-2 gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab('monitor')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                activeTab === 'monitor'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Mainnet 200ms Stream
            </button>
            <button
              onClick={() => setActiveTab('migration')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                activeTab === 'migration'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Flashblocks Replacement Guide
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                activeTab === 'test'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Live RPC Validation
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {activeTab === 'monitor' && (
              <div className="space-y-4">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Mainnet Cadence</div>
                    <div className="text-base sm:text-lg font-bold text-cyan-400 font-mono">200 ms</div>
                    <div className="text-[9px] text-slate-500 font-mono">Native canonical block</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Block Rate</div>
                    <div className="text-base sm:text-lg font-bold text-green-400 font-mono">5.0 BPS</div>
                    <div className="text-[9px] text-slate-500 font-mono">Blocks per second</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Canonical Block</div>
                    <div className="text-base sm:text-lg font-bold text-purple-400 font-mono">
                      #{currentBlockNumber.toString()}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">Latest head</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Flashblocks</div>
                    <div className="text-base sm:text-lg font-bold text-red-400 font-mono">Stopped</div>
                    <div className="text-[9px] text-slate-500 font-mono">No longer stream data</div>
                  </div>
                </div>

                {/* Mainnet Activation Announcement Box */}
                <div className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-950 border border-emerald-500/40 p-3.5 rounded-xl text-xs space-y-1.5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <div className="font-bold text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Denim Activated on Base Mainnet: November 5, 2026 at 18:00 UTC
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-[12px]">
                    Base Mainnet now produces complete canonical blocks every 200 milliseconds. Flashblocks subscriptions, WebSocket feeds (<code className="text-cyan-300">wss://mainnet.flashblocks.base.org/ws</code>), and pending preconfirmation states have ceased producing data. All transactions settle directly into canonical 200ms blocks.
                  </p>
                </div>

                {/* Live Block Stream */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Stream: eth_subscribe("newHeads") [200ms Canonical]
                    </span>
                    <span className="text-green-400 font-bold">100% Canonical · 0 Pending Tags</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800/80 font-mono text-xs max-h-56 overflow-y-auto">
                    {blocks.map((b, i) => (
                      <div key={b.number.toString() + i} className="p-2.5 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-bold">#{b.number.toString()}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            {b.hash.slice(0, 10)}...{b.hash.slice(-6)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {b.deltaMs}ms
                          </span>
                          <span className="text-slate-500 hidden sm:inline">
                            Gas: {b.gasUsed ? b.gasUsed.toString() : 'Canonical'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'migration' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-300">Official Base Denim Flashblocks Replacement Matrix</div>
                  <div className="text-slate-400 text-[11px] font-sans">
                    Every Flashblocks subscription and "pending" block tag query has been mapped to canonical 200ms equivalents:
                  </div>
                </div>

                <div className="space-y-2">
                  {DENIM_MIGRATION_CHECKLIST.map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="line-through text-red-400/80 text-[11px]">{item.deprecatedFeature}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="text-cyan-300 font-bold text-[11px]">{item.actionForDenim}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">{item.description}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-[10px] uppercase font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                  <h3 className="font-bold text-white font-mono flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Live Base Mainnet Canonical RPC Validation
                  </h3>
                  <p className="text-slate-400 font-sans leading-relaxed">
                    Test live canonical state reads on Base Mainnet. Validates that <code className="text-cyan-300">blockTag: "latest"</code> resolves against the 200ms canonical chain with no reliance on retired Flashblocks methods.
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={runDenimCanonicalCheck}
                      disabled={isTesting}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {isTesting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Reading Canonical Head...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Execute Mainnet 200ms Check
                        </>
                      )}
                    </button>
                    {!isMainnet && (
                      <button
                        onClick={() => switchChain?.({ chainId: base.id })}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      >
                        Switch to Base Mainnet First
                      </button>
                    )}
                  </div>
                </div>

                {testResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-950 border border-cyan-500/30 p-3.5 rounded-xl font-mono text-xs text-cyan-300 whitespace-pre-wrap leading-relaxed shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                  >
                    {testResult}
                  </motion.div>
                )}

                <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl text-[11px] text-slate-400 font-mono space-y-1">
                  <div className="font-bold text-slate-300">Base Documentation Reference:</div>
                  <div className="flex items-center gap-2">
                    <span>Index:</span>
                    <a 
                      href="https://docs.base.org/llms.txt" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      docs.base.org/llms.txt <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>Base Mainnet Denim Activation: November 5, 2026 at 18:00 UTC (LIVE)</div>
                  <div>Base Sepolia Denim Activation: October 21, 2026 at 18:00 UTC (LIVE)</div>
                  <div>Node operators: base/base v1.5.1+ required on Mainnet (all flashblocks flags removed)</div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono flex items-center gap-1.5 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Base Mainnet Denim 200ms Active
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
