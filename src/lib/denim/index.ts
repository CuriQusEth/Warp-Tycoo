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
 * Denim replaces Flashblocks with native 200ms canonical blocks.
 * Flashblocks subscriptions and "pending" state are unavailable after activation.
 */
export interface DenimMigrationItem {
  deprecatedFeature: string;
  actionForDenim: string;
  status: 'migrated' | 'active';
  description: string;
}

export const DENIM_MIGRATION_CHECKLIST: DenimMigrationItem[] = [
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
    actionForDenim: 'eth_subscribe("newHeads") + getBlock',
    status: 'migrated',
    description: 'Fetch transactions directly for each canonical 200ms block.'
  },
  {
    deprecatedFeature: 'eth_getBlockByNumber("pending", ...)',
    actionForDenim: 'eth_getBlockByNumber("latest", ...)',
    status: 'migrated',
    description: 'Pending block tag removed. Normal RPC reads latest canonical 200ms blocks.'
  },
  {
    deprecatedFeature: 'eth_getBalance(..., "pending")',
    actionForDenim: 'eth_getBalance(..., "latest")',
    status: 'migrated',
    description: 'Normal RPC calls to read latest canonical state.'
  },
  {
    deprecatedFeature: 'eth_call / eth_estimateGas(..., "pending")',
    actionForDenim: 'eth_call / eth_estimateGas(..., "latest")',
    status: 'migrated',
    description: 'Simulations and gas estimation execute against canonical latest state.'
  },
  {
    deprecatedFeature: 'Flashblocks preconfirmation assumptions',
    actionForDenim: 'Native 200ms canonical blocks (5 bps)',
    status: 'migrated',
    description: 'No distinction between preconfirmed and canonical; all blocks are canonical.'
  }
];

export interface DenimNetworkConfig {
  name: string;
  chainId: number;
  denimStatus: string;
  blockTimeMs: number;
  blocksPerSecond: number;
  isDenimLive: boolean;
  notes: string;
}

export const DENIM_NETWORKS: Record<number, DenimNetworkConfig> = {
  8453: {
    name: 'Base Mainnet',
    chainId: 8453,
    denimStatus: 'Denim Upgrade Activated (Native 200ms Blocks)',
    blockTimeMs: 200,
    blocksPerSecond: 5,
    isDenimLive: true,
    notes: 'Base Mainnet 200ms native block cadence.'
  },
  84532: {
    name: 'Base Sepolia',
    chainId: 84532,
    denimStatus: 'Denim Active (Since Oct 21, 2026)',
    blockTimeMs: 200,
    blocksPerSecond: 5,
    isDenimLive: true,
    notes: 'Denim activated on Base Sepolia on October 21, 2026 at 18:00 UTC.'
  },
  84538453: {
    name: 'Base Vibenet',
    chainId: 84538453,
    denimStatus: 'Denim Experimental Devnet (200ms)',
    blockTimeMs: 200,
    blocksPerSecond: 5,
    isDenimLive: true,
    notes: 'Vibenet 200ms native blocks live for experimental developer testing.'
  }
};
