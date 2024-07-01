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
  passwords: WritableSignal<Password[]> = signal([]);
  copyPasswords: WritableSignal<Password[]> = signal([]);
  addPasswordDialog!: HTMLDialogElement;

  constructor(private passwordsService: PasswordsService) {}

  ngOnInit(): void {
    this.loadingPasswords.set(true);
    this.getPasswords();
    this.addPasswordDialog = document.querySelector('#addPasswordDialog')!;
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

  deletePassword(id: string) {
    console.log('delete password');
  }

  logout() {
    console.log('logout');
  }

  closeDialog() {
    this.addPasswordDialog.close();
  }

  addOptimePassword(password: Password) {
    this.passwords.set([...this.passwords(), password]);
  }
}
