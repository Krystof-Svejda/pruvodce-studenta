import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminSchoolComponent} from './admin-school/admin-school.component';
import {AdminUsersComponent} from './admin-users/admin-users.component';
import {ParamsAuthenticationGuard} from '../../core/guards/params-authentication.guard';
import {AdminAuthenticationGuard} from '../../core/guards/admin-authentication.guard';
import {AdminProfileComponent} from './admin-profile/admin-profile.component';
import {StudentAuthenticationGuard} from '../../core/guards/student-authentication.guard';
import {EasterEggComponent} from './easter-egg/easter-egg.component';

const routes: Routes = [
  {
    path: '',
    component: AdminSchoolComponent,
    canActivate: [ParamsAuthenticationGuard]
  },
  {
    path: 'users',
    component: AdminUsersComponent,
    canActivate: [AdminAuthenticationGuard]
  },
  {
    path: 'school',
    component: AdminSchoolComponent,
    canActivate: [ParamsAuthenticationGuard]
  },
  {
    path: 'profile',
    component: AdminProfileComponent,
    canActivate: [StudentAuthenticationGuard]
  },
  {
    path: 'easter-egg',
    component: EasterEggComponent,
    canActivate: [StudentAuthenticationGuard]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
