import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/Auth";
const AddSubCategory = () => {
    const [auth] = useAuth();
    const [userId, setUserId] = useState("");
     
  const [formData, setFormData] = useState({
    CategoryName: "",
    subCategoryName: "",
  });
  const [categories, setCategories] = useState([]);


  
  useEffect(() => {
    if (auth.user.role === 1) {
      setUserId(auth.user._id);
    }
    if (auth.user.role === 0) {
      setUserId(auth.user.admin);
    }
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/getcategory/${userId}`);
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

    const requiredFields = ["CategoryName", "subCategoryName"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`);
        return;
      }
    }

    try {
        const updatedFormData = { ...formData, userId };
      const response = await axios.post(
        "/api/v1/auth/createSubCategory",
        updatedFormData
      );

      if (response) {
        toast.success("Sub Category Added Successfully...");
      }

      clearData();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add subcategory. Please try again.");
    }
  };

  const clearData = () => {
    setFormData({
      CategoryName: "",
      subCategoryName: "",
    });
  };

  return (
    <div className="responsive-container">
      <form
        className="mx-auto p-8 border border-gray-300 shadow-lg rounded-lg"
        onSubmit={handleSubmit}
      >
        <h4 className="text-3xl font-semibold text-center underline mb-6 text-violet-800">
          Add Sub Categories
        </h4>

        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-4">
            <label className="w-1/4">Category Name:</label>
            <select
              name="CategoryName"
              value={formData.CategoryName}
              onChange={handleChange}
              className="w-1/2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-600"
            >
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option key={category.CategoryName} value={category.CategoryName}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4">Sub Category Name:</label>
            <input
              type="text"
              name="subCategoryName"
              value={formData.subCategoryName}
              onChange={handleChange}
              className="w-1/2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-600"
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
