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

  updatePassword(id: string, body: CreatePasswordBody) {
    return this.http.put<Password>(`${this.apiUrl}/passwords/${id}`, body, {
      headers: {
        Authorization: `Bearer ${this.token()}`,
      },
    });
  }

  deletePassword(id: string) {
    return this.http.delete<Password>(`${this.apiUrl}/passwords/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token()}`,
      },
    });
  }
}
