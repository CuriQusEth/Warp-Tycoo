import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { baseVibenet } from './denim';

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, baseVibenet],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [baseVibenet.id]: http('https://rpc.vibes.base.org'),
  },
});
