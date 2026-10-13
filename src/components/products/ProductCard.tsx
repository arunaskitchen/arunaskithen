'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import type { Product, ProductWeight } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { getProductPriceForWeight } from '@/data/products';
import QuantitySelector from './QuantitySelector';

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const [added, setAdded] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState<ProductWeight>('1kg');

  const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    items,
  } = useCart();

  const currentPrice = getProductPriceForWeight(product.price, selectedWeight);

  // Find the product variant in the cart
  const cartItem = items.find(
    (item) => item.productId === product.id && item.unit === selectedWeight
  );

  const isInCart = Boolean(cartItem && cartItem.quantity > 0);

  /*
   * ADD TO CART
   * Adds selected weight variant to cart on click.
   */
  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(product, 1, e?.currentTarget, selectedWeight, currentPrice);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
    }, 1000);
  };

  /*
   * PLUS BUTTON
   */
  const handleIncrease = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (!cartItem) return;
    increaseQuantity(product.id, selectedWeight, e?.currentTarget);
  };

  /*
   * MINUS BUTTON
   * When quantity is 1 or reaches 0, removes the product from the cart completely,
   * reverting back to the "Add to Cart" button.
   */
  const handleDecrease = () => {
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      removeFromCart(product.id, selectedWeight);
      return;
    }

    decreaseQuantity(product.id, selectedWeight);
  };

  return (
    <article className="product-card">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="product-image-wrap"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.image}
          alt={`Traditional homemade ${product.name}`}
          fill
          sizes="(max-width: 600px) 45vw, (max-width: 1000px) 30vw, 23vw"
          className="product-image"
        />

        <span className="product-category">
          {product.category}
        </span>
      </Link>

      {/* Product Details */}
      <div className="product-body">
        {/* Product Name */}
        <Link
          href={`/products/${product.slug}`}
          className="product-name"
        >
          {product.name}
        </Link>

        {/* Price & Weight Selector Row */}
        <div className="product-price-row">
          <div className="price-line">
            <strong>
              {formatCurrency(currentPrice)}
            </strong>
            <span>/ {selectedWeight === '1kg' ? '1 kg' : selectedWeight}</span>
          </div>

          <div className="weight-selector" role="group" aria-label="Select quantity/weight">
            <button
              type="button"
              className={`weight-btn ${selectedWeight === '250g' ? 'active' : ''}`}
              onClick={() => setSelectedWeight('250g')}
              aria-pressed={selectedWeight === '250g'}
            >
              250g
            </button>
            <button
              type="button"
              className={`weight-btn ${selectedWeight === '500g' ? 'active' : ''}`}
              onClick={() => setSelectedWeight('500g')}
              aria-pressed={selectedWeight === '500g'}
            >
              500g
            </button>
            <button
              type="button"
              className={`weight-btn ${selectedWeight === '1kg' ? 'active' : ''}`}
              onClick={() => setSelectedWeight('1kg')}
              aria-pressed={selectedWeight === '1kg'}
            >
              1kg
            </button>
          </div>
        </div>

        {/* =========================================
            CART CONTROLS
           ========================================= */}
        {!isInCart ? (
          /*
           * INITIAL STATE (Quantity = 0 / not in cart)
           * Only Add to Cart is displayed.
           */
          <button
            type="button"
            className={`add-button ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            {added ? (
              'Added to Cart'
            ) : (
              <>
                <ShoppingCart size={16} />
                Add to Cart
              </>
            )}
          </button>
        ) : (
          /*
           * PRODUCT IS IN CART (Quantity > 0)
           * Shows Quantity Selector and changes Add to Cart to View in Cart!
           */
          <div className="product-cart-controls">
            {/* Quantity */}
            <QuantitySelector
              quantity={cartItem?.quantity ?? 1}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
            />

            {/* View in Cart button - opens the cart page */}
            <Link
              href="/cart"
              className="add-button view-cart-button"
              aria-label={`View ${product.name} in cart`}
            >
              <ShoppingBag size={15} />
              View in Cart
            </Link>
          </div>
        )}

        {/* Unavailable */}
        {!product.available && (
          <small className="unavailable">
            Currently Unavailable
          </small>
        )}
      </div>
    </article>
  );
}