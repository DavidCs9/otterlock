import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password });
  }
}
