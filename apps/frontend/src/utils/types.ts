import { Category } from 'validator';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  phone?: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
  Products?: Product[];
  Borrowed?: Product[];
  Bought?: Product[];
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  rent: number;
  categories: Category[];
  ownerId: number;
  soldToId?: number | null;
  soldAt?: string | null;
  createdAt: string;
  updatedAt: string;
  Owner: User;
  SoldTo?: User | null;
  Rent?: Rent[];
};

export type Rent = {
  id: number;
  createdAt: string;
  updatedAt: string;
  productId: number;
  userId: number;
  rentedAt: string;
  rentEnd: string;
};
