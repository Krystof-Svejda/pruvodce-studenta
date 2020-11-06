import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentAuthenticationGuard implements CanActivate {

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private logger: NGXLogger) { }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.logger.trace('StudentAuthenticationGuard', 'canActivate', next.url.toString(), 'state', state.url);

    return this.authenticationService.currentUser$.pipe(map(user => {
      if (user) {
        if (user.roles.student) { return true; }
        this.router.navigate(['admin']);
        return false;
      } else {
        this.router.navigate(['auth/login']);
        return false;
      }
    }));
  }

}
