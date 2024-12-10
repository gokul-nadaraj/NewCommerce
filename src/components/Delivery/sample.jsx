{/* <div className="Delivery-container">
<div className="Addres-container-box" onClick={() => handlePopupOpen("add")}>
    <p>
    <FaPlus className="plus-icon" />
    </p>
<button >Add a New Address</button>

</div>


{savedAddresses.map((address) => (
        <div key={address.id} className={`saved-conatiner-box ${address.isDefault ? "default" : ""}`}>
          <p className="firstname"><strong>{address.firstName} </strong>
            <br/>
             {address.lastName} |
      
         {address.addressLine1},{address.addressLine2}, {address.state}, {address.country} , {address.pincode}
<br />
     Phone Number:{address.mobilenumber}

         </p>
          <div className="edit-conatiner">
          <button onClick={() => handleMakeDefault(address.id)}>Make Default</button>
          <button onClick={() => handlePopupOpen("edit", address)}>Edit</button>
          <button onClick={() => handleDeleteAddress(address.id)}>Delete</button>
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
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
               <input
              type="text"
              placeholder="MobileNumber"
              value={formData.mobilenumber}
              onChange={(e) => setFormData({ ...formData, mobilenumber: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              required
            />
            <button type="submit">{formMode === "add" ? "Add Address" : "Save Changes"}</button>
            <button type="button" onClick={resetForm}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

const initialFormData = () => ({
  firstName: "",
  lastName: "",
  mobilenumber :"",
  addressLine1: "",
  addressLine2: "",
  state: "",
  country: "",
  pincode: "",
});

export default Delivery; */}
