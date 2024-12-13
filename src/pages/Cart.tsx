import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart, loading } = useCart();

  if (loading) {
    return (
      <div className="cart-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <i className="fas fa-shopping-cart"></i>
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart and they will appear here</p>
        <Link to="/shop" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="clear-cart">
            Clear Cart
          </button>
        </div>

        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="item-image" />
              
              <div className="item-details">
                <Link to={`/shop/product/${item.id}`} className="item-name">
                  {item.name}
                </Link>
                <div className="item-price">
                  {item.discountPrice ? (
                    <>
                      <span className="original-price">${item.price.toFixed(2)}</span>
                      <span className="discount-price">${item.discountPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>${item.price.toFixed(2)}</span>
                  )}
                </div>
              </div>

              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div className="item-total">
                ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-item"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <button 
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <Link to="/shop" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart; 