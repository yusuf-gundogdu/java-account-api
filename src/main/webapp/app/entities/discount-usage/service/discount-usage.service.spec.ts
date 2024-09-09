import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IDiscountUsage } from '../discount-usage.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../discount-usage.test-samples';

import { DiscountUsageService, RestDiscountUsage } from './discount-usage.service';

const requireRestSample: RestDiscountUsage = {
  ...sampleWithRequiredData,
  usageDate: sampleWithRequiredData.usageDate?.toJSON(),
};

describe('DiscountUsage Service', () => {
  let service: DiscountUsageService;
  let httpMock: HttpTestingController;
  let expectedResult: IDiscountUsage | IDiscountUsage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DiscountUsageService);
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

    it('should create a DiscountUsage', () => {
      const discountUsage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(discountUsage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DiscountUsage', () => {
      const discountUsage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(discountUsage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DiscountUsage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DiscountUsage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DiscountUsage', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDiscountUsageToCollectionIfMissing', () => {
      it('should add a DiscountUsage to an empty array', () => {
        const discountUsage: IDiscountUsage = sampleWithRequiredData;
        expectedResult = service.addDiscountUsageToCollectionIfMissing([], discountUsage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(discountUsage);
      });

      it('should not add a DiscountUsage to an array that contains it', () => {
        const discountUsage: IDiscountUsage = sampleWithRequiredData;
        const discountUsageCollection: IDiscountUsage[] = [
          {
            ...discountUsage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDiscountUsageToCollectionIfMissing(discountUsageCollection, discountUsage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DiscountUsage to an array that doesn't contain it", () => {
        const discountUsage: IDiscountUsage = sampleWithRequiredData;
        const discountUsageCollection: IDiscountUsage[] = [sampleWithPartialData];
        expectedResult = service.addDiscountUsageToCollectionIfMissing(discountUsageCollection, discountUsage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(discountUsage);
      });

      it('should add only unique DiscountUsage to an array', () => {
        const discountUsageArray: IDiscountUsage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const discountUsageCollection: IDiscountUsage[] = [sampleWithRequiredData];
        expectedResult = service.addDiscountUsageToCollectionIfMissing(discountUsageCollection, ...discountUsageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const discountUsage: IDiscountUsage = sampleWithRequiredData;
        const discountUsage2: IDiscountUsage = sampleWithPartialData;
        expectedResult = service.addDiscountUsageToCollectionIfMissing([], discountUsage, discountUsage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(discountUsage);
        expect(expectedResult).toContain(discountUsage2);
      });

      it('should accept null and undefined values', () => {
        const discountUsage: IDiscountUsage = sampleWithRequiredData;
        expectedResult = service.addDiscountUsageToCollectionIfMissing([], null, discountUsage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(discountUsage);
      });

      it('should return initial array if no DiscountUsage is added', () => {
        const discountUsageCollection: IDiscountUsage[] = [sampleWithRequiredData];
        expectedResult = service.addDiscountUsageToCollectionIfMissing(discountUsageCollection, undefined, null);
        expect(expectedResult).toEqual(discountUsageCollection);
      });
    });

    describe('compareDiscountUsage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDiscountUsage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareDiscountUsage(entity1, entity2);
        const compareResult2 = service.compareDiscountUsage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareDiscountUsage(entity1, entity2);
        const compareResult2 = service.compareDiscountUsage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareDiscountUsage(entity1, entity2);
        const compareResult2 = service.compareDiscountUsage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
