import type { Product, ProductWeight } from '@/types/product';

/**
 * Calculates the price for a given weight based on the 1 kg base price.
 * 250 g is 25% of the base price, 500 g is 50%, and 1 kg is 100%.
 */
export function getProductPriceForWeight(basePrice: number, weight: ProductWeight): number {
  if (weight === '250g') {
    return Math.round(basePrice * 0.25);
  }
  if (weight === '500g') {
    return Math.round(basePrice * 0.5);
  }
  return basePrice;
}

const descriptions: Record<string, string> = {
  Snacks:
    'Traditional homemade savoury snack prepared in the Rayalaseema style.',

  Sweets:
    'A comforting traditional sweet made for festive and everyday cravings.',

  Karjikay:
    'Crisp traditional karjikay with a classic homemade filling and texture.',

  'Karam & Spices':
    'Aromatic homemade spice blend prepared for authentic regional meals.',

  Pickles:
    'Bold, tangy and spicy homemade pickle with a traditional Andhra touch.',

  'Farm Products':
    'A carefully selected farm product from the Arunass Kitchen collection.',
};

/**
 * Creates a product object with exact image format.
 */
const make = (
  id: number,
  name: string,
  price: number,
  category: Product['category'],
  imageName: string,
  extension: 'svg' | 'png' | 'jpg' | 'jpeg' | 'webp' = 'jpeg',
  customDescription?: string,
): Product => ({
  id,
  name,
  slug: imageName,
  price,
  unit: '1 kg',
  category,
  image: `/images/products/${imageName}.${extension}`,
  description: customDescription || descriptions[category],
  available: true,
});

export const products: Product[] = [
  // =========================
  // SNACKS
  // =========================
  make(1, 'Chutallu', 349, 'Snacks', 'chutallu', 'jpeg'),
  make(2, 'Chakodillu', 349, 'Snacks', 'chakodillu', 'jpeg'),
  make(3, 'Chekkallu', 349, 'Snacks', 'chekkallu', 'jpeg'),
  make(4, 'Karam Chutallu', 349, 'Snacks', 'karam-chutallu', 'jpeg'),
  make(5, 'Karapusa', 389, 'Snacks', 'karapusa', 'jpeg'),
  make(6, 'Karam Gavallu', 349, 'Snacks', 'karam-gavallu', 'jpeg'),
  make(7, 'Majjigamirchi', 499, 'Snacks', 'majjigamirchi', 'jpeg'),
  make(8, 'Vaddiyallu', 349, 'Snacks', 'vaddiyallu', 'jpeg'),
  make(
    33,
    'Karam Boondi',
    349,
    'Snacks',
    'karam-boondi',
    'jpg',
    'Crispy and spicy traditional Rayalaseema Karam Boondi (Carom Boondi / Bundi) prepared with gram flour, roasted peanuts, cashews, and fresh curry leaves.'
  ),

  // =========================
  // SWEETS
  // =========================
  make(9, 'Sweet Gavallu', 349, 'Sweets', 'sweet-gavallu', 'jpeg'),
  make(10, 'Atharasallu', 449, 'Sweets', 'atharasallu', 'jpeg'),
  make(11, 'Nuvulla Laddu', 689, 'Sweets', 'nuvulla-laddu', 'jpeg'),
  make(12, 'Ravva Laddu', 449, 'Sweets', 'ravva-laddu', 'png'),
  make(13, 'Millet Laddu', 899, 'Sweets', 'millet-laddu', 'jpeg'),
  make(14, 'Ragi Laddu', 659, 'Sweets', 'ragi-laddu', 'jpeg'),
  make(15, 'Bumdi Laddu', 349, 'Sweets', 'bumdi-laddu', 'jpeg'),
  make(16, 'Sunundallu', 649, 'Sweets', 'sunundallu', 'jpeg'),
  make(17, 'Dry Fruit Laddu', 899, 'Sweets', 'dry-fruit-laddu', 'jpeg'),
  make(18, 'Flax Seed Laddu', 699, 'Sweets', 'flax-seed-laddu', 'png'),

  // =========================
  // KARJIKAY
  // =========================
  make(19, 'Karjakayyallu', 349, 'Karjikay', 'karjakayyallu', 'jpeg'),
  make(20, 'Nuvulla Karjakayyallu', 399, 'Karjikay', 'nuvulla-karjakayyallu', 'jpeg'),
  make(21, 'Kobari Karjakayyallu', 399, 'Karjikay', 'kobari-karjakayyallu', 'jpeg'),
  make(22, 'Palli Karjakayyallu', 399, 'Karjikay', 'palli-karjakayyallu', 'jpeg'),

  // =========================
  // KARAM & SPICES
  // =========================
  make(23, 'Palli Karam', 329, 'Karam & Spices', 'palli-karam', 'jpeg'),
  make(24, 'Nuvella Karam', 329, 'Karam & Spices', 'nuvella-karam', 'png'),
  make(25, 'Karivepaku Karam', 329, 'Karam & Spices', 'karivepaku-karam', 'jpeg'),
  make(26, 'Munagakku Karam', 399, 'Karam & Spices', 'munagakku-karam', 'jpeg'),
  make(27, 'Our Own Farm Chilly Powder', 459, 'Karam & Spices', 'chilly-powder', 'png'),
  make(28, 'Turmeric Powder', 399, 'Karam & Spices', 'turmeric-powder', 'png'),

  // =========================
  // PICKLES
  // =========================
  make(29, 'Lemon Pickle', 399, 'Pickles', 'lemon-pickle', 'jpeg'),
  make(30, 'Usrikaya Pickle', 399, 'Pickles', 'usrikaya-pickle', 'jpeg'),
  make(31, 'Mango Pickle', 399, 'Pickles', 'mango-pickle', 'jpeg'),

  // =========================
  // FARM PRODUCTS
  // =========================
  make(32, 'Our Own Farm Palli', 149, 'Farm Products', 'farm-palli', 'png'),
  make(
    34,
    'Pure Homemade Ghee',
    1699,
    'Farm Products',
    'pure-homemade-ghee',
    'jpg',
    'Pure homemade traditional ghee prepared using authentic curd-churning methods for rich aroma, golden grainy texture, and wholesome purity.'
  ),
];

import { packages } from './packages';

/**
 * Find a product or package offer using its slug.
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug) || packages.find((pkg) => pkg.slug === slug);
}