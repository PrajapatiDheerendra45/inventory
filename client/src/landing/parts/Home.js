import React, { useState } from "react";
import { FaClipboardList, FaClock, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import Image3 from "../assets/image3.png";
import DemoForm from "../DemoForm";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showDemoModal, setShowDemoModal] = useState(false); // state for modal
  const navigate = useNavigate();
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
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const openDemoModal = () => {
    setShowDemoModal(true);
  };
  const itemVariants1 = {
    hidden: { y: '-100vw', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 30,
        duration: 3, // 1-second slide-in
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 3 }, // 1-second fade-out
    },
  };
  return (
    <header
      className="w-full min-h-screen bg-[#C41E3A] gap-y-4 text-white flex items-center"
      id="home"
    >
      <motion.div
        className="flex flex-col items-center px-4 py-[6rem] mx-auto max-w-7xl sm:px-6 lg:px-8 md:flex-row"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col gap-5 pr-8 mb-8md:w-1/2 md:mb-0 md:gap-y-8" // Added `pr-8` for right padding
          variants={itemVariants}
        >
          <motion.h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 60,
              duration: 5,
            }}
          >
            We make Inventory Tracking easy for you
          </motion.h1>
          <ul className="mb-6">
            <motion.li
              className="flex items-center mb-2 md:text-lg"
              variants={itemVariants}
            >
              <FaClipboardList className="mr-2" />
              Real-Time Inventory Tracking and Updates
            </motion.li>
            <motion.li
              className="flex items-center mb-2 md:text-lg"
              variants={itemVariants}
            >
              <FaClock className="mr-2" />
              Automate Stock Management to Save Time
            </motion.li>
            <motion.li
              className="flex items-center md:text-lg"
              variants={itemVariants}
            >
              <FaChartLine className="mr-2" />
              Optimize Inventory Levels for Better Cash Flow
            </motion.li>
          </ul>
          <div className="flex flex-col gap-4 sm:flex-row">
            <motion.button
              className="px-6 py-3 bg-white text-[#C41E3A] rounded-md font-semibold hover:bg-gray-100 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openDemoModal}
            >
              Schedule a Demo
            </motion.button>
            <motion.button
              className="px-6 py-3 bg-[#FFD700] text-gray-800 rounded-md font-semibold hover:bg-yellow-400 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              onClick={() => navigate("/registration")}
            >
              Start 7-day free trial
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="md:w-1/2"
          variants={itemVariants1}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ delay: 5 }} // Delays exit for 5 seconds
        >
          <motion.img
            src={Image3}
            alt="Inventory Management"
            className="w-full h-auto"
            whileHover={{ scale: 1.5 }} // Slight scale effect on hover
            transition={{ duration: 1 }}
          />
        </motion.div>
      </motion.div>
      {showDemoModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DemoForm />
        </motion.div>
      )}
    </header>
  );
};

export default Home;
