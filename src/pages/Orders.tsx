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
      title: '<div style="color: var(--text-main); font-weight: 700; font-size: 1.25rem; letter-spacing: -0.02em; margin-bottom: 10px;">Tracking Details</div>',
      html: `
        <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 10px; padding: 10px 0;">
          <input id="swal-input1" class="form-control" placeholder="Transport Name">
          <input id="swal-input2" class="form-control" placeholder="Tracking ID">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--text-muted)',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const transportName = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const trackId = (document.getElementById('swal-input2') as HTMLInputElement).value;
        if (!transportName || !trackId) {
          Swal.showValidationMessage('Please enter both Transport Name and Track ID');
        }
        return { transportName, trackId };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { transportName, trackId } = result.value;
        setOrders(orders.map(o => o.id === orderId ? { ...o, transportName, trackId } : o));
        Swal.fire('Tracked!', `Track ID: ${trackId} saved.`, 'success');
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
