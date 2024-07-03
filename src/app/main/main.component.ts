import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { PasswordsService } from '../services/passwords.service';
import { PasswordsComponent } from '../ui/passwords/passwords.component';
import { Password } from '../interfaces/passwords.interface';
import { lastValueFrom } from 'rxjs';
import { AddPasswordComponent } from '../ui/add-password/add-password.component';
import { PasswordDetailsComponent } from '../ui/password-details/password-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [PasswordsComponent, AddPasswordComponent, PasswordDetailsComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainComponent implements OnInit {
  loadingPasswords = signal(false);
  passwords: WritableSignal<Password[]> = signal([]);
  copyPasswords: WritableSignal<Password[]> = signal([]);
  addPasswordDialog!: HTMLDialogElement;
  passwordDetailsDialog!: HTMLDialogElement;
  selectedPassword = signal(<Password>{});

  constructor(
    private passwordsService: PasswordsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadingPasswords.set(true);
    this.getPasswords();
    this.addPasswordDialog = document.querySelector('#addPasswordDialog')!;
    this.passwordDetailsDialog = document.querySelector(
      '#passwordDetailsDialog',
    )!;
  }

  async getPasswords() {
    const res = await lastValueFrom(this.passwordsService.getPasswords());
    this.passwords.set(res);
    this.copyPasswords.set(res);
    this.loadingPasswords.set(false);
  }

  search(event: any) {
    const search = event.target.value.toLowerCase(); // Convert search query to lowercase
    this.passwords.set(
      this.copyPasswords().filter((password) => {
        return password.site.toLowerCase().includes(search); // Convert site to lowercase for comparison
      }),
    );
  }

  openAddPassword() {
    this.addPasswordDialog.showModal();
  }

  deletePassword(password: Password) {
    this.passwords.set(
      this.passwords().filter((p) => p.site !== password.site),
    );
  }

  updatePassword(password: Password) {
    this.passwords.set(
      this.passwords().map((p) => {
        if (p.site === password.site) {
          return password;
        }
        return p;
      }),
    );
  }

  logout() {
    setTimeout(() => {
      sessionStorage.removeItem('token');
      this.router.navigate(['/auth/login']);
    }, 1000);
  }

  closeDialog() {
    this.addPasswordDialog.close();
    this.passwordDetailsDialog.close();
  }

  addOptimePassword(password: Password) {
    this.passwords.set([...this.passwords(), password]);
  }

  openPasswordDetails(password: Password) {
    this.selectedPassword.set(password);
    this.passwordDetailsDialog.showModal();
  }
}
