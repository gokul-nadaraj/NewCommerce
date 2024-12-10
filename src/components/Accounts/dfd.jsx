import React, { useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";
import Password from "../PasswordChange/Password"; // Import the Password component
import './Accounts.css';

const Accounts = () => {
  const [userData, setUserData] = useState(null);
  const [showPasswordComponent, setShowPasswordComponent] = useState(false); // State to toggle Password component

  useEffect(() => {
    const user = auth.currentUser; // Get the currently signed-in user
    if (user) {
      // Set user data from auth
      setUserData({
        username: user.displayName || "Not Provided",
        email: user.email || "Not Provided",
        phone: user.phoneNumber || "Not Provided",
      });
    }
  }, []);

  const handlePasswordToggle = () => {
    setShowPasswordComponent((prevState) => !prevState); // Toggle Password component visibility
  };

  return (
    <div className="dashboard-container">
      <div className="Your-headers">
        <p>My Dashboard</p>
        <p>Account Information</p>
        <p>Orders</p>
        <p>Logout</p>
      </div>

      <div className="contact-info">
        <p>My Dashboard</p>
        <p>Contact Information</p>

        {userData ? (
          <div className="info">
            <p>
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {userData.phone}
            </p>
            <div className="Password-container">
              <button onClick={handlePasswordToggle}>Change Password</button>
            </div>

            {/* Conditionally render Password component */}
            {showPasswordComponent && <Password />}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Accounts;
