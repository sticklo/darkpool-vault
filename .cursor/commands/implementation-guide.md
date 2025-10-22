
# DarkPool v0 - Complete Implementation Guide for Cursor AI

## 📋 Project Overview

### What is DarkPool?
DarkPool is a social DCA (Dollar-Cost Averaging) investment platform built on Base, integrated directly into Farcaster as a Mini App. It transforms traditional, isolated DCA investing into a social, gamified experience.

### The Vision
Traditional DeFi has a UX problem: users must leave their social apps, navigate complex interfaces, connect wallets, sign multiple transactions, and pay gas fees. DarkPool solves this by bringing automated cbBTC investing directly into Farcaster feeds with one-tap deposits, social proof, and gamification.

### Product Roadmap

**v0 (Current - Hackathon Submission):**
- Farcaster Mini App that opens in-app
- Deposit USDC to pooled vault
- Read real-time vault statistics from blockchain
- Transparent on-chain tracking
- Working approve + deposit flow

**v1 (Post-Hackathon - End of October):**
- **Automated DCA Execution:** Vault automatically swaps pooled USDC → cbBTC weekly
- **Chainlink Automation:** Scheduled execution every Sunday at noon
- **Uniswap Integration:** USDC/cbBTC swaps on Base
- **Proportional Distribution:** Users receive cbBTC based on their deposit share
- **Withdrawal Function:** Users can withdraw their cbBTC anytime

**v2 (Month 2-3):**
- NFT badges for milestones
- Streak tracking (consecutive deposits)
- Leaderboards (top depositors, longest streaks)
- Social feed integration

**v3 (Month 4-6):**
- Account Abstraction (gasless deposits)
- One-click UX (no MetaMask popups)
- Session keys for recurring transactions

**v4 (Month 6+):**
- Multiple vaults (cbBTC, cbETH, other assets)
- DAO governance with $DARK token
- Community-created strategies

---

## 🎯 v0 Scope (What We're Building Now)

### Features
1. **Wallet Connection:** Users connect Farcaster wallet, MetaMask or Coinbase Wallet
2. **Read Blockchain Data:** Display total deposited USDC and number of users
3. **Approve USDC:** Users approve vault to spend their USDC
4. **Deposit USDC:** Users deposit 10 USDC to the vault
5. **Real-time Updates:** Stats refresh after successful deposits
6. **Loading States:** Show transaction progress
7. **Error Handling:** Clear error messages for failed transactions

### What v0 Does NOT Include
- ❌ Automated DCA execution (coming in v1)
- ❌ cbBTC swaps (coming in v1)
- ❌ Withdrawals (coming in v1)
- ❌ Gamification (coming in v2)
- ❌ Gasless transactions (coming in v3)

### Why This Scope?
v0 proves the foundation works: pooled deposits on Base, accessible via Farcaster Mini App, with transparent on-chain tracking. This demonstrates the core mechanism and validates the user experience before building complex automation.

---

## 🏗️ Current File Structure
```
darkpool-vault/
├── .cursor/
│   └── commands/
│       └── miniapp.md
├── miniapp/                          # ← We're working here
│   ├── .next/                        # Build output (auto-generated)
│   ├── app/
│   │   ├── api/
│   │   │   └── farcaster-manifest/
│   │   │       └── route.ts          # Mini App manifest endpoint
│   │   ├── favicon.ico
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── page.module.css           # Component styles (needs updates)
│   │   ├── page.tsx                  # Main UI (needs updates)
│   │   └── rootProvider.tsx          # Wagmi/OnchainKit setup (needs updates)
│   ├── lib/                          # ← Will create this folder
│   │   └── contract.ts               # ← Will create this file
│   ├── node_modules/
│   ├── public/
│   │   ├── .well-known/
│   │   │   └── farcaster.json        # Mini App manifest
│   │   ├── og-image.png              # Preview image
│   │   └── sphere.svg
│   ├── .env                          # ← CURRENTLY EMPTY (needs setup)
│   ├── .gitignore
│   ├── eslint.config.mjs
│   ├── netlify.toml                  # Netlify configuration
│   ├── next.config.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── README.md
└── frame/                            # Old Frame v1 attempt (ignore for now)
```

