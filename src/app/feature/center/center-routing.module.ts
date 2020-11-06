import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CenterMainComponent} from './center-main/center-main.component';
import {CenterDetailComponent} from './center-detail/center-detail.component';


const routes: Routes = [
  {
    path: '',
    component: CenterMainComponent
  },
  {
    path: ':detail',
    component: CenterDetailComponent
  },
  {
    path: 'detail/:subject',
    component: CenterDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterRoutingModule { }
