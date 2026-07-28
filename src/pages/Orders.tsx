import { useState } from 'react';

const Orders = () => {
  // Dummy data
  const [orders] = useState([
    { id: 'ORD-001', customer: 'Alice Smith', product: 'Wireless Camera', qty: 2, amount: 4999.00, status: 'Processing', date: '2026-07-27' },
    { id: 'ORD-002', customer: 'Bob Johnson', product: 'Smart Router X1', qty: 1, amount: 2499.00, status: 'Shipped', date: '2026-07-26' },
    { id: 'ORD-003', customer: 'Charlie Brown', product: 'LED Monitor 24"', qty: 1, amount: 12000.00, status: 'Delivered', date: '2026-07-25' },
    { id: 'ORD-004', customer: 'Diana Prince', product: 'Mechanical Keyboard', qty: 3, amount: 8400.00, status: 'Cancelled', date: '2026-07-24' },
    { id: 'ORD-005', customer: 'Evan Wright', product: 'Gaming Mouse', qty: 1, amount: 1599.00, status: 'Delivered', date: '2026-07-24' },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered': return <span className="badge" style={{ background: 'var(--success)', color: '#FFF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Delivered</span>;
      case 'Processing': return <span className="badge" style={{ background: 'var(--warning)', color: '#FFF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Processing</span>;
      case 'Shipped': return <span className="badge" style={{ background: '#3B82F6', color: '#FFF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Shipped</span>;
      case 'Cancelled': return <span className="badge" style={{ background: 'var(--danger)', color: '#FFF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Cancelled</span>;
      default: return <span className="badge" style={{ background: 'var(--text-muted)', color: '#FFF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{status}</span>;
    }
  };

  return (
    <div className="page-container relative-container">
      <div className="panel">
        <div className="panel-header d-flex justify-content-between align-items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="panel-title mb-0">Recent Orders</h2>
          <button className="btn btn-primary btn-sm">Export CSV</button>
        </div>

        <div className="panel-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted" style={{ textAlign: 'center', padding: '32px' }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td style={{ textAlign: 'center' }}>{order.qty}</td>
                    <td style={{ fontWeight: 600, textAlign: 'right' }}>₹{order.amount.toFixed(2)}</td>
                    <td style={{ textAlign: 'center' }}>{getStatusBadge(order.status)}</td>
                    <td className="text-muted">{order.date}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem', minWidth: '60px' }}>View</button>
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
