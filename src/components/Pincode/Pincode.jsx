import React, { useState, useEffect } from "react";
import axios from "axios";
import './pincode.css'



const Pincode = () => {
    const [pincode, setPincode] = useState("");
    const [status, setStatus] = useState(null);
    const [courierDetails, setCourierDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiToken, setApiToken] = useState(null);
    const [selectedCourier, setSelectedCourier] = useState(null);


    const AUTH_API_URL = "https://apiv2.shiprocket.in/v1/external/auth/login";
    const PINCODE_API_URL =
        "https://apiv2.shiprocket.in/v1/external/courier/serviceability";

    // Function to get the API Token dynamically
    const fetchApiToken = async () => {
        try {
            const response = await axios.post(AUTH_API_URL, {
                email: "jayarajgunaseelan1990@gmail.com",
                password: "Hello@@123",
            });

            const { token } = response.data;
            console.log("Fetched API Token:", token); // Log the token for debugging
            setApiToken(token);
        } catch (error) {
            console.error("Error fetching API token:", error.response?.data || error.message);
            setStatus("Error authenticating. Please check your credentials.");
        }
    };

    // Fetch token on component mount
    useEffect(() => {
        fetchApiToken();
    }, []);

    // Function to check pincode serviceability
    const checkPincode = async () => {
        if (!apiToken) {
            setStatus("Unable to authenticate. Please try again later.");
            return;
        }

        setLoading(true);
        setStatus(null);
        setCourierDetails([]);

        try {
            console.log("Using API Token:", apiToken); // Debug token
            console.log("Requesting Pincode:", pincode); // Debug pincode

            const response = await axios.get(PINCODE_API_URL, {
                params: {
                    pickup_postcode: "638051", // Your store's pincode
                    delivery_postcode: pincode,
                    cod: 1, // Cash on Delivery (1 for COD, 0 for Prepaid)
                    weight: 1,
                },
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            });


            const availableCouriers = response.data.data.available_courier_companies;
            console.log("API Response:", response.data.data.available_courier_companies);

            if (response.data.status && Array.isArray(availableCouriers) && availableCouriers.length > 0) {
                setCourierDetails(availableCouriers);
                setStatus(`Pincode ${pincode} is serviceable.`);
            } else {
                setStatus(`Pincode ${pincode} is not serviceable.`);
            }
        } catch (error) {
            console.error(
                "Error checking pincode:",
                error.response?.data || error.message
            );
            setStatus(
                error.response?.data?.message || "Error checking pincode. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };
    const handleCourierSelect = (index) => {
        setSelectedCourier(courierDetails[index]);
    };

  


    return (
        <div className="pindoe-container">
            <h4>Check Pincode Serviceability</h4>
<div className="main-container1">




            <div className="form-control">
      <input
        type="text"
        value={pincode}
        required
        onChange={(e) => setPincode(e.target.value)}
      />
      <label>
      <span style={{ transitionDelay: "0ms" }}>E</span>
<span style={{ transitionDelay: "50ms" }}>n</span>
<span style={{ transitionDelay: "100ms" }}>t</span>
<span style={{ transitionDelay: "150ms" }}>e</span>
<span style={{ transitionDelay: "200ms" }}>r</span>
<span>&nbsp;</span>
<span style={{ transitionDelay: "300ms" }}>Y</span>
<span style={{ transitionDelay: "350ms" }}>o</span>
<span style={{ transitionDelay: "400ms" }}>u</span>
<span style={{ transitionDelay: "450ms" }}>r</span>
<span>&nbsp;</span>
<span style={{ transitionDelay: "0ms" }}>P</span>
<span style={{ transitionDelay: "50ms" }}>i</span>
<span style={{ transitionDelay: "100ms" }}>n</span>
<span style={{ transitionDelay: "150ms" }}>c</span>
<span style={{ transitionDelay: "200ms" }}>o</span>
<span style={{ transitionDelay: "250ms" }}>d</span>
<span style={{ transitionDelay: "300ms" }}>e</span>

      </label>
      </div>
      <div className="button-main">
      <button class="comic-button"

                onClick={checkPincode}
                disabled={loading || !apiToken}
          
            >
                {loading ? "Checking..." : "Check"}
            </button>
      </div>
      {status && <p className="status">{status}</p>} 
      </div>  
  
     
            {courierDetails.length > 0 ? (
                <form>
                    {courierDetails.map((courier, index) => (
                        <div key={index} className="main-container">
                        
                         <div className="radio-container"> 
                         <label>
                                <input
                                    type="radio"
                                    className="audio"
                                    name="courier"
                                    value={index}
                                    onChange={() => handleCourierSelect(index)}
                                    
                                />
                                  </label>
                         </div>
                            
                                  
                         <div className="courier-container">
    We delivered your order via <strong>{courier.courier_name}</strong> in <strong>{courier.city || "N/A"}</strong>. 
    The estimated delivery date is <strong>{courier.etd || "N/A"}</strong>, and Cash on Delivery charges are 
    <strong> ₹{courier.cod_charges || "N/A"}</strong>. Thank you for choosing our service!
</div>

                          
                        </div>
                    ))}
                </form>
            ) : (
                <p>No couriers available.</p>
            )}

            {selectedCourier && (
                <div className='seleteced-conatiner'>
              
                    <h2>Selected Courier Details</h2>
                    <div className="courier-container">
    Your order will be delivered by <strong>{selectedCourier.courier_name}</strong>. 
    The estimated delivery time is <strong>{selectedCourier.estimated_delivery_days || "N/A"} days</strong>, 
    with an expected delivery date of <strong>{selectedCourier.etd || "N/A"}</strong>. 
    Cash on Delivery charges for this order are <strong>₹{selectedCourier.cod_charges || "N/A"}</strong>. 
    Thank you for shopping with us!
</div>

                    </div>
            )}
        </div>
    );
};

export default Pincode;