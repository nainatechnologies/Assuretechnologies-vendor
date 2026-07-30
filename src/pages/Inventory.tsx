import { MdAttachMoney, MdDateRange, MdTrendingUp, MdRemoveRedEye } from 'react-icons/md';
import Swal from 'sweetalert2';

const Inventory = () => {
  // Dummy stats for money received (updated for networking/IoT scale)
  const moneyStats = [
    { label: 'Received This Week', value: '₹1,24,500', icon: <MdAttachMoney />, color: '#10B981' },
    { label: 'Received This Month', value: '₹5,42,000', icon: <MdDateRange />, color: '#3B82F6' },
    { label: 'Received This Year', value: '₹43,20,000', icon: <MdTrendingUp />, color: '#8B5CF6' }
  ];

  // Dummy data related to Networking, IoT, and Surveillance
  const pendingPayments = [
    {
      id: 'ORD-8001',
      orderDate: '25 Jul 2026',
      product: 'Cisco 48-Port Gigabit Switch',
      quantity: 1,
      customer: 'TechCorp Solutions',
      customerNumber: '9988776655',
      amount: 45000,
      deliveryDate: '28 Jul 2026',
      status: 'Pending Admin Payout',
      adminReceived: true,
      vendorReceived: false,
      proofFileName: 'NEFT_Transfer_8001.pdf',
      referenceNote: 'First milestone payment cleared by customer.'
    },
    {
      id: 'ORD-8002',
      orderDate: '26 Jul 2026',
      product: 'Hikvision 4K IP Camera',
      quantity: 4,
      customer: 'SecureNet Ltd',
      customerNumber: '8877665544',
      amount: 24000,
      deliveryDate: '29 Jul 2026',
      status: 'Pending COD',
      adminReceived: false,
      vendorReceived: false,
      proofFileName: 'Pending_Receipt.png',
      referenceNote: 'Awaiting cash on delivery collection.'
    },
    {
      id: 'ORD-8003',
      orderDate: '27 Jul 2026',
      product: 'IoT Smart Gateway Hub',
      quantity: 2,
      customer: 'SmartHome Systems',
      customerNumber: '7766554433',
      amount: 18000,
      deliveryDate: '30 Jul 2026',
      status: 'Pending Admin Payout',
      adminReceived: true,
      vendorReceived: false,
      proofFileName: 'IMPS_Txn_8003.jpg',
      referenceNote: 'Payment verified by Admin, payout pending.'
    },
    {
      id: 'ORD-8004',
      orderDate: '28 Jul 2026',
      product: 'Ubiquiti UniFi AP',
      quantity: 6,
      customer: 'Global Logistics',
      customerNumber: '6655443322',
      amount: 42000,
      deliveryDate: '31 Jul 2026',
      status: 'Completed',
      adminReceived: true,
      vendorReceived: true,
      proofFileName: 'Settlement_8004.pdf',
      referenceNote: 'Fully settled and completed.'
    }
  ];

  // We expose a global function so the inline HTML onclick can call it
  (window as any).showPaymentProof = (fileName: string) => {
    Swal.fire({
      title: fileName,
      imageUrl: 'https://placehold.co/600x400/e2e8f0/475569.png?text=Dummy+Payment+Proof\\n(PDF/Image)',
      imageAlt: 'Payment Proof',
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Back'
    });
  };

  const handleView = (item: any) => {
    const htmlContent = `
      <style>
        .upload-container {
          text-align: left;
        }
        .paying-box {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .paying-box span {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .paying-box h3 {
          margin: 4px 0 0 0;
          color: #0f172a;
          font-size: 1.15rem;
          font-weight: 700;
        }
        .upload-label {
          display: block;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .file-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          background: #f8fafc;
        }
        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          color: #1e293b;
          font-weight: 500;
        }
        .file-icon {
          color: #ef4444;
        }
        .view-btn {
          padding: 6px 16px;
          border: 1px solid #3b82f6;
          color: #3b82f6;
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        .view-btn:hover {
          background: #eff6ff;
        }
        .reference-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.95rem;
          color: #334155;
          box-sizing: border-box;
          background: #f8fafc;
        }
        .reference-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .modal-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 32px;
          text-align: left;
        }
        .modal-table th {
          background: #f1f5f9;
          padding: 10px;
          font-size: 0.85rem;
          color: #475569;
          border-bottom: 1px solid #cbd5e1;
        }
        .modal-table td {
          padding: 12px 10px;
          font-size: 0.9rem;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }
        .total-row {
          background: #f8fafc;
          font-weight: 700;
        }
      </style>
      
      <div class="upload-container">
        <div class="paying-box">
          <span>Payment</span>
          <h3>₹${item.amount.toLocaleString('en-IN')}</h3>
        </div>

        <label class="upload-label">Payment Proof</label>
        <div class="file-box">
          <div class="file-info">
            <svg class="file-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            ${item.proofFileName}
          </div>
          <button type="button" class="view-btn" onclick="window.showPaymentProof('${item.proofFileName}')">View</button>
        </div>

        <label class="upload-label">Reference Note (Optional)</label>
        <input type="text" class="reference-input" value="${item.referenceNote}" readonly />
      </div>

      <table class="modal-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product</th>
            <th>Qty</th>
            <th style="text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td style="text-align: right;">₹${item.amount.toLocaleString('en-IN')}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right; padding-right: 16px;">Total Price:</td>
            <td style="text-align: right; color: #0f172a;">₹${item.amount.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
    `;

    Swal.fire({
      title: '<span style="font-size: 1.25rem;">Payment Proof Details</span>',
      html: htmlContent,
      width: '600px',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#64748b',
      customClass: {
        popup: 'sweet-alert-custom-popup',
        actions: 'swal-actions-container'
      }
    });
  };

  return (
    <div className="page-container relative-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Financial Overview</h2>
      </div>

      {/* Money Received Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {moneyStats.map((stat, idx) => (
          <div key={idx} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: `${stat.color}15`, color: stat.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem'
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#6B7280', fontWeight: 600 }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#111827', fontWeight: 700 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <h2 className="page-title mb-4" style={{ fontSize: '1.25rem' }}>Delivered & Pending Payment</h2>
      <div className="table-container modern-table-container mb-5">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Customer</th>
              <th>Contact Number</th>
              <th>Delivery Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>View</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-5 text-muted">No pending payments.</td>
              </tr>
            ) : (
              pendingPayments.map((item) => (
                <tr key={item.id}>
                  <td className="font-weight-500">{item.id}</td>
                  <td>{item.orderDate}</td>
                  <td>{item.customer}</td>
                  <td>{item.customerNumber}</td>
                  <td>{item.deliveryDate}</td>
                  <td className="font-weight-500 text-danger">₹{item.amount.toLocaleString('en-IN')}</td>
                  <td>
                    <span
                      className={`badge ${item.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}
                      style={item.status !== 'Completed' ? {
                        backgroundColor: item.adminReceived ? '#DBEAFE' : undefined,
                        color: item.adminReceived ? '#1E40AF' : undefined
                      } : undefined}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 10px' }}
                      title="View Details"
                      onClick={() => handleView(item)}
                    >
                      <MdRemoveRedEye size={18} style={{ color: 'var(--primary)' }} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
