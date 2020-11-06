import {CreditType} from './subject-credit';

export interface UserCredit {
  id?: string;
  subject: string;
  creditType: CreditType;
  creditCode: number;
  planDt?: Date;
  passDt?: Date;
  pass?: boolean;
  comment?: string;
}
