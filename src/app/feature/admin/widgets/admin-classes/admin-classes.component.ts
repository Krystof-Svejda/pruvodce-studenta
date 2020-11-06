import { Component, Inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { SchoolService } from '../../../../core/services/school.service';
import { NGXLogger } from 'ngx-logger';
import { SchoolClass } from '../../../../core/models/school-class';
import { AbstractEditTable } from '../../helper/abstract-edit-table';
import {MatDialog} from '@angular/material/dialog';
import {AdminClassesDialogComponent} from './admin-classes-dialog.component';

@Component({
  selector: 'app-admin-classes',
  templateUrl: './admin-classes.component.html',
  styleUrls: ['./admin-classes.component.scss']
})
export class AdminClassesComponent extends AbstractEditTable<SchoolClass> implements OnInit {

  constructor(@Inject(FirestoreService) firestoreService: FirestoreService,
              @Inject(SchoolService) schoolService: SchoolService,
              @Inject(MatDialog) matDialog: MatDialog,
              @Inject(AdminClassesDialogComponent) adminClassesDialogComponent,
              @Inject(NGXLogger) logger: NGXLogger) {
    super(firestoreService, schoolService, matDialog, adminClassesDialogComponent, logger);
    this.displayedColumns = ['className', 'grade', 'freshmanYear', 'actions'];
  }

  protected initTable(): void { }

  protected initData(data?: SchoolClass): SchoolClass {
    if (!data) {
      data = { className: null, freshmanYear: this.schoolService.currentSchoolYear };
    }
    return data;
  }

  ngOnInit(): void {
    this.init('school-classes', ref => ref.orderBy('freshmanYear', 'desc'));
  }

}
