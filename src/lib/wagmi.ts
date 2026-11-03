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
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [baseVibenet.id]: http('https://rpc.vibes.base.org'),
  },
});
