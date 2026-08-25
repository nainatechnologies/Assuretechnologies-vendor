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

export const mapApiOrderToOrder = (o: any, items: any[], totalAmount: number, extraTransportData?: { transportName?: string; trackId?: string; trackUrl?: string }): Order => {
  return {
    id: o.order_number || o.id,
    date: new Date(o.createdAt).toLocaleString(),
    user: o.customer?.full_name || o.customer_name || 'N/A',
    mobile: o.customer?.mobile || o.customer_contact || 'N/A',
    email: o.customer?.email || 'N/A',
    address: o.customer_address || 'N/A',
    companyName: o.company_name || undefined,
    gstNumber: o.gst_number || undefined,
    pincode: o.customer?.pincode || 'N/A',
    totalAmount: totalAmount,
    paymentMethod: 'Online',
    paymentStatus: o.payment_status === 'PAID' ? 'Paid' : 'Pending',
    status: o.status === 'NEW' ? 'New' : o.status === 'ACCEPTED' ? 'Accepted' : o.status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : o.status === 'COMPLETED' ? 'Completed' : o.status === 'CANCELLED' ? 'Cancelled' : 'Rejected',
    transportName: extraTransportData?.transportName || o.transport_name || undefined,
    trackId: extraTransportData?.trackId || o.tracking_id || undefined,
    trackUrl: extraTransportData?.trackUrl || o.tracking_url || undefined,
    items: items.map((i: any) => ({
      id: i.id,
      productName: i.product?.name || 'Unknown',
      qty: parseInt(i.qty, 10) || 0,
      price: parseFloat(i.price) || 0,
      subtotal: parseFloat(i.subtotal) || 0
    }))
  };
};
