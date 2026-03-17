export interface ClaimListItem {
  claimId: string;
  initials: string;
  avatarBackground: string;
  avatarColor: string;
  policyholder: string;
  policyNumber: string;
  type: string;
  amount: string;
  filedDate: string;
  elapsed: string;
  assigneeInitials: string;
  assigneeBackground: string;
  assigneeColor: string;
  assigneeName: string;
  status: string;
  statusClass: string;
  priority: string;
  priorityClass: string;
  actionLabel: string;
}

export interface ClaimsOverview {
  totalClaims: string;
  thisMonth: string;
  thisWeek: string;
  today: string;
}

export interface ClaimTimelineItem {
  date: string;
  description: string;
  user?: string;
}

export interface ClaimDetail {
  claimId: string;
  policyholder: string;
  policyNumber: string;
  insuranceType: string;
  claimAmount: string;
  dateFiled: string;
  status: string;
  statusClass: string;
  priority: string;
  priorityClass: string;
  assigneeName: string;
  description: string;
  documents: string[];
  timeline: ClaimTimelineItem[];
}
