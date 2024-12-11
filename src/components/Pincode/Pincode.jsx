import React, { useState, useEffect } from "react";
import axios from "axios";

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
        <div style={{ padding: "1rem", background: "#f8f9fa" }}>
            <h4>Check Pincode Serviceability</h4>
            <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter your pincode"
                style={{
                    padding: "0.5rem",
                    marginRight: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                }}
            />
            <button
                onClick={checkPincode}
                disabled={loading || !apiToken}
                style={{
                    padding: "0.5rem 1rem",
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                }}
            >
                {loading ? "Checking..." : "Check"}
            </button>
            {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
            {courierDetails.length > 0 ? (
                <form>
                    {courierDetails.map((courier, index) => (
                        <div key={index} className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="courier"
                                    value={index}
                                    onChange={() => handleCourierSelect(index)}
                                    className="mr-4 cursor-pointer"
                                />
                                <div>
                                    <strong>Courier Name:</strong> {courier.courier_name}<br />
                                    <strong>City:</strong>{" "}
                                    {courier.city || "N/A"}<br />
                                    <strong>ETD:</strong> {courier.etd || "N/A"}<br />
                                    <strong>COD Charges:</strong> ₹{courier.cod_charges || "N/A"}
                                </div>
                            </label>
                        </div>
                    ))}
                </form>
            ) : (
                <p>No couriers available.</p>
            )}

            {selectedCourier && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h2 className="text-xl font-bold">Selected Courier Details</h2>
                    <p><strong>Courier Name:</strong> {selectedCourier.courier_name}</p>
                    <p>
                        <strong>Estimated Delivery Days:</strong>{" "}
                        {selectedCourier.estimated_delivery_days || "N/A"}
                    </p>
                    <p><strong>ETD:</strong> {selectedCourier.etd || "N/A"}</p>
                    <p><strong>COD Charges:</strong> ₹{selectedCourier.cod_charges || "N/A"}</p>
                </div>
            )}
        </div>
    );
};

export default Pincode;