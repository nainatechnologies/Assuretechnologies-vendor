import React, { useState } from 'react';
import './Profile.css';
import Swal from 'sweetalert2';
import { MdEdit, MdBusiness, MdPhone, MdLocationOn, MdPerson } from 'react-icons/md';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Rajesh Kumar',
    businessName: 'ElectroVision Electronics',
    mobile: '+91 9988776655',
    gstNumber: '36AADCE1234F1Z9',
    address: '45 Electronics Market, SP Road',
    pincode: '500003',
    businessDescription: 'Wholesale supplier of networking equipment, IP cameras, and smart home solutions.'
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
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="page-title mb-0">Business Profile</h2>
          {!isEditing && (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => setIsEditing(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}
            >
              <MdEdit size={16} /> Edit Profile
            </button>
          )}
        </div>

        <div className="panel" style={{ border: 'none', padding: '0', overflow: 'hidden', borderRadius: '16px' }}>
          {/* Cover and Avatar Section */}
          <div style={{ height: '140px', background: 'linear-gradient(135deg, var(--primary), #3b82f6)' }}></div>
          <div style={{ padding: '0 32px 32px 32px', position: 'relative' }}>
            <div style={{ 
              width: '110px', height: '110px', borderRadius: '50%', background: '#fff', 
              padding: '6px', marginTop: '-55px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
            }}>
              <div style={{ 
                width: '100%', height: '100%', borderRadius: '50%', background: 'var(--primary-light)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '2.5rem' 
              }}>
                <MdBusiness />
              </div>
            </div>

            {!isEditing ? (
              /* View Mode */
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{formData.businessName}</h3>
                <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '32px', lineHeight: '1.6' }}>{formData.businessDescription}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="profile-info-box">
                    <MdPerson className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Contact Name</span>
                      <span className="info-value">{formData.name}</span>
                    </div>
                  </div>
                  <div className="profile-info-box">
                    <MdPhone className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Mobile Number</span>
                      <span className="info-value">{formData.mobile}</span>
                    </div>
                  </div>
                  <div className="profile-info-box">
                    <MdBusiness className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">GST Number</span>
                      <span className="info-value">{formData.gstNumber || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="profile-info-box">
                    <MdLocationOn className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Location</span>
                      <span className="info-value">{formData.address}, {formData.pincode}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSave}>
                <h3 className="section-title" style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: 700, marginBottom: '20px' }}>Edit Information</h3>
                
                <div className="form-row mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group mb-0">
                    <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Contact Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group mb-0">
                    <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Business Name</label>
                    <input type="text" className="form-control" name="businessName" value={formData.businessName} onChange={handleChange} required />
                  </div>
                  <div className="form-group mb-0">
                    <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>GST Number</label>
                    <input type="text" className="form-control" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                  </div>
                  <div className="form-group mb-0">
                    <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Mobile Number</label>
                    <input type="tel" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                  <div className="form-group mb-0">
                    <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Pincode</label>
                    <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleChange} required />
                  </div>
                  <div className="form-group mb-0">
                    <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Full Address</label>
                    <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Business Description</label>
                  <textarea className="form-control" rows={3} name="businessDescription" value={formData.businessDescription} onChange={handleChange} style={{ resize: 'none' }}></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: '10px 24px', borderRadius: '8px' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 32px', borderRadius: '8px' }}>Save Changes</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
