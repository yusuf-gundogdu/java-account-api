import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDiscountUsage, NewDiscountUsage } from '../discount-usage.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDiscountUsage for edit and NewDiscountUsageFormGroupInput for create.
 */
type DiscountUsageFormGroupInput = IDiscountUsage | PartialWithRequiredKeyOf<NewDiscountUsage>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDiscountUsage | NewDiscountUsage> = Omit<T, 'usageDate'> & {
  usageDate?: string | null;
};

type DiscountUsageFormRawValue = FormValueOf<IDiscountUsage>;

type NewDiscountUsageFormRawValue = FormValueOf<NewDiscountUsage>;

type DiscountUsageFormDefaults = Pick<NewDiscountUsage, 'id' | 'usageDate'>;

type DiscountUsageFormGroupContent = {
  id: FormControl<DiscountUsageFormRawValue['id'] | NewDiscountUsage['id']>;
  usageDate: FormControl<DiscountUsageFormRawValue['usageDate']>;
  totalDiscountAmount: FormControl<DiscountUsageFormRawValue['totalDiscountAmount']>;
  user: FormControl<DiscountUsageFormRawValue['user']>;
};

export type DiscountUsageFormGroup = FormGroup<DiscountUsageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DiscountUsageFormService {
  createDiscountUsageFormGroup(discountUsage: DiscountUsageFormGroupInput = { id: null }): DiscountUsageFormGroup {
    const discountUsageRawValue = this.convertDiscountUsageToDiscountUsageRawValue({
      ...this.getFormDefaults(),
      ...discountUsage,
    });
    return new FormGroup<DiscountUsageFormGroupContent>({
      id: new FormControl(
        { value: discountUsageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      usageDate: new FormControl(discountUsageRawValue.usageDate),
      totalDiscountAmount: new FormControl(discountUsageRawValue.totalDiscountAmount),
      user: new FormControl(discountUsageRawValue.user),
    });
  }

  getDiscountUsage(form: DiscountUsageFormGroup): IDiscountUsage | NewDiscountUsage {
    return this.convertDiscountUsageRawValueToDiscountUsage(form.getRawValue() as DiscountUsageFormRawValue | NewDiscountUsageFormRawValue);
  }

  resetForm(form: DiscountUsageFormGroup, discountUsage: DiscountUsageFormGroupInput): void {
    const discountUsageRawValue = this.convertDiscountUsageToDiscountUsageRawValue({ ...this.getFormDefaults(), ...discountUsage });
    form.reset(
      {
        ...discountUsageRawValue,
        id: { value: discountUsageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DiscountUsageFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      usageDate: currentTime,
    };
  }

  private convertDiscountUsageRawValueToDiscountUsage(
    rawDiscountUsage: DiscountUsageFormRawValue | NewDiscountUsageFormRawValue,
  ): IDiscountUsage | NewDiscountUsage {
    return {
      ...rawDiscountUsage,
      usageDate: dayjs(rawDiscountUsage.usageDate, DATE_TIME_FORMAT),
    };
  }

  private convertDiscountUsageToDiscountUsageRawValue(
    discountUsage: IDiscountUsage | (Partial<NewDiscountUsage> & DiscountUsageFormDefaults),
  ): DiscountUsageFormRawValue | PartialWithRequiredKeyOf<NewDiscountUsageFormRawValue> {
    return {
      ...discountUsage,
      usageDate: discountUsage.usageDate ? discountUsage.usageDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
