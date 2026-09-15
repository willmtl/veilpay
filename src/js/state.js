/* Central Reactive Protocol Store for VeilPay */
import { deriveCommitment, deriveNullifier, buildMerkleTree } from './crypto-sim.js';

// Pre-seeded default employee cohort
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

// Compute commitments for initial cohort
function computeCohortCommitments(cohort, epoch) {
  return cohort.map(c => ({
    ...c,
    commitment: deriveCommitment(c.publicKey, c.amount, epoch, c.salt)
  }));
}

class ProtocolStateStore {
  constructor() {
    this.yieldListeners = [];
    this.stateListeners = [];
    this.epoch = 1;
    this.cohort = computeCohortCommitments(INITIAL_COHORT, this.epoch);
    
    // Build initial tree
    const treeData = buildMerkleTree(this.cohort);
    this.merkleRoot = treeData.root;
    this.merkleDepth = treeData.depth;
    this.leaves = treeData.leaves;

    this.vaultBalance = this.cohort.reduce((sum, c) => sum + c.amount, 0);
    this.accruedYield = 284.18;
    this.yieldApy = 4.85; // 4.85% annual yield from liquid staking
    this.blockHeight = 184926;
    
    this.spentNullifiers = new Set();
    this.txLog = [
      {
        id: 'tx-001',
        type: 'FUND_PAYROLL_POOL',
        circuit: 'fund_payroll_pool',
        epoch: 1,
        amount: this.vaultBalance,
        merkleRoot: this.merkleRoot,
        timestamp: Date.now() - 3600000 * 4,
        status: 'CONFIRMED',
        blockHeight: 184920
      }
    ];

    this.currentView = 'landing'; // 'landing' or 'dapp'
    this.activeDappTab = 'employer'; // 'employer', 'claim', 'attest', 'inspector'

    this.wallet = {
      connected: true,
      address: 'mn_addr_1z8a49c90f23e818b',
      network: 'Midnight Testnet-02',
      balance: 142500,
      walletName: 'Lace for Midnight'
    };

    this.activeBeneficiaryId = 'emp-1';
    this.lastAttestation = null;

    // Deployed Midnight Compact Contract Details
    this.contract = {
      name: 'VeilDisburse',
      address: 'mn_contract_1z8a49c90f23e818b99d0e14a88c',
      compiler: 'Compact v0.14.0',
      sourceFile: 'contracts/veil_disburse.compact',
      circuits: [
        'fund_payroll_pool',
        'claim_disbursement_with_split',
        'harvest_idle_yield',
        'disclose_income_attestation'
      ],
      verificationKeyHash: '0x9a88f01b44e219aa01824c90ef44bb119028a49c90f23e818b99d0e14a88c12a',
      deploymentStatus: 'Deployed on Midnight Devnet Node / Testnet-02 Compatible',
      deployedBlock: 184920,
      explorerUrl: 'https://midnight-explorer-sand.vercel.app',
      docsUrl: 'https://docs.midnight.network'
    };

    // Connect to backend stream and local yield ticker
    this.initBackendSync();
    this.startLocalYieldTicker();
  }

  // Subscribe specifically to micro-yield updates (surgical, zero-flicker updates)
  onYieldTick(callback) {
    this.yieldListeners.push(callback);
    return () => {
      this.yieldListeners = this.yieldListeners.filter(cb => cb !== callback);
    };
  }

  // Subscribe to significant state mutations (cohort, vault balance, claims)
  onStateChange(callback) {
    this.stateListeners.push(callback);
    return () => {
      this.stateListeners = this.stateListeners.filter(cb => cb !== callback);
    };
  }

  // Legacy subscribe for compatibility
  subscribe(callback) {
    return this.onStateChange(callback);
  }

  notifyStateChange() {
    this.stateListeners.forEach(cb => cb(this));
  }

  notify() {
    this.notifyStateChange();
  }

  notifyYieldTick() {
    this.yieldListeners.forEach(cb => cb(this.accruedYield, this.yieldApy));
  }

  startLocalYieldTicker() {
    setInterval(() => {
      if (this.vaultBalance > 0) {
        const microYield = (this.vaultBalance * (this.yieldApy / 100) / (365 * 86400)) * 2;
        this.accruedYield = parseFloat((this.accruedYield + microYield).toFixed(4));
        this.notifyYieldTick();
      }
    }, 2000);
  }

  async initBackendSync() {
    try {
      const cRes = await fetch('/api/contracts');
      if (cRes.ok) {
        const cData = await cRes.json();
        this.contract = { ...this.contract, ...cData };
      }
    } catch {}

    try {
      const lRes = await fetch('/api/ledger');
      if (lRes.ok) {
        const lData = await lRes.json();
        if (typeof lData.vaultBalance === 'number') this.vaultBalance = lData.vaultBalance;
        if (typeof lData.accruedYield === 'number') this.accruedYield = lData.accruedYield;
        if (typeof lData.blockHeight === 'number') this.blockHeight = lData.blockHeight;
        if (lData.commitmentRoot) this.merkleRoot = lData.commitmentRoot;
        if (Array.isArray(lData.spentNullifiers)) {
          this.spentNullifiers = new Set(lData.spentNullifiers);
        }
        if (Array.isArray(lData.txLog) && lData.txLog.length > 0) {
          this.txLog = lData.txLog;
        }
        this.notifyStateChange();
      }
    } catch {}

    // Attempt connecting to backend SSE stream if available
    try {
      const eventSource = new EventSource('/api/stream');
      eventSource.addEventListener('yield_tick', (e) => {
        try {
          const data = JSON.parse(e.data);
          this.accruedYield = data.accruedYield;
          this.notifyYieldTick();
        } catch {}
      });

      eventSource.addEventListener('block_tick', (e) => {
        try {
          const data = JSON.parse(e.data);
          this.blockHeight = data.blockHeight;
        } catch {}
      });

      eventSource.addEventListener('cohort_update', (e) => {
        try {
          const data = JSON.parse(e.data);
          this.cohort = data.members;
          this.commitmentRoot = data.commitmentRoot;
          this.notifyStateChange();
        } catch {}
      });
    } catch {}
  }

