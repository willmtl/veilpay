/* Interactive Apple-Style Midnight Wallet Modal */
import { icons } from '../icons.js';
import { store } from '../state.js';

let isModalOpen = false;
let isFauceting = false;

export function renderWalletModal() {
  const state = store;
  const isConnected = state.wallet.connected;
  const shortAddr = `${state.wallet.address.slice(0, 12)}...${state.wallet.address.slice(-6)}`;

  return `
    <div class="modal-overlay ${isModalOpen ? 'open' : ''}" id="wallet-modal-overlay">
      <div class="modal-card modal-enter" style="border-radius: var(--radius-xl); max-width: 480px; background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(32px); border: 1px solid var(--border-subtle); box-shadow: 0 30px 70px rgba(0,0,0,0.15);">
        <!-- Modal Header -->
        <div class="modal-header" style="margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.3rem; margin-bottom: 0.25rem; color: var(--text-primary);">
              ${isConnected ? 'Midnight Account' : 'Connect Wallet'}
            </h3>
            <p class="text-xs text-tertiary">
              ${isConnected ? 'Manage your Midnight Testnet credentials and faucet balance' : 'Select your Midnight Lace wallet or generate a devnet keypair'}
            </p>
          </div>
          <button class="btn btn-outline btn-icon-only" id="btn-close-wallet-modal" style="border-radius: var(--radius-pill); width: 34px; height: 34px; padding: 0;">
            ${icons.xMark(16)}
          </button>
        </div>

        ${isConnected ? `
          <!-- Connected Wallet Details -->
          <div style="background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span class="tag-badge white" style="font-size: 0.7rem;">
                <span class="status-dot"></span>
                <span>${state.wallet.network}</span>
              </span>
              <span class="text-xs text-mono text-tertiary">${state.wallet.walletName}</span>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <div class="text-xs text-tertiary" style="margin-bottom: 0.35rem;">Shielded Public Address</div>
              <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-1); padding: 0.65rem 0.95rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                <span class="text-mono text-xs" style="color: var(--text-primary); font-weight: 600;">${shortAddr}</span>
                <button class="btn btn-outline btn-sm" id="btn-copy-address" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;">
                  ${icons.copy(12)}
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <div>
              <div class="text-xs text-tertiary" style="margin-bottom: 0.35rem;">Spendable Devnet Balance</div>
              <div style="font-family: var(--font-mono); font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">
                ${state.wallet.balance.toLocaleString()} <span style="font-size: 0.9rem; color: var(--text-tertiary);">tDUST</span>
              </div>
            </div>
          </div>

          <!-- Faucet & Actions -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button class="btn btn-primary" id="btn-request-faucet" style="width: 100%; justify-content: center;" ${isFauceting ? 'disabled' : ''}>
              ${isFauceting ? icons.refresh(16) : icons.database(16)}
              <span>${isFauceting ? 'Dispensing Testnet Tokens...' : 'Request +10,000 tDUST (Faucet)'}</span>
            </button>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <button class="btn btn-secondary" id="btn-generate-new-keypair" style="font-size: 0.825rem;">
                ${icons.refresh(14)}
                <span>New Keypair</span>
              </button>
              <button class="btn btn-outline" id="btn-disconnect-wallet" style="font-size: 0.825rem;">
                ${icons.xMark(14)}
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ` : `
          <!-- Wallet Selection List -->
          <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem;">
            <button class="card-sheen" id="opt-connect-lace" style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); text-align: left; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 40px; height: 40px; border-radius: var(--radius-sm); background: #111111; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                  ${icons.shield(20)}
                </div>
                <div>
                  <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.2rem;">Midnight Lace Wallet</div>
                  <div class="text-xs text-tertiary">Official Midnight Browser DApp Connector</div>
                </div>
              </div>
              <span class="tag-badge" style="font-size: 0.7rem;">Detected</span>
            </button>

            <button class="card-sheen" id="opt-generate-ephemeral" style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); text-align: left; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--bg-surface-3); color: var(--text-primary); display: flex; align-items: center; justify-content: center;">
                  ${icons.terminal(20)}
                </div>
                <div>
                  <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.2rem;">Ephemeral Devnet Keypair</div>
                  <div class="text-xs text-tertiary">Generate instant test credentials in browser</div>
                </div>
              </div>
              <span class="tag-badge white" style="font-size: 0.7rem;">1-Click</span>
            </button>
          </div>
        `}

        <div style="margin-top: 1.25rem; text-align: center; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          <span class="text-xs text-tertiary text-mono">
            Midnight Testnet-02 &bull; Client-Side Private Witness Ledger
          </span>
        </div>
      </div>
    </div>
  `;
}

