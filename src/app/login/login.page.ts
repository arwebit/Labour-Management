import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
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
export class LoginPage {
  version: string = '';
  loginForm!: FormGroup;
  loginErr: string = '';
  isLoading: boolean = false;

  constructor(private loginSrv: LoginService, private router: Router) {
    this.version = environment.version;
    localStorage.clear();
    this.isLoading = false;
    this.loginErr = '';
  }
  formInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }
  ngOnInit() {
    this.formInit();
  }

  login() {
    this.isLoading = true;
    this.loginSrv.login(this.loginForm.value).subscribe(
      (result: any) => {
        this.isLoading = false;
        this.loginErr = '';
        this.formInit();
        localStorage.setItem('user_id', result.rows.user_id);
        localStorage.setItem('token', result.token.access_token);
        this.router.navigate(['dashboard']);
      },
      (err: HttpErrorResponse): void => {
        this.isLoading = false;
        this.loginErr = 'Login failed';
      }
    );
  }
}
