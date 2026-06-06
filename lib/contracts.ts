import { getAddress, isAddress } from "viem";

const configuredAddress = process.env.NEXT_PUBLIC_POLL_CONTRACT_ADDRESS;

export const pollContractAddress =
  configuredAddress && isAddress(configuredAddress)
    ? getAddress(configuredAddress)
    : undefined;

export const pollOptions = ["Build More", "Ship Faster"] as const;
