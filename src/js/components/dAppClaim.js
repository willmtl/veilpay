/* Private Payout Claim & Split Module */
import { icons } from '../icons.js';
import { store } from '../state.js';
import { generateStealthAddress, deriveNullifier, simulateZKProofGeneration } from '../crypto-sim.js';

let splitChecking = 50;
let splitCold = 35;
let splitTax = 15;

let stealthAddrChecking = generateStealthAddress('mn_daily');
let stealthAddrCold = generateStealthAddress('mn_vault');
let stealthAddrTax = generateStealthAddress('mn_tax');

let isProving = false;
let proofLogs = [];

export function renderDAppClaim() {
  const state = store;
  const currentEmp = state.cohort.find(c => c.id === state.activeBeneficiaryId) || state.cohort[0];
  const nullifier = deriveNullifier(currentEmp.secretKey, state.epoch);
  const isSpent = state.spentNullifiers.has(nullifier) || currentEmp.claimed;

  const amountChecking = Math.round(currentEmp.amount * (splitChecking / 100));
  const amountCold = Math.round(currentEmp.amount * (splitCold / 100));
  const amountTax = currentEmp.amount - amountChecking - amountCold;

  return `
    <div class="dapp-module-view ${state.activeDappTab === 'claim' ? 'active' : ''}" id="view-claim">
      <!-- Top Explainer Banner (Reassures user on security) -->
      <div style="background: #fafafc; border: 1px solid var(--border-medium); border-radius: 22px; padding: 1.5rem 1.75rem; margin-bottom: 2.25rem;">
        <div style="display: flex; align-items: flex-start; gap: 1.15rem;">
          <div style="background: #111111; color: #ffffff; padding: 0.6rem; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${icons.shield(20)}
          </div>
          <div>
            <h4 style="font-size: 1.05rem; margin-bottom: 0.35rem; color: #111111;">How is your salary protected from theft?</h4>
            <p class="text-sm" style="margin: 0; color: var(--text-secondary); line-height: 1.55;">
              When your company deposits payroll, Midnight places each salary behind a cryptographic lock. 
              Only someone who possesses the matching <strong>private key</strong> can claim the money. 
              Even if someone selects your name, the blockchain mathematically rejects their claim unless they hold your secret key.
              When you claim, Midnight proves you own the funds without ever revealing your name or wallet address on-chain.
            </p>
          </div>
        </div>
      </div>

      <div class="dapp-grid-split">
        <!-- Left Column: Identity & Claim Form -->
        <div>
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <div>
                <h4 style="font-size: 1.1rem; margin-bottom: 0.25rem;">Step 1: Choose Recipient Identity</h4>
                <p class="text-sm">In production, your wallet authenticates you automatically. For this demo, click a team member below.</p>
              </div>
              <span class="tag-badge ${isSpent ? 'white' : ''}">
                ${isSpent ? '✓ Payout Claimed' : 'Ready to Claim'}
              </span>
            </div>

            <!-- Interactive Identity Selector Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; margin-bottom: 1.75rem;">
              ${state.cohort.map(c => {
                const cNullifier = deriveNullifier(c.secretKey, state.epoch);
                const cSpent = state.spentNullifiers.has(cNullifier) || c.claimed;
                const isSelected = c.id === currentEmp.id;

                return `
                  <div class="recipient-select-card ${isSelected ? 'selected' : ''}" 
                       data-emp-id="${c.id}"
                       style="background: ${isSelected ? '#f0f1f4' : '#fafafc'}; border: 1px solid ${isSelected ? '#111111' : 'var(--border-subtle)'}; border-radius: 16px; padding: 1rem; cursor: pointer; transition: all 0.2s;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <span style="font-weight: 600; color: #111111; font-size: 0.925rem;">${c.name}</span>
                      ${cSpent ? '<span class="tag-badge white" style="font-size: 0.6rem; padding: 2px 6px;">Paid</span>' : ''}
                    </div>
                    <div class="text-xs text-secondary" style="margin-bottom: 0.5rem;">${c.role}</div>
                    <div class="text-mono" style="font-weight: 700; color: #111111; font-size: 0.95rem;">
                      ${c.amount.toLocaleString()} tDUST
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Step 2: Private Key Authentication -->
            <div class="input-group">
              <label class="input-label">
                <span>Step 2: Private Key Authentication</span>
                <span class="label-aside">Digital Signature Key</span>
              </label>
              <div style="position: relative;">
                <input type="text" id="input-claim-secret-key" class="input-field mono" 
                  value="${currentEmp.secretKey}"
                  style="font-size: 0.8rem; padding-right: 90px;" />
                <button class="btn btn-secondary btn-sm" id="btn-test-unauthorized-key" 
                  style="position: absolute; right: 6px; top: 6px; font-size: 0.7rem; padding: 0.3rem 0.6rem; border-radius: 8px;"
                  title="Test what happens when an attacker tries an invalid key">
                  Try Bad Key
                </button>
              </div>
              <p class="text-xs text-tertiary" style="margin-top: 0.4rem; margin-bottom: 0;">
                ✓ Loaded matching private key for <strong>${currentEmp.name}</strong>. Click "Try Bad Key" to test security rejection.
              </p>
            </div>

            <!-- Step 3: Split into 3 Wallets -->
            <div class="split-sliders-card" style="margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <div>
                  <h5 style="font-family: var(--font-mono); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.25rem;">
                    Step 3: Private Multi-Wallet Split
                  </h5>
                  <p class="text-xs text-secondary" style="margin: 0;">
                    Distributes your salary across 3 fresh, untraceable addresses so nobody can link your accounts.
                  </p>
                </div>
                <button class="btn btn-outline btn-sm" id="btn-refresh-stealth-addrs" title="Generate fresh receiving addresses">
                  ${icons.refresh(12)}
                  <span>New Addresses</span>
                </button>
              </div>

              <!-- Split 1: Checking -->
              <div class="split-channel-item">
                <div class="split-channel-header">
                  <span class="split-channel-title">
                    ${icons.wallet ? icons.wallet(14) : icons.database(14)}
                    <span>1. Daily Spending Wallet</span>
                  </span>
                  <span class="split-channel-pct" id="label-split-checking">
                    ${splitChecking}% (${amountChecking.toLocaleString()} tDUST)
                  </span>
                </div>
                <input type="range" class="range-slider" id="slider-split-checking" min="0" max="100" value="${splitChecking}" />
                <div class="split-stealth-addr">
                  <span>Receives at:</span>
                  <code style="color: #111111; font-weight: 600;">${stealthAddrChecking}</code>
                </div>
              </div>

              <!-- Split 2: Savings -->
              <div class="split-channel-item">
                <div class="split-channel-header">
                  <span class="split-channel-title">
                    ${icons.lock(14)}
                    <span>2. Long-Term Savings Vault</span>
                  </span>
                  <span class="split-channel-pct" id="label-split-cold">
                    ${splitCold}% (${amountCold.toLocaleString()} tDUST)
                  </span>
                </div>
                <input type="range" class="range-slider" id="slider-split-cold" min="0" max="100" value="${splitCold}" />
                <div class="split-stealth-addr">
                  <span>Receives at:</span>
                  <code style="color: #111111; font-weight: 600;">${stealthAddrCold}</code>
                </div>
              </div>

              <!-- Split 3: Tax -->
              <div class="split-channel-item">
                <div class="split-channel-header">
                  <span class="split-channel-title">
                    ${icons.shield(14)}
                    <span>3. Tax Reserve Account</span>
                  </span>
                  <span class="split-channel-pct" id="label-split-tax">
                    ${splitTax}% (${amountTax.toLocaleString()} tDUST)
                  </span>
                </div>
                <div class="split-stealth-addr" style="margin-top: 0.25rem;">
                  <span>Receives at:</span>
                  <code style="color: #111111; font-weight: 600;">${stealthAddrTax}</code>
                </div>
              </div>
            </div>

            <!-- Error Banner -->
            <div id="claim-error-banner" style="display: none; margin-top: 1.25rem; padding: 0.85rem 1rem; background: #200808; border: 1px solid #771111; border-radius: 12px; color: #ffffff;">
              <div class="text-xs text-mono" style="display: flex; align-items: center; gap: 0.5rem;" id="claim-error-text">
                ${icons.alert(14)}
                <span>Error occurred.</span>
              </div>
            </div>

            <!-- Claim Submission Action -->
            <div style="margin-top: 1.5rem;">
              <button class="btn btn-primary btn-lg" style="width: 100%; font-size: 1rem; padding: 1rem;" id="btn-execute-claim" ${isProving ? 'disabled' : ''}>
                ${isProving ? icons.refresh(16) : icons.shield(16)}
                <span>${isProving ? 'Generating Zero-Knowledge Proof...' : (isSpent ? 'Double-Claim (Will Be Rejected)' : `Claim ${currentEmp.amount.toLocaleString()} tDUST Privately`)}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Live Proof Terminal & Summary -->
        <div>
          <div class="terminal-block" style="border-radius: 22px;">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="terminal-dot"></span>
                <span class="terminal-dot"></span>
                <span class="terminal-dot"></span>
              </div>
              <span>Live Claim Verification Terminal</span>
              <span id="proving-status-tag" class="tag-badge ${isProving ? 'white' : ''}">${isProving ? 'PROVING...' : 'READY'}</span>
            </div>

            <div class="terminal-body" id="zk-terminal-body" style="min-height: 480px; max-height: 560px;">
              <div class="terminal-line">
                <span class="prefix">&gt;</span>
                <span class="subtle">VeilPay Zero-Knowledge Payout Terminal v1.2.0 initialized.</span>
              </div>
              <div class="terminal-line">
                <span class="prefix">&gt;</span>
                <span>Active Recipient: <span class="highlight">${currentEmp.name}</span> (${currentEmp.role})</span>
              </div>
              <div class="terminal-line">
                <span class="prefix">&gt;</span>
                <span>Allocated Amount: <span class="highlight">${currentEmp.amount.toLocaleString()} tDUST</span></span>
              </div>
              <div class="terminal-line">
                <span class="prefix">&gt;</span>
                <span>Status: <span class="${isSpent ? 'subtle' : 'highlight'}">${isSpent ? 'ALREADY CLAIMED' : 'UNCLAIMED & READY'}</span></span>
              </div>
              <div class="terminal-line" style="margin-top: 1rem;">
                <span class="prefix">&gt;</span>
                <span class="text-tertiary">Click "Claim Payout Privately" to execute zero-knowledge proof generation.</span>
              </div>

              ${proofLogs.map(log => `
                <div class="terminal-line">
                  <span class="prefix">&gt;</span>
                  <span class="${log.highlight ? 'highlight' : ''}">${log.text}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachDAppClaimListeners() {
  const cards = document.querySelectorAll('.recipient-select-card');
  const sliderChecking = document.getElementById('slider-split-checking');
  const sliderCold = document.getElementById('slider-split-cold');
  const refreshAddrs = document.getElementById('btn-refresh-stealth-addrs');
  const claimBtn = document.getElementById('btn-execute-claim');
  const badKeyBtn = document.getElementById('btn-test-unauthorized-key');

  // Interactive Recipient selection cards
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const empId = card.getAttribute('data-emp-id');
      if (empId) {
        store.setActiveBeneficiary(empId);
        const emp = store.cohort.find(c => c.id === empId);
        const keyInput = document.getElementById('input-claim-secret-key');
        if (keyInput && emp) {
          keyInput.value = emp.secretKey;
        }
        hideError();
      }
    });
  });

  if (badKeyBtn) {
    badKeyBtn.addEventListener('click', () => {
      const keyInput = document.getElementById('input-claim-secret-key');
      if (keyInput) {
        keyInput.value = 'sk_secp_attacker_99990000unauthorized_fake_key';
        showError('Fake / unauthorized key loaded. Now click "Claim Payout" below to watch Midnight reject it!');
      }
    });
  }

  if (sliderChecking) {
    sliderChecking.addEventListener('input', (e) => {
      splitChecking = parseInt(e.target.value, 10);
      if (splitChecking + splitCold > 100) {
        splitCold = 100 - splitChecking;
      }
      splitTax = 100 - splitChecking - splitCold;
      updateSplitLabels();
    });
  }

  if (sliderCold) {
    sliderCold.addEventListener('input', (e) => {
      splitCold = parseInt(e.target.value, 10);
      if (splitChecking + splitCold > 100) {
        splitChecking = 100 - splitCold;
      }
      splitTax = 100 - splitChecking - splitCold;
      updateSplitLabels();
    });
  }

  if (refreshAddrs) {
    refreshAddrs.addEventListener('click', () => {
      stealthAddrChecking = generateStealthAddress('mn_daily');
      stealthAddrCold = generateStealthAddress('mn_vault');
      stealthAddrTax = generateStealthAddress('mn_tax');
      store.notify();
    });
  }

  if (claimBtn) {
    claimBtn.addEventListener('click', async () => {
      if (isProving) return;
      const state = store;
      const currentEmp = state.cohort.find(c => c.id === state.activeBeneficiaryId) || state.cohort[0];

      // AUTHENTICATION CHECK
      const enteredKey = document.getElementById('input-claim-secret-key')?.value.trim();
      
      if (!enteredKey) {
        showError('Please provide your secret key to prove ownership of this salary.');
        appendLog('[ERROR] No private key provided. Claim denied.', true);
        return;
      }

      if (enteredKey !== currentEmp.secretKey) {
        showError(`Access Denied: The key entered does NOT match ${currentEmp.name}'s cryptographic commitment. Midnight's zero-knowledge circuit will reject unauthorized claims.`);
        appendLog(`[SECURITY REJECTION] Key mismatch detected. Claim aborted for ${currentEmp.name}.`, true);
        return;
      }

      const nullifier = deriveNullifier(currentEmp.secretKey, state.epoch);

      // Check if already claimed
      if (state.spentNullifiers.has(nullifier) || currentEmp.claimed) {
        showError(`Double-Claim Prevented: ${currentEmp.name} has already collected their payout for this pay period. Midnight's anti-double-spending registry blocks duplicate claims.`);
        appendLog(`[BLOCKED] Duplicate claim detected. Nullifier was already marked spent on Midnight.`, true);
        return;
      }

      hideError();
      isProving = true;
      proofLogs = [];
      store.notify();

      appendLog(`[AUTH SUCCESS] Private key verified for ${currentEmp.name}. Ownership confirmed.`);
      appendLog(`[INFO] Preparing zero-knowledge witness proof for ${currentEmp.amount.toLocaleString()} tDUST payout...`);

      try {
        await simulateZKProofGeneration({ nullifier }, (stepName, curr, total) => {
          appendLog(`[Step ${curr}/${total}] ${stepName}`);
        });

        // Execute state update
        await store.claimDisbursement(
          currentEmp.id,
          { checking: splitChecking, coldVault: splitCold, taxReserve: splitTax },
          [stealthAddrChecking, stealthAddrCold, stealthAddrTax]
        );

        appendLog(`[CONFIRMED] Payout of ${currentEmp.amount.toLocaleString()} tDUST confirmed on Midnight testnet!`, true);
        appendLog(`[PRIVACY] Funds distributed across 3 unlinkable stealth addresses:`);
        appendLog(`  - Spending (${splitChecking}%): ${stealthAddrChecking}`);
        appendLog(`  - Savings (${splitCold}%):  ${stealthAddrCold}`);
        appendLog(`  - Taxes (${splitTax}%):    ${stealthAddrTax}`);
        appendLog(`[COMPLETE] Zero identity data exposed. Public ledger cannot trace who claimed this salary.`);

        // Regenerate fresh addresses for next run
        stealthAddrChecking = generateStealthAddress('mn_daily');
        stealthAddrCold = generateStealthAddress('mn_vault');
        stealthAddrTax = generateStealthAddress('mn_tax');
      } catch (err) {
        showError(err.message);
        appendLog(`[FAIL] ${err.message}`, true);
      } finally {
        isProving = false;
        store.notify();
      }
    });
  }
}

