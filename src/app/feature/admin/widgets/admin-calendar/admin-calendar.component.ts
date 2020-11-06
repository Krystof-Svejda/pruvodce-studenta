import {Component, Inject, OnInit} from '@angular/core';
import {FirestoreService} from '../../../../core/services/firestore.service';
import {NGXLogger} from 'ngx-logger';
import {SchoolService} from '../../../../core/services/school.service';
import {AbstractEditTable} from '../../helper/abstract-edit-table';
import {Event} from '../../../../core/models/event';
import {AdminCalendarDialogComponent} from './admin-calendar-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-admin-calendar',
  templateUrl: './admin-calendar.component.html',
  styleUrls: ['./admin-calendar.component.scss']
})
export class AdminCalendarComponent extends AbstractEditTable<Event> implements OnInit {

  constructor(@Inject(FirestoreService) firestoreService: FirestoreService,
              @Inject(SchoolService) schoolService: SchoolService,
              @Inject(MatDialog) matDialog: MatDialog,
              @Inject(AdminCalendarDialogComponent) adminCalendarDialogComponent,
              @Inject(NGXLogger) logger: NGXLogger) {
    super(firestoreService, schoolService, matDialog, adminCalendarDialogComponent, logger);
  }

  ngOnInit(): void {
    this.init('years/' + this.schoolService.currentSchoolYear + '/events');
  }

  protected initData(data?: Event): Event {
    if (!data) {
      data = { date: undefined, event: '' };
    }
    return data;
  }

  protected initTable(): void {
  }

}
