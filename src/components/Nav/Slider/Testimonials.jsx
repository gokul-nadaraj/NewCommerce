import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Slider.css';
import User from '/images/banner.webp';
import User1 from '/images/banner1.webp';

function Testimonials() {
  useEffect(() => {
    console.log("Component mounted, slider initialized");
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="slider-wrapper">
      <Slider {...settings}>
        <div className="slide">
          <img src={User} alt="Image 1" className="slider-image" />
        </div>
        <div className="slide">
          <img src={User1} alt="Image 2" className="slider-image" />
        </div>
        <div className="slide">
          <img src={User} alt="Image 3" className="slider-image" />
        </div>
      </Slider>
    </div>
  );
}

export default Testimonials;
