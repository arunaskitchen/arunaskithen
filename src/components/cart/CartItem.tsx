'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '../products/QuantitySelector';

export default function CartItem({ item }: { item: CartItemType }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const unitLabel = item.unit === 'Combo Pack' ? 'pack' : (item.unit || '1 kg');
  return (
    <article className="cart-item">
      <div className="cart-item-image">
        <Image src={item.image} alt={item.name} fill sizes="90px" />
      </div>
      <div className="cart-item-main">
        <div>
          <h3>{item.name}</h3>
          <p>{formatCurrency(item.price)} / {unitLabel}</p>
        </div>
        <button
          className="remove-button"
          onClick={() => removeFromCart(item.productId, item.unit)}
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 size={17} />
        </button>
        <div className="cart-item-bottom">
          <QuantitySelector
            quantity={item.quantity}
            onDecrease={() => decreaseQuantity(item.productId, item.unit)}
            onIncrease={(e) => increaseQuantity(item.productId, item.unit, e?.currentTarget)}
          />
          <strong>{formatCurrency(item.price * item.quantity)}</strong>
        </div>
      </div>
    </article>
  );
}

