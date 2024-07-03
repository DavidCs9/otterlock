import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Password } from '../../interfaces/passwords.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordsService } from '../../services/passwords.service';
import Toastify from 'toastify-js';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-password-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-details.component.html',
  styleUrl: './password-details.component.css',
})
export class PasswordDetailsComponent implements OnChanges, OnInit {
  @Input() password!: Password;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() updatePassword = new EventEmitter<Password>();
  @Output() deletePassword = new EventEmitter<Password>();

  passwordDetailsDialog!: HTMLDialogElement;
  loadingPassword = signal(false);
  passwordDetailsForm = new FormGroup({
    site: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private passwordsService: PasswordsService) {}

  ngOnInit() {
    this.passwordDetailsDialog = document.querySelector(
      '#passwordDetailsDialog',
    )!;
  }

  ngOnChanges() {
    if (this.passwordDetailsDialog) {
      this.setFormValue();
    }
  }

  setFormValue() {
    this.passwordDetailsForm.setValue({
      site: this.password.site,
      password: this.password.encryptedPassword,
    });
  }

  close() {
    this.closeDialog.emit();
  }

  async handleUpdatePassword() {
    if (this.passwordDetailsForm.invalid) return;
    this.loadingPassword.set(true);
    await this.updatePasswordDB();
    this.password = {
      ...this.password,
      site: this.passwordDetailsForm.value.site!,
      encryptedPassword: this.passwordDetailsForm.value.password!,
    };
    this.updatePassword.emit(this.password);
    this.loadingPassword.set(false);
    Toastify({
      text: 'Password updated successfully',
      duration: 3000,
      gravity: 'bottom',
      position: 'center',
      backgroundColor: 'linear-gradient(to right, #4caf50, #4caf50)',
    }).showToast();
    this.close();
  }

  async updatePasswordDB() {
    await lastValueFrom(
      this.passwordsService.updatePassword(this.password._id, {
        site: this.passwordDetailsForm.value.site!,
        encryptedPassword: this.passwordDetailsForm.value.password!,
      }),
    );
  }
}
