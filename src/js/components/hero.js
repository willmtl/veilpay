/* Hero Component with Fluid Apple Animations, Radar Scanning Beam & Real Devnet Metrics */
import { icons } from '../icons.js';
import { store } from '../state.js';

let activeRadarTab = 'veilpay'; // 'veilpay' or 'transparent'

export function renderHero() {
  const state = store;
  const isVeilPay = activeRadarTab === 'veilpay';

  // Compute real metrics from persistent ledger state
  const totalClaims = state.spentNullifiers.size;
  const totalDisbursed = state.txLog
    .filter(tx => tx.type === 'CLAIM_DISBURSEMENT_WITH_SPLIT')
    .reduce((sum, tx) => sum + (tx.amountDisbursed || 0), 0);

  return `
    <section class="hero-section" id="product" style="position: relative; overflow: hidden;">
      <!-- Ambient Floating Lighting Orbs -->
      <div class="ambient-orb orb-left"></div>
      <div class="ambient-orb orb-right"></div>
      <div class="grid-backdrop"></div>
      <div class="radial-fade"></div>

      <div class="container hero-content">
        <h1 class="hero-title animate-hero-title">
          Confidential Capital Allocation & Verifiable Selective Disclosure
        </h1>

        <p class="hero-subtitle animate-hero-subtitle">
          The privacy-first financial operating system for enterprise payroll, milestone research grants, and clean-provenance crowdfunding. Zero public doxxing, automated stealth multi-splits, and verifiable zero-knowledge attestations.
        </p>

        <div class="hero-cta-group animate-hero-cta">
          <button class="btn btn-primary btn-lg" id="hero-launch-dapp-btn">
            ${icons.terminal(18)}
            <span>Launch dApp Demo</span>
          </button>
          <a href="#matrix" class="btn btn-secondary btn-lg">
            ${icons.shield(18)}
            <span>Compare Privacy Models</span>
          </a>
        </div>
      </div>

      <!-- Interactive Privacy Radar (Apple Squircle Box with Animated Scanning Beam) -->
      <div class="container animate-hero-card">
        <div class="hero-radar-card card-sheen">
          <!-- Animated Radar Scanning Beam -->
          <div class="radar-scan-line"></div>

          <div class="radar-header">
            <div class="radar-tabs">
              <button class="radar-tab-btn ${isVeilPay ? 'active' : ''}" id="radar-tab-veilpay">
                VeilPay on Midnight (Zero-Knowledge)
              </button>
              <button class="radar-tab-btn ${!isVeilPay ? 'active' : ''}" id="radar-tab-transparent">
                Public Chains (Transparent Ledger)
              </button>
            </div>
            <div class="tag-badge" style="font-size: 0.7rem;">
              <span>On-Chain Observer Telemetry</span>
            </div>
          </div>

          <div class="radar-viewport">
            <!-- Left Pane: Public Consensus Ledger -->
            <div class="radar-pane">
              <div class="radar-pane-header">
                <span class="radar-pane-title">
                  ${icons.database(16)}
                  <span>Consensus State (Public)</span>
                </span>
                <span class="radar-pane-badge">Block #${state.blockHeight || 184930}</span>
              </div>

              ${isVeilPay ? `
                <div class="radar-mock-row">
                  <span class="text-tertiary">Disbursement Root:</span>
                  <span class="shield-indicator highlight">${state.merkleRoot.slice(0, 18)}...</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Beneficiary Identity:</span>
                  <span class="shield-indicator">[CONFIDENTIAL WITNESS]</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Individual Allocation:</span>
                  <span class="shield-indicator">[CONFIDENTIAL WITNESS]</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Nullifier Registry:</span>
                  <span class="shield-indicator highlight">${state.spentNullifiers.size} Consumed (Unique)</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Destination Wallets:</span>
                  <span class="shield-indicator">3 Unlinked Stealth Addresses</span>
                </div>
              ` : `
                <div class="radar-mock-row">
                  <span class="text-tertiary">Disbursement Type:</span>
                  <span class="leak-indicator">Direct Public Transfer</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Beneficiary Address:</span>
                  <span class="leak-indicator">0xAlice...104b (Doxxed on ENS)</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Individual Salary:</span>
                  <span class="leak-indicator">$9,500.00 USDC / month</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Employer Treasury:</span>
                  <span class="leak-indicator">0xAcmeCorpTreasury.eth</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Wallet Clustering:</span>
                  <span class="leak-indicator">All 3 Wallets Linked by Arkham</span>
                </div>
              `}
            </div>

            <!-- Right Pane: Analysis & Implications -->
            <div class="radar-pane">
              <div class="radar-pane-header">
                <span class="radar-pane-title">
                  ${icons.shield(16)}
                  <span>Analytics & Security Impact</span>
                </span>
                <span class="tag-badge ${isVeilPay ? 'white' : ''}">
                  ${isVeilPay ? 'Immune to Clustering' : 'Critical Data Leak'}
                </span>
              </div>

              ${isVeilPay ? `
                <div class="radar-mock-row">
                  <span class="text-tertiary">Competitor Poaching:</span>
                  <span class="highlight-white">Prevented (Salaries hidden)</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Physical Extortion ($5 Wrench):</span>
                  <span class="highlight-white">Mitigated (Net worth private)</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Landlord / Mortgage Verification:</span>
                  <span class="highlight-white">Supported (ZK QR Attestation)</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Idle Capital Yield:</span>
                  <span class="highlight-white">+${state.yieldApy}% APY Staking Yield</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Regulatory Status:</span>
                  <span class="highlight-white">Clean Provenance (Anti-Mixer)</span>
                </div>
              ` : `
                <div class="radar-mock-row">
                  <span class="text-tertiary">Competitor Poaching:</span>
                  <span class="leak-indicator">High Risk (Competitors view pay)</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Physical Extortion ($5 Wrench):</span>
                  <span class="leak-indicator">High Risk (Wallet balance public)</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Landlord / Mortgage Verification:</span>
                  <span class="leak-indicator">Requires doxxing full tx history</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Idle Capital Yield:</span>
                  <span class="leak-indicator">0% (Funds sit dormant in multisig)</span>
                </div>
                <div class="radar-mock-row">
                  <span class="text-tertiary">Regulatory Status:</span>
                  <span class="leak-indicator">Public but un-attested</span>
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Real Dynamic Protocol Metrics Strip (Computed directly from Persistent Ledger DB) -->
        <div class="metrics-strip">
          <div class="metric-item">
            <div class="metric-number metric-number-anim" id="metric-vault-total">${state.vaultBalance.toLocaleString()} tDUST</div>
            <div class="metric-label">Live Vault Liquidity Solvency</div>
          </div>
          <div class="metric-item">
            <div class="metric-number metric-number-anim" id="metric-disbursed-total">${totalDisbursed.toLocaleString()} tDUST</div>
            <div class="metric-label">Stealth Multi-Split Volume</div>
          </div>
          <div class="metric-item">
            <div class="metric-number metric-number-anim" id="metric-claims-count">${totalClaims} Claims</div>
            <div class="metric-label">Consumed Zero-Knowledge Nullifiers</div>
          </div>
          <div class="metric-item">
            <div class="metric-number metric-number-anim">${state.yieldApy}% APY</div>
            <div class="metric-label">Cardano / Midnight Staking Yield</div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 1.25rem;">
          <span class="text-xs text-mono text-tertiary">
            Real Live On-Chain Devnet Metrics &bull; Synchronized via Server-Sent Events
          </span>
        </div>
      </div>
    </section>
  `;
}

export function attachHeroListeners() {
  const launchBtn = document.getElementById('hero-launch-dapp-btn');
  const tabVeil = document.getElementById('radar-tab-veilpay');
  const tabTrans = document.getElementById('radar-tab-transparent');

  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      store.setView('dapp');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (tabVeil) {
    tabVeil.addEventListener('click', () => {
      activeRadarTab = 'veilpay';
      reRenderRadar();
    });
  }

  if (tabTrans) {
    tabTrans.addEventListener('click', () => {
      activeRadarTab = 'transparent';
      reRenderRadar();
    });
  }
}

function reRenderRadar() {
  const radarContainer = document.querySelector('.hero-radar-card');
  if (radarContainer) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderHero();
    const newRadar = tempDiv.querySelector('.hero-radar-card');
    radarContainer.replaceWith(newRadar);
    attachHeroListeners();
  }
}
