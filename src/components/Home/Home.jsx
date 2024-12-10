import React from "react";
import products from "../../products.json";
import { useCart } from "../CartContext";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { cart, setCart, setCartIconQuantity } = useCart();

  const handleAddToCart = (product) => {
    const existingProductIndex = cart.items.findIndex(
      (item) => item._id === product._id
    );
    let updatedCart;

    if (existingProductIndex >= 0) {
      updatedCart = cart.items.map((item, index) => {
        if (index === existingProductIndex) {
          return {
            ...item,
            quantity: item.quantity + 1,
            total: (item.quantity + 1) * item.price,
          };
        }
        return item;
      });
    } else {
      updatedCart = [
        ...cart.items,
        { ...product, quantity: 1, total: product.price },
      ];
    }

    const newTotal = updatedCart.reduce((sum, item) => sum + item.total, 0);
    setCart({ items: updatedCart, total: newTotal });
    setCartIconQuantity(updatedCart.length); // Update the cart icon quantity
  };

  const handleIncrement = (productId) => {
    const updatedCart = cart.items.map((item) => {
      if (item._id === productId) {
        return {
          ...item,
          quantity: item.quantity + 1,
          total: (item.quantity + 1) * item.price,
        };
      }
      return item;
    });

    const newTotal = updatedCart.reduce((sum, item) => sum + item.total, 0);
    setCart({ items: updatedCart, total: newTotal });
  };

  const handleDecrement = (productId) => {
    const updatedCart = cart.items
      .map((item) => {
        if (item._id === productId) {
          if (item.quantity > 1) {
            return {
              ...item,
              quantity: item.quantity - 1,
              total: (item.quantity - 1) * item.price,
            };
          }
          return null; 
        }
        return item;
      })
      .filter((item) => item !== null); 

    const newTotal = updatedCart.reduce((sum, item) => sum + item.total, 0);
    setCart({ items: updatedCart, total: newTotal });
    setCartIconQuantity(updatedCart.length); 
  };

  const handleViewProductDetails = (id) => {
    if (id) {
      navigate(`/product/${id}`);
    } else {
      console.error("Product ID is undefined");
    }
  };

  return (
    <>
      <div className="product">
        <h1>Our Products</h1>
        <div className="product-list">
          {products.map((product) => {
            const cartItem = cart.items.find((item) => item._id === product._id);
            return (
              <div key={product._id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => handleViewProductDetails(product._id)}
                />
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p>{product.star}</p>
                <p className="price">Price: ${product.price}</p>

                {/* Conditional rendering for Add/Quantity controls */}
                {cartItem ? (
                  <div className="quantity-controls">
                    <button onClick={() => handleDecrement(product._id)} className="btn2">
                      -
                    </button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={() => handleIncrement(product._id)} className="btn12">
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="add-cart-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add To Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
