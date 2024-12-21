import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface CartContextType {
  cart: any[];
  addToCart: (product: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (product: any) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);

    // ذخیره در Local Storage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // // نمایش پیام تایید
    // toast.success(`${product.title} با موفقیت به سبد خرید اضافه شد!`, {
    //   autoClose: 5000,
    // });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
