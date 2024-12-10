import React, { useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";
import ChangePassword from "../PasswordChange/Password"; // Import ChangePassword component
import ChangeEmail from "../EmailChange/ChangeEmail"; // Import ChangeEmail component
import "./Accounts.css";
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();
import { motion } from "framer-motion";
import web from "/images/web.png";
import { FaArrowLeftLong } from "react-icons/fa6";
import Aos from "aos";
const Accounts = () => {
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState("main"); // "main", "password", or "email"
  console.log('currentView:', currentView);
  console.log('setCurrentView:', setCurrentView);
  

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };


useEffect(()=>{
  AOS.init()
},[])






  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData({
        username: user.displayName || "Not Provided",
        email: user.email || "Not Provided",
        phone: user.phoneNumber || "Not Provided",
      });
    }
  }, []);

  return (
    <div className="main">
      <div className="contact-info">
        <p>Contact Information</p>
        {userData ? (
          <div className="info">
            <p>
              <span className="span-name">UserName:</span>{userData.username}
            </p>
            <p>    <span className="span-name">UserEmail:</span> 
           {userData.email}
            </p>
            <p>   <span className="span-name">UserPhone:</span> 
               {userData.phone}
            </p>
            <div className="Password-container">
              <button onClick={() => setCurrentView("password")} className="password-co">
                Change Password
              </button>
              <button onClick={() => setCurrentView("email")} className="password-co">
                Change Email
              </button>
            </div>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      
    <div className="main-img">
      {/* Conditional rendering for forms */}
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
            <img src={web} alt="open" />
          </div>
        )}
        {currentView === "password" && <ChangePassword />}
        {currentView === "email" && <ChangeEmail />}
      </motion.div>
      {/* Cancel Button */}
      <button class="learn-more">
  <span class="circle" aria-hidden="true">
  <span class="icon arrow"></span>
  </span>
  <span class="button-text">Back</span>
</button>
    </div>
  </div>
  );
};

export default Accounts;

/* From Uiverse.io by cssbuttons-io */ 
//     {currentView !== "main" && (
//   <button
//   type="button"
//   className="password"
//   onClick={() => {
//     console.log("Cancel button clicked. Navigating to 'main' view.");
//     setCurrentView("main");
//   }}
// >
//   <span class="circle" aria-hidden="true">

//   </span>
//   <span class="icon arrow">
  
//   </span>
//   <span class="button-text">Back</span>
// </button>
// )}