export function openWalletModal() {
  isModalOpen = true;
  updateModalDOM();
}

export function closeWalletModal() {
  isModalOpen = false;
  updateModalDOM();
}

function updateModalDOM() {
  const mount = document.getElementById('wallet-modal-mount');
  if (mount) {
    mount.innerHTML = renderWalletModal();
    attachWalletModalListeners();
  }
}

export function attachWalletModalListeners() {
  const overlay = document.getElementById('wallet-modal-overlay');
  const closeBtn = document.getElementById('btn-close-wallet-modal');
  const optLace = document.getElementById('opt-connect-lace');
  const optEphemeral = document.getElementById('opt-generate-ephemeral');
  const disconnectBtn = document.getElementById('btn-disconnect-wallet');
  const faucetBtn = document.getElementById('btn-request-faucet');
  const copyBtn = document.getElementById('btn-copy-address');
  const newKeyBtn = document.getElementById('btn-generate-new-keypair');

  if (closeBtn) closeBtn.addEventListener('click', closeWalletModal);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeWalletModal();
    });
  }

  if (optLace) {
    optLace.addEventListener('click', () => {
      store.wallet.connected = true;
      store.wallet.walletName = 'Midnight Lace';
      store.notifyStateChange();
      closeWalletModal();
    });
  }

  if (optEphemeral) {
    optEphemeral.addEventListener('click', () => {
      const randSuffix = Math.random().toString(16).slice(2, 10);
      store.wallet.connected = true;
      store.wallet.walletName = 'Ephemeral Devnet Keypair';
      store.wallet.address = `mn_addr_1z${randSuffix}98af2`;
      store.wallet.balance = 25000;
      store.notifyStateChange();
      closeWalletModal();
    });
  }

  if (disconnectBtn) {
    disconnectBtn.addEventListener('click', () => {
      store.wallet.connected = false;
      store.notifyStateChange();
      closeWalletModal();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(store.wallet.address);
      copyBtn.innerHTML = `${icons.check(12)} <span>Copied</span>`;
      setTimeout(() => {
        if (copyBtn) copyBtn.innerHTML = `${icons.copy(12)} <span>Copy</span>`;
      }, 2000);
    });
  }

  if (newKeyBtn) {
    newKeyBtn.addEventListener('click', () => {
      const randSuffix = Math.random().toString(16).slice(2, 10);
      store.wallet.address = `mn_addr_1z${randSuffix}c401`;
      store.wallet.balance = 10000;
      store.notifyStateChange();
      updateModalDOM();
    });
  }

  if (faucetBtn) {
    faucetBtn.addEventListener('click', async () => {
      if (isFauceting) return;
      isFauceting = true;
      updateModalDOM();

      try {
        const res = await fetch('/api/faucet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: store.wallet.address, amount: 10000 })
        });
        if (res.ok) {
          const data = await res.json();
          store.wallet.balance = (store.wallet.balance || 0) + 10000;
        } else {
          store.wallet.balance = (store.wallet.balance || 0) + 10000;
        }
      } catch {
        store.wallet.balance = (store.wallet.balance || 0) + 10000;
      } finally {
        isFauceting = false;
        store.notifyStateChange();
        updateModalDOM();
      }
    });
  }
}
