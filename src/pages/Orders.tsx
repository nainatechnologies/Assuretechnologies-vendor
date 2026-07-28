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
        <div style="text-align: left; font-size: 0.95rem; line-height: 1.6; color: #374151;">
          <p><strong>Order Date:</strong> ${order.date}</p>
          <p><strong>Customer:</strong> ${order.user} (${order.mobile})</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Delivery Address:</strong> ${order.address}, Pincode: ${order.pincode}</p>
          ${order.trackId ? `<p><strong>Transport:</strong> ${order.transportName}</p><p><strong>Track ID:</strong> ${order.trackId}</p>` : ''}
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Payment Status:</strong> <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${order.paymentStatus}</span></p>
          <p><strong>Total Amount:</strong> <span style="font-size: 1.2rem; font-weight: 600; color: #111827;">₹${order.totalAmount.toFixed(2)}</span></p>
        </div>
      `,
      confirmButtonText: 'Close',
      confirmButtonColor: '#3b82f6',
      width: '500px'
    });
  };

  const handleTrack = (orderId: string) => {
    Swal.fire({
      title: 'Enter Tracking Details',
      html: `
        <style>
          .custom-track-input {
            width: 80% !important;
            padding: 10px 12px !important;
            border: 2px solid #c7d2fe !important;
            border-radius: 8px !important;
            font-size: 0.875rem !important;
            color: #312e81 !important;
            background-color: #e0e7ff !important;
            outline: none !important;
            transition: all 0.3s ease !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }
          .custom-track-input:focus {
            border-color: #6366f1 !important;
            background-color: #ffffff !important;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3) !important;
          }
          .track-form-wrapper {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-top: 16px;
          }
        </style>
        <div class="track-form-wrapper">
          <input id="swal-input1" class="swal2-input custom-track-input" placeholder="Transport Name">
          <input id="swal-input2" class="swal2-input custom-track-input" placeholder="Track ID">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
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

    if (action === 'Reject') {
      actionText = 'reject this order';
      successText = 'The order has been rejected.';
      nextStatus = 'Completed';
    } else if (action === 'Accept') {
      actionText = 'accept this order';
      successText = 'Order status updated to Accepted.';
      nextStatus = 'Accepted';
    } else if (action === 'Out for Delivery') {
      actionText = 'mark this order as Out for Delivery';
      successText = 'Order status updated to Out for Delivery.';
      nextStatus = 'Out for Delivery';
    } else if (action === 'Complete') {
      actionText = 'mark this order as Delivered';
      successText = 'Order status updated to Completed.';
      nextStatus = 'Completed';
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: action === 'Reject' ? '#ef4444' : '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
        Swal.fire('Updated!', successText, 'success');
      }
    });
  };

  return (
    <div className="page-container relative-container" style={{ padding: '24px' }}>
      <div className="panel" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '24px' }}>
        <div className="panel-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <h2 className="panel-title mb-0" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Product Orders</h2>
            <button className="btn btn-primary btn-sm" style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Export CSV</button>
          </div>

          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e5e7eb', width: '100%' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                  color: activeTab === tab ? '#3b82f6' : '#6b7280',
                  padding: '8px 4px',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab ? 600 : 400,
                  fontSize: '0.9rem',
                  outline: 'none',
                  marginBottom: '-1px'
                }}
              >
                {tab === 'New' ? 'New Orders' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="panel-body" style={{ padding: 0, overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ background: '#1f2937', color: 'white', padding: '12px', fontSize: '0.875rem' }}>Order ID</th>
                <th style={{ background: '#1f2937', color: 'white', padding: '12px', fontSize: '0.875rem' }}>Ordered Date</th>
                <th style={{ background: '#1f2937', color: 'white', padding: '12px', fontSize: '0.875rem' }}>User</th>
                <th style={{ background: '#1f2937', color: 'white', padding: '12px', fontSize: '0.875rem' }}>Contact</th>
                <th style={{ background: '#1f2937', color: 'white', padding: '12px', fontSize: '0.875rem' }}>Address</th>
                <th style={{ background: '#1f2937', color: 'white', padding: '12px', fontSize: '0.875rem' }}>Amount</th>
                <th style={{ background: '#1f2937', color: 'white', padding: '12px', fontSize: '0.875rem' }}>Payment</th>
                {showTrackColumn && <th style={{ background: '#1f2937', color: 'white', padding: '12px', fontSize: '0.875rem', textAlign: 'center' }}>Track ID</th>}
                <th style={{ background: '#1f2937', color: 'white', padding: '12px', fontSize: '0.875rem', textAlign: 'center' }}>View</th>
                <th style={{ background: '#1f2937', color: 'white', padding: '12px', fontSize: '0.875rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={showTrackColumn ? 10 : 9} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    No {activeTab} orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
                    <td style={{ padding: '12px', fontSize: '0.875rem', color: '#374151' }}>{order.id}</td>
                    <td style={{ padding: '12px', fontSize: '0.875rem', color: '#374151' }}>{order.date}</td>
                    <td style={{ padding: '12px', fontSize: '0.875rem', color: '#374151' }}>{order.user}</td>
                    <td style={{ padding: '12px', fontSize: '0.875rem', color: '#374151' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{order.mobile}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.875rem', color: '#374151' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{order.address}</span>
                        <span style={{ fontWeight: 'bold' }}>{order.pincode}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.875rem', color: '#374151' }}>₹{order.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: '12px', fontSize: '0.875rem', color: '#374151' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                        <span>{order.paymentMethod}</span>
                        <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '16px', fontSize: '0.7rem', fontWeight: 600 }}>{order.paymentStatus}</span>
                      </div>
                    </td>

                    {showTrackColumn && (
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {order.trackId ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                            <div style={{ fontSize: '0.85rem' }}>
                              <span style={{ fontWeight: 'bold', color: '#111827' }}>{order.trackId}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem' }}>
                              <span style={{ fontWeight: '500', color: '#374151' }}>{order.transportName}</span>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => handleTrack(order.id)} style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>Track</button>
                        )}
                      </td>
                    )}

                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button onClick={() => handleView(order)} style={{ background: 'white', border: '1px solid #3b82f6', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MdRemoveRedEye size={18} />
                      </button>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        {activeTab === 'New' && (
                          <>
                            <button onClick={() => handleAction(order.id, 'Accept')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, width: '100px' }}>Accept</button>
                            <button onClick={() => handleAction(order.id, 'Reject')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, width: '100px' }}>Reject</button>
                          </>
                        )}
                        {activeTab === 'Accepted' && (
                          <button onClick={() => handleAction(order.id, 'Out for Delivery')} style={{ background: '#facc15', color: '#000', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, width: '120px' }}>Out for Delivery</button>
                        )}
                        {activeTab === 'Out for Delivery' && (
                          <button onClick={() => handleAction(order.id, 'Complete')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, width: '100px' }}>Delivered</button>
                        )}
                        {activeTab === 'Completed' && (
                          <span style={{ background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600 }}>Delivered</span>
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
