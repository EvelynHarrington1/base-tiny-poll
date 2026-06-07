import { getAddress, isAddress } from "viem";

const defaultPollContractAddress = "0xb1ece082a1cbb44040ec463ec0b804aa4256b18b";
const configuredAddress =
  process.env.NEXT_PUBLIC_POLL_CONTRACT_ADDRESS ?? defaultPollContractAddress;

export const pollContractAddress =
  configuredAddress && isAddress(configuredAddress)
    ? getAddress(configuredAddress)
    : undefined;

export const pollOptions = ["Build More", "Ship Faster"] as const;
