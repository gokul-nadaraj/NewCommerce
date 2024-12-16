import React from 'react'
import sale from '/images/yarn.webp'; 
import sale2 from '/images/cotton.webp'; 
import User from '/images/Powermachine.webp'; 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import '../TinyCarts/TinyCarts.css';
// import Testimonials from '../Nav/Slider/estimonials';

import '../Vision/vision.css'

const Vision = () => {
    
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 5000, // Change image every 5 seconds (5000ms)
  };
  return (
    <div>
      <section>
        <div className='head1'>
            
            <h1 className='Vision text-center'>Our Vision</h1>
        </div>

        
        <div className='banner1'>
          

            <div className='banner-1'> 
                <div data-aos="fade-right" data-aos-delay="200" data-aos-duration="1000">
                    {/* React Slick Slider */}
                    <Slider {...settings} className="border-2">
                        <div>
                            <img src={sale} alt="Image 1" style={{ width: '100%' }}  className='img-round'  />
                        </div>
                        <div>
                            <img src={sale2} alt="Image 2" style={{ width: '100%' }}   className='img-round'  />
                        </div>
                        <div>
                            <img src={User} alt="Image 3" style={{ width: '100%' }}   className='img-round' />
                        </div>
                    </Slider>
                </div>
            </div>
            <div className='slide para'>
              <p data-aos="fade-left" className='para1' data-aos-delay="200" data-aos-duration="1000">We believe in creating a sustainable
platform where rural talent meets global
demand. Tinykarts is not just an ecommerce
site; it’s a movement to
empower communities and promote
responsible consumerism.</p>
            </div>
        </div>

      </section>
    </div>
  )
}

export default Vision;
