import { NavLink, Link, Outlet } from 'react-router-dom';
import './Layout.css';
import { 
  MdDashboard, 
  MdInventory, 
  MdOutlineShoppingBag, 
  MdListAlt,
  MdPerson,
  MdLogout
} from 'react-icons/md';
import { FiBox } from 'react-icons/fi';

const Layout = () => {
  return (
    <div className="layout-container">
      <nav className="navbar">
        <Link to="/dashboard" className="navbar-brand text-decoration-none">
          <h2>Naina<span>-tech</span></h2>
        </Link>
        
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <MdDashboard className="nav-icon" /> Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/add-product" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <FiBox className="nav-icon" /> Add Products
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/products" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <MdInventory className="nav-icon" /> Products
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/orders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <MdOutlineShoppingBag className="nav-icon" /> Orders
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/manage-stock" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <MdListAlt className="nav-icon" /> Manage Stock
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/inventory" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <MdListAlt className="nav-icon" /> Inventory
            </NavLink>
          </li>
        </ul>

        <div className="navbar-right">
           <NavLink to="/profile" className="nav-link">
              <MdPerson className="nav-icon" /> Profile
           </NavLink>
           <NavLink to="/login" className="nav-link text-danger">
              <MdLogout className="nav-icon" /> Logout
           </NavLink>
        </div>
      </nav>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
