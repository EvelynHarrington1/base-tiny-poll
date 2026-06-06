import { http } from "viem";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { createConfig } from "wagmi";

type WalletProvider = NonNullable<typeof window.ethereum>;
type MultiInjectedProvider = WalletProvider & {
  providers?: WalletProvider[];
  isOKExWallet?: boolean;
  isOkxWallet?: boolean;
  isMetaMask?: boolean;
};

type InjectedWindow =
  | {
      ethereum?: WalletProvider | MultiInjectedProvider;
      okxwallet?: WalletProvider | { ethereum?: WalletProvider };
    }
  | undefined;

function asInjectedWindow(window: unknown): InjectedWindow {
  return window as InjectedWindow;
}

function getInjectedProviders(window: unknown): WalletProvider[] {
  const ethereum = asInjectedWindow(window)?.ethereum as MultiInjectedProvider | undefined;
  if (!ethereum) return [];
  return Array.isArray(ethereum.providers) ? ethereum.providers : [ethereum];
}

function pickOkxProvider(window?: unknown): WalletProvider | undefined {
  const okxWindow = asInjectedWindow(window);
  const okxInjected = okxWindow?.okxwallet;

  if (okxInjected) {
    return "ethereum" in okxInjected ? okxInjected.ethereum : okxInjected;
  }

  return getInjectedProviders(window).find((candidate) => {
    const provider = candidate as MultiInjectedProvider;
    return provider.isOkxWallet || provider.isOKExWallet;
  });
}

function pickMetaMaskProvider(window?: unknown): WalletProvider | undefined {
  return getInjectedProviders(window).find((candidate) => {
    const provider = candidate as MultiInjectedProvider & {
      isBraveWallet?: boolean;
      isApexWallet?: boolean;
      isAvalanche?: boolean;
      isBitKeep?: boolean;
      isBlockWallet?: boolean;
      isKuCoinWallet?: boolean;
      isMathWallet?: boolean;
      isOneInchAndroidWallet?: boolean;
      isOneInchIOSWallet?: boolean;
      isOpera?: boolean;
      isPhantom?: boolean;
      isPortal?: boolean;
      isRabby?: boolean;
      isTokenPocket?: boolean;
      isTokenary?: boolean;
      isUniswapWallet?: boolean;
      isZerion?: boolean;
    };

    const looksLikeAnotherWallet =
      provider.isOkxWallet ||
      provider.isOKExWallet ||
      provider.isBraveWallet ||
      provider.isApexWallet ||
      provider.isAvalanche ||
      provider.isBitKeep ||
      provider.isBlockWallet ||
      provider.isKuCoinWallet ||
      provider.isMathWallet ||
      provider.isOneInchAndroidWallet ||
      provider.isOneInchIOSWallet ||
      provider.isOpera ||
      provider.isPhantom ||
      provider.isPortal ||
      provider.isRabby ||
      provider.isTokenPocket ||
      provider.isTokenary ||
      provider.isUniswapWallet ||
      provider.isZerion;

    return (
      provider.isMetaMask &&
      !looksLikeAnotherWallet
    );
  });
}

export const DATA_SUFFIX =
  process.env.NEXT_PUBLIC_BASE_BUILDER_CODE &&
  process.env.NEXT_PUBLIC_BASE_BUILDER_CODE !== "replace-with-your-builder-code"
    ? (process.env.NEXT_PUBLIC_BASE_BUILDER_CODE as `0x${string}`)
    : "0x";

export const config = createConfig({
  chains: [base],
  multiInjectedProviderDiscovery: false,
  connectors: [
    coinbaseWallet({
      appName: "Base Tiny Poll",
      preference: "all",
    }),
    injected(),
    injected({
      target: {
        id: "metaMask",
        name: "MetaMask",
        provider: pickMetaMaskProvider,
      },
    }),
    injected({
      target() {
        return {
          id: "okx",
          name: "OKX",
          provider: pickOkxProvider,
        };
      },
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  dataSuffix: DATA_SUFFIX,
});
