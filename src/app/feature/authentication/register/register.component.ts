import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {takeUntil} from 'rxjs/operators';
import {FirestoreService} from '../../../core/services/firestore.service';
import {Subject} from 'rxjs';
import {SchoolClass} from '../../../core/models/school-class';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  isHandset = false;
  schoolClasses: string[] = [];

  private ngUnsubscribe = new Subject();

  constructor(private breakpointObserver: BreakpointObserver,
              private firestoreService: FirestoreService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private logger: NGXLogger) {
    this.registerForm = this.formBuilder.group({
      email: [ '', [ Validators.required, Validators.email ] ],
      firstName: [ '', Validators.required ],
      lastName: [ '', Validators.required ],
      className: [ '', Validators.required ],
      password: [ '', Validators.required ]
    });
    this.firestoreService.col$<SchoolClass>('school-classes/', ref => ref.orderBy('freshmanYear', 'desc'))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(schoolClasses => {
        this.logger.trace('Populating options', schoolClasses);
        this.schoolClasses = [];

        for (const schoolClass of schoolClasses) {
          this.schoolClasses.push(schoolClass.className);
        }
      });
  }
  ngOnInit(): void {
  }
  async register() {
    this.logger.debug('Register', this.registerForm.get('email').value);
    return this.authenticationService.register(
      {
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value
      },
      this.registerForm.get('firstName').value,
      this.registerForm.get('lastName').value,
      this.registerForm.get('className').value);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
