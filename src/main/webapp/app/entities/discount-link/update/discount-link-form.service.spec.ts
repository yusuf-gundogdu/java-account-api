import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../discount-link.test-samples';

import { DiscountLinkFormService } from './discount-link-form.service';

describe('DiscountLink Form Service', () => {
  let service: DiscountLinkFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountLinkFormService);
  });

  describe('Service methods', () => {
    describe('createDiscountLinkFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDiscountLinkFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            discountAmount: expect.any(Object),
            accountedPrice: expect.any(Object),
            date: expect.any(Object),
            discountUsage: expect.any(Object),
            company: expect.any(Object),
          }),
        );
      });

      it('passing IDiscountLink should create a new form with FormGroup', () => {
        const formGroup = service.createDiscountLinkFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            discountAmount: expect.any(Object),
            accountedPrice: expect.any(Object),
            date: expect.any(Object),
            discountUsage: expect.any(Object),
            company: expect.any(Object),
          }),
        );
      });
    });

    describe('getDiscountLink', () => {
      it('should return NewDiscountLink for default DiscountLink initial value', () => {
        const formGroup = service.createDiscountLinkFormGroup(sampleWithNewData);

        const discountLink = service.getDiscountLink(formGroup) as any;

        expect(discountLink).toMatchObject(sampleWithNewData);
      });

      it('should return NewDiscountLink for empty DiscountLink initial value', () => {
        const formGroup = service.createDiscountLinkFormGroup();

        const discountLink = service.getDiscountLink(formGroup) as any;

        expect(discountLink).toMatchObject({});
      });

      it('should return IDiscountLink', () => {
        const formGroup = service.createDiscountLinkFormGroup(sampleWithRequiredData);

        const discountLink = service.getDiscountLink(formGroup) as any;

        expect(discountLink).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDiscountLink should not enable id FormControl', () => {
        const formGroup = service.createDiscountLinkFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDiscountLink should disable id FormControl', () => {
        const formGroup = service.createDiscountLinkFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
