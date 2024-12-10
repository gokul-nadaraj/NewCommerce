import React from 'react'
import { useState } from 'react';
import { useCart } from "../CartContext";
import './Order.css'
const Order = () => {
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const { cart, setCart } = useCart();
  return(
    <>
    <h1 onClick={() => setShowOrderSummary(!showOrderSummary)} className="header">2. Order Summary</h1>
      {showOrderSummary && (
        <div className="order-container">
         
       
  
          <table className="checkout-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Sub Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="checkout-item-image"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  </>
  )
}

export default Order