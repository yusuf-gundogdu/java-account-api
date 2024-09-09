import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IDiscountUsage {
  id: string;
  usageDate?: dayjs.Dayjs | null;
  totalDiscountAmount?: number | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewDiscountUsage = Omit<IDiscountUsage, 'id'> & { id: null };
