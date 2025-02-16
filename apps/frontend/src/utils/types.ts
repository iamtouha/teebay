export type User = {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  phone?: string | null;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  Products: Product[];
  Borrowed: Product[];
  Bought: Product[];
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  rent: number;
  category: Category;
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

export enum Category {
  ELECTRONICS = 'ELECTRONICS',
  FURNITURE = 'FURNITURE',
  HOME_APPLIANCES = 'HOME_APPLIANCES',
  SPORTING_GOODS = 'SPORTING_GOODS',
  OUTDOOR = 'OUTDOOR',
  TOYS = 'TOYS',
}
