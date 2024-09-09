import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDiscountUsage, NewDiscountUsage } from '../discount-usage.model';

export type PartialUpdateDiscountUsage = Partial<IDiscountUsage> & Pick<IDiscountUsage, 'id'>;

type RestOf<T extends IDiscountUsage | NewDiscountUsage> = Omit<T, 'usageDate'> & {
  usageDate?: string | null;
};

export type RestDiscountUsage = RestOf<IDiscountUsage>;

export type NewRestDiscountUsage = RestOf<NewDiscountUsage>;

export type PartialUpdateRestDiscountUsage = RestOf<PartialUpdateDiscountUsage>;

export type EntityResponseType = HttpResponse<IDiscountUsage>;
export type EntityArrayResponseType = HttpResponse<IDiscountUsage[]>;

@Injectable({ providedIn: 'root' })
export class DiscountUsageService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/discount-usages');

  create(discountUsage: NewDiscountUsage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discountUsage);
    return this.http
      .post<RestDiscountUsage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(discountUsage: IDiscountUsage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discountUsage);
    return this.http
      .put<RestDiscountUsage>(`${this.resourceUrl}/${this.getDiscountUsageIdentifier(discountUsage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(discountUsage: PartialUpdateDiscountUsage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discountUsage);
    return this.http
      .patch<RestDiscountUsage>(`${this.resourceUrl}/${this.getDiscountUsageIdentifier(discountUsage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestDiscountUsage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDiscountUsage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDiscountUsageIdentifier(discountUsage: Pick<IDiscountUsage, 'id'>): string {
    return discountUsage.id;
  }

  compareDiscountUsage(o1: Pick<IDiscountUsage, 'id'> | null, o2: Pick<IDiscountUsage, 'id'> | null): boolean {
    return o1 && o2 ? this.getDiscountUsageIdentifier(o1) === this.getDiscountUsageIdentifier(o2) : o1 === o2;
  }

  addDiscountUsageToCollectionIfMissing<Type extends Pick<IDiscountUsage, 'id'>>(
    discountUsageCollection: Type[],
    ...discountUsagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const discountUsages: Type[] = discountUsagesToCheck.filter(isPresent);
    if (discountUsages.length > 0) {
      const discountUsageCollectionIdentifiers = discountUsageCollection.map(discountUsageItem =>
        this.getDiscountUsageIdentifier(discountUsageItem),
      );
      const discountUsagesToAdd = discountUsages.filter(discountUsageItem => {
        const discountUsageIdentifier = this.getDiscountUsageIdentifier(discountUsageItem);
        if (discountUsageCollectionIdentifiers.includes(discountUsageIdentifier)) {
          return false;
        }
        discountUsageCollectionIdentifiers.push(discountUsageIdentifier);
        return true;
      });
      return [...discountUsagesToAdd, ...discountUsageCollection];
    }
    return discountUsageCollection;
  }

  protected convertDateFromClient<T extends IDiscountUsage | NewDiscountUsage | PartialUpdateDiscountUsage>(discountUsage: T): RestOf<T> {
    return {
      ...discountUsage,
      usageDate: discountUsage.usageDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDiscountUsage: RestDiscountUsage): IDiscountUsage {
    return {
      ...restDiscountUsage,
      usageDate: restDiscountUsage.usageDate ? dayjs(restDiscountUsage.usageDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDiscountUsage>): HttpResponse<IDiscountUsage> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDiscountUsage[]>): HttpResponse<IDiscountUsage[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
