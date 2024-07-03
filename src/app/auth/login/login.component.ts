import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {
  loadingLogin = signal(false);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async handleLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    try {
      this.loadingLogin.set(true);
      await this.getToken();
      this.loadingLogin.set(false);
      this.router.navigate(['/main']);
    } catch (error: any) {
      this.loadingLogin.set(false);
      Toastify({
        text: error.message,
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #ff0000, #ff0000)',
      }).showToast();
    }
  }

  async getToken() {
    try {
      const res: any = await lastValueFrom(
        this.authService.login(
          this.loginForm.value.email!,
          this.loginForm.value.password!,
        ),
      );
      window.sessionStorage.setItem('token', res.token);
    } catch (error: any) {
      if (error.error.error === 'Invalid credentials')
        throw new Error('Invalid credentials');
    }
  }
}
