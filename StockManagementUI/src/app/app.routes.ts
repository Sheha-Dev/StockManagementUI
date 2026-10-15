
import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { RequestList } from './pages/request-list/request-list';
import { RequestForm } from './pages/request-form/request-form';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: RequestList
      },
      {
        path: 'request',
        component: RequestForm,
        data: { mode: 'request' }
      },
      {
        path: 'dispatch/:requestId',
        component: RequestForm,
        data: { mode: 'dispatch' }
      },
      {
        path: 'received/:requestId',
        component: RequestForm,
        data: { mode: 'received' }
      },
      {
        path: 'cancelled/:requestId',
        component: RequestForm,
        data: { mode: 'cancelled' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'list'
  }
];
