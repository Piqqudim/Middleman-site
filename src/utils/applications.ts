export type ApplicationStatus =
  | 'Submitted'
  | 'Document Verification'
  | 'Inspection Scheduled'
  | 'Underwriting & Legal'
  | 'Approved & Closing'
  | 'Withdrawn';

export type ApplicationType =
  | 'Purchase Financing'
  | 'Outright Acquisition'
  | 'Shortlet Corporate Lease'
  | 'Investment Allocation';

export const APPLICATION_STAGES: Exclude<ApplicationStatus, 'Withdrawn'>[] = [
  'Submitted',
  'Document Verification',
  'Inspection Scheduled',
  'Underwriting & Legal',
  'Approved & Closing',
];

export function getStageIndex(status: ApplicationStatus): number {
  if (status === 'Withdrawn') return -1;
  return APPLICATION_STAGES.indexOf(status);
}

export function canAdvanceStage(status: ApplicationStatus): boolean {
  const idx = getStageIndex(status);
  return idx >= 0 && idx < APPLICATION_STAGES.length - 1;
}

export function getNextApplicationStage(status: ApplicationStatus): ApplicationStatus | null {
  const idx = getStageIndex(status);
  if (idx < 0 || idx >= APPLICATION_STAGES.length - 1) return null;
  return APPLICATION_STAGES[idx + 1];
}

export function isTerminalStatus(status: ApplicationStatus): boolean {
  return status === 'Approved & Closing' || status === 'Withdrawn';
}
