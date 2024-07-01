import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  CreatePasswordBody,
  Password,
} from '../interfaces/passwords.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordsService {
  apiUrl = environment.apiUrl;
  token = signal('');
  constructor(private http: HttpClient) {
    this.token.set(sessionStorage.getItem('token')!);
  }

  getPasswords() {
    return this.http.get<Password[]>(`${this.apiUrl}/passwords`, {
      headers: {
        Authorization: `Bearer ${this.token()}`,
      },
    });
  }

  addPassword(body: CreatePasswordBody) {
    return this.http.post<Password>(`${this.apiUrl}/passwords`, body, {
      headers: {
        Authorization: `Bearer ${this.token()}`,
      },
    });
  }
}
