import React, { useState, useEffect } from "react";
import axios from "axios";
import { Country, State } from "country-state-city";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/Auth.js";
const CreateSupplier = () => {
  const [countries, setCountries] = useState([]);
  const [userId,setUserId]=useState("")
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [auth]=useAuth();
  const [formData, setFormData] = useState({
   
    name: "",
    address: "",
    state: "",
    country: "",
    pinCode: "",
    contact: "",
    email: "",
    website: "",
    bankName: "",
    bankAddress: "",
    ifscCode: "",
    accountHolderName: "",
    accountNumber: "",
    registrationType: "",
    gstin: "",
    openingBalance: "",
  });

  useEffect(() => {
    if(auth.user.role===1){
      setUserId(auth.user._id)
    
    }
    if(auth.user.role===0){
      setUserId(auth.user.admin)
     
    }
  
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
    }
  }, [selectedCountry]);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);

    const country = countries.find((c) => c.isoCode === countryCode);
    setFormData({ ...formData, country: country ? country.name : "" });
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);

    const state = states.find((s) => s.isoCode === stateCode);
    setFormData({ ...formData, state: state ? state.name : "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = { ...formData, userId };

     const response =  await axios.post("/api/v1/auth/CreateSupplier", updatedFormData);

    
      toast.success("Supplier added successfully!");
      handleClear();
    } catch (error) {
      console.error("Error adding supplier:", error.response);
      toast.error(error.response.data.message);
      toast.error(error.response.data.details);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      address: "",
      state: "",
      country: "",
      pinCode: "",
      contact: "",
      email: "",
      website: "",
      bankName: "",
      bankAddress: "",
      ifscCode: "",
      accountHolderName: "",
      accountNumber: "",
      registrationType: "",
      gstin: "",
      openingBalance: "",
    });
    setSelectedCountry("");
    setSelectedState("");
  };

  return (
    <div className="responsive-container px-4 py-1 max-w-7xl">
      <form
        onSubmit={handleSubmit}
        className="mx-auto p-8 border border-gray-300 shadow-lg rounded-lg bg-white"
      >
        <h1 className="font-bold mb-4 text-center text-gray-700 text-3xl underline">
          Add Supplier
        </h1>

        {/* Supplier Details */}
        <div className="mb-6">
          <h3 className="text-gray-800 font-semibold mb-2">
            Supplier Details :
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <input
              name="name"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <textarea
              name="address"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              rows={1}
              cols={20}
            />
            <select
              name="country"
              className="p-2 border border-gray-300 rounded"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            <select
              name="state"
              className="p-2 border border-gray-300 rounded"
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            <input
              name="pinCode"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Pin Code"
              value={formData.pinCode}
              onChange={handleChange}
            />
            <input
              name="contact"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Contact"
              value={formData.contact}
              onChange={handleChange}
            />
            <input
              name="email"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="website"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Banking Details */}
        <div className="mb-6">
          <h3 className="text-gray-800 font-semibold mb-2">
            Banking Details :
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <input
              name="bankName"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Bank Name"
              value={formData.bankName}
              onChange={handleChange}
            />
            <input
              name="bankAddress"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Bank Address"
              value={formData.bankAddress}
              onChange={handleChange}
            />
            <input
              name="ifscCode"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="IFSC Code"
              value={formData.ifscCode}
              onChange={handleChange}
            />
            <input
              name="accountHolderName"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Account Holder Name"
              value={formData.accountHolderName}
              onChange={handleChange}
            />
            <input
              name="accountNumber"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Account Number"
              value={formData.accountNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Statutory Details */}
        <div className="mb-6">
          <h3 className="text-gray-800 font-semibold mb-2">
            Statutory Details :
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <select
              name="registrationType"
              className="p-2 border border-gray-300 rounded"
              value={formData.registrationType}
              onChange={handleChange}
            >
              <option value="">Registration Type</option>
              <option value="Composition">Composition</option>
              <option value="Regular">Regular</option>
            </select>
            <input
              name="gstin"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="GSTIN"
              value={formData.gstin}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Opening Balance */}
        <div className="mb-6">
          <h3 className="text-gray-800 font-semibold mb-2">
            Opening Balance :
          </h3>
          <div className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <input
              name="openingBalance"
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Opening Balance"
              value={formData.openingBalance}
              onChange={handleChange}
            />
             <input type="date"/>
          </div>
        
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Create
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-300"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateSupplier;
