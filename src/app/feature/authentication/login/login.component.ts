import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;


  constructor(private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private logger: NGXLogger)
  { this.loginForm = this.formBuilder.group({
    email: ['', [ Validators.required, Validators.email ] ],
    password: ['', Validators.required],
    rememberMe: false});
  }
  ngOnInit(): void {
  }
  login() {
    this.logger.trace('Logging with:', this.loginForm.get('email').value);

    return this.authenticationService.login({
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    });
  }
}
