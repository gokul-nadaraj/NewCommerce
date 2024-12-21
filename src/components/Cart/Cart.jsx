import { Link, useNavigate,} from "react-router-dom";
import { useCart } from "../CartContext"; // Custom hook to manage cart state
import "./Cart.css";
import Pincode from "../Pincode/Pincode";
import Empty from '/shopping.png';
import { useEffect } from "react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Cart = () => {
  const { cart, setCart } = useCart(); // Use cart and setCart from context
  const navigate = useNavigate();
  const [selectedCourier, setSelectedCourier] = useState(null);

  const [selectedCourierCharges, setSelectedCourierCharges] = useState(0);

  useEffect(() => {
    if (selectedCourier) {
      setSelectedCourierCharges(selectedCourier.cod_charges || 0); // Set COD charges from selected courier
    }
  }, [selectedCourier]); // Run effect when selectedCourier changes
  const subtotal = parseFloat(
    cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  );



  const updateQuantity = (index, delta) => {
    if (!cart || !Array.isArray(cart.items)) {
      console.error("Cart items are not defined or invalid");
      return;
    }

    const newItems = cart.items.map((item, i) => {
      if (i === index) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) return null;

        const updatedTotal = Math.round(newQuantity * item.price);

        return {
          ...item,
          quantity: newQuantity,
          total: updatedTotal,
        };
      }
      return item;
    }).filter(item => item !== null);

    const newTotal = Math.round(
      newItems.reduce((sum, item) => sum + (item.total || 0), 0)
    );

    setCart({ items: newItems, total: newTotal });
  };

  const deleteItem = (index) => {
    const newItems = cart.items.filter((_, i) => i !== index);
    const newTotal = Math.round(
      newItems.reduce((sum, item) => sum + item.total, 0)
    );
    setCart({ items: newItems, total: newTotal });
  };

  const handleViewProductDetails = (id) => {
    if (id) {
      console.log("Navigating to product details for ID:", id);
      navigate(`/product/${id}`);
    } else {
      console.error("Product ID is undefined");
    }
  };

  const handleCheckout = () => {
    if (selectedCourier) {
      navigate("/checkout", {
        state: { selectedCourier },
      });
    }
  };

  useEffect(() => {
    console.log("Selected Courier:", selectedCourier);
  }, [selectedCourier]);

  return (
    <div className="cart-container">
      <div className="cart-items">
        {cart.items && cart.items.length > 0 ? (
          <>
            <div className="cart-headings">
              <span className="heading-item">ITEM</span>
              <span className="heading-price">PRICE</span>
              <span className="heading-quantity">QUANTITY</span>
              <span className="heading-total">TOTAL</span>
            </div>
            {cart.items.map((item, index) => (
              <div className="cart-item" key={index}>
                <div className="item-image1">
                  <img src={item.image} alt={item.name} onClick={() => handleViewProductDetails(item._id)} />
                </div>
                <div className="item-details">
                  <h2>{item.name}</h2>
                </div>
                <div className="item-price">
                  <p className="price">₹{item.price}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(index, -1)} className="cart-button">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(index, 1)} className="cart-button">+</button>
                </div>
                <div className="item-total">
                  ₹{Math.round(item.price * item.quantity)}
                </div>
                <div className="item-remove">
                  <button onClick={() => deleteItem(index)}>Remove</button>
                </div>
              </div>
            ))}
            <div className="back-button-container">
              <Link to="/products">
                <button className="Back-btn">Back</button>
              </Link>
            </div>
          </>
        ) : (
          <div className="empty-cart-message-container">
            <p className="empty-cart-message">
              <img src={Empty} alt="Empty cart" className="empty-cart-img" />
              Your cart is empty!
            </p>
            <Link to="/products">
              <button className="continue-shopping-btn"><span>Continue Shopping</span></button>
            </Link>
          </div>
        )}
      </div>

    

    {cart.items && cart.items.length > 0 && (
 <div className="cart-summary-container">
 <div className="cart-summary">
   <div className="summary-row">
     <span>Subtotal:</span>
     <span>₹{subtotal}</span>
   </div>
   <div className="additional">
     <span>Additional Shipping Charges:</span>
     <span>₹{selectedCourierCharges}</span> {/* Dynamically display shipping charges */}
   </div>
   <div className="summary-row total">
     <span>Order Total:</span>
     <span>₹{subtotal + selectedCourierCharges}</span> {/* Add COD charges to order total */}
   </div>

   
          <button className="checkout-button"
                onClick={handleCheckout} 
              
            >
                Proceed to Checkout
            </button>
           
        </div>
       <div>
        <Pincode selectedCourier={selectedCourier} 
                setSelectedCourier={setSelectedCourier} />
       </div>
      </div>
    )}
  {/* <ToastContainer /> */}
  </div>
  

  );
};

export default Cart;
