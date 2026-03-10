import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service/login.service';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { viewOnPath, viewOffPath } from 'src/assets/paths';
import { LoginForm } from 'src/app/shared/intrefaces/loginform';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less'],
})
export class LoginPageComponent {

  form!: FormGroup<LoginForm>;

  constructor(private readonly loginService: LoginService, private readonly fb: FormBuilder) {
    this.form = this.fb.nonNullable.group<LoginForm>({
      userName: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      password: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      passwordVerify: this.fb.control('', { nonNullable: true }),
    });
  }

  isLoading: boolean = false
  signUpError: string = "";
  loginError: string = "";
  view: boolean = false;
  readonly onPath = viewOnPath;
  readonly offPath = viewOffPath;

  switchTab(): void {
    this.form.reset();
    this.signUpError = "";
    this.loginError = "";
    this.view = false;
  }

  async loginUser(): Promise<void> {
    if (this.form.invalid) {
      this.loginError = "*please check that your fields are valid";
    } else {
      const currUser = await this.loginService.getUserByCredentials(this.form.controls.password.value!, this.form.controls.userName.value!);
      if (!currUser) {
        this.loginError = "*user name or password are incorrect";
      } else {
        this.isLoading = true;
        setTimeout(() => this.loginService.connectUser(currUser), 2000);

      }
    }
  }

  async signUpUser(): Promise<void> {
    if (this.form.invalid) {
      this.signUpError = "*please check that your fields are valid";
    } else {
      if (this.form.controls.password.value !== this.form.controls.passwordVerify.value) {
        this.signUpError = "*password verification failed";
      } else {
        if ( await this.loginService.doesNameExists(this.form.controls.userName.value!)) {
          this.signUpError =
            `*this user name already exists,
            please choose another`;
        } else {
          this.isLoading = true;
          setTimeout(() =>
            this.loginService.addUser(this.form.controls.password.value!, this.form.controls.userName.value!)
            ,2000);
        }
      }
    }
  }
}