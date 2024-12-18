import React, { useEffect } from "react";
import "./Product.css";
import img from "/images/craft1.png";
import img2 from "/images/organic1.png";
import img3 from "/images/bed1.png";
import img4 from "/images/gift1.png";
import Aos from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Product = () => {
  useEffect(() => {
    Aos.init();
  }, []);

  const pageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <section>
        <div className="head1">
          <h1 className="text  text-4xl sm:text-6xl font-bold text-indigo-700 animate-bounce transition duration-500 ease-in-out">Our Product Categories </h1>
          <span id="class">Explore a wide range of locally sourced products</span>
        </div>
        <div className="All-box">
          <div
            data-aos="fade-down-left"
            data-aos-delay="100"
            data-aos-duration="1000"
            data-aos-easing="ease"
          >
            <Link to="/craft">
              <div className="box bg-image hover-zoom">
                <img src={img} alt="open" />
              </div>
            </Link>
            <span className="box-label">Handcrafted Home Décor</span>
          </div>

          <div
            data-aos="fade-down-left"
            data-aos-delay="300"
            data-aos-duration="1000"
            data-aos-easing="ease"
          >
            <Link to="/Organic-products">
              <div className="box">
                <img src={img2} alt="" />
              </div>
            </Link>
            <span className="box-label">Organic and Sustainable Goods</span>
          </div>

          <div
            data-aos="fade-down-left"
            data-aos-delay="300"
            data-aos-duration="1000"
            data-aos-easing="ease"
          >
            <Link to="/Bedsheet-products">
              <div className="box">
                <img src={img3} alt="" />
              </div>
            </Link>
            <span className="box-label">Traditional Wear and Accessories</span>
          </div>

          <div
            data-aos="fade-down-left"
            data-aos-delay="300"
            data-aos-duration="1000"
            data-aos-easing="ease"
          >
            <Link to="/Gift-products">
              <div className="box">
                <img src={img4} alt="" />
              </div>
            </Link>
            <span className="box-label">Unique Gifts and Souvenirs</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
