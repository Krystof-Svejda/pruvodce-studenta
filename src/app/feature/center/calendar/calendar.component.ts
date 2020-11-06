import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { FirestoreService } from '../../../core/services/firestore.service';
import { UserCredit } from '../../../core/models/user-credit';
import { SchoolService } from '../../../core/services/school.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import {first, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatCalendar } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Event} from '@angular/router';
import {query} from '@angular/animations';

interface DateEntry {
  date: string;
  description: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CalendarComponent implements OnInit, OnDestroy {

  @ViewChild('calendar')
  calendar: MatCalendar<Moment>;

  private plannedCredits: DateEntry[] = [];
  private ngUnsubscribe = new Subject();

  constructor(private schoolService: SchoolService,
              private authenticationService: AuthenticationService,
              private firestoreService: FirestoreService,
              private snackBar: MatSnackBar,
              private logger: NGXLogger) {

    this.firestoreService.colWithIds$<Event>(
      'years/'
        .concat(this.schoolService.currentSchoolYear.toString())
        .concat('/events'),
      ref => ref.orderBy('date')
    )
      .pipe(first())
      .subscribe(schoolEvents => {
        for (const event of schoolEvents) {
          const dateEntry: DateEntry = {
            date: this.dateToString(event.date.toDate()),
            description: event.event
          };

          const index = this.plannedCredits.findIndex(x => x.date === dateEntry.date);
          if (index < 0) {
            this.plannedCredits.push(dateEntry);
          } else {
            const description = this.plannedCredits[index].description.concat(' \n').concat(dateEntry.description);
            this.plannedCredits[index].description = description;
          }
        }

        this.calendar.updateTodaysDate();
      });

    this.firestoreService.colWithIds$<UserCredit>(
      'years/'
        .concat(this.schoolService.currentSchoolYear.toString())
        .concat('/students/')
        .concat(this.authenticationService.loggedUser.id)
        .concat('/student-credits/'),
      ref => ref.orderBy('planDt')
    )
      .pipe(first())
      .subscribe(studentCredits => {
        for (const credit of studentCredits) {
          const dateEntry: DateEntry = {
            date: this.dateToString(credit.planDt.toDate()),
            description: credit.subject
              .concat(': ')
              .concat(credit.creditType)
              .concat(credit.creditCode) };

          const index = this.plannedCredits.findIndex(x => x.date === dateEntry.date);
          if (index < 0) {
            this.plannedCredits.push(dateEntry);
          } else {
            const description = this.plannedCredits[index].description.concat(' \n').concat(dateEntry.description);
            this.plannedCredits[index].description = description;
          }
        }

        this.calendar.updateTodaysDate();
      } );
  }

  showContent(date: Date) {
    const index = this.plannedCredits.findIndex(x => x.date === this.dateToString(date));
    if (index >= 0) {
      this.snackBar.open(this.plannedCredits[index].description, undefined, { duration: 5 * 1000, panelClass: ['credits-snackbar'] });
    }
  }

  isSelected = (date: any) => {
    return this.plannedCredits.find(x => x.date === this.dateToString(date)) ? 'selected' : null;
  }

  private dateToString(date: Date): string {
    return date.getFullYear() +
      '-' +
      ('00' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('00' + date.getDate()).slice(-2);
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
