import { Component, Inject, OnInit } from '@angular/core';

import { FirestoreService } from '../../../../core/services/firestore.service';
import { SchoolService } from '../../../../core/services/school.service';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';

import { AbstractEditTable } from '../../helper/abstract-edit-table';
import { SchoolClass } from '../../../../core/models/school-class';
import { SchoolSubject } from '../../../../core/models/school-subject';
import { SubjectCredit } from '../../../../core/models/subject-credit';

import { AdminCreditsDialogComponent } from './admin-credits-dialog.component';
import { MatOptionSelectionChange } from '@angular/material/core';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-admin-credits',
  templateUrl: './admin-credits.component.html',
  styleUrls: ['./admin-credits.component.scss']
})
export class AdminCreditsComponent extends AbstractEditTable<SubjectCredit> implements OnInit {

  optionsYear: number[];
  selectedYear: number = null;
  optionsClass: string[];
  selectedClass: string = null;
  optionsSubject: string[];
  selectedSubject: string = null;

  constructor(@Inject(FirestoreService) firestoreService: FirestoreService,
              @Inject(SchoolService) schoolService: SchoolService,
              @Inject(MatDialog) matDialog: MatDialog,
              @Inject(AdminCreditsDialogComponent) adminCreditsDialogComponent,
              @Inject(NGXLogger) logger: NGXLogger) {
    super(firestoreService, schoolService, matDialog, adminCreditsDialogComponent, logger);

    this.displayedColumns = ['creditId', 'required', 'description', 'actions'];
    this.optionsYear = this.schoolService.yearOptions(true);
    this.firestoreService
      .colWithIds$<SchoolClass>('school-classes', ref => ref.orderBy('freshmanYear', 'desc'))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(schoolClasses => {
        this.optionsClass = [];
        for (const schoolClass of schoolClasses) {
          this.optionsClass.push(schoolClass.className);
        }
      });

    this.firestoreService
      .colWithIds$<SchoolSubject>('school-subjects', ref => ref.orderBy('subject'))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(schoolSubjects => {
        this.optionsSubject = [];
        for (const schoolSubject of schoolSubjects) {
          this.optionsSubject.push(schoolSubject.subject);
        }
      });
  }

  protected initTable(): void { }

  protected initData(data?: SubjectCredit): SubjectCredit {
    if (!data) {
      data = { subject: this.selectedSubject, creditType: null, creditCode: null, required: false };
    }
    return data;
  }

  get canAddCredit() {
    return this.selectedYear !== null &&
      this.selectedClass !== null &&
      this.selectedSubject !== null;
  }

  onSelectionChange(selection: string, value: any, event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.logger.trace('onChange', selection, value, event.isUserInput);
      switch (selection) {
        case 'year':
          this.selectedYear = value;
          break;
        case 'schoolClass':
          this.selectedClass = value;
          break;
        case 'schoolSubject':
          this.selectedSubject = value;
          break;
      }

      if (this.canAddCredit) {
        this.logger.trace('Populate table');

        this.init('years/'
            .concat(this.selectedYear.toString())
            .concat('/school-classes/')
            .concat(this.selectedClass)
            .concat('/subject-credits'),
            ref => ref.where('subject', '==', this.selectedSubject).orderBy('creditType').orderBy('creditCode'));
      }
    }
  }

  ngOnInit(): void {
  }

}
