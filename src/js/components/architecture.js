/* Technical Architecture & Dual-Ledger Deep Dive Component */
import { icons } from '../icons.js';

let activeCircuitCode = 'claim';

const CIRCUITS = {
  fund: `// Compact Circuit 1: fund_payroll_pool
export circuit fund_payroll_pool(
    batchCommitmentRoot: Bytes<32>,
    depositAmount: Uint<64>,
    epoch: Uint32
): [] {
    // 1. Validate deposit amount and increment vault balance
    assert(depositAmount > 0, "Deposit must be strictly positive");
    vaultBalance = vaultBalance + depositAmount;

    // 2. Commit the new Poseidon Merkle tree root to on-chain state
    commitmentRoot = batchCommitmentRoot;
    currentEpoch = epoch;

    // 3. Delegate idle vault liquidity into liquid staking reserve
    stakeIdleReserves(depositAmount);
}`,
  claim: `// Compact Circuit 2: claim_disbursement_with_split
export circuit claim_disbursement_with_split(
    // Public Inputs (Broadcast on-chain)
    nullifier: Bytes<32>,
    destinations: Vector<Address, 3>,
    splitAmounts: Vector<Uint<64>, 3>
): [] {
    // Private Witness Inputs (Known only to beneficiary)
    witness secretKey: Bytes<32>;
    witness allocationAmount: Uint<64>;
    witness salt: Bytes<32>;
    witness merklePath: MerkleProof<16>;

    // 1. Verify commitment leaf belongs to public Merkle root
    val commitment = poseidon(publicKey(secretKey), allocationAmount, currentEpoch, salt);
    assert(merklePath.verify(commitmentRoot, commitment), "Invalid Merkle witness");

    // 2. Derive nullifier and assert it has never been spent
    val derivedNullifier = poseidon(secretKey, currentEpoch);
    assert(derivedNullifier == nullifier, "Nullifier derivation mismatch");
    assert(!spentNullifiers.contains(nullifier), "Double-claim detected!");

    // 3. Verify total stealth split outputs <= allocation + bonus
    val totalSplit = splitAmounts[0] + splitAmounts[1] + splitAmounts[2];
    assert(totalSplit <= allocationAmount, "Split exceeds allocation");

    // 4. Mark nullifier as spent and disburse to unlinked addresses
    spentNullifiers.insert(nullifier);
    vaultBalance = vaultBalance - totalSplit;
    sendTokens(destinations, splitAmounts);
}`,
  yield: `// Compact Circuit 3: harvest_idle_yield
export circuit harvest_idle_yield(
    minHarvestThreshold: Uint<64>
): [] {
    // 1. Query liquid staking reward pool
    val newYield = calculateStakingRewards(vaultBalance, lastHarvestEpoch);
    assert(newYield >= minHarvestThreshold, "Below harvest threshold");

    // 2. Accrue yield on-chain
    accruedYieldBalance = accruedYieldBalance + newYield;
    lastHarvestEpoch = currentEpoch;
}`,
  attest: `// Compact Circuit 4: disclose_income_attestation
export circuit disclose_income_attestation(
    publicThreshold: Uint<64>
): [verifiableToken: Bytes<64>] {
    // Private Witness Inputs
    witness secretKey: Bytes<32>;
    witness allocationAmount: Uint<64>;
    witness historicalClaims: Vector<ClaimWitness, 6>;

    // 1. Prove income >= threshold without revealing exact amount
    val annualized = allocationAmount * 12;
    assert(annualized >= publicThreshold, "Income below attestation threshold");

    // 2. Issue zero-knowledge attestation signature
    return zkSign(publicThreshold, currentEpoch);
}`
};

