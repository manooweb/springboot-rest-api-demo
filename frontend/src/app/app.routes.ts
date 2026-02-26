import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { authGuard } from './services/auth-guard';
import { LegalPageComponent } from './pages/legal/page';
import { legalHtmlResolver } from './legal/resolvers/legal-pages';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'projects' },
  { path: 'login', component: Login },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/projects/projects').then(m => m.Projects)
  },
  {
    path: 'projects/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/project-detail/project-detail').then(m => m.ProjectDetail)
  },
  {
    path: 'legal-notice',
    component: LegalPageComponent,
    resolve: { html: legalHtmlResolver('legalNotice') },
  },
  {
    path: 'privacy-policy',
    component: LegalPageComponent,
    resolve: { html: legalHtmlResolver('privacyPolicy') },
  },
  { path: '**', redirectTo: 'projects' },
];
