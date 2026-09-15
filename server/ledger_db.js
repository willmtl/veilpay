/* Persistent JSON Ledger Database for VeilPay Midnight Node Simulator */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  poseidonHash, 
  buildMerkleTree, 
  deriveNullifier, 
  deriveCommitment, 
  generateStealthAddress 
} from '../src/js/crypto-sim.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'ledger_store.json');

const INITIAL_COHORT = [
  {
    id: 'emp-1',
    name: 'Alice Vance',
    role: 'Lead Cryptographer',
    amount: 9500,
    publicKey: '0x3a91f8...9b12',
    secretKey: 'sk_secp_alice_9821a89c924f112e',
    salt: '0x7f8841a0e1',
    claimed: false,
    splitRecipe: { checking: 50, coldVault: 35, taxReserve: 15 }
  },
  {
    id: 'emp-2',
    name: 'Bob Chen',
    role: 'Systems Engineer',
    amount: 7800,
    publicKey: '0x7c44e1...228a',
    secretKey: 'sk_secp_bob_48810bb214c771aa',
    salt: '0x12bb99ac04',
    claimed: false,
    splitRecipe: { checking: 60, coldVault: 25, taxReserve: 15 }
  },
  {
    id: 'emp-3',
    name: 'Charlie Davis',
    role: 'Security Auditor',
    amount: 6200,
    publicKey: '0x99e120...f810',
    secretKey: 'sk_secp_charlie_5588cc10992fa00b',
    salt: '0x44dd1178fe',
    claimed: false,
    splitRecipe: { checking: 40, coldVault: 45, taxReserve: 15 }
  },
  {
    id: 'emp-4',
    name: 'Dana Kovacs',
    role: 'ZK Protocol Architect',
    amount: 11500,
    publicKey: '0x11ab88...44cc',
    secretKey: 'sk_secp_dana_7733ff441098aa77',
    salt: '0x99aa55ee21',
    claimed: false,
    splitRecipe: { checking: 55, coldVault: 30, taxReserve: 15 }
  }
];

