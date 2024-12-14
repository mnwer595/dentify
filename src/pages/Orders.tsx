import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Orders.css';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'approved' | 'preparing' | 'delivered';
  createdAt: Date;
  deliveryAddress: string;
  phoneNumber: string;
  paymentMethod: string;
}

export default function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching orders for user:', currentUser.uid);
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        console.log('Found orders:', querySnapshot.size);
        
        const fetchedOrders: Order[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Order data:', data);
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date()
          };
        }) as Order[];

        // Sort orders in memory instead
        fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        console.log('Processed orders:', fetchedOrders);
        setOrders(fetchedOrders);
        setError(null);
      } catch (error: unknown) {
        console.error('Error fetching orders:', error);
        if ((error as { message?: string }).message?.includes('requires an index')) {
          setError('The system is being initialized. Please wait a few minutes and refresh the page.');
        } else {
          setError('Failed to load orders. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="orders-container">
        <div className="orders-message">
          Please sign in to view your orders
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="orders-message error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <i className="fas fa-clock status-icon pending"></i>;
      case 'approved':
        return <i className="fas fa-check status-icon approved"></i>;
      case 'preparing':
        return <i className="fas fa-box status-icon preparing"></i>;
      case 'delivered':
        return <i className="fas fa-truck status-icon delivered"></i>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <span className="order-date">{formatDate(order.createdAt)}</span>
                <span className="order-id">Order #{order.id}</span>
              </div>
              <div className="order-status">
                {getStatusIcon(order.status)}
                <span className={`status-text ${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.imageUrl} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Quantity: {item.quantity}</span>
                    <span className="item-price">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="delivery-info">
                <div className="info-group">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{order.deliveryAddress}</span>
                </div>
                <div className="info-group">
                  <i className="fas fa-phone"></i>
                  <span>{order.phoneNumber}</span>
                </div>
                <div className="info-group">
                  <i className="fas fa-credit-card"></i>
                  <span>{order.paymentMethod}</span>
                </div>
              </div>
              <div className="order-total">
                <span>Total:</span>
                <span className="total-amount">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 