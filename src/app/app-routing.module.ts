import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './core/guards/authentication.guard';
import {StudentAuthenticationGuard} from './core/guards/student-authentication.guard';


const routes: Routes = [
  {
    path: 'center',
    loadChildren: () => import('./feature/center/center.module').then(m => m.CenterModule),
    canActivate: [StudentAuthenticationGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./feature/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./feature/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: '**',
    redirectTo: 'center',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
