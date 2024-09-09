import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 8433,
  login: 'X63@j8Pvz6\\c3U2-lq\\+rj\\hPIY',
};

export const sampleWithPartialData: IUser = {
  id: 25563,
  login: 'aetbZF@CNa7a\\:5k3\\95oQC\\rN-c8EP\\lUiIyF\\oxIM',
};

export const sampleWithFullData: IUser = {
  id: 11155,
  login: 'i1',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
