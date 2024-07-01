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

  handleUpdatePassword() {
    console.log('update password');
  }
}
