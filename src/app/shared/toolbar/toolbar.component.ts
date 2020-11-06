import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import { AuthenticationService } from '../../core/services/authentication.service';
import { User } from '../../core/models/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {SchoolService} from '../../core/services/school.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() isHandset: boolean;
  @Output() sidebarToggle = new EventEmitter();
  currentUser = null;
  currentSchoolYear = null;

  private ngUnsubscribe = new Subject();

  constructor(private authenticationService: AuthenticationService,
              private schoolService: SchoolService,
              private router: Router,
              private logger: NGXLogger) {
    this.authenticationService.currentUser$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => this.currentUser = user);

    this.currentSchoolYear = this.schoolService.currentSchoolYear;
  }

  ngOnInit(): void {
  }
  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  logout() {
    this.authenticationService.logout();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
