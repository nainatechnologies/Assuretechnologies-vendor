
import { Link } from 'react-router-dom';
import { FiBox } from 'react-icons/fi';
import { MdHourglassEmpty, MdCheckCircleOutline, MdErrorOutline, MdTrendingUp, MdArrowForward } from 'react-icons/md';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="page-container relative-container">
      {/* Decorative background blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      
      <div className="dashboard-header animate-fade-in">
        <div>
          <h2 className="page-title">Dashboard Overview</h2>
          <p className="text-muted">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center" style={{ gap: '8px' }}>
          View Reports <MdTrendingUp />
        </button>
      </div>
      
      <div className="dashboard-cards animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <Link to="/products" className="card-link">
          <div className="dashboard-card modern-card card-primary">
            <div className="card-icon-wrapper">
              <FiBox className="card-icon" />
            </div>
            <div className="card-content">
              <p>Add Products</p>
              <h3>1</h3>
            </div>
            <div className="card-footer">
              <span>Go to Products</span> <MdArrowForward />
            </div>
          </div>
        </Link>

        <Link to="/orders" className="card-link">
          <div className="dashboard-card modern-card card-warning">
            <div className="card-icon-wrapper">
              <MdHourglassEmpty className="card-icon" />
            </div>
            <div className="card-content">
              <p>Pending Orders</p>
              <h3>0</h3>
            </div>
            <div className="card-footer">
              <span>View Orders</span> <MdArrowForward />
            </div>
          </div>
        </Link>

        <Link to="/orders" className="card-link">
          <div className="dashboard-card modern-card card-success">
            <div className="card-icon-wrapper">
              <MdCheckCircleOutline className="card-icon" />
            </div>
            <div className="card-content">
              <p>Delivered</p>
              <h3>0</h3>
            </div>
            <div className="card-footer">
              <span>View History</span> <MdArrowForward />
            </div>
          </div>
        </Link>

        <Link to="/manage-stock" className="card-link">
          <div className="dashboard-card modern-card card-danger">
            <div className="card-icon-wrapper">
              <MdErrorOutline className="card-icon" />
            </div>
            <div className="card-content">
              <p>Low Stock</p>
              <h3>0</h3>
            </div>
            <div className="card-footer">
              <span>Manage Stock</span> <MdArrowForward />
            </div>
          </div>
        </Link>
      </div>

      <div className="recent-orders-section mt-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="section-title mb-0">Recent Orders</h3>
          <Link to="/orders" className="text-primary font-weight-500" style={{ textDecoration: 'none' }}>View All</Link>
        </div>
        <div className="table-container modern-table-container empty-state-premium">
          <div className="empty-icon-wrapper">
            <MdHourglassEmpty className="empty-icon" />
          </div>
          <h4>No recent orders</h4>
          <p>When you receive new orders, they will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
