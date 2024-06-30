import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { PasswordsService } from '../services/passwords.service';
import { PasswordsComponent } from '../ui/passwords/passwords.component';
import { Password } from '../interfaces/passwords.interface';
import { lastValueFrom } from 'rxjs';
import { AddPasswordComponent } from '../ui/add-password/add-password.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [PasswordsComponent, AddPasswordComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  loadingPasswords = signal(false);
  token = signal('');
  passwords: WritableSignal<Password[]> = signal([]);
  copyPasswords: WritableSignal<Password[]> = signal([]);

  constructor(private passwordsService: PasswordsService) {
    this.token.set(sessionStorage.getItem('token')!);
  }

  ngOnInit(): void {
    this.loadingPasswords.set(true);
    this.getPasswords();
  }

  async getPasswords() {
    const res = await lastValueFrom(
      this.passwordsService.getPasswords(this.token()),
    );
    this.passwords.set(res);
    this.copyPasswords.set(res);
    this.loadingPasswords.set(false);
  }

  search(event: any) {
    console.log(this.copyPasswords());
    const search = event.target.value;
    this.passwords.set(
      this.copyPasswords().filter((password) => {
        return password.site.includes(search);
      }),
    );
  }

  addPassword() {
    console.log('add password');
  }

  deletePassword(id: string) {
    console.log('delete password');
  }

  logout() {
    console.log('logout');
  }

  closeDialog() {
    console.log('close dialog');
  }
}
