

import React, { createContext, useState, useContext, useEffect } from "react";
// Create Cart context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartIconQuantity, setCartIconQuantity] = useState(0); // Corrected state for cart icon quantity
  const [currentView, setCurrentView] = useState("main"); 
  const quantities = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Add item to cart
  // const addToCart = (product) => {
  //   setCart((prevCart) => [...prevCart, product]);
  // };

  // Remove item from cart
  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      setCart(storedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => setCart({ items: [], total: 0 });

  // Update cart icon quantity whenever the cart changes
  useEffect(() => {
    setCartIconQuantity(quantities); // Update the icon quantity
  }, [cart, quantities]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCartIconQuantity,
        removeFromCart,
        cartIconQuantity,
        setCart,
      currentView,
      setCurrentView,
        total: cart.total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use Cart context
export const useCart = () => {
  return useContext(CartContext);
};
