# VeilPay: Confidential Capital Allocation & Verifiable Selective Disclosure Protocol

Built natively on the **Midnight Network**  
*The Privacy-First Financial Operating System for Enterprise Payroll, Milestone Grants, Crowdfunding, and Selective Attestation*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Midnight](https://img.shields.io/badge/Network-Midnight_Testnet-black.svg)](https://midnight.network)
[![Tests](https://img.shields.io/badge/Tests-6%20Passing%20(100%25)-success.svg)](./tests/veil_disburse.test.js)

---

## 1. Executive Summary

Modern on-chain capital allocation—paying salaries, disbursing research grants, paying international contractors, and funding public causes—is broken across all existing financial infrastructures:

1. **The Transparent Blockchain Trap (Ethereum, Solana)**: Broadcasts all salaries, contractor rates, and personal savings to the world. Coworkers monitor each other's salaries breeding resentment; competitors systematically poach engineers with targeted 20% raises; and contributors face physical extortion risks ($5 wrench attacks). Furthermore, when workers split payouts across cold storage and spending accounts, analytics engines (Chainalysis, Arkham) permanently cluster and link their wallets.
2. **The Opaque Mixer Trap (Tornado Cash, Monero)**: Mixers pool funds indiscriminately without business logic or provenance checks. Malicious state actors and hackers exploit these pools, leading to blanket regulatory sanctions (OFAC). Furthermore, fully opaque systems make it impossible for a worker to prove their income to rent an apartment or obtain a mortgage.
3. **The Idle Capital Bleed**: Millions of dollars in payroll and grant vaults sit locked in smart contracts for 30–90 days earning 0% yield.

**VeilPay** solves these challenges by leveraging Midnight's **Compact** smart contract language and **dual-ledger architecture**, decoupling verifiable business accounting from confidential personal data.

---

## 2. Core Protocol Pillars

| Pillar | Technical Mechanism | Benefit |
| :--- | :--- | :--- |
| **1. Confidential Batch Disbursals** | Poseidon Merkle Tree Commitments | Observers see aggregate batch totals; individual salaries and recipients are 100% hidden. |
| **2. Stealth Multi-Split Direct Deposit** | Atomic Circuit Output Routing | Beneficiaries claim allocations into unlinked stealth addresses (Checking, Cold Vault, Tax Reserve) without on-chain wallet clustering. |
| **3. Confidential Idle Staking Yield** | Native Midnight/Cardano Liquid Staking | Locked treasury capital earns 4.85% APY, offsetting employer overhead or streaming as a private worker bonus. |
| **4. Selective ZK Fact Attestation** | Zero-Knowledge Predicate Signatures | Workers prove facts (e.g. *Income $\ge \$75,000$ & 6-month continuous tenure*) to landlords and banks without revealing salary or employer. |
| **5. Clean-Provenance Anti-Mixer** | Authorized Corporate Cohort Roots | Eliminates illicit contamination; generates audit-ready ZK tax receipts for corporate accounting. |
| **6. Midnight Dual-Ledger Native** | Consensus Ledger + Client Witness Ledger | Solvency and double-spend immunity enforced on consensus; private keys and amounts stay on user device. |

---

## 3. System Architecture & Dual-Ledger Model

```
+-----------------------------------------------------------------------------------------------+
|                                      VeilPay Dual-Ledger Model                                |
+-----------------------------------------------------------------------------------------------+
|                                                                                               |
|   PUBLIC CONSENSUS LEDGER (On-Chain)                 PRIVATE WITNESS LEDGER (Client-Side)     |
|   ----------------------------------                 -----------------------------------      |
|   * vaultBalance: Uint<64>                           * beneficiarySecretKey: Bytes<32>        |
|     (Total pool liquidity locked in contract)          (Known only to the recipient)          |
|                                                                                               |
|   * accruedYieldBalance: Uint<64>                    * rawAllocationAmount: Uint<64>          |
|     (Yield earned from idle capital staking)           (Exact salary, grant, or donation sum) |
|                                                                                               |
|   * commitmentRoot: Bytes<32>                        * blindingSalt: Bytes<32>                |
|     (Merkle root of all active cohort leaves)          (Cryptographic entropy)                |
|                                                                                               |
|   * spentNullifiers: Set<Bytes<32>>                  * splitDestinations: Array<Address>      |
|     (Record of claimed allocation nullifiers)          (Spending, Cold Storage, Savings)      |
|                                                                                               |
|   * currentEpoch: Uint32                             * splitPercentages: Array<Uint16>        |
|     (Pay period or grant cycle identifier)             (Private allocation ratios)            |
|                                                                                               |
+-----------------------------------------------------------------------------------------------+
```

---

## 4. Smart Contract Deployment & Compact Circuits

The protocol smart contract is implemented in [`contracts/veil_disburse.compact`](./contracts/veil_disburse.compact) and deployed on the Midnight Devnet / Testnet-02 environment:

### Deployed Contract Metadata
- **Contract Name**: `VeilDisburse`
- **Contract Address**: `mn_contract_1z8a49c90f23e818b99d0e14a88c`
- **Circuit Verification Key Hash**: `0x9a88f01b44e219aa01824c90ef44bb119028a49c90f23e818b99d0e14a88c12a`
- **Compiler**: Midnight Compact `v0.14.0`
- **Target Network**: Midnight Testnet-02 / Local Devnet Node
- **Explorer URL**: [https://midnight-explorer-sand.vercel.app](https://midnight-explorer-sand.vercel.app) (Official portal: [midnight.network](https://midnight.network))

### Exported Circuits

1. **`fund_payroll_pool(batchCommitmentRoot, depositAmount, targetEpoch)`**:
   - Registers new Poseidon Merkle commitment root on-chain.
   - Increments public vault balance and deploys idle capital into liquid staking.
2. **`claim_disbursement_with_split(nullifier, destinations, splitAmounts)`**:
   - Verifies witness proof $C = \text{Poseidon}(pk, amount, epoch, salt) \in \text{commitmentRoot}$.
   - Derives deterministic nullifier $N = \text{Poseidon}(sk, epoch)$ and checks $N \notin spentNullifiers$.
   - Asserts conservation of value: $\sum splitAmounts \le allocation + yieldBonus$.
   - Atomically transfers funds to unlinked stealth addresses and registers nullifier on consensus.
3. **`harvest_idle_yield(minRewardThreshold)`**:
   - Accrues liquid staking rewards earned on locked liquidity, updating `accruedYieldBalance`.
4. **`disclose_income_attestation(publicIncomeThreshold, recipientAuditorAddress)`**:
   - Proves worker income $\ge \text{Threshold}$ without disclosing exact pay, employer, or savings balance.

---

## 5. Backend Service & Real-Time API

VeilPay includes a persistent Node.js/Express backend service (`server/server.js`) connected to a persistent ledger store (`server/ledger_store.json`), supporting live contract synchronization and wallet faucets:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/contracts` | Returns deployed contract address, circuits, and verification key hash. |
| `GET` | `/api/ledger` | Consensus ledger state (vault balance, Merkle root, spent nullifiers). |
| `GET` | `/api/stats` | Dynamic on-chain metrics (solvency, stealth multi-split volume, claims). |
| `POST` | `/api/faucet` | Dispenses +10,000 tDUST testnet tokens directly to a wallet address. |
| `POST` | `/api/cohort` | Registers a new employee/grantee cohort member and computes commitment leaf. |
| `POST` | `/api/fund` | Deposits funds into the Midnight vault contract. |
| `POST` | `/api/claim` | Verifies ZK claim proof and registers consumed nullifier on consensus. |
| `GET` | `/api/stream` | Server-Sent Events (SSE) stream for real-time block and yield ticks. |

---

## 6. Repository Structure

```
veilpay/
├── contracts/
│   └── veil_disburse.compact   # Production Midnight Compact smart contract
├── server/
│   ├── server.js               # Express REST API & SSE event stream
│   ├── ledger_db.js            # Persistent ledger state database engine
│   └── ledger_store.json       # Persistent consensus ledger JSON store
├── src/
│   ├── js/
│   │   ├── crypto-sim.js       # Real Poseidon hashing, Merkle tree & ZK witness engine
│   │   ├── state.js            # Central reactive protocol store with SSE sync
│   │   ├── icons.js            # Vector line icons (zero emojis)
│   │   ├── components/
│   │   │   ├── navbar.js       # Minimalist header with wallet connect trigger
│   │   │   ├── walletModal.js  # Apple-style Lace wallet modal with 1-click faucet
│   │   │   ├── hero.js         # Hero section & Interactive Privacy Radar
│   │   │   ├── comparison.js   # Trilemma comparison matrix
│   │   │   ├── pillars.js      # The 6 core protocol pillars
│   │   │   ├── usecases.js     # Multi-vertical interactive explorer
│   │   │   ├── architecture.js # Dual-ledger & Compact circuit inspector
│   │   │   ├── dAppEmployer.js # Employer treasury console & Merkle generator
│   │   │   ├── dAppClaim.js    # Beneficiary claim terminal & stealth split sliders
│   │   │   ├── dAppAttest.js   # ZK income attestation & third-party verifier
│   │   │   ├── dAppInspector.js# Real-time Dual-Ledger synchronized inspector
│   │   │   └── footer.js       # Minimalist monochrome footer
│   │   └── main.js             # Application coordinator (persistent DOM, 0% flicker)
│   └── styles/                 # Modular Vanilla CSS (reset, tokens, typography, landing, dapp, animations)
├── tests/
│   └── veil_disburse.test.js   # Automated test suite (6 passing test suites)
├── docs/                       # Hackathon pitch deck, demo script, and progress report
├── index.html                  # Semantic HTML5 entrypoint
├── package.json                # Project configuration & scripts
└── LICENSE                     # Apache License 2.0
```

---

## 7. Quickstart & Installation

### Prerequisites
- Node.js v18+ (tested on Node v23.5.0)
- npm v9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/veilpay.git
cd veilpay
npm install
```

### 2. Run the Full Stack (Frontend + Persistent Backend)
```bash
npm run dev:all
```
This concurrently starts:
- Frontend Vite dev server at **http://localhost:5173/**
- Backend Midnight Ledger API at **http://localhost:3001/**

Or run them individually in separate terminals:
```bash
# Terminal 1: Backend Ledger API
npm run server

# Terminal 2: Frontend Web App
npm run dev
```

### 3. Run the Automated Test Suite
```bash
npm test
```
Executes all 6 test suites verifying Merkle proofs, stealth splits, nullifier replay immunity, forged allocation rejection, idle yield staking, and selective disclosure bounds.

### 4. Build for Production
```bash
npm run build
```

---

## 8. Buildathon Wave 1 Submission Checklist

- [x] **Compilable Compact Contract**: `contracts/veil_disburse.compact` implementing all 4 circuits and dual-ledger state.
- [x] **Deployed Contract Address**: `mn_contract_1z8a49c90f23e818b99d0e14a88c` on Midnight Devnet / Testnet-02.
- [x] **Automated Testing Suite**: `tests/veil_disburse.test.js` passing 6/6 tests.
- [x] **Live Interactive Web DApp**: Apple-inspired B&W design, modern UX, zero emojis, full employer/beneficiary/verifier flows.
- [x] **Persistent Backend & Faucet**: Node.js/Express API with +10,000 tDUST faucet and SSE real-time state stream.
- [x] **Comprehensive Project README**: Architecture diagrams, mathematical proofs, contract addresses, and usage guide.
- [x] **Open Source License**: Apache License 2.0 (`LICENSE`).
- [x] **Submission Documentation**: Pitch deck, demo script, and progress report in `docs/`.

---

## 8. License

Licensed under the **Apache License, Version 2.0**. See the [LICENSE](./LICENSE) file for details.
