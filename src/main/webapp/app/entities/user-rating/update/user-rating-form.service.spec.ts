import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../user-rating.test-samples';

import { UserRatingFormService } from './user-rating-form.service';

describe('UserRating Form Service', () => {
  let service: UserRatingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRatingFormService);
  });

  describe('Service methods', () => {
    describe('createUserRatingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserRatingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            rating: expect.any(Object),
            reviewDate: expect.any(Object),
            user: expect.any(Object),
            company: expect.any(Object),
          }),
        );
      });

      it('passing IUserRating should create a new form with FormGroup', () => {
        const formGroup = service.createUserRatingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            rating: expect.any(Object),
            reviewDate: expect.any(Object),
            user: expect.any(Object),
            company: expect.any(Object),
          }),
        );
      });
    });

    describe('getUserRating', () => {
      it('should return NewUserRating for default UserRating initial value', () => {
        const formGroup = service.createUserRatingFormGroup(sampleWithNewData);

        const userRating = service.getUserRating(formGroup) as any;

        expect(userRating).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserRating for empty UserRating initial value', () => {
        const formGroup = service.createUserRatingFormGroup();

        const userRating = service.getUserRating(formGroup) as any;

        expect(userRating).toMatchObject({});
      });

      it('should return IUserRating', () => {
        const formGroup = service.createUserRatingFormGroup(sampleWithRequiredData);

        const userRating = service.getUserRating(formGroup) as any;

        expect(userRating).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserRating should not enable id FormControl', () => {
        const formGroup = service.createUserRatingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserRating should disable id FormControl', () => {
        const formGroup = service.createUserRatingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
