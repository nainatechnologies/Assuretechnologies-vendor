import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Swal from 'sweetalert2';
import './Login.css'; // Reuse Login.css styles

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    mobile: '',
    email: '',
    password: '',
    address: '',
    gst_number: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const response = await API.post('/auth/vendor/register', formData);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted',
          text: 'Your registration is pending admin approval. You will be notified once approved.',
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (err: any) {
      console.error('Registration Error:', err);
      if (err.response?.data?.errors) {
        const newErrors: any = {};
        err.response.data.errors.forEach((e: any) => {
          newErrors[e.field] = e.message;
        });
        setErrors(newErrors);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: err.response?.data?.message || 'An error occurred during registration.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '600px' }}>
        <div className="login-header">
          <h2>Vendor Registration</h2>
          <p>Join Assure Technologies as a Vendor</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              {errors.full_name && <span className="error-text">{errors.full_name}</span>}
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="business_name">Business Name</label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                placeholder="John's Electronics"
                value={formData.business_name}
                onChange={handleChange}
                required
              />
              {errors.business_name && <span className="error-text">{errors.business_name}</span>}
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="vendor@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gst_number">GST Number</label>
            <input
              type="text"
              id="gst_number"
              name="gst_number"
              placeholder="15-character GSTIN"
              value={formData.gst_number}
              onChange={handleChange}
              required
            />
            {errors.gst_number && <span className="error-text">{errors.gst_number}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Full Address</label>
            <textarea
              id="address"
              name="address"
              placeholder="Business Address"
              value={formData.address}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
              rows={3}
              required
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
