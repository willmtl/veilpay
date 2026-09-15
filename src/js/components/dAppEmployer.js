/* Company Treasury & Payroll Management Module */
import { icons } from '../icons.js';
import { store } from '../state.js';

export function renderDAppEmployer() {
  const state = store;
  const totalPayroll = state.cohort.reduce((s, c) => s + c.amount, 0);

  return `
    <div class="dapp-module-view ${state.activeDappTab === 'employer' ? 'active' : ''}" id="view-employer">
      <!-- Yield Accrual Banner -->
      <div class="yield-growth-banner">
        <div>
          <span class="tag-badge" style="margin-bottom: 0.5rem;">Automated Treasury Interest</span>
          <h3 style="margin-bottom: 0.25rem;">Earn 4.85% APY on Locked Payroll Funds</h3>
          <p class="text-sm">While funds sit in the company vault waiting to be claimed, they automatically generate staking yield.</p>
        </div>
        <div style="text-align: right;">
          <div style="font-family: var(--font-mono); font-size: 1.75rem; font-weight: 700; color: var(--text-primary);" id="live-yield-counter">
            +${state.accruedYield.toFixed(2)} tDUST
          </div>
          <span class="yield-rate-badge">${state.yieldApy}% APY Active</span>
        </div>
      </div>

      <div class="dapp-grid-split">
        <!-- Left: Team Roster -->
        <div>
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div>
                <h4 style="font-size: 1.1rem;">Company Payroll List (Month 1)</h4>
                <p class="text-sm">Team members claim their salaries privately using their secret keys.</p>
              </div>
              <span class="tag-badge white">${state.cohort.length} Team Members</span>
            </div>

            <!-- Cohort Table -->
            <div class="data-table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Team Member</th>
                    <th>Role</th>
                    <th>Monthly Salary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="cohort-table-body">
                  ${state.cohort.map(c => `
                    <tr>
                      <td>
                        <div style="font-weight: 600; color: var(--text-primary);">${c.name}</div>
                        <div class="text-xs text-mono text-tertiary">Key: ${c.secretKey.slice(0, 14)}...</div>
                      </td>
                      <td>${c.role}</td>
                      <td class="text-mono" style="font-weight: 600; color: var(--text-primary);">
                        ${c.amount.toLocaleString()} tDUST
                      </td>
                      <td>
                        ${c.claimed ? `
                          <span class="tag-badge white" style="font-size: 0.65rem;">
                            ${icons.check(10)} Claimed
                          </span>
                        ` : `
                          <span class="tag-badge" style="font-size: 0.65rem;">
                            Unclaimed
                          </span>
                        `}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Add Recipient Form -->
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
              <h5 style="font-family: var(--font-mono); font-size: 0.8rem; margin-bottom: 1rem; text-transform: uppercase;">
                Add Team Member to Payroll
              </h5>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 0.75rem; align-items: end;">
                <div>
                  <label class="text-xs text-tertiary" style="display: block; margin-bottom: 0.25rem;">Name</label>
                  <input type="text" id="add-emp-name" class="input-field" placeholder="e.g. Elena Rostova" />
                </div>
                <div>
                  <label class="text-xs text-tertiary" style="display: block; margin-bottom: 0.25rem;">Role</label>
                  <input type="text" id="add-emp-role" class="input-field" placeholder="e.g. Security Auditor" />
                </div>
                <div>
                  <label class="text-xs text-tertiary" style="display: block; margin-bottom: 0.25rem;">Monthly Salary (tDUST)</label>
                  <input type="number" id="add-emp-amount" class="input-field mono" placeholder="8000" />
                </div>
                <div>
                  <button class="btn btn-secondary" id="btn-add-cohort-member">
                    ${icons.check(14)}
                    <span>Add</span>
                  </button>
                </div>
              </div>
              <div id="add-emp-error-msg" style="display: none; margin-top: 0.75rem; color: #dc2626; font-size: 0.75rem; font-family: var(--font-mono);"></div>
            </div>
          </div>
        </div>

        <!-- Right: Vault Funding & Cryptographic Commitment -->
        <div>
          <!-- Cryptographic Fingerprint Box -->
          <div class="card" style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h4 style="font-size: 1.05rem;">Payroll Cryptographic Fingerprint</h4>
              <span class="tag-badge white" style="font-size: 0.65rem;">Midnight State</span>
            </div>
            <p class="text-sm" style="margin-bottom: 1rem;">
              The Midnight blockchain only stores this single cryptographic hash on-chain. Individual team members, salaries, and wallet addresses are never published.
            </p>

            <div class="merkle-root-display" style="padding: 0.85rem 1rem; border-radius: 12px; background: var(--bg-surface-2); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
              <div class="text-xs text-tertiary" style="margin-bottom: 0.35rem;">On-Chain Commitment Hash:</div>
              <div class="merkle-root-hash text-mono" id="display-merkle-root" style="font-size: 0.78rem; word-break: break-all; color: var(--text-primary);">${state.merkleRoot}</div>
            </div>

            <div class="text-xs text-mono text-tertiary" style="display: flex; justify-content: space-between;">
              <span>Total Monthly Payroll Requirement:</span>
              <span style="color: var(--text-primary); font-weight: 600;">${totalPayroll.toLocaleString()} tDUST</span>
            </div>
          </div>

          <!-- Vault Funding Action Card -->
          <div class="card card-elevated">
            <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem;">Fund This Month's Payroll Vault</h4>
            <p class="text-sm" style="margin-bottom: 1.25rem;">
              Deposit funds into the Midnight smart contract vault. Team members can immediately claim once the vault is funded.
            </p>

            <div class="input-group">
              <div class="input-label">
                <span>Deposit Amount (tDUST)</span>
                <span class="label-aside">Your Wallet: ${state.wallet.balance.toLocaleString()} tDUST</span>
              </div>
              <input type="number" class="input-field mono" id="fund-deposit-input" value="${totalPayroll}" />
            </div>

            <button class="btn btn-primary btn-lg" style="width: 100%; font-size: 0.95rem; padding: 0.9rem;" id="btn-submit-deposit">
              ${icons.database(16)}
              <span>Deposit & Lock Payroll Funds (${totalPayroll.toLocaleString()} tDUST)</span>
            </button>

            <div id="fund-success-msg" style="display: none; margin-top: 1rem; padding: 0.85rem 1rem; background: rgba(22, 163, 74, 0.08); border: 1px solid rgba(22, 163, 74, 0.25); border-radius: 12px;">
              <div class="text-xs text-mono" style="color: #16a34a; display: flex; align-items: center; gap: 0.5rem;">
                ${icons.check(14)}
                <span>Vault funded successfully! Smart contract VeilDisburse is ready for claims.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachDAppEmployerListeners() {
  const addBtn = document.getElementById('btn-add-cohort-member');
  const fundBtn = document.getElementById('btn-submit-deposit');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = document.getElementById('add-emp-name')?.value.trim();
      const role = document.getElementById('add-emp-role')?.value.trim();
      const amount = document.getElementById('add-emp-amount')?.value;
      const errEl = document.getElementById('add-emp-error-msg');

      if (!name || !amount) {
        if (errEl) {
          errEl.style.display = 'block';
          errEl.textContent = 'Please enter a name and salary amount.';
        }
        return;
      }

      if (errEl) errEl.style.display = 'none';

      store.addCohortMember({ name, role: role || 'Contributor', amount });
      document.getElementById('add-emp-name').value = '';
      document.getElementById('add-emp-role').value = '';
      document.getElementById('add-emp-amount').value = '';
    });
  }

  if (fundBtn) {
    fundBtn.addEventListener('click', () => {
      const depositVal = document.getElementById('fund-deposit-input')?.value;
      store.fundVaultDeposit(depositVal);
      const msg = document.getElementById('fund-success-msg');
      if (msg) {
        msg.style.display = 'block';
        setTimeout(() => { msg.style.display = 'none'; }, 4000);
      }
    });
  }
}
