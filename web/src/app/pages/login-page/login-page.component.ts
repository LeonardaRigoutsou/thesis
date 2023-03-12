import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string = "";

  constructor(private authService: AuthService) {

  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    });
  }

  onLogin(): void {
    console.log(this.loginForm);
    this.authService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value).then(value => {
      console.log(value);
      this.errorMessage = value;
    });
  }
}
