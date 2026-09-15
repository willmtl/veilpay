/* VeilPay Main Application Coordinator (Persistent DOM, Zero-Flicker Architecture & Wallet Modal) */
import { store } from './state.js';
import { renderNavbar, attachNavbarListeners } from './components/navbar.js';
import { renderHero, attachHeroListeners } from './components/hero.js';
import { renderComparison } from './components/comparison.js';
import { renderPillars } from './components/pillars.js';
import { renderUseCases, attachUseCasesListeners } from './components/usecases.js';
import { renderArchitecture, attachArchitectureListeners } from './components/architecture.js';
import { renderDAppEmployer, attachDAppEmployerListeners } from './components/dAppEmployer.js';
import { renderDAppClaim, attachDAppClaimListeners } from './components/dAppClaim.js';
import { renderDAppAttest, attachDAppAttestListeners } from './components/dAppAttest.js';
import { renderDAppInspector, attachDAppInspectorListeners } from './components/dAppInspector.js';
import { renderWalletModal, attachWalletModalListeners } from './components/walletModal.js';
import { renderFooter } from './components/footer.js';
import { icons } from './icons.js';

let isMounted = false;

function mountApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const state = store;
  const isDapp = state.currentView === 'dapp';

  app.innerHTML = `
    <div id="navbar-mount">${renderNavbar()}</div>

    <!-- Main Persistent View: Landing Page -->
    <main id="view-landing" style="display: ${!isDapp ? 'block' : 'none'};">
      <div id="hero-mount">${renderHero()}</div>
      ${renderComparison()}
      ${renderPillars()}
      ${renderUseCases()}
      ${renderArchitecture()}
    </main>

    <!-- Main Persistent View: dApp Interactive Suite -->
    <main id="view-dapp-workspace" class="dapp-container" style="display: ${isDapp ? 'block' : 'none'};">
      <div class="container">
        <!-- Live Protocol Telemetry Banner (Apple Floating Capsule) -->
        <div class="dapp-telemetry-banner">
          <div class="telemetry-item">
            <span class="status-dot pulse"></span>
            <span class="telemetry-label">Network:</span>
            <span class="telemetry-value" id="telem-network">${state.wallet.network}</span>
          </div>

          <div class="telemetry-item">
            <span class="telemetry-label">Pay Period:</span>
            <span class="telemetry-value" id="telem-epoch">Month 1 (Epoch #${state.epoch})</span>
          </div>

          <div class="telemetry-item">
            <span class="telemetry-label">Company Vault:</span>
            <span class="telemetry-value accent" id="telem-vault-bal">${state.vaultBalance.toLocaleString()} tDUST</span>
          </div>

          <div class="telemetry-item">
            <span class="telemetry-label">Earned Interest:</span>
            <span class="telemetry-value" id="telem-yield-val">+${state.accruedYield.toFixed(2)} tDUST (${state.yieldApy}%)</span>
          </div>

          <div class="telemetry-item">
            <span class="telemetry-label">Active Team:</span>
            <span class="telemetry-value" id="telem-cohort-count">${state.cohort.length} Members</span>
          </div>
        </div>

        <!-- dApp Navigation Tabs (Apple Segmented Pill) -->
        <div class="dapp-nav-bar">
          <button class="dapp-nav-btn ${state.activeDappTab === 'employer' ? 'active' : ''}" id="tab-btn-employer">
            ${icons.building(16)}
            <span>1. Company Treasury</span>
          </button>

          <button class="dapp-nav-btn ${state.activeDappTab === 'claim' ? 'active' : ''}" id="tab-btn-claim">
            ${icons.split(16)}
            <span>2. Claim Paycheck</span>
          </button>

          <button class="dapp-nav-btn ${state.activeDappTab === 'attest' ? 'active' : ''}" id="tab-btn-attest">
            ${icons.badgeCheck(16)}
            <span>3. Income Verification</span>
          </button>

          <button class="dapp-nav-btn ${state.activeDappTab === 'inspector' ? 'active' : ''}" id="tab-btn-inspector">
            ${icons.network(16)}
            <span>4. Blockchain Ledger</span>
          </button>
        </div>

        <!-- Sub-Module Views Containers (Persistent, Never Destroyed) -->
        <div id="mount-module-employer">${renderDAppEmployer()}</div>
        <div id="mount-module-claim">${renderDAppClaim()}</div>
        <div id="mount-module-attest">${renderDAppAttest()}</div>
        <div id="mount-module-inspector">${renderDAppInspector()}</div>
      </div>
    </main>

    ${renderFooter()}

    <!-- Apple-Style Wallet Modal Mount -->
    <div id="wallet-modal-mount">${renderWalletModal()}</div>
  `;

  attachAllListeners();
  isMounted = true;
}

