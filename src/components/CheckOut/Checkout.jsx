import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import "./Checkout.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Payment from "../Payment/Payment";
import Order from "../Order/Order";

import { Link } from "react-router-dom";

const Checkout = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  
  
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


  const handleUseThisLocation = async () => {
    if (!selectedAddress) return;

    // Move the selected address to the first position in the list
    const updatedAddresses = savedAddresses.filter(address => address.id !== selectedAddress.id);
    const newAddresses = [selectedAddress, ...updatedAddresses];

    // Set the selected address as the default
    const finalAddresses = newAddresses.map((address, index) => ({
      ...address,
      isDefault: index === 0, // Set the first address as default
    }));

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { addresses: finalAddresses });
      setSavedAddresses(finalAddresses);
    } catch (error) {
      console.error("Error updating addresses:", error);
      alert("Failed to update address.");
    }
  };







  // Reset form data
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
  
  // Handle add new address button
  const handleAddNewAddressClick = () => {
    setFormMode("add");
    setCurrentEditAddress(null); 
    setIsPopupVisible(true);
  };
  
  // Handle edit button for an existing address
  const handleEditButtonClick = (address) => {
    setFormMode("edit");
    setCurrentEditAddress(address);
    setIsPopupVisible(true);          
  };
  
  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    const user = auth.currentUser;
  
    if (!user) {
      alert("Please log in to delete your address.");
      navigate("/login");
      return;
    }
  
    try {
      const updatedAddresses = savedAddresses.filter((address) => address.id !== addressId);
  
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { addresses: updatedAddresses });
  
      setSavedAddresses(updatedAddresses);
  
      alert("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address: ", error);
      alert("Failed to delete the address.");
    }
  };

  const handleSelectAddress = async (address) => {
    const updatedAddresses = savedAddresses.map((addr) =>
      addr.id === address.id
        ? { ...addr, isDefault: true } // Set the selected address as default
        : { ...addr, isDefault: false } // Set others as not default
    );
  
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { addresses: updatedAddresses });
      setSavedAddresses(updatedAddresses);
      setSelectedAddress(address); // Update the selected address state
    } catch (error) {
      console.error("Error updating default address:", error);
      alert("Failed to update the default address.");
    }
  };
  
  const handleChangeAddressClick = () => {
    setShowAllAddresses(!showAllAddresses); // Toggle visibility of all addresses
  };
   // Render the addresses
  return (
    <div className="container">
    <h1>Delivery Address</h1>

    {/* Show the first address (default) */}
    {savedAddresses.length > 0 && (
      <div className="address-card">
        <input
          type="radio"
          name="selectedAddress"
          checked={selectedAddress?.id === savedAddresses[0].id} // Compare with selectedAddress
          onChange={() => handleSelectAddress(savedAddresses[0])}
        />
        <p>{savedAddresses[0].firstName} {savedAddresses[0].lastName}</p>
        <p>{savedAddresses[0].mobileNo}</p>
        <p>{savedAddresses[0].addressLine1}, {savedAddresses[0].addressLine2}, {savedAddresses[0].state}, {savedAddresses[0].country}, {savedAddresses[0].pincode}</p>
        <button onClick={handleChangeAddressClick} className="change-button">
          Change Address
        </button>
      </div>
    )}

    {/* Show all other addresses if "Change Address" is clicked */}
    {showAllAddresses && savedAddresses.length > 1 && (
      <div className="address-list">
        {savedAddresses.slice(1).map((address) => (
          <div key={address.id} className="address-card">
            <input
              type="radio"
              name="selectedAddress"
              checked={selectedAddress?.id === address.id} // Use selectedAddress to check
              onChange={() => handleSelectAddress(address)} // Handle radio button click
            />
            <p>{address.firstName} {address.lastName}</p>
            <p>{address.mobileNo}</p>
            <p>{address.addressLine1}, {address.addressLine2}, {address.state}, {address.country}, {address.pincode}</p>
          </div>
        ))}
        <button onClick={handleUseThisLocation} className="use-location-button">
          Use this location
        </button>
      </div>
    )}

      <button onClick={handleAddNewAddressClick} className="add-button">Add a new address</button>
    



  
     




  


    {/* Popup form for adding new address */}
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

      address.id = currentEditAddress?.id;
      handleUpdateSelectedAddress(address); 
    } else if (formMode === "add") {
      const newAddress = { ...address, id: Date.now() };
      handleSubmitAddress(newAddress); // Add the new address
    }

    resetForm(); 
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
 

    <div>  




<Order/>  


<Payment/>



  </div>
  <div className="price-details-container">
          <h2>Price Details</h2>

          <div className="total-details">
          <p>Total MRP:</p>
          <span>₹{cart.items.reduce((total, item) => total + item.total, 0)}</span>

          </div>

          <div className="total-details">
          <p>Additional Shipping Charges:</p>
          <span>₹900</span>
          </div>
<div className="total-details1">
<p className="amount">Total Amount:</p>
<span>₹{parseFloat(cart.items.reduce((total, item) => total + item.total, 0)).toFixed(2)}</span>
</div>
</div>

  </div>
  
  );
};

export default Checkout;