import { Category } from 'validator';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  phone?: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
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
  rentedToId?: number | null;
  rentedAt?: Date | null;
  rentEndDate?: Date | null;
  soldToId?: number | null;
  soldAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  Owner: User;
  RentedTo?: User | null;
  SoldTo?: User | null;
};
