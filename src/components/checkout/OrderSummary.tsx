'use client';

import Image from 'next/image';
import type { CartItem } from '@/types/product';
import type { CustomerDetails } from '@/lib/whatsapp';
import { formatCurrency } from '@/lib/utils';
import { generateWhatsAppUrl } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import { packages } from '@/data/packages';

interface OrderSummaryProps {
  items: CartItem[];
  customer: CustomerDetails;
  onEdit: () => void;
  onOrderPlaced?: () => void;
}

export default function OrderSummary({
  items,
  customer,
  onEdit,
  onOrderPlaced,
}: OrderSummaryProps) {
  const { clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const whatsappUrl = generateWhatsAppUrl(items, customer);

  const handleOrder = () => {
    // Clear items in cart so cart is empty on return or refresh
    clearCart();
    if (onOrderPlaced) {
      onOrderPlaced();
    }
  };

  return (
    <div className="review-panel">
      <div className="review-heading">
        <div>
          <span>Final step</span>
          <h2>Review Your Order</h2>
        </div>
        <button onClick={onEdit} type="button">
          Edit details
        </button>
      </div>

      <div className="customer-review">
        <div>
          <strong>Customer Details</strong>
          <p>
            <b>Name:</b> {customer.name}
          </p>
          <p>
            <b>Mobile:</b> {customer.mobile}
          </p>
          <p>
            <b>Address:</b>{' '}
            {[customer.doorNo, customer.street].filter(Boolean).join(', ')}
          </p>
          <p>
            <b>City:</b> {customer.city}
          </p>
          <p>
            <b>State:</b> {customer.state}
          </p>
          {customer.pincode && (
            <p>
              <b>Pincode:</b> {customer.pincode}
            </p>
          )}
        </div>
      </div>

      <div className="review-items">
        <strong>Order Items</strong>
        {items.map((item) => {
          const itemImage =
            item.image ||
            products.find((p) => p.id === item.productId)?.image ||
            packages.find((pkg) => pkg.id === item.productId)?.image ||
            '/images/logo/arunas-logo.png';

          const unitLabel = item.unit === 'Combo Pack' ? 'pack' : (item.unit || '1 kg');
          const itemTitle = item.unit && item.unit !== 'Combo Pack' ? `${item.name} (${item.unit})` : item.name;

          return (
            <div className="review-item" key={`${item.productId}-${item.unit}`}>
              <div className="review-item-left">
                <div className="review-item-image">
                  <Image
                    src={itemImage}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="review-thumb-img"
                  />
                </div>
                <div className="review-item-info">
                  <span className="review-item-name">{itemTitle}</span>
                  <small className="review-item-qty">
                    {item.quantity} × {formatCurrency(item.price)} ({unitLabel})
                  </small>
                </div>
              </div>
              <strong className="review-item-price">
                {formatCurrency(item.price * item.quantity)}
              </strong>
            </div>
          );
        })}
      </div>

      <div className="review-total">
        <span>Total Amount</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      <a
        className="whatsapp-button large full"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOrder}
      >
        <WhatsAppIcon size={22} colored={false} /> Order on WhatsApp
      </a>

      <p className="review-help">
        WhatsApp will open with your complete order and delivery details pre-filled.
      </p>
    </div>
  );
}
