// ERC-8021: Transaction Attribution
// Used to attribute interactions to a builder/app.

export const BUILDER_CODE = '[BUILDER_CODE]';
export const ATTRIBUTION_CODE = '[ATTRIBUTION_CODE]';

function stringToHex(str: string): string {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex;
}

export function getAttributionCalldata(originalCalldata: `0x${string}`): `0x${string}` {
  // Just a conceptual implementation. Real ERC-8021 appends attribution data.
  // We're simulating adding builder code and attribution code to end of calldata.
  const hexBuilder = stringToHex(BUILDER_CODE);
  const hexAttribution = stringToHex(ATTRIBUTION_CODE);
  
  if (originalCalldata === '0x') {
      return `0x${hexAttribution}${hexBuilder}` as `0x${string}`;
  }
  return `${originalCalldata}00000000${hexAttribution}${hexBuilder}` as `0x${string}`;
}
