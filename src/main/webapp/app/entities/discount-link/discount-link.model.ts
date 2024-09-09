import dayjs from 'dayjs/esm';
import { IDiscountUsage } from 'app/entities/discount-usage/discount-usage.model';
import { ICompany } from 'app/entities/company/company.model';

export interface IDiscountLink {
  id: string;
  discountAmount?: number | null;
  accountedPrice?: number | null;
  date?: dayjs.Dayjs | null;
  discountUsage?: IDiscountUsage | null;
  company?: ICompany | null;
}

export type NewDiscountLink = Omit<IDiscountLink, 'id'> & { id: null };
