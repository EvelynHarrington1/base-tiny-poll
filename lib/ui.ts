import { type ClassValue, clsx } from "clsx";
import type { Address } from "viem";

export function cx(...values: ClassValue[]) {
  return clsx(values);
}

export function shortAddress(address: Address | string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatCount(value: bigint | undefined) {
  return value === undefined ? "--" : value.toLocaleString();
}

export function txUrl(hash: string) {
  return `https://basescan.org/tx/${hash}`;
}
