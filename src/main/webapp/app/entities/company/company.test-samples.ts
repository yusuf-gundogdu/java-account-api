import { ICompany, NewCompany } from './company.model';

export const sampleWithRequiredData: ICompany = {
  id: 'f79d9fa3-1d75-4b65-9335-2c1f6c9b8e3b',
};

export const sampleWithPartialData: ICompany = {
  id: '33efc59b-a66a-46fe-bc22-c5064988ff77',
  name: 'masonry',
  address: 'kindheartedly meanwhile whoever',
  advertising: false,
};

export const sampleWithFullData: ICompany = {
  id: 'febce41d-5777-4245-8c88-e66f1e97c54c',
  name: 'adolescent',
  address: 'uselessly gorgeous',
  rating: 9356.67,
  discountPercentage: 4734.43,
  advertising: true,
  discountActive: true,
};

export const sampleWithNewData: NewCompany = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
