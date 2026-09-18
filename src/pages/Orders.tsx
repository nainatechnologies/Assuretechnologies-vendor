import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import { useState, useEffect } from 'react';
import API from '../services/api';

import Swal from 'sweetalert2';
import { MdRemoveRedEye, MdClose } from 'react-icons/md';

import type { Order, OrderStatus } from '../utils/orderMapper';
import { mapApiOrderToOrder } from '../utils/orderMapper';
import OrderModal from '../components/OrderModal';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatus>('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [showInvoiceModal, setShowInvoiceModal] = useState<Order | null>(null);
  const [viewOrderModal, setViewOrderModal] = useState<Order | null>(null);
  const [invoiceWarranties, setInvoiceWarranties] = useState<Record<string, string>>({});
  const [invoiceModelNumbers, setInvoiceModelNumbers] = useState<Record<string, string>>({});
  const [invoiceHsnCodes, setInvoiceHsnCodes] = useState<Record<string, string>>({});
  const [invoiceSerialNumbers, setInvoiceSerialNumbers] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const tabs: OrderStatus[] = ['New', 'Accepted', 'Out for Delivery', 'Completed', 'Cancelled'];

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const dbStatus = activeTab === 'New' ? 'NEW'
        : activeTab === 'Accepted' ? 'ACCEPTED'
        : activeTab === 'Out for Delivery' ? 'OUT_FOR_DELIVERY'
        : activeTab === 'Completed' ? 'COMPLETED'
        : activeTab === 'Cancelled' ? 'CANCELLED'
        : undefined;

      const params: any = {
        page: currentPage,
        limit: 10,
        status: dbStatus,
        search: searchQuery || undefined
      };

      const response = await API.get('/vendor/orders', { params });
      const rawList = response.data?.orders || (Array.isArray(response.data) ? response.data : []);
      if (response.data?.pagination) {
        setTotalPages(response.data.pagination.totalPages || 1);
        setTotalOrdersCount(response.data.pagination.total || rawList.length);
      } else {
        setTotalPages(1);
        setTotalOrdersCount(rawList.length);
      }

      const fetchedOrders = rawList.map((o: any) => {
        const itemWithTracking = o.items?.find((i: any) => i.tracking_id);
        const totalAmount = o.items?.reduce((sum: number, item: any) => sum + (parseFloat(item.subtotal) || 0), 0) || 0;
        return mapApiOrderToOrder(o, o.items || [], totalAmount, {
          transportName: itemWithTracking?.transport_name,
          trackId: itemWithTracking?.tracking_id,
          trackUrl: itemWithTracking?.tracking_url
        });
      });
      setOrders(fetchedOrders);
    } catch (error: any) {
      console.error('Failed to fetch orders', error);
      Swal.fire('Error', error?.response?.data?.message || 'Failed to fetch orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, activeTab, searchQuery]);

  const filteredOrders = orders.filter(order => {
    if (order.status !== activeTab) return false;
    
    if (activeTab === 'Completed' && paymentFilter !== 'All') {
      if (order.paymentStatus !== paymentFilter) return false;
    }
    
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.date.toLowerCase().includes(query) ||
      order.address.toLowerCase().includes(query) ||
      order.pincode.toLowerCase().includes(query) ||
      order.totalAmount.toString().includes(query) ||
      order.paymentMethod.toLowerCase().includes(query) ||
      order.paymentStatus.toLowerCase().includes(query)
    );
  });

  const paginatedOrders = filteredOrders;

  const showTrackColumn = activeTab === 'Accepted' || activeTab === 'Out for Delivery' || activeTab === 'Completed';

  const handleView = (order: Order) => {
    setViewOrderModal(order);
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
          <div class="track-divider"></div>
          <div class="track-field-group">
            <div class="track-field-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              Tracking URL (Optional)
            </div>
            <div class="track-input-wrapper">
              <span class="track-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3m-1 5h8"/></svg>
              </span>
              <input id="swal-input3" class="track-input" placeholder="e.g. https://www.dtdc.in/tracking" autocomplete="off"/>
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
        const trackUrl = (document.getElementById('swal-input3') as HTMLInputElement).value.trim();
        if (!transportName || !trackId) {
          Swal.showValidationMessage(
            '<span style="display:flex;align-items:center;gap:6px;font-size:0.85rem;">⚠️ Please fill in both Transport Name and Tracking ID.</span>'
          );
          return false;
        }
        return { transportName, trackId, trackUrl };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { transportName, trackId, trackUrl } = result.value;
        try {
          await API.put(`/vendor/orders/${orderId}/tracking`, { transportName, trackingId: trackId, trackUrl });
          setOrders(orders.map(o => o.id === orderId ? { ...o, transportName, trackId, trackUrl } : o));
          Swal.fire({
            icon: 'success',
            title: 'Tracking Saved!',
            html: `<span style="font-size:0.9rem;color:#1E3A5F;">Track ID <strong>${trackId}</strong> via <strong>${transportName}</strong> has been saved successfully.</span>`,
            confirmButtonColor: '#1D4ED8',
            confirmButtonText: 'Done',
            width: '400px'
          });
        } catch (error: any) {
          console.error('Failed to save tracking', error);
          Swal.fire('Error', error.response?.data?.message || 'Failed to save tracking', 'error');
        }
      }
    });
  };

  const handleAction = (orderId: string, action: 'Accept' | 'Reject' | 'Out for Delivery' | 'Complete') => {
    let actionText = '';
    let successText = '';
    let nextStatus: OrderStatus = 'New';
    let confirmColor = 'var(--primary)';

    if (action === 'Reject') {
      Swal.fire({
        title: 'Reject Order?',
        text: 'Please select a reason for rejecting this order (this will queue a customer refund):',
        input: 'select',
        inputOptions: {
          'Out of stock': 'Out of stock',
          'Damaged / Defective inventory': 'Damaged / Defective inventory',
          'Delivery location unserviceable': 'Delivery location unserviceable',
          'Pricing error': 'Pricing error',
          'Other': 'Other reason'
        },
        inputPlaceholder: 'Select rejection reason',
        showCancelButton: true,
        confirmButtonColor: 'var(--danger)',
        cancelButtonColor: 'var(--text-muted)',
        confirmButtonText: 'Confirm Rejection',
        inputValidator: (value) => {
          if (!value) return 'Please select a reason for rejection!';
          return null;
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await API.put(`/vendor/orders/${orderId}/status`, { 
              status: 'CANCELLED',
              reason: result.value
            });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
            Swal.fire('Order Rejected', 'The order has been rejected and queued for customer refund.', 'success');
          } catch (err: any) {
            console.error('Failed to update order status', err);
            Swal.fire('Error', err.response?.data?.message || 'Failed to update order status. Please try again.', 'error');
          }
        }
      });
      return;
    }

    if (action === 'Accept') {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const dbStatus = nextStatus === 'Accepted' ? 'ACCEPTED'
            : nextStatus === 'Out for Delivery' ? 'OUT_FOR_DELIVERY'
            : nextStatus === 'Completed' ? 'COMPLETED'
            : 'NEW';

          await API.put(`/vendor/orders/${orderId}/status`, { status: dbStatus });
          setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
          Swal.fire('Updated!', successText, 'success');
        } catch (err: any) {
          console.error('Failed to update order status', err);
          Swal.fire('Error', err.response?.data?.message || 'Failed to update order status. Please try again.', 'error');
        }
      }
    });
  };

  const handleGenerateInvoice = (order: Order) => {
    setShowInvoiceModal(order);
    setInvoiceWarranties({});
    setInvoiceModelNumbers({});
    setInvoiceHsnCodes({});
    setInvoiceSerialNumbers({});
  };

  const submitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showInvoiceModal) return;
    
    // Validate each item
    const payloadItems = [];
    for (const item of showInvoiceModal.items) {
      if (!invoiceModelNumbers[item.id]?.trim()) {
        Swal.fire('Error', `Please enter Model Number for ${item.productName}`, 'error');
        return;
      }
      if (!invoiceHsnCodes[item.id]?.trim()) {
        Swal.fire('Error', `Please enter HSN Code for ${item.productName}`, 'error');
        return;
      }
      const serialsText = invoiceSerialNumbers[item.id] || '';
      const serials = serialsText.split(',').map(s => s.trim()).filter(s => s);
      if (serials.length !== item.qty) {
        Swal.fire('Error', `Please enter exactly ${item.qty} serial number(s) for ${item.productName}. You have entered ${serials.length}.`, 'error');
        return;
      }
      payloadItems.push({
        id: item.id,
        productName: item.productName,
        modelNumber: invoiceModelNumbers[item.id],
        hsnCode: invoiceHsnCodes[item.id],
        serialNumbers: serials,
        warranty: invoiceWarranties[item.id] || ''
      });
    }
    
    try {
      await API.post(`/invoices/vendor/orders/${showInvoiceModal.id}`, { items: payloadItems });
      Swal.fire({
        title: 'Invoice Generated!',
        html: `Invoice for Order <b>${showInvoiceModal.id}</b> generated successfully.<br/>It has been sent to the Admin Panel.`,
        icon: 'success'
      });
      
      // Refresh list
      fetchOrders();
      setShowInvoiceModal(null);
    } catch (error: any) {
      console.error('Failed to generate invoice', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to generate invoice', 'error');
    }
  };

  return (
    <div className="page-container relative-container">
      {/* Decorative background blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Product Orders <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>({totalOrdersCount} Total)</span></h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {activeTab === 'Completed' && (
            <select 
              className="form-control" 
              style={{ width: 'auto', borderRadius: '6px', padding: '6px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1' }}
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="All">All Payment Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          )}
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search orders..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '280px', borderRadius: '6px', padding: '6px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1' }}
          />
        </div>
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

        {isLoading ? (
          <Loading />
        ) : (
          <div className="modern-table-container" style={{ border: 'none', borderRadius: '0 0 16px 16px', boxShadow: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Ordered Date</th>
                  <th>Address</th>
                  <th>Products</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  {showTrackColumn && <th style={{ textAlign: 'center' }}>Tracking Details</th>}
                  <th style={{ textAlign: 'center' }}>View</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={showTrackColumn ? 9 : 8} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                      No orders found in {activeTab}
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map(order => (
                    <tr key={order.id}>
                      <td className="font-weight-600" style={{ color: 'var(--primary)' }}>{order.id}</td>
                      <td>{order.date}</td>
                      <td style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.address}>
                        {order.address}
                      </td>
                      <td>
                        <span className="badge badge-secondary">{order.items.length} items</span>
                      </td>
                      <td className="font-weight-600">₹{order.totalAmount.toFixed(2)}</td>
                      <td>
                        <span className={`badge badge-${order.paymentStatus === 'PAID' ? 'success' : 'warning'}`}>
                          {order.paymentStatus}
                        </span>
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
                              <button onClick={() => handleGenerateInvoice(order)} className="btn btn-success btn-sm">Generate Invoice</button>
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
        )}
      </div>

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {viewOrderModal && <OrderModal order={viewOrderModal} onClose={() => setViewOrderModal(null)} />}

      {/* Generate Invoice Modal */}
      {showInvoiceModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', width: '90%', maxWidth: '700px', borderRadius: '12px', padding: '24px',
            maxHeight: '90vh', overflowY: 'auto', position: 'relative'
          }}>
            <button
              onClick={() => setShowInvoiceModal(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}
            >
              <MdClose />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>Generate Invoice for Order: {showInvoiceModal.id}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
              <div><strong>Order ID:</strong> {showInvoiceModal.id}</div>
              <div><strong>Delivery Address:</strong> {showInvoiceModal.address}</div>
            </div>

            <form onSubmit={submitInvoice}>
              <h4 style={{ marginBottom: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>Items & Details</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #cbd5e1', width: '20%' }}>Product</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #cbd5e1', width: '5%' }}>Qty</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #cbd5e1', width: '15%' }}>Model No *</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #cbd5e1', width: '15%' }}>HSN Code *</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #cbd5e1', width: '25%' }}>Serial Numbers * (comma separated)</th>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #cbd5e1', width: '20%' }}>Warranty Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showInvoiceModal.items.map(item => (
                      <tr key={item.id}>
                        <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{item.productName}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{item.qty}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            required
                            placeholder="Model No"
                            value={invoiceModelNumbers[item.id] || ''}
                            onChange={(e) => setInvoiceModelNumbers({ ...invoiceModelNumbers, [item.id]: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            required
                            placeholder="HSN Code"
                            value={invoiceHsnCodes[item.id] || ''}
                            onChange={(e) => setInvoiceHsnCodes({ ...invoiceHsnCodes, [item.id]: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            required
                            placeholder={`Enter ${item.qty} serial(s)`}
                            value={invoiceSerialNumbers[item.id] || ''}
                            onChange={(e) => setInvoiceSerialNumbers({
                              ...invoiceSerialNumbers,
                              [item.id]: e.target.value
                            })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            placeholder="e.g. 1 Year"
                            value={invoiceWarranties[item.id] || ''}
                            onChange={(e) => setInvoiceWarranties({ ...invoiceWarranties, [item.id]: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowInvoiceModal(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Invoice & Accept</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

