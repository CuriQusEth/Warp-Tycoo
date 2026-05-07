// ERC-8021: Transaction Attribution
// Used to attribute interactions to a builder/app.

export const BUILDER_CODE = 'bc_rk6o246i';
export const ATTRIBUTION_CODE = '[ATTRIBUTION_CODE]';

export function getAttributionCalldata(originalCalldata: `0x${string}`): `0x${string}` {
  // Just a conceptual implementation. Real ERC-8021 appends attribution data.
  // We're simulating adding builder code to end of calldata.
  return `${originalCalldata}00000000${Buffer.from(BUILDER_CODE).toString('hex')}` as `0x${string}`;
}
