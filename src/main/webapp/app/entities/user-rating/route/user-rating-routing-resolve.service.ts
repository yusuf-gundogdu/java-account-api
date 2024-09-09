import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserRating } from '../user-rating.model';
import { UserRatingService } from '../service/user-rating.service';

const userRatingResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserRating> => {
  const id = route.params.id;
  if (id) {
    return inject(UserRatingService)
      .find(id)
      .pipe(
        mergeMap((userRating: HttpResponse<IUserRating>) => {
          if (userRating.body) {
            return of(userRating.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default userRatingResolve;
