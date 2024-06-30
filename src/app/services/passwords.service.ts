import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Password } from '../interfaces/passwords.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordsService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getPasswords(token: string) {
    return this.http.get<Password[]>(`${this.apiUrl}/passwords`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
