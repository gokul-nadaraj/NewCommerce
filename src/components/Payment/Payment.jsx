import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Payment.css';

const Payment = ({ user }) => {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [isRadioChecked, setIsRadioChecked] = useState(false);
  const navigate = useNavigate();

  const handleRadioChange = () => {
    setIsRadioChecked(!isRadioChecked);
  };

  const paymentHandler = async () => {
    try {
      const orderbody = {
        amount: 100, 
        currency: "INR",
        receipt: "receiptId_1",
      };
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": "nb7yqBXPNZ8RDEsa0s7sS8OxEn9bujNV1c1VK3vc",
      };

      const response = await axios.post(
        "https://178sjvr7ai.execute-api.ap-south-1.amazonaws.com/order",
        orderbody,
        { headers }
      );

      const order = response.data;

      const options = {
        key: "", 
        amount: orderbody.amount,
        currency: orderbody.currency,
        name: "TinyKarts (YesurajSeelan)",
        order_id: order.id,
        handler: async (response) => {
          const body = JSON.stringify(response);
          const validateRes = await axios.post(
            "https://178sjvr7ai.execute-api.ap-south-1.amazonaws.com/order/validate",
            body,
            { headers }
          );

          toast.success("Payment successful!", { autoClose: 6000 });
          navigate("/success", { state: { order: { cart: [] } } });
        },
        prefill: {
          name: user?.displayName || "Guest",
          email: user?.email || "guest@example.com",
          contact: user?.phoneNumber || "1234567890",
        },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Payment initiation failed!", { autoClose: 6000 });
    }
  };

  return (
    <>
      <h1 onClick={() => setShowPaymentMethods(!showPaymentMethods)} className="header">
        3. Payment Methods
      </h1>
      {showPaymentMethods && (
        <div className="payment-container">
          <div className="input-name">
            <input
              className="radio"
              type="radio"
              id="razorpay"
              name="payment"
              checked={isRadioChecked}
              onChange={handleRadioChange}
            />
            <label htmlFor="razorpay" className="razorpay">
              Razorpay
            </label>
          </div>
          <div className="pay-btn">
            <button
              onClick={paymentHandler}
              className={`pay-button ${isRadioChecked ? "enabled" : ""}`}
              disabled={!isRadioChecked}
            >
              Pay Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
