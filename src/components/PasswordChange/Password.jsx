import React from 'react'
import { auth,  } from "../Firebase/Firebase";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { useState } from 'react';
import './Password.css'
import { useCart } from '../CartContext';

const Password = () => {


    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);


    // Handle change password button clicck
  
    // Handle password change form submission
    const handlePasswordChange = async (e) => {
      e.preventDefault();
  
      // Validate if new password matches confirm password
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match");
        return;
      }
  
      if (newPassword.length < 6) {
        setError("New password should be at least 6 characters long");
        return;
      }
  
      try {
        const user = auth.currentUser;
  
        // Check if the user is authenticated
        if (!user) {
          setError("User is not authenticated");
          return;
        }
  
        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
        await reauthenticateWithCredential(user, credential);
  
        // Update the password
        await updatePassword(user, newPassword);
  
        alert("Password changed successfully!");
        setIsChangingPassword(false); // Close the form after success
      } catch (error) {
        console.error("Error changing password:", error);
        setError("Failed to change password. Please try again.");
      }
    };
  
    return (
      <div className="password-container">
        {/* Change Password Form */}

          <div className="password-change-form">
            <h4>Change Password</h4>
            <form onSubmit={handlePasswordChange}>
              <div>
                <label htmlFor="current-password">Current Password:</label>
                <input
                  type="password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="new-password">New Password:</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm-password">Confirm New Password:</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="submit"  className='password-btn'>Submit</button>
      
     

            </form>
          </div>
       
      </div>
    );
  };



export default Password