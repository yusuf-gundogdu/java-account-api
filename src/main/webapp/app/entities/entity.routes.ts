import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'jhtestApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'discount-usage',
    data: { pageTitle: 'jhtestApp.discountUsage.home.title' },
    loadChildren: () => import('./discount-usage/discount-usage.routes'),
  },
  {
    path: 'discount-link',
    data: { pageTitle: 'jhtestApp.discountLink.home.title' },
    loadChildren: () => import('./discount-link/discount-link.routes'),
  },
  {
    path: 'user-rating',
    data: { pageTitle: 'jhtestApp.userRating.home.title' },
    loadChildren: () => import('./user-rating/user-rating.routes'),
  },
  {
    path: 'company',
    data: { pageTitle: 'jhtestApp.company.home.title' },
    loadChildren: () => import('./company/company.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
