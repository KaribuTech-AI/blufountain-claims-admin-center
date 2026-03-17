import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'screen/dashboard-screen',
  },
  {
    path: 'screen/:screenId',
    loadComponent: () =>
      import('./features/prototype/prototype-shell.component').then((m) => m.PrototypeShellComponent),
  },
  {
    path: '**',
    redirectTo: 'screen/dashboard-screen',
  },
];