---

## 🔐 Environment Variables Setup

### Current Status
Your `.env` file is **EMPTY**. We need to set up environment variables.

### Required Variables

**Create/Update:** `miniapp/.env.local` (NOT `.env` - use `.env.local` for Next.js)
```bash
# OnchainKit API Key (OPTIONAL but recommended)
# Used for better wallet UX and rate limiting
NEXT_PUBLIC_ONCHAINKIT_API_KEY=
```

### How to Get OnchainKit API Key (Optional - 5 minutes)

**Option A: Get Official Key (Recommended)**
1. Go to https://portal.cdp.coinbase.com/
2. Sign up or log in with your email
3. Navigate to "Products" → "OnchainKit"
4. Click "Create API Key"
5. Copy the key
6. Paste it in `.env.local` as: `NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key_here`

**Option B: Skip for Now**
The app works without this key. You can add it later if you want better performance.

### Note About .env vs .env.local
- `.env` - Committed to git (public variables)
- `.env.local` - NOT committed (sensitive keys)
- Next.js automatically uses `.env.local` for local development

---

## 🔗 Smart Contract Information

### Deployed Contracts (Base Sepolia Testnet)

**DarkPool Vault Contract:**
- Address: `0xB85b0BA54C50738AB362A7947C94DFf20660dD7d`
- Network: Base Sepolia (Chain ID: 84532)
- Explorer: https://base-sepolia.blockscout.com/address/0xB85b0BA54C50738AB362A7947C94DFf20660dD7d
- Verified Source: https://repo.sourcify.dev/84532/0xB85b0BA54C50738AB362A7947C94DFf20660dD7d/

**Key Functions:**
```solidity
// Read Functions
getVaultStats() returns (uint256 totalDeposited, uint256 totalUsers, uint256 currentBalance)
getUserStats(address user) returns (uint256 deposited, uint256 depositCount)

// Write Functions  
deposit(uint256 amount) // Deposit USDC to vault
```

**USDC (Testnet):**
- Address: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- Decimals: **6** (CRITICAL: Not 18 like most tokens!)
- This is Base Sepolia testnet USDC

**Key Functions:**
```solidity
approve(address spender, uint256 amount) // Must call before deposit
balanceOf(address account) returns (uint256) // Check user's USDC balance
```

### Important Notes
1. **USDC uses 6 decimals:** 10 USDC = 10,000,000 (not 10,000,000,000,000,000,000)
2. **Two-step deposit:** Users must first approve, then deposit
3. **Gas required:** Users need Base Sepolia ETH for transaction fees

---

## 📝 Implementation Steps

Follow these steps **IN ORDER**. Test each step before moving to the next.

---

## STEP 1: Create Contract Configuration

### Goal
Create a TypeScript file with contract addresses and ABIs so we can interact with the blockchain.

### Action
**Create new file:** `miniapp/lib/contract.ts`

**Full content:**
```typescript
// DarkPool Vault Contract Configuration
export const VAULT_ADDRESS = "0xB85b0BA54C50738AB362A7947C94DFf20660dD7d" as const;

// Minimal ABI - only functions we need
export const VAULT_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "_amount", "type": "uint256"}
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVaultStats",
    "outputs": [
      {"internalType": "uint256", "name": "total", "type": "uint256"},
      {"internalType": "uint256", "name": "users", "type": "uint256"},
      {"internalType": "uint256", "name": "balance", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_user", "type": "address"}
    ],
    "name": "getUserStats",
    "outputs": [
      {"internalType": "uint256", "name": "deposited", "type": "uint256"},
      {"internalType": "uint256", "name": "count", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// USDC Contract Configuration
export const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

export const USDC_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "account", "type": "address"}
    ],
    "name": "balanceOf",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
```

