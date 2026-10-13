'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { CartItem, Product } from '@/types/product';
import CartToast from '@/components/cart/CartToast';
import { triggerFlyToCartAnimation } from '@/lib/cartAnimation';

export interface ToastItem {
  id: string;
  product: Product;
  quantity: number;
  actionType?: 'added' | 'increased';
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    source?: HTMLElement | React.MouseEvent | TouchEvent | null,
    unit?: string,
    price?: number
  ) => void;
  removeFromCart: (productId: number, unit?: string) => void;
  increaseQuantity: (
    productId: number,
    unitOrSource?: string | HTMLElement | React.MouseEvent | TouchEvent | null,
    maybeSource?: HTMLElement | React.MouseEvent | TouchEvent | null
  ) => void;
  decreaseQuantity: (productId: number, unit?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  cartToast: ToastItem | null;
  closeCartToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartToast, setCartToast] = useState<ToastItem | null>(null);

  const closeCartToast = useCallback(() => {
    setCartToast(null);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('arunas-cart');
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('arunas-cart', JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      cartToast,
      closeCartToast,
      addToCart: (product, quantity = 1, source = null, unit, customPrice) => {
        const finalUnit = unit || product.unit || '1 kg';
        const finalPrice = customPrice !== undefined ? customPrice : product.price;

        setItems((current) => {
          const existing = current.find(
            (item) => item.productId === product.id && item.unit === finalUnit
          );
          if (existing) {
            return current.map((item) =>
              item.productId === product.id && item.unit === finalUnit
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [
            ...current,
            {
              productId: product.id,
              name: product.name,
              price: finalPrice,
              unit: finalUnit,
              quantity,
              image: product.image,
            },
          ];
        });

        // Trigger message notification
        setCartToast({
          id: `${product.id}-${finalUnit}-${Date.now()}`,
          product: {
            ...product,
            price: finalPrice,
            unit: finalUnit,
          },
          quantity,
          actionType: 'added',
        });

        // Trigger moving animation to cart icon (desktop top nav or mobile bottom nav)
        triggerFlyToCartAnimation(product.image, source);
      },
      removeFromCart: (productId, unit) =>
        setItems((current) =>
          current.filter(
            (item) =>
              !(item.productId === productId && (unit ? item.unit === unit : true))
          )
        ),
      increaseQuantity: (productId, unitOrSource = null, maybeSource = null) => {
        const unit = typeof unitOrSource === 'string' ? unitOrSource : undefined;
        const source = typeof unitOrSource === 'string' ? maybeSource : unitOrSource;

        let updatedItem: CartItem | undefined;

        setItems((current) =>
          current.map((item) => {
            if (item.productId === productId && (unit ? item.unit === unit : true)) {
              const updated = { ...item, quantity: item.quantity + 1 };
              updatedItem = updated;
              return updated;
            }
            return item;
          })
        );

        // Notify customer that quantity has been increased
        const itemToNotify =
          updatedItem ||
          items.find(
            (item) =>
              item.productId === productId && (unit ? item.unit === unit : true)
          );
        if (itemToNotify) {
          const nextQty = updatedItem
            ? updatedItem.quantity
            : itemToNotify.quantity + 1;
          setCartToast({
            id: `${productId}-${itemToNotify.unit}-${Date.now()}`,
            product: {
              id: itemToNotify.productId,
              name: itemToNotify.name,
              price: itemToNotify.price,
              unit: itemToNotify.unit,
              image: itemToNotify.image,
            } as Product,
            quantity: nextQty,
            actionType: 'increased',
          });

          // Trigger moving animation to cart icon
          triggerFlyToCartAnimation(itemToNotify.image, source);
        }
      },
      decreaseQuantity: (productId, unit) =>
        setItems((current) =>
          current.map((item) =>
            item.productId === productId && (unit ? item.unit === unit : true)
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          )
        ),
      clearCart: () => {
        setItems([]);
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('arunas-cart');
          }
        } catch {
          // ignore
        }
      },
      getCartTotal: () =>
        items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getCartItemCount: () =>
        items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [items, cartToast, closeCartToast]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartToast toast={cartToast} onClose={closeCartToast} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}

