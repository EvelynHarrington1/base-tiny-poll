import { http } from "viem";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { createConfig } from "wagmi";

export const DATA_SUFFIX =
  process.env.NEXT_PUBLIC_BASE_BUILDER_CODE &&
  process.env.NEXT_PUBLIC_BASE_BUILDER_CODE !== "replace-with-your-builder-code"
    ? (process.env.NEXT_PUBLIC_BASE_BUILDER_CODE as `0x${string}`)
    : "0x";

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "Base Tiny Poll",
      preference: "all",
    }),
    injected({
      target() {
        return {
          id: "metaMask",
          name: "MetaMask",
          provider: typeof window !== "undefined" ? window.ethereum : undefined,
        };
      },
    }),
    injected({
      target() {
        const ethereum = typeof window !== "undefined" ? window.ethereum : undefined;
        const provider =
          typeof window !== "undefined"
            ? (window as Window & { okxwallet?: { ethereum?: typeof ethereum } }).okxwallet?.ethereum
            : undefined;

        return {
          id: "okx",
          name: "OKX",
          provider: provider ?? ethereum,
        };
      },
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  dataSuffix: DATA_SUFFIX,
});
