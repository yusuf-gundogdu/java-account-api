export interface ICompany {
  id: string;
  name?: string | null;
  address?: string | null;
  rating?: number | null;
  discountPercentage?: number | null;
  advertising?: boolean | null;
  discountActive?: boolean | null;
}

export type NewCompany = Omit<ICompany, 'id'> & { id: null };
