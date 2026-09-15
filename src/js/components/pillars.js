/* The 5 Core Pillars Component */
import { icons } from '../icons.js';

export function renderPillars() {
  const pillars = [
    {
      num: '01',
      icon: icons.shield(22),
      title: 'Confidential Disbursals',
      description: 'Employers deposit aggregate payroll into a public vault and publish a Poseidon Merkle commitment root. Beneficiaries claim allocations using zero-knowledge witness proofs. Observers see batch totals but cannot uncover who received what.',
      tag: 'Compact Circuit 1'
    },
    {
      num: '02',
      icon: icons.split(22),
      title: 'Stealth Multi-Split Payouts',
      description: 'Upon claiming, beneficiaries configure a private allocation recipe (e.g. 50% Checking, 35% Cold Storage Vault, 15% Tax Reserve). VeilPay executes these transfers atomically into fresh, unlinked stealth addresses in a single transaction, defeating on-chain wallet clustering.',
      tag: 'Compact Circuit 2'
    },
    {
      num: '03',
      icon: icons.chartGrowth(22),
      title: 'Confidential Idle Treasury Yield',
      description: 'While payroll or research grants remain locked awaiting claim, the idle capital earns liquid staking yield on Midnight and Cardano. Accrued yield either offsets employer overhead or is automatically routed as a confidential yield bonus to workers upon claiming.',
      tag: 'Compact Circuit 3'
    },
    {
      num: '04',
      icon: icons.badgeCheck(22),
      title: 'Selective ZK Attestations',
      description: 'Workers and contractors can cryptographically prove facts such as "Annual income is >= $75,000" or "Active employment verified for 6 months" to landlords, mortgage lenders, and auditors via a verifiable QR token without exposing their employer or actual balance.',
      tag: 'Compact Circuit 4'
    },
    {
      num: '05',
      icon: icons.network(22),
      title: 'Clean-Provenance Anti-Mixer',
      description: 'Unlike illegal mixing pools that wash contaminated hacker funds, VeilPay pools are funded exclusively by authorized corporate controllers, foundations, or verified sponsors. Beneficiaries receive clean, provenance-verifiable funds, and accounting teams receive audit-ready ZK receipts.',
      tag: 'Institutional Ready'
    },
    {
      num: '06',
      icon: icons.terminal(22),
      title: 'Midnight Dual-Ledger Native',
      description: 'Architected specifically for Midnight’s dual-ledger state model. Public Consensus ledger guarantees solvency and double-spend immunity via nullifier sets, while the Client-Side Witness ledger guarantees total user privacy.',
      tag: 'Compact & ZK-SNARKs'
    }
  ];

  return `
    <section class="section-wrapper" id="pillars">
      <div class="container">
        <div class="section-header text-center">
          <h2>Six Pillars of Confidential Finance</h2>
          <p class="text-lead" style="max-width: 680px; margin: 0.5rem auto 0 auto;">
            Engineered from first principles on Midnight to deliver true enterprise privacy and verifiable compliance.
          </p>
        </div>

        <div class="pillars-grid">
          ${pillars.map(p => `
            <div class="card pillar-card">
              <div class="card-top">
                <div class="pillar-icon-box">
                  ${p.icon}
                </div>
                <span class="pillar-number">${p.num}</span>
              </div>
              <h3>${p.title}</h3>
              <p>${p.description}</p>
              <div class="pillar-tech-tag">
                ${icons.database(14)}
                <span>${p.tag}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
