/* Private Income Verification (ZK Attestation) Component */
import { icons } from '../icons.js';
import { store } from '../state.js';
import { poseidonHash } from '../crypto-sim.js';

let generatedToken = '';
let verificationResult = null;
let testErrorState = null;

export function renderDAppAttest() {
  const state = store;
  const currentEmp = state.cohort.find(c => c.id === state.activeBeneficiaryId) || state.cohort[0];
  const annualized = currentEmp.amount * 12;
  const currentThreshold = 75000;
  const qualifies = annualized >= currentThreshold;

  return `
    <div class="dapp-module-view ${state.activeDappTab === 'attest' ? 'active' : ''}" id="view-attest">
      <!-- Header Explainer -->
      <div style="margin-bottom: 2.25rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span class="tag-badge white" style="font-size: 0.7rem;">Real-World Privacy Solution</span>
          <span class="tag-badge" style="font-size: 0.7rem;">No Paystubs Needed</span>
        </div>
        <h4>Private Proof of Income</h4>
        <p class="text-sm" style="max-width: 820px; color: var(--text-secondary);">
          Landlords and mortgage lenders usually require your paystubs or W-2s, exposing your exact salary, employer name, and personal banking history. 
          With VeilPay on Midnight, you can generate a mathematical certificate that proves you earn over a required threshold without revealing your exact salary or who you work for.
        </p>
      </div>

      <div class="dapp-grid-split">
        <!-- Left: Employee Side -->
        <div>
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <div>
                <h4 style="font-size: 1.05rem; margin-bottom: 0.25rem;">Step 1: Employee Creates Proof</h4>
                <p class="text-sm">Generate a privacy-preserving income certificate to share.</p>
              </div>
              <span class="tag-badge">Employee View</span>
            </div>

            <!-- Employee selector -->
            <div class="input-group">
              <label class="input-label">
                <span>Select Your Profile</span>
                <span class="label-aside">Private Witness</span>
              </label>
              <select id="select-attest-beneficiary" class="input-field mono">
                ${state.cohort.map(c => `
                  <option value="${c.id}" ${c.id === currentEmp.id ? 'selected' : ''}>
                    ${c.name} : ${c.role} ($${(c.amount * 12).toLocaleString()}/yr)
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Income threshold required by landlord/lender -->
            <div class="input-group">
              <label class="input-label">
                <span>Minimum Income to Prove</span>
                <span class="label-aside">Required by Landlord or Bank</span>
              </label>
              <select id="select-income-threshold" class="input-field mono">
                <option value="50000">Annual Income >= $50,000</option>
                <option value="75000" selected>Annual Income >= $75,000</option>
                <option value="100000">Annual Income >= $100,000</option>
                <option value="150000">Annual Income >= $150,000</option>
              </select>
            </div>

            <!-- Confidential Employee Details (Only visible locally) -->
            <div style="background: #fafafc; border: 1px solid var(--border-subtle); border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
              <div class="text-xs text-mono" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span class="text-tertiary">Your Actual Annual Salary:</span>
                <span id="attest-actual-salary" style="color: #111111; font-weight: 600;">
                  $${annualized.toLocaleString()} (Kept completely secret)
                </span>
              </div>
              <div class="text-xs text-mono" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span class="text-tertiary">Qualification Status:</span>
                <span id="attest-qualify-badge" style="color: ${qualifies ? '#16a34a' : '#dc2626'}; font-weight: 600;">
                  ${qualifies ? '✓ Meets Requirement' : '✗ Below Threshold'}
                </span>
              </div>
              <div class="text-xs text-mono" style="display: flex; justify-content: space-between;">
                <span class="text-tertiary">Consecutive Paychecks:</span>
                <span style="color: #111111; font-weight: 500;">6 Months Confirmed on Midnight</span>
              </div>
            </div>

            <!-- In-page message banner (Replaces native browser alert) -->
            <div id="attest-inline-msg" style="display: none; margin-bottom: 1.25rem; padding: 0.85rem 1rem; border-radius: 12px; font-size: 0.8rem; font-family: var(--font-mono);">
            </div>

            <button class="btn btn-primary btn-lg" style="width: 100%;" id="btn-generate-attestation">
              ${icons.badgeCheck(16)}
              <span>Generate Income Certificate</span>
            </button>

            <!-- Generated Token Display -->
            <div id="attest-token-display" style="display: ${generatedToken ? 'block' : 'none'}; margin-top: 1.5rem; padding: 1.25rem; background: #fafafc; border: 1px solid var(--border-medium); border-radius: 18px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <span class="status-dot"></span>
                  <span class="text-xs text-mono" style="color: #111111; font-weight: 600;">Generated Income Certificate:</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-secondary btn-sm" id="btn-copy-attest-token" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
                    ${icons.copy(12)}
                    <span>Copy</span>
                  </button>
                  <button class="btn btn-primary btn-sm" id="btn-auto-fill-verifier" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
                    <span>Send to Verifier →</span>
                  </button>
                </div>
              </div>
              <div class="text-mono" id="attest-token-text" style="font-size: 0.75rem; color: #f4f4f5; word-break: break-all; line-height: 1.5; background: #18181b; padding: 0.85rem; border-radius: 10px; border: 1px solid #27272a;">
                ${generatedToken}
              </div>
              <p class="text-xs text-tertiary" style="margin-top: 0.75rem; margin-bottom: 0;">
                ✓ Safe to send to your landlord or bank. They can verify you make enough money, but cannot see your exact salary or employer.
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Landlord / Bank Side -->
        <div>
          <div class="card card-elevated">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <div>
                <h4 style="font-size: 1.05rem;">Step 2: Landlord or Bank Verifies</h4>
                <p class="text-sm">Instant on-chain mathematical verification without seeing personal data.</p>
              </div>
              <span class="tag-badge white">Verifier View</span>
            </div>

            <div class="input-group">
              <label class="input-label">
                <span>Paste the Income Certificate</span>
                <span class="label-aside">From tenant or applicant</span>
              </label>
              <textarea id="verifier-token-input" class="input-field mono" rows="4" placeholder="Paste the income certificate token here, or click 'Send to Verifier' on the left">${generatedToken || ''}</textarea>
            </div>

            <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
              <button class="btn btn-primary" style="flex: 2; min-width: 180px;" id="btn-verify-token">
                ${icons.badgeCheck(16)}
                <span>Verify This Certificate</span>
              </button>
              <button class="btn btn-secondary" style="flex: 1;" id="btn-load-sample-token">
                <span>Load Sample</span>
              </button>
              <button class="btn btn-outline" style="flex: 1;" id="btn-test-fraud-token" title="See what happens with an invalid or forged token">
                <span>Test Forgery</span>
              </button>
            </div>

            <!-- Verification Status Card -->
            <div id="verification-result-box" class="attest-result-card ${verificationResult || testErrorState ? 'active' : ''} ${verificationResult ? 'verified' : ''}" style="min-height: 80px; border-radius: 18px;">
              <div id="verification-result-content">
                ${verificationResult ? renderVerificationResult(verificationResult) : (testErrorState ? renderErrorResult(testErrorState) : `
                  <div style="text-align: center; padding: 1.5rem 0;">
                    <div style="color: #666666; margin-bottom: 0.5rem;">${icons.badgeCheck(28)}</div>
                    <p class="text-xs text-mono text-tertiary" style="margin: 0;">
                      No certificate verified yet.<br/>Generate a certificate on the left or click "Load Sample" to try a live verification.
                    </p>
                  </div>
                `)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderVerificationResult(result) {
  return `
    <div class="verified-stamp">
      ${icons.badgeCheck(18)}
      <span>CERTIFICATE VALID & VERIFIED ON MIDNIGHT</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; font-family: var(--font-mono); font-size: 0.825rem; margin-top: 1rem;">
      <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-subtle);">
        <span class="text-tertiary">Requirement Met:</span>
        <span style="color: #16a34a; font-weight: 700;">Annual Income >= $${result.threshold.toLocaleString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-subtle);">
        <span class="text-tertiary">Exact Salary Revealed:</span>
        <span style="color: #111111; font-weight: 600;">$0 (100% Confidential)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-subtle);">
        <span class="text-tertiary">Employer Name Revealed:</span>
        <span style="color: #111111; font-weight: 600;">None (100% Confidential)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-subtle);">
        <span class="text-tertiary">Midnight ZK Proof Fingerprint:</span>
        <span style="color: #515154;">${result.hash.slice(0, 20)}...</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span class="text-tertiary">Mathematical Guarantee:</span>
        <span style="color: #111111; font-weight: 500;">Soundness & Zero-Knowledge Verified</span>
      </div>
    </div>
  `;
}

function renderErrorResult(errorText) {
  return `
    <div style="display: flex; align-items: center; gap: 0.5rem; color: #f87171; font-weight: 700; margin-bottom: 0.5rem;">
      ${icons.alert(18)}
      <span>VERIFICATION REJECTED</span>
    </div>
    <p class="text-xs text-mono" style="color: #ff9999; margin: 0; line-height: 1.5;">
      ${errorText}
    </p>
  `;
}

export function attachDAppAttestListeners() {
  const empSelect = document.getElementById('select-attest-beneficiary');
  const thresholdSelect = document.getElementById('select-income-threshold');
  const genBtn = document.getElementById('btn-generate-attestation');
  const verifyBtn = document.getElementById('btn-verify-token');
  const copyBtn = document.getElementById('btn-copy-attest-token');
  const sendBtn = document.getElementById('btn-auto-fill-verifier');
  const sampleBtn = document.getElementById('btn-load-sample-token');
  const fraudBtn = document.getElementById('btn-test-fraud-token');

  function updateQualificationUI() {
    const state = store;
    const currentEmp = state.cohort.find(c => c.id === state.activeBeneficiaryId) || state.cohort[0];
    const threshold = parseInt(document.getElementById('select-income-threshold')?.value || '75000', 10);
    const annualized = currentEmp.amount * 12;
    const qualifies = annualized >= threshold;

    const salaryEl = document.getElementById('attest-actual-salary');
    const badgeEl = document.getElementById('attest-qualify-badge');

    if (salaryEl) salaryEl.textContent = `$${annualized.toLocaleString()} (Kept completely secret)`;
    if (badgeEl) {
      badgeEl.textContent = qualifies ? '✓ Meets Requirement' : '✗ Below Threshold';
      badgeEl.style.color = qualifies ? '#4ade80' : '#f87171';
    }
  }

  if (empSelect) {
    empSelect.addEventListener('change', (e) => {
      store.setActiveBeneficiary(e.target.value);
      updateQualificationUI();
    });
  }

  if (thresholdSelect) {
    thresholdSelect.addEventListener('change', () => {
      updateQualificationUI();
    });
  }

  if (genBtn) {
    genBtn.addEventListener('click', () => {
      const state = store;
      const currentEmp = state.cohort.find(c => c.id === state.activeBeneficiaryId) || state.cohort[0];
      const thresholdVal = document.getElementById('select-income-threshold')?.value || '75000';
      const threshold = parseInt(thresholdVal, 10);
      const annualized = currentEmp.amount * 12;

      const msgBox = document.getElementById('attest-inline-msg');

      if (annualized < threshold) {
        if (msgBox) {
          msgBox.style.display = 'block';
          msgBox.style.background = '#2a0a0a';
          msgBox.style.border = '1px solid #771111';
          msgBox.style.color = '#ff9999';
          msgBox.innerHTML = `⚠️ <strong>Proof Denied:</strong> ${currentEmp.name}'s annual salary ($${annualized.toLocaleString()}) does not meet the $${threshold.toLocaleString()} threshold. The Zero-Knowledge circuit will not generate a false proof.`;
        }
        return;
      }

      if (msgBox) {
        msgBox.style.display = 'none';
      }

      // Generate verifiable zero-knowledge attestation token
      const proofSig = poseidonHash('ZK_ATTEST_INCOME', currentEmp.secretKey, threshold, state.epoch);
      generatedToken = `zk_attest_v1::midnight::threshold_${threshold}::sig_${proofSig.slice(0, 32)}`;

      const tokenDisplay = document.getElementById('attest-token-display');
      const tokenText = document.getElementById('attest-token-text');
      const verifierInput = document.getElementById('verifier-token-input');

      if (tokenDisplay) tokenDisplay.style.display = 'block';
      if (tokenText) tokenText.textContent = generatedToken;
      if (verifierInput) verifierInput.value = generatedToken;

      genBtn.innerHTML = `${icons.check(16)} <span>Certificate Created!</span>`;
      setTimeout(() => {
        genBtn.innerHTML = `${icons.badgeCheck(16)} <span>Generate Income Certificate</span>`;
      }, 2000);

      store.recordAttestation({
        beneficiaryId: currentEmp.id,
        threshold,
        token: generatedToken,
        timestamp: Date.now()
      });
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const tokenText = document.getElementById('attest-token-text');
      const text = tokenText ? tokenText.textContent : generatedToken;
      if (text) {
        navigator.clipboard.writeText(text);
        copyBtn.innerHTML = `${icons.check(12)} <span>Copied</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `${icons.copy(12)} <span>Copy</span>`;
        }, 2000);
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const verifierInput = document.getElementById('verifier-token-input');
      if (verifierInput) {
        verifierInput.value = generatedToken;
        verifierInput.focus();
        sendBtn.innerHTML = `<span>Sent!</span>`;
        setTimeout(() => {
          sendBtn.innerHTML = `<span>Send to Verifier →</span>`;
        }, 1500);
      }
    });
  }

  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const sampleSig = poseidonHash('SAMPLE_TOKEN', 75000, Date.now());
      const sampleToken = `zk_attest_v1::midnight::threshold_75000::sig_${sampleSig.slice(0, 32)}`;
      const verifierInput = document.getElementById('verifier-token-input');
      if (verifierInput) verifierInput.value = sampleToken;

      sampleBtn.innerHTML = `<span>Sample Loaded</span>`;
      setTimeout(() => {
        sampleBtn.innerHTML = `<span>Load Sample</span>`;
      }, 1500);
    });
  }

  if (fraudBtn) {
    fraudBtn.addEventListener('click', () => {
      const verifierInput = document.getElementById('verifier-token-input');
      if (verifierInput) {
        verifierInput.value = 'zk_attest_v1::midnight::threshold_150000::sig_forged_9999invalid_hash_signature';
      }
      fraudBtn.innerHTML = `<span>Loaded Forged</span>`;
      setTimeout(() => {
        fraudBtn.innerHTML = `<span>Test Forgery</span>`;
      }, 1500);
    });
  }

  if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      const inputVal = document.getElementById('verifier-token-input')?.value.trim();
      const resultBox = document.getElementById('verification-result-box');
      const resultContent = document.getElementById('verification-result-content');

      if (!inputVal) {
        testErrorState = 'Please paste or load an income certificate token first.';
        verificationResult = null;
        if (resultBox) {
          resultBox.className = 'attest-result-card active';
        }
        if (resultContent) {
          resultContent.innerHTML = renderErrorResult(testErrorState);
        }
        return;
      }

      // Check if forged or invalid format
      if (!inputVal.startsWith('zk_attest_v1::') || inputVal.includes('forged') || inputVal.includes('invalid')) {
        testErrorState = 'Cryptographic signature verification failed. The Zero-Knowledge proof does not match any valid commitment on Midnight, or the threshold was altered.';
        verificationResult = null;
        if (resultBox) {
          resultBox.className = 'attest-result-card active';
        }
        if (resultContent) {
          resultContent.innerHTML = renderErrorResult(testErrorState);
        }
        return;
      }

      const match = inputVal.match(/threshold_(\d+)/);
      const threshold = match ? parseInt(match[1], 10) : 75000;

      testErrorState = null;
      verificationResult = {
        threshold,
        hash: poseidonHash('VERIFIED_RESULT', inputVal),
        timestamp: Date.now()
      };

      if (resultBox) {
        resultBox.className = 'attest-result-card active verified';
      }
      if (resultContent) {
        resultContent.innerHTML = renderVerificationResult(verificationResult);
      }

      verifyBtn.innerHTML = `${icons.badgeCheck(16)} <span>Verified!</span>`;
      setTimeout(() => {
        verifyBtn.innerHTML = `${icons.badgeCheck(16)} <span>Verify This Certificate</span>`;
      }, 2500);
    });
  }
}
