import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import './Orderhistory.css'



const handlesubmit = (e)=>{
  e.prventDefault
}


const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to view your order history.");
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setOrders(userDoc.data().orders || []);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
 
<div className="order-history-container" onSubmit={handlesubmit}>
  <h1>Your Orders</h1>
  {orders.length > 0 ? (
    orders.map((order, index) => (
      <div key={index} className="order-card">
        {Array.isArray(order.cart.items) && order.cart.items.length > 0 ? (
          <>
            {order.cart.items.map((item, idx) => (
              <div key={idx} className="order-item">
                {/* Navigation Bar */}
                <nav className="order-nav">
                <p className="order-date">
      Order Placed
      <span className="date-time">
        <span className="date">{new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }).format(new Date(order.timestamp))}</span>
        <span className="time">{new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }).format(new Date(order.timestamp))}</span>
      </span>
    </p>
                  <p className="order-total">Total: ₹{item.total}</p>
                  <p className="order-id">Order ID: XYZ123</p>
                  <button className="button-4">Invoice</button>
                </nav>

                {/* Order Body */}
                <div className="order-body">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-image"
                    style={{ width: 100 }}
                  />
                  <div className="order-details">
                    <p className="item-name">{item.name}</p>
                    <button className="buy-again-btn">Buy  It Again</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No items in this order.</p>
        )}
      </div>
    ))
  ) : (
    <p className="no-orders">No orders found!</p>
  )}
</div>



  );
  
};

export default OrderHistory;

