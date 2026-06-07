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
NEXT_PUBLIC_BASE_BUILDER_CODE=bc_j6yfi83r
NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX=0x...
```

The Base Verify token is hardcoded into `app/layout.tsx` as `base:app_id` for offchain attribution. Replace the placeholder before verification.

`NEXT_PUBLIC_BASE_BUILDER_CODE` stores the readable Base Builder Code. `NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX` is the ERC-8021 encoded suffix used in the Wagmi config and explicitly on every `writeContract` call.

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
