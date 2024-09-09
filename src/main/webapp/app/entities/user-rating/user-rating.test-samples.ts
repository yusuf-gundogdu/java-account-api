import dayjs from 'dayjs/esm';

import { IUserRating, NewUserRating } from './user-rating.model';

export const sampleWithRequiredData: IUserRating = {
  id: '2f76f5fe-6f67-418e-9782-f0da700f7540',
};

export const sampleWithPartialData: IUserRating = {
  id: 'dabba32f-ef28-48a5-9762-7b8295a19db7',
  reviewDate: dayjs('2024-09-08T23:35'),
};

export const sampleWithFullData: IUserRating = {
  id: '8124116f-58a4-42cd-8a4f-f6b1329d9eba',
  rating: 27485.58,
  reviewDate: dayjs('2024-09-09T03:10'),
};

export const sampleWithNewData: NewUserRating = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
