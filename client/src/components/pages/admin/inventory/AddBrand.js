import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/Auth";
const AddBrand = () => {
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    BrandName: "",
    manufacturerName: "",
  });

  const [manufacturer, setManufacturer] = useState([]);

  // Fetch the manufacturer data from the backend
  const fetchManufacturer = async () => {
    try {
      const response = await axios.get(
        `/api/v1/auth/ManageManufacturer/${userId}`
      );
      setManufacturer(response.data.data); // Save the manufacturer data to state
    
    } catch (error) {
      console.error("Error fetching Manufacturer data", error);
    }
  };

  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }
    fetchManufacturer();
  }, [auth, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["BrandName", "manufacturerName"];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`);
        return;
      }
    }

    try {
       const updatedFormData = { ...formData, userId };
      const response = await axios.post("/api/v1/auth/createBrand", updatedFormData);

      if (response) {
        toast.success("Brand Added Successfully...");
      }

      clearData();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add brand.");
    }
  };

  const clearData = () => {
    setFormData({
      BrandName: "",
      manufacturerName: "", // Clear the selected manufacturer as well
    });
  };

  return (
    <div className="responsive-container">
      <form className="mx-auto p-8 border border-gray-300 shadow-lg rounded-lg">
        <h4 className="text-3xl font-semibold mb-8 text-center underline mb-6 text-violet-800">
          Add Brand
        </h4>

        <div className="px-2  ">
          <label className="block ">
            Manufacturer Name: <br />
          </label>
          <br />
          <select
            name="manufacturerName"
            value={formData.manufacturerName}
            onChange={handleChange}
            className="w-1/2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-600"
          >
            <option value="">Select Manufacturer</option>
            {manufacturer?.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="px-2   ">
          <label className="block mt-2">Brand Name:</label>
          <br />
          <input
            type="text"
            name="BrandName"
            value={formData.BrandName}
            onChange={handleChange}
            className="w-1/2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-600"
          />
        </div>

        <div className="flex justify-between mt-8 px-2">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-violet-600"
          >
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddBrand;
