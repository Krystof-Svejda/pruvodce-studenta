import {Component, OnDestroy, ViewChild} from '@angular/core';
import { version } from 'src/environments/version';
import { NGXLogger } from 'ngx-logger';
import {Title} from '@angular/platform-browser';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatSidenav} from '@angular/material/sidenav';
import {AuthenticationService} from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  title = 'Podminky';
  version = version.version;
  isHandset: boolean;

  @ViewChild('sidenav') public sidenav: MatSidenav;

  private ngUnsubscribe = new Subject();

  constructor(public authenticationService: AuthenticationService,
              private titleService: Title,
              private breakpointObserver: BreakpointObserver,
              private logger: NGXLogger) {
    this.logger.info(this.title, 'version:', this.version);
    this.titleService.setTitle(this.title);

    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.logger.trace('Observer:', result);
        this.isHandset = result.matches;
      });
  }
  sidebarToggle(): void {
    this.sidenav.toggle();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