function attachAllListeners() {
  attachNavbarListeners();
  attachHeroListeners();
  attachUseCasesListeners();
  attachArchitectureListeners();
  attachDAppEmployerListeners();
  attachDAppClaimListeners();
  attachDAppAttestListeners();
  attachWalletModalListeners();
  attachDAppInspectorListeners();

  // dApp module tab switching (smooth class toggle, ZERO DOM demolition)
  const tabs = [
    { id: 'tab-btn-employer', name: 'employer', viewId: 'view-employer' },
    { id: 'tab-btn-claim', name: 'claim', viewId: 'view-claim' },
    { id: 'tab-btn-attest', name: 'attest', viewId: 'view-attest' },
    { id: 'tab-btn-inspector', name: 'inspector', viewId: 'view-inspector' }
  ];

  tabs.forEach(t => {
    const el = document.getElementById(t.id);
    if (el) {
      el.addEventListener('click', () => {
        store.setDappTab(t.name);
        switchDappTab(t.name);
      });
    }
  });
}

// Smoothly switch between Landing and dApp workspace without wiping the DOM
function switchView(viewName) {
  const landingEl = document.getElementById('view-landing');
  const dappEl = document.getElementById('view-dapp-workspace');
  const btnLanding = document.getElementById('toggle-landing-btn');
  const btnDapp = document.getElementById('toggle-dapp-btn');

  if (!landingEl || !dappEl) return;

  if (viewName === 'dapp') {
    landingEl.style.display = 'none';
    dappEl.style.display = 'block';
    if (btnLanding) btnLanding.classList.remove('active');
    if (btnDapp) btnDapp.classList.add('active');
  } else {
    landingEl.style.display = 'block';
    dappEl.style.display = 'none';
    if (btnLanding) btnLanding.classList.add('active');
    if (btnDapp) btnDapp.classList.remove('active');
  }
}

// Smoothly switch active dApp sub-module tab without wiping the DOM
function switchDappTab(tabName) {
  const views = ['employer', 'claim', 'attest', 'inspector'];
  views.forEach(v => {
    const viewEl = document.getElementById(`view-${v}`);
    const btnEl = document.getElementById(`tab-btn-${v}`);
    if (viewEl) {
      if (v === tabName) {
        viewEl.classList.add('active');
      } else {
        viewEl.classList.remove('active');
      }
    }
    if (btnEl) {
      if (v === tabName) {
        btnEl.classList.add('active');
      } else {
        btnEl.classList.remove('active');
      }
    }
  });
}

// Surgical yield ticker update: updates text nodes directly with ZERO DOM teardown or flicker!
store.onYieldTick((newYield, apy) => {
  const yieldCounter = document.getElementById('live-yield-counter');
  const telemYield = document.getElementById('telem-yield-val');

  if (yieldCounter) {
    yieldCounter.textContent = `+${newYield.toFixed(2)} tDUST`;
  }
  if (telemYield) {
    telemYield.textContent = `+${newYield.toFixed(2)} tDUST (${apy}%)`;
  }
});

// Surgical state change updates (for cohort additions, deposits, claims, wallet connects)
store.onStateChange((state) => {
  if (!isMounted) return;

  // Update telemetry values directly
  const telemVault = document.getElementById('telem-vault-bal');
  const telemCohort = document.getElementById('telem-cohort-count');
  const telemNetwork = document.getElementById('telem-network');
  const navWalletLabel = document.getElementById('nav-wallet-label');

  if (telemVault) telemVault.textContent = `${state.vaultBalance.toLocaleString()} tDUST`;
  if (telemCohort) telemCohort.textContent = `${state.cohort.length} Beneficiaries`;
  if (telemNetwork) telemNetwork.textContent = state.wallet.network;

  if (navWalletLabel) {
    const shortAddr = `${state.wallet.address.slice(0, 8)}...${state.wallet.address.slice(-4)}`;
    navWalletLabel.textContent = state.wallet.connected 
      ? `${shortAddr} (${state.wallet.balance.toLocaleString()} tDUST)` 
      : 'Connect Wallet';
  }

  // Update hero stats directly
  const metricVault = document.getElementById('metric-vault-total');
  const metricDisbursed = document.getElementById('metric-disbursed-total');
  const metricClaims = document.getElementById('metric-claims-count');

  if (metricVault) metricVault.textContent = `${state.vaultBalance.toLocaleString()} tDUST`;
  if (metricClaims) metricClaims.textContent = `${state.spentNullifiers.size} Claims`;

  if (metricDisbursed) {
    const totalDisbursed = state.txLog
      .filter(tx => tx.type === 'CLAIM_DISBURSEMENT_WITH_SPLIT')
      .reduce((sum, tx) => sum + (tx.amountDisbursed || 0), 0);
    metricDisbursed.textContent = `${totalDisbursed.toLocaleString()} tDUST`;
  }

  // Update view mode if changed
  switchView(state.currentView);
  switchDappTab(state.activeDappTab);

  // Surgically update module bodies
  const employerMount = document.getElementById('mount-module-employer');
  const claimMount = document.getElementById('mount-module-claim');
  const attestMount = document.getElementById('mount-module-attest');
  const inspectorMount = document.getElementById('mount-module-inspector');

  if (employerMount) {
    employerMount.innerHTML = renderDAppEmployer();
    attachDAppEmployerListeners();
  }
  if (claimMount) {
    claimMount.innerHTML = renderDAppClaim();
    attachDAppClaimListeners();
  }
  if (attestMount) {
    attestMount.innerHTML = renderDAppAttest();
    attachDAppAttestListeners();
  }
  if (inspectorMount) {
    inspectorMount.innerHTML = renderDAppInspector();
    attachDAppInspectorListeners();
  }
});

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  mountApp();
});
