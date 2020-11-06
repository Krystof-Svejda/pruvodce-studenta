export interface SubjectCredit {
  id?: string;
  subject: string;
  creditType: CreditType;
  creditCode: number;
  description?: string;
  required: boolean;
}

export enum CreditType {
  A = 'A',
  B = 'B',
  C = 'C',
  K = 'K'
}
