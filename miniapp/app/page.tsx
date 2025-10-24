"use client";
import "@coinbase/onchainkit/styles.css";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Address, Avatar, Name, Identity } from "@coinbase/onchainkit/identity";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import {
  VAULT_ADDRESS,
  VAULT_ABI,
  USDC_ADDRESS,
  USDC_ABI,
} from "../lib/contract";
import { sdk } from "@farcaster/miniapp-sdk";
import { baseSepolia } from "wagmi/chains";

export default function Home() {
  // Get wallet connection status
  const { address, isConnected, chainId } = useAccount();

  // Network switching functionality
  const { switchChain } = useSwitchChain();

  // Handle writing to contracts (approve/deposit)
  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isSuccess,
    isLoading: isConfirming,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
    timeout: 30000, // 30 second timeout
  });

  // Debug transaction state changes
  useEffect(() => {
    console.log("Transaction state changed:", {
      hash,
      isSuccess,
      isConfirming,
      receiptError,
      writeError,
    });
  }, [hash, isSuccess, isConfirming, receiptError, writeError]);

  // Track which transaction is happening
  const [txStep, setTxStep] = useState<"idle" | "approving" | "depositing">(
    "idle"
  );

  // Read vault statistics from blockchain
  const {
    data: vaultStats,
    refetch,
    isLoading: isLoadingStats,
    error: readError,
  } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getVaultStats",
  });

  // Read user's USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Check current allowance for the vault
  const { data: currentAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "allowance",
    args: address ? [address, VAULT_ADDRESS] : undefined,
  });

  // Auto-refresh stats after successful transaction
  useEffect(() => {
    console.log("useEffect triggered:", {
      isSuccess,
      hash,
      txStep,
      isConfirming,
    });
    if (isSuccess) {
      // Wait 2 seconds for blockchain to update
      setTimeout(() => {
        refetch();
        setTxStep("idle");
      }, 2000);
    }
  }, [isSuccess, refetch]);

  // Manual transaction check as fallback
  useEffect(() => {
    if (hash && txStep === "depositing" && isConfirming) {
      console.log("Starting manual transaction check...");
      const checkTransaction = async () => {
        try {
          // Wait 10 seconds then check if transaction is still pending
          setTimeout(async () => {
            if (isConfirming && !isSuccess) {
              console.log(
                "Transaction still pending after 10 seconds, checking manually..."
              );
              // You could add manual transaction verification here
              // For now, let's just log that it's taking too long
              console.log("Transaction taking longer than expected");
            }
          }, 10000);
        } catch (error) {
          console.error("Manual transaction check error:", error);
        }
      };
      checkTransaction();
    }
  }, [hash, txStep, isConfirming, isSuccess]);

  // Initialize Farcaster miniapp SDK
  useEffect(() => {
    const initMiniapp = async () => {
      try {
        await sdk.actions.ready();
        console.log("Farcaster miniapp ready");
      } catch (error) {
        console.log("Not running in Farcaster miniapp context:", error);
      }
    };

    initMiniapp();
  }, []);

  // Check if user is on the correct network
  const isOnCorrectNetwork = chainId === baseSepolia.id;

  // Switch to Base Sepolia if needed
  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: baseSepolia.id });
    } catch (error) {
      console.error("Failed to switch network:", error);
      alert("Please switch to Base Sepolia testnet manually in your wallet");
    }
  };

  // Smart deposit handler - handles both approval and deposit automatically
  const handleSmartDeposit = async () => {
    console.log("handleSmartDeposit called");
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    // Check if user is on the correct network
    if (!isOnCorrectNetwork) {
      alert("Please switch to Base Sepolia testnet to use this app!");
      await handleSwitchNetwork();
      return;
    }

    const depositAmount = parseUnits("10", 6); // 10 USDC with 6 decimals
    const needsApproval = !currentAllowance || currentAllowance < depositAmount;
    console.log("needsApproval:", needsApproval);

    try {
      if (needsApproval) {
        // Step 1: Approve
        console.log("Starting approval...");
        setTxStep("approving");
        await writeContract({
          address: USDC_ADDRESS,
          abi: USDC_ABI,
          functionName: "approve",
          args: [VAULT_ADDRESS, depositAmount],
        });
        console.log("Approval transaction submitted");

        // Wait for approval to complete, then proceed to deposit
        const checkApproval = () => {
          return new Promise((resolve) => {
            const interval = setInterval(() => {
              console.log("Checking approval:", { isSuccess, hash });
              if (isSuccess) {
                clearInterval(interval);
                resolve(true);
              }
            }, 1000);

            // Timeout after 60 seconds
            setTimeout(() => {
              clearInterval(interval);
              resolve(false);
            }, 60000);
          });
        };

        const approvalCompleted = await checkApproval();
        if (!approvalCompleted) {
          throw new Error("Approval timeout");
        }
        console.log("Approval completed, proceeding to deposit");
      }

      // Step 2: Deposit
      console.log("Starting deposit...");
      setTxStep("depositing");
      await writeContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [depositAmount],
      });
      console.log("Deposit transaction submitted");
    } catch (error) {
      console.error("Smart deposit error:", error);
      setTxStep("idle");
    }
  };

  // Format stats for display
  const totalDeposited = vaultStats ? formatUnits(vaultStats[0], 6) : "0";
  const totalUsers = vaultStats ? vaultStats[1].toString() : "0";
  const userUsdcBalance = usdcBalance ? formatUnits(usdcBalance, 6) : "0";

  // Smart button logic
  const needsApproval =
    !currentAllowance || currentAllowance < parseUnits("10", 6);
  const isApproving = txStep === "approving" && isPending;
  const isDepositing = txStep === "depositing" && isPending;
  const isProcessing = isPending || isConfirming;

  // Dynamic button text and state
  const getButtonText = () => {
    if (isApproving) return "Approving USDC...";
    if (isDepositing) return "Depositing to Vault...";
    if (needsApproval) return "Approve & Deposit 10 USDC";
    return "Deposit 10 USDC";
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        {/* <Wallet /> */}
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>DarkPool Vault</h1>
        <p className={styles.subtitle}>Automated cbBTC DCA on Base</p>

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

        {isConnected && (
          <div className={styles.userStats}>
            <p>Your USDC Balance: {userUsdcBalance} USDC</p>
            {!isOnCorrectNetwork && (
              <div className={styles.error}>
                ⚠️ Please switch to Base Sepolia testnet to use this app!
                <br />
                <button
                  onClick={handleSwitchNetwork}
                  className={styles.switchButton}
                >
                  Switch to Base Sepolia
                </button>
              </div>
            )}
          </div>
        )}

        <div className={styles.depositCard}>
          <h2>Deposit to Vault</h2>
          <p className={styles.description}>
            Deposit USDC to automatically DCA into cbBTC weekly
          </p>

          <div className={styles.buttonGroup}>
            <button
              onClick={handleSmartDeposit}
              disabled={!isConnected || isProcessing || !isOnCorrectNetwork}
              className={
                needsApproval ? styles.approveButton : styles.depositButton
              }
            >
              {!isOnCorrectNetwork
                ? "Switch to Base Sepolia First"
                : getButtonText()}
            </button>
          </div>

          {isConfirming && (
            <div className={styles.info}>⏳ Waiting for confirmation...</div>
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
            <p>
              🔄 <strong>v0:</strong> Deposits pooled on-chain
            </p>
            <p>
              📅 <strong>v1:</strong> Automated cbBTC DCA (coming soon)
            </p>
            {needsApproval && (
              <p>
                🔐 <strong>First time?</strong> You&apos;ll need to approve USDC
                spending (one-time)
              </p>
            )}
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
