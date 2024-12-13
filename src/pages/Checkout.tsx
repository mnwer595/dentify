import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Checkout.css';

type PaymentMethod = 'onDelivery' | 'zainCash' | 'card';

interface DeliveryDetails {
  phoneNumber: string;
  location: string;
}

const DELIVERY_COST = 5;

export default function Checkout() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('onDelivery');
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    phoneNumber: '',
    location: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    } else if (items.length === 0) {
      navigate('/cart');
    }
  }, [currentUser, items, navigate]);

  if (!currentUser || items.length === 0) {
    return null;
  }

  const subtotal = getCartTotal();
  const total = paymentMethod === 'onDelivery' ? subtotal + DELIVERY_COST : subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'onDelivery') {
      if (!deliveryDetails.phoneNumber || !deliveryDetails.location) {
        alert('Please fill in all required fields');
        return;
      }

      try {
        console.log('Creating order with data:', {
          userId: currentUser.uid,
          items,
          total,
          deliveryDetails
        });

        // Create order in Firestore
        const orderData = {
          userId: currentUser.uid,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.discountPrice || item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl
          })),
          total,
          status: 'pending',
          createdAt: serverTimestamp(),
          deliveryAddress: deliveryDetails.location,
          phoneNumber: deliveryDetails.phoneNumber,
          paymentMethod: 'Cash on Delivery'
        };

        const docRef = await addDoc(collection(db, 'orders'), orderData);
        console.log('Order created with ID:', docRef.id);
        
        await clearCart();
        navigate('/orders');
      } catch (error) {
        console.error('Error creating order:', error);
        alert('There was an error placing your order. Please try again.');
      }
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="items-list">
          {items.map(item => (
            <div key={item.id} className="checkout-item">
              <span>{item.name}</span>
              <span>{item.quantity} × ${(item.discountPrice || item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="summary-details">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {paymentMethod === 'onDelivery' && (
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>${DELIVERY_COST.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row total">
            <strong>Total:</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Payment Method</h2>
        
        <div className="payment-methods">
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="onDelivery"
              checked={paymentMethod === 'onDelivery'}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            />
            Cash on Delivery (${DELIVERY_COST.toFixed(2)} delivery fee)
          </label>

          <label className="payment-option disabled">
            <input
              type="radio"
              name="payment"
              value="zainCash"
              disabled
              checked={paymentMethod === 'zainCash'}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            />
            ZainCash (Coming Soon)
          </label>

          <label className="payment-option disabled">
            <input
              type="radio"
              name="payment"
              value="card"
              disabled
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            />
            Credit/Debit Card (Coming Soon)
          </label>
        </div>

        {paymentMethod === 'onDelivery' && (
          <div className="delivery-details">
            <h2>Delivery Details</h2>
            <div className="form-group">
              <label htmlFor="phone">Phone Number*</label>
              <input
                type="tel"
                id="phone"
                required
                value={deliveryDetails.phoneNumber}
                onChange={(e) => setDeliveryDetails(prev => ({
                  ...prev,
                  phoneNumber: e.target.value
                }))}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Delivery Location*</label>
              <textarea
                id="location"
                required
                value={deliveryDetails.location}
                onChange={(e) => setDeliveryDetails(prev => ({
                  ...prev,
                  location: e.target.value
                }))}
                placeholder="Enter your full address"
              />
            </div>
          </div>
        )}

        <button type="submit" className="checkout-button">
          Place Order
        </button>
      </form>
    </div>
  );
} 