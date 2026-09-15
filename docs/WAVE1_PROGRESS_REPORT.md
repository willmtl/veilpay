# VeilPay: Midnight Buildathon Wave 1 Submission Report

**Project Name**: VeilPay  
**Submission Portal**: AKINDO  
**Category**: Privacy / DeFi / Infrastructure  
**GitHub Repository**: `https://github.com/your-org/veilpay`  
**License**: Apache License 2.0  
**Tags**: `midnightntwrk`, `zero-knowledge`, `compact`, `confidential-payroll`, `stealth-address`  

---

## 1. Project Tagline & One-Liner Description
A privacy-preserving financial operating system on Midnight enabling confidential payroll, milestone grants, and private crowdfunding with built-in stealth multi-split direct deposit, idle treasury yield optimization, and verifiable selective disclosure attestations.

---

## 2. What is the Problem and How Does VeilPay Solve It?

### The Problem
1. **The Transparent Doxxing Trap**: On transparent blockchains (Ethereum, Solana), all transactions, wallet balances, and compensation timestamps are permanently broadcast to the public. In enterprise payroll and contractor payouts, this causes internal organizational friction (coworkers spying on salaries), competitor poaching (headhunters monitoring wallet pay and offering 20% bumps), and physical safety hazards ("$5 wrench attacks").
2. **The On-Chain Wallet Clustering Trap**: In traditional banking, workers automatically split paychecks (e.g. 50% checking, 35% cold storage, 15% taxes). In Web3, manually forwarding funds between wallets allows blockchain analytics engines (Chainalysis, Arkham) to permanently link and cluster all personal addresses together.
3. **The Idle Capital Bleed**: Millions of dollars in payroll and grant vaults sit locked in smart contracts for 30–90 days earning 0% yield.
4. **The Mixer Trap**: Mixers like Tornado Cash pool funds indiscriminately with illicit actors, attracting regulatory bans and preventing workers from proving their income to rent an apartment or obtain a mortgage.

### How VeilPay Solves It
Built natively on Midnight's **Compact** smart contract language and **dual-ledger architecture**, VeilPay:
1. **Preserves Complete Recipient Confidentiality**: Batch commitments decouple recipient identities and individual salaries from the public consensus ledger while maintaining public solvency.
2. **Enables Stealth Multi-Split Direct Deposit**: Workers claim payouts atomically into up to 3 unlinked, one-time stealth addresses in a single transaction, defeating on-chain wallet clustering heuristics.
3. **Optimizes Idle Treasury Yield**: Locked pool funds generate liquid staking yield on Midnight/Cardano (4.85% APY), offsetting employer costs or streaming as private worker bonuses.
4. **Empowers Selective Disclosure**: Workers generate zero-knowledge attestations (e.g. "Annual Income $\ge \$75,000$ & 6 months tenure") for landlords and lenders with 0 bytes of sensitive salary or employer data leaked.
5. **Guarantees Clean Provenance**: Authorized corporate cohorts ensure clean-provenance accounting without touching mixed illicit funds.

---

## 3. Wave 1 Progress Report & Deliverables

During Wave 1 of the Midnight Buildathon, the VeilPay team completed 100% of the planned deliverables:

1. **Compact Smart Contract (`contracts/veil_disburse.compact`)**:
   - Implemented public consensus ledger state (`vaultBalance`, `accruedYieldBalance`, `commitmentRoot`, `spentNullifiers`, `currentEpoch`).
   - Implemented private client witness state (`BeneficiaryWitness`, `AttestationWitness`).
   - Implemented 4 core circuits: `fund_payroll_pool`, `claim_disbursement_with_split`, `harvest_idle_yield`, and `disclose_income_attestation`.
2. **Automated Quality Assurance Suite (`tests/veil_disburse.test.js`)**:
   - Built an automated test suite passing 6/6 tests covering leaf inclusion, stealth splits, nullifier double-spend immunity, forged amount rejection, idle yield staking, and selective disclosure threshold verification.
3. **Live Interactive Web Application**:
   - Engineered a minimalistic black-and-white frontend with modern UX, zero emojis, and pure custom design tokens.
   - Built interactive landing page with on-chain Privacy Radar, Trilemma Comparison Matrix, Six Core Pillars, and Multi-Vertical Use Case Explorer.
   - Built full interactive 4-module dApp: Employer Treasury Console, Beneficiary Stealth Claim & Split Terminal, ZK Attestation Verifier, and Dual-Ledger Inspector.
4. **Complete Documentation & Open Source Licensing**:
   - Comprehensive `README.md` with architecture diagrams and mathematical proofs.
   - Apache 2.0 open-source license (`LICENSE`).
   - 10-slide Pitch Deck (`docs/PITCH_DECK.md`) and Video Demo Script (`docs/DEMO_SCRIPT.md`).

---

## 4. Technical Integration with Midnight

- **Dual-Ledger Partitioning**: Public ledger ensures vault solvency and records consumed nullifiers; private witness ledger keeps secret keys, salaries, and split ratios strictly client-side.
- **Poseidon Cryptographic Hashing**: Used for commitment leaf computation $C = \text{Poseidon}(pk, amount, epoch, salt)$ and deterministic nullifier derivation $N = \text{Poseidon}(sk, epoch)$.
- **Compact ZK Circuit Constraints**: Enforces conservation of value ($\sum split \le allocation + yield$), Merkle tree inclusion, and threshold inequalities.
