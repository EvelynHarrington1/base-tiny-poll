# BaseTinyPoll

BaseTinyPoll is an onchain micro-poll mini app for Base.

The app lets users connect a supported wallet, choose between `Build More` and `Ship Faster`, and cast onchain votes. Voting is intentionally simple: each vote is recorded onchain, and users may vote more than once.

## Repository

https://github.com/EvelynHarrington1/base-tiny-poll.git

## Overview

BaseTinyPoll provides a minimal example of a Base-focused polling experience.

The frontend is built with Next.js and TypeScript, styled with Tailwind CSS, and connected to the blockchain through Wagmi and Viem.

The poll contract stores:

- Each user's latest vote
- Each user's total number of votes
- Total votes for `Build More`
- Total votes for `Ship Faster`
- Overall total votes

## Features

- Onchain voting on Base
- Two poll choices: `Build More` and `Ship Faster`
- Unlimited voting per user
- Wallet connection through selected Wagmi connectors
- Readable vote totals from the contract
- Simple, lightweight UI
- TypeScript-based Next.js App Router project
- Tailwind CSS styling

## Stack

- Next.js App Router
- TypeScript
- Wagmi
- Viem
- Tailwind CSS

## Supported Wallet Options

The app uses only the following Wagmi connectors:

- `coinbaseWallet`
- `injected`

The wallet menu exposes:

- Coinbase Wallet
- MetaMask
- OKX

## Environment Variables

For local development, copy the example environment file:

```bash
cp .env.example .env.local
```

Then set the following values in `.env.local`:

```bash
NEXT_PUBLIC_POLL_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_BASE_BUILDER_CODE=bc_j6yfi83r
NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX=0x...
```

### Environment Variable Notes

`NEXT_PUBLIC_POLL_CONTRACT_ADDRESS` should be set to the deployed `BaseTinyPoll` contract address.

`NEXT_PUBLIC_BASE_BUILDER_CODE` stores the readable Base Builder Code.

`NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX` stores the ERC-8021 encoded suffix used in the Wagmi configuration and on every explicit `writeContract` call.

The `base:app_id` value for Base verification is located in `app/layout.tsx`. Replace the placeholder value before completing verification.

## Contract

The poll contract is intentionally small and focused.

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

## Vote Values

The contract accepts a `uint8` value for each vote.

- `0` means `Build More`
- `1` means `Ship Faster`

Any value greater than `1` is rejected by the contract.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/EvelynHarrington1/base-tiny-poll.git
cd base-tiny-poll
```

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with the required contract and Base Builder values.

## Development

Start the local development server:

```bash
npm run dev
```

Open the local URL shown in your terminal to view the app.
