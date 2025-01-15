import React, { useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../loader/LoaderHand"; 

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); 
   
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/v1/auth/forget', { email });
      if (response.data.success) {
        toast.success(response.data.message);
        setEmail('');
        setTimeout(() => {
          navigate('/resetPassword');
        }, 3000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className=" min-h-screen flex justify-center items-center font-montserrat px-4">
      {loading ? (
        <Loader />
      ) : (
        <div className="p-6 shadow-lg rounded-lg bg-white w-full max-w-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {/* Logo and title */}
          <div className="text-center mb-6">
            <div className="logo rounded-full w-16 h-16 mx-auto bg-blue-500 text-white flex justify-center items-center">
              <FaUserAlt className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold mt-4 text-white">Forgot Password</h2>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaUserAlt className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                type="button"
                className="py-3 px-4 rounded-md bg-gradient-to-r from-red-400 to-blue-500 hover:from-teal-500 hover:to-orange-500"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-3 px-4 rounded-md bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
