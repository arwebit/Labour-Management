import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginService } from '../shared/services/users/login.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  version: string = '';
  loginForm!: FormGroup;
  loginErr: string = '';
  isLoading: boolean = false;
  usernameErr: string = '';
  passwordErr: string = '';

  constructor(private loginSrv: LoginService, private router: Router) {
    this.version = environment.version;
    this.emptyErrors();
    this.isLoading = false;
    localStorage.clear();
  }

  loginFormInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }
  ngOnInit() {
    this.loginFormInit();
  }

  emptyErrors() {
    this.usernameErr = '';
    this.passwordErr = '';
    this.loginErr = '';
  }

  login() {
    this.isLoading = true;
    this.loginSrv.login(this.loginForm.value).subscribe(
      (result: any) => {
        this.isLoading = false;
        this.emptyErrors();
        this.loginFormInit();
        localStorage.setItem('user_id', result.rows.user_id);
        localStorage.setItem('token', result.token.access_token);
        this.router.navigateByUrl('/dashboard');
      },
      (err: HttpErrorResponse): void => {
        this.isLoading = false;
        this.emptyErrors();
        this.usernameErr = err.error.errors?.username;
        this.passwordErr = err.error.errors?.password;
        this.loginErr = err.error.message;
      }
    );
  }
}
