# VeilPay Video Demo Walkthrough Script (3–4 Minutes)

**Presenter**: Core Protocol Engineer  
**Target Audience**: Midnight Buildathon Judges & Community Evaluators  
**App URL**: `http://localhost:5173/`  

---

## 0:00 – 0:45: The Problem & The Midnight Solution
*(Scene: Show VeilPay Landing Page Hero with Minimalist B&W Design)*

"Hello everyone! Welcome to **VeilPay**, the privacy-first financial operating system built natively on the Midnight Network.

In Web3 today, corporate payroll and capital allocation are broken. On transparent chains like Ethereum or Solana, every single salary, grant, and payment timestamp is completely public. This leads to competitor poaching, internal salary snooping, and physical extortion threats. Furthermore, if a worker splits their payout into cold storage or savings, blockchain analytics link all their addresses together, destroying their privacy.

Traditional privacy mixers like Tornado Cash don't work for enterprises either—they contaminate funds with illicit activity, face regulatory sanctions, and prevent workers from proving their income to landlords or banks.

VeilPay solves this using Midnight’s **Compact** smart contract language and **dual-ledger architecture**. Let me show you how it works in real time."

---

## 0:45 – 1:30: Employer Treasury & Merkle Root Generation
*(Scene: Click 'dApp Console' -> Tab 1: Employer Treasury)*

"Here in the **Employer Treasury Console**, HR controllers or DAO treasuries manage their confidential payroll cohort. Notice that each contributor—like Alice Vance or Bob Chen—has a private allocation in tDUST.

When the employer clicks **'Add Recipient'**, our client engine hashes the allocation, public key, and cryptographic salt into a Poseidon commitment leaf. The protocol computes a complete Poseidon Merkle tree in real-time.

When we click **'Commit Root & Fund Vault'**, the contract executes the `fund_payroll_pool` circuit. Only the 32-byte Merkle root and the aggregate deposit are broadcast on-chain. Notice our live yield ticker—while this liquidity sits in the contract waiting to be claimed over the month, it automatically earns a 4.85% APY liquid staking yield on Midnight and Cardano!"

---

## 1:30 – 2:30: Beneficiary Stealth Claim & Atomic Split Terminal
*(Scene: Switch to Tab 2: Stealth Claim & Split Terminal)*

"Now let's switch to the beneficiary perspective. Here is Alice Vance. She holds her private witness keychain locally in her Lace wallet.

Traditional blockchains force Alice to receive funds into a single public address. If she manually forwards money to cold storage, Arkham clusters both wallets.

With VeilPay, Alice uses our **Stealth Split Recipe**:
- She routes 50% to her Daily Checking address.
- 30% to her Cold Storage Vault.
- 20% to her Tax Reserve.

When she clicks **'Generate ZK Proof & Claim Payout'**, watch the live terminal logs:
1. Her client loads the Midnight constraint system.
2. It extracts her private witness without exposing it.
3. It proves her leaf inclusion against the on-chain Merkle root.
4. It derives a deterministic nullifier: $N = \text{Poseidon}(sk, epoch)$.
5. And it atomically disburses funds into three completely unlinked stealth addresses!

To observers on the blockchain, three random payments just occurred in the same block. There is zero cryptographic link between them, and neither can be traced back to the employer!

Furthermore, if Alice attempts to claim again—let's click it—the Midnight consensus immediately rejects it with a **Double Claim Rejection** because her nullifier has already been consumed!"

---

## 2:30 – 3:15: ZK Income Attestation & Auditor Verifier Portal
*(Scene: Switch to Tab 3: ZK Attestation Verifier)*

"Now, what happens when Alice wants to rent an apartment or apply for a mortgage? In opaque privacy coins, she cannot prove her income without exposing her entire wallet.

In VeilPay, Alice selects **'Annual Income >= $75,000'** and clicks **'Synthesize ZK Attestation Token'**.

Her client executes our fourth Compact circuit, `disclose_income_attestation`. It generates a verifiable zero-knowledge credential.

Now, let's pretend we are her landlord in the **Auditor Verification Terminal**. The landlord pastes the token and clicks **'Verify Proof'**.

Instantly, the terminal returns **'Cryptographically Verified'**! The landlord knows with mathematical certainty that Alice earns at least $75,000 per year, but learns **zero bytes** about her exact salary, employer name, or wallet balance."

---

## 3:15 – 3:45: Dual-Ledger Inspector & Conclusion
*(Scene: Switch to Tab 4: Dual-Ledger Inspector)*

"Finally, let's open the **Dual-Ledger Inspector**. This demonstrates the true power of Midnight:
On the left, the **Public Consensus Ledger** tracks the vault balance, staking rewards, Merkle root, and spent nullifier set.
On the right, the **Client Witness Ledger** preserves 100% of the worker's secret keys and individual allocations.

All of this is backed by our production `veil_disburse.compact` contract, a passing 6/6 automated test suite, and an Apache 2.0 open-source license.

VeilPay brings confidential, enterprise-grade capital allocation to the Midnight Network. Thank you!"
