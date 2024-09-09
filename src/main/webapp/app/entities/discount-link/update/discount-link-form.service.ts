import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDiscountLink, NewDiscountLink } from '../discount-link.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDiscountLink for edit and NewDiscountLinkFormGroupInput for create.
 */
type DiscountLinkFormGroupInput = IDiscountLink | PartialWithRequiredKeyOf<NewDiscountLink>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDiscountLink | NewDiscountLink> = Omit<T, 'date'> & {
  date?: string | null;
};

type DiscountLinkFormRawValue = FormValueOf<IDiscountLink>;

type NewDiscountLinkFormRawValue = FormValueOf<NewDiscountLink>;

type DiscountLinkFormDefaults = Pick<NewDiscountLink, 'id' | 'date'>;

type DiscountLinkFormGroupContent = {
  id: FormControl<DiscountLinkFormRawValue['id'] | NewDiscountLink['id']>;
  discountAmount: FormControl<DiscountLinkFormRawValue['discountAmount']>;
  accountedPrice: FormControl<DiscountLinkFormRawValue['accountedPrice']>;
  date: FormControl<DiscountLinkFormRawValue['date']>;
  discountUsage: FormControl<DiscountLinkFormRawValue['discountUsage']>;
  company: FormControl<DiscountLinkFormRawValue['company']>;
};

export type DiscountLinkFormGroup = FormGroup<DiscountLinkFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DiscountLinkFormService {
  createDiscountLinkFormGroup(discountLink: DiscountLinkFormGroupInput = { id: null }): DiscountLinkFormGroup {
    const discountLinkRawValue = this.convertDiscountLinkToDiscountLinkRawValue({
      ...this.getFormDefaults(),
      ...discountLink,
    });
    return new FormGroup<DiscountLinkFormGroupContent>({
      id: new FormControl(
        { value: discountLinkRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      discountAmount: new FormControl(discountLinkRawValue.discountAmount),
      accountedPrice: new FormControl(discountLinkRawValue.accountedPrice),
      date: new FormControl(discountLinkRawValue.date),
      discountUsage: new FormControl(discountLinkRawValue.discountUsage),
      company: new FormControl(discountLinkRawValue.company),
    });
  }

  getDiscountLink(form: DiscountLinkFormGroup): IDiscountLink | NewDiscountLink {
    return this.convertDiscountLinkRawValueToDiscountLink(form.getRawValue() as DiscountLinkFormRawValue | NewDiscountLinkFormRawValue);
  }

  resetForm(form: DiscountLinkFormGroup, discountLink: DiscountLinkFormGroupInput): void {
    const discountLinkRawValue = this.convertDiscountLinkToDiscountLinkRawValue({ ...this.getFormDefaults(), ...discountLink });
    form.reset(
      {
        ...discountLinkRawValue,
        id: { value: discountLinkRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DiscountLinkFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertDiscountLinkRawValueToDiscountLink(
    rawDiscountLink: DiscountLinkFormRawValue | NewDiscountLinkFormRawValue,
  ): IDiscountLink | NewDiscountLink {
    return {
      ...rawDiscountLink,
      date: dayjs(rawDiscountLink.date, DATE_TIME_FORMAT),
    };
  }

  private convertDiscountLinkToDiscountLinkRawValue(
    discountLink: IDiscountLink | (Partial<NewDiscountLink> & DiscountLinkFormDefaults),
  ): DiscountLinkFormRawValue | PartialWithRequiredKeyOf<NewDiscountLinkFormRawValue> {
    return {
      ...discountLink,
      date: discountLink.date ? discountLink.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
