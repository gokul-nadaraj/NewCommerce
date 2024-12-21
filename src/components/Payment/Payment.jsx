import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Payment.css';

const Payment = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false); 
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); 
  const location = useLocation();
    const { selectedCourier } = location.state || {}

      const [selectedCourierCharges, setSelectedCourierCharges] = useState(0);
  

  useEffect(() => {
    if (selectedCourier) {
      setSelectedCourierCharges(selectedCourier.cod_charges || 0); // Set COD charges from selected courier
    }
  }, [selectedCourier]);







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

  const handlePaymentSelection = (method) => {
    setSelectedPaymentMethod(method);
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

      const productTotal = cart.items.reduce((total, item) => total + item.total, 0);
    const totalAmount = parseFloat(productTotal + selectedCourierCharges).toFixed(2);
console.log(totalAmount)


      const orderbody = {
        amount:Math.round(totalAmount * 100),
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

  const handleCODSubmit = async () => {
    if (!user) {
      toast.error("Please log in to place the order.", { autoClose: 6000 });
      navigate("/login", { state: { fromCheckout: true } });
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        orders: arrayUnion({ cart, timestamp: new Date().toISOString(), paymentMethod: "COD" }),
      });

      setCart({ items: [], total: 0 });
      toast.success("Order placed successfully with Cash on Delivery!", { autoClose: 6000 });
      navigate("/success", { state: { order: { cart, paymentMethod: "COD" } } });
    } catch (error) {
      console.error("Error placing COD order:", error);
      toast.error("Failed to place the order!", { autoClose: 6000 });
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
              checked={selectedPaymentMethod === "razorpay"}
              onChange={() => handlePaymentSelection("razorpay")}
            />
            <label htmlFor="razorpay" className="razorpay">
              Razorpay
            </label>
          </div>
          <div className="input-name">
            <input
              className="radio"
              type="radio"
              id="cod"
              name="payment"
              checked={selectedPaymentMethod === "cod"}
              onChange={() => handlePaymentSelection("cod")}
            />
            <label htmlFor="cod" className="cod">
              Cash on Delivery
            </label>
          </div>
          <div className="pay-btn">
            {selectedPaymentMethod === "razorpay" && (
              <button
                onClick={paymentHandler}
                className="pay-button enabled"
              >
                Pay Now
              </button>
            )}
            {selectedPaymentMethod === "cod" && (
              <button 
                onClick={handleCODSubmit}
                className="submit-button enabled"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
   
    </>
  );
};

export default Payment;