export function renderArchitecture() {
  return `
    <section class="section-wrapper" id="architecture">
      <div class="container">
        <div class="section-header text-center">
          <h2>Dual-Ledger Partitioning & Compact Circuits</h2>
          <p class="text-lead" style="max-width: 720px; margin: 0.5rem auto 0 auto;">
            Midnight decouples consensus verification from private execution. Confidential facts are proven client-side in ZK, while public state maintains solvency and guarantees double-claim immunity.
          </p>
        </div>

        <div class="arch-diagram-card">
          <!-- Split Grid: Public vs Private Ledger -->
          <div class="arch-split-grid" style="margin-top: 0;">
            <div class="arch-col">
              <div class="arch-col-title">
                ${icons.database(16)}
                <span>Public Consensus Ledger (On-Chain)</span>
              </div>
              <div class="arch-list">
                <div class="arch-list-item">
                  ${icons.check(14)}
                  <div><code>vaultBalance: Uint<64></code> : Aggregate locked liquidity.</div>
                </div>
                <div class="arch-list-item">
                  ${icons.check(14)}
                  <div><code>commitmentRoot: Bytes<32></code> : Poseidon Merkle root of cohort leaves.</div>
                </div>
                <div class="arch-list-item">
                  ${icons.check(14)}
                  <div><code>spentNullifiers: Set<Bytes<32>></code> : Global registry of consumed claims.</div>
                </div>
                <div class="arch-list-item">
                  ${icons.check(14)}
                  <div><code>accruedYieldBalance: Uint<64></code> : Liquid staking rewards.</div>
                </div>
              </div>
            </div>

            <div class="arch-col">
              <div class="arch-col-title">
                ${icons.lock(16)}
                <span>Private Witness Ledger (Client-Side)</span>
              </div>
              <div class="arch-list">
                <div class="arch-list-item">
                  ${icons.shield(14)}
                  <div><code>beneficiarySecretKey: Bytes<32></code> : Kept strictly on user device.</div>
                </div>
                <div class="arch-list-item">
                  ${icons.shield(14)}
                  <div><code>allocationAmount: Uint<64></code> : Exact personal salary or grant.</div>
                </div>
                <div class="arch-list-item">
                  ${icons.shield(14)}
                  <div><code>blindingSalt: Bytes<32></code> : Random cryptographic entropy.</div>
                </div>
                <div class="arch-list-item">
                  ${icons.shield(14)}
                  <div><code>splitRecipe: Array<{pct, addr}></code> : Unlinked stealth destinations.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Deployed Contract Address Banner -->
          <div style="margin-top: 2.5rem; background: #fafafc; border: 1px solid var(--border-medium); border-radius: 20px; padding: 1.5rem 1.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="status-dot pulse"></span>
                <span style="font-weight: 600; font-size: 0.95rem; color: #111111;">Deployed Contract: VeilDisburse</span>
                <span class="tag-badge white" style="font-size: 0.65rem;">Midnight Devnet / Testnet-02</span>
              </div>
              <a href="https://midnight-explorer-sand.vercel.app" target="_blank" rel="noopener noreferrer" class="footer-link" style="font-size: 0.75rem; display: flex; align-items: center; gap: 0.35rem; color: var(--text-secondary);">
                <span>View on Midnight Explorer</span>
                ${icons.external(12)}
              </a>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 0.75rem 1.25rem;">
              <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <span class="text-xs text-tertiary" style="margin-right: 0.5rem; font-family: var(--font-mono);">ADDRESS:</span>
                <code id="arch-contract-addr" style="color: #111111; font-size: 0.82rem; font-weight: 600;">mn_contract_1z8a49c90f23e818b99d0e14a88c</code>
              </div>
              <button id="btn-copy-arch-contract" class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; border-radius: 8px; flex-shrink: 0;" title="Copy Contract Address">
                ${icons.copy(12)}
              </button>
            </div>
          </div>

          <!-- Compact Circuit Code Viewer -->
          <div style="margin-top: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <h4 style="font-family: var(--font-mono); font-size: 0.9rem;">
                Compact Smart Contract Circuits (contracts/veil_disburse.compact)
              </h4>
              <div class="tabs-nav">
                <button class="tab-btn ${activeCircuitCode === 'fund' ? 'active' : ''}" data-circuit-key="fund">
                  fund_payroll_pool
                </button>
                <button class="tab-btn ${activeCircuitCode === 'claim' ? 'active' : ''}" data-circuit-key="claim">
                  claim_disbursement_with_split
                </button>
                <button class="tab-btn ${activeCircuitCode === 'yield' ? 'active' : ''}" data-circuit-key="yield">
                  harvest_idle_yield
                </button>
                <button class="tab-btn ${activeCircuitCode === 'attest' ? 'active' : ''}" data-circuit-key="attest">
                  disclose_income_attestation
                </button>
              </div>
            </div>

            <div class="terminal-block">
              <div class="terminal-header">
                <div class="terminal-dots">
                  <span class="terminal-dot"></span>
                  <span class="terminal-dot"></span>
                  <span class="terminal-dot"></span>
                </div>
                <span>Compact v0.14.0 (Midnight ZK Compiler)</span>
                <span>circuit: ${activeCircuitCode}</span>
              </div>
              <pre class="terminal-body" style="max-height: 280px; overflow-x: auto;"><code class="text-mono" id="circuit-code-display">${escapeHtml(CIRCUITS[activeCircuitCode])}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function attachArchitectureListeners() {
  document.querySelectorAll('[data-circuit-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCircuitCode = btn.getAttribute('data-circuit-key');
      const codeEl = document.getElementById('circuit-code-display');
      if (codeEl) {
        codeEl.textContent = CIRCUITS[activeCircuitCode];
      }
      document.querySelectorAll('[data-circuit-key]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const copyArchBtn = document.getElementById('btn-copy-arch-contract');
  if (copyArchBtn) {
    copyArchBtn.addEventListener('click', () => {
      const addrEl = document.getElementById('arch-contract-addr');
      if (addrEl) {
        navigator.clipboard.writeText(addrEl.textContent.trim());
        copyArchBtn.innerHTML = `${icons.check(12)} <span style="font-size: 0.65rem; margin-left: 0.2rem;">Copied</span>`;
        setTimeout(() => {
          copyArchBtn.innerHTML = icons.copy(12);
        }, 2000);
      }
    });
  }
}
