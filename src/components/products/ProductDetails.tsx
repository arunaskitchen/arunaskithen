'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

import type { Product, PackageOffer, ProductWeight } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { getProductPriceForWeight } from '@/data/products';
import QuantitySelector from './QuantitySelector';

export default function ProductDetails({
  product,
}: {
  product: Product;
}) {
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedWeight, setSelectedWeight] = useState<ProductWeight>('1kg');

  const isPackage =
    product.category === 'Packages' ||
    product.unit === 'Combo Pack' ||
    'packageItems' in (product as unknown as Record<string, unknown>);
  const packageOffer = isPackage ? (product as PackageOffer) : null;

  const currentPrice = isPackage
    ? product.price
    : getProductPriceForWeight(product.price, selectedWeight);
  const currentUnit = isPackage ? (product.unit || 'Combo Pack') : selectedWeight;

  const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    items,
  } = useCart();

  /*
   * Find this product variant inside the global cart.
   * Keeps product detail page synchronized with home and cart.
   */
  const cartItem = items.find(
    (item) =>
      item.productId === product.id &&
      (isPackage ? true : item.unit === selectedWeight)
  );

  const isInCart = Boolean(cartItem && cartItem.quantity > 0);

  /*
   * ADD TO CART
   */
  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(product, 1, e?.currentTarget, currentUnit, currentPrice);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
    }, 1000);
  };

  /*
   * PLUS
   */
  const handleIncrease = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (!cartItem) return;
    increaseQuantity(product.id, currentUnit, e?.currentTarget);
  };

  /*
   * MINUS
   * When quantity is 1 and user decreases, product is removed from cart,
   * resetting back to the initial "Add to Cart" button.
   */
  const handleDecrease = () => {
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      removeFromCart(product.id, currentUnit);
      return;
    }

    decreaseQuantity(product.id, currentUnit);
  };

  const savings =
    packageOffer && packageOffer.originalPrice > packageOffer.price
      ? packageOffer.originalPrice - packageOffer.price
      : 0;

  return (
    <main className="product-detail-page">
      <div className="container">
        {/* Back button */}
        <Link
          href={isPackage ? '/#packages' : '/#products'}
          className="back-link"
        >
          <ArrowLeft size={17} />
          {isPackage ? 'Back to packages' : 'Back to products'}
        </Link>

        <div className="product-detail">
          {/* ==============================
              PRODUCT IMAGE
             ============================== */}
          <div className={`detail-image ${isPackage ? 'is-package-detail' : ''}`}>
            <Image
              src={activeImage}
              alt={`Homemade ${product.name}`}
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
              priority
              className={isPackage ? 'package-detail-img' : ''}
            />

            {/* Quick image preview thumbs for packages */}
            {packageOffer && packageOffer.packageItems && (
              <div
                className="package-preview-thumbs detail-preview-thumbs"
                aria-label="Package items thumbnails"
              >
                <button
                  type="button"
                  className={`pkg-thumb ${activeImage === packageOffer.image ? 'active' : ''}`}
                  onClick={() => setActiveImage(packageOffer.image)}
                  title="View Combo Collage"
                >
                  All 3
                </button>
                {packageOffer.packageItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`pkg-thumb ${activeImage === item.image ? 'active' : ''}`}
                    onClick={() => setActiveImage(item.image)}
                    title={`View ${item.name}`}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ==============================
              PRODUCT INFORMATION
             ============================== */}
          <div className="detail-copy">
            <div className="detail-header-badges">
              <span className="detail-category">
                {isPackage ? (
                  <>
                    <Sparkles size={12} className="inline-icon" /> Combo Pack
                  </>
                ) : (
                  product.category
                )}
              </span>

              {savings > 0 && (
                <span className="package-save-tag detail-save-pill">
                  Save {formatCurrency(savings)}
                </span>
              )}
            </div>

            <h1>{product.name}</h1>

            {packageOffer && (
              <div className="package-subtitle detail-package-subline">
                <span>{packageOffer.subtitle}</span>
                <span className="package-weight-badge">
                  {packageOffer.totalWeight} Total
                </span>
              </div>
            )}

            <div className="product-price-row detail-price-row">
              <div className="price-line detail-price-line">
                <span className="detail-price">
                  {formatCurrency(currentPrice)}
                  <span> / {isPackage ? (product.unit || 'Combo Pack') : (selectedWeight === '1kg' ? '1 kg' : selectedWeight)}</span>
                </span>
                {packageOffer && packageOffer.originalPrice > packageOffer.price && (
                  <del className="package-struck-price">
                    {formatCurrency(packageOffer.originalPrice)}
                  </del>
                )}
              </div>

              {!isPackage && (
                <div className="weight-selector detail-weight-selector" role="group" aria-label="Select quantity/weight">
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
              )}
            </div>

            <p>{product.description}</p>

            {/* Inclusions list for package offers */}
            {packageOffer && packageOffer.packageItems && (
              <div className="package-items-box detail-package-box">
                <strong className="package-items-header">
                  Includes 3 Handcrafted Delicacies:
                </strong>
                <ul className="package-items-list">
                  {packageOffer.packageItems.map((item, idx) => (
                    <li key={idx} className="package-item-row">
                      <span className="package-check-mark">
                        <Check size={14} strokeWidth={3} />
                      </span>
                      <span className="package-item-title">{item.name}</span>
                      <span className="package-item-qty">{item.weight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="detail-note">
              {product.unit === 'Combo Pack'
                ? 'Special handcrafted value combo pack containing 3 authentic delicacies prepared fresh.'
                : 'All listed delicacies are freshly prepared using traditional Rayalaseema recipes.'}
            </div>

            {/* =================================
                CART / QUANTITY / TOTAL
               ================================= */}
            {isInCart ? (
              <div className="detail-row">
                <QuantitySelector
                  quantity={cartItem?.quantity ?? 1}
                  onDecrease={handleDecrease}
                  onIncrease={handleIncrease}
                />

                <span className="detail-total">
                  Total:{' '}
                  <strong>
                    {formatCurrency(
                      currentPrice * (cartItem?.quantity ?? 1)
                    )}
                  </strong>
                </span>
              </div>
            ) : (
              <div className="detail-row">
                <span className="detail-total">
                  Price per {isPackage ? 'pack' : selectedWeight}:{' '}
                  <strong>
                    {formatCurrency(currentPrice)}
                  </strong>
                </span>
              </div>
            )}

            {/* =================================
                ACTION BUTTONS
               ================================= */}
            <div className="detail-actions">
              {!isInCart ? (
                /* Initial state: Only Add to Cart is shown */
                <button
                  type="button"
                  className={`add-button large ${added ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={!product.available}
                >
                  <ShoppingCart size={18} />
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </button>
              ) : (
                /* In Cart state: changes to View in Cart button */
                <Link
                  href="/cart"
                  className="add-button large view-cart-button"
                  aria-label={`View ${product.name} in cart`}
                >
                  <ShoppingBag size={18} />
                  View in Cart
                </Link>
              )}
            </div>

            {!product.available && (
              <small className="unavailable">
                Currently Unavailable
              </small>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}