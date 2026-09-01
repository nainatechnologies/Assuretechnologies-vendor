import { useState, useEffect, useMemo } from 'react';
import { MdAttachMoney, MdDateRange, MdTrendingUp, MdRemoveRedEye } from 'react-icons/md';
import Swal from 'sweetalert2';
import API, { BASE_URL } from '../services/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

interface PayoutOverview {
  receivedThisWeek: number;
  receivedThisMonth: number;
  receivedThisYear: number;
  totalPendingAmount: number;
}

interface PayoutOrderItem {
  id: string;
  orderNumber: string;
  orderDate: string;
  rawOrderDate?: string;
  product: string;
  quantity: number;
  customer: string;
  customerNumber: string;
  deliveryDate: string;
  amount: number;
  grossAmount: number;
  adminCommission: number;
  status: 'Completed' | 'Pending Admin Payout';
  adminReceived: boolean;
  vendorReceived: boolean;
  proofFileName?: string | null;
  proofUrl?: string | null;
  referenceNote?: string;
  paymentDate?: string | null;
}

const Inventory = () => {
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [overview, setOverview] = useState<PayoutOverview>({
    receivedThisWeek: 0,
    receivedThisMonth: 0,
    receivedThisYear: 0,
    totalPendingAmount: 0
  });

  const [payments, setPayments] = useState<PayoutOrderItem[]>([]);

  useEffect(() => {
    fetchPayoutsData();
  }, []);

  const fetchPayoutsData = async () => {
    setLoading(true);
    try {
      const [overviewRes, listRes] = await Promise.all([
        API.get('/vendor/payouts/overview'),
        API.get('/vendor/payouts')
      ]);

      if (overviewRes.data?.success && overviewRes.data?.data) {
        setOverview(overviewRes.data.data);
      } else if (overviewRes.data) {
        setOverview(overviewRes.data);
      }

      if (listRes.data?.success && Array.isArray(listRes.data?.data)) {
        setPayments(listRes.data.data);
      } else if (Array.isArray(listRes.data)) {
        setPayments(listRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch vendor payouts data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter, statusFilter]);

  const moneyStats = [
    { label: 'Received This Week', value: `₹${overview.receivedThisWeek.toLocaleString('en-IN')}`, icon: <MdAttachMoney />, color: '#10B981' },
    { label: 'Received This Month', value: `₹${overview.receivedThisMonth.toLocaleString('en-IN')}`, icon: <MdDateRange />, color: '#3B82F6' },
    { label: 'Received This Year', value: `₹${overview.receivedThisYear.toLocaleString('en-IN')}`, icon: <MdTrendingUp />, color: '#8B5CF6' }
  ];

  const handleView = (item: PayoutOrderItem) => {
    const fullProofUrl = item.proofUrl ? (item.proofUrl.startsWith('http') ? item.proofUrl : `${BASE_URL}${item.proofUrl}`) : null;

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
          padding: 14px 16px;
          margin-bottom: 20px;
          background: #f8fafc;
        }
        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.92rem;
          color: #1e293b;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 320px;
        }
        .file-icon {
          color: #4f46e5;
          flex-shrink: 0;
        }
        .view-btn {
          padding: 6px 14px;
          border: 1px solid #4f46e5;
          color: #4f46e5;
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
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
          margin-top: 24px;
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
        <div style="display: flex; gap: 16px; margin-bottom: 20px;">
          <div class="paying-box" style="margin-bottom: 0; flex: 1;">
            <span>Net Payout Amount</span>
            <h3>₹${item.amount.toLocaleString('en-IN')}</h3>
            ${item.adminCommission > 0 ? `<div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">(Gross: ₹${item.grossAmount.toLocaleString('en-IN')} - Comm: ₹${item.adminCommission.toLocaleString('en-IN')})</div>` : ''}
          </div>
          ${item.status === 'Completed' && item.paymentDate ? `
          <div style="flex: 1; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; background: #ecfdf5;">
            <span style="color: #059669; font-size: 0.9rem; font-weight: 500;">Payment Completed Date</span>
            <h3 style="margin: 4px 0 0 0; color: #065f46; font-size: 1.15rem; font-weight: 700;">${item.paymentDate}</h3>
          </div>
          ` : `
          <div style="flex: 1; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; background: #fff7ed;">
            <span style="color: #c2410c; font-size: 0.9rem; font-weight: 500;">Payout Status</span>
            <h3 style="margin: 4px 0 0 0; color: #9a3412; font-size: 1.15rem; font-weight: 700;">Pending Settlement</h3>
          </div>
          `}
        </div>

        ${item.status === 'Completed' ? `
          ${fullProofUrl ? `
            <label class="upload-label">Payment Proof (Receipt / Screenshot)</label>
            <div class="file-box">
              <div class="file-info">
                <svg class="file-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>${item.proofFileName || 'Payment_Proof'}</span>
              </div>
              <a href="${fullProofUrl}" target="_blank" rel="noreferrer" class="view-btn">
                View Proof ↗
              </a>
            </div>
          ` : ''}

          <label class="upload-label">Reference Note / UTR</label>
          <input type="text" class="reference-input" value="${item.referenceNote || 'Settled by Admin'}" readonly />
        ` : `
          <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; color: #64748b; font-size: 0.85rem; margin-bottom: 16px;">
            ℹ️ This order payment is currently pending settlement by Admin. Once processed, your payment proof receipt and UTR reference will appear here.
          </div>
        `}
      </div>

      <table class="modal-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Product</th>
            <th>Qty</th>
            <th style="text-align: right;">Net Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${item.orderNumber}</strong></td>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td style="text-align: right; font-weight: 600;">₹${item.amount.toLocaleString('en-IN')}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right; padding-right: 16px;">Total Payable:</td>
            <td style="text-align: right; color: #0f172a;">₹${item.amount.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
    `;

    Swal.fire({
      title: '<span style="font-size: 1.25rem;">Payment Settlement Details</span>',
      html: htmlContent,
      width: '600px',
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: 'Close',
      confirmButtonColor: '#4f46e5',
      customClass: {
        popup: 'sweet-alert-custom-popup',
        actions: 'swal-actions-container'
      }
    });
  };

  const filteredPayments = useMemo(() => {
    let data = payments;

    if (statusFilter !== 'All Statuses') {
      if (statusFilter === 'Completed') {
        data = data.filter(item => item.status === 'Completed');
      } else if (statusFilter === 'Pending Admin Payout') {
        data = data.filter(item => item.status === 'Pending Admin Payout');
      }
    }

    if (timeFilter !== 'All Time') {
      const now = new Date();
      data = data.filter(item => {
        const itemDate = item.rawOrderDate ? new Date(item.rawOrderDate) : new Date(item.orderDate);
        if (isNaN(itemDate.getTime())) return true;
        const diffTime = Math.abs(now.getTime() - itemDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (timeFilter === 'Last 7 Days') return diffDays <= 7;
        if (timeFilter === 'Last 30 Days') return diffDays <= 30;
        if (timeFilter === 'This Month') {
          return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    return data;
  }, [payments, statusFilter, timeFilter]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(start, start + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

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
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0" style={{ fontSize: '1.25rem' }}>Delivered & Pending Payment</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            className="form-control"
            style={{ width: 'auto', display: 'inline-block', fontSize: '0.9rem', padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="All Time">All Time</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Month">This Month</option>
          </select>

          <select
            className="form-control"
            style={{ width: 'auto', display: 'inline-block', fontSize: '0.9rem', padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending Admin Payout">Pending Admin Payout</option>
          </select>
        </div>
      </div>

      <div className="panel">
        {loading ? (
          <div style={{ padding: '60px 0' }}>
            <Loading />
          </div>
        ) : (
          <div className="modern-table-container" style={{ border: 'none', borderRadius: '16px', boxShadow: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Ordered Date</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Delivery Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">No payments found for selected filters.</td>
                  </tr>
                ) : (
                  paginatedPayments.map((item) => (
                    <tr key={item.id}>
                      <td className="font-weight-500">{item.orderNumber}</td>
                      <td>{item.orderDate}</td>
                      <td>{item.customer}</td>
                      <td>{item.customerNumber}</td>
                      <td>{item.deliveryDate}</td>
                      <td className="font-weight-500" style={{ color: item.status === 'Completed' ? '#10b981' : '#ef4444' }}>
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
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
                          title="View Payment Details"
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

            {totalPages > 1 && (
              <div style={{ padding: '16px 24px' }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
