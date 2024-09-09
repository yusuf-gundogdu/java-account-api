import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../discount-usage.test-samples';

import { DiscountUsageFormService } from './discount-usage-form.service';

describe('DiscountUsage Form Service', () => {
  let service: DiscountUsageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountUsageFormService);
  });

  describe('Service methods', () => {
    describe('createDiscountUsageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDiscountUsageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            usageDate: expect.any(Object),
            totalDiscountAmount: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IDiscountUsage should create a new form with FormGroup', () => {
        const formGroup = service.createDiscountUsageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            usageDate: expect.any(Object),
            totalDiscountAmount: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getDiscountUsage', () => {
      it('should return NewDiscountUsage for default DiscountUsage initial value', () => {
        const formGroup = service.createDiscountUsageFormGroup(sampleWithNewData);

        const discountUsage = service.getDiscountUsage(formGroup) as any;

        expect(discountUsage).toMatchObject(sampleWithNewData);
      });

      it('should return NewDiscountUsage for empty DiscountUsage initial value', () => {
        const formGroup = service.createDiscountUsageFormGroup();

        const discountUsage = service.getDiscountUsage(formGroup) as any;

        expect(discountUsage).toMatchObject({});
      });

      it('should return IDiscountUsage', () => {
        const formGroup = service.createDiscountUsageFormGroup(sampleWithRequiredData);

        const discountUsage = service.getDiscountUsage(formGroup) as any;

        expect(discountUsage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDiscountUsage should not enable id FormControl', () => {
        const formGroup = service.createDiscountUsageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDiscountUsage should disable id FormControl', () => {
        const formGroup = service.createDiscountUsageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
