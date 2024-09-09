import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ICompany } from 'app/entities/company/company.model';

export interface IUserRating {
  id: string;
  rating?: number | null;
  reviewDate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
  company?: ICompany | null;
}

export type NewUserRating = Omit<IUserRating, 'id'> & { id: null };
