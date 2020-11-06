import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminSchoolComponent } from './admin-school/admin-school.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminClassesComponent } from './widgets/admin-classes/admin-classes.component';
import { AdminSubjectsComponent } from './widgets/admin-subjects/admin-subjects.component';
import { AdminCreditsComponent } from './widgets/admin-credits/admin-credits.component';
import { AdminPeriodsComponent } from './widgets/admin-periods/admin-periods.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdminClassesDialogComponent } from './widgets/admin-classes/admin-classes-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AdminSubjectsDialogComponent } from './widgets/admin-subjects/admin-subjects-dialog.component';
import { AdminCreditsDialogComponent } from './widgets/admin-credits/admin-credits-dialog.component';
import { AdminPeriodsDialogComponent } from './widgets/admin-periods/admin-periods-dialog.component';
import { AdminUsersDialogComponent } from './admin-users/admin-users-dialog.component';
import {MatRadioButton} from '@angular/material/radio';
import {MatSortModule} from '@angular/material/sort';
import { AdminCalendarComponent } from './widgets/admin-calendar/admin-calendar.component';
import { AdminCalendarDialogComponent } from './widgets/admin-calendar/admin-calendar-dialog.component';
import {CenterModule} from '../center/center.module';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { EasterEggComponent } from './easter-egg/easter-egg.component';


@NgModule({
  declarations: [
    AdminSchoolComponent,
    AdminUsersComponent,
    AdminClassesComponent,
    AdminSubjectsComponent,
    AdminCreditsComponent,
    AdminPeriodsComponent,
    AdminClassesDialogComponent,
    AdminSubjectsDialogComponent,
    AdminCreditsDialogComponent,
    AdminPeriodsDialogComponent,
    AdminUsersDialogComponent,
    AdminCalendarComponent,
    AdminCalendarDialogComponent,
    AdminProfileComponent,
    EasterEggComponent],
    imports: [
        CommonModule,
        AdminRoutingModule,
        FlexLayoutModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MatSortModule,
        CenterModule,
    ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    },
    AdminClassesDialogComponent,
    AdminSubjectsDialogComponent,
    AdminCreditsDialogComponent,
    AdminPeriodsDialogComponent,
    AdminUsersDialogComponent,
    AdminCalendarDialogComponent
  ]
})
export class AdminModule { }
