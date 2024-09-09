import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import DiscountLinkResolve from './route/discount-link-routing-resolve.service';

const discountLinkRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/discount-link.component').then(m => m.DiscountLinkComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/discount-link-detail.component').then(m => m.DiscountLinkDetailComponent),
    resolve: {
      discountLink: DiscountLinkResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/discount-link-update.component').then(m => m.DiscountLinkUpdateComponent),
    resolve: {
      discountLink: DiscountLinkResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/discount-link-update.component').then(m => m.DiscountLinkUpdateComponent),
    resolve: {
      discountLink: DiscountLinkResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default discountLinkRoute;
