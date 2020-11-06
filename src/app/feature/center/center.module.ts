import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterRoutingModule } from './center-routing.module';
import { CenterMainComponent } from './center-main/center-main.component';
import { MaterialModule } from '../../material.module';
import { CenterDetailComponent } from './center-detail/center-detail.component';
import { CoreModule } from '../../core/core.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import { CalendarComponent } from './calendar/calendar.component';


@NgModule({
  declarations: [CenterMainComponent, CenterDetailComponent, CalendarComponent, ],
  imports: [
    CommonModule,
    CenterRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    CoreModule,
    FormsModule,
    MatDatepickerModule,
    FormsModule,
  ],
  exports: [
    CalendarComponent
  ]
})
export class CenterModule { }
