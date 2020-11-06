import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { NGXLogger } from 'ngx-logger';
import { Credentials } from '../models/credentials';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUser: User = null;
  currentUser$: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private firestoreService: FirestoreService,
              private notificationService: NotificationService,
              private router: Router,
              private logger: NGXLogger) {
    this.currentUser$ = this.afAuth.authState
      .pipe(switchMap(user => {
        this.logger.trace('Authentication - authState', user ? 'User: '.concat(user.email) : 'NO USER');
        if (user) {
          return this.firestoreService.docWithId$<User>('users/' + user.uid);
        } else {
          return of<User>(null);
        }
      }));

    this.currentUser$
      .subscribe(user => this.currentUser = user);
  }

  get isLoggedIn(): boolean {
    return (this.loggedUser !== null);
  }

  get loggedUser(): User {
    return this.currentUser;
  }

  async register(credentials: Credentials, firstName: string, lastName: string, className: string) {
    this.logger.info('Attempt to register by', credentials.email);

    this.afAuth.createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(userResponse => {
        const user: User = {
          uid: userResponse.user.uid,
          email: credentials.email,
          roles: { student: true },
          firstName,
          lastName,
          className,
        };

        this.firestoreService.set<User>('users/' + userResponse.user.uid, user)
          .then(() => {
            this.logger.info('User ', user.email, 'was successfully registered');
            this.router.navigateByUrl('/');
          }).catch(err => {
          this.logger.error('Error during registration - access to database failed', err);
          this.notificationService.notifyError(err);
        });
      }).catch(err => {
      this.logger.error('Error during registration', err);
      this.notificationService.notifyError(err);
    });
  }

  async login(credentials: Credentials) {
    this.logger.info('Attempt to login by', credentials.email);

    this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(user => {
        this.logger.info('User', credentials.email, 'successfully logged in');
        this.router.navigateByUrl('/');
      }).catch(err => {
      this.logger.error('Error during login', err);
      this.notificationService.notifyError(err);
    });
  }

  async logout() {
    this.logger.info('Attempt to logout by', this.loggedUser.email);

    await this.afAuth.signOut();
    await this.router.navigate(['/auth/login']);
  }
}
