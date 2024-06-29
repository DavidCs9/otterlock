import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        toast: true,
        position: 'bottom',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
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
        throw new Error('Credenciales inválidas');
    }
  }
}
