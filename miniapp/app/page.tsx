"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { VAULT_ADDRESS, VAULT_ABI, USDC_ADDRESS, USDC_ABI } from "../lib/contract";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  // Read vault stats
  const { data: vaultStats, refetch } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getVaultStats",
  });

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  const handleApprove = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      await writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "approve",
        args: [VAULT_ADDRESS, parseUnits("10", 6)], // 10 USDC with 6 decimals
      });
    } catch (error) {
      console.error("Approve error:", error);
      alert("Approval failed. Check console for details.");
    }
  };

  const handleDeposit = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      await writeContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [parseUnits("10", 6)], // 10 USDC with 6 decimals
      });
    } catch (error) {
      console.error("Deposit error:", error);
      alert("Deposit failed. Make sure you approved USDC first!");
    }
  };

  const totalDeposited = vaultStats ? formatUnits(vaultStats[0], 6) : "0";
  const totalUsers = vaultStats ? vaultStats[1].toString() : "0";

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>
      
      <div className={styles.content}>
        <h1 className={styles.title}>DarkPool Vault</h1>
        <p className={styles.subtitle}>
          Social DCA investing on Base
        </p>

        <div className={styles.statsCard}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Deposited</span>
            <span className={styles.statValue}>${totalDeposited} USDC</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Users</span>
            <span className={styles.statValue}>{totalUsers}</span>
          </div>
        </div>

        <div className={styles.depositCard}>
          <h2>Deposit to Vault</h2>
          <p>Deposit 10 USDC to the DarkPool vault</p>
          
          <div className={styles.buttonGroup}>
            <button 
              onClick={handleApprove}
              disabled={!isConnected || isPending}
              className={styles.approveButton}
            >
              {isPending ? "Approving..." : "1. Approve USDC"}
            </button>

            <button 
              onClick={handleDeposit}
              disabled={!isConnected || isPending}
              className={styles.depositButton}
            >
              {isPending ? "Depositing..." : "2. Deposit 10 USDC"}
            </button>
          </div>

          {isSuccess && <p className={styles.success}>✅ Deposit successful!</p>}

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