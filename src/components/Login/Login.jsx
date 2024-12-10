import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../Firebase/Firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useCart } from "../CartContext";
import './Login.css'


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

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user's display name with the username
      await updateProfile(user, {
        displayName: username,
      });

      alert(`Signup successful for ${username}! Please log in to continue.`);
      console.log('user',user)
      navigate("/cart", { state: { email, cart, username } });
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/cart", { state: { cart } });
    } catch (error) {
      console.error("Error signing in:", error.message);
      setError(error.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
      setIsResettingPassword(false);
    } catch (error) {
      console.error("Error during password reset:", error);
      alert("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="auth-container">
    <div className="auth-form" style={{ height: isSignup ? "620px" : "400px" }}>
      <h1>{isSignup ? "Sign Up" : isResettingPassword ? "Reset Password" : "Login"}</h1>
  
      <form onSubmit={isResettingPassword ? handlePasswordReset : isSignup ? handleSignup : handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
  
        {isSignup && (
          <>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="^[0-9]{10}$"
              />
            </div>
          </>
        )}
  
        {!isResettingPassword && (
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}
  
        {isSignup && (
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
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
  </div>
  
  );
};

export default Auth;
