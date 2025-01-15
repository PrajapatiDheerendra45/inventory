import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formResponse, setFormResponse] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/v1/formEmailRoute/sendEmail",
        formData
      );
      if (response.data.success) {
        alert(response.data.message);
      }

      setFormResponse({ success: true, message: response.data.message });
      setFormData({ name: "", email: "", message: "" }); // Clear the form after submission
    } catch (error) {
      setFormResponse({
        success: false,
        message: error.response.data.message || "Error submitting form",
      });
    }
  };

  return (
    <section
      className="py-20 bg-gradient-to-b from-white to-gray-100"
      id="contacts"
    >
      <motion.div
        className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="mb-16 text-center" variants={itemVariants}>
          <h3 className="mt-2 text-4xl font-bold leading-8 tracking-tight text-gray-700 sm:text-5xl">
            Get in Touch with us
          </h3>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500">
            We're here to help! Reach out to us for any questions or support.
          </p>
        </motion.div>

        <div className="grid items-start grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            className="overflow-hidden bg-white rounded-lg shadow-lg"
            variants={itemVariants}
          >
            <div className="p-6">
              <h4 className="mb-6 text-3xl font-bold text-gray-700">
                Contact Information
              </h4>
              <ul className="space-y-6">
                <motion.li
                  className="flex items-center"
                  whileHover={{ scale: 1.05, originX: 0 }}
                >
                  <div className="bg-[#C41E3A] rounded-full p-3 mr-4">
                    <FaEnvelope className="text-xl text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-semibold text-gray-800">
                      manasvitect01@email.com
                    </p>
                  </div>
                </motion.li>
                <motion.li
                  className="flex items-center"
                  whileHover={{ scale: 1.05, originX: 0 }}
                >
                  <div className="bg-[#C41E3A] rounded-full p-3 mr-4">
                    <FaPhone className="text-xl text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-lg font-semibold text-gray-800">
                      +91-8319955741
                    </p>
                  </div>
                </motion.li>
                <motion.li
                  className="flex items-start"
                  whileHover={{ scale: 1.05, originX: 0 }}
                >
                  <div className="bg-[#C41E3A] rounded-full p-3 mr-4 mt-1">
                    <FaMapMarkerAlt className="text-xl text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-lg font-semibold text-gray-800">
                      Corporate Office : 111B,80 Feet Road, Old Ashoka Garden
                      Bhopal
                    </p>
                  </div>
                </motion.li>
              </ul>
            </div>
            <div className="bg-[#FFFFFF] p-6">
              <h5 className="mb-2 text-lg font-semibold text-gray-900">
                Our Business Hours
              </h5>
              <p className="text-gray-700 opacity-80">
                Monday - Friday: 9am to 5pm
              </p>
              <p className="text-gray-700 opacity-80">Saturday: 10am to 2pm</p>
              <p className="text-gray-700 opacity-80">Last Saturday: Closed</p>
              <p className="text-gray-700 opacity-80">Sunday: Closed</p>
            </div>
          </motion.div>

          <motion.div
            className="overflow-hidden bg-white rounded-lg shadow-lg"
            variants={itemVariants}
          >
            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
              <h4 className="mb-6 text-3xl font-bold text-gray-700">
                Send us a message
              </h4>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                  placeholder="Your Name"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                  placeholder="your@email.com"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <motion.textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                  placeholder="Your message here..."
                  whileFocus={{ scale: 1.02 }}
                ></motion.textarea>
              </div>
              <motion.button
                type="submit"
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#C41E3A] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C41E3A] transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>
            </form>

            {formResponse && (
              <div
                className={`mt-4 text-center ${
                  formResponse.success ? "text-green-500" : "text-red-500"
                }`}
              >
                {formResponse.message}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
      <ToastContainer />
    </section>
  );
};

export default ContactPage;
