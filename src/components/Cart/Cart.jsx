import { Link,} from "react-router-dom";
import { useCart } from "../CartContext"; // Custom hook to manage cart state
import "./Cart.css";

const Cart = () => {
  const { cart, setCart } = useCart(); // Use cart and setCart from context
 

  // Update item quantity in the cart

  const updateQuantity = (index, delta) => {
    if (!cart || !Array.isArray(cart.items)) {
      console.error("Cart items are not defined or invalid");
      return;
    }

    const newItems = cart.items.map((item, i) => {
      if (i === index) {
        const newQuantity = item.quantity + delta;
        // Ensure quantity does not go below 1
        if (newQuantity <= 0) return null;

        // Calculate updated total and round to 2 decimal places
        const updatedTotal = parseFloat((newQuantity * parseFloat(item.price)).toFixed(2));

        return {
          ...item,
          quantity: newQuantity,
          total: updatedTotal,
        };
      }
      return item;
    }).filter(item => item !== null); // Remove items with quantity <= 0

    // Recalculate the overall cart total and round it to 2 decimal places
    const newTotal = parseFloat(
      newItems.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)
    );

    // Update the cart state
    setCart({ items: newItems, total: newTotal });
  };

  const deleteItem = (index) => {
    const newItems = cart.items.filter((_, i) => i !== index);
    const newTotal = parseFloat(
      newItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)
    );
    setCart({ items: newItems, total: newTotal });
  };




  return (
   
    <div className="cart-container">
    <div className="cart-items">
      {cart.items && cart.items.length > 0 ? (
        <>
      
          {cart.items.map((item, index) => (
            <div className="cart-item" key={index}>
              <div className="item-image1">
                <img src={item.image} alt={item.name} />
                <h2 className="name">{item.name}</h2>
              </div>
              <div className="item-details">
            
            
          
              <div className="item-quantity">
  <select
    value={item.quantity}
    onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
    className="border border-gray-300 rounded-md p-2 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
  >
    {Array.from({ length: 10 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1}
      </option>
    ))}
  </select>
  <div className="item-total">
                ₹{parseFloat((item.price * item.quantity).toFixed(2))}
              </div>
</div>

             
              <div className="item-price">
                <p className="price">₹{item.price}</p>
              </div>
              <div className="item-remove">
                <button onClick={() => deleteItem(index)}>Remove</button>
              </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="empty-cart-message">Your cart is empty!</p>
      )}
    </div>
  
    {cart.items && cart.items.length > 0 && (
      <div className="cart-summary-container">
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>
              ₹{parseFloat(cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2))}
            </span>
          </div>
          <div className="additional">
            <span>Additional Shipping Charges:</span>
            <span>₹876</span>
          </div>
          <div className="summary-row total">
            <span>Order Total:</span>
            <span>
              ₹{parseFloat(cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2))}
            </span>
          </div>
          <Link to="/checkout" className="checkout-button">
            PROCEED TO CHECKOUT
          </Link>
        </div>
        <div className="check-service-area">
          <h3>Check Service Area</h3>
          <p>Zip/Postal Code</p>
          <div>
            <input type="text" placeholder="Enter Zip/Postal Code"  className="area-input"/>
            <button className="check">Check</button>
          </div>
          <p>Note - If your pin code is non-serviceable, we will send it via Indian Speed Post. Delivery may take longer.</p>
        </div>
      </div>
    )}
  </div>
  

  );
};

export default Cart;