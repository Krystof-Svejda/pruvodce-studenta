import { Component, Inject, OnInit } from '@angular/core';

import { FirestoreService } from '../../../../core/services/firestore.service';
import { SchoolService } from '../../../../core/services/school.service';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';

import { MatOptionSelectionChange } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';
import { AdminPeriodsDialogComponent } from './admin-periods-dialog.component';

import { AbstractEditTable } from '../../helper/abstract-edit-table';
import { SchoolClass } from '../../../../core/models/school-class';
import { SubjectPeriods } from '../../../../core/models/subject-periods';

@Component({
  selector: 'app-admin-quarters',
  templateUrl: './admin-periods.component.html',
  styleUrls: ['./admin-periods.component.scss']
})
export class AdminPeriodsComponent extends AbstractEditTable<SubjectPeriods> implements OnInit {

  optionsYear: number[];
  selectedYear: number = null;
  optionsClass: string[];
  selectedClass: string = null;

  constructor(@Inject(FirestoreService) firestoreService: FirestoreService,
              @Inject(SchoolService) schoolService: SchoolService,
              @Inject(MatDialog) matDialog: MatDialog,
              @Inject(AdminPeriodsDialogComponent) adminQuartersDialogComponent,
              @Inject(NGXLogger) logger: NGXLogger) {
    super(firestoreService, schoolService, matDialog, adminQuartersDialogComponent, logger);

    this.displayedColumns = ['subject', 'dateP1', 'creditsP1', 'dateP2', 'creditsP2', 'dateP3', 'creditsP3', 'dateP4', 'creditsP4', 'actions'];
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
  }

  protected initTable(): void { }

  protected initData(data?: SubjectPeriods): SubjectPeriods {
    if (!data) {
      data = { subject: '' };
    }
    return data;
  }

  formatDate(date: any): string {
    if (!date) {
      return '';
    }

    const convertedDt: Date = date.toDate();
    return convertedDt.getDate().toString()
      .concat('.')
      .concat((convertedDt.getMonth() + 1).toString())
      .concat('.')
      .concat(convertedDt.getFullYear().toString());
  }

  get canAddCredit() {
    return this.selectedYear !== null &&
      this.selectedClass !== null;
  }

  onSelectionChange(selection: string, value: any, event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.logger.trace('onSelectionChange', selection, value, event.isUserInput);
      switch (selection) {
        case 'year':
          this.selectedYear = value;
          break;
        case 'schoolClass':
          this.selectedClass = value;
          break;
      }

      if (this.canAddCredit) {
        this.logger.trace('Populate table', this.selectedYear, this.selectedClass);

        this.init('years/'
            .concat(this.selectedYear.toString())
            .concat('/school-classes/')
            .concat(this.selectedClass)
            .concat('/subject-periods'),
          ref => ref.orderBy('subject'));
      }
    }
  }

  ngOnInit(): void {
  }

}
