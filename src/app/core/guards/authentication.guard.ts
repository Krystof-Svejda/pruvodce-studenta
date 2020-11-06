import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { AuthenticationService } from '../services/authentication.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private logger: NGXLogger) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.logger.trace('AuthenticationGuard', 'canActivate', next.url.toString(), 'state', state.url);

    return this.authenticationService.currentUser$.pipe(map(user => {
      if (user) {
        return true;
      } else {
        this.router.navigate(['auth/login']);
        return false;
      }
    }));
  }
}
