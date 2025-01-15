import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/Auth";
const AddCategory = () => {
  const [auth]=useAuth();
  const [userId,setUserId]=useState("")
     
  const [formData, setFormData] = useState({
    CategoryName: "",

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  useEffect(()=>{
    if(auth.user.role===1){
      setUserId(auth.user._id)
    
    }
    if(auth.user.role===0){
      setUserId(auth.user.admin)
     
    }
  },[])
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "CategoryName",
  
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`);
        return;
      }
    }

    try {
      const updatedFormData = { ...formData, userId };
      
      const response = await axios.post(
        "/api/v1/auth/createcategory",
        updatedFormData
      );

      if (response) {
        toast.success(" Category Added  Successfully...");
      }

      clearData();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const clearData = () => {
    setFormData({
      CategoryName: "",
    });
  };
  return (
    <div className="responsive-container">
      <form className=" mx-auto  p-8 border border-gray-300 shadow-lg rounded-lg">
        <h4 className="text-3xl font-semibold mb-8 text-center underline mb-6 text-violet-800">
          Add Categories
        </h4>
        <div className="px-2 flex gap-5">
          <label className="block mb-2 text-lg ">Category Name :</label>
          <input
            type="text"
            name="CategoryName"
            value={formData.CategoryName}
            onChange={handleChange}
            className=" w-1/2 border border-gray-300 py-2  rounded-md focus:ring-2 focus:ring-violet-600"
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

export default AddCategory;
