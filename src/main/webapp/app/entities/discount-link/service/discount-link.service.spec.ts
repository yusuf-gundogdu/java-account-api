import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IDiscountLink } from '../discount-link.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../discount-link.test-samples';

import { DiscountLinkService, RestDiscountLink } from './discount-link.service';

const requireRestSample: RestDiscountLink = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('DiscountLink Service', () => {
  let service: DiscountLinkService;
  let httpMock: HttpTestingController;
  let expectedResult: IDiscountLink | IDiscountLink[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DiscountLinkService);
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

    it('should create a DiscountLink', () => {
      const discountLink = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(discountLink).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DiscountLink', () => {
      const discountLink = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(discountLink).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DiscountLink', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DiscountLink', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DiscountLink', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDiscountLinkToCollectionIfMissing', () => {
      it('should add a DiscountLink to an empty array', () => {
        const discountLink: IDiscountLink = sampleWithRequiredData;
        expectedResult = service.addDiscountLinkToCollectionIfMissing([], discountLink);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(discountLink);
      });

      it('should not add a DiscountLink to an array that contains it', () => {
        const discountLink: IDiscountLink = sampleWithRequiredData;
        const discountLinkCollection: IDiscountLink[] = [
          {
            ...discountLink,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDiscountLinkToCollectionIfMissing(discountLinkCollection, discountLink);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DiscountLink to an array that doesn't contain it", () => {
        const discountLink: IDiscountLink = sampleWithRequiredData;
        const discountLinkCollection: IDiscountLink[] = [sampleWithPartialData];
        expectedResult = service.addDiscountLinkToCollectionIfMissing(discountLinkCollection, discountLink);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(discountLink);
      });

      it('should add only unique DiscountLink to an array', () => {
        const discountLinkArray: IDiscountLink[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const discountLinkCollection: IDiscountLink[] = [sampleWithRequiredData];
        expectedResult = service.addDiscountLinkToCollectionIfMissing(discountLinkCollection, ...discountLinkArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const discountLink: IDiscountLink = sampleWithRequiredData;
        const discountLink2: IDiscountLink = sampleWithPartialData;
        expectedResult = service.addDiscountLinkToCollectionIfMissing([], discountLink, discountLink2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(discountLink);
        expect(expectedResult).toContain(discountLink2);
      });

      it('should accept null and undefined values', () => {
        const discountLink: IDiscountLink = sampleWithRequiredData;
        expectedResult = service.addDiscountLinkToCollectionIfMissing([], null, discountLink, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(discountLink);
      });

      it('should return initial array if no DiscountLink is added', () => {
        const discountLinkCollection: IDiscountLink[] = [sampleWithRequiredData];
        expectedResult = service.addDiscountLinkToCollectionIfMissing(discountLinkCollection, undefined, null);
        expect(expectedResult).toEqual(discountLinkCollection);
      });
    });

    describe('compareDiscountLink', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDiscountLink(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareDiscountLink(entity1, entity2);
        const compareResult2 = service.compareDiscountLink(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareDiscountLink(entity1, entity2);
        const compareResult2 = service.compareDiscountLink(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareDiscountLink(entity1, entity2);
        const compareResult2 = service.compareDiscountLink(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
