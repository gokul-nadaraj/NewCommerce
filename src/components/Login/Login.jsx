import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../Firebase/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { FaEnvelope, FaPhone, FaLock, FaUser,FaEye,FaEyeSlash } from 'react-icons/fa';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useCart } from "../CartContext";
import './Login.css';

// Import react-toastify components
import { toast} from "react-toastify";
 // Import toast styles

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isSignup, setIsSignup] = useState(location.state?.isSignup || false); // Determine if Signup or Login
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { cart } = useCart();
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long");
      toast.error("Password should be at least 6 characters long", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, { displayName: username });

      // Store user data in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        username,
        email,
        phoneNumber: phone,
      });

      // Toast success message
      toast.success(`Signup successful for ${username}! Please log in to continue.`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      });

      console.log('User data:', user);

      // Navigate to cart
      navigate("/cart", { state: { email, cart, username } });
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.message);
      toast.error(`Signup failed: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      });
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      });
      navigate("/cart", { state: { cart } });
    } catch (error) {
      console.error("Error signing in:", error.message);
      setError(error.message);
      toast.error(`Login failed: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      });
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Please check your inbox.", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      });
      setIsResettingPassword(false);
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error("Failed to send password reset email. Please try again.", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form" style={{ height: isSignup ? "620px" : "400px" }}>
        <h1>{isSignup ? "Sign Up" : isResettingPassword ? "Reset Password" : "Login"}</h1>

        <form onSubmit={isResettingPassword ? handlePasswordReset : isSignup ? handleSignup : handleLogin}>
          <div>
            <label>Email:</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {isSignup && (
            <>
              <div>
                <label>Username:</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Phone:</label>
                <div className="input-wrapper">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="^[0-9]{10}$"
                  />
                </div>
              </div>
            </>
          )}

{!isResettingPassword && (
        <div>
          <label>Password:</label>
          <div className="input-wrapper">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
      )}

      {isSignup && (
        <div>
          <label>Confirm Password:</label>
          <div className="input-wrapper">
            <FaLock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
      )}

          

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">
            {isSignup ? "Sign Up" : isResettingPassword ? "Send Reset Email" : "Login"}
          </button>
        </form>

        <div>
          {isResettingPassword ? (
            <p onClick={() => setIsResettingPassword(false)}>
              Remembered your password? <span style={{ color: "blue", cursor: "pointer" }}> Login here.</span>
            </p>
          ) : (
            <>
              {isSignup ? (
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsSignup(false)}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    Login here
                  </span>
                </p>
              ) : (
                <>
                  <p onClick={() => setIsResettingPassword(true)}>
                    Forgot password?{" "}
                    <span style={{ color: "blue", cursor: "pointer" }}> Reset it here.</span>
                  </p>
                  <p onClick={() => setIsSignup(true)}>
                    Don't have an account?{" "}
                    <span style={{ color: "blue", cursor: "pointer" }}> Sign up here.</span>
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
{/* <ToastContainer/> */}
    </div>
  );
};

export default Auth;