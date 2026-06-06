import { getAddress, isAddress } from "viem";

export const baseTinyPollAbi = [
  {
    type: "function",
    name: "latestVote",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "userVotes",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "buildMoreVotes",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "shipFasterVotes",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalVotes",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "castVote",
    stateMutability: "nonpayable",
    inputs: [{ name: "vote", type: "uint8" }],
    outputs: [],
  },
  {
    type: "event",
    name: "VoteCast",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "vote", type: "uint8", indexed: false },
      { name: "userVotes", type: "uint256", indexed: false },
      { name: "totalVotes", type: "uint256", indexed: false },
    ],
  },
] as const;

const configuredAddress = process.env.NEXT_PUBLIC_POLL_CONTRACT_ADDRESS;

export const pollContractAddress =
  configuredAddress && isAddress(configuredAddress)
    ? getAddress(configuredAddress)
    : undefined;

export const pollOptions = ["Build More", "Ship Faster"] as const;
