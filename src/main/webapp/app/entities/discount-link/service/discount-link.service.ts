import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDiscountLink, NewDiscountLink } from '../discount-link.model';

export type PartialUpdateDiscountLink = Partial<IDiscountLink> & Pick<IDiscountLink, 'id'>;

type RestOf<T extends IDiscountLink | NewDiscountLink> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestDiscountLink = RestOf<IDiscountLink>;

export type NewRestDiscountLink = RestOf<NewDiscountLink>;

export type PartialUpdateRestDiscountLink = RestOf<PartialUpdateDiscountLink>;

export type EntityResponseType = HttpResponse<IDiscountLink>;
export type EntityArrayResponseType = HttpResponse<IDiscountLink[]>;

@Injectable({ providedIn: 'root' })
export class DiscountLinkService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/discount-links');

  create(discountLink: NewDiscountLink): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discountLink);
    return this.http
      .post<RestDiscountLink>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(discountLink: IDiscountLink): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discountLink);
    return this.http
      .put<RestDiscountLink>(`${this.resourceUrl}/${this.getDiscountLinkIdentifier(discountLink)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(discountLink: PartialUpdateDiscountLink): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discountLink);
    return this.http
      .patch<RestDiscountLink>(`${this.resourceUrl}/${this.getDiscountLinkIdentifier(discountLink)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestDiscountLink>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDiscountLink[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDiscountLinkIdentifier(discountLink: Pick<IDiscountLink, 'id'>): string {
    return discountLink.id;
  }

  compareDiscountLink(o1: Pick<IDiscountLink, 'id'> | null, o2: Pick<IDiscountLink, 'id'> | null): boolean {
    return o1 && o2 ? this.getDiscountLinkIdentifier(o1) === this.getDiscountLinkIdentifier(o2) : o1 === o2;
  }

  addDiscountLinkToCollectionIfMissing<Type extends Pick<IDiscountLink, 'id'>>(
    discountLinkCollection: Type[],
    ...discountLinksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const discountLinks: Type[] = discountLinksToCheck.filter(isPresent);
    if (discountLinks.length > 0) {
      const discountLinkCollectionIdentifiers = discountLinkCollection.map(discountLinkItem =>
        this.getDiscountLinkIdentifier(discountLinkItem),
      );
      const discountLinksToAdd = discountLinks.filter(discountLinkItem => {
        const discountLinkIdentifier = this.getDiscountLinkIdentifier(discountLinkItem);
        if (discountLinkCollectionIdentifiers.includes(discountLinkIdentifier)) {
          return false;
        }
        discountLinkCollectionIdentifiers.push(discountLinkIdentifier);
        return true;
      });
      return [...discountLinksToAdd, ...discountLinkCollection];
    }
    return discountLinkCollection;
  }

  protected convertDateFromClient<T extends IDiscountLink | NewDiscountLink | PartialUpdateDiscountLink>(discountLink: T): RestOf<T> {
    return {
      ...discountLink,
      date: discountLink.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDiscountLink: RestDiscountLink): IDiscountLink {
    return {
      ...restDiscountLink,
      date: restDiscountLink.date ? dayjs(restDiscountLink.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDiscountLink>): HttpResponse<IDiscountLink> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDiscountLink[]>): HttpResponse<IDiscountLink[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
