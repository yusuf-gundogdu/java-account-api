import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IUserRating } from '../user-rating.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../user-rating.test-samples';

import { RestUserRating, UserRatingService } from './user-rating.service';

const requireRestSample: RestUserRating = {
  ...sampleWithRequiredData,
  reviewDate: sampleWithRequiredData.reviewDate?.toJSON(),
};

describe('UserRating Service', () => {
  let service: UserRatingService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserRating | IUserRating[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(UserRatingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a UserRating', () => {
      const userRating = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userRating).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserRating', () => {
      const userRating = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userRating).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserRating', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserRating', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserRating', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserRatingToCollectionIfMissing', () => {
      it('should add a UserRating to an empty array', () => {
        const userRating: IUserRating = sampleWithRequiredData;
        expectedResult = service.addUserRatingToCollectionIfMissing([], userRating);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userRating);
      });

      it('should not add a UserRating to an array that contains it', () => {
        const userRating: IUserRating = sampleWithRequiredData;
        const userRatingCollection: IUserRating[] = [
          {
            ...userRating,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserRatingToCollectionIfMissing(userRatingCollection, userRating);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserRating to an array that doesn't contain it", () => {
        const userRating: IUserRating = sampleWithRequiredData;
        const userRatingCollection: IUserRating[] = [sampleWithPartialData];
        expectedResult = service.addUserRatingToCollectionIfMissing(userRatingCollection, userRating);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userRating);
      });

      it('should add only unique UserRating to an array', () => {
        const userRatingArray: IUserRating[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userRatingCollection: IUserRating[] = [sampleWithRequiredData];
        expectedResult = service.addUserRatingToCollectionIfMissing(userRatingCollection, ...userRatingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userRating: IUserRating = sampleWithRequiredData;
        const userRating2: IUserRating = sampleWithPartialData;
        expectedResult = service.addUserRatingToCollectionIfMissing([], userRating, userRating2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userRating);
        expect(expectedResult).toContain(userRating2);
      });

      it('should accept null and undefined values', () => {
        const userRating: IUserRating = sampleWithRequiredData;
        expectedResult = service.addUserRatingToCollectionIfMissing([], null, userRating, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userRating);
      });

      it('should return initial array if no UserRating is added', () => {
        const userRatingCollection: IUserRating[] = [sampleWithRequiredData];
        expectedResult = service.addUserRatingToCollectionIfMissing(userRatingCollection, undefined, null);
        expect(expectedResult).toEqual(userRatingCollection);
      });
    });

    describe('compareUserRating', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserRating(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareUserRating(entity1, entity2);
        const compareResult2 = service.compareUserRating(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareUserRating(entity1, entity2);
        const compareResult2 = service.compareUserRating(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareUserRating(entity1, entity2);
        const compareResult2 = service.compareUserRating(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
