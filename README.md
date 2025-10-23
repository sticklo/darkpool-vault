# 🌊 DarkPool

> Social DCA investing embedded in your Farcaster feed

## 🚀 Try It Now

**Live Demo:** https://darkpool-vault.netlify.app

**Demo Video:** [Coming soon]

**Smart Contract:** [View on Base Sepolia](https://base-sepolia.blockscout.com/address/0xB85b0BA54C50738AB362A7947C94DFf20660dD7d)

---

## What is DarkPool?

DCA alone is boring. DCA with friends competing on consistency? That's sticky.

DarkPool brings automated cbBTC investing directly into Farcaster. Deposit USDC anytime. Every week (v1), the vault automatically swaps to cbBTC. Friends see your consistency. You earn badges for streaks. This is how we make crypto investing social.


---

## The Problem

Crypto investing is isolated:
- Set up DCA on an exchange
- It runs in the background
- You forget about it
- Prices dump, you panic and stop
- No accountability, no social proof

Traditional DCA tools have automation but zero social features. Farcaster has social but no serious investing tools.

---

## The Solution

**DarkPool = Automated DCA + Social Accountability + Embedded Distribution**

- Deposit USDC directly from your Farcaster feed
- Vault pools funds transparently on Base
- In v1, automatic weekly cbBTC purchases
- In v2, compete with friends on consistency streaks
- In v3, one-tap gasless deposits

---

## How It Works

1. See DarkPool in your Farcaster feed
2. Tap to open Mini App
3. Connect wallet (MetaMask or Coinbase)
4. Deposit USDC to pooled vault
5. (v1) Vault auto-swaps to cbBTC every Sunday
6. (v2) Earn badges, compete on leaderboards
7. (v3) All gasless, truly one-tap

---

## v0 Features (Live Now)

This hackathon submission demonstrates the foundation:

- ✅ **Farcaster Mini App** - Opens directly in Farcaster
- ✅ **Pooled Vault** - Deposits pooled transparently on Base Sepolia
- ✅ **Real-time Stats** - Read total deposited and user count from blockchain
- ✅ **Wallet Integration** - MetaMask and Coinbase Wallet support
- ✅ **Deposit Flow** - Approve USDC, deposit to vault, stats auto-update
- ✅ **Verified Contract** - All transactions transparent on Base

---

## Roadmap

### v0 - Foundation (Now) ✅
Pooled deposits via Farcaster Mini App on Base Sepolia

### v1 - Automation (End of October)
- Automated weekly USDC → cbBTC swaps
- Chainlink Automation for scheduled execution
- Uniswap integration for swaps
- User withdrawals

### v2 - Gamification (November)
- NFT badges for milestones (first deposit, 10-week streak, etc.)
- Leaderboards (top depositors, longest streaks)
- Streak tracking (consecutive deposits)
- Social feed integration (see friends' activity)

### v3 - Gasless UX (December)
- Account Abstraction (ERC-4337)
- Paymaster for gas sponsorship
- True one-tap deposits, no MetaMask popups
- Session keys for recurring transactions

### v4 - Full Platform (2026)
- Multiple vaults (cbBTC, cbETH, other assets)
- DAO governance with $DARK token
- Community-created strategies
- Cross-chain support

---

## Tech Stack

**Frontend:**
- Next.js 15.3.4
- TypeScript
- Tailwind CSS
- OnchainKit (Base toolkit)

**Blockchain:**
- Solidity 0.8.30
- Base (Sepolia testnet for v0)
- wagmi 2.16.3 (React hooks)
- viem 2.31.6 (Ethereum library)
- Remix IDE (contract development & deployment)

**Infrastructure:**
- Netlify (hosting)
- Farcaster Mini Apps SDK
- OpenZeppelin (contract standards)

**Future (v1+):**
- Chainlink Automation
- Uniswap V3
- Account Abstraction (ERC-4337)

---

## Local Development
```bash
# Clone the repo
git clone https://github.com/yourusername/darkpool-vault.git
cd darkpool-vault/miniapp

# Install dependencies
npm install

# Set up environment variables
# Create .env.local and add:
# NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key_here

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## Testing on Base Sepolia

You'll need testnet tokens:

**Base Sepolia ETH (for gas):**
- Alchemy Faucet: https://www.alchemy.com/faucets/base-sepolia
- Get 0.1-0.5 ETH free

**Testnet USDC (to deposit):**
- Circle Faucet: https://faucet.circle.com
- Select "Base Sepolia", get 10 USDC/day

**Then:**
1. Connect wallet to Base Sepolia
2. Import USDC token: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
3. Open deployed app or localhost
4. Approve and deposit USDC
5. Watch stats update

---

## Smart Contract

**Address:** `0xB85b0BA54C50738AB362A7947C94DFf20660dD7d`

**Network:** Base Sepolia (Chain ID: 84532)

**Key Functions:**
- `deposit(uint256 amount)` - Deposit USDC to vault
- `getVaultStats()` - Read total deposited, user count, balance
- `getUserStats(address user)` - Read user's deposits

**View on Explorer:**
https://base-sepolia.blockscout.com/address/0xB85b0BA54C50738AB362A7947C94DFf20660dD7d

---

## Why DarkPool?

**For Users:**
- Consistent Bitcoin accumulation without thinking
- Social accountability keeps you disciplined
- Compete with friends on streaks, not just gains
- All transparent on-chain, no trust needed

**For Base:**
- Drives user adoption (brings normies onchain)
- Sticky engagement (social features increase retention)
- Showcases Mini Apps (new distribution primitive)
- Real utility (not speculation or memes)

**For Crypto:**
- Proves DeFi can be simple
- Shows social + finance works
- Demonstrates Account Abstraction UX
- Blueprint for consumer crypto apps

---

## Competitors

**Automated DCA exists** (Binance, Kraken, Coinbase, Deltabadger) but it's:
- Centralized or isolated
- No social features
- Separate websites you forget to visit

**Farcaster has social** (tipping bots, NFT mints, games) but:
- No serious long-term investing tools
- Mostly speculation or one-off actions

**DarkPool is the only platform combining all three:**
- Automated DCA (proven strategy)
- Social accountability (increases retention)
- Embedded in feed (reduces friction)

---

## Built For

**Base Batches 002: Builder Track**

Built and deployed in 4 days using modern development workflows (Cursor + Claude AI). 

Demonstrates that solo builders leveraging AI tools can ship at the speed of full teams.

---

## What's Next

Post-hackathon roadmap:
1. Security audit and mainnet deployment (end of October)
2. v1 automation with Chainlink + Uniswap
3. First 100 real users from Farcaster community
4. Add gamification layer (badges, leaderboards)
5. Raise pre-seed funding ($100 - 300k)
6. Find technical co-founder for scaling

---

## Contributing

This is a hackathon project, but if you're interested in collaborating post-hackathon, reach out:
- Farcaster: [@sticklo]
- Twitter: [@sticklosama]


---

## License

MIT

---

## Acknowledgments

Built with:
- [Base](https://base.org) - L2 blockchain
- [Farcaster](https://farcaster.xyz) - Decentralized social protocol
- [OnchainKit](https://onchainkit.xyz) - Base development toolkit
- [Remix] (https://remix.ethereum.org) - Remix IDE (smart contract development & deployment)
- [Cursor](https://cursor.sh) + [Claude](https://claude.ai) - AI development tools

Special thanks to the Base and Farcaster communities for support and testing.

---

**Try DarkPool today:** https://darkpool-vault.netlify.app

**Let's make crypto investing social.** 🌊