import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  generatePassword() {
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const at = Math.floor(Math.random() * charset.length);
      password += charset.charAt(at);
    }
    this.addPasswordForm.controls.password.setValue(password);
  }

  async handleAddPassword() {
    if (this.addPasswordForm.invalid) return;
    this.loadingPassword.set(true);
    await this.addPasswordToDB();
    setTimeout(() => {
      this.close();
      this.loadingPassword.set(false);
      Toastify({
        text: 'Password added',
        duration: 4000,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      }).showToast();
    }, 2000);
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