### Test Step 1
1. File created at correct location: `miniapp/lib/contract.ts`
2. No TypeScript errors in file
3. Addresses match the ones specified above

### Why This Matters
This file tells our app where the smart contracts are and how to talk to them. The ABIs (Application Binary Interfaces) are like instruction manuals for the contracts.

---

## STEP 2: Update Root Provider

### Goal
Configure wagmi and OnchainKit to connect to Base Sepolia network and support MetaMask/Coinbase Wallet.

### Action
**Replace entire content of:** `miniapp/app/rootProvider.tsx`

**Full content:**
```typescript
"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { baseSepolia } from "wagmi/chains";
import { http, WagmiProvider, createConfig } from "wagmi";
import { coinbaseWallet, metaMask, injected } from "wagmi/connectors";
import type { ReactNode } from "react";

// Create query client for React Query
const queryClient = new QueryClient();

// Configure wagmi for Base Sepolia
const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    metaMask(),                           // MetaMask support
    injected(),                           // Other injected wallets
    coinbaseWallet({
      appName: "DarkPool Vault",
      preference: "smartWalletOnly",
    }),
  ],
  ssr: true,                              // Server-side rendering support
  transports: {
    [baseSepolia.id]: http(),             // RPC endpoint
  },
});

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### What Changed
- Added `metaMask()` connector (for MetaMask support)
- Added `injected()` connector (for other wallets)
- Configured for Base Sepolia network specifically
- Added proper TypeScript types

### Test Step 2
1. File saved without errors
2. Run `npm run dev`
3. Open http://localhost:3000
4. Page loads (even if UI doesn't work yet)
5. Check browser console - should be no errors about missing connectors

### Why This Matters
This configures how users will connect their wallets. Without this, the wallet connection button won't work.

---

## STEP 3: Update Main Page Component

### Goal
Connect the UI to the smart contract. Make buttons actually work.

### Action
**Replace entire content of:** `miniapp/app/page.tsx`

**Full content:**
```typescript
"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { VAULT_ADDRESS, VAULT_ABI, USDC_ADDRESS, USDC_ABI } from "../lib/contract";

