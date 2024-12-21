import React, { useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase"; // Ensure Firestore is properly imported
import ChangePassword from "../PasswordChange/Password";
import ChangeEmail from "../EmailChange/ChangeEmail";
import AOS from "aos";
import { motion } from "framer-motion";
import "aos/dist/aos.css";
import "./Accounts.css";
import web from "/images/web.png";

const Accounts = () => {
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState("main"); // "main", "password", or "email"
  const [loading, setLoading] = useState(true); // Track loading state for Firebase auth

  // Framer Motion Variants for Animation
  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setLoading(true);
        console.log("Current User:", user); // Logs auth user data
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            console.log("Fetched Firestore Data:", docSnap.data());
            const data = docSnap.data();
            setUserData({
              username: data.username || "Not Provided",
              email: data.email || "Not Provided",
              phone: data.phoneNumber || "Not Provided",
            });
          } else {
            console.log("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching Firestore data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No user is signed in.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="main">
      {/* Contact Information Section */}
      {loading ? (
        <p>Loading user data...</p>
      ) : (
        <>
          <div className="contact-info">
            <p>Contact Information</p>
            {userData ? (
              <div className="info">
                <p>
                  <span className="span-name">UserName:</span> {userData.username}
                </p>
                <p>
                  <span className="span-name">UserEmail:</span> {userData.email}
                </p>
                <p>
                  <span className="span-name">UserPhone:</span> {userData.phone}
                </p>
              </div>
            ) : (
              <p>No user data available.</p>
            )}
             <div className="Password-container">
            <button onClick={() => setCurrentView("password")} className="password-co">
              Change Password
            </button>
            <button onClick={() => setCurrentView("email")} className="password-co">
              Edit Profile
            </button>
          </div>
          </div>

         
        </>
      )}

      {/* Main Image or Forms */}
      <div className="main-img">
        <motion.div
          key={currentView}
          initial="hidden"
          className="animated-view"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5 }}
        >
          {currentView === "main" && (
            <div className="main-img">
              <img src={web} alt="Profile Section" />
            </div>
          )}
          {currentView === "password" && <ChangePassword />}
          {currentView === "email" && <ChangeEmail />}
        </motion.div>

        {/* Back Button */}
        {currentView !== "main" && (
          <button
            className="learn-more"
            onClick={() => setCurrentView("main")}
          >
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Back</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Accounts;
