import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import Swal from 'sweetalert2';
import { useProductContext } from '../context/ProductContext';
import './Products.css';
import type { Product } from '../context/ProductContext';

const Products = () => {
  const { products, updateProduct, toggleProductStatus, deleteProduct } = useProductContext();
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    price: '',
    description: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStock = true;
    if (stockFilter === 'In Stock') {
      matchesStock = product.stock > 0;
    } else if (stockFilter === 'Out of Stock') {
      matchesStock = product.stock === 0;
    }
    
    return matchesSearch && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title,
      price: product.price.toString(),
      description: ''
    });
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: editFormData.title,
        price: parseFloat(editFormData.price) || 0
      });
      setEditingProduct(null);
      
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Product updated successfully.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const handleToggleStatus = (product: Product) => {
    const isCurrentlyActive = product.status === 'Active';
    const actionText = isCurrentlyActive ? 'hide' : 'activate';
    
    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} this product?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4ED8',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        toggleProductStatus(product.id);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Product is now ${isCurrentlyActive ? 'Inactive' : 'Active'}.`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleDeleteProduct = (product: Product) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(product.id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The product has been deleted.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="page-container relative-container">
      {/* Decorative background blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">My Products</h2>
        <Link to="/add-product" className="btn btn-primary">
          + Add Product
        </Link>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ gap: '16px', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: '1', minWidth: '250px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by title or category..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="filter-dropdown" style={{ minWidth: '150px' }}>
          <select 
            className="form-control" 
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="table-container modern-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Offer</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-5 text-muted">
                  No products found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ width: '60px', height: '40px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td className="font-weight-500">{product.title}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>₹{product.offer.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <div className="d-flex align-items-center" style={{ gap: '4px' }}>
                      <input type="number" className="form-control" style={{ width: '70px', padding: '6px' }} defaultValue={product.stock} />
                      <button className="btn btn-secondary btn-sm" style={{ padding: '6px 8px' }} title="Save Stock">
                        ✓
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${product.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-warning btn-sm" title="Edit" onClick={() => handleEditClick(product)}>
                        Edit
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        title={product.status === 'Active' ? 'Hide' : 'Activate'}
                        onClick={() => handleToggleStatus(product)}
                      >
                        {product.status === 'Active' ? 'Hide' : 'Active'}
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        title="Delete"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container d-flex justify-content-center mt-4">
          <button 
            className="btn btn-secondary btn-sm mx-1" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page}
              className={`btn btn-sm mx-1 ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="btn btn-secondary btn-sm mx-1" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button className="btn-close" onClick={handleCloseModal}>
                <MdClose />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="col-half">
                  <div className="form-group">
                    <label>Current Banner</label>
                    <div style={{ width: '120px', height: '80px', background: '#f1f5f9', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                      <img src={editingProduct.image} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Replace Banner</label>
                    <div className="d-flex align-items-center" style={{ gap: '8px', border: '1px solid var(--border)', padding: '6px', borderRadius: '6px' }}>
                      <button className="btn btn-secondary btn-sm">Choose File</button>
                      <span className="text-muted" style={{ fontSize: '0.8125rem' }}>No file chosen</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Other Product Images</label>
                    <div className="d-flex align-items-center" style={{ gap: '8px', border: '1px solid var(--border)', padding: '6px', borderRadius: '6px' }}>
                      <button className="btn btn-secondary btn-sm">Choose Files</button>
                      <span className="text-muted" style={{ fontSize: '0.8125rem' }}>No file chosen</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-half">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Price</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      className="form-control" 
                      rows={4}
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
