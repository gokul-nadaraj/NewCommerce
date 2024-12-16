import React, { useEffect } from 'react';
import './Product.css';
import img from '/images/craft1.png';
import img2 from '/images/organic1.png';
import img3 from '/images/bed1.png';
import img4 from '/images/gift1.png';
import Aos from "aos"
import 'aos/dist/aos.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';



export const Product = () => {

  useEffect(()=>{
Aos.init()
  },[]) 
  return (
    <div>
      <section>
    
        <div className='head1'>
            <h1 className='text'>Our Product Categories </h1>
            <span>Explore a wide range of locally sourced products</span>
        </div>
        <div className='All-box'>
          <div data-aos="fade-down-left" data-aos-delay="100" data-aos-duration="1000"
            data-aos-easing="ease">
<Link to='craft'>
<div className='box bg-image hover-zoom'><img src={img}alt="open" /></div>
</Link>
       
       
          <span className='box-label'>Handcrafted Home Décor</span>
          </div>
     
<div data-aos="fade-down-left" data-aos-delay="300" data-aos-duration="1000" data-aos-easing="ease">
<Link to='Organic-products'>
<div className='box'><img src={img2}alt="" /></div>
</Link>

<span className='box-label'>Organic and Sustainable Goods</span>
</div>
         
       
<div data-aos="fade-down-left" data-aos-delay="300" data-aos-duration="1000"
            data-aos-easing="ease">
<Link to='/Bedsheet-products'>
<div className='box'><img src={img3}alt="" /></div>

</Link>
<span className='box-label'>Traditional Wear and Accessories</span>
</div>
       
         
<div data-aos="fade-down-left" data-aos-delay="300" data-aos-duration="1000"
            data-aos-easing="ease">

<Link to='/Gift-products'>
<div className='box'><img src={img4}alt="" /></div>

</Link>

<span className='box-label'>Unique Gifts and Souvenirs</span>
</div>
         
        </div>
      </section>
    </div>
  );
};
