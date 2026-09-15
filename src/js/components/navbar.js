/* Minimalist B&W Header & Navbar Component (Apple Curves, Clean Logo, Wallet Modal Trigger) */
import { icons } from '../icons.js';
import { store } from '../state.js';
import { openWalletModal } from './walletModal.js';

export function renderNavbar() {
  const state = store;
  const isDapp = state.currentView === 'dapp';
  const isConnected = state.wallet.connected;
  const shortAddr = `${state.wallet.address.slice(0, 8)}...${state.wallet.address.slice(-4)}`;

  return `
    <header class="site-header">
      <div class="container nav-container">
        <!-- Clean Brand Mark (Bulky badge removed) -->
        <a href="#" class="brand-logo" id="nav-brand-btn">
          <div class="brand-icon">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#111111"/>
              <path d="M7 9L16 23L25 9" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="16" cy="11" r="2.5" fill="#ffffff"/>
            </svg>
          </div>
          <span>VeilPay</span>
        </a>

        <!-- Nav Links -->
        <nav class="nav-links">
          <a href="#matrix" class="nav-link" id="nav-matrix-link">Comparison</a>
          <a href="#pillars" class="nav-link" id="nav-pillars-link">Pillars</a>
          <a href="#usecases" class="nav-link" id="nav-usecases-link">Use Cases</a>
          <a href="#architecture" class="nav-link" id="nav-arch-link">Dual-Ledger</a>
        </nav>

        <!-- Actions: Apple Segmented Pill Switcher & Connect Wallet -->
        <div class="nav-actions">
          <div class="view-mode-toggle">
            <button class="view-mode-btn ${!isDapp ? 'active' : ''}" id="toggle-landing-btn">
              Overview
            </button>
            <button class="view-mode-btn ${isDapp ? 'active' : ''}" id="toggle-dapp-btn">
              dApp Console
            </button>
          </div>

          <!-- Prominent Connect Wallet Button -->
          <button class="btn btn-secondary btn-sm" id="btn-open-wallet-modal" style="border-radius: var(--radius-pill); padding: 0.55rem 1.15rem; gap: 0.5rem; box-shadow: var(--specular-glow);">
            ${isConnected ? icons.shield(14) : icons.lock(14)}
            <span id="nav-wallet-label" class="text-mono" style="font-size: 0.8rem;">
              ${isConnected ? `${shortAddr} (${state.wallet.balance.toLocaleString()} tDUST)` : 'Connect Wallet'}
            </span>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function attachNavbarListeners() {
  const brandBtn = document.getElementById('nav-brand-btn');
  const toggleLanding = document.getElementById('toggle-landing-btn');
  const toggleDapp = document.getElementById('toggle-dapp-btn');
  const walletModalBtn = document.getElementById('btn-open-wallet-modal');

  if (brandBtn) {
    brandBtn.addEventListener('click', (e) => {
      e.preventDefault();
      store.setView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (toggleLanding) {
    toggleLanding.addEventListener('click', () => {
      store.setView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (toggleDapp) {
    toggleDapp.addEventListener('click', () => {
      store.setView('dapp');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (walletModalBtn) {
    walletModalBtn.addEventListener('click', () => {
      openWalletModal();
    });
  }

  // Smooth scroll links
  ['nav-matrix-link', 'nav-pillars-link', 'nav-usecases-link', 'nav-arch-link'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (store.currentView !== 'landing') {
          store.setView('landing');
        }
      });
    }
  });
}
