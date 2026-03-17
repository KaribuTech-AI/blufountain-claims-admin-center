export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  tone: 'positive' | 'negative' | 'neutral';
  valueColor?: string;
}

export interface DashboardProgressMetric {
  label: string;
  value: string;
  width: string;
  color?: string;
}

export interface DashboardFooterStat {
  label: string;
  value: string;
}

export interface PriorityItem {
  title: string;
  detail: string;
  tone: 'high' | 'danger' | 'info' | 'success';
}

export interface DashboardData {
  stats: DashboardStat[];
  volumeMetrics: DashboardProgressMetric[];
  footerStats: DashboardFooterStat[];
  priorityItems: PriorityItem[];
}
