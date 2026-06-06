"use client";

import { ChevronDown, LogOut, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { base } from "wagmi/chains";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { cx, shortAddress } from "@/lib/ui";

const walletTargets = [
  { label: "Coinbase Wallet", connectorName: "Coinbase Wallet" },
  { label: "MetaMask", connectorName: "MetaMask" },
  { label: "OKX", connectorName: "OKX" },
] as const;

export function WalletMenu() {
  const { address, chainId, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [open, setOpen] = useState(false);

  const walletOptions = useMemo(
    () =>
      walletTargets.map((wallet) => ({
        ...wallet,
        connector: connectors.find((connector) => connector.name === wallet.connectorName),
      })),
    [connectors],
  );

  const wrongNetwork = isConnected && chainId !== base.id;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 items-center gap-2 border border-cyan-300/45 bg-[#06152c] px-4 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,212,255,0.12)] transition hover:border-cyan-200 hover:bg-[#082044]"
      >
        <Wallet size={17} />
        <span>{address ? shortAddress(address) : "Connect Wallet"}</span>
        <ChevronDown size={16} className={cx("transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-64 border border-cyan-300/35 bg-[#06101f] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
          {wrongNetwork ? (
            <button
              type="button"
              disabled={isSwitching}
              onClick={() => switchChain({ chainId: base.id })}
              className="mb-2 flex w-full items-center justify-between border border-orange-300/55 bg-orange-500/12 px-3 py-2 text-left text-sm text-orange-100 transition hover:bg-orange-500/18 disabled:opacity-60"
            >
              <span>Switch to Base</span>
              <span>{isSwitching ? "..." : "8453"}</span>
            </button>
          ) : null}

          {walletOptions.map(({ label, connector }) => (
            <button
              key={label}
              type="button"
              disabled={!connector || isPending}
              onClick={() => {
                if (!connector) return;
                connect({ connector, chainId: base.id });
                setOpen(false);
              }}
              className="flex w-full items-center justify-between border border-transparent px-3 py-2 text-left text-sm text-slate-100 transition hover:border-cyan-300/35 hover:bg-cyan-300/8 disabled:text-slate-500"
            >
              <span>{label}</span>
              <span className="text-xs uppercase text-cyan-200/75">
                {connector ? "ready" : "missing"}
              </span>
            </button>
          ))}

          {isConnected ? (
            <button
              type="button"
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
              className="mt-2 flex w-full items-center gap-2 border border-white/10 px-3 py-2 text-left text-sm text-slate-300 transition hover:border-orange-300/45 hover:text-orange-100"
            >
              <LogOut size={15} />
              Disconnect
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
