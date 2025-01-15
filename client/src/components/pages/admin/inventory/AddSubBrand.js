import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/Auth";
const AddSubCategory = () => {
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    BrandName: "",
    SubBrandName: "",
    manufacturerName: ""
  });
  const [categories, setCategories] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);

  // Fetch the manufacturer data from the backend
  const fetchManufacturer = async () => {
    try {
      const response = await axios.get(`/api/v1/auth/ManageManufacturer/${userId}`);
      console.log(response.data.data, "Fetched Manufacturer Data"); // Debug log to check data
      setManufacturer(response.data.data); // Save the manufacturer data to state
    } catch (error) {
      console.error("Error fetching Manufacturer data", error);
      toast.error("Failed to fetch manufacturer data. Please try again.");
    }
  };

  useEffect(() => {
     if (auth.user.role === 1) {
       setUserId(auth.user._id);
     }
     if (auth.user.role === 0) {
       setUserId(auth.user.admin);
     }
    // Fetch Manufacturer data on component mount
    fetchManufacturer();

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/getBrand/${userId}`);
        console.log(response.data.data, "Fetched Brand Data"); // Debug log to check data
        setCategories(response.data.data); 
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, [auth,userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["BrandName", "SubBrandName", "manufacturerName"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`);
        return;
      }
    }

    try {   const updatedFormData = { ...formData, userId };
      const response = await axios.post("/api/v1/auth/createSubBrand", updatedFormData);
    
       
      if (response) {
        toast.success("Sub Brand Category Added Successfully...");
      }

      clearData();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add subBrandcategory. Please try again.");
    }
  };

  const clearData = () => {
    setFormData({
      BrandName: "",
      SubBrandName: "",
      manufacturerName: ""
    });
  };

  return (
    <div className="responsive-container">
      <form
        className="mx-auto p-8 border border-gray-300 shadow-lg rounded-lg"
        onSubmit={handleSubmit}
      >
        <h4 className="text-3xl font-semibold text-center underline mb-6 text-violet-800">
          Add Sub Brand
        </h4>

        <div className="flex flex-col gap-4 mb-4">
          {/* Manufacturer Dropdown */}
          <div className="px-2">
            <label className="block">Manufacturer Name: <br /></label>
            <br />
            <select
              name="manufacturerName"
              value={formData.manufacturerName}
              onChange={handleChange}
              className="w-1/2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-600"
            >
              <option value="">Select Manufacturer</option>
              {manufacturer?.length > 0 ? (
                manufacturer?.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))
              ) : (
                <option disabled>No Manufacturer Found</option>
              )}
            </select>
          </div>

          {/* Brand Dropdown */}
          <div className=" px-2">
            <label className="block">Brand Name:</label>
            <select
              name="BrandName"
              value={formData.BrandName}
              onChange={handleChange}
              className="w-1/2 border py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-violet-600"
            >
              <option value="">Select Brand</option>
              {categories?.map((category) => (
                <option key={category.BrandName} value={category.BrandName}>
                  {category.BrandName}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Brand Name Input */}
          <div className=" px-2">
            <label className="block">Sub Brand Name:</label>
            <input
              type="text"
              name="SubBrandName"
              value={formData.SubBrandName}
              onChange={handleChange}
              className="w-1/2 border py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-violet-600"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="submit"
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

export default AddSubCategory;
