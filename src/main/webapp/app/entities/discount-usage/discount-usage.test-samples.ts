import dayjs from 'dayjs/esm';

import { IDiscountUsage, NewDiscountUsage } from './discount-usage.model';

export const sampleWithRequiredData: IDiscountUsage = {
  id: '96d5520d-8a62-475f-aa7a-e1b70e55461f',
};

export const sampleWithPartialData: IDiscountUsage = {
  id: '6b9817c0-47f1-4a56-ace2-a37f6a9195cd',
  totalDiscountAmount: 23096.91,
};

export const sampleWithFullData: IDiscountUsage = {
  id: '25247403-efb5-44f1-b4dc-ffe749a27e45',
  usageDate: dayjs('2024-09-09T02:02'),
  totalDiscountAmount: 17317.08,
};

export const sampleWithNewData: NewDiscountUsage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
