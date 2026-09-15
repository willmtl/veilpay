/* Trilemma Comparison Matrix: Transparent Chains vs Mixers vs VeilPay */
import { icons } from '../icons.js';

export function renderComparison() {
  return `
    <section class="section-wrapper" id="matrix">
      <div class="container">
        <div class="section-header text-center">
          <h2>The Privacy Architecture Trilemma</h2>
          <p class="text-lead" style="max-width: 680px; margin: 0.5rem auto 0 auto;">
            Why existing Web3 infrastructures fail enterprise accounting and how VeilPay's dual-ledger solves it without illicit mixer contamination.
          </p>
        </div>

        <div class="matrix-table-wrap">
          <table class="matrix-table">
            <thead>
              <tr>
                <th style="width: 28%;">Protocol Capability</th>
                <th style="width: 24%;">Transparent Chains (Ethereum / Solana)</th>
                <th style="width: 24%;">Opaque Mixers (Tornado / Monero)</th>
                <th class="highlight-col" style="width: 24%;">VeilPay on Midnight</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="feature-name">Disbursal Confidentiality</td>
                <td>
                  <span class="status-badge-matrix fail">
                    ${icons.xMark(12)} Zero (Public)
                  </span>
                </td>
                <td>
                  <span class="status-badge-matrix pass">
                    ${icons.check(12)} Full Privacy
                  </span>
                </td>
                <td class="highlight-col">
                  <span class="status-badge-matrix pass">
                    ${icons.check(12)} Merkle Zero-Knowledge
                  </span>
                </td>
              </tr>

              <tr>
                <td class="feature-name">Wallet Anti-Clustering (Stealth Multi-Splits)</td>
                <td>
                  <span class="status-badge-matrix fail">
                    ${icons.xMark(12)} Clustered by Arkham
                  </span>
                </td>
                <td>
                  <span class="status-badge-matrix fail">
                    ${icons.xMark(12)} Manual & Tainted
                  </span>
                </td>
                <td class="highlight-col">
                  <span class="status-badge-matrix pass">
                    ${icons.check(12)} Native Atomic Splits
                  </span>
                </td>
              </tr>

              <tr>
                <td class="feature-name">Clean Corporate Provenance (Anti-Mixer)</td>
                <td>
                  <span class="status-badge-matrix pass">
                    ${icons.check(12)} Verifiable Source
                  </span>
                </td>
                <td>
                  <span class="status-badge-matrix fail">
                    ${icons.xMark(12)} OFAC Sanctioned
                  </span>
                </td>
                <td class="highlight-col">
                  <span class="status-badge-matrix pass">
                    ${icons.check(12)} Authorized Cohorts
                  </span>
                </td>
              </tr>

              <tr>
                <td class="feature-name">Selective Proof for Landlords & Lenders</td>
                <td>
                  <span class="status-badge-matrix fail">
                    ${icons.xMark(12)} Doxx Entire History
                  </span>
                </td>
                <td>
                  <span class="status-badge-matrix fail">
                    ${icons.xMark(12)} Impossible (Black Box)
                  </span>
                </td>
                <td class="highlight-col">
                  <span class="status-badge-matrix pass">
                    ${icons.check(12)} ZK Fact Attestation
                  </span>
                </td>
              </tr>

              <tr>
                <td class="feature-name">Idle Treasury Yield Optimization</td>
                <td>
                  <span class="status-badge-matrix fail">
                    ${icons.xMark(12)} 0% Locked Yield
                  </span>
                </td>
                <td>
                  <span class="status-badge-matrix fail">
                    ${icons.xMark(12)} None
                  </span>
                </td>
                <td class="highlight-col">
                  <span class="status-badge-matrix pass">
                    ${icons.check(12)} +4.85% Staking APY
                  </span>
                </td>
              </tr>

              <tr>
                <td class="feature-name">Double-Claim Protection</td>
                <td>
                  <span class="status-badge-matrix pass">
                    ${icons.check(12)} Nonce Based
                  </span>
                </td>
                <td>
                  <span class="status-badge-matrix pass">
                    ${icons.check(12)} Nullifier Set
                  </span>
                </td>
                <td class="highlight-col">
                  <span class="status-badge-matrix pass">
                    ${icons.check(12)} Poseidon Nullifiers
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}
