import { useProductContext } from '../context/ProductContext';

const Inventory = () => {
  const { products } = useProductContext();

  return (
    <div className="page-container relative-container">
      <h2 className="page-title mb-4">Inventory Management</h2>
      
      <div className="table-container modern-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-5 text-muted">
                  No products in inventory.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: '#f1f5f9' }}>
                        <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span className="font-weight-500">{product.title}</span>
                    </div>
                  </td>
                  <td>SKU-{product.id.toUpperCase()}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`badge ${product.status === 'Active' ? 'badge-success' : 'badge-secondary'}`} style={{ backgroundColor: product.status === 'Inactive' ? '#E2E8F0' : undefined, color: product.status === 'Inactive' ? '#475569' : undefined }}>
                      {product.status}
                    </span>
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