class LedgerDatabase {
  constructor() {
    this.data = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        // Ensure spentNullifiers is an array in json
        if (!Array.isArray(this.data.spentNullifiers)) {
          this.data.spentNullifiers = [];
        }
        return;
      }
    } catch (err) {
      console.warn('Warning: could not read ledger_store.json, re-initializing:', err.message);
    }

    this.resetToGenesis();
  }

  resetToGenesis() {
    const epoch = 1;
    const computedCohort = INITIAL_COHORT.map(c => ({
      ...c,
      commitment: deriveCommitment(c.publicKey, c.amount, epoch, c.salt)
    }));

    const tree = buildMerkleTree(computedCohort);
    const initialVault = computedCohort.reduce((s, c) => s + c.amount, 0);

    this.data = {
      epoch,
      blockHeight: 184930,
      contractAddress: 'mn_contract_1z8a49c90f23e818b99d0e14a88c',
      contractName: 'VeilDisburse',
      compiler: 'Compact v0.14.0',
      network: 'Midnight Testnet-02 / Devnet Node',
      deployedAtBlock: 184920,
      verificationKeyHash: '0x9a88f01b44e219aa01824c90ef44bb119028a49c90f23e818b99d0e14a88c12a',
      circuits: [
        'fund_payroll_pool',
        'claim_disbursement_with_split',
        'harvest_idle_yield',
        'disclose_income_attestation'
      ],
      vaultBalance: initialVault,
      accruedYieldBalance: 284.18,
      yieldApy: 4.85,
      commitmentRoot: tree.root,
      merkleDepth: tree.depth,
      spentNullifiers: [],
      cohort: computedCohort,
      txLog: [
        {
          id: 'tx-001',
          circuit: 'fund_payroll_pool',
          type: 'FUND_PAYROLL_POOL',
          epoch,
          amount: initialVault,
          merkleRoot: tree.root,
          timestamp: Date.now() - 3600000 * 5,
          status: 'CONFIRMED',
          blockHeight: 184920
        }
      ],
      wallets: {
        'mn_addr_1z8a49c90f23e818b': 142500
      },
      stats: {
        totalDeposited: initialVault,
        totalDisbursed: 0,
        totalClaimsCount: 0
      }
    };

    this.save();
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving ledger_store.json:', err.message);
    }
  }

  getConsensusState() {
    return {
      vaultBalance: this.data.vaultBalance,
      accruedYieldBalance: this.data.accruedYieldBalance,
      yieldApy: this.data.yieldApy,
      commitmentRoot: this.data.commitmentRoot,
      merkleDepth: this.data.merkleDepth,
      currentEpoch: this.data.epoch,
      blockHeight: this.data.blockHeight,
      spentNullifiers: this.data.spentNullifiers,
      contractAddress: this.data.contractAddress || 'mn_contract_1z8a49c90f23e818b99d0e14a88c',
      contractName: this.data.contractName || 'VeilDisburse',
      compiler: this.data.compiler || 'Compact v0.14.0',
      verificationKeyHash: this.data.verificationKeyHash || '0x9a88f01b44e219aa01824c90ef44bb119028a49c90f23e818b99d0e14a88c12a',
      circuits: this.data.circuits || [
        'fund_payroll_pool',
        'claim_disbursement_with_split',
        'harvest_idle_yield',
        'disclose_income_attestation'
      ],
      txLog: this.data.txLog
    };
  }

  getProtocolStats() {
    return {
      totalDeposited: this.data.stats.totalDeposited,
      totalDisbursed: this.data.stats.totalDisbursed,
      totalClaimsCount: this.data.stats.totalClaimsCount,
      activeCohortCount: this.data.cohort.length,
      vaultBalance: this.data.vaultBalance,
      accruedYield: this.data.accruedYieldBalance,
      yieldApy: this.data.yieldApy
    };
  }

  getCohort() {
    return this.data.cohort;
  }

  addCohortMember(member) {
    const newMember = {
      id: `emp-${Date.now()}`,
      name: member.name,
      role: member.role || 'Contributor',
      amount: Number(member.amount),
      publicKey: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
      secretKey: `sk_secp_${member.name.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(16).slice(2, 10)}`,
      salt: `0x${Math.random().toString(16).slice(2, 10)}`,
      claimed: false,
      splitRecipe: { checking: 50, coldVault: 35, taxReserve: 15 }
    };

    this.data.cohort.push(newMember);

    // Recompute commitments
    this.data.cohort = this.data.cohort.map(c => ({
      ...c,
      commitment: deriveCommitment(c.publicKey, c.amount, this.data.epoch, c.salt)
    }));

    const tree = buildMerkleTree(this.data.cohort);
    this.data.commitmentRoot = tree.root;
    this.data.merkleDepth = tree.depth;

    this.save();
    return { member: newMember, commitmentRoot: tree.root };
  }

  fundVault(depositAmount) {
    const deposit = Number(depositAmount) || 0;
    if (deposit <= 0) throw new Error('Deposit must be strictly positive');

    this.data.vaultBalance += deposit;
    this.data.blockHeight += 1;
    this.data.stats.totalDeposited += deposit;

    const tx = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      circuit: 'fund_payroll_pool',
      type: 'FUND_PAYROLL_POOL',
      epoch: this.data.epoch,
      amount: deposit,
      merkleRoot: this.data.commitmentRoot,
      timestamp: Date.now(),
      status: 'CONFIRMED',
      blockHeight: this.data.blockHeight
    };

    this.data.txLog.unshift(tx);
    this.save();
    return { txId: tx.id, vaultBalance: this.data.vaultBalance, blockHeight: this.data.blockHeight };
  }

  claimDisbursement(beneficiaryId, splitRecipe) {
    const emp = this.data.cohort.find(c => c.id === beneficiaryId);
    if (!emp) throw new Error('Beneficiary not found in active cohort');

    const nullifier = deriveNullifier(emp.secretKey, this.data.epoch);

    if (this.data.spentNullifiers.includes(nullifier)) {
      throw new Error(`Replay Attack Blocked: Nullifier ${nullifier.slice(0, 16)}... is already spent.`);
    }

    if (this.data.vaultBalance < emp.amount) {
      throw new Error('Insufficient vault balance on consensus ledger');
    }

    const stealthAddresses = [
      generateStealthAddress('mn_daily'),
      generateStealthAddress('mn_vault'),
      generateStealthAddress('mn_tax')
    ];

    this.data.spentNullifiers.push(nullifier);
    emp.claimed = true;
    emp.splitRecipe = splitRecipe || emp.splitRecipe;
    this.data.vaultBalance -= emp.amount;
    this.data.blockHeight += 1;
    this.data.stats.totalDisbursed += emp.amount;
    this.data.stats.totalClaimsCount += 1;

    const tx = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      circuit: 'claim_disbursement_with_split',
      type: 'CLAIM_DISBURSEMENT_WITH_SPLIT',
      epoch: this.data.epoch,
      nullifier,
      amountDisbursed: emp.amount,
      stealthOutputsCount: 3,
      timestamp: Date.now(),
      status: 'CONFIRMED',
      blockHeight: this.data.blockHeight
    };

    this.data.txLog.unshift(tx);
    this.save();

    return {
      nullifier,
      amount: emp.amount,
      stealthAddresses,
      txId: tx.id,
      blockHeight: this.data.blockHeight
    };
  }

  faucetFund(address, amount = 10000) {
    if (!this.data.wallets[address]) {
      this.data.wallets[address] = 0;
    }
    this.data.wallets[address] += Number(amount);
    this.save();
    return { address, balance: this.data.wallets[address], funded: amount };
  }

  getWalletBalance(address) {
    return this.data.wallets[address] || 0;
  }

  tickYield() {
    if (this.data.vaultBalance > 0) {
      const delta = (this.data.vaultBalance * (this.data.yieldApy / 100) / (365 * 86400)) * 2;
      this.data.accruedYieldBalance = parseFloat((this.data.accruedYieldBalance + delta).toFixed(4));
      return this.data.accruedYieldBalance;
    }
    return this.data.accruedYieldBalance;
  }

  incrementBlock() {
    this.data.blockHeight += 1;
    return this.data.blockHeight;
  }
}

export const db = new LedgerDatabase();
