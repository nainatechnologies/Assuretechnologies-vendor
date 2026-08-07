import { Link } from 'react-router-dom';
import { FiBox } from 'react-icons/fi';
import { MdHourglassEmpty, MdCheckCircleOutline, MdErrorOutline, MdRemoveRedEye } from 'react-icons/md';
import './Dashboard.css';

const Dashboard = () => {
  // Dummy data for recent orders matching Orders.tsx structure
  const recentOrders = [
    { id: 'ORD20260715140901778', date: '15 Jul 2026, 08:39 AM', user: 'admin', amount: 10000.00, status: 'New', paymentMethod: 'Online', paymentStatus: 'Pending' },
    { id: 'ORD20260714170434832', date: '14 Jul 2026, 11:34 AM', user: 'admin', amount: 5000.00, status: 'New', paymentMethod: 'Online', paymentStatus: 'Pending' },
    { id: 'ORD20260714163256924', date: '14 Jul 2026, 11:02 AM', user: 'admin', amount: 12000.00, status: 'Accepted', paymentMethod: 'Online', paymentStatus: 'Pending' }
  ];

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
              <h3>24</h3>
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
              <h3>12</h3>
              <p>Pending Orders</p>
            </div>
          </div>
        </Link>

        <Link to="/orders" className="card-link">
          <div className="vibrant-card">
            <div className="vibrant-icon-wrapper vibrant-success">
              <MdCheckCircleOutline />
            </div>
            <div className="vibrant-details">
              <h3>156</h3>
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
              <h3>3</h3>
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
              {recentOrders.map((order, index) => (
                <tr key={index}>
                  <td className="font-weight-500">{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.user}</td>
                  <td className="font-weight-500">₹{order.amount.toFixed(2)}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