  setView(viewName) {
    this.currentView = viewName;
    this.notifyStateChange();
  }

  setDappTab(tabName) {
    this.activeDappTab = tabName;
    this.notifyStateChange();
  }

  setActiveBeneficiary(empId) {
    this.activeBeneficiaryId = empId;
    this.notifyStateChange();
  }

  toggleWallet() {
    this.wallet.connected = !this.wallet.connected;
    this.notifyStateChange();
  }

  // Employer actions
  async addCohortMember(member) {
    // Try backend first
    try {
      const res = await fetch('/api/cohort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      if (res.ok) {
        const data = await res.json();
        this.cohort.push(data.member);
        this.commitmentRoot = data.commitmentRoot;
        this.notifyStateChange();
        return;
      }
    } catch {}

    // Fallback local
    const newMember = {
      id: `emp-${Date.now()}`,
      name: member.name,
      role: member.role,
      amount: Number(member.amount),
      publicKey: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
      secretKey: `sk_secp_${member.name.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(16).slice(2, 10)}`,
      salt: `0x${Math.random().toString(16).slice(2, 10)}`,
      claimed: false,
      splitRecipe: { checking: 50, coldVault: 35, taxReserve: 15 }
    };

    this.cohort.push(newMember);
    this.cohort = computeCohortCommitments(this.cohort, this.epoch);
    const treeData = buildMerkleTree(this.cohort);
    this.merkleRoot = treeData.root;
    this.merkleDepth = treeData.depth;
    this.leaves = treeData.leaves;
    this.notifyStateChange();
  }

  async fundVaultDeposit(additionalDeposit) {
    const depositNum = Number(additionalDeposit) || 0;

    // Try backend
    try {
      const res = await fetch('/api/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositAmount: depositNum })
      });
      if (res.ok) {
        const data = await res.json();
        this.vaultBalance = data.vaultBalance;
        this.txLog.unshift({
          id: data.txId,
          type: 'FUND_PAYROLL_POOL',
          circuit: 'fund_payroll_pool',
          epoch: this.epoch,
          amount: depositNum,
          merkleRoot: this.merkleRoot,
          timestamp: Date.now(),
          status: 'CONFIRMED',
          blockHeight: data.blockHeight
        });
        this.notifyStateChange();
        return;
      }
    } catch {}

    // Local fallback
    this.vaultBalance += depositNum;
    this.blockHeight += 1;
    this.txLog.unshift({
      id: `tx-${Date.now().toString().slice(-4)}`,
      type: 'FUND_PAYROLL_POOL',
      circuit: 'fund_payroll_pool',
      epoch: this.epoch,
      amount: depositNum,
      merkleRoot: this.merkleRoot,
      timestamp: Date.now(),
      status: 'CONFIRMED',
      blockHeight: this.blockHeight
    });
    this.notifyStateChange();
  }

  // Beneficiary claim action
  async claimDisbursement(empId, splitConfig, stealthAddresses) {
    const emp = this.cohort.find(c => c.id === empId);
    if (!emp) throw new Error('Beneficiary not found in active cohort');

    const nullifier = deriveNullifier(emp.secretKey, this.epoch);

    // Double claim rejection
    if (this.spentNullifiers.has(nullifier)) {
      throw new Error(`Double Claim Rejected: Nullifier ${nullifier.slice(0, 14)}... has already been spent on consensus ledger.`);
    }

    if (this.vaultBalance < emp.amount) {
      throw new Error('Insufficient vault balance to satisfy disbursement');
    }

    // Try backend
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beneficiaryId: empId, splitRecipe: splitConfig })
      });
      if (res.ok) {
        const data = await res.json();
        this.spentNullifiers.add(data.nullifier);
        emp.claimed = true;
        emp.splitRecipe = { ...splitConfig };
        this.vaultBalance -= emp.amount;
        this.txLog.unshift({
          id: data.txId,
          type: 'CLAIM_DISBURSEMENT_WITH_SPLIT',
          circuit: 'claim_disbursement_with_split',
          epoch: this.epoch,
          nullifier: data.nullifier,
          amountDisbursed: emp.amount,
          stealthOutputsCount: 3,
          timestamp: Date.now(),
          status: 'CONFIRMED',
          blockHeight: data.blockHeight
        });
        this.notifyStateChange();
        return data;
      }
    } catch {}

    // Local fallback
    this.spentNullifiers.add(nullifier);
    emp.claimed = true;
    emp.splitRecipe = { ...splitConfig };
    this.vaultBalance -= emp.amount;
    this.blockHeight += 1;

    this.txLog.unshift({
      id: `tx-${Date.now().toString().slice(-4)}`,
      type: 'CLAIM_DISBURSEMENT_WITH_SPLIT',
      circuit: 'claim_disbursement_with_split',
      epoch: this.epoch,
      nullifier: nullifier,
      amountDisbursed: emp.amount,
      stealthOutputsCount: 3,
      timestamp: Date.now(),
      status: 'CONFIRMED',
      blockHeight: this.blockHeight
    });

    this.notifyStateChange();
    return {
      nullifier,
      amount: emp.amount,
      outputs: stealthAddresses
    };
  }

  recordAttestation(attestation) {
    this.lastAttestation = attestation;
    this.notifyStateChange();
  }
}

export const store = new ProtocolStateStore();
