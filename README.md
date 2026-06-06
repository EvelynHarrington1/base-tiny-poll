# Base Tiny Poll

Onchain micro poll mini app for Base. Users connect a wallet, choose between `Build More` and `Ship Faster`, and cast unlimited onchain votes.

## Stack

- Next.js App Router
- TypeScript
- Wagmi
- Viem
- Tailwind CSS

## Wallets

The app uses only Wagmi `coinbaseWallet` and `injected` connectors. The wallet menu exposes:

- Coinbase Wallet
- MetaMask
- OKX

## Required Environment

Copy `.env.example` to `.env.local` for local development and set:

```bash
NEXT_PUBLIC_POLL_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_BASE_APP_ID=...
NEXT_PUBLIC_BASE_BUILDER_CODE=0x...
```

`NEXT_PUBLIC_BASE_APP_ID` is hardcoded into the layout head as `base:app_id` for offchain attribution.

`NEXT_PUBLIC_BASE_BUILDER_CODE` is used as the onchain `dataSuffix` in the Wagmi config and explicitly on every `writeContract` call.

## Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseTinyPoll {
    mapping(address => uint8) public latestVote;
    mapping(address => uint256) public userVotes;
    uint256 public buildMoreVotes;
    uint256 public shipFasterVotes;
    uint256 public totalVotes;

    event VoteCast(address indexed user, uint8 vote, uint256 userVotes, uint256 totalVotes);

    function castVote(uint8 vote) external {
        require(vote < 2, "Invalid vote");

        latestVote[msg.sender] = vote;

        unchecked {
            userVotes[msg.sender] += 1;
            totalVotes += 1;

            if (vote == 0) {
                buildMoreVotes += 1;
            } else {
                shipFasterVotes += 1;
            }
        }

        emit VoteCast(msg.sender, vote, userVotes[msg.sender], totalVotes);
    }
}
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
