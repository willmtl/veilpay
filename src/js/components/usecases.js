/* Interactive Multi-Vertical Use Cases Component */
import { icons } from '../icons.js';
import { store } from '../state.js';

let activeUseCaseIndex = 0;

const USE_CASES = [
  {
    id: 'payroll',
    title: 'Enterprise & Web3 Payroll',
    badge: 'Enterprise Corporate',
    icon: icons.building(20),
    heading: 'Confidential Compensation for Modern Global Teams',
    description: 'When companies pay top engineers and executives on transparent blockchains, competitors monitor wallets to systematically poach key talent with targeted 20%–30% raises. Colleagues compare salaries, breeding resentment. VeilPay conceals every individual allocation within a cryptographic Merkle root.',
    meta: [
      { label: 'Funder Action', value: 'HR controller registers monthly Poseidon commitment root and funds aggregate vault.' },
      { label: 'Beneficiary Experience', value: 'Employee claims privately and splits paycheck directly into cold vault and checking.' },
      { label: 'Privacy Guarantee', value: 'Coworkers, competitors, and chain analytics see only aggregate batch size.' },
      { label: 'Real-World Proof', value: 'Worker generates ZK credential for landlord showing income >= $80k.' }
    ]
  },
  {
    id: 'grants',
    title: 'Milestone Research Grants',
    badge: 'DAOs & Foundations',
    icon: icons.badgeCheck(20),
    heading: 'Protecting Principal Investigators & Sensitive Scientific Innovation',
    description: 'Foundations and DAOs disbursing grants in sensitive fields (biotechnology, privacy cryptography, decentralized AI) expose researchers to physical intimidation and regulatory targeting. VeilPay allows milestone tranches to be unlocked by cryptographic proofs directly to stealth recipient addresses.',
    meta: [
      { label: 'Funder Action', value: 'DAO treasury deposits tranche commitments locked against milestone verification.' },
      { label: 'Beneficiary Experience', value: 'Researcher submits zero-knowledge milestone witness to claim tranche.' },
      { label: 'Privacy Guarantee', value: 'Identity and physical location of researcher are never linked to funding tx.' },
      { label: 'Real-World Proof', value: 'DAO proves milestone completion to token holders without revealing private deliverables.' }
    ]
  },
  {
    id: 'crowdfunding',
    title: 'Humanitarian & Whistleblower Crowdfunding',
    badge: 'Public Causes',
    icon: icons.shield(20),
    heading: 'Decentralized Funding Without Debanking or Coercion',
    description: 'Donors to sensitive humanitarian efforts, human rights legal defense funds, or whistleblower platforms frequently face political retaliation and banking freezes. VeilPay creates verified fundraising vaults where the public can verify total funding progress, while individual donors remain protected.',
    meta: [
      { label: 'Funder Action', value: 'Public donors deposit anonymously into verified campaign commitment pools.' },
      { label: 'Beneficiary Experience', value: 'Organizers disburse to local aid workers across unlinked stealth wallets.' },
      { label: 'Privacy Guarantee', value: 'Zero donor wallet addresses or IP addresses are linked to the campaign on-chain.' },
      { label: 'Real-World Proof', value: 'Campaign verifies total funding target reached with cryptographic solvence proof.' }
    ]
  },
  {
    id: 'contractors',
    title: 'Cross-Border Contractor Settlements',
    badge: 'Freelance Economy',
    icon: icons.user(20),
    heading: 'High-Value Contractor Payments Free from $5 Wrench Risks',
    description: 'Contractors operating in countries with volatile currencies or high street crime risk extortion if their liquid Web3 wealth is public on block explorers. VeilPay allows contractors to receive payments into shielded accounts and split funds into local operational and secure savings accounts atomically.',
    meta: [
      { label: 'Funder Action', value: 'Agency or client approves milestone invoice and issues private voucher commitment.' },
      { label: 'Beneficiary Experience', value: 'Contractor redeems voucher with secret key and distributes directly to multiple accounts.' },
      { label: 'Privacy Guarantee', value: 'Local observers cannot track net worth or payment frequency.' },
      { label: 'Real-World Proof', value: 'Contractor provides clean-provenance ZK tax receipt to domestic tax authorities.' }
    ]
  }
];

export function renderUseCases() {
  const current = USE_CASES[activeUseCaseIndex];

  return `
    <section class="section-wrapper" id="usecases">
      <div class="container">
        <div class="section-header text-center">
          <h2>Designed for Every Confidential Workflow</h2>
          <p class="text-lead" style="max-width: 680px; margin: 0.5rem auto 0 auto;">
            From Fortune 500 payroll to high-risk academic research grants, VeilPay's dual-ledger handles diverse institutional needs.
          </p>
        </div>

        <div class="usecases-container">
          <!-- Navigation Sidebar -->
          <div class="usecase-nav-list">
            ${USE_CASES.map((u, idx) => `
              <button class="usecase-nav-item ${idx === activeUseCaseIndex ? 'active' : ''}" data-usecase-idx="${idx}">
                <span>${u.title}</span>
                ${icons.arrowRight(14)}
              </button>
            `).join('')}
          </div>

          <!-- Active Detail Card -->
          <div class="usecase-detail-card">
            <div class="usecase-header-row">
              <div>
                <span class="tag-badge" style="margin-bottom: 0.75rem;">${current.badge}</span>
                <h3>${current.heading}</h3>
              </div>
              <div class="pillar-icon-box">
                ${current.icon}
              </div>
            </div>

            <p class="text-lead" style="margin-bottom: 1.5rem;">
              ${current.description}
            </p>

            <div class="usecase-meta-grid">
              ${current.meta.map(m => `
                <div class="usecase-meta-block">
                  <h5>${m.label}</h5>
                  <p>${m.value}</p>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; gap: 1rem; align-items: center;">
              <button class="btn btn-primary btn-sm" id="usecase-try-dapp-btn">
                ${icons.terminal(14)}
                <span>Simulate in dApp Console</span>
              </button>
              <span class="text-xs text-mono text-tertiary">Production-Ready Circuit Logic</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function attachUseCasesListeners() {
  document.querySelectorAll('[data-usecase-idx]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeUseCaseIndex = parseInt(btn.getAttribute('data-usecase-idx'), 10);
      reRenderUseCases();
    });
  });

  const tryDappBtn = document.getElementById('usecase-try-dapp-btn');
  if (tryDappBtn) {
    tryDappBtn.addEventListener('click', () => {
      const targetTab = activeUseCaseIndex === 0 ? 'employer' : 'claim';
      store.setDappTab(targetTab);
      store.setView('dapp');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function reRenderUseCases() {
  const container = document.querySelector('#usecases');
  if (container) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderUseCases();
    const newSection = tempDiv.querySelector('#usecases');
    container.replaceWith(newSection);
    attachUseCasesListeners();
  }
}
