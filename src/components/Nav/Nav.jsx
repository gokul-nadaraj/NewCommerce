import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useCart } from "../CartContext";
import { auth } from "../Firebase/Firebase";
import { SlBag } from "react-icons/sl";
import { FaAngleDown } from "react-icons/fa6";
import { LuUser } from "react-icons/lu";
// import { MdOutlineShoppingBag } from "react-icons/md";
import { FaHeart, FaUserCircle, FaBars } from "react-icons/fa";
import logo from "/images/logo.png"; // Adjusted image path
import "./Nav.css"; // Replace this with your CSS file path

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartIconQuantity } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      localStorage.removeItem("cart");
      alert("Signed out successfully");
    } catch (error) {
      alert("Error during sign-out:", error.message);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (

    <nav className="navbar">
    <div className="navbar-container">
      {/* Logo */}
      <div className="logo-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="logo" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links-container ${isMenuOpen ? "open" : ""}`}>
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-item">Home</Link>
          </li>
          <li>
            <Link to="/Products" className="nav-item">Product</Link>
          </li>
          <li>
            <Link to="/contact" className="nav-item">Contact</Link>
          </li>
        </ul>
      </div>

      {/* User Actions */}
      <div className="user-actions">
        <Link to="/cart" className="cart-link">
          <SlBag className="cart-icon" />
          <span className="cart-quantity">{cartIconQuantity}</span>
        </Link>

        {user ? (
          <div className="user-menu">
            <button className="user-name">
              Hi {capitalizeFirstLetter(user.displayName || user.email || "there")}
              <span className="down"><FaAngleDown /></span>
            </button>
            <ul className="dropdown-menu">
              <li onClick={() => navigate("/Youraccounts")}>Your Accounts</li>
              <li onClick={() => navigate("/YourAddress")}>Your Address</li>
              <li onClick={() => navigate("/order-history")}>Your Orders</li>
              <li onClick={handleLogout}>Log Out</li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="login-btn">
            <LuUser />
            Login/Sign Up
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="menu-toggle" onClick={toggleMenu}>
        <FaBars />
      </button>
    </div>
  </nav>
  
  );
};

export default Navbar;
