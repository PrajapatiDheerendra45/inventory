import React, { useEffect, useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify
import Loader from "../loader/LoaderHand.js"; // Import the Loader component
import { useAuth } from "../context/Auth.js";
import { Cancel } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const [dauth] = useAuth();


  useEffect(() => {
  
    if (dauth?.user?.role === 1 && dauth?.user?.status === "Active") {

      navigate("/admin");
    }
    if (dauth?.user?.role === 1 && dauth?.user?.status === "Inactive") {
      navigate("/checkout");
    }
    if (dauth?.user?.role === 2) {
      if (dauth.AccessToken) {
        navigate("/superadmin");
      }
    }
    
    if (dauth?.user?.role === 0) {
      if (dauth.AccessToken) {
        navigate("/staff");
      }
    }
  }, [dauth, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post("/api/v1/auth/login", formData);
      if (response.data.success) {
        setAuth({
          ...auth,
          user: response.data.user,
          AccessToken: response.data.AccessToken,
        });
        sessionStorage.setItem("dauth", JSON.stringify(response.data));
        
        // Check the user's role
        if (response.data.user.role === 1) {
          // Role is 1, so we hit the company API
          try {
            const companyResponse = await axios.get(`/api/v1/company/get/${response.data.user._id}`);           
            if (companyResponse.data.success) {
              toast.success(response.data.message);
              setAuth({
                ...auth,
                user: response.data.user,
                AccessToken: response.data.AccessToken,
              });
              sessionStorage.setItem("dauth", JSON.stringify(response.data));
              
              if (response.data.user.status === "Inactive") {
                navigate("/checkout");
              } else if (response.data.user.status === "Active") {
                navigate("/admin");
              }
            } else {

              navigate("/companyregistration");
            }
          } catch (error) {
            if (error.response && error.response.status === 404) {
              navigate("/CompanyRegistration");
              return;
            } else {
              console.error("Error fetching company data:", error);
            }
          }
        } else {
          // Role is not 1, so handle navigation for staff or superadmin
          if (response.data.user.role === 0) {
            navigate("/staff");
          } else if (response.data.user.role === 2) {
            navigate("/superadmin");
          }
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error during login:", error);
      if (error.response) {
        toast.error(`Server error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        toast.error("Network error: No response from the server. Please check your connection.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  
  //   try {
  //     // Attempt to log in
  //     const response = await axios.post("/api/v1/auth/login", formData);
  //     console.log(response, "res");
  
  //     if (response.data.success) {
  //       // If login is successful, check the next API
  //       const companyResponse = await axios.get(`/api/v1/company/get/${response.data.user._id}`); // Replace with the appropriate ID
  //       console.log(companyResponse, "companyRes");
  
  //       if (companyResponse.data.success) {
  //         // If the company response is successful, proceed with the login
  //         toast.success(companyResponse.data.message);
  //         setAuth({
  //           ...auth,
  //           user: response.data.user,
  //           AccessToken: response.data.AccessToken,
  //         });
  
  //         sessionStorage.setItem("dauth", JSON.stringify(response.data));
  
  //         // Navigate based on user role
  //         if (response.data.user.role === 0) {
  //           navigate("/staff");
  //         } else if (response.data.user.role === 1) {
  //           navigate(response.data.user.status === "Inactive" ? "/checkout" : "/admin");
  //         } else if (response.data.user.role === 2) {
  //           navigate("/superadmin");
  //         }
  //       } else {
  //         // This else block will no longer be reached for company not found
  //         toast.error("Company Setup is pending");
  //         navigate("/admin/companyregistration"); // Change to the desired route
  //       }
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.log("er", error);
  
  //     if (error.response) {
  //       toast.error(`Server error: ${error.response.status} - ${error.response.data.message}`);
  //     } else if (error.request) {
  //       toast.error("Network error: No response from the server. Please check your connection.");
  //     } else {
  //       toast.error(`Error: ${error.message}`);
  //     }
  //   } finally {
  //     setLoading(false); 
  //   }
  // };
  
  
  return (
    <div
      className="bg-gray-100 min-h-screen flex justify-center items-center font-montserrat px-2"
      data-aos="fade-right"
    >
      {loading ? (
        <Loader />
      ) : (
        <div
          className="p-6 shadow-lg rounded-lg bg-white w-full max-w-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          data-aos="fade-up"
          data-aos-duration="3000"
        >
          {/* Logo and title */}
          <div
            className="text-center mb-6 "
            data-aos="zoom-in-down"
            data-aos-delay="1000"
          >
            <div className="logo rounded-full w-16 h-16 mx-auto bg-blue-500 text-white flex justify-center items-center">
              <FaUserAlt className="text-3xl" />
            </div>
            <h2
              className="text-2xl font-bold mt-4"
              data-aos="zoom-in-down"
              data-aos-delay="300"
            >
              Login
            </h2>
          </div>
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 "
            data-aos="zoom-in-up"
          >
            <div className="relative">
              <FaUserAlt className="absolute left-3 top-3 text-gray-500" />
              <input
                data-aos="zoom-in-down"
                data-aos-delay="800"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-500" />
              <input
                data-aos="zoom-in-down"
                data-aos-delay="1000"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              {" "}
              {/* Flex container for buttons */}
              <button
                data-aos="zoom-out-right"
                data-aos-delay="2000"
                type="button" // Changed to type="button" for Cancel
                className="py-3 text-center px-4 rounded-md bg-gradient-to-r from-red-400 to-blue-500 hover:from-teal-500 hover:to-orange-500"
                onClick={() => navigate(-1)} // Navigate to another page on Cancel
              >
                Cancel
              </button>
              <button
                data-aos="zoom-out-left"
                data-aos-delay="2000"
                type="submit"
                className="py-3 text-center px-4 rounded-md bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500"
                disabled={loading} // Disable button while loading
              >
                Login
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm ">
              Don't have an account?{" "}
              <Link
                to="/registration"
                className="text-yellow-500 font-mono hover:underline"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              <Link
                to="/forgetpassword"
                className="text-yellow-500 font-light hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Login;
