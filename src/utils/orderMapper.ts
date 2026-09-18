export type OrderStatus = 'New' | 'Accepted' | 'Out for Delivery' | 'Completed' | 'Cancelled' | 'Rejected';

export interface OrderItem {
    id: string;
    productName: string;
    qty: number;
    price: number;
    subtotal: number;
    vendorName?: string;
}

export interface Order {
  id: string;
  date: string;
  user: string;
  mobile: string;
  email: string;
  address: string;
  companyName?: string;
  gstNumber?: string;
  pincode: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: OrderStatus;
  transportName?: string;
  trackId?: string;
  trackUrl?: string;
  items: OrderItem[];
}

const cleanAddress = (rawAddress?: string): string => {
  if (!rawAddress) return 'N/A';
  const cleaned = rawAddress
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)
    .join(', ');
  return cleaned || 'N/A';
};

export const mapApiOrderToOrder = (o: any, items: any[], totalAmount: number, extraTransportData?: { transportName?: string; trackId?: string; trackUrl?: string }): Order => {
  const effectiveStatus = items[0]?.status || o.status;
  return {
    id: o.order_number || o.id,
    date: new Date(o.createdAt).toLocaleString(),
    user: o.customer?.full_name || o.customer_name || 'N/A',
    mobile: o.customer?.mobile || o.customer_contact || 'N/A',
    email: o.customer?.email || 'N/A',
    address: cleanAddress(o.customer_address),
    companyName: o.company_name || undefined,
    gstNumber: o.gst_number || undefined,
    pincode: o.customer?.pincode || 'N/A',
    totalAmount: totalAmount,
    paymentMethod: 'Online',
    paymentStatus: o.payment_status === 'PAID' ? 'Paid' : 'Pending',
    status: effectiveStatus === 'NEW' ? 'New' : effectiveStatus === 'ACCEPTED' ? 'Accepted' : effectiveStatus === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : effectiveStatus === 'COMPLETED' ? 'Completed' : effectiveStatus === 'CANCELLED' ? 'Cancelled' : 'Rejected',
    transportName: extraTransportData?.transportName || (items[0]?.transport_name || o.transport_name || undefined),
    trackId: extraTransportData?.trackId || (items[0]?.tracking_id || o.tracking_id || undefined),
    trackUrl: extraTransportData?.trackUrl || (items[0]?.tracking_url || o.tracking_url || undefined),
    items: items.map((i: any) => ({
      id: i.id,
      productName: i.product?.name || 'Unknown',
      qty: parseInt(i.qty, 10) || 0,
      price: parseFloat(i.price) || 0,
      subtotal: parseFloat(i.subtotal) || 0
    }))
  };
};
