export interface SubjectStat {
  subjectName: string;
  submittedCount: number;
  ratio: number;
}

export interface LmsDashboardData {
  className: string;
  curSeq: number;
  curName: string;
  term: number;
  period: string;
  totalEnrolled: number;
  activeAccounts: number;
  dropoutCount: number;
  totalAvgRatio: number;
  earlyoutCount: number;
  graduatedCount: number;
  subjects: SubjectStat[];
}