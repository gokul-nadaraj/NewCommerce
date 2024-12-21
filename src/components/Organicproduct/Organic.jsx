import React from "react";
import products from "../JsonFile/Organic.json";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";

// Import react-toastify components
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const Organic = () => {
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
    setCartIconQuantity(updatedCart.length);

    toast.success(`${product.name} has been added to your cart!`, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "colored",
    });
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
        <h1 className="header-name">Organic Products</h1>
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
                <p className="price">
                  Price:{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(product.price)}
                </p>

                {cartItem ? (
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleDecrement(product._id)}
                      className="quantity-ever"
                    >
                      -
                    </button>
                    <span>{cartItem.quantity}</span>
                    <button
                      onClick={() => handleIncrement(product._id)}
                      className="quantity-ever"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="button"
                    onClick={() => handleAddToCart(product)}
                  >
                    <span className="button__text">Add Item</span>
                    <span className="button__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        stroke="currentColor"
                        height="24"
                        fill="none"
                        className="svg"
                      >
                        <line y2="19" y1="5" x2="12" x1="12"></line>
                        <line y2="12" y1="12" x2="19" x1="5"></line>
                      </svg>
                    </span>
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

export default Organic;
