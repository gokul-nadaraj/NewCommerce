import React from "react";
import { Outlet, Link } from "react-router-dom";
import './Dasboard.css'
const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <div className="Your-headers">
        <p><Link to="/dashboard">My Dashboard</Link></p>
        <p><Link to="/dashboard">Account Information</Link></p>
        <p><Link to="/dashboard">Orders</Link></p>
        <p>Logout</p>
      </div>
      <div className="content">
        <Outlet /> {/* Renders nested components */}
      </div>
    </div>
  );
};

export default DashboardLayout;
