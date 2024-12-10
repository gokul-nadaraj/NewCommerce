import { useParams, Link } from 'react-router-dom';
// import { products } from '../../assets/Frontend';
import { useState } from 'react';
import products from "../../products.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './ProductDetails.css';
import { useCart } from "../CartContext"; // Import useCart hook

const ProductDetails = () => {
  const { id } = useParams();
  // const [quantity, setQuantity] = useState(1); // Manage quantity locally for the product
  const { cart, setCart } = useCart();
  const { setCartIconQuantity } = useCart();

  const product = products.find((prod) => prod._id === parseInt(id));

  if (!product) {
    return <p>Product not found</p>;
  }

  const cartItem = cart.items.find((item) => item._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 1;

  const [mainImage, setMainImage] = useState(product.image);

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



  const handleDecrement = () => {
    const existingProductIndex = cart.items.findIndex((item) => item._id === product._id);

    if (existingProductIndex >= 0) {
      const updatedCart = cart.items
        .map((item, index) => {
          if (index === existingProductIndex) {
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
    }
  };







  return (
    <div className="product-details">
    {/* Side Images */}
    <div className="side-images">
      {Array.isArray(product.images) &&
        product.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            onMouseEnter={() => setMainImage(img)} // Update main image on hover
            className="side-image"
          />
        ))}
    </div>

    {/* Main Image */}
    <div className="product-image">
      <img src={mainImage} alt={product.name} />
    </div>





  {/* Details section */}
  <div className="product-info">
    <h1>{product.name}</h1>
    <p>{product.description}</p>
    <p className="price">${product.price}</p>
    <p className="rating">
      {Array.from({ length: 5 }, (_, index) => {
        if (index < Math.floor(product.rating)) {
          return <span key={index} className="filled-star">★</span>;
        } else if (index < product.rating) {
          return <span key={index} className="half-star">☆</span>;
        } else {
          return <span key={index} className="empty-star">☆</span>;
        }
      })}
    </p>

    <div className="quantity-control">
        <button onClick={handleDecrement} disabled={quantity === 1}>
          -
        </button>
        <span>{quantity}</span>
        <button onClick={() => handleAddToCart(product)}>+</button>
      </div>
    <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
      Add to Cart
    </button>

    <Link to="/cart">
      <button className="view-cart-btn">View Cart</button>
    </Link>
  </div>
  </div>
  
  );
};

export default ProductDetails;