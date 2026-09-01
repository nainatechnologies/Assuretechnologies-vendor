import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBox } from 'react-icons/fi';
import { MdHourglassEmpty, MdCheckCircleOutline, MdErrorOutline, MdRemoveRedEye } from 'react-icons/md';
import API from '../services/api';
import type { Order } from '../utils/orderMapper';
import { mapApiOrderToOrder } from '../utils/orderMapper';
import Loading from '../components/Loading';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    lowStockAlerts: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          API.get('/vendor/dashboard/stats'),
          API.get('/vendor/dashboard/recent-orders')
        ]);
        
        const statsData = statsRes.data?.data || statsRes.data;
        if (statsData) {
          setStats({
            totalProducts: Number(statsData.totalProducts) || 0,
            pendingOrders: Number(statsData.pendingOrders) || 0,
            deliveredOrders: Number(statsData.deliveredOrders) || 0,
            lowStockAlerts: Number(statsData.lowStockAlerts) || 0
          });
        }
        
        const rawOrders = Array.isArray(ordersRes.data?.data) 
          ? ordersRes.data.data 
          : (Array.isArray(ordersRes.data) ? ordersRes.data : []);

        const fetchedOrders = rawOrders.map((o: any) => {
          const items = Array.isArray(o.items) ? o.items : [];
          const itemWithTracking = items.find((i: any) => i.tracking_id);
          const totalAmount = items.reduce((sum: number, item: any) => sum + (parseFloat(item.subtotal) || 0), 0);
          return mapApiOrderToOrder(o, items, totalAmount, {
            transportName: itemWithTracking?.transport_name,
            trackId: itemWithTracking?.tracking_id,
            trackUrl: itemWithTracking?.tracking_url
          });
        });
        
        setRecentOrders(fetchedOrders);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-container relative-container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className="page-container relative-container">
      {/* Decorative background blobs (standard across app) */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Dashboard Overview</h2>
      </div>

      {/* Vibrant Metrics Cards */}
      <div className="dashboard-cards">
        <Link to="/products" className="card-link">
          <div className="vibrant-card">
            <div className="vibrant-icon-wrapper vibrant-info">
              <FiBox />
            </div>
            <div className="vibrant-details">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </Link>

        <Link to="/orders" className="card-link">
          <div className="vibrant-card">
            <div className="vibrant-icon-wrapper vibrant-warning">
              <MdHourglassEmpty />
            </div>
            <div className="vibrant-details">
              <h3>{stats.pendingOrders}</h3>
              <p>New Orders</p>
            </div>
          </div>
        </Link>

        <Link to="/orders" className="card-link">
          <div className="vibrant-card">
            <div className="vibrant-icon-wrapper vibrant-success">
              <MdCheckCircleOutline />
            </div>
            <div className="vibrant-details">
              <h3>{stats.deliveredOrders}</h3>
              <p>Delivered</p>
            </div>
          </div>
        </Link>

        <Link to="/products?filter=low-stock" className="card-link">
          <div className="vibrant-card">
            <div className="vibrant-icon-wrapper vibrant-danger">
              <MdErrorOutline />
            </div>
            <div className="vibrant-details">
              <h3>{stats.lowStockAlerts}</h3>
              <p>Low Stock Alerts</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="panel mb-4">
        <div className="d-flex justify-content-between align-items-center" style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 600 }}>Recent Orders</h3>
          <Link to="/orders" className="btn btn-primary btn-sm">View All</Link>
        </div>

        <div className="modern-table-container" style={{ border: 'none', borderRadius: '0 0 16px 16px', boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Ordered Date</th>
                <th>User</th>
                <th>Amount</th>
                <th>Payment</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted" style={{ padding: '24px' }}>
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="font-weight-500">{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.user}</td>
                    <td className="font-weight-500">₹{order.totalAmount.toFixed(2)}</td>
                    <td>
                      <div className="d-flex" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ fontSize: '0.8125rem' }}>{order.paymentMethod}</span>
                        <span className="badge badge-success">{order.paymentStatus}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link to="/orders" className="btn btn-secondary btn-sm" style={{ padding: '6px 10px' }} title="View Order">
                        <MdRemoveRedEye size={18} style={{ color: 'var(--primary)' }} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
