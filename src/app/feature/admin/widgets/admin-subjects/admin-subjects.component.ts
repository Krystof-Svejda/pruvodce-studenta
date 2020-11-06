import { Component, Inject, OnInit } from '@angular/core';
import { AbstractEditTable } from '../../helper/abstract-edit-table';
import { SchoolSubject } from '../../../../core/models/school-subject';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { SchoolService } from '../../../../core/services/school.service';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { AdminSubjectsDialogComponent } from './admin-subjects-dialog.component';

@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.scss']
})
export class AdminSubjectsComponent extends AbstractEditTable<SchoolSubject> implements OnInit {

  constructor(@Inject(FirestoreService) firestoreService: FirestoreService,
              @Inject(SchoolService) schoolService: SchoolService,
              @Inject(MatDialog) matDialog: MatDialog,
              @Inject(AdminSubjectsDialogComponent) adminSubjectsDialogComponent,
              @Inject(NGXLogger) logger: NGXLogger) {
    super(firestoreService, schoolService, matDialog, adminSubjectsDialogComponent, logger);
    this.displayedColumns = ['subject', 'optional', 'actions'];
  }

  protected initTable(): void { }

  protected initData(data?: SchoolSubject): SchoolSubject {
    if (!data) {
      data = { subject: null, optional: false };
    }
    return data;
  }

  ngOnInit(): void {
    this.init('school-subjects', ref => ref.orderBy('subject'));
  }

}
