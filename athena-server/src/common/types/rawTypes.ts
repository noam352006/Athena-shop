import { Brands } from './basic-shoe.type';
import { UserRole } from './partialUser.type';

export type RawShoeItem = {
  id: string;
  size: number;
  dateCreated: string;
  shoe: {
    brand: Brands[];
    id: string;
    imgUrl: string;
    model: string;
    price: number;
    rating: number;
  };
  purchase?: {
    purchase_date?: string | null;
  } | null;
};

export type rawUser = {
  id: string;
  user_name: string;
  role: UserRole;
  date_created: string;
};