function updateSplitLabels() {
  const currentEmp = store.cohort.find(c => c.id === store.activeBeneficiaryId) || store.cohort[0];
  const amountChecking = Math.round(currentEmp.amount * (splitChecking / 100));
  const amountCold = Math.round(currentEmp.amount * (splitCold / 100));
  const amountTax = currentEmp.amount - amountChecking - amountCold;

  const lblCheck = document.getElementById('label-split-checking');
  const lblCold = document.getElementById('label-split-cold');
  const lblTax = document.getElementById('label-split-tax');
  const sliderCheck = document.getElementById('slider-split-checking');
  const sliderC = document.getElementById('slider-split-cold');

  if (lblCheck) lblCheck.textContent = `${splitChecking}% (${amountChecking.toLocaleString()} tDUST)`;
  if (lblCold) lblCold.textContent = `${splitCold}% (${amountCold.toLocaleString()} tDUST)`;
  if (lblTax) lblTax.textContent = `${splitTax}% (${amountTax.toLocaleString()} tDUST)`;
  if (sliderCheck) sliderCheck.value = splitChecking;
  if (sliderC) sliderC.value = splitCold;
}

function appendLog(text, highlight = false) {
  proofLogs.push({ text, highlight });
  const terminal = document.getElementById('zk-terminal-body');
  if (terminal) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `
      <span class="prefix">&gt;</span>
      <span class="${highlight ? 'highlight' : ''}">${text}</span>
    `;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }
}

function showError(msg) {
  const errBanner = document.getElementById('claim-error-banner');
  const errText = document.getElementById('claim-error-text');
  if (errBanner && errText) {
    errBanner.style.display = 'block';
    errText.innerHTML = `${icons.alert(14)} <span>${msg}</span>`;
  }
}

function hideError() {
  const errBanner = document.getElementById('claim-error-banner');
  if (errBanner) {
    errBanner.style.display = 'none';
  }
}
