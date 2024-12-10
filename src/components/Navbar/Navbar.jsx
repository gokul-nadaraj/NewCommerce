import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../Firebase/Firebase";
import { signOut } from "firebase/auth";
import { SlBag } from "react-icons/sl";
import { LuUser } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope as faEnvelopeRegular } from "@fortawesome/free-regular-svg-icons"; // Regular email icon
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

// import { faShoppingCart, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import "./Navbar.css";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const { cartIconQuantity } = useCart();
  const handleLogout = async () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        localStorage.removeItem("cart");

        alert("Signed out successfully");
        setShowLogout(false);
      })
      .catch((error) => {
        alert("Error during sign-out:", error);
      });
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div>
      <nav className="navbar">
        <div>
          <Link to="/" className="navbar-logo">
            <img src="/images/logo.png" alt="logo" />
          </Link>
        </div>

        <div className="name-container">
          <p>
            <FontAwesomeIcon icon={faWhatsapp} className="fa" />+
            <a>8769878332</a>
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelopeRegular} className="fa" />
            <a href="mailto:yesuraj88@gmail.com">yesuraj88@gmail.com</a>
          </p>
        </div>

        {user ? (
          <>
            <Link to="/cart" className="navbar-link">
              <SlBag className="icon" />
              <p className="quan">{cartIconQuantity}</p>
            </Link>
            <div className="user-menu">
              <button className="user-name">
                <p>
                  Hi{" "}
                  {capitalizeFirstLetter(
                    user.displayName || user.email || "there"
                  )}
                  <span className="down">
                    <FaAngleDown />
                  </span>
                </p>
              </button>
              <div className="Allorders">
                <p onClick={() => navigate("/Youraccounts")}>Your Accounts</p>
                <p onClick={() => navigate("/YourAddress")}>Your Address</p>
                <p onClick={() => navigate("/order-history")}>Your Orders</p>
                <p onClick={handleLogout}>LogOut</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/cart" className="navbar-link">
              <SlBag className="icon" />
              <p className="quan">{cartIconQuantity}</p>
            </Link>

            <Link to="/login" className="navbar-link1">
              <button className="login-btn">
                <LuUser />
                Login/SignUp
              </button>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

{
  /* <Link to="/signup" className="navbar-link">
        Signup
      </Link> */
}
