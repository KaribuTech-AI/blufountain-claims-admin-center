export interface SidebarItem {
  label: string;
  icon: string;
  screenId?: string;
  action?: string;
  badge?: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface QuickAction {
  label: string;
  description: string;
  action: string;
}

export interface QuickActionGroup {
  title: string;
  actions: QuickAction[];
}

export const sidebarSections: SidebarSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', icon: 'dashboard', screenId: 'dashboard-screen', badge: '186' },
      { label: 'Claims Intake & FNOL', icon: 'inbox', screenId: 'claims-intake-screen' },
      { label: 'All Claims', icon: 'clipboard', screenId: 'all-claims-screen' },
      { label: 'Pending Review', icon: 'hourglass', screenId: 'pending-screen' },
      { label: 'Approved', icon: 'check-circle', screenId: 'approved-screen' },
      { label: 'Denied', icon: 'x-circle', screenId: 'denied-screen' },
    ],
  },
  {
    title: 'Insurance Types',
    items: [
      { label: 'Life Insurance', icon: 'heart', screenId: 'life-screen' },
      { label: 'Short-Term Disability', icon: 'shield', screenId: 'short-term-screen' },
      { label: 'Long-Term Disability', icon: 'shield', screenId: 'long-term-screen' },
      { label: 'Accident Insurance', icon: 'alert', screenId: 'accident-screen' },
      { label: 'Critical Illness', icon: 'heart', screenId: 'critical-screen' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Policyholders', icon: 'users', screenId: 'policyholders-screen' },
      { label: 'Documents', icon: 'file', screenId: 'documents-screen' },
      { label: 'Payment & Settlement Mgmt', icon: 'wallet', screenId: 'payment-settlement-screen' },
      { label: 'Payments', icon: 'coins', screenId: 'payments-screen' },
      { label: 'Settlements', icon: 'handshake', screenId: 'settlements-screen' },
      { label: 'Litigation', icon: 'scale', screenId: 'litigation-screen' },
      { label: 'Reserve Management', icon: 'wallet', screenId: 'reserves-screen' },
      { label: 'Subrogation & Recovery', icon: 'refresh', screenId: 'subrogation-screen' },
      { label: 'Fraud Detection', icon: 'search', screenId: 'fraud-screen' },
      { label: 'Complaints & Disputes', icon: 'message', screenId: 'complaints-screen' },
      { label: 'Communication Hub', icon: 'message', screenId: 'communication-screen' },
      { label: 'Vendor Management', icon: 'handshake', screenId: 'vendor-management-screen' },
      { label: 'Third-Party Dashboard', icon: 'bar-chart', screenId: 'third-party-screen' },
    ],
  },
  {
    title: 'Analytics & Reports',
    items: [
      { label: 'Analytics', icon: 'bar-chart', screenId: 'analytics-screen' },
      { label: 'Operational Performance', icon: 'bar-chart', screenId: 'operational-performance-screen' },
      { label: 'Decision & Adjudication', icon: 'scale', screenId: 'decision-adjudication-screen' },
      { label: 'Litigation Management', icon: 'scale', screenId: 'litigation-management-screen' },
      { label: 'Salvage Management', icon: 'car', screenId: 'salvage-management-screen' },
      { label: 'Catastrophe (CAT) Claims', icon: 'alert', screenId: 'cat-claims-screen' },
      { label: 'Customer Retention & Loyalty', icon: 'heart', screenId: 'customer-retention-screen' },
      { label: 'Subrogation Management', icon: 'refresh', screenId: 'subrogation-management-screen' },
      { label: 'Lifecycle & Closure', icon: 'check-circle', screenId: 'claims-lifecycle-closure-screen' },
      { label: 'Policy & Coverage Integration', icon: 'shield', screenId: 'policy-coverage-integration-screen' },
      { label: 'Automation & AI', icon: 'sparkles', screenId: 'automation-ai-screen' },
      { label: 'FNOL Channels', icon: 'mobile', screenId: 'fnol-channels-screen' },
      { label: 'Document & Evidence', icon: 'file', screenId: 'document-evidence-screen' },
      { label: 'Assessment & Investigation', icon: 'microscope', screenId: 'assessment-investigation-hub-screen' },
      { label: 'Policy Coverage', icon: 'shield', screenId: 'policy-coverage-screen' },
      { label: 'Claim Triage', icon: 'target', screenId: 'claim-triage-screen' },
      { label: 'Investigation', icon: 'search', screenId: 'investigation-screen' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Configuration', icon: 'settings', screenId: 'configuration-screen' },
      { label: 'Notifications', icon: 'bell', action: 'showNotifications()' },
      { label: 'Team Members', icon: 'team', screenId: 'team-screen' },
    ],
  },
];

export const dashboardQuickActionGroups: QuickActionGroup[] = [
  {
    title: 'Risk & Finance',
    actions: [
      { label: 'Financial Mgmt', description: 'Payouts and reconciliation', action: 'showFinancialManagement()' },
      { label: 'Fraud Risk', description: 'Alerts and scoring', action: 'showFraudRisk()' },
      { label: 'Settlements Hub', description: 'Negotiation and payments', action: "showScreen('settlements-hub-screen')" },
      { label: 'Recovery Hub', description: 'Subrogation workflows', action: "showScreen('subrogation-recovery-hub-screen')" },
    ],
  },
  {
    title: 'Operations & Intelligence',
    actions: [
      { label: 'Assessment', description: 'Investigation and evidence', action: "showScreen('assessment-investigation-hub-screen')" },
      { label: 'Analytics Hub', description: 'Reporting and trends', action: "showScreen('analytics-intelligence-hub-screen')" },
      { label: 'Workforce', description: 'Scheduling and capacity', action: 'showWorkforceManagement()' },
      { label: 'Contracts', description: 'Vendor and agreement ops', action: 'showContractManagement()' },
    ],
  },
];
