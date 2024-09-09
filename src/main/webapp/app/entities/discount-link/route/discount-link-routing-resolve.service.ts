import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDiscountLink } from '../discount-link.model';
import { DiscountLinkService } from '../service/discount-link.service';

const discountLinkResolve = (route: ActivatedRouteSnapshot): Observable<null | IDiscountLink> => {
  const id = route.params.id;
  if (id) {
    return inject(DiscountLinkService)
      .find(id)
      .pipe(
        mergeMap((discountLink: HttpResponse<IDiscountLink>) => {
          if (discountLink.body) {
            return of(discountLink.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default discountLinkResolve;
