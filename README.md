# BaseTinyPoll

BaseTinyPoll is an onchain micro-poll mini app built for Base.

It provides a small, focused polling experience where users connect a supported wallet, choose between `Build More` and `Ship Faster`, and cast votes onchain.

Voting is intentionally simple. Each vote is written to the contract, and the same user may vote more than once.

## Repository

https://github.com/EvelynHarrington1/base-tiny-poll.git

## Overview

BaseTinyPoll is a minimal Base-focused polling app.

The frontend is built with Next.js and TypeScript.

Styling is handled with Tailwind CSS.

Blockchain reads and writes are handled through Wagmi and Viem.

The smart contract records the latest vote for each user, the number of votes each user has cast, and the overall totals for each poll option.

## Features

- Onchain voting on Base
- Two poll options: `Build More` and `Ship Faster`
- Repeat voting by the same user
- Wallet connection through selected Wagmi connectors
- Contract-read vote totals
- Lightweight user interface
- Next.js App Router structure
- TypeScript source code
- Tailwind CSS styling
- Small, easy-to-review Solidity contract

## Tech Stack

- Next.js App Router
- TypeScript
- Wagmi
- Viem
- Tailwind CSS
- Solidity

## Supported Wallet Options

The app uses the following Wagmi connectors:

- `coinbaseWallet`
- `injected`

The wallet menu includes:

- Coinbase Wallet
- MetaMask
- OKX

## Poll Options

The poll has two choices:

- `Build More`
- `Ship Faster`

The contract expects each vote as a `uint8`.