export default function Home() {
  // Get wallet connection status
  const { address, isConnected } = useAccount();
  
  // Handle writing to contracts (approve/deposit)
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  
  // Wait for transaction confirmation
  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  
  // Track which transaction is happening
  const [txStep, setTxStep] = useState<"idle" | "approving" | "depositing">("idle");

  // Read vault statistics from blockchain
  const { 
    data: vaultStats, 
    refetch,
    isLoading: isLoadingStats,
    error: readError
  } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getVaultStats",
  });

  // Auto-refresh stats after successful transaction
  useEffect(() => {
    if (isSuccess) {
      // Wait 2 seconds for blockchain to update
      setTimeout(() => {
        refetch();
        setTxStep("idle");
      }, 2000);
    }
  }, [isSuccess, refetch]);

  // Handle USDC approval
  const handleApprove = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    setTxStep("approving");
    
    try {
      await writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "approve",
        args: [VAULT_ADDRESS, parseUnits("10", 6)], // 10 USDC with 6 decimals
      });
    } catch (error) {
      console.error("Approve error:", error);
      setTxStep("idle");
    }
  };

  // Handle USDC deposit
  const handleDeposit = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    setTxStep("depositing");
    
    try {
      await writeContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [parseUnits("10", 6)], // 10 USDC with 6 decimals
      });
    } catch (error) {
      console.error("Deposit error:", error);
      setTxStep("idle");
    }
  };

  // Format stats for display
  const totalDeposited = vaultStats ? formatUnits(vaultStats[0], 6) : "0";
  const totalUsers = vaultStats ? vaultStats[1].toString() : "0";

  // Button states
  const isApproving = txStep === "approving" && isPending;
  const isDepositing = txStep === "depositing" && isPending;
  const isProcessing = isPending || isConfirming;

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>
      
      <div className={styles.content}>
        <h1 className={styles.title}>DarkPool Vault</h1>
        <p className={styles.subtitle}>
          Automated cbBTC DCA on Base
        </p>

        <div className={styles.statsCard}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Deposited</span>
            <span className={styles.statValue}>
              {isLoadingStats ? "..." : `$${totalDeposited} USDC`}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Users</span>
            <span className={styles.statValue}>
              {isLoadingStats ? "..." : totalUsers}
            </span>
          </div>
        </div>

        <div className={styles.depositCard}>
          <h2>Deposit to Vault</h2>
          <p className={styles.description}>
            Deposit USDC to automatically DCA into cbBTC weekly
          </p>
          
          <div className={styles.buttonGroup}>
            <button 
              onClick={handleApprove}
              disabled={!isConnected || isProcessing}
              className={styles.approveButton}
            >
              {isApproving ? "Approving..." : "1. Approve USDC"}
            </button>

            <button 
              onClick={handleDeposit}
              disabled={!isConnected || isProcessing}
              className={styles.depositButton}
            >
              {isDepositing ? "Depositing..." : "2. Deposit 10 USDC"}
            </button>
          </div>

          {isConfirming && (
            <div className={styles.info}>
              ⏳ Waiting for confirmation...
            </div>
          )}

          {isSuccess && (
            <div className={styles.success}>
              ✅ Transaction successful! Stats will update shortly.
            </div>
          )}

          {writeError && (
            <div className={styles.error}>
              ❌ Transaction failed. See console for details.
            </div>
          )}

          {readError && (
            <div className={styles.error}>
              ⚠️ Could not load vault stats. Check network connection.
            </div>
          )}

          <div className={styles.info}>
            <p>🔄 <strong>v0:</strong> Deposits pooled on-chain</p>
            <p>📅 <strong>v1:</strong> Automated cbBTC DCA (coming soon)</p>
          </div>

          <a 
            href="https://base-sepolia.blockscout.com/address/0xB85b0BA54C50738AB362A7947C94DFf20660dD7d"
            target="_blank"
            rel="noreferrer"
            className={styles.viewContract}
          >
            View Contract on Explorer →
          </a>
        </div>
      </div>
    </div>
  );
}
```

### Key Features Implemented
- ✅ Read vault stats from blockchain
- ✅ Display total deposited USDC and user count
- ✅ Approve USDC for vault
- ✅ Deposit USDC to vault
- ✅ Show loading states during transactions
- ✅ Display success/error messages
- ✅ Auto-refresh stats after deposit
- ✅ Proper USDC decimal handling (6 decimals)

### Test Step 3
1. Save file
2. Check terminal - `npm run dev` should still be running
3. Refresh http://localhost:3000
4. Page loads with updated UI
5. Stats section shows "..." then numbers (reading from blockchain!)
6. Two buttons appear: "1. Approve USDC" and "2. Deposit 10 USDC"
7. Browser console shows no errors

### Why This Matters
This is the core functionality. The UI now actually talks to the blockchain instead of showing fake static data.

---

## STEP 4: Add Missing CSS Styles

### Goal
Add styles for the new button states, success messages, and info boxes.

### Action
**Add to END of:** `miniapp/app/page.module.css`

**Content to add:**
```css
/* Description text */
.description {
  color: #94a3b8;
  margin-bottom: 30px;
  font-size: 1rem;
}

/* Button container */
.buttonGroup {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

/* Button base styles */
.approveButton,
.depositButton {
  width: 100%;
  padding: 16px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

/* Approve button specific */
.approveButton {
  background: rgba(59, 130, 246, 0.3);
  border: 2px solid #3b82f6;
}

.approveButton:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.5);
  transform: scale(1.02);
}

/* Deposit button specific */
.depositButton {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
}

.depositButton:hover:not(:disabled) {
  transform: scale(1.02);
}

