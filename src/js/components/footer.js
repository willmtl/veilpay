/* Minimalist Light Footer Component */
import { icons } from '../icons.js';

export function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="brand-logo" style="margin-bottom: 0.75rem;">
              <div class="brand-icon">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="6" fill="#111111"/>
                  <path d="M7 9L16 23L25 9" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="16" cy="11" r="2.5" fill="#ffffff"/>
                </svg>
              </div>
              <span>VeilPay</span>
            </div>
            <p>
              The confidential capital allocation and verifiable selective disclosure protocol built natively on the Midnight Network.
            </p>
          </div>

          <div class="footer-col">
            <h5>Protocol</h5>
            <div class="footer-links">
              <a href="#product" class="footer-link">Confidential Disbursals</a>
              <a href="#matrix" class="footer-link">Privacy Architecture</a>
              <a href="#pillars" class="footer-link">Stealth Multi-Splits</a>
              <a href="#pillars" class="footer-link">Shadow Treasury Yield</a>
              <a href="#pillars" class="footer-link">Selective Attestation</a>
            </div>
          </div>

          <div class="footer-col">
            <h5>Technology</h5>
            <div class="footer-links">
              <a href="#architecture" class="footer-link">Compact Smart Contracts</a>
              <a href="#architecture" class="footer-link">Dual-Ledger Partitioning</a>
              <a href="#architecture" class="footer-link">Poseidon Merkle Trees</a>
              <a href="#architecture" class="footer-link">Nullifier Sets</a>
              <a href="#architecture" class="footer-link">Lace Wallet Integration</a>
            </div>
          </div>

          <div class="footer-col">
            <h5>Resources</h5>
            <div class="footer-links">
              <a href="https://docs.midnight.network" target="_blank" rel="noopener noreferrer" class="footer-link" style="display: flex; align-items: center; gap: 0.35rem;">
                <span>Midnight Documentation</span>
                ${icons.external(12)}
              </a>
              <a href="https://midnight.network" target="_blank" rel="noopener noreferrer" class="footer-link" style="display: flex; align-items: center; gap: 0.35rem;">
                <span>Midnight Network</span>
                ${icons.external(12)}
              </a>
              <a href="#matrix" class="footer-link">Anti-Mixer Compliance</a>
              <a href="#architecture" class="footer-link">Security Audits</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>&copy; 2026 VeilPay Protocol. Built for the Midnight Wave 1 Buildathon.</div>
        </div>
      </div>
    </footer>
  `;
}
