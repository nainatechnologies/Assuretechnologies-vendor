import React, { useState } from 'react';
import './Profile.css';
import Swal from 'sweetalert2';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    businessName: 'Assure Technologies',
    mobile: '+91 9876543210',
    gstNumber: '29ABCDE1234F1Z5',
    address: '123 Tech Park, Innovation Hub, Outer Ring Road',
    pincode: '560103',
    businessDescription: 'We are a leading provider of innovative electronics and CC camera solutions.'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Profile Saved!',
      text: 'Your business profile has been updated successfully.',
      timer: 1500,
      showConfirmButton: false
    });
    setIsEditing(false);
  };

  return (
    <div className="page-container relative-container">
      {/* Wallet and Stats Section */}
      <div className="dashboard-cards" style={{ marginBottom: '24px' }}>
        <div className="modern-card">
          <div className="card-icon-wrapper d-flex justify-content-between align-items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="card-icon" style={{ background: '#D1FAE5', color: '#10B981', display: 'inline-flex', padding: '12px', borderRadius: '12px', fontSize: '1.5rem' }}>
              💰
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => Swal.fire('Withdrawal Request', 'Your withdrawal request for ₹50,000 has been submitted.', 'success')}>
              Withdraw Funds
            </button>
          </div>
          <div className="card-content">
            <p>Available Wallet Balance</p>
            <h3 style={{ marginTop: '8px' }}>₹1,24,500.00</h3>
          </div>
          <div className="card-footer" style={{ color: '#10B981', fontWeight: '600' }}>
            +₹12,400.00 (This Week)
          </div>
        </div>

        <div className="modern-card">
          <div className="card-icon-wrapper">
            <div className="card-icon" style={{ background: '#EEF2FF', color: 'var(--primary)', display: 'inline-flex', padding: '12px', borderRadius: '12px', fontSize: '1.5rem' }}>
              📈
            </div>
          </div>
          <div className="card-content">
            <p>Total Lifetime Earnings</p>
            <h3 style={{ marginTop: '8px' }}>₹8,45,200.00</h3>
          </div>
          <div className="card-footer text-muted">
            Across 1,248 completed orders
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header d-flex justify-content-between align-items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="panel-title mb-0">Business Profile</h2>
          {!isEditing && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
        <div className="panel-body">
          {!isEditing ? (
            <div className="profile-details">
              <div className="form-row mb-4" style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                <div className="col-half" style={{ flex: 1 }}>
                  <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Contact Name</p>
                  <p className="font-weight-500" style={{ fontWeight: 500 }}>{formData.name}</p>
                </div>
                <div className="col-half" style={{ flex: 1 }}>
                  <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Business Name</p>
                  <p className="font-weight-500" style={{ fontWeight: 500 }}>{formData.businessName}</p>
                </div>
              </div>

              <div className="form-row mb-4" style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                <div className="col-half" style={{ flex: 1 }}>
                  <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Mobile Number</p>
                  <p className="font-weight-500" style={{ fontWeight: 500 }}>{formData.mobile}</p>
                </div>
                <div className="col-half" style={{ flex: 1 }}>
                  <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>GST Number</p>
                  <p className="font-weight-500" style={{ fontWeight: 500 }}>{formData.gstNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="form-row mb-4" style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                <div className="col-half" style={{ flex: 1 }}>
                  <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Full Address</p>
                  <p className="font-weight-500" style={{ fontWeight: 500 }}>{formData.address}</p>
                </div>
                <div className="col-half" style={{ flex: 1 }}>
                  <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Pincode</p>
                  <p className="font-weight-500" style={{ fontWeight: 500 }}>{formData.pincode}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Business Description</p>
                <p className="font-weight-500" style={{ fontWeight: 500 }}>{formData.businessDescription || 'N/A'}</p>
              </div>
            </div>
          ) : (
            <form className="profile-form animate-fade-in" onSubmit={handleSave}>
              <div className="form-row" style={{ display: 'flex', gap: '24px' }}>
                <div className="form-group col-half" style={{ flex: 1 }}>
                  <label>Contact Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group col-half" style={{ flex: 1 }}>
                  <label>Business Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '24px' }}>
                <div className="form-group col-half" style={{ flex: 1 }}>
                  <label>Mobile Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group col-half" style={{ flex: 1 }}>
                  <label>GST Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Full Address</label>
                <textarea 
                  className="form-control" 
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '24px' }}>
                <div className="form-group col-half" style={{ flex: 1 }}>
                  <label>Pincode</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group col-half" style={{ flex: 1 }}>
                  {/* Empty column for layout balance */}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Business Description</label>
                <textarea 
                  className="form-control" 
                  rows={4}
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="d-flex mt-4" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary">Save Profile Changes</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
