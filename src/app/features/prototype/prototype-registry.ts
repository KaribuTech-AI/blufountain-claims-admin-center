const SIDEBAR_SCREEN_ACTIONS: Record<string, string> = {
  showDashboard: 'dashboard-screen',
  showClaimsIntake: 'claims-intake-screen',
  showAllClaims: 'all-claims-screen',
  showPending: 'pending-screen',
  showApproved: 'approved-screen',
  showDenied: 'denied-screen',
  showPolicyholders: 'policyholders-screen',
  showDocuments: 'documents-screen',
  showPayments: 'payments-screen',
  showPaymentSettlement: 'payment-settlement-screen',
  showSettlements: 'settlements-screen',
  showLitigation: 'litigation-screen',
  showReserves: 'reserves-screen',
  showSubrogation: 'subrogation-screen',
  showFraud: 'fraud-screen',
  showComplaints: 'complaints-screen',
  showCommunication: 'communication-screen',
  showVendorManagement: 'vendor-management-screen',
  showThirdParty: 'third-party-screen',
  showAnalytics: 'analytics-screen',
  showOperationalPerformance: 'operational-performance-screen',
  showDecisionAdjudication: 'decision-adjudication-screen',
  showLitigationManagement: 'litigation-management-screen',
  showSalvageManagement: 'salvage-management-screen',
  showCatClaims: 'cat-claims-screen',
  showCustomerRetention: 'customer-retention-screen',
  showSubrogationManagement: 'subrogation-management-screen',
  showLifecycleClosure: 'claims-lifecycle-closure-screen',
  showPolicyCoverageIntegration: 'policy-coverage-integration-screen',
  showAutomationAI: 'automation-ai-screen',
  showFNOLChannels: 'fnol-channels-screen',
  showDocumentEvidence: 'document-evidence-screen',
  showAssessmentHub: 'assessment-investigation-hub-screen',
  showPolicyCoverage: 'policy-coverage-screen',
  showClaimTriage: 'claim-triage-screen',
  showInvestigation: 'investigation-screen',
  showConfiguration: 'configuration-screen',
  showTeamMembers: 'team-screen',
};

const DIRECT_SCREEN_ACTIONS: Record<string, string> = {
  ...SIDEBAR_SCREEN_ACTIONS,
  createNewClaim: 'new-claim-screen',
  backToDashboard: 'dashboard-screen',
  showFinancialManagement: 'financial-management-screen',
  showFraudRisk: 'fraud-risk-screen',
  showSustainabilityESG: 'sustainability-esg-screen',
  showCustomerAdvocacy: 'customer-advocacy-screen',
  showWorkforceManagement: 'workforce-management-screen',
  showContractManagement: 'contract-management-screen',
  showReinsuranceManagement: 'reinsurance-management-screen',
};

const MODAL_ACTIONS: Record<string, string> = {
  approveClaimFlow: 'approve-modal',
  denyClaimFlow: 'deny-modal',
  requestDocsFlow: 'request-docs-modal',
  exportReport: 'export-modal',
  showUserMenu: 'user-menu-modal',
  sortClaims: 'sort-modal',
  customizeColumns: 'columns-modal',
  reassignClaim: 'reassign-modal',
  addNote: 'note-modal',
  scheduleCall: 'schedule-modal',
  showNotifications: 'notifications-modal',
  uploadDocument: 'upload-doc-modal',
  uploadDoc: 'upload-doc-modal',
  assignAdjuster: 'assign-adjuster-modal',
};

const NOOP_ACTIONS = new Set([
  'submitApproval',
  'submitDenial',
  'submitDocRequest',
  'submitExport',
  'applySort',
  'applyColumns',
  'submitReassign',
  'submitNote',
  'submitSchedule',
  'submitDocUpload',
  'submitAdjusterAssignment',
  'filterAdjusters',
  'showPreviousStep',
  'showNextStep',
  'alert',
]);

const ANGULAR_SCREEN_IDS = new Set([
  'dashboard-screen',
  'all-claims-screen',
  'claim-detail-screen',
]);

function camelToKebab(value: string): string {
  return value
    .replace(/^show/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

export function resolvePrototypeAction(action: string): { type: 'screen' | 'modal' | 'feedback' | 'noop'; target?: string } {
  const screenMatch = action.match(/showScreen\('([^']+)'\)/);
  if (screenMatch) {
    return { type: 'screen', target: screenMatch[1] };
  }

  const modalCloseMatch = action.match(/closeModal\('([^']+)'\)/);
  if (modalCloseMatch) {
    return { type: 'noop' };
  }

  const claimMatch = action.match(/showClaimDetail\('([^']+)'\)/);
  if (claimMatch) {
    return { type: 'screen', target: 'claim-detail-screen' };
  }

  const filterMatch = action.match(/filterByType\('([^']+)'\)/);
  if (filterMatch) {
    return { type: 'screen', target: `${filterMatch[1]}-screen` };
  }

  const nameMatch = action.match(/^([a-zA-Z0-9_]+)\(/);
  const actionName = nameMatch?.[1] ?? '';

  if (MODAL_ACTIONS[actionName]) {
    return { type: 'modal', target: MODAL_ACTIONS[actionName] };
  }

  if (DIRECT_SCREEN_ACTIONS[actionName]) {
    return { type: 'screen', target: DIRECT_SCREEN_ACTIONS[actionName] };
  }

  if (NOOP_ACTIONS.has(actionName)) {
    return { type: 'feedback', target: actionName };
  }

  if (actionName.startsWith('show')) {
    return { type: 'screen', target: `${camelToKebab(actionName)}-screen` };
  }

  return { type: 'noop' };
}

export function isAngularScreen(screenId: string): boolean {
  return ANGULAR_SCREEN_IDS.has(screenId);
}
