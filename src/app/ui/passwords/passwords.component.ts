import { Component, Input } from '@angular/core';
import { Password } from '../../interfaces/passwords.interface';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [],
  templateUrl: './passwords.component.html',
  styleUrl: './passwords.component.css',
})
export class PasswordsComponent {
  @Input() passwords: Password[] = [];

  copyToClipboard(password: string) {
    Toastify({
      text: 'Password copied to clipboard',
      duration: 3000,
      gravity: 'top',
      position: 'center',
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
    }).showToast();
    navigator.clipboard.writeText(password);
  }
}
