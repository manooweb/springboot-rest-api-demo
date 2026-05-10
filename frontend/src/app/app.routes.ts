import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { authGuard } from './services/auth-guard';
import { LegalPageComponent } from './pages/legal/page';
import { legalHtmlResolver } from './legal/resolvers/legal-pages';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'projects' },
  { path: 'login', component: Login, data: { pageTitleKey: 'auth.login.title' } },
  {
    path: 'projects',
    canActivate: [authGuard],
    data: { pageTitleKey: 'projects.title.list' },
    loadComponent: () => import('./pages/projects/projects').then((m) => m.Projects),
  },
  {
    path: 'projects/:id',
    canActivate: [authGuard],
    data: { pageTitleKey: 'projects.title.detail' },
    loadComponent: () =>
      import('./pages/project-detail/project-detail').then((m) => m.ProjectDetail),
  },
  {
    path: 'legal-notice',
    component: LegalPageComponent,
    data: { pageTitleKey: 'legal.legalNotice.title' },
    resolve: { html: legalHtmlResolver('legalNotice') },
  },
  {
    path: 'privacy-policy',
    component: LegalPageComponent,
    data: { pageTitleKey: 'legal.privacyPolicy.title' },
    resolve: { html: legalHtmlResolver('privacyPolicy') },
  },
  { path: '**', redirectTo: 'projects' },
];
