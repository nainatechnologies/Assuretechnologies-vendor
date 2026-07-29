import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { MdEmail, MdLock } from 'react-icons/md';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header text-center mb-4">
          <div className="vendor-logo-wrapper">
            <MdLock className="vendor-logo-icon" />
          </div>
          <h2 className="login-title mb-0">Vendor Login</h2>
          <p className="login-subtitle mt-2">Welcome back! Please enter your details.</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-icon-wrapper">
              <MdEmail className="input-icon" />
              <input type="email" id="email" className="form-control with-icon" placeholder="vendor@example.com" required />
            </div>
          </div>
          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="password" className="mb-0">Password</label>
              <a href="#" className="forgot-password-link">Forgot password?</a>
            </div>
            <div className="input-icon-wrapper">
              <MdLock className="input-icon" />
              <input type="password" id="password" className="form-control with-icon" placeholder="••••••••" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-4">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
