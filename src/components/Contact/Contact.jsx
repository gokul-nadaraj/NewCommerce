  import React, { useEffect } from 'react';
  import AOS from 'aos';
  import 'aos/dist/aos.css'; // Import AOS CSS
  import './ContactUs.css';

  const ContactUs = () => {
    // Initialize AOS for animations
    useEffect(() => {
      AOS.init({ duration: 1000, once: true }); // Initialize AOS with options
    }, []);

    return (
      <div className="contact-section-wrapper" data-aos="fade-up">
        <h1 id="Black">Contact Us</h1>
        <p id='Black'>At TinyKarts, we’re always here to help you! Whether you have questions about your order, need support with our products, or want to collaborate with us, we’re just a call or click away.</p>

        <div className="contact-info-wrapper">
          <div className="contact-info-card" data-aos="fade-right">
            <h2><span>📞</span> Get in Touch:</h2>
            <ul>
              <li>• Phone: +91 99526 12300</li>
              <li>• Email: <a href="mailto:yesuraj88@gmail.com">yesuraj88@gmail.com</a></li>
            </ul>
          </div>

          <div className="contact-info-card" data-aos="fade-left">
            <h2><span>🌐</span> Visit Us Online:</h2>
            <p>Explore our wide range of products and services at:</p>
            <a href="https://www.tinykarts.com" target="_blank" rel="noopener noreferrer">https://www.tinykarts.com</a>
          </div>

          <div className="contact-info-card" data-aos="fade-up">
            <h2><span>📍</span> Our Office:</h2>
            <p>TinyKarts - Connecting Small Businesses to Big Markets</p>
          </div>

          <div className="contact-info-card" data-aos="fade-right">
            <h2><span>🕒</span> Business Hours:</h2>
            <ul>
              <li>• Monday to Saturday: 9 AM – 6 PM</li>
              <li>• Sunday: Closed</li>
            </ul>
          </div>

          <div className="contact-info-card" data-aos="fade-left">
            <h2>Why Contact TinyKarts?</h2>
            <ul>
              <li>Fast Customer Support: Quick responses to your queries and concerns.</li>
              <li>Bulk Orders & Collaborations: We love working with small manufacturers and businesses to help their products reach a wider audience.</li>
              <li>Order Assistance: Get support with order tracking, shipping details, or returns.</li>
              <li>Feedback & Suggestions: Your feedback is invaluable to us—help us serve you better.</li>
            </ul>
          </div>

          <div className="contact-info-card" data-aos="fade-up">
            <h2>🔔 Need Help? Contact Us Now!</h2>
            <p>Call or email us today, and our team will get back to you as soon as possible.</p>
          </div>
        </div>
      </div>
    );
  };

  export default ContactUs;
