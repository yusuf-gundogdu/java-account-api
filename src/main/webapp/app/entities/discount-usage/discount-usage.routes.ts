import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import DiscountUsageResolve from './route/discount-usage-routing-resolve.service';

const discountUsageRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/discount-usage.component').then(m => m.DiscountUsageComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/discount-usage-detail.component').then(m => m.DiscountUsageDetailComponent),
    resolve: {
      discountUsage: DiscountUsageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/discount-usage-update.component').then(m => m.DiscountUsageUpdateComponent),
    resolve: {
      discountUsage: DiscountUsageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/discount-usage-update.component').then(m => m.DiscountUsageUpdateComponent),
    resolve: {
      discountUsage: DiscountUsageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default discountUsageRoute;