/* Disabled state */
.approveButton:disabled,
.depositButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Success message */
.success {
  color: #10b981;
  font-weight: bold;
  margin: 20px 0;
  padding: 15px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* Error message */
.error {
  color: #ef4444;
  font-weight: bold;
  margin: 20px 0;
  padding: 15px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Info box */
.info {
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  text-align: left;
}

.info p {
  margin: 8px 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.info strong {
  color: #60a5fa;
}
```

### Test Step 4
1. Save file
2. Refresh browser
3. Buttons should look better (colors, hover effects)
4. Info box at bottom should have blue background
5. No CSS errors in console

### Why This Matters
Visual feedback is critical. Users need to see loading states, success confirmations, and error messages.

---

## STEP 5: Full Integration Test

### Goal
Test the complete flow from wallet connection to successful deposit.

### Prerequisites
**IMPORTANT:** You need testnet tokens before testing.

#### Get Base Sepolia ETH (for gas fees):
1. Go to https://www.alchemy.com/faucets/base-sepolia
2. Enter your wallet address
3. Complete captcha
4. Receive ~0.1 ETH (takes 1-2 minutes)
5. Verify in MetaMask on Base Sepolia network

#### Get Testnet USDC:
**Option A:** Check if contract has mint function
1. Go to https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e#writeContract
2. Look for "Write Contract" tab
3. If there's a `mint()` function, connect wallet and mint yourself 100 USDC
4. If no mint function, try Option B

**Option B:** Bridge or swap
1. Some Base Sepolia faucets give USDC directly
2. Or swap testnet ETH → USDC on a testnet DEX
3. You need at least 10 USDC to test

### Test Procedure

#### 5.1: Verify Stats Loading
1. Open http://localhost:3000
2. Wait 2-3 seconds
3. Stats should show actual numbers (not "...")
4. Numbers should match what's on Basescan: https://base-sepolia.blockscout.com/address/0xB85b0BA54C50738AB362A7947C94DFf20660dD7d
5. If stats show "0 USDC" and "0 users", that's fine - vault might be empty

**✅ Pass:** Stats load and show numbers
**❌ Fail:** Stats stuck on "..." or show error

#### 5.2: Connect Wallet
1. Click wallet button in top right
2. Wallet selection modal appears
3. Choose MetaMask
4. MetaMask extension opens
5. **IMPORTANT:** Make sure you're on "Base Sepolia" network
   - If not, MetaMask will prompt you to switch
   - Click "Switch network"
6. Approve connection
7. Your address appears in top right (shortened like "0x62bd...9304")
8. Farcaster wallet should be connect and work as well

**✅ Pass:** Wallet connects, shows your address
**❌ Fail:** Wallet doesn't connect or shows wrong network

#### 5.3: Test Approve Function
1. Ensure wallet connected and on Base Sepolia
2. Click "1. Approve USDC" button
3. Button text changes to "Approving..."
4. MetaMask popup appears showing approval transaction
5. Review details:
   - Network: Base Sepolia
   - Spender: 0xB85b...DD7d (vault address)
   - Amount: 10 USDC
6. Click "Confirm"
7. "Waiting for confirmation..." message appears
8. Wait 5-10 seconds
9. Success message appears: "✅ Transaction successful!"

**✅ Pass:** Approval completes successfully
**❌ Fail:** Transaction fails or MetaMask doesn't appear

**Common Issues:**
- "Insufficient funds for gas": Get more Base Sepolia ETH
- "User rejected": You clicked "Reject" - try again
- Network error: Check internet connection

#### 5.4: Test Deposit Function
1. Ensure approval completed (Step 5.3)
2. Click "2. Deposit 10 USDC" button
3. Button text changes to "Depositing..."
4. MetaMask popup appears showing deposit transaction
5. Review details:
   - Network: Base Sepolia
   - To: 0xB85b...DD7d (vault address)
   - Amount: 10 USDC being sent
6. Click "Confirm"
7. "Waiting for confirmation..." message appears
8. Wait 5-10 seconds
9. Success message appears
10. **CRITICAL:** Wait 2-3 more seconds
11. Stats should update:
    - Total Deposited increases by $10
    - Total Users increases by 1 (if this was your first deposit)

**✅ Pass:** Deposit completes, stats update
**❌ Fail:** Transaction fails or stats don't update

**Common Issues:**
- "Insufficient USDC balance": Get more testnet USDC
- Stats don't update: Wait longer (blockchain needs time)
- If stats still don't update after 30 seconds: Refresh page and check Basescan

#### 5.5: Verify on Blockchain
1. Click "View Contract on Explorer →" link
2. Opens Basescan page for vault contract
3. Click "Read Contract" tab
4. Find "getVaultStats" function
5. Click "Query"
6. Should show updated values matching your UI

**✅ Pass:** Basescan matches UI stats
**❌ Fail:** Basescan shows different numbers

### Test Step 5 Complete
**All tests passed:** v0 is working! Proceed to deployment.
**Some tests failed:** Check troubleshooting section below.

---

## STEP 6: Test in Farcaster (Optional)

### Goal
Verify the Mini App works when opened inside Farcaster/Warpcast.

### Prerequisite
Deploy to Netlify first (see Step 7), or use ngrok for local testing.

### Test Procedure
1. Open Warpcast mobile app
2. Create a new cast or DM to yourself
3. Paste your deployed URL (e.g., https://darkpool-vault.netlify.app)
4. Post/send
5. Tap the preview
6. Mini App should open in-app (not external browser)
7. Test wallet connection and deposit flow

### Note
If Mini App opens in external browser instead of in-app:
- This is a Mini App manifest issue, not your v0 functionality
- Your deposit flow still works
- Can debug Mini App integration after hackathon
- For hackathon demo, showing browser version is fine

---

## STEP 7: Deploy to Netlify

### Goal
Deploy the working Mini App so judges and users can access it.

### Prerequisites
1. All local tests passed (Step 5)
2. Code committed to GitHub
3. Netlify account connected to GitHub repo

### Deployment Steps

#### 7.1: Commit Changes
```bash
cd miniapp
git add .
git commit -m "implement v0 functionality - working deposits"
git push origin main
```

#### 7.2: Netlify Auto-Deploys
1. Go to https://app.netlify.com
2. Find your "darkpool-vault" site
3. Should see build starting automatically
4. Wait 2-3 minutes for build to complete

#### 7.3: Verify Build Settings
Make sure these are set correctly:
- **Base directory:** `miniapp`
- **Build command:** `npm run build`
- **Publish directory:** `miniapp/.next`

#### 7.4: Check Deployment
1. Build completes successfully
2. Green "Published" status
3. Click site URL (e.g., https://darkpool-vault.netlify.app)
4. Site loads

### Test Step 7
1. Open deployed URL in browser
2. Stats load correctly
3. Connect wallet (MetaMask)
4. Complete full deposit flow
5. Everything works like it did locally

**


# ✅ Pass / ❌ Fail Criteria

**✅ Pass:** Deployed version works  
**❌ Fail:** Build errors or functionality broken — check build logs

---

## 🐛 Troubleshooting Guide

### Issue: "Module not found: Can't resolve '../lib/contract'"
**Cause:** File path incorrect or file not created  
**Solution:**
1. Verify `lib/contract.ts` exists in `miniapp/lib/contract.ts`
2. Check import path in `page.tsx` is `"../lib/contract"`
3. Restart dev server: stop (`Ctrl + C`) and run `npm run dev` again

---

### Issue: Stats show "..." forever
**Cause:** Can't connect to Base Sepolia RPC  
**Solution:**
1. Check internet connection  
2. Try refreshing the page  
3. Check browser console for RPC errors  
4. Verify `baseSepolia` is correctly imported from `wagmi/chains`

---

### Issue: "Unsupported chain" error
**Cause:** Wallet on wrong network  
**Solution:**
1. Open MetaMask  
2. Click network dropdown at top  
3. Select **Base Sepolia**  
4. If not listed, add it manually:


---

### Issue: Approve transaction fails with "Insufficient funds"
**Cause:** Not enough Base Sepolia ETH for gas  
**Solution:**
1. Get more from faucet: [https://www.alchemy.com/faucets/base-sepolia](https://www.alchemy.com/faucets/base-sepolia)  
2. Wait ~5 minutes for tokens to arrive  
3. Check balance in MetaMask  
4. Try approving again

---

### Issue: Deposit fails with "Transfer amount exceeds allowance"
**Cause:** Approval transaction didn't complete or approved too little  
**Solution:**
1. Check approval transaction on Basescan  
2. If it failed, try approving again  
3. Make sure you're approving **at least 10 USDC**  
4. Wait for approval to confirm before depositing

---

### Issue: Stats don't update after deposit
**Cause:** Blockchain needs time to process  
**Solution:**
1. Wait 30 seconds  
2. Manually refresh the browser  
3. Check transaction on Basescan — if confirmed, stats should update  
4. If still not updating, check browser console for errors

---

### Issue: "USDC balance too low" or deposit fails
**Cause:** Not enough testnet USDC  
**Solution:**
1. Check USDC balance on Basescan  
2. Need at least **10 USDC** to test  
3. Get more from faucet or mint function (see Step 5 prerequisites)

---

### Issue: Wallet connect button doesn't work
**Cause:** Wallet connectors not properly configured  
**Solution:**
1. Verify `rootProvider.tsx` has `metaMask()` and `injected()` in connectors array  
2. Make sure MetaMask extension is installed  
3. Try hard refresh (`Cmd/Ctrl + Shift + R`)  
4. Check console for connector errors

---

### Issue: Build fails on Netlify
**Cause:** Missing dependencies or build configuration  
**Solution:**
1. Check Netlify build logs for specific error  
2. Common fixes:
- Verify `netlify.toml` is in `miniapp/` folder  
- Check Base directory is set to `miniapp`  
- Ensure all dependencies in `package.json`
3. Try building locally first: `npm run build`  
4. If local build works, push and redeploy

---

### Issue: TypeScript errors
**Cause:** Type mismatch or missing types  
**Solution:**
1. Check exact error message  
2. Common fixes:
- Add `as const` to ABI arrays  
- Import types from `wagmi` correctly  
- Use proper `viem` types for addresses  
3. Run `npm run build` locally to see all errors  
4. Fix one at a time

---

## 📊 Success Criteria Checklist

### Functionality
- [ ] Page loads without errors  
- [ ] Wallet connection works (MetaMask and/or Coinbase Wallet)  
- [ ] Stats read from blockchain and display correctly  
- [ ] Approve USDC button works  
- [ ] Deposit USDC button works  
- [ ] Success messages show after transactions  
- [ ] Stats update after deposit (within 30 seconds)  
- [ ] All loading states work (buttons show “Loading…”)  
- [ ] Error messages display when transactions fail

---

### User Experience
- [ ] UI looks good (proper styling)  
- [ ] Buttons have hover effects  
- [ ] Disabled states are clear (grayed out)  
- [ ] Loading indicators are visible  
- [ ] Success/error messages are clear  
- [ ] Mobile responsive (if time permits)

---

### Technical
- [ ] No console errors  
- [ ] No TypeScript errors  
- [ ] Deployed to Netlify successfully  
- [ ] Contract addresses are correct  
- [ ] USDC decimal handling is correct (6 decimals)  
- [ ] Proper error handling throughout

---

### Documentation
- [ ] README updated with:
- What v0 does  
- How to test locally  
- Deployed URL  
- Contract addresses  
- [ ] Code is commented where necessary  
- [ ] Clear commit messages


