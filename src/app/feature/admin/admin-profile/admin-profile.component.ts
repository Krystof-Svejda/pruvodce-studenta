import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {SchoolService} from '../../../core/services/school.service';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirestoreService} from '../../../core/services/firestore.service';
import {User} from '../../../core/models/user';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent  implements OnInit {
  @Input() isHandset: boolean;
  currentUser = null;

  dialogForm: FormGroup;

  private ngUnsubscribe = new Subject();

  constructor(private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private firestoreService: FirestoreService,
              private schoolService: SchoolService,
              private router: Router,
              private logger: NGXLogger) {
    this.authenticationService.currentUser$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => {
        this.currentUser = user;
        this.dialogForm = this.formBuilder.group({
          firstName: [ user.firstName, Validators.required ],
          lastName: [ user.lastName, Validators.required ],
        });
      });
  }

  onSubmit() {
    this.currentUser.firstName = this.dialogForm.get('firstName').value;
    this.currentUser.lastName = this.dialogForm.get('lastName').value;

    this.firestoreService.updateWithoutId<User>('users/'.concat(this.currentUser.id), this.currentUser);
  }

  ngOnInit(): void {
  }

}
