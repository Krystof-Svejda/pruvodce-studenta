import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { User } from '../../core/models/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() version: string;
  currentUser: User = null;

  private ngUnsubscribe = new Subject();

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => this.currentUser = user);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
