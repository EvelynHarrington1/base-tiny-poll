import { http } from "viem";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { createConfig } from "wagmi";

type WalletProvider = NonNullable<typeof window.ethereum>;
type MultiInjectedProvider = WalletProvider & {
  providers?: WalletProvider[];
  isOKExWallet?: boolean;
  isOkxWallet?: boolean;
};

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
    injected(),
    injected({ target: "metaMask" }),
    injected({
      target() {
        function pickOkxProvider(provider: WalletProvider | undefined) {
          if (!provider) return undefined;
          const injectedProvider = provider as MultiInjectedProvider;
          const candidates: WalletProvider[] =
            Array.isArray(injectedProvider.providers)
              ? injectedProvider.providers
              : [provider];

          return candidates.find((candidate) => {
            const flags = candidate as MultiInjectedProvider;
            return flags.isOkxWallet || flags.isOKExWallet;
          });
        }

        return {
          id: "okx",
          name: "OKX",
          provider(window) {
            const okxWindow = window as
              | (Window & { okxwallet?: { ethereum?: WalletProvider } })
              | undefined;

            return okxWindow?.okxwallet?.ethereum ?? pickOkxProvider(window?.ethereum);
          },
        };
      },
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  dataSuffix: DATA_SUFFIX,
});
