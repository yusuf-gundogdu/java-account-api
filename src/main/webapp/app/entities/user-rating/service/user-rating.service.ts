import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserRating, NewUserRating } from '../user-rating.model';

export type PartialUpdateUserRating = Partial<IUserRating> & Pick<IUserRating, 'id'>;

type RestOf<T extends IUserRating | NewUserRating> = Omit<T, 'reviewDate'> & {
  reviewDate?: string | null;
};

export type RestUserRating = RestOf<IUserRating>;

export type NewRestUserRating = RestOf<NewUserRating>;

export type PartialUpdateRestUserRating = RestOf<PartialUpdateUserRating>;

export type EntityResponseType = HttpResponse<IUserRating>;
export type EntityArrayResponseType = HttpResponse<IUserRating[]>;

@Injectable({ providedIn: 'root' })
export class UserRatingService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-ratings');

  create(userRating: NewUserRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userRating);
    return this.http
      .post<RestUserRating>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(userRating: IUserRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userRating);
    return this.http
      .put<RestUserRating>(`${this.resourceUrl}/${this.getUserRatingIdentifier(userRating)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(userRating: PartialUpdateUserRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userRating);
    return this.http
      .patch<RestUserRating>(`${this.resourceUrl}/${this.getUserRatingIdentifier(userRating)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestUserRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUserRating[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserRatingIdentifier(userRating: Pick<IUserRating, 'id'>): string {
    return userRating.id;
  }

  compareUserRating(o1: Pick<IUserRating, 'id'> | null, o2: Pick<IUserRating, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserRatingIdentifier(o1) === this.getUserRatingIdentifier(o2) : o1 === o2;
  }

  addUserRatingToCollectionIfMissing<Type extends Pick<IUserRating, 'id'>>(
    userRatingCollection: Type[],
    ...userRatingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userRatings: Type[] = userRatingsToCheck.filter(isPresent);
    if (userRatings.length > 0) {
      const userRatingCollectionIdentifiers = userRatingCollection.map(userRatingItem => this.getUserRatingIdentifier(userRatingItem));
      const userRatingsToAdd = userRatings.filter(userRatingItem => {
        const userRatingIdentifier = this.getUserRatingIdentifier(userRatingItem);
        if (userRatingCollectionIdentifiers.includes(userRatingIdentifier)) {
          return false;
        }
        userRatingCollectionIdentifiers.push(userRatingIdentifier);
        return true;
      });
      return [...userRatingsToAdd, ...userRatingCollection];
    }
    return userRatingCollection;
  }

  protected convertDateFromClient<T extends IUserRating | NewUserRating | PartialUpdateUserRating>(userRating: T): RestOf<T> {
    return {
      ...userRating,
      reviewDate: userRating.reviewDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUserRating: RestUserRating): IUserRating {
    return {
      ...restUserRating,
      reviewDate: restUserRating.reviewDate ? dayjs(restUserRating.reviewDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUserRating>): HttpResponse<IUserRating> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUserRating[]>): HttpResponse<IUserRating[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
