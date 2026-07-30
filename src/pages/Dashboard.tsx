import { Link } from 'react-router-dom';
import { FiBox } from 'react-icons/fi';
import { MdHourglassEmpty, MdCheckCircleOutline, MdErrorOutline } from 'react-icons/md';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>
      
      <div className="dashboard-cards">
        <Link to="/products" className="card-link">
          <div className="simple-card">
            <FiBox className="simple-icon icon-blue" />
            <h3 className="simple-value">2</h3>
            <p className="simple-label">Add Products</p>
          </div>
        </Link>

        <Link to="/orders" className="card-link">
          <div className="simple-card">
            <MdHourglassEmpty className="simple-icon icon-yellow" />
            <h3 className="simple-value">0</h3>
            <p className="simple-label">Pending Orders</p>
          </div>
        </Link>

        <Link to="/orders" className="card-link">
          <div className="simple-card">
            <MdCheckCircleOutline className="simple-icon icon-green" />
            <h3 className="simple-value">0</h3>
            <p className="simple-label">Delivered</p>
          </div>
        </Link>

        <Link to="/manage-stock" className="card-link">
          <div className="simple-card">
            <MdErrorOutline className="simple-icon icon-red" />
            <h3 className="simple-value">0</h3>
            <p className="simple-label">Low Stock</p>
          </div>
        </Link>
      </div>

      <div className="recent-orders-section">
        <h3 className="dashboard-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Recent Orders</h3>
        <div className="recent-orders-box">
          No recent orders.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
