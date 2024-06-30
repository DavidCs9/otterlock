import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './main/main.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'main',
    canActivate: [authGuard],
    component: MainComponent,
  },
];
