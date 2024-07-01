import { Component, EventEmitter, Output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordsService } from '../../services/passwords.service';
import Toastify from 'toastify-js';
import { lastValueFrom } from 'rxjs';
import { Password } from '../../interfaces/passwords.interface';

@Component({
  selector: 'app-add-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-password.component.html',
  styleUrl: './add-password.component.css',
})
export class AddPasswordComponent {
  @Output() closeDialog = new EventEmitter<void>();
  @Output() newPassword = new EventEmitter<Password>();
  loadingPassword = signal(false);
  addPasswordForm = new FormGroup({
    site: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private passwordsService: PasswordsService) {}

  async handleAddPassword() {
    if (this.addPasswordForm.invalid) return;
    this.loadingPassword.set(true);
    await this.addPasswordToDB();
    Toastify({
      text: 'Password added',
      duration: 6000,
      gravity: 'top',
      position: 'center',
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
    }).showToast();
    this.loadingPassword.set(false);
    this.close();
  }

  async addPasswordToDB() {
    try {
      const newPassword = await lastValueFrom(
        this.passwordsService.addPassword({
          site: this.addPasswordForm.value.site!,
          encryptedPassword: this.addPasswordForm.value.password!,
        }),
      );
      this.newPassword.emit(newPassword);
    } catch (error) {
      throw new Error('Error adding password to DB');
    }
  }

  close() {
    this.closeDialog.emit();
  }
}
