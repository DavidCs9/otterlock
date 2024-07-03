import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Password } from '../../interfaces/passwords.interface';
import Toastify from 'toastify-js';
import { PasswordDetailsComponent } from '../password-details/password-details.component';
import { OutletContext } from '@angular/router';

@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [],
  templateUrl: './passwords.component.html',
  styleUrl: './passwords.component.css',
})
export class PasswordsComponent implements OnInit {
  @Input() passwords: Password[] = [];
  @Output() selectedPassword = new EventEmitter<Password>();

  passwordDetailsDialog!: HTMLDialogElement;

  ngOnInit(): void {
    this.passwordDetailsDialog = document.querySelector(
      '#passwordDetailsDialog',
    )!;
  }

  copyToClipboard(type: string, password: string) {
    Toastify({
      text: `${type} copied to clipboard`,
      duration: 3000,
      gravity: 'top',
      position: 'center',
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
    }).showToast();
    navigator.clipboard.writeText(password);
  }

  openPasswordDetails(password: Password) {
    this.selectedPassword.emit(password);
  }
}
