import {
  CUSTOM_ELEMENTS_SCHEMA,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PasswordDetailsComponent implements OnChanges, OnInit {
  @Input() password!: Password;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() updatePassword = new EventEmitter<Password>();
  @Output() deletePassword = new EventEmitter<Password>();

  passwordDetailsDialog!: HTMLDialogElement;
  loadingPassword = signal(false);
  loadingDelete = signal(false);
  passwordDetailsForm = new FormGroup({
    site: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  updatePasswordDialog!: HTMLDialogElement;
  deleteDialog!: HTMLDialogElement;

  constructor(private passwordsService: PasswordsService) {}

  ngOnInit() {
    this.passwordDetailsDialog = document.querySelector(
      '#passwordDetailsDialog',
    )!;
    this.updatePasswordDialog = document.querySelector(
      '#updatePasswordDialog',
    )!;
    this.deleteDialog = document.querySelector('#deletePasswordDialog')!;
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

  openUpdatePassword() {
    if (this.passwordDetailsForm.invalid) {
      this.passwordDetailsForm.markAllAsTouched();
      return;
    }
    this.updatePasswordDialog.showModal();
  }

  closeUpdatePassword() {
    this.updatePasswordDialog.close();
  }

  async handleUpdatePassword() {
    this.updatePasswordDialog.close();
    this.loadingPassword.set(true);
    await this.updatePasswordDB();
    this.password = {
      ...this.password,
      site: this.passwordDetailsForm.value.site!,
      encryptedPassword: this.passwordDetailsForm.value.password!,
    };
    this.updatePassword.emit(this.password);
    setTimeout(() => {
      this.loadingPassword.set(false);
      this.close();
      Toastify({
        text: 'Password updated successfully',
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #4caf50, #4caf50)',
      }).showToast();
    }, 3000);
  }

  async updatePasswordDB() {
    await lastValueFrom(
      this.passwordsService.updatePassword(this.password._id, {
        site: this.passwordDetailsForm.value.site!,
        encryptedPassword: this.passwordDetailsForm.value.password!,
      }),
    );
  }

  openDeleteDialog() {
    this.deleteDialog.showModal();
  }

  closeDeleteDialog() {
    this.deleteDialog.close();
  }

  async handleDeletePassword() {
    this.deleteDialog.close();
    this.loadingDelete.set(true);
    await this.deletePasswordDB();
    this.deletePassword.emit(this.password);
    setTimeout(() => {
      this.loadingDelete.set(false);
      this.close();
      Toastify({
        text: 'Password deleted successfully',
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #f44336, #f44336)',
      }).showToast();
    }, 3000);
  }

  async deletePasswordDB() {
    await lastValueFrom(
      this.passwordsService.deletePassword(this.password._id),
    );
  }
}
