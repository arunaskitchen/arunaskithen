export type ProductCategory =
  | 'Snacks'
  | 'Sweets'
  | 'Karjikay'
  | 'Karam & Spices'
  | 'Pickles'
  | 'Farm Products'
  | 'Packages';

export type ProductWeight = '250g' | '500g' | '1kg';

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  unit: string;
  category: ProductCategory;
  image: string;
  description: string;
  available: boolean;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
}

export interface PackageItem {
  name: string;
  weight: string;
  image: string;
}

export interface PackageOffer extends Product {
  subtitle: string;
  originalPrice: number;
  totalWeight: string;
  packageItems: PackageItem[];
}
