import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';

export interface Product {
  id: string;
  display_id?: string;
  image: string;
  title: string;
  category: string;
  price: number;
  offer: number;
  admin_commission?: number;
  stock: number;
  description?: string;
  status: 'Active' | 'Inactive';
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  toggleProductStatus: (id: string) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/vendor/products');
      const mappedProducts = response.data.map((p: any) => ({
        id: p.id,
        display_id: p.display_id,
        image: p.banner || 'https://placehold.co/60x40/png',
        title: p.name,
        category: p.category,
        price: p.base_price,
        offer: p.discount,
        admin_commission: p.admin_commission,
        stock: p.stock,
        description: p.description || '',
        status: p.status === 'Active' || p.status === 'In Stock' ? 'Active' : 'Inactive',
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const payload = {
        name: newProduct.title,
        category: newProduct.category,
        base_price: newProduct.price,
        discount: newProduct.offer,
        admin_commission: newProduct.admin_commission || 0,
        stock: newProduct.stock,
        description: newProduct.description || '',
        banner: newProduct.image,
        status: newProduct.status,
      };
      const res = await API.post('/vendor/products', payload);
      fetchProducts();
      Swal.fire('Success', 'Product added successfully', 'success');
    } catch (error) {
      console.error('Failed to add product:', error);
      Swal.fire('Error', 'Failed to add product', 'error');
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const payload: any = {};
      if (updatedFields.title) payload.name = updatedFields.title;
      if (updatedFields.category) payload.category = updatedFields.category;
      if (updatedFields.price !== undefined) payload.base_price = updatedFields.price;
      if (updatedFields.offer !== undefined) payload.discount = updatedFields.offer;
      if (updatedFields.stock !== undefined) payload.stock = updatedFields.stock;
      if (updatedFields.admin_commission !== undefined) payload.admin_commission = updatedFields.admin_commission;
      if (updatedFields.description !== undefined) payload.description = updatedFields.description;
      if (updatedFields.image) payload.banner = updatedFields.image;
      if (updatedFields.status) payload.status = updatedFields.status;

      await API.put(`/vendor/products/${id}`, payload);
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      Swal.fire('Error', 'Failed to update product', 'error');
    }
  };

  const toggleProductStatus = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const newStatus = product.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await API.put(`/vendor/products/${id}`, { status: newStatus });
      fetchProducts();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await API.delete(`/vendor/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      Swal.fire('Error', 'Failed to delete product', 'error');
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, toggleProductStatus, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
