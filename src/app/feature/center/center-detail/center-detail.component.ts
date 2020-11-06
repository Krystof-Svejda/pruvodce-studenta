import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '../../../core/services/firestore.service';
import {SchoolService} from '../../../core/services/school.service';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {Subject, zip} from 'rxjs';
import {SubjectPeriods} from '../../../core/models/subject-periods';
import {takeUntil} from 'rxjs/operators';
import {SubjectCredit} from '../../../core/models/subject-credit';
import {UserCredit} from '../../../core/models/user-credit';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatOptionSelectionChange} from '@angular/material/core';

interface CreditRecord {
  subject: string;
  code: string;
  changed: number;
  subjectCredit: SubjectCredit;
  studentCredit?: UserCredit;
}

@Component({
  selector: 'app-center-detail',
  templateUrl: './center-detail.component.html',
  styleUrls: ['./center-detail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class CenterDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
  schoolSubjects: string[] = [];
  selectedSubject: string = null;

  displayedColumns: string[] = ['creditId', 'splněno', 'description'];

  expandedElement: CreditRecord | null;

  creditsRecords: CreditRecord[] = [];

  constructor(private authenticationService: AuthenticationService,
              private firestoreService: FirestoreService,
              public schoolService: SchoolService,
              private route: ActivatedRoute,
              private logger: NGXLogger) {
    this.firestoreService.colWithIds$<SubjectPeriods>(
      'years/'
        .concat(this.schoolService.currentSchoolYear.toString())
        .concat('/school-classes/')
        .concat(this.authenticationService.loggedUser.className)
        .concat('/subject-periods/'),
      ref => ref.orderBy('subject')
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.schoolSubjects = [];
        for (const creditPeriods of result) {
          this.schoolSubjects.push(creditPeriods.subject);
        }

        this.logger.trace('schoolSubjects for the class', this.authenticationService.loggedUser.className, 'are:', this.schoolSubjects);
        this.logger.trace('schoolSubject selected is:', this.route.snapshot.paramMap.get('subject'));
        this.selectedSubject = this.route.snapshot.paramMap.get('subject') ? this.route.snapshot.paramMap.get('subject') : 'NONE' ;
      });

    const subjectCredits$ = this.firestoreService.colWithIds$<SubjectCredit>(
      'years/'
        .concat(this.schoolService.currentSchoolYear.toString())
        .concat('/school-classes/')
        .concat(this.authenticationService.loggedUser.className)
        .concat('/subject-credits/'),
      ref => ref.orderBy('subject').orderBy('creditType').orderBy('creditCode')
    );

    const studentCredits$ = this.firestoreService.colWithIds$<UserCredit>(
      'years/'
        .concat(this.schoolService.currentSchoolYear.toString())
        .concat('/students/')
        .concat(this.authenticationService.loggedUser.id)
        .concat('/student-credits/'),
      ref => ref.orderBy('subject').orderBy('creditType').orderBy('creditCode')
    );

    zip(subjectCredits$, studentCredits$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.logger.trace('First array', data[0]);
        this.logger.trace('Second array', data[1]);

        let secondIndex = 0;
        for (const credit of data[0]) {
          const creditRecord: CreditRecord = {
            subject: credit.subject,
            code: (credit.required ? '* ' : '').concat(this.schoolService.getCreditID(credit.creditType, credit.creditCode)),
            changed: -1,
            subjectCredit: credit,
            studentCredit: { subject: credit.subject, creditType: credit.creditType, creditCode: credit.creditCode }
          };

          if (secondIndex < data[1].length) {
            if (credit.subject === data[1][secondIndex].subject &&
              credit.creditType === data[1][secondIndex].creditType &&
              credit.creditCode === data[1][secondIndex].creditCode) {
              creditRecord.studentCredit = data[1][secondIndex];
              if (creditRecord.studentCredit.planDt) {
                creditRecord.studentCredit.planDt = CenterDetailComponent.convertDate(data[1][secondIndex].planDt);
              }
              if (creditRecord.studentCredit.passDt) {
                creditRecord.studentCredit.passDt = CenterDetailComponent.convertDate(data[1][secondIndex].passDt);
              }
              secondIndex++;
            }
          }
          this.creditsRecords.push(creditRecord);
        }

        this.logger.trace('Combined result', this.creditsRecords);
      });
  }

  private static convertDate(date: any): Date {
    return date.toDate();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.saveCredits();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onChange(value: string, event: MatOptionSelectionChange) {
    if (event.isUserInput && this.selectedSubject !== 'NONE') {
      this.logger.trace('Selection change - save data', this.selectedSubject, '->', value, event);
      this.saveCredits();
    }
  }

  private saveCredits(): number {
    let recordCount = 0;

    for (const credit of this.creditsRecords.filter(item => (item.subject === this.selectedSubject && item.changed >= 0))) {
      if (!credit.studentCredit.id) {
        this.logger.trace('CREATE NEW RECORD', credit.studentCredit);
        // TODO pridej zaznam do databaze
        this.firestoreService.add<UserCredit>('years/'
          .concat(this.schoolService.currentSchoolYear.toString())
          .concat('/students/')
          .concat(this.authenticationService.loggedUser.id)
          .concat('/student-credits/'), credit.studentCredit);
      } else {
        this.logger.trace('UPDATE RECORD', credit.studentCredit);
        // TODO aktualizuj zaznam v databazi
        this.firestoreService.updateWithoutId<UserCredit>('years/'
          .concat(this.schoolService.currentSchoolYear.toString())
          .concat('/students/')
          .concat(this.authenticationService.loggedUser.id)
          .concat('/student-credits/')
          .concat(credit.studentCredit.id), credit.studentCredit);
      }
      recordCount++;
      credit.changed = -1;
    }
    return recordCount;
  }

  @HostListener('window:beforeunload', ['$event'])
  unload($event: any) {
    this.logger.trace('BEFORE UNLOAD EVENT');
    if (this.saveCredits() > 0) {
      $event.returnValue = true;
    }
  }

}
