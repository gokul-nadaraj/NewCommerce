import React from "react";
import logo from "/images/logo.png";
import "./Footer.css";

const Footer = () => {
  return (
<footer className="text-white py-8">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      {/* Email Section */}
      <div className="order-2 md:order-1 text-center md:text-left mb-4 md:mb-0">
        <p className="text-sm sm:text-base md:text-lg font-normal">
          Contact:{" "}
          <a
            href="mailto:your-email@example.com"
            className="text-blue-400 hover:text-blue-600 Atag"
          >
            yesuraj88@gmail.com
          </a>
        </p>
      </div>

      {/* Logo Section */}
      <div className="order-1 md:order-2 flex items-center space-x-3 mb-4 md:mb-0">
        <img
          src={logo} // replace with your logo path
          alt="Logo"
          className="w-13 h-20"
        />
      </div>
    </div>

    {/* Developer Credit */}
    <div className="text-center text-sm sm:text-base md:text-lg font-light">
      <p style={{fontSize:"20px"}}>
        Website developed by{" "}
        <a
          href="https://www.seelangraphics.com/"
          target="_blank"
          className="text-blue-400 hover:text-blue-600 Atag"
        >
          Seelan graphic compass pvt ltd
        </a>
      </p>
      <p style={{fontSize:"20px"}}>Copyrights © 2024 TinyKarts. All Rights Reserved.</p>
    </div>
  </div>
</footer>

  );
};

export default Footer;
