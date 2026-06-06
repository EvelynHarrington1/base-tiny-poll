"use client";

import {
  Activity,
  Check,
  CircleAlert,
  RadioTower,
  RefreshCcw,
  Send,
  Terminal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { BaseError } from "wagmi";
import {
  useAccount,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { baseTinyPollAbi } from "@/lib/abi";
import { pollContractAddress, pollOptions } from "@/lib/contracts";
import { DATA_SUFFIX } from "@/lib/wagmi";
import { cx, formatCount, shortAddress, txUrl } from "@/lib/ui";
import { WalletMenu } from "@/components/WalletMenu";

type VoteChoice = 0 | 1;

const readLabels = [
  "My Latest Vote",
  "My Votes",
  "Build More Votes",
  "Ship Faster Votes",
  "Total Votes",
] as const;

function selectedClass(selected: boolean) {
  return selected
    ? "border-cyan-200 bg-cyan-300/14 text-white shadow-[0_0_28px_rgba(0,212,255,0.18)]"
    : "border-white/12 bg-white/[0.025] text-slate-300 hover:border-cyan-300/45 hover:bg-cyan-300/8";
}

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const [choice, setChoice] = useState<VoteChoice>(0);
  const [lastHash, setLastHash] = useState<`0x${string}` | undefined>();

  const contractReady = Boolean(pollContractAddress);
  const readsEnabled = contractReady && Boolean(address);

  const contracts = useMemo(() => {
    if (!pollContractAddress || !address) return undefined;

    return [
      {
        address: pollContractAddress,
        abi: baseTinyPollAbi,
        functionName: "latestVote",
        args: [address],
      },
      {
        address: pollContractAddress,
        abi: baseTinyPollAbi,
        functionName: "userVotes",
        args: [address],
      },
      {
        address: pollContractAddress,
        abi: baseTinyPollAbi,
        functionName: "buildMoreVotes",
      },
      {
        address: pollContractAddress,
        abi: baseTinyPollAbi,
        functionName: "shipFasterVotes",
      },
      {
        address: pollContractAddress,
        abi: baseTinyPollAbi,
        functionName: "totalVotes",
      },
    ] as const;
  }, [address]);

  const {
    data: readData,
    isLoading: readsLoading,
    refetch,
  } = useReadContracts({
    contracts,
    query: {
      enabled: readsEnabled,
      refetchInterval: lastHash ? false : 12_000,
    },
  });

  const {
    data: hash,
    error: writeError,
    isPending: isWritePending,
    writeContract,
  } = useWriteContract();

  const {
    data: receipt,
    isLoading: isConfirming,
    isError: isReceiptError,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (!hash) return;
    setLastHash(hash);
  }, [hash]);

  useEffect(() => {
    if (!isConfirmed) return;
    void refetch();
  }, [isConfirmed, refetch]);

  const latestVote = readData?.[0]?.result as VoteChoice | undefined;
  const myVotes = readData?.[1]?.result as bigint | undefined;
  const buildMoreVotes = readData?.[2]?.result as bigint | undefined;
  const shipFasterVotes = readData?.[3]?.result as bigint | undefined;
  const totalVotes = readData?.[4]?.result as bigint | undefined;

  const stats = [
    {
      label: readLabels[0],
      value: latestVote === undefined ? "--" : pollOptions[latestVote],
    },
    { label: readLabels[1], value: formatCount(myVotes) },
    { label: readLabels[2], value: formatCount(buildMoreVotes) },
    { label: readLabels[3], value: formatCount(shipFasterVotes) },
    { label: readLabels[4], value: formatCount(totalVotes) },
  ];

  const canVote = isConnected && contractReady && !isWritePending && !isConfirming;
  const status = !isConnected
    ? "Disconnected"
    : chain?.id === 8453
      ? `Connected: ${address ? shortAddress(address) : "wallet"}`
      : "Wrong network";

  const errorMessage = writeError
    ? ((writeError as BaseError).shortMessage ?? writeError.message)
    : receiptError
      ? ((receiptError as BaseError).shortMessage ?? receiptError.message)
    : !contractReady
      ? "Set NEXT_PUBLIC_POLL_CONTRACT_ADDRESS before casting votes."
      : undefined;
  const transactionReverted = receipt?.status === "reverted";
  const transactionStatus = writeError
    ? "Failed before submission"
    : isReceiptError || transactionReverted
      ? "Failed onchain"
    : isConfirmed
      ? "Success"
        : isConfirming
          ? "Pending on Base"
          : hash
            ? "Submitted"
            : "Idle";

  function castVote() {
    if (!pollContractAddress) return;

    writeContract({
      address: pollContractAddress,
      abi: baseTinyPollAbi,
      functionName: "castVote",
      args: [choice],
      dataSuffix: DATA_SUFFIX,
    });
  }

  return (
    <main className="min-h-screen px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-300/20 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center border border-cyan-300/45 bg-[#0052ff]/18 text-cyan-100">
              <Terminal size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/75">
                Onchain Micro Poll
              </p>
              <h1 className="text-xl font-semibold text-white sm:text-2xl">Base Tiny Poll</h1>
            </div>
          </div>
          <WalletMenu />
        </header>

        <section className="grid flex-1 gap-5 py-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="terminal-panel scanline relative flex flex-col justify-between overflow-hidden p-5 sm:p-7">
            <div className="relative z-10">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/18 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-orange-200/80">
                    Voting Booth // Base Mainnet
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-white sm:text-5xl">
                    Choose the operating mode.
                  </h2>
                </div>
                <div className="flex items-center gap-2 border border-cyan-300/30 bg-cyan-300/8 px-3 py-2 text-xs uppercase text-cyan-100">
                  <RadioTower size={14} />
                  Live terminal
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {pollOptions.map((option, index) => {
                  const selected = choice === index;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setChoice(index as VoteChoice)}
                      className={cx(
                        "min-h-36 border p-5 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-200",
                        selectedClass(selected),
                      )}
                    >
                      <span className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-cyan-100/80">
                        Option 0{index + 1}
                        {selected ? <Check size={18} className="text-cyan-100" /> : null}
                      </span>
                      <span className="mt-8 block text-2xl font-semibold text-white sm:text-3xl">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 mt-7 flex flex-col gap-3 border-t border-cyan-300/18 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                disabled={!canVote}
                onClick={castVote}
                className="flex min-h-12 items-center justify-center gap-2 bg-[#0052ff] px-5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_0_26px_rgba(0,82,255,0.4)] transition hover:bg-[#1463ff] disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
              >
                <Send size={17} />
                {isWritePending ? "Confirm Wallet" : isConfirming ? "Writing Vote" : "Cast Vote"}
              </button>

              <button
                type="button"
                disabled={!readsEnabled || readsLoading}
                onClick={() => void refetch()}
                className="flex min-h-12 items-center justify-center gap-2 border border-cyan-300/35 px-4 text-sm text-cyan-100 transition hover:bg-cyan-300/8 disabled:border-slate-700 disabled:text-slate-500"
              >
                <RefreshCcw size={16} className={cx(readsLoading && "animate-spin")} />
                Refresh
              </button>
            </div>
          </div>

          <aside className="grid gap-5">
            <div className="terminal-panel relative overflow-hidden p-5">
              <div className="relative z-10 flex items-center justify-between border-b border-cyan-300/18 pb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">
                    Wallet Status
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">{status}</p>
                </div>
                <Activity size={20} className="text-cyan-200" />
              </div>
              <div className="relative z-10 mt-4 text-sm text-slate-300">
                <p className="text-slate-400">Contract</p>
                <p className="mt-1 break-all text-cyan-100">
                  {pollContractAddress ?? "Not configured"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {stats.map((stat) => (
                <div key={stat.label} className="terminal-panel relative overflow-hidden p-4">
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/68">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="terminal-panel relative overflow-hidden p-5">
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">
                  Last Transaction
                </p>
                <p
                  className={cx(
                    "mt-2 inline-flex border px-2 py-1 text-xs uppercase tracking-[0.12em]",
                    transactionStatus === "Success" &&
                      "border-cyan-300/45 bg-cyan-300/10 text-cyan-100",
                    transactionStatus.includes("Failed") &&
                      "border-orange-300/45 bg-orange-500/10 text-orange-100",
                    !transactionStatus.includes("Failed") &&
                      transactionStatus !== "Success" &&
                      "border-white/12 bg-white/[0.03] text-slate-300",
                  )}
                >
                  {transactionStatus}
                </p>
                {lastHash ? (
                  <a
                    href={txUrl(lastHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm text-cyan-100 underline decoration-cyan-300/40 underline-offset-4 hover:text-white"
                  >
                    {lastHash}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">No transaction submitted yet.</p>
                )}
                {errorMessage ? (
                  <div className="mt-4 flex gap-2 border border-orange-300/40 bg-orange-500/10 p-3 text-sm text-orange-100">
                    <CircleAlert size={18} className="mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
