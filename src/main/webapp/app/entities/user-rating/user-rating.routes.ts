import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import UserRatingResolve from './route/user-rating-routing-resolve.service';

const userRatingRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/user-rating.component').then(m => m.UserRatingComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/user-rating-detail.component').then(m => m.UserRatingDetailComponent),
    resolve: {
      userRating: UserRatingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/user-rating-update.component').then(m => m.UserRatingUpdateComponent),
    resolve: {
      userRating: UserRatingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/user-rating-update.component').then(m => m.UserRatingUpdateComponent),
    resolve: {
      userRating: UserRatingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userRatingRoute;
