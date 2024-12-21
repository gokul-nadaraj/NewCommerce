import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import products from "../JsonFile/products.json";
import { useCart } from "../CartContext";

const ProductDetails = () => {
  const { id } = useParams();
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
    setCartIconQuantity(updatedCart.length);
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
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Product Image Section */}
        <div className="flex flex-col lg:flex-row lg:w-1/2 gap-4 lg:gap-10">
          {/* Thumbnails on the left with Horizontal Scroll */}
          <div className="flex lg:flex-col gap-4 lg:w-1/4 sticky top-10 z-10 overflow-x-auto whitespace-nowrap">
            {Array.isArray(product.images) &&
              product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  onMouseEnter={() => setMainImage(img)} // Set the main image on hover
                  className="w-16 h-16 object-cover cursor-pointer transition-transform transform hover:scale-110 rounded-lg inline-block"
                />
              ))}
          </div>

          {/* Main Product Image with Zoom Effect */}
          <div className="lg:w-3/4 mt-6 lg:mt-0 relative group overflow-hidden hide-scrollbar ">
            <div className="w-full h-full relative" style={{ cursor: "pointer" }}>
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-lg transform transition duration-500 ease-in-out group-hover:scale-125"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex-1 lg:w-1/2 overflow-y-auto max-h-[80vh] pr-4 hide-scrollbar" style={{ cursor: "pointer" }}>
          <div className="relative">
            <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>
            <p className="text-lg text-gray-600 mt-2">{product.description}</p>
            <p className="text-xl font-semibold text-indigo-600 mt-4">₹{product.price}</p>

            <div className="flex items-center space-x-4 mt-6">
              <button
                onClick={handleDecrement}
                disabled={quantity === 1}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-indigo-500 disabled:bg-gray-400"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-indigo-500"
              >
                +
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-green-600 text-white px-4 py-3 rounded-lg w-full lg:w-auto hover:bg-black-500 transition"
              >
                Add to Cart
              </button>
              <Link to="/cart">
                <button
                  className="bg-black text-white px-4 py-3 rounded-lg w-full lg:w-auto hover:bg-gray-500 transition"
                >
                  View Cart
                </button>
              </Link>
            </div>

            {/* Rating Section */}
            <div className="flex mt-2">
              {Array.from({ length: 5 }, (_, index) => {
                if (index < Math.floor(product.rating)) {
                  return <span key={index} className="text-yellow-500">★</span>;
                } else {
                  return <span key={index} className="text-gray-400">☆</span>;
                }
              })}
            </div>

            {/* Product Details */}
            <div className="mt-6 space-y-4">
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Material:</strong> {product.material}</p>
              <p><strong>Color:</strong> {product.color}</p>
              <p><strong>Special Feature:</strong> {product.specialFeature}</p>
              <p><strong>Style:</strong> {product.style}</p>
              <p><strong>Age Range:</strong> {product.ageRange}</p>
              <p><strong>Dimensions:</strong> {product.productDimensions}</p>
              <p><strong>Theme:</strong> {product.theme}</p>
            </div>

            {/* Product Description */}
            <div className="mt-6 space-y-4">
              <p style={{ fontSize: "30px", fontWeight: "600" }}>About this item</p>
              <p><strong>Product Description:</strong> {product.productDescription}</p>
            </div>

            {/* Key Features */}
            <div className="mt-6 space-y-4">
              <p><strong>Key Features:</strong></p>
              <ul>
                {product.keyFeatures.map((feature, index) => (
                  <li key={index} className="list-disc pl-5">{feature}</li>
                ))}
              </ul>
            </div>

            {/* Care Instructions */}
            <div className="mt-6 space-y-4">
              <p><strong>Specifications</strong></p>
              <ul>
                {(product.Specifications || [])
                  .filter(Boolean)
                  .map((instruction, index) => (
                    <li key={index} className="list-disc pl-5">{instruction}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
