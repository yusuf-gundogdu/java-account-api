import dayjs from 'dayjs/esm';

import { IDiscountLink, NewDiscountLink } from './discount-link.model';

export const sampleWithRequiredData: IDiscountLink = {
  id: '308fdf23-1871-4048-a7f4-0ece7a2c5a2f',
};

export const sampleWithPartialData: IDiscountLink = {
  id: '45a8e250-88b1-4b8b-b50b-8225c747dbd5',
  discountAmount: 24203.15,
};

export const sampleWithFullData: IDiscountLink = {
  id: 'ff083e1d-23ff-4de1-ae5f-8a4b4e8ec79a',
  discountAmount: 32157.04,
  accountedPrice: 17388.89,
  date: dayjs('2024-09-09T06:47'),
};

export const sampleWithNewData: NewDiscountLink = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
