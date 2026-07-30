import { useState } from 'react';
import Swal from 'sweetalert2';
import { MdRemoveRedEye } from 'react-icons/md';

type OrderStatus = 'New' | 'Accepted' | 'Out for Delivery' | 'Completed';

interface Order {
  id: string;
  date: string;
  user: string;
  mobile: string;
  email: string;
  address: string;
  pincode: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: OrderStatus;
  transportName?: string;
  trackId?: string;
}

const Orders = () => {
  // Dummy data matching the admin panel
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD20260715140901778',
      date: '15 Jul 2026, 08:39 AM',
      user: 'admin',
      mobile: '9988776655',
      email: 'shyam.matham@nainatechnologies.in',
      address: 'hyd',
      pincode: '506134',
      totalAmount: 10000.00,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      status: 'New'
    },
    {
      id: 'ORD20260714170434832',
      date: '14 Jul 2026, 11:34 AM',
      user: 'admin',
      mobile: '9988776655',
      email: 'shyam.matham@nainatechnologies.in',
      address: 'hyd',
      pincode: '506134',
      totalAmount: 5000.00,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      status: 'New'
    },
    {
      id: 'ORD20260714163256924',
      date: '14 Jul 2026, 11:02 AM',
      user: 'admin',
      mobile: '9988776655',
      email: 'shyam.matham@nainatechnologies.in',
      address: 'hyd',
      pincode: '506134',
      totalAmount: 12000.00,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      status: 'Accepted'
    }
  ]);

  const [activeTab, setActiveTab] = useState<OrderStatus>('New');
  const tabs: OrderStatus[] = ['New', 'Accepted', 'Out for Delivery', 'Completed'];

  const filteredOrders = orders.filter(order => order.status === activeTab);

  const showTrackColumn = activeTab === 'Accepted' || activeTab === 'Out for Delivery' || activeTab === 'Completed';

  const handleView = (order: Order) => {
    Swal.fire({
      title: `Order Details - ${order.id}`,
      html: `
        <div style="text-align: left; font-size: 0.95rem; line-height: 1.6; color: var(--text-main);">
          <p><strong>Order Date:</strong> ${order.date}</p>
          <p><strong>Customer:</strong> ${order.user} (${order.mobile})</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Delivery Address:</strong> ${order.address}, Pincode: ${order.pincode}</p>
          ${order.trackId ? `<p><strong>Transport:</strong> ${order.transportName}</p><p><strong>Track ID:</strong> ${order.trackId}</p>` : ''}
          <hr style="border: 0; border-top: 1px solid var(--border); margin: 16px 0;" />
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Payment Status:</strong> <span class="badge badge-success">${order.paymentStatus}</span></p>
          <p><strong>Total Amount:</strong> <span style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">₹${order.totalAmount.toFixed(2)}</span></p>
        </div>
      `,
      confirmButtonText: 'Close',
      confirmButtonColor: 'var(--primary)',
      width: '500px'
    });
  };

  const handleTrack = (orderId: string) => {
    Swal.fire({
      title: '',
      html: `
        <style>
          .track-modal-header {
            background: linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%);
            margin: -20px -20px 0 -20px;
            padding: 28px 24px 24px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .track-modal-truck-icon {
            width: 64px;
            height: 64px;
            background: rgba(255,255,255,0.18);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 14px;
            backdrop-filter: blur(8px);
            border: 2px solid rgba(255,255,255,0.3);
          }
          .track-modal-title {
            color: #fff;
            font-size: 1.2rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin: 0;
          }
          .track-modal-subtitle {
            color: rgba(255,255,255,0.78);
            font-size: 0.82rem;
            margin-top: 4px;
          }
          .track-form-body {
            padding: 24px 4px 8px;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .track-field-group {
            text-align: left;
          }
          .track-field-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.78rem;
            font-weight: 700;
            color: #1E3A5F;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          .track-field-label svg {
            flex-shrink: 0;
          }
          .track-input-wrapper {
            position: relative;
          }
          .track-input-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #6B7EA0;
            display: flex;
            align-items: center;
            pointer-events: none;
          }
          .track-input {
            width: 100%;
            padding: 12px 16px 12px 42px;
            border: 1.5px solid #D1DEFF;
            border-radius: 10px;
            font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
            font-size: 0.9rem;
            color: #0F1B3D;
            background: #F8FAFF;
            transition: all 0.25s ease;
            outline: none;
            box-sizing: border-box;
          }
          .track-input:focus {
            border-color: #1D4ED8;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(29,78,216,0.12);
          }
          .track-input::placeholder {
            color: #A0AEC0;
          }
          .track-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #D1DEFF 30%, #D1DEFF 70%, transparent);
            margin: 4px 0;
          }
          .track-info-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #EFF4FF;
            border: 1px solid #BFDBFE;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 0.8rem;
            color: #1D4ED8;
          }
        </style>
        <div class="track-modal-header">
          <div class="track-modal-truck-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1"/>
              <path d="M16 8h4l3 3v5h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <p class="track-modal-title">Add Tracking Details</p>
          <p class="track-modal-subtitle">Enter shipment information for this order</p>
        </div>
        <div class="track-form-body">
          <div class="track-field-group">
            <div class="track-field-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Transport / Courier Name
            </div>
            <div class="track-input-wrapper">
              <span class="track-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </span>
              <input id="swal-input1" class="track-input" placeholder="e.g. DTDC, FedEx, Blue Dart…" autocomplete="off"/>
            </div>
          </div>
          <div class="track-divider"></div>
          <div class="track-field-group">
            <div class="track-field-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              Tracking ID / AWB Number
            </div>
            <div class="track-input-wrapper">
              <span class="track-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
              </span>
              <input id="swal-input2" class="track-input" placeholder="e.g. 1234567890" autocomplete="off"/>
            </div>
          </div>
          <div class="track-info-bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Tracking info will be visible to the customer after saving.
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#1D4ED8',
      cancelButtonColor: '#6B7EA0',
      confirmButtonText: '🚀 &nbsp;Save Tracking',
      cancelButtonText: 'Cancel',
      width: '460px',
      padding: '20px',
      customClass: {
        popup: 'track-swal-popup',
        confirmButton: 'track-swal-confirm',
        cancelButton: 'track-swal-cancel',
      },
      preConfirm: () => {
        const transportName = (document.getElementById('swal-input1') as HTMLInputElement).value.trim();
        const trackId = (document.getElementById('swal-input2') as HTMLInputElement).value.trim();
        if (!transportName || !trackId) {
          Swal.showValidationMessage(
            '<span style="display:flex;align-items:center;gap:6px;font-size:0.85rem;">⚠️ Please fill in both Transport Name and Tracking ID.</span>'
          );
          return false;
        }
        return { transportName, trackId };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { transportName, trackId } = result.value;
        setOrders(orders.map(o => o.id === orderId ? { ...o, transportName, trackId } : o));
        Swal.fire({
          icon: 'success',
          title: 'Tracking Saved!',
          html: `<span style="font-size:0.9rem;color:#1E3A5F;">Track ID <strong>${trackId}</strong> via <strong>${transportName}</strong> has been saved successfully.</span>`,
          confirmButtonColor: '#1D4ED8',
          confirmButtonText: 'Done',
          width: '400px'
        });
      }
    });
  };

  const handleAction = (orderId: string, action: 'Accept' | 'Reject' | 'Out for Delivery' | 'Complete') => {
    let actionText = '';
    let successText = '';
    let nextStatus: OrderStatus = 'New';
    let confirmColor = 'var(--primary)';

    if (action === 'Reject') {
      actionText = 'reject this order';
      successText = 'The order has been rejected.';
      nextStatus = 'Completed';
      confirmColor = 'var(--danger)';
    } else if (action === 'Accept') {
      actionText = 'accept this order';
      successText = 'Order status updated to Accepted.';
      nextStatus = 'Accepted';
      confirmColor = 'var(--success)';
    } else if (action === 'Out for Delivery') {
      actionText = 'mark this order as Out for Delivery';
      successText = 'Order status updated to Out for Delivery.';
      nextStatus = 'Out for Delivery';
      confirmColor = 'var(--warning)';
    } else if (action === 'Complete') {
      actionText = 'mark this order as Delivered';
      successText = 'Order status updated to Completed.';
      nextStatus = 'Completed';
      confirmColor = 'var(--success)';
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: 'var(--text-muted)',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
        Swal.fire('Updated!', successText, 'success');
      }
    });
  };

  return (
    <div className="page-container relative-container">
      {/* Decorative background blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Product Orders</h2>
        <button className="btn btn-primary btn-sm">Export CSV</button>
      </div>

      <div className="panel mb-4">
        <div style={{ display: 'flex', gap: '24px', padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                padding: '16px 4px',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 600 : 500,
                fontSize: '0.95rem',
                outline: 'none',
                marginBottom: '-1px',
                transition: 'all 0.2s ease'
              }}
            >
              {tab === 'New' ? 'New Orders' : tab}
            </button>
          ))}
        </div>

        <div className="modern-table-container" style={{ border: 'none', borderRadius: '0 0 16px 16px', boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Ordered Date</th>
                <th>User</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Amount</th>
                <th>Payment</th>
                {showTrackColumn && <th style={{ textAlign: 'center' }}>Track ID</th>}
                <th style={{ textAlign: 'center' }}>View</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={showTrackColumn ? 10 : 9} className="text-center text-muted" style={{ padding: '48px' }}>
                    No {activeTab} orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-weight-500">{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.user}</td>
                    <td>
                      <div className="d-flex" style={{ flexDirection: 'column' }}>
                        <span className="font-weight-500">{order.mobile}</span>
                        <span className="text-muted" style={{ fontSize: '0.8125rem' }}>{order.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex" style={{ flexDirection: 'column' }}>
                        <span>{order.address}</span>
                        <span className="font-weight-500">{order.pincode}</span>
                      </div>
                    </td>
                    <td className="font-weight-500">₹{order.totalAmount.toFixed(2)}</td>
                    <td>
                      <div className="d-flex" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ fontSize: '0.8125rem' }}>{order.paymentMethod}</span>
                        <span className="badge badge-success">{order.paymentStatus}</span>
                      </div>
                    </td>

                    {showTrackColumn && (
                      <td style={{ textAlign: 'center' }}>
                        {order.trackId ? (
                          <div className="d-flex" style={{ flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                            <span className="font-weight-500">{order.trackId}</span>
                            <span className="text-muted" style={{ fontSize: '0.8125rem' }}>{order.transportName}</span>
                          </div>
                        ) : (
                          <button onClick={() => handleTrack(order.id)} className="btn btn-secondary btn-sm" style={{ color: 'var(--primary)' }}>
                            Track
                          </button>
                        )}
                      </td>
                    )}

                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => handleView(order)} className="btn btn-secondary btn-sm" style={{ padding: '6px 10px' }} title="View Order">
                        <MdRemoveRedEye size={18} style={{ color: 'var(--primary)' }} />
                      </button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons" style={{ justifyContent: 'center' }}>
                        {activeTab === 'New' && (
                          <>
                            <button onClick={() => handleAction(order.id, 'Accept')} className="btn btn-success btn-sm">Accept</button>
                            <button onClick={() => handleAction(order.id, 'Reject')} className="btn btn-danger btn-sm">Reject</button>
                          </>
                        )}
                        {activeTab === 'Accepted' && (
                          <button onClick={() => handleAction(order.id, 'Out for Delivery')} className="btn btn-warning btn-sm" style={{ color: '#fff' }}>Out for Delivery</button>
                        )}
                        {activeTab === 'Out for Delivery' && (
                          <button onClick={() => handleAction(order.id, 'Complete')} className="btn btn-success btn-sm">Delivered</button>
                        )}
                        {activeTab === 'Completed' && (
                          <span className="badge badge-success">Delivered</span>
                        )}
                      </div>
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

export default Orders;
