import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/Firebase";
import "./Success.css";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {}; // Retrieve order details from state
  const [user, setUser] = useState(null); // State to hold the logged-in user

  useEffect(() => {
    // Fetch the currently logged-in user from Firebase
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Handle missing or empty order details
  if (!order || !order.cart || order.cart.items.length === 0) {
    return (
      <div className="success-container">
        <h2>No order details found!</h2>
        <button
          className="continue-shopping-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="success-container">
      {/* Header Section */}
      <div className="order-confirmation-header">
        <h1>Order Confirmed!</h1>
        <p>
          Thank you for your purchase,{" "}
          <strong>
            {user
              ? user.displayName ||
                user.email.split("@")[0].charAt(0).toUpperCase() +
                  user.email.split("@")[0].slice(1)
              : "Customer"}
          </strong>
          !
        </p>
        <p className="order-id">
          Order ID: <strong>#{order.orderId || "12345"}</strong>
        </p>
      </div>

      {/* Ordered Items Section */}
      <div className="order-details-container">
        <h3>Your Orders</h3>
        {order.cart.items.map((item, index) => (
        <div className="orderss" key={index}>
    
          
        <div className="item-details">
        <img src={item.image} alt={item.name} className="item-image" />
          <p className="item-des">{item.name}</p>
         </div>
          <div>
<div>
<p className="item-quantity"> x{item.quantity}</p>
          <p className="item-price"> ₹{item.total}</p>
          
          
          </div>
          </div>
        </div>
     
        ))}
      </div>

      {/* Summary Section */}
      <div className="order-summary">

        <p>
          Subtotal: <span>₹{order.cart.total}</span>
        </p>
   
        <h4>
          Total: <span>₹{order.cart.total}</span>
        </h4>
      </div>

      {/* Continue Shopping Button */}
      <div className="continue-shopping">
        <button
          className="continue-shopping-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Success;
