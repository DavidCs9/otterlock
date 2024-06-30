import { Component, Input } from '@angular/core';
import { Password } from '../../interfaces/passwords.interface';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [],
  templateUrl: './passwords.component.html',
  styleUrl: './passwords.component.css',
})
export class PasswordsComponent {
  @Input() passwords: Password[] = [];
}
