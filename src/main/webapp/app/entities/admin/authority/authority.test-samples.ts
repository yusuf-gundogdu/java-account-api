import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'ee410579-cc84-4f44-bbec-2b0fa306855f',
};

export const sampleWithPartialData: IAuthority = {
  name: '9814c939-d854-4303-8941-90bc185a9820',
};

export const sampleWithFullData: IAuthority = {
  name: '9df65db1-867b-400a-9996-fd642f77d88c',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
