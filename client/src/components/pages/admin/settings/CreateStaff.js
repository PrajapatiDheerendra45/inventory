import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir",
];

const initialFormData = {
  name: "", contact: "", address: "", pincode: "", state: "", fatherName: "",
  email: "", password: ""
};

const CreateStaff = () => {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "name", "contact", "address", "pincode", "state", "fatherName", "email", "password"
    ];

    // Validate required fields
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please enter ${field}.`);
        return;
      }
    }

    try {
      // Send the form data as a JSON object (not FormData)
      const response = await axios.post("/api/v1/auth/add-staff", formData, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        clearData();
      }

      if (!response.data.success) {
        toast.error(response.data.message);
       
      }
 
 
     
    } catch (error) {
    
      toast.error(`There was an error creating the staff: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const clearData = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="responsive-container px-4 py-1">
      <form
        className="mx-auto p-8 border border-gray-300 shadow-lg rounded-lg bg-white"
        onSubmit={handleSubmit}
      >
        <h4 className="text-3xl font-semibold mb-4 text-center underline mb-6 text-violet-800">
          Add Staff
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block mb-2 font-bold">
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 font-bold rounded-md focus:ring-2 focus:ring-violet-600"
            />
          </label>

          <label className="block mb-2 font-bold">
            Contact
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 font-bold rounded-md focus:ring-2 focus:ring-violet-600"
            />
          </label>

          <label className="block mb-2 font-bold">
            Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 font-bold rounded-md focus:ring-2 focus:ring-violet-600"
            />
          </label>

          <label className="block mb-2 font-bold">
            Pin code
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 font-bold rounded-md focus:ring-2 focus:ring-violet-600"
            />
          </label>

          <label className="block mb-2 font-bold">
            State
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 font-bold rounded-md focus:ring-2 focus:ring-violet-600"
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-2 font-bold">
            Father Name
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 font-bold rounded-md focus:ring-2 focus:ring-violet-600"
            />
          </label>

          <label className="block mb-2 font-bold">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 font-bold rounded-md focus:ring-2 focus:ring-violet-600"
            />
          </label>

          <label className="block mb-2 font-bold">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 font-bold rounded-md focus:ring-2 focus:ring-violet-600"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700"
        >
          Submit
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default CreateStaff;
