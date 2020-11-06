import {Component, OnDestroy, OnInit} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {SchoolService} from '../../../core/services/school.service';
import {Subject} from 'rxjs';
import {FirestoreService} from '../../../core/services/firestore.service';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {SubjectPeriods} from '../../../core/models/subject-periods';
import {takeUntil} from 'rxjs/operators';
import {UserCredit} from '../../../core/models/user-credit';

interface CreditDate {
  date: Date;
  credits: number;
}

interface CreditOverview {
  subject: string;
  studentCreditsAsOfNow: number;
  requiredCreditsAsOfNow: number;
  detailDates: CreditDate[];
}

@Component({
  selector: 'app-center',
  templateUrl: './center-main.component.html',
  styleUrls: ['./center-main.component.scss']
})
export class CenterMainComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  creditsOverview: CreditOverview[] = [];
  displayedColumns: string[] = ['date', 'credits'];

  private processCreditRecord(creditOverview: CreditOverview, date: any, credits: number) {
    if (date && credits) {
      creditOverview.detailDates.push({ date: date.toDate(), credits });
      if (!creditOverview.requiredCreditsAsOfNow) {
        if (new Date() <= date.toDate()) {
          creditOverview.requiredCreditsAsOfNow = credits;
        }
      }
    }
  }
  constructor(private authenticationService: AuthenticationService,
              private firestoreService: FirestoreService,
              private schoolService: SchoolService,
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
        this.creditsOverview = [];
        for (const creditPeriods of result) {

          const creditOverview: CreditOverview = {
            subject: creditPeriods.subject,
            studentCreditsAsOfNow: 0,
            requiredCreditsAsOfNow: 0,
            detailDates: []};

          this.processCreditRecord(creditOverview, creditPeriods.dateP1, creditPeriods.creditsP1);
          this.processCreditRecord(creditOverview, creditPeriods.dateP2, creditPeriods.creditsP2);
          this.processCreditRecord(creditOverview, creditPeriods.dateP3, creditPeriods.creditsP3);
          this.processCreditRecord(creditOverview, creditPeriods.dateP4, creditPeriods.creditsP4);

          this.creditsOverview.push(creditOverview);

        }
      });

    this.firestoreService.colWithIds$<UserCredit>(
      'years/'
        .concat(this.schoolService.currentSchoolYear.toString())
        .concat('/students/')
        .concat(this.authenticationService.loggedUser.id)
        .concat('/student-credits/'),
      ref => ref.orderBy('subject').orderBy('creditType').orderBy('creditCode')
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(studentCredits => {
        this.logger.trace(studentCredits);
        this.logger.trace(this.creditsOverview);

        for (const creditOverview of this.creditsOverview) {
          this.logger.trace('Finding credits for', creditOverview.subject,
            studentCredits.filter(item => ((item.subject === creditOverview.subject) && item.passDt)).length);
          creditOverview.studentCreditsAsOfNow =
            studentCredits.filter(item => (item.subject === creditOverview.subject && item.passDt)).length;
        }

      });
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  onSubmit() {
    this.schoolService.initDB();
  }
}
