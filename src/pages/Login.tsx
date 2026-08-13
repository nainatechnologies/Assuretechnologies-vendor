import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../services/api';
import { loginUser } from '../services/auth';
import './Login.css';
import { MdEmail, MdLock } from 'react-icons/md';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    API.post('/auth/vendor/login', { email, password })
      .then((res) => {
        if (res.data.success) {
          loginUser(res.data.data.user);
          Swal.fire({
            title: 'Success!',
            text: 'Logged in successfully!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            navigate('/dashboard');
          });
        }
      })
      .catch((err) => {
        console.error('Login Error:', err);
        Swal.fire({
          title: 'Login Failed',
          text: err.response?.data?.message || 'Invalid credentials',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      })
      .finally(() => setLoading(false));
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
              <input type="email" id="email" className="form-control with-icon" placeholder="vendor@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="password" className="mb-0">Password</label>
              <a href="#" className="forgot-password-link">Forgot password?</a>
            </div>
            <div className="input-icon-wrapper">
              <MdLock className="input-icon" />
              <input type="password" id="password" className="form-control with-icon" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
