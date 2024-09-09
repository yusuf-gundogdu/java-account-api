import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDiscountUsage } from '../discount-usage.model';
import { DiscountUsageService } from '../service/discount-usage.service';

const discountUsageResolve = (route: ActivatedRouteSnapshot): Observable<null | IDiscountUsage> => {
  const id = route.params.id;
  if (id) {
    return inject(DiscountUsageService)
      .find(id)
      .pipe(
        mergeMap((discountUsage: HttpResponse<IDiscountUsage>) => {
          if (discountUsage.body) {
            return of(discountUsage.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default discountUsageResolve;
