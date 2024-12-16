import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Payment.css';


const Payment = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false); // State for showing payment methods
  const [isRadioChecked, setIsRadioChecked] = useState(false); // State for radio button selection
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login", { state: { fromCheckout: true } });
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleRadioChange = () => {
    setIsRadioChecked(!isRadioChecked);
  };

  const paymentHandler = async () => {
    if (!user) {
      toast.error("Please log in to complete the Payment.", { autoClose: 6000 });
      navigate("/login", { state: { fromCheckout: true } });
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          username: user.displayName,
          email: user.email,
          orders: [],
        });
      }

      const orderbody = {
        amount:  Math.round(cart.items.reduce((total, item) => total + item.total, 0) * 100), // Amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
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
        name: "TinyKarts",
        order_id: order.id,
        handler: async (response) => {
          await updateDoc(userRef, {
            orders: arrayUnion({ cart, timestamp: new Date().toISOString() }),
          });

       
          setCart({ items: [], total: 0 });
          toast.success("Payment successful!", { autoClose: 6000 });
          navigate("/success", { state: { order: { cart } } });
        },
        prefill: {
          name: user.displayName,
          email: user.email,
          contact: user.phoneNumber || "1234567890",
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
      <h1
        onClick={() => setShowPaymentMethods(!showPaymentMethods)}
        className="header"
      >
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
      <ToastContainer />
    </>
  );
};

export default Payment;
