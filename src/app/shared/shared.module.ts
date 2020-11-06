import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MaterialModule } from '../material.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterModule} from '@angular/router';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [ToolbarComponent, SidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    FlexModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule
  ],
  exports: [
    ToolbarComponent,
    SidebarComponent,
  ]
})
export class SharedModule { }
