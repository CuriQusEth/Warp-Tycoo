import { defineChain } from 'viem';

/**
 * Base Vibenet definition for experimental 200ms native blocks (Denim testbed)
 * Chain ID: 84538453
 * RPC: https://rpc.vibes.base.org
 * WebSocket: wss://rpc.vibes.base.org/ws
 */
export const baseVibenet = defineChain({
  id: 84538453,
  name: 'Base Vibenet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.vibes.base.org'],
      webSocket: ['wss://rpc.vibes.base.org/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Base Vibenet Explorer',
      url: 'https://chain.base.org/vibenet/explorer',
    },
  },
  testnet: true,
});

/**
 * Denim Migration Spec:
 * Denim activated on Base Sepolia on October 21, 2026 at 18:00 UTC
 * and on Base Mainnet on November 5, 2026 at 18:00 UTC.
 * Base stopped producing Flashblocks on both networks at activation.
 * Flashblocks subscriptions, WebSocket streams, and pending state are retired.
 */
export interface DenimMigrationItem {
  deprecatedFeature: string;
  actionForDenim: string;
  status: 'migrated' | 'active';
  description: string;
}

export const DENIM_MIGRATION_CHECKLIST: DenimMigrationItem[] = [
  {
    deprecatedFeature: 'Flashblocks WebSockets (wss://*.flashblocks.base.org/ws)',
    actionForDenim: 'eth_subscribe("newHeads") / ("logs") on standard WebSocket RPC',
    status: 'migrated',
    description: 'Flashblocks WebSocket streams retired (no longer stream data). Use canonical newHeads / logs.'
  },
  {
    deprecatedFeature: 'eth_subscribe("newFlashblocks")',
    actionForDenim: 'eth_subscribe("newHeads")',
    status: 'migrated',
    description: 'Flashblocks streaming retired. Replaced with canonical newHeads at 200ms cadence.'
  },
  {
    deprecatedFeature: 'eth_subscribe("pendingLogs")',
    actionForDenim: 'eth_subscribe("logs")',
    status: 'migrated',
    description: 'Pending logs retired. Canonical logs stream directly from 200ms blocks.'
  },
  {
    deprecatedFeature: 'eth_subscribe("newFlashblockTransactions")',
    actionForDenim: 'eth_subscribe("newHeads") + getBlock transactions',
    status: 'migrated',
    description: 'Fetch transactions directly for each canonical 200ms block.'
  },
  {
    deprecatedFeature: 'eth_getBlockByNumber("pending", ...)',
    actionForDenim: 'Normal RPC calls for latest canonical blocks',
    status: 'migrated',
    description: 'Pending block tag no longer exposes preconfirmations; resolves to latest canonical block.'
  },
  {
    deprecatedFeature: 'eth_getBalance / eth_getTransactionCount(..., "pending")',
    actionForDenim: 'Normal RPC calls to read latest canonical state',
    status: 'migrated',
    description: 'Read latest canonical state directly from 200ms blocks.'
  },
  {
    deprecatedFeature: 'eth_call / eth_estimateGas(..., "pending")',
    actionForDenim: 'Normal RPC calls to read latest canonical state',
    status: 'migrated',
    description: 'Simulations and gas estimation execute against canonical latest state.'
  },
  {
    deprecatedFeature: 'base_transactionStatus',
    actionForDenim: 'Canonical receipts via eth_getTransactionReceipt',
    status: 'migrated',
    description: 'Public endpoints reject base_transactionStatus; standard receipts available in ~200ms.'
  },
  {
    deprecatedFeature: 'eth_getTransactionReceipt for preconfirmed tx',
    actionForDenim: 'Standard receipt polling on canonical 200ms blocks',
    status: 'migrated',
    description: 'Receipt is available as soon as tx is included in canonical 200ms block. No preconfirmed state.'
  },
  {
    deprecatedFeature: 'Validity tx with flashblock_index predicate',
    actionForDenim: 'Bound transactions with block_number only',
    status: 'migrated',
    description: 'flashblock_index predicates rejected. Blocks are built every 200ms without flashblocks.'
  },
  {
    deprecatedFeature: 'BLOCKHASH 256-block history assumptions',
    actionForDenim: 'Adjust history assumptions (covers ~51.2s instead of ~512s)',
    status: 'migrated',
    description: '200ms blocks mean the 256-block history covers 1/10th of elapsed time.'
  }
];

export interface DenimNetworkConfig {
  name: string;
  chainId: number;
  denimStatus: string;
  blockTimeMs: number;
  blocksPerSecond: number;
  isDenimLive: boolean;
  activationDate: string;
  notes: string;
}

export const DENIM_NETWORKS: Record<number, DenimNetworkConfig> = {
  8453: {
    name: 'Base Mainnet',
    chainId: 8453,
    denimStatus: 'Denim Live on Mainnet (Activated Nov 5, 2026)',
    blockTimeMs: 200,
    blocksPerSecond: 5,
    isDenimLive: true,
    activationDate: 'November 5, 2026 at 18:00 UTC',
    notes: 'Base Mainnet transitioned from Flashblocks to canonical 200ms native blocks.'
  },
  84532: {
    name: 'Base Sepolia',
    chainId: 84532,
    denimStatus: 'Denim Live on Testnet (Activated Oct 21, 2026)',
    blockTimeMs: 200,
    blocksPerSecond: 5,
    isDenimLive: true,
    activationDate: 'October 21, 2026 at 18:00 UTC',
    notes: 'Base Sepolia activated Denim first; 200ms native blocks live.'
  },
  84538453: {
    name: 'Base Vibenet',
    chainId: 84538453,
    denimStatus: 'Denim Experimental Devnet (200ms)',
    blockTimeMs: 200,
    blocksPerSecond: 5,
    isDenimLive: true,
    activationDate: 'Pre-release Devnet',
    notes: 'Vibenet 200ms native blocks for experimental developer testing.'
  }
};
