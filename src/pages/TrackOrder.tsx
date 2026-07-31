import { useParams, useNavigate } from 'react-router-dom';
import { MdCheckCircle, MdLocalShipping, MdInventory, MdHome } from 'react-icons/md';

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page-container relative-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Track Order - {id}</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/orders')}>Back to Orders</button>
      </div>

      <div className="panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '32px', fontWeight: 700 }}>Shipment Status</h3>
        
        {/* Simple Vertical Timeline */}
        <div style={{ position: 'relative', paddingLeft: '40px', borderLeft: '2px solid #3b82f6', marginLeft: '20px' }}>
          
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <div style={{ position: 'absolute', left: '-53px', top: '-4px', background: '#3b82f6', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
               <MdCheckCircle size={14} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>Order Placed</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Order was placed and confirmed.</p>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>14 Jul 2026, 11:34 AM</span>
          </div>

          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <div style={{ position: 'absolute', left: '-53px', top: '-4px', background: '#3b82f6', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
               <MdInventory size={14} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>Picked Up</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Package picked up by courier partner.</p>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>15 Jul 2026, 09:15 AM</span>
          </div>

          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <div style={{ position: 'absolute', left: '-53px', top: '-4px', background: '#3b82f6', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
               <MdLocalShipping size={14} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>In Transit</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Package has arrived at the destination hub.</p>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>16 Jul 2026, 02:20 PM</span>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-53px', top: '-4px', background: '#fff', border: '2px solid #cbd5e1', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
               <MdHome size={14} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>Out for Delivery</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Package is out for delivery.</p>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Pending</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
