import React, { useEffect } from "react";
import shp1 from "/images/Govindaraja1.webp";
import shp2 from "/images/Govindaraja2.webp";
import shp3 from "/images/Govindaraja2.webp"; // Adjusted path
import "../TinyCarts/TinyCarts.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Aos from "aos";
import "aos/dist/aos.css";
// import './src/index.css'

const TinyCarts = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 5000, // Change image every 5 seconds (5000ms)
  };
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div>
      <section>
        <div className="head1">
          <h1 className="welcome">Welcome to Tinykarts </h1>
          <span> Empowering Local Artisans, Connecting Global Markets</span>
        </div>

        <div className="banner">
          <div className="slide">
            <p
              data-aos="fade-right"
              data-aos-delay="100"
              data-aos-duration="1000"
            >
              At Tinykarts, we bridge the gap between village craftsmanship and
              the global marketplace. Our platform is dedicated to showcasing
              the talent and creativity of small-scale manufacturers from rural
              communities, bringing their unique, high-quality products to
              customers worldwide.
            </p>
          </div>

          <div className="banner-1">
            <div
              data-aos="fade-left"
              data-aos-delay="400"
              data-aos-duration="1000"
            >
              {/* React Slick Slider */}
              <Slider {...settings} className="border-2">
                <div>
                  <img
                    src={shp1}
                    alt="Image 1"
                    style={{ width: "100%" }}
                    className="img-round"
                  />
                </div>
                <div>
                  <img
                    src={shp2}
                    alt="Image 2"
                    style={{ width: "100%" }}
                    className="img-round"
                  />
                </div>
                <div>
                  <img
                    src={shp3}
                    alt="Image 3"
                    style={{ width: "100%" }}
                    className="img-round"
                  />
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TinyCarts;
