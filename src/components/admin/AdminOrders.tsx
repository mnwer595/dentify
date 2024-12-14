import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../styles/AdminOrders.css';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'approved' | 'preparing' | 'delivered';
  createdAt: Date;
  deliveryAddress: string;
  phoneNumber: string;
  paymentMethod: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching all orders...');
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef);
      const querySnapshot = await getDocs(q);
      
      const fetchedOrders: Order[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Order data:', data);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        };
      }) as Order[];

      // Sort by date descending
      fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      console.log('Processed orders:', fetchedOrders);
      
      setOrders(fetchedOrders);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus
      });
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'approved': return 'badge-success';
      case 'preparing': return 'badge-info';
      case 'delivered': return 'badge-primary';
      default: return '';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="admin-orders-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h2>Order Management</h2>
        <button onClick={fetchOrders} className="refresh-btn">
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <div className="customer-info">
                    <div>{order.phoneNumber}</div>
                    <div className="address">{order.deliveryAddress}</div>
                  </div>
                </td>
                <td>
                  <div className="order-items-preview">
                    {order.items.map(item => (
                      <div key={item.id} className="item-preview">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="preparing">Preparing</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 