import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserRating, NewUserRating } from '../user-rating.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserRating for edit and NewUserRatingFormGroupInput for create.
 */
type UserRatingFormGroupInput = IUserRating | PartialWithRequiredKeyOf<NewUserRating>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUserRating | NewUserRating> = Omit<T, 'reviewDate'> & {
  reviewDate?: string | null;
};

type UserRatingFormRawValue = FormValueOf<IUserRating>;

type NewUserRatingFormRawValue = FormValueOf<NewUserRating>;

type UserRatingFormDefaults = Pick<NewUserRating, 'id' | 'reviewDate'>;

type UserRatingFormGroupContent = {
  id: FormControl<UserRatingFormRawValue['id'] | NewUserRating['id']>;
  rating: FormControl<UserRatingFormRawValue['rating']>;
  reviewDate: FormControl<UserRatingFormRawValue['reviewDate']>;
  user: FormControl<UserRatingFormRawValue['user']>;
  company: FormControl<UserRatingFormRawValue['company']>;
};

export type UserRatingFormGroup = FormGroup<UserRatingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserRatingFormService {
  createUserRatingFormGroup(userRating: UserRatingFormGroupInput = { id: null }): UserRatingFormGroup {
    const userRatingRawValue = this.convertUserRatingToUserRatingRawValue({
      ...this.getFormDefaults(),
      ...userRating,
    });
    return new FormGroup<UserRatingFormGroupContent>({
      id: new FormControl(
        { value: userRatingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      rating: new FormControl(userRatingRawValue.rating),
      reviewDate: new FormControl(userRatingRawValue.reviewDate),
      user: new FormControl(userRatingRawValue.user),
      company: new FormControl(userRatingRawValue.company),
    });
  }

  getUserRating(form: UserRatingFormGroup): IUserRating | NewUserRating {
    return this.convertUserRatingRawValueToUserRating(form.getRawValue() as UserRatingFormRawValue | NewUserRatingFormRawValue);
  }

  resetForm(form: UserRatingFormGroup, userRating: UserRatingFormGroupInput): void {
    const userRatingRawValue = this.convertUserRatingToUserRatingRawValue({ ...this.getFormDefaults(), ...userRating });
    form.reset(
      {
        ...userRatingRawValue,
        id: { value: userRatingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UserRatingFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      reviewDate: currentTime,
    };
  }

  private convertUserRatingRawValueToUserRating(
    rawUserRating: UserRatingFormRawValue | NewUserRatingFormRawValue,
  ): IUserRating | NewUserRating {
    return {
      ...rawUserRating,
      reviewDate: dayjs(rawUserRating.reviewDate, DATE_TIME_FORMAT),
    };
  }

  private convertUserRatingToUserRatingRawValue(
    userRating: IUserRating | (Partial<NewUserRating> & UserRatingFormDefaults),
  ): UserRatingFormRawValue | PartialWithRequiredKeyOf<NewUserRatingFormRawValue> {
    return {
      ...userRating,
      reviewDate: userRating.reviewDate ? userRating.reviewDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
