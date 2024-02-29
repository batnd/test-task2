import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pretty-table', pathMatch: 'full' },
  {
    path: 'pretty-table',
    loadComponent: () => import('@pages/pretty-table/components/pretty-table-container/pretty-table-container.component').then((c) => c.PrettyTableContainerComponent),
  },
  { path: '**', redirectTo: '' },
];
