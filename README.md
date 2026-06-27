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
