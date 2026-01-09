import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Projects } from './pages/projects/projects';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'projects' },
  { path: 'login', component: Login },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/projects/projects').then(m => m.Projects)
  },
  { path: '**', redirectTo: 'projects' },
];
