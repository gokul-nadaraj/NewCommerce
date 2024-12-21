import React, { useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import "./Checkout.css";
import Payment from "../Payment/Payment";
import Order from "../Order/Order";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Checkout = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const location = useLocation();
    const { selectedCourier } = location.state || {}

    const [selectedCourierCharges, setSelectedCourierCharges] = useState(0);
    if (!selectedCourier) {
      return <p>No courier selected. Please go back and select a courier.</p>;
  }

  useEffect(() => {
    if (selectedCourier) {
      setSelectedCourierCharges(selectedCourier.cod_charges || 0); // Set COD charges from selected courier
    }
  }, [selectedCourier]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login", { state: { fromCheckout: true } });
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    country: "",
    mobileNo: "",
    pincode: "",
  });
  
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false); // For toggling visibility of all addresses
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [currentEditAddress, setCurrentEditAddress] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // Track the selected address
  const [addressesVisible, setAddressesVisible] = useState(false);

  // Fetch saved addresses for the logged-in user
  const fetchUserAddresses = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const data = userDoc.data();
        setSavedAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching user addresses:", error);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);
  
  // Handle form submission for adding or editing addresses

  const handleSubmitAddress = async (newAddress) => {
    const user = auth.currentUser;
  
    if (!user) {
      alert("Please log in to save your address.");
      navigate("/login");
      return;
    }
  
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      let updatedAddresses = [];
  
      if (userDoc.exists()) {
        updatedAddresses = [...(userDoc.data()?.addresses || [])];
      } else {
        await setDoc(userRef, { addresses: [] });
      }
  
      // Set the first address as default
      if (updatedAddresses.length === 0) {
        newAddress.isDefault = true; // Set the first address as default
      } else {
        newAddress.isDefault = false; // Otherwise, it's not the default
      }
  
      if (formMode === "add") {
        newAddress.id = Date.now();
        updatedAddresses.push(newAddress);
      } else if (formMode === "edit") {
        updatedAddresses = updatedAddresses.map((address) =>
          address.id === currentEditAddress?.id ? { ...address, ...newAddress } : address
        );
      }
  
      await updateDoc(userRef, { addresses: updatedAddresses });
  
      alert(formMode === "add" ? "Address added successfully!" : "Address updated successfully!");
      setIsPopupVisible(false);
  
      // Update the addresses list after save
      setSavedAddresses(updatedAddresses);
  
    } catch (error) {
      console.error("Error saving address: ", error);
      alert("Failed to save address.");
    }
  };

  const handleChangeAddressClick = () => {
    setShowAllAddresses(!showAllAddresses); // Toggle the visibility of the address list
    setAddressesVisible(true); // Trigger the animation for each address card
  };
  

 






  // Handle add new address button
  const handleAddNewAddressClick = () => {
    setFormMode("add");
    setCurrentEditAddress(null); 
    setIsPopupVisible(true);
  };



  
  // Handle edit button for an existing address
  const handleEditAddressClick = (address) => {
    setFormMode("edit");
    setCurrentEditAddress(address); // Set the address to be edited
    setIsPopupVisible(true); // Show the form popup
  };



  
  const handleSelectAddress = (address) => {
    setSelectedAddress(address); // Update the selected address state
  };
  



  const handleUpdateAddress = async (updatedAddress) => {
    try {
      const updatedAddresses = savedAddresses.map((address) =>
        address.id === updatedAddress.id ? updatedAddress : address
      );
  
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { addresses: updatedAddresses });
  
      setSavedAddresses(updatedAddresses);
      toast.success("Address updated successfully!");
      setIsPopupVisible(false); // Close the form
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address.");
    }
  };




  const sortedAddresses = [...savedAddresses].sort((a, b) =>
    a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
  );





  const handleMakeDefault = async (addressId) => {
    // Mark the selected address as default by updating the state
    const updatedAddresses = savedAddresses.map((address) => ({
      ...address,
      isDefault: address.id === addressId, // Mark the selected address as default
    }));
  
    try {
      // Update Firestore with the modified addresses and default ID
      await updateDoc(doc(db, "users", user.uid), {
        addresses: updatedAddresses,
        defaultAddressId: addressId, // Save default address ID separately
      });
  
      // Update local state with the updated addresses
      setSavedAddresses(updatedAddresses);
  
      // Automatically set the default address as selected
      const defaultAddress = updatedAddresses.find((address) => address.isDefault);
      setSelectedAddress(defaultAddress);
  
      // Hide the other addresses once the default address is selected
      setShowAllAddresses(false);
  
      console.log("Default address updated:", defaultAddress);
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };




  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      state: "",
      country: "",
      mobileNo: "",
      pincode: "",
    });
    setIsPopupVisible(false);
  };
  


  
  return (
 
<div className="container">

  {/* Default Address */}
  <div className="checkout-container">
  <h1 onClick={() => setShowAllAddresses(!showAllAddresses)} className="header">1.Delivery Address</h1>

  {/* Check if any address is available */}
  {sortedAddresses.length > 0 ? (
    <div className="address-card">
      <div className="address-header">
        <input
          type="radio"
          name="selectedAddress"
          className="radio-input"
          checked={selectedAddress?.isDefault} // Ensure default address is selected
          onChange={() => handleSelectAddress(sortedAddresses[0])} // Select default address
        />
        <div className="address-content">
          <span className="address-title">
            {sortedAddresses[0].firstName} | {sortedAddresses[0].lastName} | {sortedAddresses[0].mobileNo}
          </span>
          <span className="address-details">
            {sortedAddresses[0].addressLine1}, {sortedAddresses[0].addressLine2}, {sortedAddresses[0].state}, {sortedAddresses[0].country}, {sortedAddresses[0].pincode}
          </span>
        </div>

        {/* Change Address Button */}
        <button
          onClick={handleChangeAddressClick} // Toggle address list visibility with smooth transition
          className="toggle"
        >
          {showAllAddresses ? "Hide" : "Change "}
        </button>

        {/* Edit button for default address */}
        <button
          onClick={() => handleEditAddressClick(sortedAddresses[0])}
          className="edit-button1"
        >
          Edit
        </button>
      </div>

      {/* Show other addresses */}
      {showAllAddresses && (
        <div className="address-list">
          {sortedAddresses.slice(1).map((address) => (
            <div key={address.id} className="address-card-horizontal">
              <div className="address-header1">
                <input
                  type="radio"
                  name="selectedAddress"
                  className="radio-input1"
                  checked={selectedAddress?.id === address.id} // Compare IDs
                  onChange={() => handleSelectAddress(address)} // Handle radio button click
                />
                <div className="address-content">
                  <span className="address-title">
                    {address.firstName} | {address.lastName} | {address.mobileNo}
                  </span>
                  <span className="address-details">
                    {address.addressLine1}, {address.addressLine2}, {address.state}, {address.country}, {address.pincode}
                  </span>
                </div>

                {/* Deliver Here button */}
                {selectedAddress?.id === address.id && (
                  <button
                    onClick={() => handleMakeDefault(address.id)} // Set selected address as default
                    className="use"
                  >
                    Deliver Here
                  </button>
                )}

                {/* Edit button for other addresses */}
                <button
                  onClick={() => handleEditAddressClick(address)} // Open the form with this address data
                  className="edit-button"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <p>No address selected.</p>
  )}


    {/* Show all other addresses if "Change Address" is clicked */}
    <button onClick={handleAddNewAddressClick} className="add-button">Add a new address</button>
 {isPopupVisible && (
  <div className="popup-container">
    <div className="form-container">
      <div className="form-header">
        <h2 className="added">{formMode === "add" ? "Add New Address" : "Edit Address"}</h2>
        <button className="close-button" onClick={() => setIsPopupVisible(false)}>×</button>
      </div>
 
      <form
  onSubmit={(e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const address = Object.fromEntries(formData);

    if (formMode === "edit") {
      address.id = currentEditAddress?.id; // Ensure the ID remains the same
      handleUpdateAddress(address); // Update the existing address
    } else if (formMode === "add") {
      const newAddress = { ...address, id: Date.now() };
      handleSubmitAddress(newAddress); // Add a new address
    }

    resetForm(); // Reset form fields
  }}
>

  
    {/* Form Fields */}
    <div className="form-grid">
      <label>
        First Name
        <input
          name="firstName"
          defaultValue={formMode === "edit" ? currentEditAddress?.firstName : ""}
          required
        />
      </label>
      <label>
        Last Name
        <input
          name="lastName"
          defaultValue={formMode === "edit" ? currentEditAddress?.lastName : ""}
          required
        />
      </label>
      <label>
        Mobile Number
        <input
          name="mobileNo"
          type="tel"
          defaultValue={formMode === "edit" ? currentEditAddress?.mobileNo : ""}
          required
        />
      </label>
      <label>
        Address Line 1
        <input
          name="addressLine1"
          defaultValue={formMode === "edit" ? currentEditAddress?.addressLine1 : ""}
          required
        />
      </label>
      <label>
        Address Line 2
        <input
          name="addressLine2"
          defaultValue={formMode === "edit" ? currentEditAddress?.addressLine2 : ""}
        />
      </label>
      <label>
        State
        <input
          name="state"
          defaultValue={formMode === "edit" ? currentEditAddress?.state : ""}
          required
        />
      </label>
      <label>
        Country
        <input
          name="country"
          defaultValue={formMode === "edit" ? currentEditAddress?.country : ""}
          required
        />
      </label>
      <label>
        Pincode
        <input
          name="pincode"
          defaultValue={formMode === "edit" ? currentEditAddress?.pincode : ""}
          required
        />
      </label>
    </div>
    <button type="submit" className="save-address">
      {formMode === "add" ? "Add Address" : "Save Changes"}
    </button>
  </form>


    </div>
  </div>
)}


<Order/> 

<Payment/> 

</div>






<div className="combine conatiner">
<div className="price-details-container">
          <h2>Price Details</h2>

          <div className="total-details">
          <p>Total MRP:</p>
          <span>₹{cart.items.reduce((total, item) => total + item.total, 0)}</span>

          </div>

          <div className="total-details">
          <p>Additional Shipping Charges:</p>
          <span>₹{selectedCourierCharges}</span>
          </div>
<div className="total-details1">
<p className="amount">Total Amount:</p>
<span>
    ₹{(
      parseFloat(cart.items.reduce((total, item) => total + item.total, 0).toFixed(2)) +
      selectedCourierCharges
    ).toFixed(2)} 
  </span>
</div>
  </div>


<div className="checkout-select-container">

    {selectedCourier ? (
        <div>
            <h3>Your selected Courier Address:</h3>
            <p>
                Your order will be delivered via <strong>{selectedCourier.courier_name}</strong> 
                in <strong>{selectedCourier.city || "N/A"}</strong>. The delivery is expected 
                within <strong>{selectedCourier.estimated_delivery_days || "N/A"} days</strong>, 
                and the estimated delivery date is <strong>{selectedCourier.etd || "N/A"}</strong>. 
                If applicable, the Cash on Delivery (COD) charges are <strong>₹{selectedCourier.cod_charges || "N/A"}</strong>.
                Thank you for choosing our service!
            </p>
        </div>
    ) : (
        <p>No courier selected. Please go back and select a courier.</p>
    )}
</div>
        </div>




  </div>
  
  );
};

export default Checkout;