import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./modules/products/products.routes').then(
        (r) => r.PRODUCTS_ROUTES
      ),
  },
  {
    path: 'counter',
    loadChildren: () =>
      import('./modules/counter/counter.routes').then((r) => r.COUNTER_ROUTES),
  },
  {
    path: 'todos',
    loadChildren: () =>
      import('./modules/todos/todos.routes').then((r) => r.TODOS_ROUTES),
  },
];
