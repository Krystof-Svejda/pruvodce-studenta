import { Injectable } from '@angular/core';
import {FirestoreService} from './firestore.service';
import {CreditType, SubjectCredit} from '../models/subject-credit';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  classGrade: string[] = ['prima', 'sekunda', 'tercie', 'kvarta', 'kvinta', 'sexta', 'septima', 'oktáva'];

  constructor(private firestoreService: FirestoreService) { }

  initDB() {
    const subjectCredits: SubjectCredit[] = [];

    for (const subjectCredit of subjectCredits) {
      this.firestoreService.add<SubjectCredit>('years/2020/school-classes/Mí/subject-credits', subjectCredit);
    }
  }

  // Returns actual school year (year when current school year started)
  get currentSchoolYear(): number {
    const actualDate = new Date();
    let year: number = actualDate.getFullYear();

    return actualDate.getMonth() < 8 ? --year : year;
  }

  getCreditID(creditType: CreditType, creditCode: number): string {
    return creditType
      .concat(creditCode < 10 ? ' 0' : ' ')
      .concat(creditCode.toString());
  }

  // Returns class grade name (based on the school year - as an input)
  getClassName(year: number): string {
    const grade = this.currentSchoolYear - year;

    return ( 0 <= grade  && grade < this.classGrade.length ) ? this.classGrade[grade] : '';
  }
  // Returns lowest year for credits (lowest year can be year of oldest class)
  get minYear(): number {
    return this.currentSchoolYear - this.classGrade.length + 1;
  }

// Returns array of all valid school years
  yearOptions(includeNextYear: boolean = false): number[] {
    const result: number[] = [];

    for (let i = this.currentSchoolYear + (includeNextYear ? 1 : 0); i >= this.minYear; i--) {
      result.push(i);
    }

    return result;
  }
}
