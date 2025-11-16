export const NETWORK = 'testnet';
export const MODULE_ADDRESS = '0x1';

export const APT_DECIMALS = 8;
export const OCTAS_PER_APT = 100000000;

export function formatAPT(octas: number): string {
  return (octas / OCTAS_PER_APT).toFixed(4);
}

export function toOctas(apt: number): number {
  return Math.floor(apt * OCTAS_PER_APT);
}
