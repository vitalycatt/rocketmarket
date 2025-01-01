export type Category = {
  id: string;
  name: string;
  position: string;
  iconUrl: string | null;
  children: Category[];
};

export interface ProductSize {
  id: number;
  price: number;
  weight: number;
  size: string; // This is the size description like "1 блок", "1 коробка", etc.
  calories: number;
}

export interface ProductOptionDescription {
  id?: number;
  title: string;
  value: string;
  default: string;
}

export interface ProductOption {
  id: number;
  name: string;
  type: string;
  description: ProductOptionDescription[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  discountPercentage: number;
  unit: string;
  brand: string;
  size: ProductSize[];
  options: ProductOption[];
}

export interface UserResource {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  birthday: string | null;
}

export interface AuthContextType {
  user: UserResource | null;
  setUser: (user: UserResource | null) => void;
  isAuthenticated: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

export interface ProductsResponse {
  data: Product[];
}

export type ProductOptionValue = {
  id: number;
  value: string;
  priceModifier: number; // Изменение цены относительно базовой цены продукта
  default?: boolean; // Является ли это значение дефолтным для данной опции
};

export { SortOption } from "./api";
