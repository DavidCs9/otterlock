import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-password.component.html',
  styleUrl: './add-password.component.css',
})
export class AddPasswordComponent {
  @Output() closeDialog = new EventEmitter<void>();
  addPasswordForm = new FormGroup({
    site: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  handleAddPassword() {}

  close() {
    this.closeDialog.emit();
  }
}
