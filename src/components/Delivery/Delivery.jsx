import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import "./Delivery.css";
import { FaPlus } from "react-icons/fa";

const Delivery = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [formData, setFormData] = useState(initialFormData());
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentEditAddress, setCurrentEditAddress] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login", { state: { fromCheckout: true } });
      } else {
        setUser(currentUser);
        fetchAddresses(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchAddresses = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const addresses = userDoc.data()?.addresses || [];
        setSavedAddresses(addresses);
        setSelectedAddress(
          addresses.find((address) => address.isDefault) || null
        );
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      alert("Failed to load addresses. Please refresh the page.");
    }
  };

  const handleSaveAddress = async (newAddress) => {
    if (!user) return navigate("/login");

    try {
      const userRef = doc(db, "users", user.uid);
      let updatedAddresses = [...savedAddresses];

      if (formMode === "add") {
        // Adding a new address
        const isFirstAddress = savedAddresses.length === 0;
        newAddress = { ...formData, id: Date.now(), isDefault: isFirstAddress };

        if (isFirstAddress) {
          updatedAddresses.forEach((address) => (address.isDefault = false));
        }

        updatedAddresses.push(newAddress);
      } else if (formMode === "edit") {
        // Editing an existing address
        updatedAddresses = updatedAddresses.map((address) =>
          address.id === currentEditAddress.id
            ? { ...address, ...formData }
            : address
        );
      }

      await updateDoc(userRef, { addresses: updatedAddresses });
      setSavedAddresses(updatedAddresses);

      // Update selected address if edited address is the default
      if (formMode === "edit" && currentEditAddress.isDefault) {
        setSelectedAddress(
          updatedAddresses.find(
            (address) => address.id === currentEditAddress.id
          )
        );
      }

      setIsPopupVisible(false);
      resetForm();

      alert(
        formMode === "add"
          ? "Address added successfully!"
          : "Address updated successfully!"
      );
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!user) return navigate("/login");

    try {
      const updatedAddresses = savedAddresses.filter(
        (address) => address.id !== addressId
      );

      // If the deleted address was the default address, reset the default
      if (selectedAddress?.id === addressId) {
        const newDefault =
          updatedAddresses.length > 0 ? updatedAddresses[0] : null;
        if (newDefault) newDefault.isDefault = true;
        setSelectedAddress(newDefault);
      }

      setSavedAddresses(updatedAddresses);

      await updateDoc(doc(db, "users", user.uid), {
        addresses: updatedAddresses,
      });
      alert("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address. Please try again.");
    }
  };


  const handleMakeDefault = async (id) => {
    const updatedAddresses = savedAddresses.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));
  
    try {
      await updateDoc(doc(db, "users", user.uid), {
        addresses: updatedAddresses,
        defaultAddressId: id, // Save the default address ID separately
      });
  
      // Update local state
      setSavedAddresses(updatedAddresses);
  
      // Set the default address as selected
      const defaultAddress = updatedAddresses.find((address) => address.isDefault);
      setSelectedAddress(defaultAddress);
  
      console.log("Default address updated:", defaultAddress);
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };



  
  const resetForm = () => {
    setFormData(initialFormData());
    setCurrentEditAddress(null);
    setIsPopupVisible(false);
  };

  const handlePopupOpen = (mode, address = null) => {
    setFormMode(mode);
    setCurrentEditAddress(address);
    setFormData(address || initialFormData());
    setIsPopupVisible(true);
  };

  return (
    <div className="Delivery-container">
      <div className="Addres-container-box" onClick={() => handlePopupOpen("add")}>

        <p><FaPlus  className="icon-container"/></p>
        <button  className="address-btn">
          Add a New Address

        </button>
      </div>

      {savedAddresses
        .sort((a, b) => (b.isDefault ? 1 : -1)) 
        .map((address, index) => (
          <div
            key={address.id}
            className={`saved-container-box ${
              address.isDefault ? "default" : ""
            }`}
          >
            <p className="firstname">
              <strong>{address.firstName}</strong>
              <br />
              {address.lastName} | {address.addressLine1},{" "}
              {address.addressLine2}, {address.state}, {address.country},{" "}
              {address.pincode}
              <br />
              Phone Number: {address.mobilenumber}
            </p>
            <div className="edit-container">
              {index === 0 && address.isDefault ? (
                <>
                  <button disabled>
                    Default Address<span className="sym">|</span>
                  </button>
                  <button onClick={() => handlePopupOpen("edit", address)}>
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleMakeDefault(address.id)}>
                    Make Default<span className="sym">|</span>
                  </button>
                  <button onClick={() => handlePopupOpen("edit", address)}>
                    Edit<span className="sym">|</span>
                  </button>
                  <button onClick={() => handleDeleteAddress(address.id)}>
                    Delete<span className="sym"></span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

      {isPopupVisible && (
        <div className="popup">
          <h2>{formMode === "add" ? "Add Address" : "Edit Address"}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveAddress(formData);
            }}
          >
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={(e) =>
                setFormData({ ...formData, addressLine1: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={formData.addressLine2}
              onChange={(e) =>
                setFormData({ ...formData, addressLine2: e.target.value })
              }
            />
               <input
              type="number"
              placeholder="Phone Number"
              value={formData.mobilenumber}
              onChange={(e) =>
                setFormData({ ...formData, mobilenumber: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={(e) =>
                setFormData({ ...formData, pincode: e.target.value })
              }
              required
            />
         
            <button type="submit">
              {formMode === "add" ? "Add Address" : "Save Changes"}
            </button>
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const initialFormData = () => ({
  firstName: "",
  lastName: "",
  mobilenumber: "",
  addressLine1: "",
  addressLine2: "",
  state: "",
  country: "",
  pincode: "",
});

export default Delivery;
