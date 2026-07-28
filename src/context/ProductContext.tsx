import React, { createContext, useState, useContext, type ReactNode } from 'react';

export interface Product {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
  offer: number;
  stock: number;
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
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      image: 'https://placehold.co/60x40/png',
      title: 'camera-1',
      category: 'CC Camera Cable',
      price: 5000,
      offer: 0,
      stock: 12,
      status: 'Active',
    }
  ]);

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => 
      prev.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    );
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) => 
      prev.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p)
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, toggleProductStatus, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
