
"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";

export default function Home() {
  const [depositAmount] = useState("10");

  const handleDeposit = () => {
    alert("Deposit functionality coming next!");
  };

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
            <span className={styles.statValue}>$10.00</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Users</span>
            <span className={styles.statValue}>1</span>
          </div>
        </div>

        <div className={styles.depositCard}>
          <h2>Deposit to Vault</h2>
          <p>Deposit {depositAmount} USDC to the DarkPool vault</p>
          
          <button 
            onClick={handleDeposit}
            className={styles.depositButton}
          >
            Deposit 10 USDC
          </button>

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
