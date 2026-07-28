import { useProductContext } from '../context/ProductContext';
import Swal from 'sweetalert2';

const ManageStock = () => {
  const { products, updateProduct, toggleProductStatus, deleteProduct } = useProductContext();

  const handleStockSave = () => {
    Swal.fire({
      icon: 'success',
      title: 'Stock Updated!',
      text: 'Inventory levels saved successfully.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleToggle = (id: string) => {
    toggleProductStatus(id);
  };

  return (
    <div className="page-container relative-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Stock Management</h2>
      </div>
      
      <div className="table-container modern-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-5 text-muted">
                  No products in inventory.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ width: '50px', height: '35px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td className="font-weight-500">{product.title}</td>
                  <td>₹{product.price.toLocaleString('en-IN')}</td>
                  <td>
                    <div className="d-flex align-items-center" style={{ gap: '4px' }}>
                      <input 
                        type="number" 
                        className="form-control" 
                        style={{ width: '70px', padding: '6px' }} 
                        defaultValue={product.stock} 
                        onChange={(e) => updateProduct(product.id, { stock: parseInt(e.target.value) || 0 })}
                      />
                      <button className="btn btn-primary btn-sm" onClick={handleStockSave} style={{ padding: '6px 12px' }}>Save</button>
                    </div>
                  </td>
                  <td>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={product.status === 'Active'} 
                        onChange={() => handleToggle(product.id)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-warning btn-sm" onClick={() => Swal.fire('Edit Product', 'To edit full product details, please use the Products page. You can edit stock directly here.', 'info')}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.id)}>Delete</button>
                    </div>
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

export default ManageStock;
