import React, { useState } from "react";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import "./ChangeEmail.css";

const ChangePhoneNumber = () => {
  const [username, setUsername] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const auth = getAuth();

  // Send OTP
  const sendOtp = async () => {
    setError(null);
    setSuccess(null);

    if (!/^\d{10}$/.test(newMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const phoneNumber = `+91${newMobile}`;

    try {
      // Disable app verification for testing
      auth.settings.appVerificationDisabledForTesting = true;

      // Call signInWithPhoneNumber without appVerifier in testing mode
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber);
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
      setSuccess("OTP sent successfully.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  // Verify OTP and Update Phone Number
  const verifyOtpAndUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!verificationId) {
      setError("Verification ID not found. Please resend OTP.");
      return;
    }

    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await auth.signInWithCredential(credential);

      const user = userCredential.user;
      if (!user) {
        setError("User authentication failed.");
        return;
      }

      // Update the username if provided
      if (username) {
        await user.updateProfile({ displayName: username });
      }

      setSuccess("Details updated successfully!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div className="user-details-container">
      <h4>Update User Details</h4>
      {success && <p className="success-msg">{success}</p>}
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={verifyOtpAndUpdate}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile-number">New Mobile Number:</label>
          <input
            type="text"
            id="mobile-number"
            value={newMobile}
            onChange={(e) => setNewMobile(e.target.value)}
            placeholder="Enter new mobile number"
          />
          {!otpSent && (
            <button type="button" className="send-otp-btn" onClick={sendOtp}>
              Send OTP
            </button>
          )}
        </div>
        {otpSent && (
          <div className="form-group">
            <label htmlFor="otp">OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
          </div>
        )}
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChangePhoneNumber;
